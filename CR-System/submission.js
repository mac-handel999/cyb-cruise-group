
window.deleteTask = (taskId) => {
    // HARD CHECK: If not admin, block immediately
    if (!isUserAdmin()) {
        alert("ACCESS DENIED: Administrative privileges required.");
        return;
    }
    if (confirm("Delete this submission category permanently?")) {
        database.ref(`management/submissions/${taskId}`).remove();
    }
};


function createNewSubmissionSlot() {
    // HARD CHECK: If not admin, block immediately
    if (!isUserAdmin()) {
        alert("ACCESS DENIED: Unauthorized.");
        return;
    }
    
    const titleInput = document.getElementById('subTitle');
    // ... rest of create logic
}



 /**
 * CYB CRUISE GROUP — REAL-TIME CENTRAL SUBMISSIONS MATRIX ENGINE
 * Engineered by {FABIAN CODES HQ} - 2026
 */

let masterRoster = [];
let currentStudentReg = "";
let currentStudentName = "";

// Parse identity profile tokens
try {
    currentStudentReg = atob(localStorage.getItem('cruise_user_reg') || "");
    currentStudentName = atob(localStorage.getItem('cruise_user_name') || "");
} catch (e) {
    console.error("Matrix Crypto: Identity verification block failure.");
}

/**
 * Platform Context Initializer Sequence Loop
 */
async function initSubmissionsSystem() {
    try {
        const response = await fetch('/class-list.enc');
        if (!response.ok) throw new Error("Cloud roster offline.");
        const encryptedData = await response.text();
        masterRoster = JSON.parse(atob(encryptedData.trim()));
        
        // Engage live synchronizer data channels
        listenToLiveSubmissions();
        setupSubmissionsControlListeners();
    } catch (err) {
        console.error("Critical component error matrix isolation:", err);
        renderSubmissionsLayout(null);
    }
}

/**
 * Links UI Context directly to the Remote Firebase Node
 */
function listenToLiveSubmissions() {
    database.ref('management/submissions').on('value', (snapshot) => {
        const liveData = snapshot.val();
        renderSubmissionsLayout(liveData);
    });
}

/**
 * Builds Interface layout maps dynamically from cloud payloads
 */
function renderSubmissionsLayout(liveData) {
    const container = document.getElementById('submissionContainer');
    if (!container) return;
    container.innerHTML = "";

    const clearance = checkClearanceLevel();
    const selfSubmissionWrapper = document.getElementById('selfSubmissionWrapper');

    if (!liveData) {
        container.innerHTML = `<div class='metric-card'>[!] NO ACTIVE ASSIGNMENT TRACKING CATEGORIES DEPLOYED</div>`;
        if (selfSubmissionWrapper) selfSubmissionWrapper.style.display = 'none';
        return;
    }

    // Transform Object keys into queryable array data structures
    const currentTasks = Object.keys(liveData).map(key => ({
        id: key,
        ...liveData[key]
    }));

    currentTasks.forEach(task => {
        const studentArray = task.students ? Object.values(task.students) : [];
        const totalClassSize = masterRoster.length || 241;
        const submittedCount = studentArray.length;
        const pendingCount = Math.max(0, totalClassSize - submittedCount);

        // 1. EVALUATE DECENTRALIZED ASSIGNMENT SUBMISSION RIGHTS
        if (selfSubmissionWrapper) {
            if (clearance === 'WRITE_ACCESS') {
                selfSubmissionWrapper.style.display = 'none';
            } else {
                selfSubmissionWrapper.style.display = 'block';
                const hasLoggedFile = studentArray.some(s => s.regNumber === currentStudentReg);

                if (hasLoggedFile) {
                    selfSubmissionWrapper.innerHTML = `
                        <div style="color: #06d6a0; font-weight: bold; text-align: center; font-family: monospace;">
                            ✅ DATA SECURED: FILE SUBMISSION CONFIRMED FOR ${task.title.toUpperCase()}
                        </div>`;
                } else {
                    selfSubmissionWrapper.innerHTML = `
                        <div style="display:flex; flex-direction:column; align-items:center; gap:10px; font-family:monospace;">
                            <span style="color:#cbd5e1; font-size:0.85rem;">📂 DECENTRALIZED DIGITAL ASSIGNMENT LOG OPEN</span>
                            <button class="btn-action" onclick="submitSelfAssignment('${task.id}')" style="background:#800020; color:#fff; padding:10px 20px; border:1px solid #00d4ff; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; max-width:320px;">
                                🚀 LOG MY FILE SUBMISSION (${currentStudentReg})
                            </button>
                        </div>`;
                }
            }
        }

        // 2. CONSTRUCT CARD ENGINE DOM BLOCKS
        const block = document.createElement('div');
        block.className = 'task-block';
        block.innerHTML = `
            <div class="task-header">
                <div>
                    <strong style="font-size:1.1rem; color:#fff;">${task.title.toUpperCase()}</strong><br>
                    <small style="color:#00d4ff;"><i class="fa fa-clock-o"></i> Opened: ${task.date || 'Live Session'}</small>
                </div>
                <div class="no-print" style="display:flex; gap:10px;">
                    <button class="btn-action" style="padding:6px 12px; font-size:0.8rem; background:#118ab2;" id="copySubBtn_${task.id}"><i class="fa fa-whatsapp"></i> COPY WHATSAPP</button>
                    <button class="btn-action" style="padding:6px 12px; font-size:0.8rem; background:#06d6a0;" onclick="window.print()"><i class="fa fa-print"></i> EXPORT REPORT</button>
                </div>
            </div>
            
            <div class="metrics-bar" style="padding:15px; background:#050b14; border-bottom:1px solid #1c2541;">
                <div class="metric-card">🟢 SUBMITTED: <strong style="color:#06d6a0;">${submittedCount}</strong></div>
                <div class="metric-card">🔴 PENDING SUBMISSIONS: <strong style="color:#800020;">${pendingCount}</strong></div>
                <div class="metric-card">🧑‍💻 TOTAL EXPECTED: <strong>${totalClassSize}</strong></div>
            </div>

            <div class="no-print admin-only-control" style="padding:15px; background:rgba(255,255,255,0.01); border-bottom:1px solid #1c2541;">
                <input type="text" class="input-box" placeholder="🔎 Search Name/Reg to log a file collection..." oninput="filterSubmissionSearch(this, '${task.id}')">
                <div class="search-output-bin" id="searchBin_${task.id}" style="margin-top:10px; max-height:200px; overflow-y:auto;"></div>
            </div>

            <div id="list_${task.id}" style="max-height:300px; overflow-y:auto;">
                ${renderActiveSubmittedRows(task.id, studentArray, clearance)}
            </div>
        `;
        container.appendChild(block);

        // Assign contextual event tracking strings dynamically
        document.getElementById(`copySubBtn_${task.id}`).onclick = () => {
            executeWhatsAppSubExport(task.title, studentArray);
        };
    });

    // Enforce visibility modifiers from admin-guard core definitions
    if (typeof applyInterfaceClearance === "function") applyInterfaceClearance();
}

/**
 * Draws the verified row paths
 */
function renderActiveSubmittedRows(taskId, studentArray, clearance) {
    if (studentArray.length === 0) {
        return `<div style="padding:15px; color:#cbd5e1; text-align:center;">No submissions logged into ledger.</div>`;
    }
    return studentArray.map(record => {
        const match = masterRoster.find(s => s.regNumber === record.regNumber);
        return `
            <div class="student-row">
                <span>✅ ${match ? match.name.toUpperCase() : "UNKNOWN NODE"} (${record.regNumber})</span>
                ${clearance === 'WRITE_ACCESS' ? `
                    <button class="btn-action no-print" style="background:#4a0e17; padding:4px 10px; font-size:0.75rem; color:#fff; border:none; cursor:pointer;" onclick="removeSubmissionFromCloud('${taskId}', '${record.regNumber}')">REMOVE</button>
                ` : ''}
            </div>
        `;
    }).join('');
}

/**
 * Local search filter loops
 */
function filterSubmissionSearch(inputEl, taskId) {
    const query = inputEl.value.trim().toLowerCase();
    const bin = document.getElementById(`searchBin_${taskId}`);
    if (!bin) return;
    bin.innerHTML = "";
    if (query.length < 2) return;

    const matches = masterRoster.filter(s => s.name.toLowerCase().includes(query) || s.regNumber.includes(query)).slice(0, 5);
    matches.forEach(student => {
        const row = document.createElement('div');
        row.className = 'student-row';
        row.style.background = '#050b14';
        row.innerHTML = `
            <span>${student.name.toUpperCase()} (${student.regNumber})</span>
            <button class="btn-action" style="padding:5px 10px; font-size:0.8rem; background:#06d6a0;" onclick="addSubmissionViaAdmin('${taskId}', '${student.regNumber}', '${student.name}')">LOG FILE</button>
        `;
        bin.appendChild(row);
    });
}

/**
 * PRIVILEGED: Admin appends user submission index to snapshot pointer
 */
function addSubmissionViaAdmin(taskId, regNum, name) {
    database.ref(`management/submissions/${taskId}/students/${regNum}`).set({
        regNumber: regNum,
        name: name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }).then(() => {
        const bin = document.getElementById(`searchBin_${taskId}`);
        if(bin) bin.innerHTML = "";
    });
}

/**
 * STANDARD CLASSMATE ACTION: Self Submission Execution
 */
function submitSelfAssignment(taskId) {
    if (!currentStudentReg || !currentStudentName) {
        alert("🔒 RE-AUTHENTICATION REQUIRED: Unable to verify system signature vectors.");
        return;
    }
    database.ref(`management/submissions/${taskId}/students/${currentStudentReg}`).set({
        regNumber: currentStudentReg,
        name: currentStudentName,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
}

/**
 * PRIVILEGED: Admin removes target pointer string
 */
function removeSubmissionFromCloud(taskId, regNum) {
    if (confirm(`Remove assignment ticket node pointer for ${regNum}?`)) {
        database.ref(`management/submissions/${taskId}/students/${regNum}`).remove();
    }
}

/**
 * PRIVILEGED: Admin Deploys New Tracking Topic Node
 */
function createNewSubmissionSlot() {
    const titleInput = document.getElementById('subTitle');
    if (!titleInput || !titleInput.value.trim()) return;

    const newKey = database.ref(`management/submissions`).push().key;
    const dateString = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    database.ref(`management/submissions/${newKey}`).set({
        title: titleInput.value.trim(),
        date: dateString,
        createdAt: Date.now(),
        students: {}
    }).then(() => {
        titleInput.value = "";
    });
}

/**
 * EXPORT COURIER: WhatsApp Matrix Formatting System
 */
function executeWhatsAppSubExport(title, studentArray) {
    let output = `*📦 CYB CRUISE ASSIGNMENT SUBMISSION LOG*\n`;
    output += `*📚 TOPIC:* ${title.toUpperCase()}\n`;
    output += `*📊 SUBMITTED COUNTER:* ${studentArray.length} ASSIGNMENTS COLLECTED\n`;
    output += `----------------------------------------\n`;
    
    if (studentArray.length === 0) {
        output += `No data files verified in queue.\n`;
    } else {
        studentArray.forEach((s, idx) => {
            output += `${idx + 1}. ${s.regNumber} - ${s.name.toUpperCase()}\n`;
        });
    }

    navigator.clipboard.writeText(output).then(() => {
        alert("🚀 ASSIGNMENT SUBMISSION STRING EXPORTED TO CLIPBOARD");
    }).catch(err => console.error("Clipboard engine fault:", err));
}

/**
 * Configures event attachment pipelines
 */
function setupSubmissionsControlListeners() {
    // 1. Use an event delegation approach so it works even if the button is dynamically injected
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'deployTargetBtn') {
            createNewSubmissionSlot();
        }
    });

    // 2. Factory Reset button
    const resetBtn = document.getElementById('resetSubmissionsBtn');
    if (resetBtn) {
        resetBtn.onclick = () => {
            if (confirm("🚨 WIPE DATA?")) {
                database.ref('management/submissions').remove();
            }
        };
    }
}

// Kickstart engine core
document.addEventListener('DOMContentLoaded', initSubmissionsSystem);
