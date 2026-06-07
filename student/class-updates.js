

/**
 * CYB CRUISE GROUP — STUDENT BROADCAST RECEIVER
 * READ-ONLY INTERFACE
 */

document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('updatesFeed');

    // Live listener for real-time updates (Read-Only)
    database.ref('management/updates').on('value', (snapshot) => {
        const updates = snapshot.val();
        feedContainer.innerHTML = '';
        
        if (!updates) {
            feedContainer.innerHTML = '<p style="color:#cbd5e1; text-align:center;">No active broadcasts.</p>';
            return;
        }

        // Render updates in reverse chronological order
        Object.entries(updates).reverse().forEach(([key, item]) => {
            const card = document.createElement('div');
            card.className = 'features-list update-card';
            card.style.marginBottom = '20px';

            // Only display content (Admin buttons removed)
            card.innerHTML = `
                <div style="font-size:0.75rem; color:#00d4ff; font-family:monospace; margin-bottom:5px;">
                    📅 ${item.date} | 👤 ${item.author}
                </div>
                <h3 style="margin:5px 0; color:#fff;">${item.heading}</h3>
                <p style="margin:5px 0; color:#cbd5e1; font-size:0.9rem;">${item.content}</p>
                ${item.actionLink ? `<a href="${item.actionLink}" target="_blank" class="btn" style="background:#800020; color:#fff; padding:5px 10px; text-decoration:none; border-radius:3px; font-size:0.8rem;">🔗 ACCESS VECTOR</a>` : ''}
            `;
            feedContainer.appendChild(card);
        });
    });
});










