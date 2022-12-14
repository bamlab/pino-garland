interface LogData {
  level: number | string;
  time: number;
  req: {
    id: string;
  };
  context: string;
}

interface LogDataWithLevelNumber extends LogData {
  level: number;
}

interface LogDataWithLevelName extends LogData {
  level: string;
}
