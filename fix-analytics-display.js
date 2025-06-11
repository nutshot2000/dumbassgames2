// Fix for Analytics Tab Display Issue
// This ensures the analytics content shows when the tab is clicked

(function() {
    'use strict';
    
    console.log('🔧 Loading analytics display fix...');
    
    // Override the tab switching to force analytics display
    function forceAnalyticsDisplay() {
        const analyticsTab = document.getElementById('analyticsTab');
        if (analyticsTab) {
            // Force display the content
            analyticsTab.style.display = 'block';
            analyticsTab.style.visibility = 'visible';
            analyticsTab.style.opacity = '1';
            analyticsTab.classList.add('active-tab');
            console.log('✅ Forced analytics tab to display');
        }
    }
    
    // Monitor for analytics tab clicks
    function setupAnalyticsTabMonitor() {
        const analyticsTabButton = document.querySelector('[data-tab="analytics"]');
        if (analyticsTabButton) {
            analyticsTabButton.addEventListener('click', function() {
                setTimeout(forceAnalyticsDisplay, 50);
                setTimeout(forceAnalyticsDisplay, 200);
                console.log('📊 Analytics tab clicked - forcing display');
            });
            console.log('✅ Analytics tab monitor setup');
        } else {
            setTimeout(setupAnalyticsTabMonitor, 500);
        }
    }
    
    // Also monitor for when the profile modal opens
    function monitorProfileModal() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'style' && 
                    mutation.target.id === 'userProfileModal') {
                    const modal = mutation.target;
                    if (modal.style.display === 'block') {
                        // Profile modal opened, check if user is DEV and setup analytics
                        setTimeout(() => {
                            const currentTab = document.querySelector('.profile-tab.active');
                            if (currentTab && currentTab.dataset.tab === 'analytics') {
                                forceAnalyticsDisplay();
                            }
                        }, 300);
                    }
                }
            });
        });
        
        const modal = document.getElementById('userProfileModal');
        if (modal) {
            observer.observe(modal, { attributes: true });
            console.log('✅ Profile modal monitor setup');
        }
    }
    
    // Global function to manually fix analytics display
    window.fixAnalyticsDisplay = function() {
        forceAnalyticsDisplay();
        // Also load analytics data
        if (window.refreshAnalytics) {
            window.refreshAnalytics();
        }
        return '✅ Analytics display fixed and refreshed!';
    };
    
    // Start monitoring when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        setupAnalyticsTabMonitor();
        monitorProfileModal();
    });
    
    // If DOM already loaded, start immediately
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setupAnalyticsTabMonitor();
        monitorProfileModal();
    }
    
    console.log('✅ Analytics display fix loaded!');
})(); 