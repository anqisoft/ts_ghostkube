"use strict";
/// <reference types="../types/src/cubeCore.d.ts" />
/// <reference types="../node_modules/@dishanqian/h5_base/types/index.d.ts" />
function setDynamicCss(PAGE_WIDTH, PAGE_HEIGHT, MAX_X, MAX_Y, PAGE_LEFT, PAGE_TOP) {
    const css = `@media print { @page { size: ${PAGE_WIDTH}mm ${PAGE_HEIGHT}mm; } }
* { border: 0;  padding: 0; margin: 0; }
html, body { overflow: hidden; width: ${PAGE_WIDTH}mm; }
body{font-family: 'Times New Roman', 'Kaiti', 'PingFang';}
page {width: ${MAX_X}mm; height: ${MAX_Y}mm;padding-left:${PAGE_LEFT}mm;padding-top:${PAGE_TOP}mm;}
page {display:flex;flex-direction:column;flex-wrap:wrap;align-content:flex-start;}
page:not(:last-of-type){page-break-after:always;}
`;
    // tspan{text-decoration:underline;}
    // line { stroke: #888; stroke-width: 0.1mm; stroke-dasharray: 3 2;}
    document.getElementById('dynamicStyle')
        .innerText = css;
}
function setDocumentTitle(PAGE_WIDTH, PAGE_HEIGHT, SIDE_LENGTH, PAGE_LEFT, PAGE_RIGHT, PAGE_TOP, PAGE_BOTTOM, FILE_NAME_MIDDLE, FILE_NAME_POSTFIX) {
    let title = `${(((PAGE_WIDTH === 420 && PAGE_HEIGHT === 297) ||
        (PAGE_WIDTH === 297 && PAGE_HEIGHT === 420))
        ? 'A3'
        : (((PAGE_WIDTH === 210 && PAGE_HEIGHT === 297) ||
            (PAGE_WIDTH === 297 && PAGE_HEIGHT === 210))
            ? 'A4'
            : `width${PAGE_WIDTH}mm_height${PAGE_HEIGHT}mm`))}_${SIDE_LENGTH}mm_${FILE_NAME_MIDDLE}_`;
    if (((PAGE_LEFT === 5 && PAGE_RIGHT === 5) ||
        (PAGE_LEFT === 4.5 && PAGE_RIGHT === 4.5) ||
        (PAGE_LEFT === 4 && PAGE_RIGHT === 4) ||
        (PAGE_LEFT === 3.5 && PAGE_RIGHT === 3.5) ||
        (PAGE_LEFT === 3 && PAGE_RIGHT === 3)) &&
        ((PAGE_TOP === 5 && PAGE_BOTTOM === 5) ||
            (PAGE_TOP === 4.5 && PAGE_BOTTOM === 4.5) ||
            (PAGE_TOP === 4 && PAGE_BOTTOM === 4) ||
            (PAGE_TOP === 3.5 && PAGE_BOTTOM === 3.5) ||
            (PAGE_TOP === 3 && PAGE_BOTTOM === 3))) {
        title += 'L1300.pdf';
    }
    else if (!PAGE_LEFT && !PAGE_RIGHT && !PAGE_TOP && !PAGE_BOTTOM) {
        title += 'zero_margins.pdf';
    }
    else {
        title += `left${PAGE_LEFT}mm_right${PAGE_RIGHT}mm_top${PAGE_TOP}mm_bottom${PAGE_BOTTOM}mm.pdf`;
    }
    document.getElementsByTagName('title')[0].innerText = (FILE_NAME_POSTFIX || '').length
        ? title.replace('.pdf', `_${FILE_NAME_POSTFIX}.pdf`)
        : title;
}
function getSvg(options) {
    const { id: ID, // : string;
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
    setTextCss: SET_TEXT_CSS, } = options;
    const svg = SvgHelper.createSvg();
    svg.id = ID;
    // const HALF_CIRCLE_RADIUS = CIRCLE_RADIUS * 0.5;
    // const HALF_CIRCLE_RADIUS_AND_TEXT_OFFSET = TEXT_OFFSET + HALF_CIRCLE_RADIUS;
    // const HALF_CIRCLE_RADIUS_AND_TWICE_TEXT_OFFSET = TEXT_OFFSET * 2 + HALF_CIRCLE_RADIUS;
    const CUBE = CUBES.filter((cube) => cube.no === CUBE_NO)[0];
    const { actCells: ACT_CELLS, lines: LINES, } = CUBE;
    const { gridLines: GRID_LINES } = CUBE;
    const { style } = svg;
    const { rowCount: ROW_COUNT, colCount: COL_COUNT } = CUBE;
    const MAX_COL_INDEX = COL_COUNT - 1;
    const SVG_WIDTH = SIDE_LENGTH * COL_COUNT;
    const SVG_HEIGHT = SIDE_LENGTH * ROW_COUNT;
    style.width = `${SVG_WIDTH}mm`;
    style.height = `${SVG_HEIGHT}mm`;
    // console.log({
    // 	ID,
    // 	SVG_WIDTH,
    // 	SVG_HEIGHT,
    // });
    const HALF_SIDE_LENGTH = SIDE_LENGTH * 0.5;
    const EMPTY_CELL_HOLE_RADIUS = Math.min(CIRCLE_RADIUS * 2, HALF_SIDE_LENGTH * 0.75);
    for (let rowIndex = 0; rowIndex < ROW_COUNT; ++rowIndex) {
        const Y = SIDE_LENGTH * rowIndex + HALF_SIDE_LENGTH;
        for (let colIndex = 0; colIndex < COL_COUNT; ++colIndex) {
            if (!ACT_CELLS.filter((cell) => cell.rowIndex === rowIndex && cell.colIndex === colIndex).length) {
                SvgHelper.appendCircle(svg, CUT_LINE_CSS, SIDE_LENGTH * colIndex + HALF_SIDE_LENGTH, Y, EMPTY_CELL_HOLE_RADIUS, null);
            }
        }
    }
    if (GRID_LINES) {
        GRID_LINES.forEach(({ xStart, xEnd, yStart, yEnd, lineStyle }) => {
            SvgHelper.appendLine(svg, lineStyle === CellBorderLine.InnerLine
                ? INNER_LINE_CSS
                : (lineStyle === CellBorderLine.OuterLine ? OUTER_LINE_CSS : CUT_LINE_CSS), SIDE_LENGTH * xStart, SIDE_LENGTH * xEnd, SIDE_LENGTH * yStart, SIDE_LENGTH * yEnd, null);
        });
    }
    else {
        // 四外框+内部线条
        SvgHelper.appendLine(svg, OUTER_LINE_CSS, 0, SVG_WIDTH, 0, 0, null);
        SvgHelper.appendLine(svg, OUTER_LINE_CSS, 0, SVG_WIDTH, SVG_HEIGHT, SVG_HEIGHT, null);
        SvgHelper.appendLine(svg, OUTER_LINE_CSS, SVG_WIDTH, SVG_WIDTH, 0, SVG_HEIGHT, null);
        SvgHelper.appendLine(svg, OUTER_LINE_CSS, SVG_WIDTH, SVG_WIDTH, 0, SVG_HEIGHT, null);
        const HORIZONRAL_LINE_COUNT = COL_COUNT * (ROW_COUNT - 1);
        // const VERTICAL_LINE_COUNT = MAX_COL_INDEX * ROW_COUNT;
        // 2222244444223433234
        const HORIZONTAL_LINES_ARRAY = [];
        LINES.substring(0, HORIZONRAL_LINE_COUNT).split('').map((value) => parseInt(value)).forEach((lineStyle, index) => {
            const xStart = index % COL_COUNT;
            const xEnd = xStart + 1;
            const yStart = Math.floor(index / COL_COUNT) + 1;
            const yEnd = yStart;
            SvgHelper.appendLine(svg, lineStyle === CellBorderLine.InnerLine
                ? INNER_LINE_CSS
                : (lineStyle === CellBorderLine.OuterLine ? OUTER_LINE_CSS : CUT_LINE_CSS), SIDE_LENGTH * xStart, SIDE_LENGTH * xEnd, SIDE_LENGTH * yStart, SIDE_LENGTH * yEnd, null);
            HORIZONTAL_LINES_ARRAY.push(`${xStart}${xEnd}${yStart}${yEnd}${lineStyle}`);
        });
        const VERTICAL_LINES_ARRAY = [];
        LINES.substring(HORIZONRAL_LINE_COUNT, LINES.length).split('').map((value) => parseInt(value)).forEach((lineStyle, index) => {
            const xStart = index % MAX_COL_INDEX + 1;
            const xEnd = xStart;
            const yStart = Math.floor(index / MAX_COL_INDEX);
            const yEnd = yStart + 1;
            SvgHelper.appendLine(svg, lineStyle === CellBorderLine.InnerLine
                ? INNER_LINE_CSS
                : (lineStyle === CellBorderLine.OuterLine ? OUTER_LINE_CSS : CUT_LINE_CSS), SIDE_LENGTH * xStart, SIDE_LENGTH * xEnd, SIDE_LENGTH * yStart, SIDE_LENGTH * yEnd, null);
            VERTICAL_LINES_ARRAY.push(`${xStart}${xEnd}${yStart}${yEnd}${lineStyle}`);
        });
        console.log(HORIZONTAL_LINES_ARRAY, VERTICAL_LINES_ARRAY);
    }
    // const LINE_INFO_ARRAY: string[] = [];
    // const MAX_UP_FACE_LAYER_INDEX = Math.max(
    //   ACT_CELLS.filter((cell) =>
    //     cell.feature === CellFeature.Face && cell.sixFace === SixFace.Up
    //   ).map((cell) => cell.layerIndex),
    // );
    // let maxUpFaceLayerIndex = 0;
    // ACT_CELLS.filter(
    //   (cell) => cell.feature === CellFeature.Face && cell.sixFace === SixFace.Up,
    // ).forEach(
    //   (cell) =>
    //     maxUpFaceLayerIndex = Math.max(maxUpFaceLayerIndex, cell.layerIndex),
    // );
    // const MAX_UP_FACE_LAYER_INDEX = maxUpFaceLayerIndex;
    // const MAX_UP_FACE_LAYER_INDEX = ACT_CELLS.filter(
    // 	(cell) => cell.feature === CellFeature.Face && cell.sixFace === SixFace.Up,
    // ).map((cell) => cell.layerIndex).sort((prev, next) => prev - next)
    // 	.reverse()[0];
    const MAX_UP_FACE_LAYER_INDEX = ACT_CELLS.filter((cell) => cell.feature === CellFeature.Face && cell.sixFace === SixFace.Up).map((cell) => cell.layerIndex).sort((prev, next) => next - prev)[0];
    ACT_CELLS.forEach((cell) => {
        const { layerIndex: LAYER_INDEX, 
        // addOrder,
        // relatedInformationWhenAdding: {
        // 	// rowIndex,
        // 	// colIndex,
        // 	relation: RELATION,
        // },
        feature: FEATURE, sixFace: SIX_FACE, faceDirection: FACE_DIRECTION, twelveEdge: TWELVE_EDGE, 
        // borderLines: BORDER_LINES,
        rowIndex: ROW_INDEX, colIndex: COL_INDEX, } = cell;
        // const RELATION = cell.relatedInformationWhenAdding
        //   ? cell.relatedInformationWhenAdding.relation
        //   : cell.relation;
        const RELATION = cell.relation;
        let xText = 0;
        let yText = 0;
        let text = '';
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
            // text = `${SIX_FACE_NAME_CHARS[SIX_FACE]}${LAYER_INDEX}`;
            // // 仅超过一层的写层号
            // text = `${SIX_FACE_NAME_CHARS[SIX_FACE]}${
            // 	ACT_CELLS.filter(
            // 			(cell) => cell.feature === CellFeature.Face && cell.sixFace === SIX_FACE,
            // 		).length > 1
            // 		? LAYER_INDEX
            // 		: ''
            // }`;
            // 	<en_us>en_us</en_us>
            // 	<zh_cn>240514，新算法：若使用精简模式，则最上面的层省略文字（除套装信息外）</zh_cn>
            // 	<zh_tw>zh_tw</zh_tw>
            if (SIMPLEST) {
                if (LAYER_INDEX < ACT_CELLS.filter((cell) => cell.feature === CellFeature.Face && cell.sixFace === SIX_FACE).map((cell) => cell.layerIndex).sort((prev, next) => next - prev)[0]) {
                    text = `${SIX_FACE_NAME_CHARS[SIX_FACE]}${LAYER_INDEX}`;
                }
            }
            else {
                text = `${SIX_FACE_NAME_CHARS[SIX_FACE]}${ACT_CELLS.filter((cell) => cell.feature === CellFeature.Face && cell.sixFace === SIX_FACE).length > 1
                    ? LAYER_INDEX
                    : ''}`;
            }
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
                SvgHelper.appendText(svg, SET_TEXT_CSS, `${SET_NAME}.${SET_NO}`, xTextOfSetInfo, yTextOfSetInfo, TextDirections[FACE_DIRECTION], '', null, false);
            }
        }
        else if (FEATURE === CellFeature.Piece) {
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
                    xText = X1 + SIDE_LENGTH * 0.5 + TEXT_OFFSET;
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
                    xText = X1 + SIDE_LENGTH * 0.5 - TEXT_OFFSET;
                    yText = Y1 + SIDE_LENGTH * 0.5;
                    break;
                default:
                    // unreachable
                    break;
            }
            for (let lineIndex = 0; lineIndex < 3; ++lineIndex) {
                SvgHelper.appendLine(svg, CUT_LINE_CSS, X_ARRAY[lineIndex], X_ARRAY[lineIndex + 1], Y_ARRAY[lineIndex], Y_ARRAY[lineIndex + 1], null);
            }
        }
        SvgHelper.appendText(svg, FACE_TEXT_CSS, text, xText, yText, TextDirections[FEATURE === CellFeature.Piece ? RELATION : FACE_DIRECTION], '', null, false);
    });
    return svg;
}
