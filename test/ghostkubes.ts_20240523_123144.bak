/* v0.0.4
  <en_us></en_us>
  <zh_cn>
    新算法：manner.txt + cubes/~mannerName~.txt
  </zh_cn>
  <zh_tw></zh_tw>
*/
/* v0.0.3
  <en_us></en_us>
  <zh_cn>
    新算法：不查找mannersBill.txt，直接查找manners.txt文件。
  </zh_cn>
  <zh_tw></zh_tw>
*/
/* v0.0.2
  <en_us></en_us>
  <zh_cn>
    新算法：当超过2个插片时，只取3行5列的正方体。
    缺陷：有25项2个插片无法找到合适的正方体（只有2行5列的，没有3行5列的）。
  </zh_cn>
  <zh_tw></zh_tw>
*/
/* v0.0.1
  <en_us></en_us>
  <zh_cn>缺陷：当超过2个插片时，可能因连接不足而塌下来</zh_cn>
  <zh_tw></zh_tw>
*/

import {
  emptyDirSync,
  ensureDirSync,
  existsSync,
} from "https://deno.land/std/fs/mod.ts";
import { Globals, log, logUsedTime, showUsedTime } from "./log.ts";

import {
  CellFeature,
  ConnectionRelation,
  Cube,
  CubeForDrawing,
  CubeForDrawingActCell,
  FourDirection,
  getCubeForDrawingFromString,
  GridLine,
  GridLineStyle,
  SixFace,
  TwelveEdge,
} from "../src/cubeCore.ts";

const COL_COUNT = 5;

function getMannerFromCubeInfo(
  inNoArray: number[],
  outNoArray: number[],
): string {
  let manner = "";
  // let pieceCount = 0;
  for (let i = 1; i <= 12; ++i) {
    const isNotIn = inNoArray.indexOf(i) === -1;
    const isNotOut = outNoArray.indexOf(i) === -1;
    manner += `${isNotIn ? "[FT]" : "T"}${
      isNotOut ? "[0123456789]" : "[123456789]"
    }`;

    // if (!isNotOut) {
    //   ++pieceCount;
    // }
  }

  // return [manner, pieceCount];
  return manner;
}

export function main(
  DATAS: {
    setName: string;
    cubes: [number[], number[]][];
  }[],
  GOAL_FILE: string,
  OUTPUT_ALONE_CUBE: boolean = true,
) {
  if (existsSync(Globals.LOG_FILE_NAME)) {
    Deno.removeSync(Globals.LOG_FILE_NAME);
  }

  log(`begin: ${(new Date()).toLocaleString()}`);
  const DATE_BEGIN = performance.now();

  const SOURCE_FILE_PATH: string = "C:\\__cube\\2rows_3rows\\";
  const SOURCE_CUBE_FILE_PATH = `${SOURCE_FILE_PATH}cubes/`;

  const END_ALONE_CUBE_PATH = `${SOURCE_FILE_PATH}99_aloneCube/`;
  if (OUTPUT_ALONE_CUBE) {
    ensureDirSync(END_ALONE_CUBE_PATH);
    emptyDirSync(END_ALONE_CUBE_PATH);
  }

  const MANNER_ARRAY = Deno.readTextFileSync(`${SOURCE_FILE_PATH}manner.txt`)
    .split("\n");
  const MANNER_COUNT = MANNER_ARRAY.length;

  let codes = "const SET_ARRAY = \n";

  const CUBES: CubeForDrawing[] = [];
  // const CUBE_NO_ARRAY: number[] = [];
  // let cubeCount = 0;

  const SET_ARRAY: object[] = [];

  let searchMannerCount = 0;
  const SERACH_MANNER_ARRAY: string[] = [];
  const SERACH_MANNER_TO_MANNER_ARRAY: string[] = [];
  // const CUBE_VALUE_ARRAY: CubeForDrawing[] = [];
  function appendSearchManner(
    searchManner: string,
    manner: string,
    cube: CubeForDrawing,
  ) {
    SERACH_MANNER_ARRAY.push(searchManner);
    SERACH_MANNER_TO_MANNER_ARRAY.push(manner);
    CUBES.push(cube);
    ++searchMannerCount;
  }

  const DATA_COUNT = DATAS.length;
  for (let dataIndex = 0; dataIndex < DATA_COUNT; ++dataIndex) {
    const { setName, cubes } = DATAS[dataIndex];

    const SET = { name: setName, cubes: [] };
    SET_ARRAY.push(SET);
    const SET_ITEM_CUBE_ARRAY = SET.cubes as number[];

    const CUBE_COUNT = cubes.length;
    LABEL_CUBE_LOOP: for (
      let cubeIndex = 0;
      cubeIndex < CUBE_COUNT;
      ++cubeIndex
    ) {
      const [inNoArray, outNoArray] = cubes[cubeIndex];
      const SEARCH_MANNER = getMannerFromCubeInfo(
        inNoArray,
        outNoArray,
      );

      for (let i = 0; i < searchMannerCount; ++i) {
        if (SEARCH_MANNER === SERACH_MANNER_ARRAY[i]) {
          const CUBE = CUBES[i];
          const CUBE_NO = CUBE.no;
          SET_ITEM_CUBE_ARRAY.push(CUBE_NO);

          continue LABEL_CUBE_LOOP;
        }
      }

      const MANNER_REGEX = new RegExp(SEARCH_MANNER);
      for (let i = 0; i < MANNER_COUNT; ++i) {
        const MANNER = MANNER_ARRAY[i];

        if (MANNER_REGEX.test(MANNER)) {
          try {
            const CUBE = getCubeForDrawingFromString(Deno.readTextFileSync(
              `${SOURCE_CUBE_FILE_PATH}${MANNER}.txt`,
            ));
            const CUBE_NO = CUBE.no;
            SET_ITEM_CUBE_ARRAY.push(CUBE_NO);

            appendSearchManner(SEARCH_MANNER, MANNER, CUBE);
          } catch (error) {
            log(`[error]${error}`);
          }

          continue LABEL_CUBE_LOOP;
        }
      }
    }

    showUsedTime(`complete ${dataIndex} item`);
  }

  codes += JSON.stringify(SET_ARRAY);
  codes += "\n;";
  codes += `\nconst CUBES = ${JSON.stringify(CUBES)};`;

  Deno.writeTextFileSync(GOAL_FILE, codes);

  log(`end: ${(new Date()).toLocaleString()}`);
  logUsedTime("Total", performance.now() - DATE_BEGIN);
}
/*
set pwd=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\test
cls && deno lint %pwd%\ghostkubes.ts && deno fmt %pwd%\ghostkubes.ts
*/
