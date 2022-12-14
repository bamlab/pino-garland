import { EOL } from "node:os";
import {
  Format,
  FormatContext,
  FormatDate,
  FormatError,
  FormatHTTP,
  FormatLevel,
  FormatMessage,
  FormatObject,
  FormatRequestId,
  FormatSQL,
} from "./format";

const formatters: Format[] = [
  new FormatDate(),
  new FormatRequestId(),
  new FormatLevel(),
  new FormatContext(),
  new FormatMessage(),
  new FormatHTTP(),
  new FormatError(),
  new FormatObject(),
  new FormatSQL(),
];

export function print(logData: LogDataWithLevelName): string {
  const parts = [];

  for (const formatter of formatters) {
    if (formatter.canFormat(logData)) {
      parts.push(formatter.format(logData));
    } else {
      parts.push(formatter.placeholder());
    }
  }

  return `${parts.join(" ")}${EOL}`;
}

export function printUnknown(jsonLine: string): string {
  return `${jsonLine}${EOL}`;
}
