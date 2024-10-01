import express from "express";
import { userRegistration } from "../controllers/user/user.controller.js";

const userRouter = express.Router();

userRouter.post("/user-register", userRegistration);




export  default  userRouter;