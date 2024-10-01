import { User } from "../../models/usermodal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { ApiResponse } from "../../utils/apiresponse.js";
import ApiError from "../../utils/apierror.js";
import ejs from "ejs";
import sendMail from "../../utils/sendmail.js";
import path from "path";
import { fileURLToPath } from "url";

//@desc Register a new user
//@router /api/users
//@access Public

export const userRegistration = asyncHandler(async (req, res, next) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  try {
    const { name, email, password, address, phone } = req.body;
    if ([name, email, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }
    const emailExists = await User.findOne({ email: email });

    if (emailExists) {
      throw new ApiError(400, "email already exists");
    }
    const savedUser = await User.create({
      name,
      email,
      password,
      phone,
      address,
    });

    const createdUser = await User.findById(savedUser._id);

    if (!createdUser) {
      throw new ApiError(400, "User not found");
    }

    const data = { user: savedUser.name };
    const templatepath = path.join(
      __dirname,
      "../../../emailtemplate/userregistration.ejs"
    );

    try {
      await sendMail({
        email: savedUser.email,
        subject: "user registration",
        template: templatepath,
        data,
      });
      return res
        .status(200)
        .json(new ApiResponse(200, "ok", "user registration successfull"));
    } catch (error) {
      throw new ApiError(400, error.message);
    }
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
