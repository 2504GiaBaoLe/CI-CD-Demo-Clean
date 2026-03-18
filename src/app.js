const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());

// Routes API
const authRoute = require("./routes/auth.route");
app.use("/api/auth", authRoute);

// Serve static files từ folder public
app.use(express.static(path.join(__dirname, "../public")));

// Route gốc "/" trả về home.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/home.html"));
});

module.exports = app;