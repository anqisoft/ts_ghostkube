/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * src\cubeCompute_step4.ts v0.0.1
 * deno 1.42.1 + VSCode 1.88.0
 *
 * <en_us>
  * Creation: April 29, 2024 08:47:00
  * Function: Starting from the third step, perform a series of mergers and analysis operations:
  * 1. LINES.TXT, weigh 4677537, and list the square serial number segment (I don’t know why there are discontinuous serial numbers in the end),
  * Turn to Linetocubeno.txt file, 44444222222244444444433234: 1-5, 8-10
  ?
  * Math.ceil ((CUBE.NO -0.5) / 30720) .tring (). Padstart (6, '0'). Concat ('. Txt')
  * 3. Manners/*. TXT (3655 Files): merge into memory, and finally output a single file
  * </en_us>
 *
 * <zh_cn>
 * 创建：2024年4月29日 08:47:00
 * 功能：从第三步结果开始，进行一系列合并与分析操作：
 *       1. lines.txt，将4677537行去重，且列出正方体序号段（不知道为什么最后有不连续的序号），
 *          转为lineToCubeNo.txt文件，444442222244444422324433234:1-5,8-10
 *       2. cubes/*.txt（3655 files），每文件30720个正方体，此文件夹不需处理，可直接反算文件名
 *          Math.ceil((cube.no - 0.5) / 30720).toString().padStart(6, '0').concat('.txt')
 *       3. manners/*.txt（3655 files）：合并到内存中，最后再排序后输出单个文件
 * </zh_cn>
 *
 * <zh_tw>
  * 創建：2024年4月29日 08:47:00
  * 功能：從第三步結果開始，進行一系列合併與分析操作：
  *       1. lines.txt，將4677537行去重，且列出正方體序號段（不知道為什麼最後有不連續的序號），
  *          轉為lineToCubeNo.txt文件，444442222244444422324433234:1-5,8-10
  *       2. cubes/*.txt（3655 files），每文件30720個正方體，此文件夾不需處理，可直接反算文件名
  *          Math.ceil((cube.no - 0.5) / 30720).toString().padStart(6, '0').concat('.txt')
  *       3. manners/*.txt（3655 files）：合併到內存中，最後再排序後輸出單個文件
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
    skipped: true,
    
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
set src=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\

cls && deno lint %src%\cubeCompute_step4.ts && deno fmt %src%\cubeCompute_step4.ts

cd /d E:\__cube\240508E_01

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\cubeCompute_step4.ts

deno run --v8-flags=--max-old-space-size=20480 -A %src%\cubeCompute_step4.ts

cls && deno lint %src%\cubeCompute_step4.ts
cls && deno run --v8-flags=--max-old-space-size=20480 -A %src%\cubeCompute_step4.ts

*/
