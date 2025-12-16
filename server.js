require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Debug incoming requests
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// --- START THE SERVER ONLY AFTER DB SUCCESSFULLY CONNECTS ---
async function startServer() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // avoid infinite waiting
    });

    console.log("✔️ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`✔️ Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ MongoDB connection failed:");
    console.error(err.message);
    console.error("Fix your MONGO_URI in .env and ensure MongoDB is running locally.");
  }
}

// --- Routes ---
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// Start server
startServer();
