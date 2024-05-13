"use strict";
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
exports.__esModule = true;
exports.main = void 0;
var mod_ts_1 = require("https://deno.land/std/fs/mod.ts");
var log_ts_1 = require("./log.ts");
var cubeCore_ts_1 = require("../src/cubeCore.ts");
var COL_COUNT = 5;
function getMannerFromCubeInfo(inNoArray, outNoArray) {
    var manner = "";
    // let pieceCount = 0;
    for (var i = 1; i <= 12; ++i) {
        var isNotIn = inNoArray.indexOf(i) === -1;
        var isNotOut = outNoArray.indexOf(i) === -1;
        manner += "" + (isNotIn ? "[FT]" : "T") + (isNotOut ? "[0123456789]" : "[123456789]");
        // if (!isNotOut) {
        //   ++pieceCount;
        // }
    }
    // return [manner, pieceCount];
    return manner;
}
function main(DATAS, GOAL_FILE, OUTPUT_ALONE_CUBE) {
    if (OUTPUT_ALONE_CUBE === void 0) { OUTPUT_ALONE_CUBE = true; }
    if (mod_ts_1.existsSync(log_ts_1.Globals.LOG_FILE_NAME)) {
        Deno.removeSync(log_ts_1.Globals.LOG_FILE_NAME);
    }
    log_ts_1.log("begin: " + (new Date()).toLocaleString());
    var DATE_BEGIN = performance.now();
    var SOURCE_FILE_PATH = "C:\\__cube\\2rows_3rows\\";
    var SOURCE_CUBE_FILE_PATH = SOURCE_FILE_PATH + "cubes/";
    var END_ALONE_CUBE_PATH = SOURCE_FILE_PATH + "99_aloneCube/";
    if (OUTPUT_ALONE_CUBE) {
        mod_ts_1.ensureDirSync(END_ALONE_CUBE_PATH);
        mod_ts_1.emptyDirSync(END_ALONE_CUBE_PATH);
    }
    var MANNER_ARRAY = Deno.readTextFileSync(SOURCE_FILE_PATH + "manner.txt")
        .split("\n");
    var MANNER_COUNT = MANNER_ARRAY.length;
    var codes = "const SET_ARRAY = \n";
    var CUBES = [];
    // const CUBE_NO_ARRAY: number[] = [];
    // let cubeCount = 0;
    var SET_ARRAY = [];
    var searchMannerCount = 0;
    var SERACH_MANNER_ARRAY = [];
    var SERACH_MANNER_TO_MANNER_ARRAY = [];
    // const CUBE_VALUE_ARRAY: CubeForDrawing[] = [];
    function appendSearchManner(searchManner, manner, cube) {
        SERACH_MANNER_ARRAY.push(searchManner);
        SERACH_MANNER_TO_MANNER_ARRAY.push(manner);
        CUBES.push(cube);
        ++searchMannerCount;
    }
    var DATA_COUNT = DATAS.length;
    for (var dataIndex = 0; dataIndex < DATA_COUNT; ++dataIndex) {
        var _a = DATAS[dataIndex], setName = _a.setName, cubes = _a.cubes;
        var SET = { name: setName, cubes: [] };
        SET_ARRAY.push(SET);
        var SET_ITEM_CUBE_ARRAY = SET.cubes;
        var CUBE_COUNT = cubes.length;
        LABEL_CUBE_LOOP: for (var cubeIndex = 0; cubeIndex < CUBE_COUNT; ++cubeIndex) {
            var _b = cubes[cubeIndex], inNoArray = _b[0], outNoArray = _b[1];
            var SEARCH_MANNER = getMannerFromCubeInfo(inNoArray, outNoArray);
            for (var i = 0; i < searchMannerCount; ++i) {
                if (SEARCH_MANNER === SERACH_MANNER_ARRAY[i]) {
                    var CUBE = CUBES[i];
                    var CUBE_NO = CUBE.no;
                    SET_ITEM_CUBE_ARRAY.push(CUBE_NO);
                    continue LABEL_CUBE_LOOP;
                }
            }
            var MANNER_REGEX = new RegExp(SEARCH_MANNER);
            for (var i = 0; i < MANNER_COUNT; ++i) {
                var MANNER = MANNER_ARRAY[i];
                if (MANNER_REGEX.test(MANNER)) {
                    try {
                        var CUBE = cubeCore_ts_1.getCubeForDrawingFromString(Deno.readTextFileSync("" + SOURCE_CUBE_FILE_PATH + MANNER + ".txt"));
                        var CUBE_NO = CUBE.no;
                        SET_ITEM_CUBE_ARRAY.push(CUBE_NO);
                        appendSearchManner(SEARCH_MANNER, MANNER, CUBE);
                    }
                    catch (error) {
                        log_ts_1.log("[error]" + error);
                    }
                    continue LABEL_CUBE_LOOP;
                }
            }
        }
        log_ts_1.showUsedTime("complete " + dataIndex + " item");
    }
    codes += JSON.stringify(SET_ARRAY);
    codes += "\n;";
    codes += "\nconst CUBES = " + JSON.stringify(CUBES) + ";";
    Deno.writeTextFileSync(GOAL_FILE, codes);
    log_ts_1.log("end: " + (new Date()).toLocaleString());
    log_ts_1.logUsedTime("Total", performance.now() - DATE_BEGIN);
}
exports.main = main;
/*
set pwd=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\test
cls && deno lint %pwd%\ghostkubes.ts && deno fmt %pwd%\ghostkubes.ts
*/
