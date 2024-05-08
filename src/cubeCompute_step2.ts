/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * src\cubeCompute_step2.ts v0.0.1
 * deno 1.42.1 + VSCode 1.88.0
 *
 * <en_us>
 * Created on Sat Apr 27 2024 23:35:47
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年4月27日 23:35:47
 * 功能：从第一步所获取的中间正方体开始，生成未进行1转24的正方体
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年4月27日 23:35:47
 * 功能：
 * </zh_tw>
 */

import { main } from "./cubeCompute.ts";

await main({
  step1Option: { skipped: true },
  step2Option: {},
  step3Option: { skipped: true },
  step4Option: { skipped: true },
}, [2, 3]);
