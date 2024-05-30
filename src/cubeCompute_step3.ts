/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * src\cubeCompute_step3.ts v0.0.1
 * deno 1.42.1 + VSCode 1.88.0
 *
 * <en_us>
  * Creation: April 29, 2024 08:47:00
  * Function: From the second step (disassembled, cutting and paste scheme, but not 1 to 24), 1 to 24, write:
  * 1. The square number list corresponding to each insertion scheme (named after the insertion scheme), separate the carriage return symbol
  * Maximum number 112260888, up to 11,2260,8880 words, about 1.1 billion words
  * 2. One group per 24 square meters (the first calculation of 1 to 24), calculate the complete horizontal vertical line of the paper mold, and separate
  *1) Two lines and five columns are 15 = 5*(2+1) horizontal 12 = (5+1)*2 in total 27 lines;
  *2) Three -line and five columns 20 = 5*(3+1) horizontal 18 = (5+1)*3 Total 38 lines.
  * Maximum number 112260888, 4677537, up to 1,8242,3943 words, about 200 million words
  * 3. Output compression square square information (separated by the carriage runes between the square body, a 4 -bit, hexadecimal):
  * 1) 1 digit: grid order (1 digit, 0-15, 16 advanced 0-e)
  * 2) 1 digit: function (1 bit, 2-3, 2 sides and 3 pieces, 2 multiplication 6)+layer (1, 1-6 rpm 0-5), turn 1 hexadecimal
  * 3) 1 digit: face order or sequence-noodle sequence 0-5, film order 0-11, transition 1 digit hexadecimal production
  * 4) 1 bit: direction order, 0-3
  * At least 4* 15+1 = 61 -bit, maximum number 112260888, up to 68,4791,4168 words, about 6.8 billion words,
  * Not sure if it is about 19g
  * 4. The final data amount is about 10 billion words, and it is expected to be 20-30g
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
  * 功能：從第二步正方體（已拆解剪切與粘貼方案，但未1轉24），1轉24，寫入：
  *       1. 每種拼插方案對應的正方體編號清單（以拼插方案命名），回車符分隔
  *          最大編號112260888，最多11,2260,8880字數據，約11億字
  *       2. 每24個正方體（以1轉24的第一個計算）一組，計算紙模完整橫縱線，回車符分隔
  *          1）兩行五列則15=5*(2+1)橫12=(5+1)*2縱共27線；
  *          2）三行五列則20=5*(3+1)橫18=(5+1)*3縱共38線。
  *          最大編號112260888，4677537組，最多1,8242,3943字數據，約2億字
  *       3. 輸出壓縮後的正方體信息（正方體間以回車符分隔，4位一格，16進制）：
  *          1）1位：格序（1位，0-15，16進制0-E）
  *          2）1位：功能（1位，2-3，2面3片，減2乘6）+層序（1位，1-6轉0-5），轉1位16進制
  *          3）1位：面序或片序——面序0-5，片序0-11，轉1位十六進制
  *          4）1位：方向序，0-3
  *          最多4*15+1=61位一個，最大編號112260888，最多68,4791,4168字數據，約68億字，
  *          不確定是否19G左右
  *       4. 最終數據量約100億字，預計20-30G
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

cls && deno lint %src%\cubeCompute_step3.ts && deno fmt %src%\cubeCompute_step3.ts

cd /d E:\__cube\240508E_01

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\cubeCompute_step3.ts

deno run --v8-flags=--max-old-space-size=20480 -A %src%\cubeCompute_step3.ts

cls && deno lint %src%\cubeCompute_step3.ts
cls && deno run --v8-flags=--max-old-space-size=20480 -A %src%\cubeCompute_step3.ts

*/
