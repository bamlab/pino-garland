#!/usr/bin/env node

import { fstatSync } from "fs";
import pump from "pump";
import split from "split2";
import { Transform } from "readable-stream";

import { parse, print, printUnknown } from "../dist/pino-garland.mjs";

const pretty = (/** @type {any} */ jsonLine) => {
  try {
    const logObject = parse(jsonLine);
    return print(logObject);
  } catch (e) {
    return printUnknown(jsonLine);
  }
};

const prettyTransport = new Transform({
  objectMode: true,
  transform(chunk, _enc, cb) {
    const jsonLine = chunk.toString();
    const formattedLine = pretty(jsonLine);
    if (formattedLine === undefined) return cb();
    cb(null, formattedLine);
  },
});

pump(process.stdin, split(), prettyTransport, process.stdout);

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noOp() {}

// https://github.com/pinojs/pino/pull/358
if (!process.stdin.isTTY && !fstatSync(process.stdin.fd).isFile()) {
  process.once("SIGINT", noOp);
}
