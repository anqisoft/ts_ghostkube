// v0.0.2

import { log, logUsedTime, showUsedTime } from '../log.ts';
import { main } from './manners_mini_output.ts';

(globalThis as unknown as { LOG_FILE_NAME: string }).LOG_FILE_NAME = './manners_2rows.log.txt';
const GOAL_FILE = '../js/data_manners_2rows.js';

log(`begin: ${(new Date()).toLocaleString()}`);
const DATE_BEGIN = performance.now();

showUsedTime('init');
try {
	main('C:\\__cube\\2rows\\', [2], GOAL_FILE, true, 'R2', true);
} catch (error) {
	log('[error]', error);
}
showUsedTime('done');

log(`end: ${(new Date()).toLocaleString()}`);
logUsedTime('Total', performance.now() - DATE_BEGIN);
log('');

/*
set test=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\test\240513\
cls && deno lint %test%\manners_2rows.ts && deno fmt %test%\manners_2rows.ts
cls && deno run --v8-flags=--max-old-space-size=20480 -A manners_2rows.ts
*/
