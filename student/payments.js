/**
 * CYB CRUISE GROUP — STUDENT PAYMENTS & HANDOUT VIEW
 * READ-ONLY INTERFACE
 */

let masterRoster = [];

async function initPaymentsSystem() {
    try {
        const response = await fetch('/class-list.enc');
        const encryptedData = await response.text();
        masterRoster = JSON.parse(atob(encryptedData.trim()));
        
        // Listen only to data stream
        database.ref('management/payments').on('value', (snapshot) => {
            renderPaymentsLayout(snapshot.val());
        });
    } catch (e) {
        console.error("Initialization fault:", e);
    }
}

function renderPaymentsLayout(liveData) {
    const container = document.getElementById('paymentsContainer');
    if (!container) return;
    container.innerHTML = "";

    if (!liveData) {
        container.innerHTML = `<div class='metric-card'>[!] NO ACTIVE HANDOUT ACCOUNTABILITY SLOTS REGISTERED</div>`;
        return;
    }

    const tasks = Object.keys(liveData).map(k => ({id: k, ...liveData[k]}));

    tasks.forEach(task => {
        const paidArr = task.paidStudents ? Object.values(task.paidStudents) : [];
        const collArr = task.collectedStudents ? Object.values(task.collectedStudents) : [];
        
        const block = document.createElement('div');
        block.className = 'task-block';
        block.innerHTML = `
            <div class="task-header">
                <div><strong style="font-size:1.1rem; color:#fff;">${task.title.toUpperCase()}</strong></div>
            </div>
            <div class="metrics-bar" style="padding:12px; background:#050b14;">
                <div class="metric-card">💰 PAID: ${paidArr.length}</div>
                <div class="metric-card">📦 COLLECTED: ${collArr.length}</div>
            </div>
            <div id="list_${task.id}" style="padding:10px;">
                ${renderRows(paidArr, collArr)}
            </div>
        `;
        container.appendChild(block);
    });
}

function renderRows(paidArr, collArr) {
    // Unique list of all regs currently in the ledger
    const allRegs = Array.from(new Set([...paidArr.map(s=>s.reg), ...collArr.map(s=>s.reg)]));
    
    if (allRegs.length === 0) return `<div style="text-align:center;">No records found.</div>`;

    return allRegs.map(reg => {
        const match = masterRoster.find(s => s.regNumber === reg);
        const isPaid = paidArr.some(s => s.reg === reg);
        const isColl = collArr.some(s => s.reg === reg);
        
        return `
            <div class="student-row">
                <span>💳 ${match?.name || "UNKNOWN"} (${reg})</span>
                <span style="color:${isPaid ? '#06d6a0' : '#4a0e17'}; margin-left:10px;">
                    ${isPaid ? 'PAID' : 'UNPAID'}
                </span>
                <span style="color:${isColl ? '#00d4ff' : '#ffb703'}; margin-left:10px;">
                    ${isColl ? 'COLLECTED' : 'PENDING'}
                </span>
            </div>
        `;
    }).join('');
}

document.addEventListener('DOMContentLoaded', initPaymentsSystem);
