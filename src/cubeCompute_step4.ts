/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * src\cubeCompute_step4.ts v0.0.1
 * deno 1.42.1 + VSCode 1.88.0
 *
 * <en_us>
 * Created on Sun Apr 29 2024 08:47:00
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年4月29日 08:47:00
 * 功能：从第三步结果开始，进行一系列合并与分析操作：
 *       1. lines.txt，将4677537行去重，且列出正方体序号段（不知道为什么最后有不连续的序号），
 *          转为lineToCubeNo.txt文件，444442222244444422324433234:1-5,8-10
 *       2. cubes/*.txt（3655 files），每文件30720个正方体，此文件夹不需处理，可直接反算文件名
 *          Math.ceil((cube.no - 0.5) / 30720).toString().padStart(6, '0').concat('.txt')
 *       3. manners/*.txt（3655 files）：合并到内存中，最后再排序后输出单个文件
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年4月29日 08:47:00
 * 功能：
 * </zh_tw>
 */

import { main } from "./cubeCompute.ts";

await main({
  step1Option: { skipped: true },
  step2Option: { skipped: true },
  step3Option: { skipped: true },
  step4Option: { USE_LARGE_FILE: true },
});
