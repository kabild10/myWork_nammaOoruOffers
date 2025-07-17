const jwt = require("jsonwebtoken");

const generateTokenAndCookie = (res, userId, role) => {
  const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true, // Cannot be accessed via JS in browser
    secure: process.env.NODE_ENV === "production", // Send over HTTPS only in prod
    sameSite: "Strict", // Prevent CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

  return token; // Useful if you want to return it manually as well
};

module.exports = { generateTokenAndCookie };
