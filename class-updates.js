document.addEventListener('DOMContentLoaded', async () => {
            const feedContainer = document.getElementById('updatesFeed');
            
            try {
                const response = await fetch('class-updates.json');
                if (!response.ok) throw new Error('Failed to retrieve news stream data payload.');
                
                const updates = await response.json();
                feedContainer.innerHTML = ''; // Clear loading notification
                
                if (updates.length === 0) {
                    feedContainer.innerHTML = '<p style="color: #cbd5e1; text-align: center; width:100%;">No broadcast directives logged in this cycle.</p>';
                    return;
                }

                // Render cards in reverse order so the newest items show up first
                updates.reverse().forEach(item => {
                    const card = document.createElement('div');
                    
                    // Set custom border highlights based on priority flags
                    let edgeColor = '#1c2541'; // Standard dark blue
                    if (item.category === 'critical') edgeColor = '#800020'; // Ox-blood
                    if (item.category === 'warn') edgeColor = '#ffcc00'; // Warning amber

                    card.className = 'features-list update-card';
                    card.style.borderColor = edgeColor;
                    card.style.textAlign = 'left'; // Align left for reading blocks cleanly

                    // Generate Image element block safely if image string exists
                    const imageMarkup = item.image ? 
                        `<img src="${item.image}" alt="Update Image" class="update-banner" style="width:100%; border-radius:8px; margin-bottom:15px; border:1px solid #1c2541;">` : '';

                    // Generate Action Button element block safely if link exists
                    const actionMarkup = item.actionLink ? 
                        `<a href="${item.actionLink}" target="_blank" class="btn" style="display:inline-block; margin-top:15px; background:#800020; color:#fff; padding:8px 16px; text-decoration:none; border-radius:4px; font-size:0.85rem; font-family:monospace;">🔗 ACCESS LINKED VECTOR</a>` : '';

                    card.innerHTML = `
                        <div class="update-meta" style="display:flex; justify-content:space-between; font-size:0.75rem; color:#00d4ff; font-family:monospace; margin-bottom:10px;">
                            <span>📅 ${item.date}</span>
                            <span>⏱️ ${item.time} WAT</span>
                        </div>
                        <h3 style="margin-top:0; color:#ffffff; font-size:1.3rem;">${item.heading}</h3>
                        ${imageMarkup}
                        <p style="font-size:0.9rem; line-height:1.5; color:#cbd5e1; margin:0;">${item.content}</p>
                        ${actionMarkup}
                    `;
                    
                    feedContainer.appendChild(card);
                });

            } catch (error) {
                console.error(error);
                feedContainer.innerHTML = '<p style="color: #800020; font-family: monospace; text-align:center; width:100%;">CRITICAL ERROR: Failed to isolate news feed vectors.</p>';
            }
        });