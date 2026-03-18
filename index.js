const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("CI/CD Demo OK Le Gia Bao");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});