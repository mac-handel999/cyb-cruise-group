const express = require('express');
const admin = require('firebase-admin');
const app = express();

// Initialize Admin SDK using Environment Variables (Secrets)
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

// Middleware to protect admin routes
function verifyAdmin(req, res, next) {
    // Only allow if the request header contains a valid Course Rep token/UID
    if (req.headers.authorization === 'ADMIN_SECRET') {
        next();
    } else {
        res.status(403).send("Unauthorized");
    }
}

// Routes
app.get('/api/updates', async (req, res) => { /* Fetch logic */ });
app.post('/api/admin/updates', verifyAdmin, async (req, res) => { /* Create logic */ });
