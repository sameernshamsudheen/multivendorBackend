import { createLogger, format as winstonFormat, transports } from "winston"; // Renaming winston's format
import dotenv from "dotenv";
import winston from "winston";
import { MongoDB } from "winston-mongodb";
import { format as dateFnsFormat } from "date-fns"; // Renaming date-fns format

dotenv.config();

const { combine, timestamp, json, colorize } = winstonFormat; // Using winston's format

// Custom format for console logging with colors
const consoleLogFormat = combine(
  colorize(),
  winstonFormat.printf(({ level, message, timestamp }) => {
    return `${level}: ${message}`;
  })
);

// Create a Winston logger
const logger = winston.createLogger({
  transports: [
    // MongoDB transport
    new MongoDB({
      db: process.env.MONGODB_URI, // MongoDB Atlas URI from environment variables
      collection: "logs", // Collection name where logs will be stored
      level: "info", // Log level to store (can be 'info', 'error', etc.)
      options: {
        useUnifiedTopology: true,
      },
      format: combine(
        timestamp({
          format: () => dateFnsFormat(new Date(), "MM-dd-yyyy hh:mm:ss a"), // 12-hour format from date-fns
        }),
        json() // Logs will be stored in JSON format
      ),
    }),
    // Console transport for local logs
    new winston.transports.Console({
      format: combine(
        colorize(),
        winstonFormat.simple()
      ),
    }),
  ],
});

export default logger;
