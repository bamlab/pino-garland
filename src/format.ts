export abstract class Format {
  abstract canFormat(logData: LogData): boolean;
  abstract format(logData: LogData): string;
  abstract placeholder(): string;
}
