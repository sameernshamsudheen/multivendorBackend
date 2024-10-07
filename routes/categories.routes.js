import express from "express";

import isAuthenticated from "../middleware/isauthenticated.js";
import { upload } from "../middleware/multermiddleware.js";
import authorize from "../middleware/authorize.js";
import {
  createACategory,
  deleteCategory,
  getAllCategory,
  getCategoryBySlug,
  updateCategory,
} from "../controllers/category/category.controller.js";

const CategoryRouter = express.Router();

CategoryRouter.post(
  "/category-create",
  isAuthenticated,

  createACategory
);
CategoryRouter.get(
  "/category-all",
  isAuthenticated,

  getAllCategory
);
CategoryRouter.put(
  "/category-update/:id",
  isAuthenticated,

  updateCategory
);
CategoryRouter.get("/category-slug/:slug", isAuthenticated, getCategoryBySlug);

CategoryRouter.delete(
  "/category-delete/:id",
  isAuthenticated,

  deleteCategory
);

export default CategoryRouter;
