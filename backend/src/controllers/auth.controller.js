// src/controllers/auth.controller.js
import User from "../models/User.js";
import generateToken from "../utils/jwt.js";

export const register = async (req, res) => {
  try {
    const { Username, password } = req.body;

    if (!Username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const existingUser = await User.findOne({ Username: Username.trim() });
    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const user = new User({
      Username: Username.trim(),
      password,
    });

    await user.save();

    const token = generateToken(user._id);

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const login = async (req, res) => {
  try {
     console.log("Received body:", req.body);
    const { Username, password } = req.body;


    if (!Username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const user = await User.findOne({
      Username: Username.trim(),
    }).select("+password");

    // matchPassword is the method defined in User.js
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};