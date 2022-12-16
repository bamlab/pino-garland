import chalk, { ChalkInstance } from "chalk";
import { center, padNumber } from "./utils/text";

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

    return chalk.gray(`${hours}:${minutes}:${seconds}.${milliseconds}`);
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
    return chalk.cyan(`[req: ${shortRequestId}]`);
  }

  placeholder(): string {
    const placeholderRequestId = center("no request", this.SIZE);
    return chalk.grey(`[${placeholderRequestId}]`);
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
    return chalk.bold(`${emoji}`);
  }

  placeholder(): string {
    return chalk.bold(`🤷‍♂️`);
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
    return chalk.yellow(`[${paddedContext}]`);
  }

  placeholder(): string {
    const paddedPlaceholder = center("-- no context --", this.MAX_SIZE);
    return chalk.grey(`[${paddedPlaceholder}]`);
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
      return chalk.white("🎤 <--");
    }
    if (isMarkingRequestSuccess(msg)) {
      return chalk.white("🎧 -->");
    }
    if (isMarkingRequestError(msg)) {
      return chalk.white("📢 -->");
    }

    let color: ChalkInstance;
    switch (logData.level) {
      case "trace":
        color = chalk.white;
        break;
      case "debug":
        color = chalk.yellow;
        break;
      case "info":
        color = chalk.green;
        break;
      case "warn":
        color = chalk.magenta;
        break;
      case "error":
        color = chalk.red;
        break;
      case "fatal":
        color = chalk.white.bgRed;
        break;
      default:
        color = chalk.green;
        break;
    }

    return color(msg);
  }

  placeholder(): string {
    return "";
  }
}
