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
  getCubeForDrawingFromString,
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

    const CUBE = getCubeForDrawingFromString(Deno.readTextFileSync(
      `${SOURCE_CUBE_FILE_PATH}${MANNER}.txt`,
    ));
    const CUBE_NO = CUBE.no;
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

/*
set test=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\test
cls && deno lint %test%\manners.ts && deno fmt %test%\manners.ts
*/

/*
*/
