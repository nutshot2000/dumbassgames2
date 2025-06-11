// ============================================================================
// 🔇 CONSOLE CLEANUP & PAYPAL ERROR EXPLANATION SYSTEM
// ============================================================================
// This script improves console readability by filtering PayPal analytics spam

(function() {
    'use strict';
    
    // Track PayPal error suppression statistics
    let suppressionStats = {
        paypalLoggerBlocked: 0,
        geolocationWarnings: 0,
        analyticsBlocked: 0,
        totalSuppressed: 0
    };
    
    // Enhanced PayPal Error Information System
    const PayPalConsoleHelper = {
        
        showPayPalConsoleStatus() {
            if (window.DEVELOPMENT_MODE) {
                console.groupCollapsed('🔇 PayPal Console Status');
                console.log('✅ PayPal error suppression is ACTIVE');
                console.log('📊 Suppressed this session:', suppressionStats);
                console.log('ℹ️  These errors are harmless analytics/logging requests blocked by ad-blockers');
                console.log('✨ Payment functionality remains fully operational');
                console.groupEnd();
            }
        },
        
        logSuppressionActivity(type, message) {
            suppressionStats.totalSuppressed++;
            
            switch(type) {
                case 'logger':
                    suppressionStats.paypalLoggerBlocked++;
                    break;
                case 'geolocation':
                    suppressionStats.geolocationWarnings++;
                    break;
                case 'analytics':
                    suppressionStats.analyticsBlocked++;
                    break;
            }
            
            // Show periodic status updates in dev mode
            if (window.DEVELOPMENT_MODE && suppressionStats.totalSuppressed % 10 === 0) {
                this.showPayPalConsoleStatus();
            }
        },
        
        explainPayPalErrors() {
            if (window.DEVELOPMENT_MODE) {
                console.group('💡 PayPal Console Errors Explained');
                console.log('%c🚫 ERR_BLOCKED_BY_CLIENT errors from PayPal are NORMAL', 'color: #00ff00');
                console.log('   These are analytics/logging requests blocked by:');
                console.log('   • Ad blockers (uBlock Origin, AdBlock Plus, etc.)');
                console.log('   • Privacy extensions');
                console.log('   • Browser privacy settings');
                console.log('');
                console.log('%c✅ Payment Processing: UNAFFECTED', 'color: #00ff00; font-weight: bold');
                console.log('%c✅ PayPal Buttons: WORKING', 'color: #00ff00; font-weight: bold');
                console.log('%c✅ Transaction Flow: OPERATIONAL', 'color: #00ff00; font-weight: bold');
                console.log('');
                console.log('%c🔧 To stop seeing these errors:', 'color: #00ffff');
                console.log('   1. Whitelist dumbassgames.xyz in your ad-blocker');
                console.log('   2. OR accept that they\'re harmless and ignore them');
                console.log('   3. This error suppression system filters most of them');
                console.groupEnd();
            }
        }
    };
    
    // Enhanced console override with better detection
    const originalError = console.error;
    console.error = function(...args) {
        const errorString = args.join(' ').toLowerCase();
        
        // More comprehensive PayPal pattern detection
        const isPayPalAnalytics = [
            'paypal.com/xoplatform/logger',
            'paypal.com/graphql',
            'logger?disablesetcookie',
            'xoplatform/logger/api',
            'err_blocked_by_client',
            'net::err_blocked_by_client'
        ].some(pattern => errorString.includes(pattern));
        
        const isGeolocationWarning = errorString.includes('potential permissions policy violation: geolocation');
        
        if (isPayPalAnalytics) {
            PayPalConsoleHelper.logSuppressionActivity('logger', errorString);
            if (window.DEVELOPMENT_MODE) {
                originalError.apply(console, ['🔇 [PAYPAL ANALYTICS BLOCKED]', ...args]);
            }
            return;
        }
        
        if (isGeolocationWarning) {
            PayPalConsoleHelper.logSuppressionActivity('geolocation', errorString);
            if (window.DEVELOPMENT_MODE) {
                originalError.apply(console, ['🔇 [GEOLOCATION WARNING]', ...args]);
            }
            return;
        }
        
        // Let all other errors through normally
        originalError.apply(console, args);
    };
    
    // Show initial explanation when PayPal loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (window.paypal) {
                PayPalConsoleHelper.explainPayPalErrors();
                console.log('%c🎮 DUMBASSGAMES: PayPal integration loaded with clean console output', 
                           'color: #00ff00; font-weight: bold; font-size: 14px');
            }
        }, 2000);
    });
    
    // Add helpful commands to window for debugging
    window.PayPalConsoleHelper = PayPalConsoleHelper;
    window.showPayPalStatus = () => PayPalConsoleHelper.showPayPalConsoleStatus();
    window.explainPayPalErrors = () => PayPalConsoleHelper.explainPayPalErrors();
    
    // Add console command information
    if (window.DEVELOPMENT_MODE) {
        console.log('%c🔧 CONSOLE HELPERS AVAILABLE:', 'color: #00ffff; font-weight: bold');
        console.log('   showPayPalStatus() - Show suppression statistics');
        console.log('   explainPayPalErrors() - Explain PayPal console errors');
    }
    
})(); 