const fs = require('fs');
const path = require('path');

// This file is ONLY for local development. 
// DO NOT commit the actual service-account.json to GitHub.

function getServiceAccount() {
    try {
        const filePath = path.join(__dirname, 'service-account.json');
        const rawData = fs.readFileSync(filePath);
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Error loading local service-account.json:", error);
        return null;
    }
}

module.exports = { getServiceAccount };