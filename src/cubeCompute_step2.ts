/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * src\cubeCompute_step2.ts v0.0.1
 * deno 1.42.1 + VSCode 1.88.0
 *
 * <en_us>
  * Creation: 23:35:47, April 27, 2024
  * Function: Starting from the intermediate cube obtained in the first step, the cube with no 1 to 24 is generated
  * </en_us>
 *
 * <zh_cn>
 * 创建：2024年4月27日 23:35:47
 * 功能：从第一步所获取的中间正方体开始，生成未进行1转24的正方体
 * </zh_cn>
 *
 * <zh_tw>
  * 創建：2024年4月27日 23:35:47
  * 功能：從第一步所獲取的中間正方體開始，生成未進行1轉24的正方體
  * </zh_tw>
 */

import { main } from "./cubeCompute.ts";

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
    skipped: true,
    
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
    skipped: true,
    
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
set src=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\

cls && deno lint %src%\cubeCompute_step2.ts && deno fmt %src%\cubeCompute_step2.ts

cd /d E:\__cube\240508E_01

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\cubeCompute_step2.ts

deno run --v8-flags=--max-old-space-size=20480 -A %src%\cubeCompute_step2.ts

cls && deno lint %src%\cubeCompute_step2.ts
cls && deno run --v8-flags=--max-old-space-size=20480 -A %src%\cubeCompute_step2.ts

*/
