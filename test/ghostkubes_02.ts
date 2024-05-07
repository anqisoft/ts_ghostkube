// v0.0.1

import { log, LOG_FILE_NAME, logUsedTime, showUsedTime } from './log.ts';
import { done } from './ghostkubes.ts';

globalThis.LOG_FILE_NAME = './ghostkubes_02.log.txt';
const GOAL_FILE = './js/data_ghostkubes_02.js';

const DATAS = [];

log(`begin: ${(new Date()).toLocaleString()}`);
const DATE_BEGIN = performance.now();

showUsedTime('init');
try {
	await done(DATAS, GOAL_FILE);
} catch (error) {
	log('[error]', error);
}
showUsedTime('done');

log(`end: ${(new Date()).toLocaleString()}`);
logUsedTime('Total', performance.now() - DATE_BEGIN);
log('');

/*
set pwd=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\test
cls && deno lint %pwd%\ghostkubes_02.ts && deno fmt %pwd%\ghostkubes_02.ts
cls && deno run --v8-flags=--max-old-space-size=20480 -A ghostkubes_02.ts
*/
