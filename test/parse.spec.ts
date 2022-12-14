import { parse } from "../src/parse";

describe("parse", () => {
  it("should parse a log line", () => {
    // Given
    const logLine = '{"level": 30, "time": 1539619829389, "msg": "hello"}';
    // When
    const logData = parse(logLine);
    // Then
    expect(logData).toEqual({
      level: "info",
      time: 1539619829389,
      msg: "hello",
    });
  });

  it("should throw an error if the log line is not valid JSON", () => {
    // Given
    const logLine = "not valid JSON";
    // When
    const parseLogLine = () => parse(logLine);
    // Then
    expect(parseLogLine).toThrowErrorMatchingSnapshot();
  });

  it("should throw an error if the log line does not have a level", () => {
    // Given
    const logLine = '{"time": 1539619829389, "msg": "hello"}';
    // When
    const parseLogLine = () => parse(logLine);
    // Then
    expect(parseLogLine).toThrowErrorMatchingSnapshot();
  });

  it("should replace the log line's level with a level name", () => {
    // Given
    const logLine = '{"level": 30, "time": 1539619829389, "msg": "hello"}';
    // When
    const logData = parse(logLine);
    // Then
    expect(logData).toEqual({
      level: "info",
      time: 1539619829389,
      msg: "hello",
    });
  });
});
