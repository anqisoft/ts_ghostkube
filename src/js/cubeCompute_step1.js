"use strict";
/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * src\cubeCompute_step1.ts v0.0.1
 * deno 1.42.1 + VSCode 1.88.0
 *
 * <en_us>
 * Created on Tue May 07 2024 09:26:27
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年5月7日 09:26:27
 * 功能：仅获取中间正方体，六面仅列出直接的六面，不列出由“插片”形成的面。
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年5月7日 09:26:27
 * 功能：
 * </zh_tw>
 */
exports.__esModule = true;
var cubeCompute_ts_1 = require("./cubeCompute.ts");
await cubeCompute_ts_1.main({
    step1Option: {},
    step2Option: { skipped: true },
    step3Option: { skipped: true },
    step4Option: { skipped: true }
}, [2, 3]);
