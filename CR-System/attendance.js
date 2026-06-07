/**
 * CYB CRUISE GROUP — CENTRAL REAL-TIME ATTENDANCE ENGINE
 * Engineered by {FABIAN CODES HQ} - 2026
 */

let masterRoster = [];
let currentStudentReg = "";
let currentStudentName = "";

// Initialize Credentials from Identity Gate Memory
try {
    currentStudentReg = atob(localStorage.getItem('cruise_user_reg') || "");
    currentStudentName = atob(localStorage.getItem('cruise_user_name') || "");
} catch(e) {
    console.error("Security Crypt Module: Decryption failure scanning session keys.");
}

/**
 * Boots the Application Thread Lifecycle
 */
async function initAttendanceSystem() {
    try {
        // Fetch and un-scramble the encrypted student roster profile
        const response = await fetch('/class-list.enc');
        if (!response.ok) throw new Error("Resource offline.");
        const encryptedData = await response.text();
        masterRoster = JSON.parse(atob(encryptedData.trim()));
        
        // Fire up Lifecycle Scanners and Realtime Data Listeners
        enforceAttendanceLifecycle();
        listenToLiveAttendance();
        setupStaticControlListeners();
    } catch (err) {
        console.error("🟢 Operational Error Resolution Block:", err.message);
        // Fallback to offline structural elements
        renderAttendanceLayout(null);
    }
}

/**
 * Subscribes to the Realtime Cloud Data Stream
 */
function listenToLiveAttendance() {
    database.ref('management/attendance').on('value', (snapshot) => {
        const liveData = snapshot.val();
        renderAttendanceLayout(liveData);
    });
}

// Example for attendance.js
const attendanceContainer = document.getElementById('attendanceContainer');
if (attendanceContainer) {
    attendanceContainer.innerHTML = "..."; 
} else {
    console.warn("Attendance Container not found on this page.");
}


/**
 * Mounts UI Blocks Based on Active User Permissions
 */
function renderAttendanceLayout(liveData) {
    const container = document.getElementById('attendanceContainer');
    if (!container) return;
    container.innerHTML = "";

    const clearance = checkClearanceLevel();
    const selfCheckInWrapper = document.getElementById('selfCheckInWrapper');

    // 1. EVALUATE CLOUD SYNC STATE
    if (!liveData) {
        container.innerHTML = `<div class='metric-card'>[!] NO ACTIVE ATTENDANCE MATRIX CATEGORIES INITIALIZED</div>`;
        if (selfCheckInWrapper) selfCheckInWrapper.style.display = 'none';
        return;
    }

    // Convert Object Node Keys into Iterable Arrays
    const currentTasks = Object.keys(liveData).map(key => ({
        id: key,
        ...liveData[key]
    }));

    currentTasks.forEach(task => {
        const studentArray = task.students ? Object.values(task.students) : [];
        const totalClassSize = masterRoster.length || 241; 
        const presentCount = studentArray.length;
        const absentCount = Math.max(0, totalClassSize - presentCount);

        // 2. MANAGE THE DECENTRALIZED INPUT MODAL DISPLAY
        if (selfCheckInWrapper) {
            if (clearance === 'WRITE_ACCESS') {
                selfCheckInWrapper.style.display = 'none';
            } else {
                selfCheckInWrapper.style.display = 'block';
                const hasSigned = studentArray.some(s => s.regNumber === currentStudentReg);
                
                if (hasSigned) {
                    selfCheckInWrapper.innerHTML = `
                        <div style="color: #00d4ff; font-weight: bold; text-align: center; font-family: monospace;">
                            ✅ SYSTEM LOCK: YOUR ATTENDANCE RECORDED FOR ${task.title.toUpperCase()}
                        </div>`;
                } else {
                    selfCheckInWrapper.innerHTML = `
                        <div style="display:flex; flex-direction:column; align-items:center; gap:10px; font-family:monospace;">
                            <span style="color:#cbd5e1; font-size:0.85rem;">🛰️ ACTIVE NETWORK SESSION DETECTED</span>
                            <button class="btn-action" onclick="submitSelfAttendance('${task.id}')" style="background:#800020; color:#fff; padding:10px 20px; border:1px solid #00d4ff; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; max-width:320px;">
                                📌 SIGN ATTENDANCE: ${currentStudentReg}
                            </button>
                        </div>`;
                }
            }
        }

        // 3. GENERATE SCREEN TERMINAL INFRASTRUCTURE
        const block = document.createElement('div');
        block.className = 'task-block';
        block.innerHTML = `
            <div class="task-header">
                <div>
                    <strong style="font-size:1.1rem; color:#fff;">${task.title.toUpperCase()}</strong><br>
                    <small style="color:#00d4ff;"><i class="fa fa-calendar"></i> Init Date: ${task.date || 'Live Session'}</small>
                </div>
                <div class="no-print" style="display:flex; gap:10px;">
                    <button class="btn-action" style="padding:6px 12px; font-size:0.8rem; background:#118ab2;" id="copyBtn_${task.id}"><i class="fa fa-whatsapp"></i> COPY WHATSAPP</button>
                    <button class="btn-action" style="padding:6px 12px; font-size:0.8rem; background:#06d6a0;" onclick="window.print()"><i class="fa fa-print"></i> EXPORT REPORT</button>
                </div>
            </div>
            
            <div class="metrics-bar" style="padding:15px; background:#050b14; border-bottom:1px solid #1c2541;">
                <div class="metric-card">🟢 PRESENT: <strong style="color:#06d6a0;">${presentCount}</strong></div>
                <div class="metric-card">🔴 ABSENT: <strong style="color:#800020;">${absentCount}</strong></div>
                <div class="metric-card">🧑‍💻 MATRIX LIST BASE: <strong>${totalClassSize}</strong></div>
            </div>

            <div class="no-print admin-only-control" style="padding:15px; background:rgba(255,255,255,0.01); border-bottom:1px solid #1c2541;">
                <input type="text" class="input-box" placeholder="🔎 Search Name or Registration Number to Toggle Attendance..." oninput="filterAttendanceSearch(this, '${task.id}')">
                <div class="search-output-bin" id="searchBin_${task.id}" style="margin-top:10px; max-height:200px; overflow-y:auto;"></div>
            </div>

            <div style="padding:10px; font-weight:bold; color:#00d4ff; background:#050b14;" class="no-print">CURRENT ATTENDANCE LIST ROOT:</div>
            <div id="list_${task.id}" style="max-height:300px; overflow-y:auto;">
                ${renderActiveAttendedRows(task.id, studentArray, clearance)}
            </div>
        `;
        container.appendChild(block);

        // Bind WhatsApp event hooks directly inside memory tracking vectors
        document.getElementById(`copyBtn_${task.id}`).onclick = () => {
            executeWhatsAppExport(task.title, studentArray);
        };
    });

    // Enforce visibility masking routines from admin-guard
    if (typeof applyInterfaceClearance === "function") applyInterfaceClearance();
}

/**
 * Builds Internal Data Matrix Row Output
 */
function renderActiveAttendedRows(taskId, studentArray, clearance) {
    if (studentArray.length === 0) {
        return `<div style="padding:15px; color:#cbd5e1; text-align:center;">No students checked into this terminal log yet.</div>`;
    }
    return studentArray.map(record => {
        const match = masterRoster.find(s => s.regNumber === record.regNumber);
        return `
            <div class="student-row">
                <span>🏷️ ${match ? match.name.toUpperCase() : "UNKNOWN NODE"} (${record.regNumber}) <small style="color:#64748b; font-size:0.7rem;">${record.timestamp || ''}</small></span>
                ${clearance === 'WRITE_ACCESS' ? `
                    <button class="btn-action no-print" style="background:#4a0e17; padding:4px 10px; font-size:0.75rem; color:#fff; margin:5px;" onclick="removeStudentFromCloud('${taskId}', '${record.regNumber}')">REMOVE</button>
                ` : ''}
            </div>
        `;
    }).join('');
}

/**
 * Filters the Client-Side Master Roster Array Cache
 */
function filterAttendanceSearch(inputEl, taskId) {
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
            <button class="btn-action" style="padding:5px 10px; font-size:0.8rem; background:#06d6a0; color:#fff; border-radius:15px; margin:5px;" onclick="addStudentViaAdmin('${taskId}', '${student.regNumber}', '${student.name}')">ADD</button>
        `;
        bin.appendChild(row);
    });
}

/**
 * ACTION: Admin Manually Adds a Student
 */
function addStudentViaAdmin(taskId, regNum, name) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    database.ref(`management/attendance/${taskId}/students/${regNum}`).set({
        regNumber: regNum,
        name: name,
        timestamp: time
    }).then(() => {
        const searchBin = document.getElementById(`searchBin_${taskId}`);
        if(searchBin) searchBin.innerHTML = "";
    });
}

/**
 * ACTION: Student Self-Signs from Their Device Screen Workspace
 */
function submitSelfAttendance(taskId) {
    if (!currentStudentReg || !currentStudentName) {
        alert("🔒 SYSTEM ATTRIBUTE FAULT: Session profiles corrupted. Re-authenticate through main gateway.");
        return;
    }
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    database.ref(`management/attendance/${taskId}/students/${currentStudentReg}`).set({
        regNumber: currentStudentReg,
        name: currentStudentName,
        timestamp: time
    });
}

/**
 * ACTION: Admin Removes a Single Record Row
 */
function removeStudentFromCloud(taskId, regNum) {
    if(confirm(`Remove registration pointer ${regNum} from ledger data loop?`)) {
        database.ref(`management/attendance/${taskId}/students/${regNum}`).remove();
    }
}

/**
 * ADMIN: Initializes an Independent Activity Cluster
 */
function deployNewAttendanceSheet() {
    const titleInput = document.getElementById('lectureTitle');
    if (!titleInput || !titleInput.value.trim()) return;

    const newKey = database.ref(`management/attendance`).push().key;
    const dateString = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    database.ref(`management/attendance/${newKey}`).set({
        title: titleInput.value.trim(),
        date: dateString,
        createdAt: Date.now(),
        students: {}
    }).then(() => {
        titleInput.value = "";
    });
}

/**
 * COURIER: Compiles Clipboard Formatting Layout Targets
 */
function executeWhatsAppExport(title, studentArray) {
    let output = `*📋 CYB CRUISE GROUP ATTENDANCE REPORT*\n`;
    output += `*📚 SESSION:* ${title.toUpperCase()}\n`;
    output += `*📅 DATE:* ${new Date().toLocaleDateString()}\n`;
    output += `*📊 TOTAL ATTENDANCE:* ${studentArray.length} PRESENT\n`;
    output += `----------------------------------------\n`;
    
    if (studentArray.length === 0) {
        output += `No records verified.\n`;
    } else {
        studentArray.forEach((s, idx) => {
            output += `${idx + 1}. ${s.regNumber} - ${s.name.toUpperCase()}\n`;
        });
    }

    navigator.clipboard.writeText(output).then(() => {
        alert("🚀 WHATSAPP LEDGER STRING EXTRACTED TO SYSTEM CLIPBOARD");
    }).catch(err => console.error("Clipboard export system barrier:", err));
}

/**
 * TIMELOCK: Automated 24-Hour Self-Destruct Garbage Collection Loop
 */
function enforceAttendanceLifecycle() {
    database.ref('management/attendance').once('value', (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
        const now = Date.now();

        Object.keys(data).forEach(taskId => {
            const taskBirthTime = data[taskId].createdAt;
            if (taskBirthTime && (now - taskBirthTime >= TWENTY_FOUR_HOURS_MS)) {
                console.log(`⏰ LIFECYCLE PURGE ACTIVATED: Purging expired session data cluster [${taskId}]`);
                database.ref(`management/attendance/${taskId}`).remove();
            }
        });
    });
}

/**
 * Dynamic Static DOM Trigger Mapping
 */
function setupStaticControlListeners() {
    const createTaskBtn = document.getElementById('createTaskBtn');
    if(createTaskBtn) {
        createTaskBtn.onclick = deployNewAttendanceSheet;
    }

    const wipeSectionBtn = document.getElementById('wipeSectionBtn');
    if(wipeSectionBtn) {
        wipeSectionBtn.onclick = () => {
            if (confirm("🚨 WARNING: Complete factory reset on active database cloud tree records? This cannot be undone!")) {
                database.ref('management/attendance').remove();
            }
        };
    }
}

// Attach Entry Point Interceptors
document.addEventListener('DOMContentLoaded', initAttendanceSystem);
