const { body, param, query, validationResult } = require("express-validator");
const { AppError } = require("../utils/helpers");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors.array().map((error) => error.msg).join(", ");
    return next(new AppError(message, 400));
  }

  return next();
};

const mongoId = (field = "id") => [
  param(field).isMongoId().withMessage(`${field} must be a valid id`),
  validate,
];

const registerRules = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  validate,
];

const loginRules = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

const updateProfileRules = [
  body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").optional().isEmail().withMessage("Valid email is required").normalizeEmail(),
  validate,
];

const changePasswordRules = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
  validate,
];

const productRules = [
  body("name").trim().isLength({ min: 2 }).withMessage("Product name must be at least 2 characters"),
  body("description").trim().isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  body("brand").optional().trim(),
  body("images").optional(),
  validate,
];

const updateProductRules = [
  body("name").optional().trim().isLength({ min: 2 }).withMessage("Product name must be at least 2 characters"),
  body("description").optional().trim().isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),
  body("price").optional().isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("category").optional().trim().notEmpty().withMessage("Category cannot be empty"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  body("images").optional(),
  validate,
];

const productQueryRules = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
  query("minPrice").optional().isFloat({ min: 0 }).withMessage("Minimum price must be positive"),
  query("maxPrice").optional().isFloat({ min: 0 }).withMessage("Maximum price must be positive"),
  validate,
];

const cartItemRules = [
  body("productId").isMongoId().withMessage("Valid product id is required"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  validate,
];

const updateCartItemRules = [
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  validate,
];

const createOrderRules = [
  body("shippingAddress.address").trim().notEmpty().withMessage("Shipping address is required"),
  body("shippingAddress.city").trim().notEmpty().withMessage("City is required"),
  body("shippingAddress.postalCode").trim().notEmpty().withMessage("Postal code is required"),
  body("shippingAddress.country").trim().notEmpty().withMessage("Country is required"),
  body("paymentMethod").optional().isIn(["card", "cod", "wallet"]).withMessage("Invalid payment method"),
  body("simulatePayment").optional().isBoolean().withMessage("simulatePayment must be boolean"),
  validate,
];

const reviewRules = [
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("comment").trim().isLength({ min: 3 }).withMessage("Review comment must be at least 3 characters"),
  validate,
];

const updateOrderStatusRules = [
  body("status").isIn(["processing", "shipped", "delivered", "cancelled"]).withMessage("Invalid order status"),
  validate,
];

module.exports = {
  validate,
  mongoId,
  registerRules,
  loginRules,
  updateProfileRules,
  changePasswordRules,
  productRules,
  updateProductRules,
  productQueryRules,
  cartItemRules,
  updateCartItemRules,
  createOrderRules,
  reviewRules,
  updateOrderStatusRules,
};
