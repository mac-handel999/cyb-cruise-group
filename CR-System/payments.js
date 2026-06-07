/**
 * CYB CRUISE GROUP — REAL-TIME PAYMENTS LOGISTICS ENGINE
 */
 
 
 window.updateFinancialCounters = function(data) {
    console.log("Financial update triggered:", data);
    // Add your math logic here to count total paid/unpaid
};


let masterRoster = [];

async function initPaymentsSystem() {
    try {
    
    const response = await fetch('/class-list.enc');
        const encryptedData = await response.text();
        masterRoster = JSON.parse(atob(encryptedData.trim()));
        
        // Listen to cloud stream
        database.ref('management/payments').on('value', (snapshot) => {
            renderPaymentsLayout(snapshot.val());
        });
        setupPaymentListeners();
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
                <div class="no-print"><button class="btn-action" style="background:#118ab2;" onclick="copyWhatsAppPayment('${task.title}', ${JSON.stringify(paidArr)})">COPY WHATSAPP</button></div>
            </div>
            <div class="metrics-bar" style="padding:12px; background:#050b14;">
                <div class="metric-card">💰 PAID: ${paidArr.length}</div>
                <div class="metric-card">📦 COLLECTED: ${collArr.length}</div>
            </div>
            <div class="no-print" style="padding:15px;">
                <input type="text" class="input-box" placeholder="Search to log..." oninput="filterPaymentSearch(this, '${task.id}')">
                <div id="searchBin_${task.id}"></div>
            </div>
            <div id="list_${task.id}">${renderRows(task, paidArr, collArr)}</div>
        `;
        container.appendChild(block);
    });
}

function renderRows(task, paidArr, collArr) {
    const allRegs = Array.from(new Set([...paidArr.map(s=>s.reg), ...collArr.map(s=>s.reg)]));
    return allRegs.map(reg => {
        const match = masterRoster.find(s => s.regNumber === reg);
        const isPaid = paidArr.some(s => s.reg === reg);
        const isColl = collArr.some(s => s.reg === reg);
        return `
            <div class="student-row">
                <span>💳 ${match?.name || "UNKNOWN"} (${reg})</span>
                <button onclick="togglePay('${task.id}', '${reg}', 'paidStudents', ${!isPaid})" style="background:${isPaid?'#06d6a0':'#4a0e17'}"> ${isPaid?'PAID':'UNPAID'}</button>
                <button onclick="togglePay('${task.id}', '${reg}', 'collectedStudents', ${!isColl})" style="background:${isColl?'#00d4ff':'#ffb703'}">${isColl?'COLLECTED':'PENDING'}</button>
            </div>
        `;
    }).join('');
}

// Cloud Update Functions
function togglePay(taskId, reg, path, status) {
    if (status) {
        database.ref(`management/payments/${taskId}/${path}/${reg}`).set({reg: reg});
    } else {
        database.ref(`management/payments/${taskId}/${path}/${reg}`).remove();
    }
}

function setupPaymentListeners() {
    document.getElementById('deployMaterialBtn').onclick = () => {
        const title = document.getElementById('payTitle').value;
        database.ref('management/payments').push({ title, createdAt: Date.now() });
    };
    document.getElementById('wipeLedgerBtn').onclick = () => database.ref('management/payments').remove();
}

document.addEventListener('DOMContentLoaded', initPaymentsSystem);



/**
 * Real-time Search Filter for Payment Ledger
 * Queries the master roster and pushes selections to the Cloud Matrix
 */
function filterPaymentSearch(inputEl, taskId) {
    const query = inputEl.value.trim().toLowerCase();
    const bin = document.getElementById(`searchBin_${taskId}`);
    if (!bin) return;
    
    bin.innerHTML = "";
    if (query.length < 2) return;

    // Filter master roster for matches
    const matches = masterRoster.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.regNumber.includes(query)
    ).slice(0, 5);

    matches.forEach(student => {
        const row = document.createElement('div');
        row.className = 'student-row';
        row.style.background = '#050b14';
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.padding = '10px';
        row.innerHTML = `
            <span>${student.name.toUpperCase()} (${student.regNumber})</span>
            <button class="btn-action" style="padding:5px 10px; font-size:0.8rem; background:#06d6a0; cursor:pointer;" 
            onclick="addPaymentEntry('${taskId}', '${student.regNumber}')">LOG ENTRY</button>
        `;
        bin.appendChild(row);
    });
}

/**
 * Helper to push the searched student into the Firebase ledger
 */
function addPaymentEntry(taskId, regNum) {
    // Automatically sets them to UNPAID/PENDING when first added
    database.ref(`management/payments/${taskId}/paidStudents/${regNum}`).set({ reg: regNum });
    
    // Clear the bin
    const bin = document.querySelector(`[id^="searchBin_"]`);
    if (bin) bin.innerHTML = "";
    
    console.log(`System: ${regNum} injected into ledger.`);
}

