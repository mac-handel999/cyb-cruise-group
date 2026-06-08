/**
 * CYB CRUISE GROUP — SECURE ATTENDANCE ENGINE
 */

// ... [Keep masterRoster, currentStudentReg, currentStudentName, initAttendanceSystem as is] ...

/**
 * 1. REPLACED Cloud Stream with Server Fetch
 */
async function listenToLiveAttendance() {
    try {
        const response = await fetch('/api/attendance');
        const liveData = await response.json();
        renderAttendanceLayout(liveData);
    } catch (e) {
        console.error("Failed to fetch attendance:", e);
    }
}

/**
 * 2. SECURE ACTION: Admin Adds Student
 */
async function addStudentViaAdmin(taskId, regNum, name) {
    const response = await fetch(`/api/admin/attendance/${taskId}/students/${regNum}`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'x-admin-token': localStorage.getItem('x-admin-token') 
        },
        body: JSON.stringify({ regNumber: regNum, name: name })
    });

    if (response.ok) {
        document.getElementById(`searchBin_${taskId}`).innerHTML = "";
        listenToLiveAttendance(); // Refresh UI
    } else {
        alert("Unauthorized.");
    }
}

/**
 * 3. SECURE ACTION: Student Self-Sign (Still client-side logic for students)
 */
async function submitSelfAttendance(taskId) {
    // We keep this as is IF students don't have the admin token, 
    // but move it to a public POST route if you want full security.
    const response = await fetch(`/api/attendance/self-sign/${taskId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reg: currentStudentReg, name: currentStudentName })
    });
    
    if (response.ok) listenToLiveAttendance();
}

/**
 * 4. SECURE ACTION: Admin Removes Record
 */
async function removeStudentFromCloud(taskId, regNum) {
    if(!confirm(`Remove registration ${regNum}?`)) return;

    const response = await fetch(`/api/admin/attendance/${taskId}/students/${regNum}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': localStorage.getItem('x-admin-token') }
    });

    if (response.ok) listenToLiveAttendance();
    else alert("Access Denied.");
}

/**
 * 5. ADMIN: Deploy New Sheet
 */
async function deployNewAttendanceSheet() {
    const titleInput = document.getElementById('lectureTitle');
    if (!titleInput || !titleInput.value.trim()) return;

    const response = await fetch('/api/admin/attendance', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'x-admin-token': localStorage.getItem('x-admin-token')
        },
        body: JSON.stringify({ title: titleInput.value.trim() })
    });

    if (response.ok) {
        titleInput.value = "";
        listenToLiveAttendance();
    }
}