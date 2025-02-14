const express = require("express");
const { registerUser, loginUser, searchUser, getUserInfo } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ User Registration
router.post("/register", registerUser);

// ✅ User Login
router.post("/login", loginUser);

// ✅ Search User by Username or Email (Protected Route? ✅ Yes/ ❌ No)
router.get("/search", searchUser);  // ❌ Removed `verifyToken` (Make it public)

// ✅ Get Logged-in User Info (Protected)
router.get("/user-info", verifyToken, getUserInfo);  // Changed `/me` → `/user-info` (Optional)

module.exports = router;
