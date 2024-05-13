/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * _exec_rows_2_3_step_3_quick.ts
 *
 * <en_us>
 * Created on Sat May 11 2024 13:48:45
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年5月11日 13:48:45
 * 功能：
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年5月11日 13:48:45
 * 功能：
 * </zh_tw>
 */

import { main } from "../cubeCompute.ts";

await main({
  step1Option: { skipped: true },
  step2Option: { skipped: true },
  step3Option: { MINI_OUTPUT: true },
  step4Option: { skipped: true },
}, [2, 3]);

/*

cd /d E:\__cube\240511C_2rows_3rows
cls && deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\execCubeCompute\_exec_rows_2_3_step_3_quick.ts

*/
