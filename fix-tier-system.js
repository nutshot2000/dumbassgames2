// =====================================
// 🛠️ TIER SYSTEM COMPREHENSIVE FIX
// =====================================

console.log('🔧 TIER SYSTEM FIX - Loading comprehensive fixes...');

// Add Firebase Connection Recovery System
class FirebaseConnectionManager {
    constructor() {
        this.connectionStatus = {
            firebase: false,
            firestore: false,
            auth: false
        };
        this.retryAttempts = 0;
        this.maxRetries = 3;
        this.retryDelay = 2000;
    }

    async testFirebaseConnection() {
        console.log('🔥 Testing Firebase connection...');
        
        try {
            // Test Firebase v11 SDK - check for the modular components
            if (window.firebaseAuth && window.firebaseDb && window.onAuthStateChanged) {
                this.connectionStatus.firebase = true;
                console.log('✅ Firebase v11 SDK loaded');
                
                // Test Auth connection
                const authTest = await this.testAuthConnection();
                this.connectionStatus.auth = authTest;
                
                // Test Firestore connection
                const firestoreTest = await this.testFirestoreConnection();
                this.connectionStatus.firestore = firestoreTest;
                
            } else {
                console.log('❌ Firebase v11 SDK not loaded properly');
                console.log('Debug - Available:', {
                    firebaseAuth: !!window.firebaseAuth,
                    firebaseDb: !!window.firebaseDb,
                    onAuthStateChanged: !!window.onAuthStateChanged
                });
                return false;
            }
            
            const allConnected = this.connectionStatus.firebase && 
                               this.connectionStatus.auth && 
                               this.connectionStatus.firestore;
                               
            console.log('🔥 Firebase Connection Status:', this.connectionStatus);
            return allConnected;
            
        } catch (error) {
            console.error('🔥 Firebase connection test failed:', error);
            return false;
        }
    }

    async testAuthConnection() {
        return new Promise((resolve) => {
            try {
                // Use the v11 SDK auth reference
                if (!window.firebaseAuth || !window.onAuthStateChanged) {
                    console.log('🔐 Firebase Auth SDK not available');
                    resolve(false);
                    return;
                }
                
                const unsubscribe = window.onAuthStateChanged(window.firebaseAuth,
                    (user) => {
                        console.log('🔐 Firebase Auth test:', user ? 'Connected' : 'No user');
                        unsubscribe();
                        resolve(true);
                    },
                    (error) => {
                        console.error('🔐 Firebase Auth error:', error);
                        unsubscribe();
                        resolve(false);
                    }
                );
                
                // Timeout after 5 seconds
                setTimeout(() => {
                    unsubscribe();
                    resolve(false);
                }, 5000);
                
            } catch (error) {
                console.error('🔐 Auth connection test failed:', error);
                resolve(false);
            }
        });
    }

    async testFirestoreConnection() {
        try {
            if (!window.firebaseDb || !window.firebaseGetDocs) {
                console.log('📄 Firestore not available');
                return false;
            }
            
            // Try to perform a simple read operation using v11 SDK
            const testCollection = window.firebaseCollection;
            const testDoc = await window.firebaseGetDocs(testCollection);
            console.log('📄 Firestore connection test: Success');
            return true;
            
        } catch (error) {
            console.error('📄 Firestore connection test failed:', error);
            
            // Check if it's a permission error (connection works but no permissions)
            if (error.code === 'permission-denied') {
                console.log('📄 Firestore connected but permission denied (this is OK)');
                return true;
            }
            
            return false;
        }
    }

    async attemptFirebaseRecovery() {
        console.log(`🔄 Attempting Firebase recovery (attempt ${this.retryAttempts + 1}/${this.maxRetries})`);
        
        this.retryAttempts++;
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        
        // Test connection again
        const connected = await this.testFirebaseConnection();
        
        if (connected) {
            console.log('✅ Firebase connection recovered!');
            this.retryAttempts = 0;
            return true;
        }
        
        if (this.retryAttempts < this.maxRetries) {
            return await this.attemptFirebaseRecovery();
        }
        
        console.log('❌ Firebase recovery failed after maximum retries');
        return false;
    }

    showConnectionIssueModal() {
        const modalHtml = `
            <div id="firebase-connection-modal" style="
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0,0,0,0.8); z-index: 10000; display: flex; 
                align-items: center; justify-content: center; font-family: 'Press Start 2P', monospace;
            ">
                <div style="
                    background: #0a0a0a; border: 2px solid #00ff00; padding: 20px; 
                    max-width: 500px; margin: 20px; color: #00ff00; text-align: center;
                    box-shadow: 0 0 20px #00ff00;
                ">
                    <h2 style="color: #ff0000; margin-bottom: 15px; font-size: 14px;">
                        🔥 CONNECTION ISSUE DETECTED
                    </h2>
                    <p style="font-size: 8px; line-height: 1.5; margin-bottom: 15px;">
                        Firebase is being blocked by your browser or ad-blocker. 
                        The tier system requires Firebase to function properly.
                    </p>
                    <div style="text-align: left; font-size: 6px; margin-bottom: 15px;">
                        <strong>Quick Fixes:</strong><br>
                        • Whitelist dumbassgames.xyz in your ad-blocker<br>
                        • Temporarily disable ad-blocker for this site<br>
                        • Check browser extensions blocking Firebase<br>
                        • Try incognito/private browsing mode
                    </div>
                    <button onclick="window.firebaseConnectionManager.retryConnection()" 
                            style="
                                background: #00ff00; color: #000; border: none; 
                                padding: 10px 20px; font-family: inherit; 
                                font-size: 8px; cursor: pointer; margin-right: 10px;
                            ">
                        RETRY CONNECTION
                    </button>
                    <button onclick="window.firebaseConnectionManager.closeModal()" 
                            style="
                                background: #ff0000; color: #fff; border: none; 
                                padding: 10px 20px; font-family: inherit; 
                                font-size: 8px; cursor: pointer;
                            ">
                        CONTINUE ANYWAY
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    async retryConnection() {
        const modal = document.getElementById('firebase-connection-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        const connected = await this.attemptFirebaseRecovery();
        
        if (!connected) {
            this.showConnectionIssueModal();
        } else {
            // Reload the page to reinitialize everything
            window.location.reload();
        }
    }

    closeModal() {
        const modal = document.getElementById('firebase-connection-modal');
        if (modal) {
            modal.remove();
        }
    }
}

// Initialize Firebase Connection Manager
window.firebaseConnectionManager = new FirebaseConnectionManager();

// Enhanced Firebase Connection Check
async function checkFirebaseConnectionRobust() {
    console.log('🔥 Running robust Firebase connection check...');
    
    const connected = await window.firebaseConnectionManager.testFirebaseConnection();
    
    if (!connected) {
        console.log('❌ Firebase connection failed - showing user guidance');
        window.firebaseConnectionManager.showConnectionIssueModal();
        return false;
    }
    
    console.log('✅ Firebase connection verified');
    return true;
}

// Global tier system diagnostics and fixes
window.tierSystemFix = {
    
    // 1. Diagnose current tier system state
    async diagnoseTierSystem() {
        console.log('🔍 DIAGNOSING TIER SYSTEM...');
        
        // First check Firebase connection robustly
        const firebaseConnected = await checkFirebaseConnectionRobust();
        
        const systemStatus = {
            userProfileManager: typeof window.userProfileManager !== 'undefined',
            tierManager: typeof window.userProfileManager?.tierManager !== 'undefined' || typeof window.tierManager !== 'undefined',
            paymentManager: typeof window.userProfileManager?.paymentManager !== 'undefined' || typeof window.paymentManager !== 'undefined',
            firebaseConnected: firebaseConnected,
            userSignedIn: window.firebaseAuth && window.firebaseAuth.currentUser !== null,
            currentUser: window.firebaseAuth ? window.firebaseAuth.currentUser : null
        };
        
        console.log('📊 System Status:', systemStatus);
        
        const issues = [];
        
        // Check for missing components
        if (!systemStatus.userProfileManager) issues.push('UserProfileManager not initialized');
        if (!systemStatus.tierManager) {
            // Check if TierManager exists in userProfileManager
            if (window.userProfileManager?.tierManager) {
                console.log('✅ TierManager found in userProfileManager');
            } else {
                issues.push('TierManager not found');
            }
        }
        if (!systemStatus.paymentManager) {
            // Check if PaymentManager exists in userProfileManager  
            if (window.userProfileManager?.paymentManager) {
                console.log('✅ PaymentManager found in userProfileManager');
            } else {
                issues.push('PaymentManager not initialized');
            }
        }
        if (!systemStatus.firebaseConnected) issues.push('Firebase not connected');
        
        // Check user state
        if (systemStatus.userSignedIn && systemStatus.currentUser) {
            const profile = window.userProfileManager.userProfile;
            console.log('👤 User Profile Check:', {
                email: profile.email,
                tier: profile.tier || 'FREE',
                submissionCount: profile.submissionCount,
                lastSubmission: profile.lastSubmission
            });
            
            // Check tier data integrity
            if (!profile.tier) {
                issues.push('User tier not set - defaulting to FREE');
                profile.tier = 'FREE';
            }
            
            if (!profile.submissionCount) {
                issues.push('Submission count not initialized');
                profile.submissionCount = { daily: 0, weekly: 0, monthly: 0 };
            }
        }
        
        if (issues.length > 0) {
            console.log('⚠️ Issues Found:', issues);
            return { healthy: false, issues, status: systemStatus };
        } else {
            console.log('✅ Tier system appears healthy');
            return { healthy: true, issues: [], status: systemStatus };
        }
    },
    
    // 2. Fix tier system initialization
    async fixTierSystemInit() {
        console.log('🔧 FIXING TIER SYSTEM INITIALIZATION...');
        
        // Ensure TierManager is properly initialized
        if (window.userProfileManager && !window.userProfileManager.tierManager) {
            console.log('🔧 Initializing missing TierManager...');
            window.userProfileManager.tierManager = new TierManager();
        }
        
        // Ensure PaymentManager is properly initialized
        if (window.userProfileManager && !window.userProfileManager.paymentManager) {
            console.log('🔧 Initializing missing PaymentManager...');
            window.userProfileManager.paymentManager = new PaymentManager();
            await window.userProfileManager.paymentManager.initializePayPal();
        }
        
        console.log('✅ Tier system initialization fixed');
    },
    
    // 3. Fix submission limit checking
    async fixSubmissionLimits() {
        console.log('🔧 FIXING SUBMISSION LIMIT CHECKING...');
        
        const userProfile = window.userProfileManager?.userProfile;
        if (!userProfile) {
            console.log('⚠️ No user profile found');
            return false;
        }
        
        // Initialize submission counts if missing
        if (!userProfile.submissionCount) {
            userProfile.submissionCount = { daily: 0, weekly: 0, monthly: 0 };
            console.log('🔧 Initialized submission counts');
        }
        
        // Get actual submissions from Firebase to sync counts
        try {
            const userSubmissions = window.userProfileManager?.userSubmissions || [];
            console.log(`📊 Found ${userSubmissions.length} total user submissions`);
            
            // Count submissions this month
            const now = new Date();
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            
            const thisMonthSubmissions = userSubmissions.filter(game => {
                const gameDate = new Date(game.dateAdded);
                return gameDate >= monthStart;
            });
            
            console.log(`📊 Found ${thisMonthSubmissions.length} submissions this month`);
            
            // Update the count to match reality
            userProfile.submissionCount.monthly = thisMonthSubmissions.length;
            
            if (thisMonthSubmissions.length > 0) {
                const lastSubmission = thisMonthSubmissions.sort((a, b) => 
                    new Date(b.dateAdded) - new Date(a.dateAdded)
                )[0];
                userProfile.lastSubmission = lastSubmission.dateAdded;
            }
            
            // Save the corrected profile
            if (window.persistenceManager) {
                await window.persistenceManager.saveUserProfile(userProfile);
                console.log('✅ Submission counts synchronized');
            }
            
            return true;
        } catch (error) {
            console.error('❌ Error fixing submission limits:', error);
            return false;
        }
    },
    
    // 4. Test tier limits
    async testTierLimits() {
        console.log('🧪 TESTING TIER LIMITS...');
        
        const tierManager = window.userProfileManager?.tierManager;
        const userProfile = window.userProfileManager?.userProfile;
        
        if (!tierManager || !userProfile) {
            console.log('❌ TierManager or user profile not available');
            return false;
        }
        
        // Test submission limit check
        const limitCheck = await tierManager.checkSubmissionLimits(userProfile);
        console.log('⏰ Submission Limit Check:', limitCheck);
        
        // Test can submit check
        const canSubmit = await tierManager.canSubmitGame(userProfile);
        console.log('🎮 Can Submit Game:', canSubmit);
        
        // Test favorites limit
        const favorites = window.userProfileManager?.userFavorites || [];
        const favoritesCheck = tierManager.checkFavoritesLimit(userProfile, favorites.length);
        console.log('❤️ Favorites Limit Check:', favoritesCheck);
        
        return { limitCheck, canSubmit, favoritesCheck };
    },
    
    // 5. Fix upgrade modal functionality
    fixUpgradeModal() {
        console.log('🔧 FIXING UPGRADE MODAL...');
        
        // Ensure upgrade modal exists
        const upgradeModal = document.getElementById('upgradeModal');
        if (!upgradeModal) {
            console.log('⚠️ Upgrade modal not found in DOM');
            return false;
        }
        
        // Test modal show/hide
        try {
            showUpgradeModal();
            setTimeout(() => hideUpgradeModal(), 1000);
            console.log('✅ Upgrade modal functionality working');
            return true;
        } catch (error) {
            console.error('❌ Upgrade modal error:', error);
            return false;
        }
    },
    
    // 6. Test PayPal integration
    async testPayPalIntegration() {
        console.log('🧪 TESTING PAYPAL INTEGRATION...');
        
        const paymentManager = window.userProfileManager?.paymentManager;
        if (!paymentManager) {
            console.log('❌ PaymentManager not found');
            return false;
        }
        
        // Check if PayPal SDK is loaded
        if (window.paypal) {
            console.log('✅ PayPal SDK loaded successfully');
            return true;
        } else {
            console.log('⚠️ PayPal SDK not loaded, attempting to initialize...');
            try {
                await paymentManager.initializePayPal();
                console.log('✅ PayPal initialization completed');
                return true;
            } catch (error) {
                console.error('❌ PayPal initialization failed:', error);
                return false;
            }
        }
    },
    
    // 7. Manual tier upgrade (for testing)
    async forceUpgradeUser(targetTier) {
        console.log(`🚀 FORCE UPGRADING USER TO ${targetTier}...`);
        
        const userProfile = window.userProfileManager?.userProfile;
        if (!userProfile) {
            console.log('❌ No user profile found');
            return false;
        }
        
        // Set new tier
        userProfile.tier = targetTier;
        userProfile.upgradeDate = new Date().toISOString();
        
        // Reset submission counts for new tier
        userProfile.submissionCount = { daily: 0, weekly: 0, monthly: 0 };
        
        try {
            // Save to Firebase
            if (window.persistenceManager) {
                await window.persistenceManager.saveUserProfile(userProfile);
            }
            
            // Update UI
            if (window.userProfileManager) {
                window.userProfileManager.updateProfileUI();
                window.userProfileManager.updateTierDisplay();
            }
            
            console.log(`✅ User successfully upgraded to ${targetTier}`);
            return true;
        } catch (error) {
            console.error('❌ Upgrade failed:', error);
            return false;
        }
    },
    
    // 8. Reset user to FREE tier (for testing)
    async resetUserToFree() {
        console.log('🔄 RESETTING USER TO FREE TIER...');
        
        const userProfile = window.userProfileManager?.userProfile;
        if (!userProfile) {
            console.log('❌ No user profile found');
            return false;
        }
        
        // Reset to FREE tier
        userProfile.tier = 'FREE';
        userProfile.submissionCount = { daily: 0, weekly: 0, monthly: 0 };
        delete userProfile.upgradeDate;
        delete userProfile.subscriptionId;
        
        try {
            // Save to Firebase
            if (window.persistenceManager) {
                await window.persistenceManager.saveUserProfile(userProfile);
            }
            
            // Update UI
            if (window.userProfileManager) {
                window.userProfileManager.updateProfileUI();
                window.userProfileManager.updateTierDisplay();
            }
            
            console.log('✅ User reset to FREE tier');
            return true;
        } catch (error) {
            console.error('❌ Reset failed:', error);
            return false;
        }
    },
    
    // 9. Comprehensive tier system fix
    async runComprehensiveFix() {
        console.log('🛠️ RUNNING COMPREHENSIVE TIER SYSTEM FIX...');
        
        const results = {};
        
        // Step 1: Diagnose
        results.diagnosis = await this.diagnoseTierSystem();
        
        // Step 2: Fix initialization
        await this.fixTierSystemInit();
        results.initFixed = true;
        
        // Step 3: Fix submission limits
        results.submissionLimitsFixed = await this.fixSubmissionLimits();
        
        // Step 4: Test limits
        results.limitTests = await this.testTierLimits();
        
        // Step 5: Fix upgrade modal
        results.upgradeModalFixed = this.fixUpgradeModal();
        
        // Step 6: Test PayPal
        results.paypalWorking = await this.testPayPalIntegration();
        
        console.log('📊 COMPREHENSIVE FIX RESULTS:', results);
        
        // Summary
        const allGood = results.submissionLimitsFixed && 
                       results.upgradeModalFixed && 
                       results.paypalWorking;
        
        if (allGood) {
            console.log('🎉 TIER SYSTEM FULLY FUNCTIONAL!');
            window.notificationManager?.showSuccess('🎉 Tier system fixed and working perfectly!');
        } else {
            console.log('⚠️ Some issues remain - check the results above');
            window.notificationManager?.showWarning('⚠️ Tier system partially fixed - some issues remain');
        }
        
        return results;
    }
};

// Auto-run diagnostics
document.addEventListener('DOMContentLoaded', function() {
    // Wait for all systems to load, then run diagnostics
    setTimeout(async () => {
        if (window.userProfileManager) {
            console.log('🔧 Auto-running tier system diagnostics...');
            await window.tierSystemFix.diagnoseTierSystem();
        }
    }, 3000);
});

// Add global helper functions for easy console access
window.fixTiers = () => window.tierSystemFix.runComprehensiveFix();
window.diagnoseTiers = () => window.tierSystemFix.diagnoseTierSystem();
window.testTierLimits = () => window.tierSystemFix.testTierLimits();
window.upgradeToPro = () => window.tierSystemFix.forceUpgradeUser('PRO');
window.upgradeToDev = () => window.tierSystemFix.forceUpgradeUser('DEV');
window.resetToFree = () => window.tierSystemFix.resetUserToFree();

console.log('✅ TIER SYSTEM FIX LOADED - Use these console commands:');
console.log('  fixTiers() - Run comprehensive fix');
console.log('  diagnoseTiers() - Check system health');
console.log('  testTierLimits() - Test limit checking');
console.log('  upgradeToPro() - Force upgrade to PRO');
console.log('  upgradeToDev() - Force upgrade to DEV');
console.log('  resetToFree() - Reset to FREE tier');

// Enhanced submission count synchronization and limit enforcement
async function fixSubmissionCountSync() {
    console.log('🔧 FIXING SUBMISSION COUNT SYNCHRONIZATION...');
    
    try {
        // Use the v9 Firebase SDK references
        const auth = window.firebaseAuth;
        const firestore = window.firebaseDb;
        
        if (!auth || !auth.currentUser) {
            console.log('❌ No authenticated user found');
            console.log('Debug - Auth available:', !!auth, 'Current user:', !!auth?.currentUser);
            return { success: false, error: 'Not authenticated' };
        }

        const userEmail = auth.currentUser.email;
        const userId = auth.currentUser.uid;

        console.log(`🔍 Checking submissions for user: ${userEmail} (${userId})`);

        // 1. Get actual games from Firebase submitted by this user (using v11 SDK)
        const gamesQuery = window.firebaseQuery(
            window.firebaseCollection,
            window.firebaseWhere('submittedBy', '==', userId)
        );
        const userGamesSnapshot = await window.firebaseGetDocs(gamesQuery);
        const actualSubmissions = userGamesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            submittedAt: doc.data().submittedAt?.toDate() || new Date()
        }));

        console.log(`📊 Found ${actualSubmissions.length} actual submissions in Firebase`);
        
        // 2. Count submissions by time period
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const monthlySubmissions = actualSubmissions.filter(game => 
            new Date(game.submittedAt) >= startOfMonth
        ).length;

        const weeklySubmissions = actualSubmissions.filter(game => 
            new Date(game.submittedAt) >= startOfWeek
        ).length;

        const dailySubmissions = actualSubmissions.filter(game => 
            new Date(game.submittedAt) >= startOfDay
        ).length;

        console.log(`📊 Actual submission counts: Monthly: ${monthlySubmissions}, Weekly: ${weeklySubmissions}, Daily: ${dailySubmissions}`);

        // 3. Update user profile with correct counts
        const correctedProfile = {
            ...window.userProfileManager.currentProfile,
            submissionCount: {
                total: actualSubmissions.length,
                monthly: monthlySubmissions,
                weekly: weeklySubmissions,
                daily: dailySubmissions,
                lastReset: {
                    monthly: startOfMonth.toISOString(),
                    weekly: startOfWeek.toISOString(),
                    daily: startOfDay.toISOString()
                }
            },
            lastSubmission: actualSubmissions.length > 0 ? 
                actualSubmissions.sort((a, b) => b.submittedAt - a.submittedAt)[0].submittedAt.toISOString() : null
        };

        // 4. Update and save corrected profile
        window.userProfileManager.userProfile = correctedProfile;
        await window.userProfileManager.saveProfile();
        console.log('✅ Submission counts corrected and saved');

        // 5. Test current tier limits
        const tierManager = window.userProfileManager?.tierManager;
        if (!tierManager) {
            console.log('⚠️ TierManager not available, using default limits');
            return {
                success: true,
                actualSubmissions: actualSubmissions.length,
                monthlySubmissions,
                tierLimits: { submissionsPerMonth: 2 }, // FREE tier default
                isOverLimit: monthlySubmissions >= 2,
                remainingSubmissions: Math.max(0, 2 - monthlySubmissions)
            };
        }
        
        // Get current tier from user profile
        const userTier = correctedProfile.tier || 'FREE';
        const tierInfo = tierManager.getTierInfo(userTier);
        const tierLimits = tierInfo.limits;
        
        console.log(`🎯 Current tier: ${userTier}, Monthly limit: ${tierLimits.submissionsPerMonth}`);
        console.log(`📊 Current monthly submissions: ${monthlySubmissions}/${tierLimits.submissionsPerMonth}`);

        // 6. Check if user is over limit
        const isOverLimit = monthlySubmissions >= tierLimits.submissionsPerMonth;
        
        if (isOverLimit) {
            console.log('🚫 USER IS OVER MONTHLY SUBMISSION LIMIT!');
            console.log('💎 Future submissions should now be blocked');
        } else {
            console.log(`✅ User has ${tierLimits.submissionsPerMonth - monthlySubmissions} submissions remaining this month`);
        }

        return {
            success: true,
            actualSubmissions: actualSubmissions.length,
            monthlySubmissions,
            tierLimits,
            isOverLimit,
            remainingSubmissions: Math.max(0, tierLimits.submissionsPerMonth - monthlySubmissions)
        };

    } catch (error) {
        console.error('❌ Error fixing submission count sync:', error);
        return { success: false, error: error.message };
    }
}

// Enhanced limit checking function that forces a recount
async function testSubmissionLimitWithRecount() {
    console.log('🧪 TESTING SUBMISSION LIMITS WITH FRESH COUNT...');
    
    // First, sync the counts
    const syncResult = await fixSubmissionCountSync();
    
    if (!syncResult.success) {
        console.log('❌ Could not sync submission counts');
        return { success: false };
    }

    // Now test the limit checking with the user profile
    const tierManager = window.userProfileManager?.tierManager;
    const userProfile = window.userProfileManager?.userProfile;
    const canSubmit = tierManager && userProfile ? await tierManager.checkSubmissionLimits(userProfile) : null;
    console.log('🎮 Can Submit Check Result:', canSubmit);

    if (canSubmit.allowed && syncResult.isOverLimit) {
        console.log('🚨 CRITICAL BUG: System says can submit but user is over limit!');
        console.log('🔧 This means the limit checking is not using the corrected counts');
    } else if (!canSubmit.allowed && !syncResult.isOverLimit) {
        console.log('⚠️ System blocking submission but user is not over limit');
    } else {
        console.log('✅ Limit checking appears to be working correctly');
    }

    return {
        success: true,
        syncResult,
        canSubmit,
        limitCheckingWorking: canSubmit.allowed === !syncResult.isOverLimit
    };
}

// Add to global commands
window.fixSubmissionSync = fixSubmissionCountSync;
window.testSubmissionLimitsWithRecount = testSubmissionLimitWithRecount; 