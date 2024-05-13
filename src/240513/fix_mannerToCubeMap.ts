/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * fix_mannerToCubeMap.ts
 *
 * <en_us>
 * Created on Mon May 13 2024 17:22:45
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年5月13日 17:22:45
 * 功能：修复mannerToCubeMap_hasError.txt中的错误，重新生成mannerToCubeMap.txt
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年5月13日 17:22:45
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
import {
  convertRowCountAndGridLinesToSimplestLine,
  GridLine,
} from "../cubeCore.ts";

const Globals = globalThis as unknown as {
  LOG_FILE_NAME: string;
};

const APPEND_TRUE_FLAG = { append: true };
const OUTPUT_LINE_COUNT_PER_TIME = 1024000;

// const COUNT_PER_SHOW_USED_TIME = 1024000;
const COUNT_PER_SHOW_USED_TIME = 100000;
const LINE_OFFSET_WHEN_SHOW_USED_TIME = COUNT_PER_SHOW_USED_TIME - 1;

async function main() {
  const SOURCE_FILENAME = "mannerToCubeMap_hasError.txt";
  const GOAL_FILENAME = "mannerToCubeMap.txt";

  const CUBE_GOAL_FILE_PATH = "cubes/";
  if (!existsSync(CUBE_GOAL_FILE_PATH)) {
    ensureDirSync(CUBE_GOAL_FILE_PATH);
    // emptyDirSync(CUBE_GOAL_FILE_PATH);
  }

  function getFixed(original: string): string {
    // 1:2_01234_0031243,10|0131211,8|0201253,4|0302250,0|0411233,5|1022222,7|1122321,11|1231220,3|1301200,12|1422203,1_01004|11012|01112|00014|12004|22012|12112|23004|33013|23112|34004|44012|34112|45004|55014|45112|11123|01224|00124|22123|12224|33122|23224|44123|34224|55124|45224

    const [CUBE_NO, OTHERS] = original.split(":");
    const [ROW_COUNT_STRING, _REMOVED, ACT_CELLS_INFO, GRID_LINES_INFO] = OTHERS
      .split("_");
    const LINES = convertRowCountAndGridLinesToSimplestLine(
      parseInt(ROW_COUNT_STRING),
      GRID_LINES_INFO.split("|").map((GRID_LINE_INFO) => {
        const [xStart, xEnd, yStart, yEnd, lineStyle] = GRID_LINE_INFO.split("")
          .map((value) => parseInt(value));
        return { xStart, xEnd, yStart, yEnd, lineStyle } as GridLine;
      }),
    );

    return `${CUBE_NO}:${ROW_COUNT_STRING}_${ACT_CELLS_INFO}_${LINES}`;
  }

  function splitLine(line: string) {
    const [MANNER, VALUE] = line.split("\t");
    const FIXED_VALUE = getFixed(VALUE);
    // Deno.writeTextFileSync(`${CUBE_GOAL_FILE_PATH}${MANNER}.txt`, FIXED_VALUE);

    appendLine(`${MANNER}\t${FIXED_VALUE}`);
  }

  const LINES_ARRAY: string[] = [];
  let isNotFirstTime = false;

  function appendLine(line: string) {
    LINES_ARRAY.push(line);

    if (LINES_ARRAY.length >= OUTPUT_LINE_COUNT_PER_TIME) {
      appendFile();
    }
  }

  function appendFile() {
    const COUNT = LINES_ARRAY.length;

    if (!COUNT) {
      return;
    }

    log(`output ${GOAL_FILENAME}`);
    // 	<en_us>en_us</en_us>
    // 	<zh_cn>为避免最后多一个空行，忽略Windows记事本识别文件编码的错误（当所追加内容以\n开头时，相应文件被错误识别为UTF-16 LF编码格式，从而打开时变成乱码）</zh_cn>
    // 	<zh_tw>zh_tw</zh_tw>
    if (isNotFirstTime) {
      Deno.writeTextFileSync(
        GOAL_FILENAME,
        `\n${LINES_ARRAY.join("\n")}`,
        APPEND_TRUE_FLAG,
      );
    } else {
      Deno.writeTextFileSync(
        GOAL_FILENAME,
        LINES_ARRAY.join("\n"),
        APPEND_TRUE_FLAG,
      );

      isNotFirstTime = true;
    }

    LINES_ARRAY.length = 0;
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

    appendFile();
  }

  async function done() {
    const LOG_FILE_NAME = "./log_fix_mannerToCubeMap.txt";
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

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\240513\fix_mannerToCubeMap.ts

cls && deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\240513\fix_mannerToCubeMap.ts

*/
