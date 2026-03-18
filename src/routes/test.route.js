const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

router.get("/", async (req, res) => {
  const data = await db.collection("test").get();
  const result = data.docs.map(doc => doc.data());
  res.json(result);
});

module.exports = router;