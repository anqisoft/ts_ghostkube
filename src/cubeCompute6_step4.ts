/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * src\cubeCompute6_step4.ts v0.0.1
 * deno 1.42.1 + VSCode 1.88.0
 *
 * <en_us>
 * Created on Sun Apr 29 2024 08:47:00
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年4月29日 08:47:00
 * 功能：从第二步正方体（已拆解剪切与粘贴方案，但未1转24），1转24，写入：
 *       1. 每种拼插方案对应的正方体编号清单（以拼插方案命名），回车符分隔
 *          最大编号112260888，最多11,2260,8880字数据，约11亿字
 *       2. 每24个正方体（以1转24的第一个计算）一组，计算纸模完整横纵线，回车符分隔
 *          1）两行五列则15=5*(2+1)横12=(5+1)*2纵共27线；
 *          2）三行五列则20=5*(3+1)横18=(5+1)*3纵共38线。
 *          最大编号112260888，4677537组，最多1,8242,3943字数据，约2亿字
 *       3. 输出压缩后的正方体信息（正方体间以回车符分隔，4位一格，16进制）：
 *          1）1位：格序（1位，0-15，16进制0-E）
 *          2）1位：功能（1位，2-3，2面3片，减2乘6）+层序（1位，1-6转0-5），转1位16进制
 *          3）1位：面序或片序——面序0-5，片序0-11，转1位十六进制
 *          4）1位：方向序，0-3
 *          最多4*15+1=61位一个，最大编号112260888，最多68,4791,4168字数据，约68亿字，
 *          不确定是否19G左右
 *       4. 最终数据量约100亿字，预计20-30G
 * 缺陷：当前生成第二步的正方体时，未移除不符合物理规律的正方体（因还没想出相应算法）
 * 注意：本代码用于打补丁，因此仅处理部分文件，且仅处理第三项
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年4月29日 08:47:00
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
  FaceMemberOfSixFace,
  // CUBES,
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
const { floor } = Math;

const STEP_FLAG = "step4";
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

const SOURCE_FILE_TOP_PATH = "./step2/";

const COL_COUNT = 5;
const MAX_COL_INDEX = COL_COUNT - 1;

const APPEND_TRUE_FLAG = { append: true };
const EMPTY_OBJECT = {};

//  同一方案24个角度
const MANNER_COUNT = ANGLE_COUNT;

const SIMPLE_MANNER_ARRAY: string[] = [];
const SIMPLE_DATA_ARRAY: {
  manner: string;
  cube: Cube;
}[] = [];

await (async () => {
  let fileNo = 0;
  // let cubeLinesFileContent = '';

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

  // const MANNER_CUBES_GOAL_FILE_PATH = `${GOAL_FILE_TOP_PATH}manners/`;
  // ensureDirSync(MANNER_CUBES_GOAL_FILE_PATH);
  // emptyDirSync(MANNER_CUBES_GOAL_FILE_PATH);

  const CUBE_LINES_FILE_NAME = `${GOAL_FILE_TOP_PATH}lines.txt`;
  // Deno.writeTextFileSync(CUBE_LINES_FILE_NAME, '');

  let sourceFilename = "";
  // for await (const dirEntry of Deno.readDir(SOURCE_FILE_TOP_PATH)) {
  // const filename = path.join(SOURCE_FILE_TOP_PATH, dirEntry.name);
  // const stats = Deno.statSync(filename);
  // if (stats.isFile) {
  // sourceFilename = filename;
  // showUsedTime(`read file: ${filename}`);
  // Deno.readTextFileSync(filename).split('\n').forEach((codeLine) => {
  // const cube = getCubeFromJson(codeLine);
  // batchAppendCubeOneToTwentyFour(cube);
  // });
  // }
  // }
  // [25,26]
  [
    25,
    26,
    27,
    28,
    29,
    30,
    32,
    33,
    35,
    37,
    39,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    86,
    87,
    88,
    91,
    92,
    93,
    95,
    96,
    98,
    99,
    101,
    102,
    103,
    105,
    106,
    108,
    109,
    110,
    111,
    112,
    113,
    114,
    127,
    134,
    135,
    136,
    138,
    143,
    144,
    145,
    150,
    151,
    153,
    154,
    156,
    157,
    160,
    161,
    162,
    163,
    164,
    165,
    166,
    168,
    169,
    171,
    172,
    173,
    174,
    175,
    177,
    178,
    180,
    181,
    182,
    183,
    184,
    185,
    186,
    187,
    200,
    208,
    209,
    210,
    217,
    218,
    219,
    224,
    225,
    227,
    228,
    229,
    230,
    231,
    235,
    236,
    238,
    240,
    241,
    244,
    245,
    246,
    248,
    249,
    250,
    280,
    281,
    282,
    283,
    284,
    285,
    286,
    287,
    288,
    289,
    291,
    292,
    293,
    295,
    297,
    298,
    299,
    300,
    301,
    302,
    303,
    304,
    305,
    306,
    308,
    309,
    310,
    311,
    343,
    344,
    347,
    348,
    350,
    351,
    352,
    353,
    354,
    358,
    359,
    361,
    362,
    363,
    364,
    365,
    366,
    367,
    368,
    371,
    372,
    382,
    387,
    388,
    389,
    395,
    396,
    400,
    401,
    402,
    403,
    404,
    405,
    407,
    408,
    409,
    410,
    411,
    412,
    415,
    416,
    417,
    418,
    419,
    420,
    421,
    422,
    423,
    424,
    425,
    426,
    434,
    435,
    439,
    440,
    444,
    445,
    446,
    451,
    453,
    455,
  ]
    .forEach((sourceFileNo) => {
      fileNo = 8 * (sourceFileNo - 1);
      sourceFilename = path.join(
        SOURCE_FILE_TOP_PATH,
        `${sourceFileNo.toString().padStart(6, "0")}.txt`,
      );
      showUsedTime(`read file: ${sourceFilename}`);
      Deno.readTextFileSync(sourceFilename).split("\n").forEach((codeLine) => {
        const cube = getCubeFromJson(codeLine);
        // if(!cube.isValid) {
        // log(`[warn]${cube.no} is not valid!`);
        // } else {
        // batchAppendCubeOneToTwentyFour(cube);
        // }
        batchAppendCubeOneToTwentyFour(cube);
      });
    });
  outputCubes();

  function batchAppendCubeOneToTwentyFour(cube: Cube) {
    const { coreRowIndex: CORE_ROW_INDEX, coreColIndex: CORE_COL_INDEX } = cube;
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
    // const LINE_ARRAY: number[] = [];
    // for (let rowIndexLoop = 0; rowIndexLoop <= rowCount; ++rowIndexLoop) {
    // for (let colIndexLoop = 0; colIndexLoop < colCount; ++colIndexLoop) {
    // LINE_ARRAY.push(1);
    // }
    // }
    // const VERTICAL_LINE_INDEX_OFFSET = LINE_ARRAY.length;
    // for (let rowIndexLoop = 0; rowIndexLoop < rowCount; ++rowIndexLoop) {
    // for (let colIndexLoop = 0; colIndexLoop <= colCount; ++colIndexLoop) {
    // LINE_ARRAY.push(1);
    // }
    // }
    // gridLines.forEach(({ xStart, xEnd, yStart, yEnd, lineStyle }) => {
    // if (yStart === yEnd) {
    // LINE_ARRAY[colCount * yStart + xStart] = lineStyle;
    // } else {
    // LINE_ARRAY[VERTICAL_LINE_INDEX_OFFSET + (colCount + 1) * yStart + xStart] = lineStyle;
    // }
    // });
    // cubeLinesFileContent += (cubeLinesFileContent.length ? '\n' : '').concat(LINE_ARRAY.join(''));

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

    // const MANNER_CUBES_ARRAY = [];
    // const MANNER_ARRAY = [];
    // CUBES.forEach((cube) => {
    // const { manner, no } = cube;
    // cube['manner'] = undefined;

    // const OLD_INDEX = MANNER_ARRAY.indexOf(manner);
    // if (OLD_INDEX === -1) {
    // MANNER_ARRAY.push(manner);
    // MANNER_CUBES_ARRAY.push([no]);
    // } else {
    // MANNER_CUBES_ARRAY[OLD_INDEX].push(no);
    // }
    // });
    // Deno.writeTextFileSync(
    // `${MANNER_CUBES_GOAL_FILE_PATH}${filenamePostfix}`,
    // MANNER_CUBES_ARRAY.map((noArray, index) => `${MANNER_ARRAY[index]}:[${noArray.join(',')}]`)
    // .join('\n'),
    // );
    // MANNER_CUBES_ARRAY.length = 0;
    // MANNER_ARRAY.length = 0;

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
    // no,
    // cellIndex,
    // layerIndex,
    // feature,
    // sixFace,
    // faceDirection,
    // twelveEdge,
    // }) =>
    // // `${cellIndex.toString(16)}${
    // // (parseInt(`${(feature - 2) * 6 + (layerIndex - 1)}`)).toString(16)
    // // }${feature === 2 ? `${sixFace}` : `${twelveEdge.toString(16)}`}${faceDirection}`

    // {
    // if(!('toString' in cellIndex)) {
    // console.log(`${no}.cellIndex:${cellIndex}`);
    // return '';
    // }

    // if(feature === 3 && !('toString' in twelveEdge)) {
    // console.log(`${no}.twelveEdge:${twelveEdge}`);
    // return '';
    // }

    // const FEATURE_AND_LAYERINDEX = parseInt('' + ((feature - 2) * 6 + (layerIndex - 1)));
    // if(!('toString' in FEATURE_AND_LAYERINDEX)) {
    // console.log(`${no}.featureAndLayerindex:${FEATURE_AND_LAYERINDEX}`);
    // return '';
    // }

    // return
    // `${cellIndex.toString(16)}${(FEATURE_AND_LAYERINDEX).toString(16)}${feature === 2 ? `${sixFace}` : `${twelveEdge.toString(16)}`}${faceDirection}`;
    // }
    // ).join('')
    // ).join('\n')
    // );
    // } catch (error) {
    // console.error('[error]', sourceFilename, filenamePostfix, error);
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
                  relation % 2 === 0 ? (2 - relation) : 1 + floor(relation / 2),
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

    // // 2. 每24个正方体（以1转24的第一个计算）一组，计算纸模完整横纵线，回车符分隔
    // //    1）两行五列则15=5*(2+1)横12=(5+1)*2纵共27线；
    // //    2）三行五列则20=5*(3+1)横18=(5+1)*3纵共38线。
    // //    最大编号112260888，4677537组，最多1,8242,3943字数据，约2亿字
    // Deno.writeTextFileSync(
    // CUBE_LINES_FILE_NAME,
    // (fileNo === 1 ? '' : '\n').concat(cubeLinesFileContent),
    // APPEND_TRUE_FLAG,
    // );
    // cubeLinesFileContent = '';

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
    const { coreRowIndex: CORE_ROW_INDEX, coreColIndex: CORE_COL_INDEX } = cube;

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

cls && deno lint %pwd%\cubeCompute6_step4.ts & deno fmt %pwd%\cubeCompute6_step4.ts

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\cubeCompute6_step4.ts

deno run --v8-flags=--max-old-space-size=20480 -A %pwd%\cubeCompute6_step4.ts

cls && deno run --v8-flags=--max-old-space-size=20480 -A %pwd%\cubeCompute6_step4.ts
*/
