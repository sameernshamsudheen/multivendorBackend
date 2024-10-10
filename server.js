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
import productRouter from "./routes/product.routes.js";
import brandRouter from "./routes/brand.routes.js";
import subCategoryRouter from "./routes/subcategory.routes.js";
import CategoryRouter from "./routes/categories.routes.js";
import whishlistRouter from "./routes/wishlist.routes.js";
import reviewRouter from "./routes/review.routes.js";
import OrderRouter from "./routes/order.routes.js";

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

app.use(
  "/api/v1",
  userRouter,
  vendorRouter,
  productRouter,
  brandRouter,
  subCategoryRouter,
  CategoryRouter,
  whishlistRouter,
  reviewRouter,
  OrderRouter
  
);
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
