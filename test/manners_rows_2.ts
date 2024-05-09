// v0.0.1

import { log, logUsedTime, showUsedTime } from "./log.ts";
import { done } from "./manners.ts";

(globalThis as unknown as { LOG_FILE_NAME: string }).LOG_FILE_NAME =
  "./manners_rows_2.log.txt";
const GOAL_FILE = "./js/data_manners_rows_2.js";

log(`begin: ${(new Date()).toLocaleString()}`);
const DATE_BEGIN = performance.now();

showUsedTime("init");
try {
  done("E:\\__cube\\240508E\\", GOAL_FILE, true, "R2");
} catch (error) {
  log("[error]", error);
}
showUsedTime("done");

log(`end: ${(new Date()).toLocaleString()}`);
logUsedTime("Total", performance.now() - DATE_BEGIN);
log("");

/*
set pwd=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\test
cls && deno lint %pwd%\manners_rows_2.ts && deno fmt %pwd%\manners_rows_2.ts
cls && deno run --v8-flags=--max-old-space-size=20480 -A manners_rows_2.ts
*/
