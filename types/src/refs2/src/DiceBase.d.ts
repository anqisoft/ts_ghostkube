import { I18nable } from '../node_modules/@dishanqian/h5_base/types/index.d.ts';
export default abstract class DiceBase {
    protected svg: SVGElement;
    protected SIDE_LENGTH: number;
    protected INNER_LINE_STYLE: string;
    protected OUTER_LINE_STYLE: string;
    protected viewBox: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    protected OPTIONS: object;
    protected mmToPxScale: number;
    protected infos: {
        content: I18nable | string;
        x: number;
        y: number;
        rotate: number | 'auto' | 'auto-reverse';
    }[];
    protected CONTENTS: (I18nable | string)[];
    protected PASTE_WIDTH: number;
    protected TEXT_STYLE: string;
    constructor(svg: SVGElement, SIDE_LENGTH: number, INNER_LINE_STYLE: string, OUTER_LINE_STYLE: string, viewBox: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    }, OPTIONS: object, mmToPxScale: number, infos: {
        content: I18nable | string;
        x: number;
        y: number;
        rotate: number | 'auto' | 'auto-reverse';
    }[], CONTENTS: (I18nable | string)[], PASTE_WIDTH?: number, TEXT_STYLE?: string);
    protected fixTextStyle(scale: number): void;
    draw(): void;
    protected setSvgTextInfo: any;
    protected appendLine: any;
    protected appendCircle: any;
    protected getSinByAngle(angle: number): number;
    protected getCosByAngle(angle: number): number;
    protected abstract drawGraphs(): void;
    protected abstract setTextsInfo(): void;
}
