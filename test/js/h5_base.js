// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const LANG_ARRAY = [
    'en',
    'zh_cn',
    'zh_tw'
];
const CHANGE_LANG_BUTTON_TEXT_MAP = {
    'en': 'EN',
    'zh_cn': '简',
    'zh_tw': '繁'
};
const DEFAULT_LANG = 'en';
const CURRENT_URL = window.location.href;
const HOME_URL = CURRENT_URL.startsWith('file:///') ? CURRENT_URL.substring(0, CURRENT_URL.lastIndexOf('/') + 1).concat('index.htm') : CURRENT_URL.split('/').splice(0, 3).join('/').concat('/');
const SITE_ROOT = HOME_URL.substring(0, HOME_URL.lastIndexOf('/') + 1);
const SITE_IMAGE_PATH = `${SITE_ROOT}images/`;
const SITE_JAVASCRIPT_PATH = `${SITE_ROOT}js/`;
const SITE_CSS_PATH = `${SITE_ROOT}css/`;
const getPageParameterByName = (name, defaultValue)=>{
    const REPLACED_CURRENT_URL = CURRENT_URL.replace('?', '&');
    return REPLACED_CURRENT_URL.indexOf(`&${name}=`) === -1 ? defaultValue || '' : decodeURIComponent(REPLACED_CURRENT_URL.split('&').slice(1).filter((keyValue)=>keyValue.startsWith(`${name}=`))[0].split('=')[1]);
};
const LANG_PROPERTY = 'data-lang';
const MONTH_FULL_NAME_ARRAY = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
const MONTH_NAME_ARRAY = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec'
];
function parsePageParamsFromUrl(url) {
    window.anqiH5PageData = window.anqiH5PageData || {
        LANG: DEFAULT_LANG,
        THICKESS: 0.2,
        A3: false,
        LANDSCAPE: false,
        PAGE_PADDING_TOP: 15,
        PAGE_PADDING_BOTTOM: 15,
        PAGE_PADDING_LEFT: 10,
        PAGE_PADDING_RIGHT: 10,
        PAPER_WIDTH: 0,
        PAPER_HEIGHT: 0,
        PAGE_WIDTH: 0,
        PAGE_HEIGHT: 0,
        NO: 1,
        MM_TO_PX_SCALE: 0,
        PX_TO_MM_SCALE: 0
    };
    const { anqiH5PageData } = window;
    url = url.replace('?', '&').toLowerCase();
    const keyValueArray = url.split('&').slice(1);
    function getValueByUrlParamName(key, defaultValue) {
        const SEARCH_STRING = `${key}=`;
        if (url.indexOf(SEARCH_STRING) === -1) {
            return defaultValue;
        }
        return keyValueArray.filter((keyValue)=>keyValue.startsWith(`${SEARCH_STRING}`))[0].split('=')[1];
    }
    const LANG_IN_URL = getValueByUrlParamName('lang', DEFAULT_LANG);
    const LANG = LANG_ARRAY.indexOf(LANG_IN_URL) === -1 ? DEFAULT_LANG : LANG_IN_URL;
    const THICKESS = Math.max(0, parseFloat(getValueByUrlParamName('thickess', '0.2')));
    const A3 = getValueByUrlParamName('a3', 'true') === 'true';
    const LANDSCAPE = getValueByUrlParamName('landscape', 'false') === 'true';
    const PAGE_PADDING_TOP = Math.max(0, parseFloat(getValueByUrlParamName('top', '15')));
    const PAGE_PADDING_LEFT = Math.max(0, parseFloat(getValueByUrlParamName('left', '10')));
    const NO = Math.max(0, parseInt(getValueByUrlParamName('no', '1')));
    const PAPER_WIDTH = parseFloat(getValueByUrlParamName('width', '0')) || (A3 ? LANDSCAPE ? 420 : 297 : LANDSCAPE ? 297 : 210);
    const PAPER_HEIGHT = parseFloat(getValueByUrlParamName('height', '0')) || (A3 ? LANDSCAPE ? 297 : 420 : LANDSCAPE ? 210 : 297);
    const PAGE_WIDTH = PAPER_WIDTH - PAGE_PADDING_LEFT * 2;
    const PAGE_HEIGHT = PAPER_HEIGHT - PAGE_PADDING_TOP * 2;
    anqiH5PageData.LANG = LANG;
    anqiH5PageData.THICKESS = THICKESS;
    anqiH5PageData.A3 = A3;
    anqiH5PageData.LANDSCAPE = LANDSCAPE;
    anqiH5PageData.PAGE_PADDING_TOP = PAGE_PADDING_TOP;
    anqiH5PageData.PAGE_PADDING_LEFT = PAGE_PADDING_LEFT;
    anqiH5PageData.PAPER_WIDTH = PAPER_WIDTH;
    anqiH5PageData.PAPER_HEIGHT = PAPER_HEIGHT;
    anqiH5PageData.PAGE_WIDTH = PAGE_WIDTH;
    anqiH5PageData.PAGE_HEIGHT = PAGE_HEIGHT;
    anqiH5PageData.NO = NO;
    const DPI_HELPER = new DPIHelper();
    anqiH5PageData.MM_TO_PX_SCALE = DPI_HELPER.getMmToPxScale();
    anqiH5PageData.PX_TO_MM_SCALE = DPI_HELPER.getPxToMmScale();
}
function getPageCss() {
    const { A3, LANDSCAPE, PAGE_PADDING_TOP, PAGE_PADDING_LEFT, PAGE_WIDTH, PAGE_HEIGHT } = window.anqiH5PageData;
    return `\@media print\{\@page\{size:${A3 ? 'A3' : 'A4'} ${LANDSCAPE ? 'landscape' : 'portrait'};\} \}
*\{margin:0;border:0;padding:0;\}
page:not(:last-of-type)\{page-break-after:always;\}
page\{padding-top:${PAGE_PADDING_TOP}mm;padding-left:${PAGE_PADDING_LEFT}mm;display:block;width:${PAGE_WIDTH}mm;height:${PAGE_HEIGHT}mm;position:relative;overflow:hidden;\}`;
}
function setF1Content(content) {
    document.onkeydown = function(e) {
        switch(e.keyCode){
            case 112:
                alert(content);
                e.preventDefault();
                e.stopPropagation();
                break;
            default:
                break;
        }
        return false;
    };
}
function getNumbersArray(min, max) {
    const array = [];
    for(let i = min; i <= max; ++i){
        array.push(i.toString());
    }
    return array;
}
const LOCAL_STORAGE_KEY_OF_LANG = 'lang';
const LOCAL_STORAGE_KEY_OF_CURRENT_PAGE = CURRENT_URL.includes('?') ? CURRENT_URL.split('?')[1] : CURRENT_URL;
const CHANGE_LANG_NOTIFY_ARRAY = [];
const getCurrentLang = ()=>localStorage.getItem(LOCAL_STORAGE_KEY_OF_LANG) || DEFAULT_LANG;
const setCurrentLang = (lang)=>{
    getHtmlElement().setAttribute(LANG_PROPERTY, lang);
    localStorage.setItem(LOCAL_STORAGE_KEY_OF_LANG, lang);
    updateUIByCurrentLang();
};
const updateUIByCurrentLang = ()=>{
    const lang = getCurrentLang();
    CHANGE_LANG_NOTIFY_ARRAY.forEach((func)=>func(lang));
};
const getCurrentPageLocalStorage = ()=>localStorage.getItem(LOCAL_STORAGE_KEY_OF_CURRENT_PAGE) || '';
const setCurrentPageLocalStorage = (newValue)=>localStorage.setItem(LOCAL_STORAGE_KEY_OF_CURRENT_PAGE, newValue);
const getChangeLangNotifyArrayOfCurrentPage = ()=>CHANGE_LANG_NOTIFY_ARRAY;
const clearChangeLangNotifyArrayOfCurrentPage = ()=>{
    CHANGE_LANG_NOTIFY_ARRAY.length = 0;
};
class DPIHelper {
    dpiArray = [];
    dpiX = 0;
    mmToPxScale = 0;
    pxToMmScale = 0;
    constructor(){
        const screen = window.screen;
        const { dpiArray } = this;
        if (screen.deviceXDPI) {
            dpiArray.push(screen.deviceXDPI);
            dpiArray.push(screen.deviceYDPI);
        } else {
            const div = document.createElement('div');
            div.style.cssText = 'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden';
            document.body.appendChild(div);
            dpiArray.push(parseInt(div.offsetWidth.toString()));
            dpiArray.push(parseInt(div.offsetHeight.toString()));
            document.body.removeChild(div);
        }
        const dpiX = dpiArray[0];
        this.dpiX = dpiX;
        this.mmToPxScale = dpiX / 25.4;
        this.pxToMmScale = 25.4 / dpiX;
    }
    convertPxToMm = (px)=>px / this.dpiX * 25.4;
    convertMmToPx = (mm)=>mm / 25.4 * this.dpiX;
    getMmToPxScale = ()=>this.mmToPxScale;
    getPxToMmScale = ()=>this.pxToMmScale;
}
function isI18nable(object) {
    return typeof object !== 'undefined' && object !== null && typeof object !== 'string' && typeof object.en === 'string' && typeof object.zh_cn === 'string' && typeof object.zh_tw === 'string';
}
function getHtmlFromI18nable(object) {
    return `<en>${object.en}</en><zh_cn>${object.zh_cn}</zh_cn><zh_tw>${object.zh_tw}</zh_tw>`;
}
function hide(element) {
    if (element) element.style.display = 'none';
}
function showBlock(element) {
    if (element) element.style.display = 'block';
}
function showInlineBlock(element) {
    if (element) element.style.display = 'inline-block';
}
function showFlex(element) {
    if (element) element.style.display = 'flex';
}
function showInlineFlex(element) {
    if (element) element.style.display = 'inline-flex';
}
function getElementById(id) {
    return document.getElementById(id);
}
function getElementByIdAndTagName(id, _tagName) {
    return document.getElementById(id);
}
function querySelectorAll(selectors) {
    return document.querySelectorAll(selectors);
}
function querySelectorAllByI18n() {
    return document.querySelectorAll('[i18n]');
}
function querySelectorAllByI18nPlaceholder() {
    return document.querySelectorAll('[i18n-placeholder]');
}
function getElementsByTagName(qualifiedName) {
    return document.getElementsByTagName(qualifiedName);
}
function getHeadElement() {
    return document.getElementsByTagName('head')[0];
}
function getHtmlElement() {
    return document.getElementsByTagName('html')[0];
}
function getBodyElement() {
    return document.getElementsByTagName('body')[0];
}
function getTitleElement() {
    return document.getElementsByTagName('title')[0];
}
function getHeaderElement() {
    return document.getElementsByTagName('header')[0];
}
function getFooterElement() {
    return document.getElementsByTagName('footer')[0];
}
function getMainElement() {
    return document.getElementsByTagName('main')[0];
}
function createElement(tagName, options) {
    return document.createElement(tagName, options);
}
function setAttributesOfA(aElement, link) {
    aElement.setAttribute('href', link);
    if (!link.startsWith('mailto:')) {
        aElement.setAttribute('target', '_blank');
    }
}
function stopEventBubble(event) {
    event.cancelBubble = true;
    event.preventDefault();
    event.stopPropagation();
    return false;
}
function getI18nInnerHTML({ en, zh_cn, zh_tw }) {
    return `<en>${en}</en><zh_cn>${zh_cn}</zh_cn><zh_tw>${zh_tw}</zh_tw>`;
}
function getI18nInnerHTMLFromDate(date) {
    const en = `${MONTH_NAME_ARRAY[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    const zh_cn = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const zh_tw = zh_cn;
    return `<en>${en}</en><zh_cn>${zh_cn}</zh_cn><zh_tw>${zh_tw}</zh_tw>`;
}
function createPageElement() {
    return document.createElement('page');
}
function createSvgElement(html, width, height) {
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.innerHTML = html;
    svgElement.setAttribute('version', '1.1');
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgElement.setAttribute('width', `${width}mm`);
    svgElement.setAttribute('height', `${height}mm`);
    return {
        svgElement,
        width,
        height
    };
}
function createSvgGElement(html, width, height) {
    const gElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gElement.innerHTML = html;
    gElement.setAttribute('width', `${width}mm`);
    gElement.setAttribute('height', `${height}mm`);
    return {
        gElement,
        width,
        height
    };
}
function createSvgAndGElement({ html, width, height }) {
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('version', '1.1');
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgElement.setAttribute('width', `${width}mm`);
    svgElement.setAttribute('height', `${height}mm`);
    const gElement = createSvgGElement(html, width, height).gElement;
    svgElement.appendChild(gElement);
    return {
        svgElement,
        gElement,
        width,
        height
    };
}
function appendSvgAndG(parentElement, info, options) {
    const { abs, sin, cos, PI } = Math;
    const { svgElement, gElement, width, height } = info;
    const { left, right, top, bottom, degree } = options;
    const { PAGE_WIDTH, PAGE_HEIGHT } = window.anqiH5PageData;
    const x = 'undefined' !== typeof left ? left : PAGE_WIDTH - width - right;
    const y = 'undefined' !== typeof top ? top : PAGE_HEIGHT - height - bottom;
    parentElement.appendChild(svgElement);
    svgElement.setAttribute('x', `${x}mm`);
    svgElement.setAttribute('y', `${y}mm`);
    if (!degree) return;
    gElement.setAttribute('transform', `rotate(${degree})`);
    gElement.style.transformOrigin = '50% 50%';
    if (degree === 180 || degree === -180) return;
    let newWidth = 0, newHeight = 0, gTranslateScaleX = 1, gTranslateScaleY = 1, xScale = 1, yScale = 1;
    if (degree <= -90) {
        const newDegree = -90 - degree;
        const radian = PI * newDegree / 180;
        newWidth = width * sin(radian) + height * cos(radian);
        newHeight = width * cos(radian) + height * sin(radian);
        xScale = -1;
        yScale = -1;
        gTranslateScaleX = -1;
        gTranslateScaleY = 1;
    } else if (degree < 0) {
        const newDegree = -degree;
        const radian = PI * newDegree / 180;
        newWidth = width * cos(radian) + height * sin(radian);
        newHeight = width * sin(radian) + height * cos(radian);
        xScale = -1;
        yScale = 1;
        gTranslateScaleX = 1;
        gTranslateScaleY = 1;
    } else if (degree <= 90) {
        const radian = PI * degree / 180;
        newWidth = width * cos(radian) + height * sin(radian);
        newHeight = width * sin(radian) + height * cos(radian);
        xScale = -1;
        yScale = -1;
        gTranslateScaleX = 1;
        gTranslateScaleY = -1;
    } else if (degree < 180) {
        const newDegree = degree - 90;
        const radian = PI * newDegree / 180;
        newWidth = width * cos(radian) + height * sin(radian);
        newHeight = width * sin(radian) + height * cos(radian);
        xScale = -1;
        yScale = 1;
        gTranslateScaleX = 1;
        gTranslateScaleY = 1;
    }
    const DELTA_WIDTH = newWidth - width;
    const DELTA_HEIGHT = newHeight - height;
    const HALF_DELTA_WIDTH = DELTA_WIDTH * 0.5;
    const HALF_DELTA_HEIGHT = DELTA_HEIGHT * 0.5;
    const G_DELTA_X = HALF_DELTA_WIDTH * gTranslateScaleX;
    const G_DELTA_Y = HALF_DELTA_HEIGHT * gTranslateScaleY;
    if (newWidth < 0 || newHeight < 0) {
        console.log({
            degree,
            cos: cos(degree),
            sin: sin(degree),
            newWidth,
            newHeight,
            x,
            HALF_DELTA_WIDTH,
            fixValueByRight: 'undefined' !== typeof right ? 2 : 1,
            newX: x + HALF_DELTA_WIDTH * ('undefined' !== typeof right ? 2 : 1),
            y,
            HALF_DELTA_HEIGHT,
            newY: y + HALF_DELTA_HEIGHT,
            G_DELTA_X,
            G_DELTA_Y
        });
    }
    svgElement.setAttribute('width', `${newWidth}mm`);
    svgElement.setAttribute('height', `${newHeight}mm`);
    svgElement.setAttribute('x', `${x + HALF_DELTA_WIDTH * xScale * ('undefined' !== typeof right ? 2 : 1)}mm`);
    svgElement.setAttribute('y', `${y + HALF_DELTA_HEIGHT * yScale}mm`);
    gElement.style.translate = `${G_DELTA_X}mm ${G_DELTA_Y}mm`;
}
function createTopSvgElement() {
    const { PAGE_WIDTH, PAGE_HEIGHT } = window.anqiH5PageData;
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('version', '1.1');
    svgElement.setAttribute('width', `${PAGE_WIDTH}mm`);
    svgElement.setAttribute('height', `${PAGE_HEIGHT}mm`);
    return svgElement;
}
const SVG_NS = 'http://www.w3.org/2000/svg';
const SVG_XLINKNS = 'http://www.w3.org/1999/xlink';
class SvgHelper {
    static createSvg = ()=>{
        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('version', '1.1');
        svg.setAttribute('xmlns', SVG_NS);
        svg.setAttribute('xmlns:xlink', SVG_XLINKNS);
        return svg;
    };
    static createSvgPath = ()=>{
        return document.createElementNS(SVG_NS, 'path');
    };
    static appendLine(svg, STYLE, x1, x2, y1, y2, viewBox) {
        const line = document.createElementNS(SVG_NS, 'line');
        line.setAttribute('x1', `${x1}mm`);
        line.setAttribute('x2', `${x2}mm`);
        line.setAttribute('y1', `${y1}mm`);
        line.setAttribute('y2', `${y2}mm`);
        if (viewBox) {
            viewBox.left = Math.min(viewBox.left, x1, x2);
            viewBox.right = Math.max(viewBox.right, x1, x2);
            viewBox.top = Math.min(viewBox.top, y1, y2);
            viewBox.bottom = Math.max(viewBox.bottom, y1, y2);
        }
        line.setAttribute('style', STYLE);
        svg.appendChild(line);
    }
    static appendCircle(svg, STYLE, cx, cy, radius, viewBox) {
        const circle = document.createElementNS(SVG_NS, 'circle');
        circle.setAttribute('cx', `${cx}mm`);
        circle.setAttribute('cy', `${cy}mm`);
        circle.setAttribute('r', `${radius}mm`);
        circle.setAttribute('fill', '#ffffff');
        if (viewBox) {
            viewBox.left = Math.min(viewBox.left, cx - radius);
            viewBox.right = Math.max(viewBox.right, cx + radius);
            viewBox.top = Math.min(viewBox.top, cy - radius);
            viewBox.bottom = Math.max(viewBox.bottom, cy + radius);
        }
        circle.setAttribute('style', STYLE);
        svg.appendChild(circle);
    }
    static appendTspan(text, STYLE, CHAR, dx, dy) {
        if (typeof dx === 'number') {
            dx = `${dx}mm`;
        }
        if (typeof dy === 'number') {
            dy = `${dy}mm`;
        }
        const tspan = document.createElementNS(SVG_NS, 'tspan');
        tspan.setAttribute('dx', `${dx}`);
        tspan.setAttribute('dy', `${dy}`);
        tspan.setAttribute('style', STYLE.concat('dominant-baseline:middle;text-anchor:middle;', CHAR === '6' || CHAR === '9' ? 'text-decoration:underline;' : '', CHAR === 'ü' ? 'opacity:0.85;font-size:0.9em;' : ''));
        tspan.innerHTML = CHAR;
        text.appendChild(tspan);
    }
    static appendText(svg, STYLE, content, x, y, rotate, transformOrigin, viewBox, maybeNumber = false) {
        const text = document.createElementNS(SVG_NS, 'text');
        text.setAttribute('x', `${x}mm`);
        text.setAttribute('y', `${y}mm`);
        svg.appendChild(text);
        if (isI18nable(content)) {
            content = content;
            content = `<en>${content.en}</en><zh_cn>${content.zh_cn}</zh_cn><zh_tw>${content.zh_tw}</zh_tw>`;
        }
        content = content;
        if (content.indexOf('<en>') > -1) {
            const lang = getCurrentLang();
            const startTag = `<${lang}>`;
            const endTag = `</${lang}>`;
            if (content.indexOf(startTag) > -1) {
                content = content.split(startTag)[1].split(endTag)[0];
            }
        }
        content = content.replace(/<br \/>/gi, '<br/>').replace(/<br\/>/gi, '<br>').replace(/\\n/gi, '<br>');
        if (content.indexOf('<br>') > -1) {
            const fontSize = STYLE.indexOf('font-size:') > -1 ? STYLE.split('font-size:')[1].split(';')[0] : '2mm';
            const unit = fontSize.replace(/[0-9.]/gi, '');
            const dyNumber = parseFloat(fontSize.replace(unit, ''));
            const segs = content.split('<br>');
            let lastLength = 0;
            const dyOffset = `${dyNumber}${unit}`;
            segs.forEach((seg, index)=>{
                SvgHelper.appendTspan(text, '', seg, index ? `-${lastLength}em` : '0', index ? dyOffset : '0');
                lastLength = seg.length;
            });
        } else {
            if (maybeNumber) {
                content.split('').forEach((__char, index)=>{
                    SvgHelper.appendTspan(text, '', __char, '0', '0');
                });
            } else {
                SvgHelper.appendTspan(text, '', content, '0', '0');
            }
        }
        if (viewBox) {
            const clientRects = text.getClientRects();
            const { left: x1, right: x2, top: y1, bottom: y2 } = clientRects.length ? clientRects.item(0) : text.getBoundingClientRect();
            viewBox.left = Math.min(viewBox.left, x1, x2);
            viewBox.right = Math.max(viewBox.right, x1, x2);
            viewBox.top = Math.min(viewBox.top, y1, y2);
            viewBox.bottom = Math.max(viewBox.bottom, y1, y2);
        }
        STYLE = STYLE.concat('dominant-baseline:middle;text-anchor:middle;'.concat(rotate ? `transform: rotate(${rotate}deg);transform-origin:${x}mm ${y}mm;` : ''));
        text.setAttribute('style', STYLE);
    }
    static setSvgTextInfo(info, x, y, rotate) {
        info.x = x;
        info.y = y;
        info.rotate = rotate;
    }
    static appendOuterPath(svg, WIDTH, HEIGHT, mmToPxScale, OUTER_LINE_COLOR) {
        svg.setAttribute('width', `${WIDTH}mm`);
        svg.setAttribute('height', `${HEIGHT}mm`);
        const WIDTH_PX = mmToPxScale * WIDTH;
        const HEIGHT_PX = mmToPxScale * HEIGHT;
        const path = SvgHelper.createSvgPath();
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', OUTER_LINE_COLOR);
        path.setAttribute('d', `M 0, 0 `.concat(`h ${WIDTH_PX} `, `v ${HEIGHT_PX} `, `h -${WIDTH_PX} `, ' z'));
        svg.appendChild(path);
    }
    static appendOuterLine(svg, WIDTH, HEIGHT, OUTER_LINE_STYLE) {
        svg.setAttribute('width', `${WIDTH}mm`);
        svg.setAttribute('height', `${HEIGHT}mm`);
        const { appendLine } = SvgHelper;
        appendLine(svg, OUTER_LINE_STYLE, 0, WIDTH, 0, 0, null);
        appendLine(svg, OUTER_LINE_STYLE, 0, WIDTH, HEIGHT, HEIGHT, null);
        appendLine(svg, OUTER_LINE_STYLE, 0, 0, 0, HEIGHT, null);
        appendLine(svg, OUTER_LINE_STYLE, WIDTH, WIDTH, 0, HEIGHT, null);
    }
    static getTextStyleFontSizePatchCss(NUMBER, TEXT_STYLE) {
        if (NUMBER > 99 && TEXT_STYLE.indexOf('font-size:') > -1) {
            const fontSizeSeg = TEXT_STYLE.split('font-size:')[1].split(';')[0];
            const fontUnit = fontSizeSeg.replace(/[0-9\.\-]/g, '');
            const fontValue = parseFloat(fontSizeSeg.replace(fontUnit, ''));
            return `font-size:${fontValue * 2 / NUMBER.toString().length}${fontUnit};`;
        }
        return '';
    }
}
const convertDateToYYYYMMDD_hhmmss = (date)=>{
    return `${date.getFullYear()}${'0'.concat((date.getMonth() + 1).toString()).substr(-2)}${'0'.concat(date.getDate().toString()).substr(-2)}`.concat(`_${'0'.concat(date.getHours().toString()).substr(-2)}${'0'.concat(date.getMinutes().toString()).substr(-2)}${'0'.concat(date.getSeconds().toString()).substr(-2)}`);
};
function pushSameValueTimes(array, value, times) {
    for(let i = 0; i < times; ++i){
        array.push(value);
    }
}
function repeatString(original, times) {
    const array = [];
    for(let i = 0; i <= times; ++i){
        array.push(original);
    }
    return array.join();
}
function getArrayRepeatSameValue(value, times) {
    const array = [];
    for(let i = 0; i < times; ++i){
        array.push(value);
    }
    return array;
}
const getI18nableWithSameContent = (value)=>{
    return {
        en: value,
        zh_cn: value,
        zh_tw: value
    };
};
