export declare function setDynamicCss(
  PAGE_WIDTH: number,
  PAGE_HEIGHT: number,
  MAX_X: number,
  MAX_Y: number,
  PAGE_LEFT: number,
  PAGE_TOP: number,
): void;
export declare function setDocumentTitle(
  PAGE_WIDTH: number,
  PAGE_HEIGHT: number,
  SIDE_LENGTH: number,
  PAGE_LEFT: number,
  PAGE_RIGHT: number,
  PAGE_TOP: number,
  PAGE_BOTTOM: number,
  FILE_NAME_MIDDLE: string,
  FILE_NAME_POSTFIX: string,
): void;
export interface CubePaperModelSvgParameter {
  id: string;
  setName: string;
  setNo: number;
  cubeNo: number;
  sideLength: number;
  circleRadius: number;
  textOffset: number;
  thickness: number;
  innerLineCss: string;
  outerLineCss: string;
  cutterLineCss: string;
  faceTextCss: string;
  setTextCss: string;
}
export declare function getSvg(options: CubePaperModelSvgParameter): SVGElement;
