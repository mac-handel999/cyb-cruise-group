// Grab the active student's credentials from your level-1 gateway storage
const currentStudentReg = atob(localStorage.getItem('cruise_user_reg'));
const currentStudentName = atob(localStorage.getItem('cruise_user_name')); // Assuming you save the name at login

// Listen for live attendance sheet initializations
database.ref('management/attendance').on('value', (snapshot) => {
    const attendanceData = snapshot.val() || {};
    renderAttendanceUI(attendanceData);
});

function renderAttendanceUI(attendanceData) {
    const clearance = checkClearanceLevel(); // Grab Admin status
    const listContainer = document.getElementById('attendanceRows');
    const checkInSection = document.getElementById('selfCheckInContainer');
    
    listContainer.innerHTML = "";

    // 1. DUAL-VIEW INTERFACE ROUTING
    if (clearance === 'WRITE_ACCESS') {
        // Admin View: Reps see the full operational controls
        if(checkInSection) checkInSection.style.display = 'none';
    } else {
        // Student View: Check if this specific student has already signed in
        if (checkInSection) {
            if (attendanceData[currentStudentReg]) {
                checkInSection.innerHTML = `<div style="color: #00d4ff; font-weight: bold; padding: 10px; border: 1px dashed #00d4ff; border-radius: 6px;">✅ YOUR ATTENDANCE HAS BEEN SECURELY LOGGED FOR THIS SESSION</div>`;
            } else {
                checkInSection.style.display = 'block';
                checkInSection.innerHTML = `
                    <p style="color:#cbd5e1; font-size:0.85rem;">DECENTRALIZED ATTENDANCE MODULE ACTIVE</p>
                    <button class="btn" onclick="submitSelfAttendance()" style="background:#800020; border:1px solid #00d4ff;">
                        📌 SIGN MY ATTENDANCE (${currentStudentReg})
                    </button>`;
            }
        }
    }

    // 2. REAL-TIME RENDERING (Visible to everyone simultaneously)
    let index = 1;
    for (let reg in attendanceData) {
        const record = attendanceData[reg];
        listContainer.innerHTML += `
            <tr>
                <td>${index++}</td>
                <td>${record.name}</td>
                <td>${reg}</td>
                <td>${record.timestamp}</td>
                ${clearance === 'WRITE_ACCESS' ? `<td><button onclick="removeStudent('${reg}')" style="background:transparent; border:none; cursor:pointer;">❌</button></td>` : ''}
            </tr>
        `;
    }
    
    // Trigger your existing percentage calculation charts here automatically!
    updateAttendanceMetrics(index - 1); 
}

// Student Self-Sign Handshake
function submitSelfAttendance() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Push directly to the shared attendance ledger using the Reg Number as a clean key
    database.ref('management/attendance/' + currentStudentReg).set({
        name: currentStudentName,
        timestamp: timeString,
        createdAt: Date.now() // Track precisely when this was written for the self-destruct cycle
    });
}


//for 24hrs database delete cycle, we can set up a simple cleanup function that runs on page load or at regular intervals

function enforceAttendanceLifecycle() {
    const attendanceRef = database.ref('management/attendance');
    
    // Read the sheet data once to check timestamps
    attendanceRef.once('value', (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        // Grab the first student record to check when the list was initialized
        const firstKey = Object.keys(data)[0];
        const listCreationTime = data[firstKey].createdAt;
        
        const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
        const timeElapsed = Date.now() - listCreationTime;

        if (timeElapsed >= TWENTY_FOUR_HOURS_MS) {
            console.log("⏰ 24-Hour Lifecycle Expired. Purging data path from cloud memory...");
            
            // Wipe the database path clean for the next lecture session
            attendanceRef.remove()
                .then(() => {
                    console.log("Database cleared successfully to optimize storage thresholds.");
                })
                .catch(err => console.error("Purge failure:", err));
        }
    });
}

// Run the script checkpoint the millisecond the application mounts
enforceAttendanceLifecycle();