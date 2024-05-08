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
// see: https://www.kickstarter.com/projects/ghostkube/ghostkube
var mod_ts_1 = require("https://deno.land/std/io/mod.ts");
var log_ts_1 = require("./log.ts");
var cubeCore_ts_1 = require("../src/cubeCore.ts");
var cubeBlackList_ts_1 = require("../data/cubeBlackList.ts");
var dataCache_ts_1 = require("../data/dataCache.ts");
var OLD_CACHE_DATA_ARRAY_JSON = JSON.stringify(dataCache_ts_1.CACHE_DATA_ARRAY);
var COL_COUNT = 5;
var DEBUG = {
    SHOW_INFO_WHEN_PIECE_COUNT_EQUALS_OR_GREAT_THAN_TWO: false,
    SHOW_OK_COUNT_OF_MANNERS_FILE_AND_SOURCE_MANNER_COUNT: false
};
// https://stackoverflow.com/questions/8936984/uint8array-to-string-in-javascript
// const decoder = new TextDecoder();
function getMannerFromCubeInfo(inNoArray, outNoArray) {
    var manner = "";
    var pieceCount = 0;
    // let test = '';
    for (var i = 1; i <= 12; ++i) {
        var isNotIn = inNoArray.indexOf(i) === -1;
        var isNotOut = outNoArray.indexOf(i) === -1;
        // manner += `${inNoArray.indexOf(i) === -1 ? '[FT]' : 'T'}${isNotOut ? '[0123]' : '1'}`;
        manner += "" + (isNotIn ? "[FT]" : "T") + (isNotOut ? "[0123]" : "[123]");
        // test += `${isNotIn ? 'F' : 'T'}${isNotOut ? '0' : '1'}`;
        if (!isNotOut) {
            ++pieceCount;
        }
    }
    // log(`getMannerFromCubeInfo([${inNoArray}], [${outNoArray}]) => ${JSON.stringify({manner,pieceCount,test})}`);
    return [manner, pieceCount];
}
function readFileByStream(filename) {
    return __awaiter(this, void 0, void 0, function () {
        var RESULT, file, bufReader, line;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    RESULT = [];
                    return [4 /*yield*/, Deno.open(filename)];
                case 1:
                    file = _a.sent();
                    bufReader = new mod_ts_1.BufReader(file);
                    _a.label = 2;
                case 2: return [4 /*yield*/, bufReader.readString("\n")];
                case 3:
                    if (!((line = _a.sent()) != Deno.EOF)) return [3 /*break*/, 4];
                    //lineCount++;
                    // do something with `line`.
                    RESULT.push(line);
                    return [3 /*break*/, 2];
                case 4:
                    file.close();
                    // console.log(`${lineCount} lines read.`);
                    return [2 /*return*/, RESULT];
            }
        });
    });
}
function getCubeLineArray() {
    var SOURCE_ARRAY = Deno.readTextFileSync("../data/lines.txt").split("\n");
    // const SOURCE_ARRAY = await readFileByStream('../data/lines.txt');
    var SOURCE_COUNT = SOURCE_ARRAY.length;
    var RESULT = [];
    for (var index = 0; index < SOURCE_COUNT; ++index) {
        var LINE = SOURCE_ARRAY[index];
        RESULT.push(LINE);
    }
    return RESULT;
}
function readFileByStreamSync(filename, fn, COUNT) {
    return __awaiter(this, void 0, void 0, function () {
        function readFileByStream(filename) {
            return __awaiter(this, void 0, void 0, function () {
                var file, bufReader, remainCount, line, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Deno.open(filename)];
                        case 1:
                            file = _b.sent();
                            bufReader = new mod_ts_1.BufReader(file);
                            remainCount = COUNT;
                            _b.label = 2;
                        case 2:
                            _a = remainCount > 0;
                            if (!_a) return [3 /*break*/, 4];
                            return [4 /*yield*/, bufReader.readString("\n")];
                        case 3:
                            _a = (line = _b.sent()) != Deno.EOF;
                            _b.label = 4;
                        case 4:
                            if (!_a) return [3 /*break*/, 5];
                            remainCount -= fn(line.replace("\n", ""));
                            return [3 /*break*/, 2];
                        case 5:
                            file.close();
                            return [2 /*return*/];
                    }
                });
            });
        }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readFileByStream(filename)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
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
function done(DATAS, GOAL_FILE) {
    return __awaiter(this, void 0, void 0, function () {
        function addSourceManner(manner, pieceCount) {
            var finded = false;
            for (var sourceMannerIndex = 0; sourceMannerIndex < sourceMannerCount; ++sourceMannerIndex) {
                if (SOURCE_MANNER_ARRAY[sourceMannerIndex] === manner) {
                    finded = true;
                    break;
                }
            }
            if (!finded) {
                SOURCE_MANNER_ARRAY.push(manner);
                // MANNER_PIECE_COUNT_ARRAY.push(pieceCount);
                MANNER_ARRAY.push({ mannerSource: manner, pieceCount: pieceCount });
                ++sourceMannerCount;
            }
        }
        function getCubeByManner(searchManner) {
            for (var mannerIndex = 0; mannerIndex < sourceMannerCount; ++mannerIndex) {
                var MANNER_OBJECT = MANNER_ARRAY[mannerIndex];
                if (MANNER_OBJECT.mannerSource === searchManner) {
                    return MANNER_OBJECT.cube;
                }
            }
            return null;
        }
        var codes, SHOW_INFO_WHEN_PIECE_COUNT_EQUALS_OR_GREAT_THAN_TWO, SHOW_OK_COUNT_OF_MANNERS_FILE_AND_SOURCE_MANNER_COUNT, MAX_CUBE_NO_OF_TWO_ROWS, CUBES, CUBE_NO_ARRAY, cubeCount, SET_ARRAY, DATA_COUNT, SOURCE_MANNER_ARRAY, MANNER_ARRAY, sourceMannerCount, NEW_CACHE_DATA_ARRAY, newCacheDataCount, dataIndex, dataIndex, DATA, setName, cubes, cubeInfos, CUBE_COUNT, cubeInfoCount, ok, okCount, cubeIndex, _a, inNoArray, outNoArray, _b, mannerRegExp, pieceCount, find, dataIndex_1, CACHE_DATA, CACHE_MANNER_REG_EXP, CACHE_CUBE, cubeIndex, cubeIndex, _c, inNoArray, outNoArray, _d, manner, pieceCount, fileName, CUBE_LINE_ARRAY_1, okCountOfMannersFile_1, dataIndex, _e, setName, cubes, cubeInfos, SET, CUBE_COUNT, cubeIndex, cubeGoal, CUBE, CUBE_NO, finded, cubeIndex_1, NEW_CACHE_DATA_ARRAY_JSON;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    codes = "const SET_ARRAY = \n";
                    SHOW_INFO_WHEN_PIECE_COUNT_EQUALS_OR_GREAT_THAN_TWO = DEBUG.SHOW_INFO_WHEN_PIECE_COUNT_EQUALS_OR_GREAT_THAN_TWO, SHOW_OK_COUNT_OF_MANNERS_FILE_AND_SOURCE_MANNER_COUNT = DEBUG.SHOW_OK_COUNT_OF_MANNERS_FILE_AND_SOURCE_MANNER_COUNT;
                    MAX_CUBE_NO_OF_TWO_ROWS = 10560;
                    CUBES = [];
                    CUBE_NO_ARRAY = [];
                    cubeCount = 0;
                    SET_ARRAY = [];
                    DATA_COUNT = DATAS.length;
                    SOURCE_MANNER_ARRAY = [];
                    MANNER_ARRAY = [];
                    sourceMannerCount = 0;
                    NEW_CACHE_DATA_ARRAY = [];
                    newCacheDataCount = dataCache_ts_1.CACHE_DATA_COUNT;
                    for (dataIndex = 0; dataIndex < dataCache_ts_1.CACHE_DATA_COUNT; ++dataIndex) {
                        NEW_CACHE_DATA_ARRAY.push(dataCache_ts_1.CACHE_DATA_ARRAY[dataIndex]);
                    }
                    // 第一轮收集manner
                    for (dataIndex = 0; dataIndex < DATA_COUNT; ++dataIndex) {
                        DATA = DATAS[dataIndex];
                        setName = DATA.setName, cubes = DATA.cubes;
                        cubeInfos = [];
                        CUBE_COUNT = cubes.length;
                        cubeInfoCount = cubeInfos.length;
                        DATA.cubeInfos = cubeInfos;
                        ok = false;
                        if (!dataCache_ts_1.SKIP_CACHE_DATA) {
                            okCount = 0;
                            for (cubeIndex = 0; cubeIndex < CUBE_COUNT; ++cubeIndex) {
                                _a = cubes[cubeIndex], inNoArray = _a[0], outNoArray = _a[1];
                                _b = getMannerFromCubeInfo(inNoArray, outNoArray), mannerRegExp = _b[0], pieceCount = _b[1];
                                find = false;
                                for (dataIndex_1 = 0; dataIndex_1 < dataCache_ts_1.CACHE_DATA_COUNT; ++dataIndex_1) {
                                    CACHE_DATA = dataCache_ts_1.CACHE_DATA_ARRAY[dataIndex_1];
                                    CACHE_MANNER_REG_EXP = CACHE_DATA.mannerRegExp, CACHE_CUBE = CACHE_DATA.cube;
                                    if (CACHE_MANNER_REG_EXP === mannerRegExp) {
                                        cubeInfos.push({
                                            manner: mannerRegExp,
                                            cube: CUBE_SOURCE.cube,
                                            cubeNo: CUBE_SOURCE.cubeNo
                                        });
                                        ++okCount;
                                        find = true;
                                        break;
                                    }
                                }
                                if (!find) {
                                    cubeInfos.push({
                                        manner: "",
                                        cube: undefined,
                                        cubeNo: 0
                                    });
                                }
                            }
                            ok = okCount === CUBE_COUNT;
                        }
                        else {
                            for (cubeIndex = 0; cubeIndex < CUBE_COUNT; ++cubeIndex) {
                                cubeInfos.push({});
                            }
                        }
                        if (ok) {
                            continue;
                        }
                        for (cubeIndex = 0; cubeIndex < CUBE_COUNT; ++cubeIndex) {
                            if (cubeInfos[cubeIndex].cube) {
                                continue;
                            }
                            _c = cubes[cubeIndex], inNoArray = _c[0], outNoArray = _c[1];
                            _d = getMannerFromCubeInfo(inNoArray, outNoArray), manner = _d[0], pieceCount = _d[1];
                            // console.log({manner});
                            // cubeGoal.manner = manner;
                            // cubeInfos.push({manner});
                            cubeInfos[cubeIndex].manner = manner;
                            ++cubeInfoCount;
                            addSourceManner(manner, pieceCount);
                        }
                    }
                    log_ts_1.showUsedTime("step1: collect info from DATAS");
                    fileName = "";
                    if (!sourceMannerCount) return [3 /*break*/, 2];
                    CUBE_LINE_ARRAY_1 = getCubeLineArray();
                    // 遍历大文件，转化所收集的manner清单到实际正方体
                    fileName = "../data/manners.txt";
                    okCountOfMannersFile_1 = 0;
                    return [4 /*yield*/, readFileByStreamSync(fileName, function (mannerInfo) {
                            var count = 0;
                            for (var i = 0; i < sourceMannerCount; ++i) {
                                var MANNER_OBJECT = MANNER_ARRAY[i];
                                if (MANNER_OBJECT.cubeNo) {
                                    continue;
                                }
                                var SEARCH_MANNER = MANNER_OBJECT.mannerSource, pieceCount = MANNER_OBJECT.pieceCount;
                                var MANNER_REGEX = new RegExp(SEARCH_MANNER);
                                var _a = mannerInfo.split("\t"), MANNER = _a[0], CUBE_NO_BILL = _a[1];
                                if (MANNER_REGEX.test(MANNER)) {
                                    var cubeNoArray = CUBE_NO_BILL.split("|").map(function (value) {
                                        return parseInt(value);
                                    });
                                    // log(SEARCH_MANNER, pieceCount, typeof cubeNoArray[0]);
                                    // log(MANNER, pieceCount, SEARCH_MANNER);
                                    if (SHOW_INFO_WHEN_PIECE_COUNT_EQUALS_OR_GREAT_THAN_TWO &&
                                        pieceCount >= 2) {
                                        log_ts_1.log(pieceCount, cubeNoArray.filter(function (no) { return no > MAX_CUBE_NO_OF_TWO_ROWS; }).length, MANNER, CUBE_NO_BILL, SEARCH_MANNER);
                                    }
                                    var cubeNoCount = cubeNoArray.length;
                                    var cubeNo = 0;
                                    if (cubeBlackList_ts_1.SKIP_CUBE_ARRAY_IN_BLACK_LIST) {
                                        if (pieceCount < 2) {
                                            cubeNo = cubeNoArray[0];
                                        }
                                        else {
                                            for (var cubeIndex = 0; cubeIndex < cubeNoCount; ++cubeIndex) {
                                                var currentCubeNo = cubeNoArray[cubeIndex];
                                                if (currentCubeNo > MAX_CUBE_NO_OF_TWO_ROWS) {
                                                    cubeNo = currentCubeNo;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        for (var cubeIndex = 0; cubeIndex < cubeNoCount; ++cubeIndex) {
                                            var currentCubeNo = cubeNoArray[cubeIndex];
                                            var needSkipped = false;
                                            for (var index = 0; index < cubeBlackList_ts_1.CUBE_COUNT_IN_BLACK_LIST; ++index) {
                                                if (cubeBlackList_ts_1.CUBE_ARRAY_IN_BLACK_LIST[index] === currentCubeNo) {
                                                    needSkipped = true;
                                                    break;
                                                }
                                            }
                                            if (!needSkipped) {
                                                if (pieceCount < 2 || currentCubeNo > MAX_CUBE_NO_OF_TWO_ROWS) {
                                                    cubeNo = currentCubeNo;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    if (cubeNo > 0) {
                                        ++count;
                                        MANNER_OBJECT.cubeNo = cubeNo;
                                        ++okCountOfMannersFile_1;
                                        // 2. 根据cubeNo与CUBE_LINE_ARRAY，获取边线数据并还原
                                        // 444442222244444422324433234
                                        // 44444222222222244444433334432324423234
                                        var CUBE_LINE = CUBE_LINE_ARRAY_1[Math.ceil((cubeNo - 0.5) / 24)];
                                        // // 27 chars or 38 chars
                                        // const ROW_COUNT = CUBE_LINE.length === 27 ? 2 : 3;
                                        // 3. 根据cubeNo与cubes/00####.txt（每文件30720行，所以可以直接算出读哪个文件，再读相应行），获取格信息
                                        var CUBE_FILE_NO = Math.ceil((cubeNo - 0.5) / 30720);
                                        var CUBE_LINE_INDEX_IN_FILE = Math.floor((cubeNo - 0.5) % 30720); // cubeNo % 30720;
                                        // 00431011215330504033577267b1702080009713
                                        var ACT_CELLS = Deno.readTextFileSync("../data/cubes/" + CUBE_FILE_NO.toString().padStart(6, "0") + ".txt")
                                            .split("\n")[CUBE_LINE_INDEX_IN_FILE];
                                        var CUBE = getCubeForDrawing(cubeNo, CUBE_LINE, ACT_CELLS);
                                        MANNER_OBJECT.cube = CUBE;
                                        var findInNewCacheData = false;
                                        for (var dataIndex = 0; dataIndex < newCacheDataCount; ++dataIndex) {
                                            var NEW_CACHE_DATA = NEW_CACHE_DATA_ARRAY[dataIndex];
                                            if (NEW_CACHE_DATA.manner === MANNER) {
                                                findInNewCacheData = true;
                                                break;
                                            }
                                        }
                                        if (!findInNewCacheData) {
                                            ++newCacheDataCount;
                                            // NEW_CACHE_DATA_ARRAY.push({searchManner: SEARCH_MANNER, manner: manner});
                                            NEW_CACHE_DATA_ARRAY.push({
                                                mannerRegExp: SEARCH_MANNER,
                                                manner: MANNER,
                                                cube: CUBE
                                            });
                                        }
                                        // for (let dataIndex = 0; dataIndex < newCacheDataCount; ++dataIndex) {
                                        // const NEW_CACHE_DATA = NEW_CACHE_DATA_ARRAY[dataIndex];
                                        // if (NEW_CACHE_DATA.manner === MANNER) {
                                        // NEW_CACHE_DATA.cube = CUBE;
                                        // break;
                                        // }
                                        // }
                                        // } else {
                                        // log(`[error]Couldn't find the fitful cube by '${SEARCH_MANNER}' and ${pieceCount}.`);
                                    }
                                }
                            }
                            return count;
                        }, sourceMannerCount)];
                case 1:
                    _f.sent();
                    if (SHOW_OK_COUNT_OF_MANNERS_FILE_AND_SOURCE_MANNER_COUNT) {
                        log_ts_1.log({ okCountOfMannersFile: okCountOfMannersFile_1, sourceMannerCount: sourceMannerCount });
                    }
                    if (okCountOfMannersFile_1 < sourceMannerCount) {
                        log_ts_1.log("[error]" + (sourceMannerCount - okCountOfMannersFile_1) + " items couldn't find in '" + fileName + "'.");
                    }
                    log_ts_1.showUsedTime("step3: collect info from " + fileName);
                    _f.label = 2;
                case 2:
                    // 第二轮实际处理
                    for (dataIndex = 0; dataIndex < DATA_COUNT; ++dataIndex) {
                        _e = DATAS[dataIndex], setName = _e.setName, cubes = _e.cubes, cubeInfos = _e.cubeInfos;
                        SET = { name: setName, cubes: [] };
                        SET_ARRAY.push(SET);
                        CUBE_COUNT = cubes.length;
                        for (cubeIndex = 0; cubeIndex < CUBE_COUNT; ++cubeIndex) {
                            cubeGoal = cubeInfos[cubeIndex];
                            CUBE = cubeGoal.cube
                                ? cubeGoal.cube
                                : getCubeByManner(cubeGoal.manner);
                            if (CUBE) {
                                CUBE_NO = CUBE.no;
                                finded = false;
                                for (cubeIndex_1 = 0; cubeIndex_1 < cubeCount; ++cubeIndex_1) {
                                    if (CUBE_NO_ARRAY[cubeIndex_1] === CUBE_NO) {
                                        finded = true;
                                        break;
                                    }
                                }
                                if (!finded) {
                                    CUBE_NO_ARRAY.push(CUBE_NO);
                                    CUBES.push(CUBE);
                                    ++cubeCount;
                                }
                                SET.cubes.push(CUBE_NO);
                                cubeGoal.cube = CUBE;
                            }
                            else {
                                log_ts_1.log("[error]" + setName + "." + (cubeIndex + 1) + ".cube is null or undefined.");
                            }
                        }
                    }
                    codes += JSON.stringify(SET_ARRAY);
                    codes += "\n;";
                    codes += "\nconst CUBES = " + JSON.stringify(CUBES) + ";";
                    Deno.writeTextFileSync(GOAL_FILE, codes);
                    // not work: NEW_CACHE_DATA_ARRAY.sort((prev, next) => prev.manner < next.manner);
                    NEW_CACHE_DATA_ARRAY.sort(function (prev, next) {
                        return prev.manner.localeCompare(next.manner);
                    });
                    NEW_CACHE_DATA_ARRAY_JSON = JSON.stringify(NEW_CACHE_DATA_ARRAY);
                    if (OLD_CACHE_DATA_ARRAY_JSON !== NEW_CACHE_DATA_ARRAY_JSON) {
                        Deno.writeTextFileSync("../data/dataCache.ts", "export const CACHE_DATA_ARRAY = " + NEW_CACHE_DATA_ARRAY_JSON + ";\nexport const CACHE_DATA_COUNT = CACHE_DATA_ARRAY.length;\nexport const SKIP_CACHE_DATA = !!CACHE_DATA_COUNT;\n");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.done = done;
/*
set pwd=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\test
cls && deno lint %pwd%\ghostkubes.ts && deno fmt %pwd%\ghostkubes.ts
*/
/*
*/
