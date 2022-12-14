import { FormatDate } from "../src/format";

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
});
