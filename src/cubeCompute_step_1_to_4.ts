/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * cubeCompute_step_1_to_4.ts
 *
 * <en_us>
 * Created on Wed May 08 2024 22:24:35
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年5月8日 22:24:35
 * 功能：
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年5月8日 22:24:35
 * 功能：
 * </zh_tw>
 */

import { main } from "./cubeCompute.ts";

// await main({
//   step1Option: {},
//   step2Option: {},
//   step3Option: {},
//   step4Option: {},
// }, [2, 3]);

await main({
  step1Option: { OUTPUT_CUT_MANNERS_ROW_BY_ROW: true },
  step2Option: {},
  step3Option: {},
  step4Option: {},
}, [2]);
