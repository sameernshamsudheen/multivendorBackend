import express from "express";
import { vendorRegistration } from "../controllers/vendor/vender.controller.js";
import isAuthenticated from "../middleware/isauthenticated.js";
import { upload } from "../middleware/multermiddleware.js";

const vendorRouter = express.Router();

vendorRouter.post(
  "/vendor-register",
  isAuthenticated,
  upload.fields([{ name: "storeImage", maxCount: 1 }]),
  vendorRegistration
);

export default vendorRouter;
