
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const name = "vansh";
    const password = "123";

    const existingUser = await User.findOne({ name });

    if (existingUser) {
      console.log("Admin user already exists");
    } else {
      await User.create({
        name,
        password,
      });

      console.log("Admin user created successfully");
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error("Failed to create admin:", error.message);
    process.exit(1);
  }
};

createAdmin();