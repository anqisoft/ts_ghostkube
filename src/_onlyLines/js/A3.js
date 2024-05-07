window.onload = function () {
    var SIDE_LENGTH = parseInt(getPageParameterByName('side', '10'));
    var PAGE_LEFT = parseFloat(getPageParameterByName('left', '5'));
    var PAGE_RIGHT = parseFloat(getPageParameterByName('right', '5'));
    var PAGE_TOP = parseFloat(getPageParameterByName('top', '3.5'));
    var PAGE_BOTTOM = parseFloat(getPageParameterByName('bottom', '3.5'));
    var MIN_X = 0;
    var MAX_X = 420 - PAGE_LEFT - PAGE_RIGHT;
    var MIN_Y = 0;
    var MAX_Y = 297 - PAGE_TOP - PAGE_BOTTOM;
    var ROW_COUNT = Math.floor(MAX_Y / SIDE_LENGTH);
    var COL_COUNT = Math.floor(MAX_X / SIDE_LENGTH);
    var html = '';
    for (var rowIndex = 0; rowIndex <= ROW_COUNT; ++rowIndex) {
        var Y = SIDE_LENGTH * rowIndex;
        var X_SEG = " x1=\"" + MIN_X + "mm\" x2=\"" + MAX_X + "mm\"";
        html += "<line " + X_SEG + " y1=\"" + Y + "mm\" y2=\"" + Y + "mm\" />";
    }
    for (var colIndex = 0; colIndex <= COL_COUNT; ++colIndex) {
        var X = SIDE_LENGTH * colIndex;
        var Y_SEG = " y1=\"" + MIN_Y + "mm\" y2=\"" + MAX_Y + "mm\"";
        html += "<line x1=\"" + X + "mm\" x2=\"" + X + "mm\" " + Y_SEG + " />";
    }
    var SVG_ELEMENT = document.getElementById('svg');
    SVG_ELEMENT.innerHTML = html;
    var SVG_ELEMENT_STYLE = SVG_ELEMENT.style;
    SVG_ELEMENT_STYLE.marginLeft = PAGE_LEFT + "mm";
    SVG_ELEMENT_STYLE.marginRight = PAGE_RIGHT + "mm";
    SVG_ELEMENT_STYLE.marginTop = PAGE_TOP + "mm";
    SVG_ELEMENT_STYLE.marginBottom = PAGE_BOTTOM + "mm";
    SVG_ELEMENT_STYLE.width = MAX_X + "mm";
    SVG_ELEMENT_STYLE.height = MAX_Y + "mm";
    // console.log(SVG_ELEMENT_STYLE);
    var title = "A3_" + SIDE_LENGTH + "mm_lines_";
    if (((PAGE_LEFT === 5 && PAGE_RIGHT === 5)
        || (PAGE_LEFT === 4.5 && PAGE_RIGHT === 4.5)
        || (PAGE_LEFT === 4 && PAGE_RIGHT === 4)
        || (PAGE_LEFT === 3.5 && PAGE_RIGHT === 3.5)
        || (PAGE_LEFT === 3 && PAGE_RIGHT === 3))
        &&
            ((PAGE_TOP === 5 && PAGE_BOTTOM === 5)
                || (PAGE_TOP === 4.5 && PAGE_BOTTOM === 4.5)
                || (PAGE_TOP === 4 && PAGE_BOTTOM === 4)
                || (PAGE_TOP === 3.5 && PAGE_BOTTOM === 3.5)
                || (PAGE_TOP === 3 && PAGE_BOTTOM === 3))) {
        title += 'L1300.pdf';
    }
    else if (!PAGE_LEFT && !PAGE_RIGHT && !PAGE_TOP && !PAGE_BOTTOM) {
        title += 'zero_margins.pdf';
    }
    else {
        title += "left" + PAGE_LEFT + "mm_right" + PAGE_RIGHT + "mm_top" + PAGE_TOP + "mm_bottom" + PAGE_BOTTOM + "mm.pdf";
    }
    document.getElementsByTagName('title')[0].innerText = title;
    window.print();
};
