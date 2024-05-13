/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * split_mannerToCubeMap.ts
 *
 * <en_us>
 * Created on Mon May 13 2024 08:58:18
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年5月13日 08:58:18
 * 功能：拆分成单个txt文件，因上一种方案太慢：mannerOrdered.txt + mannerToCubeMap.txt => mannerToCubeMap_ordered.txt
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年5月13日 08:58:18
 * 功能：
 * </zh_tw>
 */

// https://deno.land/std@0.224.0/io/mod.ts?s=BufReader
import { BufReader } from "https://deno.land/std/io/mod.ts";
import {
  emptyDirSync,
  ensureDirSync,
  existsSync,
} from "https://deno.land/std/fs/mod.ts";
import { log, logUsedTime, showUsedTime } from "../../test/log.ts";

const Globals = globalThis as unknown as {
  LOG_FILE_NAME: string;
};

// const COUNT_PER_SHOW_USED_TIME = 1024000;
const COUNT_PER_SHOW_USED_TIME = 100000;
const LINE_OFFSET_WHEN_SHOW_USED_TIME = COUNT_PER_SHOW_USED_TIME - 1;

async function main() {
  const SOURCE_FILENAME = "mannerToCubeMap.txt";

  const GOAL_FILE_PATH = "cubes/";
  if (!existsSync(GOAL_FILE_PATH)) {
    ensureDirSync(GOAL_FILE_PATH);
    // emptyDirSync(GOAL_FILE_PATH);
  }

  function splitLine(line: string) {
    const [MANNER, VALUE] = line.split("\t");
    Deno.writeTextFileSync(`${GOAL_FILE_PATH}${MANNER}.txt`, VALUE);
  }

  async function dealFileByStream(): Promise<void> {
    let sourceLineCount = 0;

    const file = await Deno.open(SOURCE_FILENAME);
    const bufReader = new BufReader(file);

    let line: string;
    while ((line = await bufReader.readString("\n")) != Deno.EOF) {
      line = line.replace(/[\r\n]/g, "");
      if (line.length) {
        ++sourceLineCount;
        if (sourceLineCount % COUNT_PER_SHOW_USED_TIME === 0) {
          showUsedTime(
            `read ${
              sourceLineCount - LINE_OFFSET_WHEN_SHOW_USED_TIME
            } to ${sourceLineCount} lines`,
          );
        }

        splitLine(line);
      }
    }
    file.close();
  }

  async function done() {
    const LOG_FILE_NAME = "./log_split_mannerToCubeMap.txt";
    Globals.LOG_FILE_NAME = LOG_FILE_NAME;
    if (existsSync(LOG_FILE_NAME)) {
      Deno.removeSync(LOG_FILE_NAME);
    }

    log(`begin: ${(new Date()).toLocaleString()}`);
    const DATE_BEGIN = performance.now();

    await dealFileByStream();

    log(`end: ${(new Date()).toLocaleString()}`);
    logUsedTime("Total", performance.now() - DATE_BEGIN);
  }

  await done();
}

await main();

/*
cd /d E:\__cube\240511C_2rows_3rows_mini_output
cd /d C:\240511C_2rows_3rows_mini_output

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\240513\split_mannerToCubeMap.ts

cls && deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\240513\split_mannerToCubeMap.ts

*/
