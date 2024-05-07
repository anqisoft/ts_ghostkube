"use strict";
/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * src\cubeCore.ts v0.0.6
 * deno 1.42.1 + VSCode 1.88.0
 */
exports.__esModule = true;
exports.getCubeFromJson = exports.SimpleCube = exports.SimpleCell = exports.showSimpleCubeCoreInfo = exports.showCubeCoreInfo = exports.COL_INDEX_ARRAY_MORE_THAN_THREE_ROW = exports.COL_INDEX_ARRAY_LESS_THAN_OR_EQUALS_THREE_ROW = exports.Cube = exports.CellObject = exports.getSixFaceTwentyFourAngleRelationTwelveEdge = exports.convertTwelveEdgeToString = exports.SixFaceTwentyFourAngleToTwelveEdge = exports.TwelveEdge = exports.SIX_FACE_AND_DIRECTION_RELATIONS = exports.ConnectionRelation = exports.convertSixFaceAndDirectionToSixFaceTwentyFourAngle = exports.convertSixFaceTwentyFourAngleToString = exports.convertSixFaceTwentyFourAngleToSixFaceAndDirection = exports.SixFaceTwentyFourAngle = exports.SixFaceCount = exports.SixFaceMaxIndex = exports.SixFace = exports.CellFeature = exports.CellBorderPosition = exports.CellBorderLine = exports.GridLineStyle = exports.FourDirectionCount = exports.FourDirectionMaxIndex = exports.TextDirections = exports.FourDirection = exports.TWELVE_EDGE_NAME_CHARS = exports.FACE_NAME_ARRAY = exports.SIX_FACE_NAME_CHARS = exports.SIX_FACE_SHORT_NAMES = exports.ANGLE_COUNT = exports.global_removed_middle_cube_count = exports.showUsedTime = exports.logUsedTime = exports.log = void 0;
/* <en_us>
 * Created on Wed Apr 10 2024 11:20:29
 * Feature:
 * </en_us>
*/
/* <zh_cn>
 * 创建：2024年4月10日 11:20:29
 * 功能：提供正方体相关定义，但不提供任何计算，也不提供网页相关方法。
 * </zh_cn>
*/
/* <zh_tw>
 * 創建：2024年4月10日 11:20:29
 * 功能：
 * </zh_tw>
*/
var floor = Math.floor;
var SETTINGS = {
    mustContainEveryColumn: true
};
var DEBUG = {
    // false true
    SHOW_SIX_FACE_AND_DIRECTION_RELATIONS: false,
    SHOW_BORDER_LINE_CHANGE_INFO: false,
    SHOW_FULL_CUBE_INFO: false,
    SHOW_MIDDLE_CUBE_CHANGED_TO_NOT_VALID_MESSAGE: false
};
// deno-lint-ignore no-explicit-any
function log() {
    var dataArray = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        dataArray[_i] = arguments[_i];
    }
    console.log.apply(console, dataArray);
    var LOG_STRING = JSON.stringify(dataArray);
    LOG_STRING = LOG_STRING.substring(1, LOG_STRING.length - 1);
    if (LOG_STRING.startsWith('"') && LOG_STRING.endsWith('"')) {
        LOG_STRING = LOG_STRING.substring(1, LOG_STRING.length - 1);
    }
    Deno.writeTextFileSync("./log.txt", 
    // LOG_STRING.substring(1, LOG_STRING.length - 1).replace(/\\n/g, "\n").concat(
    //   "\n",
    // ),
    LOG_STRING.replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .concat("\n"), {
        append: true
    });
}
exports.log = log;
var dateBegin = performance.now();
function logUsedTime(functionName, duration) {
    log(functionName + " used " + duration.toFixed(2) + " milliseconds, or " + (duration / 1000).toFixed(3) + " seconds" + (duration > 60000
        ? ", or " + (duration / 60000).toFixed(1) + " minutes, " + (duration > 3600000
            ? ", or " + Math.floor(duration / 3600000) + "hours" + Math.floor(duration % 3600000 / 60000) + "minutes" + (Math.floor(duration % 60000) / 1000).toFixed(0) + "seconds"
            : "")
        : ""));
}
exports.logUsedTime = logUsedTime;
function showUsedTime(functionName) {
    var end = performance.now();
    var duration = end - dateBegin;
    logUsedTime(functionName, duration);
    dateBegin = end;
}
exports.showUsedTime = showUsedTime;
exports.global_removed_middle_cube_count = 0;
exports.ANGLE_COUNT = 24;
exports.SIX_FACE_SHORT_NAMES = "UDLRFB".split("");
// export const SIX_FACE_NAME_CHARS: string[] = '❶❷❸❹❺❻'.split('');
exports.SIX_FACE_NAME_CHARS = "⒈⒉⒊⒋⒌⒍".split("");
exports.FACE_NAME_ARRAY = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
exports.TWELVE_EDGE_NAME_CHARS = "①②③④⑤⑥⑦⑧⑨⑩⑪⑫".split("");
Boolean.prototype.repeat = function (times) {
    var RESULT = [];
    for (var i = 0; i < times; ++i) {
        RESULT.push(this);
    }
    return RESULT;
};
Number.prototype.repeat = function (times) {
    var RESULT = [];
    for (var i = 0; i < times; ++i) {
        RESULT.push(this);
    }
    return RESULT;
};
Array.prototype.repeat = function (times) {
    var RESULT = [];
    for (var i = 0; i < times; ++i) {
        RESULT.push(this);
    }
    return RESULT;
};
// Slowly also......
// export interface ArrayNewIndexOfFunction {
// newIndexOf: (item: any) => number;
// }
// interface Array extends ArrayNewIndexOfFunction {}
// (Array.prototype as unknown as ArrayNewIndexOfFunction).newIndexOf = function (
// item: any,
// ): number {
// const COUNT = this.length;
// for(let i = 0; i < COUNT; ++i) {
// if(this[i] === item) {
// return i;
// }
// }
// return -1;
// };
var FourDirection;
(function (FourDirection) {
    FourDirection[FourDirection["Original"] = 0] = "Original";
    FourDirection[FourDirection["Clockwise90"] = 1] = "Clockwise90";
    FourDirection[FourDirection["SemiCircle"] = 2] = "SemiCircle";
    FourDirection[FourDirection["Counterclockwise90"] = 3] = "Counterclockwise90";
})(FourDirection = exports.FourDirection || (exports.FourDirection = {}));
exports.TextDirections = [0, 90, 180, 270];
exports.FourDirectionMaxIndex = 3;
exports.FourDirectionCount = 4;
var GridLineStyle;
(function (GridLineStyle) {
    GridLineStyle[GridLineStyle["Unknown"] = 0] = "Unknown";
    GridLineStyle[GridLineStyle["None"] = 1] = "None";
    GridLineStyle[GridLineStyle["InnerLine"] = 2] = "InnerLine";
    GridLineStyle[GridLineStyle["CutLine"] = 3] = "CutLine";
    GridLineStyle[GridLineStyle["OuterLine"] = 4] = "OuterLine";
})(GridLineStyle = exports.GridLineStyle || (exports.GridLineStyle = {}));
var CellBorderLine;
(function (CellBorderLine) {
    CellBorderLine[CellBorderLine["Unknown"] = 0] = "Unknown";
    CellBorderLine[CellBorderLine["InnerLine"] = 2] = "InnerLine";
    CellBorderLine[CellBorderLine["CutLine"] = 3] = "CutLine";
    CellBorderLine[CellBorderLine["OuterLine"] = 4] = "OuterLine";
})(CellBorderLine = exports.CellBorderLine || (exports.CellBorderLine = {}));
var CellBorderPosition;
(function (CellBorderPosition) {
    CellBorderPosition[CellBorderPosition["Top"] = 0] = "Top";
    CellBorderPosition[CellBorderPosition["Right"] = 1] = "Right";
    CellBorderPosition[CellBorderPosition["Bottom"] = 2] = "Bottom";
    CellBorderPosition[CellBorderPosition["Left"] = 3] = "Left";
})(CellBorderPosition = exports.CellBorderPosition || (exports.CellBorderPosition = {}));
var CellFeature;
(function (CellFeature) {
    CellFeature[CellFeature["Unknown"] = 0] = "Unknown";
    CellFeature[CellFeature["None"] = 1] = "None";
    CellFeature[CellFeature["Face"] = 2] = "Face";
    CellFeature[CellFeature["Piece"] = 3] = "Piece";
})(CellFeature = exports.CellFeature || (exports.CellFeature = {}));
var SixFace;
(function (SixFace) {
    SixFace[SixFace["Up"] = 0] = "Up";
    SixFace[SixFace["Down"] = 1] = "Down";
    SixFace[SixFace["Left"] = 2] = "Left";
    SixFace[SixFace["Right"] = 3] = "Right";
    SixFace[SixFace["Front"] = 4] = "Front";
    SixFace[SixFace["Back"] = 5] = "Back";
})(SixFace = exports.SixFace || (exports.SixFace = {}));
exports.SixFaceMaxIndex = 5;
exports.SixFaceCount = 6;
var SixFaceTwentyFourAngle;
(function (SixFaceTwentyFourAngle) {
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["UpOriginal"] = 0] = "UpOriginal";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["UpClockwise90"] = 1] = "UpClockwise90";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["UpSemiCircle"] = 2] = "UpSemiCircle";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["UpCounterclockwise90"] = 3] = "UpCounterclockwise90";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["DownOriginal"] = 4] = "DownOriginal";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["DownClockwise90"] = 5] = "DownClockwise90";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["DownSemiCircle"] = 6] = "DownSemiCircle";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["DownCounterclockwise90"] = 7] = "DownCounterclockwise90";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["LeftOriginal"] = 8] = "LeftOriginal";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["LeftClockwise90"] = 9] = "LeftClockwise90";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["LeftSemiCircle"] = 10] = "LeftSemiCircle";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["LeftCounterclockwise90"] = 11] = "LeftCounterclockwise90";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["RightOriginal"] = 12] = "RightOriginal";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["RightClockwise90"] = 13] = "RightClockwise90";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["RightSemiCircle"] = 14] = "RightSemiCircle";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["RightCounterclockwise90"] = 15] = "RightCounterclockwise90";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["FrontOriginal"] = 16] = "FrontOriginal";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["FrontClockwise90"] = 17] = "FrontClockwise90";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["FrontSemiCircle"] = 18] = "FrontSemiCircle";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["FrontCounterclockwise90"] = 19] = "FrontCounterclockwise90";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["BackOriginal"] = 20] = "BackOriginal";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["BackClockwise90"] = 21] = "BackClockwise90";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["BackSemiCircle"] = 22] = "BackSemiCircle";
    SixFaceTwentyFourAngle[SixFaceTwentyFourAngle["BackCounterclockwise90"] = 23] = "BackCounterclockwise90";
})(SixFaceTwentyFourAngle = exports.SixFaceTwentyFourAngle || (exports.SixFaceTwentyFourAngle = {}));
function convertSixFaceTwentyFourAngleToSixFaceAndDirection(value) {
    var FIXED_VALUE = value + 0.5;
    return [floor(FIXED_VALUE / 4), floor(FIXED_VALUE % 4)];
}
exports.convertSixFaceTwentyFourAngleToSixFaceAndDirection = convertSixFaceTwentyFourAngleToSixFaceAndDirection;
function convertSixFaceTwentyFourAngleToString(value) {
    var FIXED_VALUE = value + 0.5;
    return exports.SIX_FACE_SHORT_NAMES[floor(FIXED_VALUE / 4)] + " + " + 90 * floor(FIXED_VALUE % 4);
}
exports.convertSixFaceTwentyFourAngleToString = convertSixFaceTwentyFourAngleToString;
function convertSixFaceAndDirectionToSixFaceTwentyFourAngle(sixFace, fourDirection) {
    return 4 * sixFace + fourDirection;
}
exports.convertSixFaceAndDirectionToSixFaceTwentyFourAngle = convertSixFaceAndDirectionToSixFaceTwentyFourAngle;
var ConnectionRelation;
(function (ConnectionRelation) {
    ConnectionRelation[ConnectionRelation["Top"] = 0] = "Top";
    ConnectionRelation[ConnectionRelation["Right"] = 1] = "Right";
    ConnectionRelation[ConnectionRelation["Bottom"] = 2] = "Bottom";
    ConnectionRelation[ConnectionRelation["Left"] = 3] = "Left";
})(ConnectionRelation = exports.ConnectionRelation || (exports.ConnectionRelation = {}));
// export const SIX_FACE_AND_DIRECTION_RELATIONS: SixFaceTwentyFourAngle[][] = [];
// for (let i = 0; i < ANGLE_COUNT; ++i) {
// 	const RELATIONS: SixFaceTwentyFourAngle[] = [];
// 	switch (i) {
// 		case 0: // U
// 			RELATIONS.push(20); // B
// 			RELATIONS.push(12); // R
// 			RELATIONS.push(16); // F
// 			RELATIONS.push(8); // L
// 			break;
// 		case 4: // D
// 			RELATIONS.push(20 + 2); // B+2
// 			RELATIONS.push(8); // L
// 			RELATIONS.push(16 + 2); // F+2
// 			RELATIONS.push(12); // R
// 			break;
// 		case 8: // L
// 			RELATIONS.push(20 + 3); // B+3
// 			RELATIONS.push(0); // U
// 			RELATIONS.push(16 + 1); // F+1
// 			RELATIONS.push(4); // D
// 			break;
// 		case 12: // R
// 			RELATIONS.push(20 + 1); // B+1
// 			RELATIONS.push(4); // D
// 			RELATIONS.push(16 + 3); // F+3
// 			RELATIONS.push(0); // U
// 			break;
// 		case 16: // F
// 			RELATIONS.push(0); // U
// 			RELATIONS.push(12 + 1); // R+1
// 			RELATIONS.push(4 + 2); // D+2
// 			RELATIONS.push(8 + 3); // L+3
// 			break;
// 		case 20: // B
// 			RELATIONS.push(4 + 2); // D+2
// 			RELATIONS.push(12 + 3); // R+3
// 			RELATIONS.push(0); // U
// 			RELATIONS.push(8 + 1); // L+1
// 			break;
// 		default:
// 			{
// 				const OFFSET = floor((i + 0.5) % 4);
// 				const [TOP, RIGHT, BOTTOM, LEFT] = SIX_FACE_AND_DIRECTION_RELATIONS[i - OFFSET];
// 				[
// 					[LEFT, TOP, RIGHT, BOTTOM],
// 					// .map((value) => {
// 					// 	const FIXED_VALUE = value + 0.5;
// 					// 	return floor(FIXED_VALUE / 4) + floor((FIXED_VALUE + 1) % 4);
// 					// }),
// 					[BOTTOM, LEFT, TOP, RIGHT],
// 					[RIGHT, BOTTOM, LEFT, TOP],
// 				][OFFSET - 1].forEach((value: SixFaceTwentyFourAngle) => {
// 					const FIXED_VALUE = value + 0.5;
// 					RELATIONS.push(4 * floor(FIXED_VALUE / 4) + floor((FIXED_VALUE + OFFSET) % 4));
// 				});
// 			}
// 			break;
// 	}
// 	SIX_FACE_AND_DIRECTION_RELATIONS.push(RELATIONS);
// }
// 在调试窗口直接获得相应结果，不再计算
exports.SIX_FACE_AND_DIRECTION_RELATIONS = [
    [20, 12, 16, 8],
    [9, 21, 13, 17],
    [18, 10, 22, 14],
    [15, 19, 11, 23],
    [22, 8, 18, 12],
    [13, 23, 9, 19],
    [16, 14, 20, 10],
    [11, 17, 15, 21],
    [23, 0, 17, 4],
    [5, 20, 1, 18],
    [19, 6, 21, 2],
    [3, 16, 7, 22],
    [21, 4, 19, 0],
    [1, 22, 5, 16],
    [17, 2, 23, 6],
    [7, 18, 3, 20],
    [0, 13, 6, 11],
    [8, 1, 14, 7],
    [4, 9, 2, 15],
    [12, 5, 10, 3],
    [6, 15, 0, 9],
    [10, 7, 12, 1],
    [2, 11, 4, 13],
    [14, 3, 8, 5],
];
function showSixFaceAndDirectionRelations() {
    if (!DEBUG.SHOW_SIX_FACE_AND_DIRECTION_RELATIONS) {
        return;
    }
    log("SIX_FACE_AND_DIRECTION_RELATIONS:", exports.SIX_FACE_AND_DIRECTION_RELATIONS);
    exports.SIX_FACE_AND_DIRECTION_RELATIONS.forEach(function (item, index) {
        log(convertSixFaceTwentyFourAngleToString(index), item.map(function (to) { return "" + convertSixFaceTwentyFourAngleToString(to); }));
    });
}
showSixFaceAndDirectionRelations();
var TwelveEdge;
(function (TwelveEdge) {
    TwelveEdge[TwelveEdge["UpTop"] = 0] = "UpTop";
    TwelveEdge[TwelveEdge["UpRight"] = 1] = "UpRight";
    TwelveEdge[TwelveEdge["UpBottom"] = 2] = "UpBottom";
    TwelveEdge[TwelveEdge["UpLeft"] = 3] = "UpLeft";
    TwelveEdge[TwelveEdge["BackLeft"] = 4] = "BackLeft";
    TwelveEdge[TwelveEdge["BackRight"] = 5] = "BackRight";
    TwelveEdge[TwelveEdge["FrontRight"] = 6] = "FrontRight";
    TwelveEdge[TwelveEdge["FrontLeft"] = 7] = "FrontLeft";
    TwelveEdge[TwelveEdge["DownTop"] = 8] = "DownTop";
    TwelveEdge[TwelveEdge["DownRight"] = 9] = "DownRight";
    TwelveEdge[TwelveEdge["DownBottom"] = 10] = "DownBottom";
    TwelveEdge[TwelveEdge["DownLeft"] = 11] = "DownLeft";
    TwelveEdge[TwelveEdge["NotSure"] = 12] = "NotSure";
})(TwelveEdge = exports.TwelveEdge || (exports.TwelveEdge = {}));
// export const SixFaceTwentyFourAngleToTwelveEdge: TwelveEdge[][] = [
//   // U
//   [
//     TwelveEdge.UpTop,
//     TwelveEdge.UpRight,
//     TwelveEdge.UpBottom,
//     TwelveEdge.UpLeft,
//   ],
//   // D
//   [
//     TwelveEdge.DownTop,
//     TwelveEdge.DownLeft,
//     TwelveEdge.DownBottom,
//     TwelveEdge.DownRight,
//   ],
//   // L
//   [
//     TwelveEdge.BackLeft,
//     TwelveEdge.UpLeft,
//     TwelveEdge.FrontLeft,
//     TwelveEdge.DownLeft,
//   ],
//   // R
//   [
//     TwelveEdge.BackRight,
//     TwelveEdge.DownRight,
//     TwelveEdge.FrontRight,
//     TwelveEdge.UpRight,
//   ],
//   // F
//   [
//     TwelveEdge.DownBottom,
//     TwelveEdge.FrontLeft,
//     TwelveEdge.UpBottom,
//     TwelveEdge.FrontRight,
//   ],
//   // B
//   [
//     TwelveEdge.DownTop,
//     TwelveEdge.BackRight,
//     TwelveEdge.UpTop,
//     TwelveEdge.BackLeft,
//   ],
// ];
exports.SixFaceTwentyFourAngleToTwelveEdge = [
    // U
    [
        TwelveEdge.UpTop,
        TwelveEdge.UpRight,
        TwelveEdge.UpBottom,
        TwelveEdge.UpLeft,
    ],
    [
        TwelveEdge.UpRight,
        TwelveEdge.UpBottom,
        TwelveEdge.UpLeft,
        TwelveEdge.UpTop,
    ],
    [
        TwelveEdge.UpBottom,
        TwelveEdge.UpLeft,
        TwelveEdge.UpTop,
        TwelveEdge.UpRight,
    ],
    [
        TwelveEdge.UpLeft,
        TwelveEdge.UpTop,
        TwelveEdge.UpRight,
        TwelveEdge.UpBottom,
    ],
    // D
    [
        TwelveEdge.DownTop,
        TwelveEdge.DownLeft,
        TwelveEdge.DownBottom,
        TwelveEdge.DownRight,
    ],
    [
        TwelveEdge.DownRight,
        TwelveEdge.DownTop,
        TwelveEdge.DownLeft,
        TwelveEdge.DownBottom,
    ],
    [
        TwelveEdge.DownBottom,
        TwelveEdge.DownRight,
        TwelveEdge.DownTop,
        TwelveEdge.DownLeft,
    ],
    [
        TwelveEdge.DownLeft,
        TwelveEdge.DownBottom,
        TwelveEdge.DownRight,
        TwelveEdge.DownTop,
    ],
    // L
    [
        TwelveEdge.BackLeft,
        TwelveEdge.UpLeft,
        TwelveEdge.FrontLeft,
        TwelveEdge.DownLeft,
    ],
    [
        TwelveEdge.DownLeft,
        TwelveEdge.BackLeft,
        TwelveEdge.UpLeft,
        TwelveEdge.FrontLeft,
    ],
    [
        TwelveEdge.FrontLeft,
        TwelveEdge.DownLeft,
        TwelveEdge.BackLeft,
        TwelveEdge.UpLeft,
    ],
    [
        TwelveEdge.UpLeft,
        TwelveEdge.FrontLeft,
        TwelveEdge.DownLeft,
        TwelveEdge.BackLeft,
    ],
    // R
    [
        TwelveEdge.BackRight,
        TwelveEdge.DownRight,
        TwelveEdge.FrontRight,
        TwelveEdge.UpRight,
    ],
    [
        TwelveEdge.UpRight,
        TwelveEdge.BackRight,
        TwelveEdge.DownRight,
        TwelveEdge.FrontRight,
    ],
    [
        TwelveEdge.FrontRight,
        TwelveEdge.UpRight,
        TwelveEdge.BackRight,
        TwelveEdge.DownRight,
    ],
    [
        TwelveEdge.DownRight,
        TwelveEdge.FrontRight,
        TwelveEdge.UpRight,
        TwelveEdge.BackRight,
    ],
    // F
    [
        TwelveEdge.UpBottom,
        TwelveEdge.FrontRight,
        TwelveEdge.DownBottom,
        TwelveEdge.FrontLeft,
    ],
    [
        TwelveEdge.FrontLeft,
        TwelveEdge.UpBottom,
        TwelveEdge.FrontRight,
        TwelveEdge.DownBottom,
    ],
    [
        TwelveEdge.DownBottom,
        TwelveEdge.FrontLeft,
        TwelveEdge.UpBottom,
        TwelveEdge.FrontRight,
    ],
    [
        TwelveEdge.FrontRight,
        TwelveEdge.DownBottom,
        TwelveEdge.FrontLeft,
        TwelveEdge.UpBottom,
    ],
    // B
    [
        TwelveEdge.DownTop,
        TwelveEdge.BackRight,
        TwelveEdge.UpTop,
        TwelveEdge.BackLeft,
    ],
    [
        TwelveEdge.BackLeft,
        TwelveEdge.DownTop,
        TwelveEdge.BackRight,
        TwelveEdge.UpTop,
    ],
    [
        TwelveEdge.UpTop,
        TwelveEdge.BackLeft,
        TwelveEdge.DownTop,
        TwelveEdge.BackRight,
    ],
    [
        TwelveEdge.BackRight,
        TwelveEdge.UpTop,
        TwelveEdge.BackLeft,
        TwelveEdge.DownTop,
    ],
];
function convertTwelveEdgeToString(value) {
    return [
        "UpTop",
        "UpRight",
        "UpBottom",
        "UpLeft",
        "BackLeft",
        "BackRight",
        "FrontRight",
        "FrontLeft",
        "DownTop",
        "DownRight",
        "DownBottom",
        "DownLeft",
    ][value];
}
exports.convertTwelveEdgeToString = convertTwelveEdgeToString;
// export function getSixFaceTwentyFourAngleRelationTwelveEdge(
//   value: SixFaceTwentyFourAngle,
//   relation: ConnectionRelation,
// ): TwelveEdge {
//   // UDLRFB + Top/Right/Bottom/Left =>
//   // UpTop/UpRight/UpBottom/UpLeft/BackLeft/BackRight/FrontRight/FrontLeft/DownTop/DownRight/DownBottom/DownLeft
//   const [sixFace, fourDirection] =
//     convertSixFaceTwentyFourAngleToSixFaceAndDirection(value);
//   // const ARRAY = ;
//   const index = floor((relation + fourDirection + 0.5) % 4);
//   const RESULT = SixFaceTwentyFourAngleToTwelveEdge[sixFace][index];
//   if (typeof RESULT === "undefined") {
//     console.error("getSixFaceTwentyFourAngleRelationTwelveEdge", {
//       value,
//       relation,
//       sixFace,
//       fourDirection,
//       index: floor((relation + fourDirection - 0.5) % 4),
//       array: SixFaceTwentyFourAngleToTwelveEdge[sixFace],
//     });
//   }
//   return RESULT;
// }
// export function getSixFaceTwentyFourAngleRelationTwelveEdge(
//   value: SixFaceTwentyFourAngle,
//   relation: ConnectionRelation,
// ): TwelveEdge {
//   const [sixFace, fourDirection] =
//     convertSixFaceTwentyFourAngleToSixFaceAndDirection(value);
//   const ARRAY: TwelveEdge[] = [];
//   SixFaceTwentyFourAngleToTwelveEdge[sixFace].forEach((value) =>
//     ARRAY.push(value)
//   );
//   for (let i = 0; i < fourDirection; ++i) {
//     const value = ARRAY.pop() as TwelveEdge ;
//     ARRAY.unshift(value);
//   }
//   const RESULT = ARRAY[relation];
//   return RESULT;
// }
function getSixFaceTwentyFourAngleRelationTwelveEdge(sixFaceTwentyFourAngle, relation) {
    return exports.SixFaceTwentyFourAngleToTwelveEdge[sixFaceTwentyFourAngle][relation];
}
exports.getSixFaceTwentyFourAngleRelationTwelveEdge = getSixFaceTwentyFourAngleRelationTwelveEdge;
get;
isEmpty();
boolean;
get;
isUnknown();
boolean;
get;
sixFaceTwentyFourAngle();
SixFaceTwentyFourAngle;
get;
sixFaceTwentyFourAngleStr();
string;
get;
twelveEdgeStr();
string;
borderLines: CellBorderLine[];
toString: (function () { return string; });
var CellObject = /** @class */ (function () {
    function CellObject(rowIndex, colIndex, cellIndex) {
        var _this = this;
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        this.cellIndex = cellIndex;
        /**
         * 未使用的格为0，六面面片（含单格、双格两种情况）从1开始（越靠里面的越小），插片为所连面片的层序加1
         */
        this.layerIndex = 0;
        this.addOrder = 0;
        this.relatedInformationWhenAdding = {
            rowIndex: -1,
            colIndex: -1,
            relation: ConnectionRelation.Top
        };
        this.feature = CellFeature.Unknown;
        this.sixFace = SixFace.Up;
        this.faceDirection = FourDirection.Original;
        this.twelveEdge = TwelveEdge.NotSure;
        this.borderLines = [
            CellBorderLine.Unknown,
            CellBorderLine.Unknown,
            CellBorderLine.Unknown,
            CellBorderLine.Unknown,
        ];
        this.toString = function () {
            return JSON.stringify(_this);
            // const sixFaceTwentyFourAngle = convertSixFaceAndDirectionToSixFaceTwentyFourAngle(
            // 	this.sixFace,
            // 	this.faceDirection,
            // );
            // if (DEBUG.SHOW_CELL_TO_STRING) {
            // 	log(
            // 		'toString()',
            // 		JSON.stringify({
            // 			rowIndex: this.rowIndex,
            // 			colIndex: this.colIndex,
            // 			cellIndex: this.cellIndex,
            // 			layerIndex: this.layerIndex,
            // 			addOrder: this.addOrder,
            // 			relatedInformationWhenAdding: this.relatedInformationWhenAdding,
            // 			feature: this.feature,
            // 			sixFace: this.sixFace,
            // 			faceDirection: this.faceDirection,
            // 			twelveEdge: this.twelveEdge,
            // 			isEmpty: this.isEmpty,
            // 			sixFaceTwentyFourAngle,
            // 			sixFaceTwentyFourAngleString: convertSixFaceTwentyFourAngleToString(
            // 				sixFaceTwentyFourAngle,
            // 			),
            // 			borderLines: JSON.stringify(this.borderLines),
            // 		}),
            // 	);
            // }
            // return JSON.stringify({
            // 	rowIndex: this.rowIndex,
            // 	colIndex: this.colIndex,
            // 	cellIndex: this.cellIndex,
            // 	layerIndex: this.layerIndex,
            // 	addOrder: this.addOrder,
            // 	relatedInformationWhenAdding: this.relatedInformationWhenAdding,
            // 	feature: this.feature,
            // 	sixFace: this.sixFace,
            // 	faceDirection: this.faceDirection,
            // 	twelveEdge: this.twelveEdge,
            // 	isEmpty: this.isEmpty,
            // 	sixFaceTwentyFourAngle,
            // 	sixFaceTwentyFourAngleString: convertSixFaceTwentyFourAngleToString(sixFaceTwentyFourAngle),
            // 	borderLines: JSON.stringify(this.borderLines),
            // });
        };
        // this.borderLines = [];
        // for (let borderLineIndex = 0; borderLineIndex < 4; ++borderLineIndex) {
        // 	this.borderLines.push(CellBorderLine.Unknown);
        // }
    }
    Object.defineProperty(CellObject.prototype, "isEmpty", {
        get: function () {
            return this.feature === CellFeature.None;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CellObject.prototype, "isUnknown", {
        get: function () {
            return this.feature === CellFeature.Unknown;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CellObject.prototype, "sixFaceTwentyFourAngle", {
        get: function () {
            return convertSixFaceAndDirectionToSixFaceTwentyFourAngle(this.sixFace, this.faceDirection);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CellObject.prototype, "sixFaceTwentyFourAngleStr", {
        get: function () {
            return convertSixFaceTwentyFourAngleToString(this.sixFaceTwentyFourAngle);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CellObject.prototype, "twelveEdgeStr", {
        get: function () {
            return convertTwelveEdgeToString(this.twelveEdge);
        },
        enumerable: false,
        configurable: true
    });
    CellObject.prototype.clone = function () {
        var RESULT = new CellObject(this.rowIndex, this.colIndex, this.cellIndex);
        RESULT.layerIndex = this.layerIndex;
        RESULT.addOrder = this.addOrder;
        RESULT.relatedInformationWhenAdding = this.relatedInformationWhenAdding;
        RESULT.feature = this.feature;
        RESULT.sixFace = this.sixFace;
        RESULT.faceDirection = this.faceDirection;
        RESULT.twelveEdge = this.twelveEdge;
        this.borderLines.forEach(function (value, index) {
            RESULT.borderLines[index] = value;
        });
        return RESULT;
    };
    return CellObject;
}());
exports.CellObject = CellObject;
function getEmptySixFaces() {
    return [
        [],
        [],
        [],
        [],
        [],
        [],
    ];
}
function getEmptyTwelveEdges() {
    return [
        { canBeInserted: false, pieces: [] },
        { canBeInserted: false, pieces: [] },
        { canBeInserted: false, pieces: [] },
        { canBeInserted: false, pieces: [] },
        { canBeInserted: false, pieces: [] },
        { canBeInserted: false, pieces: [] },
        { canBeInserted: false, pieces: [] },
        { canBeInserted: false, pieces: [] },
        { canBeInserted: false, pieces: [] },
        { canBeInserted: false, pieces: [] },
        { canBeInserted: false, pieces: [] },
        { canBeInserted: false, pieces: [] },
    ];
}
var Cube = /** @class */ (function () {
    function Cube(no, rowCount, colCount, coreRowIndex, coreColIndex, isCloning) {
        if (isCloning === void 0) { isCloning = false; }
        this.no = no;
        this.rowCount = rowCount;
        this.colCount = colCount;
        this.coreRowIndex = coreRowIndex;
        this.coreColIndex = coreColIndex;
        // from CubePaperModel
        this.cells = [];
        this.actCells = [];
        this.emptyCells = [];
        this.gridLines = [];
        this.firstRowActCellColIndexBill = "";
        this.lastRowEmptyCellColIndexBill = "";
        // from CubeObject
        this.sixFaces = getEmptySixFaces();
        this.twelveEdges = getEmptyTwelveEdges();
        this.isValid = false;
        if (!isCloning) {
            for (var rowIndex = 0; rowIndex < rowCount; ++rowIndex) {
                var cellRows = [];
                var CELL_INDEX_OFFSET = colCount * rowIndex;
                for (var colIndex = 0; colIndex < colCount; ++colIndex) {
                    cellRows.push(new CellObject(rowIndex, colIndex, CELL_INDEX_OFFSET + colIndex));
                }
                this.cells.push(cellRows);
            }
        }
    }
    Cube.prototype.clone = function () {
        var _a = this, no = _a.no, rowCount = _a.rowCount, colCount = _a.colCount, coreRowIndex = _a.coreRowIndex, coreColIndex = _a.coreColIndex, cells = _a.cells;
        var cloned = new Cube(no, rowCount, colCount, coreRowIndex, coreColIndex, true);
        cells.forEach(function (rows) {
            cloned.cells.push(rows.map(function (cell) { return cell.clone(); }));
        });
        // cloned.actCells = JSON.parse(JSON.stringify(this.actCells));
        // cloned.emptyCells = JSON.parse(JSON.stringify(this.emptyCells));
        cloned.actCells.length = 0;
        this.actCells.forEach(function (cell) {
            cloned.actCells.push(cloned.cells[cell.rowIndex][cell.colIndex]);
        });
        cloned.emptyCells.length = 0;
        this.emptyCells.forEach(function (cell) {
            cloned.emptyCells.push(cloned.cells[cell.rowIndex][cell.colIndex]);
        });
        cloned.gridLines = JSON.parse(JSON.stringify(this.gridLines));
        cloned.firstRowActCellColIndexBill = this.firstRowActCellColIndexBill;
        cloned.lastRowEmptyCellColIndexBill = this.lastRowEmptyCellColIndexBill;
        cloned.sixFaces = JSON.parse(JSON.stringify(this.sixFaces));
        cloned.twelveEdges = JSON.parse(JSON.stringify(this.twelveEdges));
        cloned.isValid = this.isValid;
        return cloned;
    };
    Cube.prototype.count = function () {
        var _this = this;
        this.actCells.length = 0;
        this.emptyCells.length = 0;
        this.cells.forEach(function (cellRows) {
            // cellRows.filter((cell: CellObject) => cell.feature === CellFeature.None).forEach((
            // 	cell: CellObject,
            // ) => RESULT.push(cell));
            cellRows.forEach(function (cell) {
                switch (cell.feature) {
                    case CellFeature.Unknown:
                    case CellFeature.None:
                        _this.emptyCells.push(cell);
                        break;
                    case CellFeature.Face:
                    case CellFeature.Piece:
                        _this.actCells.push(cell);
                        break;
                    default:
                        // unreachable
                        break;
                }
            });
        });
        this.firstRowActCellColIndexBill = this.actCells.filter(function (cell) {
            return cell.rowIndex === 0;
        }).map(function (cell) { return cell.colIndex; }).join("");
        var MAX_ROW_INDEX = this.rowCount - 1;
        this.lastRowEmptyCellColIndexBill = this.emptyCells.filter(function (cell) {
            return cell.rowIndex === MAX_ROW_INDEX;
        }).map(function (cell) { return cell.colIndex; }).join("");
        this.updateIsValid();
        if (this.isValid) {
            this.updateGridLines();
            this.updateIsValid();
            if (!this.isValid) {
                ++exports.global_removed_middle_cube_count;
                if (DEBUG.SHOW_MIDDLE_CUBE_CHANGED_TO_NOT_VALID_MESSAGE) {
                    log("not valid", this.actCells.map(function (cell) { return "" + cell.rowIndex + cell.colIndex; })
                        .join("_"), "\n" + this.actCells.map(function (cell) {
                        return "" + cell.rowIndex + cell.colIndex + "_" + cell.addOrder.toString().padStart(2, "0") + "_" + cell.borderLines.join("") + "_" + (cell.feature === CellFeature.Face ? "Face_" : "Piece") + "_" + cell.twelveEdge.toString().padStart(2, "0") + "_" + cell.sixFaceTwentyFourAngleStr.replace(" + ", "");
                    }).join(",\n"), "\n");
                }
            }
        }
    };
    Cube.prototype.countLayerIndex = function () {
        var _a = this, cells = _a.cells, sixFaces = _a.sixFaces, twelveEdges = _a.twelveEdges;
        sixFaces.forEach(function (face) {
            var layerIndex = 0;
            face.forEach(function (faceMemberOfSixFace) {
                var firstRowIndex = faceMemberOfSixFace[0], firstColIndex = faceMemberOfSixFace[1], secondRowIndex = faceMemberOfSixFace[2], secondColIndex = faceMemberOfSixFace[3];
                var firstCell = cells[firstRowIndex][firstColIndex];
                firstCell.layerIndex = ++layerIndex;
                firstCell.twelveEdge = TwelveEdge.NotSure;
                if (faceMemberOfSixFace.length === 4) {
                    var secondCell = cells[secondRowIndex][secondColIndex];
                    secondCell.layerIndex = ++layerIndex;
                    secondCell.twelveEdge = TwelveEdge.NotSure;
                }
            });
        });
        twelveEdges.forEach(function (oneEdge, edgeIndex) {
            oneEdge.pieces.forEach(function (cellRowColIndex) {
                var rowIndex = cellRowColIndex[0], colIndex = cellRowColIndex[1];
                var pieceCell = cells[rowIndex][colIndex];
                pieceCell.feature = CellFeature.Piece;
                pieceCell.twelveEdge = edgeIndex;
                // 复位“面属性”
                pieceCell.sixFace = SixFace.Up;
                pieceCell.faceDirection = FourDirection.Original;
                var _a = pieceCell.relatedInformationWhenAdding, relatedRowIndex = _a.rowIndex, relatedColIndex = _a.colIndex;
                if (relatedRowIndex === -1) {
                    pieceCell.borderLines.forEach(function (borderLine, borderLineIndex) {
                        if (borderLine === CellBorderLine.InnerLine) {
                            switch (borderLineIndex) {
                                case ConnectionRelation.Top:
                                    pieceCell.layerIndex =
                                        cells[rowIndex - 1][colIndex].layerIndex + 1;
                                    break;
                                case ConnectionRelation.Bottom:
                                    pieceCell.layerIndex =
                                        cells[rowIndex + 1][colIndex].layerIndex + 1;
                                    break;
                                case ConnectionRelation.Left:
                                    pieceCell.layerIndex =
                                        cells[rowIndex][colIndex - 1].layerIndex + 1;
                                    break;
                                case ConnectionRelation.Right:
                                    pieceCell.layerIndex =
                                        cells[rowIndex][colIndex + 1].layerIndex + 1;
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
                        cells[relatedRowIndex][relatedColIndex].layerIndex + 1;
                }
            });
        });
    };
    Cube.prototype.syncAndClear = function () {
        var _a = this, cells = _a.cells, actCells = _a.actCells, emptyCells = _a.emptyCells;
        function transferProperties(GOAL_CELL) {
            var rowIndex = GOAL_CELL.rowIndex, colIndex = GOAL_CELL.colIndex;
            var CELL = cells[rowIndex][colIndex];
            GOAL_CELL.feature = CELL.feature;
            GOAL_CELL.layerIndex = CELL.layerIndex;
            GOAL_CELL.sixFace = CELL.sixFace;
            GOAL_CELL.faceDirection = CELL.faceDirection;
            GOAL_CELL.twelveEdge = CELL.twelveEdge;
        }
        actCells.forEach(function (GOAL_CELL) {
            transferProperties(GOAL_CELL);
        });
        emptyCells.forEach(function (GOAL_CELL) {
            transferProperties(GOAL_CELL);
        });
        // TODO(@anqisoft) use next statement
        // cells.length = 0;
    };
    Cube.prototype.updateIsValid = function () {
        var actCells = this.actCells;
        var rowCount = this.rowCount;
        var isValid = true;
        var _loop_1 = function (checkRowIndex) {
            if (!isValid) {
                return { value: void 0 };
            }
            isValid = actCells.filter(function (cell) {
                return cell.rowIndex === checkRowIndex;
            }).length > 0;
        };
        for (var checkRowIndex = 0; checkRowIndex < rowCount; ++checkRowIndex) {
            var state_1 = _loop_1(checkRowIndex);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        if (!isValid) {
            this.isValid = false;
            return;
        }
        if (SETTINGS.mustContainEveryColumn) {
            var colCount = this.colCount;
            var _loop_2 = function (checkColIndex) {
                if (!isValid) {
                    return { value: void 0 };
                }
                isValid = actCells.filter(function (cell) {
                    return cell.colIndex === checkColIndex;
                }).length > 0;
            };
            for (var checkColIndex = 0; checkColIndex < colCount; ++checkColIndex) {
                var state_2 = _loop_2(checkColIndex);
                if (typeof state_2 === "object")
                    return state_2.value;
            }
            if (!isValid) {
                this.isValid = false;
                return;
            }
        }
        var OLD_IS_VALID = this.isValid;
        var _a = this, sixFaces = _a.sixFaces, twelveEdges = _a.twelveEdges, cells = _a.cells;
        // 解决多次修正正确性时，被附加多次的Bug
        sixFaces.forEach(function (array) { return array.length = 0; });
        twelveEdges.forEach(function (twelveEdge) { return twelveEdge.pieces.length = 0; });
        // 检查六个面是否齐全（每个面至少有一个带“多内联线”的单元格，或至少两个带“单内联线”的单元格）
        var SIX_FACE_POINT_ARRAY = [0, 0, 0, 0, 0, 0];
        var ONE_INNER_LINE_CELL_TWENTY_FOUR_ANGEL_COUNT_ARRAY = 0
            .repeat(exports.ANGLE_COUNT);
        actCells.forEach(function (cell) {
            var rowIndex = cell.rowIndex, colIndex = cell.colIndex, borderLines = cell.borderLines, sixFace = cell.sixFace, faceDirection = cell.faceDirection, twelveEdge = cell.twelveEdge;
            var sixFaceIndex = 0;
            // let sixFaceTwentyFourAngle = 0;
            switch (borderLines.filter(function (borderLine) {
                return borderLine === CellBorderLine.InnerLine;
            })
                .length) {
                case 2:
                case 3:
                case 4:
                    sixFaceIndex = sixFace;
                    SIX_FACE_POINT_ARRAY[sixFaceIndex] += 1;
                    sixFaces[sixFaceIndex].push([rowIndex, colIndex]);
                    break;
                case 1:
                    // sixFaceTwentyFourAngle =
                    //   convertSixFaceAndDirectionToSixFaceTwentyFourAngle(
                    //     cell.sixFace,
                    //     cell.faceDirection,
                    //   );
                    // ONE_INNER_LINE_CELL_TWENTY_FOUR_ANGEL_COUNT_ARRAY[
                    //   sixFaceTwentyFourAngle
                    // // ] += 1;
                    ONE_INNER_LINE_CELL_TWENTY_FOUR_ANGEL_COUNT_ARRAY[4 * sixFace + (twelveEdge % 4)] += 1;
                    if (cell.relatedInformationWhenAdding.rowIndex === -1) {
                        // 找到唯一的内联线，然后反算相应单元格行号列序，再确定本单元格作为面片时的序号
                        var RELATION_CELL = actCells.filter(function (cell) {
                            return cell.relatedInformationWhenAdding.rowIndex === rowIndex &&
                                cell.relatedInformationWhenAdding.colIndex === colIndex;
                        })[0];
                        var relation = RELATION_CELL.relatedInformationWhenAdding.relation;
                        if (relation % 2 === 0) {
                            relation = 2 - relation;
                        }
                        else {
                            relation = 4 - relation;
                        }
                        twelveEdges[getSixFaceTwentyFourAngleRelationTwelveEdge(convertSixFaceAndDirectionToSixFaceTwentyFourAngle(RELATION_CELL.sixFace, RELATION_CELL.faceDirection), relation)].pieces.push([rowIndex, colIndex]);
                    }
                    else {
                        var _a = cell.relatedInformationWhenAdding, relationRowIndex = _a.rowIndex, relationColIndex = _a.colIndex, relation = _a.relation;
                        var RELATION_CELL = cells[relationRowIndex][relationColIndex];
                        twelveEdges[getSixFaceTwentyFourAngleRelationTwelveEdge(convertSixFaceAndDirectionToSixFaceTwentyFourAngle(RELATION_CELL.sixFace, RELATION_CELL.faceDirection), relation)].pieces.push([rowIndex, colIndex]);
                    }
                    break;
                default:
                    // unreachable
                    break;
            }
        });
        var SHOW_FULL_CUBE_INFO = DEBUG.SHOW_FULL_CUBE_INFO;
        var NEW_LOG = SHOW_FULL_CUBE_INFO
            ? "<=" + JSON.stringify(SIX_FACE_POINT_ARRAY) + " + " + JSON.stringify(ONE_INNER_LINE_CELL_TWENTY_FOUR_ANGEL_COUNT_ARRAY)
            : "";
        // if (OLD_IS_VALID) {
        //   NEW_LOG = `<=${JSON.stringify(SIX_FACE_POINT_ARRAY)} + ${
        //     JSON.stringify(ONE_INNER_LINE_CELL_TWENTY_FOUR_ANGEL_COUNT_ARRAY)
        //   }`;
        // }
        SIX_FACE_POINT_ARRAY.forEach(function (_point, index) {
            var OFFSET = 4 * index;
            for (var i = 0; i < 4; ++i) {
                SIX_FACE_POINT_ARRAY[index] +=
                    ONE_INNER_LINE_CELL_TWENTY_FOUR_ANGEL_COUNT_ARRAY[OFFSET + i] > 0
                        ? 0.5
                        : 0;
            }
        });
        function showFullCubeInfo(isOld) {
            if (!SHOW_FULL_CUBE_INFO) {
                return;
            }
            if (actCells.map(function (cell) { return "" + cell.rowIndex + cell.colIndex; }).join("_") === "00_01_02_03_04_10_11_12_13_14") {
                log((isOld ? "\n\nOLD" : "NEW") + ":" + JSON.stringify(SIX_FACE_POINT_ARRAY) + "\n" + NEW_LOG + "\n" + actCells.map(function (cell) {
                    return "" + cell.rowIndex + cell.colIndex + "_" + cell.addOrder + "_" + cell.borderLines.join("") + "_" + (cell.feature === CellFeature.Face ? "Face" : "Piece") + cell.sixFaceTwentyFourAngleStr.replace(" + ", "") + "_" + cell.twelveEdge.toString().padStart(2);
                }).join(",\n"));
            }
        }
        if (SIX_FACE_POINT_ARRAY.filter(function (point) { return point < 1; }).length) {
            if (OLD_IS_VALID) {
                showFullCubeInfo(false);
            }
            this.isValid = false;
            this.sixFaces.forEach(function (array) { return array.length = 0; });
            this.twelveEdges.forEach(function (item) { return item.pieces.length = 0; });
            return;
        }
        // ${JSON.stringify(this.actCells)}
        // if (!OLD_IS_VALID) {
        //   log(
        //     `OLD SIX_FACE_POINT_ARRAY:${JSON.stringify(SIX_FACE_POINT_ARRAY)} ${
        //       this.actCells.map((cell) => `${cell.rowIndex}${cell.colIndex}`).join(
        //         "_",
        //       )
        //     } ${
        //       this.actCells.map((cell) =>
        //         `${cell.rowIndex}${cell.colIndex}_${cell.addOrder}_${
        //           cell.borderLines.join("")
        //         }_${cell.sixFaceTwentyFourAngleStr}_${cell.twelveEdgeStr}`
        //       ).join(",")
        //     }`,
        //   );
        // }
        if (!OLD_IS_VALID) {
            showFullCubeInfo(true);
        }
        this.isValid = true;
    };
    Cube.prototype.updateGridLines = function () {
        var actCells = this.actCells;
        var SHOW_BORDER_LINE_CHANGE_INFO = DEBUG.SHOW_BORDER_LINE_CHANGE_INFO;
        var borderLineChangeInfo = "";
        var emptyCells = this.emptyCells;
        actCells.forEach(function (_a) {
            var rowIndex = _a.rowIndex, colIndex = _a.colIndex, borderLines = _a.borderLines;
            var OLD = SHOW_BORDER_LINE_CHANGE_INFO
                ? JSON.stringify(borderLines)
                : "";
            borderLines.forEach(function (borderLine, borderPosition) {
                var siblingRowIndex = 0;
                var siblingColIndex = 0;
                switch (borderPosition) {
                    case CellBorderPosition.Top:
                        siblingRowIndex = rowIndex - 1;
                        siblingColIndex = colIndex;
                        break;
                    case CellBorderPosition.Bottom:
                        siblingRowIndex = rowIndex + 1;
                        siblingColIndex = colIndex;
                        break;
                    case CellBorderPosition.Left:
                        siblingRowIndex = rowIndex;
                        siblingColIndex = colIndex - 1;
                        break;
                    case CellBorderPosition.Right:
                        siblingRowIndex = rowIndex;
                        siblingColIndex = colIndex + 1;
                        break;
                    default:
                        // unreachable
                        break;
                }
                var SIBLING_CELL_ARRAY = actCells.filter(function (cell) {
                    return cell.rowIndex === siblingRowIndex &&
                        cell.colIndex === siblingColIndex;
                });
                var HAS_SIBLING_CELL = !!SIBLING_CELL_ARRAY.length;
                var HAS_NOT_SIBLING_CELL = !HAS_SIBLING_CELL;
                switch (borderLine) {
                    case CellBorderLine.Unknown:
                    default:
                        // do nothing
                        break;
                    case CellBorderLine.CutLine:
                        if (HAS_NOT_SIBLING_CELL) {
                            borderLines[borderPosition] = CellBorderLine.OuterLine;
                        }
                        break;
                    case CellBorderLine.InnerLine:
                        // Attention: only change to OuterLine. If you change it to CutLine, all cells will be connected by only one another cell. So, changed the else branch to comments.
                        // => OuterLine
                        if (HAS_NOT_SIBLING_CELL) {
                            borderLines[borderPosition] = CellBorderLine.OuterLine;
                        }
                        break;
                    case CellBorderLine.OuterLine:
                        // => CutLine
                        if (HAS_SIBLING_CELL) {
                            borderLines[borderPosition] = CellBorderLine.CutLine;
                        }
                        break;
                }
            });
            var NEW = SHOW_BORDER_LINE_CHANGE_INFO
                ? JSON.stringify(borderLines)
                : "";
            if (SHOW_BORDER_LINE_CHANGE_INFO && OLD !== NEW) {
                borderLineChangeInfo +=
                    "[" + rowIndex + "][" + colIndex + "], " + OLD + " => " + NEW + "\n";
            }
        });
        if (SHOW_BORDER_LINE_CHANGE_INFO && borderLineChangeInfo.length) {
            log("updateGridLines(), border lines are changed. \n" + borderLineChangeInfo, "\n actCells:", JSON.stringify(actCells), "\n emptyCells:", JSON.stringify(emptyCells));
        }
        var gridLines = this.gridLines;
        gridLines.length = 0;
        // const RESULT: GridLine[] = [];
        var EXISTS_GRID_LINES = [];
        this.actCells.forEach(function (cell) {
            var rowIndex = cell.rowIndex, colIndex = cell.colIndex, borderLines = cell.borderLines;
            borderLines.forEach(function (borderLine, index) {
                var IS_HORIZONTAL = index % 2 === 0;
                var xStart = colIndex + (index === 1 ? 1 : 0);
                var xEnd = xStart + (IS_HORIZONTAL ? 1 : 0);
                var yStart = rowIndex + (index === 2 ? 1 : 0);
                var yEnd = yStart + (IS_HORIZONTAL ? 0 : 1);
                var lineStyle = borderLine;
                var NEW_POSITION = xStart + "_" + xEnd + "_" + yStart + "_" + yEnd;
                if (EXISTS_GRID_LINES.indexOf(NEW_POSITION) === -1) {
                    gridLines.push({ xStart: xStart, xEnd: xEnd, yStart: yStart, yEnd: yEnd, lineStyle: lineStyle });
                    EXISTS_GRID_LINES.push(NEW_POSITION);
                }
            });
        });
    };
    return Cube;
}());
exports.Cube = Cube;
exports.COL_INDEX_ARRAY_LESS_THAN_OR_EQUALS_THREE_ROW = [[
        0,
        1,
        2,
        3,
        4,
    ]];
// const COL_INDEX_ARRAY_MORE_THAN_THREE_ROW: number[][] = [];
// const ZERO_TO_FOUR_ARRAY = [0, 1, 2, 3, 4];
// function fillColIndexArrayMoreThanThreeRow() {
// 	// 1
// 	for (let i = 0; i < 5; ++i) {
// 		COL_INDEX_ARRAY_MORE_THAN_THREE_ROW.push([i]);
// 	}
// 	// 2
// 	for (let i = 0; i < 5; ++i) {
// 		for (let j = 0; j < 5; ++j) {
// 			if (i === j) {
// 				continue;
// 			}
// 			COL_INDEX_ARRAY_MORE_THAN_THREE_ROW.push([Math.min(i, j), Math.max(i, j)]);
// 		}
// 	}
// 	// 3
// 	for (let i = 0; i < 5; ++i) {
// 		for (let j = 0; j < 5; ++j) {
// 			if (i === j) {
// 				continue;
// 			}
// 			const NEW_ITEM = [0, 1, 2, 3, 4];
// 			NEW_ITEM.splice(NEW_ITEM.indexOf(i), 1);
// 			NEW_ITEM.splice(NEW_ITEM.indexOf(j), 1);
// 			COL_INDEX_ARRAY_MORE_THAN_THREE_ROW.push(NEW_ITEM);
// 		}
// 	}
// 	// 4
// 	for (let i = 0; i < 5; ++i) {
// 		const NEW_ITEM = [0, 1, 2, 3, 4];
// 		NEW_ITEM.splice(NEW_ITEM.indexOf(i), 1);
// 		COL_INDEX_ARRAY_MORE_THAN_THREE_ROW.push(NEW_ITEM);
// 	}
// 	// 5
// 	COL_INDEX_ARRAY_MORE_THAN_THREE_ROW.push(ZERO_TO_FOUR_ARRAY);
// }
// fillColIndexArrayMoreThanThreeRow();
// 直接在调试窗口获得计算结果，不再计算
// export const COL_INDEX_ARRAY_MORE_THAN_THREE_ROW: number[][] = [
// [0],
// [1],
// [2],
// [3],
// [4],
// [0, 1],
// [0, 2],
// [0, 3],
// [0, 4],
// [0, 1],
// [1, 2],
// [1, 3],
// [1, 4],
// [0, 2],
// [1, 2],
// [2, 3],
// [2, 4],
// [0, 3],
// [1, 3],
// [2, 3],
// [3, 4],
// [0, 4],
// [1, 4],
// [2, 4],
// [3, 4],
// [2, 3, 4],
// [1, 3, 4],
// [1, 2, 4],
// [1, 2, 3],
// [2, 3, 4],
// [0, 3, 4],
// [0, 2, 4],
// [0, 2, 3],
// [1, 3, 4],
// [0, 3, 4],
// [0, 1, 4],
// [0, 1, 3],
// [1, 2, 4],
// [0, 2, 4],
// [0, 1, 4],
// [0, 1, 2],
// [1, 2, 3],
// [0, 2, 3],
// [0, 1, 3],
// [0, 1, 2],
// [1, 2, 3, 4],
// [0, 2, 3, 4],
// [0, 1, 3, 4],
// [0, 1, 2, 4],
// [0, 1, 2, 3],
// [0, 1, 2, 3, 4],
// ];
// sort it.
exports.COL_INDEX_ARRAY_MORE_THAN_THREE_ROW = [
    [0],
    [1],
    [2],
    [3],
    [4],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [0, 2],
    [1, 2],
    [2, 3],
    [2, 4],
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 4],
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4],
    [2, 3, 4],
    [1, 3, 4],
    [1, 2, 4],
    [1, 2, 3],
    [2, 3, 4],
    [0, 3, 4],
    [0, 2, 4],
    [0, 2, 3],
    [1, 3, 4],
    [0, 3, 4],
    [0, 1, 4],
    [0, 1, 3],
    [1, 2, 4],
    [0, 2, 4],
    [0, 1, 4],
    [0, 1, 2],
    [1, 2, 3],
    [0, 2, 3],
    [0, 1, 3],
    [0, 1, 2],
    [1, 2, 3, 4],
    [0, 2, 3, 4],
    [0, 1, 3, 4],
    [0, 1, 2, 4],
    [0, 1, 2, 3],
    [0, 1, 2, 3, 4],
];
function showCubeCoreInfo(cube) {
    return cube.cells.map(function (cellsRow) {
        return cellsRow.filter(function (cell) { return cell.feature === CellFeature.Face; }).map(function (cell) { return "" + cell.rowIndex + cell.colIndex + "_" + cell.borderLines.join(""); }).join(",");
    }).join(" | ");
}
exports.showCubeCoreInfo = showCubeCoreInfo;
function showSimpleCubeCoreInfo(cube) {
    return cube.cells.map(function (cellsRow) {
        return cellsRow.filter(function (cell) { return cell.feature === CellFeature.Face; }).map(function (cell) { return "" + cell.rowIndex + cell.colIndex + "_" + cell.borderLines.join(""); }).join(",");
    }).join(" | ");
}
exports.showSimpleCubeCoreInfo = showSimpleCubeCoreInfo;
var SimpleCell = /** @class */ (function () {
    function SimpleCell(rowIndex, colIndex, cellIndex) {
        var _this = this;
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        this.cellIndex = cellIndex;
        this.addOrder = 0;
        this.relatedInformationWhenAdding = {
            rowIndex: -1,
            colIndex: -1,
            relation: ConnectionRelation.Top
        };
        this.feature = CellFeature.Unknown;
        this.sixFace = SixFace.Up;
        this.faceDirection = FourDirection.Original;
        this.twelveEdge = TwelveEdge.NotSure;
        this.borderLines = [
            CellBorderLine.Unknown,
            CellBorderLine.Unknown,
            CellBorderLine.Unknown,
            CellBorderLine.Unknown,
        ];
        this.toString = function () {
            return JSON.stringify(_this);
        };
    }
    Object.defineProperty(SimpleCell.prototype, "isEmpty", {
        get: function () {
            return this.feature === CellFeature.None;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SimpleCell.prototype, "isUnknown", {
        get: function () {
            return this.feature === CellFeature.Unknown;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SimpleCell.prototype, "sixFaceTwentyFourAngle", {
        get: function () {
            return convertSixFaceAndDirectionToSixFaceTwentyFourAngle(this.sixFace, this.faceDirection);
        },
        enumerable: false,
        configurable: true
    });
    SimpleCell.prototype.clone = function () {
        var RESULT = new CellObject(this.rowIndex, this.colIndex, this.cellIndex);
        RESULT.addOrder = this.addOrder;
        RESULT.relatedInformationWhenAdding = this.relatedInformationWhenAdding;
        RESULT.feature = this.feature;
        RESULT.sixFace = this.sixFace;
        RESULT.faceDirection = this.faceDirection;
        RESULT.twelveEdge = this.twelveEdge;
        this.borderLines.forEach(function (value, index) {
            RESULT.borderLines[index] = value;
        });
        return RESULT;
    };
    SimpleCell.prototype.transferTo = function (cell) {
        cell.addOrder = this.addOrder;
        var goalRelatedInfo = cell.relatedInformationWhenAdding;
        var sourceRelatedInfo = this.relatedInformationWhenAdding;
        goalRelatedInfo.rowIndex = sourceRelatedInfo.rowIndex;
        goalRelatedInfo.colIndex = sourceRelatedInfo.colIndex;
        goalRelatedInfo.relation = sourceRelatedInfo.relation;
        cell.borderLines = this.borderLines;
        cell.feature = this.feature;
        cell.faceDirection = this.faceDirection;
        cell.sixFace = this.sixFace;
        cell.twelveEdge = this.twelveEdge;
        // cell.rowIndex = this.rowIndex;
        // cell.colIndex = this.colIndex;
        // cell.cellIndex = this.cellIndex;
    };
    SimpleCell.prototype.reset = function () {
        this.addOrder = 0;
        var _a = this, relatedInformationWhenAdding = _a.relatedInformationWhenAdding, borderLines = _a.borderLines;
        relatedInformationWhenAdding.rowIndex = -1;
        relatedInformationWhenAdding.colIndex = -1;
        relatedInformationWhenAdding.relation = ConnectionRelation.Top;
        borderLines.forEach(function (_old, index) {
            borderLines[index] = CellBorderLine.Unknown;
        });
        this.feature = CellFeature.Unknown;
        this.sixFace = SixFace.Up;
        this.faceDirection = FourDirection.Original;
        // this.rowIndex;
        // this.colIndex;
        // this.cellIndex;
    };
    return SimpleCell;
}());
exports.SimpleCell = SimpleCell;
var SimpleCube = /** @class */ (function () {
    function SimpleCube(rowCount, colCount, isCloning) {
        if (isCloning === void 0) { isCloning = false; }
        this.rowCount = rowCount;
        this.colCount = colCount;
        this.cells = [];
        this.isValid = false;
        if (!isCloning) {
            for (var rowIndex = 0; rowIndex < rowCount; ++rowIndex) {
                var cellRows = [];
                var CELL_INDEX_OFFSET = colCount * rowIndex;
                for (var colIndex = 0; colIndex < colCount; ++colIndex) {
                    cellRows.push(new SimpleCell(rowIndex, colIndex, CELL_INDEX_OFFSET + colIndex));
                }
                this.cells.push(cellRows);
            }
        }
    }
    SimpleCube.prototype.clone = function () {
        var _a = this, rowCount = _a.rowCount, colCount = _a.colCount, cells = _a.cells;
        var cloned = new SimpleCube(rowCount, colCount, true);
        cells.forEach(function (rows) {
            cloned.cells.push(rows.map(function (cell) { return cell.clone(); }));
        });
        cloned.isValid = this.isValid;
        return cloned;
    };
    SimpleCube.prototype.transferTo = function (other) {
        var _a = this, cells = _a.cells, isValid = _a.isValid;
        other.isValid = isValid;
        // other.cells.forEach((rows, rowIndex) => {
        //   const SOURCE_ROWS = cells[rowIndex];
        //   rows.forEach((cell, colIndex) => {
        //     SOURCE_ROWS[colIndex].transferTo(cell);
        //     // const SOURCE_CELL = SOURCE_ROWS[colIndex];
        //     // cell.addOrder = SOURCE_CELL.addOrder;
        //     // const goalRelatedInfo = cell.relatedInformationWhenAdding;
        //     // const sourceRelatedInfo = SOURCE_CELL.relatedInformationWhenAdding;
        //     // goalRelatedInfo.rowIndex = sourceRelatedInfo.rowIndex;
        //     // goalRelatedInfo.colIndex = sourceRelatedInfo.colIndex;
        //     // goalRelatedInfo.relation = sourceRelatedInfo.relation;
        //     // cell.borderLines = SOURCE_CELL.borderLines;
        //     // cell.feature = SOURCE_CELL.feature;
        //     // cell.faceDirection = SOURCE_CELL.faceDirection;
        //     // cell.sixFace = SOURCE_CELL.sixFace;
        //     // // cell.rowIndex = SOURCE_CELL.rowIndex;
        //     // // cell.colIndex = SOURCE_CELL.colIndex;
        //     // // cell.cellIndex = SOURCE_CELL.cellIndex;
        //   });
        // });
        other.cells.forEach(function (rows, rowIndex) {
            var SOURCE_ROWS = cells[rowIndex];
            rows.forEach(function (cell, colIndex) { return SOURCE_ROWS[colIndex].transferTo(cell); });
        });
    };
    SimpleCube.prototype.count = function () {
        var _a = this, cells = _a.cells, rowCount = _a.rowCount, colCount = _a.colCount;
        // const that = this;
        var actCells = [];
        var emptyCells = [];
        var sixFaces = getEmptySixFaces();
        // const MAX_ROW_INDEX = rowCount - 1;
        cells.forEach(function (cellRows) {
            cellRows.forEach(function (cell) {
                switch (cell.feature) {
                    case CellFeature.Unknown:
                    case CellFeature.None:
                        emptyCells.push(cell);
                        break;
                    case CellFeature.Face:
                    case CellFeature.Piece:
                        actCells.push(cell);
                        break;
                    default:
                        // unreachable
                        break;
                }
            });
        });
        this.isValid = getIsValid();
        // log(this.isValid);
        if (!this.isValid) {
            return;
        }
        updateGridLines();
        this.isValid = getIsValid();
        // log(this.isValid);
        if (!this.isValid) {
            ++exports.global_removed_middle_cube_count;
        }
        function getIsValid() {
            var _loop_3 = function (checkRowIndex) {
                if (!actCells.filter(function (cell) {
                    return cell.rowIndex === checkRowIndex;
                }).length) {
                    return { value: false };
                }
            };
            for (var checkRowIndex = 0; checkRowIndex < rowCount; ++checkRowIndex) {
                var state_3 = _loop_3(checkRowIndex);
                if (typeof state_3 === "object")
                    return state_3.value;
            }
            // log("checkRowIndex ok");
            if (SETTINGS.mustContainEveryColumn) {
                var _loop_4 = function (checkColIndex) {
                    if (!actCells.filter(function (cell) {
                        return cell.colIndex === checkColIndex;
                    }).length) {
                        return { value: false };
                    }
                };
                for (var checkColIndex = 0; checkColIndex < colCount; ++checkColIndex) {
                    var state_4 = _loop_4(checkColIndex);
                    if (typeof state_4 === "object")
                        return state_4.value;
                }
            }
            // log("checkColIndex ok");
            // 解决多次修正正确性时，被附加多次的Bug
            sixFaces.forEach(function (array) { return array.length = 0; });
            // 检查六个面是否齐全（每个面至少有一个带“多内联线”的单元格，或至少两个带“单内联线”的单元格）
            var SIX_FACE_POINT_ARRAY = [0, 0, 0, 0, 0, 0];
            // const TWELVE_EDGE_POINT_ARRAY:number[] = (0 as unknown as NumberRepeatFunction).repeat(12);
            var ONE_INNER_LINE_CELL_TWENTY_FOUR_ANGEL_COUNT_ARRAY = 0
                .repeat(exports.ANGLE_COUNT);
            actCells.forEach(function (cell) {
                var rowIndex = cell.rowIndex, colIndex = cell.colIndex, borderLines = cell.borderLines;
                var sixFaceIndex = 0;
                // let sixFaceTwentyFourAngle = 0;
                switch (borderLines.filter(function (borderLine) {
                    return borderLine === CellBorderLine.InnerLine;
                })
                    .length) {
                    case 2:
                    case 3:
                    case 4:
                        sixFaceIndex = cell.sixFace;
                        SIX_FACE_POINT_ARRAY[sixFaceIndex] += 1;
                        sixFaces[sixFaceIndex].push([rowIndex, colIndex]);
                        break;
                    case 1:
                        ONE_INNER_LINE_CELL_TWENTY_FOUR_ANGEL_COUNT_ARRAY[4 * cell.sixFace + (cell.twelveEdge % 4)] += 1;
                        break;
                    default:
                        // unreachable
                        break;
                }
            });
            // log("SIX_FACE_POINT_ARRAY:", SIX_FACE_POINT_ARRAY);
            // // log("TWELVE_EDGE_POINT_ARRAY:", TWELVE_EDGE_POINT_ARRAY);
            // log(
            //   "ONE_INNER_LINE_CELL_TWENTY_FOUR_ANGEL_COUNT_ARRAY:",
            //   ONE_INNER_LINE_CELL_TWENTY_FOUR_ANGEL_COUNT_ARRAY,
            // );
            SIX_FACE_POINT_ARRAY.forEach(function (_point, index) {
                var OFFSET = 4 * index;
                for (var i = 0; i < 4; ++i) {
                    SIX_FACE_POINT_ARRAY[index] +=
                        ONE_INNER_LINE_CELL_TWENTY_FOUR_ANGEL_COUNT_ARRAY[OFFSET + i] > 0
                            ? 0.5
                            : 0;
                }
                // const OFFSET = 2 * index;
                // for (let i = 0; i < 2; ++i) {
                //   SIX_FACE_POINT_ARRAY[index] +=
                //   TWELVE_EDGE_POINT_ARRAY[OFFSET + i] > 0
                //       ? 0.5
                //       : 0;
                // }
            });
            // log("SIX_FACE_POINT_ARRAY:", SIX_FACE_POINT_ARRAY);
            if (SIX_FACE_POINT_ARRAY.filter(function (point) { return point < 1; }).length) {
                sixFaces.forEach(function (array) { return array.length = 0; });
                return false;
            }
            return true;
        }
        function updateGridLines() {
            var SHOW_BORDER_LINE_CHANGE_INFO = DEBUG.SHOW_BORDER_LINE_CHANGE_INFO;
            var borderLineChangeInfo = "";
            actCells.forEach(function (_a) {
                var rowIndex = _a.rowIndex, colIndex = _a.colIndex, borderLines = _a.borderLines;
                var OLD = SHOW_BORDER_LINE_CHANGE_INFO
                    ? JSON.stringify(borderLines)
                    : "";
                borderLines.forEach(function (borderLine, borderPosition) {
                    var siblingRowIndex = 0;
                    var siblingColIndex = 0;
                    switch (borderPosition) {
                        case CellBorderPosition.Top:
                            siblingRowIndex = rowIndex - 1;
                            siblingColIndex = colIndex;
                            break;
                        case CellBorderPosition.Bottom:
                            siblingRowIndex = rowIndex + 1;
                            siblingColIndex = colIndex;
                            break;
                        case CellBorderPosition.Left:
                            siblingRowIndex = rowIndex;
                            siblingColIndex = colIndex - 1;
                            break;
                        case CellBorderPosition.Right:
                            siblingRowIndex = rowIndex;
                            siblingColIndex = colIndex + 1;
                            break;
                        default:
                            // unreachable
                            break;
                    }
                    var SIBLING_CELL_ARRAY = actCells.filter(function (cell) {
                        return cell.rowIndex === siblingRowIndex &&
                            cell.colIndex === siblingColIndex;
                    });
                    var HAS_SIBLING_CELL = !!SIBLING_CELL_ARRAY.length;
                    var HAS_NOT_SIBLING_CELL = !HAS_SIBLING_CELL;
                    switch (borderLine) {
                        case CellBorderLine.Unknown:
                        default:
                            // do nothing
                            break;
                        case CellBorderLine.CutLine:
                            if (HAS_NOT_SIBLING_CELL) {
                                borderLines[borderPosition] = CellBorderLine.OuterLine;
                            }
                            break;
                        case CellBorderLine.InnerLine:
                            // Attention: only change to OuterLine. If you change it to CutLine, all cells will be connected by only one another cell. So, changed the else branch to comments.
                            // => OuterLine
                            if (HAS_NOT_SIBLING_CELL) {
                                borderLines[borderPosition] = CellBorderLine.OuterLine;
                            }
                            break;
                        case CellBorderLine.OuterLine:
                            // => CutLine
                            if (HAS_SIBLING_CELL) {
                                borderLines[borderPosition] = CellBorderLine.CutLine;
                            }
                            break;
                    }
                });
                var NEW = SHOW_BORDER_LINE_CHANGE_INFO
                    ? JSON.stringify(borderLines)
                    : "";
                if (SHOW_BORDER_LINE_CHANGE_INFO && OLD !== NEW) {
                    borderLineChangeInfo +=
                        "[" + rowIndex + "][" + colIndex + "], " + OLD + " => " + NEW + "\n";
                }
            });
            if (SHOW_BORDER_LINE_CHANGE_INFO && borderLineChangeInfo.length) {
                log("updateGridLines(), border lines are changed. \n" + borderLineChangeInfo, "\n actCells:", JSON.stringify(actCells), "\n emptyCells:", JSON.stringify(emptyCells));
            }
        }
    };
    SimpleCube.prototype.reset = function () {
        this.isValid = false;
        this.cells.forEach(function (rows) { return rows.forEach(function (cell) { return cell.reset(); }); });
    };
    return SimpleCube;
}());
exports.SimpleCube = SimpleCube;
function getCubeFromJson(json) {
    var CUBE = JSON.parse(json);
    var cloned = new Cube(CUBE.no, CUBE.rowCount, CUBE.colCount, CUBE.coreRowIndex, CUBE.coreColIndex, true);
    var 
    //   no,
    //   rowCount,
    //   colCount,
    //   coreRowIndex,
    //   coreColIndex,
    cells = CUBE.cells, sixFaces = CUBE.sixFaces, twelveEdges = CUBE.twelveEdges, isValid = CUBE.isValid;
    CUBE.cells.forEach(function (rows) {
        cloned.cells.push(rows.map(function (from) {
            var cell = new CellObject(from.rowIndex, from.colIndex, from.cellIndex);
            cell.layerIndex = from.layerIndex;
            cell.addOrder = from.addOrder;
            cell.relatedInformationWhenAdding = from.relatedInformationWhenAdding;
            cell.feature = from.feature;
            cell.sixFace = from.sixFace;
            cell.faceDirection = from.faceDirection;
            cell.twelveEdge = from.twelveEdge;
            from.borderLines.forEach(function (value, index) {
                cell.borderLines[index] = value;
            });
            return cell;
        }));
    });
    // 经测试，需先count，再赋值sixFaces、twelveEdges，否则count后sixFaces可能丢失部分值
    // {
    //   cloned.sixFaces = sixFaces;
    //   cloned.twelveEdges = twelveEdges;
    //   cloned.isValid = isValid;
    //   if(CUBE.no === 721) {
    //     log('before count', cloned);
    //   }
    //   cloned.count();
    //   if(CUBE.no === 721) {
    //     log('after count', cloned);
    //   }
    // }
    //   cloned.count();
    // cloned.actCells = JSON.parse(JSON.stringify(CUBE.actCells));
    // cloned.emptyCells = JSON.parse(JSON.stringify(CUBE.emptyCells));
    cloned.actCells.length = 0;
    CUBE.actCells.forEach(function (cell) {
        cloned.actCells.push(cloned.cells[cell.rowIndex][cell.colIndex]);
    });
    cloned.emptyCells.length = 0;
    CUBE.emptyCells.forEach(function (cell) {
        cloned.emptyCells.push(cloned.cells[cell.rowIndex][cell.colIndex]);
    });
    cloned.gridLines = CUBE.gridLines;
    cloned.firstRowActCellColIndexBill = CUBE.firstRowActCellColIndexBill;
    cloned.lastRowEmptyCellColIndexBill = CUBE.lastRowEmptyCellColIndexBill;
    cloned.sixFaces = sixFaces;
    cloned.twelveEdges = twelveEdges;
    cloned.isValid = isValid;
    return cloned;
}
exports.getCubeFromJson = getCubeFromJson;
/*
set pwd=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\
cls && deno lint %pwd%\cubeCore.ts && deno fmt %pwd%\cubeCore.ts
*/
