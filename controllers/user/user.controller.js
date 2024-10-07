import { User } from "../../models/usermodal.js";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import { ApiResponse } from "../../utils/apiresponse.js";
import ApiError from "../../utils/apierror.js";
import ejs from "ejs";
import sendMail from "../../utils/sendmail.js";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";

import sendToken from "../../utils/sendtoken.js";
import redis from "../../redis/redis.js";

//@desc Register a new user
//@router /api/users
//@access Public

export const userRegistration = asyncHandler(async (req, res, next) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  try {
    const { name, email, password, address, phone } = req.body;
    // if ([name, email, password].some((field) => field?.trim() === "")) {
    //   throw new ApiError(400, "All fields are required");
    // }
    const emailExists = await User.findOne({ email: email });

    if (emailExists) {
      throw new ApiError(500, "email already exists");
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
      "../../emailtemplate/userregistration.ejs"
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

//@desc login a new user
//@router /api/users
//@access Public

export const userLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const refresh = false;

  if ([email, password].some((field) => field?.trim() === " ")) {
    throw new ApiError(500, "All fields are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(500, "User not found please signup");
  }
  const passwordMatch = await user.comparePassword(password, user.password);

  if (!passwordMatch) {
    throw new ApiError(
      500,
      "Password  incorrect please provide the  correct password"
    );
  }

  sendToken(user, res, refresh);
});

//@desc get user profile
//@router /api/users
//@access valid users

export const getUserProfile = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiError(500, "Invalid  user");
    }

    const user = await User.findById(currentUser._id.toString()).select(
      "-password "
    );

    if (!user) {
      throw new ApiError(500, "User not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "user profile fetched successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

//@desc update user profile
//@router /api/users
//@access valid users

export const updateUserProfile = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      throw new ApiError(500, "Invalid  user");
    }
    const user = await User.findById(currentUser._id.toString()).select(
      "-password"
    );
    if (!user) {
      throw new ApiError(500, "User not found");
    }

    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id.toString(),
      req.body,
      { new: true }
    ).select("-password -role -isActive");
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedUser, "user profile updated successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
//@desc delete user
//@router /api/user
//@access admin
export const deleteUser = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;
    const userToBeDeletedId = req.params.id;

    if (!currentUser) {
      throw new ApiError(500, "Invalid  user");
    }
    const user = await User.findById(currentUser._id.toString()).select(
      "-password"
    );
    if (!user) {
      throw new ApiError(500, "User not found");
    }
    const userToBeDeletedExists = await User.findById(
      userToBeDeletedId.toString()
    ).select("-password");

    if (!userToBeDeletedExists) {
      throw new ApiError(500, " User to be deleted  not found");
    }
    const result = await redis.del(userToBeDeletedId.toString());

    const deletedUser = await User.findByIdAndDelete(
      userToBeDeletedId.toString()
    );

    return res
      .status(200)
      .json(new ApiResponse(200, deletedUser, "User deleted successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

//@desc get all user
//@router /api/user-all
//@access admin
export const getAllUser = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      throw new ApiError(500, "Invalid  user");
    }

    const AllUsers = await User.find();

    if (AllUsers.length === 0) {
      throw new ApiError(500, "No users found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, AllUsers, "All users fetched"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
//@desc refresh access token
//@router /api/user-all
//@access  valid users
export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  try {
    const refresh = true;
    const incomingRefreshToken =
      req.cookies.refresh_token || req.body.refresh_token;
    if (!incomingRefreshToken) {
      throw new ApiError(500, "  refresh token not  found");
    }

    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!decoded) {
      throw new ApiError(500, " Invalid token");
    }

    const user = await User.findById(decoded?._id.toString());
    if (!user) {
      throw new ApiError(401, "User not found");
    }

    sendToken(user, res, refresh);
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export const userLogout = asyncHandler(async (req, res, next) => {
  try {
    res.cookie("access_token", " ", { maxAge: 1 });
    res.cookie("refresh_token", " ", { maxAge: 1 });
    const userId = req.user?._id || "";

    redis.del(userId);
    res.status(200).json({
      success: true,
      message: "user logout successFull",
    });
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
