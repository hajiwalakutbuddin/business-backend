const Product = require("../models/Product");
// ================== ADDED: Image upload setup ==================

const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const streamifier = require("streamifier");

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup: store uploaded file in memory (not on disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function: upload image buffer to Cloudinary
function uploadBufferToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "products", // Cloudinary folder name
        transformation: [
          { width: 800, height: 800, crop: "fill", quality: "auto" }
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// ===============================================================


exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// exports.addProduct = async (req, res) => {
//   const product = await Product.create(req.body);
//   res.json(product);
// };
// ================== CHANGED: add product with image upload ==================
exports.addProduct = async (req, res) => {
  try {
    const { name, price, description, image } = req.body;

    let imageUrl = image || null; // fallback to URL if provided

    // If an image file was uploaded, send it to Cloudinary
    if (req.file && req.file.buffer) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer);
      imageUrl = uploadResult.secure_url;
    }

    const product = await Product.create({
      name,
      price,
      description,
      image: imageUrl,
    });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// ========================================================================


// exports.updateProduct = async (req, res) => {
//   const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   res.json(updated);
// };
// ================== CHANGED: update product ==================
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description, image } = req.body;

    const updateData = { name, price, description };

    // If a new image file is uploaded, replace image
    if (req.file && req.file.buffer) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer);
      updateData.image = uploadResult.secure_url;
    }
    // Otherwise keep / update image URL if provided
    else if (image) {
      updateData.image = image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// =============================================================

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
};
// ADDED: export upload middleware for routes
exports.upload = upload;
