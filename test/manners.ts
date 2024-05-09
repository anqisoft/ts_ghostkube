/* v0.0.1
  <en_us></en_us>
  <zh_cn>直接查找manners.txt文件。</zh_cn>
  <zh_tw></zh_tw>
*/

import { emptyDirSync, ensureDirSync } from "https://deno.land/std/fs/mod.ts";

import {
  CellFeature,
  ConnectionRelation,
  Cube,
  CubeForDrawing,
  CubeForDrawingActCell,
  FourDirection,
  GridLineStyle,
  SixFace,
  TwelveEdge,
} from "../src/cubeCore.ts";

const COL_COUNT = 5;

function getCubeLineArray(SOURCE_FILE_PATH: string): string[] {
  const SOURCE_ARRAY = Deno.readTextFileSync(`${SOURCE_FILE_PATH}lines.txt`)
    .split("\n");
  const SOURCE_COUNT = SOURCE_ARRAY.length;

  const RESULT = [];
  for (let index = 0; index < SOURCE_COUNT; ++index) {
    const LINE = SOURCE_ARRAY[index];
    RESULT.push(LINE);
  }

  return RESULT;
}

function getCubeForDrawing(
  no: number,
  CUBE_LINE: string,
  ACT_CELLS: string,
): CubeForDrawing {
  let firstRowActCellColIndexBill: string = "";
  let lastRowEmptyCellColIndexBill: string = "01234";
  const gridLines: GridLine[] = [];
  // 44444 22222 44444       422324 433234
  // 44444 22222 22222 44444 433334 432324 423234
  // 27 chars or 38 chars
  const ROW_COUNT = CUBE_LINE.length === 27 ? 2 : 3;
  const MAX_ROW_INDEX = ROW_COUNT - 1;
  const HORIZONTAL_LINE_DIGIT_COUNT = 5 * (ROW_COUNT + 1);
  const HORIZONTAL_LINE_ARRAY_ARRAY: number[][] = [];
  for (let rowIndex = 0; rowIndex <= ROW_COUNT; ++rowIndex) {
    const OFFSET = COL_COUNT * rowIndex;
    const Y = rowIndex;
    const yStart = Y;
    const yEnd = Y;
    const HORIZONTAL_LINE_ARRAY: number[] = [];
    HORIZONTAL_LINE_ARRAY_ARRAY.push(HORIZONTAL_LINE_ARRAY);
    for (let colIndex = 0; colIndex < COL_COUNT; ++colIndex) {
      const xStart = colIndex;
      const xEnd = xStart + 1;
      const lineStyle = parseInt(CUBE_LINE[OFFSET + colIndex]);
      gridLines.push({ xStart, xEnd, yStart, yEnd, lineStyle });
      HORIZONTAL_LINE_ARRAY.push(lineStyle);
    }
  }
  const VERTICAL_LINE_ARRAY_ARRAY: number[][] = [];
  const VERTICAL_LINE_OFFSET = COL_COUNT * (ROW_COUNT + 1);
  for (let rowIndex = 0; rowIndex < ROW_COUNT; ++rowIndex) {
    const OFFSET = VERTICAL_LINE_OFFSET + (COL_COUNT + 1) * rowIndex;
    const yStart = rowIndex;
    const yEnd = yStart + 1;
    const VERTICAL_LINE_ARRAY: number[] = [];
    VERTICAL_LINE_ARRAY_ARRAY.push(VERTICAL_LINE_ARRAY);
    for (let colIndex = 0; colIndex <= COL_COUNT; ++colIndex) {
      const xStart = colIndex;
      const xEnd = xStart;
      const lineStyle = parseInt(CUBE_LINE[OFFSET + colIndex]);
      gridLines.push({ xStart, xEnd, yStart, yEnd, lineStyle });
      VERTICAL_LINE_ARRAY.push(lineStyle);
    }
  }
  // console.log({CUBE_LINE, HORIZONTAL_LINE_ARRAY_ARRAY, VERTICAL_LINE_ARRAY_ARRAY, gridLines});

  // 0043 1011 2153 3050 4033 5772 67b1 7020 8000 9713
  const ACT_CELL_COUNT = ACT_CELLS.length / 4;
  const actCells: CubeForDrawingActCell[] = [];
  for (let infoIndex = 0; infoIndex < ACT_CELL_COUNT; ++infoIndex) {
    // layerIndex: number,
    // relation: ConnectionRelation,
    // feature: CellFeature,
    // sixFace: SixFace,
    // faceDirection: FourDirection,
    // twelveEdge: TwelveEdge,
    // rowIndex: number,
    // colIndex: number,

    // 压缩后的正方体信息（正方体间以回车符分隔，4位一格，16进制）：
    //      1）1位：格序（1位，0-15，16进制0-E）
    //      2）1位：功能（1位，2-3，2面3片，减2乘6）+层序（1位，1-6转0-5），转1位16进制
    //      3）1位：面序或片序——面序0-5，片序0-11，转1位十六进制
    //      4）1位：方向序，0-3
    const START = 4 * infoIndex;
    const CELL_INFO = ACT_CELLS.substring(START, START + 4);

    //      1）1位：格序（1位，0-15，16进制0-E）
    const cellIndex: number = parseInt(CELL_INFO.substring(0, 1), 16);
    const rowIndex: number = Math.floor(cellIndex / COL_COUNT);
    const colIndex: number = cellIndex % COL_COUNT;
    if (rowIndex === 0) {
      firstRowActCellColIndexBill += colIndex.toString();
    } else if (rowIndex === MAX_ROW_INDEX) {
      lastRowEmptyCellColIndexBill = lastRowEmptyCellColIndexBill.replace(
        colIndex.toString(),
        "",
      );
    }

    //      2）1位：功能（1位，2-3，2面3片，减2乘6）+层序（1位，1-6转0-5），转1位16进制
    const featureAndLayerIndex = parseInt(CELL_INFO.substring(1, 2), 16);
    const feature: CellFeature = featureAndLayerIndex >= 6
      ? CellFeature.Piece
      : CellFeature.Face;
    const layerIndex: number = featureAndLayerIndex % 6 + 1;

    //      3）1位：面序或片序——面序0-5，片序0-11，转1位十六进制
    const sixFaceAndFaceDirectionOrTwelveEdge = parseInt(
      CELL_INFO.substring(2, 3),
      16,
    );
    const sixFace = feature === CellFeature.Piece
      ? SixFace.Up
      : sixFaceAndFaceDirectionOrTwelveEdge;
    const twelveEdge: TwelveEdge = feature === CellFeature.Piece
      ? sixFaceAndFaceDirectionOrTwelveEdge
      : TwelveEdge.NotSure;

    //      4）1位：方向序，0-3
    // const relation: ConnectionRelation = parseInt(CELL_INFO.substring(3, 4), 16);
    const faceDirection: ConnectionRelation = parseInt(
      CELL_INFO.substring(3, 4),
      16,
    );

    let relation = ConnectionRelation.Top;
    if (feature === CellFeature.Piece) {
      const topLine = HORIZONTAL_LINE_ARRAY_ARRAY[rowIndex][colIndex];
      const bottomLine = HORIZONTAL_LINE_ARRAY_ARRAY[rowIndex + 1][colIndex];

      const leftLine = VERTICAL_LINE_ARRAY_ARRAY[rowIndex][colIndex];
      const rightLine = VERTICAL_LINE_ARRAY_ARRAY[rowIndex][colIndex + 1];

      if (topLine === GridLineStyle.InnerLine) {
        relation = ConnectionRelation.Bottom;
      } else if (bottomLine === GridLineStyle.InnerLine) {
        relation = ConnectionRelation.Top;
      } else if (leftLine === GridLineStyle.InnerLine) {
        relation = ConnectionRelation.Right;
      } else if (rightLine === GridLineStyle.InnerLine) {
        relation = ConnectionRelation.Left;
      }
      // console.log({ feature, relation, topLine, bottomLine, leftLine, rightLine, InnerLine: GridLineStyle.InnerLine,
      // CUBE_LINE, HORIZONTAL_LINE_ARRAY_ARRAY, VERTICAL_LINE_ARRAY_ARRAY
      // });
    }
    actCells.push({
      layerIndex, // : number,
      relation, // : ConnectionRelation,
      feature, // : CellFeature,
      sixFace, // : SixFace,
      faceDirection, // : FourDirection,
      twelveEdge, // : TwelveEdge,
      rowIndex, // : number,
      colIndex, // : number,
    });
  }

  return {
    no,
    actCells,
    gridLines,

    rowCount: ROW_COUNT,
    colCount: COL_COUNT,

    firstRowActCellColIndexBill,
    lastRowEmptyCellColIndexBill,
  } as CubeForDrawing;
}

export function done(
  SOURCE_FILE_PATH: string,
  GOAL_FILE: string,
  OUTPUT_ALONE_CUBE: boolean = false,
  SET_ITEM_NAME: string = '~',
) {
  const END_ALONE_CUBE_PATH = `${SOURCE_FILE_PATH}99_AloneCube/`;
  if (OUTPUT_ALONE_CUBE) {
    ensureDirSync(END_ALONE_CUBE_PATH);
    emptyDirSync(END_ALONE_CUBE_PATH);
  }

  let codes = "const SET_ARRAY = \n";

  const SET_ARRAY: object[] = [];
  const SET_ITEM: { name: string; cubes: number[] } = {
    name: SET_ITEM_NAME,
    cubes: [],
  };
  SET_ARRAY.push(SET_ITEM);
  const SET_ITEM_CUBE_ARRAY = SET_ITEM.cubes;

  const CUBE_LINE_ARRAY = getCubeLineArray(SOURCE_FILE_PATH);
  const CUBES = [];

  const MANNER_AND_CUBE_NO_BILL_ARRAY = Deno.readTextFileSync(
    `${SOURCE_FILE_PATH}manners.txt`,
  ).split("\n");
  const MANNER_AND_CUBE_NO_BILL_COUNT = MANNER_AND_CUBE_NO_BILL_ARRAY.length;
  for (let i = 0; i < MANNER_AND_CUBE_NO_BILL_COUNT; ++i) {
    const [_manner, cubeNoBill] = MANNER_AND_CUBE_NO_BILL_ARRAY[i].split("\t");
    const CUBE_NO_ARRAY = cubeNoBill.split(",").map((no) => parseInt(no));
    const cubeNo = CUBE_NO_ARRAY[0];
    SET_ITEM_CUBE_ARRAY.push(cubeNo);

    // 根据cube.no直接创建相应cube，追加到CUBES

    // 2. 根据cubeNo与CUBE_LINE_ARRAY，获取边线数据并还原
    // 444442222244444422324433234
    // 44444222222222244444433334432324423234
    const CUBE_LINE = CUBE_LINE_ARRAY[Math.floor((cubeNo - 0.5) / 24)];
    // // 27 chars or 38 chars
    // const ROW_COUNT = CUBE_LINE.length === 27 ? 2 : 3;

    // 3. 根据cubeNo与cubes/00####.txt（每文件30720行，所以可以直接算出读哪个文件，再读相应行），获取格信息
    const CUBE_FILE_NO = Math.ceil((cubeNo - 0.5) / 30720);
    const CUBE_LINE_INDEX_IN_FILE = Math.floor((cubeNo - 0.5) % 30720); // cubeNo % 30720;
    // 00431011215330504033577267b1702080009713
    const ACT_CELLS = Deno.readTextFileSync(
      `${SOURCE_FILE_PATH}cubes/${
        CUBE_FILE_NO.toString().padStart(6, "0")
      }.txt`,
    )
      .split(
        "\n",
      )[CUBE_LINE_INDEX_IN_FILE];

    // console.log({ cubeNo, CUBE_LINE, ACT_CELLS });
    const CUBE = getCubeForDrawing(cubeNo, CUBE_LINE, ACT_CELLS);
    CUBES.push(CUBE);

    if (OUTPUT_ALONE_CUBE) {
      Deno.writeTextFileSync(
        `${END_ALONE_CUBE_PATH}${cubeNo}.js`,
        `const cube_${cubeNo} = ${JSON.stringify(CUBE)};`,
      );
    }
  }

  codes += JSON.stringify(SET_ARRAY);
  codes += "\n;";
  codes += `\nconst CUBES = ${JSON.stringify(CUBES)};`;

  Deno.writeTextFileSync(GOAL_FILE, codes);
}

/*
set test=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\test
cls && deno lint %test%\manners.ts && deno fmt %test%\manners.ts
*/

/*
*/
