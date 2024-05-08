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
 * 功能：从第三步结果开始，进行一系列合并与分析操作：
 *       1. lines.txt，将4677537行去重，且列出正方体序号段（不知道为什么最后有不连续的序号），
 *          转为lineToCubeNo.txt文件，444442222244444422324433234:1-5,8-10
 *       2. cubes/*.txt（3655 files），每文件30720个正方体，此文件夹不需处理，可直接反算文件名
 *          Math.ceil((cube.no - 0.5) / 30720).toString().padStart(6, '0').concat('.txt')
 *       3. manners/*.txt（3655 files）：合并到内存中，最后再排序后输出单个文件
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
var mod_ts_1 = require("https://deno.land/std/fs/mod.ts");
var path = require("https://deno.land/std/path/mod.ts");
var cubeCore_ts_1 = require("./cubeCore.ts");
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
var OVER_WRITE_TRUE_FLAG = { overwrite: true };
var SOURCE_FILE_TOP_PATH = "./step3/";
var APPEND_TRUE_FLAG = { append: true };
var DEBUG = {
    // true false
    COMPACT_LINE_INFO_WRITE_COUNT_PER_TIME: 204800,
    COMPACT_MANNER_FILES_FOR_LARGE_FILE: true,
    COMPACT_MANNER_FILES_FOR_LARGE_FILE_OUTPUT_TIMES: 8,
    OUTPUT_MANNER_BILL_FILE: false,
    JOIN_CUBE_FILES: true
};
await(function () { return __awaiter(void 0, void 0, void 0, function () {
    function compactLineInfo() {
        logFilenamePostfix += "_compactLineInfo";
        // 1. lines.txt，将4677537行去重，且列出正方体序号段（不知道为什么最后有不连续的序号），
        //    转为lineToCubeNo.txt文件，444442222244444422324433234:1-5,8-10
        var GOAL_FILE_NAME = GOAL_FILE_TOP_PATH + "lineToCubeNo.txt";
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
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function () {
            var SOURCE_MANNER_FILE_PATH, readedFileCount, GOAL_FILE_NAME, _b, _c, dirEntry, filename, stats, ARRAY, e_1_1;
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
                        console.log("sort it");
                        Deno.writeTextFileSync(GOAL_FILE_NAME, ARRAY.map(function (_a) {
                            var manner = _a.manner, cubeNoBill = _a.cubeNoBill;
                            return manner + "\t" + cubeNoBill;
                        })
                            .join("\n"), APPEND_TRUE_FLAG);
                        _d.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
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
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        });
    }
    function compactMannerFilesForLargeFile() {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function () {
            var SOURCE_MANNER_FILE_PATH, MANNER_ARRAY, CUBE_NO_ARRAY, readedFileCount, mannerCount, _b, _c, dirEntry, filename, stats, SOURCE_ARRAY, SOURCE_COUNT, lineIndex, _d, MANNER, CUBE_NO_BILL, finded, i, e_2_1, MANNER_GOAL_FILE_NAME, WRITE_TIMES, OUTPUT_COUNT_PER_TIME, _loop_1, outputIndex;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        logFilenamePostfix = "_compactMannerFilesForLargeFile";
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
                        e_2_1 = _e.sent();
                        e_2 = { error: e_2_1 };
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
                        if (e_2) throw e_2.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        cubeCore_ts_1.showUsedTime("read remaining files");
                        MANNER_GOAL_FILE_NAME = GOAL_FILE_TOP_PATH + "manners.txt";
                        Deno.writeTextFileSync(MANNER_GOAL_FILE_NAME, "");
                        WRITE_TIMES = DEBUG.COMPACT_MANNER_FILES_FOR_LARGE_FILE_OUTPUT_TIMES;
                        OUTPUT_COUNT_PER_TIME = Math.ceil(MANNER_ARRAY.length / WRITE_TIMES);
                        _loop_1 = function (outputIndex) {
                            var QUARTER_CUBE_NO_ARRAY = CUBE_NO_ARRAY.splice(0, OUTPUT_COUNT_PER_TIME);
                            if (outputIndex) {
                                Deno.writeTextFileSync(MANNER_GOAL_FILE_NAME, "\n", APPEND_TRUE_FLAG);
                            }
                            Deno.writeTextFileSync(MANNER_GOAL_FILE_NAME, MANNER_ARRAY.splice(0, OUTPUT_COUNT_PER_TIME).map(function (MANNER, index) {
                                return MANNER + "\t" + QUARTER_CUBE_NO_ARRAY[index];
                            }).join("\n"), APPEND_TRUE_FLAG);
                        };
                        for (outputIndex = 0; outputIndex < WRITE_TIMES; ++outputIndex) {
                            _loop_1(outputIndex);
                        }
                        cubeCore_ts_1.showUsedTime("output manners.txt");
                        return [2 /*return*/];
                }
            });
        });
    }
    function outputMannerBillFile() {
        var e_3, _a;
        return __awaiter(this, void 0, void 0, function () {
            var SOURCE_MANNER_FILE_PATH, readedFileCount, GOAL_FILE_NAME, _b, _c, dirEntry, filename, stats, e_3_1;
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
    function joinMannerFiles() {
        var e_4, _a;
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
            var SOURCE_MANNER_FILE_PATH, readedFileCount, GOAL_FILE_PATH, MANNER_ARRAY, outputFileNo, totalCount, _b, _c, dirEntry, filename, stats, e_4_1;
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
                        e_4_1 = _d.sent();
                        e_4 = { error: e_4_1 };
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
                        if (e_4) throw e_4.error;
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
        var e_5, _a;
        return __awaiter(this, void 0, void 0, function () {
            var SOURCE_MANNER_FILE_PATH, CUBE_GOAL_FILE_NAME, readedFileCount, _b, _c, dirEntry, filename, stats, e_5_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        logFilenamePostfix = "_joinCubeFiles";
                        SOURCE_MANNER_FILE_PATH = SOURCE_FILE_TOP_PATH + "cubes/";
                        CUBE_GOAL_FILE_NAME = GOAL_FILE_TOP_PATH + "cubes.txt";
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
}); })();
cubeCore_ts_1.showUsedTime("end");
cubeCore_ts_1.log("end: " + (new Date()).toLocaleString());
cubeCore_ts_1.logUsedTime("Total", performance.now() - DATE_BEGIN);
mod_ts_1.copySync(LOG_FILE_NAME, "log_" + STEP_FLAG + ".txt", OVER_WRITE_TRUE_FLAG);
mod_ts_1.copySync(LOG_FILE_NAME, GOAL_FILE_TOP_PATH + "log" + logFilenamePostfix + ".txt", OVER_WRITE_TRUE_FLAG);
Deno.removeSync(LOG_FILE_NAME);
/*
cd /d C:\__cube\240507A\
set pwd=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\

cls && deno lint %pwd%\cubeCompute6_step4.ts & deno fmt %pwd%\cubeCompute6_step4.ts

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\cubeCompute6_step4.ts

deno run --v8-flags=--max-old-space-size=20480 -A %pwd%\cubeCompute6_step4.ts

cls && deno run --v8-flags=--max-old-space-size=20480 -A %pwd%\cubeCompute6_step4.ts

cd /d E:\_cubes_240428
*/
