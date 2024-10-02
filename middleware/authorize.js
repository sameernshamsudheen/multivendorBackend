import ApiError from "../utils/apierror.js";

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role || "")) {
      throw new ApiError(500, `Role ${req.user?.role} is not allowed`);
    }
    next();
  };
};

export default authorize;
