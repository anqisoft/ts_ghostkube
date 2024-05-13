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
 * 功能：manner.txt + mannerToCubeMap.txt => mannerToCubes.txt
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

async function dealFileByStream(
  MANNER_SOURCE_ARRAY: string[],
  SOURCE_FILENAME: string,
  GOAL_FILENAME: string,
): Promise<void> {
  log(`${SOURCE_FILENAME} to ${GOAL_FILENAME}`);
  let sourceLineCount = 0;
  let mannerSourceCount = MANNER_SOURCE_ARRAY.length;

  const VALUE_ARRAY: string[] = [];

  function appendLine(line: string) {
    VALUE_ARRAY.push(line);

    if (VALUE_ARRAY.length >= OUTPUT_LINE_COUNT_PER_TIME) {
      appendFile();
    }
  }

  function appendFile() {
    const COUNT = VALUE_ARRAY.length;

    if (!COUNT) {
      return;
    }

    log(`output ${GOAL_FILENAME}`);
    // Deno.writeTextFileSync(
    //   GOAL_FILENAME,
    //   VALUE_ARRAY.join("\n").concat("\n"),
    //   APPEND_TRUE_FLAG,
    // );
    // 	<en_us>en_us</en_us>
    // 	<zh_cn>为避免最后多一个空行，忽略Windows记事本识别文件编码的错误（当所追加内容以\n开头时，相应文件被错误识别为UTF-16 LF编码格式，从而打开时变成乱码）</zh_cn>
    // 	<zh_tw>zh_tw</zh_tw>
    Deno.writeTextFileSync(
      GOAL_FILENAME,
      `${existsSync(GOAL_FILENAME) ? `\n` : ""}${VALUE_ARRAY.join("\n")}`,
      APPEND_TRUE_FLAG,
    );

    VALUE_ARRAY.length = 0;
  }

  const file = await Deno.open(SOURCE_FILENAME);
  const bufReader = new BufReader(file);

  let line: string;
  while (
    mannerSourceCount && (line = await bufReader.readString("\n")) != Deno.EOF
  ) {
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

      const [MANNER] = line.split("\t");
      let find = false;
      for (let i = 0; i < mannerSourceCount; ++i) {
        if (MANNER === MANNER_SOURCE_ARRAY[i]) {
          MANNER_SOURCE_ARRAY.splice(i, 1);
          --mannerSourceCount;

          find = true;
          break;
        }
      }

      if (find) {
        appendLine(line);
      }
    }
  }
  file.close();

  appendFile();
}

async function main() {
  const LOG_FILE_NAME =
    "./log_removeDuplicationData_for_mannerToCubeMap_only.txt";
  Globals.LOG_FILE_NAME = LOG_FILE_NAME;
  if (existsSync(LOG_FILE_NAME)) {
    Deno.removeSync(LOG_FILE_NAME);
  }

  const DATE_BEGIN = performance.now();

  const MANNER_SOURCE_ARRAY = Deno.readTextFileSync("manner.txt").replace(
    /\r/g,
    "",
  ).split("\n");
  showUsedTime("read manner.txt ok");

  await dealFileByStream(
    MANNER_SOURCE_ARRAY,
    "mannerToCubeMap.txt",
    "mannerToCubes.txt",
  );

  log(`end: ${(new Date()).toLocaleString()}`);
  logUsedTime("Total", performance.now() - DATE_BEGIN);
}

await main();

/*
cd /d E:\__cube\240511C_2rows_3rows_mini_output

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\240512\removeDuplicationData_for_mannerToCubeMap_only.ts

cls && deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\240512\removeDuplicationData_for_mannerToCubeMap_only.ts

*/
