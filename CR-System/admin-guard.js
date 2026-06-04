// // Hardcoded Admin Vector Configuration (Keep these secure)

// Hardcoded Admin Vector Configuration (Base64 Reg Numbers)
const ADMIN_REG_NUMBERS = [
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

        
        
function verifyAdminClearance() {
    const activeUserReg = localStorage.getItem('cruise_user_reg'); // Base64 student token
    const adminToken = localStorage.getItem('cruise_admin_token');
    const scrambledAdminTime = localStorage.getItem('cruise_admin_time');
    
    const currentPath = window.location.pathname;
    const onGatePage = currentPath.endsWith('admin-gate.html');
    
    // Constant Lifespan Configuration: 3 Days in Milliseconds
    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

    // 1. Roster Clearance Level Check: If not an approved user, kick back to student portal instantly
    if (!ADMIN_REG_NUMBERS.includes(activeUserReg)) {
        alert("CRITICAL WARNING: Unauthorized administration sector access routing detected.");
        window.location.href = '/Home.html';
        return false;
    }

    // 2. Token Integrity Check: If keys are missing, send to passphrase gate if not already there
    if (!adminToken || !scrambledAdminTime) {
        if (!onGatePage) {
            window.location.href = 'admin-gate.html';
        }
        return false;
    }

    try {
        // 3. Expiration Math Engine: Unscramble and calculate age of the current admin session
        const decodedAdminTime = parseInt(atob(scrambledAdminTime));
        const sessionAge = Date.now() - decodedAdminTime;

        if (sessionAge > THREE_DAYS_MS) {
            // Admin token lifecycle has ended. Evict session metrics.
            localStorage.removeItem('cruise_admin_token');
            localStorage.removeItem('cruise_admin_time');
            
            alert("🔒 SECURITY PROTOCOL: Administrative session has expired after 3 days. Please re-authenticate.");
            window.location.href = 'admin-gate.html';
            return false;
        }

        // 4. Bypass Gate: If valid token exists and user is sitting on admin-gate.html, skip directly inside
        if (onGatePage) {
            window.location.href = 'admin-dashboard.html';
        }
        return true;

    } catch (error) {
        // Fallback catch: If someone tampers with the timestamp text format, trigger instant wipe
        localStorage.removeItem('cruise_admin_token');
        localStorage.removeItem('cruise_admin_time');
        window.location.href = 'admin-gate.html';
        return false;
    }
}

// Fire the authorization sequence immediately
verifyAdminClearance();







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

function verifyAdminClearance() {
   const activeUserReg = localStorage.getItem('cruise_user_reg'); // Already Base64 from login
    const adminSessionActive = sessionStorage.getItem('admin_session_validated');

//     // 1. Check if the logged-in user is on the approved admin roster list
//     if (!ADMIN_REG_NUMBERS.includes(activeUserReg)) {
//         alert("CRITICAL WARNING: Unauthorized route access detected. Incident logged.");
//         window.location.href = '/Home.html';
//         return false;
//     }

    // 2. If they are an admin but haven't solved the passphrase challenge this session, boot them to the challenge form
   if (!adminSessionActive && !window.location.pathname.endsWith('admin-gate.html')) {
       window.location.href = 'admin-gate.html';
      return false;
      }
     return true;
 }
 
verifyAdminClearance();
