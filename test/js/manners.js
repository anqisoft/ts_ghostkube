"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.done = void 0;
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
function done(SOURCE_FILE_PATH, GOAL_FILE) {
    return __awaiter(this, void 0, void 0, function () {
        var codes, SET_ARRAY, SET_ITEM, SET_ITEM_CUBE_ARRAY, CUBE_LINE_ARRAY, CUBES, MANNER_AND_CUBE_NO_BILL_ARRAY, MANNER_AND_CUBE_NO_BILL_COUNT, i, _a, _manner, cubeNoBill, CUBE_NO_ARRAY, cubeNo, CUBE_LINE, CUBE_FILE_NO, CUBE_LINE_INDEX_IN_FILE, ACT_CELLS, CUBE;
        return __generator(this, function (_b) {
            codes = "const SET_ARRAY = \n";
            SET_ARRAY = [];
            SET_ITEM = {
                name: "NO-1",
                cubes: []
            };
            SET_ARRAY.push(SET_ITEM);
            SET_ITEM_CUBE_ARRAY = SET_ITEM.cubes;
            CUBE_LINE_ARRAY = getCubeLineArray(SOURCE_FILE_PATH);
            CUBES = [];
            MANNER_AND_CUBE_NO_BILL_ARRAY = Deno.readTextFileSync(SOURCE_FILE_PATH + "manners.txt").split("\n");
            MANNER_AND_CUBE_NO_BILL_COUNT = MANNER_AND_CUBE_NO_BILL_ARRAY.length;
            for (i = 0; i < MANNER_AND_CUBE_NO_BILL_COUNT; ++i) {
                _a = MANNER_AND_CUBE_NO_BILL_ARRAY[i].split("\t"), _manner = _a[0], cubeNoBill = _a[1];
                CUBE_NO_ARRAY = cubeNoBill.split(",").map(function (no) { return parseInt(no); });
                cubeNo = CUBE_NO_ARRAY[0];
                SET_ITEM_CUBE_ARRAY.push(cubeNo);
                CUBE_LINE = CUBE_LINE_ARRAY[Math.ceil((cubeNo - 0.5) / 24)];
                CUBE_FILE_NO = Math.ceil((cubeNo - 0.5) / 30720);
                CUBE_LINE_INDEX_IN_FILE = Math.floor((cubeNo - 0.5) % 30720);
                ACT_CELLS = Deno.readTextFileSync(SOURCE_FILE_PATH + "cubes/" + CUBE_FILE_NO.toString().padStart(6, "0") + ".txt")
                    .split("\n")[CUBE_LINE_INDEX_IN_FILE];
                CUBE = getCubeForDrawing(cubeNo, CUBE_LINE, ACT_CELLS);
                CUBES.push(CUBE);
            }
            codes += JSON.stringify(SET_ARRAY);
            codes += "\n;";
            codes += "\nconst CUBES = " + JSON.stringify(CUBES) + ";";
            Deno.writeTextFileSync(GOAL_FILE, codes);
            return [2 /*return*/];
        });
    });
}
exports.done = done;
/*
set pwd=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\test
cls && deno lint %pwd%\manners.ts && deno fmt %pwd%\manners.ts
*/
/*
*/
