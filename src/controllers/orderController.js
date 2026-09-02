const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { AppError, asyncHandler, sendSuccess } = require("../utils/helpers");

const rollbackStock = (items) =>
  Promise.all(
    items.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
    )
  );

const createOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  if (req.body.simulatePayment === false) {
    throw new AppError("Payment failed. Order was not created.", 402);
  }

  const updatedStock = [];

  for (const item of cart.items) {
    const product = await Product.findOneAndUpdate(
      { _id: item.product._id, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
      { new: true }
    );

    if (!product) {
      await rollbackStock(updatedStock);
      throw new AppError(`${item.product.name} does not have enough stock`, 400);
    }

    updatedStock.push({ product: item.product._id, quantity: item.quantity });
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    quantity: item.quantity,
    price: item.price,
  }));

  let order;

  try {
    order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod || "card",
      paymentStatus: "paid",
      paidAt: new Date(),
      totalAmount: cart.totalAmount,
    });
  } catch (error) {
    await rollbackStock(updatedStock);
    throw error;
  }

  cart.items = [];
  cart.totalAmount = 0;
  await cart.save();

  sendSuccess(res, 201, "Order created successfully", { order });
});

const getOrderHistory = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  sendSuccess(res, 200, "Order history retrieved successfully", { orders });
});

const getOrderDetails = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin"
    ? { _id: req.params.id }
    : { _id: req.params.id, user: req.user._id };
  const order = await Order.findOne(filter).populate("items.product", "name images");

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  sendSuccess(res, 200, "Order retrieved successfully", { order });
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.status !== "processing") {
    throw new AppError("Only processing orders can be cancelled", 400);
  }

  order.status = "cancelled";
  order.paymentStatus = order.paymentStatus === "paid" ? "refunded" : order.paymentStatus;
  order.cancelledAt = new Date();
  await order.save();

  await Promise.all(
    order.items.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
    )
  );

  sendSuccess(res, 200, "Order cancelled successfully", { order });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  order.status = req.body.status;
  await order.save();

  sendSuccess(res, 200, "Order status updated successfully", { order });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  sendSuccess(res, 200, "Orders retrieved successfully", { orders });
});

module.exports = {
  createOrder,
  getOrderHistory,
  getOrderDetails,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
};
