import { ParseError } from "./errors/ParseError";
import { getErrorMessage } from "./utils/getErrorMessage";

export function parse(logJsonLine: string): LogDataWithLevelName {
  try {
    const logData = JSON.parse(logJsonLine);

    if (logData.level === undefined) {
      throw new ParseError("Log line doesn't have a level");
    }

    if (typeof logData.level === "number") {
      return replaceLevelWithLevelName(logData);
    }

    return logData;
  } catch (err) {
    const message = getErrorMessage(err);
    throw new ParseError(message);
  }
}

function replaceLevelWithLevelName(logData: LogDataWithLevelNumber): LogDataWithLevelName {
  let level: string;
  if (logData.level === 10) level = "trace";
  else if (logData.level === 20) level = "debug";
  else if (logData.level === 30) level = "info";
  else if (logData.level === 40) level = "warn";
  else if (logData.level === 50) level = "error";
  else if (logData.level === 60) level = "fatal";
  else level = "unknown";
  return { ...logData, level };
}
