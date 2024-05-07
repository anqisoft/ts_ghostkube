declare const FILE_NAME_POSTFIX: string;
declare const SET_ARRAY: {
  name: string;
  cubes: number[];
}[];
declare const CUBES: CubeForDrawingActCell[];

// https://docs.deno.com/runtime/manual/advanced/typescript/types
// 最终使用这一句，以便编译
/// <reference types="../node_modules/@dishanqian/h5_base/types/index.d.ts" />
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
// } from '../node_modules/@dishanqian/h5_base/types/index.d.ts'; // } from '../test/js/h5_base.js';

/// <reference types="../types/src/utils.d.ts" />
// import { CubePaperModelSvgParameter, getSvg, setDocumentTitle, setDynamicCss } from './utils.ts';

/// <reference types="../types/src/cubeCore.d.ts" />
// import { Cube, SIX_FACE_NAME_CHARS, TWELVE_EDGE_NAME_CHARS } from './cubeCore.ts';

const COL_COUNT_PER_CUBE = 5;
globalThis.onload = () => {
  const DEFAULT_TEXT_COLOR = "#555";
  const INNER_LINE_CSS =
    "stroke:#888; stroke-width: 0.1mm; stroke-dasharray: 3 2;";
  const CUTTER_LINE_CSS = "stroke:#ff0000; stroke-width: 0.1mm;";
  // 注意：若外边框的线宽太小，会导致“虽然有这些线，但看不到”的问题
  const OUTER_LINE_WIDTH = 0.1;
  const HALF_OUTER_LINE_WIDTH = OUTER_LINE_WIDTH * 0.5;
  const OUTER_LINE_CSS = `stroke:#000; stroke-width: ${OUTER_LINE_WIDTH}mm;`;

  const HIDE_FACE_TEXT =
    getPageParameterByName("hide_face_text", "false") === "true";
  const FACE_FONT_SIZE = parseFloat(
    getPageParameterByName("face_font_size", "3"),
  ); // 2.25
  const FACE_TEXT_COLOR =
    getPageParameterByName("face_text_color", DEFAULT_TEXT_COLOR).trim().length
      ? getPageParameterByName("face_text_color", DEFAULT_TEXT_COLOR).trim()
      : DEFAULT_TEXT_COLOR;
  const FACE_TEXT_CSS =
    `font-size:${FACE_FONT_SIZE}mm;stroke:${FACE_TEXT_COLOR};`;

  const HIDE_SET_TEXT =
    getPageParameterByName("hide_set_text", "false") === "true";
  const SET_FONT_SIZE = parseFloat(
    getPageParameterByName("set_font_size", "3"),
  ); // 2.25
  const SET_TEXT_COLOR = getPageParameterByName(
    "set_text_color",
    FACE_TEXT_COLOR,
  );
  const SET_TEXT_CSS = `font-size:${SET_FONT_SIZE}mm;stroke:${SET_TEXT_COLOR};`;

  const SET_TEXT_USE_MODE_NO =
    getPageParameterByName("set_text_use_mode_no", "false") === "true";
  const TEXT_ONLY_IN_FIRST_CELL =
    getPageParameterByName("text_only_in_first_cell", "false") === "true";

  const HOLE_LINE_CSS = "stroke: #888; stroke-width: 0.1mm;";

  const SIDE_LENGTH = parseInt(getPageParameterByName("side", "10"));
  const THICKNESS = parseFloat(getPageParameterByName("thickness", "0.6")); // 1.2
  const HOLE_RADIUS = parseFloat(getPageParameterByName("hole", "1.5"));
  // const TEXT_VERTICAL_OFFSET = HOLE_RADIUS +
  //   parseFloat(getPageParameterByName("text_offset", "0.9"));
  const TEXT_VERTICAL_OFFSET = HOLE_RADIUS +
    parseFloat(getPageParameterByName("text_offset", "1.8"));

  const PAPER_WIDTH = parseFloat(getPageParameterByName("width", "420"));
  const PAPER_HEIGHT = parseFloat(getPageParameterByName("height", "297"));

  const PAGE_LEFT = parseFloat(getPageParameterByName("left", "5"));
  const PAGE_RIGHT = parseFloat(getPageParameterByName("right", "5"));
  const PAGE_TOP = parseFloat(getPageParameterByName("top", "3.5"));
  const PAGE_BOTTOM = parseFloat(getPageParameterByName("bottom", "3.5"));

  const HALF_SIDE_LENGTH = SIDE_LENGTH * 0.5;

  const PAGE_WIDTH = PAPER_WIDTH - PAGE_LEFT - PAGE_RIGHT;
  const PAGE_HEIGHT = PAPER_HEIGHT - PAGE_TOP - PAGE_BOTTOM;

  const ROW_COUNT = Math.floor(PAGE_HEIGHT / SIDE_LENGTH);
  const COL_COUNT = Math.floor(PAGE_WIDTH / SIDE_LENGTH);

  const CUTTER_LINE_OFFSET = SIDE_LENGTH * 0.15;

  setDocumentTitle(
    PAPER_WIDTH,
    PAPER_HEIGHT,
    SIDE_LENGTH,
    PAGE_LEFT,
    PAGE_RIGHT,
    PAGE_TOP,
    PAGE_BOTTOM,
    "cube",
    FILE_NAME_POSTFIX,
  );

  setDynamicCss(
    PAPER_WIDTH,
    PAPER_HEIGHT,
    PAGE_WIDTH,
    PAGE_HEIGHT,
    PAGE_LEFT,
    PAGE_TOP,
  );

  // let page: HTMLDivElement;
  // let pageTopSvg: SVGElement;
  let { page, pageTopSvg } = createNewPage(
    PAGE_WIDTH,
    PAGE_HEIGHT,
    SIDE_LENGTH,
    HALF_SIDE_LENGTH,
    ROW_COUNT,
    COL_COUNT,
    HOLE_LINE_CSS,
    HOLE_RADIUS,
  );
  function appendNewPage() {
    const RESULT = createNewPage(
      PAGE_WIDTH,
      PAGE_HEIGHT,
      SIDE_LENGTH,
      HALF_SIDE_LENGTH,
      ROW_COUNT,
      COL_COUNT,
      HOLE_LINE_CSS,
      HOLE_RADIUS,
    );
    page = RESULT.page;
    pageTopSvg = RESULT.pageTopSvg;
  }
  // appendNewPage();

  const MAP_SET_NAME_TO_COUNT_ARRAY: { setName: string; count: number }[] = [];
  let mapSetNameToCount: { setName: string; count: number } = {
    setName: "",
    count: 0,
  };

  let lastRowEmptyCellColIndexBillOfLastCube = "";
  let prevColCount = 0;
  let currentRowCount = 0;
  let currentColCount = 0;
  let svgId = 0;

  // 遍历正方体清单，写入page的html
  // TODO(@anqisoft) 改由页面提供。测试阶段可改为全集
  // declare const SET_ARRAY: {
  //   name: string;
  //   cubes: number[];
  // }[];
  // declare const cubes: CubeForDrawingActCell[];
  SET_ARRAY.forEach(({ name, cubes }) => {
    cubes.forEach((no, cubeIndex) => {
      const cube = CUBES.filter((o) => o.no === no)[0];
      // const {
      //   cells, // CellObject[][] = [];
      //   actCells, // CellObject[] = [];
      //   emptyCells, // CellObject[] = [];
      //   gridLines, // GridLine[] = [];

      //   firstRowActCellColIndexBill, // string = '';
      //   lastRowEmptyCellColIndexBill, // string = '';

      //   sixFaces, // SixFaces = getEmptySixFaces();
      //   twelveEdges, // TwelveEdges = getEmptyTwelveEdges();
      //   isValid, // boolean = false;

      //   no, // number,
      //   rowCount, // number,
      //   colCount, // number,
      //   coreRowIndex, // number,
      //   coreColIndex, // number,
      // } = cube;
      const {
        firstRowActCellColIndexBill, // string = '';
        lastRowEmptyCellColIndexBill, // string = '';

        rowCount, // number,
        colCount, // number,
      } = cube;

      const JOIN_TO_LAST_CELL = firstRowActCellColIndexBill.length &&
        firstRowActCellColIndexBill === lastRowEmptyCellColIndexBillOfLastCube;

      if (
        currentRowCount + rowCount + (JOIN_TO_LAST_CELL ? -1 : 0) > ROW_COUNT
      ) {
        if (currentRowCount < ROW_COUNT) {
          // appendBottomElementsToPageTopSvg(pageTopSvg: SVGElement, SIDE_LENGTH: number, ROW_COUNT: number, currentRowCount: number, currentColCount: number, INNER_LINE_CSS: string): void
          appendBottomElementsToPageTopSvg(
            pageTopSvg,
            SIDE_LENGTH,
            ROW_COUNT,
            currentRowCount,
            currentColCount,
            INNER_LINE_CSS,
          );
        }

        if (currentColCount + colCount > COL_COUNT) {
          if (currentColCount < COL_COUNT) {
            // appendRightElementsToPageTopSvg(pageTopSvg: SVGElement, SIDE_LENGTH: number, COL_COUNT: number, currentColCount: number, ROW_COUNT: number, INNER_LINE_CSS: string): void
            appendRightElementsToPageTopSvg(
              pageTopSvg,
              SIDE_LENGTH,
              COL_COUNT,
              currentColCount,
              ROW_COUNT,
              INNER_LINE_CSS,
            );
          }

          appendNewPage();
          currentColCount = 0;
        }

        // console.log('change column', svgId + 1);
        currentRowCount = 0;
      }

      if (!currentRowCount) {
        prevColCount = colCount;
        currentColCount += colCount;
      }

      lastRowEmptyCellColIndexBillOfLastCube = lastRowEmptyCellColIndexBill;
      const svg = getSvg({
        id: ++svgId, // string;

        setName: name, // string;
        setNo: cubeIndex + 1, // number;

        cubeNo: no, // number;

        sideLength: SIDE_LENGTH, // number;
        circleRadius: HOLE_RADIUS, //: number;
        textOffset: TEXT_VERTICAL_OFFSET, //: number;
        thickness: THICKNESS, //: number;

        innerLineCss: INNER_LINE_CSS, //: string;
        outerLineCss: OUTER_LINE_CSS, //: string;
        cutterLineCss: CUTTER_LINE_CSS, //: string;
        faceTextCss: FACE_TEXT_CSS, // : string;
        setTextCss: SET_TEXT_CSS, // : string;
      });
      // svg.setAttribute('id', `svg_${++svgId}`);
      const { style } = svg;

      if (JOIN_TO_LAST_CELL && currentRowCount > 0) {
        style.marginTop = `-${SIDE_LENGTH}mm`;

        currentRowCount += rowCount - 1;
      } else {
        currentRowCount += rowCount;
      }

      // const WIDTH = SIDE_LENGTH * colCount;
      // const HEIGHT = SIDE_LENGTH * rowCount;
      // style.width = `${WIDTH}mm`;
      // style.height = `${HEIGHT}mm`;

      page.appendChild(svg);
    });
  });

  if (currentRowCount < ROW_COUNT) {
    appendBottomElementsToPageTopSvg(
      pageTopSvg,
      SIDE_LENGTH,
      ROW_COUNT,
      currentRowCount,
      currentColCount,
      INNER_LINE_CSS,
    );
  }

  if (currentColCount < COL_COUNT) {
    appendRightElementsToPageTopSvg(
      pageTopSvg,
      SIDE_LENGTH,
      COL_COUNT,
      currentColCount,
      ROW_COUNT,
      INNER_LINE_CSS,
    );
  }
  globalThis.print();
};

function appendRightElementsToPageTopSvg(
  pageTopSvg: SVGElement,
  SIDE_LENGTH: number,
  COL_COUNT: number,
  currentColCount: number,
  ROW_COUNT: number,
  INNER_LINE_CSS: string,
) {
  const SVG_COL_COUNT = COL_COUNT - currentColCount;
  const SVG_HEIGHT = SIDE_LENGTH * ROW_COUNT;

  const X1 = SIDE_LENGTH * currentColCount;
  const X2 = SIDE_LENGTH * COL_COUNT;
  for (let rowIndex = 0; rowIndex <= ROW_COUNT; ++rowIndex) {
    const Y = SIDE_LENGTH * rowIndex;
    SvgHelper.appendLine(pageTopSvg, INNER_LINE_CSS, X1, X2, Y, Y, null);
  }

  for (let colIndex = 0; colIndex < SVG_COL_COUNT; ++colIndex) {
    const X = X1 + SIDE_LENGTH * (colIndex + 1);
    SvgHelper.appendLine(pageTopSvg, INNER_LINE_CSS, X, X, 0, SVG_HEIGHT, null);
  }
}

function appendBottomElementsToPageTopSvg(
  pageTopSvg: SVGElement,
  SIDE_LENGTH: number,
  ROW_COUNT: number,
  currentRowCount: number,
  currentColCount: number,
  INNER_LINE_CSS: string,
) {
  const Y1 = SIDE_LENGTH * currentRowCount;
  const Y2 = SIDE_LENGTH * ROW_COUNT;

  for (
    let colIndex = currentColCount - COL_COUNT_PER_CUBE;
    colIndex < currentColCount;
    ++colIndex
  ) {
    const X = SIDE_LENGTH * (colIndex + 1);
    SvgHelper.appendLine(pageTopSvg, INNER_LINE_CSS, X, X, Y1, Y2, null);
  }

  const X2 = SIDE_LENGTH * currentColCount;
  const X1 = X2 - SIDE_LENGTH * COL_COUNT_PER_CUBE;
  for (let rowIndex = currentRowCount; rowIndex < ROW_COUNT; ++rowIndex) {
    const Y = SIDE_LENGTH * (rowIndex + 1);
    SvgHelper.appendLine(pageTopSvg, INNER_LINE_CSS, X1, X2, Y, Y, null);
  }
}

function createNewPage(
  PAGE_WIDTH: number,
  PAGE_HEIGHT: number,
  SIDE_LENGTH: number,
  HALF_SIDE_LENGTH: number,
  ROW_COUNT: number,
  COL_COUNT: number,
  HOLE_LINE_CSS: string,
  HOLE_RADIUS: number,
): { page: HTMLDivElement; pageTopSvg: SVGElement } {
  const page = document.createElement("page") as HTMLDivElement;
  document.getElementsByTagName("body")[0].appendChild(page);

  const pageTopSvg = SvgHelper.createSvg();
  page.appendChild(pageTopSvg);

  const style = pageTopSvg.style;
  style.width = `${PAGE_WIDTH}mm`;
  style.height = `${PAGE_HEIGHT}mm`;
  style.zIndex = "1";
  style.position = "absolute";

  for (let colIndex = 0; colIndex < COL_COUNT; colIndex += COL_COUNT_PER_CUBE) {
    const X = SIDE_LENGTH * colIndex + HALF_SIDE_LENGTH;
    for (let rowIndex = 0; rowIndex <= ROW_COUNT; ++rowIndex) {
      const Y = SIDE_LENGTH * rowIndex;
      if (rowIndex < ROW_COUNT) {
        SvgHelper.appendCircle(
          pageTopSvg,
          HOLE_LINE_CSS,
          X,
          Y + HALF_SIDE_LENGTH,
          HOLE_RADIUS,
          null,
        );
      }
    }
  }

  return { page, pageTopSvg };
}
