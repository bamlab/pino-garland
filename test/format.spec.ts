import { FormatContext, FormatDate, FormatHTTP, FormatLevel, FormatMessage, FormatRequestId } from "../src/format";

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

  describe("formatContext", () => {
    it("should format a context", () => {
      // Given
      const logData = { context: "my-context" };
      // When
      const formatContext = new FormatContext();
      const formattedContext = formatContext.format(logData);
      // Then
      expect(formattedContext).toEqual("[      my-context      ]");
    });

    it("should refuse to format if the log data does not have a context", () => {
      // Given
      const logData = {};
      // When
      const formatContext = new FormatContext();
      const canFormat = formatContext.canFormat(logData);
      // Then
      expect(canFormat).toEqual(false);
    });

    it("should return a placeholder of the right length", () => {
      // Given
      const completeLogData = { context: "my-context" };
      // When
      const formatContext = new FormatContext();
      const formattedContext = formatContext.format(completeLogData);
      const placeholder = formatContext.placeholder();
      // Then
      expect(placeholder.length).toEqual(formattedContext.length);
      expect(placeholder).toEqual("[   -- no context --   ]");
    });
  });

  describe("formatMessage", () => {
    it("should format a message", () => {
      // Given
      const logData = { msg: "my-message", level: "info" };
      // When
      const formatMessage = new FormatMessage();
      const formattedMessage = formatMessage.format(logData);
      // Then
      expect(formattedMessage).toEqual("my-message");
    });

    it("should refuse to format if the log data does not have a message", () => {
      // Given
      const logData = {};
      // When
      const formatMessage = new FormatMessage();
      const canFormat = formatMessage.canFormat(logData);
      // Then
      expect(canFormat).toEqual(false);
    });

    it("should return a placeholder of the right length", () => {
      // Given
      // When
      const formatMessage = new FormatMessage();
      const placeholder = formatMessage.placeholder();
      // Then
      expect(placeholder).toEqual("");
    });

    it("should format request markers - Start", () => {
      // Given
      const logData = { msg: "REQUEST START", level: "info" };
      // When
      const formatMessage = new FormatMessage();
      const formattedMessage = formatMessage.format(logData);
      // Then
      expect(formattedMessage).toEqual("🎤 <--");
    });

    it("should format request markers - Success", () => {
      // Given
      const logData = { msg: "REQUEST SUCCESS", level: "info" };
      // When
      const formatMessage = new FormatMessage();
      const formattedMessage = formatMessage.format(logData);
      // Then
      expect(formattedMessage).toEqual("🎧 -->");
    });

    it("should format request markers - Error", () => {
      // Given
      const logData = { msg: "REQUEST ERROR", level: "info" };
      // When
      const formatMessage = new FormatMessage();
      const formattedMessage = formatMessage.format(logData);
      // Then
      expect(formattedMessage).toEqual("📢 -->");
    });
  });

  describe("format HTTP", () => {
    it("should format a HTTP request", () => {
      // Given
      const logData = {
        msg: "REQUEST START",
        req: {
          id: "722449b6-850b-4c50-8784-1ca18007b588",
          method: "GET",
          url: "/my-url",
          headers: {
            "content-type": "application/json",
            "user-agent": "my-user-agent",
          },
        },
      };
      // When
      const formatHttp = new FormatHTTP();
      const formattedHttp = formatHttp.format(logData);
      // Then
      expect(formattedHttp).toEqual("GET /my-url");
    });

    it("should format a HTTP response", () => {
      // Given
      const logData = {
        msg: "REQUEST SUCCESS",
        req: {
          id: "722449b6-850b-4c50-8784-1ca18007b588",
          method: "GET",
          url: "/my-url",
          headers: {
            "content-type": "application/json",
            "user-agent": "my-user-agent",
          },
        },
        res: {
          statusCode: 200,
        },
        responseTime: 100,
      };
      // When
      const formatHttp = new FormatHTTP();
      const formattedHttp = formatHttp.format(logData);
      // Then
      expect(formattedHttp).toEqual("GET /my-url status: 200 (in 100ms)");
    });

    it("should format a HTTP error", () => {
      // Given
      const logData = {
        msg: "REQUEST ERROR",
        req: {
          id: "722449b6-850b-4c50-8784-1ca18007b588",
          method: "GET",
          url: "/my-url",
          headers: {
            "content-type": "application/json",
            "user-agent": "my-user-agent",
          },
        },
        res: {
          statusCode: 400,
        },
        err: {
          response: {
            statusCode: 400,
          },
          name: "Bad Request",
        },
        responseTime: 100,
      };
      // When
      const formatHttp = new FormatHTTP();
      const formattedHttp = formatHttp.format(logData);
      // Then
      expect(formattedHttp).toEqual("GET /my-url status: 400 Bad Request (in 100ms)");
    });
  });
});
