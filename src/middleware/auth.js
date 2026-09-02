const User = require("../models/User");
const { verifyToken } = require("../config/jwt");
const { AppError, asyncHandler } = require("../utils/helpers");

const getCookieToken = (cookieHeader = "") => {
  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));

  return tokenCookie ? decodeURIComponent(tokenCookie.split("=")[1]) : null;
};

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  const cookieToken = getCookieToken(req.headers.cookie);
  const token = bearerToken || cookieToken;

  if (!token) {
    throw new AppError("Authentication token is required", 401);
  }

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.id).select("+passwordChangedAt");

  if (!user || !user.isActive) {
    throw new AppError("User no longer exists or is inactive", 401);
  }

  if (user.passwordChangedAfter(decoded.iat)) {
    throw new AppError("Password changed recently. Please log in again.", 401);
  }

  req.user = user;
  next();
});

module.exports = protect;
