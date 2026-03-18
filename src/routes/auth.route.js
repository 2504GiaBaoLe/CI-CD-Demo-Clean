const express = require("express");
const router = express.Router();
const { admin } = require("../config/firebase"); // Firebase admin SDK đã config

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email và password bắt buộc" });
    }

    // Tạo user thật trên Firebase
    const user = await admin.auth().createUser({ email, password });

    res.json({ message: "User created successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;