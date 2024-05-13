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
 * 注意：第一步不用考虑“接续”模式，第二步开始，如果不是从2行开始，则自动进入“接续”模式
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
  getUsedTimeString,
  global_removed_middle_cube_count,
  // TwoCellRowColIndex,
  Globals,
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

const EXISTS_CUBE_COUNT = {
  row3: 20064,
  row5: 200000000, // TODO(@anqisoft) change it.
};

const OVER_WRITE_TRUE_FLAG = { overwrite: true };
const APPEND_TRUE_FLAG = { append: true };
// const EMPTY_OBJECT = {};

const LOG_FILE_NAME = "./log.txt";
Globals.LOG_FILE_NAME = LOG_FILE_NAME;

const COL_COUNT = 5;
const MAX_COL_INDEX = COL_COUNT - 1;

/**
 * 计算中间正方体，存入×rows_5cols
 *
 * @param ROW_COUNT_ARRAY 数组：纸模行数
 * @param GOAL_FILE_TOP_PATH 保存路径根目录
 * @param OUTPUT_CUT_MANNERS_ROW_BY_ROW 是否逐行输出“剪切方案”
 */
function step1(
  ROW_COUNT_ARRAY: number[],
  GOAL_FILE_TOP_PATH: string = "./",
  OUTPUT_CUT_MANNERS_ROW_BY_ROW: boolean = false,
) {
  const STEP_FLAG = "step1";

  if (existsSync(LOG_FILE_NAME)) {
    Deno.removeSync(LOG_FILE_NAME);
  }

  let logFilenamePostfix = "";
  logFilenamePostfix = `_${STEP_FLAG}`;

  const GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH =
    GOAL_FILE_TOP_PATH.replace(/[.\/\\]/g, "").length;
  const DEBUG_FILE_PREFIX = GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH
    ? ""
    : STEP_FLAG.concat("_");
  if (GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH) {
    ensureDirSync(GOAL_FILE_TOP_PATH);
    emptyDirSync(GOAL_FILE_TOP_PATH);
  }

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
      `${GOAL_FILE_TOP_PATH}${DEBUG_FILE_PREFIX}cutMannerArray.ts`,
      `export const cutMannerArray = ${JSON.stringify(CUT_MANNER_ARRAY)};`,
    );
    Deno.writeTextFileSync(
      `${GOAL_FILE_TOP_PATH}${DEBUG_FILE_PREFIX}cutMannerCountArray.ts`,
      `export const cutMannerCountArray = ${
        JSON.stringify(CUT_MANNER_COUNT_ARRAY)
      };`,
    );
    log(`CUT_MANNER_ARRAY.length:`, CUT_MANNER_ARRAY.length);
    log(`CUT_MANNER_COUNT_ARRAY:`, CUT_MANNER_COUNT_ARRAY);
  }
  if (OUTPUT_CUT_MANNERS_ROW_BY_ROW) {
    Deno.writeTextFileSync(
      `${GOAL_FILE_TOP_PATH}${DEBUG_FILE_PREFIX}cutManners.txt`,
      CUT_MANNER_ARRAY.join("\n"),
    );
  }

  showUsedTime("end");
  log(`end: ${(new Date()).toLocaleString()}`);
  logUsedTime(`${STEP_FLAG}: Total`, performance.now() - DATE_BEGIN);

  const LOG_FILE_NAME_IN_CURRENT_PATH = `log_${STEP_FLAG}.txt`;
  const LOG_FILE_NAME_IN_OTHER_PATH =
    `${GOAL_FILE_TOP_PATH}log${logFilenamePostfix}.txt`;
  copySync(LOG_FILE_NAME, LOG_FILE_NAME_IN_CURRENT_PATH, OVER_WRITE_TRUE_FLAG);
  if (LOG_FILE_NAME_IN_CURRENT_PATH !== LOG_FILE_NAME_IN_OTHER_PATH) {
    copySync(
      LOG_FILE_NAME,
      LOG_FILE_NAME_IN_OTHER_PATH,
      OVER_WRITE_TRUE_FLAG,
    );
  }
  Deno.removeSync(LOG_FILE_NAME);
}

/**
 * 中间正方体转“正方体组”第一项（每组24个），存入cubesOnlyFirstOfTwentyFour_×rows
 *
 * @param ROW_COUNT_ARRAY 数组：纸模行数
 * @param GOAL_FILE_TOP_PATH 保存路径根目录
 * @param SOURCE_FILE_TOP_PATH 源文件根目录
 * @param OUTPUT_ALONE_FIRST_CUBE
 * @param OUTPUT_CUBE_PASS_CHECK_FACES_LAYER_INDEX
 * @param OUTPUT_FIX_HIDDEN_PIECES_DETAILS
 * @param OUTPUT_FIX_HIDDEN_PIECES
 * @param OUTPUT_MIDDLE_CUBE_TO_FIRST_NO
 * @param OUTPUT_CHECK_FACES_LAYER_INDEX_FAILED
 * @param OUTPUT_FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT
 * @param OUTPUT_FIX_LONELY_FACE_OF_CUBE
 */
async function step2(
  ROW_COUNT_ARRAY: number[],
  GOAL_FILE_TOP_PATH: string = "./",
  SOURCE_FILE_TOP_PATH: string = "./",
  OUTPUT_ALONE_FIRST_CUBE: boolean = false,
  OUTPUT_CUBE_PASS_CHECK_FACES_LAYER_INDEX: boolean = false,
  OUTPUT_FIX_HIDDEN_PIECES_DETAILS: boolean = false,
  OUTPUT_FIX_HIDDEN_PIECES: boolean = false,
  OUTPUT_MIDDLE_CUBE_TO_FIRST_NO: boolean = false,
  OUTPUT_CHECK_FACES_LAYER_INDEX_FAILED: boolean = false,
  OUTPUT_FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT: boolean = false,
  OUTPUT_FIX_LONELY_FACE_OF_CUBE: boolean = false,
) {
  enum MiddleFileKind {
    CheckFacesLayerIndexFailed,
    FixLonelyFaceOfCube,
    FixHiddenPieces,
    FixLonelyFaceOfCubeAndAppendIt,
    MiddleCubeToFirstNo,
  }

  const GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH =
    GOAL_FILE_TOP_PATH.replace(/[.\/\\]/g, "").length;
  if (GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH) {
    ensureDirSync(GOAL_FILE_TOP_PATH);
    emptyDirSync(GOAL_FILE_TOP_PATH);
  }

  // const GOAL_CUBE_FILE_PATH =
  //   `${GOAL_FILE_TOP_PATH}cubesOnlyFirstOfTwentyFour/`;
  // ensureDirSync(GOAL_CUBE_FILE_PATH);
  // if (ROW_COUNT_ARRAY.length === 1 && ROW_COUNT_ARRAY[0] === 2) {
  //   emptyDirSync(GOAL_CUBE_FILE_PATH);
  // }

  const STEP_FLAG = "step2";
  const CUBE_NO_STEP = 24;

  const DEBUG = {
    // false true
    CUBE_COUNT_PER_FILE: 10240,

    // Too big: OUTPUT_ROW_COUNT_PER_TIME: 204800,
    OUTPUT_ROW_COUNT_PER_TIME: 20480,

    SHOW_MIDDLE_CUBE_CONVERT_INFO: false,
  };

  const GLOBAL_LOG_CONTENT_ARRAY = [];
  GLOBAL_LOG_CONTENT_ARRAY.push(`begin: ${(new Date()).toLocaleString()}`);
  const DATE_BEGIN = performance.now();

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

    const ROW_COUNT_FLAG = `${ROW_COUNT}rows`;
    const ROW_COUNT_FLAG_PREFIX = `${ROW_COUNT_FLAG}_`;
    const STEP_AND_ROW_COUNT_FLAG = `${STEP_FLAG}_${ROW_COUNT_FLAG}`;

    const GOAL_CUBE_FILE_PATH =
      `${GOAL_FILE_TOP_PATH}cubesOnlyFirstOfTwentyFour_${ROW_COUNT_FLAG}/`;
    ensureDirSync(GOAL_CUBE_FILE_PATH);
    emptyDirSync(GOAL_CUBE_FILE_PATH);

    let logFilenamePostfix = "";
    logFilenamePostfix = `_${STEP_AND_ROW_COUNT_FLAG}`;

    const DEBUG_FILE_PREFIX =
      (GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH ? "" : STEP_FLAG.concat("_"))
        .concat(ROW_COUNT_FLAG_PREFIX);

    log(`begin: ${(new Date()).toLocaleString()}`);
    const DATE_BEGIN = performance.now();

    const ALONE_FIRST_CUBE_PATH =
      `${GOAL_FILE_TOP_PATH}${STEP_AND_ROW_COUNT_FLAG}_29_aloneFirstCube/`;
    if (OUTPUT_ALONE_FIRST_CUBE) {
      ensureDirSync(ALONE_FIRST_CUBE_PATH);
      emptyDirSync(ALONE_FIRST_CUBE_PATH);
    }

    let fixHiddenPiecesFileNo = 0;
    const FIX_HIDDEN_PIECES_DETAILS_PATH =
      `${GOAL_FILE_TOP_PATH}${STEP_AND_ROW_COUNT_FLAG}_22_fixHiddenPiecesDetails/`;
    if (OUTPUT_FIX_HIDDEN_PIECES_DETAILS) {
      ensureDirSync(FIX_HIDDEN_PIECES_DETAILS_PATH);
      emptyDirSync(FIX_HIDDEN_PIECES_DETAILS_PATH);
    }

    const CUBE_PASSED_CHECK_FACES_LAYER_INDEX_PATH =
      `${GOAL_FILE_TOP_PATH}${STEP_AND_ROW_COUNT_FLAG}_21_cubePassedCheckFacesLayerIndex/`;
    if (OUTPUT_CUBE_PASS_CHECK_FACES_LAYER_INDEX) {
      ensureDirSync(CUBE_PASSED_CHECK_FACES_LAYER_INDEX_PATH);
      emptyDirSync(CUBE_PASSED_CHECK_FACES_LAYER_INDEX_PATH);
    }
    let cubePassCheckFacesLayerIndexFileNo = 0;

    const CHECK_FACES_LAYER_INDEX_FAILED_FILENAME =
      `${GOAL_FILE_TOP_PATH}${DEBUG_FILE_PREFIX}checkFacesLayerIndexFailed.txt`;
    const FIX_LONELY_FACE_OF_CUBE_FILENAME =
      `${GOAL_FILE_TOP_PATH}${DEBUG_FILE_PREFIX}fixLonelyFaceOfCube.txt`;
    const FIX_HIDDEN_PIECES_FILENAME =
      `${GOAL_FILE_TOP_PATH}${DEBUG_FILE_PREFIX}fixHiddenPieces.txt`;
    const FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT_FILENAME =
      `${GOAL_FILE_TOP_PATH}${DEBUG_FILE_PREFIX}fixLonelyFaceOfCubeAndAppendIt.txt`;
    const MIDDLE_CUBE_TO_FIRST_NO_FILENAME =
      `${GOAL_FILE_TOP_PATH}${DEBUG_FILE_PREFIX}middleCubeToFirstNo.txt`;
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
    const FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT_FILE_CONTENT_ARRAY: string[] =
      [];
    const MIDDLE_CUBE_TO_FIRST_NO_FILE_CONTENT_ARRAY: string[] = [];

    const MIDDLE_FILE_CONTENT_ARRAY = [
      CHECK_FACES_LAYER_INDEX_FAILED_FILE_CONTENT_ARRAY,
      FIX_LONELY_FACE_OF_CUBE_FILE_CONTENT_ARRAY,
      FIX_HIDDEN_PIECES_FILE_CONTENT_ARRAY,
      FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT_FILE_CONTENT_ARRAY,
      MIDDLE_CUBE_TO_FIRST_NO_FILE_CONTENT_ARRAY,
    ];

    const LAST_MIDDLE_CUBE_NO_ARRAY = [0, 0, 0, 0, 0];
    const MIDDLE_FILE_KIND_COUNT = LAST_MIDDLE_CUBE_NO_ARRAY.length;
    for (
      let middleFileKindIndex = 0;
      middleFileKindIndex < MIDDLE_FILE_KIND_COUNT;
      ++middleFileKindIndex
    ) {
      const FILENAME = MIDDLE_FILENAME_ARRAY[middleFileKindIndex];
      if (existsSync(FILENAME)) {
        Deno.removeSync(FILENAME);
      }
    }

    await (async () => {
      let fileNo = 0;
      let nextCubeNo = 1 - CUBE_NO_STEP +
        (ROW_COUNT === 3 ? EXISTS_CUBE_COUNT.row3 : 0) +
        (ROW_COUNT === 5 ? EXISTS_CUBE_COUNT.row5 : 0);
      const CUBES: Cube[] = [];

      function appendFile(middleFileKind: MiddleFileKind) {
        const CONTENT_ARRAY = MIDDLE_FILE_CONTENT_ARRAY[middleFileKind];
        if (!CONTENT_ARRAY.length) {
          return;
        }

        const FILENAME = MIDDLE_FILENAME_ARRAY[middleFileKind];
        Deno.writeTextFileSync(
          FILENAME,
          CONTENT_ARRAY.join("\n").concat("\n"),
          APPEND_TRUE_FLAG,
        );
        CONTENT_ARRAY.length = 0;
      }

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
      outputCubes();

      for (
        let middleFileKindIndex = 0;
        middleFileKindIndex < MIDDLE_FILE_KIND_COUNT;
        ++middleFileKindIndex
      ) {
        appendFile(middleFileKindIndex);
      }

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
                  const [secondRowIndex, secondColIndex] =
                    secondCellRowColIndex;

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
                frontFaceOptionalMannerArray.forEach(
                  (frontItem, frontIndex) => {
                    backFaceOptionalMannerArray.forEach(
                      (backItem, backIndex) => {
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
                          twelveEdge.canBeInserted = !!twelveEdge.pieces.length;
                        });

                        const twelveEdges = cloned
                          .twelveEdges as OneOfTwelveEdges[];
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
                          const array =
                            turpleArray[0] as OneOrTwoCellRowColIndex[];
                          const item =
                            turpleArray[1] as OneOrTwoCellRowColIndex;
                          const index = turpleArray[2] as number;
                          const USED_ROW_COL_INDEX: string[] = [];

                          // const [firstRowIndex, firstColIndex, secondRowIndex, secondColIndex] =
                          // 	item as OneOrTwoCellRowColIndex;
                          const [
                            currentSelectFirstRowIndex,
                            currentSelectFirstColIndex,
                            currentSelectSecondRowIndex,
                            currentSelectSecondColIndex,
                          ] = item;
                          const CURRENT_SELECT_ARE_TWO_PIECES =
                            typeof currentSelectSecondRowIndex !==
                              "undefined" &&
                            typeof currentSelectSecondColIndex !== "undefined";
                          // console.log("select", ...item);

                          let layerIndex = 0;
                          array.slice(index, index + 1)
                            // array.filter((_o, itemIndex) => itemIndex !== index)
                            .forEach(
                              (otherItem) => {
                                const [
                                  firstRowIndex,
                                  firstColIndex,
                                  secondRowIndex,
                                  secondColIndex,
                                ] = otherItem;
                                const ARE_TWO_PIECES =
                                  typeof secondRowIndex !== "undefined" &&
                                  typeof secondColIndex !== "undefined";

                                if (
                                  !CURRENT_SELECT_ARE_TWO_PIECES &&
                                  ARE_TWO_PIECES
                                ) {
                                  return;
                                }

                                if (ARE_TWO_PIECES) {
                                  if (CURRENT_SELECT_ARE_TWO_PIECES) {
                                    // console.log(
                                    //   `${currentSelectSecondRowIndex}vs${firstRowIndex}, and ${currentSelectSecondColIndex}vs${firstColIndex}`,
                                    // );

                                    if (
                                      (
                                        currentSelectSecondRowIndex ===
                                          firstRowIndex &&
                                        currentSelectSecondColIndex ===
                                          firstColIndex
                                      ) ||
                                      (
                                        currentSelectFirstRowIndex ===
                                          secondRowIndex &&
                                        currentSelectFirstColIndex ===
                                          secondColIndex
                                      )
                                    ) {
                                      // console.log(
                                      //   `return because ${currentSelectSecondRowIndex} === ${firstRowIndex} && ${currentSelectSecondColIndex} === ${firstColIndex}`,
                                      // );
                                      return;
                                    }
                                    // } else {
                                    //   const SEARCH =
                                    //     `${secondRowIndex}${secondColIndex}${firstRowIndex}${firstColIndex}`;
                                    //   if (
                                    //     cloned.sixFaces[sixFaceIndex].filter((
                                    //       [
                                    //         firstRowIndex,
                                    //         firstColIndex,
                                    //         secondRowIndex,
                                    //         secondColIndex,
                                    //       ],
                                    //     ) =>
                                    //       `${firstRowIndex}${firstColIndex}${secondRowIndex}${secondColIndex}` ===
                                    //         SEARCH
                                    //     ).length
                                    //   ) {
                                    //     // console.log('repeat');
                                    //     return;
                                    //   }
                                  }
                                }
                                const FIRST_ROW_COL_INDEX =
                                  `${firstRowIndex}_${firstColIndex}`;
                                if (
                                  USED_ROW_COL_INDEX.indexOf(
                                    FIRST_ROW_COL_INDEX,
                                  ) ===
                                    -1
                                ) {
                                  USED_ROW_COL_INDEX.push(FIRST_ROW_COL_INDEX);
                                  cloned.cells[firstRowIndex][firstColIndex]
                                    .layerIndex = ++layerIndex;
                                }
                                if (ARE_TWO_PIECES) {
                                  const SECOND_ROW_COL_INDEX =
                                    `${secondRowIndex}_${secondColIndex}`;
                                  if (
                                    USED_ROW_COL_INDEX.indexOf(
                                      SECOND_ROW_COL_INDEX,
                                    ) ===
                                      -1
                                  ) {
                                    USED_ROW_COL_INDEX.push(
                                      SECOND_ROW_COL_INDEX,
                                    );
                                    cloned.cells[secondRowIndex][secondColIndex]
                                      .layerIndex = ++layerIndex;
                                  }

                                  cloned.sixFaces[sixFaceIndex].push([
                                    ...otherItem,
                                  ]);
                                }
                              },
                            );

                          const FIRST_ROW_COL_INDEX =
                            `${currentSelectFirstRowIndex}_${currentSelectFirstColIndex}`;
                          if (
                            USED_ROW_COL_INDEX.indexOf(FIRST_ROW_COL_INDEX) ===
                              -1
                          ) {
                            USED_ROW_COL_INDEX.push(FIRST_ROW_COL_INDEX);
                            cloned
                              .cells[currentSelectFirstRowIndex][
                                currentSelectFirstColIndex
                              ]
                              .layerIndex = ++layerIndex;
                          }
                          if (CURRENT_SELECT_ARE_TWO_PIECES) {
                            const SECOND_ROW_COL_INDEX =
                              `${currentSelectSecondRowIndex}_${currentSelectSecondColIndex}`;
                            if (
                              USED_ROW_COL_INDEX.indexOf(
                                SECOND_ROW_COL_INDEX,
                              ) === -1
                            ) {
                              USED_ROW_COL_INDEX.push(SECOND_ROW_COL_INDEX);
                              cloned
                                .cells[currentSelectSecondRowIndex][
                                  currentSelectSecondColIndex
                                ]
                                .layerIndex = ++layerIndex;
                            }

                            sixFaceOutestCellArray.push(
                              cloned
                                .cells[currentSelectSecondRowIndex][
                                  currentSelectSecondColIndex
                                ],
                            );

                            twelveEdges.forEach((edge) => {
                              removeFromPieces(
                                currentSelectFirstRowIndex,
                                currentSelectFirstColIndex,
                              );
                              removeFromPieces(
                                currentSelectSecondRowIndex,
                                currentSelectSecondColIndex,
                              );

                              function removeFromPieces(
                                findRowIndex: number,
                                findColIndex: number,
                              ) {
                                let position = -1;
                                edge.pieces.forEach(
                                  (
                                    [pieceRowIndex, pieceColIndex],
                                    pieceIndex,
                                  ) => {
                                    if (
                                      findRowIndex === pieceRowIndex &&
                                      findColIndex === pieceColIndex
                                    ) {
                                      position = pieceIndex;
                                    }
                                  },
                                );
                                if (position > -1) {
                                  // console.log(
                                  //   "change to face:",
                                  //   findRowIndex,
                                  //   findColIndex,
                                  // );
                                  cells[findRowIndex][findColIndex].feature =
                                    CellFeature.Face;
                                  edge.pieces.splice(position, 1);
                                }
                              }
                            });
                          } else {
                            sixFaceOutestCellArray.push(
                              cloned
                                .cells[currentSelectFirstRowIndex][
                                  currentSelectFirstColIndex
                                ],
                            );
                          }

                          // 不可增加下一句，否则将重复添加（只有“两片合面”的情况才需要添加——上面代码已处理）
                          // cloned.sixFaces[sixFaceIndex].push([
                          //   ...item,
                          // ]);
                        });

                        sixFaceOutestCellArray.forEach(
                          (OUTEST_CELL: CellObject) => {
                            OUTEST_CELL.borderLines.forEach(
                              (borderLine, borderLineIndex) => {
                                if (borderLine !== CellBorderLine.InnerLine) {
                                  const twelveEdgeIndex: TwelveEdge =
                                    getSixFaceTwentyFourAngleRelationTwelveEdge(
                                      OUTEST_CELL.sixFaceTwentyFourAngle,
                                      borderLineIndex,
                                    );

                                  if (
                                    !twelveEdges[twelveEdgeIndex].canBeInserted
                                  ) {
                                    twelveEdges[twelveEdgeIndex].canBeInserted =
                                      true;
                                  }
                                }
                              },
                            );
                          },
                        );

                        twelveEdges.forEach((oneEdge, edgeIndex) => {
                          oneEdge.pieces.forEach((cellRowColIndex) => {
                            const [rowIndex, colIndex] = cellRowColIndex;
                            const pieceCell = cells[rowIndex][colIndex];
                            pieceCell.feature = CellFeature.Piece;
                            pieceCell.twelveEdge = edgeIndex;

                            const {
                              rowIndex: relatedRowIndex,
                              colIndex: relatedColIndex,
                              // relation,
                            } = pieceCell.relatedInformationWhenAdding;

                            if (relatedRowIndex === -1) {
                              pieceCell.borderLines.forEach(
                                (borderLine, borderLineIndex) => {
                                  if (borderLine === CellBorderLine.InnerLine) {
                                    switch (
                                      borderLineIndex as ConnectionRelation
                                    ) {
                                      case ConnectionRelation.Top:
                                        pieceCell.layerIndex =
                                          cells[rowIndex - 1][colIndex]
                                            .layerIndex +
                                          1;
                                        break;
                                      case ConnectionRelation.Bottom:
                                        pieceCell.layerIndex =
                                          cells[rowIndex + 1][colIndex]
                                            .layerIndex +
                                          1;
                                        break;
                                      case ConnectionRelation.Left:
                                        pieceCell.layerIndex =
                                          cells[rowIndex][colIndex - 1]
                                            .layerIndex +
                                          1;
                                        break;
                                      case ConnectionRelation.Right:
                                        pieceCell.layerIndex =
                                          cells[rowIndex][colIndex + 1]
                                            .layerIndex +
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
                                cells[relatedRowIndex][relatedColIndex]
                                  .layerIndex +
                                1;
                            }
                          });
                        });

                        // console.log(
                        //   "sixFaces",
                        //   JSON.stringify(cloned.sixFaces),
                        //   "twelveEdges",
                        //   JSON.stringify(cloned.twelveEdges),
                        // );
                        // appendCubeWithoutOneToTwentyFour(cloned);
                        if (cloned.checkFacesLayerIndex()) {
                          if (OUTPUT_CUBE_PASS_CHECK_FACES_LAYER_INDEX) {
                            Deno.writeTextFileSync(
                              `${CUBE_PASSED_CHECK_FACES_LAYER_INDEX_PATH}${
                                (++cubePassCheckFacesLayerIndexFileNo)
                                  .toString()
                              }.js`,
                              `const cube_${cubePassCheckFacesLayerIndexFileNo} = ${
                                JSON.stringify(cloned)
                              };\n// ${cloned.getManner()}`,
                            );
                          }
                          fixLonelyFaceOfCubeAndAppendIt(cloned);
                        } else {
                          if (OUTPUT_CHECK_FACES_LAYER_INDEX_FAILED) {
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
                        }
                      },
                    );
                  },
                );
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
              pieceCell.relatedInformationWhenAdding.rowIndex ===
                firstRowIndex &&
              pieceCell.relatedInformationWhenAdding.colIndex === firstColIndex
            ) {
              RELATION_PIECE_CELL_ARRAY.push(pieceCell);
            }
          });
          if (INNER_LINE_COUNT - RELATION_PIECE_CELL_ARRAY.length === 1) {
            LONELY_FACE_CELL_ARRAY.push(CELL);

            (CELL as unknown as { relationPieceCellArray: CellObject[] })
              .relationPieceCellArray = RELATION_PIECE_CELL_ARRAY;

            const CELL_SIX_FACE = CELL.sixFace;
            const SAME_FACE_PIECE_CELL_ARRAY: CellObject[] = [];
            PIECE_CELL_ARRAY.forEach((pieceCell) => {
              if (pieceCell.sixFace === CELL_SIX_FACE) {
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
        const TAB = "\t".repeat(recursiveTimes - 1);

        if (OUTPUT_FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT) {
          console.log({
            recursiveTimes,
            cubeNo: CUBE_NO,
            LONELY_FACE_CELL_ARRAY_LENGTH,
          });
          appendContent(
            `${recursiveTimes}\t${CUBE_NO}\t${LONELY_FACE_CELL_ARRAY_LENGTH}`,
            MiddleFileKind.FixLonelyFaceOfCubeAndAppendIt,
          );
        }

        if (OUTPUT_FIX_LONELY_FACE_OF_CUBE) {
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
        }

        const FIRST_LONELY_FACE_CELL = LONELY_FACE_CELL_ARRAY[0];
        const { sameFacePieceCellArray, relationPieceCellArray } =
          FIRST_LONELY_FACE_CELL as unknown as {
            sameFacePieceCellArray: CellObject[];
            relationPieceCellArray: CellObject[];
          };
        if (OUTPUT_FIX_LONELY_FACE_OF_CUBE) {
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
        }

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
        const CUBE_ORIGINAL = cube.clone();

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
              const {
                sixFace: PIECE_CELL_SIX_FACE,
                // faceDirection: PIECE_CELL_FACE_DIRECTION,
              } = PIECE_CELL;
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
              const SAME_FACE_CELL_INFO_COUNT =
                SAME_FACE_CELL_INFO_ARRAY.length;
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
                    getCellByCellIndex(
                        secondCell.getConnectedCellIndexByRelation(
                          PIECE_CELL_REVERSED_RELATION,
                        ),
                      )?.feature === CellFeature.Face
                  ) {
                    hasOuterFace = true;
                    break;
                  }
                }
              }

              if (hasOuterFace) {
                REMOVE_INDEX_ARRAY.push(pieceIndex);
                // CELL_ARRAY.filter((cell) =>
                //   cell.feature === CellFeature.Face &&
                //   cell.sixFace === PIECE_CELL_SIX_FACE
                // ).forEach((cell) => ++cell.layerIndex);
                const SAME_FACE_CELL_INFO_ARRAY = sixFaces[PIECE_CELL_SIX_FACE];
                const SAME_FACE_CELL_INFO_COUNT =
                  SAME_FACE_CELL_INFO_ARRAY.length;
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
                  ++firstCell.layerIndex;

                  if (
                    typeof secondRowIndex !== "undefined" &&
                    typeof secondColIndex !== "undefined"
                  ) {
                    const secondCell = cells[secondRowIndex][secondColIndex];
                    ++secondCell.layerIndex;
                  }
                }

                // bug: error array
                // sixFaces[PIECE_CELL_RELATION_CELL_SIX_FACE].unshift([
                //   pieceRowIndex,
                //   pieceColIndex,
                // ]);
                // console.log({
                //   no: cube.no,
                //   PIECE_CELL_SIX_FACE,
                //   PIECE_CELL_RELATION_CELL_SIX_FACE,
                //   old: JSON.stringify(sixFaces[PIECE_CELL_SIX_FACE]),
                //   pieceRowIndex,
                //   pieceColIndex,
                // });
                sixFaces[PIECE_CELL_SIX_FACE].unshift([
                  pieceRowIndex,
                  pieceColIndex,
                ]);

                PIECE_CELL.feature = CellFeature.Face;

                // 	<en_us>en_us</en_us>
                // 	<zh_cn>会导致压缩正方体数据时出现负数</zh_cn>
                // 	<zh_tw>zh_tw</zh_tw>
                // PIECE_CELL.layerIndex = 0;

                PIECE_CELL.layerIndex = 1;

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
          if (OUTPUT_FIX_HIDDEN_PIECES) {
            // Deno.writeTextFileSync(
            //   FIX_HIDDEN_PIECES_FILENAME,
            //   JSON.stringify(cube),
            //   APPEND_TRUE_FLAG,
            // );
            // appendContent(
            //   JSON.stringify(cube),
            //   MiddleFileKind.FixHiddenPieces,
            // );
            appendContent(
              `${JSON.stringify(CUBE_ORIGINAL)}\nto\n${JSON.stringify(cube)}`,
              MiddleFileKind.FixHiddenPieces,
            );
          }
          if (OUTPUT_FIX_HIDDEN_PIECES_DETAILS) {
            Deno.writeTextFileSync(
              `${FIX_HIDDEN_PIECES_DETAILS_PATH}${cube.no}_${++fixHiddenPiecesFileNo}_from.js`,
              `const fixHiddenPieces_${cube.no} = ${
                JSON.stringify(CUBE_ORIGINAL)
              };`,
            );
            Deno.writeTextFileSync(
              `${FIX_HIDDEN_PIECES_DETAILS_PATH}${cube.no}_${fixHiddenPiecesFileNo}_to.js`,
              `const fixHiddenPieces_${cube.no} = ${JSON.stringify(cube)};`,
            );
          }
        }
        appendCubeWithoutOneToTwentyFour(cube);
      }

      function appendCubeWithoutOneToTwentyFour(cube: Cube) {
        nextCubeNo += CUBE_NO_STEP;
        if (OUTPUT_MIDDLE_CUBE_TO_FIRST_NO) {
          appendContent(
            // nextCubeNo.toString(),
            `${nextCubeNo}: ${cube.getManner()}`,
            MiddleFileKind.MiddleCubeToFirstNo,
          );
        }
        cube.no = nextCubeNo;
        cube.countLayerIndex();
        CUBES.push(cube);

        if (OUTPUT_ALONE_FIRST_CUBE) {
          Deno.writeTextFileSync(
            `${ALONE_FIRST_CUBE_PATH}${nextCubeNo}.js`,
            `const cube_${nextCubeNo} = ${
              JSON.stringify(cube)
            };\n// ${cube.getManner()}`,
          );
        }

        if (CUBES.length >= DEBUG.CUBE_COUNT_PER_FILE) {
          outputCubes();
        }
      }

      function outputCubes() {
        if (!CUBES.length) {
          return;
        }

        const GOAL_FILE_NAME = `${GOAL_CUBE_FILE_PATH}${ROW_COUNT_FLAG_PREFIX}${
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

    showUsedTime("end");
    log(`end: ${(new Date()).toLocaleString()}`);
    logUsedTime(
      `${STEP_AND_ROW_COUNT_FLAG}: Total`,
      performance.now() - DATE_BEGIN,
    );

    const LOG_FILE_NAME_IN_CURRENT_PATH = `log_${STEP_FLAG}.txt`;
    const LOG_FILE_NAME_IN_OTHER_PATH =
      `${GOAL_FILE_TOP_PATH}log${logFilenamePostfix}.txt`;
    copySync(
      LOG_FILE_NAME,
      LOG_FILE_NAME_IN_CURRENT_PATH,
      OVER_WRITE_TRUE_FLAG,
    );
    if (LOG_FILE_NAME_IN_CURRENT_PATH !== LOG_FILE_NAME_IN_OTHER_PATH) {
      copySync(
        LOG_FILE_NAME,
        LOG_FILE_NAME_IN_OTHER_PATH,
        OVER_WRITE_TRUE_FLAG,
      );
    }
    Deno.removeSync(LOG_FILE_NAME);
  }

  GLOBAL_LOG_CONTENT_ARRAY.push(`  end: ${(new Date()).toLocaleString()}`);
  GLOBAL_LOG_CONTENT_ARRAY.push(
    getUsedTimeString("Total", performance.now() - DATE_BEGIN),
  );
  Deno.writeTextFileSync(
    `log_${STEP_FLAG}.txt`,
    GLOBAL_LOG_CONTENT_ARRAY.join("\n"),
  );
}

/**
 * 计算所有正方体（1转24），压缩保存（分为线条lines.txt、正方体核心信息cubes_×rows、拼插方案manners_×rows三部分）
 * @param ROW_COUNT_ARRAY 数组：纸模行数
 * @param GOAL_FILE_TOP_PATH 保存路径根目录
 * @param SOURCE_FILE_TOP_PATH 源文件根目录
 * @param OUTPUT_FULL_CUBE
 * @param OUTPUT_READ_CUBE
 * @param SHOW_GET_CLONED_CUBE_BY_MANNER_INDEX_DETAIL
 * @param MINI_OUTPUT 最小输出。当启用此功能时，不需要第四步，也不需要输出太多文件，直接输出mannerToCube/~mannerName~.js文件系列
 */
async function step3(
  ROW_COUNT_ARRAY: number[],
  GOAL_FILE_TOP_PATH: string = "./",
  SOURCE_FILE_TOP_PATH: string = "cubesOnlyFirstOfTwentyFour",
  OUTPUT_FULL_CUBE: boolean = false,
  OUTPUT_READ_CUBE: boolean = false,
  SHOW_GET_CLONED_CUBE_BY_MANNER_INDEX_DETAIL: boolean = false,
  MINI_OUTPUT: boolean = false,
) {
  const GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH =
    GOAL_FILE_TOP_PATH.replace(/[.\/\\]/g, "").length;
  if (GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH) {
    ensureDirSync(GOAL_FILE_TOP_PATH);
    emptyDirSync(GOAL_FILE_TOP_PATH);
  }

  const STEP_FLAG = "step3";

  const GLOBAL_LOG_CONTENT_ARRAY = [];
  GLOBAL_LOG_CONTENT_ARRAY.push(`begin: ${(new Date()).toLocaleString()}`);
  const DATE_BEGIN = performance.now();

  //  同一方案24个角度
  const MANNER_COUNT = ANGLE_COUNT;

  // const MINI_OUTPUT_FILE_PATH = `${GOAL_FILE_TOP_PATH}mannerToCube/`;
  // if (MINI_OUTPUT) {
  //   ensureDirSync(MINI_OUTPUT_FILE_PATH);
  //   emptyDirSync(MINI_OUTPUT_FILE_PATH);
  // }
  // const ROW_COUNT_TO_MANNER_ARRAY: string[][] = [[], [], [], [], [], []];
  const MANNER_TO_CUBE_MAP_ARRAY: string[] = [];
  const MANNER_VALUE_ARRAY: string[] = [];
  const MANNER_VALUE_SET = new Set<string>();
  const CURRENT_ROW_COUNT_MANNER_ARRAY: number[] = [];
  let mannerValueCount = 0;

  const MINI_OUTPUT_FLAG_POSTFIX = MINI_OUTPUT ? `_mini_output` : "";

  for (let rowCountLoop = 2; rowCountLoop <= 5; ++rowCountLoop) {
    const ROW_COUNT = rowCountLoop;
    if (!ROW_COUNT_ARRAY.filter((value) => value === ROW_COUNT).length) {
      continue;
    }

    const ROW_COUNT_FLAG = `${ROW_COUNT}rows`;
    const ROW_COUNT_FLAG_PREFIX = `${ROW_COUNT_FLAG}_`;
    const ROW_COUNT_FLAG_POSTFIX =
      `_${ROW_COUNT_FLAG}${MINI_OUTPUT_FLAG_POSTFIX}`;
    const STEP_AND_ROW_COUNT_FLAG = `${STEP_FLAG}_${ROW_COUNT_FLAG}`;

    // const SOURCE_FILE_PATH = `${ROW_COUNT_FLAG_PREFIX}${SOURCE_FILE_TOP_PATH}/`;
    const SOURCE_FILE_PATH = `${SOURCE_FILE_TOP_PATH}_${ROW_COUNT_FLAG}/`;
    if (!existsSync(SOURCE_FILE_PATH)) {
      continue;
    }

    let logFilenamePostfix = "";
    logFilenamePostfix =
      `_${STEP_AND_ROW_COUNT_FLAG}${MINI_OUTPUT_FLAG_POSTFIX}`;

    const LOG_FILE_NAME = "./log.txt";
    if (!MINI_OUTPUT && existsSync(LOG_FILE_NAME)) {
      Deno.removeSync(LOG_FILE_NAME);
    }

    const DEBUG_FILE_PREFIX =
      (GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH ? "" : STEP_FLAG.concat("_"))
        .concat(ROW_COUNT_FLAG_PREFIX);

    log(`begin: ${(new Date()).toLocaleString()}`);
    const DATE_BEGIN = performance.now();

    const READ_CUBE_PATH =
      `${GOAL_FILE_TOP_PATH}${STEP_AND_ROW_COUNT_FLAG}_31_readCube/`;
    if (OUTPUT_READ_CUBE) {
      ensureDirSync(READ_CUBE_PATH);
      emptyDirSync(READ_CUBE_PATH);
    }

    const FULL_CUBE_PATH =
      `${GOAL_FILE_TOP_PATH}${STEP_AND_ROW_COUNT_FLAG}_39_fullCube/`;
    if (OUTPUT_FULL_CUBE) {
      ensureDirSync(FULL_CUBE_PATH);
      emptyDirSync(FULL_CUBE_PATH);
    }

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

      const CUBE_GOAL_FILE_PATH =
        `${GOAL_FILE_TOP_PATH}cubes${ROW_COUNT_FLAG_POSTFIX}/`;
      if (!MINI_OUTPUT) {
        ensureDirSync(CUBE_GOAL_FILE_PATH);
        emptyDirSync(CUBE_GOAL_FILE_PATH);
      }

      const MANNER_CUBES_GOAL_FILE_PATH =
        `${GOAL_FILE_TOP_PATH}manners${ROW_COUNT_FLAG_POSTFIX}/`;
      if (!MINI_OUTPUT) {
        ensureDirSync(MANNER_CUBES_GOAL_FILE_PATH);
        emptyDirSync(MANNER_CUBES_GOAL_FILE_PATH);
      }

      // 	<en_us>en_us</en_us>
      // 	<zh_cn>2行5列时先清除文件，其它情况则使用追加模式（如果之前有数据，不清空）</zh_cn>
      // 	<zh_tw>zh_tw</zh_tw>
      const CUBE_LINES_FILE_NAME =
        `${GOAL_FILE_TOP_PATH}lines${MINI_OUTPUT_FLAG_POSTFIX}.txt`;
      // if (!MINI_OUTPUT && ROW_COUNT === 2 && existsSync(CUBE_LINES_FILE_NAME)) {
      if (ROW_COUNT === 2 && existsSync(CUBE_LINES_FILE_NAME)) {
        Deno.removeSync(CUBE_LINES_FILE_NAME);
      }

      let sourceFilename = "";
      for await (const dirEntry of Deno.readDir(SOURCE_FILE_PATH)) {
        const filename = path.join(SOURCE_FILE_PATH, dirEntry.name);
        const stats = Deno.statSync(filename);
        if (stats.isFile) {
          // if (!filename.startsWith(ROW_COUNT_FLAG_PREFIX)) {
          //   continue;
          // }
          sourceFilename = filename;
          showUsedTime(`read file: ${filename}`);
          Deno.readTextFileSync(filename).split("\n").forEach((codeLine) => {
            const cube = getCubeFromJson(codeLine);
            batchAppendCubeOneToTwentyFour(cube);
          });

          if (MINI_OUTPUT) {
            const MANNER_VALUE_ARRAY = [...MANNER_VALUE_SET];
            MANNER_VALUE_ARRAY.sort();

            const MANNER_ARRAY: string[] = [];
            const COUNT = CURRENT_ROW_COUNT_MANNER_ARRAY.length;
            for (let i = 0; i < COUNT; ++i) {
              MANNER_ARRAY.push(
                MANNER_VALUE_ARRAY[CURRENT_ROW_COUNT_MANNER_ARRAY[i]],
              );
            }
            Deno.writeTextFileSync(
              `${GOAL_FILE_TOP_PATH}mannerToCubeMap${ROW_COUNT_FLAG_POSTFIX}.txt`,
              MANNER_ARRAY.join("\n").concat("\n"),
              APPEND_TRUE_FLAG,
            );
            CURRENT_ROW_COUNT_MANNER_ARRAY.length = 0;

            Deno.writeTextFileSync(
              `${GOAL_FILE_TOP_PATH}mannerToCubeMap.txt`,
              MANNER_TO_CUBE_MAP_ARRAY.join("\n").concat("\n"),
              APPEND_TRUE_FLAG,
            );

            Deno.writeTextFileSync(
              `${GOAL_FILE_TOP_PATH}manner.txt`,
              MANNER_VALUE_ARRAY.join("\n").concat("\n"),
              APPEND_TRUE_FLAG,
            );

            mannerValueCount = 0;
            CURRENT_ROW_COUNT_MANNER_ARRAY.length = 0;
            MANNER_VALUE_ARRAY.length = 0;
            MANNER_TO_CUBE_MAP_ARRAY.length = 0;

            MANNER_VALUE_SET.clear();
          }
        }
      }
      outputCubes();

      function batchAppendCubeOneToTwentyFour(cube: Cube) {
        // // 这里临时打了个补丁，第二步应该处理好图层问题
        // cube.countLayerIndex();

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
        // const OLD_SIX_FACES = JSON.parse(JSON.stringify(cube.sixFaces));
        // log(
        //   `batchAppendCubeOneToTwentyFour(), cube_${cube.no}.faces:\n${
        //     OLD_SIX_FACES.map((oldFaces) =>
        //       oldFaces.map((face) => {
        //         const [row1, col1, row2, col2] = face;
        //         return `${row1}${col1}${OLD_CELLS[row1][col1].sixFace}${
        //           (typeof row2 !== "undefined" &&
        //               typeof col2 !== "undefined")
        //             ? `_${row2}${col2}${OLD_CELLS[row2][col2].sixFace}`
        //             : ""
        //         }`;
        //       }).join("_")
        //     ).join(",")
        //   }\n${
        //     [0, 1, 2, 3, 4, 5].map((sixFace) =>
        //       cube.actCells.filter((cell) => cell.sixFace === sixFace).map(
        //         (cell) => OLD_CELLS[cell.rowIndex][cell.colIndex],
        //       ).map((cell) => `${cell.rowIndex}${cell.colIndex}${cell.sixFace}`)
        //         .join("_")
        //     ).join("\t")
        //   }\n\t${
        //     [0, 1, 2, 3, 4, 5].map((sixFace) =>
        //       cube.actCells.filter((cell) => cell.sixFace === sixFace).map(
        //         (cell) => `${cell.rowIndex}${cell.colIndex}`,
        //       ).join("_")
        //     ).join("\t")
        //   }`,
        // );

        if (OUTPUT_READ_CUBE) {
          const CUBE_NO = cube.no;
          Deno.writeTextFileSync(
            `${READ_CUBE_PATH}input.${CUBE_NO}.js`,
            `const cube_${CUBE_NO} = ${JSON.stringify(cube)};`,
          );
          Deno.writeTextFileSync(
            `${READ_CUBE_PATH}input.${CUBE_NO}.sixFaces.txt`,
            `${JSON.stringify(OLD_SIX_FACES)}`,
          );
        }

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
        gridLines.forEach(({ xStart, _xEnd, yStart, yEnd, lineStyle }) => {
          if (yStart === yEnd) {
            LINE_ARRAY[colCount * yStart + xStart] = lineStyle;
          } else {
            LINE_ARRAY[
              VERTICAL_LINE_INDEX_OFFSET + (colCount + 1) * yStart + xStart
            ] = lineStyle;
          }
        });
        cubeLinesFileContent += (cubeLinesFileContent.length ? "\n" : "")
          .concat(
            LINE_ARRAY.join(""),
          );

        const MAX_ADD_ORDER = cube.actCells.map((cell) =>
          cell.addOrder
        ).sort((prev, next) => prev - next).reverse()[0];
        const CORE_CELL_IS_PIECE =
          OLD_CELLS[CORE_ROW_INDEX][CORE_COL_INDEX].feature ===
            CellFeature.Piece;

        for (let mannerIndex = 0; mannerIndex < MANNER_COUNT; ++mannerIndex) {
          const cloned = getClonedCubeByMannerIndex(
            cube,
            mannerIndex,
            OLD_SIX_FACES,
            // JSON.parse(JSON.stringify(cube.sixFaces)),
            OLD_TWELVE_EDGES,
            // OLD_CELLS,
            MAX_ADD_ORDER,
            CORE_CELL_IS_PIECE,
          );
          cloned.no = START_NO + mannerIndex;
          // if (OUTPUT_READ_CUBE) {
          //   Deno.writeTextFileSync(
          //     `${READ_CUBE_PATH}output.${START_NO}.${mannerIndex}.sixFaces.txt`,
          //     `${JSON.stringify(cloned.sixFaces)}`,
          //   );
          //   Deno.writeTextFileSync(
          //     `${READ_CUBE_PATH}output.${START_NO}.${mannerIndex}.twelveEdges.txt`,
          //     `${JSON.stringify(cloned.twelveEdges)}`,
          //   );
          // }

          cloned.syncAndClear();

          const MANNER = cloned.getManner();
          (cloned as unknown as { manner: string }).manner = MANNER;

          appendCube(cloned);
        }
      }

      function appendCube(cube: Cube) {
        if (MINI_OUTPUT) {
          const MANNNER = cube.getManner();

          // 240513，改用Set

          // for (let i = 0; i < mannerValueCount; ++i) {
          //   if (MANNNER === MANNER_VALUE_ARRAY[i]) {
          //     return;
          //   }
          // }
          // MANNER_VALUE_ARRAY.push(MANNNER);

          const OLD_SIZE = MANNER_VALUE_SET.size;
          MANNER_VALUE_SET.add(MANNNER);
          if (OLD_SIZE === MANNER_VALUE_SET.size) {
            return;
          }

          CURRENT_ROW_COUNT_MANNER_ARRAY.push(mannerValueCount);
          ++mannerValueCount;

          // before 20240513
          // const {
          //   no,
          //   rowCount,
          //   // colCount,
          //   firstRowActCellColIndexBill,
          //   lastRowEmptyCellColIndexBill,

          //   actCells,
          //   gridLines,
          // } = cube;
          // // ${COL_COUNT}
          // MANNER_TO_CUBE_MAP_ARRAY.push(
          //   `${MANNNER}\t${no}:${rowCount}_${firstRowActCellColIndexBill}|${lastRowEmptyCellColIndexBill}_${
          //     actCells.map((cell) => {
          //       const {
          //         layerIndex,
          //         // relation,
          //         relatedInformationWhenAdding: { relation },
          //         feature,
          //         sixFace,
          //         faceDirection,
          //         twelveEdge,
          //         rowIndex,
          //         colIndex,
          //       } = cell;
          //       // const relation = relatedInformationWhenAdding;
          //       return `${rowIndex}${colIndex}${relation}${layerIndex}${feature}${sixFace}${faceDirection},${twelveEdge}`;
          //     }).join("|")
          //   }_${
          //     gridLines.map(({ xStart, xEnd, yStart, yEnd, lineStyle }) =>
          //       `${xStart}${xEnd}${yStart}${yEnd}${lineStyle}`
          //     ).join("|")
          //   }`,
          // );

          // 20240513
          const {
            no,
            rowCount,
            actCells,
            lines,
          } = cube;
          // ${COL_COUNT}
          MANNER_TO_CUBE_MAP_ARRAY.push(
            `${MANNNER}\t${no}:${rowCount}_${
              actCells.map((cell) => {
                const {
                  layerIndex,
                  // relation,
                  relatedInformationWhenAdding: { relation },
                  feature,
                  sixFace,
                  faceDirection,
                  twelveEdge,
                  rowIndex,
                  colIndex,
                } = cell;
                // const relation = relatedInformationWhenAdding;
                return `${rowIndex}${colIndex}${relation}${layerIndex}${feature}${sixFace}${faceDirection},${twelveEdge}`;
              }).join("|")
            }_${lines}`,
          );

          return;
        }

        CUBES.push(cube);
        const CUBE_NO = cube.no;
        if (OUTPUT_FULL_CUBE) {
          Deno.writeTextFileSync(
            `${FULL_CUBE_PATH}full_${CUBE_NO}.js`,
            `const cube_${CUBE_NO} = ${JSON.stringify(cube)};`,
          );
        }
        if (OUTPUT_READ_CUBE) {
          Deno.writeTextFileSync(
            `${READ_CUBE_PATH}output.${CUBE_NO}.txt`,
            `${cube.getManner()}\n${JSON.stringify(cube.sixFaces)}\n${
              JSON.stringify(cube.twelveEdges)
            }`,
          );
          // Deno.writeTextFileSync(
          //   `${READ_CUBE_PATH}output.${CUBE_NO}.twelveEdges.txt`,
          //   `${JSON.stringify(cube.twelveEdges)}`,
          // );
        }

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
              if (FEATURE_AND_LAYERINDEX.toString(16).indexOf("-") > -1) {
                log(
                  `${FEATURE_AND_LAYERINDEX} => ${
                    FEATURE_AND_LAYERINDEX.toString(16)
                  } <= ${FEATURE_AND_LAYERINDEX} <= ${feature}, ${layerIndex}`,
                );
              }
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
                      getReversedRelation(relation),
                      // relation % 2 === 0
                      //   ? (2 - relation)
                      //   : 1 + floor(relation / 2),
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
        // Deno.writeTextFileSync(
        //   CUBE_LINES_FILE_NAME,
        //   (fileNo === 1 ? "" : "\n").concat(cubeLinesFileContent),
        //   APPEND_TRUE_FLAG,
        // );
        Deno.writeTextFileSync(
          CUBE_LINES_FILE_NAME,
          (existsSync(CUBE_LINES_FILE_NAME) ? "\n" : "").concat(
            cubeLinesFileContent,
          ),
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
        MAX_ADD_ORDER: number,
        CORE_CELL_IS_PIECE: boolean,
      ) {
        const { coreRowIndex: CORE_ROW_INDEX, coreColIndex: CORE_COL_INDEX } =
          cube;

        const cloned = cube.clone();

        const { cells, actCells, sixFaces, twelveEdges } = cloned;
        const CELL_ARRAY = cloned.getCellArray();

        const [CORE_CELL_SIX_FACE, CORE_CELL_FOUR_DIRECTION] =
          convertSixFaceTwentyFourAngleToSixFaceAndDirection(mannerIndex);
        const CORE_CELL = cells[CORE_ROW_INDEX][CORE_COL_INDEX];
        CORE_CELL.sixFace = CORE_CELL_SIX_FACE;
        CORE_CELL.faceDirection = CORE_CELL_FOUR_DIRECTION;

        const NEW_SIX_FACE_ARRAY: string[] =
          SHOW_GET_CLONED_CUBE_BY_MANNER_INDEX_DETAIL
            ? []
            : undefined as unknown as string[];
        if (SHOW_GET_CLONED_CUBE_BY_MANNER_INDEX_DETAIL) {
          NEW_SIX_FACE_ARRAY.push(
            `1: ${CORE_ROW_INDEX}${CORE_COL_INDEX}${CORE_CELL_SIX_FACE}${CORE_CELL_FOUR_DIRECTION}`,
          );
        }
        for (let addOrder = 2; addOrder <= MAX_ADD_ORDER; ++addOrder) {
          if (SHOW_GET_CLONED_CUBE_BY_MANNER_INDEX_DETAIL) {
            NEW_SIX_FACE_ARRAY.push(
              `\n${addOrder}: `,
            );
          }

          // cells.forEach((cellRow) =>
          //   cellRow.filter((cell) => cell.addOrder === addOrder).forEach(
          //     (cell) => {
          //       const { rowIndex, colIndex, relation: RELATION } =
          //         cell.relatedInformationWhenAdding;
          //       const RELATED_CELL = cells[rowIndex][colIndex];
          //       const [newSixFace, newFaceDirection] =
          //         convertSixFaceTwentyFourAngleToSixFaceAndDirection(
          //           SIX_FACE_AND_DIRECTION_RELATIONS[
          //             RELATED_CELL.sixFaceTwentyFourAngle
          //           ][RELATION],
          //         );
          //       cell.sixFace = newSixFace;
          //       cell.faceDirection = newFaceDirection;
          //     },
          //   )
          // );

          CELL_ARRAY.filter((cell) =>
            cell.addOrder === addOrder
          ).forEach(
            (cell) => {
              const { rowIndex, colIndex, relation: RELATION } =
                cell.relatedInformationWhenAdding;
              const RELATED_CELL = cells[rowIndex][colIndex];
              const { sixFaceTwentyFourAngle } = RELATED_CELL;
              // const [newSixFace, newFaceDirection] =
              //   convertSixFaceTwentyFourAngleToSixFaceAndDirection(
              //     SIX_FACE_AND_DIRECTION_RELATIONS[
              //       sixFaceTwentyFourAngle
              //     ][RELATION],
              //   );
              const newSixFaceTwentyFourAngle =
                SIX_FACE_AND_DIRECTION_RELATIONS[
                  sixFaceTwentyFourAngle
                ][RELATION];
              const [newSixFace, newFaceDirection] =
                convertSixFaceTwentyFourAngleToSixFaceAndDirection(
                  newSixFaceTwentyFourAngle,
                );
              cell.sixFace = newSixFace;
              cell.faceDirection = newFaceDirection;

              cell.twelveEdge = getSixFaceTwentyFourAngleRelationTwelveEdge(
                sixFaceTwentyFourAngle,
                RELATION,
              );

              if (SHOW_GET_CLONED_CUBE_BY_MANNER_INDEX_DETAIL) {
                NEW_SIX_FACE_ARRAY.push(
                  `${cell.rowIndex}${cell.colIndex}${newSixFace}${newFaceDirection}=${newSixFaceTwentyFourAngle}=${cell.sixFaceTwentyFourAngleStr}<=${rowIndex}${colIndex}[${sixFaceTwentyFourAngle}][${RELATION}],`,
                );
              }
            },
          );
        }
        if (CORE_CELL_IS_PIECE) {
          // console.log("CORE_CELL_IS_PIECE");
          // const { rowIndex, colIndex } = actCells.filter((cell) =>
          //   cell.addOrder === 2
          // )[0];
          // const RELATED_CELL = cells[rowIndex][colIndex];
          const RELATED_CELL =
            CELL_ARRAY.filter((cell) => cell.addOrder === 2)[0];
          const { sixFaceTwentyFourAngle } = RELATED_CELL;

          const RELATION = RELATED_CELL.relatedInformationWhenAdding.relation;
          const REVERSED_RELATION = getReversedRelation(RELATION);
          // error: 2 - RELATION % 2 + 2 * floor(RELATION / 2),
          // right: relation % 2 + 2 * (1 - Math.floor(relation / 2));

          CORE_CELL.twelveEdge = getSixFaceTwentyFourAngleRelationTwelveEdge(
            sixFaceTwentyFourAngle,
            REVERSED_RELATION,
          );

          // TODO(@anqisoft) delete
          const [newSixFace, newFaceDirection] =
            convertSixFaceTwentyFourAngleToSixFaceAndDirection(
              SIX_FACE_AND_DIRECTION_RELATIONS[sixFaceTwentyFourAngle][
                REVERSED_RELATION
              ],
            );
          // CORE_CELL.sixFace = newSixFace;
          // CORE_CELL.faceDirection = newFaceDirection;
          if (
            newSixFace !== CORE_CELL_SIX_FACE ||
            newFaceDirection !== CORE_CELL_FOUR_DIRECTION
          ) {
            log(
              `[error]${newSixFace}vs${CORE_CELL_SIX_FACE},${newFaceDirection}vs${CORE_CELL_FOUR_DIRECTION}`,
            );
          }
        }

        if (SHOW_GET_CLONED_CUBE_BY_MANNER_INDEX_DETAIL) {
          log(`\n${NEW_SIX_FACE_ARRAY.join("")}`);
          NEW_SIX_FACE_ARRAY.length = 0;
        }

        // cloned.sync();
        // log(
        //   `after recount sixFace ${mannerIndex} times:\n${
        //     [0, 1, 2, 3, 4, 5].map((sixFace) =>
        //       cube.actCells.filter((cell) => cell.sixFace === sixFace).map(
        //         (cell) => cells[cell.rowIndex][cell.colIndex],
        //       ).map((cell) => `${cell.rowIndex}${cell.colIndex}${cell.sixFace}`)
        //         .join("_")
        //     ).join("\t")
        //   }\n\t${
        //     [0, 1, 2, 3, 4, 5].map((sixFace) =>
        //       cloned.actCells.filter((cell) => cell.sixFace === sixFace).map(
        //         (cell) => `${cell.rowIndex}${cell.colIndex}`,
        //       ).join("_")
        //     ).join("\t")
        //   }`,
        // );

        sixFaces.forEach((face, faceIndex) => {
          face.length = 0;

          let find = false;
          OLD_SIX_FACES.forEach((oldFaces: FaceMemberOfSixFace) => {
            if (oldFaces.length === 0) {
              Deno.writeTextFileSync(
                `${GOAL_FILE_TOP_PATH}${DEBUG_FILE_PREFIX}error_cube_${cube.no}.ts`,
                `const _error_cube = ${JSON.stringify(cube)};`,
              );
            }
            const [rowIndex, colIndex] = oldFaces[0];
            if (cells[rowIndex][colIndex].sixFace === faceIndex) {
              oldFaces.forEach((item) => face.push(item));
              find = true;
            }
          });

          if (!find) {
            log(
              // .toString().padStart(2, "0")
              `${cube.no}.${
                mannerIndex.toString().padStart(2, "0")
              }.sixFaces[${faceIndex}] not found|${
                OLD_SIX_FACES.map((oldFaces) => {
                  const [rowIndex, colIndex] = oldFaces[0];
                  return `${rowIndex}${colIndex}${
                    cells[rowIndex][colIndex].sixFace
                  }`;
                }).join("_")
              },all:${
                // actCells.map((cell) => cell.sixFace).join("")
                actCells.map((cell) =>
                  `${cell.rowIndex}${cell.colIndex}${cell.sixFace}`
                ).join("_")}|${
                OLD_SIX_FACES.map((oldFaces) =>
                  oldFaces.map(([row1, col1, row2, col2]) => {
                    return `${row1}${col1}${cells[row1][col1].sixFace}${
                      (typeof row2 !== "undefined" &&
                          typeof col2 !== "undefined")
                        ? `_${row2}${col2}${cells[row2][col2].sixFace}`
                        : ""
                    }`;
                  }).join("_")
                ).join(",")
              }`,
            );
          }
        });

        // twelveEdges.forEach((edge) => {
        //   edge.pieces.forEach(([pieceRowIndex, pieceColIndex]) => {
        //     const PIECE_CELL = cells[pieceRowIndex][pieceColIndex];
        //     const { rowIndex, colIndex, relation } =
        //       PIECE_CELL.relatedInformationWhenAdding;
        //     let fixedRelation = relation;
        //     let fixedSixFaceTwentyFourAngle = 0;
        //     if (rowIndex === -1) {
        //       cells.forEach((cellRow, cellRowIndex) =>
        //         cellRow.forEach((cell, cellColIndex) => {
        //           if (cell.addOrder === 2) {
        //             fixedSixFaceTwentyFourAngle = cell.sixFaceTwentyFourAngle;
        //             const RELATION = cell.relatedInformationWhenAdding.relation;
        //             fixedRelation = (2 - RELATION % 2) + 2 * floor(RELATION / 2);
        //           }
        //         })
        //       );
        //     } else {
        //       fixedSixFaceTwentyFourAngle =
        //         cells[rowIndex][colIndex].sixFaceTwentyFourAngle;
        //     }
        //     PIECE_CELL.twelveEdge = getSixFaceTwentyFourAngleRelationTwelveEdge(
        //       fixedSixFaceTwentyFourAngle,
        //       fixedRelation,
        //     );
        //   });
        // });

        const ORIGINAL_TWELVE_EDGES_PIECE_ARRAY = OLD_TWELVE_EDGES.filter((
          one,
        ) => one.pieces.length).map((one) =>
          JSON.parse(JSON.stringify(one.pieces))
        ) as unknown as OneCellRowColIndex[][];
        if (ORIGINAL_TWELVE_EDGES_PIECE_ARRAY.length) {
          // console.log(
          //   "reset twelveEdges, ORIGINAL_TWELVE_EDGES_PIECE_ARRAY:",
          //   JSON.stringify(ORIGINAL_TWELVE_EDGES_PIECE_ARRAY),
          // );

          twelveEdges.forEach((edge) => edge.pieces.length = 0);
          ORIGINAL_TWELVE_EDGES_PIECE_ARRAY.forEach((pieces) => {
            const [rowIndex, colIndex] = pieces[0];
            const twelveEdge = cells[rowIndex][colIndex].twelveEdge;
            // console.log("reset twelveEdges:", {
            //   rowIndex,
            //   colIndex,
            //   twelveEdge,
            // });

            const goalTwelveEdge =
              (twelveEdges as OneOfTwelveEdges[])[twelveEdge];
            pieces.forEach((piece) => goalTwelveEdge.pieces.push(piece));
          });
        }
        cloned.updateTwelveEdges();

        return cloned;
      }
    })();

    // if (MINI_OUTPUT) {
    //   const MANNER_ARRAY: string[] = [];
    //   const COUNT = CURRENT_ROW_COUNT_MANNER_ARRAY.length;
    //   for (let i = 0; i < COUNT; ++i) {
    //     MANNER_ARRAY.push(
    //       MANNER_VALUE_ARRAY[CURRENT_ROW_COUNT_MANNER_ARRAY[i]],
    //     );
    //   }
    //   Deno.writeTextFileSync(
    //     `${GOAL_FILE_TOP_PATH}mannerToCubeMap${ROW_COUNT_FLAG_POSTFIX}.txt`,
    //     MANNER_ARRAY.sort().join("\n"),
    //   );

    //   CURRENT_ROW_COUNT_MANNER_ARRAY.length = 0;
    // }

    showUsedTime("end");
    log(`end: ${(new Date()).toLocaleString()}`);
    logUsedTime(
      `${STEP_AND_ROW_COUNT_FLAG}: Total`,
      performance.now() - DATE_BEGIN,
    );

    const LOG_FILE_NAME_IN_CURRENT_PATH =
      `log_${STEP_FLAG}${MINI_OUTPUT_FLAG_POSTFIX}.txt`;
    const LOG_FILE_NAME_IN_OTHER_PATH =
      `${GOAL_FILE_TOP_PATH}log${logFilenamePostfix}.txt`;
    copySync(
      LOG_FILE_NAME,
      LOG_FILE_NAME_IN_CURRENT_PATH,
      OVER_WRITE_TRUE_FLAG,
    );
    if (LOG_FILE_NAME_IN_CURRENT_PATH !== LOG_FILE_NAME_IN_OTHER_PATH) {
      copySync(
        LOG_FILE_NAME,
        LOG_FILE_NAME_IN_OTHER_PATH,
        OVER_WRITE_TRUE_FLAG,
      );
    }

    Deno.removeSync(LOG_FILE_NAME);
  }

  // if (MINI_OUTPUT) {
  //   Deno.writeTextFileSync(
  //     `${GOAL_FILE_TOP_PATH}mannerToCubeMap.txt`,
  //     MANNER_TO_CUBE_MAP_ARRAY.join("\n"),
  //   );

  //   Deno.writeTextFileSync(
  //     `${GOAL_FILE_TOP_PATH}manner.txt`,
  //     MANNER_VALUE_ARRAY.sort().join("\n"),
  //   );
  // }
  // MANNER_TO_CUBE_MAP_ARRAY.length = 0;
  // MANNER_VALUE_ARRAY.length = 0;

  GLOBAL_LOG_CONTENT_ARRAY.push(`  end: ${(new Date()).toLocaleString()}`);
  GLOBAL_LOG_CONTENT_ARRAY.push(
    getUsedTimeString("Total", performance.now() - DATE_BEGIN),
  );
  Deno.writeTextFileSync(
    `log_${STEP_FLAG}${MINI_OUTPUT_FLAG_POSTFIX}.txt`,
    GLOBAL_LOG_CONTENT_ARRAY.join("\n"),
  );
  GLOBAL_LOG_CONTENT_ARRAY.length = 0;
}

/**
 * 统计正方体数（cubeCounts.txt）、线条方案（lineToCubeNo.txt）、拼插方案（manners.txt，可能还有mannerBill.txt和joinedManners_×rows）等（如cubes_×rows.txt）
 * @param ROW_COUNT_ARRAY
 * @param USE_LARGE_FILE
 * @param GOAL_FILE_TOP_PATH
 * @param SOURCE_FILE_TOP_PATH
 * @param SKIP_COUNT_CUBE
 * @param SKIP_COMPACT_LINE_INFO
 * @param SKIP_COMPACT_MANNER_FILES
 * @param OUTPUT_MANNER_BILL_FILE
 */
async function step4(
  ROW_COUNT_ARRAY: number[],
  USE_LARGE_FILE: boolean = true,
  GOAL_FILE_TOP_PATH: string = "./",
  SOURCE_FILE_TOP_PATH: string = "./",
  SKIP_COUNT_CUBE: boolean = false,
  SKIP_COMPACT_LINE_INFO: boolean = false,
  SKIP_COMPACT_MANNER_FILES: boolean = false,
  OUTPUT_MANNER_BILL_FILE: boolean = false,
) {
  const GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH =
    GOAL_FILE_TOP_PATH.replace(/[.\/\\]/g, "").length;
  if (GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH) {
    ensureDirSync(GOAL_FILE_TOP_PATH);
    emptyDirSync(GOAL_FILE_TOP_PATH);
  }

  const STEP_FLAG = "step4";
  let compactLineInfoCompleted = false;

  const GLOBAL_LOG_CONTENT_ARRAY = [];
  GLOBAL_LOG_CONTENT_ARRAY.push(`begin: ${(new Date()).toLocaleString()}`);
  const DATE_BEGIN = performance.now();

  const CUBE_COUNT_WITH_ROWS_COUNT_ARRAY: string[] = [];
  const CUBE_COUNT_ARRAY: number[] = [];
  let cubeTotalCount: number = 0;
  for (let rowCountLoop = 2; rowCountLoop <= 5; ++rowCountLoop) {
    const ROW_COUNT = rowCountLoop;
    if (!ROW_COUNT_ARRAY.filter((value) => value === ROW_COUNT).length) {
      continue;
    }

    const ROW_COUNT_FLAG = `${ROW_COUNT}rows`;
    const ROW_COUNT_FLAG_PREFIX = `${ROW_COUNT_FLAG}_`;
    const ROW_COUNT_FLAG_POSTFIX = `_${ROW_COUNT_FLAG}`;
    const STEP_AND_ROW_COUNT_FLAG = `${STEP_FLAG}_${ROW_COUNT_FLAG}`;

    // const SOURCE_FILE_PATH = `${ROW_COUNT_FLAG_PREFIX}${SOURCE_FILE_TOP_PATH}/`;
    const SOURCE_FILE_PATH =
      `${SOURCE_FILE_TOP_PATH}manners_${ROW_COUNT_FLAG}/`;
    if (!existsSync(SOURCE_FILE_PATH)) {
      continue;
    }

    let logFilenamePostfix = "";
    logFilenamePostfix = `_${STEP_AND_ROW_COUNT_FLAG}`;

    const LOG_FILE_NAME = "./log.txt";
    if (existsSync(LOG_FILE_NAME)) {
      Deno.removeSync(LOG_FILE_NAME);
    }

    const DEBUG_FILE_PREFIX =
      (GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH ? "" : STEP_FLAG.concat("_"))
        .concat(ROW_COUNT_FLAG_PREFIX);

    log(`begin: ${(new Date()).toLocaleString()}`);
    const DATE_BEGIN = performance.now();

    const DEBUG = {
      COMPACT_LINE_INFO_WRITE_COUNT_PER_TIME: 204800,

      COMPACT_MANNER_FILES_FOR_LARGE_FILE: USE_LARGE_FILE,
      COMPACT_MANNER_FILES_FOR_LARGE_FILE_OUTPUT_TIMES: 8,

      OUTPUT_MANNER_BILL_FILE: false,

      JOIN_CUBE_FILES: !USE_LARGE_FILE,
    };

    await (async () => {
      if (!SKIP_COUNT_CUBE) {
        countCube();
      }

      if (!SKIP_COMPACT_LINE_INFO) {
        // step3/lines.txt => step4/lineToCubeNo.txt
        compactLineInfo();
      }

      if (!SKIP_COMPACT_MANNER_FILES) {
        if (DEBUG.COMPACT_MANNER_FILES_FOR_LARGE_FILE) {
          // step3/manners/*.txt => step4/manners.txt
          await compactMannerFilesForLargeFile();

          // step3/manners/*.txt => step4/joinedManners/*.txt
          await joinMannerFiles();
        } else {
          // step3/manners/*.txt => step4/manners.txt
          await compactMannerFiles();
        }
      }

      if (OUTPUT_MANNER_BILL_FILE) {
        // step3/manners/*.txt => step4/mannerBill.txt
        await outputMannerBillFile();
      }

      // step3/cubes/*.txt => step4/cubes.txt
      if (DEBUG.JOIN_CUBE_FILES) {
        await joinCubeFiles();
      }

      function compactLineInfo() {
        if (compactLineInfoCompleted) {
          return;
        }
        logFilenamePostfix += "_compactLineInfo";
        // 1. lines.txt，将4677537行去重，且列出正方体序号段（不知道为什么最后有不连续的序号），
        //    转为lineToCubeNo.txt文件，444442222244444422324433234:1-5,8-10
        const GOAL_FILE_NAME = `${GOAL_FILE_TOP_PATH}lineToCubeNo.txt`;
        if (existsSync(GOAL_FILE_NAME)) {
          Deno.removeSync(GOAL_FILE_NAME);
        }
        // Windows记事本的Bug：加上下面这句，最前面会多一行空行，但以记事本打开时文件编码正确。如果没有，则以记事本打开时，文件编码变成UTF-16 LE，显示成乱码。换别的编辑器打开则正常。
        // Deno.writeTextFileSync(GOAL_FILE_NAME, '');

        const SOURCE_FILE_NAME = `${SOURCE_FILE_TOP_PATH}lines.txt`;
        const DATA_ARRAY = Deno.readTextFileSync(SOURCE_FILE_NAME).split("\n");
        showUsedTime(`read ${SOURCE_FILE_NAME} ok`);

        const { COMPACT_LINE_INFO_WRITE_COUNT_PER_TIME } = DEBUG;

        let lastOne = "";
        let codes = "";
        function output() {
          if (existsSync(GOAL_FILE_NAME)) {
            Deno.writeTextFileSync(
              GOAL_FILE_NAME,
              `\n${codes}`,
              APPEND_TRUE_FLAG,
            );
          } else {
            Deno.writeTextFileSync(GOAL_FILE_NAME, codes);
          }
        }
        DATA_ARRAY.forEach((info, index) => {
          if (index % COMPACT_LINE_INFO_WRITE_COUNT_PER_TIME === 0 && index) {
            output();
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
        output();

        compactLineInfoCompleted = true;
      }

      // function compactLineInfo() {
      // if (compactLineInfoCompleted) {
      // return;
      // }
      // // Deno.writeTextFileSync(`${GOAL_FILE_TOP_PATH}1.txt`, '444442224244414433224422444\t1|25|49|73');
      // // Deno.writeTextFileSync(`${GOAL_FILE_TOP_PATH}1.txt`, '\n44444222222222244444422324433234433334\t97|121|145|169|193|217|241|265|289|313|337|361|385|409|433|457|481|505|529|553|577|601|625|649|673|697|721|745', APPEND_TRUE_FLAG);
      // // Deno.writeTextFileSync(`${GOAL_FILE_TOP_PATH}2.txt`, 'T');
      // // Deno.writeTextFileSync(`${GOAL_FILE_TOP_PATH}3.txt`, '444442224244414433224422444\t1|25|49|73', APPEND_TRUE_FLAG);

      // logFilenamePostfix += "_compactLineInfo";
      // // 1. lines.txt，将4677537行去重，且列出正方体序号段（不知道为什么最后有不连续的序号），
      // //    转为lineToCubeNo.txt文件，444442222244444422324433234:1-5,8-10
      // const GOAL_FILE_NAME = `${GOAL_FILE_TOP_PATH}lineToCubeNo.txt`;
      // // if (existsSync(GOAL_FILE_NAME)) {
      // // Deno.removeSync(GOAL_FILE_NAME);
      // // }
      // Deno.writeTextFileSync(GOAL_FILE_NAME, '');

      // const SOURCE_FILE_NAME = `${SOURCE_FILE_TOP_PATH}lines.txt`;
      // const DATA_ARRAY = Deno.readTextFileSync(SOURCE_FILE_NAME).split("\n");
      // showUsedTime(`read ${SOURCE_FILE_NAME} ok`);

      // const { COMPACT_LINE_INFO_WRITE_COUNT_PER_TIME } = DEBUG;

      // let lastOne = "";
      // let codes = "";
      // let notFirstTimeOutput = false;
      // const encoder = new TextEncoder();
      // function output() {
      // // // Deno.writeTextFileSync不需要encoder，否则变成Uint8Array
      // // Deno.writeTextFileSync(
      // // GOAL_FILE_NAME,
      // // encoder.encode(`${notFirstTimeOutput ? '\n': ''}${codes}`),
      // // APPEND_TRUE_FLAG,
      // // );
      // // Deno.writeFileSync(
      // // GOAL_FILE_NAME,
      // // encoder.encode(`${notFirstTimeOutput ? '\n': ''}${codes}`),
      // // APPEND_TRUE_FLAG,
      // // );

      // Deno.writeTextFileSync(
      // GOAL_FILE_NAME,
      // `\0${notFirstTimeOutput ? '\n': ''}${codes}`,
      // APPEND_TRUE_FLAG,
      // );

      // notFirstTimeOutput = true;
      // }
      // DATA_ARRAY.forEach((info, index) => {
      // if (index % COMPACT_LINE_INFO_WRITE_COUNT_PER_TIME === 0 && index) {
      // output();
      // codes = "";
      // showUsedTime(`ok: ${index}`);
      // }
      // const BEGIN = ANGLE_COUNT * index + 1;
      // // const END = BEGIN + DIFFENT_BETWEEN_BEGIN_AND_END;
      // if (info === lastOne) {
      // codes += `|${BEGIN}`;
      // } else {
      // codes += `${index ? "\n" : ""}${info}\t${BEGIN}`;
      // lastOne = info;
      // }
      // });
      // output();

      // compactLineInfoCompleted = true;
      // }

      async function compactMannerFiles() {
        logFilenamePostfix += "_compactMannerFiles";

        // const SOURCE_MANNER_FILE_PATH = `${SOURCE_FILE_TOP_PATH}manners/`;
        const SOURCE_MANNER_FILE_PATH =
          `${SOURCE_FILE_TOP_PATH}manners_${ROW_COUNT_FLAG}/`;
        let readedFileCount = 0;

        // const { JOIN_CUBE_FILES } = DEBUG;

        const GOAL_FILE_NAME = `${GOAL_FILE_TOP_PATH}manners.txt`;
        // Deno.writeTextFileSync(GOAL_FILE_NAME, "");
        if (ROW_COUNT === 2 && existsSync(GOAL_FILE_NAME)) {
          Deno.removeSync(GOAL_FILE_NAME);
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
          // console.log("sort it");

          Deno.writeTextFileSync(
            GOAL_FILE_NAME,
            `${existsSync(GOAL_FILE_NAME) ? "\n" : ""}${
              ARRAY.map(({ manner, cubeNoBill }) => `${manner}\t${cubeNoBill}`)
                .join("\n")
            }`,
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
        logFilenamePostfix += "_compactMannerFilesForLargeFile";
        const SOURCE_MANNER_FILE_PATH =
          `${SOURCE_FILE_TOP_PATH}manners${ROW_COUNT_FLAG_POSTFIX}/`;
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
              const [MANNER, CUBE_NO_BILL] = SOURCE_ARRAY[lineIndex].split(
                "\t",
              );
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
        // Deno.writeTextFileSync(MANNER_GOAL_FILE_NAME, "");
        if (ROW_COUNT === 2 && existsSync(MANNER_GOAL_FILE_NAME)) {
          Deno.removeSync(MANNER_GOAL_FILE_NAME);
        }

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
          // if (outputIndex) {
          // Deno.writeTextFileSync(
          // MANNER_GOAL_FILE_NAME,
          // "\n",
          // APPEND_TRUE_FLAG,
          // );
          // }
          // Deno.writeTextFileSync(
          // MANNER_GOAL_FILE_NAME,
          // MANNER_ARRAY.splice(0, OUTPUT_COUNT_PER_TIME).map((MANNER, index) =>
          // `${MANNER}\t${QUARTER_CUBE_NO_ARRAY[index]}`
          // ).join("\n"),
          // APPEND_TRUE_FLAG,
          // );

          Deno.writeTextFileSync(
            MANNER_GOAL_FILE_NAME,
            `${(outputIndex || existsSync(MANNER_GOAL_FILE_NAME)) ? "\n" : ""}${
              MANNER_ARRAY.splice(0, OUTPUT_COUNT_PER_TIME).map((
                MANNER,
                index,
              ) => `${MANNER}\t${QUARTER_CUBE_NO_ARRAY[index]}`).join("\n")
            }`,
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
        const SOURCE_MANNER_FILE_PATH =
          `${SOURCE_FILE_TOP_PATH}manners${ROW_COUNT_FLAG_POSTFIX}/`;

        let readedFileCount = 0;

        const GOAL_FILE_NAME = `${GOAL_FILE_TOP_PATH}mannerBill.txt`;
        // Deno.writeTextFileSync(GOAL_FILE_NAME, "");
        if (ROW_COUNT === 2 && existsSync(GOAL_FILE_NAME)) {
          Deno.removeSync(GOAL_FILE_NAME);
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
        const SOURCE_MANNER_FILE_PATH =
          `${SOURCE_FILE_TOP_PATH}manners${ROW_COUNT_FLAG_POSTFIX}/`;
        let readedFileCount = 0;

        // const GOAL_FILE_PATH = `${GOAL_FILE_TOP_PATH}manners/`;
        const GOAL_FILE_PATH =
          `${GOAL_FILE_TOP_PATH}joinedManners${ROW_COUNT_FLAG_POSTFIX}/`;
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
        logFilenamePostfix += "_joinCubeFiles";
        const SOURCE_MANNER_FILE_PATH =
          `${SOURCE_FILE_TOP_PATH}cubes${ROW_COUNT_FLAG_POSTFIX}/`;

        // const CUBE_GOAL_FILE_NAME =
        //   `${GOAL_FILE_TOP_PATH}${DEBUG_FILE_PREFIX}cubes.txt`;
        // Deno.writeTextFileSync(CUBE_GOAL_FILE_NAME, "");

        // const CUBE_GOAL_FILE_NAME =
        //   `${GOAL_FILE_TOP_PATH}${DEBUG_FILE_PREFIX}cubes${ROW_COUNT_FLAG_POSTFIX}.txt`;
        // Deno.writeTextFileSync(CUBE_GOAL_FILE_NAME, "");

        // const CUBE_GOAL_FILE_NAME =
        //   `${GOAL_FILE_TOP_PATH}${DEBUG_FILE_PREFIX}cubes.txt`;
        const CUBE_GOAL_FILE_NAME =
          `${GOAL_FILE_TOP_PATH}cubes${ROW_COUNT_FLAG_POSTFIX}.txt`;
        if (ROW_COUNT === 2 && existsSync(CUBE_GOAL_FILE_NAME)) {
          Deno.removeSync(CUBE_GOAL_FILE_NAME);
        }

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

      async function countCube() {
        logFilenamePostfix += "_countCube";
        const SOURCE_CUBE_FILE_PATH =
          `${SOURCE_FILE_TOP_PATH}cubes${ROW_COUNT_FLAG_POSTFIX}/`;

        let readedFileCount = 0;
        let cubeCount = 0;

        for await (const dirEntry of Deno.readDir(SOURCE_CUBE_FILE_PATH)) {
          const filename = path.join(SOURCE_CUBE_FILE_PATH, dirEntry.name);
          const stats = Deno.statSync(filename);
          if (!stats.isFile) {
            continue;
          }

          if ((++readedFileCount) % 100 === 0) {
            showUsedTime(`readed ${readedFileCount} files`);
          }

          cubeCount += Deno.readTextFileSync(filename).split("\n").length;
        }

        cubeTotalCount += cubeCount;
        CUBE_COUNT_ARRAY.push(cubeCount);
        CUBE_COUNT_WITH_ROWS_COUNT_ARRAY.push(`${ROW_COUNT}: ${cubeCount}`);
      }
    })();

    showUsedTime("end");
    log(`end: ${(new Date()).toLocaleString()}`);
    logUsedTime(`${STEP_FLAG}: Total`, performance.now() - DATE_BEGIN);

    const LOG_FILE_NAME_IN_CURRENT_PATH = `log_${STEP_FLAG}.txt`;
    const LOG_FILE_NAME_IN_OTHER_PATH =
      `${GOAL_FILE_TOP_PATH}log${logFilenamePostfix}.txt`;
    copySync(
      LOG_FILE_NAME,
      LOG_FILE_NAME_IN_CURRENT_PATH,
      OVER_WRITE_TRUE_FLAG,
    );
    if (LOG_FILE_NAME_IN_CURRENT_PATH !== LOG_FILE_NAME_IN_OTHER_PATH) {
      copySync(
        LOG_FILE_NAME,
        LOG_FILE_NAME_IN_OTHER_PATH,
        OVER_WRITE_TRUE_FLAG,
      );
    }
    Deno.removeSync(LOG_FILE_NAME);
  }

  if (CUBE_COUNT_ARRAY.length) {
    const CUBE_COUNT_FILE_NAME = `${GOAL_FILE_TOP_PATH}cubeCounts.txt`;
    CUBE_COUNT_WITH_ROWS_COUNT_ARRAY.push(`\ntotal: ${cubeTotalCount}`);
    Deno.writeTextFileSync(
      CUBE_COUNT_FILE_NAME,
      CUBE_COUNT_WITH_ROWS_COUNT_ARRAY.join("\n"),
    );
  }

  GLOBAL_LOG_CONTENT_ARRAY.push(`  end: ${(new Date()).toLocaleString()}`);
  GLOBAL_LOG_CONTENT_ARRAY.push(
    getUsedTimeString("Total", performance.now() - DATE_BEGIN),
  );
  Deno.writeTextFileSync(
    `log_${STEP_FLAG}.txt`,
    GLOBAL_LOG_CONTENT_ARRAY.join("\n"),
  );
}

interface StepSkipped {
  skipped?: boolean;
}
export interface Step1Option extends StepSkipped {
  GOAL_FILE_TOP_PATH?: string;
  OUTPUT_CUT_MANNERS_ROW_BY_ROW?: boolean;
}

export interface BehindStepsOption extends StepSkipped {
  GOAL_FILE_TOP_PATH?: string;
  SOURCE_FILE_TOP_PATH?: string;
}
export interface Step2Option extends BehindStepsOption {
  OUTPUT_ALONE_FIRST_CUBE?: boolean;
  OUTPUT_CUBE_PASS_CHECK_FACES_LAYER_INDEX?: boolean;

  OUTPUT_FIX_HIDDEN_PIECES_DETAILS?: boolean;

  OUTPUT_FIX_HIDDEN_PIECES?: boolean;
  OUTPUT_MIDDLE_CUBE_TO_FIRST_NO?: boolean;
  OUTPUT_CHECK_FACES_LAYER_INDEX_FAILED?: boolean;
  OUTPUT_FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT?: boolean;
  OUTPUT_FIX_LONELY_FACE_OF_CUBE?: boolean;
}
export interface Step3Option extends BehindStepsOption {
  OUTPUT_FULL_CUBE?: boolean;
  OUTPUT_READ_CUBE?: boolean;
  SHOW_GET_CLONED_CUBE_BY_MANNER_INDEX_DETAIL?: boolean;
  MINI_OUTPUT?: boolean;
}
export interface Step4Option extends BehindStepsOption {
  USE_LARGE_FILE?: boolean;
  SKIP_COUNT_CUBE?: boolean;
  SKIP_COMPACT_LINE_INFO?: boolean;
  SKIP_COMPACT_MANNER_FILES?: boolean;
  OUTPUT_MANNER_BILL_FILE?: boolean;
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
    step1(
      ROW_COUNT_ARRAY,
      step1Option?.GOAL_FILE_TOP_PATH,
      step1Option?.OUTPUT_CUT_MANNERS_ROW_BY_ROW,
    );
  }

  if (!step2Option?.skipped) {
    GLOBAL_LOG_CONTENT_ARRAY.push(`step2: ${(new Date()).toLocaleString()}`);
    await step2(
      ROW_COUNT_ARRAY,
      step2Option?.GOAL_FILE_TOP_PATH,
      step2Option?.SOURCE_FILE_TOP_PATH,
      step2Option?.OUTPUT_ALONE_FIRST_CUBE,
      step2Option?.OUTPUT_CUBE_PASS_CHECK_FACES_LAYER_INDEX,
      step2Option?.OUTPUT_FIX_HIDDEN_PIECES,
      step2Option?.OUTPUT_MIDDLE_CUBE_TO_FIRST_NO,
      step2Option?.OUTPUT_CHECK_FACES_LAYER_INDEX_FAILED,
      step2Option?.OUTPUT_FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT,
      step2Option?.OUTPUT_FIX_LONELY_FACE_OF_CUBE,
    );
  }

  if (!step3Option?.skipped) {
    GLOBAL_LOG_CONTENT_ARRAY.push(`step3: ${(new Date()).toLocaleString()}`);
    await step3(
      ROW_COUNT_ARRAY,
      step3Option?.GOAL_FILE_TOP_PATH,
      step3Option?.SOURCE_FILE_TOP_PATH,
      step3Option?.OUTPUT_FULL_CUBE,
      step3Option?.OUTPUT_READ_CUBE,
      step3Option?.SHOW_GET_CLONED_CUBE_BY_MANNER_INDEX_DETAIL,
      step3Option?.MINI_OUTPUT,
    );
  }

  if (!step4Option?.skipped) {
    GLOBAL_LOG_CONTENT_ARRAY.push(`step4: ${(new Date()).toLocaleString()}`);
    await step4(
      ROW_COUNT_ARRAY,
      step4Option?.USE_LARGE_FILE,
      step4Option?.GOAL_FILE_TOP_PATH,
      step4Option?.SOURCE_FILE_TOP_PATH,
      step4Option?.SKIP_COUNT_CUBE,
      step4Option?.SKIP_COMPACT_LINE_INFO,
      step4Option?.SKIP_COMPACT_MANNER_FILES,
      step4Option?.OUTPUT_MANNER_BILL_FILE,
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
