import express from "express";
import {
  deleteUser,
  getAllUser,
  getUserProfile,
  updateUserProfile,
  userLogin,
  userRegistration,
} from "../controllers/user/user.controller.js";
import isAuthenticated from "../middleware/isauthenticated.js";
import authorize from "../middleware/authorize.js";

const userRouter = express.Router();

userRouter.post("/user-register", userRegistration);
userRouter.post("/user-login", userLogin);
userRouter.get("/user-profile", getUserProfile);
userRouter.put("/user-profile", isAuthenticated, updateUserProfile);
userRouter.delete("/user/:id", isAuthenticated, authorize("admin"), deleteUser);
userRouter.get("/user-all", isAuthenticated, authorize("admin"), getAllUser);

export default userRouter;
