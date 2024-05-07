"use strict";
/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * src\cubeCompute6_step1.ts v0.0.1
 * deno 1.42.1 + VSCode 1.88.0
 *
 * <en_us>
 * Created on Tue May 07 2024 09:26:27
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年5月7日 09:26:27
 * 功能：仅获取中间正方体，六面仅列出直接的六面，不列出由“插片”形成的面。
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年5月7日 09:26:27
 * 功能：
 * </zh_tw>
 */
exports.__esModule = true;
// https://www.cnblogs.com/livelab/p/14111142.html
var mod_ts_1 = require("https://deno.land/std/fs/mod.ts"); // copy
var cubeCore_ts_1 = require("./cubeCore.ts");
var STEP_FLAG = "step1";
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
var DEBUG = {
    // false true
    MIDDLE_CUBE_BATCH_DEAL_COUNT: 10240,
    SHOW_CUT_MANNERS: true,
    SHOW_CUBE_WHEN_OK_IN_COUNT_BY_LINES: false
};
var COL_COUNT = 5;
var MAX_COL_INDEX = COL_COUNT - 1;
var MIDDLE_CUBE_ARRAY = [];
var MIDDLE_CUBE_COUNT_ARRAY = [0, 0, 0, 0, 0, 0];
var CUT_MANNER_COUNT_ARRAY = [0, 0, 0, 0, 0, 0];
var CUT_MANNER_ARRAY = [];
var CORE_COL_INDEX_ORDER_ARRAY = [3, 1, 2, 0, 4];
var totalMiddleCubeCount = 0;
function countByRowCount(ROW_COUNT) {
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
                    // goalCell.layerIndex = 0;
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
            }
            appendMiddleCube(cube);
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
            // let codes = '';
            // for (
            // 	let cubeIndex = 0;
            // 	cubeIndex < MIDDLE_CUBE_COUNT;
            // 	++cubeIndex
            // ) {
            // 	codes += `${JSON.stringify(MIDDLE_CUBE_ARRAY[cubeIndex])}\n`;
            // }
            // Deno.writeTextFileSync(`${MIDDLE_FILE_NAME_PREFIX}${++middleFileNo}.txt`, codes);
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
                        // const ADDRESS = `${rowIndex}${colIndex}`;
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
                countByLines(HORIZONTAL_LINE_ARRAY, VERTICAL_LINE_ARRAY, EMPTY_CELL_POSITOIN_ARRAY);
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
            // 如已添加，则返回null
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
            // log({
            // 	rowIndex,
            // 	colIndex,
            // 	isCoreCell,
            // 	TOP_LINE_INDEX,
            // 	LEFT_LINE_INDEX,
            // 	gridLines,
            // });
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
            // 检查若添加进去，是否会冲突
            var sixFaceTwentyFourAngle = cubeCore_ts_1.SixFaceTwentyFourAngle.UpOriginal;
            var twelveEdge = cubeCore_ts_1.TwelveEdge.NotSure;
            var hasError = false;
            var relationCellCount = 0;
            // 故意交换顺序
            [gridLines[2], gridLines[3], gridLines[0], gridLines[1]].forEach(function (line, relation) {
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
                    // twelveEdge = SixFaceTwentyFourAngleToTwelveEdge[OLD_CELL_SIX_FACE_TWENTY_FOUR_ANGLE][relation];
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
            // if (hasError) {
            // 	return null;
            // }
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
                                return row.filter(function (cell) { return cell.feature === cubeCore_ts_1.CellFeature.Face; }).map(function (cell) { return "1"; }).join("");
                            }).join("").length + "\n" + cube.cells.map(function (row) {
                                return row.filter(function (cell) { return cell.feature === cubeCore_ts_1.CellFeature.Face; }).map(function (cell) {
                                    return cell.addOrder + ": " + cell.rowIndex + cell.colIndex + "\t" + cell.borderLines.join("") + "\t(" + (cell.relatedInformationWhenAdding.rowIndex === -1
                                        ? " "
                                        : cell.relatedInformationWhenAdding.rowIndex) + "," + (cell.relatedInformationWhenAdding.colIndex === -1
                                        ? " "
                                        : cell.relatedInformationWhenAdding.colIndex) + ") " + cell.relatedInformationWhenAdding.relation + "\t" + cell.sixFace + "+" + cell.faceDirection.toString().padStart(3, " ") + cell.twelveEdge.toString().padStart(3, " ") + cell.sixFaceTwentyFourAngle.toString().padStart(3, " ");
                                }).join("\n");
                            }).join("\n"));
                        }
                        // countAndPushIfOk(cube);
                        cube.count();
                        // log(`cube.isValid: ${cube.isValid}`);
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
        function done() {
            mod_ts_1.ensureDirSync(GOAL_FILE_PATH);
            mod_ts_1.emptyDirSync(GOAL_FILE_PATH);
            countMiddleCube();
            dealMiddleCubes();
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
        CUT_MANNER_COUNT_ARRAY: CUT_MANNER_COUNT_ARRAY,
        CUT_MANNER_ARRAY_LENGTH: CUT_MANNER_ARRAY.length
    });
}
countByRowCount(2);
countByRowCount(3);
if (cubeCore_ts_1.global_removed_middle_cube_count) {
    cubeCore_ts_1.log("removed middle cube count:", cubeCore_ts_1.global_removed_middle_cube_count);
}
if (DEBUG.SHOW_CUT_MANNERS) {
    Deno.writeTextFileSync(GOAL_FILE_TOP_PATH + "cutMannerArray.ts", "export const cutMannerArray = " + JSON.stringify(CUT_MANNER_ARRAY) + ";");
    Deno.writeTextFileSync(GOAL_FILE_TOP_PATH + "cutMannerCountArray.ts", "export const cutMannerCountArray = " + JSON.stringify(CUT_MANNER_COUNT_ARRAY) + ";");
    cubeCore_ts_1.log("CUT_MANNER_ARRAY.length:", CUT_MANNER_ARRAY.length);
    cubeCore_ts_1.log("CUT_MANNER_COUNT_ARRAY:", CUT_MANNER_COUNT_ARRAY);
}
cubeCore_ts_1.showUsedTime("end");
cubeCore_ts_1.log("end: " + (new Date()).toLocaleString());
cubeCore_ts_1.logUsedTime("Total", performance.now() - DATE_BEGIN);
mod_ts_1.copySync(LOG_FILE_NAME, "log_" + STEP_FLAG + ".txt", { overwrite: true });
mod_ts_1.copySync(LOG_FILE_NAME, GOAL_FILE_TOP_PATH + "log" + logFilenamePostfix + ".txt", {
    overwrite: true
});
Deno.removeSync(LOG_FILE_NAME);
/*
begin: 4/28/2024, 10:14:44 AM

countMiddleCube(2), 2 ^ (5 + 8) = 8192 => 6902, used 518.83 milliseconds, or 0.519 seconds
after countMiddleCubes() ./step1/2rows_5cols/, used 27.49 milliseconds, or 0.027 seconds
{
  totalMiddleCubeCount: 94,
  global_removed_middle_cube_count: 0,
  thisMiddleCubeCount: 94,
  MIDDLE_CUBE_COUNT_ARRAY: [ 94, 0, 0, 0, 0, 0 ],
  CUT_MANNER_COUNT_ARRAY: [ 94, 0, 0, 0, 0, 0 ],
  CUT_MANNER_ARRAY_LENGTH: 94
}

countMiddleCube(3), 2 ^ (10 + 12) = 4194304 => 4036248, used 669179.96 milliseconds, or 669.180 seconds, or 11.2 minutes,
after countMiddleCubes() ./step1/3rows_5cols/, used 285.00 milliseconds, or 0.285 seconds
{
  totalMiddleCubeCount: 269197,
  global_removed_middle_cube_count: 0,
  thisMiddleCubeCount: 269103,
  MIDDLE_CUBE_COUNT_ARRAY: [ 94, 269103, 0, 0, 0, 0 ],
  CUT_MANNER_COUNT_ARRAY: [ 94, 147522, 0, 0, 0, 0 ],
  CUT_MANNER_ARRAY_LENGTH: 147616
}
CUT_MANNER_ARRAY.length: 147616
CUT_MANNER_COUNT_ARRAY: [ 94, 147522, 0, 0, 0, 0 ]
end, used 359.59 milliseconds, or 0.360 seconds
end: 4/28/2024, 10:25:54 AM
Total used , used 670164.11 milliseconds, or 670.164 seconds, or 11.2 minutes,
*/
/*
set pwd=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\

cls && deno lint %pwd%\cubeCompute6_step1.ts && deno fmt %pwd%\cubeCompute6_step1.ts

cd /d C:\__cube\240507A\

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\cubeCompute6_step1.ts
deno run --v8-flags=--max-old-space-size=20480 -A %pwd%\cubeCompute6_step1.ts

cls && deno run --v8-flags=--max-old-space-size=20480 -A %pwd%\cubeCompute6_step1.ts

*/
