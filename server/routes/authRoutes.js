const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  getUser,
  googleLogin, // ✅ Add this
} = require("../controllers/authController");

const {protect} = require("../middleware/authMiddleware")

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/google-login", googleLogin); // ✅ Add this route
router.get("/me", protect, getUser); // ✅ Persistent login
router.get("/logout", logout);

module.exports = router;
