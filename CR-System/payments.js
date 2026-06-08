/**
 * CYB CRUISE GROUP — SECURE PAYMENTS LOGISTICS ENGINE
 */

let masterRoster = [];

async function initPaymentsSystem() {
    try {
        const response = await fetch('/class-list.enc');
        const encryptedData = await response.text();
        masterRoster = JSON.parse(atob(encryptedData.trim()));
        
        // Initial load
        refreshPaymentData();
        setupPaymentListeners();
    } catch (e) {
        console.error("Initialization fault:", e);
    }
}

async function refreshPaymentData() {
    try {
        const response = await fetch('/api/payments');
        const liveData = await response.json();
        renderPaymentsLayout(liveData);
    } catch (e) {
        console.error("Failed to sync payments:", e);
    }
}

// Admin Write Operations (Secure Proxy)
async function togglePay(taskId, reg, path, status) {
    const method = status ? 'POST' : 'DELETE';
    const response = await fetch(`/api/admin/payments/${taskId}/${path}/${reg}`, {
        method: method,
        headers: { 'x-admin-token': localStorage.getItem('x-admin-token') }
    });
    
    if (response.ok) refreshPaymentData();
    else alert("Access Denied: Administrative token required.");
}

async function addPaymentEntry(taskId, regNum) {
    const response = await fetch(`/api/admin/payments/${taskId}/paidStudents/${regNum}`, {
        method: 'POST',
        headers: { 'x-admin-token': localStorage.getItem('x-admin-token') }
    });
    
    if (response.ok) {
        document.querySelector(`[id^="searchBin_"]`).innerHTML = "";
        refreshPaymentData();
    } else {
        alert("Unauthorized.");
    }
}

function setupPaymentListeners() {
    document.getElementById('deployMaterialBtn').onclick = async () => {
        const title = document.getElementById('payTitle').value;
        await fetch('/api/admin/payments', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-admin-token': localStorage.getItem('x-admin-token')
            },
            body: JSON.stringify({ title, createdAt: Date.now() })
        });
        refreshPaymentData();
    };
}

// UI Rendering (Unchanged logic, just ensure refreshPaymentData is called)
// ... [renderPaymentsLayout and renderRows functions remain the same] ...

document.addEventListener('DOMContentLoaded', initPaymentsSystem);