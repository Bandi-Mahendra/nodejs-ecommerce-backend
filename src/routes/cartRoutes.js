const express = require("express");
const {
  addToCart,
  removeFromCart,
  updateCartItem,
  viewCart,
} = require("../controllers/cartController");
const protect = require("../middleware/auth");
const {
  cartItemRules,
  mongoId,
  updateCartItemRules,
} = require("../middleware/validation");

const router = express.Router();

router.use(protect);

router.get("/", viewCart);
router.post("/", cartItemRules, addToCart);
router.put("/:productId", mongoId("productId"), updateCartItemRules, updateCartItem);
router.delete("/:productId", mongoId("productId"), removeFromCart);

module.exports = router;
