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
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年4月27日 23:35:47
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
  AppendSiblingsOptions,
  Cell,
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
  getReversedRelation,
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
  TwoCellRowColIndex,
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

const OVER_WRITE_TRUE_FLAG = { overwrite: true };

// const SOURCE_FILE_TOP_PATH = "./step1/";
// const SOURCE_FILE_TOP_PATH = "../step1_rows_23/";
// const SOURCE_FILE_TOP_PATH = "../step1_rows_2/";
const SOURCE_FILE_TOP_PATH = "C:\\__cube\\240507A\\step1_rows_23\\";

const GOAL_CUBE_FILE_PATH = `${GOAL_FILE_TOP_PATH}cubesOnlyFirstOfTwentyFour/`;
ensureDirSync(GOAL_CUBE_FILE_PATH);
emptyDirSync(GOAL_CUBE_FILE_PATH);

const APPEND_TRUE_FLAG = { append: true };
const CHECK_FACES_LAYER_INDEX_FAILED_FILENAME =
  `${GOAL_FILE_TOP_PATH}checkFacesLayerIndexFailed.txt`;
const FIX_LONELY_FACE_OF_CUBE_FILENAME =
  `${GOAL_FILE_TOP_PATH}fixLonelyFaceOfCube.txt`;
const FIX_HIDDEN_PIECES_FILENAME = `${GOAL_FILE_TOP_PATH}fixHiddenPieces.txt`;
const FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT_FILENAME =
  `${GOAL_FILE_TOP_PATH}fixLonelyFaceOfCubeAndAppendIt.txt`;

const CHECK_FACES_LAYER_INDEX_FAILED_FILE_CONTENT_ARRAY: string[] = [];
const FIX_LONELY_FACE_OF_CUBE_FILE_CONTENT_ARRAY: string[] = [];
const FIX_HIDDEN_PIECES_FILE_CONTENT_ARRAY: string[] = [];
const FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT_FILE_CONTENT_ARRAY: string[] = [];

const MIDDLE_FILE_CONTENT_ARRAY = [
  CHECK_FACES_LAYER_INDEX_FAILED_FILE_CONTENT_ARRAY,
  FIX_LONELY_FACE_OF_CUBE_FILE_CONTENT_ARRAY,
  FIX_HIDDEN_PIECES_FILE_CONTENT_ARRAY,
  FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT_FILE_CONTENT_ARRAY,
];
const MIDDLE_FILENAME_ARRAY = [
  CHECK_FACES_LAYER_INDEX_FAILED_FILENAME,
  FIX_LONELY_FACE_OF_CUBE_FILENAME,
  FIX_HIDDEN_PIECES_FILENAME,
  FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT_FILENAME,
];

enum MiddleFileKind {
  CheckFacesLayerIndexFailed,
  FixLonelyFaceOfCube,
  FixHiddenPieces,
  FixLonelyFaceOfCubeAndAppendIt,
}
function appendContent(content: string, middleFileKind: MiddleFileKind) {
  const CONTENT_ARRAY = MIDDLE_FILE_CONTENT_ARRAY[middleFileKind];
  CONTENT_ARRAY.push(content);
  const COUNT = CONTENT_ARRAY.length;

  if (COUNT >= DEBUG.OUTPUT_ROW_COUNT_PER_TIME) {
    appendFile(middleFileKind);
  }
}

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

const COL_COUNT = 5;
const MAX_COL_INDEX = COL_COUNT - 1;

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

  for (let rowCountLoop = 2; rowCountLoop <= 5; ++rowCountLoop) {
    const ROW_COUNT = rowCountLoop;
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
        const CLONED_SIX_FACE_ITEM_ARRAY = sixFaces[CLONED_PIECE_CELL_SIX_FACE];

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
                secondCell.layerIndex > PIECE_CELL_RELATION_CELL_LAYER_INDEX &&
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

appendFile(MiddleFileKind.CheckFacesLayerIndexFailed);
appendFile(MiddleFileKind.FixLonelyFaceOfCube);
appendFile(MiddleFileKind.FixHiddenPieces);
appendFile(MiddleFileKind.FixLonelyFaceOfCubeAndAppendIt);

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
/*
cd /d C:\__cube\240507A\
set pwd=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\

cls && deno lint %pwd%\cubeCompute6_step2.ts && deno fmt %pwd%\cubeCompute6_step2.ts

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\cubeCompute6_step2.ts

deno lint %pwd%\cubeCompute6_step2.ts
deno run --v8-flags=--max-old-space-size=20480 -A %pwd%\cubeCompute6_step2.ts

*/
