const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

// 🔹 SIGNUP PAGE
router.get("/signup", (req, res) => {
  res.render("signup");
});

// 🔹 SIGNUP
router.post("/signup", async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.send("All fields are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send("Email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hash
    });

    const token = generateToken(user);
    res.cookie("token", token);

    res.redirect("/tasks");

  } catch (error) {
    res.send(error.message);
  }
});


// 🔹 LOGIN PAGE ✅ (IMPORTANT FIX)
router.get("/login", (req, res) => {
  res.render("login"); 
});


// 🔹 LOGIN
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.send("All fields are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send("Invalid password");
    }

    const token = generateToken(user);
    res.cookie("token", token);

    res.redirect("/tasks");

  } catch (error) {
    res.send(error.message);
  }
});


// 🔹 LOGOUT
router.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

module.exports = router;