const express = require("express");
const router = express.Router();

// ================== IMPORTS ==================

// Auth middleware
const auth = require("../middleware/authMiddleware");

// Product controller functions
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  upload, // multer middleware exported from controller
} = require("../controllers/productController");

// ================== ROUTES ==================

// Public route — get all products
router.get("/", getProducts);

// Protected route — add product (supports image upload)
router.post(
  "/",
  auth,                         // check JWT
  upload.single("imageFile"),   // handle image upload (optional)
  addProduct                   // controller
);

// Protected route — update product (supports image upload)
router.put(
  "/:id",
  auth,
  upload.single("imageFile"),
  updateProduct
);

// Protected route — delete product
router.delete("/:id", auth, deleteProduct);

// ================== EXPORT ==================
module.exports = router;
