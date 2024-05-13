// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function setDynamicCss(PAGE_WIDTH, PAGE_HEIGHT, MAX_X, MAX_Y, PAGE_LEFT, PAGE_TOP) {
    const css = `@media print { @page { size: ${PAGE_WIDTH}mm ${PAGE_HEIGHT}mm; } }
* { border: 0;  padding: 0; margin: 0; }
html, body { overflow: hidden; width: ${PAGE_WIDTH}mm; }
body{font-family: 'Times New Roman', 'Kaiti', 'PingFang';}
page {width: ${MAX_X}mm; height: ${MAX_Y}mm;padding-left:${PAGE_LEFT}mm;padding-top:${PAGE_TOP}mm;}
page {display:flex;flex-direction:column;flex-wrap:wrap;align-content:flex-start;}
page:not(:last-of-type){page-break-after:always;}
`;
    document.getElementById("dynamicStyle").innerText = css;
}

function setDocumentTitle(PAGE_WIDTH, PAGE_HEIGHT, SIDE_LENGTH, PAGE_LEFT, PAGE_RIGHT, PAGE_TOP, PAGE_BOTTOM, FILE_NAME_MIDDLE, FILE_NAME_POSTFIX) {
    let title = `${PAGE_WIDTH === 420 && PAGE_HEIGHT === 297 || PAGE_WIDTH === 297 && PAGE_HEIGHT === 420 ? "A3" : PAGE_WIDTH === 210 && PAGE_HEIGHT === 297 || PAGE_WIDTH === 297 && PAGE_HEIGHT === 210 ? "A4" : `width${PAGE_WIDTH}mm_height${PAGE_HEIGHT}mm`}_${SIDE_LENGTH}mm_${FILE_NAME_MIDDLE}_`;
    if ((PAGE_LEFT === 5 && PAGE_RIGHT === 5 || PAGE_LEFT === 4.5 && PAGE_RIGHT === 4.5 || PAGE_LEFT === 4 && PAGE_RIGHT === 4 || PAGE_LEFT === 3.5 && PAGE_RIGHT === 3.5 || PAGE_LEFT === 3 && PAGE_RIGHT === 3) && (PAGE_TOP === 5 && PAGE_BOTTOM === 5 || PAGE_TOP === 4.5 && PAGE_BOTTOM === 4.5 || PAGE_TOP === 4 && PAGE_BOTTOM === 4 || PAGE_TOP === 3.5 && PAGE_BOTTOM === 3.5 || PAGE_TOP === 3 && PAGE_BOTTOM === 3)) {
        title += "L1300.pdf";
    } else if (!PAGE_LEFT && !PAGE_RIGHT && !PAGE_TOP && !PAGE_BOTTOM) {
        title += "zero_margins.pdf";
    } else {
        title += `left${PAGE_LEFT}mm_right${PAGE_RIGHT}mm_top${PAGE_TOP}mm_bottom${PAGE_BOTTOM}mm.pdf`;
    }
    document.getElementsByTagName("title")[0].innerText = (FILE_NAME_POSTFIX || "").length ? title.replace(".pdf", `_${FILE_NAME_POSTFIX}.pdf`) : title;
}

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
        innerLineCss: INNER_LINE_CSS,
        outerLineCss: OUTER_LINE_CSS,
        cutterLineCss: CUT_LINE_CSS,
        faceTextCss: FACE_TEXT_CSS,
        setTextCss: SET_TEXT_CSS
    } = options;
    const svg = SvgHelper.createSvg();
    svg.id = ID;
    const CUBE = CUBES.filter((cube) => cube.no === CUBE_NO)[0];
    const {
        actCells: ACT_CELLS,
        gridLines: GRID_LINES,
        lines: LINES
    } = CUBE;
    const {
        style
    } = svg;
    const {
        rowCount: ROW_COUNT,
        colCount: COL_COUNT
    } = CUBE;
    const MAX_COL_INDEX = COL_COUNT - 1;
    const SVG_WIDTH = SIDE_LENGTH * COL_COUNT;
    const SVG_HEIGHT = SIDE_LENGTH * ROW_COUNT;
    style.width = `${SVG_WIDTH}mm`;
    style.height = `${SVG_HEIGHT}mm`;
    if (GRID_LINES) {
        GRID_LINES.forEach(({
            xStart,
            xEnd,
            yStart,
            yEnd,
            lineStyle
        }) => {
            SvgHelper.appendLine(svg, lineStyle === CellBorderLine.InnerLine ? INNER_LINE_CSS : lineStyle === CellBorderLine.OuterLine ? OUTER_LINE_CSS : CUT_LINE_CSS, SIDE_LENGTH * xStart, SIDE_LENGTH * xEnd, SIDE_LENGTH * yStart, SIDE_LENGTH * yEnd, null);
        });
    } else {
        SvgHelper.appendLine(svg, OUTER_LINE_CSS, 0, SVG_WIDTH, 0, 0, null);
        SvgHelper.appendLine(svg, OUTER_LINE_CSS, 0, SVG_WIDTH, SVG_HEIGHT, SVG_HEIGHT, null);
        SvgHelper.appendLine(svg, OUTER_LINE_CSS, SVG_WIDTH, SVG_WIDTH, 0, SVG_HEIGHT, null);
        SvgHelper.appendLine(svg, OUTER_LINE_CSS, SVG_WIDTH, SVG_WIDTH, 0, SVG_HEIGHT, null);
        const HORIZONRAL_LINE_COUNT = COL_COUNT * (ROW_COUNT - 1);

        const HORIZONTAL_LINES_ARRAY = [];
        LINES.substring(0, HORIZONRAL_LINE_COUNT).split("").map(value => parseInt(value)).forEach((lineStyle, index) => {
            const xStart = index % COL_COUNT;
            const xEnd = xStart + 1;
            const yStart = Math.floor(index / COL_COUNT) + 1;
            const yEnd = yStart;
            SvgHelper.appendLine(svg, lineStyle === CellBorderLine.InnerLine ? INNER_LINE_CSS : lineStyle === CellBorderLine.OuterLine ? OUTER_LINE_CSS : CUT_LINE_CSS, SIDE_LENGTH * xStart, SIDE_LENGTH * xEnd, SIDE_LENGTH * yStart, SIDE_LENGTH * yEnd, null);

            HORIZONTAL_LINES_ARRAY.push(`${xStart}${xEnd}${yStart}${yEnd}${lineStyle}`);
        });
        const VERTICAL_LINES_ARRAY = [];
        LINES.substring(HORIZONRAL_LINE_COUNT, LINES.length).split("").map(value => parseInt(value)).forEach((lineStyle, index) => {
            const xStart = index % MAX_COL_INDEX + 1;
            const xEnd = xStart;
            const yStart = Math.floor(index / MAX_COL_INDEX);
            const yEnd = yStart + 1;
            SvgHelper.appendLine(svg, lineStyle === CellBorderLine.InnerLine ? INNER_LINE_CSS : lineStyle === CellBorderLine.OuterLine ? OUTER_LINE_CSS : CUT_LINE_CSS, SIDE_LENGTH * xStart, SIDE_LENGTH * xEnd, SIDE_LENGTH * yStart, SIDE_LENGTH * yEnd, null);
            VERTICAL_LINES_ARRAY.push(`${xStart}${xEnd}${yStart}${yEnd}${lineStyle}`);
        });
        console.log(HORIZONTAL_LINES_ARRAY, VERTICAL_LINES_ARRAY);
    }
    const MAX_UP_FACE_LAYER_INDEX = ACT_CELLS.filter((cell) => cell.feature === CellFeature.Face && cell.sixFace === SixFace.Up).map((cell) => cell.layerIndex).sort((prev, next) => prev - next).reverse()[0];
    ACT_CELLS.forEach((cell) => {
        const {
            layerIndex: LAYER_INDEX,
            feature: FEATURE,
            sixFace: SIX_FACE,
            faceDirection: FACE_DIRECTION,
            twelveEdge: TWELVE_EDGE,
            rowIndex: ROW_INDEX,
            colIndex: COL_INDEX
        } = cell;
        const RELATION = cell.relation;
        let xText = 0;
        let yText = 0;
        let text = "";
        const X1 = SIDE_LENGTH * COL_INDEX;
        const X2 = X1 + SIDE_LENGTH;
        const Y1 = SIDE_LENGTH * ROW_INDEX;
        const Y2 = Y1 + SIDE_LENGTH;
        if (FEATURE === CellFeature.Face) {
            let xTextOfSetInfo = 0;
            let yTextOfSetInfo = 0;
            text = `${SIX_FACE_NAME_CHARS[SIX_FACE]}${ACT_CELLS.filter((cell)=>cell.feature === CellFeature.Face && cell.sixFace === SIX_FACE).length > 1 ? LAYER_INDEX : ""}`;
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
                    break;
            }
            if (SIX_FACE === SixFace.Up && MAX_UP_FACE_LAYER_INDEX === LAYER_INDEX) {
                SvgHelper.appendText(svg, SET_TEXT_CSS, `${SET_NAME}.${SET_NO}`, xTextOfSetInfo, yTextOfSetInfo, TextDirections[FACE_DIRECTION], "", null, false);
            }
        } else if (FEATURE === CellFeature.Piece) {
            text = `${TWELVE_EDGE + 1}#${LAYER_INDEX}`;
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
                    break;
            }
            for (let lineIndex = 0; lineIndex < 3; ++lineIndex) {
                SvgHelper.appendLine(svg, CUT_LINE_CSS, X_ARRAY[lineIndex], X_ARRAY[lineIndex + 1], Y_ARRAY[lineIndex], Y_ARRAY[lineIndex + 1], null);
            }
        }
        SvgHelper.appendText(svg, FACE_TEXT_CSS, text, xText, yText, TextDirections[FEATURE === CellFeature.Piece ? RELATION : FACE_DIRECTION], "", null, false);
    });
    return svg;
}