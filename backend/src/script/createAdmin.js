import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    const adminUsername = "admin";
    const adminPassword = "adminPassword123"; // You can change this password

    // Check if admin already exists
    const existingAdmin = await User.findOne({ Username: adminUsername });
    if (existingAdmin) {
      console.log(`Admin user with Username '${adminUsername}' already exists.`);
      process.exit(0);
    }

    // Create the admin user
    const newAdmin = new User({
      Username: adminUsername,
      password: adminPassword,
    });

    await newAdmin.save();
    console.log(`Admin user successfully created!`);
    console.log(`Username: ${adminUsername}`);
    console.log(`Password: ${adminPassword}`);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdmin();
