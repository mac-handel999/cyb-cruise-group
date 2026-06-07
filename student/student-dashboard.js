/**
 * CYB CRUISE GROUP — STUDENT DASHBOARD ENGINE
 * SECURED: Read-only access to matrix nodes
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Fetch data from the API endpoint (The server.js proxy we discussed)
    // This replaces 'loadAdminMatrix()' which was for admins only
    fetchStudentData();

    // 2. Simple navigation for students
    const closeBtn = document.getElementById('closeAdminBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            window.location.href = '/Home.html';
        });
    }
});

async function fetchStudentData() {
    try {
        // Fetching data from your backend proxy rather than raw Firebase
        const response = await fetch('/api/dashboard-metrics');
        const db = await response.json();

        // Safe access: Use optional chaining or defaults if nodes are empty
        const countAtt = db.attendance ? Object.keys(db.attendance).length : 0;
        const countSub = db.submissions ? Object.keys(db.submissions).length : 0;
        const countPay = db.payments ? Object.keys(db.payments).length : 0;

        // Render metrics to UI
        document.getElementById('attCount').textContent = countAtt;
        document.getElementById('subCount').textContent = countSub;
        document.getElementById('payCount').textContent = countPay;
        document.getElementById('totalTasksCount').textContent = `${countAtt + countSub + countPay} Active Tasks`;

    } catch (err) {
        console.error("Dashboard Fetch Error: Access restricted or offline.");
        // Set metrics to 0 if data load fails
        ['attCount', 'subCount', 'payCount'].forEach(id => {
            document.getElementById(id).textContent = "0";
        });
    }
}
