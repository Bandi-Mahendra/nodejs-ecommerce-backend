const express = require("express");
const {
  changePassword,
  getProfile,
  login,
  register,
  updateProfile,
} = require("../controllers/authController");
const protect = require("../middleware/auth");
const {
  changePasswordRules,
  loginRules,
  registerRules,
  updateProfileRules,
} = require("../middleware/validation");

const router = express.Router();

router.post("/register", registerRules, register);
router.post("/login", loginRules, login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfileRules, updateProfile);
router.put("/change-password", protect, changePasswordRules, changePassword);

module.exports = router;
