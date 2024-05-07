// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

console.log(new Date());
const DATE_BEGIN = performance.now();
let dateBegin = performance.now();

function showUsedTime(functionName) {
    const end = performance.now();
    const duration = end - dateBegin;
    console.log(`${functionName}, used ${duration.toFixed(2)} milliseconds.`);
    dateBegin = end;
}
const ROW_COUNT_ARRAY = [
    2,
    3,
    4
];
const SIX_FACE_NAME_CHARS = '❶❷❸❹❺❻'.split('');
const TWELVE_EDGE_NAME_CHARS = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫'.split('');
const SETTINGS = {
    mustContainEveryColumn: true
};
const DEBUG = {
    SHOW_FAILED_RELATION_CELL_INFO: false,
    SHOW_SIX_FACE_AND_DIRECTION_RELATIONS: false,
    SHOW_CELL_TO_STRING: false,
    FIX_PREVIOUS_NO_ARRAY: false
};
const {
    floor
} = Math;
const SIX_FACE_SHORT_NAMES = 'UDLRFB'.split('');
const CUBES = [];
Boolean.prototype.repeat = function (times) {
    const RESULT = [];
    for (let i = 0; i < times; ++i) {
        RESULT.push(this);
    }
    return RESULT;
};
Number.prototype.repeat = function (times) {
    const RESULT = [];
    for (let i = 0; i < times; ++i) {
        RESULT.push(this);
    }
    return RESULT;
};
Array.prototype.repeat = function (times) {
    const RESULT = [];
    for (let i = 0; i < times; ++i) {
        RESULT.push(this);
    }
    return RESULT;
};
const FACE_NAME_ARRAY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
var FourDirection;
(function (FourDirection) {
    FourDirection[FourDirection["Original"] = 0] = "Original";
    FourDirection[FourDirection["Clockwise90"] = 1] = "Clockwise90";
    FourDirection[FourDirection["SemiCircle"] = 2] = "SemiCircle";
    FourDirection[FourDirection["Counterclockwise90"] = 3] = "Counterclockwise90";
})(FourDirection || (FourDirection = {}));
const TextDirections = [
    0,
    90,
    180,
    270
];
var GridLineStyle;
(function (GridLineStyle) {
    GridLineStyle[GridLineStyle["Unknown"] = 0] = "Unknown";
    GridLineStyle[GridLineStyle["None"] = 1] = "None";
    GridLineStyle[GridLineStyle["InnerLine"] = 2] = "InnerLine";
    GridLineStyle[GridLineStyle["CutLine"] = 3] = "CutLine";
    GridLineStyle[GridLineStyle["OuterLine"] = 4] = "OuterLine";
})(GridLineStyle || (GridLineStyle = {}));
var CellBorderLine;
(function (CellBorderLine) {
    CellBorderLine[CellBorderLine["Unknown"] = GridLineStyle.Unknown] = "Unknown";
    CellBorderLine[CellBorderLine["InnerLine"] = GridLineStyle.InnerLine] = "InnerLine";
    CellBorderLine[CellBorderLine["CutLine"] = GridLineStyle.CutLine] = "CutLine";
    CellBorderLine[CellBorderLine["OuterLine"] = GridLineStyle.OuterLine] = "OuterLine";
})(CellBorderLine || (CellBorderLine = {}));
var CellBorderPosition;
(function (CellBorderPosition) {
    CellBorderPosition[CellBorderPosition["Top"] = 0] = "Top";
    CellBorderPosition[CellBorderPosition["Right"] = 1] = "Right";
    CellBorderPosition[CellBorderPosition["Bottom"] = 2] = "Bottom";
    CellBorderPosition[CellBorderPosition["Left"] = 3] = "Left";
})(CellBorderPosition || (CellBorderPosition = {}));
var CellFeature;
(function (CellFeature) {
    CellFeature[CellFeature["Unknown"] = 0] = "Unknown";
    CellFeature[CellFeature["None"] = 1] = "None";
    CellFeature[CellFeature["Face"] = 2] = "Face";
    CellFeature[CellFeature["Piece"] = 3] = "Piece";
})(CellFeature || (CellFeature = {}));
var SixFace;
(function (SixFace) {
    SixFace[SixFace["Up"] = 0] = "Up";
    SixFace[SixFace["Down"] = 1] = "Down";
    SixFace[SixFace["Left"] = 2] = "Left";
    SixFace[SixFace["Right"] = 3] = "Right";
    SixFace[SixFace["Front"] = 4] = "Front";
    SixFace[SixFace["Back"] = 5] = "Back";
})(SixFace || (SixFace = {}));
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
})(SixFaceTwentyFourAngle || (SixFaceTwentyFourAngle = {}));

function convertSixFaceTwentyFourAngleToSixFaceAndDirection(value) {
    const FIXED_VALUE = value + 0.5;
    return [
        floor(FIXED_VALUE / 4),
        floor(FIXED_VALUE % 4)
    ];
}

function convertSixFaceTwentyFourAngleToString(value) {
    const FIXED_VALUE = value + 0.5;
    return `${SIX_FACE_SHORT_NAMES[floor(FIXED_VALUE / 4)]} + ${90 * floor(FIXED_VALUE % 4)}`;
}

function convertSixFaceAndDirectionToSixFaceTwentyFourAngle(sixFace, fourDirection) {
    return 4 * sixFace + fourDirection;
}
var ConnectionRelation;
(function (ConnectionRelation) {
    ConnectionRelation[ConnectionRelation["Top"] = 0] = "Top";
    ConnectionRelation[ConnectionRelation["Right"] = 1] = "Right";
    ConnectionRelation[ConnectionRelation["Bottom"] = 2] = "Bottom";
    ConnectionRelation[ConnectionRelation["Left"] = 3] = "Left";
})(ConnectionRelation || (ConnectionRelation = {}));
const SIX_FACE_AND_DIRECTION_RELATIONS = [
    [
        20,
        12,
        16,
        8
    ],
    [
        9,
        21,
        13,
        17
    ],
    [
        18,
        10,
        22,
        14
    ],
    [
        15,
        19,
        11,
        23
    ],
    [
        22,
        8,
        18,
        12
    ],
    [
        13,
        23,
        9,
        19
    ],
    [
        16,
        14,
        20,
        10
    ],
    [
        11,
        17,
        15,
        21
    ],
    [
        23,
        0,
        17,
        4
    ],
    [
        5,
        20,
        1,
        18
    ],
    [
        19,
        6,
        21,
        2
    ],
    [
        3,
        16,
        7,
        22
    ],
    [
        21,
        4,
        19,
        0
    ],
    [
        1,
        22,
        5,
        16
    ],
    [
        17,
        2,
        23,
        6
    ],
    [
        7,
        18,
        3,
        20
    ],
    [
        0,
        13,
        6,
        11
    ],
    [
        8,
        1,
        14,
        7
    ],
    [
        4,
        9,
        2,
        15
    ],
    [
        12,
        5,
        10,
        3
    ],
    [
        6,
        15,
        0,
        9
    ],
    [
        10,
        7,
        12,
        1
    ],
    [
        2,
        11,
        4,
        13
    ],
    [
        14,
        3,
        8,
        5
    ]
];

function showSixFaceAndDirectionRelations() {
    if (!DEBUG.SHOW_SIX_FACE_AND_DIRECTION_RELATIONS) {
        return;
    }
    console.log('SIX_FACE_AND_DIRECTION_RELATIONS:', SIX_FACE_AND_DIRECTION_RELATIONS);
    SIX_FACE_AND_DIRECTION_RELATIONS.forEach((item, index) => {
        console.log(convertSixFaceTwentyFourAngleToString(index), item.map((to) => `${convertSixFaceTwentyFourAngleToString(to)}`));
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
})(TwelveEdge || (TwelveEdge = {}));
const SixFaceTwentyFourAngleToTwelveEdge = [
    [
        TwelveEdge.UpTop,
        TwelveEdge.UpRight,
        TwelveEdge.UpBottom,
        TwelveEdge.UpLeft
    ],
    [
        TwelveEdge.DownTop,
        TwelveEdge.DownLeft,
        TwelveEdge.DownBottom,
        TwelveEdge.DownRight
    ],
    [
        TwelveEdge.BackLeft,
        TwelveEdge.UpLeft,
        TwelveEdge.FrontLeft,
        TwelveEdge.DownLeft
    ],
    [
        TwelveEdge.BackRight,
        TwelveEdge.DownRight,
        TwelveEdge.FrontRight,
        TwelveEdge.UpRight
    ],
    [
        TwelveEdge.UpBottom,
        TwelveEdge.FrontRight,
        TwelveEdge.DownBottom,
        TwelveEdge.FrontLeft
    ],
    [
        TwelveEdge.DownTop,
        TwelveEdge.BackRight,
        TwelveEdge.UpTop,
        TwelveEdge.BackLeft
    ]
];

function convertTwelveEdgeToString(value) {
    return [
        'UpTop',
        'UpRight',
        'UpBottom',
        'UpLeft',
        'BackLeft',
        'BackRight',
        'FrontRight',
        'FrontLeft',
        'DownTop',
        'DownRight',
        'DownBottom',
        'DownLeft'
    ][value];
}

function getSixFaceTwentyFourAngleRelationTwelveEdge(value, relation) {
    const [sixFace, fourDirection] = convertSixFaceTwentyFourAngleToSixFaceAndDirection(value);
    const index = floor((relation + fourDirection + 0.5) % 4);
    const RESULT = SixFaceTwentyFourAngleToTwelveEdge[sixFace][index];
    if (typeof RESULT === 'undefined') {
        console.error('getSixFaceTwentyFourAngleRelationTwelveEdge', {
            value,
            relation,
            sixFace,
            fourDirection,
            index: floor((relation + fourDirection - 0.5) % 4),
            array: SixFaceTwentyFourAngleToTwelveEdge[sixFace]
        });
    }
    return RESULT;
}
class CellObject {
    rowIndex;
    colIndex;
    cellIndex;
    layerIndex;
    addOrder;
    relatedInformationWhenAdding;
    feature;
    sixFace;
    faceDirection;
    twelveEdge;
    get isEmpty() {
        return this.feature === CellFeature.None;
    }
    get isUnknown() {
        return this.feature === CellFeature.Unknown;
    }
    get sixFaceTwentyFourAngle() {
        return convertSixFaceAndDirectionToSixFaceTwentyFourAngle(this.sixFace, this.faceDirection);
    }
    get sixFaceTwentyFourAngleStr() {
        return convertSixFaceTwentyFourAngleToString(this.sixFaceTwentyFourAngle);
    }
    get twelveEdgeStr() {
        return convertTwelveEdgeToString(this.twelveEdge);
    }
    borderLines;
    toString;
    clone() {
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
    constructor(rowIndex, colIndex, cellIndex) {
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        this.cellIndex = cellIndex;
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
            CellBorderLine.Unknown
        ];
        this.toString = () => {
            return JSON.stringify(this);
        };
    }
}

function getEmptySixFaces() {
    return [
        [],
        [],
        [],
        [],
        [],
        []
    ];
}

function getEmptyTwelveEdges() {
    return [{
            canBeInserted: false,
            pieces: []
        },
        {
            canBeInserted: false,
            pieces: []
        },
        {
            canBeInserted: false,
            pieces: []
        },
        {
            canBeInserted: false,
            pieces: []
        },
        {
            canBeInserted: false,
            pieces: []
        },
        {
            canBeInserted: false,
            pieces: []
        },
        {
            canBeInserted: false,
            pieces: []
        },
        {
            canBeInserted: false,
            pieces: []
        },
        {
            canBeInserted: false,
            pieces: []
        },
        {
            canBeInserted: false,
            pieces: []
        },
        {
            canBeInserted: false,
            pieces: []
        },
        {
            canBeInserted: false,
            pieces: []
        }
    ];
}
class Cube {
    no;
    rowCount;
    colCount;
    coreRowIndex;
    coreColIndex;
    cells;
    actCells;
    emptyCells;
    gridLines;
    previousNoArray;
    firstRowActCellColIndexBill;
    lastRowEmptyCellColIndexBill;
    updateIsValid() {
        const {
            actCells
        } = this;
        const {
            rowCount
        } = this;
        let isValid = true;
        for (let checkRowIndex = 0; checkRowIndex < rowCount; ++checkRowIndex) {
            if (!isValid) {
                return;
            }
            isValid = actCells.filter((cell) => cell.rowIndex === checkRowIndex).length > 0;
        }
        if (!isValid) {
            this.isValid = false;
            return;
        }
        if (SETTINGS.mustContainEveryColumn) {
            const {
                colCount
            } = this;
            for (let checkColIndex = 0; checkColIndex < colCount; ++checkColIndex) {
                if (!isValid) {
                    return;
                }
                isValid = actCells.filter((cell) => cell.colIndex === checkColIndex).length > 0;
            }
            if (!isValid) {
                this.isValid = false;
                return;
            }
        }
        const {
            sixFaces,
            twelveEdges,
            cells
        } = this;
        const SIX_FACE_POINTS = [
            0,
            0,
            0,
            0,
            0,
            0
        ];
        const ONE_INNER_LINE_CELL_TWENTY_FOUR_ANGEL_COUNT_ARRAY = 0..repeat(24);
        this.actCells.forEach((cell) => {
            const {
                rowIndex,
                colIndex,
                borderLines
            } = cell;
            let sixFaceIndex = 0;
            let sixFaceTwentyFourAngle = 0;
            switch (borderLines.filter((borderLine) => borderLine === CellBorderLine.InnerLine).length) {
                case 2:
                case 3:
                case 4:
                    sixFaceIndex = cell.sixFace;
                    SIX_FACE_POINTS[sixFaceIndex] += 1;
                    sixFaces[sixFaceIndex].push([
                        rowIndex,
                        colIndex
                    ]);
                    break;
                case 1:
                    sixFaceTwentyFourAngle = convertSixFaceAndDirectionToSixFaceTwentyFourAngle(cell.sixFace, cell.faceDirection);
                    ONE_INNER_LINE_CELL_TWENTY_FOUR_ANGEL_COUNT_ARRAY[sixFaceTwentyFourAngle] += 1;
                    if (cell.relatedInformationWhenAdding.rowIndex === -1) {
                        let relationRowIndex = 0;
                        let relationColIndex = 0;
                        let relation = ConnectionRelation.Top;
                        borderLines.forEach((borderLine, index) => {
                            if (borderLine === CellBorderLine.InnerLine) {
                                switch (index) {
                                    case CellBorderPosition.Top:
                                        relation = ConnectionRelation.Bottom;
                                        relationRowIndex = rowIndex - 1;
                                        relationColIndex = colIndex;
                                        break;
                                    case CellBorderPosition.Bottom:
                                        relation = ConnectionRelation.Top;
                                        relationRowIndex = rowIndex + 1;
                                        relationColIndex = colIndex;
                                        break;
                                    case CellBorderPosition.Left:
                                        relation = ConnectionRelation.Right;
                                        relationRowIndex = rowIndex;
                                        relationColIndex = colIndex - 1;
                                        break;
                                    case CellBorderPosition.Right:
                                        relation = ConnectionRelation.Left;
                                        relationRowIndex = rowIndex;
                                        relationColIndex = colIndex + 1;
                                        break;
                                    default:
                                        break;
                                }
                            }
                        });
                        const RELATION_CELL = cells[relationRowIndex][relationColIndex];
                        twelveEdges[getSixFaceTwentyFourAngleRelationTwelveEdge(convertSixFaceAndDirectionToSixFaceTwentyFourAngle(RELATION_CELL.sixFace, RELATION_CELL.faceDirection), relation)].pieces.push([
                            rowIndex,
                            colIndex
                        ]);
                    } else {
                        const {
                            rowIndex: relationRowIndex,
                            colIndex: relationColIndex,
                            relation
                        } = cell.relatedInformationWhenAdding;
                        const RELATION_CELL = cells[relationRowIndex][relationColIndex];
                        twelveEdges[getSixFaceTwentyFourAngleRelationTwelveEdge(convertSixFaceAndDirectionToSixFaceTwentyFourAngle(RELATION_CELL.sixFace, RELATION_CELL.faceDirection), relation)].pieces.push([
                            rowIndex,
                            colIndex
                        ]);
                    }
                    break;
                default:
                    break;
            }
        });
        SIX_FACE_POINTS.forEach((_point, index) => {
            const OFFSET = 4 * index;
            for (let i = 0; i < 4; ++i) {
                SIX_FACE_POINTS[index] += ONE_INNER_LINE_CELL_TWENTY_FOUR_ANGEL_COUNT_ARRAY[OFFSET + i] > 0 ? 0.5 : 0;
            }
        });
        if (SIX_FACE_POINTS.filter((point) => point < 1).length) {
            this.isValid = false;
            this.sixFaces.forEach((array) => array.length = 0);
            this.twelveEdges.forEach((item) => item.pieces.length = 0);
            return;
        }
        this.isValid = true;
    }
    updateGridLines() {
        const {
            gridLines
        } = this;
        gridLines.length = 0;
        const EXISTS_GRID_LINES = [];
        this.actCells.forEach((cell) => {
            const {
                rowIndex,
                colIndex,
                borderLines
            } = cell;
            borderLines.forEach((borderLine, index) => {
                const IS_HORIZONTAL = index === 0 || index === 3;
                const xStart = colIndex + (index === 1 ? 1 : 0);
                const xEnd = xStart + (IS_HORIZONTAL ? 1 : 0);
                const yStart = rowIndex + (index === 2 ? 0 : 1);
                const yEnd = yStart + (IS_HORIZONTAL ? 0 : 1);
                const lineStyle = borderLine;
                const NEW_POSITION = `${xStart}_${xEnd}_${yStart}_${yEnd}`;
                if (EXISTS_GRID_LINES.indexOf(NEW_POSITION) === -1) {
                    gridLines.push({
                        xStart,
                        xEnd,
                        yStart,
                        yEnd,
                        lineStyle
                    });
                    EXISTS_GRID_LINES.push(NEW_POSITION);
                }
            });
        });
    }
    count() {
        this.actCells.length = 0;
        this.emptyCells.length = 0;
        this.cells.forEach((cellRows) => {
            cellRows.forEach((cell) => {
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
                        break;
                }
            });
        });
        this.firstRowActCellColIndexBill = this.actCells.filter((cell) => cell.rowIndex === 0).map((cell) => cell.colIndex).join(',');
        const MAX_ROW_INDEX = this.rowCount - 1;
        this.lastRowEmptyCellColIndexBill = this.emptyCells.filter((cell) => cell.rowIndex === MAX_ROW_INDEX).map((cell) => cell.colIndex).join(',');
        this.updateIsValid();
    }
    sixFaces;
    twelveEdges;
    isValid;
    constructor(no, rowCount, colCount, coreRowIndex, coreColIndex, isCloning = false) {
        this.no = no;
        this.rowCount = rowCount;
        this.colCount = colCount;
        this.coreRowIndex = coreRowIndex;
        this.coreColIndex = coreColIndex;
        this.cells = [];
        this.actCells = [];
        this.emptyCells = [];
        this.gridLines = [];
        this.previousNoArray = [];
        this.firstRowActCellColIndexBill = '';
        this.lastRowEmptyCellColIndexBill = '';
        this.sixFaces = getEmptySixFaces();
        this.twelveEdges = getEmptyTwelveEdges();
        this.isValid = false;
        if (!isCloning) {
            for (let rowIndex = 0; rowIndex < rowCount; ++rowIndex) {
                const cellRows = [];
                const CELL_INDEX_OFFSET = colCount * rowIndex;
                for (let colIndex = 0; colIndex < colCount; ++colIndex) {
                    cellRows.push(new CellObject(rowIndex, colIndex, CELL_INDEX_OFFSET + colIndex));
                }
                this.cells.push(cellRows);
            }
        }
    }
    clone() {
        const {
            no,
            rowCount,
            colCount,
            coreRowIndex,
            coreColIndex,
            cells,
            previousNoArray
        } = this;
        const cloned = new Cube(no, rowCount, colCount, coreRowIndex, coreColIndex, true);
        cells.forEach((rows) => {
            cloned.cells.push(rows.map((cell) => cell.clone()));
        });
        previousNoArray.forEach((value) => cloned.previousNoArray.push(value));
        cloned.sixFaces = JSON.parse(JSON.stringify(this.sixFaces));
        cloned.twelveEdges = JSON.parse(JSON.stringify(this.twelveEdges));
        cloned.actCells = JSON.parse(JSON.stringify(this.actCells));
        cloned.emptyCells = JSON.parse(JSON.stringify(this.emptyCells));
        cloned.gridLines = JSON.parse(JSON.stringify(this.gridLines));
        cloned.isValid = this.isValid;
        return cloned;
    }
}
const COL_INDEX_ARRAY_MORE_THAN_THREE_ROW = [
    [
        0
    ],
    [
        1
    ],
    [
        2
    ],
    [
        3
    ],
    [
        4
    ],
    [
        0,
        1
    ],
    [
        0,
        2
    ],
    [
        0,
        3
    ],
    [
        0,
        4
    ],
    [
        0,
        1
    ],
    [
        1,
        2
    ],
    [
        1,
        3
    ],
    [
        1,
        4
    ],
    [
        0,
        2
    ],
    [
        1,
        2
    ],
    [
        2,
        3
    ],
    [
        2,
        4
    ],
    [
        0,
        3
    ],
    [
        1,
        3
    ],
    [
        2,
        3
    ],
    [
        3,
        4
    ],
    [
        0,
        4
    ],
    [
        1,
        4
    ],
    [
        2,
        4
    ],
    [
        3,
        4
    ],
    [
        2,
        3,
        4
    ],
    [
        1,
        3,
        4
    ],
    [
        1,
        2,
        4
    ],
    [
        1,
        2,
        3
    ],
    [
        2,
        3,
        4
    ],
    [
        0,
        3,
        4
    ],
    [
        0,
        2,
        4
    ],
    [
        0,
        2,
        3
    ],
    [
        1,
        3,
        4
    ],
    [
        0,
        3,
        4
    ],
    [
        0,
        1,
        4
    ],
    [
        0,
        1,
        3
    ],
    [
        1,
        2,
        4
    ],
    [
        0,
        2,
        4
    ],
    [
        0,
        1,
        4
    ],
    [
        0,
        1,
        2
    ],
    [
        1,
        2,
        3
    ],
    [
        0,
        2,
        3
    ],
    [
        0,
        1,
        3
    ],
    [
        0,
        1,
        2
    ],
    [
        1,
        2,
        3,
        4
    ],
    [
        0,
        2,
        3,
        4
    ],
    [
        0,
        1,
        3,
        4
    ],
    [
        0,
        1,
        2,
        4
    ],
    [
        0,
        1,
        2,
        3
    ],
    [
        0,
        1,
        2,
        3,
        4
    ]
];

function getSvg(options) {
    const {
        id: ID,
        setName: SET_NAME,
        setNo: SET_NO,
        cubeNo: CUBE_NO,
        sideLength: SIDE_LENGTH,
        circleRadius: CIRCLE_RADIUS,
        textOffset: TEXT_OFFSET,
        thickness: THICKNESS,
        innerLineStyle: INNER_LINE_STYLE,
        outerLineStyle: OUTER_LINE_STYLE,
        cutLineStyle: CUT_LINE_STYLE,
        textStyle: TEXT_STYLE
    } = options;
    const svg = SvgHelper.createSvg();
    svg.id = ID;
    const HALF_CIRCLE_RADIUS = CIRCLE_RADIUS * 0.5;
    const HALF_CIRCLE_RADIUS_AND_TEXT_OFFSET = TEXT_OFFSET + HALF_CIRCLE_RADIUS;
    const {
        actCells: ACT_CELLS
    } = CUBES.filter((cube) => cube.no === CUBE_NO)[0];
    const LINE_INFO_ARRAY = [];
    ACT_CELLS.forEach((cell) => {
        const {
            layerIndex: LAYER_INDEX,
            relatedInformationWhenAdding: {
                relation: RELATION
            },
            feature: FEATURE,
            sixFace: SIX_FACE,
            faceDirection: FACE_DIRECTION,
            twelveEdge: TWELVE_EDGE,
            borderLines: BORDER_LINES,
            rowIndex: ROW_INDEX,
            colIndex: COL_INDEX
        } = cell;
        BORDER_LINES.forEach((borderLine, index) => {
            const X1 = SIDE_LENGTH * COL_INDEX;
            const X2 = X1 + SIDE_LENGTH * (index % 2 ? 0 : 1);
            const Y1 = SIDE_LENGTH * ROW_INDEX;
            const Y2 = Y1 + SIDE_LENGTH * (index % 2 ? 1 : 0);
            if (borderLine !== CellBorderLine.Unknown) {
                const LINE_INFO = `${X1}_${X2}_${Y1}_${Y2}`;
                if (LINE_INFO_ARRAY.indexOf(LINE_INFO) === -1) {
                    SvgHelper.appendLine(svg, borderLine === CellBorderLine.InnerLine ? INNER_LINE_STYLE : borderLine === CellBorderLine.OuterLine ? OUTER_LINE_STYLE : CUT_LINE_STYLE, X1, X2, Y1, Y2, null);
                }
            }
        });
        let xText = 0;
        let yText = 0;
        let text = '';
        const X1 = SIDE_LENGTH * COL_INDEX;
        const X2 = X1 + SIDE_LENGTH;
        const Y1 = SIDE_LENGTH * ROW_INDEX;
        const Y2 = Y1 + SIDE_LENGTH;
        if (FEATURE === CellFeature.Face) {
            let xTextOfSetInfo = 0;
            let yTextOfSetInfo = 0;
            text = `${SIX_FACE_NAME_CHARS[SIX_FACE]}${LAYER_INDEX}`;
            switch (FACE_DIRECTION) {
                case FourDirection.Original:
                    xText = X1 + SIDE_LENGTH * 0.5;
                    yText = Y1 + SIDE_LENGTH * 0.5 + HALF_CIRCLE_RADIUS_AND_TEXT_OFFSET;
                    xTextOfSetInfo = xText;
                    yTextOfSetInfo = Y1 + SIDE_LENGTH * 0.5 - HALF_CIRCLE_RADIUS_AND_TEXT_OFFSET;
                    break;
                case FourDirection.SemiCircle:
                    xText = X1 + SIDE_LENGTH * 0.5;
                    yText = Y1 + SIDE_LENGTH * 0.5 - HALF_CIRCLE_RADIUS_AND_TEXT_OFFSET;
                    xTextOfSetInfo = xText;
                    yTextOfSetInfo = Y1 + SIDE_LENGTH * 0.5 + HALF_CIRCLE_RADIUS_AND_TEXT_OFFSET;
                    break;
                case FourDirection.Clockwise90:
                    xText = X1 + SIDE_LENGTH * 0.5 - HALF_CIRCLE_RADIUS_AND_TEXT_OFFSET;
                    yText = Y1 + SIDE_LENGTH * 0.5;
                    xTextOfSetInfo = X1 + SIDE_LENGTH * 0.5 + HALF_CIRCLE_RADIUS_AND_TEXT_OFFSET;
                    yTextOfSetInfo = yText;
                    break;
                case FourDirection.Counterclockwise90:
                    xText = X1 + SIDE_LENGTH * 0.5 + HALF_CIRCLE_RADIUS_AND_TEXT_OFFSET;
                    yText = Y1 + SIDE_LENGTH * 0.5;
                    xTextOfSetInfo = X1 + SIDE_LENGTH * 0.5 - HALF_CIRCLE_RADIUS_AND_TEXT_OFFSET;
                    yTextOfSetInfo = yText;
                    break;
                default:
                    break;
            }
            if (SIX_FACE === SixFace.Up) {
                SvgHelper.appendText(svg, TEXT_STYLE, `${SET_NAME}.${SET_NO}`, xTextOfSetInfo, yTextOfSetInfo, TextDirections[FACE_DIRECTION], '', null, false);
            }
        } else if (FEATURE === CellFeature.Piece) {
            text = `${TWELVE_EDGE_NAME_CHARS[TWELVE_EDGE]}${LAYER_INDEX}`;
            const X_ARRAY = [];
            const Y_ARRAY = [];
            switch (RELATION) {
                case ConnectionRelation.Top:
                    X_ARRAY.push(X1 + THICKNESS);
                    Y_ARRAY.push(Y2);
                    X_ARRAY.push(X1 + THICKNESS * 2);
                    Y_ARRAY.push(Y1 + THICKNESS);
                    X_ARRAY.push(X2 - THICKNESS * 2);
                    Y_ARRAY.push(Y1 + THICKNESS);
                    X_ARRAY.push(X2 - THICKNESS);
                    Y_ARRAY.push(Y2);
                    xText = X1 + SIDE_LENGTH * 0.5;
                    yText = Y1 + SIDE_LENGTH * 0.5 + HALF_CIRCLE_RADIUS_AND_TEXT_OFFSET;
                    break;
                case ConnectionRelation.Bottom:
                    X_ARRAY.push(X1 + THICKNESS);
                    Y_ARRAY.push(Y1);
                    X_ARRAY.push(X1 + THICKNESS * 2);
                    Y_ARRAY.push(Y2 - THICKNESS);
                    X_ARRAY.push(X2 - THICKNESS * 2);
                    Y_ARRAY.push(Y2 - THICKNESS);
                    X_ARRAY.push(X2 - THICKNESS);
                    Y_ARRAY.push(Y1);
                    xText = X1 + SIDE_LENGTH * 0.5;
                    yText = Y1 + SIDE_LENGTH * 0.5 - HALF_CIRCLE_RADIUS_AND_TEXT_OFFSET;
                    break;
                case ConnectionRelation.Left:
                    X_ARRAY.push(X2);
                    Y_ARRAY.push(Y1 + THICKNESS);
                    X_ARRAY.push(X1 + THICKNESS);
                    Y_ARRAY.push(Y1 + THICKNESS * 2);
                    X_ARRAY.push(X1 + THICKNESS);
                    Y_ARRAY.push(Y2 - THICKNESS * 2);
                    X_ARRAY.push(X2);
                    Y_ARRAY.push(Y2 - THICKNESS);
                    xText = X1 + SIDE_LENGTH * 0.5 - HALF_CIRCLE_RADIUS_AND_TEXT_OFFSET;
                    yText = Y1 + SIDE_LENGTH * 0.5;
                    break;
                case ConnectionRelation.Right:
                    X_ARRAY.push(X1);
                    Y_ARRAY.push(Y1 + THICKNESS);
                    X_ARRAY.push(X2 - THICKNESS);
                    Y_ARRAY.push(Y1 + THICKNESS * 2);
                    X_ARRAY.push(X2 - THICKNESS);
                    Y_ARRAY.push(Y2 - THICKNESS * 2);
                    X_ARRAY.push(X1);
                    Y_ARRAY.push(Y2 - THICKNESS);
                    xText = X1 + SIDE_LENGTH * 0.5 + HALF_CIRCLE_RADIUS_AND_TEXT_OFFSET;
                    yText = Y1 + SIDE_LENGTH * 0.5;
                    break;
                default:
                    break;
            }
            for (let lineIndex = 0; lineIndex < 3; ++lineIndex) {
                SvgHelper.appendLine(svg, CUT_LINE_STYLE, X_ARRAY[lineIndex], X_ARRAY[lineIndex + 1], Y_ARRAY[lineIndex], Y_ARRAY[lineIndex + 1], null);
            }
        }
        SvgHelper.appendText(svg, TEXT_STYLE, text, xText, yText, TextDirections[FACE_DIRECTION], '', null, false);
    });
    return svg;
}
showUsedTime('beforeCreateCubes()');
const MIDDLE_CUBE_ARRAY = [];
(function () {
    console.log(new Date());
    let debugNo = 0;
    const MIDDLE_CUBE_COUNT_ARRAY = [
        0,
        0,
        0,
        0,
        0,
        0
    ];
    ROW_COUNT_ARRAY.forEach((ROW_COUNT) => {
        COL_INDEX_ARRAY_MORE_THAN_THREE_ROW.forEach((coreRowIndexArray) => {
            const CORE_ROW_INDEX = ROW_COUNT <= 4 ? 1 : 2;
            const CORE_COL_INDEX = coreRowIndexArray.indexOf(2) > -1 ? 2 : coreRowIndexArray[0];
            const HAS_THIRD_ROW = ROW_COUNT > 2;
            const MAX_ROW_INDEX = ROW_COUNT - 1;
            const MAX_COL_INDEX = 5 - 1;
            const cube = new Cube(0, ROW_COUNT, 5, CORE_ROW_INDEX, CORE_COL_INDEX);
            recuriseAddCube(cube, HAS_THIRD_ROW, MAX_ROW_INDEX, MAX_COL_INDEX, ROW_COUNT, 5, CORE_ROW_INDEX, CORE_COL_INDEX, coreRowIndexArray, -1, -1, 1, [{
                rowIndex: CORE_ROW_INDEX,
                colIndex: CORE_COL_INDEX,
                relation: ConnectionRelation.Top
            }]);
        });
    });
    console.log('MIDDLE_CUBE_COUNT_ARRAY:', JSON.stringify(MIDDLE_CUBE_COUNT_ARRAY));

    function recuriseAddCube(cube, HAS_THIRD_ROW, MAX_ROW_INDEX, MAX_COL_INDEX, ROW_COUNT, COL_COUNT, CORE_ROW_INDEX, CORE_COL_INDEX, coreRowIndexArray, relationRowIndex, relationColIndex, ADD_ORDER, STACK) {
        if ((++debugNo) % 100000 === 0) {
            console.log(debugNo, new Date());
        }
        let failed = false;
        while (STACK.length) {
            const {
                rowIndex,
                colIndex,
                relation
            } = STACK.pop();
            if (coreRowIndexArray.indexOf(colIndex) === -1) {
                failed = true;
                break;
            }
            const featureByRelation = CellFeature.Face;
            let sixFaceByRelation = SixFace.Up;
            let faceDirectionByRelation = FourDirection.Original;
            let twelveEdge = TwelveEdge.NotSure;
            if (relationRowIndex > -1) {
                const CURRENT_CELL = cube.cells[rowIndex][colIndex];
                const RELATION_CELL = cube.cells[relationRowIndex][relationColIndex];
                const RELATION_CELL_TWENTY_FOUR_ANGLE = convertSixFaceAndDirectionToSixFaceTwentyFourAngle(RELATION_CELL.sixFace, RELATION_CELL.faceDirection);
                const [sixFace, faceDirection] = convertSixFaceTwentyFourAngleToSixFaceAndDirection(SIX_FACE_AND_DIRECTION_RELATIONS[RELATION_CELL_TWENTY_FOUR_ANGLE][relation]);
                if (!CURRENT_CELL.isUnknown) {
                    if (CURRENT_CELL.sixFace !== sixFace || CURRENT_CELL.faceDirection !== faceDirection) {
                        if (DEBUG.SHOW_FAILED_RELATION_CELL_INFO) {
                            console.warn('failed', sixFace, faceDirection, JSON.stringify({
                                rowIndex,
                                colIndex,
                                relationRowIndex,
                                relationColIndex,
                                relation
                            }));
                        }
                        failed = true;
                        break;
                    }
                    continue;
                } else {
                    sixFaceByRelation = sixFace;
                    faceDirectionByRelation = faceDirection;
                    twelveEdge = getSixFaceTwentyFourAngleRelationTwelveEdge(RELATION_CELL_TWENTY_FOUR_ANGLE, relation);
                    CURRENT_CELL.addOrder = ADD_ORDER;
                    CURRENT_CELL.relatedInformationWhenAdding = {
                        rowIndex: relationRowIndex,
                        colIndex: relationColIndex,
                        relation
                    };
                }
            }
            let topGridLine = CellBorderLine.Unknown;
            let rightGridLine = CellBorderLine.Unknown;
            let bottomGridLine = CellBorderLine.Unknown;
            let leftGridLine = CellBorderLine.Unknown;
            if (rowIndex === 0) {
                topGridLine = CellBorderLine.OuterLine;
            } else if (rowIndex === MAX_ROW_INDEX) {
                bottomGridLine = CellBorderLine.OuterLine;
            }
            if (colIndex === 0) {
                leftGridLine = CellBorderLine.OuterLine;
            } else if (colIndex === MAX_COL_INDEX) {
                rightGridLine = CellBorderLine.OuterLine;
            }
            if (topGridLine !== CellBorderLine.OuterLine) {
                const UP_CELL = cube.cells[rowIndex - 1][colIndex];
                topGridLine = UP_CELL.isEmpty ? CellBorderLine.Unknown : UP_CELL.borderLines[CellBorderPosition.Bottom];
            }
            if (bottomGridLine !== CellBorderLine.OuterLine) {
                const DOWN_CELL = cube.cells[rowIndex + 1][colIndex];
                bottomGridLine = DOWN_CELL.isEmpty ? CellBorderLine.Unknown : DOWN_CELL.borderLines[CellBorderPosition.Top];
            }
            if (rightGridLine !== CellBorderLine.OuterLine) {
                const RIGHT_CELL = cube.cells[rowIndex][colIndex + 1];
                rightGridLine = RIGHT_CELL.isEmpty ? CellBorderLine.Unknown : RIGHT_CELL.borderLines[CellBorderPosition.Left];
            }
            if (leftGridLine !== CellBorderLine.OuterLine) {
                const LEFT_CELL = cube.cells[rowIndex][colIndex - 1];
                leftGridLine = LEFT_CELL.isEmpty ? CellBorderLine.Unknown : LEFT_CELL.borderLines[CellBorderPosition.Right];
            }
            const topBorderLineArray = [];
            const rightBorderLineArray = [];
            const bottomBorderLineArray = [];
            const leftBorderLineArray = [];
            const borderLineArrayArray = [
                topBorderLineArray,
                rightBorderLineArray,
                bottomBorderLineArray,
                leftBorderLineArray
            ];
            [
                topGridLine,
                rightGridLine,
                bottomGridLine,
                leftGridLine
            ].forEach((gridLineStyle, gridLineIndex) => {
                switch (gridLineStyle) {
                    case CellBorderLine.Unknown:
                        borderLineArrayArray[gridLineIndex].push(CellBorderLine.CutLine);
                        borderLineArrayArray[gridLineIndex].push(CellBorderLine.InnerLine);
                        break;
                    case CellBorderLine.InnerLine:
                    case CellBorderLine.CutLine:
                    case CellBorderLine.OuterLine:
                        borderLineArrayArray[gridLineIndex].push(gridLineStyle);
                        break;
                    default:
                        break;
                }
            });
            topBorderLineArray.forEach((TOP_BORDER_LINE) => {
                rightBorderLineArray.forEach((RIGHT_BORDER_LINE) => {
                    bottomBorderLineArray.forEach((BOTTOM_BORDER_LINE) => {
                        leftBorderLineArray.forEach((LEFT_BORDER_LINE) => {
                            const CUBE_CLONED = cube.clone();
                            const CELL = CUBE_CLONED.cells[rowIndex][colIndex];
                            CELL.feature = CellFeature.Face;
                            CELL.borderLines.length = 0;
                            CELL.borderLines.push(TOP_BORDER_LINE);
                            CELL.borderLines.push(RIGHT_BORDER_LINE);
                            CELL.borderLines.push(BOTTOM_BORDER_LINE);
                            CELL.borderLines.push(LEFT_BORDER_LINE);
                            CELL.twelveEdge = twelveEdge;
                            CELL.feature = featureByRelation;
                            CELL.sixFace = sixFaceByRelation;
                            CELL.faceDirection = faceDirectionByRelation;
                            const NEW_STACK = [];
                            if (TOP_BORDER_LINE === CellBorderLine.InnerLine) {
                                NEW_STACK.push({
                                    rowIndex: rowIndex - 1,
                                    colIndex,
                                    relation: ConnectionRelation.Top
                                });
                            }
                            if (BOTTOM_BORDER_LINE === CellBorderLine.InnerLine) {
                                NEW_STACK.push({
                                    rowIndex: rowIndex + 1,
                                    colIndex,
                                    relation: ConnectionRelation.Bottom
                                });
                            }
                            if (LEFT_BORDER_LINE === CellBorderLine.InnerLine) {
                                NEW_STACK.push({
                                    rowIndex,
                                    colIndex: colIndex - 1,
                                    relation: ConnectionRelation.Left
                                });
                            }
                            if (RIGHT_BORDER_LINE === CellBorderLine.InnerLine) {
                                NEW_STACK.push({
                                    rowIndex,
                                    colIndex: colIndex + 1,
                                    relation: ConnectionRelation.Right
                                });
                            }
                            if (!NEW_STACK.length) {
                                return;
                            }
                            recuriseAddCube(CUBE_CLONED, HAS_THIRD_ROW, MAX_ROW_INDEX, MAX_COL_INDEX, ROW_COUNT, COL_COUNT, CORE_ROW_INDEX, CORE_COL_INDEX, coreRowIndexArray, rowIndex, colIndex, ADD_ORDER + 1, NEW_STACK);
                            NEW_STACK.length = 0;
                        });
                    });
                });
            });
        }
        if (failed) {
            return;
        }
        cube.count();
        if (cube.isValid) {
            fixCubeLines(cube);
            ++MIDDLE_CUBE_COUNT_ARRAY[ROW_COUNT - 2];
        }
    }

    function fixCubeLines(cube) {
        cube.actCells.forEach((cell) => {
            const {
                rowIndex,
                colIndex,
                borderLines
            } = cell;
            borderLines.forEach((borderLine, borderPosition) => {
                if (borderLine === CellBorderLine.CutLine) {
                    switch (borderPosition) {
                        case CellBorderPosition.Top:
                            if (!cube.actCells.filter((cell) => cell.rowIndex < rowIndex && cell.cellIndex === colIndex).length) {
                                borderLines[borderPosition] = CellBorderLine.OuterLine;
                            }
                            break;
                        case CellBorderPosition.Bottom:
                            if (!cube.actCells.filter((cell) => cell.rowIndex > rowIndex && cell.cellIndex === colIndex).length) {
                                borderLines[borderPosition] = CellBorderLine.OuterLine;
                            }
                            break;
                        case CellBorderPosition.Left:
                            if (!cube.actCells.filter((cell) => cell.rowIndex === rowIndex && cell.cellIndex < colIndex).length) {
                                borderLines[borderPosition] = CellBorderLine.OuterLine;
                            }
                            break;
                        case CellBorderPosition.Right:
                            if (!cube.actCells.filter((cell) => cell.rowIndex === rowIndex && cell.cellIndex > colIndex).length) {
                                borderLines[borderPosition] = CellBorderLine.OuterLine;
                            }
                            break;
                        default:
                            break;
                    }
                }
            });
        });
        cube.updateGridLines();
    }
})();
showUsedTime('afterCreateCubes()');

function doStep2() {
    showUsedTime('beginDoStep2()');
    const MIDDLE_CUBE_COUNT = MIDDLE_CUBE_ARRAY.length;
    console.log('MIDDLE_CUBE_ARRAY.length:', MIDDLE_CUBE_COUNT, '\n', 'CUBES.length:', CUBES.length);
    let nextCubeNo = ROW_COUNT_ARRAY[0] === 2 ? 0 : 20352;
    for (let index = 0; index < 150; ++index) {
        batchAppendCube(MIDDLE_CUBE_ARRAY[index]);
    }
    showUsedTime('endDoStep2()');
    return true;

    function batchAppendCube(cubeOriginal) {
        const upFaceOptionalMannerArray = [];
        const downFaceOptionalMannerArray = [];
        const leftFaceOptionalMannerArray = [];
        const rightFaceOptionalMannerArray = [];
        const frontFaceOptionalMannerArray = [];
        const backFaceOptionalMannerArray = [];
        const faceOptionalMannerArrayArray = [
            upFaceOptionalMannerArray,
            downFaceOptionalMannerArray,
            leftFaceOptionalMannerArray,
            rightFaceOptionalMannerArray,
            frontFaceOptionalMannerArray,
            backFaceOptionalMannerArray
        ];
        const upFaceOptionalPieceArray = [];
        const downFaceOptionalPieceArray = [];
        const leftFaceOptionalPieceArray = [];
        const rightFaceOptionalPieceArray = [];
        const frontFaceOptionalPieceArray = [];
        const backFaceOptionalPieceArray = [];
        const faceOptionalPieceArrayArray = [
            upFaceOptionalPieceArray,
            downFaceOptionalPieceArray,
            leftFaceOptionalPieceArray,
            rightFaceOptionalPieceArray,
            frontFaceOptionalPieceArray,
            backFaceOptionalPieceArray
        ];
        faceOptionalPieceArrayArray.forEach((array) => {
            for (let i = 0; i < 4; ++i) {
                array.push([]);
            }
        });
        const twentyFourAngelFaceOrPieceArray = [];
        for (let index = 0; index < 24; ++index) {
            twentyFourAngelFaceOrPieceArray.push({
                faces: [],
                pieces: []
            });
        }
        cubeOriginal.actCells.forEach((cell) => {
            const {
                rowIndex,
                colIndex,
                borderLines,
                sixFace,
                faceDirection
            } = cell;
            const TWENTY_FOUR_ANGLE = convertSixFaceAndDirectionToSixFaceTwentyFourAngle(sixFace, faceDirection);
            const ITEM = twentyFourAngelFaceOrPieceArray[TWENTY_FOUR_ANGLE];
            const cellRowColIndex = [
                rowIndex,
                colIndex
            ];
            switch (borderLines.filter((borderLine) => borderLine === CellBorderLine.InnerLine).length) {
                case 2:
                case 3:
                case 4:
                    ITEM.faces.push(cellRowColIndex);
                    faceOptionalMannerArrayArray[sixFace].push(cellRowColIndex);
                    break;
                case 1:
                    ITEM.pieces.push(cellRowColIndex);
                    faceOptionalPieceArrayArray[sixFace][faceDirection].push(cellRowColIndex);
                    break;
                default:
                    break;
            }
        });
        faceOptionalMannerArrayArray.forEach((mannerArray, sixFace) => {
            const [topFaceOptionalPieceArray, rightFaceOptionalPieceArray, bottomFaceOptionalPieceArray, leftFaceOptionalPieceArray] = faceOptionalPieceArrayArray[sixFace];
            const array = [];
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
                const FIRST_ARRAY = array.splice(0, 1)[0];
                FIRST_ARRAY.forEach((firstCellRowColIndex) => {
                    const [firstRowIndex, firstColIndex] = firstCellRowColIndex;
                    array.forEach((subArray) => {
                        subArray.forEach((secondCellRowColIndex) => {
                            const [secondRowIndex, secondColIndex] = secondCellRowColIndex;
                            mannerArray.push([
                                firstRowIndex,
                                firstColIndex,
                                secondRowIndex,
                                secondColIndex
                            ]);
                            mannerArray.push([
                                secondRowIndex,
                                secondColIndex,
                                firstRowIndex,
                                firstColIndex
                            ]);
                        });
                    });
                });
            }
        });
        upFaceOptionalMannerArray.forEach((upItem, upIndex) => {
            downFaceOptionalMannerArray.forEach((downItem, downIndex) => {
                leftFaceOptionalMannerArray.forEach((leftItem, leftIndex) => {
                    rightFaceOptionalMannerArray.forEach((rightItem, rightIndex) => {
                        frontFaceOptionalMannerArray.forEach((frontItem, frontIndex) => {
                            backFaceOptionalMannerArray.forEach((backItem, backIndex) => {
                                const cloned = cubeOriginal.clone();
                                [
                                    [
                                        upFaceOptionalMannerArray,
                                        upItem,
                                        upIndex
                                    ],
                                    [
                                        downFaceOptionalMannerArray,
                                        downItem,
                                        downIndex
                                    ],
                                    [
                                        leftFaceOptionalMannerArray,
                                        leftItem,
                                        leftIndex
                                    ],
                                    [
                                        rightFaceOptionalMannerArray,
                                        rightItem,
                                        rightIndex
                                    ],
                                    [
                                        frontFaceOptionalMannerArray,
                                        frontItem,
                                        frontIndex
                                    ],
                                    [
                                        backFaceOptionalMannerArray,
                                        backItem,
                                        backIndex
                                    ]
                                ].forEach((turpleArray) => {
                                    const [array, item, index] = turpleArray;
                                    const USED_ROW_COL_INDEX = [];
                                    let layerIndex = 0;
                                    array.slice(index, 1).forEach((otherItem) => {
                                        const [firstRowIndex, firstColIndex, secondRowIndex, secondColIndex] = otherItem;
                                        const IS_FACE = typeof secondRowIndex === 'undefined' || typeof secondColIndex === 'undefined';
                                        const FIRST_ROW_COL_INDEX = `${firstRowIndex}_${firstColIndex}`;
                                        if (USED_ROW_COL_INDEX.indexOf(FIRST_ROW_COL_INDEX) === -1) {
                                            USED_ROW_COL_INDEX.push(FIRST_ROW_COL_INDEX);
                                            cloned.cells[firstRowIndex][firstColIndex].layerIndex = ++layerIndex;
                                        }
                                        if (!IS_FACE) {
                                            const SECOND_ROW_COL_INDEX = `${secondRowIndex}_${secondColIndex}`;
                                            if (USED_ROW_COL_INDEX.indexOf(SECOND_ROW_COL_INDEX) === -1) {
                                                USED_ROW_COL_INDEX.push(SECOND_ROW_COL_INDEX);
                                                cloned.cells[secondRowIndex][secondColIndex].layerIndex = ++layerIndex;
                                            }
                                        }
                                    });
                                    const [firstRowIndex, firstColIndex, secondRowIndex, secondColIndex] = item;
                                    const IS_FACE = typeof secondRowIndex === 'undefined' || typeof secondColIndex === 'undefined';
                                    const FIRST_ROW_COL_INDEX = `${firstRowIndex}_${firstColIndex}`;
                                    if (USED_ROW_COL_INDEX.indexOf(FIRST_ROW_COL_INDEX) === -1) {
                                        USED_ROW_COL_INDEX.push(FIRST_ROW_COL_INDEX);
                                        cloned.cells[firstRowIndex][firstColIndex].layerIndex = ++layerIndex;
                                    }
                                    if (!IS_FACE) {
                                        const SECOND_ROW_COL_INDEX = `${secondRowIndex}_${secondColIndex}`;
                                        if (USED_ROW_COL_INDEX.indexOf(SECOND_ROW_COL_INDEX) === -1) {
                                            USED_ROW_COL_INDEX.push(SECOND_ROW_COL_INDEX);
                                            cloned.cells[secondRowIndex][secondColIndex].layerIndex = ++layerIndex;
                                        }
                                    }
                                });
                                batchAppendCubeOneToTwentyFour(cloned);
                            });
                        });
                    });
                });
            });
        });
    }

    function batchAppendCubeOneToTwentyFour(cube) {
        const {
            sixFaces,
            twelveEdges
        } = cube;
        for (let mannerIndex = 0; mannerIndex < 24; ++mannerIndex) {
            const cloned = cube.clone();
            cloned.no = ++nextCubeNo;
            const upFaceSixFaceTwentyFourAngle = mannerIndex;
            const backFaceSixFaceTwentyFourAngle = SIX_FACE_AND_DIRECTION_RELATIONS[mannerIndex][0];
            const rightFaceSixFaceTwentyFourAngle = SIX_FACE_AND_DIRECTION_RELATIONS[mannerIndex][1];
            const frontFaceSixFaceTwentyFourAngle = SIX_FACE_AND_DIRECTION_RELATIONS[mannerIndex][2];
            const leftFaceSixFaceTwentyFourAngle = SIX_FACE_AND_DIRECTION_RELATIONS[mannerIndex][3];
            const downFaceSixFaceTwentyFourAngle = SIX_FACE_AND_DIRECTION_RELATIONS[frontFaceSixFaceTwentyFourAngle][0];
            const [upFaceSixFace, upFaceFourDirection] = convertSixFaceTwentyFourAngleToSixFaceAndDirection(upFaceSixFaceTwentyFourAngle);
            const [backFaceSixFace, backFaceFourDirection] = convertSixFaceTwentyFourAngleToSixFaceAndDirection(backFaceSixFaceTwentyFourAngle);
            const [rightFaceSixFace, rightFaceFourDirection] = convertSixFaceTwentyFourAngleToSixFaceAndDirection(rightFaceSixFaceTwentyFourAngle);
            const [frontFaceSixFace, frontFaceFourDirection] = convertSixFaceTwentyFourAngleToSixFaceAndDirection(frontFaceSixFaceTwentyFourAngle);
            const [leftFaceSixFace, leftFaceFourDirection] = convertSixFaceTwentyFourAngleToSixFaceAndDirection(leftFaceSixFaceTwentyFourAngle);
            const [downFaceSixFace, downFaceFourDirection] = convertSixFaceTwentyFourAngleToSixFaceAndDirection(downFaceSixFaceTwentyFourAngle);
            cloned.sixFaces = JSON.parse(JSON.stringify([
                sixFaces[upFaceSixFace],
                sixFaces[downFaceSixFace],
                sixFaces[leftFaceSixFace],
                sixFaces[rightFaceSixFace],
                sixFaces[frontFaceSixFace],
                sixFaces[backFaceSixFace]
            ]));
            const TWELVE_EDGES_INDEX_ARRAY = [];
            TWELVE_EDGES_INDEX_ARRAY.push(getSixFaceTwentyFourAngleRelationTwelveEdge(upFaceSixFaceTwentyFourAngle, 0));
            TWELVE_EDGES_INDEX_ARRAY.push(getSixFaceTwentyFourAngleRelationTwelveEdge(upFaceSixFaceTwentyFourAngle, 1));
            TWELVE_EDGES_INDEX_ARRAY.push(getSixFaceTwentyFourAngleRelationTwelveEdge(upFaceSixFaceTwentyFourAngle, 2));
            TWELVE_EDGES_INDEX_ARRAY.push(getSixFaceTwentyFourAngleRelationTwelveEdge(upFaceSixFaceTwentyFourAngle, 3));
            TWELVE_EDGES_INDEX_ARRAY.push(getSixFaceTwentyFourAngleRelationTwelveEdge(backFaceSixFaceTwentyFourAngle, 3));
            TWELVE_EDGES_INDEX_ARRAY.push(getSixFaceTwentyFourAngleRelationTwelveEdge(backFaceSixFaceTwentyFourAngle, 1));
            TWELVE_EDGES_INDEX_ARRAY.push(getSixFaceTwentyFourAngleRelationTwelveEdge(frontFaceSixFaceTwentyFourAngle, 1));
            TWELVE_EDGES_INDEX_ARRAY.push(getSixFaceTwentyFourAngleRelationTwelveEdge(frontFaceSixFaceTwentyFourAngle, 3));
            TWELVE_EDGES_INDEX_ARRAY.push(getSixFaceTwentyFourAngleRelationTwelveEdge(downFaceSixFaceTwentyFourAngle, 0));
            TWELVE_EDGES_INDEX_ARRAY.push(getSixFaceTwentyFourAngleRelationTwelveEdge(downFaceSixFaceTwentyFourAngle, 1));
            TWELVE_EDGES_INDEX_ARRAY.push(getSixFaceTwentyFourAngleRelationTwelveEdge(downFaceSixFaceTwentyFourAngle, 2));
            TWELVE_EDGES_INDEX_ARRAY.push(getSixFaceTwentyFourAngleRelationTwelveEdge(downFaceSixFaceTwentyFourAngle, 3));
            cloned.twelveEdges = JSON.parse(JSON.stringify(TWELVE_EDGES_INDEX_ARRAY.map((index) => twelveEdges[index])));
            const {
                cells
            } = cloned;
            cells.forEach((cellRows) => {
                cellRows.forEach((cell) => {
                    cell.feature = CellFeature.None;
                    cell.layerIndex = 0;
                });
            });
            const CUBE_SIX_FACE_AND_DIRECTION_RELATION_ARRAY = [
                [
                    upFaceSixFace,
                    upFaceFourDirection
                ],
                [
                    backFaceSixFace,
                    backFaceFourDirection
                ],
                [
                    rightFaceSixFace,
                    rightFaceFourDirection
                ],
                [
                    frontFaceSixFace,
                    frontFaceFourDirection
                ],
                [
                    leftFaceSixFace,
                    leftFaceFourDirection
                ],
                [
                    downFaceSixFace,
                    downFaceFourDirection
                ]
            ];
            cloned.sixFaces.forEach((face, faceIndex) => {
                const [sixFace, faceDirection] = CUBE_SIX_FACE_AND_DIRECTION_RELATION_ARRAY[faceIndex];
                let layerIndex = 0;
                face.forEach((faceMemberOfSixFace) => {
                    ++layerIndex;
                    const [firstRowIndex, firstColIndex, secondRowIndex, secondColIndex] = faceMemberOfSixFace;
                    const firstCell = cells[firstRowIndex][firstColIndex];
                    firstCell.feature = CellFeature.Face;
                    firstCell.layerIndex = layerIndex;
                    firstCell.sixFace = sixFace;
                    firstCell.faceDirection = faceDirection;
                    firstCell.twelveEdge = TwelveEdge.NotSure;
                    if (faceMemberOfSixFace.length === 4) {
                        ++layerIndex;
                        const secondCell = cells[secondRowIndex][secondColIndex];
                        secondCell.feature = CellFeature.Face;
                        secondCell.layerIndex = layerIndex;
                        secondCell.sixFace = sixFace;
                        secondCell.faceDirection = faceDirection;
                        secondCell.twelveEdge = TwelveEdge.NotSure;
                    }
                });
            });
            cloned.twelveEdges.forEach((oneEdge, edgeIndex) => {
                oneEdge.pieces.forEach((cellRowColIndex) => {
                    const [rowIndex, colIndex] = cellRowColIndex;
                    const pieceCell = cells[rowIndex][colIndex];
                    pieceCell.feature = CellFeature.Piece;
                    pieceCell.twelveEdge = edgeIndex;
                    pieceCell.sixFace = SixFace.Up;
                    pieceCell.faceDirection = FourDirection.Original;
                    const {
                        rowIndex: relatedRowIndex,
                        colIndex: relatedColIndex
                    } = pieceCell.relatedInformationWhenAdding;
                    if (relatedRowIndex === -1) {
                        pieceCell.borderLines.forEach((borderLine, borderLineIndex) => {
                            if (borderLine === CellBorderLine.InnerLine) {
                                switch (borderLineIndex) {
                                    case ConnectionRelation.Top:
                                        pieceCell.layerIndex = cells[rowIndex - 1][colIndex].layerIndex + 1;
                                        break;
                                    case ConnectionRelation.Bottom:
                                        pieceCell.layerIndex = cells[rowIndex + 1][colIndex].layerIndex + 1;
                                        break;
                                    case ConnectionRelation.Left:
                                        pieceCell.layerIndex = cells[rowIndex][colIndex - 1].layerIndex + 1;
                                        break;
                                    case ConnectionRelation.Right:
                                        pieceCell.layerIndex = cells[rowIndex][colIndex + 1].layerIndex + 1;
                                        break;
                                    default:
                                        break;
                                }
                            }
                        });
                    } else {
                        pieceCell.layerIndex = cells[relatedRowIndex][relatedColIndex].layerIndex + 1;
                    }
                });
            });
            CUBES.push(cloned);
        }
    }
}

function showCubes() {
    showUsedTime('beginShowCubes()');
    console.log(JSON.stringify(CUBES));
    console.log('CUBES:\n', '\n', `Cube Count: ${CUBES.length}`, CUBES.length / 24);
    console.log('Two rows count:', CUBES.filter((cube) => cube.rowCount === 2).length, CUBES.filter((cube) => cube.rowCount === 2).length / 24);
    console.log('Three rows count:', CUBES.filter((cube) => cube.rowCount === 3).length, CUBES.filter((cube) => cube.rowCount === 3).length / 24);
    console.log('Five rows count:', CUBES.filter((cube) => cube.rowCount === 5).length, CUBES.filter((cube) => cube.rowCount === 5).length / 24);
    showUsedTime('endShowCubes()');
}
showCubes();

function fixPreviousNoArray() {
    if (DEBUG.FIX_PREVIOUS_NO_ARRAY) {
        showUsedTime('beforePreviousNoArray()');
        (function () {
            const CUBE_WITH_FIRST_ANGLE_ARRAY = CUBES.filter((cube) => cube.no % 24 === 1);
            CUBE_WITH_FIRST_ANGLE_ARRAY.forEach((cube, cubeIndex) => {
                const FIRST_ROW_ACT_CELL_COL_INDEX_BILL = cube.firstRowActCellColIndexBill;
                const FIRST_CUBE_NO = cube.no;
                CUBE_WITH_FIRST_ANGLE_ARRAY.forEach((cubeMaybePrevious) => {
                    if (FIRST_ROW_ACT_CELL_COL_INDEX_BILL === cubeMaybePrevious.lastRowEmptyCellColIndexBill) {
                        const NO = cubeMaybePrevious.no;
                        for (let cubeIndexOffset = 0; cubeIndexOffset < 24; ++cubeIndexOffset) {
                            const CUBE = CUBES[FIRST_CUBE_NO + cubeIndexOffset - 1];
                            CUBE.previousNoArray.length = 0;
                            for (let noIndex = 0; noIndex < 24; ++noIndex) {
                                CUBE.previousNoArray.push(NO + noIndex);
                            }
                        }
                    }
                });
            });
        })();
        showUsedTime('afterPreviousNoArray()');
        console.log(JSON.stringify(CUBES));
    }
    return true;
}
fixPreviousNoArray();
showUsedTime('end');
console.log(new Date());
console.log(`Total used ${(performance.now() - DATE_BEGIN).toFixed(2)} milliseconds.`);