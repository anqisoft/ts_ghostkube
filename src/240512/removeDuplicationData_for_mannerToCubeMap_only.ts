/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * removeDuplicationData_for_mannerToCubeMap_only.ts
 *
 * <en_us>
 * Created on Sun May 12 2024 17:51:39
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年5月12日 17:51:39
 * 功能：mannerToCubeMap.txt => mannerToCubeMap*.txt
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年5月12日 17:51:39
 * 功能：
 * </zh_tw>
 */

// https://deno.land/std@0.224.0/io/mod.ts?s=BufReader
import { BufReader } from "https://deno.land/std/io/mod.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { log, logUsedTime, showUsedTime } from "../../test/log.ts";

const Globals = globalThis as unknown as {
  LOG_FILE_NAME: string;
};

const APPEND_TRUE_FLAG = { append: true };

const OUTPUT_LINE_COUNT_PER_TIME = 1024000;

const COUNT_PER_SHOW_USED_TIME = 1024000;
const LINE_OFFSET_WHEN_SHOW_USED_TIME = COUNT_PER_SHOW_USED_TIME - 1;

const END_GOAL_FILENAME = "manners.txt";

async function dealFileByStream(
  SOURCE_FILENAME: string,
  GOAL_FILENAME: string,
): Promise<boolean> {
  log(`${SOURCE_FILENAME} to ${GOAL_FILENAME}`);
  let sourceLineCount = 0;
  let goalLineCount = 0;

  const SET: Set<string> = new Set();
  const CODE_ARRAY: string[] = [];

  function appendLine(line: string) {
    const [MANNER] = line.split("\t");
    const OLD_SIZE = SET.size;
    SET.add(MANNER);
    if (OLD_SIZE === SET.size) {
      return;
    }

    CODE_ARRAY.push(line);
    if (CODE_ARRAY.length >= OUTPUT_LINE_COUNT_PER_TIME) {
      appendFile();
    }
  }

  function appendFile() {
    const COUNT = CODE_ARRAY.length;

    if (!COUNT) {
      return;
    }

    log(`output ${GOAL_FILENAME}`);

    const ARRAY = [...SET].filter((line) => line.replace(/\n/g, "").length > 0);
    goalLineCount += ARRAY.length;
    // Deno.writeTextFileSync(
    //   GOAL_FILENAME,
    //   CODE_ARRAY.join("\n").concat("\n"),
    //   APPEND_TRUE_FLAG,
    // );
    // 	<en_us>en_us</en_us>
    // 	<zh_cn>为避免最后多一个空行，忽略Windows记事本识别文件编码的错误（当所追加内容以\n开头时，相应文件被错误识别为UTF-16 LF编码格式，从而打开时变成乱码）</zh_cn>
    // 	<zh_tw>zh_tw</zh_tw>
    Deno.writeTextFileSync(
      GOAL_FILENAME,
      `${existsSync(GOAL_FILENAME) ? `\n` : ""}${CODE_ARRAY.join("\n")}`,
      APPEND_TRUE_FLAG,
    );
    SET.clear();
    ARRAY.length = 0;

    CODE_ARRAY.length = 0;
  }

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
      appendLine(line);
    }
  }
  file.close();

  appendFile();

  const SAME_LINE_COUNT = sourceLineCount === goalLineCount;
  log(sourceLineCount, goalLineCount);
  if (SAME_LINE_COUNT) {
    // Deno.removeSync(GOAL_FILENAME);
    Deno.renameSync(GOAL_FILENAME, END_GOAL_FILENAME);
  }
  return SAME_LINE_COUNT;
}

async function done(
  LOG_FILE_NAME: string,
  SOURCE_FILE_NAME: string,
  EXTENTION_SEG: string = ".txt",
) {
  Globals.LOG_FILE_NAME = LOG_FILE_NAME;
  if (existsSync(LOG_FILE_NAME)) {
    Deno.removeSync(LOG_FILE_NAME);
  }

  log(`begin: ${(new Date()).toLocaleString()}`);
  const DATE_BEGIN = performance.now();
  let times = 0;

  while (true) {
    const SOURCE_FILENAME = times
      ? `${SOURCE_FILE_NAME}${times}${EXTENTION_SEG}`
      : `${SOURCE_FILE_NAME}${EXTENTION_SEG}`;
    const GOAL_FILENAME = `${SOURCE_FILE_NAME}${++times}${EXTENTION_SEG}`;

    const QUIT = await dealFileByStream(SOURCE_FILENAME, GOAL_FILENAME);
    showUsedTime(`loop ${times} times => ${QUIT}`);

    if (QUIT) {
      break;
    }
  }

  log(`end: ${(new Date()).toLocaleString()}`);
  logUsedTime("Total", performance.now() - DATE_BEGIN);
}

async function main() {
  const DATE_BEGIN = performance.now();
  const GLOBAL_LOG_ARRAY: string[] = [];

  GLOBAL_LOG_ARRAY.push(`begin: ${(new Date()).toLocaleString()}`);

  const SOURCE_FILE_NAME = "mannerToCubeMap";
  await done(`log_${SOURCE_FILE_NAME}.txt`, SOURCE_FILE_NAME, ".txt");

  // "mannerToCubes.txt"

  Globals.LOG_FILE_NAME =
    "log_removeDuplicationData_for_mannerToCubeMap_only.txt";
  log(GLOBAL_LOG_ARRAY.join("\n"));
  log(`end: ${(new Date()).toLocaleString()}`);
  logUsedTime("Total", performance.now() - DATE_BEGIN);
}

await main();

/*
cd /d E:\__cube\240511C_2rows_3rows_mini_output
cd /d C:\240511C_2rows_3rows_mini_output

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\240512\removeDuplicationData_for_mannerToCubeMap_only.ts

cls && deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\240512\removeDuplicationData_for_mannerToCubeMap_only.ts

*/
