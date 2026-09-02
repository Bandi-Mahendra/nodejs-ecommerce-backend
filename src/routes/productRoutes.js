const express = require("express");
const {
  addReview,
  createProduct,
  deleteProduct,
  deleteReview,
  getProduct,
  getProducts,
  updateProduct,
} = require("../controllers/productController");
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");
const { uploadProductImages } = require("../middleware/upload");
const {
  mongoId,
  productQueryRules,
  productRules,
  reviewRules,
  updateProductRules,
} = require("../middleware/validation");

const router = express.Router();

router
  .route("/")
  .get(productQueryRules, getProducts)
  .post(protect, authorize("admin"), uploadProductImages, productRules, createProduct);

router
  .route("/:id")
  .get(mongoId("id"), getProduct)
  .put(
    protect,
    authorize("admin"),
    mongoId("id"),
    uploadProductImages,
    updateProductRules,
    updateProduct,
  )
  .delete(protect, authorize("admin"), mongoId("id"), deleteProduct);

router.post("/:id/reviews", protect, mongoId("id"), reviewRules, addReview);
router.delete(
  "/:productId/reviews/:reviewId",
  protect,
  mongoId("productId"),
  mongoId("reviewId"),
  deleteReview,
);

module.exports = router;
