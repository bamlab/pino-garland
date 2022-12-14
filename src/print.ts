import { EOL } from "node:os";
import { Format, FormatDate, FormatRequestId } from "./format";

const formatters: Format[] = [new FormatDate(), new FormatRequestId()];

export function print(logData: LogData): string {
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
