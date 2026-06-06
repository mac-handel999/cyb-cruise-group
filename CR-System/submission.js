const currentStudentReg = atob(localStorage.getItem('cruise_user_reg'));

// 1. Establish Real-Time Stream from the Submissions Database Node
database.ref('management/submissions').on('value', (snapshot) => {
    const submissionsData = snapshot.val() || {};
    renderSubmissionsUI(submissionsData);
});

function renderSubmissionsUI(submissionsData) {
    const clearance = checkClearanceLevel();
    const tableBody = document.getElementById('submissionsRows');
    tableBody.innerHTML = "";

    let submissionCount = 0;

    // 2. Dynamic Real-Time Row Generation
    for (let reg in submissionsData) {
        const record = submissionsData[reg];
        submissionCount++;

        let actionCell = '';
        if (clearance === 'WRITE_ACCESS') {
            actionCell = `<td class="admin-only-control">
                <button onclick="deleteSubmission('${reg}')" style="background:transparent; border:none; cursor:pointer;">❌</button>
            </td>`;
        }

        tableBody.innerHTML += `
            <tr style="${reg === currentStudentReg ? 'background: rgba(0, 212, 255, 0.05);' : ''}">
                <td>${submissionCount}</td>
                <td>${record.name}</td>
                <td>${reg}</td>
                <td><span style="color: #00d4ff; font-weight: bold;">📝 RECEIVED</span></td>
                <td>${record.timestamp}</td>
                ${clearance === 'WRITE_ACCESS' ? actionCell : ''}
            </tr>
        `;
    }

    // Automatically update your analytics counters (Submitted vs. Outstanding out of the 241 base)
    updateSubmissionMetrics(submissionCount);
}

// Admin Write Operations (Only executable by you or the CRs)
function logNewSubmission(studentReg, studentName) {
    if (checkClearanceLevel() !== 'WRITE_ACCESS') return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    database.ref('management/submissions/' + studentReg).set({
        name: studentName,
        timestamp: timeString,
        date: now.toLocaleDateString()
    });
}

function deleteSubmission(studentReg) {
    if (checkClearanceLevel() !== 'WRITE_ACCESS') return;
    if (confirm("Confirm deletion of this submission log?")) {
        database.ref('management/submissions/' + studentReg).remove();
    }
}