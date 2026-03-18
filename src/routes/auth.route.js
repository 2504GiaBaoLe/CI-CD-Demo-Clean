const express = require("express");
const router = express.Router();
const axios = require("axios");
const { admin } = require("../config/firebase");

// Lấy API Key từ biến môi trường (Cần thiết cho Login)
const FIREBASE_API_KEY = process.env.FIREBASE_KEY;

/**
 * 1. REGISTER - Đăng ký người dùng mới
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email và password là bắt buộc" });
    }

    const user = await admin.auth().createUser({
      email: email,
      password: password,
    });

    res.status(201).json({ message: "Đăng ký thành công", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 2. LOGIN - Đăng nhập nhận ID Token
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Thiếu email hoặc password" });
    }

    // Gọi Firebase Auth REST API
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
    const response = await axios.post(url, {
      email,
      password,
      returnSecureToken: true,
    });

    res.json({
      message: "Đăng nhập thành công",
      token: response.data.idToken, // Token này dùng để gửi lên Header ở các request sau
      uid: response.data.localId
    });
  } catch (err) {
    const msg = err.response ? err.response.data.error.message : err.message;
    res.status(401).json({ error: "Sai tài khoản hoặc mật khẩu: " + msg });
  }
});

/**
 * 3. MIDDLEWARE - Kiểm tra quyền truy cập (Verify Token)
 */
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Lấy chuỗi sau "Bearer "

  if (!token) return res.status(401).json({ error: "Bạn cần đăng nhập để truy cập" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Lưu thông tin user vào request
    next();
  } catch (error) {
    res.status(403).json({ error: "Phiên đăng nhập hết hạn hoặc không hợp lệ" });
  }
};

/**
 * 4. PROTECTED ROUTE - Ví dụ một trang yêu cầu đăng nhập
 */
router.get("/me", authenticateToken, (req, res) => {
  res.json({ 
    message: "Đây là thông tin cá nhân của bạn", 
    user: req.user 
  });
});

module.exports = router;