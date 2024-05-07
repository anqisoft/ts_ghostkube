// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const FACE_NAME_ARRAY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const TEXT_RIGHT_ALIGNMENT = ' text-anchor="start"';
const TEXT_LEFT_ALIGNMENT = ' text-anchor="end"';
class GhostkubeGlobal {
    static sideLength = 10;
    static setSideLength(sideLength) {
        GhostkubeGlobal.sideLength = sideLength;
    }
    static getSideLength() {
        return GhostkubeGlobal.sideLength;
    }
    static circleRadius = 1.5;
    static setCircleRadius(circleRadius) {
        GhostkubeGlobal.circleRadius = circleRadius;
    }
    static getCircleRadius() {
        return GhostkubeGlobal.circleRadius;
    }
}
const Models = [
    // 两行五列
    {
        no: 1,
        rows: 2,
        cols: 5,
        empties: [],
        previous: [],
        nexts: [],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: []
    },
    {
        no: 2,
        rows: 2,
        cols: 5,
        empties: [],
        previous: [],
        nexts: [],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: []
    },
    {
        no: 3,
        rows: 2,
        cols: 5,
        empties: [],
        previous: [],
        nexts: [],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [], // [0, 5],
        trimRightCells: [], // [4, 9],
        trimTopCells: [],
        trimBottomCells: []
    },
    {
        no: 4,
        rows: 2,
        cols: 5,
        empties: [],
        previous: [],
        nexts: [],
        lines: [
            [0, 3, 1, 1],
            [4, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: []
    },
    {
        no: 5,
        rows: 2,
        cols: 5,
        empties: [],
        previous: [],
        nexts: [],
        lines: [
            [0, 4, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [],
        trimTopCells: [],
        trimBottomCells: []
    },
    // 三行五列（单个出现）
    {
        no: 6,
        rows: 3,
        cols: 5,
        empties: [],
        previous: [],
        nexts: [],
        lines: [
            [1, 5, 2, 2],
            [1, 1, 0, 1],
            [2, 2, 0, 1],
            [3, 3, 0, 1],
            [4, 4, 0, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [14],
        trimTopCells: [0, 1, 2, 3, 4],
        trimBottomCells: []
    },
    {
        no: 7,
        rows: 3,
        cols: 5,
        empties: [],
        previous: [],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2],
            [1, 1, 0, 1],
            [2, 2, 0, 1],
            [3, 3, 0, 1],
            [4, 4, 0, 1]
        ],
        trimLeftCells: [10],
        trimRightCells: [14],
        trimTopCells: [0, 1, 2, 3, 4],
        trimBottomCells: []
    },
    {
        no: 8,
        rows: 3,
        cols: 5,
        empties: [],
        previous: [],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2],
            [1, 1, 0, 1],
            [2, 2, 0, 1],
            [3, 3, 0, 1],
            [4, 4, 0, 1]
        ],
        trimLeftCells: [10],
        trimRightCells: [14],
        trimTopCells: [0, 1, 2, 3, 4],
        trimBottomCells: []
    },
    {
        no: 9,
        rows: 3,
        cols: 5,
        empties: [],
        previous: [],
        nexts: [],
        lines: [
            [0, 3, 2, 2],
            [4, 5, 2, 2],
            [1, 1, 0, 1],
            [2, 2, 0, 1],
            [3, 3, 0, 1],
            [4, 4, 0, 1]
        ],
        trimLeftCells: [10],
        trimRightCells: [14],
        trimTopCells: [0, 1, 2, 3, 4],
        trimBottomCells: []
    },
    {
        no: 10,
        rows: 3,
        cols: 5,
        empties: [],
        previous: [],
        nexts: [],
        lines: [
            [0, 4, 2, 2],
            [1, 1, 0, 1],
            [2, 2, 0, 1],
            [3, 3, 0, 1],
            [4, 4, 0, 1]
        ],
        trimLeftCells: [10],
        trimRightCells: [],
        trimTopCells: [0, 1, 2, 3, 4],
        trimBottomCells: []
    },
    // 三行五列（成对出现）
    // 一个：0
    {
        no: 11,
        rows: 3,
        cols: 5,
        empties: [11, 12, 13, 14],
        previous: [],
        nexts: [14, 15, 16],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10]
    },
    {
        no: 12,
        rows: 3,
        cols: 5,
        empties: [11, 12, 13, 14],
        previous: [],
        nexts: [14, 15, 16],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10]
    },
    {
        no: 13,
        rows: 3,
        cols: 5,
        empties: [11, 12, 13, 14],
        previous: [],
        nexts: [14, 15, 16],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10]
    },
    {
        no: 14,
        rows: 3,
        cols: 5,
        empties: [0],
        previous: [11, 12, 13],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [14],
        trimTopCells: [1, 2, 3, 4],
        trimBottomCells: []
    },
    {
        no: 15,
        rows: 3,
        cols: 5,
        empties: [0],
        previous: [11, 12, 13],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [14],
        trimTopCells: [1, 2, 3, 4],
        trimBottomCells: []
    },
    {
        no: 16,
        rows: 3,
        cols: 5,
        empties: [0],
        previous: [11, 12, 13],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [14],
        trimTopCells: [1, 2, 3, 4],
        trimBottomCells: []
    },
    // 一个：1
    {
        no: 17,
        rows: 3,
        cols: 5,
        empties: [10, 12, 13, 14],
        previous: [],
        nexts: [20, 21, 22],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [11]
    },
    {
        no: 18,
        rows: 3,
        cols: 5,
        empties: [10, 12, 13, 14],
        previous: [],
        nexts: [20, 21, 22],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [11]
    },
    {
        no: 19,
        rows: 3,
        cols: 5,
        empties: [10, 12, 13, 14],
        previous: [],
        nexts: [20, 21, 22],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [11]
    },
    {
        no: 20,
        rows: 3,
        cols: 5,
        empties: [1],
        previous: [17, 18, 19],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [14],
        trimTopCells: [0, 2, 3, 4],
        trimBottomCells: []
    },
    {
        no: 21,
        rows: 3,
        cols: 5,
        empties: [1],
        previous: [17, 18, 19],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [14],
        trimTopCells: [0, 2, 3, 4],
        trimBottomCells: []
    },
    {
        no: 22,
        rows: 3,
        cols: 5,
        empties: [1],
        previous: [17, 18, 19],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [14],
        trimTopCells: [0, 2, 3, 4],
        trimBottomCells: []
    },
    // 一个：2
    {
        no: 23,
        rows: 3,
        cols: 5,
        empties: [10, 11, 13, 14],
        previous: [],
        nexts: [26, 27, 28],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [12]
    },
    {
        no: 24,
        rows: 3,
        cols: 5,
        empties: [10, 11, 13, 14],
        previous: [],
        nexts: [26, 27, 28],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [12]
    },
    {
        no: 25,
        rows: 3,
        cols: 5,
        empties: [10, 11, 13, 14],
        previous: [],
        nexts: [26, 27, 28],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [12]
    },
    {
        no: 26,
        rows: 3,
        cols: 5,
        empties: [2],
        previous: [23, 24, 25],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [14],
        trimTopCells: [0, 1, 3, 4],
        trimBottomCells: []
    },
    {
        no: 27,
        rows: 3,
        cols: 5,
        empties: [2],
        previous: [23, 24, 25],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [14],
        trimTopCells: [0, 1, 3, 4],
        trimBottomCells: []
    },
    {
        no: 28,
        rows: 3,
        cols: 5,
        empties: [2],
        previous: [23, 24, 25],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [14],
        trimTopCells: [0, 1, 3, 4],
        trimBottomCells: []
    },
    // 一个：3
    {
        no: 29,
        rows: 3,
        cols: 5,
        empties: [10, 11, 12, 14],
        previous: [],
        nexts: [32, 33, 34],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [13]
    },
    {
        no: 30,
        rows: 3,
        cols: 5,
        empties: [10, 11, 12, 14],
        previous: [],
        nexts: [32, 33, 34],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [13]
    },
    {
        no: 31,
        rows: 3,
        cols: 5,
        empties: [10, 11, 12, 14],
        previous: [],
        nexts: [32, 33, 34],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [13]
    },
    {
        no: 32,
        rows: 3,
        cols: 5,
        empties: [3],
        previous: [29, 30, 31],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [14],
        trimTopCells: [0, 1, 2, 4],
        trimBottomCells: []
    },
    {
        no: 33,
        rows: 3,
        cols: 5,
        empties: [3],
        previous: [29, 30, 31],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [14],
        trimTopCells: [0, 1, 2, 4],
        trimBottomCells: []
    },
    {
        no: 34,
        rows: 3,
        cols: 5,
        empties: [3],
        previous: [29, 30, 31],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [14],
        trimTopCells: [0, 1, 2, 4],
        trimBottomCells: []
    },
    // 一个：4
    {
        no: 35,
        rows: 3,
        cols: 5,
        empties: [10, 11, 12, 13],
        previous: [],
        nexts: [38, 39, 40],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [14]
    },
    {
        no: 36,
        rows: 3,
        cols: 5,
        empties: [10, 11, 12, 13],
        previous: [],
        nexts: [38, 39, 40],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [14]
    },
    {
        no: 37,
        rows: 3,
        cols: 5,
        empties: [10, 11, 12, 13],
        previous: [],
        nexts: [38, 39, 40],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [14]
    },
    {
        no: 38,
        rows: 3,
        cols: 5,
        empties: [4],
        previous: [35, 36, 37],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [9, 14],
        trimTopCells: [0, 1, 2, 3],
        trimBottomCells: []
    },
    {
        no: 39,
        rows: 3,
        cols: 5,
        empties: [4],
        previous: [35, 36, 37],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [9, 14],
        trimTopCells: [0, 1, 2, 3],
        trimBottomCells: []
    },
    {
        no: 40,
        rows: 3,
        cols: 5,
        empties: [4],
        previous: [35, 36, 37],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [9, 14],
        trimTopCells: [0, 1, 2, 3],
        trimBottomCells: []
    },
    // 两个：01
    {
        no: 41,
        rows: 3,
        cols: 5,
        empties: [12, 13, 14],
        previous: [],
        nexts: [44, 45, 46],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10, 11]
    },
    {
        no: 42,
        rows: 3,
        cols: 5,
        empties: [12, 13, 14],
        previous: [],
        nexts: [44, 45, 46],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10, 11]
    },
    {
        no: 43,
        rows: 3,
        cols: 5,
        empties: [12, 13, 14],
        previous: [],
        nexts: [44, 45, 46],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10, 11]
    },
    {
        no: 44,
        rows: 3,
        cols: 5,
        empties: [0, 1],
        previous: [41, 42, 43],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [14],
        trimTopCells: [2, 3, 4],
        trimBottomCells: []
    },
    {
        no: 45,
        rows: 3,
        cols: 5,
        empties: [0, 1],
        previous: [41, 42, 43],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [14],
        trimTopCells: [2, 3, 4],
        trimBottomCells: []
    },
    {
        no: 46,
        rows: 3,
        cols: 5,
        empties: [0, 1],
        previous: [41, 42, 43],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [14],
        trimTopCells: [2, 3, 4],
        trimBottomCells: []
    },
    // 两个：02
    {
        no: 47,
        rows: 3,
        cols: 5,
        empties: [11, 13, 14],
        previous: [],
        nexts: [50, 51, 52],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10, 12]
    },
    {
        no: 48,
        rows: 3,
        cols: 5,
        empties: [11, 13, 14],
        previous: [],
        nexts: [50, 51, 52],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10, 12]
    },
    {
        no: 49,
        rows: 3,
        cols: 5,
        empties: [11, 13, 14],
        previous: [],
        nexts: [50, 51, 52],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10, 12]
    },
    {
        no: 50,
        rows: 3,
        cols: 5,
        empties: [0, 2],
        previous: [47, 48, 49],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [14],
        trimTopCells: [1, 3, 4],
        trimBottomCells: []
    },
    {
        no: 51,
        rows: 3,
        cols: 5,
        empties: [0, 2],
        previous: [47, 48, 49],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [14],
        trimTopCells: [1, 3, 4],
        trimBottomCells: []
    },
    {
        no: 52,
        rows: 3,
        cols: 5,
        empties: [0, 2],
        previous: [47, 48, 49],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [14],
        trimTopCells: [1, 3, 4],
        trimBottomCells: []
    },
    // 两个：03
    {
        no: 53,
        rows: 3,
        cols: 5,
        empties: [11, 12, 14],
        previous: [],
        nexts: [56, 57, 58],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10, 13]
    },
    {
        no: 54,
        rows: 3,
        cols: 5,
        empties: [11, 12, 14],
        previous: [],
        nexts: [56, 57, 58],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10, 13]
    },
    {
        no: 55,
        rows: 3,
        cols: 5,
        empties: [11, 12, 14],
        previous: [],
        nexts: [56, 57, 58],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10, 13]
    },
    {
        no: 56,
        rows: 3,
        cols: 5,
        empties: [0, 3],
        previous: [53, 54, 55],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [14],
        trimTopCells: [1, 2, 4],
        trimBottomCells: []
    },
    {
        no: 57,
        rows: 3,
        cols: 5,
        empties: [0, 3],
        previous: [53, 54, 55],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [14],
        trimTopCells: [1, 2, 4],
        trimBottomCells: []
    },
    {
        no: 58,
        rows: 3,
        cols: 5,
        empties: [0, 3],
        previous: [53, 54, 55],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [14],
        trimTopCells: [1, 2, 4],
        trimBottomCells: []
    },
    // 两个：04
    {
        no: 59,
        rows: 3,
        cols: 5,
        empties: [11, 12, 13],
        previous: [],
        nexts: [62, 63, 64],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [10, 14]
    },
    {
        no: 60,
        rows: 3,
        cols: 5,
        empties: [11, 12, 13],
        previous: [],
        nexts: [62, 63, 64],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [10, 14]
    },
    {
        no: 61,
        rows: 3,
        cols: 5,
        empties: [11, 12, 13],
        previous: [],
        nexts: [62, 63, 64],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [10, 14]
    },
    {
        no: 62,
        rows: 3,
        cols: 5,
        empties: [0, 4],
        previous: [59, 60, 61],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [9, 14],
        trimTopCells: [1, 2, 3],
        trimBottomCells: []
    },
    {
        no: 63,
        rows: 3,
        cols: 5,
        empties: [0, 4],
        previous: [59, 60, 61],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [9, 14],
        trimTopCells: [1, 2, 3],
        trimBottomCells: []
    },
    {
        no: 64,
        rows: 3,
        cols: 5,
        empties: [0, 4],
        previous: [59, 60, 61],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [9, 14],
        trimTopCells: [1, 2, 3],
        trimBottomCells: []
    },
    // 两个：12
    {
        no: 65,
        rows: 3,
        cols: 5,
        empties: [10, 13, 14],
        previous: [],
        nexts: [68, 69, 70],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [11, 12]
    },
    {
        no: 66,
        rows: 3,
        cols: 5,
        empties: [10, 13, 14],
        previous: [],
        nexts: [68, 69, 70],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [11, 12]
    },
    {
        no: 67,
        rows: 3,
        cols: 5,
        empties: [10, 13, 14],
        previous: [],
        nexts: [68, 69, 70],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [11, 12]
    },
    {
        no: 68,
        rows: 3,
        cols: 5,
        empties: [1, 2],
        previous: [65, 66, 67],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [14],
        trimTopCells: [0, 3, 4],
        trimBottomCells: []
    },
    {
        no: 69,
        rows: 3,
        cols: 5,
        empties: [1, 2],
        previous: [65, 66, 67],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [14],
        trimTopCells: [0, 3, 4],
        trimBottomCells: []
    },
    {
        no: 70,
        rows: 3,
        cols: 5,
        empties: [1, 2],
        previous: [65, 66, 67],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [14],
        trimTopCells: [0, 3, 4],
        trimBottomCells: []
    },
    // 两个：13
    {
        no: 71,
        rows: 3,
        cols: 5,
        empties: [10, 12, 14],
        previous: [],
        nexts: [74, 75, 76],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [11, 13]
    },
    {
        no: 72,
        rows: 3,
        cols: 5,
        empties: [10, 12, 14],
        previous: [],
        nexts: [74, 75, 76],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [11, 13]
    },
    {
        no: 73,
        rows: 3,
        cols: 5,
        empties: [10, 12, 14],
        previous: [],
        nexts: [74, 75, 76],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [11, 13]
    },
    {
        no: 74,
        rows: 3,
        cols: 5,
        empties: [1, 3],
        previous: [71, 72, 73],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [14],
        trimTopCells: [0, 2, 4],
        trimBottomCells: []
    },
    {
        no: 75,
        rows: 3,
        cols: 5,
        empties: [1, 3],
        previous: [71, 72, 73],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [14],
        trimTopCells: [0, 2, 4],
        trimBottomCells: []
    },
    {
        no: 76,
        rows: 3,
        cols: 5,
        empties: [1, 3],
        previous: [71, 72, 73],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [14],
        trimTopCells: [0, 2, 4],
        trimBottomCells: []
    },
    // 两个：14
    {
        no: 77,
        rows: 3,
        cols: 5,
        empties: [10, 12, 13],
        previous: [],
        nexts: [80, 81, 82],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [11, 14]
    },
    {
        no: 78,
        rows: 3,
        cols: 5,
        empties: [10, 12, 13],
        previous: [],
        nexts: [80, 81, 82],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [11, 14]
    },
    {
        no: 79,
        rows: 3,
        cols: 5,
        empties: [10, 12, 13],
        previous: [],
        nexts: [80, 81, 82],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [11, 14]
    },
    {
        no: 80,
        rows: 3,
        cols: 5,
        empties: [1, 4],
        previous: [77, 78, 79],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [9, 14],
        trimTopCells: [0, 2, 3],
        trimBottomCells: []
    },
    {
        no: 81,
        rows: 3,
        cols: 5,
        empties: [1, 4],
        previous: [77, 78, 79],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [9, 14],
        trimTopCells: [0, 2, 3],
        trimBottomCells: []
    },
    {
        no: 82,
        rows: 3,
        cols: 5,
        empties: [1, 4],
        previous: [77, 78, 79],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [9, 14],
        trimTopCells: [0, 2, 3],
        trimBottomCells: []
    },
    // 两个：23
    {
        no: 83,
        rows: 3,
        cols: 5,
        empties: [10, 11, 14],
        previous: [],
        nexts: [86, 87, 88],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [12, 13]
    },
    {
        no: 84,
        rows: 3,
        cols: 5,
        empties: [10, 11, 14],
        previous: [],
        nexts: [86, 87, 88],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [12, 13]
    },
    {
        no: 85,
        rows: 3,
        cols: 5,
        empties: [10, 11, 14],
        previous: [],
        nexts: [86, 87, 88],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [12, 13]
    },
    {
        no: 86,
        rows: 3,
        cols: 5,
        empties: [2, 3],
        previous: [83, 84, 85],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [14],
        trimTopCells: [0, 1, 4],
        trimBottomCells: []
    },
    {
        no: 87,
        rows: 3,
        cols: 5,
        empties: [2, 3],
        previous: [83, 84, 85],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [14],
        trimTopCells: [0, 1, 4],
        trimBottomCells: []
    },
    {
        no: 88,
        rows: 3,
        cols: 5,
        empties: [2, 3],
        previous: [83, 84, 85],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [14],
        trimTopCells: [0, 1, 4],
        trimBottomCells: []
    },
    // 两个：24
    {
        no: 89,
        rows: 3,
        cols: 5,
        empties: [10, 11, 13],
        previous: [],
        nexts: [92, 93, 94],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [12, 14]
    },
    {
        no: 90,
        rows: 3,
        cols: 5,
        empties: [10, 11, 13],
        previous: [],
        nexts: [92, 93, 94],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [12, 14]
    },
    {
        no: 91,
        rows: 3,
        cols: 5,
        empties: [10, 11, 13],
        previous: [],
        nexts: [92, 93, 94],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [12, 14]
    },
    {
        no: 92,
        rows: 3,
        cols: 5,
        empties: [2, 4],
        previous: [89, 90, 91],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [9, 14],
        trimTopCells: [0, 1, 3],
        trimBottomCells: []
    },
    {
        no: 93,
        rows: 3,
        cols: 5,
        empties: [2, 4],
        previous: [89, 90, 91],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [9, 14],
        trimTopCells: [0, 1, 3],
        trimBottomCells: []
    },
    {
        no: 94,
        rows: 3,
        cols: 5,
        empties: [2, 4],
        previous: [89, 90, 91],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [9, 14],
        trimTopCells: [0, 1, 3],
        trimBottomCells: []
    },
    // 两个：34
    {
        no: 95,
        rows: 3,
        cols: 5,
        empties: [10, 11, 12],
        previous: [],
        nexts: [98, 99, 100],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [13, 14]
    },
    {
        no: 96,
        rows: 3,
        cols: 5,
        empties: [10, 11, 12],
        previous: [],
        nexts: [98, 99, 100],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [13, 14]
    },
    {
        no: 97,
        rows: 3,
        cols: 5,
        empties: [10, 11, 12],
        previous: [],
        nexts: [98, 99, 100],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [13, 14]
    },
    {
        no: 98,
        rows: 3,
        cols: 5,
        empties: [3, 4],
        previous: [95, 96, 97],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [9, 14],
        trimTopCells: [0, 1, 2],
        trimBottomCells: []
    },
    {
        no: 99,
        rows: 3,
        cols: 5,
        empties: [3, 4],
        previous: [95, 96, 97],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [9, 14],
        trimTopCells: [0, 1, 2],
        trimBottomCells: []
    },
    {
        no: 100,
        rows: 3,
        cols: 5,
        empties: [3, 4],
        previous: [95, 96, 97],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [9, 14],
        trimTopCells: [0, 1, 2],
        trimBottomCells: []
    },
    // 三个：234
    {
        no: 101,
        rows: 3,
        cols: 5,
        empties: [10, 11],
        previous: [],
        nexts: [104, 105, 106],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [12, 13, 14]
    },
    {
        no: 102,
        rows: 3,
        cols: 5,
        empties: [10, 11],
        previous: [],
        nexts: [104, 105, 106],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [12, 13, 14]
    },
    {
        no: 103,
        rows: 3,
        cols: 5,
        empties: [10, 11],
        previous: [],
        nexts: [104, 105, 106],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [12, 13, 14]
    },
    {
        no: 104,
        rows: 3,
        cols: 5,
        empties: [2, 3, 4],
        previous: [101, 102, 103],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [9, 14],
        trimTopCells: [0, 1],
        trimBottomCells: []
    },
    {
        no: 105,
        rows: 3,
        cols: 5,
        empties: [2, 3, 4],
        previous: [101, 102, 103],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [9, 14],
        trimTopCells: [0, 1],
        trimBottomCells: []
    },
    {
        no: 106,
        rows: 3,
        cols: 5,
        empties: [2, 3, 4],
        previous: [101, 102, 103],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [9, 14],
        trimTopCells: [0, 1],
        trimBottomCells: []
    },
    // 三个：134
    {
        no: 107,
        rows: 3,
        cols: 5,
        empties: [10, 12],
        previous: [],
        nexts: [110, 111, 112],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [11, 13, 14]
    },
    {
        no: 108,
        rows: 3,
        cols: 5,
        empties: [10, 12],
        previous: [],
        nexts: [110, 111, 112],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [11, 13, 14]
    },
    {
        no: 109,
        rows: 3,
        cols: 5,
        empties: [10, 12],
        previous: [],
        nexts: [110, 111, 112],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [11, 13, 14]
    },
    {
        no: 110,
        rows: 3,
        cols: 5,
        empties: [1, 3, 4],
        previous: [107, 108, 109],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [9, 14],
        trimTopCells: [0, 2],
        trimBottomCells: []
    },
    {
        no: 111,
        rows: 3,
        cols: 5,
        empties: [1, 3, 4],
        previous: [107, 108, 109],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [9, 14],
        trimTopCells: [0, 2],
        trimBottomCells: []
    },
    {
        no: 112,
        rows: 3,
        cols: 5,
        empties: [1, 3, 4],
        previous: [107, 108, 109],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [9, 14],
        trimTopCells: [0, 2],
        trimBottomCells: []
    },
    // 三个：124
    {
        no: 113,
        rows: 3,
        cols: 5,
        empties: [10, 13],
        previous: [],
        nexts: [116, 117, 118],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [11, 12, 14]
    },
    {
        no: 114,
        rows: 3,
        cols: 5,
        empties: [10, 13],
        previous: [],
        nexts: [116, 117, 118],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [11, 12, 14]
    },
    {
        no: 115,
        rows: 3,
        cols: 5,
        empties: [10, 13],
        previous: [],
        nexts: [116, 117, 118],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [11, 12, 14]
    },
    {
        no: 116,
        rows: 3,
        cols: 5,
        empties: [1, 2, 4],
        previous: [113, 114, 115],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [9, 14],
        trimTopCells: [0, 3],
        trimBottomCells: []
    },
    {
        no: 117,
        rows: 3,
        cols: 5,
        empties: [1, 2, 4],
        previous: [113, 114, 115],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [9, 14],
        trimTopCells: [0, 3],
        trimBottomCells: []
    },
    {
        no: 118,
        rows: 3,
        cols: 5,
        empties: [1, 2, 4],
        previous: [113, 114, 115],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [9, 14],
        trimTopCells: [0, 3],
        trimBottomCells: []
    },
    // 三个：123
    {
        no: 119,
        rows: 3,
        cols: 5,
        empties: [10, 14],
        previous: [],
        nexts: [122, 123, 124],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [11, 12, 13]
    },
    {
        no: 120,
        rows: 3,
        cols: 5,
        empties: [10, 14],
        previous: [],
        nexts: [122, 123, 124],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [11, 12, 13]
    },
    {
        no: 121,
        rows: 3,
        cols: 5,
        empties: [10, 14],
        previous: [],
        nexts: [122, 123, 124],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0, 5],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [11, 12, 13]
    },
    {
        no: 122,
        rows: 3,
        cols: 5,
        empties: [1, 2, 3],
        previous: [119, 120, 121],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [14],
        trimTopCells: [0, 4],
        trimBottomCells: []
    },
    {
        no: 123,
        rows: 3,
        cols: 5,
        empties: [1, 2, 3],
        previous: [119, 120, 121],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [14],
        trimTopCells: [0, 4],
        trimBottomCells: []
    },
    {
        no: 124,
        rows: 3,
        cols: 5,
        empties: [1, 2, 3],
        previous: [119, 120, 121],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [14],
        trimTopCells: [0, 4],
        trimBottomCells: []
    },
    // 三个：034
    {
        no: 125,
        rows: 3,
        cols: 5,
        empties: [11, 12],
        previous: [],
        nexts: [128, 129, 130],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [10, 13, 14]
    },
    {
        no: 126,
        rows: 3,
        cols: 5,
        empties: [11, 12],
        previous: [],
        nexts: [128, 129, 130],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [10, 13, 14]
    },
    {
        no: 127,
        rows: 3,
        cols: 5,
        empties: [11, 12],
        previous: [],
        nexts: [128, 129, 130],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [10, 13, 14]
    },
    {
        no: 128,
        rows: 3,
        cols: 5,
        empties: [0, 3, 4],
        previous: [125, 126, 127],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [9, 14],
        trimTopCells: [1, 2],
        trimBottomCells: []
    },
    {
        no: 129,
        rows: 3,
        cols: 5,
        empties: [0, 3, 4],
        previous: [125, 126, 127],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [9, 14],
        trimTopCells: [1, 2],
        trimBottomCells: []
    },
    {
        no: 130,
        rows: 3,
        cols: 5,
        empties: [0, 3, 4],
        previous: [125, 126, 127],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [9, 14],
        trimTopCells: [1, 2],
        trimBottomCells: []
    },
    // 三个：024
    {
        no: 131,
        rows: 3,
        cols: 5,
        empties: [11, 13],
        previous: [],
        nexts: [134, 135, 136],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [10, 12, 14]
    },
    {
        no: 132,
        rows: 3,
        cols: 5,
        empties: [11, 13],
        previous: [],
        nexts: [134, 135, 136],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [10, 12, 14]
    },
    {
        no: 133,
        rows: 3,
        cols: 5,
        empties: [11, 13],
        previous: [],
        nexts: [134, 135, 136],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [10, 12, 14]
    },
    {
        no: 134,
        rows: 3,
        cols: 5,
        empties: [0, 2, 4],
        previous: [131, 132, 133],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [9, 14],
        trimTopCells: [1, 3],
        trimBottomCells: []
    },
    {
        no: 135,
        rows: 3,
        cols: 5,
        empties: [0, 2, 4],
        previous: [131, 132, 133],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [9, 14],
        trimTopCells: [1, 3],
        trimBottomCells: []
    },
    {
        no: 136,
        rows: 3,
        cols: 5,
        empties: [0, 2, 4],
        previous: [131, 132, 133],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [9, 14],
        trimTopCells: [1, 3],
        trimBottomCells: []
    },
    // 三个：023
    {
        no: 137,
        rows: 3,
        cols: 5,
        empties: [11, 14],
        previous: [],
        nexts: [140, 141, 142],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10, 12, 13]
    },
    {
        no: 138,
        rows: 3,
        cols: 5,
        empties: [11, 14],
        previous: [],
        nexts: [140, 141, 142],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10, 12, 13]
    },
    {
        no: 139,
        rows: 3,
        cols: 5,
        empties: [11, 14],
        previous: [],
        nexts: [140, 141, 142],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10, 12, 13]
    },
    {
        no: 140,
        rows: 3,
        cols: 5,
        empties: [0, 2, 3],
        previous: [137, 138, 139],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [14],
        trimTopCells: [1, 4],
        trimBottomCells: []
    },
    {
        no: 141,
        rows: 3,
        cols: 5,
        empties: [0, 2, 3],
        previous: [137, 138, 139],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [14],
        trimTopCells: [1, 4],
        trimBottomCells: []
    },
    {
        no: 142,
        rows: 3,
        cols: 5,
        empties: [0, 2, 3],
        previous: [137, 138, 139],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [14],
        trimTopCells: [1, 4],
        trimBottomCells: []
    },
    // 三个：014
    {
        no: 143,
        rows: 3,
        cols: 5,
        empties: [12, 13],
        previous: [],
        nexts: [146, 147, 148],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [10, 11, 14]
    },
    {
        no: 144,
        rows: 3,
        cols: 5,
        empties: [12, 13],
        previous: [],
        nexts: [146, 147, 148],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [10, 11, 14]
    },
    {
        no: 145,
        rows: 3,
        cols: 5,
        empties: [12, 13],
        previous: [],
        nexts: [146, 147, 148],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [10, 11, 14]
    },
    {
        no: 146,
        rows: 3,
        cols: 5,
        empties: [0, 1, 4],
        previous: [143, 144, 145],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [9, 14],
        trimTopCells: [2, 3],
        trimBottomCells: []
    },
    {
        no: 147,
        rows: 3,
        cols: 5,
        empties: [0, 1, 4],
        previous: [143, 144, 145],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [9, 14],
        trimTopCells: [2, 3],
        trimBottomCells: []
    },
    {
        no: 148,
        rows: 3,
        cols: 5,
        empties: [0, 1, 4],
        previous: [143, 144, 145],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [9, 14],
        trimTopCells: [2, 3],
        trimBottomCells: []
    },
    // 三个：013
    {
        no: 149,
        rows: 3,
        cols: 5,
        empties: [12, 14],
        previous: [],
        nexts: [152, 153, 154],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10, 11, 13]
    },
    {
        no: 150,
        rows: 3,
        cols: 5,
        empties: [12, 14],
        previous: [],
        nexts: [152, 153, 154],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10, 11, 13]
    },
    {
        no: 151,
        rows: 3,
        cols: 5,
        empties: [12, 14],
        previous: [],
        nexts: [152, 153, 154],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10, 11, 13]
    },
    {
        no: 152,
        rows: 3,
        cols: 5,
        empties: [0, 1, 3],
        previous: [149, 150, 151],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [14],
        trimTopCells: [2, 4],
        trimBottomCells: []
    },
    {
        no: 153,
        rows: 3,
        cols: 5,
        empties: [0, 1, 3],
        previous: [149, 150, 151],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [14],
        trimTopCells: [2, 4],
        trimBottomCells: []
    },
    {
        no: 154,
        rows: 3,
        cols: 5,
        empties: [0, 1, 3],
        previous: [149, 150, 151],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [14],
        trimTopCells: [2, 4],
        trimBottomCells: []
    },
    // 三个：012
    {
        no: 155,
        rows: 3,
        cols: 5,
        empties: [13, 14],
        previous: [],
        nexts: [158, 159, 160],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10, 11, 12]
    },
    {
        no: 156,
        rows: 3,
        cols: 5,
        empties: [13, 14],
        previous: [],
        nexts: [158, 159, 160],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10, 11, 12]
    },
    {
        no: 157,
        rows: 3,
        cols: 5,
        empties: [13, 14],
        previous: [],
        nexts: [158, 159, 160],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10, 11, 12]
    },
    {
        no: 158,
        rows: 3,
        cols: 5,
        empties: [0, 1, 2],
        previous: [155, 156, 157],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [14],
        trimTopCells: [3, 4],
        trimBottomCells: []
    },
    {
        no: 159,
        rows: 3,
        cols: 5,
        empties: [0, 1, 2],
        previous: [155, 156, 157],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [14],
        trimTopCells: [3, 4],
        trimBottomCells: []
    },
    {
        no: 160,
        rows: 3,
        cols: 5,
        empties: [0, 1, 2],
        previous: [155, 156, 157],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [14],
        trimTopCells: [3, 4],
        trimBottomCells: []
    },
    //四个：1234
    {
        no: 161,
        rows: 3,
        cols: 5,
        empties: [10],
        previous: [],
        nexts: [164, 165, 166],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [11, 12, 13, 14]
    },
    {
        no: 162,
        rows: 3,
        cols: 5,
        empties: [10],
        previous: [],
        nexts: [164, 165, 166],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [11, 12, 13, 14]
    },
    {
        no: 163,
        rows: 3,
        cols: 5,
        empties: [10],
        previous: [],
        nexts: [164, 165, 166],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [11, 12, 13, 14]
    },
    {
        no: 164,
        rows: 3,
        cols: 5,
        empties: [1, 2, 3, 4],
        previous: [161, 162, 163],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [9, 14],
        trimTopCells: [0],
        trimBottomCells: []
    },
    {
        no: 165,
        rows: 3,
        cols: 5,
        empties: [1, 2, 3, 4],
        previous: [161, 162, 163],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [9, 14],
        trimTopCells: [0],
        trimBottomCells: []
    },
    {
        no: 166,
        rows: 3,
        cols: 5,
        empties: [1, 2, 3, 4],
        previous: [161, 162, 163],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [10],
        trimRightCells: [9, 14],
        trimTopCells: [0],
        trimBottomCells: []
    },
    //四个：0234
    {
        no: 167,
        rows: 3,
        cols: 5,
        empties: [11],
        previous: [],
        nexts: [170, 171, 172],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [10, 12, 13, 14]
    },
    {
        no: 168,
        rows: 3,
        cols: 5,
        empties: [11],
        previous: [],
        nexts: [170, 171, 172],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [10, 12, 13, 14]
    },
    {
        no: 169,
        rows: 3,
        cols: 5,
        empties: [11],
        previous: [],
        nexts: [170, 171, 172],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [10, 12, 13, 14]
    },
    {
        no: 170,
        rows: 3,
        cols: 5,
        empties: [0, 2, 3, 4],
        previous: [167, 168, 169],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [9, 14],
        trimTopCells: [1],
        trimBottomCells: []
    },
    {
        no: 171,
        rows: 3,
        cols: 5,
        empties: [0, 2, 3, 4],
        previous: [167, 168, 169],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [9, 14],
        trimTopCells: [1],
        trimBottomCells: []
    },
    {
        no: 172,
        rows: 3,
        cols: 5,
        empties: [0, 2, 3, 4],
        previous: [167, 168, 169],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [9, 14],
        trimTopCells: [1],
        trimBottomCells: []
    },
    //四个：0134
    {
        no: 173,
        rows: 3,
        cols: 5,
        empties: [12],
        previous: [],
        nexts: [176, 177, 178],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [10, 11, 13, 14]
    },
    {
        no: 174,
        rows: 3,
        cols: 5,
        empties: [12],
        previous: [],
        nexts: [176, 177, 178],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [10, 11, 13, 14]
    },
    {
        no: 175,
        rows: 3,
        cols: 5,
        empties: [12],
        previous: [],
        nexts: [176, 177, 178],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [10, 11, 13, 14]
    },
    {
        no: 176,
        rows: 3,
        cols: 5,
        empties: [0, 1, 3, 4],
        previous: [173, 174, 175],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [9, 14],
        trimTopCells: [2],
        trimBottomCells: []
    },
    {
        no: 177,
        rows: 3,
        cols: 5,
        empties: [0, 1, 3, 4],
        previous: [173, 174, 175],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [9, 14],
        trimTopCells: [2],
        trimBottomCells: []
    },
    {
        no: 178,
        rows: 3,
        cols: 5,
        empties: [0, 1, 3, 4],
        previous: [173, 174, 175],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [9, 14],
        trimTopCells: [2],
        trimBottomCells: []
    },
    //四个：0124
    {
        no: 179,
        rows: 3,
        cols: 5,
        empties: [13],
        previous: [],
        nexts: [182, 183, 184],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [10, 11, 12, 14]
    },
    {
        no: 180,
        rows: 3,
        cols: 5,
        empties: [13],
        previous: [],
        nexts: [182, 183, 184],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [10, 11, 12, 14]
    },
    {
        no: 181,
        rows: 3,
        cols: 5,
        empties: [13],
        previous: [],
        nexts: [182, 183, 184],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4],
        trimTopCells: [],
        trimBottomCells: [10, 11, 12, 14]
    },
    {
        no: 182,
        rows: 3,
        cols: 5,
        empties: [0, 1, 2, 4],
        previous: [179, 180, 181],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [9, 14],
        trimTopCells: [3],
        trimBottomCells: []
    },
    {
        no: 183,
        rows: 3,
        cols: 5,
        empties: [0, 1, 2, 4],
        previous: [179, 180, 181],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [9, 14],
        trimTopCells: [3],
        trimBottomCells: []
    },
    {
        no: 184,
        rows: 3,
        cols: 5,
        empties: [0, 1, 2, 4],
        previous: [179, 180, 181],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [9, 14],
        trimTopCells: [3],
        trimBottomCells: []
    },
    //四个：0123
    {
        no: 185,
        rows: 3,
        cols: 5,
        empties: [14],
        previous: [],
        nexts: [188, 189, 190],
        lines: [
            [1, 5, 1, 1]
        ],
        trimLeftCells: [],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10, 11, 12, 13]
    },
    {
        no: 186,
        rows: 3,
        cols: 5,
        empties: [14],
        previous: [],
        nexts: [188, 189, 190],
        lines: [
            [0, 1, 1, 1],
            [2, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10, 11, 12, 13]
    },
    {
        no: 187,
        rows: 3,
        cols: 5,
        empties: [14],
        previous: [],
        nexts: [188, 189, 190],
        lines: [
            [0, 2, 1, 1],
            [3, 5, 1, 1]
        ],
        trimLeftCells: [0],
        trimRightCells: [4, 9],
        trimTopCells: [],
        trimBottomCells: [10, 11, 12, 13]
    },
    {
        no: 188,
        rows: 3,
        cols: 5,
        empties: [0, 1, 2, 3],
        previous: [185, 186, 187],
        nexts: [],
        lines: [
            [1, 5, 2, 2]
        ],
        trimLeftCells: [],
        trimRightCells: [14],
        trimTopCells: [4],
        trimBottomCells: []
    },
    {
        no: 189,
        rows: 3,
        cols: 5,
        empties: [0, 1, 2, 3],
        previous: [185, 186, 187],
        nexts: [],
        lines: [
            [0, 1, 2, 2],
            [2, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [14],
        trimTopCells: [4],
        trimBottomCells: []
    },
    {
        no: 190,
        rows: 3,
        cols: 5,
        empties: [0, 1, 2, 3],
        previous: [185, 186, 187],
        nexts: [],
        lines: [
            [0, 2, 2, 2],
            [3, 5, 2, 2]
        ],
        trimLeftCells: [5, 10],
        trimRightCells: [14],
        trimTopCells: [4],
        trimBottomCells: []
    },
];

globalThis.onload = () => {
    const DEFAULT_TEXT_COLOR = '#555';
    const INNER_LINE_CSS = 'stroke:#888; stroke-width: 0.1mm; stroke-dasharray: 3 2;';
    const CUTTER_LINE_CSS = 'stroke:#000; stroke-width: 0.1mm;';
    const OUTER_LINE_WIDTH = 0.1;
    const HALF_OUTER_LINE_WIDTH = OUTER_LINE_WIDTH * 0.5;
    const OUTER_LINE_CSS = `stroke:#000; stroke-width: ${OUTER_LINE_WIDTH}mm;`;
    const HIDE_FACE_TEXT = getPageParameterByName('hide_face_text', 'false') === 'true';
    const FACE_FONT_SIZE = parseFloat(getPageParameterByName('face_font_size', '3'));
    const FACE_TEXT_COLOR = getPageParameterByName('face_text_color', DEFAULT_TEXT_COLOR).trim().length ? getPageParameterByName('face_text_color', DEFAULT_TEXT_COLOR).trim() : DEFAULT_TEXT_COLOR;
    const FACE_TEXT_CSS = `font-size:${FACE_FONT_SIZE}mm;stroke:${FACE_TEXT_COLOR};`;
    const HIDE_SET_TEXT = getPageParameterByName('hide_set_text', 'false') === 'true';
    const SET_FONT_SIZE = parseFloat(getPageParameterByName('set_font_size', '3'));
    const SET_TEXT_COLOR = getPageParameterByName('set_text_color', FACE_TEXT_COLOR);
    const SET_TEXT_CSS = `font-size:${SET_FONT_SIZE}mm;stroke:${SET_TEXT_COLOR};`;
    const SET_TEXT_USE_MODE_NO = getPageParameterByName('set_text_use_mode_no', 'false') === 'true';
    const TEXT_ONLY_IN_FIRST_CELL = getPageParameterByName('text_only_in_first_cell', 'false') === 'true';
    const HOLE_LINE_CSS = 'stroke: #888; stroke-width: 0.1mm;';
    const SIDE_LENGTH = parseInt(getPageParameterByName('side', '10'));
    const THICKNESS = parseFloat(getPageParameterByName('thickness', '0.6'));
    const HOLE_RADIUS = parseFloat(getPageParameterByName('hole', '1.5'));
    const TEXT_VERTICAL_OFFSET = HOLE_RADIUS + parseFloat(getPageParameterByName('text_offset', '0.9'));
    const PAPER_WIDTH = parseFloat(getPageParameterByName('width', '420'));
    const PAPER_HEIGHT = parseFloat(getPageParameterByName('height', '297'));
    const PAGE_LEFT = parseFloat(getPageParameterByName('left', '5'));
    const PAGE_RIGHT = parseFloat(getPageParameterByName('right', '5'));
    const PAGE_TOP = parseFloat(getPageParameterByName('top', '3.5'));
    const PAGE_BOTTOM = parseFloat(getPageParameterByName('bottom', '3.5'));
    const HALF_SIDE_LENGTH = SIDE_LENGTH * 0.5;
    const PAGE_WIDTH = PAPER_WIDTH - PAGE_LEFT - PAGE_RIGHT;
    const PAGE_HEIGHT = PAPER_HEIGHT - PAGE_TOP - PAGE_BOTTOM;
    const ROW_COUNT = Math.floor(PAGE_HEIGHT / SIDE_LENGTH);
    const COL_COUNT = Math.floor(PAGE_WIDTH / SIDE_LENGTH);
    const CUTTER_LINE_OFFSET = SIDE_LENGTH * 0.15;
    setDocumentTitle(PAPER_WIDTH, PAPER_HEIGHT, SIDE_LENGTH, PAGE_LEFT, PAGE_RIGHT, PAGE_TOP, PAGE_BOTTOM);
    setDynamicCss(PAPER_WIDTH, PAPER_HEIGHT, PAGE_WIDTH, PAGE_HEIGHT, PAGE_LEFT, PAGE_TOP);
    let page;
    page = createNewPage();
    const MAP_SET_NAME_TO_COUNT_ARRAY = [];
    let mapSetNameToCount = {
        setName: '',
        count: 0
    };
    let lastNo = 0;
    let prevColCount = 0;
    let currentRowCount = 0;
    let currentColCount = 0;
    let svgId = 0;
    MODEL_ARRAY.forEach(({
        setName,
        models
    }) => {
        const FILTERED_MAP_SET_NAME_TO_COUNT_ARRAY = MAP_SET_NAME_TO_COUNT_ARRAY.filter((o) => o.setName === setName);
        if (FILTERED_MAP_SET_NAME_TO_COUNT_ARRAY.length) {
            mapSetNameToCount = FILTERED_MAP_SET_NAME_TO_COUNT_ARRAY[0];
        } else {
            mapSetNameToCount = {
                setName,
                count: 0
            };
            MAP_SET_NAME_TO_COUNT_ARRAY.push(mapSetNameToCount);
        }
        let setItemIndex = mapSetNameToCount.count;
        models.forEach(([no, count]) => {
            const {
                rows,
                cols,
                empties,
                previous,
                lines,
                trimLeftCells,
                trimRightCells,
                trimTopCells,
                trimBottomCells
            } = Models[no - 1];
            for (let subIndex = 0; subIndex < count; ++subIndex) {
                const LINE_ARRAY = [];
                const SET_ITEM_TEXT_FLAG = SET_TEXT_USE_MODE_NO ? no : `${setName}${++setItemIndex}`;
                if (currentRowCount + rows + (previous.indexOf(lastNo) > -1 ? -1 : 0) > ROW_COUNT) {
                    if (currentRowCount < ROW_COUNT) {
                        appendBottomSvg(page, SIDE_LENGTH, ROW_COUNT, currentRowCount, prevColCount, INNER_LINE_CSS, HOLE_LINE_CSS, HOLE_RADIUS, HALF_SIDE_LENGTH);
                    }
                    if (currentColCount + cols > COL_COUNT) {
                        if (currentColCount < COL_COUNT) {
                            appendRightSvg(page, SIDE_LENGTH, COL_COUNT, currentColCount, ROW_COUNT, INNER_LINE_CSS, HOLE_LINE_CSS, HOLE_RADIUS, HALF_SIDE_LENGTH);
                        }
                        page = document.createElement('page');
                        document.getElementsByTagName('body')[0].appendChild(page);
                        currentColCount = 0;
                    }
                    currentRowCount = 0;
                }
                if (!currentRowCount) {
                    prevColCount = cols;
                    currentColCount += cols;
                }
                const svg = SvgHelper.createSvg();
                svg.setAttribute('id', `svg_${++svgId}`);
                const {
                    style
                } = svg;
                if (previous.indexOf(lastNo) > -1 && currentRowCount > 0) {
                    style.marginTop = `-${SIDE_LENGTH}mm`;
                    currentRowCount += rows - 1;
                } else {
                    currentRowCount += rows;
                }
                const WIDTH = SIDE_LENGTH * cols;
                const HEIGHT = SIDE_LENGTH * rows;
                style.width = `${WIDTH}mm`;
                style.height = `${HEIGHT}mm`;
                lines.forEach(([x1, x2, y1, y2]) => {
                    const X1 = SIDE_LENGTH * x1;
                    const X2 = SIDE_LENGTH * x2;
                    const Y1 = SIDE_LENGTH * y1;
                    const Y2 = SIDE_LENGTH * y2;
                    SvgHelper.appendLine(svg, CUTTER_LINE_CSS, X1, X2, Y1, Y2, null);
                    if (X1 === X2) {
                        for (let yIndex = y1; yIndex < y2; ++yIndex) {
                            LINE_ARRAY.push(`${X1}_${X1}_${SIDE_LENGTH * yIndex}_${SIDE_LENGTH + SIDE_LENGTH * yIndex}`);
                        }
                    } else {
                        for (let xIndex = x1; xIndex < x2; ++xIndex) {
                            LINE_ARRAY.push(`${SIDE_LENGTH * xIndex}_${SIDE_LENGTH + SIDE_LENGTH * xIndex}_${Y1}_${Y1}`);
                        }
                    }
                });
                const CELL_INDEX_ARRAY = [];
                for (let rowIndex = 0; rowIndex < rows; ++rowIndex) {
                    const ROW_START_CELL_INDEX = cols * rowIndex;
                    for (let colIndex = 0; colIndex < cols; ++colIndex) {
                        const CELL_INDEX = ROW_START_CELL_INDEX + colIndex;
                        if (empties.indexOf(CELL_INDEX) === -1) {
                            CELL_INDEX_ARRAY.push(CELL_INDEX);
                        }
                    }
                }
                trimLeftCells.filter((cellIndex) => CELL_INDEX_ARRAY.indexOf(cellIndex) > -1).forEach((cellIndex) => {
                    const START_X = SIDE_LENGTH * (cellIndex % cols + 1);
                    const END_X = START_X - SIDE_LENGTH + THICKNESS;
                    const Y1 = SIDE_LENGTH * Math.floor(cellIndex / cols);
                    const Y4 = Y1 + SIDE_LENGTH;
                    const Y2 = Y1 + CUTTER_LINE_OFFSET;
                    const Y3 = Y4 - CUTTER_LINE_OFFSET;
                    SvgHelper.appendLine(svg, CUTTER_LINE_CSS, START_X, END_X, Y1, Y2, null);
                    SvgHelper.appendLine(svg, CUTTER_LINE_CSS, END_X, END_X, Y2, Y3, null);
                    SvgHelper.appendLine(svg, CUTTER_LINE_CSS, END_X, START_X, Y3, Y4, null);
                });
                trimRightCells.filter((cellIndex) => CELL_INDEX_ARRAY.indexOf(cellIndex) > -1).forEach((cellIndex) => {
                    const START_X = SIDE_LENGTH * (cellIndex % cols);
                    const END_X = START_X + SIDE_LENGTH - THICKNESS;
                    const Y1 = SIDE_LENGTH * Math.floor(cellIndex / cols);
                    const Y4 = Y1 + SIDE_LENGTH;
                    const Y2 = Y1 + CUTTER_LINE_OFFSET;
                    const Y3 = Y4 - CUTTER_LINE_OFFSET;
                    SvgHelper.appendLine(svg, CUTTER_LINE_CSS, START_X, END_X, Y1, Y2, null);
                    SvgHelper.appendLine(svg, CUTTER_LINE_CSS, END_X, END_X, Y2, Y3, null);
                    SvgHelper.appendLine(svg, CUTTER_LINE_CSS, END_X, START_X, Y3, Y4, null);
                });
                trimTopCells.filter((cellIndex) => CELL_INDEX_ARRAY.indexOf(cellIndex) > -1).forEach((cellIndex) => {
                    const START_Y = SIDE_LENGTH * (Math.floor(cellIndex / cols) + 1);
                    const END_Y = START_Y - SIDE_LENGTH + THICKNESS;
                    const X1 = SIDE_LENGTH * (cellIndex % cols);
                    const X4 = X1 + SIDE_LENGTH;
                    const X2 = X1 + CUTTER_LINE_OFFSET;
                    const X3 = X4 - CUTTER_LINE_OFFSET;
                    SvgHelper.appendLine(svg, CUTTER_LINE_CSS, X1, X2, START_Y, END_Y, null);
                    SvgHelper.appendLine(svg, CUTTER_LINE_CSS, X2, X3, END_Y, END_Y, null);
                    SvgHelper.appendLine(svg, CUTTER_LINE_CSS, X3, X4, END_Y, START_Y, null);
                });
                trimBottomCells.filter((cellIndex) => CELL_INDEX_ARRAY.indexOf(cellIndex) > -1).forEach((cellIndex) => {
                    const START_Y = SIDE_LENGTH * Math.floor(cellIndex / cols);
                    const END_Y = START_Y + SIDE_LENGTH - THICKNESS;
                    const X1 = SIDE_LENGTH * (cellIndex % cols);
                    const X4 = X1 + SIDE_LENGTH;
                    const X2 = X1 + CUTTER_LINE_OFFSET;
                    const X3 = X4 - CUTTER_LINE_OFFSET;
                    SvgHelper.appendLine(svg, CUTTER_LINE_CSS, X1, X2, START_Y, END_Y, null);
                    SvgHelper.appendLine(svg, CUTTER_LINE_CSS, X2, X3, END_Y, END_Y, null);
                    SvgHelper.appendLine(svg, CUTTER_LINE_CSS, X3, X4, END_Y, START_Y, null);
                });
                CELL_INDEX_ARRAY.forEach((cellIndex, index) => {
                    const ROW_INDEX = Math.floor(cellIndex / cols);
                    const COL_INDEX = cellIndex % cols;
                    const TOP = SIDE_LENGTH * ROW_INDEX;
                    const BOTTOM = TOP + SIDE_LENGTH;
                    const LEFT = SIDE_LENGTH * COL_INDEX;
                    const RIGHT = LEFT + SIDE_LENGTH;
                    const HAS_TOP_OUTER_LINE = !ROW_INDEX || CELL_INDEX_ARRAY.indexOf(cols * (ROW_INDEX - 1) + COL_INDEX) === -1;
                    const HAS_BOTTOM_OUTER_LINE = ROW_INDEX === rows - 1 || CELL_INDEX_ARRAY.indexOf(cols * (ROW_INDEX + 1) + COL_INDEX) === -1;
                    const HAS_LEFT_OUTER_LINE = !COL_INDEX || CELL_INDEX_ARRAY.indexOf(cols * ROW_INDEX + COL_INDEX - 1) === -1;
                    const HAS_RIGHT_OUTER_LINE = COL_INDEX === cols - 1 || CELL_INDEX_ARRAY.indexOf(cols * ROW_INDEX + COL_INDEX + 1) === -1;
                    if (HAS_TOP_OUTER_LINE) {
                        SvgHelper.appendLine(svg, OUTER_LINE_CSS, LEFT, RIGHT, TOP, TOP, null);
                        LINE_ARRAY.push(`${LEFT}_${RIGHT}_${TOP}_${TOP}`);
                    }
                    if (HAS_BOTTOM_OUTER_LINE) {
                        const FIXED_BOTTOM = BOTTOM - (ROW_INDEX === rows - 1 ? HALF_OUTER_LINE_WIDTH : 0);
                        SvgHelper.appendLine(svg, OUTER_LINE_CSS, LEFT, RIGHT, FIXED_BOTTOM, FIXED_BOTTOM, null);
                        LINE_ARRAY.push(`${LEFT}_${RIGHT}_${BOTTOM}_${BOTTOM}`);
                    }
                    if (HAS_LEFT_OUTER_LINE) {
                        SvgHelper.appendLine(svg, OUTER_LINE_CSS, LEFT, LEFT, TOP, BOTTOM, null);
                        LINE_ARRAY.push(`${LEFT}_${LEFT}_${TOP}_${BOTTOM}`);
                    }
                    if (HAS_RIGHT_OUTER_LINE) {
                        SvgHelper.appendLine(svg, OUTER_LINE_CSS, RIGHT, RIGHT, TOP, BOTTOM, null);
                        LINE_ARRAY.push(`${RIGHT}_${RIGHT}_${TOP}_${BOTTOM}`);
                    }
                    const HAS_TOP_INNER_LINE = CELL_INDEX_ARRAY.indexOf(cols * (ROW_INDEX - 1) + COL_INDEX) > -1;
                    const HAS_BOTTOM_INNER_LINE = CELL_INDEX_ARRAY.indexOf(cols * (ROW_INDEX + 1) + COL_INDEX) > -1;
                    const HAS_LEFT_INNER_LINE = CELL_INDEX_ARRAY.indexOf(cols * ROW_INDEX + COL_INDEX - 1) > -1;
                    const HAS_RIGHT_INNER_LINE = CELL_INDEX_ARRAY.indexOf(cols * ROW_INDEX + COL_INDEX + 1) > -1;
                    if (HAS_TOP_INNER_LINE && LINE_ARRAY.indexOf(`${LEFT}_${RIGHT}_${TOP}_${TOP}`) === -1) {
                        SvgHelper.appendLine(svg, INNER_LINE_CSS, LEFT, RIGHT, TOP, TOP, null);
                        LINE_ARRAY.push(`${LEFT}_${RIGHT}_${TOP}_${TOP}`);
                    }
                    if (HAS_BOTTOM_INNER_LINE && LINE_ARRAY.indexOf(`${LEFT}_${RIGHT}_${BOTTOM}_${BOTTOM}`) === -1) {
                        SvgHelper.appendLine(svg, INNER_LINE_CSS, LEFT, RIGHT, BOTTOM, BOTTOM, null);
                        LINE_ARRAY.push(`${LEFT}_${RIGHT}_${BOTTOM}_${BOTTOM}`);
                    }
                    if (HAS_LEFT_INNER_LINE && LINE_ARRAY.indexOf(`${LEFT}_${LEFT}_${TOP}_${BOTTOM}`) === -1) {
                        SvgHelper.appendLine(svg, INNER_LINE_CSS, LEFT, LEFT, TOP, BOTTOM, null);
                        LINE_ARRAY.push(`${LEFT}_${LEFT}_${TOP}_${BOTTOM}`);
                    }
                    if (HAS_RIGHT_INNER_LINE && LINE_ARRAY.indexOf(`${RIGHT}_${RIGHT}_${TOP}_${BOTTOM}`) === -1) {
                        SvgHelper.appendLine(svg, INNER_LINE_CSS, RIGHT, RIGHT, TOP, BOTTOM, null);
                        LINE_ARRAY.push(`${RIGHT}_${RIGHT}_${TOP}_${BOTTOM}`);
                    }
                    const TEXT_X = LEFT + HALF_SIDE_LENGTH;
                    const TEXT_Y = TOP + HALF_SIDE_LENGTH;
                    if (!TEXT_ONLY_IN_FIRST_CELL || index === 0) {
                        if (!HIDE_SET_TEXT) {
                            SvgHelper.appendText(svg, SET_TEXT_CSS, `${SET_ITEM_TEXT_FLAG}`, TEXT_X, TEXT_Y - TEXT_VERTICAL_OFFSET, 0, '', null, false);
                        }
                        if (!HIDE_FACE_TEXT) {
                            SvgHelper.appendText(svg, FACE_TEXT_CSS, `${no}${FACE_NAME_ARRAY[index]}`, TEXT_X, TEXT_Y + TEXT_VERTICAL_OFFSET, 0, '', null, false);
                        }
                    }
                });
                if (HOLE_RADIUS) {
                    for (let rowIndex = 0; rowIndex < rows; ++rowIndex) {
                        const ROW_START_CELL_INDEX = cols * rowIndex;
                        for (let colIndex = 0; colIndex < cols; ++colIndex) {
                            const CELL_INDEX = ROW_START_CELL_INDEX + colIndex;
                            if (CELL_INDEX_ARRAY.indexOf(CELL_INDEX) > -1) {
                                SvgHelper.appendCircle(svg, HOLE_LINE_CSS, SIDE_LENGTH * (colIndex + 0.5), SIDE_LENGTH * (rowIndex + 0.5), HOLE_RADIUS, null);
                                break;
                            }
                        }
                    }
                }
                page.appendChild(svg);
            }
            mapSetNameToCount.count += count;
            lastNo = no;
        });
    });
    if (currentRowCount < ROW_COUNT) {
        appendBottomSvg(page, SIDE_LENGTH, ROW_COUNT, currentRowCount, prevColCount, INNER_LINE_CSS, HOLE_LINE_CSS, HOLE_RADIUS, HALF_SIDE_LENGTH);
    }
    if (currentColCount < COL_COUNT) {
        appendRightSvg(page, SIDE_LENGTH, COL_COUNT, currentColCount, ROW_COUNT, INNER_LINE_CSS, HOLE_LINE_CSS, HOLE_RADIUS, HALF_SIDE_LENGTH);
    }
    globalThis.print();
};

function appendRightSvg(page, SIDE_LENGTH, COL_COUNT, currentColCount, ROW_COUNT, INNER_LINE_CSS, HOLE_LINE_CSS, HOLE_RADIUS, HALF_SIDE_LENGTH) {
    const svgRight = SvgHelper.createSvg();
    page.appendChild(svgRight);
    const SVG_COL_COUNT = COL_COUNT - currentColCount;
    const X = SIDE_LENGTH * SVG_COL_COUNT;
    const SVG_HEIGHT = SIDE_LENGTH * ROW_COUNT;
    const style = svgRight.style;
    style.width = `${X}mm`;
    style.height = `${SVG_HEIGHT}mm`;
    for (let rowIndex = 0; rowIndex <= ROW_COUNT; ++rowIndex) {
        const Y = SIDE_LENGTH * rowIndex;
        SvgHelper.appendLine(svgRight, INNER_LINE_CSS, 0, X, Y, Y, null);
        if (rowIndex < ROW_COUNT) {
            SvgHelper.appendCircle(svgRight, HOLE_LINE_CSS, HALF_SIDE_LENGTH, Y + HALF_SIDE_LENGTH, HOLE_RADIUS, null);
        }
    }
    for (let colIndex = 0; colIndex < SVG_COL_COUNT; ++colIndex) {
        const X = SIDE_LENGTH * (colIndex + 1);
        SvgHelper.appendLine(svgRight, INNER_LINE_CSS, X, X, 0, SVG_HEIGHT, null);
    }
}

function appendBottomSvg(page, SIDE_LENGTH, ROW_COUNT, currentRowCount, prevColCount, INNER_LINE_CSS, HOLE_LINE_CSS, HOLE_RADIUS, HALF_SIDE_LENGTH) {
    const svgBottom = SvgHelper.createSvg();
    page.appendChild(svgBottom);
    const SVG_ROW_COUNT = ROW_COUNT - currentRowCount;
    const Y = SIDE_LENGTH * SVG_ROW_COUNT;
    const SVG_WIDTH = SIDE_LENGTH * prevColCount;
    const style = svgBottom.style;
    style.width = `${SVG_WIDTH}mm`;
    style.height = `${Y}mm`;
    for (let colIndex = 0; colIndex < prevColCount; ++colIndex) {
        const X = SIDE_LENGTH * (colIndex + 1);
        SvgHelper.appendLine(svgBottom, INNER_LINE_CSS, X, X, 0, Y, null);
        SvgHelper.appendCircle(svgBottom, HOLE_LINE_CSS, X - HALF_SIDE_LENGTH, HALF_SIDE_LENGTH, HOLE_RADIUS, null);
    }
    for (let rowIndex = 0; rowIndex < SVG_ROW_COUNT; ++rowIndex) {
        const Y = SIDE_LENGTH * (rowIndex + 1);
        SvgHelper.appendLine(svgBottom, INNER_LINE_CSS, 0, SVG_WIDTH, Y, Y, null);
    }
}

function createNewPage() {
    const page = document.createElement('page');
    document.getElementsByTagName('body')[0].appendChild(page);
    return page;
}

function setDynamicCss(PAGE_WIDTH, PAGE_HEIGHT, MAX_X, MAX_Y, PAGE_LEFT, PAGE_TOP) {
    const css = `@media print { @page { size: ${PAGE_WIDTH}mm ${PAGE_HEIGHT}mm; } }
* { border: 0;  padding: 0; margin: 0; }
html, body { overflow: hidden; width: ${PAGE_WIDTH}mm; }
body{font-family: 'Times New Roman', 'Kaiti', 'PingFang';}
page {width: ${MAX_X}mm; height: ${MAX_Y}mm;padding-left:${PAGE_LEFT}mm;padding-top:${PAGE_TOP}mm;}
page {display:flex;flex-direction:column;flex-wrap:wrap;align-content:flex-start;}
page:not(:last-of-type){page-break-after:always;}
`;
    document.getElementById('dynamicStyle').innerText = css;
}

function setDocumentTitle(PAGE_WIDTH, PAGE_HEIGHT, SIDE_LENGTH, PAGE_LEFT, PAGE_RIGHT, PAGE_TOP, PAGE_BOTTOM) {
    let title = `${PAGE_WIDTH === 420 && PAGE_HEIGHT === 297 || PAGE_WIDTH === 297 && PAGE_HEIGHT === 420 ? 'A3' : PAGE_WIDTH === 210 && PAGE_HEIGHT === 297 || PAGE_WIDTH === 297 && PAGE_HEIGHT === 210 ? 'A4' : `width${PAGE_WIDTH}mm_height${PAGE_HEIGHT}mm`}_${SIDE_LENGTH}mm_ghostkube_`;
    if ((PAGE_LEFT === 5 && PAGE_RIGHT === 5 || PAGE_LEFT === 4.5 && PAGE_RIGHT === 4.5 || PAGE_LEFT === 4 && PAGE_RIGHT === 4 || PAGE_LEFT === 3.5 && PAGE_RIGHT === 3.5 || PAGE_LEFT === 3 && PAGE_RIGHT === 3) && (PAGE_TOP === 5 && PAGE_BOTTOM === 5 || PAGE_TOP === 4.5 && PAGE_BOTTOM === 4.5 || PAGE_TOP === 4 && PAGE_BOTTOM === 4 || PAGE_TOP === 3.5 && PAGE_BOTTOM === 3.5 || PAGE_TOP === 3 && PAGE_BOTTOM === 3)) {
        title += 'L1300.pdf';
    } else if (!PAGE_LEFT && !PAGE_RIGHT && !PAGE_TOP && !PAGE_BOTTOM) {
        title += 'zero_margins.pdf';
    } else {
        title += `left${PAGE_LEFT}mm_right${PAGE_RIGHT}mm_top${PAGE_TOP}mm_bottom${PAGE_BOTTOM}mm.pdf`;
    }
    document.getElementsByTagName('title')[0].innerText = (FILE_NAME_POSTFIX || '').length ? title.replace('.pdf', `_${FILE_NAME_POSTFIX}.pdf`) : title;
}