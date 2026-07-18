
import User from "../models/User.js";
import generateToken from "../utils/jwt.js";

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { Username, password } = req.body;

    if (!Username || !password) {
      return res.status(400).json({
        message: "Name and password are required",
      });
    }

    const user = await User.findOne({
      Username: Username.trim(),
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: "Invalid name or password",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};