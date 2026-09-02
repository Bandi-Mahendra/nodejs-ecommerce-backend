const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      trim: true,
      default: "Generic",
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", category: "text" });

productSchema.methods.recalculateRating = function recalculateRating() {
  this.numReviews = this.reviews.length;
  this.averageRating = this.numReviews
    ? Number((this.reviews.reduce((sum, review) => sum + review.rating, 0) / this.numReviews).toFixed(1))
    : 0;
};

module.exports = mongoose.model("Product", productSchema);
