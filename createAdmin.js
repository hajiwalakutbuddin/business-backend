require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  // delete old admins
  await User.deleteMany({ username: "admin" });

  // create new admin with known password
  const hashed = await bcrypt.hash("admin123", 10);

  await User.create({
    username: "admin",
    password: hashed
  });

  console.log("✔ Admin created successfully with password: admin123");
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
