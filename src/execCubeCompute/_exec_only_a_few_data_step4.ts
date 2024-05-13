/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * _exec_only_a_few_data_step4.ts
 *
 * <en_us>
 * Created on Sat May 11 2024 07:07:27
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年5月11日 07:07:27
 * 功能：
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年5月11日 07:07:27
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
}, [2, 3]);

// false true
await main({
  step1Option: { skipped: true },
  step2Option: { skipped: true },
  step3Option: { skipped: true },
  step4Option: {
    skipped: false,

    USE_LARGE_FILE: true, // false true
    OUTPUT_MANNER_BILL_FILE: false,

    SKIP_COUNT_CUBE: false,
    SKIP_COMPACT_LINE_INFO: false,
    SKIP_COMPACT_MANNER_FILES: false,
  },
}, [2, 3]);

/*
cd /d E:\__cube\240511A_only_a_few_data\

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\execCubeCompute\_exec_only_a_few_data_step4.ts

cls && deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\execCubeCompute\_exec_only_a_few_data_step4.ts

*/
