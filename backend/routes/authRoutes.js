const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
require("dotenv").config();

const errorHandler = (res, error) => {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
};

// Sign-Up Route
router.post("/signup", 
  [
    check("name").notEmpty(),
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
      }

      const { name, email, password } = req.body;
      
      // Check if email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: 'Email is already registered' });
      }

      // Hash the password 
      const encryptedPassword = await bcrypt.hash(password, 10);
      await User.create({ 
        name,
        email,
        password: encryptedPassword,
      });
      return res.status(200).json({
        success: true,
        message: "User created successfully",
        name: name,
      });
    } catch (err) {
      console.log(err);
      errorHandler(res, err);
    }
  }
);

// Login Route
router.post("/login",
  [
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
      }

      const { email, password } = req.body;
      
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      const passwordMatched = await bcrypt.compare(password, user.password);
      if (!passwordMatched) {
        return res.status(401).json({ error: 'Incorrect Credentials.' });
      }
      
      // Generate JWT token with expiration time
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      return res.status(200).json({
        status: "OK",
        message: "Successfully LoggedIn",
        token,
      });
    } catch (err) {
      console.log(err);
      errorHandler(res, err);
    }
  }
);

module.exports = router;
