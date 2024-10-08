import express from "express";

import isAuthenticated from "../middleware/isauthenticated.js";
import { upload } from "../middleware/multermiddleware.js";
import authorize from "../middleware/authorize.js";

import {
  AddAReview,
  deleteReview,
  updateReview,
} from "../controllers/review/review.controller.js";

const reviewRouter = express.Router();

reviewRouter.post(
  "/review-add",
  isAuthenticated,

  AddAReview
);
reviewRouter.put(
  "/review-update/:id",
  isAuthenticated,

  updateReview
);
reviewRouter.delete("/review-delete/:id", isAuthenticated, deleteReview);

export default reviewRouter;
