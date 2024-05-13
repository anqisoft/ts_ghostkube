/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * _exec_rows_2_step_4.ts
 *
 * <en_us>
 * Created on Fri May 10 2024 23:34:09
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年5月10日 23:34:09
 * 功能：
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年5月10日 23:34:09
 * 功能：
 * </zh_tw>
 */

import { main } from "../cubeCompute.ts";

await main({
  step1Option: { skipped: true },
  step2Option: { skipped: true },
  step3Option: { skipped: true },
  step4Option: {
    skipped: false,

    USE_LARGE_FILE: false,
    OUTPUT_MANNER_BILL_FILE: true,
  },
}, [2]);

/*
cd /d E:\__cube\240511B_rows_2_only

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\execCubeCompute\_exec_rows_2_step_4.ts

cls && deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\execCubeCompute\_exec_rows_2_step_4.ts

*/
