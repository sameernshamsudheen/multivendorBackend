import express from "express";
import "dotenv/config";
import connectDb from "./db/db.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.ORGIN_URL,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());

app.use("/api/v1", userRouter);
connectDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`server Started at ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
