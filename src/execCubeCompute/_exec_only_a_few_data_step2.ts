/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * _exec_only_a_few_data_step2.ts
 *
 * <en_us>
 * Created on Fri May 10 2024 11:06:07
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年5月10日 11:06:07
 * 功能：
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年5月10日 11:06:07
 * 功能：
 * </zh_tw>
 */

import { main } from "../cubeCompute.ts";

await main({
  step1Option: {
    skipped: true,

    OUTPUT_CUT_MANNERS_ROW_BY_ROW: false,
  },
  step2Option: {
    skipped: false,

    OUTPUT_ALONE_FIRST_CUBE: true,
    OUTPUT_CUBE_PASS_CHECK_FACES_LAYER_INDEX: true,
    OUTPUT_FIX_HIDDEN_PIECES_DETAILS: true,
    OUTPUT_FIX_HIDDEN_PIECES: true,
    OUTPUT_MIDDLE_CUBE_TO_FIRST_NO: true,
    OUTPUT_CHECK_FACES_LAYER_INDEX_FAILED: true,
    OUTPUT_FIX_LONELY_FACE_OF_CUBE_AND_APPEND_IT: true,
    OUTPUT_FIX_LONELY_FACE_OF_CUBE: true,
  },
  step3Option: {
    skipped: true,

    OUTPUT_FULL_CUBE: true,
    OUTPUT_READ_CUBE: true,
    SHOW_GET_CLONED_CUBE_BY_MANNER_INDEX_DETAIL: true,
  },
  step4Option: {
    skipped: true,

    USE_LARGE_FILE: false,
    OUTPUT_MANNER_BILL_FILE: true,
  },
}, [2, 3]);

/*
cd /d E:\__cube\240511A_only_a_few_data\

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\execCubeCompute\_exec_only_a_few_data_step2.ts

cls && deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\execCubeCompute\_exec_only_a_few_data_step2.ts

*/
