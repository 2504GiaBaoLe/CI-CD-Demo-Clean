const admin = require("firebase-admin");

const serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 👇 PHẢI CÓ DÒNG NÀY
const db = admin.firestore();

// 👇 EXPORT ĐÚNG
module.exports = { admin, db };