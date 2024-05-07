/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * src\cubeCompute6_step2.ts v0.0.1
 * deno 1.42.1 + VSCode 1.88.0
 *
 * <en_us>
 * Created on Sat Apr 27 2024 23:35:47
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年4月27日 23:35:47
 * 功能：从第一步所获取的中间正方体开始，生成未进行1转24的正方体
 * 缺陷：部分正方体无法直接裁剪与粘贴出来，因其违背物理规律
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年4月27日 23:35:47
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
import * as path from "https://deno.land/std/path/mod.ts";

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
  CUBES,
  FaceMemberOfSixFace,
  FourDirection,
  FourDirectionCount,
  FourDirectionMaxIndex,
  getCubeFromJson,
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
  SixFaceTwentyFourAngle,
  SixFaceTwentyFourAngleToTwelveEdge,
  TwelveEdge,
  TwelveEdges,
} from "./cubeCore.ts";

const STEP_FLAG = "step2";
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

const SOURCE_FILE_TOP_PATH = "./step1/";

const COL_COUNT = 5;
const MAX_COL_INDEX = COL_COUNT - 1;

const CUBE_NO_STEP = 24;

const DEBUG = {
  // false true
  CUBE_COUNT_PER_FILE: 10240,

  SHOW_MIDDLE_CUBE_CONVERT_INFO: false,
};

await (async () => {
  let fileNo = 0;
  let nextCubeNo = 1 - CUBE_NO_STEP;
  const CUBES: Cube[] = [];

  for (let rowCountLoop = 2; rowCountLoop <= 3; ++rowCountLoop) {
    const ROW_COUNT = rowCountLoop;
    const SOURCE_FILE_PATH =
      `${SOURCE_FILE_TOP_PATH}${ROW_COUNT}rows_${COL_COUNT}cols/`;

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
                        const IS_FACE = typeof secondRowIndex === "undefined" ||
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

                appendCubeWithoutOneToTwentyFour(cloned);
              });
            });
          });
        });
      });
    });

    // log(`call times: ${times}`);
  }

  function appendCubeWithoutOneToTwentyFour(cube: Cube) {
    nextCubeNo += CUBE_NO_STEP;
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

    const GOAL_FILE_NAME = `${GOAL_FILE_TOP_PATH}${
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
logUsedTime("Total", performance.now() - DATE_BEGIN);

copySync(LOG_FILE_NAME, `log_${STEP_FLAG}.txt`, { overwrite: true });
copySync(LOG_FILE_NAME, `${GOAL_FILE_TOP_PATH}log${logFilenamePostfix}.txt`, {
  overwrite: true,
});
Deno.removeSync(LOG_FILE_NAME);

/*
cd /d C:\__cube\240507A\
set pwd=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\

cls && deno lint %pwd%\cubeCompute6_step2.ts && deno fmt %pwd%\cubeCompute6_step2.ts

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\cubeCompute6_step2.ts

deno run --v8-flags=--max-old-space-size=20480 -A %pwd%\cubeCompute6_step2.ts

*/
