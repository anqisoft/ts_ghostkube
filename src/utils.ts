/// <reference types="../types/src/cubeCore.d.ts" />
// import {
// 	CellBorderLine,
// 	CellFeature,
// 	CellObject,
// 	ConnectionRelation,
// 	CUBES,
// 	FourDirection,
// 	SIX_FACE_NAME_CHARS,
// 	SixFace,
// 	TextDirections,
// 	TWELVE_EDGE_NAME_CHARS,
// } from './cubeCore.ts';

// import { SvgHelper } from './src/types/index.js';

// https://docs.deno.com/runtime/manual/advanced/typescript/types
// 最终使用这一句，以便编译
/// <reference types="../node_modules/@dishanqian/h5_base/types/index.d.ts" />
// 这句是使用自动修正功能生成的，无效！
// import { SvgHelper } from '../node_modules/@dishanqian/h5_base/types/index.d.ts';

// 这句未能解决问题
// @deno-types="../node_modules/@dishanqian/h5_base/types/index.d.ts"
// 在写代码阶段使用下句（以便使用智能提示），编译前临时注释掉再编译
// import {
// 	createElement,
// 	createSvgElement,
// 	DPIHelper,
// 	getPageParameterByName,
// 	I18nable,
// 	SVG_NS,
// 	SVG_XLINKNS,
// 	SvgHelper,
// 	SvgTextInfo,
// } from './types/index.d.ts'; // } from '../test/js/h5_base.js';

declare const CUBES: CubeForDrawingActCell[];

export function setDynamicCss(
  PAGE_WIDTH: number,
  PAGE_HEIGHT: number,
  MAX_X: number,
  MAX_Y: number,
  PAGE_LEFT: number,
  PAGE_TOP: number,
) {
  const css =
    `@media print { @page { size: ${PAGE_WIDTH}mm ${PAGE_HEIGHT}mm; } }
* { border: 0;  padding: 0; margin: 0; }
html, body { overflow: hidden; width: ${PAGE_WIDTH}mm; }
body{font-family: 'Times New Roman', 'Kaiti', 'PingFang';}
page {width: ${MAX_X}mm; height: ${MAX_Y}mm;padding-left:${PAGE_LEFT}mm;padding-top:${PAGE_TOP}mm;}
page {display:flex;flex-direction:column;flex-wrap:wrap;align-content:flex-start;}
page:not(:last-of-type){page-break-after:always;}
tspan{text-decoration:underline;}
`;
  // line { stroke: #888; stroke-width: 0.1mm; stroke-dasharray: 3 2;}
  (document.getElementById("dynamicStyle") as unknown as HTMLStyleElement)
    .innerText = css;
}

export function setDocumentTitle(
  PAGE_WIDTH: number,
  PAGE_HEIGHT: number,
  SIDE_LENGTH: number,
  PAGE_LEFT: number,
  PAGE_RIGHT: number,
  PAGE_TOP: number,
  PAGE_BOTTOM: number,
  FILE_NAME_MIDDLE: string,
  FILE_NAME_POSTFIX: string,
) {
  let title = `${(
    ((PAGE_WIDTH === 420 && PAGE_HEIGHT === 297) ||
        (PAGE_WIDTH === 297 && PAGE_HEIGHT === 420))
      ? "A3"
      : (
        ((PAGE_WIDTH === 210 && PAGE_HEIGHT === 297) ||
            (PAGE_WIDTH === 297 && PAGE_HEIGHT === 210))
          ? "A4"
          : `width${PAGE_WIDTH}mm_height${PAGE_HEIGHT}mm`
      )
  )}_${SIDE_LENGTH}mm_${FILE_NAME_MIDDLE}_`;
  if (
    (
      (PAGE_LEFT === 5 && PAGE_RIGHT === 5) ||
      (PAGE_LEFT === 4.5 && PAGE_RIGHT === 4.5) ||
      (PAGE_LEFT === 4 && PAGE_RIGHT === 4) ||
      (PAGE_LEFT === 3.5 && PAGE_RIGHT === 3.5) ||
      (PAGE_LEFT === 3 && PAGE_RIGHT === 3)
    ) &&
    (
      (PAGE_TOP === 5 && PAGE_BOTTOM === 5) ||
      (PAGE_TOP === 4.5 && PAGE_BOTTOM === 4.5) ||
      (PAGE_TOP === 4 && PAGE_BOTTOM === 4) ||
      (PAGE_TOP === 3.5 && PAGE_BOTTOM === 3.5) ||
      (PAGE_TOP === 3 && PAGE_BOTTOM === 3)
    )
  ) {
    title += "L1300.pdf";
  } else if (!PAGE_LEFT && !PAGE_RIGHT && !PAGE_TOP && !PAGE_BOTTOM) {
    title += "zero_margins.pdf";
  } else {
    title +=
      `left${PAGE_LEFT}mm_right${PAGE_RIGHT}mm_top${PAGE_TOP}mm_bottom${PAGE_BOTTOM}mm.pdf`;
  }
  document.getElementsByTagName("title")[0].innerText =
    (FILE_NAME_POSTFIX || "").length
      ? title.replace(".pdf", `_${FILE_NAME_POSTFIX}.pdf`)
      : title;
}

export interface CubePaperModelSvgParameter {
  id: string;

  setName: string;
  setNo: number;

  cubeNo: number;
  // pasteWayIndex: number;
  // twentyFourAngleIndex: number;

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

export function getSvg(options: CubePaperModelSvgParameter): SVGElement {
  const {
    id: ID, // : string;

    setName: SET_NAME, // : string;
    setNo: SET_NO, // : number;

    cubeNo: CUBE_NO, // : number;
    // pasteWayIndex, // : number;
    // twentyFourAngleIndex, // : number;

    sideLength: SIDE_LENGTH, // : number;
    circleRadius: CIRCLE_RADIUS, // : number;
    textOffset: TEXT_OFFSET, // : number;
    thickness: THICKNESS, // : number;

    innerLineCss: INNER_LINE_CSS, // : string;
    outerLineCss: OUTER_LINE_CSS, // : string;
    cutterLineCss: CUT_LINE_CSS, // : string;
    faceTextCss: FACE_TEXT_CSS, // : string;
    setTextCss: SET_TEXT_CSS, // : string;
  } = options;

  const svg = SvgHelper.createSvg();
  svg.id = ID;

  // const HALF_CIRCLE_RADIUS = CIRCLE_RADIUS * 0.5;
  // const HALF_CIRCLE_RADIUS_AND_TEXT_OFFSET = TEXT_OFFSET + HALF_CIRCLE_RADIUS;
  // const HALF_CIRCLE_RADIUS_AND_TWICE_TEXT_OFFSET = TEXT_OFFSET * 2 + HALF_CIRCLE_RADIUS;

  const CUBE = CUBES.filter((cube) => cube.no === CUBE_NO)[0];
  const {
    actCells: ACT_CELLS,
    gridLines: GRID_LINES,
  } = CUBE;

  const { style } = svg;
  const { rowCount: CELL_ROW_COUNT, colCount: CELL_COL_COUNT } = CUBE;
  const SVG_WIDTH = SIDE_LENGTH * CELL_COL_COUNT;
  const SVG_HEIGHT = SIDE_LENGTH * CELL_ROW_COUNT;
  style.width = `${SVG_WIDTH}mm`;
  style.height = `${SVG_HEIGHT}mm`;
  // console.log({
  // 	ID,
  // 	SVG_WIDTH,
  // 	SVG_HEIGHT,
  // });

  GRID_LINES.forEach(({ xStart, xEnd, yStart, yEnd, lineStyle }) => {
    SvgHelper.appendLine(
      svg,
      lineStyle === CellBorderLine.InnerLine
        ? INNER_LINE_CSS
        : (lineStyle === CellBorderLine.OuterLine
          ? OUTER_LINE_CSS
          : CUT_LINE_CSS),
      SIDE_LENGTH * xStart,
      SIDE_LENGTH * xEnd,
      SIDE_LENGTH * yStart,
      SIDE_LENGTH * yEnd,
      null,
    );
  });

  // const LINE_INFO_ARRAY: string[] = [];
  // const MAX_UP_FACE_LAYER_INDEX = Math.max(
  //   ACT_CELLS.filter((cell) =>
  //     cell.feature === CellFeature.Face && cell.sixFace === SixFace.Up
  //   ).map((cell) => cell.layerIndex),
  // );
  let maxUpFaceLayerIndex = 0;
  ACT_CELLS.filter(
    (cell) => cell.feature === CellFeature.Face && cell.sixFace === SixFace.Up,
  ).forEach(
    (cell) =>
      maxUpFaceLayerIndex = Math.max(maxUpFaceLayerIndex, cell.layerIndex),
  );
  const MAX_UP_FACE_LAYER_INDEX = maxUpFaceLayerIndex;
  ACT_CELLS.forEach((cell: CellObject) => {
    const {
      layerIndex: LAYER_INDEX,

      // addOrder,

      // relatedInformationWhenAdding: {
      // 	// rowIndex,
      // 	// colIndex,
      // 	relation: RELATION,
      // },

      feature: FEATURE,
      sixFace: SIX_FACE,
      faceDirection: FACE_DIRECTION,
      twelveEdge: TWELVE_EDGE,
      // borderLines: BORDER_LINES,

      rowIndex: ROW_INDEX,
      colIndex: COL_INDEX,
    } = cell;
    // const RELATION = cell.relatedInformationWhenAdding
    //   ? cell.relatedInformationWhenAdding.relation
    //   : cell.relation;
    const RELATION = cell.relation;

    // 画线、写字
    // BORDER_LINES.forEach((borderLine, index) => {
    // 	// top, right, bottom, left
    // 	// 0	1		0 		1

    // 	const X1 = SIDE_LENGTH * (COL_INDEX + (index === 1 ? 1 : 0));
    // 	const X2 = X1 + SIDE_LENGTH * (index % 2 ? 0 : 1);
    // 	const Y1 = SIDE_LENGTH * (ROW_INDEX + +(index === 2 ? 1 : 0));
    // 	const Y2 = Y1 + SIDE_LENGTH * (index % 2 ? 1 : 0);

    // 	if (borderLine !== CellBorderLine.Unknown) {
    // 		const LINE_INFO = `${X1}_${X2}_${Y1}_${Y2}`;
    // 		if (LINE_INFO_ARRAY.indexOf(LINE_INFO) === -1) {
    // 			// appendLine(svg, STYLE, x1, x2, y1, y2, viewBox)
    // 			SvgHelper.appendLine(
    // 				svg,
    // 				borderLine === CellBorderLine.InnerLine
    // 					? INNER_LINE_CSS
    // 					: (borderLine === CellBorderLine.OuterLine ? OUTER_LINE_CSS : CUT_LINE_CSS),
    // 				X1,
    // 				X2,
    // 				Y1,
    // 				Y2,
    // 				null,
    // 			);
    // 			LINE_INFO_ARRAY.push(LINE_INFO);
    // 		}
    // 	}
    // });

    let xText = 0;
    let yText = 0;
    let text = "";

    const X1 = SIDE_LENGTH * COL_INDEX;
    const X2 = X1 + SIDE_LENGTH;
    const Y1 = SIDE_LENGTH * ROW_INDEX;
    const Y2 = Y1 + SIDE_LENGTH;
    if (FEATURE === CellFeature.Face) {
      // 如果是U，写上“套装.子序号"
      // SvgHelper.appendText(svg, textStyle, '', X1, Y1, 0, '', null, false);
      let xTextOfSetInfo = 0;
      let yTextOfSetInfo = 0;

      // 根据方向，写上“面及层号”
      text = `${SIX_FACE_NAME_CHARS[SIX_FACE]}${LAYER_INDEX}`;
      switch (FACE_DIRECTION) {
        case FourDirection.Original:
          xText = X1 + SIDE_LENGTH * 0.5;
          yText = Y1 + SIDE_LENGTH * 0.5 + TEXT_OFFSET;

          xTextOfSetInfo = xText;
          yTextOfSetInfo = Y1 + SIDE_LENGTH * 0.5 - TEXT_OFFSET;
          break;
        case FourDirection.SemiCircle:
          xText = X1 + SIDE_LENGTH * 0.5;
          yText = Y1 + SIDE_LENGTH * 0.5 - TEXT_OFFSET;

          xTextOfSetInfo = xText;
          yTextOfSetInfo = Y1 + SIDE_LENGTH * 0.5 + TEXT_OFFSET;
          break;
        case FourDirection.Clockwise90:
          xText = X1 + SIDE_LENGTH * 0.5 - TEXT_OFFSET;
          yText = Y1 + SIDE_LENGTH * 0.5;

          xTextOfSetInfo = X1 + SIDE_LENGTH * 0.5 + TEXT_OFFSET;
          yTextOfSetInfo = yText;
          break;
        case FourDirection.Counterclockwise90:
          xText = X1 + SIDE_LENGTH * 0.5 + TEXT_OFFSET;
          yText = Y1 + SIDE_LENGTH * 0.5;

          xTextOfSetInfo = X1 + SIDE_LENGTH * 0.5 - TEXT_OFFSET;
          yTextOfSetInfo = yText;
          break;
        default:
          // unreachable
          break;
      }

      if (SIX_FACE === SixFace.Up && MAX_UP_FACE_LAYER_INDEX === LAYER_INDEX) {
        SvgHelper.appendText(
          svg,
          SET_TEXT_CSS,
          `${SET_NAME}.${SET_NO}`,
          xTextOfSetInfo,
          yTextOfSetInfo,
          TextDirections[FACE_DIRECTION],
          "",
          null,
          false,
        );
      }
    } else if (FEATURE === CellFeature.Piece) {
      // 根据方向，写上“片及层号”
      // text = `${TWELVE_EDGE_NAME_CHARS[TWELVE_EDGE]}${LAYER_INDEX}`;
      text = `${TWELVE_EDGE + 1}#${LAYER_INDEX}`;

      const X_ARRAY = [];
      const Y_ARRAY = [];

      // 绘制“插片”线
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
          yText = Y1 + SIDE_LENGTH * 0.5 + TEXT_OFFSET;

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
          yText = Y1 + SIDE_LENGTH * 0.5 - TEXT_OFFSET;

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

          xText = X1 + SIDE_LENGTH * 0.5 - TEXT_OFFSET;
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

          xText = X1 + SIDE_LENGTH * 0.5 + TEXT_OFFSET;
          yText = Y1 + SIDE_LENGTH * 0.5;
          break;
        default:
          // unreachable
          break;
      }
      for (let lineIndex = 0; lineIndex < 3; ++lineIndex) {
        SvgHelper.appendLine(
          svg,
          CUT_LINE_CSS,
          X_ARRAY[lineIndex],
          X_ARRAY[lineIndex + 1],
          Y_ARRAY[lineIndex],
          Y_ARRAY[lineIndex + 1],
          null,
        );
      }
    }
    SvgHelper.appendText(
      svg,
      FACE_TEXT_CSS,
      text,
      xText,
      yText,
      TextDirections[FEATURE === CellFeature.Piece ? RELATION : FACE_DIRECTION],
      "",
      null,
      false,
    );
  });

  return svg;
}
