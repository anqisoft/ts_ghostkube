import { I18nable } from '../node_modules/@dishanqian/h5_base/types/index.d.ts';
/**
 * <en>Dice Type</en>
 * <zh_cn>骰子类型</zh_cn>
 * <zh_tw>骰子類型</zh_tw>
 */
export declare enum DiceKind {
    /**
     * <en>None</en>
     * <zh_cn>无</zh_cn>
     * <zh_tw>無</zh_tw>
     */
    none = 0,
    /**
     * <en>4-sided dice</en>
     * <zh_cn>4面骰子</zh_cn>
     * <zh_tw>4面骰子</zh_tw>
     */
    four = 1,
    /**
     * <en>6-sided dice</en>
     * <zh_cn>6面骰子</zh_cn>
     * <zh_tw>6面骰子</zh_tw>
     */
    six = 2,
    /**
     * <en>8-sided dice</en>
     * <zh_cn>8面骰子</zh_cn>
     * <zh_tw>8面骰子</zh_tw>
     */
    eight = 4,
    /**
     * <en>12-sided dice</en>
     * <zh_cn>12面骰子</zh_cn>
     * <zh_tw>12面骰子</zh_tw>
     */
    twelve = 8,
    /**
     * <en>20-sided dice</en>
     * <zh_cn>20面骰子</zh_cn>
     * <zh_tw>20面骰子</zh_tw>
     */
    twenty = 16,
    /**
     * <en>24-sided dice</en>
     * <zh_cn>24面骰子</zh_cn>
     * <zh_tw>24面骰子</zh_tw>
     */
    twentyFour = 32,
    /**
     * <en>10-sided dice</en>
     * <zh_cn>10面骰子</zh_cn>
     * <zh_tw>10面骰子</zh_tw>
     */
    ten = 64,
    /**
     * <en>14-sided dice</en>
     * <zh_cn>14面骰子</zh_cn>
     * <zh_tw>14面骰子</zh_tw>
     */
    fourteen = 128,
    /**
     * <en>16-sided dice</en>
     * <zh_cn>16面骰子</zh_cn>
     * <zh_tw>16面骰子</zh_tw>
     */
    sixteen = 256,
    /**
     * <en>26-sided dice</en>
     * <zh_cn>26面骰子</zh_cn>
     * <zh_tw>26面骰子</zh_tw>
     */
    twentySix = 512,
    /**
     * <en>60-sided dice</en>
     * <zh_cn>60面骰子</zh_cn>
     * <zh_tw>60面骰子</zh_tw>
     */
    sixty = 1024
}
/**
 * <en>Count of Dice Type</en>
 * <zh_cn>骰子类型数量</zh_cn>
 * <zh_tw>骰子類型數量</zh_tw>
 */
export declare const DiceKindCount = 11;
/**
 * <en>Default Value of Dice Type</en>
 * <zh_cn>骰子类型默认值</zh_cn>
 * <zh_tw>骰子類型默認值</zh_tw>
 */
export declare const DefaultDiceKind = 2047;
/**
 * <en>Dice Generation Parameters</en>
 * <zh_cn>骰子生成参数</zh_cn>
 * <zh_tw>骰子生成參數</zh_tw>
 */
export interface DiceParameter {
    /**
     * <en>Id</en>
     * <zh_cn>id</zh_cn>
     * <zh_tw>id</zh_tw>
     */
    id: string;
    /**
     * <en>Dice Type</en>
     * <zh_cn>骰子类型</zh_cn>
     * <zh_tw>骰子類型</zh_tw>
     */
    diceKind: DiceKind;
    /**
     * <en>Side Length</en>
     * <zh_cn>边长</zh_cn>
     * <zh_tw>邊長</zh_tw>
     */
    sideLength: number;
    /**
     * <en>Contents of all sides</en>
     * <zh_cn>各面内容</zh_cn>
     * <zh_tw>各面內容</zh_tw>
     */
    contents: Array<I18nable | string>;
    /**
     * <en>Outside Boundary Line Style</en>
     * <zh_cn>外边界线样式</zh_cn>
     * <zh_tw>外邊界線樣式</zh_tw>
     */
    outerLineStyle: string;
    /**
     * <en>Interior Line Style</en>
     * <zh_cn>内部线样式</zh_cn>
     * <zh_tw>內部線樣式</zh_tw>
     */
    innerLineStyle: string;
    /**
     * <en>Text Style</en>
     * <zh_cn>文本样式</zh_cn>
     * <zh_tw>文字樣式</zh_tw>
     */
    textStyle: string;
    /**
     * <en>Other parameters</en>
     * <zh_cn>其它参数</zh_cn>
     * <zh_tw>其它參數</zh_tw>
     */
    options: object;
}
/**
 * <en>Dice Generation Result</en>
 * <zh_cn>骰子生成结果</zh_cn>
 * <zh_tw>骰子生成結果</zh_tw>
 */
export interface DiceResult {
    /**
     * <en>Svg Element Id</en>
     * <zh_cn>svg元素编号</zh_cn>
     * <zh_tw>svg元素編號</zh_tw>
     */
    id: string;
    /**
     * <en>Svg Element</en>
     * <zh_cn>svg元素</zh_cn>
     * <zh_tw>svg元素</zh_tw>
     */
    svg: SVGElement | HTMLElement;
    /**
     * <en>css</en>
     * <zh_cn>样式表</zh_cn>
     * <zh_tw>樣式表</zh_tw>
     */
    css: string;
}
/**
 * <en>Dice Generator</en>
 * <zh_cn>骰子生成器</zh_cn>
 * <zh_tw>骰子生成器</zh_tw>
 */
export declare class DiceGenerator {
    /**
     * <en>Generate dice in batch</en>
     * <zh_cn>批量生成骰子</zh_cn>
     * <zh_tw>批量生成骰子</zh_tw>
     * @param createParameters
     * <en>Arrays: creating parameters</en>
     * <zh_cn>数组：创建参数</zh_cn>
     * <zh_tw>數組：創建參數</zh_tw>
     * @returns
     * <en>Generate results in array format, used to combine complete html</en>
     * <zh_cn>生成结果，为数组格式，用于组合完整的html</zh_cn>
     * <zh_tw>生成結果，為數組格式，用於組合完整的html</zh_tw>
     */
    batchCreate(createParameters: Array<DiceParameter>): Array<DiceResult>;
    /**
     * <en>Generate a single dice</en>
     * <zh_cn>生成单个骰子</zh_cn>
     * <zh_tw>生成單個骰子</zh_tw>
     * @param param0
     * <en>Deconstructed creation parameters</en>
     * <zh_cn>已解构的创建参数</zh_cn>
     * <zh_tw>已解構的創建參數</zh_tw>
     * @returns
     * <en>Generate results, used to combine complete html</en>
     * <zh_cn>生成结果，用于组合完整的html</zh_cn>
     * <zh_tw>生成結果，用於組合完整的html</zh_tw>
     */
    create({ id, diceKind, sideLength: SIDE_LENGTH, contents: CONTENTS, outerLineStyle: OUTER_LINE_STYLE, innerLineStyle: INNER_LINE_STYLE, textStyle: TEXT_STYLE, options: OPTIONS, }: DiceParameter): DiceResult;
    private createSvg;
}
