const User = require("../models/User");
const { signToken } = require("../config/jwt");
const { AppError, asyncHandler, sendSuccess } = require("../utils/helpers");

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const buildAuthResponse = (user, token) => ({
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
});

const sendAuthResponse = (res, statusCode, message, user) => {
  const token = signToken(user._id);

  res.cookie("token", token, cookieOptions());
  return sendSuccess(res, statusCode, message, buildAuthResponse(user, token));
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });

  sendAuthResponse(res, 201, "User registered successfully", user);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  sendAuthResponse(res, 200, "User logged in successfully", user);
});

const getProfile = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, "Profile retrieved successfully", { user: req.user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ["name", "email", "phone", "address"];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  sendSuccess(res, 200, "Profile updated successfully", { user });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError("Current password is incorrect", 400);
  }

  user.password = newPassword;
  await user.save();

  sendAuthResponse(res, 200, "Password changed successfully", user);
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
};
