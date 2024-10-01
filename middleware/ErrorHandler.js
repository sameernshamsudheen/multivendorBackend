import mongoose from "mongoose";
import ApiError from "../utils/apierror.js";
import "dotenv/config";

const ErrorHandler = (err, req, res, next) => {
  let error = err;

  // If the error is not an instance of ApiError, create a new one
  if (!(error instanceof ApiError)) {
    const statusCode = 
      error.statusCode || (error instanceof mongoose.Error ? 400 : 500);

    const message = error.message || "Something went wrong";
    
    // Create a new ApiError if the error is not already one
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // Prepare the response object
  const response = {
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [], // Optional: Include any additional error details
  };

  // If in development mode, add stack trace to the response
  if (process.env.NODE_ENV === "development") {
    response.stack = error.stack;
  }

  // Return the JSON response
  return res.status(error.statusCode).json(response);
};

export default ErrorHandler;
