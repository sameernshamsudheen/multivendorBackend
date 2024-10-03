import express from "express";
import { vendorRegistration } from "../controllers/vendor/vender.controller.js";
import isAuthenticated from "../middleware/isauthenticated.js";

const vendorRouter = express.Router();

vendorRouter.post("/vendor-register", isAuthenticated, vendorRegistration);

export default vendorRouter;
