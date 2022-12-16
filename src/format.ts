import c from "ansi-colors";
import indent from "indent-string";
import { EOL } from "node:os";
import StackTracey from "stacktracey";
import * as sqlFormatter from "sql-formatter";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";

import { prettyPrintObj } from "./utils/prettyPrintObject";
import { center, padNumber } from "./utils/text";
import type { HighlightSubject } from "@mikro-orm/sql-highlighter/enums";

export abstract class Format {
  abstract canFormat(logData: LogData): boolean;
  abstract format(logData: LogDataWithLevelName): string;
  abstract placeholder(): string;
}

export class FormatDate extends Format {
  private SIZE: number;

  constructor() {
    super();
    const placeholderTimestamp = new Date(0).getTime();
    this.SIZE = this.format({ time: placeholderTimestamp }).length;
  }

  canFormat(logData: { time?: number }): boolean {
    return logData.time !== undefined;
  }

  format(logData: { time: number }): string {
    const { time } = logData;
    const formattedTime = new Date(time);

    const hours = padNumber(formattedTime.getHours(), 2);
    const minutes = padNumber(formattedTime.getMinutes(), 2);
    const seconds = padNumber(formattedTime.getSeconds(), 2);
    const milliseconds = padNumber(formattedTime.getMilliseconds(), 3);

    return c.gray(`${hours}:${minutes}:${seconds}.${milliseconds}`);
  }

  placeholder(): string {
    return " ".repeat(this.SIZE);
  }
}

export class FormatRequestId extends Format {
  private REQUEST_ID_SIZE = 18;
  private SIZE: number = this.REQUEST_ID_SIZE + 5;

  constructor() {
    super();
  }

  canFormat(logData: { req?: { id?: string } }): boolean {
    return logData.req !== undefined && logData.req.id !== undefined;
  }

  format(logData: { req: { id: string } }): string {
    const requestId = logData.req.id;
    const shortRequestId = requestId.substring(0, this.REQUEST_ID_SIZE);
    return c.cyan(`[req: ${shortRequestId}]`);
  }

  placeholder(): string {
    const placeholderRequestId = center("no request", this.SIZE);
    return c.grey(`[${placeholderRequestId}]`);
  }
}

export class FormatLevel extends Format {
  private EMOJIS: Record<string, string> = {
    trace: "🔍",
    debug: "🐛",
    info: "✨",
    warn: "⚠️ ",
    error: "🚨",
    fatal: "💀",
  };

  constructor() {
    super();
  }

  canFormat(logData: { level?: string | number }): boolean {
    return logData.level !== undefined;
  }

  format(logData: { level: string }): string {
    const emoji = this.EMOJIS[logData.level] || "🤷‍♂️";
    return c.bold(`${emoji}`);
  }

  placeholder(): string {
    return c.bold(`🤷‍♂️`);
  }
}

export class FormatContext extends Format {
  private MAX_SIZE = 22;

  constructor() {
    super();
  }

  canFormat(logData: { context?: string }): boolean {
    return logData.context !== undefined;
  }

  format(logData: { context: string }): string {
    const { context } = logData;
    const shortContext = context.substring(0, this.MAX_SIZE);
    const paddedContext = center(shortContext, this.MAX_SIZE);
    return c.yellow(`[${paddedContext}]`);
  }

  placeholder(): string {
    const paddedPlaceholder = center("-- no context --", this.MAX_SIZE);
    return c.grey(`[${paddedPlaceholder}]`);
  }
}

function isMarkingRequestStart(message: string): boolean {
  return message === "REQUEST START";
}

function isMarkingRequestSuccess(message: string): boolean {
  return message === "REQUEST SUCCESS";
}

function isMarkingRequestError(message: string): boolean {
  return message === "REQUEST ERROR";
}

export class FormatMessage extends Format {
  constructor() {
    super();
  }

  canFormat(logData: { msg?: string }): boolean {
    return logData.msg !== undefined;
  }

  format(logData: { msg: string; level: string }): string {
    const { msg } = logData;

    if (isMarkingRequestStart(msg)) {
      return c.white("🎤 <--");
    }
    if (isMarkingRequestSuccess(msg)) {
      return c.white("🎧 -->");
    }
    if (isMarkingRequestError(msg)) {
      return c.white("📢 -->");
    }

    let color: c.StyleFunction;
    switch (logData.level) {
      case "trace":
        color = c.white;
        break;
      case "debug":
        color = c.yellow;
        break;
      case "info":
        color = c.green;
        break;
      case "warn":
        color = c.magenta;
        break;
      case "error":
        color = c.red;
        break;
      case "fatal":
        color = c.white.bgRed;
        break;
      default:
        color = c.green;
        break;
    }

    return color(msg);
  }

  placeholder(): string {
    return "";
  }
}

export class FormatHTTP extends Format {
  canFormat(logData: {
    msg: string;
    req: { method: string; url: string };
    res?: { statusCode: number };
    err?: { response: { statusCode: number }; name: string };
    responseTime?: number;
  }): boolean {
    if (isMarkingRequestStart(logData.msg)) {
      return (
        logData.req?.method !== undefined && //
        logData.req?.url !== undefined
      );
    }
    if (isMarkingRequestSuccess(logData.msg)) {
      return (
        logData.req?.method !== undefined && //
        logData.req?.url !== undefined &&
        logData.res?.statusCode !== undefined &&
        logData.responseTime !== undefined
      );
    }
    if (isMarkingRequestError(logData.msg)) {
      return (
        logData.req?.method !== undefined &&
        logData.req?.url !== undefined &&
        logData.err?.response?.statusCode !== undefined &&
        logData.err?.name !== undefined &&
        logData.responseTime !== undefined
      );
    }
    return false;
  }

  format(logData: {
    msg: string;
    req: { method: string; url: string };
    res?: { statusCode: number; message?: string };
    err?: { response: { statusCode: number }; name: string };
    responseTime?: number;
  }): string {
    const { msg, req, res, responseTime, err } = logData;

    let httpMessage = "";

    if (isMarkingRequestStart(msg)) {
      httpMessage += c.whiteBright(`${req.method} ${req.url}`);
    }
    if (isMarkingRequestSuccess(msg)) {
      httpMessage += c.gray(`${req.method} ${req.url}`);
      httpMessage += c.whiteBright(` status: ${res?.statusCode}`);
      httpMessage += c.gray(` (in ${responseTime}ms)`);
    }
    if (isMarkingRequestError(msg)) {
      httpMessage += c.gray(`${req.method} ${req.url}`);
      httpMessage += c.red(` status: ${err?.response?.statusCode} ${err?.name}`);
      httpMessage += c.gray(` (in ${responseTime}ms)`);
    }

    return c.white(httpMessage);
  }

  placeholder(): string {
    return "";
  }
}

export class FormatError extends Format {
  constructor() {
    super();
  }

  canFormat(logData: { err?: Error }): boolean {
    return logData.err !== undefined;
  }

  format(logData: { err: Error }): string {
    const err = logData.err;
    const stack = err.stack;

    let errorMessage = "";
    if (stack) {
      errorMessage += c.red(`Message: ${err.message}`);
      errorMessage += EOL;
      errorMessage += c.red("Stacktrace:");
      errorMessage += EOL;
      errorMessage += indent(c.red(new StackTracey(stack).clean().asTable()), 2);
    } else {
      errorMessage += c.red(prettyPrintObj(err, ["message"]));
    }

    return indent(`${EOL}${EOL}${errorMessage}${EOL}`, 2);
  }

  placeholder(): string {
    return "";
  }
}

export class FormatSQL extends Format {
  sqlHighlighter: SqlHighlighter;

  constructor() {
    super();
    const theme = {
      backtickQuote: c.yellow,
      boundary: c.reset,
      comment: c.gray,
      builtIn: c.magenta,
      functions: c.green,
      literal: c.blue,
      number: c.green,
      quote: c.yellow,
      reserved: c.magenta,
      variable: c.cyan,
      word: c.white,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any as {
      [K in keyof typeof HighlightSubject]?: string;
    };
    this.sqlHighlighter = new SqlHighlighter(theme);
  }

  canFormat(logData: { sql?: string; sqlParams?: string[] }): boolean {
    return logData.sql !== undefined;
  }

  format(logData: { sql: string; sqlParams?: string[] }): string {
    const { sql: query, sqlParams: params } = logData;

    let formatterOptions: sqlFormatter.FormatOptionsWithLanguage;
    if (params) {
      const stringParams = params.map((p) => p.toString());
      formatterOptions = {
        language: "postgresql",
        keywordCase: "upper",
        params: stringParams,
      };
    } else {
      formatterOptions = {
        language: "postgresql",
        keywordCase: "upper",
      };
    }

    const formattedSql = sqlFormatter.format(query, formatterOptions);
    const highlightedSql = this.sqlHighlighter.highlight(formattedSql);

    return indent(`${EOL}${EOL}${highlightedSql}${EOL}`, 2);
  }

  placeholder(): string {
    return "";
  }
}
