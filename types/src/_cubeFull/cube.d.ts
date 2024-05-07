export declare const SIX_FACE_NAME_CHARS: string[];
export declare const TWELVE_EDGE_NAME_CHARS: string[];
export declare const SIX_FACE_SHORT_NAMES: string[];
export declare const CUBES: Cube[];
export interface BooleanRepeatFunction {
  repeat: (times: number) => boolean[];
}
export interface NumberRepeatFunction {
  repeat: (times: number) => number[];
}
export interface ArrayRepeatFunction {
  repeat: (times: number) => Array[];
}
interface Array extends ArrayRepeatFunction {
}
export declare const FACE_NAME_ARRAY: string[];
export declare enum FourDirection {
  Original = 0,
  Clockwise90 = 1,
  SemiCircle = 2,
  Counterclockwise90 = 3,
}
export declare const TextDirections: number[];
export declare enum GridLineStyle {
  Unknown = 0,
  None = 1,
  InnerLine = 2,
  CutLine = 3,
  OuterLine = 4,
}
export declare enum CellBorderLine {
  Unknown = 0,
  InnerLine = 2,
  CutLine = 3,
  OuterLine = 4,
}
export declare enum CellBorderPosition {
  Top = 0,
  Right = 1,
  Bottom = 2,
  Left = 3,
}
export declare enum CellFeature {
  Unknown = 0,
  None = 1,
  Face = 2,
  Piece = 3,
}
export declare enum SixFace {
  Up = 0,
  Down = 1,
  Left = 2,
  Right = 3,
  Front = 4,
  Back = 5,
}
export declare enum SixFaceTwentyFourAngle {
  UpOriginal = 0,
  UpClockwise90 = 1,
  UpSemiCircle = 2,
  UpCounterclockwise90 = 3,
  DownOriginal = 4,
  DownClockwise90 = 5,
  DownSemiCircle = 6,
  DownCounterclockwise90 = 7,
  LeftOriginal = 8,
  LeftClockwise90 = 9,
  LeftSemiCircle = 10,
  LeftCounterclockwise90 = 11,
  RightOriginal = 12,
  RightClockwise90 = 13,
  RightSemiCircle = 14,
  RightCounterclockwise90 = 15,
  FrontOriginal = 16,
  FrontClockwise90 = 17,
  FrontSemiCircle = 18,
  FrontCounterclockwise90 = 19,
  BackOriginal = 20,
  BackClockwise90 = 21,
  BackSemiCircle = 22,
  BackCounterclockwise90 = 23,
}
export declare function convertSixFaceTwentyFourAngleToSixFaceAndDirection(
  value: SixFaceTwentyFourAngle,
): [number, number];
export declare function convertSixFaceTwentyFourAngleToString(
  value: SixFaceTwentyFourAngle,
): string;
export declare function convertSixFaceAndDirectionToSixFaceTwentyFourAngle(
  sixFace: SixFace,
  fourDirection: FourDirection,
): SixFaceTwentyFourAngle;
export declare enum ConnectionRelation {
  Top = 0,
  Right = 1,
  Bottom = 2,
  Left = 3,
}
export declare const SIX_FACE_AND_DIRECTION_RELATIONS:
  SixFaceTwentyFourAngle[][];
export declare enum TwelveEdge {
  UpTop = 0,
  UpRight = 1,
  UpBottom = 2,
  UpLeft = 3,
  BackLeft = 4,
  BackRight = 5,
  FrontRight = 6,
  FrontLeft = 7,
  DownTop = 8,
  DownRight = 9,
  DownBottom = 10,
  DownLeft = 11,
  NotSure = 12,
}
export declare function convertTwelveEdgeToString(value: TwelveEdge): string;
export declare function getSixFaceTwentyFourAngleRelationTwelveEdge(
  value: SixFaceTwentyFourAngle,
  relation: ConnectionRelation,
): TwelveEdge;
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
export declare class CellObject implements Cell {
  rowIndex: number;
  colIndex: number;
  cellIndex: number;
  /**
   * 未使用的格为0，六面面片（含单格、双格两种情况）从1开始（越靠里面的越小），插片为所连面片的层序加1
   */
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
  clone(): CellObject;
  constructor(rowIndex: number, colIndex: number, cellIndex: number);
}
export interface GridLine {
  xStart: number;
  xEnd: number;
  yStart: number;
  yEnd: number;
  lineStyle: GridLineStyle;
}
export type OneCellRowColIndex = [number, number];
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
  previousNoArray: number[];
  firstRowActCellColIndexBill: string;
  lastRowEmptyCellColIndexBill: string;
  count(): void;
}
export interface CubeObject {
  sixFaces: SixFaces;
  twelveEdges: TwelveEdges;
  isValid: boolean;
}
export declare class Cube implements CubePaperModel, CubeObject {
  no: number;
  rowCount: number;
  colCount: number;
  coreRowIndex: number;
  coreColIndex: number;
  cells: CellObject[][];
  actCells: CellObject[];
  emptyCells: CellObject[];
  gridLines: GridLine[];
  previousNoArray: number[];
  firstRowActCellColIndexBill: string;
  lastRowEmptyCellColIndexBill: string;
  private updateIsValid;
  updateGridLines(): void;
  count(): void;
  sixFaces: SixFaces;
  twelveEdges: TwelveEdges;
  isValid: boolean;
  constructor(
    no: number,
    rowCount: number,
    colCount: number,
    coreRowIndex: number,
    coreColIndex: number,
    isCloning?: boolean,
  );
  clone(): Cube;
}
export interface CubePaperModelSvgParameter {
  id: string;
  setName: string;
  setNo: number;
  cubeNo: number;
  sideLength: number;
  circleRadius: number;
  textOffset: number;
  thickness: number;
  innerLineStyle: string;
  outerLineStyle: string;
  cutLineStyle: string;
  textStyle: string;
}
export declare function getSvg(options: CubePaperModelSvgParameter): SVGElement;
export interface RecuriseOption {
  rowIndex: number;
  colIndex: number;
  relation: ConnectionRelation;
}
export {};
