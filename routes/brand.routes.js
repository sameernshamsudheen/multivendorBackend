import express from "express";

import isAuthenticated from "../middleware/isauthenticated.js";
import { upload } from "../middleware/multermiddleware.js";
import authorize from "../middleware/authorize.js";

import {
  createABrand,
  deleteBrand,
  getAllBrand,
  updateBrand,
  getBrandBySlug,
} from "../controllers/brand/brand.controller.js";

const brandRouter = express.Router();

brandRouter.post(
  "/brand-create",
  isAuthenticated,
  upload.fields([{ name: "logo", maxCount: 1 }]),
  createABrand
);
brandRouter.get(
  "/brand-all",
  isAuthenticated,

  getAllBrand
);
brandRouter.put(
  "/brand-update/:id",
  isAuthenticated,
  upload.fields([{ name: "logo", maxCount: 1 }]),
  updateBrand
);

brandRouter.get("/brand-slug/:slug", isAuthenticated, getBrandBySlug);

brandRouter.delete(
  "/brand-delete/:id",
  isAuthenticated,

  deleteBrand
);

export default brandRouter;
