"use strict";
// v0.0.1
exports.__esModule = true;
var log_ts_1 = require("./log.ts");
var ghostkubes_ts_1 = require("./ghostkubes.ts");
globalThis.LOG_FILE_NAME =
    "./ghostkubes_02.log.txt";
var GOAL_FILE = "./js/data_ghostkubes_02.js";
var DATAS = [];
log_ts_1.log("begin: " + (new Date()).toLocaleString());
var DATE_BEGIN = performance.now();
log_ts_1.showUsedTime("init");
try {
    await ghostkubes_ts_1.done(DATAS, GOAL_FILE);
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
cls && deno lint %pwd%\ghostkubes_02.ts && deno fmt %pwd%\ghostkubes_02.ts
cls && deno run --v8-flags=--max-old-space-size=20480 -A ghostkubes_02.ts
*/
