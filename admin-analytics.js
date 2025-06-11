// DUMBASSGAMES - Admin Analytics Extension for DEV Tier
// Safe extension that adds analytics methods without touching main script

(function() {
    'use strict';
    
    // Wait for admin system to be ready
    function addAnalyticsMethods() {
        if (!window.dumbassGameAdmin) {
            setTimeout(addAnalyticsMethods, 100);
            return;
        }
        
        console.log('📊 Adding DEV Analytics to Admin System...');
        
        // Add analytics methods to existing admin object
        window.dumbassGameAdmin.getTotalGames = () => {
            if (window.enhancedGameManager?.games) {
                return window.enhancedGameManager.games.length;
            }
            return 0;
        };
        
        window.dumbassGameAdmin.getTotalUsers = async () => {
            try {
                if (window.firebaseCollection && window.firebaseDb && window.firebaseGetDocs) {
                    const usersQuery = window.firebaseCollection(window.firebaseDb, 'users');
                    const usersSnapshot = await window.firebaseGetDocs(usersQuery);
                    return usersSnapshot.size;
                }
                return 1; // At least the current user
            } catch (error) {
                console.warn('Could not fetch user count:', error);
                return 1; // Fallback to current user
            }
        };
        
        window.dumbassGameAdmin.getAnalyticsData = async () => {
            try {
                const totalGames = window.dumbassGameAdmin.getTotalGames();
                const totalUsers = await window.dumbassGameAdmin.getTotalUsers();
                const currentUserTier = window.userProfileManager?.userProfile?.tier || 'FREE';
                
                const analytics = {
                    games: {
                        total: totalGames,
                        approved: totalGames, // All visible games are approved
                        pending: 0 // TODO: Add pending games collection
                    },
                    users: {
                        total: totalUsers,
                        active: totalUsers, // Assume all users are active
                        tiers: {
                            FREE: Math.max(0, totalUsers - 1),
                            PRO: 0,
                            DEV: 1 // Current user
                        }
                    },
                    platform: {
                        version: '2.1',
                        uptime: (performance.now() / 1000).toFixed(2) + 's',
                        loadTime: performance.timing ? 
                            (performance.timing.loadEventEnd - performance.timing.navigationStart) + 'ms' : 
                            'Unknown'
                    }
                };

                console.group('%c📊 DEV ANALYTICS DASHBOARD', 'color: #00ffff; font-weight: bold; font-size: 16px;');
                console.log('%c🎮 GAMES:', 'color: #00ff00; font-weight: bold;');
                console.log('  Total Games:', analytics.games.total);
                console.log('  Approved Games:', analytics.games.approved);
                console.log('  Pending Approval:', analytics.games.pending);
                console.log('%c👥 USERS:', 'color: #00ff00; font-weight: bold;');
                console.log('  Total Users:', analytics.users.total);
                console.log('  Active Users:', analytics.users.active);
                console.log('  User Tiers:', analytics.users.tiers);
                console.log('%c🌍 PLATFORM:', 'color: #00ff00; font-weight: bold;');
                console.log('  Version:', analytics.platform.version);
                console.log('  Uptime:', analytics.platform.uptime);
                console.log('  Load Time:', analytics.platform.loadTime);
                console.groupEnd();

                return analytics;
            } catch (error) {
                console.error('❌ Failed to fetch analytics:', error);
                return { error: 'Failed to fetch analytics data' };
            }
        };
        
        window.dumbassGameAdmin.refreshAnalytics = async () => {
            const analytics = await window.dumbassGameAdmin.getAnalyticsData();
            if (analytics.error) {
                return '❌ Failed to refresh analytics';
            }
            
            // Update analytics UI if visible
            try {
                const analyticsTab = document.getElementById('analyticsTab');
                if (analyticsTab && analyticsTab.style.display !== 'none') {
                    // Update the numbers in the UI
                    const totalGamesEl = document.querySelector('.analytics-stats .stat-number');
                    if (totalGamesEl) {
                        totalGamesEl.textContent = analytics.games.total;
                    }
                }
            } catch (error) {
                console.warn('Could not update analytics UI:', error);
            }
            
            return '✅ Analytics refreshed! Check console for latest data.';
        };
        
        console.log('✅ DEV Analytics methods added to admin system!');
        console.log('📊 Try: dumbassGameAdmin.getAnalyticsData()');
    }
    
    // Start the extension
    addAnalyticsMethods();
})(); 