import express from "express";
import { userLogin, userRegistration } from "../controllers/user/user.controller.js";

const userRouter = express.Router();

userRouter.post("/user-register", userRegistration);
userRouter.post("/user-login", userLogin);




export  default  userRouter;