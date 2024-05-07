"use strict";
/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * src\cubeCompute6_step2.ts v0.0.1
 * deno 1.42.1 + VSCode 1.88.0
 *
 * <en_us>
 * Created on Sat Apr 27 2024 23:35:47
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年4月27日 23:35:47
 * 功能：从第一步所获取的中间正方体开始，生成未进行1转24的正方体
 * 缺陷：部分正方体无法直接裁剪与粘贴出来，因其违背物理规律
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年4月27日 23:35:47
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
// https://www.cnblogs.com/livelab/p/14111142.html
var mod_ts_1 = require("https://deno.land/std/fs/mod.ts"); // copy
var path = require("https://deno.land/std/path/mod.ts");
var cubeCore_ts_1 = require("./cubeCore.ts");
var STEP_FLAG = "step2";
var LOG_FILE_NAME = "./log.txt";
if (mod_ts_1.existsSync(LOG_FILE_NAME)) {
    Deno.removeSync(LOG_FILE_NAME);
}
var logFilenamePostfix = "";
logFilenamePostfix = "_" + STEP_FLAG;
var GOAL_FILE_TOP_PATH = "./" + STEP_FLAG + "/";
mod_ts_1.ensureDirSync(GOAL_FILE_TOP_PATH);
mod_ts_1.emptyDirSync(GOAL_FILE_TOP_PATH);
cubeCore_ts_1.log("begin: " + (new Date()).toLocaleString());
var DATE_BEGIN = performance.now();
var SOURCE_FILE_TOP_PATH = "./step1/";
var COL_COUNT = 5;
var MAX_COL_INDEX = COL_COUNT - 1;
var CUBE_NO_STEP = 24;
var DEBUG = {
    // false true
    CUBE_COUNT_PER_FILE: 10240,
    SHOW_MIDDLE_CUBE_CONVERT_INFO: false
};
await(function () { return __awaiter(void 0, void 0, void 0, function () {
    function batchAppendCube(cubeOriginal) {
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
                                    if (twelveEdge.pieces.length) {
                                        twelveEdge.canBeInserted = true;
                                        return;
                                    }
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
                                var sixFaceTwentyFourAngleOfSixFaceOutestCellArray = [];
                                sixFaceOutestCellArray.forEach(function (cell) {
                                    sixFaceTwentyFourAngleOfSixFaceOutestCellArray.push(cubeCore_ts_1.convertSixFaceAndDirectionToSixFaceTwentyFourAngle(cell.sixFace, cell.faceDirection));
                                });
                                // const [
                                // 	upFaceOutestCellSixFaceTwentyFourAngle,
                                // 	downFaceOutestCellSixFaceTwentyFourAngle,
                                // 	leftFaceOutestCellSixFaceTwentyFourAngle,
                                // 	rightFaceOutestCellSixFaceTwentyFourAngle,
                                // 	frontFaceOutestCellSixFaceTwentyFourAngle,
                                // 	backFaceOutestCellSixFaceTwentyFourAngle,
                                // ] = sixFaceTwentyFourAngleOfSixFaceOutestCellArray;
                                // [upFaceOutestCell]
                                sixFaceOutestCellArray.forEach(function (cell, cellIndex) {
                                    cell.borderLines.forEach(function (borderLine, borderLineIndex) {
                                        if (borderLine !== cubeCore_ts_1.CellBorderLine.InnerLine) {
                                            var twelveEdgeIndex = cubeCore_ts_1.getSixFaceTwentyFourAngleRelationTwelveEdge(
                                            // upFaceOutestCellSixFaceTwentyFourAngle,
                                            sixFaceTwentyFourAngleOfSixFaceOutestCellArray[cellIndex], borderLineIndex);
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
                                        // 复位“面属性”
                                        pieceCell.sixFace = cubeCore_ts_1.SixFace.Up;
                                        pieceCell.faceDirection = cubeCore_ts_1.FourDirection.Original;
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
                                appendCubeWithoutOneToTwentyFour(cloned);
                            });
                        });
                    });
                });
            });
        });
        // log(`call times: ${times}`);
    }
    function appendCubeWithoutOneToTwentyFour(cube) {
        nextCubeNo += CUBE_NO_STEP;
        cube.no = nextCubeNo;
        CUBES.push(cube);
        if (CUBES.length >= DEBUG.CUBE_COUNT_PER_FILE) {
            outputCubes();
        }
    }
    function outputCubes() {
        if (!CUBES.length) {
            return;
        }
        var GOAL_FILE_NAME = "" + GOAL_FILE_TOP_PATH + (++fileNo).toString().padStart(6, "0") + ".txt";
        Deno.writeTextFileSync(GOAL_FILE_NAME, CUBES.map(function (cube) { return JSON.stringify(cube); }).join("\n"));
        CUBES.length = 0;
        cubeCore_ts_1.showUsedTime("output " + GOAL_FILE_NAME);
    }
    var fileNo, nextCubeNo, CUBES, rowCountLoop, ROW_COUNT, SOURCE_FILE_PATH, _a, _b, dirEntry, filename, stats, e_1_1;
    var e_1, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                fileNo = 0;
                nextCubeNo = 1 - CUBE_NO_STEP;
                CUBES = [];
                rowCountLoop = 2;
                _d.label = 1;
            case 1:
                if (!(rowCountLoop <= 3)) return [3 /*break*/, 14];
                ROW_COUNT = rowCountLoop;
                SOURCE_FILE_PATH = "" + SOURCE_FILE_TOP_PATH + ROW_COUNT + "rows_" + COL_COUNT + "cols/";
                _d.label = 2;
            case 2:
                _d.trys.push([2, 7, 8, 13]);
                _a = (e_1 = void 0, __asyncValues(Deno.readDir(SOURCE_FILE_PATH)));
                _d.label = 3;
            case 3: return [4 /*yield*/, _a.next()];
            case 4:
                if (!(_b = _d.sent(), !_b.done)) return [3 /*break*/, 6];
                dirEntry = _b.value;
                filename = path.join(SOURCE_FILE_PATH, dirEntry.name);
                stats = Deno.statSync(filename);
                if (stats.isFile) {
                    console.log(filename);
                    Deno.readTextFileSync(filename).split("\n").forEach(function (codeLine) {
                        batchAppendCube(cubeCore_ts_1.getCubeFromJson(codeLine));
                    });
                }
                _d.label = 5;
            case 5: return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 13];
            case 7:
                e_1_1 = _d.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 13];
            case 8:
                _d.trys.push([8, , 11, 12]);
                if (!(_b && !_b.done && (_c = _a["return"]))) return [3 /*break*/, 10];
                return [4 /*yield*/, _c.call(_a)];
            case 9:
                _d.sent();
                _d.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 12: return [7 /*endfinally*/];
            case 13:
                ++rowCountLoop;
                return [3 /*break*/, 1];
            case 14:
                outputCubes();
                return [2 /*return*/];
        }
    });
}); })();
cubeCore_ts_1.showUsedTime("end");
cubeCore_ts_1.log("end: " + (new Date()).toLocaleString());
cubeCore_ts_1.logUsedTime("Total", performance.now() - DATE_BEGIN);
mod_ts_1.copySync(LOG_FILE_NAME, "log_" + STEP_FLAG + ".txt", { overwrite: true });
mod_ts_1.copySync(LOG_FILE_NAME, GOAL_FILE_TOP_PATH + "log" + logFilenamePostfix + ".txt", {
    overwrite: true
});
Deno.removeSync(LOG_FILE_NAME);
/*
cd /d C:\__cube\240507A\
set pwd=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\

cls && deno lint %pwd%\cubeCompute6_step2.ts && deno fmt %pwd%\cubeCompute6_step2.ts

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\cubeCompute6_step2.ts

deno run --v8-flags=--max-old-space-size=20480 -A %pwd%\cubeCompute6_step2.ts

*/
