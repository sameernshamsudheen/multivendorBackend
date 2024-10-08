import express from "express";

import isAuthenticated from "../middleware/isauthenticated.js";
import { upload } from "../middleware/multermiddleware.js";
import authorize from "../middleware/authorize.js";
import {
  AddToWhishlist,
  getWhishlist,
  RemoveFromWhishlist,
} from "../controllers/wishlist/wishlist.controller.js";

const whishlistRouter = express.Router();

whishlistRouter.post(
  "/wishlist-add",
  isAuthenticated,

  AddToWhishlist
);
whishlistRouter.post("/wishlist-remove", isAuthenticated, RemoveFromWhishlist);
whishlistRouter.get("/wishlist-all", isAuthenticated, getWhishlist);

export default whishlistRouter;
