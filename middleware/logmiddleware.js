import morgan from "morgan";
import logger from "../logger/logger.js"; // Import the Winston logger configuration

// Create a stream object with a 'write' function to pass morgan logs to winston
const morganMiddleware = morgan("combined", {
  stream: {
    write: (message) => logger.info(message.trim()), // Pass HTTP request logs to Winston
  },
});

export default morganMiddleware;
