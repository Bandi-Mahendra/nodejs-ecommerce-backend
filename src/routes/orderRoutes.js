const express = require("express");
const {
  cancelOrder,
  createOrder,
  getAllOrders,
  getOrderDetails,
  getOrderHistory,
  updateOrderStatus,
} = require("../controllers/orderController");
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");
const {
  createOrderRules,
  mongoId,
  updateOrderStatusRules,
} = require("../middleware/validation");

const router = express.Router();

router.use(protect);

router.post("/", createOrderRules, createOrder);
router.get("/", getOrderHistory);
router.get("/admin/all", authorize("admin"), getAllOrders);
router.get("/:id", mongoId("id"), getOrderDetails);
router.put("/:id/cancel", mongoId("id"), cancelOrder);
router.put("/:id/status", authorize("admin"), mongoId("id"), updateOrderStatusRules, updateOrderStatus);

module.exports = router;
