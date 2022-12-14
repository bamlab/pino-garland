import chalk from "chalk";
import { padNumber } from "./utils/text";

export abstract class Format {
  abstract canFormat(logData: LogData): boolean;
  abstract format(logData: LogData): string;
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
