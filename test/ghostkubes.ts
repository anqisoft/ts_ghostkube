/* v0.0.3
  <en_us></en_us>
  <zh_cn>
    新算法：不查找mannersBill.txt，直接查找manners.txt文件。
  </zh_cn>
  <zh_tw></zh_tw>
*/
/* v0.0.2
  <en_us></en_us>
  <zh_cn>
    新算法：当超过2个插片时，只取3行5列的正方体。
    缺陷：有25项2个插片无法找到合适的正方体（只有2行5列的，没有3行5列的）。
  </zh_cn>
  <zh_tw></zh_tw>
*/
/* v0.0.1
  <en_us></en_us>
  <zh_cn>缺陷：当超过2个插片时，可能因连接不足而塌下来</zh_cn>
  <zh_tw></zh_tw>
*/
// see: https://www.kickstarter.com/projects/ghostkube/ghostkube
import { BufReader } from "https://deno.land/std/io/mod.ts";
import { log, showUsedTime } from "./log.ts";

import {
  CellFeature,
  ConnectionRelation,
  Cube,
  CubeForDrawing,
  CubeForDrawingActCell,
  FourDirection,
  GridLineStyle,
  SixFace,
  TwelveEdge,
} from "../src/cubeCore.ts";

import {
  CUBE_ARRAY_IN_BLACK_LIST,
  CUBE_COUNT_IN_BLACK_LIST,
  SKIP_CUBE_ARRAY_IN_BLACK_LIST,
} from "../data/cubeBlackList.ts";

import {
  CACHE_DATA_ARRAY,
  CACHE_DATA_COUNT,
  SKIP_CACHE_DATA,
} from "../data/dataCache.ts";
const OLD_CACHE_DATA_ARRAY_JSON = JSON.stringify(CACHE_DATA_ARRAY);

const COL_COUNT = 5;

const DEBUG = {
  SHOW_INFO_WHEN_PIECE_COUNT_EQUALS_OR_GREAT_THAN_TWO: false,
  SHOW_OK_COUNT_OF_MANNERS_FILE_AND_SOURCE_MANNER_COUNT: false,
};

// https://stackoverflow.com/questions/8936984/uint8array-to-string-in-javascript
// const decoder = new TextDecoder();

function getMannerFromCubeInfo(
  inNoArray: number[],
  outNoArray: number[],
): [string, number] {
  let manner = "";
  let pieceCount = 0;
  // let test = '';
  for (let i = 1; i <= 12; ++i) {
    const isNotIn = inNoArray.indexOf(i) === -1;
    const isNotOut = outNoArray.indexOf(i) === -1;
    // manner += `${inNoArray.indexOf(i) === -1 ? '[FT]' : 'T'}${isNotOut ? '[0123]' : '1'}`;
    manner += `${isNotIn ? "[FT]" : "T"}${isNotOut ? "[0123]" : "[123]"}`;
    // test += `${isNotIn ? 'F' : 'T'}${isNotOut ? '0' : '1'}`;

    if (!isNotOut) {
      ++pieceCount;
    }
  }

  // log(`getMannerFromCubeInfo([${inNoArray}], [${outNoArray}]) => ${JSON.stringify({manner,pieceCount,test})}`);
  return [manner, pieceCount];
}

async function readFileByStream(filename: string): string[] {
  const RESULT: string[] = [];
  const file = await Deno.open(filename);
  // https://deno.land/std@0.224.0/io/mod.ts?s=BufReader
  const bufReader = new BufReader(file);
  // console.log('Reading data...');
  let line: string;
  // let lineCount: number = 0;
  // readLine() => decoder.decode(line.line)
  // readString('\n') => line
  while ((line = await bufReader.readString("\n")) != Deno.EOF) {
    //lineCount++;
    // do something with `line`.
    RESULT.push(line);
  }
  file.close();
  // console.log(`${lineCount} lines read.`);
  return RESULT;
}

function getCubeLineArray(): string[] {
  const SOURCE_ARRAY = Deno.readTextFileSync("../data/lines.txt").split("\n");
  // const SOURCE_ARRAY = await readFileByStream('../data/lines.txt');
  const SOURCE_COUNT = SOURCE_ARRAY.length;

  const RESULT = [];
  for (let index = 0; index < SOURCE_COUNT; ++index) {
    const LINE = SOURCE_ARRAY[index];
    RESULT.push(LINE);
  }

  return RESULT;
}

async function readFileByStreamSync(
  filename: string,
  fn: (line: string) => number,
  COUNT: number,
) {
  async function readFileByStream(filename: string): void {
    // https://deno.land/std@0.224.0/io/mod.ts?s=BufReader
    const file = await Deno.open(filename);
    const bufReader = new BufReader(file);

    let remainCount = COUNT;
    let line: string;
    while (
      remainCount > 0 && (line = await bufReader.readString("\n")) != Deno.EOF
    ) {
      remainCount -= fn(line.replace("\n", ""));
    }
    file.close();
  }

  await readFileByStream(filename);
}

function getCubeForDrawing(
  no: number,
  CUBE_LINE: string,
  ACT_CELLS: string,
): CubeForDrawing {
  let firstRowActCellColIndexBill: string = "";
  let lastRowEmptyCellColIndexBill: string = "01234";
  const gridLines: GridLine[] = [];
  // 44444 22222 44444       422324 433234
  // 44444 22222 22222 44444 433334 432324 423234
  // 27 chars or 38 chars
  const ROW_COUNT = CUBE_LINE.length === 27 ? 2 : 3;
  const MAX_ROW_INDEX = ROW_COUNT - 1;
  const HORIZONTAL_LINE_DIGIT_COUNT = 5 * (ROW_COUNT + 1);
  const HORIZONTAL_LINE_ARRAY_ARRAY: number[][] = [];
  for (let rowIndex = 0; rowIndex <= ROW_COUNT; ++rowIndex) {
    const OFFSET = COL_COUNT * rowIndex;
    const Y = rowIndex;
    const yStart = Y;
    const yEnd = Y;
    const HORIZONTAL_LINE_ARRAY: number[] = [];
    HORIZONTAL_LINE_ARRAY_ARRAY.push(HORIZONTAL_LINE_ARRAY);
    for (let colIndex = 0; colIndex < COL_COUNT; ++colIndex) {
      const xStart = colIndex;
      const xEnd = xStart + 1;
      const lineStyle = parseInt(CUBE_LINE[OFFSET + colIndex]);
      gridLines.push({ xStart, xEnd, yStart, yEnd, lineStyle });
      HORIZONTAL_LINE_ARRAY.push(lineStyle);
    }
  }
  const VERTICAL_LINE_ARRAY_ARRAY: number[][] = [];
  const VERTICAL_LINE_OFFSET = COL_COUNT * (ROW_COUNT + 1);
  for (let rowIndex = 0; rowIndex < ROW_COUNT; ++rowIndex) {
    const OFFSET = VERTICAL_LINE_OFFSET + (COL_COUNT + 1) * rowIndex;
    const yStart = rowIndex;
    const yEnd = yStart + 1;
    const VERTICAL_LINE_ARRAY: number[] = [];
    VERTICAL_LINE_ARRAY_ARRAY.push(VERTICAL_LINE_ARRAY);
    for (let colIndex = 0; colIndex <= COL_COUNT; ++colIndex) {
      const xStart = colIndex;
      const xEnd = xStart;
      const lineStyle = parseInt(CUBE_LINE[OFFSET + colIndex]);
      gridLines.push({ xStart, xEnd, yStart, yEnd, lineStyle });
      VERTICAL_LINE_ARRAY.push(lineStyle);
    }
  }
  // console.log({CUBE_LINE, HORIZONTAL_LINE_ARRAY_ARRAY, VERTICAL_LINE_ARRAY_ARRAY, gridLines});

  // 0043 1011 2153 3050 4033 5772 67b1 7020 8000 9713
  const ACT_CELL_COUNT = ACT_CELLS.length / 4;
  const actCells: CubeForDrawingActCell[] = [];
  for (let infoIndex = 0; infoIndex < ACT_CELL_COUNT; ++infoIndex) {
    // layerIndex: number,
    // relation: ConnectionRelation,
    // feature: CellFeature,
    // sixFace: SixFace,
    // faceDirection: FourDirection,
    // twelveEdge: TwelveEdge,
    // rowIndex: number,
    // colIndex: number,

    // 压缩后的正方体信息（正方体间以回车符分隔，4位一格，16进制）：
    //      1）1位：格序（1位，0-15，16进制0-E）
    //      2）1位：功能（1位，2-3，2面3片，减2乘6）+层序（1位，1-6转0-5），转1位16进制
    //      3）1位：面序或片序——面序0-5，片序0-11，转1位十六进制
    //      4）1位：方向序，0-3
    const START = 4 * infoIndex;
    const CELL_INFO = ACT_CELLS.substring(START, START + 4);

    //      1）1位：格序（1位，0-15，16进制0-E）
    const cellIndex: number = parseInt(CELL_INFO.substring(0, 1), 16);
    const rowIndex: number = Math.floor(cellIndex / COL_COUNT);
    const colIndex: number = cellIndex % COL_COUNT;
    if (rowIndex === 0) {
      firstRowActCellColIndexBill += colIndex.toString();
    } else if (rowIndex === MAX_ROW_INDEX) {
      lastRowEmptyCellColIndexBill = lastRowEmptyCellColIndexBill.replace(
        colIndex.toString(),
        "",
      );
    }

    //      2）1位：功能（1位，2-3，2面3片，减2乘6）+层序（1位，1-6转0-5），转1位16进制
    const featureAndLayerIndex = parseInt(CELL_INFO.substring(1, 2), 16);
    const feature: CellFeature = featureAndLayerIndex >= 6
      ? CellFeature.Piece
      : CellFeature.Face;
    const layerIndex: number = featureAndLayerIndex % 6 + 1;

    //      3）1位：面序或片序——面序0-5，片序0-11，转1位十六进制
    const sixFaceAndFaceDirectionOrTwelveEdge = parseInt(
      CELL_INFO.substring(2, 3),
      16,
    );
    const sixFace = feature === CellFeature.Piece
      ? SixFace.Up
      : sixFaceAndFaceDirectionOrTwelveEdge;
    const twelveEdge: TwelveEdge = feature === CellFeature.Piece
      ? sixFaceAndFaceDirectionOrTwelveEdge
      : TwelveEdge.NotSure;

    //      4）1位：方向序，0-3
    // const relation: ConnectionRelation = parseInt(CELL_INFO.substring(3, 4), 16);
    const faceDirection: ConnectionRelation = parseInt(
      CELL_INFO.substring(3, 4),
      16,
    );

    let relation = ConnectionRelation.Top;
    if (feature === CellFeature.Piece) {
      const topLine = HORIZONTAL_LINE_ARRAY_ARRAY[rowIndex][colIndex];
      const bottomLine = HORIZONTAL_LINE_ARRAY_ARRAY[rowIndex + 1][colIndex];

      const leftLine = VERTICAL_LINE_ARRAY_ARRAY[rowIndex][colIndex];
      const rightLine = VERTICAL_LINE_ARRAY_ARRAY[rowIndex][colIndex + 1];

      if (topLine === GridLineStyle.InnerLine) {
        relation = ConnectionRelation.Bottom;
      } else if (bottomLine === GridLineStyle.InnerLine) {
        relation = ConnectionRelation.Top;
      } else if (leftLine === GridLineStyle.InnerLine) {
        relation = ConnectionRelation.Right;
      } else if (rightLine === GridLineStyle.InnerLine) {
        relation = ConnectionRelation.Left;
      }
      // console.log({ feature, relation, topLine, bottomLine, leftLine, rightLine, InnerLine: GridLineStyle.InnerLine,
      // CUBE_LINE, HORIZONTAL_LINE_ARRAY_ARRAY, VERTICAL_LINE_ARRAY_ARRAY
      // });
    }
    actCells.push({
      layerIndex, // : number,
      relation, // : ConnectionRelation,
      feature, // : CellFeature,
      sixFace, // : SixFace,
      faceDirection, // : FourDirection,
      twelveEdge, // : TwelveEdge,
      rowIndex, // : number,
      colIndex, // : number,
    });
  }

  return {
    no,
    actCells,
    gridLines,

    rowCount: ROW_COUNT,
    colCount: COL_COUNT,

    firstRowActCellColIndexBill,
    lastRowEmptyCellColIndexBill,
  } as CubeForDrawing;
}

export async function done(
  DATAS: {
    setName: string;
    cubes: [number[], number[]][];
  }[],
  GOAL_FILE: string,
) {
  // LOG_FILE_NAME = './ghostkubes_01.log.txt';

  // Deno.writeTextFileSync(GOAL_FILE, 'const Cubes = [\n');

  let codes = "const SET_ARRAY = \n";

  const {
    SHOW_INFO_WHEN_PIECE_COUNT_EQUALS_OR_GREAT_THAN_TWO,
    SHOW_OK_COUNT_OF_MANNERS_FILE_AND_SOURCE_MANNER_COUNT,
  } = DEBUG;

  const MAX_CUBE_NO_OF_TWO_ROWS = 10560;

  const CUBES = [];
  const CUBE_NO_ARRAY: number[] = [];
  let cubeCount = 0;

  const SET_ARRAY: object[] = [];
  const DATA_COUNT = DATAS.length;

  // 将查询结果存起来，在下一轮查询前，先查询这个暂存结果中是否有相关内容，以减少对大文件的读取
  const SOURCE_MANNER_ARRAY = [];
  const MANNER_ARRAY = [];
  // const MANNER_PIECE_COUNT_ARRAY = [];
  let sourceMannerCount = 0;
  function addSourceManner(manner: string, pieceCount: number) {
    let finded = false;
    for (
      let sourceMannerIndex = 0;
      sourceMannerIndex < sourceMannerCount;
      ++sourceMannerIndex
    ) {
      if (SOURCE_MANNER_ARRAY[sourceMannerIndex] === manner) {
        finded = true;
        break;
      }
    }

    if (!finded) {
      SOURCE_MANNER_ARRAY.push(manner);
      // MANNER_PIECE_COUNT_ARRAY.push(pieceCount);
      MANNER_ARRAY.push({ mannerSource: manner, pieceCount });
      ++sourceMannerCount;
    }
  }

  function getCubeByManner(searchManner: string): Cube | null {
    for (let mannerIndex = 0; mannerIndex < sourceMannerCount; ++mannerIndex) {
      const MANNER_OBJECT = MANNER_ARRAY[mannerIndex];
      if (MANNER_OBJECT.mannerSource === searchManner) {
        return MANNER_OBJECT.cube;
      }
    }

    return null;
  }

  const NEW_CACHE_DATA_ARRAY = [];
  let newCacheDataCount = CACHE_DATA_COUNT;
  for (let dataIndex = 0; dataIndex < CACHE_DATA_COUNT; ++dataIndex) {
    NEW_CACHE_DATA_ARRAY.push(CACHE_DATA_ARRAY[dataIndex]);
  }

  // 第一轮收集manner
  for (let dataIndex = 0; dataIndex < DATA_COUNT; ++dataIndex) {
    const DATA = DATAS[dataIndex];
    const { setName, cubes } = DATA;

    const cubeInfos = [];
    const CUBE_COUNT = cubes.length;

    let cubeInfoCount = cubeInfos.length;
    DATA.cubeInfos = cubeInfos;

    let ok = false;
    if (!SKIP_CACHE_DATA) {
      let okCount = 0;

      for (let cubeIndex = 0; cubeIndex < CUBE_COUNT; ++cubeIndex) {
        const [inNoArray, outNoArray] = cubes[cubeIndex];
        const [mannerRegExp, pieceCount] = getMannerFromCubeInfo(
          inNoArray,
          outNoArray,
        );

        let find = false;
        for (let dataIndex = 0; dataIndex < CACHE_DATA_COUNT; ++dataIndex) {
          const CACHE_DATA = CACHE_DATA_ARRAY[dataIndex];
          const { mannerRegExp: CACHE_MANNER_REG_EXP, cube: CACHE_CUBE } =
            CACHE_DATA;

          if (CACHE_MANNER_REG_EXP === mannerRegExp) {
            cubeInfos.push({
              manner: mannerRegExp,
              cube: CUBE_SOURCE.cube,
              cubeNo: CUBE_SOURCE.cubeNo,
            });
            ++okCount;
            find = true;
            break;
          }
        }

        if (!find) {
          cubeInfos.push({
            manner: "",
            cube: undefined,
            cubeNo: 0,
          });
        }
      }

      ok = okCount === CUBE_COUNT;
    } else {
      for (let cubeIndex = 0; cubeIndex < CUBE_COUNT; ++cubeIndex) {
        cubeInfos.push({});
      }
    }

    if (ok) {
      continue;
    }

    for (let cubeIndex = 0; cubeIndex < CUBE_COUNT; ++cubeIndex) {
      if (cubeInfos[cubeIndex].cube) {
        continue;
      }
      const [inNoArray, outNoArray] = cubes[cubeIndex];
      const [manner, pieceCount] = getMannerFromCubeInfo(inNoArray, outNoArray);
      // console.log({manner});
      // cubeGoal.manner = manner;

      // cubeInfos.push({manner});
      cubeInfos[cubeIndex].manner = manner;

      ++cubeInfoCount;

      addSourceManner(manner, pieceCount);
    }
  }

  showUsedTime(`step1: collect info from DATAS`);
  let fileName = "";

  if (sourceMannerCount) {
    const CUBE_LINE_ARRAY = getCubeLineArray();

    // 遍历大文件，转化所收集的manner清单到实际正方体
    fileName = "../data/manners.txt";
    let okCountOfMannersFile = 0;
    await readFileByStreamSync(fileName, (mannerInfo: string) => {
      let count = 0;
      for (let i = 0; i < sourceMannerCount; ++i) {
        const MANNER_OBJECT = MANNER_ARRAY[i];
        if (MANNER_OBJECT.cubeNo) {
          continue;
        }

        const { mannerSource: SEARCH_MANNER, pieceCount } = MANNER_OBJECT;
        const MANNER_REGEX = new RegExp(SEARCH_MANNER);

        const [MANNER, CUBE_NO_BILL] = mannerInfo.split("\t");
        if (MANNER_REGEX.test(MANNER)) {
          const cubeNoArray = CUBE_NO_BILL.split("|").map((value) =>
            parseInt(value)
          );
          // log(SEARCH_MANNER, pieceCount, typeof cubeNoArray[0]);
          // log(MANNER, pieceCount, SEARCH_MANNER);
          if (
            SHOW_INFO_WHEN_PIECE_COUNT_EQUALS_OR_GREAT_THAN_TWO &&
            pieceCount >= 2
          ) {
            log(
              pieceCount,
              cubeNoArray.filter((no) => no > MAX_CUBE_NO_OF_TWO_ROWS).length,
              MANNER,
              CUBE_NO_BILL,
              SEARCH_MANNER,
            );
          }
          const cubeNoCount = cubeNoArray.length;
          let cubeNo = 0;
          if (SKIP_CUBE_ARRAY_IN_BLACK_LIST) {
            if (pieceCount < 2) {
              cubeNo = cubeNoArray[0];
            } else {
              for (let cubeIndex = 0; cubeIndex < cubeNoCount; ++cubeIndex) {
                const currentCubeNo = cubeNoArray[cubeIndex];
                if (currentCubeNo > MAX_CUBE_NO_OF_TWO_ROWS) {
                  cubeNo = currentCubeNo;
                  break;
                }
              }
            }
          } else {
            for (let cubeIndex = 0; cubeIndex < cubeNoCount; ++cubeIndex) {
              const currentCubeNo = cubeNoArray[cubeIndex];
              let needSkipped = false;
              for (let index = 0; index < CUBE_COUNT_IN_BLACK_LIST; ++index) {
                if (CUBE_ARRAY_IN_BLACK_LIST[index] === currentCubeNo) {
                  needSkipped = true;
                  break;
                }
              }

              if (!needSkipped) {
                if (pieceCount < 2 || currentCubeNo > MAX_CUBE_NO_OF_TWO_ROWS) {
                  cubeNo = currentCubeNo;
                  break;
                }
              }
            }
          }

          if (cubeNo > 0) {
            ++count;

            MANNER_OBJECT.cubeNo = cubeNo;
            ++okCountOfMannersFile;

            // 2. 根据cubeNo与CUBE_LINE_ARRAY，获取边线数据并还原
            // 444442222244444422324433234
            // 44444222222222244444433334432324423234
            const CUBE_LINE = CUBE_LINE_ARRAY[Math.floor((cubeNo - 0.5) / 24)];
            // // 27 chars or 38 chars
            // const ROW_COUNT = CUBE_LINE.length === 27 ? 2 : 3;

            // 3. 根据cubeNo与cubes/00####.txt（每文件30720行，所以可以直接算出读哪个文件，再读相应行），获取格信息
            const CUBE_FILE_NO = Math.ceil((cubeNo - 0.5) / 30720);
            const CUBE_LINE_INDEX_IN_FILE = Math.floor((cubeNo - 0.5) % 30720); // cubeNo % 30720;
            // 00431011215330504033577267b1702080009713
            const ACT_CELLS = Deno.readTextFileSync(
              `../data/cubes/${CUBE_FILE_NO.toString().padStart(6, "0")}.txt`,
            )
              .split(
                "\n",
              )[CUBE_LINE_INDEX_IN_FILE];

            const CUBE = getCubeForDrawing(cubeNo, CUBE_LINE, ACT_CELLS);
            MANNER_OBJECT.cube = CUBE;

            let findInNewCacheData = false;
            for (
              let dataIndex = 0;
              dataIndex < newCacheDataCount;
              ++dataIndex
            ) {
              const NEW_CACHE_DATA = NEW_CACHE_DATA_ARRAY[dataIndex];
              if (NEW_CACHE_DATA.manner === MANNER) {
                findInNewCacheData = true;
                break;
              }
            }
            if (!findInNewCacheData) {
              ++newCacheDataCount;
              // NEW_CACHE_DATA_ARRAY.push({searchManner: SEARCH_MANNER, manner: manner});
              NEW_CACHE_DATA_ARRAY.push({
                mannerRegExp: SEARCH_MANNER,
                manner: MANNER,
                cube: CUBE,
              });
            }

            // for (let dataIndex = 0; dataIndex < newCacheDataCount; ++dataIndex) {
            // const NEW_CACHE_DATA = NEW_CACHE_DATA_ARRAY[dataIndex];
            // if (NEW_CACHE_DATA.manner === MANNER) {
            // NEW_CACHE_DATA.cube = CUBE;
            // break;
            // }
            // }
            // } else {
            // log(`[error]Couldn't find the fitful cube by '${SEARCH_MANNER}' and ${pieceCount}.`);
          }
        }
      }
      return count;
    }, sourceMannerCount);
    if (SHOW_OK_COUNT_OF_MANNERS_FILE_AND_SOURCE_MANNER_COUNT) {
      log({ okCountOfMannersFile, sourceMannerCount });
    }
    if (okCountOfMannersFile < sourceMannerCount) {
      log(
        `[error]${
          sourceMannerCount - okCountOfMannersFile
        } items couldn't find in '${fileName}'.`,
      );
    }
    showUsedTime(`step3: collect info from ${fileName}`);
  }

  // 第二轮实际处理
  for (let dataIndex = 0; dataIndex < DATA_COUNT; ++dataIndex) {
    const { setName, cubes, cubeInfos } = DATAS[dataIndex];

    const SET = { name: setName, cubes: [] };
    SET_ARRAY.push(SET);

    const CUBE_COUNT = cubes.length;
    for (let cubeIndex = 0; cubeIndex < CUBE_COUNT; ++cubeIndex) {
      const cubeGoal = cubeInfos[cubeIndex];

      const CUBE = cubeGoal.cube
        ? cubeGoal.cube
        : getCubeByManner(cubeGoal.manner);
      if (CUBE) {
        const CUBE_NO: number = CUBE.no;

        let finded = false;
        for (let cubeIndex = 0; cubeIndex < cubeCount; ++cubeIndex) {
          if (CUBE_NO_ARRAY[cubeIndex] === CUBE_NO) {
            finded = true;
            break;
          }
        }

        if (!finded) {
          CUBE_NO_ARRAY.push(CUBE_NO);
          CUBES.push(CUBE);
          ++cubeCount;
        }

        SET.cubes.push(CUBE_NO);

        cubeGoal.cube = CUBE;
      } else {
        log(`[error]${setName}.${cubeIndex + 1}.cube is null or undefined.`);
      }
    }
  }

  codes += JSON.stringify(SET_ARRAY);
  codes += "\n;";
  codes += `\nconst CUBES = ${JSON.stringify(CUBES)};`;

  Deno.writeTextFileSync(GOAL_FILE, codes);

  // not work: NEW_CACHE_DATA_ARRAY.sort((prev, next) => prev.manner < next.manner);
  NEW_CACHE_DATA_ARRAY.sort((prev, next) =>
    prev.manner.localeCompare(next.manner)
  );
  const NEW_CACHE_DATA_ARRAY_JSON = JSON.stringify(NEW_CACHE_DATA_ARRAY);
  if (OLD_CACHE_DATA_ARRAY_JSON !== NEW_CACHE_DATA_ARRAY_JSON) {
    Deno.writeTextFileSync(
      "../data/dataCache.ts",
      `export const CACHE_DATA_ARRAY = ${NEW_CACHE_DATA_ARRAY_JSON};
export const CACHE_DATA_COUNT = CACHE_DATA_ARRAY.length;
export const SKIP_CACHE_DATA = !!CACHE_DATA_COUNT;
`,
    );
  }
}

/*
set pwd=P:\anqi\Desktop\tech\ts\projects\203_ts_ghostkube\test
cls && deno lint %pwd%\ghostkubes.ts && deno fmt %pwd%\ghostkubes.ts
*/

/*
*/
