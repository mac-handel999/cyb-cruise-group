/**
 * CYB CRUISE GROUP — STUDENT SUBMISSIONS VIEW
 * READ-ONLY INTERFACE
 */

let masterRoster = [];
let currentStudentReg = "";
let currentStudentName = "";

// Initialize identity profile
try {
    currentStudentReg = atob(localStorage.getItem('cruise_user_reg') || "");
    currentStudentName = atob(localStorage.getItem('cruise_user_name') || "");
} catch (e) {
    console.error("Identity signature fault.");
}

async function initSubmissionsSystem() {
    try {
        const response = await fetch('/class-list.enc');
        const encryptedData = await response.text();
        masterRoster = JSON.parse(atob(encryptedData.trim()));
        
        // Listen only to data streams (No control listeners attached)
        listenToLiveSubmissions();
    } catch (err) {
        console.error("Dashboard error:", err);
        renderSubmissionsLayout(null);
    }
}

function listenToLiveSubmissions() {
   const data = await fetchManagedData('nodeName')
}

function renderSubmissionsLayout(liveData) {
    const container = document.getElementById('submissionContainer');
    if (!container) return;
    container.innerHTML = "";

    if (!liveData) {
        container.innerHTML = `<div class='metric-card'>[!] NO ACTIVE ASSIGNMENTS</div>`;
        return;
    }

    const currentTasks = Object.keys(liveData).map(key => ({ id: key, ...liveData[key] }));

    currentTasks.forEach(task => {
        const studentArray = task.students ? Object.values(task.students) : [];
        
        const block = document.createElement('div');
        block.className = 'task-block';
        block.innerHTML = `
            <div class="task-header">
                <strong>${task.title.toUpperCase()}</strong>
                <small>${task.date || 'Live Session'}</small>
            </div>
            
            <div class="metrics-bar">
                <div class="metric-card">🟢 SUBMITTED: <strong>${studentArray.length}</strong></div>
            </div>

            <!-- View Only: Student List -->
            <div id="list_${task.id}" style="max-height:300px; overflow-y:auto; padding:10px;">
                ${studentArray.length === 0 ? 
                    `<div style="text-align:center;">No submissions logged.</div>` : 
                    studentArray.map(s => `<div class="student-row">✅ ${s.name.toUpperCase()}</div>`).join('')
                }
            </div>
        `;
        container.appendChild(block);
    });
}
