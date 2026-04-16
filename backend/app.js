const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
// ✅ NEW (FLASH + SESSION)
const session = require("express-session");
const flash = require("connect-flash");
require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
// 🔹 MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../frontend/public")));
// ✅ SESSION SETUP
app.use(
  session({
    secret: "secretkey", // change later
    resave: false,
    saveUninitialized: false
  })
);
// ✅ FLASH SETUP
app.use(flash());
// ✅ GLOBAL VARIABLES (views me use hongay)
app.use((req, res, next) => {
  res.locals.message = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
// 🔹 VIEW ENGINE
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/views"));
// 🔹 ROUTES
app.use("/", authRoutes);
app.use("/", taskRoutes);
// 🔹 SERVER
app.listen(3000, () => {
  console.log(`Server running on port`);
});