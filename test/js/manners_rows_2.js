"use strict";
// v0.0.1
exports.__esModule = true;
var log_ts_1 = require("./log.ts");
var manners_ts_1 = require("./manners.ts");
globalThis.LOG_FILE_NAME =
    "./manners_rows_2.log.txt";
var GOAL_FILE = "./js/data_manners_rows_2.js";
log_ts_1.log("begin: " + (new Date()).toLocaleString());
var DATE_BEGIN = performance.now();
log_ts_1.showUsedTime("init");
try {
    await manners_ts_1.done("E:\\__cube\\240508D\\test_02\\", GOAL_FILE);
}
catch (error) {
    log_ts_1.log("[error]", error);
}
log_ts_1.showUsedTime("done");
log_ts_1.log("end: " + (new Date()).toLocaleString());
log_ts_1.logUsedTime("Total", performance.now() - DATE_BEGIN);
log_ts_1.log("");
/*
set pwd=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\test
cls && deno lint %pwd%\manners_rows_2.ts && deno fmt %pwd%\manners_rows_2.ts
cls && deno run --v8-flags=--max-old-space-size=20480 -A manners_rows_2.ts
*/