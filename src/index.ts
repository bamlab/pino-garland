import build from "pino-abstract-transport";
import SonicBoom from "sonic-boom";
import { once } from "node:events";

import { print } from "./print";

interface Options {
  // file-descriptor: either 1 or 2 for stdout or stderr or filepath
  destination?: string | number;
}

export default async function (opts: Options = {}) {
  // SonicBoom is necessary to avoid loops with the main thread.
  const destination = new SonicBoom({ dest: opts.destination || 1, sync: false });
  await once(destination, "ready");

  return build(
    async function (source) {
      for await (const logObject of source) {
        const logPrinted = print(logObject);

        const canKeepUpPace = destination.write(logPrinted);

        if (!canKeepUpPace) {
          await once(destination, "drain");
        }
      }
    },
    {
      async close(_err) {
        destination.end();
        await once(destination, "close");
      },
    },
  );
}

export { parse } from "./parse";
export { print, printUnknown } from "./print";
