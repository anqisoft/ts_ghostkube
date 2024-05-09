"use strict";
/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * cubeCompute_step_2_to_4.ts
 *
 * <en_us>
 * Created on Wed May 08 2024 22:29:39
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年5月8日 22:29:39
 * 功能：
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年5月8日 22:29:39
 * 功能：
 * </zh_tw>
 */
exports.__esModule = true;
var cubeCompute_ts_1 = require("./cubeCompute.ts");
// await main({
//   step1Option: { skipped: true },
//   // step2Option: {},
//   step3Option: {},
//   step4Option: {},
// }, [2]);
// await main({
//   step1Option: { skipped: true },
//   step2Option: {
//     OUTPUT_ALONE_FIRST_CUBE: true,
//     OUTPUT_CUBE_PASS_CHECK_FACES_LAYER_INDEX: true,
//     OUTPUT_FIX_HIDDEN_PIECES_DETAILS: true,
//     OUTPUT_FIX_HIDDEN_PIECES: true,
//     OUTPUT_MIDDLE_CUBE_TO_FIRST_NO: true,
//     OUTPUT_CHECK_FACES_LAYER_INDEX_FAILED: true,
//     OUTPUT_FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT: true,
//     OUTPUT_FIX_LONELY_FACE_OF_CUBE: true,
//   },
//   step3Option: {
//     OUTPUT_FULL_CUBE: true,
//     OUTPUT_READ_CUBE: true,
//   },
//   step4Option: {
//     USE_LARGE_FILE: false,
//   },
// }, [2]);
await cubeCompute_ts_1.main({
    step1Option: { skipped: true },
    step2Option: {
    // OUTPUT_ALONE_FIRST_CUBE: true,
    // OUTPUT_CUBE_PASS_CHECK_FACES_LAYER_INDEX: true,
    // OUTPUT_FIX_HIDDEN_PIECES_DETAILS: true,
    // OUTPUT_FIX_HIDDEN_PIECES: true,
    // OUTPUT_MIDDLE_CUBE_TO_FIRST_NO: true,
    // OUTPUT_CHECK_FACES_LAYER_INDEX_FAILED: true,
    // OUTPUT_FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT: true,
    // OUTPUT_FIX_LONELY_FACE_OF_CUBE: true,
    },
    step3Option: {
    // OUTPUT_FULL_CUBE: true,
    // OUTPUT_READ_CUBE: true,
    },
    step4Option: {
        USE_LARGE_FILE: true
    }
}, [2, 3]);
