"use strict";
/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * src\cubeCompute6_step4.ts v0.0.1
 * deno 1.42.1 + VSCode 1.88.0
 *
 * <en_us>
 * Created on Sun Apr 29 2024 08:47:00
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年4月29日 08:47:00
 * 功能：从第二步正方体（已拆解剪切与粘贴方案，但未1转24），1转24，写入：
 *       1. 每种拼插方案对应的正方体编号清单（以拼插方案命名），回车符分隔
 *          最大编号112260888，最多11,2260,8880字数据，约11亿字
 *       2. 每24个正方体（以1转24的第一个计算）一组，计算纸模完整横纵线，回车符分隔
 *          1）两行五列则15=5*(2+1)横12=(5+1)*2纵共27线；
 *          2）三行五列则20=5*(3+1)横18=(5+1)*3纵共38线。
 *          最大编号112260888，4677537组，最多1,8242,3943字数据，约2亿字
 *       3. 输出压缩后的正方体信息（正方体间以回车符分隔，4位一格，16进制）：
 *          1）1位：格序（1位，0-15，16进制0-E）
 *          2）1位：功能（1位，2-3，2面3片，减2乘6）+层序（1位，1-6转0-5），转1位16进制
 *          3）1位：面序或片序——面序0-5，片序0-11，转1位十六进制
 *          4）1位：方向序，0-3
 *          最多4*15+1=61位一个，最大编号112260888，最多68,4791,4168字数据，约68亿字，
 *          不确定是否19G左右
 *       4. 最终数据量约100亿字，预计20-30G
 * 缺陷：当前生成第二步的正方体时，未移除不符合物理规律的正方体（因还没想出相应算法）
 * 注意：本代码用于打补丁，因此仅处理部分文件，且仅处理第三项
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年4月29日 08:47:00
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
exports.__esModule = true;
// https://www.cnblogs.com/livelab/p/14111142.html
var mod_ts_1 = require("https://deno.land/std/fs/mod.ts"); // copy
var path = require("https://deno.land/std/path/mod.ts");
var cubeCore_ts_1 = require("./cubeCore.ts");
var floor = Math.floor;
var STEP_FLAG = "step4";
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
var SOURCE_FILE_TOP_PATH = "./step2/";
var COL_COUNT = 5;
var MAX_COL_INDEX = COL_COUNT - 1;
var APPEND_TRUE_FLAG = { append: true };
var EMPTY_OBJECT = {};
//  同一方案24个角度
var MANNER_COUNT = cubeCore_ts_1.ANGLE_COUNT;
var SIMPLE_MANNER_ARRAY = [];
var SIMPLE_DATA_ARRAY = [];
await(function () { return __awaiter(void 0, void 0, void 0, function () {
    function batchAppendCubeOneToTwentyFour(cube) {
        var CORE_ROW_INDEX = cube.coreRowIndex, CORE_COL_INDEX = cube.coreColIndex;
        var OLD_SIX_FACES = cube.sixFaces, OLD_TWELVE_EDGES = cube.twelveEdges, OLD_CELLS = cube.cells, START_NO = cube.no, rowCount = cube.rowCount, colCount = cube.colCount, gridLines = cube.gridLines;
        // { xStart, xEnd, yStart, yEnd, lineStyle }
        // GridLineStyle: Unknown, None, InnerLine, CutLine, OuterLine
        // const LINE_ARRAY: number[] = [];
        // for (let rowIndexLoop = 0; rowIndexLoop <= rowCount; ++rowIndexLoop) {
        // for (let colIndexLoop = 0; colIndexLoop < colCount; ++colIndexLoop) {
        // LINE_ARRAY.push(1);
        // }
        // }
        // const VERTICAL_LINE_INDEX_OFFSET = LINE_ARRAY.length;
        // for (let rowIndexLoop = 0; rowIndexLoop < rowCount; ++rowIndexLoop) {
        // for (let colIndexLoop = 0; colIndexLoop <= colCount; ++colIndexLoop) {
        // LINE_ARRAY.push(1);
        // }
        // }
        // gridLines.forEach(({ xStart, xEnd, yStart, yEnd, lineStyle }) => {
        // if (yStart === yEnd) {
        // LINE_ARRAY[colCount * yStart + xStart] = lineStyle;
        // } else {
        // LINE_ARRAY[VERTICAL_LINE_INDEX_OFFSET + (colCount + 1) * yStart + xStart] = lineStyle;
        // }
        // });
        // cubeLinesFileContent += (cubeLinesFileContent.length ? '\n' : '').concat(LINE_ARRAY.join(''));
        var MAX_ADD_ORDER = cube.actCells.map(function (cell) { return cell.addOrder; }).sort().reverse()[0];
        var CORE_CELL_IS_PIECE = OLD_CELLS[CORE_ROW_INDEX][CORE_COL_INDEX].feature === cubeCore_ts_1.CellFeature.Piece;
        for (var mannerIndex = 0; mannerIndex < MANNER_COUNT; ++mannerIndex) {
            var cloned = getClonedCubeByMannerIndex(cube, mannerIndex, OLD_SIX_FACES, OLD_TWELVE_EDGES, OLD_CELLS, MAX_ADD_ORDER, CORE_CELL_IS_PIECE);
            cloned.no = START_NO + mannerIndex;
            cloned.syncAndClear();
            cloned.cells = undefined;
            cloned.isValid = undefined;
            cloned.emptyCells = undefined;
            cloned.colCount = undefined;
            cloned.coreRowIndex = undefined;
            var MANNER = cloned.twelveEdges.map(function (twelveEdge) {
                return "" + (twelveEdge.canBeInserted ? "T" : "F") + twelveEdge.pieces.length;
            }).join("");
            cloned["manner"] = MANNER;
            appendCube(cloned);
        }
    }
    function appendCube(cube) {
        CUBES.push(cube);
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
        // const MANNER_CUBES_ARRAY = [];
        // const MANNER_ARRAY = [];
        // CUBES.forEach((cube) => {
        // const { manner, no } = cube;
        // cube['manner'] = undefined;
        // const OLD_INDEX = MANNER_ARRAY.indexOf(manner);
        // if (OLD_INDEX === -1) {
        // MANNER_ARRAY.push(manner);
        // MANNER_CUBES_ARRAY.push([no]);
        // } else {
        // MANNER_CUBES_ARRAY[OLD_INDEX].push(no);
        // }
        // });
        // Deno.writeTextFileSync(
        // `${MANNER_CUBES_GOAL_FILE_PATH}${filenamePostfix}`,
        // MANNER_CUBES_ARRAY.map((noArray, index) => `${MANNER_ARRAY[index]}:[${noArray.join(',')}]`)
        // .join('\n'),
        // );
        // MANNER_CUBES_ARRAY.length = 0;
        // MANNER_ARRAY.length = 0;
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
        // no,
        // cellIndex,
        // layerIndex,
        // feature,
        // sixFace,
        // faceDirection,
        // twelveEdge,
        // }) =>
        // // `${cellIndex.toString(16)}${
        // // (parseInt(`${(feature - 2) * 6 + (layerIndex - 1)}`)).toString(16)
        // // }${feature === 2 ? `${sixFace}` : `${twelveEdge.toString(16)}`}${faceDirection}`
        // {
        // if(!('toString' in cellIndex)) {
        // console.log(`${no}.cellIndex:${cellIndex}`);
        // return '';
        // }
        // if(feature === 3 && !('toString' in twelveEdge)) {
        // console.log(`${no}.twelveEdge:${twelveEdge}`);
        // return '';
        // }
        // const FEATURE_AND_LAYERINDEX = parseInt('' + ((feature - 2) * 6 + (layerIndex - 1)));
        // if(!('toString' in FEATURE_AND_LAYERINDEX)) {
        // console.log(`${no}.featureAndLayerindex:${FEATURE_AND_LAYERINDEX}`);
        // return '';
        // }
        // return
        // `${cellIndex.toString(16)}${(FEATURE_AND_LAYERINDEX).toString(16)}${feature === 2 ? `${sixFace}` : `${twelveEdge.toString(16)}`}${faceDirection}`;
        // }
        // ).join('')
        // ).join('\n')
        // );
        // } catch (error) {
        // console.error('[error]', sourceFilename, filenamePostfix, error);
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
                                twelveEdge = cubeCore_ts_1.getSixFaceTwentyFourAngleRelationTwelveEdge(RELATION_CELL.sixFaceTwentyFourAngle, relation % 2 === 0 ? (2 - relation) : 1 + floor(relation / 2));
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
        // // 2. 每24个正方体（以1转24的第一个计算）一组，计算纸模完整横纵线，回车符分隔
        // //    1）两行五列则15=5*(2+1)横12=(5+1)*2纵共27线；
        // //    2）三行五列则20=5*(3+1)横18=(5+1)*3纵共38线。
        // //    最大编号112260888，4677537组，最多1,8242,3943字数据，约2亿字
        // Deno.writeTextFileSync(
        // CUBE_LINES_FILE_NAME,
        // (fileNo === 1 ? '' : '\n').concat(cubeLinesFileContent),
        // APPEND_TRUE_FLAG,
        // );
        // cubeLinesFileContent = '';
        CUBES.length = 0;
    }
    function getClonedCubeByMannerIndex(cube, mannerIndex, OLD_SIX_FACES, OLD_TWELVE_EDGES, OLD_CELLS, MAX_ADD_ORDER, CORE_CELL_IS_PIECE) {
        var CORE_ROW_INDEX = cube.coreRowIndex, CORE_COL_INDEX = cube.coreColIndex;
        var cloned = cube.clone();
        var cells = cloned.cells, actCells = cloned.actCells, sixFaces = cloned.sixFaces, twelveEdges = cloned.twelveEdges;
        var _a = cubeCore_ts_1.convertSixFaceTwentyFourAngleToSixFaceAndDirection(mannerIndex), CORE_CELL_SIX_FACE = _a[0], CORE_CELL_FOUR_DIRECTION = _a[1];
        var CORE_CELL = cells[CORE_ROW_INDEX][CORE_COL_INDEX];
        CORE_CELL.sixFace = CORE_CELL_SIX_FACE;
        CORE_CELL.faceDirection = CORE_CELL_FOUR_DIRECTION;
        var _loop_1 = function (addOrder) {
            cells.forEach(function (cellRow) {
                return cellRow.filter(function (cell) { return cell.addOrder === addOrder; }).forEach(function (cell) {
                    var _a = cell.relatedInformationWhenAdding, rowIndex = _a.rowIndex, colIndex = _a.colIndex, RELATION = _a.relation;
                    var RELATED_CELL = cells[rowIndex][colIndex];
                    var _b = cubeCore_ts_1.convertSixFaceTwentyFourAngleToSixFaceAndDirection(cubeCore_ts_1.SIX_FACE_AND_DIRECTION_RELATIONS[RELATED_CELL.sixFaceTwentyFourAngle][RELATION]), newSixFace = _b[0], newFaceDirection = _b[1];
                    cell.sixFace = newSixFace;
                    cell.faceDirection = newFaceDirection;
                });
            });
        };
        for (var addOrder = 2; addOrder <= MAX_ADD_ORDER; ++addOrder) {
            _loop_1(addOrder);
        }
        if (CORE_CELL_IS_PIECE) {
            var _b = actCells.filter(function (cell) {
                return cell.addOrder === 2;
            })[0], rowIndex = _b.rowIndex, colIndex = _b.colIndex;
            var RELATED_CELL = cells[rowIndex][colIndex];
            var RELATION = RELATED_CELL.relatedInformationWhenAdding.relation;
            CORE_CELL.twelveEdge = cubeCore_ts_1.getSixFaceTwentyFourAngleRelationTwelveEdge(RELATED_CELL.sixFaceTwentyFourAngle, 2 - RELATION % 2 + 2 * floor(RELATION / 2));
        }
        sixFaces.forEach(function (face, faceIndex) {
            face.length = 0;
            OLD_SIX_FACES.forEach(function (oldFaces) {
                if (oldFaces.length === 0) {
                    Deno.writeTextFileSync(GOAL_FILE_TOP_PATH + "error_cube_" + cube.no + ".ts", "const _error_cube = " + JSON.stringify(cube) + ";");
                }
                var _a = oldFaces[0], rowIndex = _a[0], colIndex = _a[1];
                if (cells[rowIndex][colIndex].sixFace === faceIndex) {
                    oldFaces.forEach(function (item) { return face.push(item); });
                }
            });
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
    var fileNo, CUBE_COUNT_PER_FILE, CUBES, CUBE_GOAL_FILE_PATH, CUBE_LINES_FILE_NAME, sourceFilename;
    return __generator(this, function (_a) {
        fileNo = 0;
        CUBE_COUNT_PER_FILE = 10240 * 3;
        CUBES = [];
        CUBE_GOAL_FILE_PATH = GOAL_FILE_TOP_PATH + "cubes/";
        mod_ts_1.ensureDirSync(CUBE_GOAL_FILE_PATH);
        mod_ts_1.emptyDirSync(CUBE_GOAL_FILE_PATH);
        CUBE_LINES_FILE_NAME = GOAL_FILE_TOP_PATH + "lines.txt";
        sourceFilename = "";
        // for await (const dirEntry of Deno.readDir(SOURCE_FILE_TOP_PATH)) {
        // const filename = path.join(SOURCE_FILE_TOP_PATH, dirEntry.name);
        // const stats = Deno.statSync(filename);
        // if (stats.isFile) {
        // sourceFilename = filename;
        // showUsedTime(`read file: ${filename}`);
        // Deno.readTextFileSync(filename).split('\n').forEach((codeLine) => {
        // const cube = getCubeFromJson(codeLine);
        // batchAppendCubeOneToTwentyFour(cube);
        // });
        // }
        // }
        // [25,26]
        [
            25,
            26,
            27,
            28,
            29,
            30,
            32,
            33,
            35,
            37,
            39,
            41,
            42,
            43,
            44,
            45,
            46,
            47,
            48,
            49,
            50,
            51,
            52,
            53,
            54,
            86,
            87,
            88,
            91,
            92,
            93,
            95,
            96,
            98,
            99,
            101,
            102,
            103,
            105,
            106,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            127,
            134,
            135,
            136,
            138,
            143,
            144,
            145,
            150,
            151,
            153,
            154,
            156,
            157,
            160,
            161,
            162,
            163,
            164,
            165,
            166,
            168,
            169,
            171,
            172,
            173,
            174,
            175,
            177,
            178,
            180,
            181,
            182,
            183,
            184,
            185,
            186,
            187,
            200,
            208,
            209,
            210,
            217,
            218,
            219,
            224,
            225,
            227,
            228,
            229,
            230,
            231,
            235,
            236,
            238,
            240,
            241,
            244,
            245,
            246,
            248,
            249,
            250,
            280,
            281,
            282,
            283,
            284,
            285,
            286,
            287,
            288,
            289,
            291,
            292,
            293,
            295,
            297,
            298,
            299,
            300,
            301,
            302,
            303,
            304,
            305,
            306,
            308,
            309,
            310,
            311,
            343,
            344,
            347,
            348,
            350,
            351,
            352,
            353,
            354,
            358,
            359,
            361,
            362,
            363,
            364,
            365,
            366,
            367,
            368,
            371,
            372,
            382,
            387,
            388,
            389,
            395,
            396,
            400,
            401,
            402,
            403,
            404,
            405,
            407,
            408,
            409,
            410,
            411,
            412,
            415,
            416,
            417,
            418,
            419,
            420,
            421,
            422,
            423,
            424,
            425,
            426,
            434,
            435,
            439,
            440,
            444,
            445,
            446,
            451,
            453,
            455,
        ]
            .forEach(function (sourceFileNo) {
            fileNo = 8 * (sourceFileNo - 1);
            sourceFilename = path.join(SOURCE_FILE_TOP_PATH, sourceFileNo.toString().padStart(6, "0") + ".txt");
            cubeCore_ts_1.showUsedTime("read file: " + sourceFilename);
            Deno.readTextFileSync(sourceFilename).split("\n").forEach(function (codeLine) {
                var cube = cubeCore_ts_1.getCubeFromJson(codeLine);
                // if(!cube.isValid) {
                // log(`[warn]${cube.no} is not valid!`);
                // } else {
                // batchAppendCubeOneToTwentyFour(cube);
                // }
                batchAppendCubeOneToTwentyFour(cube);
            });
        });
        outputCubes();
        return [2 /*return*/];
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

cls && deno lint %pwd%\cubeCompute6_step4.ts & deno fmt %pwd%\cubeCompute6_step4.ts

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\cubeCompute6_step4.ts

deno run --v8-flags=--max-old-space-size=20480 -A %pwd%\cubeCompute6_step4.ts

cls && deno run --v8-flags=--max-old-space-size=20480 -A %pwd%\cubeCompute6_step4.ts
*/
