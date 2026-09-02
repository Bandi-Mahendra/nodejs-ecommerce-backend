const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { AppError, asyncHandler, sendSuccess } = require("../utils/helpers");

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

const viewCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  await cart.populate("items.product", "name price stock images");

  sendSuccess(res, 200, "Cart retrieved successfully", { cart });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (product.stock < quantity) {
    throw new AppError("Requested quantity is not available", 400);
  }

  const cart = await getOrCreateCart(req.user._id);
  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (product.stock < newQuantity) {
      throw new AppError("Requested quantity exceeds available stock", 400);
    }
    existingItem.quantity = newQuantity;
    existingItem.price = product.price;
  } else {
    cart.items.push({ product: productId, quantity, price: product.price });
  }

  cart.calculateTotal();
  await cart.save();
  await cart.populate("items.product", "name price stock images");

  sendSuccess(res, 200, "Product added to cart successfully", { cart });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const [cart, product] = await Promise.all([
    getOrCreateCart(req.user._id),
    Product.findById(productId),
  ]);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (product.stock < quantity) {
    throw new AppError("Requested quantity exceeds available stock", 400);
  }

  const item = cart.items.find((cartItem) => cartItem.product.toString() === productId);

  if (!item) {
    throw new AppError("Product is not in cart", 404);
  }

  item.quantity = quantity;
  item.price = product.price;
  cart.calculateTotal();
  await cart.save();
  await cart.populate("items.product", "name price stock images");

  sendSuccess(res, 200, "Cart item updated successfully", { cart });
});

const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const originalLength = cart.items.length;

  cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);

  if (cart.items.length === originalLength) {
    throw new AppError("Product is not in cart", 404);
  }

  cart.calculateTotal();
  await cart.save();
  await cart.populate("items.product", "name price stock images");

  sendSuccess(res, 200, "Product removed from cart successfully", { cart });
});

module.exports = {
  viewCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};
