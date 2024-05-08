/*
 * Copyright (c) 2024 anqisoft@gmail.com
 * src\cubeCompute6_step4.ts v0.0.1
 * deno 1.42.1 + VSCode 1.88.0
 *
 * <en_us>
 * Created on Sun Apr 29 2024 08:47:00
 * Feature:
 * </en_us>
 *
 * <zh_cn>
 * 创建：2024年4月29日 08:47:00
 * 功能：从第三步结果开始，进行一系列合并与分析操作：
 *       1. lines.txt，将4677537行去重，且列出正方体序号段（不知道为什么最后有不连续的序号），
 *          转为lineToCubeNo.txt文件，444442222244444422324433234:1-5,8-10
 *       2. cubes/*.txt（3655 files），每文件30720个正方体，此文件夹不需处理，可直接反算文件名
 *          Math.ceil((cube.no - 0.5) / 30720).toString().padStart(6, '0').concat('.txt')
 *       3. manners/*.txt（3655 files）：合并到内存中，最后再排序后输出单个文件
 * </zh_cn>
 *
 * <zh_tw>
 * 創建：2024年4月29日 08:47:00
 * 功能：
 * </zh_tw>
 */

import {
  copySync,
  emptyDirSync,
  ensureDirSync,
  existsSync,
} from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";

import { ANGLE_COUNT, log, logUsedTime, showUsedTime } from "./cubeCore.ts";

const STEP_FLAG = "step4";
const LOG_FILE_NAME = "./log.txt";
if (existsSync(LOG_FILE_NAME)) {
  Deno.removeSync(LOG_FILE_NAME);
}

let logFilenamePostfix = "";
logFilenamePostfix = `_${STEP_FLAG}`;

const GOAL_FILE_TOP_PATH = `./${STEP_FLAG}/`;
ensureDirSync(GOAL_FILE_TOP_PATH);
emptyDirSync(GOAL_FILE_TOP_PATH);

log(`begin: ${(new Date()).toLocaleString()}`);
const DATE_BEGIN = performance.now();

const OVER_WRITE_TRUE_FLAG = { overwrite: true };

const SOURCE_FILE_TOP_PATH = "./step3/";

const APPEND_TRUE_FLAG = { append: true };

const DEBUG = {
  // true false
  COMPACT_LINE_INFO_WRITE_COUNT_PER_TIME: 204800,

  COMPACT_MANNER_FILES_FOR_LARGE_FILE: true,
  COMPACT_MANNER_FILES_FOR_LARGE_FILE_OUTPUT_TIMES: 8,

  OUTPUT_MANNER_BILL_FILE: false,

  JOIN_CUBE_FILES: true,
};

await (async () => {
  // step3/lines.txt => step4/lineToCubeNo.txt
  compactLineInfo();

  if (DEBUG.COMPACT_MANNER_FILES_FOR_LARGE_FILE) {
    // step3/manners/*.txt => step4/manners.txt
    await compactMannerFilesForLargeFile();

    // step3/manners/*.txt => step4/joinedManners/*.txt
    await joinMannerFiles();
  } else {
    // step3/manners/*.txt => step4/manners.txt
    await compactMannerFiles();
  }

  if (DEBUG.OUTPUT_MANNER_BILL_FILE) {
    // step3/manners/*.txt => step4/mannerBill.txt
    await outputMannerBillFile();
  }

  // step3/cubes/*.txt => step4/cubes.txt
  if (DEBUG.JOIN_CUBE_FILES) {
    await joinCubeFiles();
  }

  function compactLineInfo() {
    logFilenamePostfix += "_compactLineInfo";
    // 1. lines.txt，将4677537行去重，且列出正方体序号段（不知道为什么最后有不连续的序号），
    //    转为lineToCubeNo.txt文件，444442222244444422324433234:1-5,8-10
    const GOAL_FILE_NAME = `${GOAL_FILE_TOP_PATH}lineToCubeNo.txt`;

    const SOURCE_FILE_NAME = `${SOURCE_FILE_TOP_PATH}lines.txt`;
    const DATA_ARRAY = Deno.readTextFileSync(SOURCE_FILE_NAME).split("\n");
    showUsedTime(`read ${SOURCE_FILE_NAME} ok`);

    const { COMPACT_LINE_INFO_WRITE_COUNT_PER_TIME } = DEBUG;

    Deno.writeTextFileSync(GOAL_FILE_NAME, "");
    let lastOne = "";
    let codes = "";
    DATA_ARRAY.forEach((info, index) => {
      if (index % COMPACT_LINE_INFO_WRITE_COUNT_PER_TIME === 0 && index) {
        Deno.writeTextFileSync(GOAL_FILE_NAME, codes, APPEND_TRUE_FLAG);
        codes = "";
        showUsedTime(`ok: ${index}`);
      }
      const BEGIN = ANGLE_COUNT * index + 1;
      // const END = BEGIN + DIFFENT_BETWEEN_BEGIN_AND_END;
      if (info === lastOne) {
        codes += `|${BEGIN}`;
      } else {
        codes += `${index ? "\n" : ""}${info}\t${BEGIN}`;
        lastOne = info;
      }
    });
    Deno.writeTextFileSync(GOAL_FILE_NAME, codes, APPEND_TRUE_FLAG);
    // 4677537 lines => 247616 lines
  }

  async function compactMannerFiles() {
    logFilenamePostfix += "_compactMannerFiles";

    const SOURCE_MANNER_FILE_PATH = `${SOURCE_FILE_TOP_PATH}manners/`;
    let readedFileCount = 0;

    const GOAL_FILE_NAME = `${GOAL_FILE_TOP_PATH}manners.txt`;
    Deno.writeTextFileSync(GOAL_FILE_NAME, "");
    for await (const dirEntry of Deno.readDir(SOURCE_MANNER_FILE_PATH)) {
      const filename = path.join(SOURCE_MANNER_FILE_PATH, dirEntry.name);
      const stats = Deno.statSync(filename);
      if (!stats.isFile) {
        continue;
      }

      if ((++readedFileCount) % 100 === 0) {
        showUsedTime(`readed ${readedFileCount} files`);
      }
      // Deno.writeTextFileSync(
      //   GOAL_FILE_NAME,
      //   Deno.readTextFileSync(filename)
      //     .replace(/:/g, "\t")
      //     .replace(/[\[\]]/g, "")
      //     .replace(/,/g, "|"),
      //   APPEND_TRUE_FLAG,
      // );

      const ARRAY: { manner: string; cubeNoBill: string }[] = Deno
        .readTextFileSync(filename)
        .replace(/:/g, "\t")
        .replace(/[\[\]]/g, "")
        .replace(/,/g, "|").split("\n").map((line) => {
          const [manner, cubeNoBill] = line.split("\t");
          return { manner, cubeNoBill };
        });
      ARRAY.sort((prev, next) => prev.manner.localeCompare(next.manner));
      console.log("sort it");

      Deno.writeTextFileSync(
        GOAL_FILE_NAME,
        ARRAY.map(({ manner, cubeNoBill }) => `${manner}\t${cubeNoBill}`)
          .join("\n"),
        APPEND_TRUE_FLAG,
      );
    }
    // First time: Total used , used 153560.50 milliseconds, or 153.560 seconds, or 2.6 minutes.

    // Second time:
    // begin: 4/30/2024, 9:18:51 AM
    // readed 100 files, used 1245.30 milliseconds, or 1.245 seconds
    // readed 200 files, used 1309.05 milliseconds, or 1.309 seconds
    // readed 300 files, used 1190.31 milliseconds, or 1.190 seconds
    // readed 400 files, used 1240.31 milliseconds, or 1.240 seconds
    // readed 500 files, used 1640.54 milliseconds, or 1.641 seconds
    // readed 600 files, used 1574.70 milliseconds, or 1.575 seconds
    // readed 700 files, used 1585.79 milliseconds, or 1.586 seconds
    // readed 800 files, used 1717.13 milliseconds, or 1.717 seconds
    // readed 900 files, used 1712.19 milliseconds, or 1.712 seconds
    // readed 1000 files, used 1440.75 milliseconds, or 1.441 seconds
    // readed 1100 files, used 1575.05 milliseconds, or 1.575 seconds
    // readed 1200 files, used 1305.73 milliseconds, or 1.306 seconds
    // readed 1300 files, used 1453.30 milliseconds, or 1.453 seconds
    // readed 1400 files, used 1252.67 milliseconds, or 1.253 seconds
    // readed 1500 files, used 1109.89 milliseconds, or 1.110 seconds
    // readed 1600 files, used 1384.44 milliseconds, or 1.384 seconds
    // readed 1700 files, used 1395.11 milliseconds, or 1.395 seconds
    // readed 1800 files, used 1520.37 milliseconds, or 1.520 seconds
    // readed 1900 files, used 1629.46 milliseconds, or 1.629 seconds
    // readed 2000 files, used 1445.17 milliseconds, or 1.445 seconds
    // readed 2100 files, used 1597.54 milliseconds, or 1.598 seconds
    // readed 2200 files, used 1779.48 milliseconds, or 1.779 seconds
    // readed 2300 files, used 1665.58 milliseconds, or 1.666 seconds
    // readed 2400 files, used 1701.54 milliseconds, or 1.702 seconds
    // readed 2500 files, used 1674.25 milliseconds, or 1.674 seconds
    // readed 2600 files, used 1533.90 milliseconds, or 1.534 seconds
    // readed 2700 files, used 1972.77 milliseconds, or 1.973 seconds
    // readed 2800 files, used 1708.63 milliseconds, or 1.709 seconds
    // readed 2900 files, used 1698.91 milliseconds, or 1.699 seconds
    // readed 3000 files, used 1616.99 milliseconds, or 1.617 seconds
    // readed 3100 files, used 1673.94 milliseconds, or 1.674 seconds
    // readed 3200 files, used 1799.85 milliseconds, or 1.800 seconds
    // readed 3300 files, used 1744.90 milliseconds, or 1.745 seconds
    // readed 3400 files, used 1647.63 milliseconds, or 1.648 seconds
    // readed 3500 files, used 1666.44 milliseconds, or 1.666 seconds
    // readed 3600 files, used 1362.89 milliseconds, or 1.363 seconds
    // end, used 713.26 milliseconds, or 0.713 seconds
    // end: 4/30/2024, 9:19:47 AM
    // Total used , used 56269.80 milliseconds, or 56.270 seconds

    // File size: 1.74GB
    // Couldn't open it by notepad.
  }

  async function compactMannerFilesForLargeFile() {
    logFilenamePostfix = "_compactMannerFilesForLargeFile";
    const SOURCE_MANNER_FILE_PATH = `${SOURCE_FILE_TOP_PATH}manners/`;
    const MANNER_ARRAY: string[] = [];
    const CUBE_NO_ARRAY = [];
    let readedFileCount = 0;
    let mannerCount = 0;
    for await (const dirEntry of Deno.readDir(SOURCE_MANNER_FILE_PATH)) {
      const filename = path.join(SOURCE_MANNER_FILE_PATH, dirEntry.name);
      const stats = Deno.statSync(filename);
      if (stats.isFile) {
        if ((++readedFileCount) % 100 === 0) { // || readedFileCount < 10) {
          showUsedTime(`readed ${readedFileCount} files`);
        }

        const SOURCE_ARRAY = Deno.readTextFileSync(filename)
          .replace(/:/g, "\t")
          .replace(/[\[\]]/g, "")
          .replace(/,/g, "|")
          .split("\n");
        const SOURCE_COUNT = SOURCE_ARRAY.length;
        for (let lineIndex = 0; lineIndex < SOURCE_COUNT; ++lineIndex) {
          const [MANNER, CUBE_NO_BILL] = SOURCE_ARRAY[lineIndex].split("\t");
          let finded = false;
          for (let i = 0; i < mannerCount; ++i) {
            if (MANNER_ARRAY[i] === MANNER) {
              CUBE_NO_ARRAY[i] += "|".concat(CUBE_NO_BILL);
              finded = true;
              break;
            }
          }
          if (!finded) {
            MANNER_ARRAY.push(MANNER);
            CUBE_NO_ARRAY.push(CUBE_NO_BILL);
            ++mannerCount;
          }
        }
      }
    }
    showUsedTime(`read remaining files`);

    const MANNER_GOAL_FILE_NAME = `${GOAL_FILE_TOP_PATH}manners.txt`;
    Deno.writeTextFileSync(MANNER_GOAL_FILE_NAME, "");

    const WRITE_TIMES = DEBUG.COMPACT_MANNER_FILES_FOR_LARGE_FILE_OUTPUT_TIMES;
    const OUTPUT_COUNT_PER_TIME = Math.ceil(MANNER_ARRAY.length / WRITE_TIMES);
    for (let outputIndex = 0; outputIndex < WRITE_TIMES; ++outputIndex) {
      const QUARTER_CUBE_NO_ARRAY = CUBE_NO_ARRAY.splice(
        0,
        OUTPUT_COUNT_PER_TIME,
      );
      if (outputIndex) {
        Deno.writeTextFileSync(
          MANNER_GOAL_FILE_NAME,
          "\n",
          APPEND_TRUE_FLAG,
        );
      }
      Deno.writeTextFileSync(
        MANNER_GOAL_FILE_NAME,
        MANNER_ARRAY.splice(0, OUTPUT_COUNT_PER_TIME).map((MANNER, index) =>
          `${MANNER}\t${QUARTER_CUBE_NO_ARRAY[index]}`
        ).join("\n"),
        APPEND_TRUE_FLAG,
      );
    }
    showUsedTime(`output manners.txt`);

    // Deno.writeTextFileSync(
    // `${GOAL_FILE_TOP_PATH}mannerBill.txt`,
    // MANNER_ARRAY.join('\n'),
    // );
    // showUsedTime(`output mannerBill.txt`);
  }

  async function outputMannerBillFile() {
    logFilenamePostfix += "_outputMannerBillOfOnlyOneFile";
    const SOURCE_MANNER_FILE_PATH = `${SOURCE_FILE_TOP_PATH}manners/`;

    let readedFileCount = 0;

    const GOAL_FILE_NAME = `${GOAL_FILE_TOP_PATH}mannerBill.txt`;
    Deno.writeTextFileSync(GOAL_FILE_NAME, "");
    for await (const dirEntry of Deno.readDir(SOURCE_MANNER_FILE_PATH)) {
      const filename = path.join(SOURCE_MANNER_FILE_PATH, dirEntry.name);
      const stats = Deno.statSync(filename);
      if (!stats.isFile) {
        continue;
      }

      if ((++readedFileCount) % 100 === 0) {
        showUsedTime(`readed ${readedFileCount} files`);
      }
      Deno.writeTextFileSync(
        GOAL_FILE_NAME,
        Deno.readTextFileSync(filename)
          // .replace(/:/g, '\t')
          // .replace(/[\[\]]/g, '')
          // .replace(/,/g, '|')
          .split("\n").map((line) => line.split(":")[0]).join("\n"),
        APPEND_TRUE_FLAG,
      );
    }

    // File size: 1.13G
    // Couldn't open it by notepad or notepad++.
  }

  async function joinMannerFiles() {
    const SOURCE_MANNER_FILE_PATH = `${SOURCE_FILE_TOP_PATH}manners/`;
    let readedFileCount = 0;

    // const GOAL_FILE_PATH = `${GOAL_FILE_TOP_PATH}manners/`;
    const GOAL_FILE_PATH = `${GOAL_FILE_TOP_PATH}joinedManners/`;
    ensureDirSync(GOAL_FILE_PATH);
    emptyDirSync(GOAL_FILE_PATH);

    const MANNER_ARRAY: string[] = [];
    let outputFileNo = 0;
    let totalCount = 0;
    function output() {
      const COUNT = MANNER_ARRAY.length;
      if (!COUNT) {
        return;
      }

      ++outputFileNo;
      Deno.writeTextFileSync(
        `${GOAL_FILE_PATH}${outputFileNo}.txt`,
        MANNER_ARRAY.join("\n"),
      );

      totalCount += COUNT;
      MANNER_ARRAY.length = 0;
    }
    function append(manner: string) {
      MANNER_ARRAY.push(manner);
      if (MANNER_ARRAY.length >= 1048000) {
        output();
      }
    }

    for await (const dirEntry of Deno.readDir(SOURCE_MANNER_FILE_PATH)) {
      const filename = path.join(SOURCE_MANNER_FILE_PATH, dirEntry.name);
      const stats = Deno.statSync(filename);
      if (!stats.isFile) {
        continue;
      }

      if ((++readedFileCount) % 100 === 0) {
        showUsedTime(`readed ${readedFileCount} files`);
      }
      Deno.readTextFileSync(filename).split("\n").forEach((line) =>
        append(line.split(":")[0])
      );
    }
    output();

    // File count: 33 files
  }

  async function joinCubeFiles() {
    logFilenamePostfix = "_joinCubeFiles";
    const SOURCE_MANNER_FILE_PATH = `${SOURCE_FILE_TOP_PATH}cubes/`;

    const CUBE_GOAL_FILE_NAME = `${GOAL_FILE_TOP_PATH}cubes.txt`;
    Deno.writeTextFileSync(CUBE_GOAL_FILE_NAME, "");

    let readedFileCount = 0;
    for await (const dirEntry of Deno.readDir(SOURCE_MANNER_FILE_PATH)) {
      const filename = path.join(SOURCE_MANNER_FILE_PATH, dirEntry.name);
      const stats = Deno.statSync(filename);
      if (!stats.isFile) {
        continue;
      }

      if ((++readedFileCount) % 100 === 0) { // || readedFileCount < 10) {
        showUsedTime(`readed ${readedFileCount} files`);
      }

      Deno.writeTextFileSync(
        CUBE_GOAL_FILE_NAME,
        Deno.readTextFileSync(filename),
        APPEND_TRUE_FLAG,
      );
    }
  }
})();

showUsedTime("end");
log(`end: ${(new Date()).toLocaleString()}`);
logUsedTime("Total", performance.now() - DATE_BEGIN);

copySync(LOG_FILE_NAME, `log_${STEP_FLAG}.txt`, OVER_WRITE_TRUE_FLAG);
copySync(
  LOG_FILE_NAME,
  `${GOAL_FILE_TOP_PATH}log${logFilenamePostfix}.txt`,
  OVER_WRITE_TRUE_FLAG,
);
Deno.removeSync(LOG_FILE_NAME);

/*
cd /d C:\__cube\240507A\
set pwd=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\

cls && deno lint %pwd%\cubeCompute6_step4.ts & deno fmt %pwd%\cubeCompute6_step4.ts

deno run --v8-flags=--max-old-space-size=20480 -A P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\src\cubeCompute6_step4.ts

deno run --v8-flags=--max-old-space-size=20480 -A %pwd%\cubeCompute6_step4.ts

cls && deno run --v8-flags=--max-old-space-size=20480 -A %pwd%\cubeCompute6_step4.ts

cd /d E:\_cubes_240428
*/
