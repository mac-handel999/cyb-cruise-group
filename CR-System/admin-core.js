/**
 * CYB CRUISE GROUP — SECURE ADMIN CORE ENGINE
 * All operations are now routed through the server API Gateway.
 */

// Helper to get headers for all admin requests
const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'x-admin-token': localStorage.getItem('x-admin-token')
});

// --- FETCH DATA FROM SERVER ---
async function fetchAdminMatrix() {
    const [attendance, payments] = await Promise.all([
        fetch('/api/attendance').then(res => res.json()),
        fetch('/api/payments').then(res => res.json())
    ]);
    return { attendance, payments };
}

// --- SECURE DESTRUCTION PROTOCOL ---
async function clearSectionRecords(sectionKey) {
    if (confirm(`⚠️ WARNING: Wiping ${sectionKey}. This is a destructive server-side operation.`)) {
        // You should define a DELETE route in server.js for this
        const response = await fetch(`/api/admin/wipe/${sectionKey}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (response.ok) location.reload();
        else alert("Security breach or unauthorized access.");
    }
}

// --- WHATSAPP COURIER (Updated to use server-data) ---
function copyListToClipboard(title, studentArray, allStudentsRoster) {
    let outputText = `📝 *${title.toUpperCase()}* \n`;
    outputText += `📅 ${new Date().toLocaleDateString()} | CYB CRUISE\n`;
    outputText += `-------------------------------------------\n`;
    
    studentArray.forEach((s, idx) => {
        const match = allStudentsRoster.find(r => r.regNumber === s.regNumber);
        outputText += `${idx + 1}. ${match?.name.toUpperCase() || "UNKNOWN"} (${s.regNumber})\n`;
    });

    navigator.clipboard.writeText(outputText).then(() => {
        alert("🚀 Payload copied to system clipboard.");
    });
}

// --- SECURE TASK GENERATION ---
async function createNewTaskRecord(sectionKey, titleValue) {
    if (!titleValue.trim()) return alert("Title required.");

    const response = await fetch(`/api/admin/${sectionKey}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: titleValue })
    });

    if (response.ok) location.reload();
    else alert("Access denied.");
}

// --- SECURE TOGGLE ---
async function toggleStudentInTask(taskId, regNumber, action = 'add') {
    const method = action === 'add' ? 'POST' : 'DELETE';
    const response = await fetch(`/api/admin/attendance/${taskId}/students/${regNumber}`, {
        method: method,
        headers: getAuthHeaders()
    });
    
    if (!response.ok) alert("Unauthorized modification attempt.");
    // UI refreshes automatically via the real-time listener (Firebase)
}