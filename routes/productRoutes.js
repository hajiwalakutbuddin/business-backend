const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getProducts, addProduct, updateProduct, deleteProduct } = require("../controllers/productController");

// Public
router.get("/", getProducts);

// Protected
// ================== CHANGED: enable file upload ==================
const { upload } = require("../controllers/productController");

router.post(
    "/",
    authMiddleware,
    upload.single("imageFile"), // <-- file field name from frontend
    createProduct
);

router.put(
    "/:id",
    authMiddleware,
    upload.single("imageFile"),
    updateProduct
);
// ================================================================

router.delete("/:id", auth, deleteProduct);

module.exports = router;
