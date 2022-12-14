import { FormatDate, FormatLevel, FormatRequestId } from "../src/format";

describe("format", () => {
  describe("formatDate", () => {
    it("should format a date", () => {
      // Given
      const logData = { time: 1539619829389 };
      // When
      const formatDate = new FormatDate();
      const formattedDate = formatDate.format(logData);
      // Then
      expect(formattedDate).toEqual("18:10:29.389");
    });

    it("should refuse to format if the log data does not have a time", () => {
      // Given
      const logData = {};
      // When
      const formatDate = new FormatDate();
      const canFormat = formatDate.canFormat(logData);
      // Then
      expect(canFormat).toEqual(false);
    });

    it("should return a placeholder of the right length", () => {
      // Given
      const completeLogData = { time: 1539619829389 };
      // When
      const formatDate = new FormatDate();
      const formattedDate = formatDate.format(completeLogData);
      const placeholder = formatDate.placeholder();
      // Then
      expect(placeholder).toEqual(" ".repeat(formattedDate.length));
    });
  });

  describe("formatRequestId", () => {
    it("should format a request id", () => {
      // Given
      const logData = { req: { id: "722449b6-850b-4c50-8784-1ca18007b588" } };
      // When
      const formatRequestId = new FormatRequestId();
      const formattedRequestId = formatRequestId.format(logData);
      // Then
      expect(formattedRequestId).toEqual("[req: 722449b6-850b-4c50]");
    });

    it("should refuse to format if the log data does not have a request id", () => {
      // Given
      const logData = {};
      // When
      const formatRequestId = new FormatRequestId();
      const canFormat = formatRequestId.canFormat(logData);
      // Then
      expect(canFormat).toEqual(false);
    });

    it("should return a placeholder of the right length", () => {
      // Given
      const completeLogData = { req: { id: "722449b6-850b-4c50-8784-1ca18007b588" } };
      // When
      const formatRequestId = new FormatRequestId();
      const formattedRequestId = formatRequestId.format(completeLogData);
      const placeholder = formatRequestId.placeholder();
      // Then
      expect(placeholder.length).toEqual(formattedRequestId.length);
      expect(placeholder).toEqual("[      no request       ]");
    });
  });

  describe("formatLevel", () => {
    it("should format a level", () => {
      // Given
      const logData = { level: "info" };
      // When
      const formatLevel = new FormatLevel();
      const formattedLevel = formatLevel.format(logData);
      // Then
      expect(formattedLevel).toEqual("✨");
    });

    it("should refuse to format if the log data does not have a level", () => {
      // Given
      const logData = {};
      // When
      const formatLevel = new FormatLevel();
      const canFormat = formatLevel.canFormat(logData);
      // Then
      expect(canFormat).toEqual(false);
    });

    it("should return a placeholder of the right length", () => {
      // Given
      // When
      const formatLevel = new FormatLevel();
      const placeholder = formatLevel.placeholder();
      // Then
      expect(placeholder).toEqual("🤷‍♂️");
    });
  });

});
