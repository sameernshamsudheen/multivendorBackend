import express from "express";

import isAuthenticated from "../middleware/isauthenticated.js";
import authorize from "../middleware/authorize.js";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProductBySlug,
  updateProduct,
} from "../controllers/product/product.controller.js";
import { upload } from "../middleware/multermiddleware.js";

const productRouter = express.Router();

productRouter.post(
  "/product-create",
  isAuthenticated,
  authorize("vendor"),
  upload.fields([{ name: "image", maxCount: 2 }]),
  createProduct
);
productRouter.get("/product-slug/:slug", isAuthenticated, getProductBySlug);
// productRouter.post("/user-login", userLogin);

// productRouter.put("/user-profile", isAuthenticated, updateUserProfile);
productRouter.put(
  "/product-update/:id",
  isAuthenticated,
  upload.fields([{ name: "image", maxCount: 2 }]),
  updateProduct
);
productRouter.delete(
  "/product/:id",
  isAuthenticated,
  isAuthenticated("vendor"),

  deleteProduct
);
productRouter.get("/product-all", isAuthenticated, getAllProduct);

export default productRouter;
