const Product = require("../models/Product");
const { AppError, asyncHandler, sendSuccess } = require("../utils/helpers");

const getUploadedImagePaths = (files = []) =>
  files.map((file) => `/uploads/products/${file.filename}`);

const buildProductPayload = (body, files = []) => {
  const payload = { ...body };
  const uploadedImages = getUploadedImagePaths(files);

  if (uploadedImages.length > 0) {
    payload.images = uploadedImages;
  } else if (typeof payload.images === "string") {
    payload.images = [payload.images];
  }

  return payload;
};

const createProduct = asyncHandler(async (req, res) => {
  const productData = buildProductPayload(req.body, req.files);
  const product = await Product.create({
    ...productData,
    createdBy: req.user._id,
  });

  sendSuccess(res, 201, "Product created successfully", { product });
});

const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const filter = {};

  if (req.query.keyword) {
    filter.$text = { $search: req.query.keyword };
  }

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }

  const sortOptions = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
  };
  const sort = sortOptions[req.query.sort] || { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  sendSuccess(res, 200, "Products retrieved successfully", { products }, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("reviews.user", "name");

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  sendSuccess(res, 200, "Product retrieved successfully", { product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const productData = buildProductPayload(req.body, req.files);
  const product = await Product.findByIdAndUpdate(req.params.id, productData, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  sendSuccess(res, 200, "Product updated successfully", { product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  sendSuccess(res, 200, "Product deleted successfully");
});

const addReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const alreadyReviewed = product.reviews.some(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    throw new AppError("You have already reviewed this product", 400);
  }

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: req.body.rating,
    comment: req.body.comment,
  });
  product.recalculateRating();
  await product.save();

  sendSuccess(res, 201, "Review added successfully", { product });
});

const deleteReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const review = product.reviews.id(req.params.reviewId);

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  const ownsReview = review.user.toString() === req.user._id.toString();
  if (!ownsReview && req.user.role !== "admin") {
    throw new AppError("You can delete only your own review", 403);
  }

  product.reviews.pull(req.params.reviewId);
  product.recalculateRating();
  await product.save();

  sendSuccess(res, 200, "Review deleted successfully", { product });
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addReview,
  deleteReview,
};
