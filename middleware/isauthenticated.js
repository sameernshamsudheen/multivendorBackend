import redis from "../redis/redis.js";
import ApiError from "../utils/apierror.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const isAuthenticated = asyncHandler(async (req, res, next) => {
  try {
    const access_token = req.cookies.access_token;

    const user = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);

    if (!user) {
      throw new ApiError(
        500,
        "invalid token please  re-login   for smooth experience"
      );
    }

    const userSession = await redis.get(user._id);

    if (!userSession) {
      throw new ApiError(500, "Please login to access this resource");
    }

    req.user = userSession;
    next();
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export default isAuthenticated;
