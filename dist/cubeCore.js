// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const {
    floor
} = Math;
const SETTINGS = {
    mustContainEveryColumn: true
};
const DEBUG = {
    SHOW_SIX_FACE_AND_DIRECTION_RELATIONS: false
};

function log(...dataArray) {
    console.log(...dataArray);
    const LOG_STRING = JSON.stringify(dataArray);
    Deno.writeTextFileSync('./log.txt', LOG_STRING.substring(1, LOG_STRING.length - 1).concat('\n'), {
        append: true
    });
}
let dateBegin = performance.now();

function showUsedTime(functionName) {
    const end = performance.now();
    const duration = end - dateBegin;
    log(`${functionName}, used ${duration.toFixed(2)} milliseconds.`);
    dateBegin = end;
}
const ANGLE_COUNT = 24;
const SIX_FACE_SHORT_NAMES = 'UDLRFB'.split('');
// const SIX_FACE_NAME_CHARS = '❶❷❸❹❺❻'.split('');
const SIX_FACE_NAME_CHARS = '⒈⒉⒊⒋⒌⒍'.split('');
const FACE_NAME_ARRAY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const TWELVE_EDGE_NAME_CHARS = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫'.split('');
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
    log('SIX_FACE_AND_DIRECTION_RELATIONS:', SIX_FACE_AND_DIRECTION_RELATIONS);
    SIX_FACE_AND_DIRECTION_RELATIONS.forEach((item, index) => {
        log(convertSixFaceTwentyFourAngleToString(index), item.map((to) => `${convertSixFaceTwentyFourAngleToString(to)}`));
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
            cells
        } = this;
        const cloned = new Cube(no, rowCount, colCount, coreRowIndex, coreColIndex, true);
        cells.forEach((rows) => {
            cloned.cells.push(rows.map((cell) => cell.clone()));
        });
        cloned.sixFaces = JSON.parse(JSON.stringify(this.sixFaces));
        cloned.twelveEdges = JSON.parse(JSON.stringify(this.twelveEdges));
        cloned.actCells = JSON.parse(JSON.stringify(this.actCells));
        cloned.emptyCells = JSON.parse(JSON.stringify(this.emptyCells));
        cloned.gridLines = JSON.parse(JSON.stringify(this.gridLines));
        cloned.isValid = this.isValid;
        return cloned;
    }
}
const COL_INDEX_ARRAY_LESS_THAN_OR_EQUALS_THREE_ROW = [
    [
        0,
        1,
        2,
        3,
        4
    ]
];
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