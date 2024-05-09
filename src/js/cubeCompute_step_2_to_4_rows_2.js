"use strict";
/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * cubeCompute_step_2_to_4_rows_2.ts
 *
 * <en_us>
 * Created on Thu May 09 2024 15:15:30
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年5月9日 15:15:30
 * 功能：
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年5月9日 15:15:30
 * 功能：
 * </zh_tw>
*/
exports.__esModule = true;
var cubeCompute_ts_1 = require("./cubeCompute.ts");
await cubeCompute_ts_1.main({
    step1Option: { skipped: true },
    step2Option: {
        OUTPUT_ALONE_FIRST_CUBE: true,
        OUTPUT_CUBE_PASS_CHECK_FACES_LAYER_INDEX: true,
        OUTPUT_FIX_HIDDEN_PIECES_DETAILS: true,
        OUTPUT_FIX_HIDDEN_PIECES: true,
        OUTPUT_MIDDLE_CUBE_TO_FIRST_NO: true,
        OUTPUT_CHECK_FACES_LAYER_INDEX_FAILED: true,
        OUTPUT_FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT: true,
        OUTPUT_FIX_LONELY_FACE_OF_CUBE: true
    },
    step3Option: {
        OUTPUT_FULL_CUBE: true,
        OUTPUT_READ_CUBE: true
    },
    step4Option: {
        USE_LARGE_FILE: false
    }
}, [2]);
/*
set src=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\

cls && deno lint %src%\cubeCompute_step_2_to_4_rows_2.ts && deno fmt %src%\cubeCompute_step_2_to_4_rows_2.ts

cd /d E:\__cube\240508E_01

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\cubeCompute_step_2_to_4_rows_2.ts

deno run --v8-flags=--max-old-space-size=20480 -A %src%\cubeCompute_step_2_to_4_rows_2.ts

cls && deno lint %src%\cubeCompute_step_2_to_4_rows_2.ts
cls && deno run --v8-flags=--max-old-space-size=20480 -A %src%\cubeCompute_step_2_to_4_rows_2.ts

*/
