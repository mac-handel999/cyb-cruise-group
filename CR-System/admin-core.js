// --- DATABASE DISK READING & WRITING CONTROLLER ---
function loadAdminMatrix() {
    const rawData = localStorage.getItem('cruise_admin_matrix');
    if (!rawData) {
        return { attendance: [], submissions: [], payments: [] };
    }
    try {
        // Base64 Decode and parse back into standard programming Object layout
        return JSON.parse(atob(rawData));
    } catch (e) {
        console.error("Database corruption detected. Initializing safety array fallback configuration.");
        return { attendance: [], submissions: [], payments: [] };
    }
}

function saveAdminMatrix(matrixObject) {
    // Stringify and scramble using Base64 before writing to local flash block
    const scrambledString = btoa(JSON.stringify(matrixObject));
    localStorage.setItem('cruise_admin_matrix', scrambledString);
}

// --- ADMINISTRATIVE NUMERICAL MATRIX METRICS ---
function computeTaskMetrics(actionCount, totalClassCount = 241) {
    const activeTotal = parseInt(actionCount) || 0;
    const classTotal = parseInt(totalClassCount) || 241;
    const remaining = classTotal - activeTotal;
    const complianceRate = ((activeTotal / classTotal) * 180).toFixed(1); // Metric tracking output percent

    return {
        completed: activeTotal,
        pending: remaining >= 0 ? remaining : 0,
        totalClass: classTotal
    };
}

// --- GLOBAL ATOMIC DESTROY PROTOCOL ---
function clearSectionRecords(sectionKey) {
    if (confirm(`⚠️ WARNING: You are executing a destructive database wipe on section [${sectionKey.toUpperCase()}]. This cannot be undone. Proceed?`)) {
        const db = loadAdminMatrix();
        if (db[sectionKey]) {
            db[sectionKey] = []; // Purge the targeted matrix index array
            saveAdminMatrix(db);
            location.reload(); // Hard refresh to update UI state tracking variables
        }
    }
}

// --- CLIPBOARD WHATSAPP COURIER ENGINE ---
function copyListToClipboard(title, headerLabel, studentListArray, allStudentsRoster) {
    let outputText = `📝 *${title.toUpperCase()}* \n`;
    outputText += `📅 Generated: ${new Date().toLocaleDateString()} | Node: CYB CRUISE\n`;
    outputText += `-------------------------------------------\n`;
    outputText += `👉 *STATUS LIST (${headerLabel.toUpperCase()}):* \n\n`;

    if (studentListArray.length === 0) {
        outputText += `[Empty List Trajectory]\n`;
    } else {
        studentListArray.forEach((regNum, index) => {
            // Match the Reg against your pre-cached 241 master roster names
            const studentMatch = allStudentsRoster.find(s => s.regNumber === regNum);
            const studentName = studentMatch ? studentMatch.name.toUpperCase() : "UNVERIFIED IDENTITY NODE";
            outputText += `${index + 1}. ${studentName} (${regNum})\n`;
        });
    }

    const metrics = computeTaskMetrics(studentListArray.length);
    outputText += `\n-------------------------------------------\n`;
    outputText += `📊 *SUMMARY METRICS:*\n`;
    outputText += `• Action Count: ${metrics.completed}\n`;
    outputText += `• Pending Vector: ${metrics.pending}\n`;
    outputText += `• Total Base Class: ${metrics.totalClass}\n`;
    outputText += `\nEngineered By {FABIAN CODES HQ}`;

    navigator.clipboard.writeText(outputText).then(() => {
        alert("🚀 Payload formatted and copied to clipboard! You can now paste it directly into WhatsApp.");
    }).catch(err => {
        alert("Clipboard integration blocked by security protocol. Copy manually.");
    });
}





// --- DYNAMIC TASK GENERATION MECHANISM ---
function createNewTaskRecord(sectionKey, inputTitleId) {
    const titleInput = document.getElementById(inputTitleId);
    if (!titleInput || !titleInput.value.trim()) {
        alert("Integrity check failed: Item configuration description cannot be empty.");
        return;
    }

    const db = loadAdminMatrix();
    const newTask = {
        id: "task_" + Date.now(), // Unique ID based on time
        title: titleInput.value.trim(),
        date: new Date().toISOString().split('T')[0],
        students: [],
        paidStudents: [],      // Used for payment tracking sheets
        collectedStudents: []  // Used for payment tracking sheets
    };

    db[sectionKey].push(newTask);
    saveAdminMatrix(db);
    titleInput.value = ""; // Clear form input element
    location.reload();     // Re-render display states
}

// --- ACTIVE STUDENT ROSTER INCLUSION TOGGLE ---
function toggleStudentInTask(sectionKey, taskId, studentRegNumber, arrayProperty = "students") {
    const db = loadAdminMatrix();
    const task = db[sectionKey].find(t => t.id === taskId);
    
    if (!task) return;

    // Safety initialization check
    if (!task[arrayProperty]) task[arrayProperty] = [];

    const index = task[arrayProperty].indexOf(studentRegNumber);
    if (index === -1) {
        // Not in list -> Inject element record
        task[arrayProperty].push(studentRegNumber);
    } else {
        // Already in list -> Splice element record out
        task[arrayProperty].splice(index, 1);
    }
    
    saveAdminMatrix(db);
}





        
        
