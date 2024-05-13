/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * manners_2rows_3rows_3rows.ts
 *
 * <en_us>
 * Created on Mon May 13 2024 20:18:55
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年5月13日 20:18:55
 * 功能：
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年5月13日 20:18:55
 * 功能：
 * </zh_tw>
 */

import { log, logUsedTime, showUsedTime } from "../log.ts";
import { main } from "./manners_mini_output.ts";

(globalThis as unknown as { LOG_FILE_NAME: string }).LOG_FILE_NAME =
  "./manners_2rows_3rows.log.txt";
const GOAL_FILE = "../js/data_manners_2rows_3rows.js";

log(`begin: ${(new Date()).toLocaleString()}`);
const DATE_BEGIN = performance.now();

showUsedTime("init");
try {
  main("C:\\__cube\\2rows_3rows\\", [], GOAL_FILE, true, "~", true);
} catch (error) {
  log("[error]", error);
}
showUsedTime("done");

log(`end: ${(new Date()).toLocaleString()}`);
logUsedTime("Total", performance.now() - DATE_BEGIN);
log("");

/*
set test=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\test\240513\
cls && deno lint %test%\manners_2rows_3rows.ts && deno fmt %test%\manners_2rows_3rows.ts
cls && deno run --v8-flags=--max-old-space-size=20480 -A manners_2rows_3rows.ts
*/
