import redis from "../redis/redis.js";
import ApiError from "./apierror.js";
import { ApiResponse } from "./apiresponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const sendToken = asyncHandler(async (user, res) => {
  const accessTokenExpire = 30 * 60 * 1000;
  const refreshTokenExpire = 2 * 24 * 60 * 60 * 1000;
  const accessTokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire), // Expires in 30 minutes
    maxAge: accessTokenExpire, // 30 minutes in milliseconds
    httpOnly: true,
    sameSite: "lax",
  };
  const refreshTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire), // Expires in 2 days
    maxAge: refreshTokenExpire, // 2 days in milliseconds
    httpOnly: true,
    sameSite: "strict",
  };
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    //redis session create


    await redis.set(user._id.toString(), JSON.stringify(user), { ex: 172800 });

    //setting to cookies
    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    return res
      .status(200)
      .json(new ApiResponse(200, accessToken, "login Successfull"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export default sendToken;
