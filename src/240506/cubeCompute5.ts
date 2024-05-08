/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * src\cubeCompute5.ts v0.0.1
 * deno 1.42.1 + VSCode 1.88.0
 *
 * <en_us>
 * Created on Thu Apr 25 2024 14:17:34
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年4月25日 14:17:34
 * 功能：计算所有正方体清单。此次，修改算法：先确定纸模中间各线的情况，再尝试“从第二行第一列开始，是否可行。第二行第二列、第三列、第四列、第五列，依次尝试”（后来更改顺序为：第三列、第二列、第四列、第一列、第五列）。再后来更改为：仅获取中间正方体。
 * 注意：已按照步骤拆分
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年4月25日 14:17:34
 * 功能：
 * </zh_tw>
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
	SixFaceTwentyFourAngleToTwelveEdge,
	TwelveEdge,
	TwelveEdges,
} from './cubeCore.ts';

log(`begin: ${(new Date()).toLocaleString()}`);
const DATE_BEGIN = performance.now();

const DEBUG = {
	// false true
	// OUTPUT_MIDDLE_FILE: true, // removed
	NOT_CONVERT_CUBE_FROM_MIDDLE_CUBE: true,
	MIDDLE_CUBE_BATCH_DEAL_COUNT: 10000,

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

	SHOW_CUBE_WHEN_OK_IN_COUNT_BY_LINES: false,
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
const CUBE_NO_ARRAY: number[] = [];

const MIDDLE_CUBE_ARRAY: Cube[] = [];
const MIDDLE_CUBE_COUNT_ARRAY: number[] = [0, 0, 0, 0, 0, 0];

const CUT_MANNER_COUNT_ARRAY: number[] = [0, 0, 0, 0, 0, 0];
const CUT_MANNER_ARRAY: string[] = [];

const SIMPLE_MANNER_ARRAY: string[] = [];
const SIMPLE_DATA_ARRAY: {
	manner: string;
	cube: Cube;
}[] = [];

const CORE_COL_INDEX_ORDER_ARRAY = [3, 1, 2, 0, 4];

let totalCubeCount = 0;
let totalMiddleCubeCount = 0;

let callTimes = 0;

// COL_INDEX_ARRAY: number[],
function countByRowCount(
	ROW_COUNT: number,
) {
	let thisMiddleCubeCount = 0;
	let thisCubeCount = 0;
	let CORE_COL_INDEX = 0;
	let thisLineMannerCount = 0;
	let thisLineMannerIndex = 0;

	const FILE_PREFIX = `${ROW_COUNT}rows_${COL_COUNT}cols_`;
	const OUTPUT_LARGE_FILES = true; // ROW_COUNT === 2;

	//   const MIDDLE_CUBE_BATCH_DEAL_COUNT = 1; // OUTPUT_LARGE_FILES ? 100 : 100000;
	const { MIDDLE_CUBE_BATCH_DEAL_COUNT } = DEBUG; // OUTPUT_LARGE_FILES ? 100 : 100000;

	const CUBE_COUNT_PER_MANNER = ROW_COUNT === 2 ? 100000 : 2;

	CUBES.length = 0;
	MIDDLE_CUBE_ARRAY.length = 0;

	const MAX_ROW_INDEX = ROW_COUNT - 1;

	const CELL_COUNT = COL_COUNT * ROW_COUNT;
	// const CELL_MAX_INDEX = CELL_COUNT - 1;
	const RECURISE_QUIT_NUMBER = CELL_COUNT + 1;

	const CORE_ROW_INDEX = ROW_COUNT <= 4 ? 1 : 2;

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

	showUsedTime(
		`\n${new Date().toLocaleTimeString()} ${
			(++callTimes).toString().padStart(0, 3)
		} ${FILE_PREFIX}\nbefore countMiddleCubes()`,
	);
	function countMiddleCubes() {
		// log(new Date());

		// let addNextGroupCallTimes = 0;

		let nextMiddleCubeNo = totalMiddleCubeCount;

		function countAndPushIfOk(simpleCube: SimpleCube) {
			// simpleCube.count();

			// log(`call countAndPushIfOk(), simpleCube.isValid: ${simpleCube.isValid}`);

			// 判断cube的情况，若符合条件，则推入（同一纸模多种不同折叠方式；1变24）
			// if (simpleCube.isValid) {
			// log(`call countAndPushIfOk(), simpleCube is valid.`);
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
					goalCell.twelveEdge = sourceCell.twelveEdge;

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
				// log('before appendMiddleCube, cube.sixFaces', cube.sixFaces);
				appendMiddleCube(cube);
			}
			// }
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

			if (!DEBUG.NOT_CONVERT_CUBE_FROM_MIDDLE_CUBE) {
				MIDDLE_CUBE_ARRAY.forEach((middleCube) => batchAppendCube(middleCube));
			}

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
					cubeArray.filter((cube) => CUBE_NO_ARRAY.indexOf(cube.no) === -1).forEach((cube) => {
						CUBES.push(cube);
						CUBE_NO_ARRAY.push(cube.no);
					});
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
			//   log(`call dealMiddleCubes(), MIDDLE_CUBE_COUNT:${MIDDLE_CUBE_COUNT}, MIDDLE_CUBE_ARRAY.length:${MIDDLE_CUBE_ARRAY.length}, thisMiddleCubeCount:${thisMiddleCubeCount}`);
		}

		function countMiddleCube() {
			const HORIZONTAL_LINE_COUNT = COL_COUNT * (ROW_COUNT - 1);
			const HORIZONTAL_LINE_MAX_INDEX = HORIZONTAL_LINE_COUNT - 1;

			const VERTICAL_LINE_COUNT = (COL_COUNT - 1) * ROW_COUNT;
			const VERTICAL_LINE_MAX_INDEX = VERTICAL_LINE_COUNT - 1;

			const LINE_COUNT = HORIZONTAL_LINE_COUNT + VERTICAL_LINE_COUNT;

			const HORIZONTAL_LINE_ARRAY: number[] = [];
			const VERTICAL_LINE_ARRAY: number[] = [];

			for (
				let horizontalLineIndex = 0;
				horizontalLineIndex < HORIZONTAL_LINE_COUNT;
				++horizontalLineIndex
			) {
				HORIZONTAL_LINE_ARRAY.push(2);
			}
			for (
				let verticalLineIndex = 0;
				verticalLineIndex < VERTICAL_LINE_COUNT;
				++verticalLineIndex
			) {
				VERTICAL_LINE_ARRAY.push(2);
			}

			//   let times = 0;
			const COUNT = Math.pow(2, LINE_COUNT);
			thisLineMannerCount = COUNT;
			// const BINARY_STRING_ARRAY: string[] = [];
			// const LINE_STRING_ARRAY: string[] = [];
			for (let i = 0; i < COUNT; ++i) {
				const BINARY_STRING = i.toString(2).padStart(LINE_COUNT, '0');
				BINARY_STRING.split('').forEach((value, index) => {
					if (index < HORIZONTAL_LINE_COUNT) {
						HORIZONTAL_LINE_ARRAY[index] = value === '1' ? 3 : 2;
					} else {
						VERTICAL_LINE_ARRAY[index - HORIZONTAL_LINE_COUNT] = value === '1' ? 3 : 2;
					}
				});

				// const LINE_STRING  = `${HORIZONTAL_LINE_ARRAY.join('')}${VERTICAL_LINE_ARRAY.join('')}`;
				// log(`${BINARY_STRING}\t${LINE_STRING}`);
				// BINARY_STRING_ARRAY.push(BINARY_STRING);
				// LINE_STRING_ARRAY.push(LINE_STRING);

				if (!HORIZONTAL_LINE_ARRAY.filter((value) => value === 2).length) {
					continue;
				}
				if (!VERTICAL_LINE_ARRAY.filter((value) => value === 2).length) {
					continue;
				}

				const EMPTY_CELL_POSITOIN_ARRAY: [number, number][] = [];
				VERTICAL_LINE_ARRAY.forEach((verticalLine, index) => {
					if (verticalLine === 2) {
						return;
					}

					const verticalColIndex = index % MAX_COL_INDEX;
					const rowIndex = Math.floor(index / MAX_COL_INDEX);
					const LOOP_COUNT = verticalColIndex === 3 ? 2 : 1;
					for (let iOffset = 1; iOffset <= LOOP_COUNT; ++iOffset) {
						const colIndex = verticalColIndex - 1 + iOffset;
						// const ADDRESS = `${rowIndex}${colIndex}`;
						const ADDRESS = [rowIndex, colIndex];

						if (rowIndex === 0) {
							if (HORIZONTAL_LINE_ARRAY[colIndex] === 3) {
								if (
									colIndex === 0 || colIndex === 4 ||
									VERTICAL_LINE_ARRAY[index - 1] === 3
								) {
									EMPTY_CELL_POSITOIN_ARRAY.push(ADDRESS);
								}
							}
							return;
						}

						if (rowIndex === MAX_ROW_INDEX) {
							if (
								HORIZONTAL_LINE_ARRAY[COL_COUNT * rowIndex + colIndex] === 3
							) {
								if (
									colIndex === 0 || colIndex === 4 ||
									VERTICAL_LINE_ARRAY[index - 1] === 3
								) {
									EMPTY_CELL_POSITOIN_ARRAY.push(ADDRESS);
								}
							}
							return;
						}

						if (
							HORIZONTAL_LINE_ARRAY[COL_COUNT * (rowIndex - 1) + colIndex] ===
								3 &&
							HORIZONTAL_LINE_ARRAY[COL_COUNT * rowIndex + colIndex] === 3
						) {
							if (
								colIndex === 0 || colIndex === 4 ||
								VERTICAL_LINE_ARRAY[index - 1] === 3
							) {
								EMPTY_CELL_POSITOIN_ARRAY.push(ADDRESS);
							}
						}
					}
				});

				let notEmptyRowCount = 0;
				for (let rowLoop = 0; rowLoop < ROW_COUNT; ++rowLoop) {
					if (
						EMPTY_CELL_POSITOIN_ARRAY.filter(([rowIndex, colIndex]) => rowIndex === rowLoop)
							.length < ROW_COUNT
					) {
						++notEmptyRowCount;
					}
				}
				if (notEmptyRowCount < ROW_COUNT) {
					continue;
				}

				let notEmptyColCount = 0;
				for (let colLoop = 0; colLoop < COL_COUNT; ++colLoop) {
					if (
						EMPTY_CELL_POSITOIN_ARRAY.filter(([rowIndex, colIndex]) => colIndex === colLoop)
							.length < COL_COUNT
					) {
						++notEmptyColCount;
					}
				}
				if (notEmptyColCount < COL_COUNT) {
					continue;
				}

				// ++times;
				++thisLineMannerIndex;

				// temp
				// if(thisCubeCount >= 168) {
				// 	break;
				// }

				// countByLines(
				// 	HORIZONTAL_LINE_ARRAY,
				// 	VERTICAL_LINE_ARRAY,
				// 	EMPTY_CELL_POSITOIN_ARRAY,
				// );

				// if (
				//   ROW_COUNT === 2 && HORIZONTAL_LINE_ARRAY.join("") === "33233" &&
				//   VERTICAL_LINE_ARRAY.join("") === "2".repeat(8)
				// ) {
				//   ++countByLinesCallTimes;
				//   countByLines(
				//     HORIZONTAL_LINE_ARRAY,
				//     VERTICAL_LINE_ARRAY,
				//     EMPTY_CELL_POSITOIN_ARRAY,
				//   );
				// }

				// if(ROW_COUNT === 2 && HORIZONTAL_LINE_ARRAY.join('') === '22222' && VERTICAL_LINE_ARRAY.join('') === '2'.repeat(8)) {
				//   countByLines(
				//   	HORIZONTAL_LINE_ARRAY,
				//   	VERTICAL_LINE_ARRAY,
				//   	EMPTY_CELL_POSITOIN_ARRAY,
				//   );
				// }

				countByLines(
					HORIZONTAL_LINE_ARRAY,
					VERTICAL_LINE_ARRAY,
					EMPTY_CELL_POSITOIN_ARRAY,
				);
			}

			// showUsedTime(`countMiddleCube(), ${HORIZONTAL_LINE_COUNT} * ${VERTICAL_LINE_COUNT} => ${times}`);
			showUsedTime(
				`\ncountMiddleCube(${ROW_COUNT}), 2 ^ (${HORIZONTAL_LINE_COUNT} + ${VERTICAL_LINE_COUNT}) = ${COUNT} => ${thisLineMannerIndex}`,
			);

			// log(`\nBINARY_STRING_ARRAY:\n${BINARY_STRING_ARRAY.join('\n')}`);
			// log(`\nLINE_STRING:\n${LINE_STRING_ARRAY.join('\n')}`);
			// Deno.writeTextFileSync('./binaryStrings.txt', BINARY_STRING_ARRAY.join('\n'));
			// Deno.writeTextFileSync('./lines.txt', LINE_STRING_ARRAY.join('\n'));

			// countMiddleCube(2), 2 ^ (5 + 8) = 8192 => 6166, used 30.77 milliseconds, or 0.031 seconds
			// countMiddleCube(3), 2 ^ (10 + 12) = 4194304 => 3930872, used 6540.23 milliseconds, or 6.540 seconds

			// countMiddleCube(2), 2 ^ (5 + 8) = 8192 => 6902 and 1,
		}

		interface PrepareJoinCellToCubeResult {
			failed: boolean;
			rowIndex: number;
			colIndex: number;
			gridLines: CellBorderLine[];
			relatedInformationWhenAdding: {
				rowIndex: number;
				colIndex: number;
				relation: ConnectionRelation;
			};
			sixFaceTwentyFourAngle: SixFaceTwentyFourAngle;
			twelveEdge: TwelveEdge;
		}

		function prepareJoinCellToCube(
			HORIZONTAL_LINE_ARRAY: number[],
			VERTICAL_LINE_ARRAY: number[],
			cube: SimpleCube,
			rowIndex: number,
			colIndex: number,
			addOrder: number,
			isCoreCell: boolean = false,
		): PrepareJoinCellToCubeResult | null {
			const { cells } = cube;

			// 如已添加，则返回null
			const CELL = cells[rowIndex][colIndex];
			if (CELL.feature !== CellFeature.Unknown) {
				return null;
			}

			const TOP_LINE_INDEX = COL_COUNT * (rowIndex - 1) + colIndex;
			const LEFT_LINE_INDEX = MAX_COL_INDEX * rowIndex + colIndex - 1;
			const gridLines: CellBorderLine[] = [
				rowIndex === 0 ? CellBorderLine.OuterLine : HORIZONTAL_LINE_ARRAY[TOP_LINE_INDEX],
				colIndex === MAX_COL_INDEX
					? CellBorderLine.OuterLine
					: VERTICAL_LINE_ARRAY[LEFT_LINE_INDEX + 1],
				rowIndex === MAX_ROW_INDEX
					? CellBorderLine.OuterLine
					: HORIZONTAL_LINE_ARRAY[TOP_LINE_INDEX + COL_COUNT],
				colIndex === 0 ? CellBorderLine.OuterLine : VERTICAL_LINE_ARRAY[LEFT_LINE_INDEX],
			];
			// log({
			// 	rowIndex,
			// 	colIndex,
			// 	isCoreCell,

			// 	TOP_LINE_INDEX,
			// 	LEFT_LINE_INDEX,
			// 	gridLines,
			// });

			if (
				gridLines.filter((line) =>
					line === CellBorderLine.OuterLine || line === CellBorderLine.CutLine
				).length === 4
			) {
				return null;
			}

			const RELATION_CELL_ADD_ORDER = addOrder - 1;

			const relatedInformationWhenAdding: {
				rowIndex: number;
				colIndex: number;
				relation: ConnectionRelation;
			} = {
				rowIndex: -1,
				colIndex: -1,
				relation: ConnectionRelation.Top,
			};

			// 检查若添加进去，是否会冲突
			let sixFaceTwentyFourAngle: SixFaceTwentyFourAngle = SixFaceTwentyFourAngle.UpOriginal;
			let twelveEdge = TwelveEdge.NotSure;
			let hasError = false;
			let relationCellCount = 0;
			// 故意交换顺序
			[gridLines[2], gridLines[3], gridLines[0], gridLines[1]].forEach(
				(line, relation) => {
					if (hasError) {
						return;
					}

					const RELATION_CELL_ROW_INDEX = rowIndex +
						(relation % 2 === 0 ? 1 - relation : 0);
					if (
						RELATION_CELL_ROW_INDEX < 0 ||
						RELATION_CELL_ROW_INDEX > MAX_ROW_INDEX
					) {
						return;
					}

					const RELATION_CELL_COL_INDEX = (relation % 2 === 0 ? 0 : relation - 2) + colIndex;
					if (
						RELATION_CELL_COL_INDEX < 0 ||
						RELATION_CELL_COL_INDEX > MAX_COL_INDEX
					) {
						return;
					}

					const oldCell = cells[RELATION_CELL_ROW_INDEX][RELATION_CELL_COL_INDEX];
					if (
						oldCell.feature === CellFeature.Unknown ||
						oldCell.borderLines[relation] !== CellBorderLine.InnerLine
					) {
						return;
					}

					const OLD_CELL_SIX_FACE_TWENTY_FOUR_ANGLE = oldCell.sixFaceTwentyFourAngle;

					if (oldCell.addOrder === RELATION_CELL_ADD_ORDER) {
						relatedInformationWhenAdding.rowIndex = oldCell.rowIndex;
						relatedInformationWhenAdding.colIndex = oldCell.colIndex;
						relatedInformationWhenAdding.relation = relation;

						// twelveEdge = SixFaceTwentyFourAngleToTwelveEdge[OLD_CELL_SIX_FACE_TWENTY_FOUR_ANGLE][relation];
						twelveEdge = getSixFaceTwentyFourAngleRelationTwelveEdge(
							OLD_CELL_SIX_FACE_TWENTY_FOUR_ANGLE,
							relation,
						);
					}

					++relationCellCount;
					const currentSixFaceTwentyFourAngle = SIX_FACE_AND_DIRECTION_RELATIONS[
						OLD_CELL_SIX_FACE_TWENTY_FOUR_ANGLE
					][relation];
					if (relationCellCount === 1) {
						sixFaceTwentyFourAngle = currentSixFaceTwentyFourAngle;

						return;
					}

					if (sixFaceTwentyFourAngle !== currentSixFaceTwentyFourAngle) {
						hasError = true;
					}
				},
			);

			if (!isCoreCell && relatedInformationWhenAdding.rowIndex === -1) {
				return null;
			}

			// if (hasError) {
			// 	return null;
			// }

			return {
				failed: hasError,
				rowIndex,
				colIndex,
				gridLines,
				relatedInformationWhenAdding,
				sixFaceTwentyFourAngle,
				twelveEdge,
			};
		}

		function countByLines(
			HORIZONTAL_LINE_ARRAY: number[],
			VERTICAL_LINE_ARRAY: number[],
			EMPTY_CELL_POSITOIN_ARRAY: [number, number][],
		) {
			// log(
			// 	`\ncountByLines([${HORIZONTAL_LINE_ARRAY}], [${VERTICAL_LINE_ARRAY}], [${EMPTY_CELL_POSITOIN_ARRAY}])`,
			// );

			LABLE_OUTER_LOOP: for (
				let coreColLoop = 0;
				coreColLoop < 5;
				++coreColLoop
			) {
				const coreColIndex = CORE_COL_INDEX_ORDER_ARRAY[coreColLoop];
				// // temp
				// if (coreColIndex !== 2) {
				//   continue;
				// }

				if (
					EMPTY_CELL_POSITOIN_ARRAY.filter(([rowIndex, colIndex]) => {
						rowIndex === CORE_ROW_INDEX && colIndex === coreColIndex;
					}).length
				) {
					continue LABLE_OUTER_LOOP;
				}

				CORE_COL_INDEX = coreColIndex;

				const cube = new SimpleCube(ROW_COUNT, COL_COUNT);
				const NEXT_CELL_POSITION_ARRAY: PrepareJoinCellToCubeResult[] = [];

				const CORE_CELL_INFO = prepareJoinCellToCube(
					HORIZONTAL_LINE_ARRAY,
					VERTICAL_LINE_ARRAY,
					cube,
					CORE_ROW_INDEX,
					CORE_COL_INDEX,
					1,
					true,
				);
				if (CORE_CELL_INFO === null) {
					continue LABLE_OUTER_LOOP;
				}
				// log(`core cell is ok: ${coreColIndex}, ${JSON.stringify(CORE_CELL_INFO)}`);
				NEXT_CELL_POSITION_ARRAY.push(CORE_CELL_INFO);

				for (let addOrder = 1; addOrder < CELL_COUNT; ++addOrder) {
					if (!NEXT_CELL_POSITION_ARRAY.length && addOrder > 1) {
						if (DEBUG.SHOW_CUBE_WHEN_OK_IN_COUNT_BY_LINES) {
							log(
								`\nok: ${addOrder}, core: ${CORE_ROW_INDEX}${CORE_COL_INDEX}\t${
									HORIZONTAL_LINE_ARRAY.join('')
								}\t${VERTICAL_LINE_ARRAY.join('')} => cells count: ${
									cube.cells.map((row) =>
										row.filter((cell) => cell.feature === CellFeature.Face).map((
											cell,
										) => '1').join(
											'',
										)
									).join('').length
								}\n${
									cube.cells.map((row) =>
										row.filter((cell) => cell.feature === CellFeature.Face).map((
											cell,
										) =>
											`${cell.addOrder}: ${cell.rowIndex}${cell.colIndex}\t${
												cell.borderLines.join('')
											}\t(${
												cell.relatedInformationWhenAdding.rowIndex === -1
													? ' '
													: cell.relatedInformationWhenAdding.rowIndex
											},${
												cell.relatedInformationWhenAdding.colIndex === -1
													? ' '
													: cell.relatedInformationWhenAdding.colIndex
											}) ${cell.relatedInformationWhenAdding.relation}\t${cell.sixFace}+${
												cell.faceDirection.toString().padStart(3, ' ')
											}${cell.twelveEdge.toString().padStart(3, ' ')}${
												cell.sixFaceTwentyFourAngle.toString().padStart(3, ' ')
											}`
										).join('\n')
									).join('\n')
								}`,
							);
						}

						// countAndPushIfOk(cube);
						cube.count();
						// log(`cube.isValid: ${cube.isValid}`);
						if (cube.isValid) {
							countAndPushIfOk(cube);

							// 已找到合适的方案，直接退出方法！
							return;
						} else {
							continue LABLE_OUTER_LOOP;
						}
					}

					// log(`next: ${addOrder} => ${JSON.stringify(NEXT_CELL_POSITION_ARRAY)}`);

					// log(
					// 	`\nnext: ${addOrder} => \n${
					// 		NEXT_CELL_POSITION_ARRAY.map((item) =>
					// 			`${item.rowIndex}${item.colIndex}_${
					// 				item.gridLines.join('')
					// 			}_(${item.relatedInformationWhenAdding.rowIndex},${item.relatedInformationWhenAdding.colIndex})${item.relatedInformationWhenAdding.relation}_${item.sixFaceTwentyFourAngle}`
					// 		).join('\n')
					// 	}`,
					// );

					if (NEXT_CELL_POSITION_ARRAY.filter((item) => item.failed).length) {
						continue LABLE_OUTER_LOOP;
					}

					NEXT_CELL_POSITION_ARRAY.forEach(({
						rowIndex,
						colIndex,
						gridLines,
						relatedInformationWhenAdding,
						sixFaceTwentyFourAngle,
						twelveEdge,
					}) => {
						const cell = cube.cells[rowIndex][colIndex];
						cell.addOrder = addOrder;
						gridLines.forEach((value, index) => cell.borderLines[index] = value);

						cell.feature = CellFeature.Face;
						const [sixFace, faceDirection] = convertSixFaceTwentyFourAngleToSixFaceAndDirection(
							sixFaceTwentyFourAngle,
						);
						cell.sixFace = sixFace;
						cell.faceDirection = faceDirection;
						cell.twelveEdge = twelveEdge;

						cell.relatedInformationWhenAdding.rowIndex = relatedInformationWhenAdding.rowIndex;
						cell.relatedInformationWhenAdding.colIndex = relatedInformationWhenAdding.colIndex;
						cell.relatedInformationWhenAdding.relation = relatedInformationWhenAdding.relation;
					});
					NEXT_CELL_POSITION_ARRAY.length = 0;

					for (let rowIndex = 0; rowIndex < ROW_COUNT; ++rowIndex) {
						for (let colIndex = 0; colIndex < COL_COUNT; ++colIndex) {
							if (
								EMPTY_CELL_POSITOIN_ARRAY.filter((
									[emptyRowIndex, emptyColIndex],
								) => emptyRowIndex === rowIndex && emptyColIndex === colIndex)
									.length
							) {
								continue;
							}

							const result = prepareJoinCellToCube(
								HORIZONTAL_LINE_ARRAY,
								VERTICAL_LINE_ARRAY,
								cube,
								rowIndex,
								colIndex,
								addOrder + 1,
							);
							if (result !== null) {
								NEXT_CELL_POSITION_ARRAY.push(result);
							}
						}
					}
				}
			}
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
		if (COUNT === 0) {
			return;
		}
		thisCubeCount += COUNT;
		totalCubeCount += COUNT;
		// JSON.stringify(CUBES)
		// , index: ${currentMiddleCubeIndex}
		// showUsedTime(
		//   `before appendCubesToFile: ${CUBE_FILE_NAME}, ${thisLineMannerIndex.toString().padStart(8)}/${thisLineMannerCount.toString().padStart(8)} CUBES.length: ${COUNT} => ${
		//     thisCubeCount.toString().padStart(8)
		//   }`,
		// );
		CUBES.sort((prev, next) => prev.no - next.no);
		try {
			Deno.writeTextFileSync(
				CUBE_FILE_NAME,
				CUBES.map((cube) => JSON.stringify(cube)).join(',\n').concat(',\n'),
				APPEND_FLAG,
			);
		} catch (error) {
			log('[Error]', error, 'appendCubesToFile()');
		}

		CUBES.length = 0;
		// showUsedTime(`after appendCubesToFile: ${CUBE_FILE_NAME}`);
		// showUsedTime(
		// 	`after appendCubesToFile: ${CUBE_FILE_NAME}, ${thisLineMannerIndex.toString().padStart(8)}/${thisLineMannerCount}, add ${COUNT} cubes => ${
		// 	  thisCubeCount.toString().padStart(8)
		// 	}, CUBES.length: ${CUBES.length}`,
		//   );
		showUsedTime(
			`after appendCubesToFile: ${CUBE_FILE_NAME}, ${
				thisLineMannerIndex.toString().padStart(8)
			}/${thisLineMannerCount}, add ${COUNT} cubes => ${
				thisCubeCount.toString().padStart(8)
			}, CUT_MANNER_ARRAY_LENGTH: ${CUT_MANNER_ARRAY.length}, SIMPLE_MANNER_ARRAY_LENGTH: ${SIMPLE_MANNER_ARRAY.length}, SIMPLE_DATA_ARRAY_LENGTH: ${SIMPLE_DATA_ARRAY.length}`,
		);

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
				twelveEdge,
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
					faceOptionalPieceArrayArray[sixFace][twelveEdge % 4].push(
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

		// {
		// 	let i = 0;

		// 	upFaceOptionalMannerArray.forEach((upItem, upIndex) => {
		// 	  downFaceOptionalMannerArray.forEach((downItem, downIndex) => {
		// 		leftFaceOptionalMannerArray.forEach((leftItem, leftIndex) => {
		// 		  rightFaceOptionalMannerArray.forEach((rightItem, rightIndex) => {
		// 			frontFaceOptionalMannerArray.forEach((frontItem, frontIndex) => {
		// 			  backFaceOptionalMannerArray.forEach((backItem, backIndex) => {
		// 				++i;
		// 				log(i, {
		// 					upItem,
		// 					downItem,
		// 					leftItem,
		// 					rightItem,
		// 					frontItem,
		// 					backItem,
		// 				  },
		// 				);
		// 			  });
		// 		    });
		// 		});
		// 	  });
		// 	});
		//   });
		//   console.log('call times: ', i);
		// }

		// let times = 0;
		// 以六面不同可能组合，得到不同的粘贴方案——暂时忽略面的层次对其它面的影响
		upFaceOptionalMannerArray.forEach((upItem, upIndex) => {
			downFaceOptionalMannerArray.forEach((downItem, downIndex) => {
				leftFaceOptionalMannerArray.forEach((leftItem, leftIndex) => {
					rightFaceOptionalMannerArray.forEach((rightItem, rightIndex) => {
						frontFaceOptionalMannerArray.forEach((frontItem, frontIndex) => {
							backFaceOptionalMannerArray.forEach((backItem, backIndex) => {
								// ++times;
								const cloned = cubeOriginal.clone();
								// log(
								//   "cloned",
								//   {
								//     upItem,
								//     downItem,
								//     leftItem,
								//     rightItem,
								//     frontItem,
								//     backItem,
								//   },
								//   "cloned.sixFaces",
								//   cloned.sixFaces,
								//   "cubeOriginal.sixFaces",
								//   cubeOriginal.sixFaces,
								// );

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

								// log(
								//   "before batchAppendCubeOneToTwentyFour, sixFaces:",
								//   cloned.sixFaces,
								// );
								if (DEBUG.SHOW_MIDDLE_CUBE_CONVERT_INFO) {
									log(
										`\n\n// call batchAppendCubeOneToTwentyFour(cloned), cloned:\nconst clonedCubeOfBatchAppendCubeOneToTwentyFour = `,
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

		// log(`call times: ${times}`);
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

countByRowCount(2);
countByRowCount(3);

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

if (SIMPLE_DATA_ARRAY.length < 20480) {
	const SIMPLE_MANNER_STRING = JSON.stringify(SIMPLE_DATA_ARRAY);
	Deno.writeTextFileSync(
		`simple_manner_details.js`,
		`const MANNERS = ${SIMPLE_MANNER_STRING};`,
	);
} else {
	const FILE_NAME = 'simple_manner_details.js';
	Deno.writeTextFileSync(FILE_NAME, `const MANNERS = [`);

	const COUNT_PER_TIME = 10240;
	while (SIMPLE_DATA_ARRAY.length) {
		Deno.writeTextFileSync(
			FILE_NAME,
			SIMPLE_DATA_ARRAY.splice(0, COUNT_PER_TIME).map((item) => JSON.stringify(item)).join(',\n')
				.concat('\n'),
			APPEND_FLAG,
		);
	}

	Deno.writeTextFileSync(FILE_NAME, `;`, APPEND_FLAG);
}

showUsedTime('end');
log(`end: ${(new Date()).toLocaleString()}`);
logUsedTime('Total used ', performance.now() - DATE_BEGIN);

/*
cd /d P:\anqi\Desktop\tech\ts\_bak\203_ts_ghostkube\!important\data\240419A\
set pwd=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\cubeCompute5.ts
deno run --v8-flags=--max-old-space-size=20480 -A %pwd%\cubeCompute5.ts

*/
