interface LogData {
  level: number | string;
  time: number;
  req: {
    id: string;
    method: string;
    url: string;
  };
  res: {
    statusCode: number;
  };
  context: string;
  msg: string;
  err: Error & { response: { statusCode: number; name: string } };
  responseTime: number;
}

interface LogDataWithLevelNumber extends LogData {
  level: number;
}

interface LogDataWithLevelName extends LogData {
  level: string;
}
