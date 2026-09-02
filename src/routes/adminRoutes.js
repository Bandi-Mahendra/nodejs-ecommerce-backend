const express = require("express");
const { getDashboardSummary } = require("../controllers/adminController");
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

const router = express.Router();

router.get("/dashboard", protect, authorize("admin"), getDashboardSummary);

module.exports = router;
