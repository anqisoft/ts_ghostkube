"use strict";
/* v0.0.1
  <en_us></en_us>
  <zh_cn>直接查找manners.txt文件。</zh_cn>
  <zh_tw></zh_tw>
*/
exports.__esModule = true;
exports.done = void 0;
var mod_ts_1 = require("https://deno.land/std/fs/mod.ts");
var cubeCore_ts_1 = require("../src/cubeCore.ts");
var COL_COUNT = 5;
function getCubeLineArray(SOURCE_FILE_PATH) {
    var SOURCE_ARRAY = Deno.readTextFileSync(SOURCE_FILE_PATH + "lines.txt")
        .split("\n");
    var SOURCE_COUNT = SOURCE_ARRAY.length;
    var RESULT = [];
    for (var index = 0; index < SOURCE_COUNT; ++index) {
        var LINE = SOURCE_ARRAY[index];
        RESULT.push(LINE);
    }
    return RESULT;
}
function getCubeForDrawing(no, CUBE_LINE, ACT_CELLS) {
    var firstRowActCellColIndexBill = "";
    var lastRowEmptyCellColIndexBill = "01234";
    var gridLines = [];
    // 44444 22222 44444       422324 433234
    // 44444 22222 22222 44444 433334 432324 423234
    // 27 chars or 38 chars
    var ROW_COUNT = CUBE_LINE.length === 27 ? 2 : 3;
    var MAX_ROW_INDEX = ROW_COUNT - 1;
    var HORIZONTAL_LINE_DIGIT_COUNT = 5 * (ROW_COUNT + 1);
    var HORIZONTAL_LINE_ARRAY_ARRAY = [];
    for (var rowIndex = 0; rowIndex <= ROW_COUNT; ++rowIndex) {
        var OFFSET = COL_COUNT * rowIndex;
        var Y = rowIndex;
        var yStart = Y;
        var yEnd = Y;
        var HORIZONTAL_LINE_ARRAY = [];
        HORIZONTAL_LINE_ARRAY_ARRAY.push(HORIZONTAL_LINE_ARRAY);
        for (var colIndex = 0; colIndex < COL_COUNT; ++colIndex) {
            var xStart = colIndex;
            var xEnd = xStart + 1;
            var lineStyle = parseInt(CUBE_LINE[OFFSET + colIndex]);
            gridLines.push({ xStart: xStart, xEnd: xEnd, yStart: yStart, yEnd: yEnd, lineStyle: lineStyle });
            HORIZONTAL_LINE_ARRAY.push(lineStyle);
        }
    }
    var VERTICAL_LINE_ARRAY_ARRAY = [];
    var VERTICAL_LINE_OFFSET = COL_COUNT * (ROW_COUNT + 1);
    for (var rowIndex = 0; rowIndex < ROW_COUNT; ++rowIndex) {
        var OFFSET = VERTICAL_LINE_OFFSET + (COL_COUNT + 1) * rowIndex;
        var yStart = rowIndex;
        var yEnd = yStart + 1;
        var VERTICAL_LINE_ARRAY = [];
        VERTICAL_LINE_ARRAY_ARRAY.push(VERTICAL_LINE_ARRAY);
        for (var colIndex = 0; colIndex <= COL_COUNT; ++colIndex) {
            var xStart = colIndex;
            var xEnd = xStart;
            var lineStyle = parseInt(CUBE_LINE[OFFSET + colIndex]);
            gridLines.push({ xStart: xStart, xEnd: xEnd, yStart: yStart, yEnd: yEnd, lineStyle: lineStyle });
            VERTICAL_LINE_ARRAY.push(lineStyle);
        }
    }
    // console.log({CUBE_LINE, HORIZONTAL_LINE_ARRAY_ARRAY, VERTICAL_LINE_ARRAY_ARRAY, gridLines});
    // 0043 1011 2153 3050 4033 5772 67b1 7020 8000 9713
    var ACT_CELL_COUNT = ACT_CELLS.length / 4;
    var actCells = [];
    for (var infoIndex = 0; infoIndex < ACT_CELL_COUNT; ++infoIndex) {
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
        var START = 4 * infoIndex;
        var CELL_INFO = ACT_CELLS.substring(START, START + 4);
        //      1）1位：格序（1位，0-15，16进制0-E）
        var cellIndex = parseInt(CELL_INFO.substring(0, 1), 16);
        var rowIndex = Math.floor(cellIndex / COL_COUNT);
        var colIndex = cellIndex % COL_COUNT;
        if (rowIndex === 0) {
            firstRowActCellColIndexBill += colIndex.toString();
        }
        else if (rowIndex === MAX_ROW_INDEX) {
            lastRowEmptyCellColIndexBill = lastRowEmptyCellColIndexBill.replace(colIndex.toString(), "");
        }
        //      2）1位：功能（1位，2-3，2面3片，减2乘6）+层序（1位，1-6转0-5），转1位16进制
        var featureAndLayerIndex = parseInt(CELL_INFO.substring(1, 2), 16);
        var feature = featureAndLayerIndex >= 6
            ? cubeCore_ts_1.CellFeature.Piece
            : cubeCore_ts_1.CellFeature.Face;
        var layerIndex = featureAndLayerIndex % 6 + 1;
        //      3）1位：面序或片序——面序0-5，片序0-11，转1位十六进制
        var sixFaceAndFaceDirectionOrTwelveEdge = parseInt(CELL_INFO.substring(2, 3), 16);
        var sixFace = feature === cubeCore_ts_1.CellFeature.Piece
            ? cubeCore_ts_1.SixFace.Up
            : sixFaceAndFaceDirectionOrTwelveEdge;
        var twelveEdge = feature === cubeCore_ts_1.CellFeature.Piece
            ? sixFaceAndFaceDirectionOrTwelveEdge
            : cubeCore_ts_1.TwelveEdge.NotSure;
        //      4）1位：方向序，0-3
        // const relation: ConnectionRelation = parseInt(CELL_INFO.substring(3, 4), 16);
        var faceDirection = parseInt(CELL_INFO.substring(3, 4), 16);
        var relation = cubeCore_ts_1.ConnectionRelation.Top;
        if (feature === cubeCore_ts_1.CellFeature.Piece) {
            var topLine = HORIZONTAL_LINE_ARRAY_ARRAY[rowIndex][colIndex];
            var bottomLine = HORIZONTAL_LINE_ARRAY_ARRAY[rowIndex + 1][colIndex];
            var leftLine = VERTICAL_LINE_ARRAY_ARRAY[rowIndex][colIndex];
            var rightLine = VERTICAL_LINE_ARRAY_ARRAY[rowIndex][colIndex + 1];
            if (topLine === cubeCore_ts_1.GridLineStyle.InnerLine) {
                relation = cubeCore_ts_1.ConnectionRelation.Bottom;
            }
            else if (bottomLine === cubeCore_ts_1.GridLineStyle.InnerLine) {
                relation = cubeCore_ts_1.ConnectionRelation.Top;
            }
            else if (leftLine === cubeCore_ts_1.GridLineStyle.InnerLine) {
                relation = cubeCore_ts_1.ConnectionRelation.Right;
            }
            else if (rightLine === cubeCore_ts_1.GridLineStyle.InnerLine) {
                relation = cubeCore_ts_1.ConnectionRelation.Left;
            }
            // console.log({ feature, relation, topLine, bottomLine, leftLine, rightLine, InnerLine: GridLineStyle.InnerLine,
            // CUBE_LINE, HORIZONTAL_LINE_ARRAY_ARRAY, VERTICAL_LINE_ARRAY_ARRAY
            // });
        }
        actCells.push({
            layerIndex: layerIndex,
            relation: relation,
            feature: feature,
            sixFace: sixFace,
            faceDirection: faceDirection,
            twelveEdge: twelveEdge,
            rowIndex: rowIndex,
            colIndex: colIndex
        });
    }
    return {
        no: no,
        actCells: actCells,
        gridLines: gridLines,
        rowCount: ROW_COUNT,
        colCount: COL_COUNT,
        firstRowActCellColIndexBill: firstRowActCellColIndexBill,
        lastRowEmptyCellColIndexBill: lastRowEmptyCellColIndexBill
    };
}
function done(SOURCE_FILE_PATH, GOAL_FILE, OUTPUT_ALONE_CUBE, SET_ITEM_NAME) {
    if (OUTPUT_ALONE_CUBE === void 0) { OUTPUT_ALONE_CUBE = false; }
    if (SET_ITEM_NAME === void 0) { SET_ITEM_NAME = '~'; }
    var END_ALONE_CUBE_PATH = SOURCE_FILE_PATH + "99_AloneCube/";
    if (OUTPUT_ALONE_CUBE) {
        mod_ts_1.ensureDirSync(END_ALONE_CUBE_PATH);
        mod_ts_1.emptyDirSync(END_ALONE_CUBE_PATH);
    }
    var codes = "const SET_ARRAY = \n";
    var SET_ARRAY = [];
    var SET_ITEM = {
        name: SET_ITEM_NAME,
        cubes: []
    };
    SET_ARRAY.push(SET_ITEM);
    var SET_ITEM_CUBE_ARRAY = SET_ITEM.cubes;
    var CUBE_LINE_ARRAY = getCubeLineArray(SOURCE_FILE_PATH);
    var CUBES = [];
    var MANNER_AND_CUBE_NO_BILL_ARRAY = Deno.readTextFileSync(SOURCE_FILE_PATH + "manners.txt").split("\n");
    var MANNER_AND_CUBE_NO_BILL_COUNT = MANNER_AND_CUBE_NO_BILL_ARRAY.length;
    for (var i = 0; i < MANNER_AND_CUBE_NO_BILL_COUNT; ++i) {
        var _a = MANNER_AND_CUBE_NO_BILL_ARRAY[i].split("\t"), _manner = _a[0], cubeNoBill = _a[1];
        var CUBE_NO_ARRAY = cubeNoBill.split(",").map(function (no) { return parseInt(no); });
        var cubeNo = CUBE_NO_ARRAY[0];
        SET_ITEM_CUBE_ARRAY.push(cubeNo);
        // 根据cube.no直接创建相应cube，追加到CUBES
        // 2. 根据cubeNo与CUBE_LINE_ARRAY，获取边线数据并还原
        // 444442222244444422324433234
        // 44444222222222244444433334432324423234
        var CUBE_LINE = CUBE_LINE_ARRAY[Math.floor((cubeNo - 0.5) / 24)];
        // // 27 chars or 38 chars
        // const ROW_COUNT = CUBE_LINE.length === 27 ? 2 : 3;
        // 3. 根据cubeNo与cubes/00####.txt（每文件30720行，所以可以直接算出读哪个文件，再读相应行），获取格信息
        var CUBE_FILE_NO = Math.ceil((cubeNo - 0.5) / 30720);
        var CUBE_LINE_INDEX_IN_FILE = Math.floor((cubeNo - 0.5) % 30720); // cubeNo % 30720;
        // 00431011215330504033577267b1702080009713
        var ACT_CELLS = Deno.readTextFileSync(SOURCE_FILE_PATH + "cubes/" + CUBE_FILE_NO.toString().padStart(6, "0") + ".txt")
            .split("\n")[CUBE_LINE_INDEX_IN_FILE];
        // console.log({ cubeNo, CUBE_LINE, ACT_CELLS });
        var CUBE = getCubeForDrawing(cubeNo, CUBE_LINE, ACT_CELLS);
        CUBES.push(CUBE);
        if (OUTPUT_ALONE_CUBE) {
            Deno.writeTextFileSync("" + END_ALONE_CUBE_PATH + cubeNo + ".js", "const cube_" + cubeNo + " = " + JSON.stringify(CUBE) + ";");
        }
    }
    codes += JSON.stringify(SET_ARRAY);
    codes += "\n;";
    codes += "\nconst CUBES = " + JSON.stringify(CUBES) + ";";
    Deno.writeTextFileSync(GOAL_FILE, codes);
}
exports.done = done;
/*
set test=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\test
cls && deno lint %test%\manners.ts && deno fmt %test%\manners.ts
*/
/*
*/
