



require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


// Add this at the top of server.js
app.use(cors({
    origin: '*', // For development only. Restrict this in production.
    methods: ['GET', 'POST', 'DELETE']
}));


// This tells Express to serve any files in your current directory
app.use(express.static(__dirname));

// Initialize Firebase
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
    : require('./service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();

// --- AUTHENTICATION MIDDLEWARE ---
function isAdmin(req, res, next) {
    const adminToken = req.headers['x-admin-token'];
    if (adminToken === process.env.ADMIN_SECRET_PASSWORD) {
        next();
    } else {
        res.status(403).send("Unauthorized Access Denied.");
    }
}

// --- PUBLIC API ENDPOINTS ---
app.get('/api/updates', async (req, res) => {
    const snapshot = await db.ref('management/updates').once('value');
    res.json(snapshot.val());
});

app.get('/api/payments', async (req, res) => {
    const snapshot = await db.ref('management/payments').once('value');
    res.json(snapshot.val());
});

app.get('/api/attendance', async (req, res) => {
    const snapshot = await db.ref('management/attendance').once('value');
    res.json(snapshot.val());
});

app.post('/api/attendance/self-sign/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { reg, name } = req.body;
    await db.ref(`management/attendance/${taskId}/students/${reg}`).set({
        regNumber: reg,
        name: name,
        timestamp: new Date().toLocaleTimeString()
    });
    res.sendStatus(200);
});

// --- SECURE ADMIN ENDPOINTS ---

// Updates
app.post('/api/admin/updates', isAdmin, async (req, res) => {
    const { heading, content, actionLink } = req.body;
    await db.ref('management/updates').push({
        heading, content, actionLink,
        author: "ADMIN",
        date: new Date().toLocaleDateString(),
        createdAt: Date.now()
    });
    res.sendStatus(200);
});

app.delete('/api/admin/updates/:key', isAdmin, async (req, res) => {
    await db.ref(`management/updates/${req.params.key}`).remove();
    res.sendStatus(200);
});

// Payments
app.post('/api/admin/payments/:taskId/:path/:reg', isAdmin, async (req, res) => {
    const { taskId, path, reg } = req.params;
    await db.ref(`management/payments/${taskId}/${path}/${reg}`).set({ reg: reg });
    res.sendStatus(200);
});

app.delete('/api/admin/payments/:taskId/:path/:reg', isAdmin, async (req, res) => {
    const { taskId, path, reg } = req.params;
    await db.ref(`management/payments/${taskId}/${path}/${reg}`).remove();
    res.sendStatus(200);
});

// Attendance
app.post('/api/admin/attendance/:taskId/students/:reg', isAdmin, async (req, res) => {
    const { taskId, reg } = req.params;
    await db.ref(`management/attendance/${taskId}/students/${reg}`).set({
        regNumber: reg,
        name: req.body.name,
        timestamp: new Date().toLocaleTimeString()
    });
    res.sendStatus(200);
});

app.delete('/api/admin/attendance/:taskId/students/:reg', isAdmin, async (req, res) => {
    await db.ref(`management/attendance/${req.params.taskId}/students/${req.params.reg}`).remove();
    res.sendStatus(200);
});

app.post('/api/admin/attendance', isAdmin, async (req, res) => {
    const newKey = db.ref('management/attendance').push().key;
    await db.ref(`management/attendance/${newKey}`).set({
        title: req.body.title,
        createdAt: Date.now(),
        students: {}
    });
    res.sendStatus(200);
});

app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    
    // Compare against the secret stored in your .env file
    if (password === process.env.ADMIN_SECRET_PASSWORD) {
        // Return the token that the frontend will use for future requests
        res.status(200).json({ token: process.env.ADMIN_SECRET_PASSWORD });
    } else {
        res.status(403).send("Unauthorized");
    }
});


app.get('/api/admin/verify', isAdmin, (req, res) => {
    res.sendStatus(200); // If it reaches here, the middleware already validated it
});



// --- SERVER START ---
const PORT = process.env.PORT || 6700;

// Run check every 1 hour
setInterval(async () => {
    const snapshot = await db.ref('management/attendance').once('value');
    const data = snapshot.val();
    if (!data) return;

    const now = Date.now();
    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

    Object.keys(data).forEach(async (taskId) => {
        if (data[taskId].createdAt && (now - data[taskId].createdAt >= TWENTY_FOUR_HOURS_MS)) {
            await db.ref(`management/attendance/${taskId}`).remove();
        }
    });
}, 3600000);

app.listen(PORT, () => console.log(`Secure gateway active on port ${PORT}`));