const User = require("../models/User.js");
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");//jwt is used to generate a token
const config = require("../config.js");
const nodemailer = require('nodemailer');

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

// Create a transporter using Gmail (you can use other services too)
// transparter is used to send emails from your application to users via email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

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

    // Create reset password URL
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // Email content
    const mailOptions = {
      from: 'mahtopankaj300@gmail.com', // replace with your email
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset email sent" });
  }
  catch (error) {
    console.error('Forget password error:', error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error('Reset password error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { register, login, forgetPassword, resetPassword };
