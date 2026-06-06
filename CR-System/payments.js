// 1. Establish Real-Time Stream from the Payments Database Node
database.ref('management/payments').on('value', (snapshot) => {
    const paymentsData = snapshot.val() || {};
    renderPaymentsUI(paymentsData);
});

function renderPaymentsUI(paymentsData) {
    const clearance = checkClearanceLevel();
    const ledgerBody = document.getElementById('paymentsContainer');
    ledgerBody.innerHTML = "";

    let totalPaid = 0;
    let totalCollected = 0;
    let index = 1;

    for (let reg in paymentsData) {
        const record = paymentsData[reg];
        if (record.hasPaid) totalPaid++;
        if (record.hasCollected) totalCollected++;

        let adminActions = '';
        if (clearance === 'WRITE_ACCESS') {
            adminActions = `
                <td class="admin-only-control">
                    <button onclick="toggleCloudPayment('${reg}', ${!record.hasPaid})" style="background: ${record.hasPaid ? '#800020' : '#1e293b'}; color: #fff; padding: 4px 8px; border: 1px solid #00d4ff; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">
                        ${record.hasPaid ? 'Undo Pay' : 'Mark Paid'}
                    </button>
                    <button onclick="toggleCloudCollection('${reg}', ${!record.hasCollected})" style="background: ${record.hasCollected ? '#00d4ff' : '#1e293b'}; color: ${record.hasCollected ? '#000' : '#fff'}; padding: 4px 8px; border: 1px solid #00d4ff; border-radius: 4px; cursor: pointer; font-size: 0.75rem; margin-left: 5px;">
                        ${record.hasCollected ? 'Undo Collect' : 'Mark Collected'}
                    </button>
                </td>`;
        }

        ledgerBody.innerHTML += `
            <tr style="${reg === currentStudentReg ? 'background: rgba(128, 0, 32, 0.15); border-left: 3px solid #800020;' : ''}">
                <td>${index++}</td>
                <td>${record.name}</td>
                <td>${reg}</td>
                <td style="font-weight: bold; color: ${record.hasPaid ? '#22c55e' : '#ef4444'};">
                    ${record.hasPaid ? '✅ PAID' : '❌ UNPAID'}
                </td>
                <td style="font-weight: bold; color: ${record.hasCollected ? '#00d4ff' : '#e2e8f0'};">
                    ${record.hasCollected ? '📦 DELIVERED' : '⏳ PENDING'}
                </td>
                ${clearance === 'WRITE_ACCESS' ? adminActions : ''}
            </tr>
        `;
    }

    // Refresh layout finance metrics instantly across all active displays
    updateFinancialCounters(totalPaid, totalCollected);
}

// Specialized Dual-Action Admin Toggles
function toggleCloudPayment(studentReg, newStatus) {
    if (checkClearanceLevel() !== 'WRITE_ACCESS') return;
    database.ref(`management/payments/${studentReg}/hasPaid`).set(newStatus);
}

function toggleCloudCollection(studentReg, newStatus) {
    if (checkClearanceLevel() !== 'WRITE_ACCESS') return;
    database.ref(`management/payments/${studentReg}/hasCollected`).set(newStatus);
}