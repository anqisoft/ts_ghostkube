/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * src\cubeCore.ts v0.0.6
 * deno 1.42.1 + VSCode 1.88.0
 */

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

export const Globals = globalThis as unknown as {
  logFilename: "./log.txt";
};

const COL_COUNT = 5;
const MAX_COL_INDEX = COL_COUNT - 1;
const { floor } = Math;
const SETTINGS = {
  mustContainEveryColumn: true,
};
const DEBUG = {
  // false true

  SHOW_SIX_FACE_AND_DIRECTION_RELATIONS: false,

  SHOW_BORDER_LINE_CHANGE_INFO: false,
  SHOW_FULL_CUBE_INFO: false,

  SHOW_MIDDLE_CUBE_CHANGED_TO_NOT_VALID_MESSAGE: false,
};

// deno-lint-ignore no-explicit-any
export function log(...dataArray: any[]) {
  console.log(...dataArray);
  let LOG_STRING = JSON.stringify(dataArray);
  LOG_STRING = LOG_STRING.substring(1, LOG_STRING.length - 1);
  if (LOG_STRING.startsWith('"') && LOG_STRING.endsWith('"')) {
    LOG_STRING = LOG_STRING.substring(1, LOG_STRING.length - 1);
  }
  Deno.writeTextFileSync(
    Globals.logFilename,
    // LOG_STRING.substring(1, LOG_STRING.length - 1).replace(/\\n/g, "\n").concat(
    //   "\n",
    // ),

    LOG_STRING.replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .concat(
        "\n",
      ),
    {
      append: true,
    },
  );
}

let dateBegin = performance.now();
export function getUsedTimeString(
  functionName: string,
  duration: number,
): string {
  return `${functionName} used ${duration.toFixed(2)} milliseconds, or ${
    (duration / 1000).toFixed(3)
  } seconds${
    duration > 60000
      ? `, or ${(duration / 60000).toFixed(1)} minutes, ${
        duration > 3600000
          ? `, or ${Math.floor(duration / 3600000)}hours${
            Math.floor(duration % 3600000 / 60000)
          }minutes${(Math.floor(duration % 60000) / 1000).toFixed(0)}seconds`
          : ""
      }`
      : ""
  }`;
}
export function logUsedTime(functionName: string, duration: number) {
  log(getUsedTimeString(functionName, duration));
}
export function showUsedTime(functionName: string) {
  const end = performance.now();
  const duration = end - dateBegin;
  logUsedTime(functionName, duration);

  dateBegin = end;
}

export let global_removed_middle_cube_count = 0;
export const ANGLE_COUNT = 24;

export const SIX_FACE_SHORT_NAMES: string[] = "UDLRFB".split("");
// export const SIX_FACE_NAME_CHARS: string[] = '❶❷❸❹❺❻'.split('');
export const SIX_FACE_NAME_CHARS: string[] = "⒈⒉⒊⒋⒌⒍".split("");

export const FACE_NAME_ARRAY: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
export const TWELVE_EDGE_NAME_CHARS: string[] = "①②③④⑤⑥⑦⑧⑨⑩⑪⑫".split("");

// export const CUBES: Cube[] = [];
export interface BooleanRepeatFunction {
  repeat: (times: number) => boolean[];
}
interface Boolean extends BooleanRepeatFunction {}
(Boolean.prototype as unknown as BooleanRepeatFunction).repeat = function (
  times: number,
): boolean[] {
  const RESULT: boolean[] = [];
  for (let i = 0; i < times; ++i) {
    RESULT.push(this as unknown as boolean);
  }

  return RESULT;
};

export interface NumberRepeatFunction {
  repeat: (times: number) => number[];
}
interface Number extends NumberRepeatFunction {}
(Number.prototype as unknown as NumberRepeatFunction).repeat = function (
  times: number,
): number[] {
  const RESULT: number[] = [];
  for (let i = 0; i < times; ++i) {
    RESULT.push(this as unknown as number);
  }

  return RESULT;
};

export interface ArrayRepeatFunction {
  repeat: (times: number) => Array[];
}
interface Array extends ArrayRepeatFunction {}
(Array.prototype as unknown as ArrayRepeatFunction).repeat = function (
  times: number,
): Array[] {
  const RESULT: Array[] = [];
  for (let i = 0; i < times; ++i) {
    RESULT.push(this as unknown as Array);
  }

  return RESULT;
};

export enum FourDirection {
  Original,
  Clockwise90,
  SemiCircle,
  Counterclockwise90,
}
export const TextDirections = [0, 90, 180, 270];
export const FourDirectionMaxIndex = 3;
export const FourDirectionCount = 4;

export enum GridLineStyle {
  Unknown,
  None,
  InnerLine,
  CutLine,
  OuterLine,
}

export enum CellBorderLine {
  Unknown = GridLineStyle.Unknown,
  InnerLine = GridLineStyle.InnerLine,
  CutLine = GridLineStyle.CutLine,
  OuterLine = GridLineStyle.OuterLine,
}

export enum CellBorderPosition {
  Top,
  Right,
  Bottom,
  Left,
}

export enum CellFeature {
  Unknown,
  None,
  Face,
  Piece,
}

export enum SixFace {
  Up,
  Down,
  Left,
  Right,
  Front,
  Back,
}
export const SixFaceMaxIndex = 5;
export const SixFaceCount = 6;

export enum SixFaceTwentyFourAngle {
  UpOriginal,
  UpClockwise90,
  UpSemiCircle,
  UpCounterclockwise90,

  DownOriginal,
  DownClockwise90,
  DownSemiCircle,
  DownCounterclockwise90,

  LeftOriginal,
  LeftClockwise90,
  LeftSemiCircle,
  LeftCounterclockwise90,

  RightOriginal,
  RightClockwise90,
  RightSemiCircle,
  RightCounterclockwise90,

  FrontOriginal,
  FrontClockwise90,
  FrontSemiCircle,
  FrontCounterclockwise90,

  BackOriginal,
  BackClockwise90,
  BackSemiCircle,
  BackCounterclockwise90,
}

export function convertSixFaceTwentyFourAngleToSixFaceAndDirection(
  value: SixFaceTwentyFourAngle,
): [number, number] {
  const FIXED_VALUE = value + 0.5;
  return [floor(FIXED_VALUE / 4), floor(FIXED_VALUE % 4)];
}
/*
function convertSixFaceTwentyFourAngleToSixFaceAndDirection(value){const FIXED_VALUE = value + 0.5;return [Math.floor(FIXED_VALUE / 4), Math.floor(FIXED_VALUE % 4)];}

[ 0, 0 ]
[ 0, 1 ]
[ 0, 2 ]
[ 0, 3 ]
[ 1, 0 ]
[ 1, 1 ]
[ 1, 2 ]
[ 1, 3 ]
[ 2, 0 ]
[ 2, 1 ]
[ 2, 2 ]
[ 2, 3 ]
[ 3, 0 ]
[ 3, 1 ]
[ 3, 2 ]
[ 3, 3 ]
[ 4, 0 ]
[ 4, 1 ]
[ 4, 2 ]
[ 4, 3 ]
[ 5, 0 ]
[ 5, 1 ]
[ 5, 2 ]
[ 5, 3 ]
*/

export function convertSixFaceTwentyFourAngleToString(
  value: SixFaceTwentyFourAngle,
): string {
  const FIXED_VALUE = value + 0.5;
  return `${SIX_FACE_SHORT_NAMES[floor(FIXED_VALUE / 4)]} + ${
    90 * floor(FIXED_VALUE % 4)
  }`;
}

export function convertSixFaceAndDirectionToSixFaceTwentyFourAngle(
  sixFace: SixFace,
  fourDirection: FourDirection,
): SixFaceTwentyFourAngle {
  return 4 * sixFace + fourDirection;
}

export enum ConnectionRelation {
  Top,
  Right,
  Bottom,
  Left,
}

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

// 	<en_us>en_us</en_us>
// 	<zh_cn>在调试窗口直接获得相应结果，不再计算</zh_cn>
// 	<zh_tw>zh_tw</zh_tw>
export const SIX_FACE_AND_DIRECTION_RELATIONS: SixFaceTwentyFourAngle[][] = [
  [20, 12, 16, 8], // 0
  [9, 21, 13, 17], // 1
  [18, 10, 22, 14], // 2
  [15, 19, 11, 23], // 3
  [22, 8, 18, 12], // 4
  [13, 23, 9, 19], // 5
  [16, 14, 20, 10], // 6
  [11, 17, 15, 21], // 7
  [23, 0, 17, 4], // 8
  [5, 20, 1, 18], // 9
  [19, 6, 21, 2], // 10
  [3, 16, 7, 22], // 11
  [21, 4, 19, 0], // 12
  [1, 22, 5, 16], // 13
  [17, 2, 23, 6], // 14
  [7, 18, 3, 20], // 15
  [0, 13, 6, 11], // 16
  [8, 1, 14, 7], // 17
  [4, 9, 2, 15], // 18
  [12, 5, 10, 3], // 19
  [6, 15, 0, 9], // 20
  [10, 7, 12, 1], // 21
  [2, 11, 4, 13], // 22
  [14, 3, 8, 5], // 23
];

function showSixFaceAndDirectionRelations() {
  if (!DEBUG.SHOW_SIX_FACE_AND_DIRECTION_RELATIONS) {
    return;
  }
  log("SIX_FACE_AND_DIRECTION_RELATIONS:", SIX_FACE_AND_DIRECTION_RELATIONS);
  SIX_FACE_AND_DIRECTION_RELATIONS.forEach((item, index) => {
    log(
      convertSixFaceTwentyFourAngleToString(index),
      item.map((to) => `${convertSixFaceTwentyFourAngleToString(to)}`),
    );
  });
}
showSixFaceAndDirectionRelations();

export enum TwelveEdge {
  UpTop,
  UpRight,
  UpBottom,
  UpLeft,

  BackLeft,
  BackRight,
  FrontRight,
  FrontLeft,

  DownTop,
  DownRight,
  DownBottom,
  DownLeft,

  NotSure,
}

export const SixFaceTwentyFourAngleToTwelveEdge: TwelveEdge[][] = [
  // U
  [
    TwelveEdge.UpTop,
    TwelveEdge.UpRight,
    TwelveEdge.UpBottom,
    TwelveEdge.UpLeft,
  ],
  [
    TwelveEdge.UpLeft,
    TwelveEdge.UpTop,
    TwelveEdge.UpRight,
    TwelveEdge.UpBottom,
  ],
  [
    TwelveEdge.UpBottom,
    TwelveEdge.UpLeft,
    TwelveEdge.UpTop,
    TwelveEdge.UpRight,
  ],
  [
    TwelveEdge.UpRight,
    TwelveEdge.UpBottom,
    TwelveEdge.UpLeft,
    TwelveEdge.UpTop,
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
// export const SixFaceTwentyFourAngleToTwelveEdge: TwelveEdge[][] = [
//   // U
//   [
//     TwelveEdge.UpTop,
//     TwelveEdge.UpRight,
//     TwelveEdge.UpBottom,
//     TwelveEdge.UpLeft,
//   ],
//   [
//     TwelveEdge.UpRight,
//     TwelveEdge.UpBottom,
//     TwelveEdge.UpLeft,
//     TwelveEdge.UpTop,
//   ],
//   [
//     TwelveEdge.UpBottom,
//     TwelveEdge.UpLeft,
//     TwelveEdge.UpTop,
//     TwelveEdge.UpRight,
//   ],
//   [
//     TwelveEdge.UpLeft,
//     TwelveEdge.UpTop,
//     TwelveEdge.UpRight,
//     TwelveEdge.UpBottom,
//   ],

//   // D
//   [
//     TwelveEdge.DownTop,
//     TwelveEdge.DownLeft,
//     TwelveEdge.DownBottom,
//     TwelveEdge.DownRight,
//   ],
//   [
//     TwelveEdge.DownRight,
//     TwelveEdge.DownTop,
//     TwelveEdge.DownLeft,
//     TwelveEdge.DownBottom,
//   ],
//   [
//     TwelveEdge.DownBottom,
//     TwelveEdge.DownRight,
//     TwelveEdge.DownTop,
//     TwelveEdge.DownLeft,
//   ],
//   [
//     TwelveEdge.DownLeft,
//     TwelveEdge.DownBottom,
//     TwelveEdge.DownRight,
//     TwelveEdge.DownTop,
//   ],

//   // L
//   [
//     TwelveEdge.BackLeft,
//     TwelveEdge.UpLeft,
//     TwelveEdge.FrontLeft,
//     TwelveEdge.DownLeft,
//   ],
//   [
//     TwelveEdge.DownLeft,
//     TwelveEdge.BackLeft,
//     TwelveEdge.UpLeft,
//     TwelveEdge.FrontLeft,
//   ],
//   [
//     TwelveEdge.FrontLeft,
//     TwelveEdge.DownLeft,
//     TwelveEdge.BackLeft,
//     TwelveEdge.UpLeft,
//   ],
//   [
//     TwelveEdge.UpLeft,
//     TwelveEdge.FrontLeft,
//     TwelveEdge.DownLeft,
//     TwelveEdge.BackLeft,
//   ],

//   // R
//   [
//     TwelveEdge.BackRight,
//     TwelveEdge.DownRight,
//     TwelveEdge.FrontRight,
//     TwelveEdge.UpRight,
//   ],
//   [
//     TwelveEdge.UpRight,
//     TwelveEdge.BackRight,
//     TwelveEdge.DownRight,
//     TwelveEdge.FrontRight,
//   ],
//   [
//     TwelveEdge.FrontRight,
//     TwelveEdge.UpRight,
//     TwelveEdge.BackRight,
//     TwelveEdge.DownRight,
//   ],
//   [
//     TwelveEdge.DownRight,
//     TwelveEdge.FrontRight,
//     TwelveEdge.UpRight,
//     TwelveEdge.BackRight,
//   ],

//   // F
//   [
//     TwelveEdge.UpBottom,
//     TwelveEdge.FrontRight,
//     TwelveEdge.DownBottom,
//     TwelveEdge.FrontLeft,
//   ],
//   [
//     TwelveEdge.FrontLeft,
//     TwelveEdge.UpBottom,
//     TwelveEdge.FrontRight,
//     TwelveEdge.DownBottom,
//   ],
//   [
//     TwelveEdge.DownBottom,
//     TwelveEdge.FrontLeft,
//     TwelveEdge.UpBottom,
//     TwelveEdge.FrontRight,
//   ],
//   [
//     TwelveEdge.FrontRight,
//     TwelveEdge.DownBottom,
//     TwelveEdge.FrontLeft,
//     TwelveEdge.UpBottom,
//   ],

//   // B
//   [
//     TwelveEdge.DownTop,
//     TwelveEdge.BackRight,
//     TwelveEdge.UpTop,
//     TwelveEdge.BackLeft,
//   ],
//   [
//     TwelveEdge.BackLeft,
//     TwelveEdge.DownTop,
//     TwelveEdge.BackRight,
//     TwelveEdge.UpTop,
//   ],
//   [
//     TwelveEdge.UpTop,
//     TwelveEdge.BackLeft,
//     TwelveEdge.DownTop,
//     TwelveEdge.BackRight,
//   ],
//   [
//     TwelveEdge.BackRight,
//     TwelveEdge.UpTop,
//     TwelveEdge.BackLeft,
//     TwelveEdge.DownTop,
//   ],
// ];
export function convertTwelveEdgeToString(value: TwelveEdge): string {
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

export function getSixFaceTwentyFourAngleRelationTwelveEdge(
  sixFaceTwentyFourAngle: SixFaceTwentyFourAngle,
  relation: ConnectionRelation,
): TwelveEdge {
  return SixFaceTwentyFourAngleToTwelveEdge[sixFaceTwentyFourAngle][relation];
}

export interface Cell {
  rowIndex: number;
  colIndex: number;
  cellIndex: number;
  layerIndex: number;

  addOrder: number;
  relatedInformationWhenAdding: {
    rowIndex: number;
    colIndex: number;
    relation: ConnectionRelation;
  };

  feature: CellFeature;
  sixFace: SixFace;
  faceDirection: FourDirection;
  twelveEdge: TwelveEdge;
  get isEmpty(): boolean;
  get isUnknown(): boolean;
  get sixFaceTwentyFourAngle(): SixFaceTwentyFourAngle;
  get sixFaceTwentyFourAngleStr(): string;
  get twelveEdgeStr(): string;

  borderLines: CellBorderLine[];
  toString: () => string;
}

export class CellObject implements Cell {
  /**
   * 未使用的格为0，六面面片（含单格、双格两种情况）从1开始（越靠里面的越小），插片为所连面片的层序加1
   */
  layerIndex = 0;

  addOrder = 0;
  relatedInformationWhenAdding = {
    rowIndex: -1,
    colIndex: -1,
    relation: ConnectionRelation.Top,
  };

  feature: CellFeature = CellFeature.Unknown;
  sixFace: SixFace = SixFace.Up;
  faceDirection: FourDirection = FourDirection.Original;
  twelveEdge: TwelveEdge = TwelveEdge.NotSure;
  get isEmpty(): boolean {
    return this.feature === CellFeature.None;
  }
  get isUnknown(): boolean {
    return this.feature === CellFeature.Unknown;
  }
  get sixFaceTwentyFourAngle(): SixFaceTwentyFourAngle {
    return convertSixFaceAndDirectionToSixFaceTwentyFourAngle(
      this.sixFace,
      this.faceDirection,
    );
  }
  get sixFaceTwentyFourAngleStr(): string {
    return convertSixFaceTwentyFourAngleToString(this.sixFaceTwentyFourAngle);
  }
  get twelveEdgeStr(): string {
    return convertTwelveEdgeToString(this.twelveEdge);
  }

  borderLines: CellBorderLine[] = [
    CellBorderLine.Unknown,
    CellBorderLine.Unknown,
    CellBorderLine.Unknown,
    CellBorderLine.Unknown,
  ];
  toString: () => string = () => {
    return JSON.stringify(this);
  };
  clone(): CellObject {
    const RESULT = new CellObject(this.rowIndex, this.colIndex, this.cellIndex);
    RESULT.layerIndex = this.layerIndex;

    RESULT.addOrder = this.addOrder;
    RESULT.relatedInformationWhenAdding = this.relatedInformationWhenAdding;

    RESULT.feature = this.feature;
    RESULT.sixFace = this.sixFace;
    RESULT.faceDirection = this.faceDirection;
    RESULT.twelveEdge = this.twelveEdge;
    this.borderLines.forEach((value, index) => {
      RESULT.borderLines[index] = value;
    });

    return RESULT;
  }

  constructor(
    public rowIndex: number,
    public colIndex: number,
    public cellIndex: number,
  ) {
  }

  getConnectedCellIndexByRelation(
    relation: ConnectionRelation,
  ): number {
    const CELL_INDEX = this.cellIndex;
    switch (relation) {
      case ConnectionRelation.Top:
        return CELL_INDEX - COL_COUNT;
      case ConnectionRelation.Right:
        return CELL_INDEX + 1;
      case ConnectionRelation.Bottom:
        return CELL_INDEX + COL_COUNT;
      case ConnectionRelation.Left:
        return CELL_INDEX - 1;
        // default:
        //   // unreachable
        //   return 0;
    }
  }
}

export interface GridLine {
  xStart: number;
  xEnd: number;
  yStart: number;
  yEnd: number;
  lineStyle: GridLineStyle;
}

/**
 * <en_us>en_us</en_us>
 * <zh_cn>一个面形成正方体最外面六面之一时，对应的单元格行列序号（在纸模中）</zh_cn>
 * <zh_tw>zh_tw</zh_tw>
 */
export type OneCellRowColIndex = [number, number];

/**
 * <en_us>en_us</en_us>
 * <zh_cn>两个面粘贴成正方体最外面六面之一时，对应的两个单元格行列序号（在纸模中）</zh_cn>
 * <zh_tw>zh_tw</zh_tw>
 */
export type TwoCellRowColIndex = [number, number, number, number];
export type OneOrTwoCellRowColIndex = OneCellRowColIndex | TwoCellRowColIndex;

export type FaceMemberOfSixFace = OneOrTwoCellRowColIndex[];

export type SixFaces = [
  FaceMemberOfSixFace,
  FaceMemberOfSixFace,
  FaceMemberOfSixFace,
  FaceMemberOfSixFace,
  FaceMemberOfSixFace,
  FaceMemberOfSixFace,
];
export interface OneOfTwelveEdges {
  canBeInserted: boolean;
  pieces: OneCellRowColIndex[];
}
export type TwelveEdges = [
  OneOfTwelveEdges,
  OneOfTwelveEdges,
  OneOfTwelveEdges,
  OneOfTwelveEdges,
  OneOfTwelveEdges,
  OneOfTwelveEdges,
  OneOfTwelveEdges,
  OneOfTwelveEdges,
  OneOfTwelveEdges,
  OneOfTwelveEdges,
  OneOfTwelveEdges,
  OneOfTwelveEdges,
];
function getEmptySixFaces(): SixFaces {
  return [
    [],
    [],
    [],
    [],
    [],
    [],
  ];
}
function getEmptyTwelveEdges(): TwelveEdges {
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

export interface CubePaperModel {
  no: number;

  rowCount: number;
  colCount: number;

  coreRowIndex: number;
  coreColIndex: number;

  cells: CellObject[][];
  actCells: CellObject[];
  emptyCells: CellObject[];
  gridLines: GridLine[];

  firstRowActCellColIndexBill: string;
  lastRowEmptyCellColIndexBill: string;
  count(): void;
}

export interface CubeObject {
  sixFaces: SixFaces;
  twelveEdges: TwelveEdges;
  isValid: boolean;
}
export class Cube implements CubePaperModel, CubeObject {
  // from CubePaperModel
  cells: CellObject[][] = [];
  actCells: CellObject[] = [];
  emptyCells: CellObject[] = [];
  gridLines: GridLine[] = [];

  firstRowActCellColIndexBill: string = "";
  lastRowEmptyCellColIndexBill: string = "";

  // from CubeObject
  sixFaces: SixFaces = getEmptySixFaces();
  twelveEdges: TwelveEdges = getEmptyTwelveEdges();
  isValid: boolean = false;

  constructor(
    public no: number,
    public rowCount: number,
    public colCount: number,
    public coreRowIndex: number,
    public coreColIndex: number,
    isCloning: boolean = false,
  ) {
    if (!isCloning) {
      for (let rowIndex = 0; rowIndex < rowCount; ++rowIndex) {
        const cellRows: CellObject[] = [];
        const CELL_INDEX_OFFSET = colCount * rowIndex;
        for (let colIndex = 0; colIndex < colCount; ++colIndex) {
          cellRows.push(
            new CellObject(rowIndex, colIndex, CELL_INDEX_OFFSET + colIndex),
          );
        }
        this.cells.push(cellRows);
      }
    }
  }

  /**
   * <en_us>en_us</en_us>
   * <zh_cn>根据gridLines获取不包括外框之外的线（如果没有，则默认为外框线）</zh_cn>
   * <zh_tw>zh_tw</zh_tw>
   */
  get lines(): string {
    const ROW_COUNT = this.rowCount;
    const MAX_ROW_INDEX = ROW_COUNT - 1;

    const { gridLines } = this;
    const GRID_LINES_COUNT = gridLines.length;

    const HORIZONTAL_LINE_COUNT = COL_COUNT * MAX_ROW_INDEX;
    const HORIZONTAL_LINE_ARRAY: number[] = [];
    for (let i = 0; i < HORIZONTAL_LINE_COUNT; ++i) {
      HORIZONTAL_LINE_ARRAY.push(4);
    }

    const VERTICAL_LINE_COUNT = MAX_COL_INDEX * ROW_COUNT;
    const VERTICAL_LINE_ARRAY: number[] = [];
    for (let i = 0; i < VERTICAL_LINE_COUNT; ++i) {
      VERTICAL_LINE_ARRAY.push(4);
    }

    let debug = "";
    for (
      let gridLineIndex = 0;
      gridLineIndex < GRID_LINES_COUNT;
      ++gridLineIndex
    ) {
      const {
        xStart,
        xEnd,
        yStart,
        yEnd,
        lineStyle,
      } = gridLines[gridLineIndex];

      if (lineStyle === GridLineStyle.OuterLine) {
        continue;
      }

      if (yStart === yEnd) {
        const index = COL_COUNT * (yStart - 1) + xStart;
        if (index >= 0 && index < HORIZONTAL_LINE_COUNT) {
          HORIZONTAL_LINE_ARRAY[index] = lineStyle;
        }
      } else if (xStart === xEnd) {
        const index = MAX_COL_INDEX * yStart + (xStart - 1);
        if (index >= 0 && index < VERTICAL_LINE_COUNT) {
          VERTICAL_LINE_ARRAY[index] = lineStyle;
        }
      }
    }

    return `${HORIZONTAL_LINE_ARRAY.join("")}${VERTICAL_LINE_ARRAY.join("")}`;
  }
  // get lines(): string {
  //   const ROW_COUNT = this.rowCount;
  //   const MAX_ROW_INDEX = ROW_COUNT - 1;

  //   const { gridLines } = this;
  //   const GRID_LINES_COUNT = gridLines.length;

  //   const HORIZONTAL_LINE_COUNT = COL_COUNT * MAX_ROW_INDEX;
  //   const HORIZONTAL_LINE_ARRAY: number[] = [];
  //   for (let i = 0; i < HORIZONTAL_LINE_COUNT; ++i) {
  //     HORIZONTAL_LINE_ARRAY.push(4);
  //   }

  //   const VERTICAL_LINE_COUNT = MAX_COL_INDEX * ROW_COUNT;
  //   const VERTICAL_LINE_ARRAY: number[] = [];
  //   for (let i = 0; i < VERTICAL_LINE_COUNT; ++i) {
  //     VERTICAL_LINE_ARRAY.push(4);
  //   }

  //   let debug = "";
  //   for (
  //     let gridLineIndex = 0;
  //     gridLineIndex < GRID_LINES_COUNT;
  //     ++gridLineIndex
  //   ) {
  //     // const {
  //     //   xStart,
  //     //   xEnd,
  //     //   yStart,
  //     //   yEnd,
  //     //   lineStyle,
  //     // } = gridLines[gridLineIndex];
  //     const gridLine = gridLines[gridLineIndex];
  //     const {
  //       xStart,
  //       xEnd,
  //       yStart,
  //       yEnd,
  //       lineStyle,
  //     } = gridLine;

  //     if (lineStyle === GridLineStyle.OuterLine) {
  //       continue;
  //     }

  //     if (yStart === yEnd) {
  //       const index = COL_COUNT * (yStart - 1) + xStart;
  //       if (index >= 0 && index < HORIZONTAL_LINE_COUNT) {
  //         debug += `H[${index}] = ${lineStyle} <= ${
  //           JSON.stringify(gridLine)
  //         }\n`;
  //         HORIZONTAL_LINE_ARRAY[index] = lineStyle;
  //       }
  //     } else if (xStart === xEnd) {
  //       const index = MAX_COL_INDEX * yStart + (xStart - 1);
  //       if (index >= 0 && index < VERTICAL_LINE_COUNT) {
  //         debug += `V[${index}] = ${lineStyle} <= ${
  //           JSON.stringify(gridLine)
  //         }\n`;
  //         VERTICAL_LINE_ARRAY[index] = lineStyle;
  //       }
  //     }
  //   }

  //   if (this.no === 1) {
  //     console.log(
  //       `${HORIZONTAL_LINE_COUNT} => ${HORIZONTAL_LINE_ARRAY.length}`,
  //       `${VERTICAL_LINE_COUNT} => ${VERTICAL_LINE_ARRAY.length}`,
  //       `${HORIZONTAL_LINE_ARRAY.join("")}${VERTICAL_LINE_ARRAY.join("")}`,
  //       "\n",
  //       gridLines.map(({
  //         xStart,
  //         xEnd,
  //         yStart,
  //         yEnd,
  //         lineStyle,
  //       }) => `${xStart}${xEnd}${yStart}${yEnd}${lineStyle}`).join("|"),
  //       `\n\n${debug}`,
  //     );
  //   }
  //   return `${HORIZONTAL_LINE_ARRAY.join("")}${VERTICAL_LINE_ARRAY.join("")}`;
  // }

  clone(): Cube {
    const {
      no,
      rowCount,
      colCount,
      coreRowIndex,
      coreColIndex,

      cells,
    } = this;
    const cloned = new Cube(
      no,
      rowCount,
      colCount,
      coreRowIndex,
      coreColIndex,
      true,
    );

    cells.forEach((rows) => {
      cloned.cells.push(rows.map((cell) => cell.clone()));
    });

    cloned.actCells.length = 0;
    this.actCells.forEach((cell) => {
      cloned.actCells.push(cloned.cells[cell.rowIndex][cell.colIndex]);
    });

    cloned.emptyCells.length = 0;
    this.emptyCells.forEach((cell) => {
      cloned.emptyCells.push(cloned.cells[cell.rowIndex][cell.colIndex]);
    });

    cloned.gridLines = JSON.parse(JSON.stringify(this.gridLines));

    cloned.firstRowActCellColIndexBill = this.firstRowActCellColIndexBill;
    cloned.lastRowEmptyCellColIndexBill = this.lastRowEmptyCellColIndexBill;

    cloned.sixFaces = JSON.parse(JSON.stringify(this.sixFaces));
    cloned.twelveEdges = JSON.parse(JSON.stringify(this.twelveEdges));

    cloned.isValid = this.isValid;

    return cloned;
  }

  count(): void {
    this.actCells.length = 0;
    this.emptyCells.length = 0;
    this.cells.forEach((cellRows: CellObject[]) => {
      cellRows.forEach((
        cell: CellObject,
      ) => {
        switch (cell.feature) {
          case CellFeature.Unknown:
          case CellFeature.None:
            this.emptyCells.push(cell);
            break;
          case CellFeature.Face:
          case CellFeature.Piece:
            this.actCells.push(cell);
            break;
          default:
            // unreachable
            break;
        }
      });
    });

    this.firstRowActCellColIndexBill = this.actCells.filter((cell) =>
      cell.rowIndex === 0
    ).map((
      cell,
    ) => cell.colIndex).join("");

    const MAX_ROW_INDEX = this.rowCount - 1;
    this.lastRowEmptyCellColIndexBill = this.emptyCells.filter((cell) =>
      cell.rowIndex === MAX_ROW_INDEX
    ).map((cell) => cell.colIndex).join("");

    this.updateIsValid();
    if (this.isValid) {
      this.updateGridLines();
      this.updateIsValid();

      if (!this.isValid) {
        ++global_removed_middle_cube_count;

        if (DEBUG.SHOW_MIDDLE_CUBE_CHANGED_TO_NOT_VALID_MESSAGE) {
          log(
            "not valid",
            this.actCells.map((cell) => `${cell.rowIndex}${cell.colIndex}`)
              .join(
                "_",
              ),
            `\n${
              this.actCells.map((cell) =>
                `${cell.rowIndex}${cell.colIndex}_${
                  cell.addOrder.toString().padStart(2, "0")
                }_${cell.borderLines.join("")}_${
                  cell.feature === CellFeature.Face ? "Face_" : "Piece"
                }_${cell.twelveEdge.toString().padStart(2, "0")}_${
                  cell.sixFaceTwentyFourAngleStr.replace(" + ", "")
                }`
              ).join(",\n")
            }`,
            "\n",
          );
        }
      }
    }
  }

  countLayerIndex(): void {
    const { cells, sixFaces, twelveEdges } = this;

    sixFaces.forEach((face) => {
      let layerIndex = 0;
      face.forEach((faceMemberOfSixFace) => {
        const [firstRowIndex, firstColIndex, secondRowIndex, secondColIndex] =
          faceMemberOfSixFace;
        const firstCell = cells[firstRowIndex][firstColIndex];
        firstCell.layerIndex = ++layerIndex;
        firstCell.twelveEdge = TwelveEdge.NotSure;

        if (faceMemberOfSixFace.length === 4) {
          const secondCell =
            cells[secondRowIndex as number][secondColIndex as number];
          secondCell.layerIndex = ++layerIndex;
          secondCell.twelveEdge = TwelveEdge.NotSure;
        }
      });
    });

    twelveEdges.forEach((oneEdge, edgeIndex) => {
      oneEdge.pieces.forEach((cellRowColIndex) => {
        const [rowIndex, colIndex] = cellRowColIndex;
        const pieceCell = cells[rowIndex][colIndex];
        pieceCell.feature = CellFeature.Piece;
        pieceCell.twelveEdge = edgeIndex;

        // // 	<en_us>en_us</en_us>
        // // 	<zh_cn>复位“面属性”</zh_cn>
        // // 	<zh_tw>zh_tw</zh_tw>
        // pieceCell.sixFace = SixFace.Up;
        // pieceCell.faceDirection = FourDirection.Original;

        const {
          rowIndex: relatedRowIndex,
          colIndex: relatedColIndex,
        } = pieceCell.relatedInformationWhenAdding;

        if (relatedRowIndex === -1) {
          pieceCell.borderLines.forEach((borderLine, borderLineIndex) => {
            if (borderLine === CellBorderLine.InnerLine) {
              switch (borderLineIndex as ConnectionRelation) {
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
        } else {
          pieceCell.layerIndex =
            cells[relatedRowIndex][relatedColIndex].layerIndex + 1;
        }
      });
    });
  }

  syncAndClear(): void {
    this.sync();
    this.clear();
  }

  clear(): void {
    this.cells = undefined;
    this.isValid = undefined;
    this.emptyCells = undefined;

    this.colCount = undefined;
    this.coreRowIndex = undefined;
  }

  sync(): void {
    const { cells, actCells, emptyCells } = this;
    function transferProperties(GOAL_CELL: CellObject) {
      const { rowIndex, colIndex } = GOAL_CELL;
      const CELL = cells[rowIndex][colIndex];

      GOAL_CELL.feature = CELL.feature;
      GOAL_CELL.layerIndex = CELL.layerIndex;

      GOAL_CELL.sixFace = CELL.sixFace;
      GOAL_CELL.faceDirection = CELL.faceDirection;

      GOAL_CELL.twelveEdge = CELL.twelveEdge;
    }

    actCells.forEach((GOAL_CELL) => {
      transferProperties(GOAL_CELL);
    });

    emptyCells.forEach((GOAL_CELL) => {
      transferProperties(GOAL_CELL);
    });
  }

  updateTwelveEdges(): Cube {
    this.twelveEdges.forEach((twelveEdge) => {
      twelveEdge.canBeInserted = !!twelveEdge.pieces.length;
    });

    const twelveEdges = this.twelveEdges as OneOfTwelveEdges[];
    const { cells } = this;

    twelveEdges.forEach((oneEdge) => {
      oneEdge.pieces.forEach((cellRowColIndex) => {
        const [rowIndex, colIndex] = cellRowColIndex;
        const pieceCell = cells[rowIndex][colIndex];

        const {
          rowIndex: relatedRowIndex,
          colIndex: relatedColIndex,
          // relation,
        } = pieceCell.relatedInformationWhenAdding;

        if (relatedRowIndex === -1) {
          pieceCell.borderLines.forEach(
            (borderLine, borderLineIndex) => {
              if (borderLine === CellBorderLine.InnerLine) {
                switch (borderLineIndex as ConnectionRelation) {
                  case ConnectionRelation.Top:
                    pieceCell.layerIndex =
                      cells[rowIndex - 1][colIndex].layerIndex +
                      1;
                    break;
                  case ConnectionRelation.Bottom:
                    pieceCell.layerIndex =
                      cells[rowIndex + 1][colIndex].layerIndex +
                      1;
                    break;
                  case ConnectionRelation.Left:
                    pieceCell.layerIndex =
                      cells[rowIndex][colIndex - 1].layerIndex +
                      1;
                    break;
                  case ConnectionRelation.Right:
                    pieceCell.layerIndex =
                      cells[rowIndex][colIndex + 1].layerIndex +
                      1;
                    break;
                  default:
                    // unreachable
                    break;
                }
              }
            },
          );
        } else {
          pieceCell.layerIndex =
            cells[relatedRowIndex][relatedColIndex].layerIndex +
            1;
        }
      });
    });

    // const sixFaceOutestCellArray: CellObject[] = [];
    // const { sixFaces } = this;
    // sixFaces.forEach((sixFaceInfo) => {
    //   sixFaceInfo.forEach(([
    //     firstRowIndex,
    //     firstColIndex,
    //     secondRowIndex,
    //     secondColIndex,
    //   ]) => {
    //     sixFaceOutestCellArray.push(
    //       (typeof secondRowIndex === "undefined" ||
    //           typeof secondColIndex === "undefined")
    //         ? cells[firstRowIndex][firstColIndex]
    //         : cells[secondRowIndex][secondColIndex],
    //     );
    //   });
    // });

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

    // sixFaceOutestCellArray.forEach((cell, cellIndex) => {
    //   cell.borderLines.forEach((borderLine, borderLineIndex) => {
    //     if (borderLine !== CellBorderLine.InnerLine) {
    //       const twelveEdgeIndex: TwelveEdge =
    //         getSixFaceTwentyFourAngleRelationTwelveEdge(
    //           sixFaceTwentyFourAngleOfSixFaceOutestCellArray[cellIndex],
    //           borderLineIndex,
    //         );

    //       if (!twelveEdges[twelveEdgeIndex].canBeInserted) {
    //         twelveEdges[twelveEdgeIndex].canBeInserted = true;
    //       }
    //     }
    //   });
    // });

    // const { sixFaces } = this;
    const sixFaces = this.sixFaces as FaceMemberOfSixFace[];
    sixFaces.forEach(
      (sixFaceInfo: FaceMemberOfSixFace, sixFaceInfoIndex: number) => {
        if (typeof sixFaceInfo === "undefined") {
          log(
            `[error] ${this.no}.sixFaces, undefined is not iterable (cannot read property Symbol(Symbol.iterator)).`,
          );
          return;
        }
        const COUNT = sixFaceInfo.length;
        if (!COUNT) {
          log(
            `[error] ${this.no}.sixFaces[${sixFaceInfoIndex}].length is zero.`,
          );
          return;
        }

        const [row1, col1, row2, col2] = sixFaceInfo[COUNT - 1];
        const OUTEST_CELL: CellObject = (typeof row2 === "undefined" ||
            typeof col2 === "undefined")
          ? cells[row1][col1]
          : cells[row2][col2];
        OUTEST_CELL.borderLines.forEach((borderLine, borderLineIndex) => {
          if (borderLine !== CellBorderLine.InnerLine) {
            const twelveEdgeIndex: TwelveEdge =
              getSixFaceTwentyFourAngleRelationTwelveEdge(
                OUTEST_CELL.sixFaceTwentyFourAngle,
                borderLineIndex,
              );

            if (!twelveEdges[twelveEdgeIndex].canBeInserted) {
              twelveEdges[twelveEdgeIndex].canBeInserted = true;
            }
          }
        });
      },
    );

    return this;
  }

  getCellArray(): CellObject[] {
    const ARRAY: CellObject[] = [];
    this.cells.forEach((rows) => rows.forEach((cell) => ARRAY.push(cell)));
    return ARRAY;
  }

  checkFacesLayerIndex(): boolean {
    const CELL_ARRAY = this.getCellArray();
    function getCellByCellIndex(cellIndex: number): CellObject | undefined {
      const FILTERED = CELL_ARRAY.filter((cell) =>
        cell.cellIndex === cellIndex
      );
      return FILTERED.length ? FILTERED[0] : undefined;
    }

    const { cells, sixFaces } = this;
    const SIX_FACE_CELL_ARRAY_ARRAY = sixFaces.map(
      (faceInfo) => {
        const ARRAY: CellObject[] = [];
        faceInfo.forEach(
          ([firstRowIndex, firstColIndex, secondRowIndex, secondColIndex]) => {
            const firstCell = cells[firstRowIndex][firstColIndex];
            ARRAY.push(firstCell);

            if (
              typeof secondRowIndex !== "undefined" &&
              typeof secondColIndex !== "undefined"
            ) {
              const secondCell = cells[secondRowIndex][secondColIndex];
              ARRAY.push(secondCell);

              // (firstCell as unknown as { outerCell: CellObject }).outerCell =
              //   secondCell;
            }
          },
        );
        return ARRAY;
      },
    ) as unknown as CellObject[][];
    // const SIX_FACE_CELL_ARRAY_COUNT = SIX_FACE_CELL_ARRAY_ARRAY.length;
    for (
      let sixFaceIndex = 0;
      sixFaceIndex < SixFaceCount;
      // SIX_FACE_CELL_ARRAY_COUNT;
      ++sixFaceIndex
    ) {
      const SIX_FACE_CELL_ARRAY = SIX_FACE_CELL_ARRAY_ARRAY[sixFaceIndex];
      const SIX_FACE_CELL_COUNT = SIX_FACE_CELL_ARRAY.length;
      for (
        let faceCellIndex = 0;
        faceCellIndex < SIX_FACE_CELL_COUNT;
        ++faceCellIndex
      ) {
        const FACE_CELL = SIX_FACE_CELL_ARRAY[faceCellIndex];
        // const FACE_CELL_SIX_FACE = FACE_CELL.sixFace;
        const FACE_CELL_LAYER_INDEX = FACE_CELL.layerIndex;
        const FACE_CELL_INNER_CELL_ARRAY = SIX_FACE_CELL_ARRAY.filter(
          (cell) => cell.layerIndex < FACE_CELL_LAYER_INDEX,
        );
        const FACE_CELL_INNER_CELL_COUNT = FACE_CELL_INNER_CELL_ARRAY.length;
        for (
          let faceCellBorderLineIndex = 0;
          faceCellBorderLineIndex < FourDirectionCount;
          ++faceCellBorderLineIndex
        ) {
          if (
            FACE_CELL.borderLines[faceCellBorderLineIndex] !==
              CellBorderLine.InnerLine
          ) {
            continue;
          }

          const FACE_CELL_CONNECTED_CELL = getCellByCellIndex(
            FACE_CELL.getConnectedCellIndexByRelation(faceCellBorderLineIndex),
          );
          if (
            !FACE_CELL_CONNECTED_CELL ||
            FACE_CELL_CONNECTED_CELL.feature !== CellFeature.Face
          ) {
            continue;
          }

          const FACE_CELL_CONNECTED_CELL_SIX_FACE =
            FACE_CELL_CONNECTED_CELL.sixFace;
          const FACE_CELL_CONNECTED_CELL_LAYER_INDEX =
            FACE_CELL_CONNECTED_CELL.layerIndex;

          for (
            let faceCellInnerCellIndex = 0;
            faceCellInnerCellIndex < FACE_CELL_INNER_CELL_COUNT;
            ++faceCellInnerCellIndex
          ) {
            const FACE_CELL_INNER_CELL =
              FACE_CELL_INNER_CELL_ARRAY[faceCellInnerCellIndex];
            for (
              let faceCellBorderLineIndex = 0;
              faceCellBorderLineIndex < FourDirectionCount;
              ++faceCellBorderLineIndex
            ) {
              if (
                FACE_CELL_INNER_CELL.borderLines[faceCellBorderLineIndex] !==
                  CellBorderLine.InnerLine
              ) {
                continue;
              }

              const FACE_CELL_INNER_CELL_CONNECTED_CELL = getCellByCellIndex(
                FACE_CELL_INNER_CELL.getConnectedCellIndexByRelation(
                  faceCellBorderLineIndex,
                ),
              );
              if (
                !FACE_CELL_INNER_CELL_CONNECTED_CELL ||
                FACE_CELL_INNER_CELL_CONNECTED_CELL.feature !== CellFeature.Face
              ) {
                continue;
              }

              if (
                FACE_CELL_INNER_CELL_CONNECTED_CELL.sixFace !==
                  FACE_CELL_CONNECTED_CELL_SIX_FACE
              ) {
                continue;
              }
              if (
                FACE_CELL_INNER_CELL_CONNECTED_CELL.layerIndex >
                  FACE_CELL_CONNECTED_CELL_LAYER_INDEX
              ) {
                return false;
              }
            }
          }
        }
      }
    }

    return true;
  }

  getCoreCellReserveRelatedInformation(): {
    rowIndex: number;
    colIndex: number;
    relation: ConnectionRelation;
  } {
    const { cells } = this;
    const CORE_CELL = cells[this.coreRowIndex][this.coreColIndex];
    const FILTERED_BORDER_LINE_ARRAY = CORE_CELL.borderLines.filter((
      borderLine,
    ) => borderLine === CellBorderLine.InnerLine);
    // console.log(
    //   "getCoreCellReserveRelatedInformation()",
    //   FILTERED_BORDER_LINE_ARRAY.length,
    //   this.coreRowIndex,
    //   this.coreColIndex,
    // );
    if (FILTERED_BORDER_LINE_ARRAY.length === 1) {
      for (
        let borderLineIndex = 0;
        borderLineIndex < FourDirectionCount;
        ++borderLineIndex
      ) {
        if (
          CORE_CELL.borderLines[borderLineIndex] !== CellBorderLine.InnerLine
        ) {
          continue;
        }

        const REVERSED_RELATION = getReversedRelation(borderLineIndex);
        const RELATION_CELL_CELL_INDEX = CORE_CELL
          .getConnectedCellIndexByRelation(borderLineIndex);
        const RESULT = {
          rowIndex: Math.floor(RELATION_CELL_CELL_INDEX / COL_COUNT),
          colIndex: RELATION_CELL_CELL_INDEX % COL_COUNT,
          relation: REVERSED_RELATION,
        };
        // console.log(
        //   RELATION_CELL_CELL_INDEX,
        //   this.rowCount,
        //   this.colCount,
        //   RESULT,
        // );
        return RESULT;
      }
    }

    return {
      rowIndex: -1,
      colIndex: -1,
      relation: ConnectionRelation.Top,
    };
  }

  getManner(): string {
    return this.twelveEdges.map((twelveEdge) =>
      `${twelveEdge.canBeInserted ? "T" : "F"}${twelveEdge.pieces.length}`
    ).join("");
  }

  private updateIsValid() {
    const { actCells } = this;
    const { rowCount } = this;
    let isValid = true;
    for (let checkRowIndex = 0; checkRowIndex < rowCount; ++checkRowIndex) {
      if (!isValid) {
        return;
      }
      isValid = actCells.filter((cell: CellObject) =>
        cell.rowIndex === checkRowIndex
      ).length > 0;
    }
    if (!isValid) {
      this.isValid = false;
      return;
    }

    if (SETTINGS.mustContainEveryColumn) {
      const { colCount } = this;

      for (let checkColIndex = 0; checkColIndex < colCount; ++checkColIndex) {
        if (!isValid) {
          return;
        }
        isValid = actCells.filter((cell: CellObject) =>
          cell.colIndex === checkColIndex
        ).length > 0;
      }
      if (!isValid) {
        this.isValid = false;
        return;
      }
    }

    const OLD_IS_VALID = this.isValid;
    const { sixFaces, twelveEdges, cells } = this;

    // 	<en_us>en_us</en_us>
    // 	<zh_cn>解决多次修正正确性时，被附加多次的Bug</zh_cn>
    // 	<zh_tw>zh_tw</zh_tw>
    sixFaces.forEach((array) => array.length = 0);
    twelveEdges.forEach((twelveEdge) => twelveEdge.pieces.length = 0);

    // 	<en_us>en_us</en_us>
    // 	<zh_cn>检查六个面是否齐全（每个面至少有一个带“多内联线”的单元格，或至少两个带“单内联线”的单元格）</zh_cn>
    // 	<zh_tw>zh_tw</zh_tw>
    const SIX_FACE_POINT_ARRAY = [0, 0, 0, 0, 0, 0];
    const ONE_INNER_LINE_CELL_TWENTY_FOUR_ANGEL_COUNT_ARRAY =
      (0 as unknown as NumberRepeatFunction)
        .repeat(ANGLE_COUNT);
    actCells.forEach((cell: CellObject) => {
      const {
        rowIndex,
        colIndex,
        borderLines,

        sixFace,
        twelveEdge,
      } = cell;

      let sixFaceIndex = 0;

      switch (
        borderLines.filter((borderLine: CellBorderLine) =>
          borderLine === CellBorderLine.InnerLine
        )
          .length
      ) {
        case 2:
        case 3:
        case 4:
          sixFaceIndex = sixFace;
          SIX_FACE_POINT_ARRAY[sixFaceIndex] += 1;
          sixFaces[sixFaceIndex].push([rowIndex, colIndex]);
          break;
        case 1:
          ONE_INNER_LINE_CELL_TWENTY_FOUR_ANGEL_COUNT_ARRAY[
            4 * sixFace + (twelveEdge % 4)
          ] += 1;
          if (cell.relatedInformationWhenAdding.rowIndex === -1) {
            // 	<en_us>en_us</en_us>
            // 	<zh_cn>找到唯一的内联线，然后反算相应单元格行号列序，再确定本单元格作为面片时的序号</zh_cn>
            // 	<zh_tw>zh_tw</zh_tw>
            const RELATION_CELL = actCells.filter((cell) =>
              cell.relatedInformationWhenAdding.rowIndex === rowIndex &&
              cell.relatedInformationWhenAdding.colIndex === colIndex
            )[0];
            // let relation = RELATION_CELL.relatedInformationWhenAdding.relation;
            // if (relation % 2 === 0) {
            //   relation = 2 - relation;
            // } else {
            //   relation = 4 - relation;
            // }
            const relation = getReversedRelation(
              RELATION_CELL.relatedInformationWhenAdding.relation,
            );

            twelveEdges[
              getSixFaceTwentyFourAngleRelationTwelveEdge(
                convertSixFaceAndDirectionToSixFaceTwentyFourAngle(
                  RELATION_CELL.sixFace,
                  RELATION_CELL.faceDirection,
                ),
                relation,
              ) as number
            ].pieces.push([rowIndex, colIndex]);
          } else {
            const {
              rowIndex: relationRowIndex,
              colIndex: relationColIndex,
              relation,
            } = cell.relatedInformationWhenAdding;
            const RELATION_CELL = cells[relationRowIndex][relationColIndex];
            twelveEdges[
              getSixFaceTwentyFourAngleRelationTwelveEdge(
                convertSixFaceAndDirectionToSixFaceTwentyFourAngle(
                  RELATION_CELL.sixFace,
                  RELATION_CELL.faceDirection,
                ),
                relation,
              ) as number
            ].pieces.push([rowIndex, colIndex]);
          }
          break;
        default:
          // unreachable
          break;
      }
    });

    const { SHOW_FULL_CUBE_INFO } = DEBUG;
    const NEW_LOG = SHOW_FULL_CUBE_INFO
      ? `<=${JSON.stringify(SIX_FACE_POINT_ARRAY)} + ${
        JSON.stringify(ONE_INNER_LINE_CELL_TWENTY_FOUR_ANGEL_COUNT_ARRAY)
      }`
      : "";

    SIX_FACE_POINT_ARRAY.forEach((_point, index) => {
      const OFFSET = 4 * index;
      for (let i = 0; i < 4; ++i) {
        SIX_FACE_POINT_ARRAY[index] +=
          ONE_INNER_LINE_CELL_TWENTY_FOUR_ANGEL_COUNT_ARRAY[OFFSET + i] > 0
            ? 0.5
            : 0;
      }
    });

    function showFullCubeInfo(isOld: boolean) {
      if (!SHOW_FULL_CUBE_INFO) {
        return;
      }

      if (
        actCells.map((cell) => `${cell.rowIndex}${cell.colIndex}`).join(
          "_",
        ) === "00_01_02_03_04_10_11_12_13_14"
      ) {
        log(
          `${isOld ? "\n\nOLD" : "NEW"}:${
            JSON.stringify(SIX_FACE_POINT_ARRAY)
          }\n${NEW_LOG}\n${
            actCells.map((cell) =>
              `${cell.rowIndex}${cell.colIndex}_${cell.addOrder}_${
                cell.borderLines.join("")
              }_${cell.feature === CellFeature.Face ? "Face" : "Piece"}${
                cell.sixFaceTwentyFourAngleStr.replace(" + ", "")
              }_${cell.twelveEdge.toString().padStart(2)}`
            ).join(",\n")
          }`,
        );
      }
    }

    if (SIX_FACE_POINT_ARRAY.filter((point: number) => point < 1).length) {
      if (OLD_IS_VALID) {
        showFullCubeInfo(false);
      }
      this.isValid = false;
      this.sixFaces.forEach((array) => array.length = 0);
      this.twelveEdges.forEach((item) => item.pieces.length = 0);
      return;
    }

    if (!OLD_IS_VALID) {
      showFullCubeInfo(true);
    }
    this.isValid = true;
  }

  private updateGridLines() {
    const { actCells } = this;

    const { SHOW_BORDER_LINE_CHANGE_INFO } = DEBUG;

    let borderLineChangeInfo = "";
    const { emptyCells } = this;

    actCells.forEach(({
      rowIndex,
      colIndex,
      borderLines,
    }) => {
      const OLD = SHOW_BORDER_LINE_CHANGE_INFO
        ? JSON.stringify(borderLines)
        : "";
      borderLines.forEach((borderLine, borderPosition: CellBorderPosition) => {
        let siblingRowIndex = 0;
        let siblingColIndex = 0;
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

        const SIBLING_CELL_ARRAY = actCells.filter((cell) =>
          cell.rowIndex === siblingRowIndex &&
          cell.colIndex === siblingColIndex
        );
        const HAS_SIBLING_CELL = !!SIBLING_CELL_ARRAY.length;
        const HAS_NOT_SIBLING_CELL = !HAS_SIBLING_CELL;

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

            // 	<en_us>en_us</en_us>
            // 	<zh_cn>注意：仅可修改为“外框线”。如果更改为“裁剪线”，所有格都将只连接一格。所以，移除原来的else分支！</zh_cn>
            // 	<zh_tw>zh_tw</zh_tw>

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
      const NEW = SHOW_BORDER_LINE_CHANGE_INFO
        ? JSON.stringify(borderLines)
        : "";
      if (SHOW_BORDER_LINE_CHANGE_INFO && OLD !== NEW) {
        borderLineChangeInfo +=
          `[${rowIndex}][${colIndex}], ${OLD} => ${NEW}\n`;
      }
    });
    if (SHOW_BORDER_LINE_CHANGE_INFO && borderLineChangeInfo.length) {
      log(
        `updateGridLines(), border lines are changed. \n${borderLineChangeInfo}`,
        "\n actCells:",
        JSON.stringify(actCells),
        "\n emptyCells:",
        JSON.stringify(emptyCells),
      );
    }

    const { gridLines } = this;
    gridLines.length = 0;
    const EXISTS_GRID_LINES: string[] = [];

    this.actCells.forEach((cell: CellObject) => {
      const {
        rowIndex,
        colIndex,
        borderLines,
      } = cell;

      borderLines.forEach((borderLine: CellBorderLine, index: number) => {
        const IS_HORIZONTAL = index % 2 === 0;
        const xStart: number = colIndex + (index === 1 ? 1 : 0);
        const xEnd: number = xStart + (IS_HORIZONTAL ? 1 : 0);
        const yStart: number = rowIndex + (index === 2 ? 1 : 0);
        const yEnd: number = yStart + (IS_HORIZONTAL ? 0 : 1);
        const lineStyle: GridLineStyle = borderLine as unknown as GridLineStyle;

        const NEW_POSITION = `${xStart}_${xEnd}_${yStart}_${yEnd}`;
        if (EXISTS_GRID_LINES.indexOf(NEW_POSITION) === -1) {
          gridLines.push({ xStart, xEnd, yStart, yEnd, lineStyle } as GridLine);

          EXISTS_GRID_LINES.push(NEW_POSITION);
        }
      });
    });
  }
}

export const COL_INDEX_ARRAY_LESS_THAN_OR_EQUALS_THREE_ROW: number[][] = [[
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

// 	<en_us>en_us</en_us>
// 	<zh_cn>直接在调试窗口获得计算结果，不再计算</zh_cn>
// 	<zh_tw>zh_tw</zh_tw>
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

// 	<en_us>en_us</en_us>
// 	<zh_cn>排序</zh_cn>
// 	<zh_tw>zh_tw</zh_tw>
export const COL_INDEX_ARRAY_MORE_THAN_THREE_ROW: number[][] = [
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

export interface SiblingsAppendInfo {
  relationRowIndex: number;
  relationColIndex: number;

  rowIndex: number;
  colIndex: number;

  relation: ConnectionRelation;
}

export type SiblingsAppendInfoArray = SiblingsAppendInfo[];

export interface AppendSiblingsOptions {
  cube: Cube;
  addOrder: number;
  siblings: SiblingsAppendInfoArray;
}

export interface NewAppendSiblingsOptions {
  cube: SimpleCube;
  addOrder: number;
  siblings: SiblingsAppendInfoArray;
}

export interface CellAppendInfoManner {
  rowIndex: number;
  colIndex: number;
  feature: CellFeature;
  borderLines: CellBorderLine[];
  addOrder: number;
  // twelveEdge: TwelveEdge;
  sixFace: SixFace;
  faceDirection: FourDirection;
  siblingsAppendInfoArray: SiblingsAppendInfo[];
}

export function showCubeCoreInfo(cube: Cube) {
  return cube.cells.map((cellsRow) =>
    cellsRow.filter((cell) => cell.feature === CellFeature.Face).map(
      (cell) => `${cell.rowIndex}${cell.colIndex}_${cell.borderLines.join("")}`,
    ).join(",")
  ).join(" | ");
}

export function showSimpleCubeCoreInfo(cube: SimpleCube) {
  return cube.cells.map((cellsRow) =>
    cellsRow.filter((cell) => cell.feature === CellFeature.Face).map(
      (cell) => `${cell.rowIndex}${cell.colIndex}_${cell.borderLines.join("")}`,
    ).join(",")
  ).join(" | ");
}

export class SimpleCell {
  addOrder = 0;
  relatedInformationWhenAdding = {
    rowIndex: -1,
    colIndex: -1,
    relation: ConnectionRelation.Top,
  };

  feature = CellFeature.Unknown;
  sixFace = SixFace.Up;
  faceDirection = FourDirection.Original;
  twelveEdge: TwelveEdge = TwelveEdge.NotSure;

  get isEmpty(): boolean {
    return this.feature === CellFeature.None;
  }
  get isUnknown(): boolean {
    return this.feature === CellFeature.Unknown;
  }
  get sixFaceTwentyFourAngle(): SixFaceTwentyFourAngle {
    return convertSixFaceAndDirectionToSixFaceTwentyFourAngle(
      this.sixFace,
      this.faceDirection,
    );
  }

  borderLines: CellBorderLine[] = [
    CellBorderLine.Unknown,
    CellBorderLine.Unknown,
    CellBorderLine.Unknown,
    CellBorderLine.Unknown,
  ];
  toString: () => string = () => {
    return JSON.stringify(this);
  };
  clone(): SimpleCell {
    const RESULT = new SimpleCell(this.rowIndex, this.colIndex, this.cellIndex);

    RESULT.addOrder = this.addOrder;
    RESULT.relatedInformationWhenAdding = this.relatedInformationWhenAdding;

    RESULT.feature = this.feature;
    RESULT.sixFace = this.sixFace;
    RESULT.faceDirection = this.faceDirection;
    RESULT.twelveEdge = this.twelveEdge;
    this.borderLines.forEach((value, index) => {
      RESULT.borderLines[index] = value;
    });

    return RESULT;
  }

  constructor(
    public rowIndex: number,
    public colIndex: number,
    public cellIndex: number,
  ) {
  }

  transferTo(cell: SimpleCell) {
    cell.addOrder = this.addOrder;

    const goalRelatedInfo = cell.relatedInformationWhenAdding;
    const sourceRelatedInfo = this.relatedInformationWhenAdding;
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
  }

  reset(): void {
    this.addOrder = 0;

    const { relatedInformationWhenAdding, borderLines } = this;

    relatedInformationWhenAdding.rowIndex = -1;
    relatedInformationWhenAdding.colIndex = -1;
    relatedInformationWhenAdding.relation = ConnectionRelation.Top;

    borderLines.forEach((_old, index) => {
      borderLines[index] = CellBorderLine.Unknown;
    });

    this.feature = CellFeature.Unknown;
    this.sixFace = SixFace.Up;
    this.faceDirection = FourDirection.Original;
  }
}

export class SimpleCube {
  cells: SimpleCell[][] = [];
  isValid: boolean = false;

  constructor(
    public rowCount: number,
    public colCount: number,
    isCloning: boolean = false,
  ) {
    if (!isCloning) {
      for (let rowIndex = 0; rowIndex < rowCount; ++rowIndex) {
        const cellRows: SimpleCell[] = [];
        const CELL_INDEX_OFFSET = colCount * rowIndex;
        for (let colIndex = 0; colIndex < colCount; ++colIndex) {
          cellRows.push(
            new SimpleCell(rowIndex, colIndex, CELL_INDEX_OFFSET + colIndex),
          );
        }
        this.cells.push(cellRows);
      }
    }
  }

  clone(): SimpleCube {
    const {
      rowCount,
      colCount,

      cells,
    } = this;
    const cloned = new SimpleCube(
      rowCount,
      colCount,
      true,
    );

    cells.forEach((rows) => {
      cloned.cells.push(rows.map((cell) => cell.clone()));
    });
    cloned.isValid = this.isValid;

    return cloned;
  }

  transferTo(other: SimpleCube): void {
    const { cells, isValid } = this;
    other.isValid = isValid;

    other.cells.forEach((rows, rowIndex) => {
      const SOURCE_ROWS = cells[rowIndex];
      rows.forEach((cell, colIndex) => SOURCE_ROWS[colIndex].transferTo(cell));
    });
  }

  count(): void {
    const { cells, rowCount, colCount } = this;

    const actCells: SimpleCell[] = [];
    const emptyCells: SimpleCell[] = [];
    const sixFaces: SixFaces = getEmptySixFaces();

    cells.forEach((cellRows: SimpleCell[]) => {
      cellRows.forEach((cell: SimpleCell) => {
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

    if (!this.isValid) {
      return;
    }

    updateGridLines();
    this.isValid = getIsValid();

    if (!this.isValid) {
      ++global_removed_middle_cube_count;
    }

    function getIsValid(): boolean {
      for (let checkRowIndex = 0; checkRowIndex < rowCount; ++checkRowIndex) {
        if (
          !actCells.filter((cell: SimpleCell) =>
            cell.rowIndex === checkRowIndex
          ).length
        ) {
          return false;
        }
      }

      if (SETTINGS.mustContainEveryColumn) {
        for (let checkColIndex = 0; checkColIndex < colCount; ++checkColIndex) {
          if (
            !actCells.filter((cell: SimpleCell) =>
              cell.colIndex === checkColIndex
            ).length
          ) {
            return false;
          }
        }
      }

      // 	<en_us>en_us</en_us>
      // 	<zh_cn>解决多次修正正确性时，被附加多次的Bug</zh_cn>
      // 	<zh_tw>zh_tw</zh_tw>
      sixFaces.forEach((array) => array.length = 0);

      // 	<en_us>en_us</en_us>
      // 	<zh_cn>检查六个面是否齐全（每个面至少有一个带“多内联线”的单元格，或至少两个带“单内联线”的单元格）</zh_cn>
      // 	<zh_tw>zh_tw</zh_tw>
      const SIX_FACE_POINT_ARRAY = [0, 0, 0, 0, 0, 0];

      const ONE_INNER_LINE_CELL_TWENTY_FOUR_ANGEL_COUNT_ARRAY =
        (0 as unknown as NumberRepeatFunction)
          .repeat(ANGLE_COUNT);
      actCells.forEach((cell: SimpleCell) => {
        const {
          rowIndex,
          colIndex,
          borderLines,
        } = cell;

        let sixFaceIndex = 0;

        switch (
          borderLines.filter((borderLine: CellBorderLine) =>
            borderLine === CellBorderLine.InnerLine
          )
            .length
        ) {
          case 2:
          case 3:
          case 4:
            sixFaceIndex = cell.sixFace;
            SIX_FACE_POINT_ARRAY[sixFaceIndex] += 1;
            sixFaces[sixFaceIndex].push([rowIndex, colIndex]);
            break;
          case 1:
            ONE_INNER_LINE_CELL_TWENTY_FOUR_ANGEL_COUNT_ARRAY[
              4 * cell.sixFace + (cell.twelveEdge % 4)
            ] += 1;
            break;
          default:
            // unreachable
            break;
        }
      });

      SIX_FACE_POINT_ARRAY.forEach((_point, index) => {
        const OFFSET = 4 * index;
        for (let i = 0; i < 4; ++i) {
          SIX_FACE_POINT_ARRAY[index] +=
            ONE_INNER_LINE_CELL_TWENTY_FOUR_ANGEL_COUNT_ARRAY[OFFSET + i] > 0
              ? 0.5
              : 0;
        }
      });

      if (SIX_FACE_POINT_ARRAY.filter((point: number) => point < 1).length) {
        sixFaces.forEach((array) => array.length = 0);
        return false;
      }

      return true;
    }

    function updateGridLines() {
      const { SHOW_BORDER_LINE_CHANGE_INFO } = DEBUG;
      let borderLineChangeInfo = "";

      actCells.forEach(({
        rowIndex,
        colIndex,
        borderLines,
      }) => {
        const OLD = SHOW_BORDER_LINE_CHANGE_INFO
          ? JSON.stringify(borderLines)
          : "";
        borderLines.forEach(
          (borderLine, borderPosition: CellBorderPosition) => {
            let siblingRowIndex = 0;
            let siblingColIndex = 0;
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

            const SIBLING_CELL_ARRAY = actCells.filter((cell) =>
              cell.rowIndex === siblingRowIndex &&
              cell.colIndex === siblingColIndex
            );
            const HAS_SIBLING_CELL = !!SIBLING_CELL_ARRAY.length;
            const HAS_NOT_SIBLING_CELL = !HAS_SIBLING_CELL;

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

                // 	<en_us>en_us</en_us>
                // 	<zh_cn>注意：仅可修改为“外框线”。如果更改为“裁剪线”，所有格都将只连接一格。所以，移除原来的else分支！</zh_cn>
                // 	<zh_tw>zh_tw</zh_tw>

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
          },
        );
        const NEW = SHOW_BORDER_LINE_CHANGE_INFO
          ? JSON.stringify(borderLines)
          : "";
        if (SHOW_BORDER_LINE_CHANGE_INFO && OLD !== NEW) {
          borderLineChangeInfo +=
            `[${rowIndex}][${colIndex}], ${OLD} => ${NEW}\n`;
        }
      });
      if (SHOW_BORDER_LINE_CHANGE_INFO && borderLineChangeInfo.length) {
        log(
          `updateGridLines(), border lines are changed. \n${borderLineChangeInfo}`,
          "\n actCells:",
          JSON.stringify(actCells),
          "\n emptyCells:",
          JSON.stringify(emptyCells),
        );
      }
    }
  }

  reset(): void {
    this.isValid = false;
    this.cells.forEach((rows) => rows.forEach((cell) => cell.reset()));
  }
}

export function getCubeFromJson(json: string): Cube {
  const CUBE = JSON.parse(json) as Cube;

  const cloned = new Cube(
    CUBE.no,
    CUBE.rowCount,
    CUBE.colCount,
    CUBE.coreRowIndex,
    CUBE.coreColIndex,
    true,
  );
  const {
    // no,
    // rowCount,
    // colCount,
    // coreRowIndex,
    // coreColIndex,
    // cells,

    sixFaces,
    twelveEdges,
    isValid,
  } = CUBE;
  CUBE.cells.forEach((rows) => {
    cloned.cells.push(rows.map((from) => {
      const cell = new CellObject(from.rowIndex, from.colIndex, from.cellIndex);

      cell.layerIndex = from.layerIndex;

      cell.addOrder = from.addOrder;
      cell.relatedInformationWhenAdding = from.relatedInformationWhenAdding;

      cell.feature = from.feature;
      cell.sixFace = from.sixFace;
      cell.faceDirection = from.faceDirection;
      cell.twelveEdge = from.twelveEdge;
      from.borderLines.forEach((value, index) => {
        cell.borderLines[index] = value;
      });

      return cell;
    }));
  });

  // 	<en_us>en_us</en_us>
  // 	<zh_cn>经测试，需先count，再赋值sixFaces、twelveEdges，否则count后sixFaces可能丢失部分值</zh_cn>
  // 	<zh_tw>zh_tw</zh_tw>
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
  // cloned.count();
  // cloned.actCells = JSON.parse(JSON.stringify(CUBE.actCells));
  // cloned.emptyCells = JSON.parse(JSON.stringify(CUBE.emptyCells));

  cloned.actCells.length = 0;
  CUBE.actCells.forEach((cell) => {
    cloned.actCells.push(cloned.cells[cell.rowIndex][cell.colIndex]);
  });

  cloned.emptyCells.length = 0;
  CUBE.emptyCells.forEach((cell) => {
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

export interface CubeForDrawingActCell {
  layerIndex: number;
  relation: ConnectionRelation;
  feature: CellFeature;
  sixFace: SixFace;
  faceDirection: FourDirection;
  twelveEdge: TwelveEdge;
  rowIndex: number;
  colIndex: number;
}
export interface CubeForDrawing {
  no: number;
  actCells: CubeForDrawingActCell[];

  // // { xStart: number, xEnd: number, yStart: number, yEnd: number, lineStyle: GridLineStyle }[],
  // gridLines: GridLine[];

  lines: string;

  firstRowActCellColIndexBill: string;
  lastRowEmptyCellColIndexBill: string;

  rowCount: number;
  colCount: number;
}

export function getReversedRelation(
  relation: ConnectionRelation,
): ConnectionRelation {
  return relation % 2 + 2 * (1 - Math.floor(relation / 2));
}
/*
  function getReversedRelation(relation) {return relation % 2 + 2 * (1 - Math.floor(relation / 2));
  for(let i = 0; i < 4; ++i) {  console.log(getReversedRelation(i)); }

2
3
0
1
*/

/*
set pwd=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\
cls && deno lint %pwd%\cubeCore.ts && deno fmt %pwd%\cubeCore.ts
*/
