interface LogData {
  level: number | string;
  time: number;
}

interface LogDataWithLevelNumber extends LogData {
  level: number;
}

interface LogDataWithLevelName extends LogData {
  level: string;
}
