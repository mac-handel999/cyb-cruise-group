/**
 * CYB CRUISE GROUP — SECURE UPDATES LOGISTICS ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('updatesFeed');
    const deployBtn = document.getElementById('deployUpdateBtn');

    // 1. Initial UI Security Sweep
    if (typeof applyInterfaceClearance === "function") {
        applyInterfaceClearance();
    }

    // Fetch updates via Server Proxy
    async function fetchUpdates() {
        try {
            const response = await fetch('/api/updates');
            const updates = await response.json();
            renderUpdates(updates);
        } catch (e) {
            console.error("Failed to sync updates:", e);
        }
    }

    function renderUpdates(updates) {
        feedContainer.innerHTML = '';
        if (!updates) {
            feedContainer.innerHTML = '<p style="color:#cbd5e1; text-align:center;">No active broadcasts.</p>';
            return;
        }

        Object.entries(updates).reverse().forEach(([key, item]) => {
            const card = document.createElement('div');
            card.className = 'features-list update-card';
            card.style.marginBottom = '20px';

            card.innerHTML = `
                <div style="font-size:0.75rem; color:#00d4ff; font-family:monospace; margin-bottom:5px;">
                    📅 ${item.date} | 👤 ${item.author}
                </div>
                <h3 style="margin:5px 0; color:#fff;">${item.heading}</h3>
                <p style="margin:5px 0; color:#cbd5e1; font-size:0.9rem;">${item.content}</p>
                ${item.actionLink ? `<a href="${item.actionLink}" target="_blank" class="btn" style="background:#800020; color:#fff; padding:5px 10px; text-decoration:none; border-radius:3px; font-size:0.8rem;">🔗 ACCESS VECTOR</a>` : ''}
                <div class="admin-only-control">
                    <button onclick="deleteUpdate('${key}')" style="background:transparent; border:none; color:#ff3333; cursor:pointer; margin-top:10px; font-size:0.75rem;">[DELETE BROADCAST]</button>
                </div>
            `;
            feedContainer.appendChild(card);
        });
        if (typeof applyInterfaceClearance === "function") applyInterfaceClearance();
    }

    // 3. Secure Deploy Logic
    deployBtn.onclick = async () => {
        const title = document.getElementById('updateTitle').value.toUpperCase();
        const content = document.getElementById('updateBody').value;
        const link = document.getElementById('updateLink').value;
        
        if (!title || !content) return alert("Heading and Body are required.");

        const response = await fetch('/api/admin/updates', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-admin-token': localStorage.getItem('x-admin-token')
            },
            body: JSON.stringify({ 
                heading: title, 
                content, 
                actionLink: link 
            })
        });

        if (response.ok) {
            document.getElementById('updateTitle').value = '';
            document.getElementById('updateBody').value = '';
            document.getElementById('updateLink').value = '';
            fetchUpdates();
        } else {
            alert("Unauthorized: Only Admins can deploy updates.");
        }
    };

    // 4. Secure Delete Logic
    window.deleteUpdate = async (key) => {
        if (!confirm("Delete this broadcast?")) return;

        const response = await fetch(`/api/admin/updates/${key}`, {
            method: 'DELETE',
            headers: { 'x-admin-token': localStorage.getItem('x-admin-token') }
        });

        if (response.ok) {
            fetchUpdates();
        } else {
            alert("Access Denied: Unauthorized.");
        }
    };

    // Initialize
    fetchUpdates();
    // Optional: Refresh feed every 30 seconds
    setInterval(fetchUpdates, 30000);
});