interface LogData {
  level: number | string;
  time: number;
  req: {
    id: string;
  };
}

interface LogDataWithLevelNumber extends LogData {
  level: number;
}

interface LogDataWithLevelName extends LogData {
  level: string;
}
