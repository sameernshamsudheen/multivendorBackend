import express from "express";
import {
  deleteVendor,
  getAllVendors,
  getVendorBySlug,
  updateVendors,
  vendorRegistration,
} from "../controllers/vendor/vender.controller.js";
import isAuthenticated from "../middleware/isauthenticated.js";
import { upload } from "../middleware/multermiddleware.js";
import authorize from "../middleware/authorize.js";
import { updateProduct } from "../controllers/product/product.controller.js";

const vendorRouter = express.Router();

vendorRouter.post(
  "/vendor-register",
  isAuthenticated,
  upload.fields([{ name: "storeImage", maxCount: 1 }]),
  vendorRegistration
);
vendorRouter.get(
  "/vendor-all",
  isAuthenticated,
  authorize("admin"),
  upload.fields([{ name: "storeImage", maxCount: 1 }]),
  getAllVendors
);
vendorRouter.put(
  "/vendor-update",
  isAuthenticated,
  authorize("vendor"),
  upload.fields([{ name: "storeImage", maxCount: 1 }]),
  updateVendors
);

vendorRouter.get(
  "/vendor-slug/:slug",
  isAuthenticated,
  authorize("vendor"),
  getVendorBySlug
);
vendorRouter.delete(
  "/vendor-delete",
  isAuthenticated,
  authorize("vendor"),
  deleteVendor
);
vendorRouter.put(
  "/vendor-update",
  isAuthenticated,
  authorize("vendor"),
  updateProduct
);

export default vendorRouter;
