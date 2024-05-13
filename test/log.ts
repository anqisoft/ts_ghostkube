export const APPEND_TRUE = { append: true };

export const Globals = globalThis as unknown as {
  LOG_FILE_NAME: string
};

let dateBegin = performance.now();
export function logUsedTime(functionName: string, duration: number) {
  log(
    `${functionName} used ${duration.toFixed(2)} milliseconds, or ${
      (duration / 1000).toFixed(3)
    } seconds${
      duration > 60000
        ? `, or ${(duration / 60000).toFixed(1)} minutes, ${
          duration > 3600000
            ? `, or ${Math.floor(duration / 3600000)}hours${
              Math.floor(duration % 3600000 / 60000)
            }minutes${Math.floor(duration % 60000).toFixed(0)}seconds`
            : ""
        }`
        : ""
    }`,
  );
}
export function showUsedTime(functionName: string) {
  const end = performance.now();
  const duration = end - dateBegin;
  logUsedTime(functionName, duration);

  dateBegin = end;
}

// deno-lint-ignore no-explicit-any
export function log(...dataArray: any[]) {
  console.log(...dataArray);
  let LOG_STRING = JSON.stringify(dataArray);
  LOG_STRING = LOG_STRING.substring(1, LOG_STRING.length - 1);
  if (LOG_STRING.startsWith('"') && LOG_STRING.endsWith('"')) {
    LOG_STRING = LOG_STRING.substring(1, LOG_STRING.length - 1);
  }
  Deno.writeTextFileSync(
    globalThis.LOG_FILE_NAME, // "./log.txt"
    // LOG_STRING.substring(1, LOG_STRING.length - 1).replace(/\\n/g, "\n").concat(
    //   "\n",
    // ),

    LOG_STRING.replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .concat(
        "\n",
      ),
    {
      append: true,
    },
  );
}

// deno run --v8-flags=--max-old-space-size=2048 -A test.ts
