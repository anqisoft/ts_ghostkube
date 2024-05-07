/*
    file:///P:/anqi/Desktop/tech/ts/projects/203_ts_ghostkube/src/_onlyLines/anySize.htm?width=210&height=297&left=0&right=0&top=0&bottom=0&side=5

    file:///P:/anqi/Desktop/tech/ts/projects/203_ts_ghostkube/src/_onlyLines/anySize.htm?width=210&height=216&left=0&right=0&top=0&bottom=0&side=5
*/

/// <references path="../../node_modules/@dishanqian/h5_base/types/index.d.ts" /> ///
declare const getPageParameterByName: (name: string, defaultValue: string)=> string;

window.onload = () => {
    const SIDE_LENGTH = parseInt(getPageParameterByName('side', '10'));

    const PAGE_WIDTH = parseFloat(getPageParameterByName('width', '210'));
    const PAGE_HEIGHT = parseFloat(getPageParameterByName('height', '297'));

    const PAGE_LEFT = parseFloat(getPageParameterByName('left', '5'));
    const PAGE_RIGHT = parseFloat(getPageParameterByName('right', '5'));
    const PAGE_TOP = parseFloat(getPageParameterByName('top', '3.5'));
    const PAGE_BOTTOM = parseFloat(getPageParameterByName('bottom', '3.5'));

    const MIN_X = 0;
    const MAX_X = PAGE_WIDTH - PAGE_LEFT - PAGE_RIGHT;

    const MIN_Y = 0;
    const MAX_Y = PAGE_HEIGHT - PAGE_TOP - PAGE_BOTTOM;

    const ROW_COUNT = Math.floor(MAX_Y / SIDE_LENGTH);
    const COL_COUNT = Math.floor(MAX_X / SIDE_LENGTH);

    let html = '';
    for (let rowIndex = 0; rowIndex <= ROW_COUNT; ++rowIndex) {
      const Y = SIDE_LENGTH * rowIndex;
      const X_SEG = ` x1="${MIN_X}mm" x2="${MAX_X}mm"`;
      html += `<line ${X_SEG} y1="${Y}mm" y2="${Y}mm" />`;
    }
    for (let colIndex = 0; colIndex <= COL_COUNT; ++colIndex) {
      const X = SIDE_LENGTH * colIndex;
      const Y_SEG = ` y1="${MIN_Y}mm" y2="${MAX_Y}mm"`;
      html += `<line x1="${X}mm" x2="${X}mm" ${Y_SEG} />`;
    }

    const SVG_ELEMENT = (document.getElementById('svg') as unknown as SVGElement);
    SVG_ELEMENT.innerHTML = html;

    const SVG_ELEMENT_STYLE = SVG_ELEMENT.style;
    SVG_ELEMENT_STYLE.marginLeft = `${PAGE_LEFT}mm`;
    SVG_ELEMENT_STYLE.marginRight = `${PAGE_RIGHT}mm`;
    SVG_ELEMENT_STYLE.marginTop = `${PAGE_TOP}mm`;
    SVG_ELEMENT_STYLE.marginBottom = `${PAGE_BOTTOM}mm`;

    SVG_ELEMENT_STYLE.width = `${MAX_X}mm`;
    SVG_ELEMENT_STYLE.height = `${MAX_Y}mm`;
    // console.log(SVG_ELEMENT_STYLE);

    let title = `${
        (
            ((PAGE_WIDTH === 420 && PAGE_HEIGHT === 297) || (PAGE_WIDTH === 297 && PAGE_HEIGHT === 420))
            ? 'A3'
            : (
                ((PAGE_WIDTH === 210 && PAGE_HEIGHT === 297) || (PAGE_WIDTH === 297 && PAGE_HEIGHT === 210))
                ? 'A4'
                : `width${PAGE_WIDTH}mm_height${PAGE_HEIGHT}mm`
            )
        )
    }_${SIDE_LENGTH}mm_lines_`;
    if (
        (
          (PAGE_LEFT === 5 && PAGE_RIGHT === 5)
          || (PAGE_LEFT === 4.5 && PAGE_RIGHT === 4.5)
          || (PAGE_LEFT === 4 && PAGE_RIGHT === 4)
          || (PAGE_LEFT === 3.5 && PAGE_RIGHT === 3.5)
          || (PAGE_LEFT === 3 && PAGE_RIGHT === 3)
        )
        &&
        (
          (PAGE_TOP === 5 && PAGE_BOTTOM === 5)
          || (PAGE_TOP === 4.5 && PAGE_BOTTOM === 4.5)
          || (PAGE_TOP === 4 && PAGE_BOTTOM === 4)
          || (PAGE_TOP === 3.5 && PAGE_BOTTOM === 3.5)
          || (PAGE_TOP === 3 && PAGE_BOTTOM === 3)
        )
     ) {
        title += 'L1300.pdf';
    } else if (!PAGE_LEFT  && !PAGE_RIGHT  && !PAGE_TOP && !PAGE_BOTTOM) {
        title += 'zero_margins.pdf';
    } else {
      title += `left${PAGE_LEFT}mm_right${PAGE_RIGHT}mm_top${PAGE_TOP}mm_bottom${PAGE_BOTTOM}mm.pdf`;
    }
    document.getElementsByTagName('title')[0].innerText = title;

    let css = `
@media print {
    @page {
        size: ${PAGE_WIDTH}mm ${PAGE_HEIGHT}mm;
    }
}

* {
    border: 0;
    padding: 0;
    margin: 0;
}

html,
body {
    overflow: hidden;
    width: ${PAGE_WIDTH}mm;
    height: ${PAGE_HEIGHT}mm;
}

line {
    stroke: #888;
    stroke-width: 0.1mm;
    /* stroke-dasharray: 3 2; */
}`;
    (document.getElementById('dynamicStyle') as unknown as HTMLStyleElement).innerText = css;


    window.print();
  };