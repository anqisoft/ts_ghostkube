export declare const FACE_NAME_ARRAY: string[];
export declare const TEXT_RIGHT_ALIGNMENT = " text-anchor=\"start\"";
export declare const TEXT_LEFT_ALIGNMENT = " text-anchor=\"end\"";
export declare class GhostkubeGlobal {
    static sideLength: number;
    static setSideLength(sideLength: number): void;
    static getSideLength(): number;
    static circleRadius: number;
    static setCircleRadius(circleRadius: number): void;
    static getCircleRadius(): number;
}
export interface Model {
    no: number;
    rows: number;
    cols: number;
    empties: number[];
    previous: number[];
    nexts: number[];
    lines: [number, number, number, number][];
    trimLeftCells: number[];
    trimRightCells: number[];
    trimTopCells: number[];
    trimBottomCells: number[];
}
export type TextDirection = 0 | 90 | 180 | 270;
export interface CubeMannerFace {
    textDirection: TextDirection;
    modelCell: ModelCell;
}
export interface CubeManner {
    explain: string;
    hiddenModelCells: ModelCell[];
    sixFaces: {
        top: CubeMannerFace;
        bottom: CubeMannerFace;
        left: CubeMannerFace;
        right: CubeMannerFace;
        front: CubeMannerFace;
        back: CubeMannerFace;
    };
    twelveEdgesCanBeInserted: {
        topTop: boolean;
        topRight: boolean;
        topBottom: boolean;
        topLeft: boolean;
        frontLeft: boolean;
        backLeft: boolean;
        backRight: boolean;
        frontRight: boolean;
        bottomTop: boolean;
        bottomRight: boolean;
        bottomBottom: boolean;
        bottomLeft: boolean;
    };
    twelveSidedInsertablePapers: {
        topTop: ModelCell[];
        topRight: ModelCell[];
        topBottom: ModelCell[];
        topLeft: ModelCell[];
        frontLeft: ModelCell[];
        backLeft: ModelCell[];
        backRight: ModelCell[];
        frontRight: ModelCell[];
        bottomTop: ModelCell[];
        bottomRight: ModelCell[];
        bottomBottom: ModelCell[];
        bottomLeft: ModelCell[];
    };
}
export type CubeMannerSets = CubeManner[];
export interface Cube {
    modelNo: number;
    manners: CubeMannerSets[];
}
export interface ModelCell {
    rowIndex: number;
    colIndex: number;
    isEmpty: boolean;
    cellIndex: number;
    actCellIndex: number;
    faceName: string;
    trimType: 'no' | 'left' | 'right' | 'top' | 'bottom';
}
export declare const Models: Model[];
