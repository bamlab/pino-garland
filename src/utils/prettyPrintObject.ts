import _ from "lodash";
import c from "ansi-colors";
import indent from "indent-string";
import { EOL } from "node:os";

const PINO_SPECIFIC_KEYS = [
  "level",
  "time",
  "msg",
  "message",
  "pid",
  "hostname",
  "name",
  "ns",
  "v",
  "req",
  "res",
  "statusCode",
  "responseTime",
  "elapsed",
  "method",
  "contentLength",
  "url",
  "context",
  "sql",
  "sqlParams",
  "trace",
];
const MAX_NUMBER_OF_LINES = 80;

// eslint-disable-next-line @typescript-eslint/ban-types
export function filterOutObject(obj: Object, keep: string[] = []) {
  const keysToRemove = _.difference(PINO_SPECIFIC_KEYS, keep);
  const filteredOutObject: Record<string, unknown> = _.omit(obj, keysToRemove);
  return filteredOutObject;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function prettyPrintObj(obj: Object, keep: string[] = []) {
  const filteredOutObject = filterOutObject(obj, keep);
  const filteredOutKeys = Object.keys(filteredOutObject);

  if (filteredOutKeys.length === 0) return "";

  const formatted = filteredOutKeys.map((key) => {
    const value = filteredOutObject[key];
    let formattedValue;
    if (_.isObject(value)) {
      formattedValue = JSON.stringify(value, null, 2);
      const formattedValueLength = formattedValue.split(EOL).length;
      if (formattedValueLength > MAX_NUMBER_OF_LINES) {
        const formattedArrValue = formattedValue.split(EOL).slice(0, MAX_NUMBER_OF_LINES);
        formattedArrValue.push(c.gray(`truncated at ${MAX_NUMBER_OF_LINES} out of ${formattedValueLength} lines file`));
        formattedValue = formattedArrValue.join(EOL);
      }
    }
    return `${key}: ${formattedValue || value}`;
  });

  return indent(formatted.join(EOL), 2);
}
