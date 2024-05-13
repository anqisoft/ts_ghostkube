/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * _exec_rows_2_3_step_3_to_4.ts
 *
 * <en_us>
 * Created on Thu May 09 2024 15:15:44
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年5月9日 15:15:44
 * 功能：
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年5月9日 15:15:44
 * 功能：
 * </zh_tw>
 */

import { main } from "../cubeCompute.ts";

await main({
  step1Option: { skipped: true },
  step2Option: { skipped: true },
  step3Option: {},
  step4Option: {},
}, [2, 3]);

/*

cd /d E:\__cube\240511C_2rows_3rows
cls && deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\execCubeCompute\_exec_rows_2_3_step_3_to_4.ts

*/
