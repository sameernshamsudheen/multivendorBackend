import express from "express";

import isAuthenticated from "../middleware/isauthenticated.js";
import { upload } from "../middleware/multermiddleware.js";
import authorize from "../middleware/authorize.js";
import {
  createASubcategory,
  getAllSubCategory,
  getSubcategoryBySlug,
  updateSubCategory,
  deleteSubcategory,
} from "../controllers/subcategory/subcategory.controller.js";

const subCategoryRouter = express.Router();

subCategoryRouter.post(
  "/subcategory-create",
  isAuthenticated,

  createASubcategory
);
subCategoryRouter.get(
  "/subcategory-all",
  isAuthenticated,

  getAllSubCategory
);
subCategoryRouter.put(
  "/subcategory-update/:id",
  isAuthenticated,

  updateSubCategory
);
subCategoryRouter.get(
  "/subcategory-slug/:slug",
  isAuthenticated,
  getSubcategoryBySlug
);

subCategoryRouter.delete(
  "/subcategory-delete/:id",
  isAuthenticated,

  deleteSubcategory
);

export default subCategoryRouter;
