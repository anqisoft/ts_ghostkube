"use strict";
/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * src\cubeCompute_step3.ts v0.0.1
 * deno 1.42.1 + VSCode 1.88.0
 *
 * <en_us>
 * Created on Sun Apr 29 2024 08:47:00
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年4月29日 08:47:00
 * 功能：从第二步正方体（已拆解剪切与粘贴方案，但未1转24），1转24，写入：
 *       1. 每种拼插方案对应的正方体编号清单（以拼插方案命名），回车符分隔
 *          最大编号112260888，最多11,2260,8880字数据，约11亿字
 *       2. 每24个正方体（以1转24的第一个计算）一组，计算纸模完整横纵线，回车符分隔
 *          1）两行五列则15=5*(2+1)横12=(5+1)*2纵共27线；
 *          2）三行五列则20=5*(3+1)横18=(5+1)*3纵共38线。
 *          最大编号112260888，4677537组，最多1,8242,3943字数据，约2亿字
 *       3. 输出压缩后的正方体信息（正方体间以回车符分隔，4位一格，16进制）：
 *          1）1位：格序（1位，0-15，16进制0-E）
 *          2）1位：功能（1位，2-3，2面3片，减2乘6）+层序（1位，1-6转0-5），转1位16进制
 *          3）1位：面序或片序——面序0-5，片序0-11，转1位十六进制
 *          4）1位：方向序，0-3
 *          最多4*15+1=61位一个，最大编号112260888，最多68,4791,4168字数据，约68亿字，
 *          不确定是否19G左右
 *       4. 最终数据量约100亿字，预计20-30G
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年4月29日 08:47:00
 * 功能：
 * </zh_tw>
 */
exports.__esModule = true;
var cubeCompute_ts_1 = require("./cubeCompute.ts");
await cubeCompute_ts_1.main({
    step1Option: { skipped: true },
    step2Option: { skipped: true },
    step3Option: {},
    step4Option: { skipped: true }
});
