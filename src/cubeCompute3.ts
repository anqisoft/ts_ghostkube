/* Copyright (c) 2024 anqisoft@gmail.com
  src\cubeCompute3.ts v0.0.1
  deno 1.42.1 + VSCode 1.88.0

 <en_us>
  Created on Fri Apr 19 2024 08:39:55
  Feature:
  </en_us>

  <zh_cn>
  创建：2024年4月19日 08:39:55
  功能：计算中间正方体清单、最终正方体清单。
  同一种纸模，有不同的折叠与粘贴方案。每种方案，各有24种不同角度。

  方案：正方体六个面分别以哪些面为最外面（部分面需要将两个不同方向的面粘贴到一起才行，这样的两个面有先后顺序；部分面仅需要单个面即可，这取决于这些面所连接的面是否超过一个，只有一个则需要两个不同方向的面粘贴形成一个面，超过一个则不需要）。

  注意：有些面一旦里面还有别的面，会导致部分相关面也必须靠外、部分面被隐藏。
  由于上述计算过程中，暂时忽略格与格之间的互相影响（比如某些面放到上面后，一些关联面的层也会上移，而另一些关联面则会被自动隐藏。因此，会产生一些不符合实际物理规律的正方体，需移除

  TODO(@anqi) 移除错误正方体

  缺陷：部分正方体没能得到，比如三行五列，第三行逐列分离（仅与上格相连）的情况
  </zh_cn>

  <zh_tw>
  創建：2024年4月19日 08:39:55
  功能：
  </zh_tw>
*/

import {
	ANGLE_COUNT,
	AppendSiblingsOptions,
	CellAppendInfoManner,
	CellBorderLine,
	CellBorderPosition,
	CellFeature,
	CellObject,
	COL_INDEX_ARRAY_MORE_THAN_THREE_ROW,
	ConnectionRelation,
	convertSixFaceAndDirectionToSixFaceTwentyFourAngle,
	convertSixFaceTwentyFourAngleToSixFaceAndDirection,
	Cube,
	FaceMemberOfSixFace,
	// CUBES,
	FourDirection,
	FourDirectionCount,
	FourDirectionMaxIndex,
	getSixFaceTwentyFourAngleRelationTwelveEdge,
	global_removed_middle_cube_count,
	log,
	logUsedTime,
	NewAppendSiblingsOptions,
	OneCellRowColIndex,
	OneOfTwelveEdges,
	OneOrTwoCellRowColIndex,
	showCubeCoreInfo,
	showSimpleCubeCoreInfo,
	showUsedTime,
	SiblingsAppendInfo,
	SiblingsAppendInfoArray,
	SimpleCell,
	SimpleCube,
	SIX_FACE_AND_DIRECTION_RELATIONS,
	SixFace,
	SixFaceCount,
	SixFaceMaxIndex,
	SixFaces,
	// SixFaces,
	SixFaceTwentyFourAngle,
	TwelveEdge,
	TwelveEdges,
} from './cubeCore.ts';

log(`begin: ${(new Date()).toLocaleString()}`);
const DATE_BEGIN = performance.now();

/* only 2 rows:
removed middle cube count:  614
CUT_MANNER_ARRAY.length:    117
CUT_MANNER_COUNT_ARRAY:     [117,0,0,0,0,0]
MIDDLE_CUBE_ARRAY.length:   261
MANNER_ARRAY.length:        5126
CUBES.length:               27024÷24→1126
*/

// const COL_INDEX_ARRAY =
// [
// [2, 3, 4],
// [1, 3, 4],
// [1, 2, 4],
// [1, 2, 3],
// [2, 3, 4],
// [0, 3, 4],
// [0, 2, 4],
// [0, 2, 3],
// [1, 3, 4],
// [0, 3, 4],
// [0, 1, 4],
// [0, 1, 3],
// [1, 2, 4],
// [0, 2, 4],
// [0, 1, 4],
// [0, 1, 2],
// [1, 2, 3],
// [0, 2, 3],
// [0, 1, 3],
// [0, 1, 2],
// ]
// ;

const DEBUG = {
	// false true
	// OUTPUT_MIDDLE_FILE: true, // removed

	// SHOW_SIX_FACE_AND_DIRECTION_RELATIONS: false,

	SHOW_FAILED_BECAUSE_CORE_ROW_INDEX_ARRAY_NOT_INCLUDE_COL_INDEX: false,
	SHOW_FAILED_RELATION_CELL_INFO: false,
	//   SHOW_CELL_TO_STRING: false,

	SHOW_CUT_MANNERS: true,
	//   FIX_PREVIOUS_NO_ARRAY: false,

	DISABLE_PUSH_MIDDLE_CUBE_ARRAY: false,
	// CUBE_COUNT_PER_MANNER: JSON.stringify(ROW_COUNT_ARRAY) === "[2]" ? 100000 : 5, // 5, 10, 20

	SHOW_MANNER_CUBE_COUNT_ARRAY: false,
	SHOW_MANNER_ARRAY: false,

	SHOW_CALL_COUNT_AND_PUSH_IF_OK: false,
	SHOW_ADD_NEXT_GROUP_DETAILS: false,

	SHOW_MIDDLE_CUBE_CONVERT_INFO: false,

	LIMIT_ONLY_FIRST_MIDDLE_CUBE: false,
	ONE_TO_TWENTYFOUR_EXTEND_TIMES: Math.min(ANGLE_COUNT, 24),
	// ONE_TO_TWENTYFOUR_EXTEND_TIMES: Math.min(ANGLE_COUNT, 1),

	// LIMIT_ONLY_FIRST_MIDDLE_CUBE: true,
	// ONE_TO_TWENTYFOUR_EXTEND_TIMES: Math.min(ANGLE_COUNT, 1),

	CUBE_LIMIT_COUNT: 0,
};
//  同一方案24个角度
const MANNER_COUNT = DEBUG.ONE_TO_TWENTYFOUR_EXTEND_TIMES;

const { floor } = Math;

const APPEND_FLAG = { append: true };
const ARRAY_BEGIN_FLAG = '[\n';
const ARRAY_END_FLAG = '\n]';

const COL_COUNT = 5;
const MAX_COL_INDEX = COL_COUNT - 1;

const CUBES: Cube[] = [];

const MIDDLE_CUBE_ARRAY: Cube[] = [];
const MIDDLE_CUBE_COUNT_ARRAY: number[] = [0, 0, 0, 0, 0, 0];

const CUT_MANNER_COUNT_ARRAY: number[] = [0, 0, 0, 0, 0, 0];
const CUT_MANNER_ARRAY: string[] = [];

const SIMPLE_MANNER_ARRAY: string[] = [];
const SIMPLE_DATA_ARRAY: {
	manner: string;
	cube: Cube;
}[] = [];

let totalCubeCount = 0;
let totalMiddleCubeCount = 0;

let callTimes = 0;

// { totalCubeCount: 102854, totalMiddleCubeCount: 1244123 }
// { totalCubeCount: 102854, totalMiddleCubeCount: 1541450 }
// let totalCubeCount = 102854;
// let totalMiddleCubeCount = 1244123;

function countByRowCountAndColIndexArray(
	ROW_COUNT: number,
	COL_INDEX_ARRAY: number[],
) {
	let thisMiddleCubeCount = 0;
	let thisCubeCount = 0;
	const FILE_PREFIX = `${ROW_COUNT}rows_${COL_INDEX_ARRAY.length}coreCols_${
		COL_INDEX_ARRAY.join('_')
	}_`;
	const OUTPUT_LARGE_FILES = ROW_COUNT === 2 || COL_INDEX_ARRAY.length < 3;
	const MIDDLE_CUBE_BATCH_DEAL_COUNT = OUTPUT_LARGE_FILES ? 100 : 100000;
	const CUBE_COUNT_PER_MANNER = ROW_COUNT === 2 ? 100000 : 2; // : JSON.stringify(ROW_COUNT_ARRAY) === "[2]" ? 100000 : 5, // 5, 10, 20

	CUBES.length = 0;
	MIDDLE_CUBE_ARRAY.length = 0;

	const MAX_ROW_INDEX = ROW_COUNT - 1;

	const CELL_COUNT = COL_COUNT * ROW_COUNT;
	// const CELL_MAX_INDEX = CELL_COUNT - 1;
	const RECURISE_QUIT_NUMBER = CELL_COUNT + 1;

	const CORE_ROW_INDEX = ROW_COUNT <= 4 ? 1 : 2;
	const CORE_COL_INDEX = COL_INDEX_ARRAY.indexOf(2) > -1 ? 2 : COL_INDEX_ARRAY[0];

	// joined from part 2.
	let nextCubeNo = totalCubeCount;
	const MIDDLE_FILE_NAME = `${FILE_PREFIX}middle.ts`;

	const CUBE_FILE_NAME = `${FILE_PREFIX}cubes.ts`;
	// const CUBE_FILE_NAME = 'c:\\cubes.ts';

	const MANNERS_FILE_NAME = `${FILE_PREFIX}manner.ts`;
	const MANNER_CUBE_COUNT_ARRAY_FILE_NAME = `${FILE_PREFIX}mannerCubeCount.ts`;
	const MANNER_CUBE_ARRAY_FILE_NAME = `${FILE_PREFIX}mannerCube.ts`;
	const MANNER_AND_DETAIL_FILE_NAME = `${FILE_PREFIX}mannerDetails.ts`;
	const MANNER_ARRAY: string[] = [];
	const MANNER_CUBE_COUNT_ARRAY: number[] = [];
	const MANNER_CUBE_ARRAY: Cube[][] = [];

	const MANNER_CUBE_COUNT_OF_ROWS_2_ARRAY_FILE_NAME =
		`${FILE_PREFIX}mannerCubeCountOfRows2Array.ts`;
	const MANNER_CUBE_COUNT_OF_ROWS_3_ARRAY_FILE_NAME =
		`${FILE_PREFIX}mannerCubeCountOfRows3Array.ts`;
	const MANNER_CUBE_COUNT_OF_ROWS_2_ARRAY: number[] = [];
	const MANNER_CUBE_COUNT_OF_ROWS_3_ARRAY: number[] = [];

	const IS_ONLY_TWO_ROWS = ROW_COUNT === 2; // JSON.stringify(ROW_COUNT_ARRAY) === "[2]";

	showUsedTime(
		`\n${new Date().toLocaleTimeString()} ${
			(++callTimes).toString().padStart(0, 3)
		} ${FILE_PREFIX}\nbefore countMiddleCubes()`,
	);
	function countMiddleCubes() {
		// log(new Date());

		let countAndPushIfOkCallTimes = 0;
		let addNextGroupCallTimes = 0;

		let nextMiddleCubeNo = totalMiddleCubeCount;

		function getBorderLineArrays(
			cube: SimpleCube,
			rowIndex: number,
			colIndex: number,
		) {
			let topGridLine = CellBorderLine.Unknown;
			let rightGridLine = CellBorderLine.Unknown;
			let bottomGridLine = CellBorderLine.Unknown;
			let leftGridLine = CellBorderLine.Unknown;

			if (rowIndex === 0) {
				topGridLine = CellBorderLine.OuterLine;
			} else if (rowIndex === MAX_ROW_INDEX) {
				bottomGridLine = CellBorderLine.OuterLine;
			}

			if (colIndex === 0) {
				leftGridLine = CellBorderLine.OuterLine;
			} else if (colIndex === MAX_COL_INDEX) {
				rightGridLine = CellBorderLine.OuterLine;
			}

			if (topGridLine !== CellBorderLine.OuterLine) {
				const UP_CELL = cube.cells[rowIndex - 1][colIndex];
				topGridLine = UP_CELL.isUnknown
					? CellBorderLine.Unknown
					: UP_CELL.borderLines[CellBorderPosition.Bottom];
			}

			if (bottomGridLine !== CellBorderLine.OuterLine) {
				const DOWN_CELL = cube.cells[rowIndex + 1][colIndex];
				bottomGridLine = DOWN_CELL.isUnknown
					? CellBorderLine.Unknown
					: DOWN_CELL.borderLines[CellBorderPosition.Top];
			}

			if (rightGridLine !== CellBorderLine.OuterLine) {
				const RIGHT_CELL = cube.cells[rowIndex][colIndex + 1];
				rightGridLine = RIGHT_CELL.isUnknown
					? CellBorderLine.Unknown
					: RIGHT_CELL.borderLines[CellBorderPosition.Left];
			}

			if (leftGridLine !== CellBorderLine.OuterLine) {
				const LEFT_CELL = cube.cells[rowIndex][colIndex - 1];
				leftGridLine = LEFT_CELL.isUnknown
					? CellBorderLine.Unknown
					: LEFT_CELL.borderLines[CellBorderPosition.Right];
			}

			const topBorderLineArray: CellBorderLine[] = [];
			const rightBorderLineArray: CellBorderLine[] = [];
			const bottomBorderLineArray: CellBorderLine[] = [];
			const leftBorderLineArray: CellBorderLine[] = [];
			const borderLineArrayArray: CellBorderLine[][] = [
				topBorderLineArray,
				rightBorderLineArray,
				bottomBorderLineArray,
				leftBorderLineArray,
			];
			[topGridLine, rightGridLine, bottomGridLine, leftGridLine].forEach(
				(gridLineStyle, gridLineIndex) => {
					// 转为此单元格的不同状态（最多15种可能——因至少需要与另一格相连，所以不可能出现四边全部都不是内联线的情况）
					switch (gridLineStyle) {
						case CellBorderLine.Unknown:
							borderLineArrayArray[gridLineIndex].push(
								CellBorderLine.CutLine,
							);
							borderLineArrayArray[gridLineIndex].push(
								CellBorderLine.InnerLine,
							);
							break;
						case CellBorderLine.InnerLine:
						case CellBorderLine.CutLine:
						case CellBorderLine.OuterLine:
							borderLineArrayArray[gridLineIndex].push(gridLineStyle);
							break;
						default:
							break;
					}
				},
			);
			return {
				topBorderLineArray,
				rightBorderLineArray,
				bottomBorderLineArray,
				leftBorderLineArray,
			};
		}

		function getSiblingsAppendInfoArray(
			rowIndex: number,
			colIndex: number,
			TOP_BORDER_LINE: CellBorderLine,
			BOTTOM_BORDER_LINE: CellBorderLine,
			LEFT_BORDER_LINE: CellBorderLine,
			RIGHT_BORDER_LINE: CellBorderLine,
		): SiblingsAppendInfo[] {
			const RESULT: SiblingsAppendInfo[] = [];
			if (TOP_BORDER_LINE === CellBorderLine.InnerLine) {
				RESULT.push({
					relationRowIndex: rowIndex,
					relationColIndex: colIndex,

					rowIndex: rowIndex - 1,
					colIndex,
					relation: ConnectionRelation.Top,
				});
			}

			if (BOTTOM_BORDER_LINE === CellBorderLine.InnerLine) {
				RESULT.push({
					relationRowIndex: rowIndex,
					relationColIndex: colIndex,

					rowIndex: rowIndex + 1,
					colIndex,
					relation: ConnectionRelation.Bottom,
				});
			}

			if (LEFT_BORDER_LINE === CellBorderLine.InnerLine) {
				RESULT.push({
					relationRowIndex: rowIndex,
					relationColIndex: colIndex,

					rowIndex,
					colIndex: colIndex - 1,
					relation: ConnectionRelation.Left,
				});
			}

			if (RIGHT_BORDER_LINE === CellBorderLine.InnerLine) {
				RESULT.push({
					relationRowIndex: rowIndex,
					relationColIndex: colIndex,

					rowIndex,
					colIndex: colIndex + 1,
					relation: ConnectionRelation.Right,
				});
			}

			return RESULT;
		}

		function countAndPushIfOk(simpleCube: SimpleCube) {
			simpleCube.count();
			if (
				DEBUG.SHOW_CALL_COUNT_AND_PUSH_IF_OK &&
				(++countAndPushIfOkCallTimes) % 1000 === 0
			) {
				log('call countAndPushIfOk()', countAndPushIfOkCallTimes, simpleCube);
			}

			// 判断cube的情况，若符合条件，则推入（同一纸模多种不同折叠方式；1变24）
			if (simpleCube.isValid) {
				// new Cube(no: number, rowCount: number, colCount: number, coreRowIndex: number, coreColIndex: number, isCloning?: boolean)
				const cube = new Cube(
					++nextMiddleCubeNo,
					ROW_COUNT,
					simpleCube.colCount,
					CORE_ROW_INDEX,
					CORE_COL_INDEX,
					true,
				);
				simpleCube.cells.forEach((sourceRow, rowIndex) => {
					const goalRow: CellObject[] = [];
					cube.cells.push(goalRow);

					sourceRow.forEach((sourceCell, colIndex) => {
						// new CellObject(rowIndex: number, colIndex: number, cellIndex: number)
						const goalCell = new CellObject(
							rowIndex,
							colIndex,
							COL_COUNT * rowIndex + colIndex,
						);
						goalRow.push(goalCell);

						const { relatedInformationWhenAdding, borderLines } = goalCell;

						// goalCell.layerIndex = 0;
						goalCell.addOrder = sourceCell.addOrder;

						const sourceRelatedInformationWhenAdding = sourceCell.relatedInformationWhenAdding;
						relatedInformationWhenAdding.rowIndex = sourceRelatedInformationWhenAdding.rowIndex;
						relatedInformationWhenAdding.colIndex = sourceRelatedInformationWhenAdding.colIndex;
						relatedInformationWhenAdding.relation = sourceRelatedInformationWhenAdding.relation;

						goalCell.feature = sourceCell.feature;
						goalCell.sixFace = sourceCell.sixFace;
						goalCell.faceDirection = sourceCell.faceDirection;
						// goalCell.twelveEdge = sourceCell.twelveEdge;

						const sourceBorderLines = sourceCell.borderLines;
						sourceBorderLines.forEach((value, index) => {
							borderLines[index] = value;
						});
					});
				});
				cube.count();
				const ARRAY_INDEX = ROW_COUNT - 2;

				if (DEBUG.LIMIT_ONLY_FIRST_MIDDLE_CUBE && nextMiddleCubeNo > 1) {
					return;
				}

				++MIDDLE_CUBE_COUNT_ARRAY[ARRAY_INDEX];

				if (DEBUG.SHOW_CUT_MANNERS) {
					// const CUT_MANNER = JSON.stringify(cube.gridLines);
					const CUT_MANNER = cube.gridLines.map((
						{ xStart, xEnd, yStart, yEnd, lineStyle },
					) => `${xStart}${xEnd}${yStart}${yEnd}${lineStyle}`).join(',');
					if (CUT_MANNER_ARRAY.indexOf(CUT_MANNER) === -1) {
						CUT_MANNER_ARRAY.push(CUT_MANNER);
						++CUT_MANNER_COUNT_ARRAY[ARRAY_INDEX];
					}
				}
				if (!DEBUG.DISABLE_PUSH_MIDDLE_CUBE_ARRAY) {
					// MIDDLE_CUBE_ARRAY.push(cube);
					appendMiddleCube(cube);
				}
			}
		}

		function countMiddleCube() {
			addCubeByGroup();

			function addCubeByGroup() {
				function checkColIndexInNotValid(
					rowIndex: number,
					colIndex: number,
					LOG_PREFIX: string,
				): boolean {
					if (
						rowIndex === CORE_ROW_INDEX &&
						COL_INDEX_ARRAY.indexOf(colIndex) === -1
					) {
						if (
							DEBUG
								.SHOW_FAILED_BECAUSE_CORE_ROW_INDEX_ARRAY_NOT_INCLUDE_COL_INDEX
						) {
							log(
								`${LOG_PREFIX}failed because [${COL_INDEX_ARRAY}] not incluce ${colIndex}`,
							);
						}

						return true;
					}

					return false;
				}

				const DEBUG_MAX_COUNT_OF_ADD_NEXT_GROUP_CALL_TIMES = 100000;
				const DEBUG_SHOW_ADD_NEXT_GROUP_DETAILS = DEBUG.SHOW_ADD_NEXT_GROUP_DETAILS;

				if (DEBUG.SHOW_ADD_NEXT_GROUP_DETAILS) {
					log('\ncall addNextSiblingsGroup() from addCubeByGroup()');
				}

				addNextSiblingsGroup({
					// cubeIndex: 0,
					cube: new SimpleCube(ROW_COUNT, COL_COUNT),
					addOrder: 1,
					siblings: [
						{
							relationRowIndex: -1,
							relationColIndex: -1,
							rowIndex: CORE_ROW_INDEX,
							colIndex: CORE_COL_INDEX,
							relation: ConnectionRelation.Top,
						},
					],
				});

				function addNextSiblingsGroup(
					{
						// cubeIndex,
						cube: CUBE,
						addOrder: ADD_ORDER,
						siblings: CELLS_ADDITION_RECURISE_OPTION,
					}: NewAppendSiblingsOptions,
				) {
					if (ADD_ORDER > RECURISE_QUIT_NUMBER) {
						return;
					}

					const LOG_PREFIX = `${'\t'.repeat(ADD_ORDER - 1)}${ADD_ORDER}级：`;

					const DEBUG_SHOW_ADD_NEXT_GROUP_DETAILS = DEBUG.SHOW_ADD_NEXT_GROUP_DETAILS;
					if (ADD_ORDER > RECURISE_QUIT_NUMBER) {
						log(
							`${LOG_PREFIX}return because ${ADD_ORDER} > ${CELL_COUNT}`,
						);
						return;
					}
					const LOG_PARAMETER_INFO = CELLS_ADDITION_RECURISE_OPTION.map((
						item,
					) =>
						`${item.rowIndex}${item.colIndex}${
							item.relationRowIndex === -1
								? ''
								: `←${item.relationRowIndex}${item.relationColIndex}${item.relation}`
						}`
					).join('\t');

					++addNextGroupCallTimes;

					const DEBUG_MAX_COUNT_OF_ADD_NEXT_GROUP_CALL_TIMES = 0;
					const SHOW_IF_LESS_THAN_MAX_COUNT_OF_ADD_NEXT_GROUP_CALL_TIMES =
						DEBUG.SHOW_ADD_NEXT_GROUP_DETAILS &&
						DEBUG_MAX_COUNT_OF_ADD_NEXT_GROUP_CALL_TIMES &&
						(addNextGroupCallTimes <=
							DEBUG_MAX_COUNT_OF_ADD_NEXT_GROUP_CALL_TIMES);
					// log(
					//   "SHOW_IF_LESS_THAN_MAX_COUNT_OF_ADD_NEXT_GROUP_CALL_TIMES",
					//   SHOW_IF_LESS_THAN_MAX_COUNT_OF_ADD_NEXT_GROUP_CALL_TIMES,
					// );
					//   if (addNextGroupCallTimes > DEBUG_MAX_COUNT_OF_ADD_NEXT_GROUP_CALL_TIMES) {
					//     return;
					//   }

					if (DEBUG_SHOW_ADD_NEXT_GROUP_DETAILS) {
						log(
							`enter, ${LOG_PREFIX}${LOG_PARAMETER_INFO}\t<=\t${showSimpleCubeCoreInfo(CUBE)}`,
						);
					}

					const cellAppendInfoGroup: CellAppendInfoManner[][] = [];

					let skipCount = 0;
					let failed = false;
					CELLS_ADDITION_RECURISE_OPTION.forEach(({
						relationRowIndex,
						relationColIndex,
						rowIndex,
						colIndex,

						relation,
					}: SiblingsAppendInfo) => {
						failed = checkColIndexInNotValid(rowIndex, colIndex, LOG_PREFIX);
						if (failed) {
							return;
						}

						// 先以核心格的值作为默认值——如果不是核心格，则进行相应计算以修正
						const featureByRelation = CellFeature.Face;
						let sixFaceByRelation = SixFace.Up;
						let faceDirectionByRelation = FourDirection.Original;
						// let twelveEdge: TwelveEdge = TwelveEdge.NotSure;
						if (relationRowIndex > -1) {
							const CURRENT_CELL: SimpleCell = CUBE.cells[rowIndex][colIndex];
							const RELATION_CELL: SimpleCell = CUBE.cells[relationRowIndex][relationColIndex];

							const RELATION_CELL_TWENTY_FOUR_ANGLE =
								convertSixFaceAndDirectionToSixFaceTwentyFourAngle(
									RELATION_CELL.sixFace,
									RELATION_CELL.faceDirection,
								);
							const [sixFace, faceDirection] = convertSixFaceTwentyFourAngleToSixFaceAndDirection(
								SIX_FACE_AND_DIRECTION_RELATIONS[
									RELATION_CELL_TWENTY_FOUR_ANGLE
								][
									relation
								],
							);

							if (!CURRENT_CELL.isUnknown) {
								if (
									CURRENT_CELL.sixFace !== sixFace ||
									CURRENT_CELL.faceDirection !== faceDirection
								) {
									if (
										DEBUG_SHOW_ADD_NEXT_GROUP_DETAILS &&
										DEBUG.SHOW_FAILED_RELATION_CELL_INFO
									) {
										log(
											`${LOG_PREFIX}failed because the old cell not same to the current cell`,
											sixFace,
											faceDirection,
											JSON.stringify({
												rowIndex,
												colIndex,
												relationRowIndex,
												relationColIndex,
												relation,
											}),
											// CURRENT_CELL.toString(),
										);
									}
									failed = true;
									return;
								}

								++skipCount;
								return;
							} else {
								sixFaceByRelation = sixFace;
								faceDirectionByRelation = faceDirection;

								// twelveEdge = getSixFaceTwentyFourAngleRelationTwelveEdge(
								//   RELATION_CELL_TWENTY_FOUR_ANGLE,
								//   relation,
								// );

								CURRENT_CELL.addOrder = ADD_ORDER;
								CURRENT_CELL.relatedInformationWhenAdding = {
									rowIndex: relationRowIndex,
									colIndex: relationColIndex,
									relation,
								};
							}
						}

						const {
							topBorderLineArray,
							rightBorderLineArray,
							bottomBorderLineArray,
							leftBorderLineArray,
						}: {
							topBorderLineArray: CellBorderLine[];
							rightBorderLineArray: CellBorderLine[];
							bottomBorderLineArray: CellBorderLine[];
							leftBorderLineArray: CellBorderLine[];
						} = getBorderLineArrays(
							CUBE,
							rowIndex,
							colIndex,
						);

						const cellAppendInfo: CellAppendInfoManner[] = [];

						topBorderLineArray.forEach((TOP_BORDER_LINE) => {
							rightBorderLineArray.forEach((RIGHT_BORDER_LINE) => {
								bottomBorderLineArray.forEach((BOTTOM_BORDER_LINE) => {
									leftBorderLineArray.forEach((LEFT_BORDER_LINE) => {
										if (
											TOP_BORDER_LINE !== CellBorderLine.InnerLine &&
											BOTTOM_BORDER_LINE !== CellBorderLine.InnerLine &&
											LEFT_BORDER_LINE !== CellBorderLine.InnerLine &&
											RIGHT_BORDER_LINE !== CellBorderLine.InnerLine
										) {
											return;
										}
										const siblingsAppendInfoArray = getSiblingsAppendInfoArray(
											rowIndex,
											colIndex,
											TOP_BORDER_LINE,
											BOTTOM_BORDER_LINE,
											LEFT_BORDER_LINE,
											RIGHT_BORDER_LINE,
										);
										if (!siblingsAppendInfoArray.length) {
											return;
										}

										cellAppendInfo.push({
											rowIndex,
											colIndex,
											feature: featureByRelation,
											borderLines: [
												TOP_BORDER_LINE,
												RIGHT_BORDER_LINE,
												BOTTOM_BORDER_LINE,
												LEFT_BORDER_LINE,
											],
											addOrder: ADD_ORDER,
											// twelveEdge,
											sixFace: sixFaceByRelation,
											faceDirection: faceDirectionByRelation,
											siblingsAppendInfoArray,
										});
									});
								});
							});
						});

						if (cellAppendInfo.length) {
							cellAppendInfoGroup.push(cellAppendInfo);
						}
					});

					if (failed) {
						if (SHOW_IF_LESS_THAN_MAX_COUNT_OF_ADD_NEXT_GROUP_CALL_TIMES) {
							log('failed:', failed);
						}
						return;
					}

					const SIBLINGS_COUNT = cellAppendInfoGroup.length;
					if (SHOW_IF_LESS_THAN_MAX_COUNT_OF_ADD_NEXT_GROUP_CALL_TIMES) {
						log(
							'SIBLINGS_COUNT:',
							SIBLINGS_COUNT,
							'CELLS_ADDITION_RECURISE_OPTION.length:',
							CELLS_ADDITION_RECURISE_OPTION.length,
							//   "cellAppendInfoGroup.length:",
							//   cellAppendInfoGroup.length,
							skipCount,
						);
					}
					if (
						SIBLINGS_COUNT === 0 ||
						skipCount === CELLS_ADDITION_RECURISE_OPTION.length
					) {
						countAndPushIfOk(CUBE);
						// releaseSimpleCube(cubeIndex);
						return;
					}

					let mannerCount = 1;
					const itemCountArray: number[] = [];
					cellAppendInfoGroup.forEach((item) => {
						const { length } = item;
						mannerCount *= length;
						itemCountArray.push(length);
					});

					const SIBLINGS_MAX_INDEX = SIBLINGS_COUNT - 1; // - skipCount;
					const START_DIVISOR = mannerCount === 0 ? 0 : (mannerCount / itemCountArray[0]);
					if (SHOW_IF_LESS_THAN_MAX_COUNT_OF_ADD_NEXT_GROUP_CALL_TIMES) {
						log(`{START_DIVISOR,itemCountArray,cellAppendInfoGroup}`, {
							START_DIVISOR,
							itemCountArray,
							cellAppendInfoGroup,
						});
					}

					for (
						let cellAppendInfoGroupItemIndex = 0;
						cellAppendInfoGroupItemIndex < mannerCount;
						++cellAppendInfoGroupItemIndex
					) {
						let divisor = START_DIVISOR;
						let remainder = cellAppendInfoGroupItemIndex;

						const SIBLING_ARRAY: CellAppendInfoManner[] = [];
						for (
							let siblingIndex = 0;
							siblingIndex < SIBLINGS_MAX_INDEX;
							++siblingIndex
						) {
							const index = floor(remainder / divisor);
							remainder -= divisor * index;

							SIBLING_ARRAY.push(cellAppendInfoGroup[siblingIndex][index]);
							if (SHOW_IF_LESS_THAN_MAX_COUNT_OF_ADD_NEXT_GROUP_CALL_TIMES) {
								log(
									`{siblingIndex,index,new: cellAppendInfoGroup[siblingIndex][index]}`,
									{
										siblingIndex,
										index,
										new: cellAppendInfoGroup[siblingIndex][index],
									},
								);
							}

							divisor /= itemCountArray[siblingIndex + 1];
						}
						try {
							cellAppendInfoGroup[SIBLINGS_MAX_INDEX][remainder];
						} catch {
							console.log('Error', {
								SIBLINGS_MAX_INDEX,
								remainder,
								cellAppendInfoGroupLength: cellAppendInfoGroup.length,
							});
						}
						SIBLING_ARRAY.push(
							cellAppendInfoGroup[SIBLINGS_MAX_INDEX][remainder],
						);
						if (SHOW_IF_LESS_THAN_MAX_COUNT_OF_ADD_NEXT_GROUP_CALL_TIMES) {
							log(
								`{cellAppendInfoGroupItemIndex,remainder,divisor,SIBLING_ARRAY}`,
								{
									cellAppendInfoGroupItemIndex,
									remainder,
									divisor,
									SIBLING_ARRAY,
								},
							);
						}

						const CUBE_CLONED = CUBE.clone();
						// const CUBE_CLONED = getNextSimpleCubeFromPool();
						// CUBE.transferTo(CUBE_CLONED);
						// const NEXT_CUBE_INDEX = currentCubeIndex;

						const siblings: SiblingsAppendInfoArray = [];
						SIBLING_ARRAY.forEach(({
							rowIndex, //: number;
							colIndex, //: number;
							feature, // : CellFeature;
							borderLines, // : CellBorderLine[];
							addOrder, // : number;
							// twelveEdge, // : TwelveEdge;
							sixFace, // : SixFace;
							faceDirection, // : FourDirection;
							siblingsAppendInfoArray, // : SiblingsAppendInfo[];
						}) => {
							if (SHOW_IF_LESS_THAN_MAX_COUNT_OF_ADD_NEXT_GROUP_CALL_TIMES) {
								log(LOG_PREFIX, {
									rowIndex, //: number;
									colIndex, //: number;
									feature, // : CellFeature;
									borderLines, // : CellBorderLine[];
									addOrder, // : number;
									// twelveEdge, // : TwelveEdge;
									sixFace, // : SixFace;
									faceDirection, // : FourDirection;
									siblingsAppendInfoArray, // : SiblingsAppendInfo[];
								});
							}
							const CELL: SimpleCell = CUBE_CLONED.cells[rowIndex][colIndex];
							CELL.feature = feature;
							CELL.borderLines = borderLines;
							CELL.addOrder = addOrder;
							// CELL.twelveEdge = twelveEdge;
							CELL.sixFace = sixFace;
							CELL.faceDirection = faceDirection;

							siblingsAppendInfoArray.forEach((item) => siblings.push(item));
						});
						if (SHOW_IF_LESS_THAN_MAX_COUNT_OF_ADD_NEXT_GROUP_CALL_TIMES) {
							log(
								`${LOG_PREFIX}addNextSiblingsGroup()`,
								{
									cube: showSimpleCubeCoreInfo(CUBE_CLONED),
									addOrder: ADD_ORDER + 1,
									siblings,
								},
							);
						}

						addNextSiblingsGroup(
							{
								// cubeIndex: NEXT_CUBE_INDEX,
								cube: CUBE_CLONED,
								addOrder: ADD_ORDER + 1,
								siblings,
							},
						);
					}

					countAndPushIfOk(CUBE);
					// releaseSimpleCube(cubeIndex);
				}
			}
		}

		function appendMiddleCube(cube: Cube) {
			MIDDLE_CUBE_ARRAY.push(cube);
			if (MIDDLE_CUBE_ARRAY.length >= MIDDLE_CUBE_BATCH_DEAL_COUNT) {
				dealMiddleCubes();
			}
		}

		function dealMiddleCubes() {
			const MIDDLE_CUBE_COUNT = MIDDLE_CUBE_ARRAY.length;
			if (!MIDDLE_CUBE_COUNT) {
				return;
			}

			MIDDLE_CUBE_ARRAY.forEach((middleCube) => batchAppendCube(middleCube));

			MANNER_ARRAY.forEach((manner, index) => {
				// T0T0T0T0T0F0F0T1T0T0T0T0 => TTTTTFFTTTTT
				const FULL_MANNER_DATA_ARRAY: string[] = manner.split('');
				const SIMPLE_MANNER_DATA_ARRAY: string[] = [];
				for (let i = 0; i < 12; i += 2) {
					SIMPLE_MANNER_DATA_ARRAY.push(
						(FULL_MANNER_DATA_ARRAY[i] === 'T' ||
								FULL_MANNER_DATA_ARRAY[i + 1] !== '0')
							? 'T'
							: 'F',
					);
				}
				const NEW_SIMPLE_MANNER = SIMPLE_MANNER_DATA_ARRAY.join('');
				if (SIMPLE_MANNER_ARRAY.indexOf(NEW_SIMPLE_MANNER) === -1) {
					SIMPLE_MANNER_ARRAY.push(NEW_SIMPLE_MANNER);
				}

				SIMPLE_DATA_ARRAY.push({
					manner,
					cube: Object.assign(MANNER_CUBE_ARRAY[index][0], {
						cells: undefined,
						isValid: undefined,
					}),
				});
			});

			if (OUTPUT_LARGE_FILES) {
				MANNER_CUBE_ARRAY.forEach((cubeArray) => {
					cubeArray.forEach((cube) => CUBES.push(cube));
				});

				let codes = '';
				for (
					let cubeIndex = 0;
					cubeIndex < MIDDLE_CUBE_COUNT;
					++cubeIndex
				) {
					codes += `${JSON.stringify(MIDDLE_CUBE_ARRAY[cubeIndex])},\n`;
				}
				Deno.writeTextFileSync(MIDDLE_FILE_NAME, codes, APPEND_FLAG);

				appendCubesToFile();
			}

			MIDDLE_CUBE_ARRAY.length = 0;
			thisMiddleCubeCount += MIDDLE_CUBE_COUNT;
		}

		function done() {
			if (OUTPUT_LARGE_FILES) {
				Deno.writeTextFileSync(
					MIDDLE_FILE_NAME,
					`export const middleCubeArray = [\n`,
				);
				createCubesFile();
			}

			countMiddleCube();
			dealMiddleCubes();

			if (OUTPUT_LARGE_FILES) {
				Deno.writeTextFileSync(MIDDLE_FILE_NAME, `];`, APPEND_FLAG);

				appendCubesFileEndFlag();
				writeMannersToFile();
			}

			totalMiddleCubeCount += thisMiddleCubeCount;

			// log(
			// "MIDDLE_CUBE_ARRAY.length:",
			// MIDDLE_CUBE_COUNT,
			// "\nMANNER_ARRAY.length:",
			// MANNER_ARRAY.length,
			// CUBES.length ? "\nCUBES.length:" : "",
			// CUBES.length ? CUBES.length : "",
			// CUBES.length ? `÷${MANNER_COUNT}→` : "",
			// CUBES.length ? CUBES.length / MANNER_COUNT : "",
			// );
			// if (DEBUG.SHOW_MANNER_ARRAY) {
			// log("\n", `MANNER_ARRAY:\n${MANNER_ARRAY.join("\n")}`);
			// }
			// if (DEBUG.SHOW_MANNER_CUBE_COUNT_ARRAY) {
			// log(
			// "\n",
			// `MANNER_CUBE_COUNT_ARRAY:\n${JSON.stringify(MANNER_CUBE_COUNT_ARRAY)}`,
			// );
			// if (!IS_ONLY_TWO_ROWS) {
			// log(
			// "\n",
			// `MANNER_CUBE_COUNT_OF_ROWS_2_ARRAY:\n${
			// JSON.stringify(MANNER_CUBE_COUNT_OF_ROWS_2_ARRAY)
			// }`,
			// );
			// log(
			// "\n",
			// `MANNER_CUBE_COUNT_OF_ROWS_3_ARRAY:\n${
			// JSON.stringify(MANNER_CUBE_COUNT_OF_ROWS_3_ARRAY)
			// }`,
			// );
			// }
			// }
		}

		done();
	}
	countMiddleCubes();
	showUsedTime(`after countMiddleCubes() ${FILE_PREFIX}`);

	function createCubesFile() {
		showUsedTime(`before createCubesFile: ${CUBE_FILE_NAME}`);
		Deno.writeTextFileSync(
			CUBE_FILE_NAME,
			`export const cubes = ${ARRAY_BEGIN_FLAG}`,
		);
		showUsedTime(`after createCubesFile: ${CUBE_FILE_NAME}`);

		return true;
	}

	function appendCubesToFile(): boolean {
		const COUNT = CUBES.length;
		thisCubeCount += COUNT;
		// JSON.stringify(CUBES)
		// , index: ${currentMiddleCubeIndex}
		showUsedTime(
			`before appendCubesToFile: ${CUBE_FILE_NAME}, CUBES.length: ${COUNT} => ${
				thisCubeCount.toString().padStart(8)
			}`,
		);
		Deno.writeTextFileSync(
			CUBE_FILE_NAME,
			CUBES.map((cube) => JSON.stringify(cube)).join(',\n'),
			APPEND_FLAG,
		);

		totalCubeCount += COUNT;
		if (!IS_ONLY_TWO_ROWS) {
			CUBES.length = 0;
		}
		// showUsedTime(`after appendCubesToFile: ${CUBE_FILE_NAME}`);

		return true;
	}

	function appendCubesFileEndFlag() {
		// showUsedTime(`before appendCubesFileEndFlag: ${CUBE_FILE_NAME}`);
		Deno.writeTextFileSync(CUBE_FILE_NAME, `${ARRAY_END_FLAG};`, APPEND_FLAG);
		showUsedTime(`after appendCubesFileEndFlag: ${CUBE_FILE_NAME}`);

		return true;
	}

	function writeMannersToFile(): boolean {
		// showUsedTime(
		//   `before writeMannersToFile: ${MANNERS_FILE_NAME}, MANNER_ARRAY.length: ${MANNER_ARRAY.length}`,
		// );

		Deno.writeTextFileSync(
			MANNERS_FILE_NAME,
			`[\n${MANNER_ARRAY.join(',\n')}\n]`,
		);

		Deno.writeTextFileSync(
			MANNER_CUBE_COUNT_ARRAY_FILE_NAME,
			JSON.stringify(MANNER_CUBE_COUNT_ARRAY),
		);
		Deno.writeTextFileSync(
			MANNER_CUBE_COUNT_OF_ROWS_2_ARRAY_FILE_NAME,
			JSON.stringify(MANNER_CUBE_COUNT_OF_ROWS_2_ARRAY),
		);
		Deno.writeTextFileSync(
			MANNER_CUBE_COUNT_OF_ROWS_3_ARRAY_FILE_NAME,
			JSON.stringify(MANNER_CUBE_COUNT_OF_ROWS_3_ARRAY),
		);

		Deno.writeTextFileSync(
			MANNER_CUBE_ARRAY_FILE_NAME,
			`[\n${
				MANNER_CUBE_ARRAY.map((cubeArray) => JSON.stringify(cubeArray)).join(
					',\n',
				)
			}\n]`,
		);

		Deno.writeTextFileSync(
			MANNER_AND_DETAIL_FILE_NAME,
			JSON.stringify(MANNER_ARRAY.map((manner, index) => {
				return {
					manner,
					cubes: MANNER_CUBE_ARRAY[index],
					cubeCount: MANNER_CUBE_COUNT_ARRAY[index],
					cubeOfTwoRowsCount: MANNER_CUBE_COUNT_OF_ROWS_2_ARRAY[index],
					cubeOfThreeRowsCount: MANNER_CUBE_COUNT_OF_ROWS_3_ARRAY[index],
				};
			})),
		);

		showUsedTime(`after writeMannersToFile: ${MANNERS_FILE_NAME}`);

		return true;
	}

	function batchAppendCube(cubeOriginal: Cube) {
		// 同一纸模不同折叠与粘贴方案

		// 暂时忽略格与格之间的互相影响（比如某些面放到上面后，一些关联面的层也会上移，而另一些关联面则会被自动隐藏
		// TODO(@anqi) 如可能，应用上述物理规律

		const upFaceOptionalMannerArray: OneOrTwoCellRowColIndex[] = [];
		const downFaceOptionalMannerArray: OneOrTwoCellRowColIndex[] = [];
		const leftFaceOptionalMannerArray: OneOrTwoCellRowColIndex[] = [];
		const rightFaceOptionalMannerArray: OneOrTwoCellRowColIndex[] = [];
		const frontFaceOptionalMannerArray: OneOrTwoCellRowColIndex[] = [];
		const backFaceOptionalMannerArray: OneOrTwoCellRowColIndex[] = [];
		const faceOptionalMannerArrayArray = [
			upFaceOptionalMannerArray,
			downFaceOptionalMannerArray,
			leftFaceOptionalMannerArray,
			rightFaceOptionalMannerArray,
			frontFaceOptionalMannerArray,
			backFaceOptionalMannerArray,
		];

		const upFaceOptionalPieceArray: OneCellRowColIndex[][] = [];
		const downFaceOptionalPieceArray: OneCellRowColIndex[][] = [];
		const leftFaceOptionalPieceArray: OneCellRowColIndex[][] = [];
		const rightFaceOptionalPieceArray: OneCellRowColIndex[][] = [];
		const frontFaceOptionalPieceArray: OneCellRowColIndex[][] = [];
		const backFaceOptionalPieceArray: OneCellRowColIndex[][] = [];
		const faceOptionalPieceArrayArray = [
			upFaceOptionalPieceArray,
			downFaceOptionalPieceArray,
			leftFaceOptionalPieceArray,
			rightFaceOptionalPieceArray,
			frontFaceOptionalPieceArray,
			backFaceOptionalPieceArray,
		];
		faceOptionalPieceArrayArray.forEach((array) => {
			for (let i = 0; i < 4; ++i) {
				array.push([]);
			}
		});

		const twentyFourAngelFaceOrPieceArray: {
			faces: OneCellRowColIndex[];
			pieces: OneCellRowColIndex[];
		}[] = [];
		for (let index = 0; index < ANGLE_COUNT; ++index) {
			twentyFourAngelFaceOrPieceArray.push({ faces: [], pieces: [] });
		}

		cubeOriginal.actCells.forEach((cell) => {
			const {
				rowIndex,
				colIndex,
				borderLines,

				sixFace,
				faceDirection,
			} = cell;

			const TWENTY_FOUR_ANGLE = convertSixFaceAndDirectionToSixFaceTwentyFourAngle(
				sixFace,
				faceDirection,
			);
			const ITEM = twentyFourAngelFaceOrPieceArray[TWENTY_FOUR_ANGLE];
			const cellRowColIndex: OneCellRowColIndex = [rowIndex, colIndex];

			switch (
				borderLines.filter((borderLine: CellBorderLine) => borderLine === CellBorderLine.InnerLine)
					.length
			) {
				case 2:
				case 3:
				case 4:
					ITEM.faces.push(cellRowColIndex);
					faceOptionalMannerArrayArray[sixFace].push(
						cellRowColIndex as OneOrTwoCellRowColIndex,
					);
					break;
				case 1:
					ITEM.pieces.push(cellRowColIndex);
					faceOptionalPieceArrayArray[sixFace][faceDirection].push(
						cellRowColIndex,
					);
					break;
				default:
					// unreachable
					break;
			}
		});

		faceOptionalMannerArrayArray.forEach((mannerArray, sixFace) => {
			const [
				topFaceOptionalPieceArray,
				rightFaceOptionalPieceArray,
				bottomFaceOptionalPieceArray,
				leftFaceOptionalPieceArray,
			] = faceOptionalPieceArrayArray[sixFace];

			const array: OneCellRowColIndex[][] = [];
			if (topFaceOptionalPieceArray.length) {
				array.push(topFaceOptionalPieceArray);
			}
			if (rightFaceOptionalPieceArray.length) {
				array.push(rightFaceOptionalPieceArray);
			}
			if (bottomFaceOptionalPieceArray.length) {
				array.push(bottomFaceOptionalPieceArray);
			}
			if (leftFaceOptionalPieceArray.length) {
				array.push(leftFaceOptionalPieceArray);
			}

			while (array.length > 1) {
				const FIRST_ARRAY = array.splice(0, 1)[0];
				FIRST_ARRAY.forEach((firstCellRowColIndex) => {
					const [firstRowIndex, firstColIndex] = firstCellRowColIndex;
					array.forEach((subArray) => {
						subArray.forEach((secondCellRowColIndex) => {
							const [secondRowIndex, secondColIndex] = secondCellRowColIndex;

							// 因粘贴顺序不同时，得到不同的方案，所以每组以不同顺序追加两次（类型TwoCellRowColIndex）
							mannerArray.push(
								[
									firstRowIndex,
									firstColIndex,
									secondRowIndex,
									secondColIndex,
								],
							);
							mannerArray.push(
								[
									secondRowIndex,
									secondColIndex,
									firstRowIndex,
									firstColIndex,
								],
							);
						});
					});
				});
			}
		});
		if (DEBUG.SHOW_MIDDLE_CUBE_CONVERT_INFO) {
			// log(
			//   `\n const faceOptionalPieceArrayMap = ${
			//     JSON.stringify({
			//       upFaceOptionalPieceArray,
			//       downFaceOptionalPieceArray,
			//       leftFaceOptionalPieceArray,
			//       rightFaceOptionalPieceArray,
			//       frontFaceOptionalPieceArray,
			//       backFaceOptionalPieceArray,
			//     })
			//   };`,
			//   `\nconst faceOptionalMannerArrayMap = ${
			//     JSON.stringify(
			//       {
			//         upFaceOptionalMannerArray,
			//         downFaceOptionalMannerArray,
			//         leftFaceOptionalMannerArray,
			//         rightFaceOptionalMannerArray,
			//         frontFaceOptionalMannerArray,
			//         backFaceOptionalMannerArray,
			//       },
			//     )
			//   };`,
			// );
			log('\nconst faceOptionalPieceArrayMap = ');
			log({
				upFaceOptionalPieceArray,
				downFaceOptionalPieceArray,
				leftFaceOptionalPieceArray,
				rightFaceOptionalPieceArray,
				frontFaceOptionalPieceArray,
				backFaceOptionalPieceArray,
			});
			log(';');
			log('\nconst faceOptionalMannerArrayMap = ');
			log({
				upFaceOptionalMannerArray,
				downFaceOptionalMannerArray,
				leftFaceOptionalMannerArray,
				rightFaceOptionalMannerArray,
				frontFaceOptionalMannerArray,
				backFaceOptionalMannerArray,
			});
			log(';');
		}

		// 以六面不同可能组合，得到不同的粘贴方案——暂时忽略面的层次对其它面的影响
		upFaceOptionalMannerArray.forEach((upItem, upIndex) => {
			downFaceOptionalMannerArray.forEach((downItem, downIndex) => {
				leftFaceOptionalMannerArray.forEach((leftItem, leftIndex) => {
					rightFaceOptionalMannerArray.forEach((rightItem, rightIndex) => {
						frontFaceOptionalMannerArray.forEach((frontItem, frontIndex) => {
							backFaceOptionalMannerArray.forEach((backItem, backIndex) => {
								const cloned = cubeOriginal.clone();

								// 通过六面及十二棱可用片，计算十二棱是否可插入
								cloned.twelveEdges.forEach((twelveEdge) => {
									if (twelveEdge.pieces.length) {
										twelveEdge.canBeInserted = true;
										return;
									}
								});

								const twelveEdges = cloned.twelveEdges as OneOfTwelveEdges[];
								const { cells } = cloned;

								const sixFaceOutestCellArray: CellObject[] = [];

								[
									[upFaceOptionalMannerArray, upItem, upIndex],
									[downFaceOptionalMannerArray, downItem, downIndex],
									[leftFaceOptionalMannerArray, leftItem, leftIndex],
									[rightFaceOptionalMannerArray, rightItem, rightIndex],
									[frontFaceOptionalMannerArray, frontItem, frontIndex],
									[backFaceOptionalMannerArray, backItem, backIndex],
								].forEach((turpleArray, sixFaceIndex) => {
									// const [array, item, index] = turpleArray;
									const array = turpleArray[0] as OneOrTwoCellRowColIndex[];
									const item = turpleArray[1] as OneOrTwoCellRowColIndex;
									const index = turpleArray[2] as number;
									const USED_ROW_COL_INDEX: string[] = [];

									let layerIndex = 0;
									// array.slice(index, index + 1)
									array.filter((_o, itemIndex) => itemIndex !== index)
										.forEach(
											(otherItem) => {
												const [
													firstRowIndex,
													firstColIndex,
													secondRowIndex,
													secondColIndex,
												] = otherItem;
												const IS_FACE = typeof secondRowIndex === 'undefined' ||
													typeof secondColIndex === 'undefined';
												const FIRST_ROW_COL_INDEX = `${firstRowIndex}_${firstColIndex}`;
												if (
													USED_ROW_COL_INDEX.indexOf(FIRST_ROW_COL_INDEX) ===
														-1
												) {
													USED_ROW_COL_INDEX.push(FIRST_ROW_COL_INDEX);
													cloned.cells[firstRowIndex][firstColIndex]
														.layerIndex = ++layerIndex;
												}
												if (!IS_FACE) {
													const SECOND_ROW_COL_INDEX = `${secondRowIndex}_${secondColIndex}`;
													if (
														USED_ROW_COL_INDEX.indexOf(
															SECOND_ROW_COL_INDEX,
														) ===
															-1
													) {
														USED_ROW_COL_INDEX.push(SECOND_ROW_COL_INDEX);
														cloned.cells[secondRowIndex][secondColIndex]
															.layerIndex = ++layerIndex;
													}

													cloned.sixFaces[sixFaceIndex].push([...otherItem]);
												}
											},
										);

									// const [firstRowIndex, firstColIndex, secondRowIndex, secondColIndex] =
									// 	item as OneOrTwoCellRowColIndex;
									const [
										firstRowIndex,
										firstColIndex,
										secondRowIndex,
										secondColIndex,
									] = item;
									const IS_FACE = typeof secondRowIndex === 'undefined' ||
										typeof secondColIndex === 'undefined';
									const FIRST_ROW_COL_INDEX = `${firstRowIndex}_${firstColIndex}`;
									if (
										USED_ROW_COL_INDEX.indexOf(FIRST_ROW_COL_INDEX) === -1
									) {
										USED_ROW_COL_INDEX.push(FIRST_ROW_COL_INDEX);
										cloned.cells[firstRowIndex][firstColIndex].layerIndex = ++layerIndex;
									}
									if (!IS_FACE) {
										const SECOND_ROW_COL_INDEX = `${secondRowIndex}_${secondColIndex}`;
										if (
											USED_ROW_COL_INDEX.indexOf(SECOND_ROW_COL_INDEX) === -1
										) {
											USED_ROW_COL_INDEX.push(SECOND_ROW_COL_INDEX);
											cloned.cells[secondRowIndex][secondColIndex]
												.layerIndex = ++layerIndex;
										}

										sixFaceOutestCellArray.push(
											cloned.cells[secondRowIndex][secondColIndex],
										);

										twelveEdges.forEach((edge) => {
											removeFromPieces(firstRowIndex, firstColIndex);
											removeFromPieces(secondRowIndex, secondColIndex);

											function removeFromPieces(
												findRowIndex: number,
												findColIndex: number,
											) {
												let position = -1;
												edge.pieces.forEach(
													([pieceRowIndex, pieceColIndex], pieceIndex) => {
														if (
															findRowIndex === pieceRowIndex &&
															findColIndex === pieceColIndex
														) {
															position = pieceIndex;
														}
													},
												);
												if (position > -1) {
													cells[findRowIndex][findColIndex].feature = CellFeature.Face;
													edge.pieces.splice(position, 1);
												}
											}
										});
									} else {
										sixFaceOutestCellArray.push(
											cloned.cells[firstRowIndex][firstColIndex],
										);
									}
								});

								// let upLayerIndex = 0;
								// let downLayerIndex = 0;
								// let leftLayerIndex = 0;
								// let rightLayerIndex = 0;
								// let frontLayerIndex = 0;
								// let backLayerIndex = 0;
								// const [
								//   upFaceOutestCell,
								//   downFaceOutestCell,
								//   leftFaceOutestCell,
								//   rightFaceOutestCell,
								//   frontFaceOutestCell,
								//   backFaceOutestCell,
								// ] = sixFaceOutestCellArray;

								const sixFaceTwentyFourAngleOfSixFaceOutestCellArray: SixFaceTwentyFourAngle[] = [];
								sixFaceOutestCellArray.forEach((cell) => {
									sixFaceTwentyFourAngleOfSixFaceOutestCellArray.push(
										convertSixFaceAndDirectionToSixFaceTwentyFourAngle(
											cell.sixFace,
											cell.faceDirection,
										),
									);
								});

								// const [
								// 	upFaceOutestCellSixFaceTwentyFourAngle,
								// 	downFaceOutestCellSixFaceTwentyFourAngle,
								// 	leftFaceOutestCellSixFaceTwentyFourAngle,
								// 	rightFaceOutestCellSixFaceTwentyFourAngle,
								// 	frontFaceOutestCellSixFaceTwentyFourAngle,
								// 	backFaceOutestCellSixFaceTwentyFourAngle,
								// ] = sixFaceTwentyFourAngleOfSixFaceOutestCellArray;

								// [upFaceOutestCell]
								sixFaceOutestCellArray.forEach((cell, cellIndex) => {
									cell.borderLines.forEach((borderLine, borderLineIndex) => {
										if (borderLine !== CellBorderLine.InnerLine) {
											const twelveEdgeIndex: TwelveEdge =
												getSixFaceTwentyFourAngleRelationTwelveEdge(
													// upFaceOutestCellSixFaceTwentyFourAngle,
													sixFaceTwentyFourAngleOfSixFaceOutestCellArray[
														cellIndex
													],
													borderLineIndex,
												);

											if (!twelveEdges[twelveEdgeIndex].canBeInserted) {
												twelveEdges[twelveEdgeIndex].canBeInserted = true;
											}
										}
									});
								});

								twelveEdges.forEach((oneEdge, edgeIndex) => {
									oneEdge.pieces.forEach((cellRowColIndex) => {
										const [rowIndex, colIndex] = cellRowColIndex;
										const pieceCell = cells[rowIndex][colIndex];
										pieceCell.feature = CellFeature.Piece;
										pieceCell.twelveEdge = edgeIndex;

										// 复位“面属性”
										pieceCell.sixFace = SixFace.Up;
										pieceCell.faceDirection = FourDirection.Original;

										const {
											rowIndex: relatedRowIndex,
											colIndex: relatedColIndex,
											// relation,
										} = pieceCell.relatedInformationWhenAdding;

										if (relatedRowIndex === -1) {
											pieceCell.borderLines.forEach(
												(borderLine, borderLineIndex) => {
													if (borderLine === CellBorderLine.InnerLine) {
														switch (borderLineIndex as ConnectionRelation) {
															case ConnectionRelation.Top:
																pieceCell.layerIndex = cells[rowIndex - 1][colIndex].layerIndex +
																	1;
																break;
															case ConnectionRelation.Bottom:
																pieceCell.layerIndex = cells[rowIndex + 1][colIndex].layerIndex +
																	1;
																break;
															case ConnectionRelation.Left:
																pieceCell.layerIndex = cells[rowIndex][colIndex - 1].layerIndex +
																	1;
																break;
															case ConnectionRelation.Right:
																pieceCell.layerIndex = cells[rowIndex][colIndex + 1].layerIndex +
																	1;
																break;
															default:
																// unreachable
																break;
														}
													}
												},
											);
										} else {
											pieceCell.layerIndex = cells[relatedRowIndex][relatedColIndex].layerIndex +
												1;
										}
									});
								});

								if (DEBUG.SHOW_MIDDLE_CUBE_CONVERT_INFO) {
									log(
										'\n\n// call batchAppendCubeOneToTwentyFour(cloned), cloned:\nconst clonedCubeOfBatchAppendCubeOneToTwentyFour = ',
									);
									log(cloned);
									log(';');
								}
								batchAppendCubeOneToTwentyFour(cloned);
							});
						});
					});
				});
			});
		});
	}

	function batchAppendCubeOneToTwentyFour(cube: Cube) {
		const { CUBE_LIMIT_COUNT } = DEBUG;
		if (CUBE_LIMIT_COUNT && nextCubeNo >= CUBE_LIMIT_COUNT) {
			return;
		}

		// 下面这句代码不可使用，否则同一粘贴方案下，不同的折叠方案会得到相同的层序号系列！
		// cube.countLayerIndex();

		// Deno.writeTextFileSync(
		//   `${FILE_PREFIX}_after_count_layer_index_${cube.no}.ts`,
		//   `const cube_after_count_layer_index = ${JSON.stringify(cube)};`,
		// );

		const {
			sixFaces: OLD_SIX_FACES, // : [upFace, downFace, leftFace, rightFace, frontFace, backFace],
			twelveEdges: OLD_TWELVE_EDGES,
			cells: OLD_CELLS,
		} = cube;

		// const {
		//   // rowCount,
		//   // colCount,
		//   coreRowIndex: CORE_ROW_INDEX,
		//   coreColIndex: CORE_COL_INDEX,
		// } = cube;
		// const CELL_COUNT = colCount * rowCount;
		const MAX_ADD_ORDER = cube.actCells.map((cell) => cell.addOrder).sort().reverse()[0];
		const CORE_CELL_IS_PIECE =
			OLD_CELLS[CORE_ROW_INDEX][CORE_COL_INDEX].feature === CellFeature.Piece;

		for (let mannerIndex = 0; mannerIndex < MANNER_COUNT; ++mannerIndex) {
			if (CUBE_LIMIT_COUNT && nextCubeNo >= CUBE_LIMIT_COUNT) {
				return;
			}
			const cloned = getClonedCubeByMannerIndex(
				cube,
				mannerIndex,
				OLD_SIX_FACES,
				OLD_TWELVE_EDGES,
				OLD_CELLS,
				MAX_ADD_ORDER,
				CORE_CELL_IS_PIECE,
			);

			// cloned.count();
			cloned.syncAndClear();

			if (DEBUG.SHOW_MIDDLE_CUBE_CONVERT_INFO) {
				log('\n // in batchAppendCubeOneToTwentyFour(), new cube:');
				log(`const newCube_${nextCubeNo} = `);
				log(cloned);
				log(';');
			}

			const MANNER = cloned.twelveEdges.map((twelveEdge) =>
				`${twelveEdge.canBeInserted ? 'T' : 'F'}${twelveEdge.pieces.length}`
			).join('');
			const IS_TWO_ROWS_CUBE = cloned.rowCount === 2;
			const EXISTED_MANNER_INDEX = MANNER_ARRAY.indexOf(MANNER);
			if (EXISTED_MANNER_INDEX === -1) {
				MANNER_ARRAY.push(MANNER);
				MANNER_CUBE_ARRAY.push([cloned]);

				MANNER_CUBE_COUNT_ARRAY.push(1);

				MANNER_CUBE_COUNT_OF_ROWS_2_ARRAY.push(IS_TWO_ROWS_CUBE ? 1 : 0);
				MANNER_CUBE_COUNT_OF_ROWS_3_ARRAY.push(IS_TWO_ROWS_CUBE ? 0 : 1);
			} else {
				++MANNER_CUBE_COUNT_ARRAY[EXISTED_MANNER_INDEX];
				if (IS_TWO_ROWS_CUBE) {
					++MANNER_CUBE_COUNT_OF_ROWS_2_ARRAY[EXISTED_MANNER_INDEX];
				} else {
					++MANNER_CUBE_COUNT_OF_ROWS_3_ARRAY[EXISTED_MANNER_INDEX];
				}

				const OLD_ARRAY = MANNER_CUBE_ARRAY[EXISTED_MANNER_INDEX];
				if (OLD_ARRAY.length < CUBE_COUNT_PER_MANNER) {
					OLD_ARRAY.push(cloned);
				}
			}
		}
	}

	function getClonedCubeByMannerIndex(
		cube: Cube,
		mannerIndex: number,
		OLD_SIX_FACES: SixFaces,
		OLD_TWELVE_EDGES: TwelveEdges,
		OLD_CELLS: CellObject[][],
		MAX_ADD_ORDER: number,
		CORE_CELL_IS_PIECE: boolean,
	) {
		const cloned = cube.clone();
		cloned.no = ++nextCubeNo;

		const { cells, actCells, sixFaces, twelveEdges } = cloned;

		const [CORE_CELL_SIX_FACE, CORE_CELL_FOUR_DIRECTION] =
			convertSixFaceTwentyFourAngleToSixFaceAndDirection(mannerIndex);
		const CORE_CELL = cells[CORE_ROW_INDEX][CORE_COL_INDEX];
		CORE_CELL.sixFace = CORE_CELL_SIX_FACE;
		CORE_CELL.faceDirection = CORE_CELL_FOUR_DIRECTION;
		for (let addOrder = 2; addOrder <= MAX_ADD_ORDER; ++addOrder) {
			cells.forEach((cellRow) =>
				cellRow.filter((cell) => cell.addOrder === addOrder).forEach(
					(cell) => {
						const { rowIndex, colIndex, relation: RELATION } = cell.relatedInformationWhenAdding;
						const RELATED_CELL = cells[rowIndex][colIndex];
						const [newSixFace, newFaceDirection] =
							convertSixFaceTwentyFourAngleToSixFaceAndDirection(
								SIX_FACE_AND_DIRECTION_RELATIONS[
									RELATED_CELL.sixFaceTwentyFourAngle
								][RELATION],
							);
						cell.sixFace = newSixFace;
						cell.faceDirection = newFaceDirection;
					},
				)
			);
		}
		// const CORE_CELL = cells[CORE_ROW_INDEX][CORE_COL_INDEX];
		if (CORE_CELL_IS_PIECE) {
			const { rowIndex, colIndex } = actCells.filter((cell) => cell.addOrder === 2)[0];
			const RELATED_CELL = cells[rowIndex][colIndex];
			const RELATION = RELATED_CELL.relatedInformationWhenAdding.relation;
			CORE_CELL.twelveEdge = getSixFaceTwentyFourAngleRelationTwelveEdge(
				RELATED_CELL.sixFaceTwentyFourAngle,
				2 - RELATION % 2 + 2 * floor(RELATION / 2),
			);
			// } else {
			//   CORE_CELL.sixFace = CORE_CELL_SIX_FACE;
			//   CORE_CELL.faceDirection = CORE_CELL_FOUR_DIRECTION;
		}

		sixFaces.forEach((face, faceIndex) => {
			face.length = 0;

			OLD_SIX_FACES.forEach((oldFaces: FaceMemberOfSixFace) => {
				if (oldFaces.length === 0) {
					log('[error]', {
						isValid: cloned.isValid,
						no: nextCubeNo,
						mannerIndex,
					}, {
						OLD_SIX_FACES,
					}, {
						cloned,
					});

					Deno.writeTextFileSync(
						`${FILE_PREFIX}_error_cube_${cube.no}.ts`,
						`const _error_cube = ${JSON.stringify(cube)};`,
					);
				}
				const [rowIndex, colIndex] = oldFaces[0];
				if (cells[rowIndex][colIndex].sixFace === faceIndex) {
					oldFaces.forEach((item) => face.push(item));
				}
			});
		});

		twelveEdges.forEach((edge) => {
			edge.pieces.forEach(([pieceRowIndex, pieceColIndex]) => {
				const PIECE_CELL = cells[pieceRowIndex][pieceColIndex];
				const { rowIndex, colIndex, relation } = PIECE_CELL.relatedInformationWhenAdding;
				let fixedRelation = relation;
				let fixedSixFaceTwentyFourAngle = 0;
				if (rowIndex === -1) {
					cells.forEach((cellRow, cellRowIndex) =>
						cellRow.forEach((cell, cellColIndex) => {
							if (cell.addOrder === 2) {
								fixedSixFaceTwentyFourAngle = cell.sixFaceTwentyFourAngle;
								const RELATION = cell.relatedInformationWhenAdding.relation;
								fixedRelation = (2 - RELATION % 2) + 2 * floor(RELATION / 2);
							}
						})
					);
				} else {
					fixedSixFaceTwentyFourAngle = cells[rowIndex][colIndex].sixFaceTwentyFourAngle;
				}
				PIECE_CELL.twelveEdge = getSixFaceTwentyFourAngleRelationTwelveEdge(
					fixedSixFaceTwentyFourAngle,
					fixedRelation,
				);
			});
		});

		// 找到新旧十二棱对应关系
		const TWELVE_EDGES_NEW_TO_OLD_ARRAY: number[] = [
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
		];
		const FINDED_TWELVE_EDGES_INDEX_ARRAY: number[] = [];
		OLD_SIX_FACES.forEach((sixFaces) => {
			sixFaces.forEach(
				([firstRowIndex, firstColIndex, secondRowIndex, secondColIndex]) => {
					if (FINDED_TWELVE_EDGES_INDEX_ARRAY.length === 12) {
						return;
					}

					relateTwelveEdge(firstRowIndex, firstColIndex);
					if (typeof secondRowIndex !== 'undefined') {
						relateTwelveEdge(secondRowIndex, secondColIndex as number);
					}

					function relateTwelveEdge(rowIndex: number, colIndex: number) {
						if (FINDED_TWELVE_EDGES_INDEX_ARRAY.length === 12) {
							return;
						}

						const oldFirstCell = OLD_CELLS[rowIndex][colIndex];
						const oldSixFaceTwentyFourAngle = oldFirstCell.sixFaceTwentyFourAngle;

						const newFirstCell = cells[rowIndex][colIndex];
						const newSixFaceTwentyFourAngle = newFirstCell.sixFaceTwentyFourAngle;

						for (
							let connectionRelation = 0;
							connectionRelation < 4;
							++connectionRelation
						) {
							const NEW = getSixFaceTwentyFourAngleRelationTwelveEdge(
								newSixFaceTwentyFourAngle,
								connectionRelation,
							);
							if (FINDED_TWELVE_EDGES_INDEX_ARRAY.indexOf(NEW) > -1) {
								continue;
							}

							const OLD = getSixFaceTwentyFourAngleRelationTwelveEdge(
								oldSixFaceTwentyFourAngle,
								connectionRelation,
							);
							FINDED_TWELVE_EDGES_INDEX_ARRAY.push(NEW);
							TWELVE_EDGES_NEW_TO_OLD_ARRAY[NEW] = OLD;
						}
					}
				},
			);
		});

		twelveEdges.forEach((edge, edgeIndex) => {
			edge.pieces.length = 0;

			TWELVE_EDGES_NEW_TO_OLD_ARRAY.forEach((oldValue, oldIndex) => {
				if (oldValue === edgeIndex) {
					const OLD_TWELVE_EDGE = OLD_TWELVE_EDGES[oldIndex];
					edge.canBeInserted = OLD_TWELVE_EDGE.canBeInserted;

					OLD_TWELVE_EDGE.pieces.forEach((item) => edge.pieces.push(item));
				}
			});
		});

		return cloned;
	}

	log({
		totalCubeCount,
		totalMiddleCubeCount,

		global_removed_middle_cube_count,

		thisCubeCount,
		thisMiddleCubeCount,
		// MIDDLE_CUBE_ARRAY_LENGTH: MIDDLE_CUBE_ARRAY.length,
		MIDDLE_CUBE_COUNT_ARRAY,

		CUT_MANNER_COUNT_ARRAY,
		CUT_MANNER_ARRAY_LENGTH: CUT_MANNER_ARRAY.length,

		SIMPLE_MANNER_ARRAY_LENGTH: SIMPLE_MANNER_ARRAY.length,
		SIMPLE_DATA_ARRAY_LENGTH: SIMPLE_DATA_ARRAY.length,
	});
}

// for (let rowCountIndex = 2; rowCountIndex <= 3; ++rowCountIndex) {
// COL_INDEX_ARRAY_MORE_THAN_THREE_ROW.forEach((coreRowColIndexArray) => {
// countByRowCountAndColIndexArray(rowCountIndex, coreRowColIndexArray);
// });
// }

for (let rowCountIndex = 2; rowCountIndex <= 2; ++rowCountIndex) {
	COL_INDEX_ARRAY_MORE_THAN_THREE_ROW.forEach((coreRowColIndexArray) => {
		countByRowCountAndColIndexArray(rowCountIndex, coreRowColIndexArray);
	});
}

for (let rowCountIndex = 3; rowCountIndex <= 3; ++rowCountIndex) {
	[
		[0],
		[1],
		[2],
		[3],
		[4],
		[0, 1],
		[0, 2],
		[0, 3],
		[0, 4],
		[0, 1],
		[1, 2],
		[1, 3],
		[1, 4],
		[0, 2],
		[1, 2],
		[2, 3],
		[2, 4],
		[0, 3],
		[1, 3],
		[2, 3],
		[3, 4],
		[0, 4],
		[1, 4],
		[2, 4],
		[3, 4],
	].forEach((coreRowColIndexArray) => {
		countByRowCountAndColIndexArray(rowCountIndex, coreRowColIndexArray);
	});
}
for (let rowCountIndex = 3; rowCountIndex <= 3; ++rowCountIndex) {
	[
		[2, 3, 4],
		[1, 3, 4],
		[1, 2, 4],
		[1, 2, 3],
		[2, 3, 4],
		[0, 3, 4],
		[0, 2, 4],
		[0, 2, 3],
		[1, 3, 4],
		[0, 3, 4],
		[0, 1, 4],
		[0, 1, 3],
		[1, 2, 4],
		[0, 2, 4],
		[0, 1, 4],
		[0, 1, 2],
		[1, 2, 3],
		[0, 2, 3],
		[0, 1, 3],
		[0, 1, 2],
		[1, 2, 3, 4],
		[0, 2, 3, 4],
		[0, 1, 3, 4],
		[0, 1, 2, 4],
		[0, 1, 2, 3],
		[0, 1, 2, 3, 4],
	].forEach((coreRowColIndexArray) => {
		countByRowCountAndColIndexArray(rowCountIndex, coreRowColIndexArray);
	});
}

if (global_removed_middle_cube_count) {
	log('removed middle cube count:', global_removed_middle_cube_count);
}

if (DEBUG.SHOW_CUT_MANNERS) {
	Deno.writeTextFileSync(
		'./cutMannerArray.ts',
		`export const cutMannerArray = ${JSON.stringify(CUT_MANNER_ARRAY)};`,
	);
	Deno.writeTextFileSync(
		'./cutMannerCountArray.ts',
		`export const cutMannerCountArray = ${JSON.stringify(CUT_MANNER_COUNT_ARRAY)};`,
	);
	log(`CUT_MANNER_ARRAY.length:`, CUT_MANNER_ARRAY.length);
	log(`CUT_MANNER_COUNT_ARRAY:`, CUT_MANNER_COUNT_ARRAY);
}

Deno.writeTextFileSync(
	`simple_manner.txt`,
	JSON.stringify(SIMPLE_MANNER_ARRAY),
);
const SIMPLE_MANNER_STRING = JSON.stringify(SIMPLE_DATA_ARRAY);
Deno.writeTextFileSync(
	`simple_manner_details.js`,
	`const MANNERS = ${SIMPLE_MANNER_STRING};`,
);

showUsedTime('end');
log(`end: ${(new Date()).toLocaleString()}`);
logUsedTime('Total used ', performance.now() - DATE_BEGIN);

/*
cd /d P:\anqi\Desktop\tech\ts\_bak\203_ts_ghostkube\!important\data\240419A\

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\cubeCompute3.ts

*/
