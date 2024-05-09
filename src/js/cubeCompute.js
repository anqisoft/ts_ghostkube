"use strict";
/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * src\cubeCompute.ts v0.0.1
 * deno 1.42.1 + VSCode 1.88.0
 *
 * <en_us>
 * Created on Wed May 08 2024 13:00:33
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年5月8日 13:00:33
 * 功能：合并所有步骤
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年5月8日 13:00:33
 * 功能：
 * </zh_tw>
 */
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.main = void 0;
var mod_ts_1 = require("https://deno.land/std/fs/mod.ts");
var path = require("https://deno.land/std/path/mod.ts");
var cubeCore_ts_1 = require("./cubeCore.ts");
var floor = Math.floor;
var OVER_WRITE_TRUE_FLAG = { overwrite: true };
var APPEND_TRUE_FLAG = { append: true };
// const EMPTY_OBJECT = {};
var LOG_FILE_NAME = "./log.txt";
var COL_COUNT = 5;
var MAX_COL_INDEX = COL_COUNT - 1;
function step1(ROW_COUNT_ARRAY, GOAL_FILE_TOP_PATH, OUTPUT_CUT_MANNERS_ROW_BY_ROW) {
    if (GOAL_FILE_TOP_PATH === void 0) { GOAL_FILE_TOP_PATH = "./"; }
    if (OUTPUT_CUT_MANNERS_ROW_BY_ROW === void 0) { OUTPUT_CUT_MANNERS_ROW_BY_ROW = false; }
    var STEP_FLAG = "step1";
    if (mod_ts_1.existsSync(LOG_FILE_NAME)) {
        Deno.removeSync(LOG_FILE_NAME);
    }
    var logFilenamePostfix = "";
    logFilenamePostfix = "_" + STEP_FLAG;
    var GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH = GOAL_FILE_TOP_PATH.replace(/[.\/\\]/g, "").length;
    var DEBUG_FILE_PREFIX = GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH
        ? ""
        : STEP_FLAG.concat("_");
    if (GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH) {
        mod_ts_1.ensureDirSync(GOAL_FILE_TOP_PATH);
        mod_ts_1.emptyDirSync(GOAL_FILE_TOP_PATH);
    }
    cubeCore_ts_1.log("begin: " + (new Date()).toLocaleString());
    var DATE_BEGIN = performance.now();
    var DEBUG = {
        // false true
        COUNT_LINES_ONLY: false,
        COUNT_CUT_MANNER_ONLY: false,
        MIDDLE_CUBE_BATCH_DEAL_COUNT: 10240,
        SHOW_CUT_MANNERS: true,
        SHOW_CUBE_WHEN_OK_IN_COUNT_BY_LINES: false
    };
    var MIDDLE_CUBE_ARRAY = [];
    var MIDDLE_CUBE_COUNT_ARRAY = [0, 0, 0, 0, 0, 0];
    var CUT_MANNER_COUNT_ARRAY = [0, 0, 0, 0, 0, 0];
    var CUT_MANNER_ARRAY = [];
    var CORE_COL_INDEX_ORDER_ARRAY = [3, 1, 2, 0, 4];
    var totalMiddleCubeCount = 0;
    function countByRowCount(ROW_COUNT) {
        var thisLineMannerCount = 0;
        var thisLineMannerIndex = 0;
        var middleFileNo = 0;
        var thisMiddleCubeCount = 0;
        var CORE_COL_INDEX = 0;
        var CORE_ROW_INDEX = ROW_COUNT <= 4 ? 1 : 2;
        var MAX_ROW_INDEX = ROW_COUNT - 1;
        var CELL_COUNT = COL_COUNT * ROW_COUNT;
        var GOAL_FILE_PATH = "" + GOAL_FILE_TOP_PATH + ROW_COUNT + "rows_" + COL_COUNT + "cols/";
        var MIDDLE_CUBE_BATCH_DEAL_COUNT = DEBUG.MIDDLE_CUBE_BATCH_DEAL_COUNT;
        var MIDDLE_FILE_NAME_PREFIX = "" + GOAL_FILE_PATH;
        MIDDLE_CUBE_ARRAY.length = 0;
        function countMiddleCubes() {
            var nextMiddleCubeNo = totalMiddleCubeCount;
            function countAndPushIfOk(simpleCube) {
                var cube = new cubeCore_ts_1.Cube(++nextMiddleCubeNo, ROW_COUNT, simpleCube.colCount, CORE_ROW_INDEX, CORE_COL_INDEX, true);
                simpleCube.cells.forEach(function (sourceRow, rowIndex) {
                    var goalRow = [];
                    cube.cells.push(goalRow);
                    sourceRow.forEach(function (sourceCell, colIndex) {
                        // new CellObject(rowIndex: number, colIndex: number, cellIndex: number)
                        var goalCell = new cubeCore_ts_1.CellObject(rowIndex, colIndex, COL_COUNT * rowIndex + colIndex);
                        goalRow.push(goalCell);
                        var relatedInformationWhenAdding = goalCell.relatedInformationWhenAdding, borderLines = goalCell.borderLines;
                        goalCell.addOrder = sourceCell.addOrder;
                        var sourceRelatedInformationWhenAdding = sourceCell.relatedInformationWhenAdding;
                        relatedInformationWhenAdding.rowIndex =
                            sourceRelatedInformationWhenAdding.rowIndex;
                        relatedInformationWhenAdding.colIndex =
                            sourceRelatedInformationWhenAdding.colIndex;
                        relatedInformationWhenAdding.relation =
                            sourceRelatedInformationWhenAdding.relation;
                        goalCell.feature = sourceCell.feature;
                        goalCell.sixFace = sourceCell.sixFace;
                        goalCell.faceDirection = sourceCell.faceDirection;
                        goalCell.twelveEdge = sourceCell.twelveEdge;
                        var sourceBorderLines = sourceCell.borderLines;
                        sourceBorderLines.forEach(function (value, index) {
                            borderLines[index] = value;
                        });
                    });
                });
                cube.count();
                var ARRAY_INDEX = ROW_COUNT - 2;
                ++MIDDLE_CUBE_COUNT_ARRAY[ARRAY_INDEX];
                if (DEBUG.SHOW_CUT_MANNERS) {
                    var CUT_MANNER = cube.gridLines.map(function (_a) {
                        var xStart = _a.xStart, xEnd = _a.xEnd, yStart = _a.yStart, yEnd = _a.yEnd, lineStyle = _a.lineStyle;
                        return "" + xStart + xEnd + yStart + yEnd + lineStyle;
                    }).join(",");
                    if (CUT_MANNER_ARRAY.indexOf(CUT_MANNER) === -1) {
                        CUT_MANNER_ARRAY.push(CUT_MANNER);
                        ++CUT_MANNER_COUNT_ARRAY[ARRAY_INDEX];
                    }
                    // if (lastCutManner !== CUT_MANNER) {
                    //   lastCutManner = CUT_MANNER;
                    //   addCutMannerToMiddleCubeNoFileContent(lastCutManner);
                    // }
                }
                if (DEBUG.COUNT_CUT_MANNER_ONLY) {
                    ++thisMiddleCubeCount;
                }
                else {
                    // addCutMannerToMiddleCubeNoFileContent(cube.no.toString());
                    appendMiddleCube(cube);
                }
            }
            function appendMiddleCube(cube) {
                MIDDLE_CUBE_ARRAY.push(cube);
                if (MIDDLE_CUBE_ARRAY.length >= MIDDLE_CUBE_BATCH_DEAL_COUNT) {
                    dealMiddleCubes();
                }
            }
            function dealMiddleCubes() {
                var MIDDLE_CUBE_COUNT = MIDDLE_CUBE_ARRAY.length;
                if (!MIDDLE_CUBE_COUNT) {
                    return;
                }
                Deno.writeTextFileSync("" + MIDDLE_FILE_NAME_PREFIX + (++middleFileNo).toString().padStart(3, "0") + ".txt", MIDDLE_CUBE_ARRAY.map(function (cube) { return JSON.stringify(cube); }).join("\n"));
                MIDDLE_CUBE_ARRAY.length = 0;
                thisMiddleCubeCount += MIDDLE_CUBE_COUNT;
            }
            function countMiddleCube() {
                var HORIZONTAL_LINE_COUNT = COL_COUNT * (ROW_COUNT - 1);
                var VERTICAL_LINE_COUNT = (COL_COUNT - 1) * ROW_COUNT;
                var LINE_COUNT = HORIZONTAL_LINE_COUNT + VERTICAL_LINE_COUNT;
                var HORIZONTAL_LINE_ARRAY = [];
                var VERTICAL_LINE_ARRAY = [];
                for (var horizontalLineIndex = 0; horizontalLineIndex < HORIZONTAL_LINE_COUNT; ++horizontalLineIndex) {
                    HORIZONTAL_LINE_ARRAY.push(2);
                }
                for (var verticalLineIndex = 0; verticalLineIndex < VERTICAL_LINE_COUNT; ++verticalLineIndex) {
                    VERTICAL_LINE_ARRAY.push(2);
                }
                var COUNT = Math.pow(2, LINE_COUNT);
                thisLineMannerCount = COUNT;
                var _loop_1 = function (i) {
                    var BINARY_STRING = i.toString(2).padStart(LINE_COUNT, "0");
                    BINARY_STRING.split("").forEach(function (value, index) {
                        if (index < HORIZONTAL_LINE_COUNT) {
                            HORIZONTAL_LINE_ARRAY[index] = value === "1" ? 3 : 2;
                        }
                        else {
                            VERTICAL_LINE_ARRAY[index - HORIZONTAL_LINE_COUNT] = value === "1"
                                ? 3
                                : 2;
                        }
                    });
                    if (!HORIZONTAL_LINE_ARRAY.filter(function (value) { return value === 2; }).length) {
                        return "continue";
                    }
                    if (!VERTICAL_LINE_ARRAY.filter(function (value) { return value === 2; }).length) {
                        return "continue";
                    }
                    var EMPTY_CELL_POSITOIN_ARRAY = [];
                    VERTICAL_LINE_ARRAY.forEach(function (verticalLine, index) {
                        if (verticalLine === 2) {
                            return;
                        }
                        var verticalColIndex = index % MAX_COL_INDEX;
                        var rowIndex = Math.floor(index / MAX_COL_INDEX);
                        var LOOP_COUNT = verticalColIndex === 3 ? 2 : 1;
                        for (var iOffset = 1; iOffset <= LOOP_COUNT; ++iOffset) {
                            var colIndex = verticalColIndex - 1 + iOffset;
                            var ADDRESS = [rowIndex, colIndex];
                            if (rowIndex === 0) {
                                if (HORIZONTAL_LINE_ARRAY[colIndex] === 3) {
                                    if (colIndex === 0 || colIndex === 4 ||
                                        VERTICAL_LINE_ARRAY[index - 1] === 3) {
                                        EMPTY_CELL_POSITOIN_ARRAY.push(ADDRESS);
                                    }
                                }
                                return;
                            }
                            if (rowIndex === MAX_ROW_INDEX) {
                                if (HORIZONTAL_LINE_ARRAY[COL_COUNT * rowIndex + colIndex] === 3) {
                                    if (colIndex === 0 || colIndex === 4 ||
                                        VERTICAL_LINE_ARRAY[index - 1] === 3) {
                                        EMPTY_CELL_POSITOIN_ARRAY.push(ADDRESS);
                                    }
                                }
                                return;
                            }
                            if (HORIZONTAL_LINE_ARRAY[COL_COUNT * (rowIndex - 1) + colIndex] ===
                                3 &&
                                HORIZONTAL_LINE_ARRAY[COL_COUNT * rowIndex + colIndex] === 3) {
                                if (colIndex === 0 || colIndex === 4 ||
                                    VERTICAL_LINE_ARRAY[index - 1] === 3) {
                                    EMPTY_CELL_POSITOIN_ARRAY.push(ADDRESS);
                                }
                            }
                        }
                    });
                    var notEmptyRowCount = 0;
                    var _loop_2 = function (rowLoop) {
                        if (EMPTY_CELL_POSITOIN_ARRAY.filter(function (_a) {
                            var rowIndex = _a[0];
                            return rowIndex === rowLoop;
                        })
                            .length < ROW_COUNT) {
                            ++notEmptyRowCount;
                        }
                    };
                    for (var rowLoop = 0; rowLoop < ROW_COUNT; ++rowLoop) {
                        _loop_2(rowLoop);
                    }
                    if (notEmptyRowCount < ROW_COUNT) {
                        return "continue";
                    }
                    var notEmptyColCount = 0;
                    var _loop_3 = function (colLoop) {
                        if (EMPTY_CELL_POSITOIN_ARRAY.filter(function (_a) {
                            var colIndex = _a[1];
                            return colIndex === colLoop;
                        })
                            .length < COL_COUNT) {
                            ++notEmptyColCount;
                        }
                    };
                    for (var colLoop = 0; colLoop < COL_COUNT; ++colLoop) {
                        _loop_3(colLoop);
                    }
                    if (notEmptyColCount < COL_COUNT) {
                        return "continue";
                    }
                    ++thisLineMannerIndex;
                    if (!DEBUG.COUNT_LINES_ONLY) {
                        countByLines(HORIZONTAL_LINE_ARRAY, VERTICAL_LINE_ARRAY, EMPTY_CELL_POSITOIN_ARRAY);
                    }
                };
                for (var i = 0; i < COUNT; ++i) {
                    _loop_1(i);
                }
                cubeCore_ts_1.showUsedTime("\ncountMiddleCube(" + ROW_COUNT + "), 2 ^ (" + HORIZONTAL_LINE_COUNT + " + " + VERTICAL_LINE_COUNT + ") = " + COUNT + " => " + thisLineMannerIndex);
                // countMiddleCube(2), 2 ^ (5 + 8) = 8192 => 6902, used 548.48 milliseconds, or 0.548 seconds
                // countMiddleCube(3), 2 ^ (10 + 12) = 4194304 => 4036248, used 603169.41 milliseconds, or 603.169 seconds, or 10.1 minutes,
            }
            function prepareJoinCellToCube(HORIZONTAL_LINE_ARRAY, VERTICAL_LINE_ARRAY, cube, rowIndex, colIndex, addOrder, isCoreCell) {
                if (isCoreCell === void 0) { isCoreCell = false; }
                var cells = cube.cells;
                // 	<en_us>en_us</en_us>
                // 	<zh_cn>如已添加，则返回null</zh_cn>
                // 	<zh_tw>zh_tw</zh_tw>
                var CELL = cells[rowIndex][colIndex];
                if (CELL.feature !== cubeCore_ts_1.CellFeature.Unknown) {
                    return null;
                }
                var TOP_LINE_INDEX = COL_COUNT * (rowIndex - 1) + colIndex;
                var LEFT_LINE_INDEX = MAX_COL_INDEX * rowIndex + colIndex - 1;
                var gridLines = [
                    rowIndex === 0
                        ? cubeCore_ts_1.CellBorderLine.OuterLine
                        : HORIZONTAL_LINE_ARRAY[TOP_LINE_INDEX],
                    colIndex === MAX_COL_INDEX
                        ? cubeCore_ts_1.CellBorderLine.OuterLine
                        : VERTICAL_LINE_ARRAY[LEFT_LINE_INDEX + 1],
                    rowIndex === MAX_ROW_INDEX
                        ? cubeCore_ts_1.CellBorderLine.OuterLine
                        : HORIZONTAL_LINE_ARRAY[TOP_LINE_INDEX + COL_COUNT],
                    colIndex === 0
                        ? cubeCore_ts_1.CellBorderLine.OuterLine
                        : VERTICAL_LINE_ARRAY[LEFT_LINE_INDEX],
                ];
                if (gridLines.filter(function (line) {
                    return line === cubeCore_ts_1.CellBorderLine.OuterLine || line === cubeCore_ts_1.CellBorderLine.CutLine;
                }).length === 4) {
                    return null;
                }
                var RELATION_CELL_ADD_ORDER = addOrder - 1;
                var relatedInformationWhenAdding = {
                    rowIndex: -1,
                    colIndex: -1,
                    relation: cubeCore_ts_1.ConnectionRelation.Top
                };
                // 	<en_us>en_us</en_us>
                // 	<zh_cn>检查若添加进去，是否会冲突</zh_cn>
                // 	<zh_tw>zh_tw</zh_tw>
                var sixFaceTwentyFourAngle = cubeCore_ts_1.SixFaceTwentyFourAngle.UpOriginal;
                var twelveEdge = cubeCore_ts_1.TwelveEdge.NotSure;
                var hasError = false;
                var relationCellCount = 0;
                // 	<en_us>en_us</en_us>
                // 	<zh_cn>故意交换顺序</zh_cn>
                // 	<zh_tw>zh_tw</zh_tw>
                [gridLines[2], gridLines[3], gridLines[0], gridLines[1]].forEach(function (_line, relation) {
                    if (hasError) {
                        return;
                    }
                    var RELATION_CELL_ROW_INDEX = rowIndex +
                        (relation % 2 === 0 ? 1 - relation : 0);
                    if (RELATION_CELL_ROW_INDEX < 0 ||
                        RELATION_CELL_ROW_INDEX > MAX_ROW_INDEX) {
                        return;
                    }
                    var RELATION_CELL_COL_INDEX = (relation % 2 === 0 ? 0 : relation - 2) + colIndex;
                    if (RELATION_CELL_COL_INDEX < 0 ||
                        RELATION_CELL_COL_INDEX > MAX_COL_INDEX) {
                        return;
                    }
                    var oldCell = cells[RELATION_CELL_ROW_INDEX][RELATION_CELL_COL_INDEX];
                    if (oldCell.feature === cubeCore_ts_1.CellFeature.Unknown ||
                        oldCell.borderLines[relation] !== cubeCore_ts_1.CellBorderLine.InnerLine) {
                        return;
                    }
                    var OLD_CELL_SIX_FACE_TWENTY_FOUR_ANGLE = oldCell.sixFaceTwentyFourAngle;
                    if (oldCell.addOrder === RELATION_CELL_ADD_ORDER) {
                        relatedInformationWhenAdding.rowIndex = oldCell.rowIndex;
                        relatedInformationWhenAdding.colIndex = oldCell.colIndex;
                        relatedInformationWhenAdding.relation = relation;
                        twelveEdge = cubeCore_ts_1.getSixFaceTwentyFourAngleRelationTwelveEdge(OLD_CELL_SIX_FACE_TWENTY_FOUR_ANGLE, relation);
                    }
                    ++relationCellCount;
                    var currentSixFaceTwentyFourAngle = cubeCore_ts_1.SIX_FACE_AND_DIRECTION_RELATIONS[OLD_CELL_SIX_FACE_TWENTY_FOUR_ANGLE][relation];
                    if (relationCellCount === 1) {
                        sixFaceTwentyFourAngle = currentSixFaceTwentyFourAngle;
                        return;
                    }
                    if (sixFaceTwentyFourAngle !== currentSixFaceTwentyFourAngle) {
                        hasError = true;
                    }
                });
                if (!isCoreCell && relatedInformationWhenAdding.rowIndex === -1) {
                    return null;
                }
                return {
                    failed: hasError,
                    rowIndex: rowIndex,
                    colIndex: colIndex,
                    gridLines: gridLines,
                    relatedInformationWhenAdding: relatedInformationWhenAdding,
                    sixFaceTwentyFourAngle: sixFaceTwentyFourAngle,
                    twelveEdge: twelveEdge
                };
            }
            function countByLines(HORIZONTAL_LINE_ARRAY, VERTICAL_LINE_ARRAY, EMPTY_CELL_POSITOIN_ARRAY) {
                var _loop_4 = function (coreColLoop) {
                    var coreColIndex = CORE_COL_INDEX_ORDER_ARRAY[coreColLoop];
                    if (EMPTY_CELL_POSITOIN_ARRAY.filter(function (_a) {
                        var rowIndex = _a[0], colIndex = _a[1];
                        rowIndex === CORE_ROW_INDEX && colIndex === coreColIndex;
                    }).length) {
                        return "continue-LABLE_OUTER_LOOP";
                    }
                    CORE_COL_INDEX = coreColIndex;
                    var cube = new cubeCore_ts_1.SimpleCube(ROW_COUNT, COL_COUNT);
                    var NEXT_CELL_POSITION_ARRAY = [];
                    var CORE_CELL_INFO = prepareJoinCellToCube(HORIZONTAL_LINE_ARRAY, VERTICAL_LINE_ARRAY, cube, CORE_ROW_INDEX, CORE_COL_INDEX, 1, true);
                    if (CORE_CELL_INFO === null) {
                        return "continue-LABLE_OUTER_LOOP";
                    }
                    // log(`core cell is ok: ${coreColIndex}, ${JSON.stringify(CORE_CELL_INFO)}`);
                    NEXT_CELL_POSITION_ARRAY.push(CORE_CELL_INFO);
                    var _loop_5 = function (addOrder) {
                        if (!NEXT_CELL_POSITION_ARRAY.length && addOrder > 1) {
                            if (DEBUG.SHOW_CUBE_WHEN_OK_IN_COUNT_BY_LINES) {
                                cubeCore_ts_1.log("\nok: " + addOrder + ", core: " + CORE_ROW_INDEX + CORE_COL_INDEX + "\t" + HORIZONTAL_LINE_ARRAY.join("") + "\t" + VERTICAL_LINE_ARRAY.join("") + " => cells count: " + cube.cells.map(function (row) {
                                    return row.filter(function (cell) { return cell.feature === cubeCore_ts_1.CellFeature.Face; })
                                        .map(function (cell) { return "1"; }).join("");
                                }).join("").length + "\n" + cube.cells.map(function (row) {
                                    return row.filter(function (cell) { return cell.feature === cubeCore_ts_1.CellFeature.Face; })
                                        .map(function (cell) {
                                        return cell.addOrder + ": " + cell.rowIndex + cell.colIndex + "\t" + cell.borderLines.join("") + "\t(" + (cell.relatedInformationWhenAdding.rowIndex === -1
                                            ? " "
                                            : cell.relatedInformationWhenAdding.rowIndex) + "," + (cell.relatedInformationWhenAdding.colIndex === -1
                                            ? " "
                                            : cell.relatedInformationWhenAdding.colIndex) + ") " + cell.relatedInformationWhenAdding.relation + "\t" + cell.sixFace + "+" + cell.faceDirection.toString().padStart(3, " ") + cell.twelveEdge.toString().padStart(3, " ") + cell.sixFaceTwentyFourAngle.toString().padStart(3, " ");
                                    }).join("\n");
                                }).join("\n"));
                            }
                            cube.count();
                            if (cube.isValid) {
                                countAndPushIfOk(cube);
                                return { value: void 0 };
                            }
                            else {
                                return "continue-LABLE_OUTER_LOOP";
                            }
                        }
                        if (NEXT_CELL_POSITION_ARRAY.filter(function (item) { return item.failed; }).length) {
                            return "continue-LABLE_OUTER_LOOP";
                        }
                        NEXT_CELL_POSITION_ARRAY.forEach(function (_a) {
                            var rowIndex = _a.rowIndex, colIndex = _a.colIndex, gridLines = _a.gridLines, relatedInformationWhenAdding = _a.relatedInformationWhenAdding, sixFaceTwentyFourAngle = _a.sixFaceTwentyFourAngle, twelveEdge = _a.twelveEdge;
                            var cell = cube.cells[rowIndex][colIndex];
                            cell.addOrder = addOrder;
                            gridLines.forEach(function (value, index) {
                                return cell.borderLines[index] = value;
                            });
                            cell.feature = cubeCore_ts_1.CellFeature.Face;
                            var _b = cubeCore_ts_1.convertSixFaceTwentyFourAngleToSixFaceAndDirection(sixFaceTwentyFourAngle), sixFace = _b[0], faceDirection = _b[1];
                            cell.sixFace = sixFace;
                            cell.faceDirection = faceDirection;
                            cell.twelveEdge = twelveEdge;
                            cell.relatedInformationWhenAdding.rowIndex =
                                relatedInformationWhenAdding.rowIndex;
                            cell.relatedInformationWhenAdding.colIndex =
                                relatedInformationWhenAdding.colIndex;
                            cell.relatedInformationWhenAdding.relation =
                                relatedInformationWhenAdding.relation;
                        });
                        NEXT_CELL_POSITION_ARRAY.length = 0;
                        var _loop_6 = function (rowIndex) {
                            var _loop_7 = function (colIndex) {
                                if (EMPTY_CELL_POSITOIN_ARRAY.filter(function (_a) {
                                    var emptyRowIndex = _a[0], emptyColIndex = _a[1];
                                    return emptyRowIndex === rowIndex && emptyColIndex === colIndex;
                                })
                                    .length) {
                                    return "continue";
                                }
                                var result = prepareJoinCellToCube(HORIZONTAL_LINE_ARRAY, VERTICAL_LINE_ARRAY, cube, rowIndex, colIndex, addOrder + 1);
                                if (result !== null) {
                                    NEXT_CELL_POSITION_ARRAY.push(result);
                                }
                            };
                            for (var colIndex = 0; colIndex < COL_COUNT; ++colIndex) {
                                _loop_7(colIndex);
                            }
                        };
                        for (var rowIndex = 0; rowIndex < ROW_COUNT; ++rowIndex) {
                            _loop_6(rowIndex);
                        }
                    };
                    for (var addOrder = 1; addOrder < CELL_COUNT; ++addOrder) {
                        var state_2 = _loop_5(addOrder);
                        if (typeof state_2 === "object")
                            return state_2;
                        switch (state_2) {
                            case "continue-LABLE_OUTER_LOOP": return state_2;
                        }
                    }
                };
                LABLE_OUTER_LOOP: for (var coreColLoop = 0; coreColLoop < 5; ++coreColLoop) {
                    var state_1 = _loop_4(coreColLoop);
                    if (typeof state_1 === "object")
                        return state_1.value;
                    switch (state_1) {
                        case "continue-LABLE_OUTER_LOOP": continue LABLE_OUTER_LOOP;
                    }
                }
            }
            // let lastCutManner = "";
            // const ITEM_COUNT_PER_OUTPUT = 10240;
            // const CUT_MANNER_TO_MIDDLE_CUBE_NO_FILE_CONTENT_ARRAY: string[] = [];
            // const CUT_MANNER_TO_MIDDLE_CUBE_NO_FILENAME: string =
            //   `${GOAL_FILE_TOP_PATH}cutMannerToMiddleCubeNo.txt`;
            // function addCutMannerToMiddleCubeNoFileContent(content: string) {
            //   CUT_MANNER_TO_MIDDLE_CUBE_NO_FILE_CONTENT_ARRAY.push(content);
            //   if (
            //     CUT_MANNER_TO_MIDDLE_CUBE_NO_FILE_CONTENT_ARRAY.length >
            //       ITEM_COUNT_PER_OUTPUT
            //   ) {
            //     appendCutMannerToMiddleCubeNoFileContent();
            //   }
            // }
            // function appendCutMannerToMiddleCubeNoFileContent() {
            //   if (!CUT_MANNER_TO_MIDDLE_CUBE_NO_FILE_CONTENT_ARRAY.length) {
            //     return;
            //   }
            //   Deno.writeTextFileSync(
            //     CUT_MANNER_TO_MIDDLE_CUBE_NO_FILENAME,
            //     CUT_MANNER_TO_MIDDLE_CUBE_NO_FILE_CONTENT_ARRAY.join("\n").concat(
            //       "\n",
            //     ),
            //     APPEND_TRUE_FLAG,
            //   );
            //   CUT_MANNER_TO_MIDDLE_CUBE_NO_FILE_CONTENT_ARRAY.length = 0;
            // }
            function done() {
                mod_ts_1.ensureDirSync(GOAL_FILE_PATH);
                mod_ts_1.emptyDirSync(GOAL_FILE_PATH);
                countMiddleCube();
                dealMiddleCubes();
                // appendCutMannerToMiddleCubeNoFileContent();
                totalMiddleCubeCount += thisMiddleCubeCount;
            }
            done();
        }
        countMiddleCubes();
        cubeCore_ts_1.showUsedTime("after countMiddleCubes() " + GOAL_FILE_PATH);
        cubeCore_ts_1.log({
            totalMiddleCubeCount: totalMiddleCubeCount,
            global_removed_middle_cube_count: cubeCore_ts_1.global_removed_middle_cube_count,
            thisMiddleCubeCount: thisMiddleCubeCount,
            MIDDLE_CUBE_COUNT_ARRAY: MIDDLE_CUBE_COUNT_ARRAY,
            thisLineMannerCount: thisLineMannerCount,
            thisLineMannerIndex: thisLineMannerIndex,
            CUT_MANNER_COUNT_ARRAY: CUT_MANNER_COUNT_ARRAY,
            CUT_MANNER_ARRAY_LENGTH: CUT_MANNER_ARRAY.length
        });
    }
    // countByRowCount(2);
    // countByRowCount(3);
    // countByRowCount(4);
    // countByRowCount(5);
    ROW_COUNT_ARRAY.forEach(function (rowCount) { return countByRowCount(rowCount); });
    if (cubeCore_ts_1.global_removed_middle_cube_count) {
        cubeCore_ts_1.log("removed middle cube count:", cubeCore_ts_1.global_removed_middle_cube_count);
    }
    if (DEBUG.SHOW_CUT_MANNERS) {
        Deno.writeTextFileSync("" + GOAL_FILE_TOP_PATH + DEBUG_FILE_PREFIX + "cutMannerArray.ts", "export const cutMannerArray = " + JSON.stringify(CUT_MANNER_ARRAY) + ";");
        Deno.writeTextFileSync("" + GOAL_FILE_TOP_PATH + DEBUG_FILE_PREFIX + "cutMannerCountArray.ts", "export const cutMannerCountArray = " + JSON.stringify(CUT_MANNER_COUNT_ARRAY) + ";");
        cubeCore_ts_1.log("CUT_MANNER_ARRAY.length:", CUT_MANNER_ARRAY.length);
        cubeCore_ts_1.log("CUT_MANNER_COUNT_ARRAY:", CUT_MANNER_COUNT_ARRAY);
    }
    if (OUTPUT_CUT_MANNERS_ROW_BY_ROW) {
        Deno.writeTextFileSync("" + GOAL_FILE_TOP_PATH + DEBUG_FILE_PREFIX + "cutManners.txt", CUT_MANNER_ARRAY.join("\n"));
    }
    cubeCore_ts_1.showUsedTime("end");
    cubeCore_ts_1.log("end: " + (new Date()).toLocaleString());
    cubeCore_ts_1.logUsedTime(STEP_FLAG + ": Total", performance.now() - DATE_BEGIN);
    mod_ts_1.copySync(LOG_FILE_NAME, "log_" + STEP_FLAG + ".txt", OVER_WRITE_TRUE_FLAG);
    mod_ts_1.copySync(LOG_FILE_NAME, GOAL_FILE_TOP_PATH + "log" + logFilenamePostfix + ".txt", OVER_WRITE_TRUE_FLAG);
    Deno.removeSync(LOG_FILE_NAME);
}
function step2(ROW_COUNT_ARRAY, GOAL_FILE_TOP_PATH, SOURCE_FILE_TOP_PATH, OUTPUT_ALONE_FIRST_CUBE, OUTPUT_CUBE_PASS_CHECK_FACES_LAYER_INDEX, OUTPUT_FIX_HIDDEN_PIECES_DETAILS, OUTPUT_FIX_HIDDEN_PIECES, OUTPUT_MIDDLE_CUBE_TO_FIRST_NO, OUTPUT_CHECK_FACES_LAYER_INDEX_FAILED, OUTPUT_FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT, OUTPUT_FIX_LONELY_FACE_OF_CUBE) {
    if (GOAL_FILE_TOP_PATH === void 0) { GOAL_FILE_TOP_PATH = "./"; }
    if (SOURCE_FILE_TOP_PATH === void 0) { SOURCE_FILE_TOP_PATH = "./"; }
    if (OUTPUT_ALONE_FIRST_CUBE === void 0) { OUTPUT_ALONE_FIRST_CUBE = false; }
    if (OUTPUT_CUBE_PASS_CHECK_FACES_LAYER_INDEX === void 0) { OUTPUT_CUBE_PASS_CHECK_FACES_LAYER_INDEX = false; }
    if (OUTPUT_FIX_HIDDEN_PIECES_DETAILS === void 0) { OUTPUT_FIX_HIDDEN_PIECES_DETAILS = false; }
    if (OUTPUT_FIX_HIDDEN_PIECES === void 0) { OUTPUT_FIX_HIDDEN_PIECES = false; }
    if (OUTPUT_MIDDLE_CUBE_TO_FIRST_NO === void 0) { OUTPUT_MIDDLE_CUBE_TO_FIRST_NO = false; }
    if (OUTPUT_CHECK_FACES_LAYER_INDEX_FAILED === void 0) { OUTPUT_CHECK_FACES_LAYER_INDEX_FAILED = false; }
    if (OUTPUT_FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT === void 0) { OUTPUT_FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT = false; }
    if (OUTPUT_FIX_LONELY_FACE_OF_CUBE === void 0) { OUTPUT_FIX_LONELY_FACE_OF_CUBE = false; }
    return __awaiter(this, void 0, void 0, function () {
        function appendFile(middleFileKind) {
            var CONTENT_ARRAY = MIDDLE_FILE_CONTENT_ARRAY[middleFileKind];
            if (!CONTENT_ARRAY.length) {
                return;
            }
            var FILENAME = MIDDLE_FILENAME_ARRAY[middleFileKind];
            Deno.writeTextFileSync(FILENAME, CONTENT_ARRAY.join("\n").concat("\n"), APPEND_TRUE_FLAG);
            CONTENT_ARRAY.length = 0;
        }
        var STEP_FLAG, logFilenamePostfix, GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH, DEBUG_FILE_PREFIX, DATE_BEGIN, ALONE_FIRST_CUBE_PATH, fixHiddenPiecesFileNo, FIX_HIDDEN_PIECES_DETAILS_PATH, CUBE_PASSED_CHECK_FACES_LAYER_INDEX_PATH, cubePassCheckFacesLayerIndexFileNo, GOAL_CUBE_FILE_PATH, CHECK_FACES_LAYER_INDEX_FAILED_FILENAME, FIX_LONELY_FACE_OF_CUBE_FILENAME, FIX_HIDDEN_PIECES_FILENAME, FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT_FILENAME, MIDDLE_CUBE_TO_FIRST_NO_FILENAME, MIDDLE_FILENAME_ARRAY, CHECK_FACES_LAYER_INDEX_FAILED_FILE_CONTENT_ARRAY, FIX_LONELY_FACE_OF_CUBE_FILE_CONTENT_ARRAY, FIX_HIDDEN_PIECES_FILE_CONTENT_ARRAY, FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT_FILE_CONTENT_ARRAY, MIDDLE_CUBE_TO_FIRST_NO_FILE_CONTENT_ARRAY, MIDDLE_FILE_CONTENT_ARRAY, MiddleFileKind, LAST_MIDDLE_CUBE_NO_ARRAY, MIDDLE_FILE_KIND_COUNT, middleFileKindIndex, FILENAME, CUBE_NO_STEP, DEBUG, middleFileKindIndex;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    STEP_FLAG = "step2";
                    logFilenamePostfix = "";
                    logFilenamePostfix = "_" + STEP_FLAG;
                    GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH = GOAL_FILE_TOP_PATH.replace(/[.\/\\]/g, "").length;
                    DEBUG_FILE_PREFIX = GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH
                        ? ""
                        : STEP_FLAG.concat("_");
                    if (GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH) {
                        mod_ts_1.ensureDirSync(GOAL_FILE_TOP_PATH);
                        mod_ts_1.emptyDirSync(GOAL_FILE_TOP_PATH);
                    }
                    cubeCore_ts_1.log("begin: " + (new Date()).toLocaleString());
                    DATE_BEGIN = performance.now();
                    ALONE_FIRST_CUBE_PATH = GOAL_FILE_TOP_PATH + "29_aloneFirstCube/";
                    if (OUTPUT_ALONE_FIRST_CUBE) {
                        mod_ts_1.ensureDirSync(ALONE_FIRST_CUBE_PATH);
                        mod_ts_1.emptyDirSync(ALONE_FIRST_CUBE_PATH);
                    }
                    fixHiddenPiecesFileNo = 0;
                    FIX_HIDDEN_PIECES_DETAILS_PATH = GOAL_FILE_TOP_PATH + "22_fixHiddenPiecesDetails/";
                    if (OUTPUT_FIX_HIDDEN_PIECES_DETAILS) {
                        mod_ts_1.ensureDirSync(FIX_HIDDEN_PIECES_DETAILS_PATH);
                        mod_ts_1.emptyDirSync(FIX_HIDDEN_PIECES_DETAILS_PATH);
                    }
                    CUBE_PASSED_CHECK_FACES_LAYER_INDEX_PATH = GOAL_FILE_TOP_PATH + "21_cubePassedCheckFacesLayerIndex/";
                    if (OUTPUT_CUBE_PASS_CHECK_FACES_LAYER_INDEX) {
                        mod_ts_1.ensureDirSync(CUBE_PASSED_CHECK_FACES_LAYER_INDEX_PATH);
                        mod_ts_1.emptyDirSync(CUBE_PASSED_CHECK_FACES_LAYER_INDEX_PATH);
                    }
                    cubePassCheckFacesLayerIndexFileNo = 0;
                    GOAL_CUBE_FILE_PATH = GOAL_FILE_TOP_PATH + "cubesOnlyFirstOfTwentyFour/";
                    mod_ts_1.ensureDirSync(GOAL_CUBE_FILE_PATH);
                    mod_ts_1.emptyDirSync(GOAL_CUBE_FILE_PATH);
                    CHECK_FACES_LAYER_INDEX_FAILED_FILENAME = "" + GOAL_FILE_TOP_PATH + DEBUG_FILE_PREFIX + "checkFacesLayerIndexFailed.txt";
                    FIX_LONELY_FACE_OF_CUBE_FILENAME = "" + GOAL_FILE_TOP_PATH + DEBUG_FILE_PREFIX + "fixLonelyFaceOfCube.txt";
                    FIX_HIDDEN_PIECES_FILENAME = "" + GOAL_FILE_TOP_PATH + DEBUG_FILE_PREFIX + "fixHiddenPieces.txt";
                    FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT_FILENAME = "" + GOAL_FILE_TOP_PATH + DEBUG_FILE_PREFIX + "fixLonelyFaceOfCubeAndAppendIt.txt";
                    MIDDLE_CUBE_TO_FIRST_NO_FILENAME = "" + GOAL_FILE_TOP_PATH + DEBUG_FILE_PREFIX + "middleCubeToFirstNo.txt";
                    MIDDLE_FILENAME_ARRAY = [
                        CHECK_FACES_LAYER_INDEX_FAILED_FILENAME,
                        FIX_LONELY_FACE_OF_CUBE_FILENAME,
                        FIX_HIDDEN_PIECES_FILENAME,
                        FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT_FILENAME,
                        MIDDLE_CUBE_TO_FIRST_NO_FILENAME,
                    ];
                    CHECK_FACES_LAYER_INDEX_FAILED_FILE_CONTENT_ARRAY = [];
                    FIX_LONELY_FACE_OF_CUBE_FILE_CONTENT_ARRAY = [];
                    FIX_HIDDEN_PIECES_FILE_CONTENT_ARRAY = [];
                    FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT_FILE_CONTENT_ARRAY = [];
                    MIDDLE_CUBE_TO_FIRST_NO_FILE_CONTENT_ARRAY = [];
                    MIDDLE_FILE_CONTENT_ARRAY = [
                        CHECK_FACES_LAYER_INDEX_FAILED_FILE_CONTENT_ARRAY,
                        FIX_LONELY_FACE_OF_CUBE_FILE_CONTENT_ARRAY,
                        FIX_HIDDEN_PIECES_FILE_CONTENT_ARRAY,
                        FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT_FILE_CONTENT_ARRAY,
                        MIDDLE_CUBE_TO_FIRST_NO_FILE_CONTENT_ARRAY,
                    ];
                    (function (MiddleFileKind) {
                        MiddleFileKind[MiddleFileKind["CheckFacesLayerIndexFailed"] = 0] = "CheckFacesLayerIndexFailed";
                        MiddleFileKind[MiddleFileKind["FixLonelyFaceOfCube"] = 1] = "FixLonelyFaceOfCube";
                        MiddleFileKind[MiddleFileKind["FixHiddenPieces"] = 2] = "FixHiddenPieces";
                        MiddleFileKind[MiddleFileKind["FixLonelyFaceOfCubeAndAppendIt"] = 3] = "FixLonelyFaceOfCubeAndAppendIt";
                        MiddleFileKind[MiddleFileKind["MiddleCubeToFirstNo"] = 4] = "MiddleCubeToFirstNo";
                    })(MiddleFileKind || (MiddleFileKind = {}));
                    LAST_MIDDLE_CUBE_NO_ARRAY = [0, 0, 0, 0, 0];
                    MIDDLE_FILE_KIND_COUNT = LAST_MIDDLE_CUBE_NO_ARRAY.length;
                    for (middleFileKindIndex = 0; middleFileKindIndex < MIDDLE_FILE_KIND_COUNT; ++middleFileKindIndex) {
                        FILENAME = MIDDLE_FILENAME_ARRAY[middleFileKindIndex];
                        if (mod_ts_1.existsSync(FILENAME)) {
                            Deno.removeSync(FILENAME);
                        }
                    }
                    CUBE_NO_STEP = 24;
                    DEBUG = {
                        // false true
                        CUBE_COUNT_PER_FILE: 10240,
                        // Too big: OUTPUT_ROW_COUNT_PER_TIME: 204800,
                        OUTPUT_ROW_COUNT_PER_TIME: 20480,
                        SHOW_MIDDLE_CUBE_CONVERT_INFO: false
                    };
                    return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                            function appendContent(content, middleFileKind) {
                                var CONTENT_ARRAY = MIDDLE_FILE_CONTENT_ARRAY[middleFileKind];
                                if (LAST_MIDDLE_CUBE_NO_ARRAY[middleFileKind] !== currentMiddleCubeNo) {
                                    CONTENT_ARRAY.push(currentMiddleCubeInfo);
                                    LAST_MIDDLE_CUBE_NO_ARRAY[middleFileKind] = currentMiddleCubeNo;
                                }
                                CONTENT_ARRAY.push(content);
                                var COUNT = CONTENT_ARRAY.length;
                                if (COUNT >= DEBUG.OUTPUT_ROW_COUNT_PER_TIME) {
                                    appendFile(middleFileKind);
                                }
                            }
                            function batchAppendCube(cubeOriginal) {
                                // currentMiddleCubeInfo = `\n\nbatchAppendCube(), cubeOriginal: \n${
                                //   JSON.stringify(cubeOriginal)
                                // }\n`;
                                currentMiddleCubeNo = cubeOriginal.no;
                                currentMiddleCubeInfo = "batchAppendCube(" + currentMiddleCubeNo + "):";
                                // 同一纸模不同折叠与粘贴方案
                                // 暂时忽略格与格之间的互相影响（比如某些面放到上面后，一些关联面的层也会上移，而另一些关联面则会被自动隐藏
                                // TODO(@anqi) 如可能，应用上述物理规律
                                var upFaceOptionalMannerArray = [];
                                var downFaceOptionalMannerArray = [];
                                var leftFaceOptionalMannerArray = [];
                                var rightFaceOptionalMannerArray = [];
                                var frontFaceOptionalMannerArray = [];
                                var backFaceOptionalMannerArray = [];
                                var faceOptionalMannerArrayArray = [
                                    upFaceOptionalMannerArray,
                                    downFaceOptionalMannerArray,
                                    leftFaceOptionalMannerArray,
                                    rightFaceOptionalMannerArray,
                                    frontFaceOptionalMannerArray,
                                    backFaceOptionalMannerArray,
                                ];
                                var upFaceOptionalPieceArray = [];
                                var downFaceOptionalPieceArray = [];
                                var leftFaceOptionalPieceArray = [];
                                var rightFaceOptionalPieceArray = [];
                                var frontFaceOptionalPieceArray = [];
                                var backFaceOptionalPieceArray = [];
                                var faceOptionalPieceArrayArray = [
                                    upFaceOptionalPieceArray,
                                    downFaceOptionalPieceArray,
                                    leftFaceOptionalPieceArray,
                                    rightFaceOptionalPieceArray,
                                    frontFaceOptionalPieceArray,
                                    backFaceOptionalPieceArray,
                                ];
                                faceOptionalPieceArrayArray.forEach(function (array) {
                                    for (var i = 0; i < 4; ++i) {
                                        array.push([]);
                                    }
                                });
                                var twentyFourAngelFaceOrPieceArray = [];
                                for (var index = 0; index < cubeCore_ts_1.ANGLE_COUNT; ++index) {
                                    twentyFourAngelFaceOrPieceArray.push({ faces: [], pieces: [] });
                                }
                                cubeOriginal.actCells.forEach(function (cell) {
                                    var rowIndex = cell.rowIndex, colIndex = cell.colIndex, borderLines = cell.borderLines, sixFace = cell.sixFace, faceDirection = cell.faceDirection, twelveEdge = cell.twelveEdge;
                                    var TWENTY_FOUR_ANGLE = cubeCore_ts_1.convertSixFaceAndDirectionToSixFaceTwentyFourAngle(sixFace, faceDirection);
                                    var ITEM = twentyFourAngelFaceOrPieceArray[TWENTY_FOUR_ANGLE];
                                    var cellRowColIndex = [rowIndex, colIndex];
                                    switch (borderLines.filter(function (borderLine) {
                                        return borderLine === cubeCore_ts_1.CellBorderLine.InnerLine;
                                    })
                                        .length) {
                                        case 2:
                                        case 3:
                                        case 4:
                                            ITEM.faces.push(cellRowColIndex);
                                            faceOptionalMannerArrayArray[sixFace].push(cellRowColIndex);
                                            break;
                                        case 1:
                                            ITEM.pieces.push(cellRowColIndex);
                                            faceOptionalPieceArrayArray[sixFace][twelveEdge % 4].push(cellRowColIndex);
                                            break;
                                        default:
                                            // unreachable
                                            break;
                                    }
                                });
                                faceOptionalMannerArrayArray.forEach(function (mannerArray, sixFace) {
                                    var _a = faceOptionalPieceArrayArray[sixFace], topFaceOptionalPieceArray = _a[0], rightFaceOptionalPieceArray = _a[1], bottomFaceOptionalPieceArray = _a[2], leftFaceOptionalPieceArray = _a[3];
                                    var array = [];
                                    if (topFaceOptionalPieceArray.length) {
                                        array.push(topFaceOptionalPieceArray);
                                    }
                                    if (rightFaceOptionalPieceArray.length) {
                                        array.push(rightFaceOptionalPieceArray);
                                    }
                                    if (bottomFaceOptionalPieceArray.length) {
                                        array.push(bottomFaceOptionalPieceArray);
                                    }
                                    if (leftFaceOptionalPieceArray.length) {
                                        array.push(leftFaceOptionalPieceArray);
                                    }
                                    while (array.length > 1) {
                                        var FIRST_ARRAY = array.splice(0, 1)[0];
                                        FIRST_ARRAY.forEach(function (firstCellRowColIndex) {
                                            var firstRowIndex = firstCellRowColIndex[0], firstColIndex = firstCellRowColIndex[1];
                                            array.forEach(function (subArray) {
                                                subArray.forEach(function (secondCellRowColIndex) {
                                                    var secondRowIndex = secondCellRowColIndex[0], secondColIndex = secondCellRowColIndex[1];
                                                    // 因粘贴顺序不同时，得到不同的方案，所以每组以不同顺序追加两次（类型TwoCellRowColIndex）
                                                    mannerArray.push([
                                                        firstRowIndex,
                                                        firstColIndex,
                                                        secondRowIndex,
                                                        secondColIndex,
                                                    ]);
                                                    mannerArray.push([
                                                        secondRowIndex,
                                                        secondColIndex,
                                                        firstRowIndex,
                                                        firstColIndex,
                                                    ]);
                                                });
                                            });
                                        });
                                    }
                                });
                                if (DEBUG.SHOW_MIDDLE_CUBE_CONVERT_INFO) {
                                    cubeCore_ts_1.log("\nconst faceOptionalPieceArrayMap = ");
                                    cubeCore_ts_1.log({
                                        upFaceOptionalPieceArray: upFaceOptionalPieceArray,
                                        downFaceOptionalPieceArray: downFaceOptionalPieceArray,
                                        leftFaceOptionalPieceArray: leftFaceOptionalPieceArray,
                                        rightFaceOptionalPieceArray: rightFaceOptionalPieceArray,
                                        frontFaceOptionalPieceArray: frontFaceOptionalPieceArray,
                                        backFaceOptionalPieceArray: backFaceOptionalPieceArray
                                    });
                                    cubeCore_ts_1.log(";");
                                    cubeCore_ts_1.log("\nconst faceOptionalMannerArrayMap = ");
                                    cubeCore_ts_1.log({
                                        upFaceOptionalMannerArray: upFaceOptionalMannerArray,
                                        downFaceOptionalMannerArray: downFaceOptionalMannerArray,
                                        leftFaceOptionalMannerArray: leftFaceOptionalMannerArray,
                                        rightFaceOptionalMannerArray: rightFaceOptionalMannerArray,
                                        frontFaceOptionalMannerArray: frontFaceOptionalMannerArray,
                                        backFaceOptionalMannerArray: backFaceOptionalMannerArray
                                    });
                                    cubeCore_ts_1.log(";");
                                }
                                // {
                                // 	let i = 0;
                                // 	upFaceOptionalMannerArray.forEach((upItem, upIndex) => {
                                // 	  downFaceOptionalMannerArray.forEach((downItem, downIndex) => {
                                // 		leftFaceOptionalMannerArray.forEach((leftItem, leftIndex) => {
                                // 		  rightFaceOptionalMannerArray.forEach((rightItem, rightIndex) => {
                                // 			frontFaceOptionalMannerArray.forEach((frontItem, frontIndex) => {
                                // 			  backFaceOptionalMannerArray.forEach((backItem, backIndex) => {
                                // 				++i;
                                // 				log(i, {
                                // 					upItem,
                                // 					downItem,
                                // 					leftItem,
                                // 					rightItem,
                                // 					frontItem,
                                // 					backItem,
                                // 				  },
                                // 				);
                                // 			  });
                                // 		    });
                                // 		});
                                // 	  });
                                // 	});
                                //   });
                                //   console.log('call times: ', i);
                                // }
                                // let times = 0;
                                // 以六面不同可能组合，得到不同的粘贴方案——暂时忽略面的层次对其它面的影响
                                upFaceOptionalMannerArray.forEach(function (upItem, upIndex) {
                                    downFaceOptionalMannerArray.forEach(function (downItem, downIndex) {
                                        leftFaceOptionalMannerArray.forEach(function (leftItem, leftIndex) {
                                            rightFaceOptionalMannerArray.forEach(function (rightItem, rightIndex) {
                                                frontFaceOptionalMannerArray.forEach(function (frontItem, frontIndex) {
                                                    backFaceOptionalMannerArray.forEach(function (backItem, backIndex) {
                                                        // ++times;
                                                        var cloned = cubeOriginal.clone();
                                                        // log(
                                                        //   "cloned",
                                                        //   {
                                                        //     upItem,
                                                        //     downItem,
                                                        //     leftItem,
                                                        //     rightItem,
                                                        //     frontItem,
                                                        //     backItem,
                                                        //   },
                                                        //   "cloned.sixFaces",
                                                        //   cloned.sixFaces,
                                                        //   "cubeOriginal.sixFaces",
                                                        //   cubeOriginal.sixFaces,
                                                        // );
                                                        // 通过六面及十二棱可用片，计算十二棱是否可插入
                                                        cloned.twelveEdges.forEach(function (twelveEdge) {
                                                            twelveEdge.canBeInserted = !!twelveEdge.pieces.length;
                                                        });
                                                        var twelveEdges = cloned.twelveEdges;
                                                        var cells = cloned.cells;
                                                        var sixFaceOutestCellArray = [];
                                                        [
                                                            [upFaceOptionalMannerArray, upItem, upIndex],
                                                            [downFaceOptionalMannerArray, downItem, downIndex],
                                                            [leftFaceOptionalMannerArray, leftItem, leftIndex],
                                                            [rightFaceOptionalMannerArray, rightItem, rightIndex],
                                                            [frontFaceOptionalMannerArray, frontItem, frontIndex],
                                                            [backFaceOptionalMannerArray, backItem, backIndex],
                                                        ].forEach(function (turpleArray, sixFaceIndex) {
                                                            // const [array, item, index] = turpleArray;
                                                            var array = turpleArray[0];
                                                            var item = turpleArray[1];
                                                            var index = turpleArray[2];
                                                            var USED_ROW_COL_INDEX = [];
                                                            var layerIndex = 0;
                                                            // array.slice(index, index + 1)
                                                            array.filter(function (_o, itemIndex) { return itemIndex !== index; })
                                                                .forEach(function (otherItem) {
                                                                var firstRowIndex = otherItem[0], firstColIndex = otherItem[1], secondRowIndex = otherItem[2], secondColIndex = otherItem[3];
                                                                var IS_FACE = typeof secondRowIndex === "undefined" ||
                                                                    typeof secondColIndex === "undefined";
                                                                var FIRST_ROW_COL_INDEX = firstRowIndex + "_" + firstColIndex;
                                                                if (USED_ROW_COL_INDEX.indexOf(FIRST_ROW_COL_INDEX) ===
                                                                    -1) {
                                                                    USED_ROW_COL_INDEX.push(FIRST_ROW_COL_INDEX);
                                                                    cloned.cells[firstRowIndex][firstColIndex]
                                                                        .layerIndex = ++layerIndex;
                                                                }
                                                                if (!IS_FACE) {
                                                                    var SECOND_ROW_COL_INDEX = secondRowIndex + "_" + secondColIndex;
                                                                    if (USED_ROW_COL_INDEX.indexOf(SECOND_ROW_COL_INDEX) ===
                                                                        -1) {
                                                                        USED_ROW_COL_INDEX.push(SECOND_ROW_COL_INDEX);
                                                                        cloned.cells[secondRowIndex][secondColIndex]
                                                                            .layerIndex = ++layerIndex;
                                                                    }
                                                                    cloned.sixFaces[sixFaceIndex].push(__spreadArrays(otherItem));
                                                                }
                                                            });
                                                            // const [firstRowIndex, firstColIndex, secondRowIndex, secondColIndex] =
                                                            // 	item as OneOrTwoCellRowColIndex;
                                                            var firstRowIndex = item[0], firstColIndex = item[1], secondRowIndex = item[2], secondColIndex = item[3];
                                                            var IS_FACE = typeof secondRowIndex === "undefined" ||
                                                                typeof secondColIndex === "undefined";
                                                            var FIRST_ROW_COL_INDEX = firstRowIndex + "_" + firstColIndex;
                                                            if (USED_ROW_COL_INDEX.indexOf(FIRST_ROW_COL_INDEX) === -1) {
                                                                USED_ROW_COL_INDEX.push(FIRST_ROW_COL_INDEX);
                                                                cloned.cells[firstRowIndex][firstColIndex].layerIndex =
                                                                    ++layerIndex;
                                                            }
                                                            if (!IS_FACE) {
                                                                var SECOND_ROW_COL_INDEX = secondRowIndex + "_" + secondColIndex;
                                                                if (USED_ROW_COL_INDEX.indexOf(SECOND_ROW_COL_INDEX) === -1) {
                                                                    USED_ROW_COL_INDEX.push(SECOND_ROW_COL_INDEX);
                                                                    cloned.cells[secondRowIndex][secondColIndex]
                                                                        .layerIndex = ++layerIndex;
                                                                }
                                                                sixFaceOutestCellArray.push(cloned.cells[secondRowIndex][secondColIndex]);
                                                                twelveEdges.forEach(function (edge) {
                                                                    removeFromPieces(firstRowIndex, firstColIndex);
                                                                    removeFromPieces(secondRowIndex, secondColIndex);
                                                                    function removeFromPieces(findRowIndex, findColIndex) {
                                                                        var position = -1;
                                                                        edge.pieces.forEach(function (_a, pieceIndex) {
                                                                            var pieceRowIndex = _a[0], pieceColIndex = _a[1];
                                                                            if (findRowIndex === pieceRowIndex &&
                                                                                findColIndex === pieceColIndex) {
                                                                                position = pieceIndex;
                                                                            }
                                                                        });
                                                                        if (position > -1) {
                                                                            cells[findRowIndex][findColIndex].feature =
                                                                                cubeCore_ts_1.CellFeature.Face;
                                                                            edge.pieces.splice(position, 1);
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                            else {
                                                                sixFaceOutestCellArray.push(cloned.cells[firstRowIndex][firstColIndex]);
                                                            }
                                                        });
                                                        // let upLayerIndex = 0;
                                                        // let downLayerIndex = 0;
                                                        // let leftLayerIndex = 0;
                                                        // let rightLayerIndex = 0;
                                                        // let frontLayerIndex = 0;
                                                        // let backLayerIndex = 0;
                                                        // const [
                                                        //   upFaceOutestCell,
                                                        //   downFaceOutestCell,
                                                        //   leftFaceOutestCell,
                                                        //   rightFaceOutestCell,
                                                        //   frontFaceOutestCell,
                                                        //   backFaceOutestCell,
                                                        // ] = sixFaceOutestCellArray;
                                                        // const sixFaceTwentyFourAngleOfSixFaceOutestCellArray:
                                                        //   SixFaceTwentyFourAngle[] = [];
                                                        // sixFaceOutestCellArray.forEach((cell) => {
                                                        //   sixFaceTwentyFourAngleOfSixFaceOutestCellArray.push(
                                                        //     convertSixFaceAndDirectionToSixFaceTwentyFourAngle(
                                                        //       cell.sixFace,
                                                        //       cell.faceDirection,
                                                        //     ),
                                                        //   );
                                                        // });
                                                        // // const [
                                                        // // 	upFaceOutestCellSixFaceTwentyFourAngle,
                                                        // // 	downFaceOutestCellSixFaceTwentyFourAngle,
                                                        // // 	leftFaceOutestCellSixFaceTwentyFourAngle,
                                                        // // 	rightFaceOutestCellSixFaceTwentyFourAngle,
                                                        // // 	frontFaceOutestCellSixFaceTwentyFourAngle,
                                                        // // 	backFaceOutestCellSixFaceTwentyFourAngle,
                                                        // // ] = sixFaceTwentyFourAngleOfSixFaceOutestCellArray;
                                                        // // [upFaceOutestCell]
                                                        // sixFaceOutestCellArray.forEach((cell, cellIndex) => {
                                                        //   cell.borderLines.forEach((borderLine, borderLineIndex) => {
                                                        //     if (borderLine !== CellBorderLine.InnerLine) {
                                                        //       const twelveEdgeIndex: TwelveEdge =
                                                        //         getSixFaceTwentyFourAngleRelationTwelveEdge(
                                                        //           // upFaceOutestCellSixFaceTwentyFourAngle,
                                                        //           sixFaceTwentyFourAngleOfSixFaceOutestCellArray[
                                                        //             cellIndex
                                                        //           ],
                                                        //           borderLineIndex,
                                                        //         );
                                                        //       if (!twelveEdges[twelveEdgeIndex].canBeInserted) {
                                                        //         twelveEdges[twelveEdgeIndex].canBeInserted = true;
                                                        //       }
                                                        //     }
                                                        //   });
                                                        // });
                                                        sixFaceOutestCellArray.forEach(function (OUTEST_CELL) {
                                                            OUTEST_CELL.borderLines.forEach(function (borderLine, borderLineIndex) {
                                                                if (borderLine !== cubeCore_ts_1.CellBorderLine.InnerLine) {
                                                                    var twelveEdgeIndex = cubeCore_ts_1.getSixFaceTwentyFourAngleRelationTwelveEdge(OUTEST_CELL.sixFaceTwentyFourAngle, borderLineIndex);
                                                                    if (!twelveEdges[twelveEdgeIndex].canBeInserted) {
                                                                        twelveEdges[twelveEdgeIndex].canBeInserted = true;
                                                                    }
                                                                }
                                                            });
                                                        });
                                                        twelveEdges.forEach(function (oneEdge, edgeIndex) {
                                                            oneEdge.pieces.forEach(function (cellRowColIndex) {
                                                                var rowIndex = cellRowColIndex[0], colIndex = cellRowColIndex[1];
                                                                var pieceCell = cells[rowIndex][colIndex];
                                                                pieceCell.feature = cubeCore_ts_1.CellFeature.Piece;
                                                                pieceCell.twelveEdge = edgeIndex;
                                                                // // 复位“面属性”
                                                                // pieceCell.sixFace = SixFace.Up;
                                                                // pieceCell.faceDirection = FourDirection.Original;
                                                                var _a = pieceCell.relatedInformationWhenAdding, relatedRowIndex = _a.rowIndex, relatedColIndex = _a.colIndex;
                                                                if (relatedRowIndex === -1) {
                                                                    pieceCell.borderLines.forEach(function (borderLine, borderLineIndex) {
                                                                        if (borderLine === cubeCore_ts_1.CellBorderLine.InnerLine) {
                                                                            switch (borderLineIndex) {
                                                                                case cubeCore_ts_1.ConnectionRelation.Top:
                                                                                    pieceCell.layerIndex =
                                                                                        cells[rowIndex - 1][colIndex].layerIndex +
                                                                                            1;
                                                                                    break;
                                                                                case cubeCore_ts_1.ConnectionRelation.Bottom:
                                                                                    pieceCell.layerIndex =
                                                                                        cells[rowIndex + 1][colIndex].layerIndex +
                                                                                            1;
                                                                                    break;
                                                                                case cubeCore_ts_1.ConnectionRelation.Left:
                                                                                    pieceCell.layerIndex =
                                                                                        cells[rowIndex][colIndex - 1].layerIndex +
                                                                                            1;
                                                                                    break;
                                                                                case cubeCore_ts_1.ConnectionRelation.Right:
                                                                                    pieceCell.layerIndex =
                                                                                        cells[rowIndex][colIndex + 1].layerIndex +
                                                                                            1;
                                                                                    break;
                                                                                default:
                                                                                    // unreachable
                                                                                    break;
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                                else {
                                                                    pieceCell.layerIndex =
                                                                        cells[relatedRowIndex][relatedColIndex].layerIndex +
                                                                            1;
                                                                }
                                                            });
                                                        });
                                                        // appendCubeWithoutOneToTwentyFour(cloned);
                                                        if (cloned.checkFacesLayerIndex()) {
                                                            if (OUTPUT_CUBE_PASS_CHECK_FACES_LAYER_INDEX) {
                                                                Deno.writeTextFileSync("" + CUBE_PASSED_CHECK_FACES_LAYER_INDEX_PATH + (++cubePassCheckFacesLayerIndexFileNo).toString() + ".js", "const cube_" + cubePassCheckFacesLayerIndexFileNo + " = " + JSON.stringify(cloned) + ";\n// " + cloned.getManner());
                                                            }
                                                            fixLonelyFaceOfCubeAndAppendIt(cloned);
                                                        }
                                                        else {
                                                            if (OUTPUT_CHECK_FACES_LAYER_INDEX_FAILED) {
                                                                // Deno.writeTextFileSync(
                                                                //   CHECK_FACES_LAYER_INDEX_FAILED_FILENAME,
                                                                //   JSON.stringify(cloned),
                                                                //   APPEND_TRUE_FLAG,
                                                                // );
                                                                appendContent(JSON.stringify(cloned), MiddleFileKind.CheckFacesLayerIndexFailed);
                                                            }
                                                        }
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                                // log(`call times: ${times}`);
                            }
                            /**
                             * <en_us>en_us</en_us>
                             * <zh_cn>检查是否有孤面，若有，则将相连的插片或其它方向又叠到同一位置的插片转为面（内外皆可）；随后处理隐藏面</zh_cn>
                             * <zh_tw>zh_tw</zh_tw>
                             *
                             * @param cube Cube
                             * <en_us>en_us</en_us>
                             * <zh_cn>需修正的正方体</zh_cn>
                             * <zh_tw>zh_tw</zh_tw>
                             */
                            function fixLonelyFaceOfCubeAndAppendIt(cube, recursiveTimes) {
                                if (recursiveTimes === void 0) { recursiveTimes = 1; }
                                var cells = cube.cells, sixFaces = cube.sixFaces, twelveEdges = cube.twelveEdges;
                                var SOURCE_CUBE_CELLS = cube.cells;
                                var PIECE_CELL_ARRAY = [];
                                twelveEdges.forEach(function (twelveEdge, twelveEdgeIndex) {
                                    twelveEdge.pieces.forEach(function (piece) {
                                        var rowIndex = piece[0], colIndex = piece[1];
                                        var CELL = cells[rowIndex][colIndex];
                                        CELL.twelveEdgeIndex =
                                            twelveEdgeIndex;
                                        PIECE_CELL_ARRAY.push(CELL);
                                    });
                                });
                                var LONELY_FACE_CELL_ARRAY = [];
                                sixFaces.forEach(function (faces) {
                                    if (faces.length > 1) {
                                        return;
                                    }
                                    var _a = faces[0], firstRowIndex = _a[0], firstColIndex = _a[1], secondRowIndex = _a[2];
                                    // 	<en_us>en_us</en_us>
                                    // 	<zh_cn>排除插片（只有一条内联线，无关联插片）</zh_cn>
                                    // 	<zh_tw>zh_tw</zh_tw>
                                    if (typeof secondRowIndex !== "undefined") {
                                        return;
                                    }
                                    var CELL = cells[firstRowIndex][firstColIndex];
                                    var RELATION_PIECE_CELL_ARRAY = [];
                                    var INNER_LINE_COUNT = CELL.borderLines.filter(function (borderLine) {
                                        return borderLine === cubeCore_ts_1.CellBorderLine.InnerLine;
                                    }).length;
                                    PIECE_CELL_ARRAY.forEach(function (pieceCell) {
                                        if (pieceCell.relatedInformationWhenAdding.rowIndex === firstRowIndex &&
                                            pieceCell.relatedInformationWhenAdding.colIndex === firstColIndex) {
                                            RELATION_PIECE_CELL_ARRAY.push(pieceCell);
                                        }
                                    });
                                    if (INNER_LINE_COUNT - RELATION_PIECE_CELL_ARRAY.length === 1) {
                                        LONELY_FACE_CELL_ARRAY.push(CELL);
                                        CELL
                                            .relationPieceCellArray = RELATION_PIECE_CELL_ARRAY;
                                        var CELL_SIXFACE_1 = CELL.sixFace;
                                        var SAME_FACE_PIECE_CELL_ARRAY_1 = [];
                                        PIECE_CELL_ARRAY.forEach(function (pieceCell) {
                                            if (pieceCell.sixFace === CELL_SIXFACE_1) {
                                                SAME_FACE_PIECE_CELL_ARRAY_1.push(pieceCell);
                                            }
                                        });
                                        CELL
                                            .sameFacePieceCellArray = SAME_FACE_PIECE_CELL_ARRAY_1;
                                    }
                                });
                                var LONELY_FACE_CELL_ARRAY_LENGTH = LONELY_FACE_CELL_ARRAY.length;
                                if (!LONELY_FACE_CELL_ARRAY_LENGTH) {
                                    fixHiddenPiecesOfCubeAndAppendIt(cube);
                                    return;
                                }
                                var CUBE_NO = cube.no;
                                var TAB = "\t".repeat(recursiveTimes - 1);
                                if (OUTPUT_FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT) {
                                    console.log({
                                        recursiveTimes: recursiveTimes,
                                        cubeNo: CUBE_NO,
                                        LONELY_FACE_CELL_ARRAY_LENGTH: LONELY_FACE_CELL_ARRAY_LENGTH
                                    });
                                    appendContent(recursiveTimes + "\t" + CUBE_NO + "\t" + LONELY_FACE_CELL_ARRAY_LENGTH, MiddleFileKind.FixLonelyFaceOfCubeAndAppendIt);
                                }
                                if (OUTPUT_FIX_LONELY_FACE_OF_CUBE) {
                                    // Deno.writeTextFileSync(
                                    //   FIX_LONELY_FACE_OF_CUBE_FILENAME,
                                    //   `${TAB}${recursiveTimes}\t${LONELY_FACE_CELL_ARRAY.length}\n${TAB}${
                                    //     JSON.stringify(cube)
                                    //   }`,
                                    //   APPEND_TRUE_FLAG,
                                    // );
                                    appendContent("" + TAB + recursiveTimes + "\t" + LONELY_FACE_CELL_ARRAY.length + "\n" + TAB + JSON.stringify(cube), MiddleFileKind.FixLonelyFaceOfCube);
                                }
                                var FIRST_LONELY_FACE_CELL = LONELY_FACE_CELL_ARRAY[0];
                                var _a = FIRST_LONELY_FACE_CELL, sameFacePieceCellArray = _a.sameFacePieceCellArray, relationPieceCellArray = _a.relationPieceCellArray;
                                if (OUTPUT_FIX_LONELY_FACE_OF_CUBE) {
                                    // Deno.writeTextFileSync(
                                    //   FIX_LONELY_FACE_OF_CUBE_FILENAME,
                                    //   `${TAB}sameFacePieceCellArray: ${
                                    //     JSON.stringify(sameFacePieceCellArray)
                                    //   }\n${TAB}relationPieceCellArray: ${
                                    //     JSON.stringify(relationPieceCellArray)
                                    //   }`,
                                    //   APPEND_TRUE_FLAG,
                                    // );
                                    appendContent(TAB + "sameFacePieceCellArray: " + JSON.stringify(sameFacePieceCellArray) + "\n" + TAB + "relationPieceCellArray: " + JSON.stringify(relationPieceCellArray), MiddleFileKind.FixLonelyFaceOfCube);
                                }
                                var LONELY_FACE_LAYER_INDEX = FIRST_LONELY_FACE_CELL.layerIndex, LONELY_FACE_SIX_FACE = FIRST_LONELY_FACE_CELL.sixFace, LONELY_FACE_ROW_INDEX = FIRST_LONELY_FACE_CELL.rowIndex, LONELY_FACE_COL_INDEX = FIRST_LONELY_FACE_CELL.colIndex;
                                sameFacePieceCellArray.forEach(function (pieceCell) {
                                    var PIECE_CELL_ROW_INDEX = pieceCell.rowIndex, PIECE_CELL_COL_INDEX = pieceCell.colIndex;
                                    for (var inOutIndex = 0; inOutIndex < 2; ++inOutIndex) {
                                        var cloned = cube.clone();
                                        var cells_1 = cloned.cells, sixFaces_1 = cloned.sixFaces, twelveEdges_1 = cloned.twelveEdges;
                                        var CLONED_LONELY_FACE_CELL = cells_1[LONELY_FACE_ROW_INDEX][LONELY_FACE_COL_INDEX];
                                        var CLONED_PIECE_CELL = cells_1[PIECE_CELL_ROW_INDEX][PIECE_CELL_COL_INDEX];
                                        CLONED_PIECE_CELL.feature = cubeCore_ts_1.CellFeature.Face;
                                        var PIECES = twelveEdges_1[SOURCE_CUBE_CELLS[PIECE_CELL_ROW_INDEX][PIECE_CELL_COL_INDEX].twelveEdgeIndex].pieces;
                                        PIECES.splice(PIECES.indexOf([
                                            PIECE_CELL_ROW_INDEX,
                                            PIECE_CELL_COL_INDEX,
                                        ]), 1);
                                        if (inOutIndex === 0) {
                                            CLONED_PIECE_CELL.layerIndex = LONELY_FACE_LAYER_INDEX + 1;
                                            sixFaces_1[LONELY_FACE_SIX_FACE][0] = [
                                                LONELY_FACE_ROW_INDEX,
                                                LONELY_FACE_COL_INDEX,
                                                PIECE_CELL_ROW_INDEX,
                                                PIECE_CELL_COL_INDEX,
                                            ];
                                        }
                                        else {
                                            CLONED_LONELY_FACE_CELL.layerIndex = LONELY_FACE_LAYER_INDEX + 1;
                                            CLONED_PIECE_CELL.layerIndex = LONELY_FACE_LAYER_INDEX;
                                            sixFaces_1[LONELY_FACE_SIX_FACE][0] = [
                                                PIECE_CELL_ROW_INDEX,
                                                PIECE_CELL_COL_INDEX,
                                                LONELY_FACE_ROW_INDEX,
                                                LONELY_FACE_COL_INDEX,
                                            ];
                                        }
                                        cloned.updateTwelveEdges();
                                        fixLonelyFaceOfCubeAndAppendIt(cloned, recursiveTimes + 1);
                                    }
                                });
                                relationPieceCellArray.forEach(function (pieceCell) {
                                    var PIECE_CELL_ROW_INDEX = pieceCell.rowIndex, PIECE_CELL_COL_INDEX = pieceCell.colIndex;
                                    var _loop_9 = function (inOutIndex) {
                                        var cloned = cube.clone();
                                        var cells_2 = cloned.cells, sixFaces_2 = cloned.sixFaces, twelveEdges_2 = cloned.twelveEdges;
                                        var CLONED_PIECE_CELL = cells_2[PIECE_CELL_ROW_INDEX][PIECE_CELL_COL_INDEX];
                                        CLONED_PIECE_CELL.feature = cubeCore_ts_1.CellFeature.Face;
                                        var PIECES = twelveEdges_2[SOURCE_CUBE_CELLS[PIECE_CELL_ROW_INDEX][PIECE_CELL_COL_INDEX].twelveEdgeIndex].pieces;
                                        PIECES.splice(PIECES.indexOf([
                                            PIECE_CELL_ROW_INDEX,
                                            PIECE_CELL_COL_INDEX,
                                        ]), 1);
                                        var CLONED_PIECE_CELL_SIX_FACE = CLONED_PIECE_CELL.sixFace;
                                        var CLONED_PIECE_CELL_CELL_INDEX = CLONED_PIECE_CELL.cellIndex;
                                        var CLONED_SIX_FACE_ITEM_ARRAY = sixFaces_2[CLONED_PIECE_CELL_SIX_FACE];
                                        var OLD_CELL_ARRAY = [];
                                        var maxLayerIndex = 0;
                                        cells_2.filter(function (cellRow) {
                                            return cellRow.forEach(function (cell) {
                                                if (cell.feature !== cubeCore_ts_1.CellFeature.Face ||
                                                    cell.sixFace !== CLONED_PIECE_CELL_SIX_FACE) {
                                                    return;
                                                }
                                                if (cell.cellIndex !== CLONED_PIECE_CELL_CELL_INDEX) {
                                                    OLD_CELL_ARRAY.push(cell);
                                                    maxLayerIndex = Math.max(maxLayerIndex, cell.layerIndex);
                                                }
                                            });
                                        });
                                        if (inOutIndex === 0) {
                                            CLONED_SIX_FACE_ITEM_ARRAY.push([
                                                PIECE_CELL_ROW_INDEX,
                                                PIECE_CELL_COL_INDEX,
                                            ]);
                                            CLONED_PIECE_CELL.layerIndex = maxLayerIndex + 1;
                                        }
                                        else {
                                            CLONED_PIECE_CELL.layerIndex = 1;
                                            CLONED_SIX_FACE_ITEM_ARRAY.unshift([
                                                PIECE_CELL_ROW_INDEX,
                                                PIECE_CELL_COL_INDEX,
                                            ]);
                                            OLD_CELL_ARRAY.forEach(function (cell) { return ++cell.layerIndex; });
                                        }
                                        cloned.updateTwelveEdges();
                                        fixLonelyFaceOfCubeAndAppendIt(cloned, recursiveTimes + 1);
                                    };
                                    for (var inOutIndex = 0; inOutIndex < 2; ++inOutIndex) {
                                        _loop_9(inOutIndex);
                                    }
                                });
                            }
                            /**
                             * <en_us>en_us</en_us>
                             * <zh_cn>将隐藏插片转为面（内外皆可）</zh_cn>
                             * <zh_tw>zh_tw</zh_tw>
                             *
                             * @param cube
                             * <en_us>en_us</en_us>
                             * <zh_cn>需修正的正方体</zh_cn>
                             * <zh_tw>zh_tw</zh_tw>
                             */
                            function fixHiddenPiecesOfCubeAndAppendIt(cube) {
                                var CUBE_ORIGINAL = cube.clone();
                                var hidePieceCount = 0;
                                var cells = cube.cells, sixFaces = cube.sixFaces, twelveEdges = cube.twelveEdges;
                                var CELL_ARRAY = cube.getCellArray();
                                function getCellByCellIndex(cellIndex) {
                                    var FILTERED = CELL_ARRAY.filter(function (cell) {
                                        return cell.cellIndex === cellIndex;
                                    });
                                    return FILTERED.length ? FILTERED[0] : undefined;
                                }
                                twelveEdges.forEach(function (twelveEdge) {
                                    var REMOVE_INDEX_ARRAY = [];
                                    twelveEdge.pieces.forEach(function (_a, pieceIndex) {
                                        var _b, _c;
                                        var pieceRowIndex = _a[0], pieceColIndex = _a[1];
                                        var PIECE_CELL = cells[pieceRowIndex][pieceColIndex];
                                        var PIECE_CELL_SIX_FACE = PIECE_CELL.sixFace;
                                        var _d = PIECE_CELL.relatedInformationWhenAdding.rowIndex === -1
                                            ? cube.getCoreCellReserveRelatedInformation()
                                            : PIECE_CELL.relatedInformationWhenAdding, PIECE_CELL_RELATION_CELL_ROW_INDEX = _d.rowIndex, PIECE_CELL_RELATION_CELL_COL_INDEX = _d.colIndex, PIECE_CELL_RELATION = _d.relation;
                                        var PIECE_CELL_REVERSED_RELATION = cubeCore_ts_1.getReversedRelation(PIECE_CELL_RELATION);
                                        // console.log({
                                        //   PIECE_CELL_RELATION_CELL_ROW_INDEX,
                                        //   PIECE_CELL_RELATION_CELL_COL_INDEX,
                                        //   PIECE_CELL_RELATION,
                                        //   PIECE_CELL_REVERSED_RELATION,
                                        //   pieceRowIndex,
                                        //   pieceColIndex,
                                        //   coreRowIndex: cube.coreRowIndex,
                                        //   coreColIndex: cube.coreColIndex,
                                        // });
                                        var PIECE_CELL_RELATION_CELL = cells[PIECE_CELL_RELATION_CELL_ROW_INDEX][PIECE_CELL_RELATION_CELL_COL_INDEX];
                                        var PIECE_CELL_RELATION_CELL_SIX_FACE = PIECE_CELL_RELATION_CELL.sixFace;
                                        var PIECE_CELL_RELATION_CELL_LAYER_INDEX = PIECE_CELL_RELATION_CELL.layerIndex;
                                        var SAME_FACE_CELL_INFO_ARRAY = sixFaces[PIECE_CELL_RELATION_CELL_SIX_FACE];
                                        var SAME_FACE_CELL_INFO_COUNT = SAME_FACE_CELL_INFO_ARRAY.length;
                                        var hasOuterFace = false;
                                        for (var sameFaceCellInfoIndex = 0; sameFaceCellInfoIndex < SAME_FACE_CELL_INFO_COUNT; ++sameFaceCellInfoIndex) {
                                            var _e = SAME_FACE_CELL_INFO_ARRAY[sameFaceCellInfoIndex], firstRowIndex = _e[0], firstColIndex = _e[1], secondRowIndex = _e[2], secondColIndex = _e[3];
                                            var firstCell = cells[firstRowIndex][firstColIndex];
                                            if (firstCell.layerIndex > PIECE_CELL_RELATION_CELL_LAYER_INDEX &&
                                                firstCell.borderLines[PIECE_CELL_REVERSED_RELATION] ===
                                                    cubeCore_ts_1.CellBorderLine.InnerLine &&
                                                ((_b = getCellByCellIndex(firstCell.getConnectedCellIndexByRelation(PIECE_CELL_REVERSED_RELATION))) === null || _b === void 0 ? void 0 : _b.feature) === cubeCore_ts_1.CellFeature.Face) {
                                                hasOuterFace = true;
                                                break;
                                            }
                                            if (typeof secondRowIndex !== "undefined" &&
                                                typeof secondColIndex !== "undefined") {
                                                var secondCell = cells[secondRowIndex][secondColIndex];
                                                if (secondCell.layerIndex >
                                                    PIECE_CELL_RELATION_CELL_LAYER_INDEX &&
                                                    secondCell.borderLines[PIECE_CELL_REVERSED_RELATION] ===
                                                        cubeCore_ts_1.CellBorderLine.InnerLine &&
                                                    ((_c = getCellByCellIndex(secondCell.getConnectedCellIndexByRelation(PIECE_CELL_REVERSED_RELATION))) === null || _c === void 0 ? void 0 : _c.feature) === cubeCore_ts_1.CellFeature.Face) {
                                                    hasOuterFace = true;
                                                    break;
                                                }
                                            }
                                        }
                                        if (hasOuterFace) {
                                            REMOVE_INDEX_ARRAY.push(pieceIndex);
                                            // CELL_ARRAY.filter((cell) =>
                                            //   cell.feature === CellFeature.Face &&
                                            //   cell.sixFace === PIECE_CELL_SIX_FACE
                                            // ).forEach((cell) => ++cell.layerIndex);
                                            var SAME_FACE_CELL_INFO_ARRAY_1 = sixFaces[PIECE_CELL_SIX_FACE];
                                            var SAME_FACE_CELL_INFO_COUNT_1 = SAME_FACE_CELL_INFO_ARRAY_1.length;
                                            for (var sameFaceCellInfoIndex = 0; sameFaceCellInfoIndex < SAME_FACE_CELL_INFO_COUNT_1; ++sameFaceCellInfoIndex) {
                                                var _f = SAME_FACE_CELL_INFO_ARRAY_1[sameFaceCellInfoIndex], firstRowIndex = _f[0], firstColIndex = _f[1], secondRowIndex = _f[2], secondColIndex = _f[3];
                                                var firstCell = cells[firstRowIndex][firstColIndex];
                                                ++firstCell.layerIndex;
                                                if (typeof secondRowIndex !== "undefined" &&
                                                    typeof secondColIndex !== "undefined") {
                                                    var secondCell = cells[secondRowIndex][secondColIndex];
                                                    ++secondCell.layerIndex;
                                                }
                                            }
                                            // bug: error array
                                            // sixFaces[PIECE_CELL_RELATION_CELL_SIX_FACE].unshift([
                                            //   pieceRowIndex,
                                            //   pieceColIndex,
                                            // ]);
                                            // console.log({
                                            //   no: cube.no,
                                            //   PIECE_CELL_SIX_FACE,
                                            //   PIECE_CELL_RELATION_CELL_SIX_FACE,
                                            //   old: JSON.stringify(sixFaces[PIECE_CELL_SIX_FACE]),
                                            //   pieceRowIndex,
                                            //   pieceColIndex,
                                            // });
                                            sixFaces[PIECE_CELL_SIX_FACE].unshift([
                                                pieceRowIndex,
                                                pieceColIndex,
                                            ]);
                                            PIECE_CELL.feature = cubeCore_ts_1.CellFeature.Face;
                                            // 	<en_us>en_us</en_us>
                                            // 	<zh_cn>会导致压缩正方体数据时出现负数</zh_cn>
                                            // 	<zh_tw>zh_tw</zh_tw>
                                            // PIECE_CELL.layerIndex = 0;
                                            PIECE_CELL.layerIndex = 1;
                                            ++hidePieceCount;
                                        }
                                    });
                                    REMOVE_INDEX_ARRAY.toReversed().forEach(function (index) {
                                        return twelveEdge.pieces.splice(index, 1);
                                    });
                                });
                                if (hidePieceCount) {
                                    cube.updateTwelveEdges();
                                }
                                cube.sync();
                                if (hidePieceCount) {
                                    if (OUTPUT_FIX_HIDDEN_PIECES) {
                                        // Deno.writeTextFileSync(
                                        //   FIX_HIDDEN_PIECES_FILENAME,
                                        //   JSON.stringify(cube),
                                        //   APPEND_TRUE_FLAG,
                                        // );
                                        // appendContent(
                                        //   JSON.stringify(cube),
                                        //   MiddleFileKind.FixHiddenPieces,
                                        // );
                                        appendContent(JSON.stringify(CUBE_ORIGINAL) + "\nto\n" + JSON.stringify(cube), MiddleFileKind.FixHiddenPieces);
                                    }
                                    if (OUTPUT_FIX_HIDDEN_PIECES_DETAILS) {
                                        Deno.writeTextFileSync("" + FIX_HIDDEN_PIECES_DETAILS_PATH + cube.no + "_" + ++fixHiddenPiecesFileNo + "_from.js", "const fixHiddenPieces_" + cube.no + " = " + JSON.stringify(CUBE_ORIGINAL) + ";");
                                        Deno.writeTextFileSync("" + FIX_HIDDEN_PIECES_DETAILS_PATH + cube.no + "_" + fixHiddenPiecesFileNo + "_to.js", "const fixHiddenPieces_" + cube.no + " = " + JSON.stringify(cube) + ";");
                                    }
                                }
                                appendCubeWithoutOneToTwentyFour(cube);
                            }
                            function appendCubeWithoutOneToTwentyFour(cube) {
                                nextCubeNo += CUBE_NO_STEP;
                                if (OUTPUT_MIDDLE_CUBE_TO_FIRST_NO) {
                                    appendContent(
                                    // nextCubeNo.toString(),
                                    nextCubeNo + ": " + cube.getManner(), MiddleFileKind.MiddleCubeToFirstNo);
                                }
                                cube.no = nextCubeNo;
                                CUBES.push(cube);
                                if (OUTPUT_ALONE_FIRST_CUBE) {
                                    Deno.writeTextFileSync("" + ALONE_FIRST_CUBE_PATH + nextCubeNo + ".js", "const cube_" + nextCubeNo + " = " + JSON.stringify(cube) + ";\n// " + cube.getManner());
                                }
                                if (CUBES.length >= DEBUG.CUBE_COUNT_PER_FILE) {
                                    outputCubes();
                                }
                            }
                            function outputCubes() {
                                if (!CUBES.length) {
                                    return;
                                }
                                var GOAL_FILE_NAME = "" + GOAL_CUBE_FILE_PATH + (++fileNo).toString().padStart(6, "0") + ".txt";
                                Deno.writeTextFileSync(GOAL_FILE_NAME, CUBES.map(function (cube) { return JSON.stringify(cube); }).join("\n"));
                                CUBES.length = 0;
                                cubeCore_ts_1.showUsedTime("output " + GOAL_FILE_NAME);
                            }
                            var fileNo, nextCubeNo, CUBES, currentMiddleCubeInfo, currentMiddleCubeNo, _loop_8, rowCountLoop;
                            var e_1, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        fileNo = 0;
                                        nextCubeNo = 1 - CUBE_NO_STEP;
                                        CUBES = [];
                                        currentMiddleCubeInfo = "";
                                        currentMiddleCubeNo = 0;
                                        _loop_8 = function (rowCountLoop) {
                                            var ROW_COUNT, SOURCE_FILE_PATH, _a, _b, dirEntry, filename, stats, e_1_1;
                                            return __generator(this, function (_c) {
                                                switch (_c.label) {
                                                    case 0:
                                                        ROW_COUNT = rowCountLoop;
                                                        if (!ROW_COUNT_ARRAY.filter(function (value) { return value === ROW_COUNT; }).length) {
                                                            return [2 /*return*/, "continue"];
                                                        }
                                                        SOURCE_FILE_PATH = "" + SOURCE_FILE_TOP_PATH + ROW_COUNT + "rows_" + COL_COUNT + "cols/";
                                                        if (!mod_ts_1.existsSync(SOURCE_FILE_PATH)) {
                                                            return [2 /*return*/, "continue"];
                                                        }
                                                        _c.label = 1;
                                                    case 1:
                                                        _c.trys.push([1, 6, 7, 12]);
                                                        _a = (e_1 = void 0, __asyncValues(Deno.readDir(SOURCE_FILE_PATH)));
                                                        _c.label = 2;
                                                    case 2: return [4 /*yield*/, _a.next()];
                                                    case 3:
                                                        if (!(_b = _c.sent(), !_b.done)) return [3 /*break*/, 5];
                                                        dirEntry = _b.value;
                                                        filename = path.join(SOURCE_FILE_PATH, dirEntry.name);
                                                        stats = Deno.statSync(filename);
                                                        if (stats.isFile) {
                                                            console.log(filename);
                                                            Deno.readTextFileSync(filename).split("\n").forEach(function (codeLine) {
                                                                batchAppendCube(cubeCore_ts_1.getCubeFromJson(codeLine));
                                                            });
                                                        }
                                                        _c.label = 4;
                                                    case 4: return [3 /*break*/, 2];
                                                    case 5: return [3 /*break*/, 12];
                                                    case 6:
                                                        e_1_1 = _c.sent();
                                                        e_1 = { error: e_1_1 };
                                                        return [3 /*break*/, 12];
                                                    case 7:
                                                        _c.trys.push([7, , 10, 11]);
                                                        if (!(_b && !_b.done && (_a = _a["return"]))) return [3 /*break*/, 9];
                                                        return [4 /*yield*/, _a.call(_a)];
                                                    case 8:
                                                        _c.sent();
                                                        _c.label = 9;
                                                    case 9: return [3 /*break*/, 11];
                                                    case 10:
                                                        if (e_1) throw e_1.error;
                                                        return [7 /*endfinally*/];
                                                    case 11: return [7 /*endfinally*/];
                                                    case 12: return [2 /*return*/];
                                                }
                                            });
                                        };
                                        rowCountLoop = 2;
                                        _b.label = 1;
                                    case 1:
                                        if (!(rowCountLoop <= 5)) return [3 /*break*/, 4];
                                        return [5 /*yield**/, _loop_8(rowCountLoop)];
                                    case 2:
                                        _b.sent();
                                        _b.label = 3;
                                    case 3:
                                        ++rowCountLoop;
                                        return [3 /*break*/, 1];
                                    case 4:
                                        outputCubes();
                                        return [2 /*return*/];
                                }
                            });
                        }); })()];
                case 1:
                    _a.sent();
                    for (middleFileKindIndex = 0; middleFileKindIndex < MIDDLE_FILE_KIND_COUNT; ++middleFileKindIndex) {
                        appendFile(middleFileKindIndex);
                    }
                    cubeCore_ts_1.showUsedTime("end");
                    cubeCore_ts_1.log("end: " + (new Date()).toLocaleString());
                    cubeCore_ts_1.logUsedTime(STEP_FLAG + ": Total", performance.now() - DATE_BEGIN);
                    mod_ts_1.copySync(LOG_FILE_NAME, "log_" + STEP_FLAG + ".txt", OVER_WRITE_TRUE_FLAG);
                    mod_ts_1.copySync(LOG_FILE_NAME, GOAL_FILE_TOP_PATH + "log" + logFilenamePostfix + ".txt", OVER_WRITE_TRUE_FLAG);
                    Deno.removeSync(LOG_FILE_NAME);
                    return [2 /*return*/];
            }
        });
    });
}
function step3(GOAL_FILE_TOP_PATH, SOURCE_FILE_TOP_PATH, OUTPUT_FULL_CUBE, OUTPUT_READ_CUBE, SHOW_GET_CLONED_CUBE_BY_MANNER_INDEX_DETAIL) {
    if (GOAL_FILE_TOP_PATH === void 0) { GOAL_FILE_TOP_PATH = "./"; }
    if (SOURCE_FILE_TOP_PATH === void 0) { SOURCE_FILE_TOP_PATH = "./cubesOnlyFirstOfTwentyFour/"; }
    if (OUTPUT_FULL_CUBE === void 0) { OUTPUT_FULL_CUBE = false; }
    if (OUTPUT_READ_CUBE === void 0) { OUTPUT_READ_CUBE = false; }
    if (SHOW_GET_CLONED_CUBE_BY_MANNER_INDEX_DETAIL === void 0) { SHOW_GET_CLONED_CUBE_BY_MANNER_INDEX_DETAIL = false; }
    return __awaiter(this, void 0, void 0, function () {
        var STEP_FLAG, LOG_FILE_NAME, logFilenamePostfix, GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH, DEBUG_FILE_PREFIX, DATE_BEGIN, READ_CUBE_PATH, FULL_CUBE_PATH, MANNER_COUNT;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    STEP_FLAG = "step3";
                    LOG_FILE_NAME = "./log.txt";
                    if (mod_ts_1.existsSync(LOG_FILE_NAME)) {
                        Deno.removeSync(LOG_FILE_NAME);
                    }
                    logFilenamePostfix = "";
                    logFilenamePostfix = "_" + STEP_FLAG;
                    GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH = GOAL_FILE_TOP_PATH.replace(/[.\/\\]/g, "").length;
                    DEBUG_FILE_PREFIX = GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH
                        ? ""
                        : STEP_FLAG.concat("_");
                    if (GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH) {
                        mod_ts_1.ensureDirSync(GOAL_FILE_TOP_PATH);
                        mod_ts_1.emptyDirSync(GOAL_FILE_TOP_PATH);
                    }
                    cubeCore_ts_1.log("begin: " + (new Date()).toLocaleString());
                    DATE_BEGIN = performance.now();
                    READ_CUBE_PATH = GOAL_FILE_TOP_PATH + "31_readCube/";
                    if (OUTPUT_READ_CUBE) {
                        mod_ts_1.ensureDirSync(READ_CUBE_PATH);
                        mod_ts_1.emptyDirSync(READ_CUBE_PATH);
                    }
                    FULL_CUBE_PATH = GOAL_FILE_TOP_PATH + "39_fullCube/";
                    if (OUTPUT_FULL_CUBE) {
                        mod_ts_1.ensureDirSync(FULL_CUBE_PATH);
                        mod_ts_1.emptyDirSync(FULL_CUBE_PATH);
                    }
                    MANNER_COUNT = cubeCore_ts_1.ANGLE_COUNT;
                    return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                            function batchAppendCubeOneToTwentyFour(cube) {
                                var CORE_ROW_INDEX = cube.coreRowIndex, CORE_COL_INDEX = cube.coreColIndex;
                                var OLD_SIX_FACES = cube.sixFaces, OLD_TWELVE_EDGES = cube.twelveEdges, OLD_CELLS = cube.cells, START_NO = cube.no, rowCount = cube.rowCount, colCount = cube.colCount, gridLines = cube.gridLines;
                                if (OUTPUT_READ_CUBE) {
                                    var CUBE_NO = cube.no;
                                    Deno.writeTextFileSync(READ_CUBE_PATH + "input." + CUBE_NO + ".js", "const cube_" + CUBE_NO + " = " + JSON.stringify(cube) + ";");
                                    Deno.writeTextFileSync(READ_CUBE_PATH + "input." + CUBE_NO + ".sixFaces.txt", "" + JSON.stringify(OLD_SIX_FACES));
                                }
                                // { xStart, xEnd, yStart, yEnd, lineStyle }
                                // GridLineStyle: Unknown, None, InnerLine, CutLine, OuterLine
                                var LINE_ARRAY = [];
                                for (var rowIndexLoop = 0; rowIndexLoop <= rowCount; ++rowIndexLoop) {
                                    for (var colIndexLoop = 0; colIndexLoop < colCount; ++colIndexLoop) {
                                        LINE_ARRAY.push(1);
                                    }
                                }
                                var VERTICAL_LINE_INDEX_OFFSET = LINE_ARRAY.length;
                                for (var rowIndexLoop = 0; rowIndexLoop < rowCount; ++rowIndexLoop) {
                                    for (var colIndexLoop = 0; colIndexLoop <= colCount; ++colIndexLoop) {
                                        LINE_ARRAY.push(1);
                                    }
                                }
                                gridLines.forEach(function (_a) {
                                    var xStart = _a.xStart, _xEnd = _a._xEnd, yStart = _a.yStart, yEnd = _a.yEnd, lineStyle = _a.lineStyle;
                                    if (yStart === yEnd) {
                                        LINE_ARRAY[colCount * yStart + xStart] = lineStyle;
                                    }
                                    else {
                                        LINE_ARRAY[VERTICAL_LINE_INDEX_OFFSET + (colCount + 1) * yStart + xStart] = lineStyle;
                                    }
                                });
                                cubeLinesFileContent += (cubeLinesFileContent.length ? "\n" : "").concat(LINE_ARRAY.join(""));
                                var MAX_ADD_ORDER = cube.actCells.map(function (cell) { return cell.addOrder; }).sort().reverse()[0];
                                var CORE_CELL_IS_PIECE = OLD_CELLS[CORE_ROW_INDEX][CORE_COL_INDEX].feature === cubeCore_ts_1.CellFeature.Piece;
                                for (var mannerIndex = 0; mannerIndex < MANNER_COUNT; ++mannerIndex) {
                                    var cloned = getClonedCubeByMannerIndex(cube, mannerIndex, OLD_SIX_FACES, OLD_TWELVE_EDGES, OLD_CELLS, MAX_ADD_ORDER, CORE_CELL_IS_PIECE);
                                    cloned.no = START_NO + mannerIndex;
                                    if (OUTPUT_READ_CUBE) {
                                        Deno.writeTextFileSync(READ_CUBE_PATH + "output." + START_NO + "." + mannerIndex + ".sixFaces.txt", "" + JSON.stringify(cloned.sixFaces));
                                    }
                                    cloned.syncAndClear();
                                    var MANNER = cloned.getManner();
                                    cloned.manner = MANNER;
                                    appendCube(cloned);
                                }
                            }
                            function appendCube(cube) {
                                CUBES.push(cube);
                                if (OUTPUT_FULL_CUBE) {
                                    var CUBE_NO = cube.no;
                                    Deno.writeTextFileSync(FULL_CUBE_PATH + "full_" + CUBE_NO + ".js", "const cube_" + CUBE_NO + " = " + JSON.stringify(cube) + ";");
                                }
                                if (CUBES.length >= CUBE_COUNT_PER_FILE) {
                                    outputCubes();
                                }
                            }
                            function outputCubes() {
                                if (!CUBES.length) {
                                    return;
                                }
                                ++fileNo;
                                var filenamePostfix = fileNo.toString().padStart(6, "0") + ".txt";
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
                                var MANNER_CUBES_ARRAY = [];
                                var MANNER_ARRAY = [];
                                CUBES.forEach(function (cube) {
                                    var manner = cube.manner, no = cube.no;
                                    cube["manner"] = undefined;
                                    var OLD_INDEX = MANNER_ARRAY.indexOf(manner);
                                    if (OLD_INDEX === -1) {
                                        MANNER_ARRAY.push(manner);
                                        MANNER_CUBES_ARRAY.push([no]);
                                    }
                                    else {
                                        MANNER_CUBES_ARRAY[OLD_INDEX].push(no);
                                    }
                                });
                                Deno.writeTextFileSync("" + MANNER_CUBES_GOAL_FILE_PATH + filenamePostfix, MANNER_CUBES_ARRAY.map(function (noArray, index) {
                                    return MANNER_ARRAY[index] + ":[" + noArray.join(",") + "]";
                                })
                                    .join("\n"));
                                MANNER_CUBES_ARRAY.length = 0;
                                MANNER_ARRAY.length = 0;
                                //  3. 输出压缩后的正方体信息（正方体间以回车符分隔，4位一格，16进制）：
                                //      1）1位：格序（1位，0-15，16进制0-E）
                                //      2）1位：功能（1位，2-3，2面3片，减2乘6）+层序（1位，1-6转0-5），转1位16进制
                                //      3）1位：面序或片序——面序0-5，片序0-11，转1位十六进制
                                //      4）1位：方向序，0-3
                                //      最多4*15+1=61位一个，最大编号112260888，最多68,4791,4168字数据，约68亿字，
                                //      不确定是否19G左右
                                var GOAL_FILE_NAME = "" + CUBE_GOAL_FILE_PATH + filenamePostfix;
                                // try {
                                // Deno.writeTextFileSync(
                                // GOAL_FILE_NAME,
                                // CUBES.map((cube) =>
                                // cube.actCells.map(
                                // ({
                                // cellIndex,
                                // layerIndex,
                                // feature,
                                // sixFace,
                                // faceDirection,
                                // twelveEdge,
                                // }) =>
                                // `${cellIndex.toString(16)}${
                                // (parseInt(`${(feature - 2) * 6 + (layerIndex - 1)}`)).toString(16)
                                // }${feature === 2 ? `${sixFace}` : `${twelveEdge.toString(16)}`}${faceDirection}`,
                                // ).join('')
                                // ).join('\n'),
                                // );
                                // } catch {
                                // log('[error]', sourceFilename);
                                // }
                                try {
                                    var codes_1 = [];
                                    CUBES.forEach(function (cube) {
                                        var code = "";
                                        var no = cube.no, actCells = cube.actCells;
                                        actCells.forEach(function (cell) {
                                            var cellIndex = cell.cellIndex, layerIndex = cell.layerIndex, feature = cell.feature, sixFace = cell.sixFace, faceDirection = cell.faceDirection, rowIndex = cell.rowIndex, colIndex = cell.colIndex, addOrder = cell.addOrder;
                                            var twelveEdge = cell.twelveEdge;
                                            code += cellIndex.toString(16);
                                            var FEATURE_AND_LAYERINDEX = parseInt("" + ((feature - 2) * 6 + (layerIndex - 1)));
                                            code += FEATURE_AND_LAYERINDEX.toString(16);
                                            if (feature === 2) {
                                                code += sixFace;
                                            }
                                            else {
                                                if (typeof twelveEdge === "undefined") {
                                                    var relatedInformationWhenAdding = cell.relatedInformationWhenAdding;
                                                    if (relatedInformationWhenAdding.rowIndex === -1 &&
                                                        relatedInformationWhenAdding.colIndex === -1) {
                                                        var FIND_ADD_ORDER_1 = addOrder + 1;
                                                        var RELATION_CELL = actCells.filter(function (o) {
                                                            return o.addOrder === FIND_ADD_ORDER_1 &&
                                                                o.relatedInformationWhenAdding.rowIndex === rowIndex &&
                                                                o.relatedInformationWhenAdding.colIndex === colIndex;
                                                        })[0];
                                                        var relation = RELATION_CELL.relatedInformationWhenAdding.relation;
                                                        twelveEdge = cubeCore_ts_1.getSixFaceTwentyFourAngleRelationTwelveEdge(RELATION_CELL.sixFaceTwentyFourAngle, relation % 2 === 0
                                                            ? (2 - relation)
                                                            : 1 + floor(relation / 2));
                                                    }
                                                    else {
                                                        console.log("cell.twelveEdge is undefined", no, relatedInformationWhenAdding);
                                                    }
                                                }
                                                try {
                                                    code += twelveEdge.toString(16);
                                                }
                                                catch (error) {
                                                    console.log("cell", no, cell);
                                                }
                                            }
                                            code += faceDirection;
                                        });
                                        codes_1.push(code);
                                    });
                                    Deno.writeTextFileSync(GOAL_FILE_NAME, codes_1.join("\n"));
                                }
                                catch (error) {
                                    console.error("[error]", sourceFilename, filenamePostfix, error);
                                }
                                // `${(cellIndex).toString(16)}${(parseInt(`${layerIndex}${feature}`)).toString(16)}${feature===2?`${sixFace}${faceDirection}`:twelveEdge.toString().padStart(2, '0')}`
                                // 2. 每24个正方体（以1转24的第一个计算）一组，计算纸模完整横纵线，回车符分隔
                                //    1）两行五列则15=5*(2+1)横12=(5+1)*2纵共27线；
                                //    2）三行五列则20=5*(3+1)横18=(5+1)*3纵共38线。
                                //    最大编号112260888，4677537组，最多1,8242,3943字数据，约2亿字
                                Deno.writeTextFileSync(CUBE_LINES_FILE_NAME, (fileNo === 1 ? "" : "\n").concat(cubeLinesFileContent), APPEND_TRUE_FLAG);
                                cubeLinesFileContent = "";
                                CUBES.length = 0;
                            }
                            function getClonedCubeByMannerIndex(cube, mannerIndex, OLD_SIX_FACES, OLD_TWELVE_EDGES, OLD_CELLS, MAX_ADD_ORDER, CORE_CELL_IS_PIECE) {
                                var CORE_ROW_INDEX = cube.coreRowIndex, CORE_COL_INDEX = cube.coreColIndex;
                                var cloned = cube.clone();
                                var cells = cloned.cells, actCells = cloned.actCells, sixFaces = cloned.sixFaces, twelveEdges = cloned.twelveEdges;
                                var CELL_ARRAY = cloned.getCellArray();
                                var _a = cubeCore_ts_1.convertSixFaceTwentyFourAngleToSixFaceAndDirection(mannerIndex), CORE_CELL_SIX_FACE = _a[0], CORE_CELL_FOUR_DIRECTION = _a[1];
                                var CORE_CELL = cells[CORE_ROW_INDEX][CORE_COL_INDEX];
                                CORE_CELL.sixFace = CORE_CELL_SIX_FACE;
                                CORE_CELL.faceDirection = CORE_CELL_FOUR_DIRECTION;
                                var NEW_SIX_FACE_ARRAY = SHOW_GET_CLONED_CUBE_BY_MANNER_INDEX_DETAIL
                                    ? []
                                    : undefined;
                                if (SHOW_GET_CLONED_CUBE_BY_MANNER_INDEX_DETAIL) {
                                    NEW_SIX_FACE_ARRAY.push("1: " + CORE_ROW_INDEX + CORE_COL_INDEX + CORE_CELL_SIX_FACE + CORE_CELL_FOUR_DIRECTION);
                                }
                                var _loop_10 = function (addOrder) {
                                    if (SHOW_GET_CLONED_CUBE_BY_MANNER_INDEX_DETAIL) {
                                        NEW_SIX_FACE_ARRAY.push("\n" + addOrder + ": ");
                                    }
                                    // cells.forEach((cellRow) =>
                                    //   cellRow.filter((cell) => cell.addOrder === addOrder).forEach(
                                    //     (cell) => {
                                    //       const { rowIndex, colIndex, relation: RELATION } =
                                    //         cell.relatedInformationWhenAdding;
                                    //       const RELATED_CELL = cells[rowIndex][colIndex];
                                    //       const [newSixFace, newFaceDirection] =
                                    //         convertSixFaceTwentyFourAngleToSixFaceAndDirection(
                                    //           SIX_FACE_AND_DIRECTION_RELATIONS[
                                    //             RELATED_CELL.sixFaceTwentyFourAngle
                                    //           ][RELATION],
                                    //         );
                                    //       cell.sixFace = newSixFace;
                                    //       cell.faceDirection = newFaceDirection;
                                    //     },
                                    //   )
                                    // );
                                    CELL_ARRAY.filter(function (cell) { return cell.addOrder === addOrder; }).forEach(function (cell) {
                                        var _a = cell.relatedInformationWhenAdding, rowIndex = _a.rowIndex, colIndex = _a.colIndex, RELATION = _a.relation;
                                        var RELATED_CELL = cells[rowIndex][colIndex];
                                        var sixFaceTwentyFourAngle = RELATED_CELL.sixFaceTwentyFourAngle;
                                        // const [newSixFace, newFaceDirection] =
                                        //   convertSixFaceTwentyFourAngleToSixFaceAndDirection(
                                        //     SIX_FACE_AND_DIRECTION_RELATIONS[
                                        //       sixFaceTwentyFourAngle
                                        //     ][RELATION],
                                        //   );
                                        var newSixFaceTwentyFourAngle = cubeCore_ts_1.SIX_FACE_AND_DIRECTION_RELATIONS[sixFaceTwentyFourAngle][RELATION];
                                        var _b = cubeCore_ts_1.convertSixFaceTwentyFourAngleToSixFaceAndDirection(newSixFaceTwentyFourAngle), newSixFace = _b[0], newFaceDirection = _b[1];
                                        cell.sixFace = newSixFace;
                                        cell.faceDirection = newFaceDirection;
                                        cell.twelveEdge = cubeCore_ts_1.getSixFaceTwentyFourAngleRelationTwelveEdge(sixFaceTwentyFourAngle, RELATION);
                                        if (SHOW_GET_CLONED_CUBE_BY_MANNER_INDEX_DETAIL) {
                                            NEW_SIX_FACE_ARRAY.push("" + cell.rowIndex + cell.colIndex + newSixFace + newFaceDirection + "=" + newSixFaceTwentyFourAngle + "=" + cell.sixFaceTwentyFourAngleStr + "<=" + rowIndex + colIndex + "[" + sixFaceTwentyFourAngle + "][" + RELATION + "],");
                                        }
                                    });
                                };
                                for (var addOrder = 2; addOrder <= MAX_ADD_ORDER; ++addOrder) {
                                    _loop_10(addOrder);
                                }
                                if (CORE_CELL_IS_PIECE) {
                                    // console.log("CORE_CELL_IS_PIECE");
                                    // const { rowIndex, colIndex } = actCells.filter((cell) =>
                                    //   cell.addOrder === 2
                                    // )[0];
                                    // const RELATED_CELL = cells[rowIndex][colIndex];
                                    var RELATED_CELL = CELL_ARRAY.filter(function (cell) {
                                        return cell.addOrder === 2;
                                    })[0];
                                    var sixFaceTwentyFourAngle = RELATED_CELL.sixFaceTwentyFourAngle;
                                    var RELATION = RELATED_CELL.relatedInformationWhenAdding.relation;
                                    var REVERSED_RELATION = cubeCore_ts_1.getReversedRelation(RELATION);
                                    // error: 2 - RELATION % 2 + 2 * floor(RELATION / 2),
                                    // right: relation % 2 + 2 * (1 - Math.floor(relation / 2));
                                    CORE_CELL.twelveEdge = cubeCore_ts_1.getSixFaceTwentyFourAngleRelationTwelveEdge(sixFaceTwentyFourAngle, REVERSED_RELATION);
                                    var _b = cubeCore_ts_1.convertSixFaceTwentyFourAngleToSixFaceAndDirection(cubeCore_ts_1.SIX_FACE_AND_DIRECTION_RELATIONS[sixFaceTwentyFourAngle][REVERSED_RELATION]), newSixFace = _b[0], newFaceDirection = _b[1];
                                    CORE_CELL.sixFace = newSixFace;
                                    CORE_CELL.faceDirection = newFaceDirection;
                                    // if (
                                    //   newSixFace !== CORE_CELL_SIX_FACE ||
                                    //   newFaceDirection !== CORE_CELL_FOUR_DIRECTION
                                    // ) {
                                    //   log(
                                    //     `[error]${newSixFace}vs${CORE_CELL_SIX_FACE},${newFaceDirection}vs${CORE_CELL_FOUR_DIRECTION}`,
                                    //   );
                                    // }
                                }
                                if (SHOW_GET_CLONED_CUBE_BY_MANNER_INDEX_DETAIL) {
                                    cubeCore_ts_1.log("\n" + NEW_SIX_FACE_ARRAY.join(""));
                                    NEW_SIX_FACE_ARRAY.length = 0;
                                }
                                sixFaces.forEach(function (face, faceIndex) {
                                    face.length = 0;
                                    var find = false;
                                    OLD_SIX_FACES.forEach(function (oldFaces) {
                                        if (oldFaces.length === 0) {
                                            Deno.writeTextFileSync("" + GOAL_FILE_TOP_PATH + DEBUG_FILE_PREFIX + "error_cube_" + cube.no + ".ts", "const _error_cube = " + JSON.stringify(cube) + ";");
                                        }
                                        var _a = oldFaces[0], rowIndex = _a[0], colIndex = _a[1];
                                        if (cells[rowIndex][colIndex].sixFace === faceIndex) {
                                            oldFaces.forEach(function (item) { return face.push(item); });
                                            find = true;
                                        }
                                    });
                                    if (!find) {
                                        cubeCore_ts_1.log(
                                        // .toString().padStart(2, "0")
                                        cube.no + "." + mannerIndex.toString().padStart(2, "0") + ".sixFaces[" + faceIndex + "] not found, and " + cube.no + ".old_sixFaces: " + OLD_SIX_FACES.map(function (oldFaces) {
                                            var _a = oldFaces[0], rowIndex = _a[0], colIndex = _a[1];
                                            return "" + rowIndex + colIndex + cells[rowIndex][colIndex].sixFace;
                                        }).join("_") + ", all: " + 
                                        // actCells.map((cell) => cell.sixFace).join("")
                                        actCells.map(function (cell) {
                                            return "" + cell.rowIndex + cell.colIndex + cell.sixFace;
                                        }).join("_") + ", old_sixFaces_full: " + OLD_SIX_FACES.map(function (oldFaces) {
                                            return oldFaces.map(function (face) {
                                                var row1 = face[0], col1 = face[1], row2 = face[2], col2 = face[3];
                                                // return `${cells[row1][col1].sixFace}${
                                                //   (typeof row2 !== "undefined" && typeof col2 !== "undefined")
                                                //     ? cells[row2][col2].sixFace
                                                //     : ""
                                                // }`;
                                                return "" + row1 + col1 + cells[row1][col1].sixFace + ((typeof row2 !== "undefined" && typeof col2 !== "undefined")
                                                    ? "_" + row2 + col2 + cells[row2][col2].sixFace
                                                    : "");
                                            }).join("_");
                                        }).join("_"));
                                    }
                                });
                                twelveEdges.forEach(function (edge) {
                                    edge.pieces.forEach(function (_a) {
                                        var pieceRowIndex = _a[0], pieceColIndex = _a[1];
                                        var PIECE_CELL = cells[pieceRowIndex][pieceColIndex];
                                        var _b = PIECE_CELL.relatedInformationWhenAdding, rowIndex = _b.rowIndex, colIndex = _b.colIndex, relation = _b.relation;
                                        var fixedRelation = relation;
                                        var fixedSixFaceTwentyFourAngle = 0;
                                        if (rowIndex === -1) {
                                            cells.forEach(function (cellRow, cellRowIndex) {
                                                return cellRow.forEach(function (cell, cellColIndex) {
                                                    if (cell.addOrder === 2) {
                                                        fixedSixFaceTwentyFourAngle = cell.sixFaceTwentyFourAngle;
                                                        var RELATION = cell.relatedInformationWhenAdding.relation;
                                                        fixedRelation = (2 - RELATION % 2) + 2 * floor(RELATION / 2);
                                                    }
                                                });
                                            });
                                        }
                                        else {
                                            fixedSixFaceTwentyFourAngle =
                                                cells[rowIndex][colIndex].sixFaceTwentyFourAngle;
                                        }
                                        PIECE_CELL.twelveEdge = cubeCore_ts_1.getSixFaceTwentyFourAngleRelationTwelveEdge(fixedSixFaceTwentyFourAngle, fixedRelation);
                                    });
                                });
                                // 找到新旧十二棱对应关系
                                var TWELVE_EDGES_NEW_TO_OLD_ARRAY = [
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
                                var FINDED_TWELVE_EDGES_INDEX_ARRAY = [];
                                OLD_SIX_FACES.forEach(function (sixFaces) {
                                    sixFaces.forEach(function (_a) {
                                        var firstRowIndex = _a[0], firstColIndex = _a[1], secondRowIndex = _a[2], secondColIndex = _a[3];
                                        if (FINDED_TWELVE_EDGES_INDEX_ARRAY.length === 12) {
                                            return;
                                        }
                                        relateTwelveEdge(firstRowIndex, firstColIndex);
                                        if (typeof secondRowIndex !== "undefined") {
                                            relateTwelveEdge(secondRowIndex, secondColIndex);
                                        }
                                        function relateTwelveEdge(rowIndex, colIndex) {
                                            if (FINDED_TWELVE_EDGES_INDEX_ARRAY.length === 12) {
                                                return;
                                            }
                                            var oldFirstCell = OLD_CELLS[rowIndex][colIndex];
                                            var oldSixFaceTwentyFourAngle = oldFirstCell.sixFaceTwentyFourAngle;
                                            var newFirstCell = cells[rowIndex][colIndex];
                                            var newSixFaceTwentyFourAngle = newFirstCell.sixFaceTwentyFourAngle;
                                            for (var connectionRelation = 0; connectionRelation < 4; ++connectionRelation) {
                                                var NEW = cubeCore_ts_1.getSixFaceTwentyFourAngleRelationTwelveEdge(newSixFaceTwentyFourAngle, connectionRelation);
                                                if (FINDED_TWELVE_EDGES_INDEX_ARRAY.indexOf(NEW) > -1) {
                                                    continue;
                                                }
                                                var OLD = cubeCore_ts_1.getSixFaceTwentyFourAngleRelationTwelveEdge(oldSixFaceTwentyFourAngle, connectionRelation);
                                                FINDED_TWELVE_EDGES_INDEX_ARRAY.push(NEW);
                                                TWELVE_EDGES_NEW_TO_OLD_ARRAY[NEW] = OLD;
                                            }
                                        }
                                    });
                                });
                                twelveEdges.forEach(function (edge, edgeIndex) {
                                    edge.pieces.length = 0;
                                    TWELVE_EDGES_NEW_TO_OLD_ARRAY.forEach(function (oldValue, oldIndex) {
                                        if (oldValue === edgeIndex) {
                                            var OLD_TWELVE_EDGE = OLD_TWELVE_EDGES[oldIndex];
                                            edge.canBeInserted = OLD_TWELVE_EDGE.canBeInserted;
                                            OLD_TWELVE_EDGE.pieces.forEach(function (item) { return edge.pieces.push(item); });
                                        }
                                    });
                                });
                                return cloned;
                            }
                            var fileNo, cubeLinesFileContent, CUBE_COUNT_PER_FILE, CUBES, CUBE_GOAL_FILE_PATH, MANNER_CUBES_GOAL_FILE_PATH, CUBE_LINES_FILE_NAME, sourceFilename, _a, _b, dirEntry, filename, stats, e_2_1;
                            var e_2, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        fileNo = 0;
                                        cubeLinesFileContent = "";
                                        CUBE_COUNT_PER_FILE = 10240 * 3;
                                        CUBES = [];
                                        CUBE_GOAL_FILE_PATH = GOAL_FILE_TOP_PATH + "cubes/";
                                        mod_ts_1.ensureDirSync(CUBE_GOAL_FILE_PATH);
                                        mod_ts_1.emptyDirSync(CUBE_GOAL_FILE_PATH);
                                        MANNER_CUBES_GOAL_FILE_PATH = GOAL_FILE_TOP_PATH + "manners/";
                                        mod_ts_1.ensureDirSync(MANNER_CUBES_GOAL_FILE_PATH);
                                        mod_ts_1.emptyDirSync(MANNER_CUBES_GOAL_FILE_PATH);
                                        CUBE_LINES_FILE_NAME = GOAL_FILE_TOP_PATH + "lines.txt";
                                        sourceFilename = "";
                                        _d.label = 1;
                                    case 1:
                                        _d.trys.push([1, 6, 7, 12]);
                                        _a = __asyncValues(Deno.readDir(SOURCE_FILE_TOP_PATH));
                                        _d.label = 2;
                                    case 2: return [4 /*yield*/, _a.next()];
                                    case 3:
                                        if (!(_b = _d.sent(), !_b.done)) return [3 /*break*/, 5];
                                        dirEntry = _b.value;
                                        filename = path.join(SOURCE_FILE_TOP_PATH, dirEntry.name);
                                        stats = Deno.statSync(filename);
                                        if (stats.isFile) {
                                            sourceFilename = filename;
                                            cubeCore_ts_1.showUsedTime("read file: " + filename);
                                            Deno.readTextFileSync(filename).split("\n").forEach(function (codeLine) {
                                                var cube = cubeCore_ts_1.getCubeFromJson(codeLine);
                                                batchAppendCubeOneToTwentyFour(cube);
                                            });
                                        }
                                        _d.label = 4;
                                    case 4: return [3 /*break*/, 2];
                                    case 5: return [3 /*break*/, 12];
                                    case 6:
                                        e_2_1 = _d.sent();
                                        e_2 = { error: e_2_1 };
                                        return [3 /*break*/, 12];
                                    case 7:
                                        _d.trys.push([7, , 10, 11]);
                                        if (!(_b && !_b.done && (_c = _a["return"]))) return [3 /*break*/, 9];
                                        return [4 /*yield*/, _c.call(_a)];
                                    case 8:
                                        _d.sent();
                                        _d.label = 9;
                                    case 9: return [3 /*break*/, 11];
                                    case 10:
                                        if (e_2) throw e_2.error;
                                        return [7 /*endfinally*/];
                                    case 11: return [7 /*endfinally*/];
                                    case 12:
                                        outputCubes();
                                        return [2 /*return*/];
                                }
                            });
                        }); })()];
                case 1:
                    _a.sent();
                    // copySync(
                    //   `${GOAL_FILE_TOP_PATH}lines.txt`,
                    //   OK_FILE_TOP_PATH,
                    //   OVER_WRITE_TRUE_FLAG,
                    // );
                    cubeCore_ts_1.showUsedTime("end");
                    cubeCore_ts_1.log("end: " + (new Date()).toLocaleString());
                    cubeCore_ts_1.logUsedTime(STEP_FLAG + ": Total", performance.now() - DATE_BEGIN);
                    mod_ts_1.copySync(LOG_FILE_NAME, "log_" + STEP_FLAG + ".txt", OVER_WRITE_TRUE_FLAG);
                    mod_ts_1.copySync(LOG_FILE_NAME, GOAL_FILE_TOP_PATH + "log" + logFilenamePostfix + ".txt", OVER_WRITE_TRUE_FLAG);
                    Deno.removeSync(LOG_FILE_NAME);
                    return [2 /*return*/];
            }
        });
    });
}
function step4(USE_LARGE_FILE, GOAL_FILE_TOP_PATH, SOURCE_FILE_TOP_PATH) {
    if (USE_LARGE_FILE === void 0) { USE_LARGE_FILE = true; }
    if (GOAL_FILE_TOP_PATH === void 0) { GOAL_FILE_TOP_PATH = "./"; }
    if (SOURCE_FILE_TOP_PATH === void 0) { SOURCE_FILE_TOP_PATH = "./"; }
    return __awaiter(this, void 0, void 0, function () {
        var STEP_FLAG, LOG_FILE_NAME, logFilenamePostfix, GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH, DEBUG_FILE_PREFIX, DATE_BEGIN, DEBUG;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    STEP_FLAG = "step4";
                    LOG_FILE_NAME = "./log.txt";
                    if (mod_ts_1.existsSync(LOG_FILE_NAME)) {
                        Deno.removeSync(LOG_FILE_NAME);
                    }
                    logFilenamePostfix = "";
                    logFilenamePostfix = "_" + STEP_FLAG;
                    GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH = GOAL_FILE_TOP_PATH.replace(/[.\/\\]/g, "").length;
                    DEBUG_FILE_PREFIX = GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH
                        ? ""
                        : STEP_FLAG.concat("_");
                    if (GOAL_FILE_TOP_PATH_IS_NOT_CURRENT_PATH) {
                        mod_ts_1.ensureDirSync(GOAL_FILE_TOP_PATH);
                        mod_ts_1.emptyDirSync(GOAL_FILE_TOP_PATH);
                    }
                    cubeCore_ts_1.log("begin: " + (new Date()).toLocaleString());
                    DATE_BEGIN = performance.now();
                    DEBUG = {
                        COMPACT_LINE_INFO_WRITE_COUNT_PER_TIME: 204800,
                        COMPACT_MANNER_FILES_FOR_LARGE_FILE: USE_LARGE_FILE,
                        COMPACT_MANNER_FILES_FOR_LARGE_FILE_OUTPUT_TIMES: 8,
                        OUTPUT_MANNER_BILL_FILE: false,
                        JOIN_CUBE_FILES: !USE_LARGE_FILE
                    };
                    return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                            function compactLineInfo() {
                                logFilenamePostfix += "_compactLineInfo";
                                // 1. lines.txt，将4677537行去重，且列出正方体序号段（不知道为什么最后有不连续的序号），
                                //    转为lineToCubeNo.txt文件，444442222244444422324433234:1-5,8-10
                                var GOAL_FILE_NAME = "" + GOAL_FILE_TOP_PATH + DEBUG_FILE_PREFIX + "lineToCubeNo.txt";
                                var SOURCE_FILE_NAME = SOURCE_FILE_TOP_PATH + "lines.txt";
                                var DATA_ARRAY = Deno.readTextFileSync(SOURCE_FILE_NAME).split("\n");
                                cubeCore_ts_1.showUsedTime("read " + SOURCE_FILE_NAME + " ok");
                                var COMPACT_LINE_INFO_WRITE_COUNT_PER_TIME = DEBUG.COMPACT_LINE_INFO_WRITE_COUNT_PER_TIME;
                                Deno.writeTextFileSync(GOAL_FILE_NAME, "");
                                var lastOne = "";
                                var codes = "";
                                DATA_ARRAY.forEach(function (info, index) {
                                    if (index % COMPACT_LINE_INFO_WRITE_COUNT_PER_TIME === 0 && index) {
                                        Deno.writeTextFileSync(GOAL_FILE_NAME, codes, APPEND_TRUE_FLAG);
                                        codes = "";
                                        cubeCore_ts_1.showUsedTime("ok: " + index);
                                    }
                                    var BEGIN = cubeCore_ts_1.ANGLE_COUNT * index + 1;
                                    // const END = BEGIN + DIFFENT_BETWEEN_BEGIN_AND_END;
                                    if (info === lastOne) {
                                        codes += "|" + BEGIN;
                                    }
                                    else {
                                        codes += "" + (index ? "\n" : "") + info + "\t" + BEGIN;
                                        lastOne = info;
                                    }
                                });
                                Deno.writeTextFileSync(GOAL_FILE_NAME, codes, APPEND_TRUE_FLAG);
                                // 4677537 lines => 247616 lines
                            }
                            function compactMannerFiles() {
                                var e_3, _a;
                                return __awaiter(this, void 0, void 0, function () {
                                    var SOURCE_MANNER_FILE_PATH, readedFileCount, GOAL_FILE_NAME, _b, _c, dirEntry, filename, stats, ARRAY, e_3_1;
                                    return __generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0:
                                                logFilenamePostfix += "_compactMannerFiles";
                                                SOURCE_MANNER_FILE_PATH = SOURCE_FILE_TOP_PATH + "manners/";
                                                readedFileCount = 0;
                                                GOAL_FILE_NAME = GOAL_FILE_TOP_PATH + "manners.txt";
                                                Deno.writeTextFileSync(GOAL_FILE_NAME, "");
                                                _d.label = 1;
                                            case 1:
                                                _d.trys.push([1, 6, 7, 12]);
                                                _b = __asyncValues(Deno.readDir(SOURCE_MANNER_FILE_PATH));
                                                _d.label = 2;
                                            case 2: return [4 /*yield*/, _b.next()];
                                            case 3:
                                                if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 5];
                                                dirEntry = _c.value;
                                                filename = path.join(SOURCE_MANNER_FILE_PATH, dirEntry.name);
                                                stats = Deno.statSync(filename);
                                                if (!stats.isFile) {
                                                    return [3 /*break*/, 4];
                                                }
                                                if ((++readedFileCount) % 100 === 0) {
                                                    cubeCore_ts_1.showUsedTime("readed " + readedFileCount + " files");
                                                }
                                                ARRAY = Deno
                                                    .readTextFileSync(filename)
                                                    .replace(/:/g, "\t")
                                                    .replace(/[\[\]]/g, "")
                                                    .replace(/,/g, "|").split("\n").map(function (line) {
                                                    var _a = line.split("\t"), manner = _a[0], cubeNoBill = _a[1];
                                                    return { manner: manner, cubeNoBill: cubeNoBill };
                                                });
                                                ARRAY.sort(function (prev, next) { return prev.manner.localeCompare(next.manner); });
                                                // console.log("sort it");
                                                Deno.writeTextFileSync(GOAL_FILE_NAME, ARRAY.map(function (_a) {
                                                    var manner = _a.manner, cubeNoBill = _a.cubeNoBill;
                                                    return manner + "\t" + cubeNoBill;
                                                })
                                                    .join("\n"), APPEND_TRUE_FLAG);
                                                _d.label = 4;
                                            case 4: return [3 /*break*/, 2];
                                            case 5: return [3 /*break*/, 12];
                                            case 6:
                                                e_3_1 = _d.sent();
                                                e_3 = { error: e_3_1 };
                                                return [3 /*break*/, 12];
                                            case 7:
                                                _d.trys.push([7, , 10, 11]);
                                                if (!(_c && !_c.done && (_a = _b["return"]))) return [3 /*break*/, 9];
                                                return [4 /*yield*/, _a.call(_b)];
                                            case 8:
                                                _d.sent();
                                                _d.label = 9;
                                            case 9: return [3 /*break*/, 11];
                                            case 10:
                                                if (e_3) throw e_3.error;
                                                return [7 /*endfinally*/];
                                            case 11: return [7 /*endfinally*/];
                                            case 12: return [2 /*return*/];
                                        }
                                    });
                                });
                            }
                            function compactMannerFilesForLargeFile() {
                                var e_4, _a;
                                return __awaiter(this, void 0, void 0, function () {
                                    var SOURCE_MANNER_FILE_PATH, MANNER_ARRAY, CUBE_NO_ARRAY, readedFileCount, mannerCount, _b, _c, dirEntry, filename, stats, SOURCE_ARRAY, SOURCE_COUNT, lineIndex, _d, MANNER, CUBE_NO_BILL, finded, i, e_4_1, MANNER_GOAL_FILE_NAME, WRITE_TIMES, OUTPUT_COUNT_PER_TIME, _loop_11, outputIndex;
                                    return __generator(this, function (_e) {
                                        switch (_e.label) {
                                            case 0:
                                                logFilenamePostfix += "_compactMannerFilesForLargeFile";
                                                SOURCE_MANNER_FILE_PATH = SOURCE_FILE_TOP_PATH + "manners/";
                                                MANNER_ARRAY = [];
                                                CUBE_NO_ARRAY = [];
                                                readedFileCount = 0;
                                                mannerCount = 0;
                                                _e.label = 1;
                                            case 1:
                                                _e.trys.push([1, 6, 7, 12]);
                                                _b = __asyncValues(Deno.readDir(SOURCE_MANNER_FILE_PATH));
                                                _e.label = 2;
                                            case 2: return [4 /*yield*/, _b.next()];
                                            case 3:
                                                if (!(_c = _e.sent(), !_c.done)) return [3 /*break*/, 5];
                                                dirEntry = _c.value;
                                                filename = path.join(SOURCE_MANNER_FILE_PATH, dirEntry.name);
                                                stats = Deno.statSync(filename);
                                                if (stats.isFile) {
                                                    if ((++readedFileCount) % 100 === 0) { // || readedFileCount < 10) {
                                                        cubeCore_ts_1.showUsedTime("readed " + readedFileCount + " files");
                                                    }
                                                    SOURCE_ARRAY = Deno.readTextFileSync(filename)
                                                        .replace(/:/g, "\t")
                                                        .replace(/[\[\]]/g, "")
                                                        .replace(/,/g, "|")
                                                        .split("\n");
                                                    SOURCE_COUNT = SOURCE_ARRAY.length;
                                                    for (lineIndex = 0; lineIndex < SOURCE_COUNT; ++lineIndex) {
                                                        _d = SOURCE_ARRAY[lineIndex].split("\t"), MANNER = _d[0], CUBE_NO_BILL = _d[1];
                                                        finded = false;
                                                        for (i = 0; i < mannerCount; ++i) {
                                                            if (MANNER_ARRAY[i] === MANNER) {
                                                                CUBE_NO_ARRAY[i] += "|".concat(CUBE_NO_BILL);
                                                                finded = true;
                                                                break;
                                                            }
                                                        }
                                                        if (!finded) {
                                                            MANNER_ARRAY.push(MANNER);
                                                            CUBE_NO_ARRAY.push(CUBE_NO_BILL);
                                                            ++mannerCount;
                                                        }
                                                    }
                                                }
                                                _e.label = 4;
                                            case 4: return [3 /*break*/, 2];
                                            case 5: return [3 /*break*/, 12];
                                            case 6:
                                                e_4_1 = _e.sent();
                                                e_4 = { error: e_4_1 };
                                                return [3 /*break*/, 12];
                                            case 7:
                                                _e.trys.push([7, , 10, 11]);
                                                if (!(_c && !_c.done && (_a = _b["return"]))) return [3 /*break*/, 9];
                                                return [4 /*yield*/, _a.call(_b)];
                                            case 8:
                                                _e.sent();
                                                _e.label = 9;
                                            case 9: return [3 /*break*/, 11];
                                            case 10:
                                                if (e_4) throw e_4.error;
                                                return [7 /*endfinally*/];
                                            case 11: return [7 /*endfinally*/];
                                            case 12:
                                                cubeCore_ts_1.showUsedTime("read remaining files");
                                                MANNER_GOAL_FILE_NAME = GOAL_FILE_TOP_PATH + "manners.txt";
                                                Deno.writeTextFileSync(MANNER_GOAL_FILE_NAME, "");
                                                WRITE_TIMES = DEBUG.COMPACT_MANNER_FILES_FOR_LARGE_FILE_OUTPUT_TIMES;
                                                OUTPUT_COUNT_PER_TIME = Math.ceil(MANNER_ARRAY.length / WRITE_TIMES);
                                                _loop_11 = function (outputIndex) {
                                                    var QUARTER_CUBE_NO_ARRAY = CUBE_NO_ARRAY.splice(0, OUTPUT_COUNT_PER_TIME);
                                                    if (outputIndex) {
                                                        Deno.writeTextFileSync(MANNER_GOAL_FILE_NAME, "\n", APPEND_TRUE_FLAG);
                                                    }
                                                    Deno.writeTextFileSync(MANNER_GOAL_FILE_NAME, MANNER_ARRAY.splice(0, OUTPUT_COUNT_PER_TIME).map(function (MANNER, index) {
                                                        return MANNER + "\t" + QUARTER_CUBE_NO_ARRAY[index];
                                                    }).join("\n"), APPEND_TRUE_FLAG);
                                                };
                                                for (outputIndex = 0; outputIndex < WRITE_TIMES; ++outputIndex) {
                                                    _loop_11(outputIndex);
                                                }
                                                cubeCore_ts_1.showUsedTime("output manners.txt");
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            }
                            function outputMannerBillFile() {
                                var e_5, _a;
                                return __awaiter(this, void 0, void 0, function () {
                                    var SOURCE_MANNER_FILE_PATH, readedFileCount, GOAL_FILE_NAME, _b, _c, dirEntry, filename, stats, e_5_1;
                                    return __generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0:
                                                logFilenamePostfix += "_outputMannerBillOfOnlyOneFile";
                                                SOURCE_MANNER_FILE_PATH = SOURCE_FILE_TOP_PATH + "manners/";
                                                readedFileCount = 0;
                                                GOAL_FILE_NAME = GOAL_FILE_TOP_PATH + "mannerBill.txt";
                                                Deno.writeTextFileSync(GOAL_FILE_NAME, "");
                                                _d.label = 1;
                                            case 1:
                                                _d.trys.push([1, 6, 7, 12]);
                                                _b = __asyncValues(Deno.readDir(SOURCE_MANNER_FILE_PATH));
                                                _d.label = 2;
                                            case 2: return [4 /*yield*/, _b.next()];
                                            case 3:
                                                if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 5];
                                                dirEntry = _c.value;
                                                filename = path.join(SOURCE_MANNER_FILE_PATH, dirEntry.name);
                                                stats = Deno.statSync(filename);
                                                if (!stats.isFile) {
                                                    return [3 /*break*/, 4];
                                                }
                                                if ((++readedFileCount) % 100 === 0) {
                                                    cubeCore_ts_1.showUsedTime("readed " + readedFileCount + " files");
                                                }
                                                Deno.writeTextFileSync(GOAL_FILE_NAME, Deno.readTextFileSync(filename)
                                                    // .replace(/:/g, '\t')
                                                    // .replace(/[\[\]]/g, '')
                                                    // .replace(/,/g, '|')
                                                    .split("\n").map(function (line) { return line.split(":")[0]; }).join("\n"), APPEND_TRUE_FLAG);
                                                _d.label = 4;
                                            case 4: return [3 /*break*/, 2];
                                            case 5: return [3 /*break*/, 12];
                                            case 6:
                                                e_5_1 = _d.sent();
                                                e_5 = { error: e_5_1 };
                                                return [3 /*break*/, 12];
                                            case 7:
                                                _d.trys.push([7, , 10, 11]);
                                                if (!(_c && !_c.done && (_a = _b["return"]))) return [3 /*break*/, 9];
                                                return [4 /*yield*/, _a.call(_b)];
                                            case 8:
                                                _d.sent();
                                                _d.label = 9;
                                            case 9: return [3 /*break*/, 11];
                                            case 10:
                                                if (e_5) throw e_5.error;
                                                return [7 /*endfinally*/];
                                            case 11: return [7 /*endfinally*/];
                                            case 12: return [2 /*return*/];
                                        }
                                    });
                                });
                            }
                            function joinMannerFiles() {
                                var e_6, _a;
                                return __awaiter(this, void 0, void 0, function () {
                                    function output() {
                                        var COUNT = MANNER_ARRAY.length;
                                        if (!COUNT) {
                                            return;
                                        }
                                        ++outputFileNo;
                                        Deno.writeTextFileSync("" + GOAL_FILE_PATH + outputFileNo + ".txt", MANNER_ARRAY.join("\n"));
                                        totalCount += COUNT;
                                        MANNER_ARRAY.length = 0;
                                    }
                                    function append(manner) {
                                        MANNER_ARRAY.push(manner);
                                        if (MANNER_ARRAY.length >= 1048000) {
                                            output();
                                        }
                                    }
                                    var SOURCE_MANNER_FILE_PATH, readedFileCount, GOAL_FILE_PATH, MANNER_ARRAY, outputFileNo, totalCount, _b, _c, dirEntry, filename, stats, e_6_1;
                                    return __generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0:
                                                SOURCE_MANNER_FILE_PATH = SOURCE_FILE_TOP_PATH + "manners/";
                                                readedFileCount = 0;
                                                GOAL_FILE_PATH = GOAL_FILE_TOP_PATH + "joinedManners/";
                                                mod_ts_1.ensureDirSync(GOAL_FILE_PATH);
                                                mod_ts_1.emptyDirSync(GOAL_FILE_PATH);
                                                MANNER_ARRAY = [];
                                                outputFileNo = 0;
                                                totalCount = 0;
                                                _d.label = 1;
                                            case 1:
                                                _d.trys.push([1, 6, 7, 12]);
                                                _b = __asyncValues(Deno.readDir(SOURCE_MANNER_FILE_PATH));
                                                _d.label = 2;
                                            case 2: return [4 /*yield*/, _b.next()];
                                            case 3:
                                                if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 5];
                                                dirEntry = _c.value;
                                                filename = path.join(SOURCE_MANNER_FILE_PATH, dirEntry.name);
                                                stats = Deno.statSync(filename);
                                                if (!stats.isFile) {
                                                    return [3 /*break*/, 4];
                                                }
                                                if ((++readedFileCount) % 100 === 0) {
                                                    cubeCore_ts_1.showUsedTime("readed " + readedFileCount + " files");
                                                }
                                                Deno.readTextFileSync(filename).split("\n").forEach(function (line) {
                                                    return append(line.split(":")[0]);
                                                });
                                                _d.label = 4;
                                            case 4: return [3 /*break*/, 2];
                                            case 5: return [3 /*break*/, 12];
                                            case 6:
                                                e_6_1 = _d.sent();
                                                e_6 = { error: e_6_1 };
                                                return [3 /*break*/, 12];
                                            case 7:
                                                _d.trys.push([7, , 10, 11]);
                                                if (!(_c && !_c.done && (_a = _b["return"]))) return [3 /*break*/, 9];
                                                return [4 /*yield*/, _a.call(_b)];
                                            case 8:
                                                _d.sent();
                                                _d.label = 9;
                                            case 9: return [3 /*break*/, 11];
                                            case 10:
                                                if (e_6) throw e_6.error;
                                                return [7 /*endfinally*/];
                                            case 11: return [7 /*endfinally*/];
                                            case 12:
                                                output();
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            }
                            function joinCubeFiles() {
                                var e_7, _a;
                                return __awaiter(this, void 0, void 0, function () {
                                    var SOURCE_MANNER_FILE_PATH, CUBE_GOAL_FILE_NAME, readedFileCount, _b, _c, dirEntry, filename, stats, e_7_1;
                                    return __generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0:
                                                logFilenamePostfix += "_joinCubeFiles";
                                                SOURCE_MANNER_FILE_PATH = SOURCE_FILE_TOP_PATH + "cubes/";
                                                CUBE_GOAL_FILE_NAME = "" + GOAL_FILE_TOP_PATH + DEBUG_FILE_PREFIX + "cubes.txt";
                                                Deno.writeTextFileSync(CUBE_GOAL_FILE_NAME, "");
                                                readedFileCount = 0;
                                                _d.label = 1;
                                            case 1:
                                                _d.trys.push([1, 6, 7, 12]);
                                                _b = __asyncValues(Deno.readDir(SOURCE_MANNER_FILE_PATH));
                                                _d.label = 2;
                                            case 2: return [4 /*yield*/, _b.next()];
                                            case 3:
                                                if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 5];
                                                dirEntry = _c.value;
                                                filename = path.join(SOURCE_MANNER_FILE_PATH, dirEntry.name);
                                                stats = Deno.statSync(filename);
                                                if (!stats.isFile) {
                                                    return [3 /*break*/, 4];
                                                }
                                                if ((++readedFileCount) % 100 === 0) { // || readedFileCount < 10) {
                                                    cubeCore_ts_1.showUsedTime("readed " + readedFileCount + " files");
                                                }
                                                Deno.writeTextFileSync(CUBE_GOAL_FILE_NAME, Deno.readTextFileSync(filename), APPEND_TRUE_FLAG);
                                                _d.label = 4;
                                            case 4: return [3 /*break*/, 2];
                                            case 5: return [3 /*break*/, 12];
                                            case 6:
                                                e_7_1 = _d.sent();
                                                e_7 = { error: e_7_1 };
                                                return [3 /*break*/, 12];
                                            case 7:
                                                _d.trys.push([7, , 10, 11]);
                                                if (!(_c && !_c.done && (_a = _b["return"]))) return [3 /*break*/, 9];
                                                return [4 /*yield*/, _a.call(_b)];
                                            case 8:
                                                _d.sent();
                                                _d.label = 9;
                                            case 9: return [3 /*break*/, 11];
                                            case 10:
                                                if (e_7) throw e_7.error;
                                                return [7 /*endfinally*/];
                                            case 11: return [7 /*endfinally*/];
                                            case 12: return [2 /*return*/];
                                        }
                                    });
                                });
                            }
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        // step3/lines.txt => step4/lineToCubeNo.txt
                                        compactLineInfo();
                                        if (!DEBUG.COMPACT_MANNER_FILES_FOR_LARGE_FILE) return [3 /*break*/, 3];
                                        // step3/manners/*.txt => step4/manners.txt
                                        return [4 /*yield*/, compactMannerFilesForLargeFile()];
                                    case 1:
                                        // step3/manners/*.txt => step4/manners.txt
                                        _a.sent();
                                        // step3/manners/*.txt => step4/joinedManners/*.txt
                                        return [4 /*yield*/, joinMannerFiles()];
                                    case 2:
                                        // step3/manners/*.txt => step4/joinedManners/*.txt
                                        _a.sent();
                                        return [3 /*break*/, 5];
                                    case 3: 
                                    // step3/manners/*.txt => step4/manners.txt
                                    return [4 /*yield*/, compactMannerFiles()];
                                    case 4:
                                        // step3/manners/*.txt => step4/manners.txt
                                        _a.sent();
                                        _a.label = 5;
                                    case 5:
                                        if (!DEBUG.OUTPUT_MANNER_BILL_FILE) return [3 /*break*/, 7];
                                        // step3/manners/*.txt => step4/mannerBill.txt
                                        return [4 /*yield*/, outputMannerBillFile()];
                                    case 6:
                                        // step3/manners/*.txt => step4/mannerBill.txt
                                        _a.sent();
                                        _a.label = 7;
                                    case 7:
                                        if (!DEBUG.JOIN_CUBE_FILES) return [3 /*break*/, 9];
                                        return [4 /*yield*/, joinCubeFiles()];
                                    case 8:
                                        _a.sent();
                                        _a.label = 9;
                                    case 9: return [2 /*return*/];
                                }
                            });
                        }); })()];
                case 1:
                    _a.sent();
                    cubeCore_ts_1.showUsedTime("end");
                    cubeCore_ts_1.log("end: " + (new Date()).toLocaleString());
                    cubeCore_ts_1.logUsedTime(STEP_FLAG + ": Total", performance.now() - DATE_BEGIN);
                    mod_ts_1.copySync(LOG_FILE_NAME, "log_" + STEP_FLAG + ".txt", OVER_WRITE_TRUE_FLAG);
                    mod_ts_1.copySync(LOG_FILE_NAME, GOAL_FILE_TOP_PATH + "log" + logFilenamePostfix + ".txt", OVER_WRITE_TRUE_FLAG);
                    Deno.removeSync(LOG_FILE_NAME);
                    return [2 /*return*/];
            }
        });
    });
}
function main(options, ROW_COUNT_ARRAY) {
    if (ROW_COUNT_ARRAY === void 0) { ROW_COUNT_ARRAY = [2]; }
    return __awaiter(this, void 0, void 0, function () {
        var GLOBAL_LOG_CONTENT_ARRAY, DATE_BEGIN, step1Option, step2Option, step3Option, step4Option;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    GLOBAL_LOG_CONTENT_ARRAY = [];
                    GLOBAL_LOG_CONTENT_ARRAY.push("begin: " + (new Date()).toLocaleString());
                    DATE_BEGIN = performance.now();
                    step1Option = options.step1Option, step2Option = options.step2Option, step3Option = options.step3Option, step4Option = options.step4Option;
                    // useless:
                    // console.log("\n");
                    // log("\n");
                    if (!(step1Option === null || step1Option === void 0 ? void 0 : step1Option.skipped)) {
                        GLOBAL_LOG_CONTENT_ARRAY.push("step1: " + (new Date()).toLocaleString());
                        step1(ROW_COUNT_ARRAY, step1Option === null || step1Option === void 0 ? void 0 : step1Option.GOAL_FILE_TOP_PATH, step1Option === null || step1Option === void 0 ? void 0 : step1Option.OUTPUT_CUT_MANNERS_ROW_BY_ROW);
                    }
                    if (!!(step2Option === null || step2Option === void 0 ? void 0 : step2Option.skipped)) return [3 /*break*/, 2];
                    GLOBAL_LOG_CONTENT_ARRAY.push("step2: " + (new Date()).toLocaleString());
                    return [4 /*yield*/, step2(ROW_COUNT_ARRAY, step2Option === null || step2Option === void 0 ? void 0 : step2Option.GOAL_FILE_TOP_PATH, step2Option === null || step2Option === void 0 ? void 0 : step2Option.SOURCE_FILE_TOP_PATH, step2Option === null || step2Option === void 0 ? void 0 : step2Option.OUTPUT_ALONE_FIRST_CUBE, step2Option === null || step2Option === void 0 ? void 0 : step2Option.OUTPUT_CUBE_PASS_CHECK_FACES_LAYER_INDEX, step2Option === null || step2Option === void 0 ? void 0 : step2Option.OUTPUT_FIX_HIDDEN_PIECES, step2Option === null || step2Option === void 0 ? void 0 : step2Option.OUTPUT_MIDDLE_CUBE_TO_FIRST_NO, step2Option === null || step2Option === void 0 ? void 0 : step2Option.OUTPUT_CHECK_FACES_LAYER_INDEX_FAILED, step2Option === null || step2Option === void 0 ? void 0 : step2Option.OUTPUT_FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT, step2Option === null || step2Option === void 0 ? void 0 : step2Option.OUTPUT_FIX_LONELY_FACE_OF_CUBE)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!!(step3Option === null || step3Option === void 0 ? void 0 : step3Option.skipped)) return [3 /*break*/, 4];
                    GLOBAL_LOG_CONTENT_ARRAY.push("step3: " + (new Date()).toLocaleString());
                    return [4 /*yield*/, step3(step3Option === null || step3Option === void 0 ? void 0 : step3Option.GOAL_FILE_TOP_PATH, step3Option === null || step3Option === void 0 ? void 0 : step3Option.SOURCE_FILE_TOP_PATH, step3Option === null || step3Option === void 0 ? void 0 : step3Option.OUTPUT_FULL_CUBE, step3Option === null || step3Option === void 0 ? void 0 : step3Option.OUTPUT_READ_CUBE)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    if (!!(step4Option === null || step4Option === void 0 ? void 0 : step4Option.skipped)) return [3 /*break*/, 6];
                    GLOBAL_LOG_CONTENT_ARRAY.push("step4: " + (new Date()).toLocaleString());
                    return [4 /*yield*/, step4(step4Option === null || step4Option === void 0 ? void 0 : step4Option.USE_LARGE_FILE, step4Option === null || step4Option === void 0 ? void 0 : step4Option.GOAL_FILE_TOP_PATH, step4Option === null || step4Option === void 0 ? void 0 : step4Option.SOURCE_FILE_TOP_PATH)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    if (mod_ts_1.existsSync(LOG_FILE_NAME)) {
                        Deno.removeSync(LOG_FILE_NAME);
                    }
                    GLOBAL_LOG_CONTENT_ARRAY.push("  end: " + (new Date()).toLocaleString());
                    cubeCore_ts_1.log(GLOBAL_LOG_CONTENT_ARRAY.join("\n"));
                    cubeCore_ts_1.logUsedTime("Total", performance.now() - DATE_BEGIN);
                    return [2 /*return*/];
            }
        });
    });
}
exports.main = main;
/*
set pwd=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\

cls && deno lint %pwd%\cubeCompute.ts && deno fmt %pwd%\cubeCompute.ts

cd /d C:\__cube\240507A\

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\cubeCompute.ts
deno run --v8-flags=--max-old-space-size=20480 -A %pwd%\cubeCompute.ts

cls && deno lint %pwd%\cubeCompute.ts
cls && deno run --v8-flags=--max-old-space-size=20480 -A %pwd%\cubeCompute.ts

*/
