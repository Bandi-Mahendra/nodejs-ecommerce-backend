const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const { asyncHandler, sendSuccess } = require("../utils/helpers");

const getDashboardSummary = asyncHandler(async (req, res) => {
  const [totalUsers, totalProducts, totalOrders, revenue] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: "paid", status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
  ]);

  sendSuccess(res, 200, "Admin dashboard summary retrieved successfully", {
    totalUsers,
    totalProducts,
    totalOrders,
    revenue: revenue[0]?.total || 0,
  });
});

module.exports = {
  getDashboardSummary,
};
