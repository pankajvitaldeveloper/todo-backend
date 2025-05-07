const User = require("../models/User.js");
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");//jwt is used to generate a token
const config = require("../config.js");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate email, password, and username
    if (!email || !password || !username) {
      return res.status(400).json({ message: "Username, email and password are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? "Email already exists" : "Username already exists" 
      });
    }

    const user = await User.create({ username, email, password });
    res.status(201).json({ 
      message: "User registered successfully",
      user: {
        username: user.username,
        email: user.email,
        _id: user._id
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
      expiresIn: "1h",
    });
    
    res.json({ 
      message: "Login successful",
      token,
      user: {
        email: user.email,
        _id: user._id
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });        
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token
    const resetToken = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send the reset token to the user's email
    // This is a placeholder, you would implement email sending logic here
    console.log("Reset token sent to:", email);

    res.json({ message: "Password reset email sent" });
    
  }
  catch (error) {
    console.error('Forget password error:', error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

module.exports = { register, login };
