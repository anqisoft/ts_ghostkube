/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * src\cubeCompute6_step1.ts v0.0.1
 * deno 1.42.1 + VSCode 1.88.0
 *
 * <en_us>
 * Created on Tue May 07 2024 09:26:27
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年5月7日 09:26:27
 * 功能：仅获取中间正方体，六面仅列出直接的六面，不列出由“插片”形成的面。
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年5月7日 09:26:27
 * 功能：
 * </zh_tw>
 */

// https://www.cnblogs.com/livelab/p/14111142.html
import {
  copySync,
  emptyDirSync,
  ensureDirSync,
  existsSync,
} from "https://deno.land/std/fs/mod.ts"; // copy

import {
  CellBorderLine,
  CellFeature,
  CellObject,
  ConnectionRelation,
  convertSixFaceTwentyFourAngleToSixFaceAndDirection,
  Cube,
  getSixFaceTwentyFourAngleRelationTwelveEdge,
  global_removed_middle_cube_count,
  log,
  logUsedTime,
  showUsedTime,
  SimpleCube,
  SIX_FACE_AND_DIRECTION_RELATIONS,
  SixFaceTwentyFourAngle,
  TwelveEdge,
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

const STEP_FLAG = "step1";
const LOG_FILE_NAME = "./log.txt";
if (existsSync(LOG_FILE_NAME)) {
  Deno.removeSync(LOG_FILE_NAME);
}

let logFilenamePostfix = "";
logFilenamePostfix = `_${STEP_FLAG}`;

const GOAL_FILE_TOP_PATH = `./${STEP_FLAG}/`;
ensureDirSync(GOAL_FILE_TOP_PATH);
emptyDirSync(GOAL_FILE_TOP_PATH);

log(`begin: ${(new Date()).toLocaleString()}`);
const DATE_BEGIN = performance.now();

const DEBUG = {
  // false true
  MIDDLE_CUBE_BATCH_DEAL_COUNT: 10240,

  SHOW_CUT_MANNERS: true,

  SHOW_CUBE_WHEN_OK_IN_COUNT_BY_LINES: false,
};

const COL_COUNT = 5;
const MAX_COL_INDEX = COL_COUNT - 1;

const MIDDLE_CUBE_ARRAY: Cube[] = [];
const MIDDLE_CUBE_COUNT_ARRAY: number[] = [0, 0, 0, 0, 0, 0];

const CUT_MANNER_COUNT_ARRAY: number[] = [0, 0, 0, 0, 0, 0];
const CUT_MANNER_ARRAY: string[] = [];

const CORE_COL_INDEX_ORDER_ARRAY = [3, 1, 2, 0, 4];

let totalMiddleCubeCount = 0;

function countByRowCount(
  ROW_COUNT: number,
) {
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

          // goalCell.layerIndex = 0;
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
      }

      appendMiddleCube(cube);
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

      // let codes = '';
      // for (
      // 	let cubeIndex = 0;
      // 	cubeIndex < MIDDLE_CUBE_COUNT;
      // 	++cubeIndex
      // ) {
      // 	codes += `${JSON.stringify(MIDDLE_CUBE_ARRAY[cubeIndex])}\n`;
      // }
      // Deno.writeTextFileSync(`${MIDDLE_FILE_NAME_PREFIX}${++middleFileNo}.txt`, codes);

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
        countByLines(
          HORIZONTAL_LINE_ARRAY,
          VERTICAL_LINE_ARRAY,
          EMPTY_CELL_POSITOIN_ARRAY,
        );
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

      // 如已添加，则返回null
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
      let sixFaceTwentyFourAngle: SixFaceTwentyFourAngle =
        SixFaceTwentyFourAngle.UpOriginal;
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

            // twelveEdge = SixFaceTwentyFourAngleToTwelveEdge[OLD_CELL_SIX_FACE_TWENTY_FOUR_ANGLE][relation];
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
                    row.filter((cell) => cell.feature === CellFeature.Face).map(
                      (cell) => "1",
                    ).join(
                      "",
                    )
                  ).join("").length
                }\n${
                  cube.cells.map((row) =>
                    row.filter((cell) => cell.feature === CellFeature.Face).map(
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

    function done() {
      ensureDirSync(GOAL_FILE_PATH);
      emptyDirSync(GOAL_FILE_PATH);

      countMiddleCube();
      dealMiddleCubes();

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

    CUT_MANNER_COUNT_ARRAY,
    CUT_MANNER_ARRAY_LENGTH: CUT_MANNER_ARRAY.length,
  });
}

countByRowCount(2);
countByRowCount(3);

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

copySync(LOG_FILE_NAME, `log_${STEP_FLAG}.txt`, { overwrite: true });
copySync(LOG_FILE_NAME, `${GOAL_FILE_TOP_PATH}log${logFilenamePostfix}.txt`, {
  overwrite: true,
});
Deno.removeSync(LOG_FILE_NAME);

/*
begin: 4/28/2024, 10:14:44 AM

countMiddleCube(2), 2 ^ (5 + 8) = 8192 => 6902, used 518.83 milliseconds, or 0.519 seconds
after countMiddleCubes() ./step1/2rows_5cols/, used 27.49 milliseconds, or 0.027 seconds
{
  totalMiddleCubeCount: 94,
  global_removed_middle_cube_count: 0,
  thisMiddleCubeCount: 94,
  MIDDLE_CUBE_COUNT_ARRAY: [ 94, 0, 0, 0, 0, 0 ],
  CUT_MANNER_COUNT_ARRAY: [ 94, 0, 0, 0, 0, 0 ],
  CUT_MANNER_ARRAY_LENGTH: 94
}

countMiddleCube(3), 2 ^ (10 + 12) = 4194304 => 4036248, used 669179.96 milliseconds, or 669.180 seconds, or 11.2 minutes,
after countMiddleCubes() ./step1/3rows_5cols/, used 285.00 milliseconds, or 0.285 seconds
{
  totalMiddleCubeCount: 269197,
  global_removed_middle_cube_count: 0,
  thisMiddleCubeCount: 269103,
  MIDDLE_CUBE_COUNT_ARRAY: [ 94, 269103, 0, 0, 0, 0 ],
  CUT_MANNER_COUNT_ARRAY: [ 94, 147522, 0, 0, 0, 0 ],
  CUT_MANNER_ARRAY_LENGTH: 147616
}
CUT_MANNER_ARRAY.length: 147616
CUT_MANNER_COUNT_ARRAY: [ 94, 147522, 0, 0, 0, 0 ]
end, used 359.59 milliseconds, or 0.360 seconds
end: 4/28/2024, 10:25:54 AM
Total used , used 670164.11 milliseconds, or 670.164 seconds, or 11.2 minutes,
*/

/*
set pwd=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\

cls && deno lint %pwd%\cubeCompute6_step1.ts && deno fmt %pwd%\cubeCompute6_step1.ts

cd /d C:\__cube\240507A\

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\cubeCompute6_step1.ts
deno run --v8-flags=--max-old-space-size=20480 -A %pwd%\cubeCompute6_step1.ts

cls && deno run --v8-flags=--max-old-space-size=20480 -A %pwd%\cubeCompute6_step1.ts

*/
