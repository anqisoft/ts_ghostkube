/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * _exec_rows_2_step_2.ts
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

import { main } from "../cubeCompute.ts";

await main({
  step1Option: { skipped: true },
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
  step3Option: { skipped: true },
  step4Option: { skipped: true },
}, [2]);

/*
cd /d E:\__cube\240511B_rows_2_only

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\execCubeCompute\_exec_rows_2_step_2.ts

cls && deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\execCubeCompute\_exec_rows_2_step_2.ts

*/
