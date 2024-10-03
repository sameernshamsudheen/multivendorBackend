import express from "express";
import "dotenv/config";
import connectDb from "./db/db.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import logger from "./logger/logger.js";
import morgan from "morgan";
import morganMiddleware from "./middleware/logmiddleware.js";
import helmet from "helmet";
import clearLogs from "./utils/clearlogs.js";
import cron from "node-cron";
import cookieParser from "cookie-parser";

import ErrorHandler from "./middleware/ErrorHandler.js";
import redis from "./redis/redis.js";
import vendorRouter from "./routes/vendor.routes.js";

const app = express();
app.use(cookieParser());

app.use(morganMiddleware);

app.use(
  cors({
    origin: process.env.ORGIN_URL,
    optionsSuccessStatus: 200,
  })
);
app.use(helmet());
app.use(express.json());

app.use("/api/v1", userRouter ,vendorRouter);
app.use(ErrorHandler);
cron.schedule("0 0 * * *", () => {
  console.log("Running cron job to clear logs...");
  clearLogs(); // Call the clearLogs function here
});
connectDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`server Started at ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
