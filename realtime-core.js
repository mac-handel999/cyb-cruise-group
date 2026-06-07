
(function initializeDatabase() {
    // 1. Determine environment
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    let config;

    if (isLocalhost) {
        // LOCAL DEVELOPMENT CONFIG
        config = {
     apiKey: "AIzaSyCO71lvobszEJyjrAVEjo340kypv9EV7IU",
    authDomain: "cyb-cruise-hub.firebaseapp.com",
    databaseURL: "https://cyb-cruise-hub-default-rtdb.firebaseio.com",
   projectId: "cyb-cruise-hub",
   storageBucket: "cyb-cruise-hub.firebasestorage.app",
    messagingSenderId: "793275106982",
    appId: "1:793275106982:web:75fb6f75a3afd7bb6ad667"
        };
        console.log("🚀 Running locally: Connected to Firebase Dev Sandbox.");
    } else {
        // LIVE PRODUCTION CONFIG
        config = {
            apiKey: window.env?.FIREBASE_API_KEY,
            databaseURL: window.env?.FIREBASE_DATABASE_URL,
            authDomain: "cyb-cruise-system.firebaseapp.com",
            projectId: "cyb-cruise-system",
            storageBucket: "cyb-cruise-system.appspot.com",
            messagingSenderId: "9876543210",
            appId: "1:9876543210:web:abcdef123456"
        };
        console.log("🔒 Running live: Secured environment loaded.");
    }

    // 2. Initialize Firebase once
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }

    // 3. Attach to global window object
    window.database = firebase.database();
    console.log("Firebase Database Engine Initialized globally.");
})();

// // /realtime-core.js
// // Use var or let so it can be re-assigned if necessary, 
// // but avoid re-declaring it.
//  firebaseConfig = {
//     apiKey: window.env.FIREBASE_API_KEY,
//     databaseURL: window.env.FIREBASE_DATABASE_URL
// };

// // Check if app is already initialized to prevent the "already declared" error
// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
// }

//  database = firebase.database();
// console.log("Firebase Database Engine Initialized");




// // Secure Dynamic Initializer Engine
// const firebaseConfig = {
//     apiKey: window.env?.FIREBASE_API_KEY || "DEVELOPMENT_FALLBACK",
//     authDomain: window.env?.FIREBASE_AUTH_DOMAIN || "cyb-cruise-system.firebaseapp.com",
//     databaseURL: window.env?.FIREBASE_DATABASE_URL || "",
//     projectId: window.env?.FIREBASE_PROJECT_ID || "cyb-cruise-system",
//     storageBucket: window.env?.FIREBASE_STORAGE_BUCKET || "cyb-cruise-system.appspot.com",
//     messagingSenderId: window.env?.FIREBASE_MESSAGING_SENDER_ID || "",
//     appId: window.env?.FIREBASE_APP_ID || ""
// };

// // Fire up core engine connections safely
// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
// }
// const database = firebase.database();




//  const firebaseConfig = {
//     apiKey: "AIzaSyCO71lvobszEJyjrAVEjo340kypv9EV7IU",
//     authDomain: "cyb-cruise-hub.firebaseapp.com",
//     databaseURL: "https://cyb-cruise-hub-default-rtdb.firebaseio.com",
//     projectId: "cyb-cruise-hub",
//     storageBucket: "cyb-cruise-hub.firebasestorage.app",
//     messagingSenderId: "793275106982",
//     appId: "1:793275106982:web:75fb6f75a3afd7bb6ad667"
//   };

//   // Initialize Firebase
//   const app = initializeApp(firebaseConfig);