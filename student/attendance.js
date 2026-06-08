/**
 * CYB CRUISE GROUP — STUDENT ATTENDANCE TERMINAL
 * READ-ONLY & SELF-SUBMIT MODE
 */

/**
 * CYB CRUISE GROUP — STUDENT ATTENDANCE TERMINAL
 * NOW SECURED VIA PROXY SERVER
 */

async function fetchAttendance() {
    try {
        const response = await fetch('/api/attendance');
        const liveData = await response.json();
        renderAttendanceLayout(liveData);
    } catch (err) {
        console.error("Attendance Sync Error:", err);
    }
}

// Auto-refresh attendance every 10 seconds for a "live" feel
document.addEventListener('DOMContentLoaded', () => {
    fetchAttendance();
    setInterval(fetchAttendance, 10000); 
});



let masterRoster = [];
let currentStudentReg = "";
let currentStudentName = "";

// Initialize Credentials
try {
    currentStudentReg = atob(localStorage.getItem('cruise_user_reg') || "");
    currentStudentName = atob(localStorage.getItem('cruise_user_name') || "");
} catch(e) {
    console.error("Session security layer error.");
}

async function initAttendanceSystem() {
    try {
        const response = await fetch('/class-list.enc');
        const encryptedData = await response.text();
        masterRoster = JSON.parse(atob(encryptedData.trim()));
        
        // Listen to live data ONLY (No lifecycles or admin listeners)
        listenToLiveAttendance();
    } catch (err) {
        console.error("Attendance Terminal Error:", err.message);
        renderAttendanceLayout(null);
    }
}

// Replace listenToLiveAttendance with:
async function updateAttendanceUI() {
    try {
        const liveData = await apiFetch('attendance');
        renderAttendanceLayout(liveData);
    } catch (e) {
        console.error(e);
    }
}
// Run this every 5 seconds to simulate 'real-time'
setInterval(updateAttendanceUI, 5000);

/**
 * Render Student UI (No Admin Controls)
 */
function renderAttendanceLayout(liveData) {
    const container = document.getElementById('attendanceContainer');
    if (!container) return;
    container.innerHTML = "";

    if (!liveData) {
        container.innerHTML = `<div class='metric-card'>[!] NO ACTIVE ATTENDANCE SESSIONS</div>`;
        return;
    }

    const currentTasks = Object.keys(liveData).map(key => ({ id: key, ...liveData[key] }));

    currentTasks.forEach(task => {
        const studentArray = task.students ? Object.values(task.students) : [];
        const hasSigned = studentArray.some(s => s.regNumber === currentStudentReg);

        const block = document.createElement('div');
        block.className = 'task-block';
        block.innerHTML = `
            <div class="task-header">
                <strong>${task.title.toUpperCase()}</strong>
                <small>${task.date || 'Live Session'}</small>
            </div>
            
            <div class="metrics-bar">
                <div class="metric-card">🟢 PRESENT: <strong>${studentArray.length}</strong></div>
            </div>

            <!-- Self-Submit Section -->
            <div id="selfCheckIn_${task.id}" class="no-print" style="padding:15px;">
                ${hasSigned ? 
                    `<div style="color: #06d6a0;">✅ RECORDED</div>` : 
                    `<button onclick="submitSelfAttendance('${task.id}')" class="btn-action">SIGN ATTENDANCE</button>`
                }
            </div>

            <div class="attendance-list">
                ${studentArray.map(s => `<div>🏷️ ${s.name}</div>`).join('')}
            </div>
        `;
        container.appendChild(block);
    });
}

/**
 * Student-Only Action: Submit Attendance
 */
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
