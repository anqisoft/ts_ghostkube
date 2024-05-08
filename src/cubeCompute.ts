/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * src\cubeCompute.ts v0.0.1
 * deno 1.42.1 + VSCode 1.88.0
 *
 * <en_us>
 * Created on Wed May 08 2024 13:00:33
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年5月8日 13:00:33
 * 功能：合并所有步骤
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年5月8日 13:00:33
 * 功能：
 * </zh_tw>
 */

import {
  copySync,
  emptyDirSync,
  ensureDirSync,
  existsSync,
} from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";

import {
  ANGLE_COUNT,
  // AppendSiblingsOptions,
  // Cell,
  // CellAppendInfoManner,
  CellBorderLine,
  // CellBorderPosition,
  CellFeature,
  CellObject,
  // COL_INDEX_ARRAY_MORE_THAN_THREE_ROW,
  ConnectionRelation,
  convertSixFaceAndDirectionToSixFaceTwentyFourAngle,
  convertSixFaceTwentyFourAngleToSixFaceAndDirection,
  Cube,
  // CUBES,
  FaceMemberOfSixFace,
  FourDirection,
  //CUBES,
  // FourDirectionCount,
  // FourDirectionMaxIndex,
  getCubeFromJson,
  getReversedRelation,
  getSixFaceTwentyFourAngleRelationTwelveEdge,
  global_removed_middle_cube_count,
  log,
  logUsedTime,
  // NewAppendSiblingsOptions,
  OneCellRowColIndex,
  OneOfTwelveEdges,
  OneOrTwoCellRowColIndex,
  // showCubeCoreInfo,
  // showSimpleCubeCoreInfo,
  showUsedTime,
  // SiblingsAppendInfo,
  // SiblingsAppendInfoArray,
  // SimpleCell,
  SimpleCube,
  SIX_FACE_AND_DIRECTION_RELATIONS,
  SixFace,
  // SixFaceCount,
  // SixFaceMaxIndex,
  SixFaces,
  SixFaceTwentyFourAngle,
  // SixFaceTwentyFourAngleToTwelveEdge,
  TwelveEdge,
  TwelveEdges,
  // TwoCellRowColIndex,
} from "./cubeCore.ts";

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

const { floor } = Math;

const OVER_WRITE_TRUE_FLAG = { overwrite: true };
const APPEND_TRUE_FLAG = { append: true };
// const EMPTY_OBJECT = {};

const LOG_FILE_NAME = "./log.txt";

const COL_COUNT = 5;
const MAX_COL_INDEX = COL_COUNT - 1;

function step1(
  ROW_COUNT_ARRAY: number[],
  GOAL_FILE_TOP_PATH: string = "./",
) {
  const STEP_FLAG = "step1";

  if (existsSync(LOG_FILE_NAME)) {
    Deno.removeSync(LOG_FILE_NAME);
  }

  let logFilenamePostfix = "";
  logFilenamePostfix = `_${STEP_FLAG}`;

  // const GOAL_FILE_TOP_PATH = `./${STEP_FLAG}/`;
  ensureDirSync(GOAL_FILE_TOP_PATH);
  emptyDirSync(GOAL_FILE_TOP_PATH);

  log(`begin: ${(new Date()).toLocaleString()}`);
  const DATE_BEGIN = performance.now();

  const DEBUG = {
    // false true
    COUNT_LINES_ONLY: false,
    COUNT_CUT_MANNER_ONLY: false,

    MIDDLE_CUBE_BATCH_DEAL_COUNT: 10240,

    SHOW_CUT_MANNERS: true,

    SHOW_CUBE_WHEN_OK_IN_COUNT_BY_LINES: false,
  };

  const MIDDLE_CUBE_ARRAY: Cube[] = [];
  const MIDDLE_CUBE_COUNT_ARRAY: number[] = [0, 0, 0, 0, 0, 0];

  const CUT_MANNER_COUNT_ARRAY: number[] = [0, 0, 0, 0, 0, 0];
  const CUT_MANNER_ARRAY: string[] = [];

  const CORE_COL_INDEX_ORDER_ARRAY = [3, 1, 2, 0, 4];

  let totalMiddleCubeCount = 0;

  function countByRowCount(
    ROW_COUNT: number,
  ) {
    let thisLineMannerCount = 0;
    let thisLineMannerIndex = 0;

    let middleFileNo = 0;

    let thisMiddleCubeCount = 0;
    let CORE_COL_INDEX = 0;

    const CORE_ROW_INDEX = ROW_COUNT <= 4 ? 1 : 2;

    const MAX_ROW_INDEX = ROW_COUNT - 1;
    const CELL_COUNT = COL_COUNT * ROW_COUNT;

    const GOAL_FILE_PATH =
      `${GOAL_FILE_TOP_PATH}${ROW_COUNT}rows_${COL_COUNT}cols/`;

    const { MIDDLE_CUBE_BATCH_DEAL_COUNT } = DEBUG;
    const MIDDLE_FILE_NAME_PREFIX = `${GOAL_FILE_PATH}`;

    MIDDLE_CUBE_ARRAY.length = 0;
    function countMiddleCubes() {
      let nextMiddleCubeNo = totalMiddleCubeCount;

      function countAndPushIfOk(simpleCube: SimpleCube) {
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

            goalCell.addOrder = sourceCell.addOrder;

            const sourceRelatedInformationWhenAdding =
              sourceCell.relatedInformationWhenAdding;
            relatedInformationWhenAdding.rowIndex =
              sourceRelatedInformationWhenAdding.rowIndex;
            relatedInformationWhenAdding.colIndex =
              sourceRelatedInformationWhenAdding.colIndex;
            relatedInformationWhenAdding.relation =
              sourceRelatedInformationWhenAdding.relation;

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

        ++MIDDLE_CUBE_COUNT_ARRAY[ARRAY_INDEX];

        if (DEBUG.SHOW_CUT_MANNERS) {
          const CUT_MANNER = cube.gridLines.map((
            { xStart, xEnd, yStart, yEnd, lineStyle },
          ) => `${xStart}${xEnd}${yStart}${yEnd}${lineStyle}`).join(",");
          if (CUT_MANNER_ARRAY.indexOf(CUT_MANNER) === -1) {
            CUT_MANNER_ARRAY.push(CUT_MANNER);
            ++CUT_MANNER_COUNT_ARRAY[ARRAY_INDEX];
          }
          // if (lastCutManner !== CUT_MANNER) {
          //   lastCutManner = CUT_MANNER;
          //   addCutMannerToMiddleCubeNoFileContent(lastCutManner);
          // }
        }

        if (DEBUG.COUNT_CUT_MANNER_ONLY) {
          ++thisMiddleCubeCount;
        } else {
          // addCutMannerToMiddleCubeNoFileContent(cube.no.toString());
          appendMiddleCube(cube);
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

        Deno.writeTextFileSync(
          `${MIDDLE_FILE_NAME_PREFIX}${
            (++middleFileNo).toString().padStart(3, "0")
          }.txt`,
          MIDDLE_CUBE_ARRAY.map((cube) => JSON.stringify(cube)).join("\n"),
        );

        MIDDLE_CUBE_ARRAY.length = 0;
        thisMiddleCubeCount += MIDDLE_CUBE_COUNT;
      }

      function countMiddleCube() {
        const HORIZONTAL_LINE_COUNT = COL_COUNT * (ROW_COUNT - 1);

        const VERTICAL_LINE_COUNT = (COL_COUNT - 1) * ROW_COUNT;

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

        const COUNT = Math.pow(2, LINE_COUNT);
        thisLineMannerCount = COUNT;
        for (let i = 0; i < COUNT; ++i) {
          const BINARY_STRING = i.toString(2).padStart(LINE_COUNT, "0");
          BINARY_STRING.split("").forEach((value, index) => {
            if (index < HORIZONTAL_LINE_COUNT) {
              HORIZONTAL_LINE_ARRAY[index] = value === "1" ? 3 : 2;
            } else {
              VERTICAL_LINE_ARRAY[index - HORIZONTAL_LINE_COUNT] = value === "1"
                ? 3
                : 2;
            }
          });

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
              const ADDRESS = [rowIndex, colIndex] as [number, number];

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
              EMPTY_CELL_POSITOIN_ARRAY.filter(([rowIndex]) =>
                rowIndex === rowLoop
              )
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
              EMPTY_CELL_POSITOIN_ARRAY.filter(([, colIndex]) =>
                colIndex === colLoop
              )
                .length < COL_COUNT
            ) {
              ++notEmptyColCount;
            }
          }
          if (notEmptyColCount < COL_COUNT) {
            continue;
          }

          ++thisLineMannerIndex;
          if (!DEBUG.COUNT_LINES_ONLY) {
            countByLines(
              HORIZONTAL_LINE_ARRAY,
              VERTICAL_LINE_ARRAY,
              EMPTY_CELL_POSITOIN_ARRAY,
            );
          }
        }

        showUsedTime(
          `\ncountMiddleCube(${ROW_COUNT}), 2 ^ (${HORIZONTAL_LINE_COUNT} + ${VERTICAL_LINE_COUNT}) = ${COUNT} => ${thisLineMannerIndex}`,
        );

        // countMiddleCube(2), 2 ^ (5 + 8) = 8192 => 6902, used 548.48 milliseconds, or 0.548 seconds
        // countMiddleCube(3), 2 ^ (10 + 12) = 4194304 => 4036248, used 603169.41 milliseconds, or 603.169 seconds, or 10.1 minutes,
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

        // 	<en_us>en_us</en_us>
        // 	<zh_cn>如已添加，则返回null</zh_cn>
        // 	<zh_tw>zh_tw</zh_tw>
        const CELL = cells[rowIndex][colIndex];
        if (CELL.feature !== CellFeature.Unknown) {
          return null;
        }

        const TOP_LINE_INDEX = COL_COUNT * (rowIndex - 1) + colIndex;
        const LEFT_LINE_INDEX = MAX_COL_INDEX * rowIndex + colIndex - 1;
        const gridLines: CellBorderLine[] = [
          rowIndex === 0
            ? CellBorderLine.OuterLine
            : HORIZONTAL_LINE_ARRAY[TOP_LINE_INDEX],
          colIndex === MAX_COL_INDEX
            ? CellBorderLine.OuterLine
            : VERTICAL_LINE_ARRAY[LEFT_LINE_INDEX + 1],
          rowIndex === MAX_ROW_INDEX
            ? CellBorderLine.OuterLine
            : HORIZONTAL_LINE_ARRAY[TOP_LINE_INDEX + COL_COUNT],
          colIndex === 0
            ? CellBorderLine.OuterLine
            : VERTICAL_LINE_ARRAY[LEFT_LINE_INDEX],
        ];

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

        // 	<en_us>en_us</en_us>
        // 	<zh_cn>检查若添加进去，是否会冲突</zh_cn>
        // 	<zh_tw>zh_tw</zh_tw>
        let sixFaceTwentyFourAngle: SixFaceTwentyFourAngle =
          SixFaceTwentyFourAngle.UpOriginal;
        let twelveEdge = TwelveEdge.NotSure;
        let hasError = false;
        let relationCellCount = 0;

        // 	<en_us>en_us</en_us>
        // 	<zh_cn>故意交换顺序</zh_cn>
        // 	<zh_tw>zh_tw</zh_tw>
        [gridLines[2], gridLines[3], gridLines[0], gridLines[1]].forEach(
          (_line, relation) => {
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

            const RELATION_CELL_COL_INDEX =
              (relation % 2 === 0 ? 0 : relation - 2) + colIndex;
            if (
              RELATION_CELL_COL_INDEX < 0 ||
              RELATION_CELL_COL_INDEX > MAX_COL_INDEX
            ) {
              return;
            }

            const oldCell =
              cells[RELATION_CELL_ROW_INDEX][RELATION_CELL_COL_INDEX];
            if (
              oldCell.feature === CellFeature.Unknown ||
              oldCell.borderLines[relation] !== CellBorderLine.InnerLine
            ) {
              return;
            }

            const OLD_CELL_SIX_FACE_TWENTY_FOUR_ANGLE =
              oldCell.sixFaceTwentyFourAngle;

            if (oldCell.addOrder === RELATION_CELL_ADD_ORDER) {
              relatedInformationWhenAdding.rowIndex = oldCell.rowIndex;
              relatedInformationWhenAdding.colIndex = oldCell.colIndex;
              relatedInformationWhenAdding.relation = relation;

              twelveEdge = getSixFaceTwentyFourAngleRelationTwelveEdge(
                OLD_CELL_SIX_FACE_TWENTY_FOUR_ANGLE,
                relation,
              );
            }

            ++relationCellCount;
            const currentSixFaceTwentyFourAngle =
              SIX_FACE_AND_DIRECTION_RELATIONS[
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
        LABLE_OUTER_LOOP: for (
          let coreColLoop = 0;
          coreColLoop < 5;
          ++coreColLoop
        ) {
          const coreColIndex = CORE_COL_INDEX_ORDER_ARRAY[coreColLoop];
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
                    HORIZONTAL_LINE_ARRAY.join("")
                  }\t${VERTICAL_LINE_ARRAY.join("")} => cells count: ${
                    cube.cells.map((row) =>
                      row.filter((cell) => cell.feature === CellFeature.Face)
                        .map(
                          (cell) => "1",
                        ).join(
                          "",
                        )
                    ).join("").length
                  }\n${
                    cube.cells.map((row) =>
                      row.filter((cell) => cell.feature === CellFeature.Face)
                        .map(
                          (
                            cell,
                          ) =>
                            `${cell.addOrder}: ${cell.rowIndex}${cell.colIndex}\t${
                              cell.borderLines.join("")
                            }\t(${
                              cell.relatedInformationWhenAdding.rowIndex === -1
                                ? " "
                                : cell.relatedInformationWhenAdding.rowIndex
                            },${
                              cell.relatedInformationWhenAdding.colIndex === -1
                                ? " "
                                : cell.relatedInformationWhenAdding.colIndex
                            }) ${cell.relatedInformationWhenAdding.relation}\t${cell.sixFace}+${
                              cell.faceDirection.toString().padStart(3, " ")
                            }${cell.twelveEdge.toString().padStart(3, " ")}${
                              cell.sixFaceTwentyFourAngle.toString().padStart(
                                3,
                                " ",
                              )
                            }`,
                        ).join("\n")
                    ).join("\n")
                  }`,
                );
              }

              cube.count();
              if (cube.isValid) {
                countAndPushIfOk(cube);

                // 	<en_us>en_us</en_us>
                // 	<zh_cn>已找到合适的方案，直接退出方法！</zh_cn>
                // 	<zh_tw>zh_tw</zh_tw>
                return;
              } else {
                continue LABLE_OUTER_LOOP;
              }
            }

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
              gridLines.forEach((value, index) =>
                cell.borderLines[index] = value
              );

              cell.feature = CellFeature.Face;
              const [sixFace, faceDirection] =
                convertSixFaceTwentyFourAngleToSixFaceAndDirection(
                  sixFaceTwentyFourAngle,
                );
              cell.sixFace = sixFace;
              cell.faceDirection = faceDirection;
              cell.twelveEdge = twelveEdge;

              cell.relatedInformationWhenAdding.rowIndex =
                relatedInformationWhenAdding.rowIndex;
              cell.relatedInformationWhenAdding.colIndex =
                relatedInformationWhenAdding.colIndex;
              cell.relatedInformationWhenAdding.relation =
                relatedInformationWhenAdding.relation;
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

      // let lastCutManner = "";
      // const ITEM_COUNT_PER_OUTPUT = 10240;
      // const CUT_MANNER_TO_MIDDLE_CUBE_NO_FILE_CONTENT_ARRAY: string[] = [];
      // const CUT_MANNER_TO_MIDDLE_CUBE_NO_FILENAME: string =
      //   `${GOAL_FILE_TOP_PATH}cutMannerToMiddleCubeNo.txt`;
      // function addCutMannerToMiddleCubeNoFileContent(content: string) {
      //   CUT_MANNER_TO_MIDDLE_CUBE_NO_FILE_CONTENT_ARRAY.push(content);

      //   if (
      //     CUT_MANNER_TO_MIDDLE_CUBE_NO_FILE_CONTENT_ARRAY.length >
      //       ITEM_COUNT_PER_OUTPUT
      //   ) {
      //     appendCutMannerToMiddleCubeNoFileContent();
      //   }
      // }
      // function appendCutMannerToMiddleCubeNoFileContent() {
      //   if (!CUT_MANNER_TO_MIDDLE_CUBE_NO_FILE_CONTENT_ARRAY.length) {
      //     return;
      //   }

      //   Deno.writeTextFileSync(
      //     CUT_MANNER_TO_MIDDLE_CUBE_NO_FILENAME,
      //     CUT_MANNER_TO_MIDDLE_CUBE_NO_FILE_CONTENT_ARRAY.join("\n").concat(
      //       "\n",
      //     ),
      //     APPEND_TRUE_FLAG,
      //   );

      //   CUT_MANNER_TO_MIDDLE_CUBE_NO_FILE_CONTENT_ARRAY.length = 0;
      // }

      function done() {
        ensureDirSync(GOAL_FILE_PATH);
        emptyDirSync(GOAL_FILE_PATH);

        countMiddleCube();
        dealMiddleCubes();

        // appendCutMannerToMiddleCubeNoFileContent();

        totalMiddleCubeCount += thisMiddleCubeCount;
      }

      done();
    }
    countMiddleCubes();
    showUsedTime(`after countMiddleCubes() ${GOAL_FILE_PATH}`);

    log({
      totalMiddleCubeCount,

      global_removed_middle_cube_count,

      thisMiddleCubeCount,
      MIDDLE_CUBE_COUNT_ARRAY,

      thisLineMannerCount,
      thisLineMannerIndex,

      CUT_MANNER_COUNT_ARRAY,
      CUT_MANNER_ARRAY_LENGTH: CUT_MANNER_ARRAY.length,
    });
  }

  // countByRowCount(2);
  // countByRowCount(3);
  // countByRowCount(4);
  // countByRowCount(5);
  ROW_COUNT_ARRAY.forEach((rowCount) => countByRowCount(rowCount));

  if (global_removed_middle_cube_count) {
    log("removed middle cube count:", global_removed_middle_cube_count);
  }

  if (DEBUG.SHOW_CUT_MANNERS) {
    Deno.writeTextFileSync(
      `${GOAL_FILE_TOP_PATH}cutMannerArray.ts`,
      `export const cutMannerArray = ${JSON.stringify(CUT_MANNER_ARRAY)};`,
    );
    Deno.writeTextFileSync(
      `${GOAL_FILE_TOP_PATH}cutMannerCountArray.ts`,
      `export const cutMannerCountArray = ${
        JSON.stringify(CUT_MANNER_COUNT_ARRAY)
      };`,
    );
    log(`CUT_MANNER_ARRAY.length:`, CUT_MANNER_ARRAY.length);
    log(`CUT_MANNER_COUNT_ARRAY:`, CUT_MANNER_COUNT_ARRAY);
  }

  showUsedTime("end");
  log(`end: ${(new Date()).toLocaleString()}`);
  logUsedTime("Total", performance.now() - DATE_BEGIN);

  copySync(LOG_FILE_NAME, `log_${STEP_FLAG}.txt`, OVER_WRITE_TRUE_FLAG);
  copySync(
    LOG_FILE_NAME,
    `${GOAL_FILE_TOP_PATH}log${logFilenamePostfix}.txt`,
    OVER_WRITE_TRUE_FLAG,
  );
  Deno.removeSync(LOG_FILE_NAME);
}

async function step2(
  ROW_COUNT_ARRAY: number[],
  GOAL_FILE_TOP_PATH: string = "./",
  SOURCE_FILE_TOP_PATH: string = "./",
) {
  const STEP_FLAG = "step2";

  let logFilenamePostfix = "";
  logFilenamePostfix = `_${STEP_FLAG}`;

  // const GOAL_FILE_TOP_PATH = `./${STEP_FLAG}/`;
  if (GOAL_FILE_TOP_PATH.replace(/[.\/\\]/g, "").length) {
    ensureDirSync(GOAL_FILE_TOP_PATH);
    emptyDirSync(GOAL_FILE_TOP_PATH);
  }

  log(`begin: ${(new Date()).toLocaleString()}`);
  const DATE_BEGIN = performance.now();

  // const SOURCE_FILE_TOP_PATH = "./step1/";

  const GOAL_CUBE_FILE_PATH =
    `${GOAL_FILE_TOP_PATH}cubesOnlyFirstOfTwentyFour/`;
  ensureDirSync(GOAL_CUBE_FILE_PATH);
  emptyDirSync(GOAL_CUBE_FILE_PATH);

  const CHECK_FACES_LAYER_INDEX_FAILED_FILENAME =
    `${GOAL_FILE_TOP_PATH}${STEP_FLAG}_checkFacesLayerIndexFailed.txt`;
  const FIX_LONELY_FACE_OF_CUBE_FILENAME =
    `${GOAL_FILE_TOP_PATH}${STEP_FLAG}_fixLonelyFaceOfCube.txt`;
  const FIX_HIDDEN_PIECES_FILENAME =
    `${GOAL_FILE_TOP_PATH}${STEP_FLAG}_fixHiddenPieces.txt`;
  const FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT_FILENAME =
    `${GOAL_FILE_TOP_PATH}${STEP_FLAG}_fixLonelyFaceOfCubeAndAppendIt.txt`;
  const MIDDLE_CUBE_TO_FIRST_NO_FILENAME =
    `${GOAL_FILE_TOP_PATH}${STEP_FLAG}_middleCubeToFirstNo.txt`;
  const MIDDLE_FILENAME_ARRAY = [
    CHECK_FACES_LAYER_INDEX_FAILED_FILENAME,
    FIX_LONELY_FACE_OF_CUBE_FILENAME,
    FIX_HIDDEN_PIECES_FILENAME,
    FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT_FILENAME,
    MIDDLE_CUBE_TO_FIRST_NO_FILENAME,
  ];

  const CHECK_FACES_LAYER_INDEX_FAILED_FILE_CONTENT_ARRAY: string[] = [];
  const FIX_LONELY_FACE_OF_CUBE_FILE_CONTENT_ARRAY: string[] = [];
  const FIX_HIDDEN_PIECES_FILE_CONTENT_ARRAY: string[] = [];
  const FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT_FILE_CONTENT_ARRAY: string[] = [];
  const MIDDLE_CUBE_TO_FIRST_NO_FILE_CONTENT_ARRAY: string[] = [];

  const MIDDLE_FILE_CONTENT_ARRAY = [
    CHECK_FACES_LAYER_INDEX_FAILED_FILE_CONTENT_ARRAY,
    FIX_LONELY_FACE_OF_CUBE_FILE_CONTENT_ARRAY,
    FIX_HIDDEN_PIECES_FILE_CONTENT_ARRAY,
    FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT_FILE_CONTENT_ARRAY,
    MIDDLE_CUBE_TO_FIRST_NO_FILE_CONTENT_ARRAY,
  ];

  enum MiddleFileKind {
    CheckFacesLayerIndexFailed,
    FixLonelyFaceOfCube,
    FixHiddenPieces,
    FixLonelyFaceOfCubeAndAppendIt,
    MiddleCubeToFirstNo,
  }
  const LAST_MIDDLE_CUBE_NO_ARRAY = [0, 0, 0, 0, 0];
  const MIDDLE_FILE_KIND_COUNT = LAST_MIDDLE_CUBE_NO_ARRAY.length;

  function appendFile(middleFileKind: MiddleFileKind) {
    const CONTENT_ARRAY = MIDDLE_FILE_CONTENT_ARRAY[middleFileKind];
    const FILENAME = MIDDLE_FILENAME_ARRAY[middleFileKind];
    Deno.writeTextFileSync(
      FILENAME,
      CONTENT_ARRAY.join("\n").concat("\n"),
      APPEND_TRUE_FLAG,
    );
    CONTENT_ARRAY.length = 0;
  }

  const CUBE_NO_STEP = 24;

  const DEBUG = {
    // false true
    CUBE_COUNT_PER_FILE: 10240,

    // Too big: OUTPUT_ROW_COUNT_PER_TIME: 204800,
    OUTPUT_ROW_COUNT_PER_TIME: 20480,

    SHOW_MIDDLE_CUBE_CONVERT_INFO: false,
  };

  await (async () => {
    let fileNo = 0;
    let nextCubeNo = 1 - CUBE_NO_STEP;
    const CUBES: Cube[] = [];

    let currentMiddleCubeInfo = "";
    let currentMiddleCubeNo = 0;
    function appendContent(content: string, middleFileKind: MiddleFileKind) {
      const CONTENT_ARRAY = MIDDLE_FILE_CONTENT_ARRAY[middleFileKind];
      if (LAST_MIDDLE_CUBE_NO_ARRAY[middleFileKind] !== currentMiddleCubeNo) {
        CONTENT_ARRAY.push(currentMiddleCubeInfo);

        LAST_MIDDLE_CUBE_NO_ARRAY[middleFileKind] = currentMiddleCubeNo;
      }

      CONTENT_ARRAY.push(content);
      const COUNT = CONTENT_ARRAY.length;

      if (COUNT >= DEBUG.OUTPUT_ROW_COUNT_PER_TIME) {
        appendFile(middleFileKind);
      }
    }

    for (let rowCountLoop = 2; rowCountLoop <= 5; ++rowCountLoop) {
      const ROW_COUNT = rowCountLoop;
      if (!ROW_COUNT_ARRAY.filter((value) => value === ROW_COUNT).length) {
        continue;
      }

      const SOURCE_FILE_PATH =
        `${SOURCE_FILE_TOP_PATH}${ROW_COUNT}rows_${COL_COUNT}cols/`;
      if (!existsSync(SOURCE_FILE_PATH)) {
        continue;
      }

      for await (const dirEntry of Deno.readDir(SOURCE_FILE_PATH)) {
        const filename = path.join(SOURCE_FILE_PATH, dirEntry.name);
        const stats = Deno.statSync(filename);
        if (stats.isFile) {
          console.log(filename);
          Deno.readTextFileSync(filename).split("\n").forEach((codeLine) => {
            batchAppendCube(getCubeFromJson(codeLine));
          });
        }
      }
    }
    outputCubes();

    function batchAppendCube(cubeOriginal: Cube) {
      // currentMiddleCubeInfo = `\n\nbatchAppendCube(), cubeOriginal: \n${
      //   JSON.stringify(cubeOriginal)
      // }\n`;

      currentMiddleCubeNo = cubeOriginal.no;
      currentMiddleCubeInfo = `batchAppendCube(${currentMiddleCubeNo}):`;

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

        const TWENTY_FOUR_ANGLE =
          convertSixFaceAndDirectionToSixFaceTwentyFourAngle(
            sixFace,
            faceDirection,
          );
        const ITEM = twentyFourAngelFaceOrPieceArray[TWENTY_FOUR_ANGLE];
        const cellRowColIndex: OneCellRowColIndex = [rowIndex, colIndex];

        switch (
          borderLines.filter((borderLine: CellBorderLine) =>
            borderLine === CellBorderLine.InnerLine
          )
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
        log("\nconst faceOptionalPieceArrayMap = ");
        log({
          upFaceOptionalPieceArray,
          downFaceOptionalPieceArray,
          leftFaceOptionalPieceArray,
          rightFaceOptionalPieceArray,
          frontFaceOptionalPieceArray,
          backFaceOptionalPieceArray,
        });
        log(";");
        log("\nconst faceOptionalMannerArrayMap = ");
        log({
          upFaceOptionalMannerArray,
          downFaceOptionalMannerArray,
          leftFaceOptionalMannerArray,
          rightFaceOptionalMannerArray,
          frontFaceOptionalMannerArray,
          backFaceOptionalMannerArray,
        });
        log(";");
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
                  // cloned.twelveEdges.forEach((twelveEdge) => {
                  //   if (twelveEdge.pieces.length) {
                  //     twelveEdge.canBeInserted = true;
                  //     return;
                  //   }
                  // });
                  cloned.twelveEdges.forEach((twelveEdge) => {
                    twelveEdge.canBeInserted = !!twelveEdge.pieces.length;
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
                          const IS_FACE =
                            typeof secondRowIndex === "undefined" ||
                            typeof secondColIndex === "undefined";
                          const FIRST_ROW_COL_INDEX =
                            `${firstRowIndex}_${firstColIndex}`;
                          if (
                            USED_ROW_COL_INDEX.indexOf(FIRST_ROW_COL_INDEX) ===
                              -1
                          ) {
                            USED_ROW_COL_INDEX.push(FIRST_ROW_COL_INDEX);
                            cloned.cells[firstRowIndex][firstColIndex]
                              .layerIndex = ++layerIndex;
                          }
                          if (!IS_FACE) {
                            const SECOND_ROW_COL_INDEX =
                              `${secondRowIndex}_${secondColIndex}`;
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
                    const IS_FACE = typeof secondRowIndex === "undefined" ||
                      typeof secondColIndex === "undefined";
                    const FIRST_ROW_COL_INDEX =
                      `${firstRowIndex}_${firstColIndex}`;
                    if (
                      USED_ROW_COL_INDEX.indexOf(FIRST_ROW_COL_INDEX) === -1
                    ) {
                      USED_ROW_COL_INDEX.push(FIRST_ROW_COL_INDEX);
                      cloned.cells[firstRowIndex][firstColIndex].layerIndex =
                        ++layerIndex;
                    }
                    if (!IS_FACE) {
                      const SECOND_ROW_COL_INDEX =
                        `${secondRowIndex}_${secondColIndex}`;
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
                            cells[findRowIndex][findColIndex].feature =
                              CellFeature.Face;
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

                  const sixFaceTwentyFourAngleOfSixFaceOutestCellArray:
                    SixFaceTwentyFourAngle[] = [];
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
                                  pieceCell.layerIndex =
                                    cells[rowIndex - 1][colIndex].layerIndex +
                                    1;
                                  break;
                                case ConnectionRelation.Bottom:
                                  pieceCell.layerIndex =
                                    cells[rowIndex + 1][colIndex].layerIndex +
                                    1;
                                  break;
                                case ConnectionRelation.Left:
                                  pieceCell.layerIndex =
                                    cells[rowIndex][colIndex - 1].layerIndex +
                                    1;
                                  break;
                                case ConnectionRelation.Right:
                                  pieceCell.layerIndex =
                                    cells[rowIndex][colIndex + 1].layerIndex +
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
                        pieceCell.layerIndex =
                          cells[relatedRowIndex][relatedColIndex].layerIndex +
                          1;
                      }
                    });
                  });

                  // appendCubeWithoutOneToTwentyFour(cloned);
                  if (cloned.checkFacesLayerIndex()) {
                    fixLonelyFaceOfCubeAndAppendIt(cloned);
                  } else {
                    // Deno.writeTextFileSync(
                    //   CHECK_FACES_LAYER_INDEX_FAILED_FILENAME,
                    //   JSON.stringify(cloned),
                    //   APPEND_TRUE_FLAG,
                    // );
                    appendContent(
                      JSON.stringify(cloned),
                      MiddleFileKind.CheckFacesLayerIndexFailed,
                    );
                  }
                });
              });
            });
          });
        });
      });

      // log(`call times: ${times}`);
    }

    /**
     * <en_us>en_us</en_us>
     * <zh_cn>检查是否有孤面，若有，则将相连的插片或其它方向又叠到同一位置的插片转为面（内外皆可）；随后处理隐藏面</zh_cn>
     * <zh_tw>zh_tw</zh_tw>
     *
     * @param cube Cube
     * <en_us>en_us</en_us>
     * <zh_cn>需修正的正方体</zh_cn>
     * <zh_tw>zh_tw</zh_tw>
     */
    function fixLonelyFaceOfCubeAndAppendIt(
      cube: Cube,
      recursiveTimes: number = 1,
    ) {
      const { cells, sixFaces, twelveEdges } = cube;
      const { cells: SOURCE_CUBE_CELLS } = cube;

      const PIECE_CELL_ARRAY: CellObject[] = [];
      twelveEdges.forEach((twelveEdge, twelveEdgeIndex) => {
        twelveEdge.pieces.forEach((piece) => {
          const [rowIndex, colIndex] = piece;
          const CELL = cells[rowIndex][colIndex];
          (CELL as unknown as { twelveEdgeIndex: number }).twelveEdgeIndex =
            twelveEdgeIndex;
          PIECE_CELL_ARRAY.push(CELL);
        });
      });

      const LONELY_FACE_CELL_ARRAY: CellObject[] = [];
      sixFaces.forEach((faces) => {
        if (faces.length > 1) {
          return;
        }

        const [firstRowIndex, firstColIndex, secondRowIndex] = faces[0];
        // 	<en_us>en_us</en_us>
        // 	<zh_cn>排除插片（只有一条内联线，无关联插片）</zh_cn>
        // 	<zh_tw>zh_tw</zh_tw>
        if (typeof secondRowIndex !== "undefined") {
          return;
        }

        const CELL = cells[firstRowIndex][firstColIndex];
        const RELATION_PIECE_CELL_ARRAY: CellObject[] = [];
        const INNER_LINE_COUNT = CELL.borderLines.filter((borderLine) =>
          borderLine === CellBorderLine.InnerLine
        ).length;
        PIECE_CELL_ARRAY.forEach((pieceCell) => {
          if (
            pieceCell.relatedInformationWhenAdding.rowIndex === firstRowIndex &&
            pieceCell.relatedInformationWhenAdding.colIndex === firstColIndex
          ) {
            RELATION_PIECE_CELL_ARRAY.push(pieceCell);
          }
        });
        if (INNER_LINE_COUNT - RELATION_PIECE_CELL_ARRAY.length === 1) {
          LONELY_FACE_CELL_ARRAY.push(CELL);

          (CELL as unknown as { relationPieceCellArray: CellObject[] })
            .relationPieceCellArray = RELATION_PIECE_CELL_ARRAY;

          const CELL_SIXFACE = CELL.sixFace;
          const SAME_FACE_PIECE_CELL_ARRAY: CellObject[] = [];
          PIECE_CELL_ARRAY.forEach((pieceCell) => {
            if (pieceCell.sixFace === CELL_SIXFACE) {
              SAME_FACE_PIECE_CELL_ARRAY.push(pieceCell);
            }
          });
          (CELL as unknown as { sameFacePieceCellArray: CellObject[] })
            .sameFacePieceCellArray = SAME_FACE_PIECE_CELL_ARRAY;
        }
      });

      const LONELY_FACE_CELL_ARRAY_LENGTH = LONELY_FACE_CELL_ARRAY.length;
      if (!LONELY_FACE_CELL_ARRAY_LENGTH) {
        fixHiddenPiecesOfCubeAndAppendIt(cube);
        return;
      }

      const CUBE_NO = cube.no;
      console.log({
        recursiveTimes,
        cubeNo: CUBE_NO,
        LONELY_FACE_CELL_ARRAY_LENGTH,
      });
      appendContent(
        `${recursiveTimes}\t${CUBE_NO}\t${LONELY_FACE_CELL_ARRAY_LENGTH}`,
        MiddleFileKind.FixLonelyFaceOfCubeAndAppendIt,
      );

      const TAB = "\t".repeat(recursiveTimes - 1);
      // Deno.writeTextFileSync(
      //   FIX_LONELY_FACE_OF_CUBE_FILENAME,
      //   `${TAB}${recursiveTimes}\t${LONELY_FACE_CELL_ARRAY.length}\n${TAB}${
      //     JSON.stringify(cube)
      //   }`,
      //   APPEND_TRUE_FLAG,
      // );
      appendContent(
        `${TAB}${recursiveTimes}\t${LONELY_FACE_CELL_ARRAY.length}\n${TAB}${
          JSON.stringify(cube)
        }`,
        MiddleFileKind.FixLonelyFaceOfCube,
      );

      const FIRST_LONELY_FACE_CELL = LONELY_FACE_CELL_ARRAY[0];
      const { sameFacePieceCellArray, relationPieceCellArray } =
        FIRST_LONELY_FACE_CELL as unknown as {
          sameFacePieceCellArray: CellObject[];
          relationPieceCellArray: CellObject[];
        };
      // Deno.writeTextFileSync(
      //   FIX_LONELY_FACE_OF_CUBE_FILENAME,
      //   `${TAB}sameFacePieceCellArray: ${
      //     JSON.stringify(sameFacePieceCellArray)
      //   }\n${TAB}relationPieceCellArray: ${
      //     JSON.stringify(relationPieceCellArray)
      //   }`,
      //   APPEND_TRUE_FLAG,
      // );
      appendContent(
        `${TAB}sameFacePieceCellArray: ${
          JSON.stringify(sameFacePieceCellArray)
        }\n${TAB}relationPieceCellArray: ${
          JSON.stringify(relationPieceCellArray)
        }`,
        MiddleFileKind.FixLonelyFaceOfCube,
      );

      const {
        layerIndex: LONELY_FACE_LAYER_INDEX,
        sixFace: LONELY_FACE_SIX_FACE,
        rowIndex: LONELY_FACE_ROW_INDEX,
        colIndex: LONELY_FACE_COL_INDEX,
      } = FIRST_LONELY_FACE_CELL;

      sameFacePieceCellArray.forEach((pieceCell) => {
        const {
          rowIndex: PIECE_CELL_ROW_INDEX,
          colIndex: PIECE_CELL_COL_INDEX,
        } = pieceCell;
        for (let inOutIndex = 0; inOutIndex < 2; ++inOutIndex) {
          const cloned = cube.clone();
          const { cells, sixFaces, twelveEdges } = cloned;
          const CLONED_LONELY_FACE_CELL =
            cells[LONELY_FACE_ROW_INDEX][LONELY_FACE_COL_INDEX];
          const CLONED_PIECE_CELL =
            cells[PIECE_CELL_ROW_INDEX][PIECE_CELL_COL_INDEX];

          CLONED_PIECE_CELL.feature = CellFeature.Face;
          const PIECES = twelveEdges[
            (SOURCE_CUBE_CELLS[PIECE_CELL_ROW_INDEX][
              PIECE_CELL_COL_INDEX
            ] as unknown as {
              twelveEdgeIndex: number;
            }).twelveEdgeIndex
          ].pieces;
          PIECES.splice(
            PIECES.indexOf([
              PIECE_CELL_ROW_INDEX,
              PIECE_CELL_COL_INDEX,
            ]),
            1,
          );

          if (inOutIndex === 0) {
            CLONED_PIECE_CELL.layerIndex = LONELY_FACE_LAYER_INDEX + 1;
            sixFaces[LONELY_FACE_SIX_FACE][0] = [
              LONELY_FACE_ROW_INDEX,
              LONELY_FACE_COL_INDEX,
              PIECE_CELL_ROW_INDEX,
              PIECE_CELL_COL_INDEX,
            ] as OneOrTwoCellRowColIndex;
          } else {
            CLONED_LONELY_FACE_CELL.layerIndex = LONELY_FACE_LAYER_INDEX + 1;
            CLONED_PIECE_CELL.layerIndex = LONELY_FACE_LAYER_INDEX;
            sixFaces[LONELY_FACE_SIX_FACE][0] = [
              PIECE_CELL_ROW_INDEX,
              PIECE_CELL_COL_INDEX,
              LONELY_FACE_ROW_INDEX,
              LONELY_FACE_COL_INDEX,
            ] as OneOrTwoCellRowColIndex;
          }

          cloned.updateTwelveEdges();
          fixLonelyFaceOfCubeAndAppendIt(cloned, recursiveTimes + 1);
        }
      });

      relationPieceCellArray.forEach((pieceCell) => {
        const {
          rowIndex: PIECE_CELL_ROW_INDEX,
          colIndex: PIECE_CELL_COL_INDEX,
        } = pieceCell;
        for (let inOutIndex = 0; inOutIndex < 2; ++inOutIndex) {
          const cloned = cube.clone();
          const { cells, sixFaces, twelveEdges } = cloned;

          const CLONED_PIECE_CELL =
            cells[PIECE_CELL_ROW_INDEX][PIECE_CELL_COL_INDEX];

          CLONED_PIECE_CELL.feature = CellFeature.Face;
          const PIECES = twelveEdges[
            (SOURCE_CUBE_CELLS[PIECE_CELL_ROW_INDEX][
              PIECE_CELL_COL_INDEX
            ] as unknown as {
              twelveEdgeIndex: number;
            }).twelveEdgeIndex
          ].pieces;
          PIECES.splice(
            PIECES.indexOf([
              PIECE_CELL_ROW_INDEX,
              PIECE_CELL_COL_INDEX,
            ]),
            1,
          );

          const CLONED_PIECE_CELL_SIX_FACE = CLONED_PIECE_CELL.sixFace;
          const CLONED_PIECE_CELL_CELL_INDEX = CLONED_PIECE_CELL.cellIndex;
          const CLONED_SIX_FACE_ITEM_ARRAY =
            sixFaces[CLONED_PIECE_CELL_SIX_FACE];

          const OLD_CELL_ARRAY: CellObject[] = [];
          let maxLayerIndex = 0;
          cells.filter((cellRow) =>
            cellRow.forEach((cell) => {
              if (
                cell.feature !== CellFeature.Face ||
                cell.sixFace !== CLONED_PIECE_CELL_SIX_FACE
              ) {
                return;
              }
              if (cell.cellIndex !== CLONED_PIECE_CELL_CELL_INDEX) {
                OLD_CELL_ARRAY.push(cell);
                maxLayerIndex = Math.max(maxLayerIndex, cell.layerIndex);
              }
            })
          );
          if (inOutIndex === 0) {
            CLONED_SIX_FACE_ITEM_ARRAY.push([
              PIECE_CELL_ROW_INDEX,
              PIECE_CELL_COL_INDEX,
            ]);
            CLONED_PIECE_CELL.layerIndex = maxLayerIndex + 1;
          } else {
            CLONED_PIECE_CELL.layerIndex = 1;
            CLONED_SIX_FACE_ITEM_ARRAY.unshift([
              PIECE_CELL_ROW_INDEX,
              PIECE_CELL_COL_INDEX,
            ]);
            OLD_CELL_ARRAY.forEach((cell) => ++cell.layerIndex);
          }

          cloned.updateTwelveEdges();
          fixLonelyFaceOfCubeAndAppendIt(cloned, recursiveTimes + 1);
        }
      });
    }

    /**
     * <en_us>en_us</en_us>
     * <zh_cn>将隐藏插片转为面（内外皆可）</zh_cn>
     * <zh_tw>zh_tw</zh_tw>
     *
     * @param cube
     * <en_us>en_us</en_us>
     * <zh_cn>需修正的正方体</zh_cn>
     * <zh_tw>zh_tw</zh_tw>
     */
    function fixHiddenPiecesOfCubeAndAppendIt(cube: Cube) {
      // TODO(@anqisoft) 找到相应算法
      let hidePieceCount = 0;
      const { cells, sixFaces, twelveEdges } = cube;

      const CELL_ARRAY = cube.getCellArray();
      function getCellByCellIndex(cellIndex: number): CellObject | undefined {
        const FILTERED = CELL_ARRAY.filter((cell) =>
          cell.cellIndex === cellIndex
        );
        return FILTERED.length ? FILTERED[0] : undefined;
      }

      twelveEdges.forEach((twelveEdge) => {
        const REMOVE_INDEX_ARRAY: number[] = [];
        twelveEdge.pieces.forEach(
          ([pieceRowIndex, pieceColIndex], pieceIndex) => {
            const PIECE_CELL = cells[pieceRowIndex][pieceColIndex];
            // const {
            //   sixFace: PIECE_CELL_SIX_FACE,
            //   faceDirection: PIECE_CELL_FACE_DIRECTION,
            // } = PIECE_CELL;
            const {
              rowIndex: PIECE_CELL_RELATION_CELL_ROW_INDEX,
              colIndex: PIECE_CELL_RELATION_CELL_COL_INDEX,
              relation: PIECE_CELL_RELATION,
            } = PIECE_CELL.relatedInformationWhenAdding.rowIndex === -1
              ? cube.getCoreCellReserveRelatedInformation()
              : PIECE_CELL.relatedInformationWhenAdding;
            const PIECE_CELL_REVERSED_RELATION = getReversedRelation(
              PIECE_CELL_RELATION,
            );
            // console.log({
            //   PIECE_CELL_RELATION_CELL_ROW_INDEX,
            //   PIECE_CELL_RELATION_CELL_COL_INDEX,
            //   PIECE_CELL_RELATION,
            //   PIECE_CELL_REVERSED_RELATION,
            //   pieceRowIndex,
            //   pieceColIndex,
            //   coreRowIndex: cube.coreRowIndex,
            //   coreColIndex: cube.coreColIndex,
            // });
            const PIECE_CELL_RELATION_CELL =
              cells[PIECE_CELL_RELATION_CELL_ROW_INDEX][
                PIECE_CELL_RELATION_CELL_COL_INDEX
              ];

            const PIECE_CELL_RELATION_CELL_SIX_FACE =
              PIECE_CELL_RELATION_CELL.sixFace;
            const PIECE_CELL_RELATION_CELL_LAYER_INDEX =
              PIECE_CELL_RELATION_CELL.layerIndex;

            const SAME_FACE_CELL_INFO_ARRAY =
              sixFaces[PIECE_CELL_RELATION_CELL_SIX_FACE];
            const SAME_FACE_CELL_INFO_COUNT = SAME_FACE_CELL_INFO_ARRAY.length;
            let hasOuterFace = false;
            for (
              let sameFaceCellInfoIndex = 0;
              sameFaceCellInfoIndex < SAME_FACE_CELL_INFO_COUNT;
              ++sameFaceCellInfoIndex
            ) {
              const [
                firstRowIndex,
                firstColIndex,
                secondRowIndex,
                secondColIndex,
              ] = SAME_FACE_CELL_INFO_ARRAY[sameFaceCellInfoIndex];
              const firstCell = cells[firstRowIndex][firstColIndex];
              if (
                firstCell.layerIndex > PIECE_CELL_RELATION_CELL_LAYER_INDEX &&
                firstCell.borderLines[PIECE_CELL_REVERSED_RELATION] ===
                  CellBorderLine.InnerLine &&
                getCellByCellIndex(firstCell.getConnectedCellIndexByRelation(
                    PIECE_CELL_REVERSED_RELATION,
                  ))?.feature === CellFeature.Face
              ) {
                hasOuterFace = true;
                break;
              }

              if (
                typeof secondRowIndex !== "undefined" &&
                typeof secondColIndex !== "undefined"
              ) {
                const secondCell = cells[secondRowIndex][secondColIndex];
                if (
                  secondCell.layerIndex >
                    PIECE_CELL_RELATION_CELL_LAYER_INDEX &&
                  secondCell.borderLines[PIECE_CELL_REVERSED_RELATION] ===
                    CellBorderLine.InnerLine &&
                  getCellByCellIndex(secondCell.getConnectedCellIndexByRelation(
                      PIECE_CELL_REVERSED_RELATION,
                    ))?.feature === CellFeature.Face
                ) {
                  hasOuterFace = true;
                  break;
                }
              }
            }

            if (hasOuterFace) {
              REMOVE_INDEX_ARRAY.push(pieceIndex);
              PIECE_CELL.feature = CellFeature.Face;
              PIECE_CELL.layerIndex = 0;
              ++hidePieceCount;
            }
          },
        );

        REMOVE_INDEX_ARRAY.toReversed().forEach((index) =>
          twelveEdge.pieces.splice(index, 1)
        );
      });

      if (hidePieceCount) {
        cube.updateTwelveEdges();
      }

      cube.sync();
      if (hidePieceCount) {
        // Deno.writeTextFileSync(
        //   FIX_HIDDEN_PIECES_FILENAME,
        //   JSON.stringify(cube),
        //   APPEND_TRUE_FLAG,
        // );
        appendContent(
          JSON.stringify(cube),
          MiddleFileKind.FixHiddenPieces,
        );
      }
      appendCubeWithoutOneToTwentyFour(cube);
    }

    function appendCubeWithoutOneToTwentyFour(cube: Cube) {
      nextCubeNo += CUBE_NO_STEP;
      appendContent(
        nextCubeNo.toString(),
        MiddleFileKind.MiddleCubeToFirstNo,
      );
      cube.no = nextCubeNo;
      CUBES.push(cube);

      if (CUBES.length >= DEBUG.CUBE_COUNT_PER_FILE) {
        outputCubes();
      }
    }

    function outputCubes() {
      if (!CUBES.length) {
        return;
      }

      const GOAL_FILE_NAME = `${GOAL_CUBE_FILE_PATH}${
        (++fileNo).toString().padStart(6, "0")
      }.txt`;
      Deno.writeTextFileSync(
        GOAL_FILE_NAME,
        CUBES.map((cube) => JSON.stringify(cube)).join("\n"),
      );

      CUBES.length = 0;

      showUsedTime(`output ${GOAL_FILE_NAME}`);
    }
  })();

  for (
    let middleFileKindIndex = 0;
    middleFileKindIndex < MIDDLE_FILE_KIND_COUNT;
    ++middleFileKindIndex
  ) {
    appendFile(middleFileKindIndex);
  }

  showUsedTime("end");
  log(`end: ${(new Date()).toLocaleString()}`);
  logUsedTime("Total", performance.now() - DATE_BEGIN);

  copySync(LOG_FILE_NAME, `log_${STEP_FLAG}.txt`, OVER_WRITE_TRUE_FLAG);
  copySync(
    LOG_FILE_NAME,
    `${GOAL_FILE_TOP_PATH}log${logFilenamePostfix}.txt`,
    OVER_WRITE_TRUE_FLAG,
  );
  Deno.removeSync(LOG_FILE_NAME);
}

async function step3(
  GOAL_FILE_TOP_PATH: string = "./",
  SOURCE_FILE_TOP_PATH: string = "./cubesOnlyFirstOfTwentyFour/",
) {
  const STEP_FLAG = "step3";
  const LOG_FILE_NAME = "./log.txt";
  if (existsSync(LOG_FILE_NAME)) {
    Deno.removeSync(LOG_FILE_NAME);
  }

  let logFilenamePostfix = "";
  logFilenamePostfix = `_${STEP_FLAG}`;

  // const GOAL_FILE_TOP_PATH = `./${STEP_FLAG}/`;
  if (GOAL_FILE_TOP_PATH.replace(/[.\/\\]/g, "").length) {
    ensureDirSync(GOAL_FILE_TOP_PATH);
    emptyDirSync(GOAL_FILE_TOP_PATH);
  }

  log(`begin: ${(new Date()).toLocaleString()}`);
  const DATE_BEGIN = performance.now();

  // const SOURCE_FILE_TOP_PATH = "./step2/cubesOnlyFirstOfTwentyFour/";

  // const OK_FILE_TOP_PATH = `./_ok/`;
  // ensureDirSync(OK_FILE_TOP_PATH);
  // emptyDirSync(OK_FILE_TOP_PATH);

  //  同一方案24个角度
  const MANNER_COUNT = ANGLE_COUNT;

  await (async () => {
    let fileNo = 0;
    let cubeLinesFileContent = "";

    // const CUBE_COUNT_PER_FILE = 10240;
    // * 3 => 23 seconds / 4 files
    // * 4 => 123 seconds / 4 files 86/4=21.5
    // * 5 =>  51 seconds / 2 files 50.6/2=25.3
    // * 8 => 175 seconds / 4 files 125/4=32
    const CUBE_COUNT_PER_FILE = 10240 * 3;
    const CUBES: Cube[] = [];

    const CUBE_GOAL_FILE_PATH = `${GOAL_FILE_TOP_PATH}cubes/`;
    ensureDirSync(CUBE_GOAL_FILE_PATH);
    emptyDirSync(CUBE_GOAL_FILE_PATH);

    const MANNER_CUBES_GOAL_FILE_PATH = `${GOAL_FILE_TOP_PATH}manners/`;
    ensureDirSync(MANNER_CUBES_GOAL_FILE_PATH);
    emptyDirSync(MANNER_CUBES_GOAL_FILE_PATH);

    const CUBE_LINES_FILE_NAME = `${GOAL_FILE_TOP_PATH}lines.txt`;
    // Deno.writeTextFileSync(CUBE_LINES_FILE_NAME, '');

    let sourceFilename = "";
    for await (const dirEntry of Deno.readDir(SOURCE_FILE_TOP_PATH)) {
      const filename = path.join(SOURCE_FILE_TOP_PATH, dirEntry.name);
      const stats = Deno.statSync(filename);
      if (stats.isFile) {
        sourceFilename = filename;
        showUsedTime(`read file: ${filename}`);
        Deno.readTextFileSync(filename).split("\n").forEach((codeLine) => {
          const cube = getCubeFromJson(codeLine);
          batchAppendCubeOneToTwentyFour(cube);
        });
      }
    }
    outputCubes();

    function batchAppendCubeOneToTwentyFour(cube: Cube) {
      const { coreRowIndex: CORE_ROW_INDEX, coreColIndex: CORE_COL_INDEX } =
        cube;
      const {
        sixFaces: OLD_SIX_FACES,
        twelveEdges: OLD_TWELVE_EDGES,
        cells: OLD_CELLS,
        no: START_NO,
        rowCount,
        colCount,
        gridLines,
      } = cube;

      // { xStart, xEnd, yStart, yEnd, lineStyle }
      // GridLineStyle: Unknown, None, InnerLine, CutLine, OuterLine

      const LINE_ARRAY: number[] = [];
      for (let rowIndexLoop = 0; rowIndexLoop <= rowCount; ++rowIndexLoop) {
        for (let colIndexLoop = 0; colIndexLoop < colCount; ++colIndexLoop) {
          LINE_ARRAY.push(1);
        }
      }
      const VERTICAL_LINE_INDEX_OFFSET = LINE_ARRAY.length;
      for (let rowIndexLoop = 0; rowIndexLoop < rowCount; ++rowIndexLoop) {
        for (let colIndexLoop = 0; colIndexLoop <= colCount; ++colIndexLoop) {
          LINE_ARRAY.push(1);
        }
      }
      gridLines.forEach(({ xStart, xEnd, yStart, yEnd, lineStyle }) => {
        if (yStart === yEnd) {
          LINE_ARRAY[colCount * yStart + xStart] = lineStyle;
        } else {
          LINE_ARRAY[
            VERTICAL_LINE_INDEX_OFFSET + (colCount + 1) * yStart + xStart
          ] = lineStyle;
        }
      });
      cubeLinesFileContent += (cubeLinesFileContent.length ? "\n" : "").concat(
        LINE_ARRAY.join(""),
      );

      const MAX_ADD_ORDER =
        cube.actCells.map((cell) => cell.addOrder).sort().reverse()[0];
      const CORE_CELL_IS_PIECE =
        OLD_CELLS[CORE_ROW_INDEX][CORE_COL_INDEX].feature === CellFeature.Piece;

      for (let mannerIndex = 0; mannerIndex < MANNER_COUNT; ++mannerIndex) {
        const cloned = getClonedCubeByMannerIndex(
          cube,
          mannerIndex,
          OLD_SIX_FACES,
          OLD_TWELVE_EDGES,
          OLD_CELLS,
          MAX_ADD_ORDER,
          CORE_CELL_IS_PIECE,
        );
        cloned.no = START_NO + mannerIndex;

        cloned.syncAndClear();
        cloned.cells = undefined;
        cloned.isValid = undefined;
        cloned.emptyCells = undefined;

        cloned.colCount = undefined;
        cloned.coreRowIndex = undefined;

        const MANNER = cloned.twelveEdges.map((twelveEdge) =>
          `${twelveEdge.canBeInserted ? "T" : "F"}${twelveEdge.pieces.length}`
        ).join("");
        cloned["manner"] = MANNER;

        appendCube(cloned);
      }
    }

    function appendCube(cube: Cube) {
      CUBES.push(cube);

      if (CUBES.length >= CUBE_COUNT_PER_FILE) {
        outputCubes();
      }
    }

    function outputCubes() {
      if (!CUBES.length) {
        return;
      }
      ++fileNo;
      const filenamePostfix = `${fileNo.toString().padStart(6, "0")}.txt`;

      // 1. 每种拼插方案对应的正方体编号清单（以拼插方案命名），回车符分隔
      //    最大编号112260888，最多11,2260,8880字数据，约11亿字
      // CUBES.forEach(cube => {
      // const { manner } = cube;

      // const MANNER_FILE_NAME = `${MANNER_CUBES_GOAL_FILE_PATH}${manner}.txt`;
      // cube['manner'] = undefined;
      // const EXISTS = existsSync(MANNER_FILE_NAME);
      // Deno.writeTextFileSync(
      // MANNER_FILE_NAME,
      // `${EXISTS ? '\n' : ''}${cube.no}`,
      // EXISTS ? APPEND_TRUE_FLAG : EMPTY_OBJECT
      // );
      // });
      const MANNER_CUBES_ARRAY = [];
      const MANNER_ARRAY = [];
      CUBES.forEach((cube) => {
        const { manner, no } = cube;
        cube["manner"] = undefined;

        const OLD_INDEX = MANNER_ARRAY.indexOf(manner);
        if (OLD_INDEX === -1) {
          MANNER_ARRAY.push(manner);
          MANNER_CUBES_ARRAY.push([no]);
        } else {
          MANNER_CUBES_ARRAY[OLD_INDEX].push(no);
        }
      });
      Deno.writeTextFileSync(
        `${MANNER_CUBES_GOAL_FILE_PATH}${filenamePostfix}`,
        MANNER_CUBES_ARRAY.map((noArray, index) =>
          `${MANNER_ARRAY[index]}:[${noArray.join(",")}]`
        )
          .join("\n"),
      );
      MANNER_CUBES_ARRAY.length = 0;
      MANNER_ARRAY.length = 0;

      //  3. 输出压缩后的正方体信息（正方体间以回车符分隔，4位一格，16进制）：
      //      1）1位：格序（1位，0-15，16进制0-E）
      //      2）1位：功能（1位，2-3，2面3片，减2乘6）+层序（1位，1-6转0-5），转1位16进制
      //      3）1位：面序或片序——面序0-5，片序0-11，转1位十六进制
      //      4）1位：方向序，0-3
      //      最多4*15+1=61位一个，最大编号112260888，最多68,4791,4168字数据，约68亿字，
      //      不确定是否19G左右
      const GOAL_FILE_NAME = `${CUBE_GOAL_FILE_PATH}${filenamePostfix}`;
      // try {
      // Deno.writeTextFileSync(
      // GOAL_FILE_NAME,
      // CUBES.map((cube) =>
      // cube.actCells.map(
      // ({
      // cellIndex,
      // layerIndex,
      // feature,
      // sixFace,
      // faceDirection,
      // twelveEdge,
      // }) =>
      // `${cellIndex.toString(16)}${
      // (parseInt(`${(feature - 2) * 6 + (layerIndex - 1)}`)).toString(16)
      // }${feature === 2 ? `${sixFace}` : `${twelveEdge.toString(16)}`}${faceDirection}`,
      // ).join('')
      // ).join('\n'),
      // );
      // } catch {
      // log('[error]', sourceFilename);
      // }
      try {
        const codes: string[] = [];
        CUBES.forEach((cube) => {
          let code = "";
          const { no, actCells } = cube;
          actCells.forEach((cell) => {
            const {
              cellIndex,
              layerIndex,
              feature,
              sixFace,
              faceDirection,
              rowIndex,
              colIndex,
              addOrder,
            } = cell;
            let { twelveEdge } = cell;
            code += cellIndex.toString(16);
            const FEATURE_AND_LAYERINDEX = parseInt(
              "" + ((feature - 2) * 6 + (layerIndex - 1)),
            );
            code += FEATURE_AND_LAYERINDEX.toString(16);
            if (feature === 2) {
              code += sixFace;
            } else {
              if (typeof twelveEdge === "undefined") {
                const { relatedInformationWhenAdding } = cell;
                if (
                  relatedInformationWhenAdding.rowIndex === -1 &&
                  relatedInformationWhenAdding.colIndex === -1
                ) {
                  const FIND_ADD_ORDER = addOrder + 1;
                  const RELATION_CELL = actCells.filter(
                    (o) =>
                      o.addOrder === FIND_ADD_ORDER &&
                      o.relatedInformationWhenAdding.rowIndex === rowIndex &&
                      o.relatedInformationWhenAdding.colIndex === colIndex,
                  )[0];

                  const relation =
                    RELATION_CELL.relatedInformationWhenAdding.relation;

                  twelveEdge = getSixFaceTwentyFourAngleRelationTwelveEdge(
                    RELATION_CELL.sixFaceTwentyFourAngle,
                    relation % 2 === 0
                      ? (2 - relation)
                      : 1 + floor(relation / 2),
                  );
                } else {
                  console.log(
                    "cell.twelveEdge is undefined",
                    no,
                    relatedInformationWhenAdding,
                  );
                }
              }

              try {
                code += twelveEdge.toString(16);
              } catch (error) {
                console.log("cell", no, cell);
              }
            }

            code += faceDirection;
          });
          codes.push(code);
        });
        Deno.writeTextFileSync(GOAL_FILE_NAME, codes.join("\n"));
      } catch (error) {
        console.error("[error]", sourceFilename, filenamePostfix, error);
      }

      // `${(cellIndex).toString(16)}${(parseInt(`${layerIndex}${feature}`)).toString(16)}${feature===2?`${sixFace}${faceDirection}`:twelveEdge.toString().padStart(2, '0')}`

      // 2. 每24个正方体（以1转24的第一个计算）一组，计算纸模完整横纵线，回车符分隔
      //    1）两行五列则15=5*(2+1)横12=(5+1)*2纵共27线；
      //    2）三行五列则20=5*(3+1)横18=(5+1)*3纵共38线。
      //    最大编号112260888，4677537组，最多1,8242,3943字数据，约2亿字
      Deno.writeTextFileSync(
        CUBE_LINES_FILE_NAME,
        (fileNo === 1 ? "" : "\n").concat(cubeLinesFileContent),
        APPEND_TRUE_FLAG,
      );
      cubeLinesFileContent = "";

      CUBES.length = 0;
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
      const { coreRowIndex: CORE_ROW_INDEX, coreColIndex: CORE_COL_INDEX } =
        cube;

      const cloned = cube.clone();

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
              const { rowIndex, colIndex, relation: RELATION } =
                cell.relatedInformationWhenAdding;
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
        const { rowIndex, colIndex } = actCells.filter((cell) =>
          cell.addOrder === 2
        )[0];
        const RELATED_CELL = cells[rowIndex][colIndex];
        const RELATION = RELATED_CELL.relatedInformationWhenAdding.relation;
        CORE_CELL.twelveEdge = getSixFaceTwentyFourAngleRelationTwelveEdge(
          RELATED_CELL.sixFaceTwentyFourAngle,
          2 - RELATION % 2 + 2 * floor(RELATION / 2),
        );
      }

      sixFaces.forEach((face, faceIndex) => {
        face.length = 0;

        OLD_SIX_FACES.forEach((oldFaces: FaceMemberOfSixFace) => {
          if (oldFaces.length === 0) {
            Deno.writeTextFileSync(
              `${GOAL_FILE_TOP_PATH}error_cube_${cube.no}.ts`,
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
          const { rowIndex, colIndex, relation } =
            PIECE_CELL.relatedInformationWhenAdding;
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
            fixedSixFaceTwentyFourAngle =
              cells[rowIndex][colIndex].sixFaceTwentyFourAngle;
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
            if (typeof secondRowIndex !== "undefined") {
              relateTwelveEdge(secondRowIndex, secondColIndex as number);
            }

            function relateTwelveEdge(rowIndex: number, colIndex: number) {
              if (FINDED_TWELVE_EDGES_INDEX_ARRAY.length === 12) {
                return;
              }

              const oldFirstCell = OLD_CELLS[rowIndex][colIndex];
              const oldSixFaceTwentyFourAngle =
                oldFirstCell.sixFaceTwentyFourAngle;

              const newFirstCell = cells[rowIndex][colIndex];
              const newSixFaceTwentyFourAngle =
                newFirstCell.sixFaceTwentyFourAngle;

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
  })();

  // copySync(
  //   `${GOAL_FILE_TOP_PATH}lines.txt`,
  //   OK_FILE_TOP_PATH,
  //   OVER_WRITE_TRUE_FLAG,
  // );

  showUsedTime("end");
  log(`end: ${(new Date()).toLocaleString()}`);
  logUsedTime("Total", performance.now() - DATE_BEGIN);

  copySync(LOG_FILE_NAME, `log_${STEP_FLAG}.txt`, OVER_WRITE_TRUE_FLAG);
  copySync(
    LOG_FILE_NAME,
    `${GOAL_FILE_TOP_PATH}log${logFilenamePostfix}.txt`,
    OVER_WRITE_TRUE_FLAG,
  );
  Deno.removeSync(LOG_FILE_NAME);
}

async function step4(
  USE_LARGE_FILE: boolean = true,
  GOAL_FILE_TOP_PATH: string = "./",
  SOURCE_FILE_TOP_PATH: string = "./",
) {
  const STEP_FLAG = "step4";
  const LOG_FILE_NAME = "./log.txt";
  if (existsSync(LOG_FILE_NAME)) {
    Deno.removeSync(LOG_FILE_NAME);
  }

  let logFilenamePostfix = "";
  logFilenamePostfix = `_${STEP_FLAG}`;

  // const GOAL_FILE_TOP_PATH = `./${STEP_FLAG}/`;
  if (GOAL_FILE_TOP_PATH.replace(/[.\/\\]/g, "").length) {
    ensureDirSync(GOAL_FILE_TOP_PATH);
    emptyDirSync(GOAL_FILE_TOP_PATH);
  }

  log(`begin: ${(new Date()).toLocaleString()}`);
  const DATE_BEGIN = performance.now();

  // const SOURCE_FILE_TOP_PATH = "./step3/";

  const DEBUG = {
    COMPACT_LINE_INFO_WRITE_COUNT_PER_TIME: 204800,

    COMPACT_MANNER_FILES_FOR_LARGE_FILE: USE_LARGE_FILE,
    COMPACT_MANNER_FILES_FOR_LARGE_FILE_OUTPUT_TIMES: 8,

    OUTPUT_MANNER_BILL_FILE: false,

    JOIN_CUBE_FILES: !USE_LARGE_FILE,
  };

  await (async () => {
    // step3/lines.txt => step4/lineToCubeNo.txt
    compactLineInfo();

    if (DEBUG.COMPACT_MANNER_FILES_FOR_LARGE_FILE) {
      // step3/manners/*.txt => step4/manners.txt
      await compactMannerFilesForLargeFile();

      // step3/manners/*.txt => step4/joinedManners/*.txt
      await joinMannerFiles();
    } else {
      // step3/manners/*.txt => step4/manners.txt
      await compactMannerFiles();
    }

    if (DEBUG.OUTPUT_MANNER_BILL_FILE) {
      // step3/manners/*.txt => step4/mannerBill.txt
      await outputMannerBillFile();
    }

    // step3/cubes/*.txt => step4/cubes.txt
    if (DEBUG.JOIN_CUBE_FILES) {
      await joinCubeFiles();
    }

    function compactLineInfo() {
      logFilenamePostfix += "_compactLineInfo";
      // 1. lines.txt，将4677537行去重，且列出正方体序号段（不知道为什么最后有不连续的序号），
      //    转为lineToCubeNo.txt文件，444442222244444422324433234:1-5,8-10
      const GOAL_FILE_NAME = `${GOAL_FILE_TOP_PATH}lineToCubeNo.txt`;

      const SOURCE_FILE_NAME = `${SOURCE_FILE_TOP_PATH}lines.txt`;
      const DATA_ARRAY = Deno.readTextFileSync(SOURCE_FILE_NAME).split("\n");
      showUsedTime(`read ${SOURCE_FILE_NAME} ok`);

      const { COMPACT_LINE_INFO_WRITE_COUNT_PER_TIME } = DEBUG;

      Deno.writeTextFileSync(GOAL_FILE_NAME, "");
      let lastOne = "";
      let codes = "";
      DATA_ARRAY.forEach((info, index) => {
        if (index % COMPACT_LINE_INFO_WRITE_COUNT_PER_TIME === 0 && index) {
          Deno.writeTextFileSync(GOAL_FILE_NAME, codes, APPEND_TRUE_FLAG);
          codes = "";
          showUsedTime(`ok: ${index}`);
        }
        const BEGIN = ANGLE_COUNT * index + 1;
        // const END = BEGIN + DIFFENT_BETWEEN_BEGIN_AND_END;
        if (info === lastOne) {
          codes += `|${BEGIN}`;
        } else {
          codes += `${index ? "\n" : ""}${info}\t${BEGIN}`;
          lastOne = info;
        }
      });
      Deno.writeTextFileSync(GOAL_FILE_NAME, codes, APPEND_TRUE_FLAG);
      // 4677537 lines => 247616 lines
    }

    async function compactMannerFiles() {
      logFilenamePostfix += "_compactMannerFiles";

      const SOURCE_MANNER_FILE_PATH = `${SOURCE_FILE_TOP_PATH}manners/`;
      let readedFileCount = 0;

      // const { JOIN_CUBE_FILES } = DEBUG;

      const GOAL_FILE_NAME = `${GOAL_FILE_TOP_PATH}manners.txt`;
      Deno.writeTextFileSync(GOAL_FILE_NAME, "");
      for await (const dirEntry of Deno.readDir(SOURCE_MANNER_FILE_PATH)) {
        const filename = path.join(SOURCE_MANNER_FILE_PATH, dirEntry.name);
        const stats = Deno.statSync(filename);
        if (!stats.isFile) {
          continue;
        }

        if ((++readedFileCount) % 100 === 0) {
          showUsedTime(`readed ${readedFileCount} files`);
        }
        // if (JOIN_CUBE_FILES) {
        const ARRAY: { manner: string; cubeNoBill: string }[] = Deno
          .readTextFileSync(filename)
          .replace(/:/g, "\t")
          .replace(/[\[\]]/g, "")
          .replace(/,/g, "|").split("\n").map((line) => {
            const [manner, cubeNoBill] = line.split("\t");
            return { manner, cubeNoBill };
          });
        ARRAY.sort((prev, next) => prev.manner.localeCompare(next.manner));
        console.log("sort it");

        Deno.writeTextFileSync(
          GOAL_FILE_NAME,
          ARRAY.map(({ manner, cubeNoBill }) => `${manner}\t${cubeNoBill}`)
            .join("\n"),
          APPEND_TRUE_FLAG,
        );
        // } else {
        //   Deno.writeTextFileSync(
        //     GOAL_FILE_NAME,
        //     Deno.readTextFileSync(filename)
        //       .replace(/:/g, "\t")
        //       .replace(/[\[\]]/g, "")
        //       .replace(/,/g, "|"),
        //     APPEND_TRUE_FLAG,
        //   );
        // }
      }
      // First time: Total used , used 153560.50 milliseconds, or 153.560 seconds, or 2.6 minutes.

      // Second time:
      // begin: 4/30/2024, 9:18:51 AM
      // readed 100 files, used 1245.30 milliseconds, or 1.245 seconds
      // readed 200 files, used 1309.05 milliseconds, or 1.309 seconds
      // readed 300 files, used 1190.31 milliseconds, or 1.190 seconds
      // readed 400 files, used 1240.31 milliseconds, or 1.240 seconds
      // readed 500 files, used 1640.54 milliseconds, or 1.641 seconds
      // readed 600 files, used 1574.70 milliseconds, or 1.575 seconds
      // readed 700 files, used 1585.79 milliseconds, or 1.586 seconds
      // readed 800 files, used 1717.13 milliseconds, or 1.717 seconds
      // readed 900 files, used 1712.19 milliseconds, or 1.712 seconds
      // readed 1000 files, used 1440.75 milliseconds, or 1.441 seconds
      // readed 1100 files, used 1575.05 milliseconds, or 1.575 seconds
      // readed 1200 files, used 1305.73 milliseconds, or 1.306 seconds
      // readed 1300 files, used 1453.30 milliseconds, or 1.453 seconds
      // readed 1400 files, used 1252.67 milliseconds, or 1.253 seconds
      // readed 1500 files, used 1109.89 milliseconds, or 1.110 seconds
      // readed 1600 files, used 1384.44 milliseconds, or 1.384 seconds
      // readed 1700 files, used 1395.11 milliseconds, or 1.395 seconds
      // readed 1800 files, used 1520.37 milliseconds, or 1.520 seconds
      // readed 1900 files, used 1629.46 milliseconds, or 1.629 seconds
      // readed 2000 files, used 1445.17 milliseconds, or 1.445 seconds
      // readed 2100 files, used 1597.54 milliseconds, or 1.598 seconds
      // readed 2200 files, used 1779.48 milliseconds, or 1.779 seconds
      // readed 2300 files, used 1665.58 milliseconds, or 1.666 seconds
      // readed 2400 files, used 1701.54 milliseconds, or 1.702 seconds
      // readed 2500 files, used 1674.25 milliseconds, or 1.674 seconds
      // readed 2600 files, used 1533.90 milliseconds, or 1.534 seconds
      // readed 2700 files, used 1972.77 milliseconds, or 1.973 seconds
      // readed 2800 files, used 1708.63 milliseconds, or 1.709 seconds
      // readed 2900 files, used 1698.91 milliseconds, or 1.699 seconds
      // readed 3000 files, used 1616.99 milliseconds, or 1.617 seconds
      // readed 3100 files, used 1673.94 milliseconds, or 1.674 seconds
      // readed 3200 files, used 1799.85 milliseconds, or 1.800 seconds
      // readed 3300 files, used 1744.90 milliseconds, or 1.745 seconds
      // readed 3400 files, used 1647.63 milliseconds, or 1.648 seconds
      // readed 3500 files, used 1666.44 milliseconds, or 1.666 seconds
      // readed 3600 files, used 1362.89 milliseconds, or 1.363 seconds
      // end, used 713.26 milliseconds, or 0.713 seconds
      // end: 4/30/2024, 9:19:47 AM
      // Total used , used 56269.80 milliseconds, or 56.270 seconds

      // File size: 1.74GB
      // Couldn't open it by notepad.
    }

    async function compactMannerFilesForLargeFile() {
      logFilenamePostfix = "_compactMannerFilesForLargeFile";
      const SOURCE_MANNER_FILE_PATH = `${SOURCE_FILE_TOP_PATH}manners/`;
      const MANNER_ARRAY: string[] = [];
      const CUBE_NO_ARRAY = [];
      let readedFileCount = 0;
      let mannerCount = 0;
      for await (const dirEntry of Deno.readDir(SOURCE_MANNER_FILE_PATH)) {
        const filename = path.join(SOURCE_MANNER_FILE_PATH, dirEntry.name);
        const stats = Deno.statSync(filename);
        if (stats.isFile) {
          if ((++readedFileCount) % 100 === 0) { // || readedFileCount < 10) {
            showUsedTime(`readed ${readedFileCount} files`);
          }

          const SOURCE_ARRAY = Deno.readTextFileSync(filename)
            .replace(/:/g, "\t")
            .replace(/[\[\]]/g, "")
            .replace(/,/g, "|")
            .split("\n");
          const SOURCE_COUNT = SOURCE_ARRAY.length;
          for (let lineIndex = 0; lineIndex < SOURCE_COUNT; ++lineIndex) {
            const [MANNER, CUBE_NO_BILL] = SOURCE_ARRAY[lineIndex].split("\t");
            let finded = false;
            for (let i = 0; i < mannerCount; ++i) {
              if (MANNER_ARRAY[i] === MANNER) {
                CUBE_NO_ARRAY[i] += "|".concat(CUBE_NO_BILL);
                finded = true;
                break;
              }
            }
            if (!finded) {
              MANNER_ARRAY.push(MANNER);
              CUBE_NO_ARRAY.push(CUBE_NO_BILL);
              ++mannerCount;
            }
          }
        }
      }
      showUsedTime(`read remaining files`);

      const MANNER_GOAL_FILE_NAME = `${GOAL_FILE_TOP_PATH}manners.txt`;
      Deno.writeTextFileSync(MANNER_GOAL_FILE_NAME, "");

      const WRITE_TIMES =
        DEBUG.COMPACT_MANNER_FILES_FOR_LARGE_FILE_OUTPUT_TIMES;
      const OUTPUT_COUNT_PER_TIME = Math.ceil(
        MANNER_ARRAY.length / WRITE_TIMES,
      );
      for (let outputIndex = 0; outputIndex < WRITE_TIMES; ++outputIndex) {
        const QUARTER_CUBE_NO_ARRAY = CUBE_NO_ARRAY.splice(
          0,
          OUTPUT_COUNT_PER_TIME,
        );
        if (outputIndex) {
          Deno.writeTextFileSync(
            MANNER_GOAL_FILE_NAME,
            "\n",
            APPEND_TRUE_FLAG,
          );
        }
        Deno.writeTextFileSync(
          MANNER_GOAL_FILE_NAME,
          MANNER_ARRAY.splice(0, OUTPUT_COUNT_PER_TIME).map((MANNER, index) =>
            `${MANNER}\t${QUARTER_CUBE_NO_ARRAY[index]}`
          ).join("\n"),
          APPEND_TRUE_FLAG,
        );
      }
      showUsedTime(`output manners.txt`);

      // Deno.writeTextFileSync(
      // `${GOAL_FILE_TOP_PATH}mannerBill.txt`,
      // MANNER_ARRAY.join('\n'),
      // );
      // showUsedTime(`output mannerBill.txt`);
    }

    async function outputMannerBillFile() {
      logFilenamePostfix += "_outputMannerBillOfOnlyOneFile";
      const SOURCE_MANNER_FILE_PATH = `${SOURCE_FILE_TOP_PATH}manners/`;

      let readedFileCount = 0;

      const GOAL_FILE_NAME = `${GOAL_FILE_TOP_PATH}mannerBill.txt`;
      Deno.writeTextFileSync(GOAL_FILE_NAME, "");
      for await (const dirEntry of Deno.readDir(SOURCE_MANNER_FILE_PATH)) {
        const filename = path.join(SOURCE_MANNER_FILE_PATH, dirEntry.name);
        const stats = Deno.statSync(filename);
        if (!stats.isFile) {
          continue;
        }

        if ((++readedFileCount) % 100 === 0) {
          showUsedTime(`readed ${readedFileCount} files`);
        }
        Deno.writeTextFileSync(
          GOAL_FILE_NAME,
          Deno.readTextFileSync(filename)
            // .replace(/:/g, '\t')
            // .replace(/[\[\]]/g, '')
            // .replace(/,/g, '|')
            .split("\n").map((line) => line.split(":")[0]).join("\n"),
          APPEND_TRUE_FLAG,
        );
      }

      // File size: 1.13G
      // Couldn't open it by notepad or notepad++.
    }

    async function joinMannerFiles() {
      const SOURCE_MANNER_FILE_PATH = `${SOURCE_FILE_TOP_PATH}manners/`;
      let readedFileCount = 0;

      // const GOAL_FILE_PATH = `${GOAL_FILE_TOP_PATH}manners/`;
      const GOAL_FILE_PATH = `${GOAL_FILE_TOP_PATH}joinedManners/`;
      ensureDirSync(GOAL_FILE_PATH);
      emptyDirSync(GOAL_FILE_PATH);

      const MANNER_ARRAY: string[] = [];
      let outputFileNo = 0;
      let totalCount = 0;
      function output() {
        const COUNT = MANNER_ARRAY.length;
        if (!COUNT) {
          return;
        }

        ++outputFileNo;
        Deno.writeTextFileSync(
          `${GOAL_FILE_PATH}${outputFileNo}.txt`,
          MANNER_ARRAY.join("\n"),
        );

        totalCount += COUNT;
        MANNER_ARRAY.length = 0;
      }
      function append(manner: string) {
        MANNER_ARRAY.push(manner);
        if (MANNER_ARRAY.length >= 1048000) {
          output();
        }
      }

      for await (const dirEntry of Deno.readDir(SOURCE_MANNER_FILE_PATH)) {
        const filename = path.join(SOURCE_MANNER_FILE_PATH, dirEntry.name);
        const stats = Deno.statSync(filename);
        if (!stats.isFile) {
          continue;
        }

        if ((++readedFileCount) % 100 === 0) {
          showUsedTime(`readed ${readedFileCount} files`);
        }
        Deno.readTextFileSync(filename).split("\n").forEach((line) =>
          append(line.split(":")[0])
        );
      }
      output();

      // File count: 33 files
    }

    async function joinCubeFiles() {
      logFilenamePostfix = "_joinCubeFiles";
      const SOURCE_MANNER_FILE_PATH = `${SOURCE_FILE_TOP_PATH}cubes/`;

      const CUBE_GOAL_FILE_NAME = `${GOAL_FILE_TOP_PATH}cubes.txt`;
      Deno.writeTextFileSync(CUBE_GOAL_FILE_NAME, "");

      let readedFileCount = 0;
      for await (const dirEntry of Deno.readDir(SOURCE_MANNER_FILE_PATH)) {
        const filename = path.join(SOURCE_MANNER_FILE_PATH, dirEntry.name);
        const stats = Deno.statSync(filename);
        if (!stats.isFile) {
          continue;
        }

        if ((++readedFileCount) % 100 === 0) { // || readedFileCount < 10) {
          showUsedTime(`readed ${readedFileCount} files`);
        }

        Deno.writeTextFileSync(
          CUBE_GOAL_FILE_NAME,
          Deno.readTextFileSync(filename),
          APPEND_TRUE_FLAG,
        );
      }
    }
  })();

  showUsedTime("end");
  log(`end: ${(new Date()).toLocaleString()}`);
  logUsedTime("Total", performance.now() - DATE_BEGIN);

  copySync(LOG_FILE_NAME, `log_${STEP_FLAG}.txt`, OVER_WRITE_TRUE_FLAG);
  copySync(
    LOG_FILE_NAME,
    `${GOAL_FILE_TOP_PATH}log${logFilenamePostfix}.txt`,
    OVER_WRITE_TRUE_FLAG,
  );
  Deno.removeSync(LOG_FILE_NAME);
}

interface StepSkipped {
  skipped?: boolean;
}
export interface Step1Option extends StepSkipped {
  GOAL_FILE_TOP_PATH?: string;
}

export interface BehindStepsOption extends StepSkipped {
  GOAL_FILE_TOP_PATH?: string;
  SOURCE_FILE_TOP_PATH?: string;
}
export interface Step2Option extends BehindStepsOption {
}
export interface Step3Option extends BehindStepsOption {
}
export interface Step4Option extends BehindStepsOption {
  USE_LARGE_FILE?: boolean;
}

export interface MainOption {
  step1Option?: Step1Option;
  step2Option?: Step2Option;
  step3Option?: Step3Option;
  step4Option?: Step4Option;
}

export async function main(
  options: MainOption,
  ROW_COUNT_ARRAY: number[] = [2],
) {
  const GLOBAL_LOG_CONTENT_ARRAY = [];
  GLOBAL_LOG_CONTENT_ARRAY.push(`begin: ${(new Date()).toLocaleString()}`);
  const DATE_BEGIN = performance.now();

  // const ROW_COUNT_ARRAY = [2, 3];
  // const ROW_COUNT_ARRAY = [2];
  // const USE_LARGE_FILE = ROW_COUNT_ARRAY.length > 1 || ROW_COUNT_ARRAY[0] !== 2;

  const {
    step1Option,
    step2Option,
    step3Option,
    step4Option,
  } = options;

  // useless:
  // console.log("\n");
  // log("\n");

  if (!step1Option?.skipped) {
    GLOBAL_LOG_CONTENT_ARRAY.push(`step1: ${(new Date()).toLocaleString()}`);
    step1(ROW_COUNT_ARRAY, step1Option?.GOAL_FILE_TOP_PATH);
  }

  if (!step2Option?.skipped) {
    GLOBAL_LOG_CONTENT_ARRAY.push(`step2: ${(new Date()).toLocaleString()}`);
    await step2(
      ROW_COUNT_ARRAY,
      step2Option?.GOAL_FILE_TOP_PATH,
      step2Option?.SOURCE_FILE_TOP_PATH,
    );
  }

  if (!step3Option?.skipped) {
    GLOBAL_LOG_CONTENT_ARRAY.push(`step3: ${(new Date()).toLocaleString()}`);
    await step3(
      step3Option?.GOAL_FILE_TOP_PATH,
      step3Option?.SOURCE_FILE_TOP_PATH,
    );
  }

  if (!step4Option?.skipped) {
    GLOBAL_LOG_CONTENT_ARRAY.push(`step4: ${(new Date()).toLocaleString()}`);
    await step4(
      step4Option?.USE_LARGE_FILE,
      step4Option?.GOAL_FILE_TOP_PATH,
      step4Option?.SOURCE_FILE_TOP_PATH,
    );
  }

  if (existsSync(LOG_FILE_NAME)) {
    Deno.removeSync(LOG_FILE_NAME);
  }
  GLOBAL_LOG_CONTENT_ARRAY.push(`  end: ${(new Date()).toLocaleString()}`);
  log(GLOBAL_LOG_CONTENT_ARRAY.join("\n"));
  logUsedTime("Total", performance.now() - DATE_BEGIN);
}

/*
set pwd=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\

cls && deno lint %pwd%\cubeCompute.ts && deno fmt %pwd%\cubeCompute.ts

cd /d C:\__cube\240507A\

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\cubeCompute.ts
deno run --v8-flags=--max-old-space-size=20480 -A %pwd%\cubeCompute.ts

cls && deno lint %pwd%\cubeCompute.ts
cls && deno run --v8-flags=--max-old-space-size=20480 -A %pwd%\cubeCompute.ts

*/
