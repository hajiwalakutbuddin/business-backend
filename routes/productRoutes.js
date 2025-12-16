const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getProducts, addProduct, updateProduct, deleteProduct } = require("../controllers/productController");

// Public
router.get("/", getProducts);

// Protected
router.post("/", auth, addProduct);
router.put("/:id", auth, updateProduct);
router.delete("/:id", auth, deleteProduct);

module.exports = router;
