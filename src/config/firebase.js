const admin = require("firebase-admin");

// Lấy JSON từ environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = { admin };