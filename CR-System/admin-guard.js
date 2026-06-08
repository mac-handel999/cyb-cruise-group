/**
 * CYB CRUISE GROUP — SECURE GUARD ENGINE
 * All validation is now performed against the secure API Gateway.
 */

window.checkClearanceLevel = async function() {
    const adminToken = localStorage.getItem('x-admin-token');
    
    if (!adminToken) return 'READ_ONLY';

    try {
        // Ask the server if this token is actually valid
        const response = await fetch('http://localhost:5500/api/admin/verify' || 'http://localhost:6700/api/admin/verify', {
            method: 'GET',
            headers: { 'x-admin-token': adminToken }
        });
        
        return response.ok ? 'WRITE_ACCESS' : 'READ_ONLY';
    } catch (e) {
        return 'READ_ONLY';
    }
};

window.applyInterfaceClearance = async function() {
    const clearance = await window.checkClearanceLevel();
    const adminElements = document.querySelectorAll('.admin-only-control, .admin-action-btn');

    if (clearance === 'WRITE_ACCESS') {
        adminElements.forEach(el => el.style.display = '');
    } else {
        adminElements.forEach(el => el.style.display = 'none');
        
        // Optional: Add the Read-Only banner
        if (!document.getElementById('readOnlyNotice')) {
            const badge = document.createElement('div');
            badge.id = "readOnlyNotice";
            badge.innerHTML = "👁️ SYSTEM VIEW: READ-ONLY (ADMIN PRIVILEGES NOT DETECTED)";
            badge.style = "background: rgba(0, 212, 255, 0.08); color: #00d4ff; border: 1px solid rgba(0, 212, 255, 0.3); padding: 10px; text-align: center; font-size: 0.8rem; font-family: monospace; font-weight: bold;";
            document.body.insertBefore(badge, document.body.firstChild);
        }
    }
};

// Run immediately
applyInterfaceClearance();