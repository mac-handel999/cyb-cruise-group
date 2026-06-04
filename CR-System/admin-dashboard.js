 document.addEventListener('DOMContentLoaded', () => {
            // Read active database matrix object array lengths
            const db = loadAdminMatrix();
            
            const countAtt = db.attendance ? db.attendance.length : 0;
            const countSub = db.submissions ? db.submissions.length : 0;
            const countPay = db.payments ? db.payments.length : 0;

            // Render numeric metrics directly inside UI badges
            document.getElementById('attCount').textContent = countAtt;
            document.getElementById('subCount').textContent = countSub;
            document.getElementById('payCount').textContent = countPay;
            document.getElementById('totalTasksCount').textContent = `${countAtt + countSub + countPay} Active Tasks`;

            // Exit back to normal student user view
           // Correct configuration for easy jumping back and forth
document.getElementById('closeAdminBtn').addEventListener('click', () => {
    // Just leave the admin area cleanly. DO NOT clear localStorage keys here!
    window.location.href = '/Home.html';
});

        
        // Add this only if you want an absolute manual reset of the admin session
function forceAdminLockdown() {
    localStorage.removeItem('cruise_admin_token');
    localStorage.removeItem('cruise_admin_time');
    window.location.href = '/Home.html';
};
})