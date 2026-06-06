// // Hardcoded Admin Vector Configuration (Keep these secure)

// Hardcoded Admin Vector Configuration (Base64 Reg Numbers)
const AUTHORIZED_ADMINS = [
            btoa("20241470772"), // Replace with your actual Reg Number (Obfuscated)
            //fabian codes
        
            btoa("20241436322"),  // Replace with the CR's actual Reg Number (Obfuscated)
            //kenneth CR
        
            btoa("20241439172"), // Replace with the CR's actual Reg Number (Obfuscated)
            //PraiseGod assistant CR 2
        
            btoa("20241434552"),  // Replace with the CR's actual Reg Number (Obfuscated)
            //VFM assistant CR 1
        
            btoa("20241440712")  // Replace with the CR's actual Reg Number (Obfuscated)
            //Mac-clinton exchange
        ];
        
        
       const ADMIN_PASSPHRASE_HASH = " 6a24503fc9856b0a28d17f85b2b89a2d8465ed27a293c8a9b2967097117caa4d" ; // Placeholder hash

        
        
// 2. DEFINE THE MISSING FUNCTION GLOBALLY
function checkClearanceLevel() {
    const userSessionReg = localStorage.getItem('cruise_user_reg'); // Level-1 gateway token
    const adminSessionToken = localStorage.getItem('cruise_admin_token'); // 3-day token
    const adminSessionTime = localStorage.getItem('cruise_admin_time');
    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

    // Check condition A: Do they have an active, non-expired Admin session ticket?
    if (adminSessionToken && adminSessionTime) {
        try {
            const loginTime = parseInt(atob(adminSessionTime));
            const sessionAge = Date.now() - loginTime;

            if (sessionAge < THREE_DAYS_MS) {
                // Check condition B: Does their registration match the authorized CR list?
                if (AUTHORIZED_ADMINS.includes(userSessionReg)) {
                    return 'WRITE_ACCESS'; // Full admin CRUD control unlocked
                }
            }
        } catch (error) {
            console.error("Security Core: Session string corruption detected.", error);
        }
    }

    // Fallback condition C: Are they logged in as a regular student?
    if (userSessionReg) {
        return 'READ_ONLY'; // Let them look at lists, hide inputs/delete keys
    }

    // Default: Not logged in at all
    return 'UNAUTHORIZED';
}

// 3. AUTOMATED INTERFACE PRUNING FOR STUDENTS
function applyInterfaceClearance() {
    const clearance = checkClearanceLevel();

    if (clearance === 'UNAUTHORIZED') {
        alert("🔒 SECURITY HANDSHAKE FAILED: Redirecting to Gateway...");
        window.location.href = 'index.html';
        return;
    }

    if (clearance === 'READ_ONLY') {
        document.addEventListener("DOMContentLoaded", () => {
            // Target any structural admin panels, input fields, or action buttons
            const adminInputsAndButtons = document.querySelectorAll('.admin-only-control, input, button:not(#pwaInstallBtn), th.actions-col, td.actions-col');
            
            adminInputsAndButtons.forEach(element => {
                element.style.display = 'none';
            });

            // Inject a clean, professional status banner at the top of the viewport
            if (!document.getElementById('readOnlyNotice')) {
                const badge = document.createElement('div');
                badge.id = "readOnlyNotice";
                badge.innerHTML = "👁️ CLASS MANAGEMENT SYSTEM — LIVE SYSTEM VIEW (READ ONLY)";
                badge.style = "background: rgba(0, 212, 255, 0.08); color: #00d4ff; border: 1px solid rgba(0, 212, 255, 0.3); padding: 10px; text-align: center; font-size: 0.8rem; font-family: monospace; letter-spacing: 1px; font-weight: bold; margin-bottom: 20px; border-radius: 6px; box-shadow: 0 0 10px rgba(0,212,255,0.1);";
                document.body.insertBefore(badge, document.body.firstChild);
            }
        });
    }
}

// Execute interface shielding checking immediately upon page initialization
applyInterfaceClearance();






// const ADMIN_REG_NUMBERS = [
//     btoa("20241470772"), // Replace with your actual Reg Number (Obfuscated)
//     //fabian codes
    
//     btoa("20241436322"),  // Replace with the CR's actual Reg Number (Obfuscated)
//     //kenneth CR
    
//     btoa("20241439172"), // Replace with the CR's actual Reg Number (Obfuscated)
//     //PraiseGod assistant CR 2
    
//     btoa("20241434552"),  // Replace with the CR's actual Reg Number (Obfuscated)
//     //VFM assistant CR 1
    
//     btoa("20241440712")  // Replace with the CR's actual Reg Number (Obfuscated)
//     //Mac-clinton exchange
// ];

// // SHA-256 Hash of the administrative secret passphrase 
// // Example: If passphrase is "CYB_REPS_MATRIX_2026", hash it first.
// const ADMIN_PASSPHRASE_HASH = " 6a24503fc9856b0a28d17f85b2b89a2d8465ed27a293c8a9b2967097117caa4d" ; // Placeholder hash

// function verifyAdminClearance() {
//    const activeUserReg = localStorage.getItem('cruise_user_reg'); // Already Base64 from login
//     const adminSessionActive = sessionStorage.getItem('admin_session_validated');

// //     // 1. Check if the logged-in user is on the approved admin roster list
// //     if (!ADMIN_REG_NUMBERS.includes(activeUserReg)) {
// //         alert("CRITICAL WARNING: Unauthorized route access detected. Incident logged.");
// //         window.location.href = '/Home.html';
// //         return false;
// //     }

//     // 2. If they are an admin but haven't solved the passphrase challenge this session, boot them to the challenge form
//    if (!adminSessionActive && !window.location.pathname.endsWith('admin-gate.html')) {
//        window.location.href = 'admin-gate.html';
//       return false;
//       }
//      return true;
//  }
 
// verifyAdminClearance();
