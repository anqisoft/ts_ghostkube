/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * _exec_step_2_to_4.ts
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

import { main } from "../cubeCompute.ts";

await main({
  step1Option: {
    skipped: true,

    // GOAL_FILE_TOP_PATH: "./",
    OUTPUT_CUT_MANNERS_ROW_BY_ROW: false,
    // GOAL_FILE_TOP_PATH: string = "./",
    // OUTPUT_CUT_MANNERS_ROW_BY_ROW: boolean = false,
  },
  step2Option: {
    skipped: false,

    // GOAL_FILE_TOP_PATH: "./",
    // SOURCE_FILE_TOP_PATH: "./",

    OUTPUT_ALONE_FIRST_CUBE: false,
    OUTPUT_CUBE_PASS_CHECK_FACES_LAYER_INDEX: false,
    OUTPUT_FIX_HIDDEN_PIECES_DETAILS: false,
    OUTPUT_FIX_HIDDEN_PIECES: false,
    OUTPUT_MIDDLE_CUBE_TO_FIRST_NO: false,
    OUTPUT_CHECK_FACES_LAYER_INDEX_FAILED: false,
    OUTPUT_FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT: false,
    OUTPUT_FIX_LONELY_FACE_OF_CUBE: false,
    // GOAL_FILE_TOP_PATH: string = "./",
    // SOURCE_FILE_TOP_PATH: string = "./",
    // OUTPUT_ALONE_FIRST_CUBE: boolean = false,
    // OUTPUT_CUBE_PASS_CHECK_FACES_LAYER_INDEX: boolean = false,
    // OUTPUT_FIX_HIDDEN_PIECES_DETAILS: boolean = false,
    // OUTPUT_FIX_HIDDEN_PIECES: boolean = false,
    // OUTPUT_MIDDLE_CUBE_TO_FIRST_NO: boolean = false,
    // OUTPUT_CHECK_FACES_LAYER_INDEX_FAILED: boolean = false,
    // OUTPUT_FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT: boolean = false,
    // OUTPUT_FIX_LONELY_FACE_OF_CUBE: boolean = false,
  },
  step3Option: {
    skipped: false,

    // GOAL_FILE_TOP_PATH: "./",
    // SOURCE_FILE_TOP_PATH: "cubesOnlyFirstOfTwentyFour",

    OUTPUT_FULL_CUBE: false,
    OUTPUT_READ_CUBE: false,
    SHOW_GET_CLONED_CUBE_BY_MANNER_INDEX_DETAIL: false,
    // GOAL_FILE_TOP_PATH: string = "./",
    // SOURCE_FILE_TOP_PATH: string = "cubesOnlyFirstOfTwentyFour",
    // OUTPUT_FULL_CUBE: boolean = false,
    // OUTPUT_READ_CUBE: boolean = false,
    // SHOW_GET_CLONED_CUBE_BY_MANNER_INDEX_DETAIL: boolean = false,
  },
  step4Option: {
    skipped: false,

    USE_LARGE_FILE: true,

    // GOAL_FILE_TOP_PATH: './',
    // SOURCE_FILE_TOP_PATH: './',

    SKIP_COUNT_CUBE: false,
    SKIP_COMPACT_LINE_INFO: false,
    SKIP_COMPACT_MANNER_FILES: false,
    OUTPUT_MANNER_BILL_FILE: false,
    // USE_LARGE_FILE: boolean = true,
    // GOAL_FILE_TOP_PATH: string = "./",
    // SOURCE_FILE_TOP_PATH: string = "./",
    // SKIP_COUNT_CUBE: boolean = false,
    // SKIP_COMPACT_LINE_INFO: boolean = false,
    // SKIP_COMPACT_MANNER_FILES: boolean = false,
    // OUTPUT_MANNER_BILL_FILE: boolean = false,
  },
}, [2, 3, 5]);

/*
cd /d E:\__cube\240508E_01

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\execCubeCompute\_exec_step_2_to_4.ts

cls && deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\execCubeCompute\_exec_step_2_to_4.ts

*/
