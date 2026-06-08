
require('dotenv').config();
const express = require('express');
// ... rest of your code



const admin = require('firebase-admin');
const cors = require('cors'); // Prevents security issues with cross-origin requests
const app = express();

app.use(cors());
app.use(express.json());

// Load credentials: Uses environment variable in Prod, JSON file in Dev
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
    : require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();

// --- SECURE API ENDPOINTS ---

// GET updates
app.get('/api/updates', async (req, res) => {
    const snapshot = await db.ref('management/updates').once('value');
    res.json(snapshot.val());
});

// GET submissions
app.get('/api/submissions', async (req, res) => {
    const snapshot = await db.ref('management/submissions').once('value');
    res.json(snapshot.val());
});

// GET payments
app.get('/api/payments', async (req, res) => {
    const snapshot = await db.ref('management/payments').once('value');
    res.json(snapshot.val());
});

// GET attendance
app.get('/api/attendance', async (req, res) => {
    try {
        const snapshot = await db.ref('management/attendance').once('value');
        res.json(snapshot.val());
    } catch (error) {
        res.status(500).send("Error fetching attendance data");
    }
});
 

app.post('/api/submit-attendance', async (req, res) => {
    const { taskId, reg, name } = req.body;

    try {
        await db.ref(`management/attendance/${taskId}/students/${reg}`).set({
            regNumber: reg,
            name: name,
            timestamp: new Date().toLocaleTimeString()
        });
        res.status(200).send("Attendance submitted successfully");
    } catch (error) {
        res.status(500).send("Error submitting attendance");
    }
});

async function submitSelfAttendance(taskId) {
    const response = await fetch('/api/submit-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            taskId: taskId, 
            reg: currentStudentReg, 
            name: currentStudentName 
        })
    });
    
    if (response.ok) {
        alert("✅ Attendance Recorded");
        fetchAttendance(); // Refresh view
    } else {
        alert("🔒 Submission Error");
    }
}
// Start the server
const PORT = process.env.PORT || 6700;
app.listen(PORT, () => console.log(`Secure gateway active on port ${PORT}`));



// Simple password/token check for Admin routes
function isAdmin(req, res, next) {
    const adminToken = req.headers['x-admin-token'];
    if (adminToken === process.env.ADMIN_SECRET_PASSWORD) {
        next();
    } else {
        res.status(403).send("Unauthorized Access Denied.");
    }
}

// Protected route example
app.post('/api/admin/updates', isAdmin, async (req, res) => {
    // Only admins can reach here
});