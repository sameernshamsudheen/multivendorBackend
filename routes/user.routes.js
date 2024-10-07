import express from "express";
import {
  deleteUser,
  getAllUser,
  getUserProfile,
  refreshAccessToken,
  updateUserProfile,
  userLogin,
  userRegistration,
  userLogout
} from "../controllers/user/user.controller.js";
import isAuthenticated from "../middleware/isauthenticated.js";
import authorize from "../middleware/authorize.js";

const userRouter = express.Router();

userRouter.post("/user-register", userRegistration);
userRouter.post("/user-login", userLogin);
userRouter.post("user-logout",userLogout)
userRouter.get("/user-profile", isAuthenticated, getUserProfile);
userRouter.put("/user-profile", isAuthenticated, updateUserProfile);
userRouter.delete("/user/:id", isAuthenticated, authorize("admin"), deleteUser);
userRouter.get("/user-all", isAuthenticated, authorize("admin"), getAllUser);
userRouter.get("/user-refresh-token", refreshAccessToken);

export default userRouter;
