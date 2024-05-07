// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const COL_COUNT_PER_CUBE = 5;
globalThis.onload = () => {
    const DEFAULT_TEXT_COLOR = "#555";
    const INNER_LINE_CSS = "stroke:#888; stroke-width: 0.1mm; stroke-dasharray: 3 2;";
    const CUTTER_LINE_CSS = "stroke:#ff0000; stroke-width: 0.1mm;";
    const OUTER_LINE_WIDTH = 0.1;
    const OUTER_LINE_CSS = `stroke:#000; stroke-width: ${OUTER_LINE_WIDTH}mm;`;
    getPageParameterByName("hide_face_text", "false") === "true";
    const FACE_FONT_SIZE = parseFloat(getPageParameterByName("face_font_size", "3"));
    const FACE_TEXT_COLOR = getPageParameterByName("face_text_color", DEFAULT_TEXT_COLOR).trim().length ? getPageParameterByName("face_text_color", DEFAULT_TEXT_COLOR).trim() : DEFAULT_TEXT_COLOR;
    const FACE_TEXT_CSS = `font-size:${FACE_FONT_SIZE}mm;stroke:${FACE_TEXT_COLOR};`;
    getPageParameterByName("hide_set_text", "false") === "true";
    const SET_FONT_SIZE = parseFloat(getPageParameterByName("set_font_size", "3"));
    const SET_TEXT_COLOR = getPageParameterByName("set_text_color", FACE_TEXT_COLOR);
    const SET_TEXT_CSS = `font-size:${SET_FONT_SIZE}mm;stroke:${SET_TEXT_COLOR};`;
    getPageParameterByName("set_text_use_mode_no", "false") === "true";
    getPageParameterByName("text_only_in_first_cell", "false") === "true";
    const HOLE_LINE_CSS = "stroke: #888; stroke-width: 0.1mm;";
    const SIDE_LENGTH = parseInt(getPageParameterByName("side", "10"));
    const THICKNESS = parseFloat(getPageParameterByName("thickness", "0.6"));
    const HOLE_RADIUS = parseFloat(getPageParameterByName("hole", "1.5"));
    const TEXT_VERTICAL_OFFSET = HOLE_RADIUS + parseFloat(getPageParameterByName("text_offset", "1.8"));
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
    setDocumentTitle(PAPER_WIDTH, PAPER_HEIGHT, SIDE_LENGTH, PAGE_LEFT, PAGE_RIGHT, PAGE_TOP, PAGE_BOTTOM, "cube", FILE_NAME_POSTFIX);
    setDynamicCss(PAPER_WIDTH, PAPER_HEIGHT, PAGE_WIDTH, PAGE_HEIGHT, PAGE_LEFT, PAGE_TOP);
    let {
        page,
        pageTopSvg
    } = createNewPage(PAGE_WIDTH, PAGE_HEIGHT, SIDE_LENGTH, HALF_SIDE_LENGTH, ROW_COUNT, COL_COUNT, HOLE_LINE_CSS, HOLE_RADIUS);

    function appendNewPage() {
        const RESULT = createNewPage(PAGE_WIDTH, PAGE_HEIGHT, SIDE_LENGTH, HALF_SIDE_LENGTH, ROW_COUNT, COL_COUNT, HOLE_LINE_CSS, HOLE_RADIUS);
        page = RESULT.page;
        pageTopSvg = RESULT.pageTopSvg;
    }
    let lastRowEmptyCellColIndexBillOfLastCube = "";
    let currentRowCount = 0;
    let currentColCount = 0;
    let svgId = 0;
    SET_ARRAY.forEach(({
        name,
        cubes
    }) => {
        cubes.forEach((no, cubeIndex) => {
            const cube = CUBES.filter((o) => o.no === no)[0];
            const {
                firstRowActCellColIndexBill,
                lastRowEmptyCellColIndexBill,
                rowCount,
                colCount
            } = cube;
            const JOIN_TO_LAST_CELL = firstRowActCellColIndexBill.length && firstRowActCellColIndexBill === lastRowEmptyCellColIndexBillOfLastCube;
            if (currentRowCount + rowCount + (JOIN_TO_LAST_CELL ? -1 : 0) > ROW_COUNT) {
                if (currentRowCount < ROW_COUNT) {
                    appendBottomElementsToPageTopSvg(pageTopSvg, SIDE_LENGTH, ROW_COUNT, currentRowCount, currentColCount, INNER_LINE_CSS);
                }
                if (currentColCount + colCount > COL_COUNT) {
                    if (currentColCount < COL_COUNT) {
                        appendRightElementsToPageTopSvg(pageTopSvg, SIDE_LENGTH, COL_COUNT, currentColCount, ROW_COUNT, INNER_LINE_CSS);
                    }
                    appendNewPage();
                    currentColCount = 0;
                }
                currentRowCount = 0;
            }
            if (!currentRowCount) {
                colCount;
                currentColCount += colCount;
            }
            lastRowEmptyCellColIndexBillOfLastCube = lastRowEmptyCellColIndexBill;
            const svg = getSvg({
                id: ++svgId,
                setName: name,
                setNo: cubeIndex + 1,
                cubeNo: no,
                sideLength: SIDE_LENGTH,
                circleRadius: HOLE_RADIUS,
                textOffset: TEXT_VERTICAL_OFFSET,
                thickness: THICKNESS,
                innerLineCss: INNER_LINE_CSS,
                outerLineCss: OUTER_LINE_CSS,
                cutterLineCss: CUTTER_LINE_CSS,
                faceTextCss: FACE_TEXT_CSS,
                setTextCss: SET_TEXT_CSS
            });
            const {
                style
            } = svg;
            if (JOIN_TO_LAST_CELL && currentRowCount > 0) {
                style.marginTop = `-${SIDE_LENGTH}mm`;
                currentRowCount += rowCount - 1;
            } else {
                currentRowCount += rowCount;
            }
            page.appendChild(svg);
        });
    });
    if (currentRowCount < ROW_COUNT) {
        appendBottomElementsToPageTopSvg(pageTopSvg, SIDE_LENGTH, ROW_COUNT, currentRowCount, currentColCount, INNER_LINE_CSS);
    }
    if (currentColCount < COL_COUNT) {
        appendRightElementsToPageTopSvg(pageTopSvg, SIDE_LENGTH, COL_COUNT, currentColCount, ROW_COUNT, INNER_LINE_CSS);
    }
    globalThis.print();
};

function appendRightElementsToPageTopSvg(pageTopSvg, SIDE_LENGTH, COL_COUNT, currentColCount, ROW_COUNT, INNER_LINE_CSS) {
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

function appendBottomElementsToPageTopSvg(pageTopSvg, SIDE_LENGTH, ROW_COUNT, currentRowCount, currentColCount, INNER_LINE_CSS) {
    const Y1 = SIDE_LENGTH * currentRowCount;
    const Y2 = SIDE_LENGTH * ROW_COUNT;
    for (let colIndex = currentColCount - 5; colIndex < currentColCount; ++colIndex) {
        const X = SIDE_LENGTH * (colIndex + 1);
        SvgHelper.appendLine(pageTopSvg, INNER_LINE_CSS, X, X, Y1, Y2, null);
    }
    const X2 = SIDE_LENGTH * currentColCount;
    const X1 = X2 - SIDE_LENGTH * 5;
    for (let rowIndex = currentRowCount; rowIndex < ROW_COUNT; ++rowIndex) {
        const Y = SIDE_LENGTH * (rowIndex + 1);
        SvgHelper.appendLine(pageTopSvg, INNER_LINE_CSS, X1, X2, Y, Y, null);
    }
}

function createNewPage(PAGE_WIDTH, PAGE_HEIGHT, SIDE_LENGTH, HALF_SIDE_LENGTH, ROW_COUNT, COL_COUNT, HOLE_LINE_CSS, HOLE_RADIUS) {
    const page = document.createElement("page");
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
                SvgHelper.appendCircle(pageTopSvg, HOLE_LINE_CSS, X, Y + HALF_SIDE_LENGTH, HOLE_RADIUS, null);
            }
        }
    }
    return {
        page,
        pageTopSvg
    };
}