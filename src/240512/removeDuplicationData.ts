// https://deno.land/std@0.224.0/io/mod.ts?s=BufReader
import { BufReader } from "https://deno.land/std/io/mod.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { log, logUsedTime, showUsedTime } from "../../test/log.ts";
import { main } from "../js/cubeCompute.js";

const Globals = globalThis as unknown as {
  LOG_FILE_NAME: string;
};

// const OVER_WRITE_TRUE_FLAG = { overwrite: true };
const APPEND_TRUE_FLAG = { append: true };

const COUNT_PER_SHOW_USED_TIME = 1024000;
const LINE_OFFSET_WHEN_SHOW_USED_TIME = COUNT_PER_SHOW_USED_TIME - 1;

const OUTPUT_LINE_COUNT_PER_TIME = 1048000;

async function dealFileByStream(
  SOURCE_FILENAME: string,
  GOAL_FILENAME: string,
): Promise<boolean> {
  log(`${SOURCE_FILENAME} to ${GOAL_FILENAME}`);
  let sourceLineCount = 0;
  let goalLineCount = 0;

  const SET: Set<string> = new Set();

  function appendLine(line: string) {
    SET.add(line);

    if (SET.size >= OUTPUT_LINE_COUNT_PER_TIME) {
      appendFile();
    }
  }

  function appendFile() {
    const COUNT = SET.size;

    if (!COUNT) {
      return;
    }

    log(`output ${GOAL_FILENAME}`);

    const ARRAY = [...SET].filter((line) => line.replace(/\n/g, "").length > 0);
    goalLineCount += ARRAY.length;
    // Deno.writeTextFileSync(
    //   GOAL_FILENAME,
    //   ARRAY.join("\n").concat("\n"),
    //   APPEND_TRUE_FLAG,
    // );
    // 	<en_us>en_us</en_us>
    // 	<zh_cn>为避免最后多一个空行，忽略Windows记事本识别文件编码的错误（当所追加内容以\n开头时，相应文件被错误识别为UTF-16 LF编码格式，从而打开时变成乱码）</zh_cn>
    // 	<zh_tw>zh_tw</zh_tw>
    Deno.writeTextFileSync(
      GOAL_FILENAME,
      `${existsSync(GOAL_FILENAME) ? `\n` : ""}${ARRAY.join("\n")}`,
      APPEND_TRUE_FLAG,
    );
    SET.clear();
    ARRAY.length = 0;
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
    Deno.removeSync(GOAL_FILENAME);
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

  for await (
    const SOURCE_FILE_NAME of [
      // // "mannerToCubeMap",
      // "mannerToCubeMap_2rows_mini_output",
      // "mannerToCubeMap_3rows_mini_output",

      "manner",
      "mannerToCubeMap_2rows_mini_output",
      "mannerToCubeMap_3rows_mini_output",
    ]
  ) {
    done(`log_${SOURCE_FILE_NAME}.txt`, SOURCE_FILE_NAME, ".txt");
  }

  Globals.LOG_FILE_NAME = "log.txt";
  log(GLOBAL_LOG_ARRAY.join("\n"));
  log(`end: ${(new Date()).toLocaleString()}`);
  logUsedTime("Total", performance.now() - DATE_BEGIN);
}

await main();

/*
cd /d E:\__cube\240511C_2rows_3rows_mini_output

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\240512\removeDuplicationData.ts

cls && deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\240512\removeDuplicationData.ts

*/
