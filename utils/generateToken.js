const jwt = require("jsonwebtoken");

module.exports = function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email
    },
    process.env.JWT_KEY,
    { expiresIn: "7d" }
  );
};