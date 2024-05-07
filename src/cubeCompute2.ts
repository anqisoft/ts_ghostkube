/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * src\cubeCompute2.ts v0.0.1
 * deno 1.42.1 + VSCode 1.88.0
 *
 * <en_us>
 * Created on Thu Apr 11 2024 15:56:32
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年4月11日 15:56:32
 * 功能：读入拼插方案，
	1. 计算简版可拼插方案？
	2. 去掉数量信息，存为一一对应版文件（js和ts各一份）。
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年4月11日 15:56:32
 * 功能：
 * </zh_tw>
*/

import {
  ANGLE_COUNT,
  CellBorderLine,
  CellBorderPosition,
  CellFeature,
  CellObject,
  COL_INDEX_ARRAY_MORE_THAN_THREE_ROW,
  ConnectionRelation,
  convertSixFaceAndDirectionToSixFaceTwentyFourAngle,
  convertSixFaceTwentyFourAngleToSixFaceAndDirection,
  Cube,
  // CUBES,
  FourDirection,
  getSixFaceTwentyFourAngleRelationTwelveEdge,
  log,
  OneCellRowColIndex,
  OneOfTwelveEdges,
  OneOrTwoCellRowColIndex,
  showUsedTime,
  SiblingsAppendInfo,
  SIX_FACE_AND_DIRECTION_RELATIONS,
  SixFace,
  SixFaceTwentyFourAngle,
  TwelveEdge,
  TwelveEdges,
} from "./cubeCore.ts";

log(new Date());
const DATE_BEGIN = performance.now();

const DEBUG = {
  // false true
};

const { floor } = Math;

showUsedTime("begin");

const SIMPLE_MANNER_ARRAY: string[] = [];
const SIMPLE_DATA_ARRAY: {
  manner: string;
  cube: Cube;
}[] = [];

const DATA_FILE_PATH = "../../../../!important/data/";
// {
// 	manner,
// 	cubes: MANNER_CUBE_ARRAY[index],
// 	cubeCount: MANNER_CUBE_COUNT_ARRAY[index],
// 	cubeOfTwoRowsCount: MANNER_CUBE_COUNT_OF_ROWS_2_ARRAY[index],
// 	cubeOfThreeRowsCount: MANNER_CUBE_COUNT_OF_ROWS_3_ARRAY[index],
// }
JSON.parse(Deno.readTextFileSync(`${DATA_FILE_PATH}mannerDetails.ts`)).forEach(
  ({
    manner,
    cubes,
    cubeCount,
    cubeOfTwoRowsCount,
    cubeOfThreeRowsCount,
  }: {
    manner: string;
    cubes: Cube[];
    cubeCount: number;
    cubeOfTwoRowsCount: number;
    cubeOfThreeRowsCount: number;
  }) => {
    // T0T0T0T0T0F0F0T1T0T0T0T0 => TTTTTFFTTTTT
    const FULL_MANNER_DATA_ARRAY: string[] = manner.split("");
    const SIMPLE_MANNER_DATA_ARRAY: string[] = [];
    for (let i = 0; i < 12; i += 2) {
      SIMPLE_MANNER_DATA_ARRAY.push(
        (FULL_MANNER_DATA_ARRAY[i] === "T" ||
            FULL_MANNER_DATA_ARRAY[i + 1] !== "0")
          ? "T"
          : "F",
      );
    }
    const NEW_SIMPLE_MANNER = SIMPLE_MANNER_DATA_ARRAY.join("");
    if (SIMPLE_MANNER_ARRAY.indexOf(NEW_SIMPLE_MANNER) === -1) {
      SIMPLE_MANNER_ARRAY.push(NEW_SIMPLE_MANNER);
    }

    SIMPLE_DATA_ARRAY.push({
      manner,
      cube: Object.assign(cubes[0], { cells: undefined, isValid: undefined }),
    });
  },
);

// output: SIMPLE_MANNER_ARRAY SIMPLE_DATA_ARRAY
Deno.writeTextFileSync(
  `${DATA_FILE_PATH}simple_manner.txt`,
  JSON.stringify(SIMPLE_MANNER_ARRAY),
);

const SIMPLE_MANNER_STRING = JSON.stringify(SIMPLE_DATA_ARRAY);
Deno.writeTextFileSync(
  `${DATA_FILE_PATH}simple_manner_details.js`,
  `const MANNERS = ${SIMPLE_MANNER_STRING};`,
);
Deno.writeTextFileSync(
  `${DATA_FILE_PATH}simple_manner_details.ts`,
  `export const MANNERS = ${SIMPLE_MANNER_STRING};`,
);

showUsedTime("end");
log(new Date());
log(`Total used ${(performance.now() - DATE_BEGIN).toFixed(2)} milliseconds.`);

/* in:
P:\anqi\Desktop\tech\ts\_bak\203_ts_ghostkube\!important\data\mannerDetails.ts
out:
P:\anqi\Desktop\tech\ts\_bak\203_ts_ghostkube\!important\data\simple_manner.txt
P:\anqi\Desktop\tech\ts\_bak\203_ts_ghostkube\!important\data\simple_manner_details.js
P:\anqi\Desktop\tech\ts\_bak\203_ts_ghostkube\!important\data\simple_manner_details.ts

cls && deno run -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\cubeCompute2.ts
*/

/* 单个调用
:: call %bat_call_cubeCompute2% dataFlag=rows_2 jsPath= subCatalogName2=subCatalogName1 vCubeCompute2=v0.0.1

::=============================================== 2行 ===============================================

::full
call %bat_call_cubeCompute2% rows_2 full only_rows_2

::not_extend_1_to_24
call %bat_call_cubeCompute2% rows_2 not_extend_1_to_24 only_rows_2

::one_middle_cube
call %bat_call_cubeCompute2% rows_2 one_middle_cube only_rows_2

::simplest one_middle_cube and not_extend_1_to_24
call %bat_call_cubeCompute2% rows_2 simplest only_rows_2

call %bat_call_cubeCompute2% rows_2 test only_rows_2

::=============================================== 3行 ===============================================

::full
call %bat_call_cubeCompute2% rows_3 full only_rows_3

::not_extend_1_to_24
call %bat_call_cubeCompute2% rows_3 not_extend_1_to_24 only_rows_3

::one_middle_cube
call %bat_call_cubeCompute2% rows_3 one_middle_cube only_rows_3

::simplest one_middle_cube and not_extend_1_to_24
call %bat_call_cubeCompute2% rows_3 simplest only_rows_3

::=============================================== 2行、3行同时计算 ===============================================

::full
call %bat_call_cubeCompute2% rows_2_3 full ""

::not_extend_1_to_24
call %bat_call_cubeCompute2% rows_2_3 not_extend_1_to_24 ""
*/

/* 同时调用
:: call %bat_call_cubeCompute1_and_cubeCompute2% dataFlag=rows_2 subCatalogName1=not_extend_1_to_24 jsPath= subCatalogName2=subCatalogName1 vCubeCompute1=v0.0.2 vCubeCompute2=v0.0.1

::=============================================== 2行 ===============================================

::full
call %bat_call_cubeCompute1_and_cubeCompute2% rows_2 full only_rows_2 full v0.0.2 v0.0.1

::not_extend_1_to_24
call %bat_call_cubeCompute1_and_cubeCompute2% rows_2 not_extend_1_to_24 only_rows_2 not_extend_1_to_24 v0.0.2 v0.0.1

::one_middle_cube
call %bat_call_cubeCompute1_and_cubeCompute2% rows_2 one_middle_cube only_rows_2 one_middle_cube v0.0.2 v0.0.1

::simplest one_middle_cube and not_extend_1_to_24
call %bat_call_cubeCompute1_and_cubeCompute2% rows_2 simplest only_rows_2 simplest v0.0.2 v0.0.1


::=============================================== 3行 ===============================================

::full
call %bat_call_cubeCompute1_and_cubeCompute2% rows_3 full only_rows_3 full v0.0.2 v0.0.1

::not_extend_1_to_24
call %bat_call_cubeCompute1_and_cubeCompute2% rows_3 not_extend_1_to_24 only_rows_3 not_extend_1_to_24 v0.0.2 v0.0.1

::one_middle_cube
call %bat_call_cubeCompute1_and_cubeCompute2% rows_3 one_middle_cube only_rows_3 one_middle_cube v0.0.2 v0.0.1

::simplest one_middle_cube and not_extend_1_to_24
call %bat_call_cubeCompute1_and_cubeCompute2% rows_3 simplest only_rows_3 simplest v0.0.2 v0.0.1

::=============================================== 2行、3行同时计算 ===============================================

::full
call %bat_call_cubeCompute1_and_cubeCompute2% rows_2_3 full "" full v0.0.2 v0.0.1

::not_extend_1_to_24
call %bat_call_cubeCompute1_and_cubeCompute2% rows_2_3 not_extend_1_to_24 ""
*/
