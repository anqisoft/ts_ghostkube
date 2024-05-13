/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * _exec_rows_3_part_step_3_to_4.ts
 *
 * <en_us>
 * Created on Fri May 10 2024 10:16:22
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年5月10日 10:16:22
 * 功能：
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年5月10日 10:16:22
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
    skipped: true,

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
    skipped: false,

    OUTPUT_FULL_CUBE: true,
    OUTPUT_READ_CUBE: true,
    SHOW_GET_CLONED_CUBE_BY_MANNER_INDEX_DETAIL: true,
  },
  step4Option: {
    skipped: false,

    USE_LARGE_FILE: false,
    OUTPUT_MANNER_BILL_FILE: true,
  },
}, [3]);

/*
cd /d E:\__cube\240510B

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\execCubeCompute\_exec_rows_3_part_step_3_to_4.ts


cls && deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\execCubeCompute\_exec_rows_3_part_step_3_to_4.ts

*/
