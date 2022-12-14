interface LogData {
  level: number | string;
}

interface LogDataWithLevelNumber extends LogData {
  level: number;
}

interface LogDataWithLevelName extends LogData {
  level: string;
}
