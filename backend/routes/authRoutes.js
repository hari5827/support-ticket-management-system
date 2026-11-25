
const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  getMe,
  adminRegister,
  adminLogin
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// User authentication
router.post("/register", register);
router.post("/login", login);

// Admin authentication
router.post("/admin/register", adminRegister);
router.post("/admin/login", adminLogin);

// Protected routes
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

module.exports = router;

