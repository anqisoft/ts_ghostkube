/* v0.0.1
  <en_us></en_us>
  <zh_cn>直接查找manners.txt文件。</zh_cn>
  <zh_tw></zh_tw>
*/

import {
  emptyDirSync,
  ensureDirSync,
  existsSync,
} from "https://deno.land/std/fs/mod.ts";

import {
  CellFeature,
  ConnectionRelation,
  Cube,
  CubeForDrawing,
  CubeForDrawingActCell,
  FourDirection,
  GridLine,
  GridLineStyle,
  SixFace,
  TwelveEdge,
} from "../../src/cubeCore.ts";

const COL_COUNT = 5;

export function main(
  SOURCE_FILE_PATH: string,
  ROW_COUNT_ARRAY: number[],
  GOAL_FILE: string,
  OUTPUT_ALONE_CUBE: boolean = false,
  SET_ITEM_NAME: string = "~",
  SORT_CUBES: boolean = false,
) {
  const END_ALONE_CUBE_PATH = `${SOURCE_FILE_PATH}99_AloneCube/`;
  if (OUTPUT_ALONE_CUBE) {
    ensureDirSync(END_ALONE_CUBE_PATH);
    emptyDirSync(END_ALONE_CUBE_PATH);
  }

  const SOURCE_CUBE_FILE_PATH = `${SOURCE_FILE_PATH}cubes/`;

  let codes = "const SET_ARRAY = \n";

  const SET_ARRAY: object[] = [];
  const SET_ITEM: { name: string; cubes: number[] } = {
    name: SET_ITEM_NAME,
    cubes: [],
  };
  SET_ARRAY.push(SET_ITEM);
  const SET_ITEM_CUBE_ARRAY = SET_ITEM.cubes;

  const CUBES = [];

  const CUBE_SOURCE_FILE_NAME = `${SOURCE_FILE_PATH}manner${
    ROW_COUNT_ARRAY.map((ROW_COUNT) => `_${ROW_COUNT}rows`).join("")
  }.txt`;
  const MANNER_ARRAY = Deno.readTextFileSync(
    existsSync(CUBE_SOURCE_FILE_NAME)
      ? CUBE_SOURCE_FILE_NAME
      : `${SOURCE_FILE_PATH}manner.txt`,
  ).split("\n");
  const MANNER_COUNT = MANNER_ARRAY.length;
  for (let i = 0; i < MANNER_COUNT; ++i) {
    const MANNER = MANNER_ARRAY[i];
    if (!MANNER.length) {
      continue;
    }
    const [CUBE_NO_STRING, CUBE_ZIPPED_INFO] = Deno.readTextFileSync(
      `${SOURCE_CUBE_FILE_PATH}${MANNER}.txt`,
    ).split(":");
    const CUBE_NO = parseInt(CUBE_NO_STRING);

    const CUBE = unzipCubeInfo(CUBE_ZIPPED_INFO, CUBE_NO);
    SET_ITEM_CUBE_ARRAY.push(CUBE_NO);
    CUBES.push(CUBE);

    if (OUTPUT_ALONE_CUBE) {
      Deno.writeTextFileSync(
        `${END_ALONE_CUBE_PATH}${CUBE_NO}.js`,
        `const cube_${CUBE_NO} = ${JSON.stringify(CUBE)};`,
      );
    }
  }

  if (SORT_CUBES) {
    SET_ITEM_CUBE_ARRAY.sort((prev, next) => prev - next);
    CUBES.sort((prev, next) => prev.no - next.no);
  }

  codes += JSON.stringify(SET_ARRAY);
  codes += "\n;";
  codes += `\nconst CUBES = ${JSON.stringify(CUBES)};`;

  Deno.writeTextFileSync(GOAL_FILE, codes);
}

// 16804:2_0032221,4|0131250,5|0201233,1|0311242,6|0411221,7|1032211,8|1132253,0|1201203,12|1312243,2|1411211,10_3323344444222422224

// const {
//   no,
//   rowCount,
//   actCells,
//   lines,
// } = cube;
// // ${COL_COUNT}
// MANNER_TO_CUBE_MAP_ARRAY.push(
//   `${MANNNER}\t${no}:${rowCount}_${
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
//   }_${lines}`,
// );

function unzipCubeInfo(
  CUBE_ZIPPED_INFO: string,
  CUBE_NO: number,
): CubeForDrawing {
  // 2_0032221,4|0131250,5|0201233,1|0311242,6|0411221,7|1032211,8|1132253,0|1201203,12|1312243,2|1411211,10_3323344444222422224
  const [
    ROW_COUNT_STRING,
    // _WILL_BE_REMOVED,
    ACT_CELLS_INFO,
    // GRID_LINES_INFO,
    lines,
  ] = CUBE_ZIPPED_INFO.split("_");
  const ROW_COUNT = parseInt(ROW_COUNT_STRING);
  const MAX_ROW_INDEX = ROW_COUNT - 1;

  // // let firstRowActCellColIndexBill: string = "";
  // // let lastRowEmptyCellColIndexBill: string = "01234";
  // // 	<en_us>en_us</en_us>
  // // 	<zh_cn>之前忘了加|分隔符，导致下面这个未成功压缩！</zh_cn>
  // // 	<zh_tw>zh_tw</zh_tw>
  // const [firstRowActCellColIndexBill, lastRowEmptyCellColIndexBill] =
  //   FIRST_ROW_ACT_CELL_COL_INDEX_BILL__LAST_ROW_EMPTY_CELL_COL_INDEX_BILL.split(
  //     "|",
  //   );

  // 2_0032221,4|0131250,5|0201233,1|0311242,6|0411221,7|1032211,8|1132253,0|1201203,12|1312243,2|1411211,10_3323344444222422224

  const actCells: CubeForDrawingActCell[] = [];
  const ACT_CELLS_ARRAY = ACT_CELLS_INFO.split("|");
  const ACT_CELLS_COUNT = ACT_CELLS_ARRAY.length;
  for (let i = 0; i < ACT_CELLS_COUNT; ++i) {
    // 0032221,4
    // const  {
    //     layerIndex,
    //     // relation,
    //     relatedInformationWhenAdding: { relation },
    //     feature,
    //     sixFace,
    //     faceDirection,
    //     twelveEdge,
    //     rowIndex,
    //     colIndex,
    //   } = cell;
    //   // const relation = relatedInformationWhenAdding;
    //   return `${rowIndex}${colIndex}${relation}${layerIndex}${feature}${sixFace}${faceDirection},${twelveEdge}`;
    // }

    const [OTHERS, TWELVE_EDGE_STRING] = ACT_CELLS_ARRAY[i].split(",");
    const [
      rowIndex,
      colIndex,
      relation,
      layerIndex,
      feature,
      sixFace,
      faceDirection,
    ] = OTHERS.split("").map((value) => parseInt(value));
    const twelveEdge = parseInt(TWELVE_EDGE_STRING);

    actCells.push({
      layerIndex,
      relation,
      feature,
      sixFace,
      faceDirection,
      twelveEdge,
      rowIndex,
      colIndex,
    });
  }

  const firstRowActCellColIndexBill = actCells.filter((cell) =>
    cell.rowIndex === 0
  ).map((cell) => cell.colIndex).join("");
  // const lastRowEmptyCellColIndexBill = actCells.filter((cell) =>
  //   cell.rowIndex === MAX_ROW_INDEX
  // ).map((cell) => cell.colIndex).join("");
  let lastRowEmptyCellColIndexBill = "01234";
  actCells.filter((cell) => cell.rowIndex === MAX_ROW_INDEX).forEach((cell) => {
    lastRowEmptyCellColIndexBill = lastRowEmptyCellColIndexBill.replace(
      `${cell.colIndex}`,
      "",
    );
  });

  return {
    no: CUBE_NO,
    actCells,

    // gridLines,
    // 3323344444222422224
    lines,

    rowCount: ROW_COUNT,
    colCount: COL_COUNT,

    firstRowActCellColIndexBill,
    lastRowEmptyCellColIndexBill,
  } as CubeForDrawing;
}
/*
set test=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\test
cls && deno lint %test%\manners.ts && deno fmt %test%\manners.ts
*/

/*
*/
