// 🎮 DUMBASSGAMES - Production Console Management & PayPal Error Suppression
// ===== DEVELOPMENT MODE CONFIGURATION =====
window.DEVELOPMENT_MODE = false; // Set to true for debug output

const originalConsole = { ...console };

// PayPal Analytics Error Suppression System
const PayPalErrorSuppressor = {
    originalConsoleError: console.error,
    
    init() {
        // Override console.error to filter PayPal analytics/logging errors
        console.error = (...args) => {
            const errorMessage = args.join(' ').toLowerCase();
            
            // Skip PayPal analytics and logging errors that don't affect functionality
            const paypalAnalyticsPatterns = [
                'paypal.com/xoplatform/logger',
                'paypal.com/graphql', 
                'err_blocked_by_client',
                'net::err_blocked_by_client',
                'logger?disablesetcookie',
                'xoplatform/logger/api',
                'potential permissions policy violation: geolocation',
                'paypal.*logger.*blocked',
                'paypal.*analytics.*blocked'
            ];
            
            const shouldSuppress = paypalAnalyticsPatterns.some(pattern => 
                errorMessage.includes(pattern)
            );
            
            if (!shouldSuppress) {
                this.originalConsoleError.apply(console, args);
            } else if (window.DEVELOPMENT_MODE) {
                // In dev mode, show suppressed errors with a prefix
                this.originalConsoleError.apply(console, ['[🔇 SUPPRESSED PayPal Analytics]', ...args]);
            }
        };
        
        // Use console.log since console.status isn't defined yet
        console.log('%c🔇 PayPal analytics error suppression enabled', 'color: #00ff00; font-weight: bold;');
        
        // Add a subtle status indicator for users
        this.addStatusIndicator();
    },
    
    addStatusIndicator() {
        // Add a small, unobtrusive indicator that PayPal error suppression is active
        const indicator = document.createElement('div');
        indicator.id = 'paypal-suppression-indicator';
        indicator.innerHTML = '🔇';
        indicator.title = 'PayPal analytics errors are being filtered for cleaner console output. Payment functionality is normal.';
        indicator.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            padding: 5px;
            border-radius: 50%;
            font-size: 12px;
            z-index: 1000;
            cursor: help;
            opacity: 0.3;
            transition: opacity 0.3s ease;
        `;
        
        indicator.addEventListener('mouseenter', () => {
            indicator.style.opacity = '1';
        });
        
        indicator.addEventListener('mouseleave', () => {
            indicator.style.opacity = '0.3';
        });
        
        // Only show in development mode or if there are suppressed errors
        if (window.DEVELOPMENT_MODE) {
            document.body.appendChild(indicator);
        }
    }
};

// Initialize PayPal error suppression immediately
PayPalErrorSuppressor.init();

// Also suppress network error events that don't affect functionality
window.addEventListener('error', (event) => {
    const errorMessage = (event.message || '').toLowerCase();
    const sourceUrl = (event.filename || '').toLowerCase();
    
    const shouldSuppressNetworkError = [
        'paypal.com/xoplatform/logger',
        'logger?disablesetcookie',
        'xoplatform/logger/api',
        'net::err_blocked_by_client'
    ].some(pattern => errorMessage.includes(pattern) || sourceUrl.includes(pattern));
    
    if (shouldSuppressNetworkError) {
        event.preventDefault();
        event.stopPropagation();
        if (window.DEVELOPMENT_MODE) {
            console.log('[🔇 SUPPRESSED Network Error]', event.message, event.filename);
        }
    }
}, true);

if (!window.DEVELOPMENT_MODE) {
    // Override console methods in production (but keep our enhanced error handler)
    console.log = () => {};
    console.debug = () => {};
    console.info = originalConsole.info; // Keep info
    console.warn = originalConsole.warn; // Keep warnings
    // console.error is already overridden by PayPalErrorSuppressor
    
    // Add production-safe logging
    console.prod = () => {};
    console.status = (msg, ...args) => originalConsole.log(`%c${msg}`, 'color: #00ff00; font-weight: bold;', ...args);
    console.critical = (msg, ...args) => originalConsole.log(`%c${msg}`, 'color: #ff6600; font-weight: bold;', ...args);
} else {
    console.prod = originalConsole.log;
    console.status = originalConsole.log;
    console.critical = originalConsole.log;
}

// Make PayPal error suppressor available globally for debugging
window.PayPalErrorSuppressor = PayPalErrorSuppressor;

// Theme Customizer System
class ThemeCustomizer {
    constructor() {
        this.defaultColors = {
            primary: '#00ff00',
            secondary: '#00ffff'
        };
        this.loadSavedTheme();
    }

    async loadSavedTheme() {
        try {
            // Wait for persistence manager if it's not ready
            if (!window.persistenceManager) {
                console.status('🎨 Waiting for persistence manager...');
                await new Promise(resolve => {
                    const checkManager = () => {
                        if (window.persistenceManager) {
                            resolve();
                        } else {
                            setTimeout(checkManager, 100);
                        }
                    };
                    checkManager();
                });
            }
            
            const savedTheme = await window.persistenceManager.loadTheme();
            if (savedTheme) {
                this.applyColors(savedTheme.primary, savedTheme.secondary);
                this.updatePickerValues(savedTheme.primary, savedTheme.secondary);
            } else {
                // Apply default colors and ensure alpha variants are set
                this.applyColors(this.defaultColors.primary, this.defaultColors.secondary);
            }
        } catch (error) {
            console.warn('🎨 Failed to load theme, using defaults:', error);
            this.applyColors(this.defaultColors.primary, this.defaultColors.secondary);
        }
    }

    applyColors(primary, secondary) {
        document.documentElement.style.setProperty('--primary-color', primary);
        document.documentElement.style.setProperty('--secondary-color', secondary);
        
        // Update alpha variants dynamically
        const primaryRGB = this.hexToRgb(primary);
        const secondaryRGB = this.hexToRgb(secondary);
        
        if (primaryRGB) {
            document.documentElement.style.setProperty('--primary-alpha-02', `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.02)`);
            document.documentElement.style.setProperty('--primary-alpha-05', `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.05)`);
            document.documentElement.style.setProperty('--primary-alpha-1', `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.1)`);
            document.documentElement.style.setProperty('--primary-alpha-15', `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.15)`);
            document.documentElement.style.setProperty('--primary-alpha-2', `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.2)`);
            document.documentElement.style.setProperty('--primary-alpha-3', `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.3)`);
            document.documentElement.style.setProperty('--primary-alpha-4', `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.4)`);
            document.documentElement.style.setProperty('--primary-alpha-5', `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.5)`);
            document.documentElement.style.setProperty('--primary-alpha-6', `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.6)`);
            document.documentElement.style.setProperty('--primary-alpha-7', `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.7)`);
            document.documentElement.style.setProperty('--primary-alpha-8', `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.8)`);
        }
        
        if (secondaryRGB) {
            document.documentElement.style.setProperty('--secondary-alpha-05', `rgba(${secondaryRGB.r}, ${secondaryRGB.g}, ${secondaryRGB.b}, 0.05)`);
            document.documentElement.style.setProperty('--secondary-alpha-1', `rgba(${secondaryRGB.r}, ${secondaryRGB.g}, ${secondaryRGB.b}, 0.1)`);
            document.documentElement.style.setProperty('--secondary-alpha-15', `rgba(${secondaryRGB.r}, ${secondaryRGB.g}, ${secondaryRGB.b}, 0.15)`);
            document.documentElement.style.setProperty('--secondary-alpha-2', `rgba(${secondaryRGB.r}, ${secondaryRGB.g}, ${secondaryRGB.b}, 0.2)`);
            document.documentElement.style.setProperty('--secondary-alpha-3', `rgba(${secondaryRGB.r}, ${secondaryRGB.g}, ${secondaryRGB.b}, 0.3)`);
            document.documentElement.style.setProperty('--secondary-alpha-4', `rgba(${secondaryRGB.r}, ${secondaryRGB.g}, ${secondaryRGB.b}, 0.4)`);
            document.documentElement.style.setProperty('--secondary-alpha-5', `rgba(${secondaryRGB.r}, ${secondaryRGB.g}, ${secondaryRGB.b}, 0.5)`);
            document.documentElement.style.setProperty('--secondary-alpha-6', `rgba(${secondaryRGB.r}, ${secondaryRGB.g}, ${secondaryRGB.b}, 0.6)`);
            document.documentElement.style.setProperty('--secondary-alpha-7', `rgba(${secondaryRGB.r}, ${secondaryRGB.g}, ${secondaryRGB.b}, 0.7)`);
            document.documentElement.style.setProperty('--secondary-alpha-8', `rgba(${secondaryRGB.r}, ${secondaryRGB.g}, ${secondaryRGB.b}, 0.8)`);
            document.documentElement.style.setProperty('--secondary-alpha-9', `rgba(${secondaryRGB.r}, ${secondaryRGB.g}, ${secondaryRGB.b}, 0.9)`);
        }
        
        // Update volume slider appearance with new colors
        setTimeout(() => {
            if (typeof updateVolumeSliderAppearance === 'function') {
                updateVolumeSliderAppearance();
            }
        }, 50);
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    updatePickerValues(primary, secondary) {
        const primaryPicker = document.getElementById('primaryColorPicker');
        const secondaryPicker = document.getElementById('secondaryColorPicker');

        if (primaryPicker) {
            primaryPicker.value = primary;
        }
        if (secondaryPicker) {
            secondaryPicker.value = secondary;
        }
    }

    async saveTheme() {
        const primary = document.getElementById('primaryColorPicker').value;
        const secondary = document.getElementById('secondaryColorPicker').value;
        
        const theme = { primary, secondary };
        await window.persistenceManager.saveTheme(theme);
        
        showNotification('Theme saved successfully! 🎨');
    }

    async resetToDefault() {
        this.applyColors(this.defaultColors.primary, this.defaultColors.secondary);
        this.updatePickerValues(this.defaultColors.primary, this.defaultColors.secondary);
        await window.persistenceManager.saveTheme(null);
        showNotification('Theme reset to default! 🔄');
    }
}

// Initialize theme customizer
const themeCustomizer = new ThemeCustomizer();

// Theme picker functions
function toggleThemePicker() {
    const modal = document.getElementById('themePickerModal');
    modal.classList.toggle('visible');
}

function closeThemePicker() {
    const modal = document.getElementById('themePickerModal');
    modal.classList.remove('visible');
}

function updateThemeColor(type, color) {
    const primary = document.getElementById('primaryColorPicker').value;
    const secondary = document.getElementById('secondaryColorPicker').value;
    
    themeCustomizer.applyColors(primary, secondary);
    
    // Update volume slider appearance
    updateVolumeSliderAppearance();
    
    // Auto-save the theme changes
    themeCustomizer.saveTheme();
}

function updateVolumeSliderAppearance() {
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider) {
        // Get current volume and force update appearance
        const currentVolume = volumeSlider.value || 50;
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        console.log('🎨 Updating volume slider appearance:', { currentVolume, primaryColor });
        volumeSlider.style.background = `linear-gradient(to right, ${primaryColor} 0%, ${primaryColor} ${currentVolume}%, rgba(0,0,0,0.8) ${currentVolume}%, rgba(0,0,0,0.8) 100%)`;
    } else {
        console.log('⚠️ Volume slider not found for appearance update');
    }
}

function showNotification(message) {
    // Simple notification for now
    console.log(message);
    if (window.dumbassGame && window.dumbassGame.notificationManager) {
        window.dumbassGame.notificationManager.showSuccess(message);
    }
}

// Enhanced DumbassGames with Professional Polish
class DumbassGameEnhanced {
    constructor() {
        this.games = [];
        this.soundSystem = new EnhancedSoundSystem();
        this.effectsManager = new EffectsManager();
        this.notificationManager = new NotificationManager();
        this.initializeApp();
        this.setupEventListeners();
        this.createBackgroundEffects();
        this.setupEasterEggs();
        this.logWelcomeMessage();
    }

    async initializeApp() {
        // Load games asynchronously
        try {
            this.games = await this.loadGames();
        } catch (error) {
            console.error('Error loading games:', error);
            this.games = [];
        }
        
        this.loadDefaultGames();
        this.renderGames();
        this.setupKeyboardShortcuts();
        this.preloadAssets();
        
        // Initialize dynamic auth button system
        this.updateAuthButton();
        this.initializeAvatarUpload();
        
        // Set up Firebase auth state listener to fix button issues
        setTimeout(() => {
            if (window.firebaseAuth) {
                window.firebaseAuth.onAuthStateChanged((user) => {
                    console.status('🔥 Firebase auth state changed:', user ? user.email : 'No user');
                    setTimeout(() => this.updateAuthButton(), 100);
                });
            }
        }, 1000);
        
        // Professional loading sequence
        this.showLoadingSequence();
    }

    async showLoadingSequence() {
        const loadingMessages = [
            '🚀 Initializing retro systems...',
            '⚡ Charging flux capacitor...',
            '🎮 Loading game matrix...',
            '✨ Calibrating awesome levels...',
            '🔧 Fine-tuning experience...',
            '🎊 Ready to rock!'
        ];

        for (let i = 0; i < loadingMessages.length; i++) {
            setTimeout(() => {
                console.log(`%c${loadingMessages[i]}`, 'color: #00ff00; font-weight: bold; text-shadow: 0 0 10px #00ff00;');
                if (i === loadingMessages.length - 1 && !window.systemInitNotificationShown) {
                    window.systemInitNotificationShown = true;
                    this.notificationManager.showSuccess('System initialized successfully! 🎮');
                }
            }, i * 300);
        }
    }

    preloadAssets() {
        // Font is already loaded in HTML head, no need for preload
        // Critical assets are loaded via service worker in production
    }

    loadDefaultGames() {
        // No default games - load only from Firebase/user submissions
        if (this.games.length === 0) {
            this.games = [];
            console.log('🧹 No default games loaded - using Firebase only');
        }
    }

    renderGames() {
        // Always use EnhancedGameManager for rendering - it has the better card layout
        if (window.enhancedGameManager) {
            window.enhancedGameManager.renderGames();
            return;
        }
        
        // Fallback if EnhancedGameManager not available (shouldn't happen)
        const gamesGrid = document.getElementById('gamesGrid');
        if (!gamesGrid) return;
        
        gamesGrid.innerHTML = '<div class="loading-container"><div class="loading"></div><p class="loading-text">LOADING ENHANCED CARDS...</p></div>';
    }

    updateGameCount() {
        const gameCountElement = document.getElementById('gameCount');
        if (gameCountElement) {
            gameCountElement.textContent = this.games.length;
        }
    }

    createGameCard(game) {
        const card = document.createElement('a');
        card.href = game.url;
        card.className = 'game-card';
        card.dataset.gameId = game.id;
        
        // Enhanced hover sound effects
        card.addEventListener('mouseenter', () => {
            this.soundSystem.playHover();
            card.style.transform = 'translateY(-15px) scale(1.03)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });

        // Get genre emoji
        const genreEmoji = {
            'platformer': '🏃',
            'shooter': '🔫',
            'puzzle': '🧩',
            'arcade': '🕹️',
            'rpg': '⚔️',
            'horror': '👻',
            'weird': '🌀'
        }[game.genre] || '🎮';

        // Get vibe emoji
        const vibeEmoji = {
            'dumbass': '💩',
            'memes': '🐸',
            'cursed': '😈',
            'political': '🤡',
            'actually-good': '✨',
            'broken': '🔧',
            'monstrositys': '👹'
        }[game.vibe] || '🎪';

        // Get difficulty color
        const difficultyClass = {
            'easy': 'easy',
            'medium': 'medium',
            'hard': 'hard',
            'expert': 'expert',
            'impossible': 'impossible',
            'why': 'why',
            'unrated': 'unrated'
        }[game.difficulty] || 'unrated';

        card.innerHTML = `
            <div class="game-image">
                ${game.image ? `<img src="${game.image}" alt="${game.title}" loading="lazy" onerror="this.style.display='none'">` : `<span>🎮 ${game.title}</span>`}
            </div>
            <div class="game-metadata">
                <span class="game-genre" title="${game.genre || 'arcade'}">${genreEmoji} ${(game.genre || 'arcade').toUpperCase()}</span>
                <span class="game-vibe" title="${game.vibe || 'dumbass'}">${vibeEmoji} ${(game.vibe || 'dumbass').toUpperCase()}</span>
                <span class="game-difficulty ${difficultyClass}" title="${game.difficulty || 'unrated'}">${(game.difficulty || 'unrated').toUpperCase()}</span>
            </div>
            <h3 class="game-title">${game.title}</h3>
            <p class="game-description">${game.description}</p>
            ${game.author && game.author !== 'Anonymous' ? `<p class="game-author">By ${game.author}</p>` : ''}
            ${game.tags ? `<div class="game-tags">${(Array.isArray(game.tags) ? game.tags : game.tags.split(',')).map(tag => `<span class="tag">#${tag.trim()}</span>`).join('')}</div>` : ''}
            <div class="game-actions">
                <button class="play-button" onclick="event.preventDefault(); dumbassGame.playGame('${game.url}', '${game.title}')">
                    ▶ PLAY NOW
                </button>
                <button class="favorite-btn ${window.userProfileManager?.favoriteGames?.some(fav => fav.id === game.id) ? 'active' : ''}" 
                    onclick="event.preventDefault(); event.stopPropagation(); if (window.userProfileManager) { window.userProfileManager.toggleFavorite('${game.id}'); }" 
                    title="Add to Favorites">
                    ♥
                </button>
            </div>
            <div class="delete-btn" onclick="event.preventDefault(); event.stopPropagation(); dumbassGame.deleteGame('${game.id}')" 
                 style="position: absolute; top: 15px; right: 15px; background: rgba(255, 0, 0, 0.8); color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; opacity: 0; transition: all 0.3s ease; z-index: 10; backdrop-filter: blur(5px);">
                ✕
            </div>
        `;

        // Enhanced delete button interaction
        const deleteBtn = card.querySelector('.delete-btn');
        card.addEventListener('mouseenter', () => {
            deleteBtn.style.opacity = '1';
            deleteBtn.style.transform = 'scale(1)';
        });
        
        card.addEventListener('mouseleave', () => {
            deleteBtn.style.opacity = '0';
            deleteBtn.style.transform = 'scale(0.8)';
        });
        
        deleteBtn.addEventListener('mouseenter', () => {
            deleteBtn.style.background = 'rgba(255, 0, 0, 1)';
            deleteBtn.style.transform = 'scale(1.1)';
            this.soundSystem.playError();
        });

        return card;
    }

    playGame(url, title) {
        this.soundSystem.playClick();
        
        // Track game launch analytics and update play count
        this.trackGamePlay(title, url);
        
        // Professional loading overlay
        this.showGameLoadingOverlay(title);
        
        if (url === '#') {
            setTimeout(() => {
                this.hideGameLoadingOverlay();
                this.notificationManager.showInfo(`🚧 ${title} is coming soon! Stay tuned for updates.`);
            }, 1500);
            return;
        }
        
        // Enhanced game loading with better error handling
        setTimeout(() => {
            this.hideGameLoadingOverlay();
            
            try {
                // Try to open the game in a new window
                const gameWindow = window.open(url, '_blank', 'noopener,noreferrer');
                
                if (gameWindow) {
                    // Window opened successfully
                    this.notificationManager.showSuccess(`🎮 Launching ${title}... Have fun!`);
                    
                    // Check if the window was closed immediately (blocked)
                    setTimeout(() => {
                        if (gameWindow.closed) {
                            this.notificationManager.showWarning(`🚨 Pop-up blocked! Please allow pop-ups for this site and try again.`);
                        }
                    }, 1000);
                } else {
                    // Window was blocked, offer alternative
                    this.handleBlockedPopup(url, title);
                }
            } catch (error) {
                console.error('Error launching game:', error);
                this.handleBlockedPopup(url, title);
            }
        }, 2000);
    }
    
    handleBlockedPopup(url, title) {
        // Create a manual launch option when pop-ups are blocked
        this.notificationManager.showWarning(`🚨 Pop-ups blocked! Click below to manually launch ${title}.`);
        
        // Create a temporary link button
        const linkButton = document.createElement('button');
        linkButton.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #00ff00;
            color: #000;
            border: none;
            padding: 20px 30px;
            font-family: 'Press Start 2P', cursive;
            font-size: 0.8rem;
            cursor: pointer;
            border-radius: 5px;
            z-index: 10001;
            box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
            animation: pulse 1s infinite;
        `;
        
        linkButton.innerHTML = `🎮 LAUNCH ${title} 🎮`;
        linkButton.onclick = () => {
            window.open(url, '_blank');
            linkButton.remove();
        };
        
        // Add pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: translate(-50%, -50%) scale(1); }
                50% { transform: translate(-50%, -50%) scale(1.05); }
                100% { transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(linkButton);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (linkButton.parentNode) {
                linkButton.remove();
                style.remove();
            }
        }, 10000);
    }

    async trackGamePlay(title, url) {
        try {
            // Google Analytics tracking
            if (window.gtag) {
                window.gtag('event', 'game_play', {
                    game_title: title,
                    game_url: url,
                    event_category: 'games',
                    event_label: title
                });
            }

            // Firebase Analytics tracking
            if (window.firebaseAnalytics && window.firebaseLogEvent) {
                window.firebaseLogEvent(window.firebaseAnalytics, 'game_played', {
                    game_title: title,
                    game_url: url,
                    timestamp: new Date().toISOString()
                });
            }

            // CRITICAL: Update play count in Firebase database
            await this.updateGamePlayCount(title, url);

            console.log('📊 Analytics tracked and play count updated for:', title);
        } catch (error) {
            console.warn('Game play tracking failed:', error);
        }
    }

    async updateGamePlayCount(title, url) {
        try {
            if (!window.dataManager || !window.dataManager.isInitialized) {
                console.warn('📊 Firebase not available for play count tracking');
                return;
            }

            // Find the game by title or URL
            const games = await window.dataManager.getGames();
            const game = games.find(g => 
                g.title.toLowerCase() === title.toLowerCase() || 
                g.url === url
            );

            if (game) {
                const currentPlays = parseInt(game.plays) || 0;
                const newPlayCount = currentPlays + 1;
                
                // Update the play count in Firebase
                const success = await window.dataManager.updateGame(game.id, {
                    plays: newPlayCount,
                    lastPlayed: new Date().toISOString()
                });

                if (success) {
                    console.log(`📈 Play count updated for "${title}": ${currentPlays} → ${newPlayCount}`);
                    
                    // Update local games array if available
                    if (this.games) {
                        const localGame = this.games.find(g => g.id === game.id);
                        if (localGame) {
                            localGame.plays = newPlayCount;
                            localGame.lastPlayed = new Date().toISOString();
                        }
                    }
                    
                    // Update enhanced game manager if available
                    if (window.enhancedGameManager && window.enhancedGameManager.games) {
                        const enhancedGame = window.enhancedGameManager.games.find(g => g.id === game.id);
                        if (enhancedGame) {
                            enhancedGame.plays = newPlayCount;
                            enhancedGame.lastPlayed = new Date().toISOString();
                        }
                    }
                } else {
                    console.warn('📊 Failed to update play count in Firebase');
                }
            } else {
                console.warn('📊 Game not found for play count update:', title);
            }
        } catch (error) {
            console.error('❌ Error updating play count:', error);
        }
    }

    showGameLoadingOverlay(title) {
        const overlay = document.createElement('div');
        overlay.id = 'gameLoadingOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(15px);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #00ff00;
            font-family: 'Press Start 2P', cursive;
        `;
        
        overlay.innerHTML = `
            <div style="text-align: center;">
                <div class="loading" style="margin-bottom: 30px; width: 50px; height: 50px;"></div>
                <h2 style="margin-bottom: 20px; font-size: 1.2rem; text-shadow: 0 0 20px #00ff00;">LOADING</h2>
                <p style="font-size: 0.7rem; color: #00ffff; margin-bottom: 10px;">${title}</p>
                <div style="width: 300px; height: 4px; background: #333; border-radius: 2px; overflow: hidden; margin-top: 20px;">
                    <div id="loadingProgress" style="width: 0%; height: 100%; background: linear-gradient(90deg, #00ff00, #00ffff); border-radius: 2px; transition: width 0.3s ease;"></div>
                </div>
                <p style="font-size: 0.4rem; color: #666; margin-top: 15px;">Initializing game engine...</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Animate progress bar
        const progress = overlay.querySelector('#loadingProgress');
        let width = 0;
        const interval = setInterval(() => {
            width += Math.random() * 15;
            if (width > 100) width = 100;
            progress.style.width = width + '%';
            
            if (width >= 100) {
                clearInterval(interval);
                overlay.querySelector('p:last-child').textContent = 'Launch sequence complete!';
            }
        }, 200);
    }

    hideGameLoadingOverlay() {
        const overlay = document.getElementById('gameLoadingOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.transform = 'scale(0.95)';
            setTimeout(() => overlay.remove(), 300);
        }
    }

    async addGame(gameData) {
        // Process the game data first, then let EnhancedGameManager handle rendering
        console.log('🎮 Processing game submission:', gameData.title);
        
        // Fallback if EnhancedGameManager not available
        const newGame = {
            title: gameData.title.toUpperCase(),
            description: gameData.description,
            image: gameData.image || null,
            url: gameData.url,
            genre: gameData.genre || 'arcade',
            vibe: gameData.vibe || 'dumbass',
            difficulty: gameData.difficulty || 'unrated',
            tags: gameData.tags || '',
            author: gameData.author || 'Anonymous',
            dateAdded: new Date().toISOString(),
            favorites: 0,
            plays: 0
        };
        
        try {
            if (window.dataManager && window.dataManager.isInitialized) {
                const firebaseId = await window.dataManager.addGame(newGame);
                if (firebaseId) {
                    newGame.id = firebaseId;
                    this.games.push(newGame);
                    console.log('✅ Game added to Firebase successfully');
                } else {
                    throw new Error('Failed to add to Firebase');
                }
            } else {
                newGame.id = Date.now().toString();
                this.games.push(newGame);
                await this.saveGames();
            }
            
            this.renderGames();
            this.soundSystem.playSuccess();
            this.notificationManager.showSuccess(`🎉 "${newGame.title}" added successfully!`);
            
            // CRITICAL: Record submission for tier tracking 
            try {
                await this.recordGameSubmission();
                console.log('✅ Game submission recorded for tier tracking');
            } catch (error) {
                console.warn('⚠️ Failed to record submission for tier tracking:', error);
            }
            
            // Refresh user submissions in profile
            if (window.userProfileManager) {
                await window.userProfileManager.loadUserSubmissions();
                window.userProfileManager.updateProfileUI();
            }
            
            setTimeout(() => this.updateGameCount(), 100);
        } catch (error) {
            console.error('❌ Error adding game:', error);
            this.soundSystem.playError();
            
            // Check if this is a specific error with a user-friendly message
            if (error.message && (
                error.message.includes('Image size exceeds Firebase limits') ||
                error.message.includes('Permission denied') ||
                error.message.includes('Failed to save to Firebase')
            )) {
                // The detailed error message was already shown by the Firebase handler
                // Don't show a generic message on top of it
                return;
            } else {
                // For other unknown errors, show generic message
                this.notificationManager.showError('❌ Failed to add game. Please try again.');
            }
        }
    }

    async deleteGame(gameId) {
        const game = this.games.find(g => g.id === gameId);
        if (!game) return;
        
        // Enhanced confirmation dialog
        const confirmed = confirm(`🗑️ Delete "${game.title}"?\n\nThis action cannot be undone.`);
        if (confirmed) {
            try {
                // Delete from Firebase if available
                if (window.dataManager && window.dataManager.isInitialized) {
                    const success = await window.dataManager.deleteGame(gameId);
                    if (success) {
                        this.games = this.games.filter(g => g.id !== gameId);
                        console.log('✅ Game deleted from Firebase successfully');
                    } else {
                        throw new Error('Failed to delete from Firebase');
                    }
                } else {
                    // Fallback to localStorage
                    this.games = this.games.filter(g => g.id !== gameId);
                    await this.saveGames();
                }
                
                this.renderGames();
                this.soundSystem.playError();
                this.notificationManager.showWarning(`🗑️ "${game.title}" has been deleted.`);
                
                // Update game count immediately
                setTimeout(() => this.updateGameCount(), 100);
            } catch (error) {
                console.error('❌ Error deleting game:', error);
                this.soundSystem.playError();
                this.notificationManager.showError('❌ Failed to delete game. Please try again.');
            }
        }
    }

    setupEventListeners() {
        // Enhanced modal form handling
        const addGameForm = document.getElementById('addGameForm');
        if (addGameForm) {
            addGameForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddGameSubmit(e);
            });
        }

        // Professional keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggleDebugMode();
            }
            
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.showAddGameForm();
            }
            
            if (e.key === 'Escape') {
                this.hideAddGameForm();
            }
        });

        // Enhanced title click interaction
        const title = document.querySelector('.title');
        if (title) {
            title.addEventListener('click', () => {
                this.soundSystem.playSuccess();
                title.style.animation = 'none';
                setTimeout(() => {
                    title.style.animation = 'glitch 2s infinite';
                }, 100);
                
                this.notificationManager.showInfo('🎮 Welcome to DumbassGames! Click around and explore!');
            });
        }
    }

    async handleAddGameSubmit(e) {
        const formData = new FormData(e.target);
        const gameData = {
            title: formData.get('gameTitle'),
            description: formData.get('gameDescription'),
            image: formData.get('gameImage'),
            url: formData.get('gameUrl'),
            genre: formData.get('gameGenre'),
            vibe: formData.get('gameVibe'),
            difficulty: formData.get('gameDifficulty'),
            tags: formData.get('gameTags'),
            author: formData.get('gameAuthor')
        };

        // Enhanced validation
        if (!gameData.title || !gameData.description || !gameData.url) {
            this.soundSystem.playError();
            this.notificationManager.showError('❌ Please fill in all required fields!');
            return;
        }

        // Check if user was trying to upload an image but it failed
        const imageUploadManager = window.imageUploadManager;
        const uploadMethodFile = document.querySelector('input[name="uploadMethod"]:checked')?.value === 'file';
        
        if (uploadMethodFile && imageUploadManager) {
            // User selected file upload but image field is empty = upload failed
            if (!gameData.image || gameData.image.trim() === '') {
                this.soundSystem.playError();
                this.notificationManager.showError('❌ Image upload failed or incomplete! Please try a smaller image (under 600KB) or use the URL method instead.');
                return;
            }
            
            // Double-check the image isn't just the placeholder
            if (gameData.image === 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=250&fit=crop') {
                this.soundSystem.playError();
                this.notificationManager.showError('❌ Please upload your own image or provide an image URL!');
                return;
            }
        }

        if (gameData.url && !this.isValidUrl(gameData.url)) {
            this.soundSystem.playError();
            this.notificationManager.showError('❌ Please enter a valid URL or file path!');
            return;
        }

        // Smart duplicate detection and rate limiting
        const validationResult = await this.validateGameSubmission(gameData);
        if (!validationResult.valid) {
            this.soundSystem.playError();
            
            // Check if this is a submission limit that should show upgrade prompt
            if (validationResult.showUpgrade) {
                if (validationResult.isAnonymous) {
                    // Show sign-up prompt for anonymous users
                    const shouldSignUp = confirm(
                        `${validationResult.message}\n\n${validationResult.upgradeMessage}\n\nWould you like to sign up now?`
                    );
                    if (shouldSignUp) {
                        window.userProfileManager?.showAuthModal();
                    }
                } else if (validationResult.upgradeAction) {
                    // Show upgrade modal for logged-in users
                    validationResult.upgradeAction();
                } else {
                    // Fallback to showing upgrade modal
                    showUpgradeModal();
                }
                return;
            }
            
            this.notificationManager.showError(validationResult.message);
            return;
        }

        // Handle update vs new submission
        if (validationResult.isUpdate) {
            await this.updateExistingGame(validationResult.existingGame, gameData);
        } else {
            await this.addGame(gameData);
        }
        
        this.hideAddGameForm();
        e.target.reset();
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return string.includes('.html') || string.includes('games/') || string.startsWith('/') || string.startsWith('./');
        }
    }

    async validateGameSubmission(gameData) {
        // 1. Rate limiting check
        const rateLimitResult = await this.checkRateLimit();
        if (!rateLimitResult.valid) {
            return rateLimitResult;
        }

        // 2. Duplicate URL detection with smart update logic
        const urlCheckResult = await this.checkDuplicateUrl(gameData.url, gameData);
        if (urlCheckResult.isUpdate) {
            return {
                valid: true,
                isUpdate: true,
                existingGame: urlCheckResult.existingGame,
                message: '🔄 Game URL already exists. Updating existing entry...'
            };
        } else if (!urlCheckResult.valid) {
            return urlCheckResult;
        }

        // 3. Similar title detection (fuzzy matching)
        const titleCheckResult = await this.checkSimilarTitles(gameData.title);
        if (!titleCheckResult.valid) {
            return titleCheckResult;
        }

        return { valid: true, isUpdate: false };
    }

    async checkRateLimit() {
        console.log('🔍 Starting rate limit check...');
        
        const currentUser = window.firebaseAuth?.currentUser;
        const isSignedIn = !!currentUser;
        
        console.log(`👤 User status: ${isSignedIn ? 'Signed In' : 'Anonymous'}`);
        
        if (!isSignedIn) {
            // Anonymous users get FREE tier limits (2 per month)
            console.log('📝 Checking anonymous user limits...');
            return await this.checkAnonymousLimits();
        }

        // Signed-in users - check Firebase profile
        try {
            console.log('🔄 Fetching fresh profile data from Firebase...');
            
            let userProfile;
            try {
                const userDoc = await window.firebaseGetDoc(
                    window.firebaseDoc(window.firebaseDb, 'userProfiles', currentUser.uid)
                );
                userProfile = userDoc.exists() ? userDoc.data() : null;
                console.log('✅ Profile loaded:', { tier: userProfile?.tier, submissionCount: userProfile?.submissionCount });
            } catch (error) {
                console.warn('⚠️ Firebase fetch failed, using cached data:', error);
                userProfile = window.userProfileManager?.userProfile;
            }

            if (!userProfile) {
                console.log('⚠️ No profile found - applying FREE tier limits');
                // No profile = FREE tier limits
                return await this.checkSignedInLimits({ tier: 'FREE', submissionCount: { monthly: 0 } });
            }

            return await this.checkSignedInLimits(userProfile);
            
        } catch (error) {
            console.error('❌ Error checking signed-in limits:', error);
            // On error, apply FREE tier limits as safety measure
            return await this.checkSignedInLimits({ tier: 'FREE', submissionCount: { monthly: 0 } });
        }
    }

    async checkAnonymousLimits() {
        // Anonymous users: 2 submissions per month (same as FREE tier)
        const currentTime = Date.now();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthKey = `${currentYear}-${currentMonth}`;
        
        let submissionHistory = JSON.parse(localStorage.getItem('submissionHistory_anonymous') || '{}');
        const monthlyCount = submissionHistory[monthKey] || 0;
        
        console.log(`📊 Anonymous limits - Month: ${monthKey}, Used: ${monthlyCount}/2`);
        
        if (monthlyCount >= 2) {
            const nextMonth = new Date(currentYear, currentMonth + 1, 1);
            return {
                valid: false,
                showUpgrade: true,
                isAnonymous: true,
                message: `🚫 Monthly limit reached! Anonymous users can submit 2 games per month. Next submission: ${nextMonth.toLocaleDateString()}`,
                upgradeMessage: 'Sign up for FREE to track your submissions properly, or upgrade for more limits!'
            };
        }
        
        return { valid: true };
    }

    async checkSignedInLimits(userProfile) {
        const tier = userProfile.tier || 'FREE';
        const monthlyCount = userProfile.submissionCount?.monthly || 0;
        
        let monthlyLimit;
        if (tier === 'FREE') {
            monthlyLimit = 2;
        } else if (tier === 'PRO') {
            monthlyLimit = 8;
        } else if (tier === 'DEV') {
            monthlyLimit = -1; // unlimited
        } else {
            monthlyLimit = 2; // default to FREE
        }
        
        console.log(`📊 Signed-in limits - Tier: ${tier}, Used: ${monthlyCount}/${monthlyLimit === -1 ? '∞' : monthlyLimit}`);
        
        if (monthlyLimit > 0 && monthlyCount >= monthlyLimit) {
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1, 1);
            return {
                valid: false,
                showUpgrade: true,
                isAnonymous: false,
                tier: tier,
                message: `🚫 ${tier} tier limit reached (${monthlyLimit} per month). Next submission: ${nextMonth.toLocaleDateString()}`,
                upgradeAction: () => showUpgradeModal()
            };
        }
        
        return { valid: true, tier: tier, count: monthlyCount, limit: monthlyLimit };
    }

    // Dynamic Auth Button Management
    updateAuthButton() {
        const authBtn = document.getElementById('authBtn');
        const userAvatarBtn = document.getElementById('userAvatarBtn');
        const authBtnText = document.getElementById('authBtnText');
        
        if (!authBtn || !userAvatarBtn || !authBtnText) {
            console.warn('⚠️ Auth button elements not found');
            return;
        }
        
        const currentUser = window.firebaseAuth?.currentUser;
        const hasAccount = localStorage.getItem('dumbassGames_hasAccount') === 'true';
        
        // Auth button state logging removed for cleaner console
        
        if (currentUser) {
            // User is logged in - ONLY show avatar button, HIDE login button
            
            // Add CSS class to body for styling
            document.body.classList.add('user-logged-in');
            
            // Force hide login button with multiple methods
            authBtn.style.display = 'none';
            authBtn.style.visibility = 'hidden';
            authBtn.style.opacity = '0';
            authBtn.classList.add('force-hidden');
            
            // Force show avatar button
            userAvatarBtn.style.display = 'flex';
            userAvatarBtn.style.visibility = 'visible';
            userAvatarBtn.style.opacity = '1';
            userAvatarBtn.classList.remove('force-hidden');
            
            this.updateAvatarButton();
        } else if (hasAccount) {
            // User has account but not logged in - show LOGIN
            
            // Remove logged-in class
            document.body.classList.remove('user-logged-in');
            
            authBtn.style.display = 'flex';
            authBtn.style.visibility = 'visible';
            authBtn.style.opacity = '1';
            authBtn.classList.remove('force-hidden');
            
            userAvatarBtn.style.display = 'none';
            authBtnText.textContent = 'LOGIN';
            authBtn.className = 'control-btn compact login-state';
        } else {
            // First-time visitor - show SIGN UP
            
            // Remove logged-in class
            document.body.classList.remove('user-logged-in');
            
            authBtn.style.display = 'flex';
            authBtn.style.visibility = 'visible';
            authBtn.style.opacity = '1';
            authBtn.classList.remove('force-hidden');
            
            userAvatarBtn.style.display = 'none';
            authBtnText.textContent = 'SIGN UP';
            authBtn.className = 'control-btn compact primary signup-state';
        }

    }
    
    updateAvatarButton() {
        const userProfile = window.userProfileManager?.userProfile;
        const userAvatarImg = document.getElementById('userAvatarImg');
        const userDisplayName = document.getElementById('userDisplayName');
        
        console.log('🔄 updateAvatarButton called');
        console.log('📋 Elements found:', {
            userProfile: userProfile ? 'yes' : 'no',
            userAvatarImg: userAvatarImg ? 'yes' : 'no',
            userDisplayName: userDisplayName ? 'yes' : 'no',
            avatarData: userProfile?.avatar ? 'yes (' + userProfile.avatar.length + ' chars)' : 'no'
        });
        
        if (!userProfile || !userAvatarImg || !userDisplayName) {
            console.log('❌ Missing required elements for avatar button update');
            return;
        }
        
        // Update avatar image
        if (userProfile.avatar) {
            console.log('✅ Setting avatar src to base64 data');
            userAvatarImg.src = userProfile.avatar;
            userAvatarImg.style.display = 'block';
            userAvatarImg.style.opacity = '1';
        } else {
            console.log('ℹ️ No avatar data, hiding avatar image');
            userAvatarImg.src = '';
            userAvatarImg.style.display = 'none';
        }
        
        // Update display name
        const displayName = userProfile.displayName || 
                           userProfile.email?.split('@')[0] || 
                           'User';
        userDisplayName.textContent = displayName.length > 15 ? 
                                     displayName.substring(0, 15) + '...' : 
                                     displayName;
        
        console.log('✅ Avatar button updated with display name:', userDisplayName.textContent);
    }
    
    markUserHasAccount() {
        localStorage.setItem('dumbassGames_hasAccount', 'true');
        this.updateAuthButton();
    }
    
    // Avatar Upload System
    initializeAvatarUpload() {
        const avatarDropzone = document.getElementById('avatarDropzone');
        const avatarFileInput = document.getElementById('avatarFileInput');
        
        if (!avatarDropzone || !avatarFileInput) return;
        
        // Click to upload
        avatarDropzone.addEventListener('click', () => {
            avatarFileInput.click();
        });
        
        // File input change
        avatarFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.processAvatarUpload(file);
            }
        });
        
        // Drag and drop
        avatarDropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            avatarDropzone.classList.add('drag-over');
        });
        
        avatarDropzone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            avatarDropzone.classList.remove('drag-over');
        });
        
        avatarDropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            avatarDropzone.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.processAvatarUpload(files[0]);
            }
        });
    }
    
    async processAvatarUpload(file) {
        try {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                this.showAvatarError('Please select an image file');
                return;
            }
            
            this.showAvatarProgress(0, 'Validating image...');
            
            // Use existing image compression system
            const compressedBase64 = await window.imageUploadManager.compressImageForAvatar(file);
            
            this.showAvatarProgress(90, 'Saving avatar...');
            
            // Save to profile
            await this.saveAvatarToProfile(compressedBase64);
            
            this.showAvatarProgress(100, 'Avatar updated!');
            setTimeout(() => this.hideAvatarProgress(), 1500);
            
        } catch (error) {
            console.error('Error processing avatar:', error);
            this.showAvatarError(error.message || 'Failed to process avatar');
        }
    }
    
    async saveAvatarToProfile(avatarData) {
        const userProfile = window.userProfileManager?.userProfile;
        if (!userProfile) throw new Error('No user profile found');
        
        console.log('💾 Saving avatar to profile...');
        
        // Update profile with avatar
        userProfile.avatar = avatarData;
        
        // Force save to both Firebase and localStorage
        try {
            await window.userProfileManager.saveProfile();
            console.log('✅ Avatar saved to Firebase');
            
            // Double-check: also save directly to persistence manager
            if (window.persistenceManager) {
                await window.persistenceManager.saveUserProfile(userProfile);
                console.log('✅ Avatar double-saved to persistence');
            }
            
        } catch (error) {
            console.error('❌ Failed to save avatar:', error);
            throw new Error('Failed to save avatar: ' + error.message);
        }
        
        // Update UI
        this.updateAvatarPreview(avatarData);
        this.updateAvatarButton();
        
        console.log('✅ Avatar saved successfully');
    }
    
    updateAvatarPreview(avatarData) {
        const avatarPreview = document.getElementById('currentAvatarPreview');
        const avatarPlaceholder = document.getElementById('avatarPlaceholder');
        const avatarStatus = document.getElementById('avatarStatus');
        const removeBtn = document.getElementById('removeAvatarBtn');
        
        if (avatarData && avatarPreview) {
            avatarPreview.src = avatarData;
            avatarPreview.classList.add('loaded');
            if (avatarStatus) avatarStatus.textContent = 'Avatar set';
            if (removeBtn) removeBtn.style.display = 'inline-block';
        } else {
            if (avatarPreview) {
                avatarPreview.src = '';
                avatarPreview.classList.remove('loaded');
            }
            if (avatarStatus) avatarStatus.textContent = 'No avatar set';
            if (removeBtn) removeBtn.style.display = 'none';
        }
    }
    
    showAvatarProgress(percent, message) {
        const progressContainer = document.getElementById('avatarUploadProgress');
        const progressFill = document.getElementById('avatarProgressFill');
        const progressText = document.getElementById('avatarProgressText');
        
        if (progressContainer) progressContainer.style.display = 'block';
        if (progressFill) progressFill.style.width = percent + '%';
        if (progressText) progressText.textContent = message;
    }
    
    hideAvatarProgress() {
        const progressContainer = document.getElementById('avatarUploadProgress');
        if (progressContainer) progressContainer.style.display = 'none';
    }
    
    showAvatarError(message) {
        this.hideAvatarProgress();
        if (window.dumbassGame?.notificationManager) {
            window.dumbassGame.notificationManager.showError('🚫 ' + message);
        }
        console.error('Avatar upload error:', message);
    }

    async recordGameSubmission() {
        const currentUser = window.firebaseAuth?.currentUser;
        const isSignedIn = !!currentUser;
        
        if (!isSignedIn) {
            // Record anonymous submission
            await this.recordAnonymousSubmission();
        } else {
            // Record signed-in user submission
            await this.recordSignedInSubmission(currentUser);
        }
    }

    async recordAnonymousSubmission() {
        const currentTime = Date.now();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthKey = `${currentYear}-${currentMonth}`;
        
        let submissionHistory = JSON.parse(localStorage.getItem('submissionHistory_anonymous') || '{}');
        submissionHistory[monthKey] = (submissionHistory[monthKey] || 0) + 1;
        
        localStorage.setItem('submissionHistory_anonymous', JSON.stringify(submissionHistory));
        
        console.log(`📊 Anonymous submission recorded: ${submissionHistory[monthKey]}/2 for ${monthKey}`);
    }

    async recordSignedInSubmission(currentUser) {
        try {
            // Update submission count in Firebase
            const userProfileRef = window.firebaseDoc(window.firebaseDb, 'userProfiles', currentUser.uid);
            
            // Get current profile
            const userDoc = await window.firebaseGetDoc(userProfileRef);
            const userProfile = userDoc.exists() ? userDoc.data() : { tier: 'FREE', submissionCount: { monthly: 0 } };
            
            // Increment monthly count
            const currentCount = userProfile.submissionCount?.monthly || 0;
            const newCount = currentCount + 1;
            
            // Update in Firebase
            await window.firebaseUpdateDoc(userProfileRef, {
                'submissionCount.monthly': newCount,
                'submissionCount.lastSubmission': new Date().toISOString()
            });
            
            console.log(`📊 Signed-in submission recorded: ${newCount}/${userProfile.tier === 'FREE' ? '2' : userProfile.tier === 'PRO' ? '8' : '∞'} for ${userProfile.tier} tier`);
            
            // Force refresh cached profile data
            if (window.userProfileManager) {
                await window.userProfileManager.loadUserProfile();
                window.userProfileManager.updateProfileUI();
            }
            
        } catch (error) {
            console.error('❌ Error recording signed-in submission:', error);
            throw error;
        }
    }

    showSubmissionLimitModal(currentTier, recommendedTier, limitCheck) {
        // Create and show a custom submission limit modal
        const modal = document.createElement('div');
        modal.className = 'modal submission-limit-modal';
        modal.style.display = 'block';
        
        // Get all available upgrade tiers
        const tierManager = window.userProfileManager?.tierManager;
        const allTiers = tierManager ? Object.values(tierManager.tiers) : [];
        const availableUpgrades = allTiers.filter(tier => 
            tier.price > currentTier.price && tier.name !== currentTier.name
        );
        
        // Generate upgrade options HTML
        const upgradeOptionsHTML = availableUpgrades.map(tier => `
            <div class="upgrade-tier-option">
                <div class="tier-header">
                    <span class="tier-badge tier-${tier.name.toLowerCase()}">${tier.badge}</span>
                    <div class="tier-info">
                        <h4>${tier.displayName}</h4>
                        <p class="tier-price">$${tier.price}/month</p>
                    </div>
                </div>
                <ul class="tier-benefits">
                    <li>${tier.limits.submissionsPerMonth === -1 ? 'Unlimited' : tier.limits.submissionsPerMonth} submissions per month</li>
                    <li>${tier.limits.favorites === -1 ? 'Unlimited' : tier.limits.favorites} favorites</li>
                    <li>Priority support</li>
                    ${tier.name === 'DEV' ? '<li>Game analytics & editing</li>' : ''}
                </ul>
                <button class="btn-primary upgrade-btn tier-upgrade-btn" onclick="showUpgradeModal(); this.closest('.modal').remove()">
                    💎 UPGRADE TO ${tier.name}
                </button>
            </div>
        `).join('');
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🚫 SUBMISSION LIMIT REACHED</h3>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="limit-modal-body">
                    <div class="limit-status">
                        <div class="current-tier">
                            <span class="tier-badge tier-${currentTier.name.toLowerCase()}">${currentTier.badge}</span>
                            <div class="tier-info">
                                <h4>${currentTier.displayName}</h4>
                                <p>${limitCheck.reason}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="upgrade-arrow">⬇️ CHOOSE YOUR UPGRADE ⬇️</div>
                    
                    <div class="upgrade-options">
                        ${upgradeOptionsHTML}
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="this.closest('.modal').remove()">
                            ❌ MAYBE LATER
                        </button>
                    </div>
                    
                    <p class="limit-help">Upgrade now to submit more games and grow your collection!</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-focus the first upgrade button
        setTimeout(() => {
            const upgradeBtn = modal.querySelector('.upgrade-btn');
            if (upgradeBtn) upgradeBtn.focus();
        }, 100);
    }

    async checkDuplicateUrl(url, gameData) {
        const normalizedUrl = url.trim().toLowerCase();
        const allGames = window.enhancedGameManager?.games || this.games || [];
        
        const existingGame = allGames.find(game => 
            game.url.trim().toLowerCase() === normalizedUrl
        );

        if (existingGame) {
            // Check if the user owns this game (can update it)
            const currentUserId = window.firebaseAuth?.currentUser?.uid;
            const currentUserEmail = window.firebaseAuth?.currentUser?.email;
            
            const canUpdate = 
                existingGame.submittedBy === currentUserId ||
                existingGame.author === currentUserEmail ||
                (!currentUserId && existingGame.submittedBy === 'anonymous');

            if (canUpdate) {
                // Offer update option
                const shouldUpdate = confirm(
                    `🔄 You already have a game with this URL: "${existingGame.title}"\n\n` +
                    `Would you like to update the existing game instead of creating a duplicate?\n\n` +
                    `Click OK to UPDATE existing game, or Cancel to abort submission.`
                );
                
                if (shouldUpdate) {
                    return { 
                        valid: true, 
                        isUpdate: true, 
                        existingGame: existingGame 
                    };
                } else {
                    return { 
                        valid: false, 
                        message: '❌ Submission cancelled. Use a different URL or update your existing game.' 
                    };
                }
            } else {
                return {
                    valid: false,
                    message: `🚫 This URL is already used by another game: "${existingGame.title}". Please use a different URL.`
                };
            }
        }

        return { valid: true };
    }

    async checkSimilarTitles(title) {
        const normalizedTitle = title.trim().toLowerCase();
        const allGames = window.enhancedGameManager?.games || this.games || [];
        
        // Check for exact title matches
        const exactMatch = allGames.find(game => 
            game.title.trim().toLowerCase() === normalizedTitle
        );

        if (exactMatch) {
            return {
                valid: false,
                message: `🚫 A game with the title "${exactMatch.title}" already exists. Please choose a different title.`
            };
        }

        // Check for very similar titles (fuzzy matching)
        const similarGames = allGames.filter(game => {
            const gameTitle = game.title.trim().toLowerCase();
            return this.calculateTitleSimilarity(normalizedTitle, gameTitle) > 0.8;
        });

        if (similarGames.length > 0) {
            const shouldContinue = confirm(
                `⚠️ Similar game titles found:\n\n` +
                similarGames.map(game => `• "${game.title}"`).join('\n') +
                `\n\nYour title: "${title}"\n\n` +
                `Click OK to continue anyway, or Cancel to choose a different title.`
            );
            
            if (!shouldContinue) {
                return {
                    valid: false,
                    message: '❌ Submission cancelled. Please choose a more unique title.'
                };
            }
        }

        return { valid: true };
    }

    calculateTitleSimilarity(title1, title2) {
        // Simple Levenshtein distance for similarity calculation
        const len1 = title1.length;
        const len2 = title2.length;
        const matrix = Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0));

        for (let i = 0; i <= len1; i++) matrix[i][0] = i;
        for (let j = 0; j <= len2; j++) matrix[0][j] = j;

        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                const cost = title1[i - 1] === title2[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }

        const maxLen = Math.max(len1, len2);
        return maxLen === 0 ? 1 : (maxLen - matrix[len1][len2]) / maxLen;
    }

    async updateExistingGame(existingGame, newGameData) {
        try {
            console.log(`🔄 Updating existing game: "${existingGame.title}"`);
            
            // Create updated game object
            const updatedGame = {
                ...existingGame,
                title: newGameData.title.toUpperCase(),
                description: newGameData.description,
                image: newGameData.image || existingGame.image,
                genre: newGameData.genre || existingGame.genre,
                vibe: newGameData.vibe || existingGame.vibe,
                difficulty: newGameData.difficulty || existingGame.difficulty,
                tags: newGameData.tags || existingGame.tags,
                author: newGameData.author || existingGame.author,
                lastUpdated: new Date().toISOString()
            };

            // Update in Firebase
            if (window.dataManager && window.dataManager.isInitialized) {
                await window.dataManager.updateGame(existingGame.id, updatedGame);
                console.log('✅ Game updated in Firebase successfully');
            }

            // Update in local arrays
            const allManagers = [
                window.enhancedGameManager,
                window.dumbassGame
            ].filter(manager => manager && manager.games);

            for (const manager of allManagers) {
                const gameIndex = manager.games.findIndex(g => g.id === existingGame.id);
                if (gameIndex !== -1) {
                    manager.games[gameIndex] = updatedGame;
                    if (manager.renderGames) manager.renderGames();
                    if (manager.applyFilters) manager.applyFilters();
                }
            }

            // Update user submissions in profile
            if (window.userProfileManager) {
                await window.userProfileManager.loadUserSubmissions();
                window.userProfileManager.updateProfileUI();
            }

            // Show success notification
            this.soundSystem.playSuccess();
            this.notificationManager.showSuccess(`🔄 "${updatedGame.title}" updated successfully!`);
            
        } catch (error) {
            console.error('❌ Error updating game:', error);
            this.soundSystem.playError();
            this.notificationManager.showError('❌ Failed to update game. Please try again.');
        }
    }

    setupKeyboardShortcuts() {
        console.log('%c🎮 KEYBOARD SHORTCUTS:', 'color: #00ffff; font-weight: bold;');
        console.log('%c• Ctrl+N: Add new game', 'color: #00ff00;');
        console.log('%c• Ctrl+Shift+D: Debug mode', 'color: #00ff00;');
        console.log('%c• Escape: Close modals', 'color: #00ff00;');
        console.log('%c• ↑↑↓↓←→←→BA: Secret!', 'color: #ff6600;');
    }

    toggleDebugMode() {
        this.soundSystem.playClick();
        console.clear();
        console.log('%c🔧 DEBUG MODE ACTIVATED', 'color: #ff6600; font-size: 16px; font-weight: bold;');
        console.log('Current games:', this.games);
        console.log('Sound system:', this.soundSystem);
        console.log('Effects manager:', this.effectsManager);
        
        this.notificationManager.showInfo('🔧 Debug mode activated! Check console for details.');
    }

    createBackgroundEffects() {
        this.effectsManager.createParticles();
        this.effectsManager.createMatrixRain();
        this.effectsManager.createCyberGrid();
    }

    setupEasterEggs() {
        // Enhanced Konami Code
        let konamiCode = [];
        const correctCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        
        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.code);
            if (konamiCode.length > correctCode.length) {
                konamiCode.shift();
            }
            
            if (JSON.stringify(konamiCode) === JSON.stringify(correctCode)) {
                this.activateRainbowMode();
            }
        });
    }

    activateRainbowMode() {
        this.soundSystem.playSuccess();
        document.body.classList.add('konami-mode');
        
        // Epic notification
        this.notificationManager.showSuccess('🌈 KONAMI CODE ACTIVATED! Rainbow mode enabled!');
        
        setTimeout(() => {
            document.body.classList.remove('konami-mode');
            this.notificationManager.showInfo('Rainbow mode deactivated. Thanks for playing!');
        }, 10000);
        
        console.log('%c🌈 KONAMI CODE ACTIVATED!', 'background: linear-gradient(90deg, #ff0000, #ff8000, #ffff00, #00ff00, #0080ff, #8000ff); color: white; padding: 10px; font-size: 20px; font-weight: bold;');
    }

    logWelcomeMessage() {
        console.critical('🎮 DUMBASSGAMES v2.1 - Production Ready');
        if (window.DEVELOPMENT_MODE) {
            console.log('%c🎮 DUMBASSGAMES ENHANCED v2.0', 'background: linear-gradient(90deg, #00ff00, #00ffff); color: #000; padding: 10px; font-size: 16px; font-weight: bold; border-radius: 5px;');
            console.log('%cWelcome to the most retro gaming experience on the web!', 'color: #00ff00; font-size: 14px;');
            console.log('%cType dumbassGameAdmin.help() for advanced commands', 'color: #00ffff; font-style: italic;');
        }
    }

    showAddGameForm() {
        const modal = document.getElementById('addGameModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            this.soundSystem.playClick();
            
            // Focus first input with delay for better UX
            setTimeout(() => {
                const firstInput = modal.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    }

    hideAddGameForm() {
        const modal = document.getElementById('addGameModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    async loadGames() {
        // Try to load from Firebase first, fallback to localStorage if needed
        if (window.dataManager && window.dataManager.isInitialized) {
            try {
                const firebaseGames = await window.dataManager.getGames();
                console.log('📥 Loaded games from Firebase:', firebaseGames.length);
                
                // Clear localStorage when Firebase is working to prevent old data conflicts
                localStorage.removeItem('dumbassGames');
                console.log('🧹 Cleared localStorage games cache');
                
                return firebaseGames;
            } catch (error) {
                console.error('❌ Error loading from Firebase, clearing localStorage and starting fresh:', error);
                // Clear localStorage and start fresh instead of loading old data
                localStorage.removeItem('dumbassGames');
                return [];
            }
        }
        
        // Clear localStorage since we're now using Firebase-only mode
        console.log('🧹 Clearing localStorage and starting fresh with Firebase-only mode');
        localStorage.removeItem('dumbassGames');
        
        // Also clear the in-memory games array to prevent conflicts
        this.games = [];
        console.log('🧹 Cleared in-memory games array');
        
        return [];
    }

    async saveGames() {
        // Save to Firebase if available, otherwise use localStorage
        if (window.dataManager && window.dataManager.isInitialized) {
            console.log('💾 Games are automatically saved to Firebase when added/updated');
            // Firebase saves games automatically when added/updated
        } else {
            localStorage.setItem('dumbassGames', JSON.stringify(this.games));
            console.log('💾 Saved games to localStorage');
        }
    }
}

// Enhanced Sound System with Professional Audio
class EnhancedSoundSystem {
    constructor() {
        this.audioContext = null;
        this.sfxEnabled = true;
        this.masterVolume = 0.3;
        this.initializeAudio();
    }

    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    createTone(frequency, duration, type = 'square', volume = 0.3) {
        if (!this.audioContext || !this.sfxEnabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume * this.masterVolume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playHover() {
        this.createTone(800, 0.1, 'sine', 0.15);
    }

    playClick() {
        this.createTone(1200, 0.15, 'square', 0.2);
        setTimeout(() => this.createTone(900, 0.1, 'square', 0.15), 50);
    }

    playSuccess() {
        this.createTone(523, 0.2, 'triangle', 0.3); // C
        setTimeout(() => this.createTone(659, 0.2, 'triangle', 0.3), 100); // E
        setTimeout(() => this.createTone(784, 0.3, 'triangle', 0.3), 200); // G
    }

    playError() {
        this.createTone(200, 0.3, 'sawtooth', 0.25);
        setTimeout(() => this.createTone(150, 0.2, 'sawtooth', 0.2), 150);
    }
}

// Enhanced Effects Manager
class EffectsManager {
    constructor() {
        this.particlesEnabled = true;
        this.matrixEnabled = true;
    }

    createParticles() {
        if (!this.particlesEnabled) return;
        
        const particles = document.createElement('div');
        particles.className = 'particles';
        document.body.appendChild(particles);

        const colors = ['#00ff00', '#00ffff', '#ff6600', '#ff0080', '#ffff00'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + 'vw';
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                particle.style.animationDelay = Math.random() * 20 + 's';
                particle.style.animationDuration = (15 + Math.random() * 10) + 's';
                particles.appendChild(particle);

                setTimeout(() => particle.remove(), 25000);
            }, i * 100);
        }
    }

    createMatrixRain() {
        if (!this.matrixEnabled) return;
        
        const matrix = document.createElement('div');
        matrix.className = 'matrix-rain';
        document.body.appendChild(matrix);

        const characters = 'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789';
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const column = document.createElement('div');
                column.className = 'matrix-column';
                column.style.left = Math.random() * 100 + 'vw';
                column.style.animationDelay = Math.random() * 12 + 's';
                column.style.animationDuration = (8 + Math.random() * 8) + 's';
                column.style.fontSize = (10 + Math.random() * 6) + 'px';
                
                let text = '';
                for (let j = 0; j < 15; j++) {
                    text += characters[Math.floor(Math.random() * characters.length)] + '<br>';
                }
                column.innerHTML = text;
                
                matrix.appendChild(column);
                
                setTimeout(() => column.remove(), 20000);
            }, i * 200);
        }
    }

    createCyberGrid() {
        const grid = document.createElement('div');
        grid.className = 'cyber-grid';
        document.body.appendChild(grid);
    }

    enableEffects() {
        this.particlesEnabled = true;
        this.matrixEnabled = true;
        this.createParticles();
        this.createMatrixRain();
    }

    disableEffects() {
        this.particlesEnabled = false;
        this.matrixEnabled = false;
        document.querySelectorAll('.particles, .matrix-rain').forEach(el => el.remove());
    }
}

// Enhanced Notification Manager
class NotificationManager {
    constructor() {
        this.container = null;
        this.createContainer();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
            max-width: 350px;
        `;
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const bgColors = {
            info: 'rgba(0, 255, 255, 0.9)',
            success: 'rgba(0, 255, 0, 0.9)',
            warning: 'rgba(255, 165, 0, 0.9)',
            error: 'rgba(255, 0, 0, 0.9)'
        };
        
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        
        notification.style.cssText = `
            background: ${bgColors[type]};
            color: #000;
            padding: 12px 16px;
            margin-bottom: 10px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 2px solid #000;
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
            pointer-events: auto;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">${icons[type]}</span>
                <span>${message}</span>
            </div>
        `;
        
        // Add close functionality
        notification.addEventListener('click', () => {
            this.remove(notification);
        });
        
        this.container.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }
        
        return notification;
    }

    remove(notification) {
        if (notification && notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }

    showInfo(message) { this.show(message, 'info'); }
    showSuccess(message) { this.show(message, 'success'); }
    showWarning(message) { this.show(message, 'warning'); }
    showError(message) { this.show(message, 'error'); }
}

// ============================================================================
// UNIFIED DATA PERSISTENCE MANAGER - BULLETPROOF SAVE SYSTEM
// ============================================================================

class DataPersistenceManager {
    constructor() {
        this.maxRetries = 3;
        this.retryDelay = 1000;
        this.isInitialized = false;
        this.currentUser = null;
        this.notificationManager = null;
        this.initialize();
    }

    initialize() {
        // Initialize immediately for localStorage operations
        this.isInitialized = true;
        this.currentUser = window.firebaseAuth?.currentUser || null;
        this.notificationManager = window.dumbassGame?.notificationManager || null;
        console.log('💾 DataPersistenceManager initialized');
        
        // Set up auth listener for when Firebase becomes available
        if (window.firebaseAuth && window.onAuthStateChanged) {
            window.onAuthStateChanged(window.firebaseAuth, (user) => {
                this.currentUser = user;
                console.log('💾 Auth state changed, user:', user?.email || 'anonymous');
            });
        }
        
        // Also check again after a delay for late-loading Firebase
        setTimeout(() => {
            if (!this.currentUser) {
                this.currentUser = window.firebaseAuth?.currentUser || null;
            }
            if (!this.notificationManager) {
                this.notificationManager = window.dumbassGame?.notificationManager || null;
            }
        }, 1000);
    }

    async save(dataType, data, options = {}) {
        if (!this.isInitialized) {
            console.warn('💾 DataPersistenceManager not ready, queuing save...');
            setTimeout(() => this.save(dataType, data, options), 500);
            return;
        }

        const { retries = this.maxRetries, silent = false, forceLocal = false, userSpecific = true } = options;

        try {
            const key = this.generateKey(dataType, userSpecific);
            let success = false;

            // Try Firebase first (if not forced local and user is logged in)
            if (!forceLocal && this.currentUser && window.dataManager?.isInitialized) {
                try {
                    await this.saveToFirebase(dataType, data);
                    success = true;
                    console.log(`☁️ Saved ${dataType} to Firebase`);
                } catch (firebaseError) {
                    console.warn(`⚠️ Firebase save failed for ${dataType}:`, firebaseError);
                }
            }

            // Always save to localStorage as backup/fallback
            try {
                await this.saveToLocalStorage(key, data);
                // Saved to localStorage
                success = true;
            } catch (localError) {
                console.error(`❌ localStorage save failed for ${dataType}:`, localError);
            }

            if (success) {
                if (!silent && this.notificationManager) {
                    this.notificationManager.showSuccess(`💾 ${this.getDataTypeDisplayName(dataType)} saved!`);
                }
                return true;
            } else {
                throw new Error('All save methods failed');
            }

        } catch (error) {
            console.error(`❌ Save failed for ${dataType}:`, error);
            
            if (retries > 0) {
                console.log(`🔄 Retrying save in ${this.retryDelay}ms... (${retries} attempts left)`);
                setTimeout(() => {
                    this.save(dataType, data, { ...options, retries: retries - 1 });
                }, this.retryDelay);
                return;
            }

            if (!silent && this.notificationManager) {
                this.notificationManager.showError(`❌ Failed to save ${this.getDataTypeDisplayName(dataType)}`);
            }
            return false;
        }
    }

    async load(dataType, options = {}) {
        if (!this.isInitialized) {
            console.warn('💾 DataPersistenceManager not ready, waiting...');
            await new Promise(resolve => setTimeout(resolve, 500));
            return this.load(dataType, options);
        }

        const { defaultValue = null, userSpecific = true, preferLocal = false } = options;

        try {
            const key = this.generateKey(dataType, userSpecific);
            let data = null;

            // Try Firebase first (unless preferLocal or user not logged in)
            if (!preferLocal && this.currentUser && window.dataManager?.isInitialized) {
                try {
                    data = await this.loadFromFirebase(dataType);
                    if (data) {
                        console.log(`☁️ Loaded ${dataType} from Firebase`);
                        this.saveToLocalStorage(key, data, true);
                        return data;
                    }
                } catch (firebaseError) {
                    console.warn(`⚠️ Firebase load failed for ${dataType}:`, firebaseError);
                }
            }

            // Fallback to localStorage
            try {
                data = await this.loadFromLocalStorage(key);
                if (data) {
                    console.log(`💾 Loaded ${dataType} from localStorage`);
                    return data;
                }
            } catch (localError) {
                console.warn(`⚠️ localStorage load failed for ${dataType}:`, localError);
            }

            console.log(`📝 Using default value for ${dataType}`);
            return defaultValue;

        } catch (error) {
            console.error(`❌ Load failed for ${dataType}:`, error);
            return defaultValue;
        }
    }

    async saveToFirebase(dataType, data) {
        if (!this.currentUser || !window.dataManager?.isInitialized) {
            throw new Error('Firebase not available');
        }

        const userRef = window.firebaseDoc(window.dataManager.db, 'users', this.currentUser.uid);
        const updateData = {
            [dataType]: data,
            lastUpdated: new Date().toISOString()
        };

        await window.firebaseSetDoc(userRef, updateData, { merge: true });
    }

    async loadFromFirebase(dataType) {
        if (!this.currentUser || !window.dataManager?.isInitialized) {
            throw new Error('Firebase not available');
        }

        const userRef = window.firebaseDoc(window.dataManager.db, 'users', this.currentUser.uid);
        const userDoc = await window.firebaseGetDoc(userRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            return userData[dataType] || null;
        }
        
        return null;
    }

    async saveToLocalStorage(key, data, silent = false) {
        try {
            const serialized = JSON.stringify({
                data: data,
                timestamp: Date.now(),
                version: '2.1'
            });
            
            localStorage.setItem(key, serialized);
            
                    // Save operation completed silently
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                this.clearOldData();
                localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now(), version: '2.1' }));
                console.warn('⚠️ localStorage was full, cleared old data and retried');
            } else {
                throw error;
            }
        }
    }

    async loadFromLocalStorage(key) {
        try {
            const stored = localStorage.getItem(key);
            if (!stored) return null;

            const parsed = JSON.parse(stored);
            
            if (parsed && typeof parsed === 'object' && parsed.data !== undefined) {
                return parsed.data;
            } else {
                this.saveToLocalStorage(key, parsed, true);
                return parsed;
            }
        } catch (error) {
            console.warn(`⚠️ Failed to parse localStorage data for ${key}:`, error);
            return null;
        }
    }

    generateKey(dataType, userSpecific = true) {
        const prefix = 'dumbassgames_';
        const userSuffix = userSpecific ? 
            (this.currentUser ? `_${this.currentUser.uid}` : '_anonymous') : 
            '';
        return `${prefix}${dataType}${userSuffix}`;
    }

    getDataTypeDisplayName(dataType) {
        const displayNames = {
            userProfile: 'Profile',
            favorites: 'Favorites',
            games: 'Games',
            theme: 'Theme',
            music: 'Music',
            searchHistory: 'Search History'
        };
        return displayNames[dataType] || dataType;
    }

    clearOldData() {
        const keysToCheck = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('dumbassgames_')) {
                keysToCheck.push(key);
            }
        }

        const keyData = keysToCheck.map(key => {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                return { key, timestamp: data.timestamp || 0 };
            } catch {
                return { key, timestamp: 0 };
            }
        }).sort((a, b) => a.timestamp - b.timestamp);

        const toRemove = keyData.slice(0, Math.floor(keyData.length * 0.25));
        toRemove.forEach(({ key }) => {
            localStorage.removeItem(key);
            console.log(`🧹 Removed old data: ${key}`);
        });
    }

    // Convenience methods
    async saveUserProfile(profile) { return this.save('userProfile', profile, { userSpecific: true }); }
    async loadUserProfile(defaultProfile = null) { return this.load('userProfile', { defaultValue: defaultProfile, userSpecific: true }); }
    async saveFavorites(favorites) { return this.save('favorites', favorites, { userSpecific: true }); }
    async loadFavorites() { return this.load('favorites', { defaultValue: [], userSpecific: true }); }
    async saveTheme(theme) { return this.save('theme', theme, { userSpecific: false, silent: true }); }
    async loadTheme() { return this.load('theme', { defaultValue: null, userSpecific: false }); }
    async saveMusic(musicData) { return this.save('music', musicData, { userSpecific: true, silent: true }); }
    async loadMusic() { return this.load('music', { defaultValue: { playlist: [], library: [] }, userSpecific: true }); }
    async saveSearchHistory(history) { return this.save('searchHistory', history, { userSpecific: false, silent: true }); }
    async loadSearchHistory() { return this.load('searchHistory', { defaultValue: { totalSearches: 0, popularTerms: {}, noResultsTerms: {}, lastSearched: null }, userSpecific: false }); }
}

// Enhanced Admin Console
class DumbassGameAdmin {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.setupConsoleCommands();
    }

    setupConsoleCommands() {
        window.dumbassGameAdmin = {
            help: () => {
                console.group('%c🎮 DUMBASSGAMES ADMIN COMMANDS', 'color: #00ffff; font-weight: bold; font-size: 14px;');
                console.log('%c=== GAME MANAGEMENT ===', 'color: #00ffff; font-weight: bold;');
                console.log('%caddGame(title, description, url, image?) - Add a new game', 'color: #00ff00;');
                console.log('%cremoveGame(id) - Remove game by ID', 'color: #00ff00;');
                console.log('%clistGames() - Show all games', 'color: #00ff00;');
                console.log('%cclearGames() - Remove all games', 'color: #00ff00;');
                console.log('%cbackup() - Backup games to console', 'color: #00ff00;');
                console.log('%crestore(data) - Restore games from backup', 'color: #00ff00;');
                console.log('%cstats() - Show system statistics', 'color: #00ff00;');
                console.log('%c=== SYSTEM CONTROLS ===', 'color: #00ffff; font-weight: bold;');
                console.log('%ctoggleSound() - Toggle sound effects', 'color: #00ff00;');
                console.log('%ctoggleEffects() - Toggle visual effects', 'color: #00ff00;');
                console.log('%c=== MUSIC PLAYER ===', 'color: #00ffff; font-weight: bold;');
                console.log('%cplayMusic() - Start playing music', 'color: #00ff00;');
                console.log('%cpauseMusic() - Pause music', 'color: #00ff00;');
                console.log('%cnextTrack() - Skip to next track', 'color: #00ff00;');
                console.log('%cpreviousTrack() - Go to previous track', 'color: #00ff00;');
                console.log('%cshuffleMusic() - Toggle shuffle mode', 'color: #00ff00;');
                console.log('%csetVolume(0-100) - Set music volume', 'color: #00ff00;');
                console.log('%clistTracks() - Show all tracks', 'color: #00ff00;');
                console.log('%caddTrack(title, url, duration) - Add new track', 'color: #00ff00;');
                console.log('%cremoveTrack(index) - Remove track by index', 'color: #00ff00;');
                console.log('%creloadPlaylist() - Force reload playlist display', 'color: #00ff00;');
                console.log('%c=== SEARCH ANALYTICS ===', 'color: #00ffff; font-weight: bold;');
                console.log('%csearchAnalytics() - View detailed search analytics', 'color: #00ff00;');
                console.log('%ctopSearchTerms() - Show most popular searches', 'color: #00ff00;');
                console.log('%cproblemSearches() - Show searches with no results', 'color: #00ff00;');
                console.log('%csearchHistory() - View complete search history', 'color: #00ff00;');
                console.log('%cclearSearchHistory() - Clear all search history', 'color: #00ff00;');
                console.log('%ctestSearch(term) - Test search functionality', 'color: #00ff00;');
                console.log('%c=== FIREBASE DATABASE ===', 'color: #00ffff; font-weight: bold;');
                console.log('%ccleanupDuplicates() - Remove duplicate games from Firebase', 'color: #00ff00;');
                console.log('%cgetFirebaseStats() - Show Firebase database statistics', 'color: #00ff00;');
                console.log('%cnukeFirebase() - [DANGER] Delete ALL games from Firebase', 'color: #ff4444;');
                console.log('%c=== TIER SYSTEM ===', 'color: #00ffff; font-weight: bold;');
                console.log('%cmigrateTiers() - Force migrate existing profiles to tier system', 'color: #00ff00;');
                console.log('%ccheckTierProfile() - Check current user tier profile', 'color: #00ff00;');
                console.log('%ctestUpgrade(tier) - Test tier upgrade simulation (PRO/DEV)', 'color: #00ff00;');
                console.log('%cforceUpgradeButton() - Force show upgrade button for testing', 'color: #00ff00;');
                console.log('%c=== SITE OWNER MONITORING ===', 'color: #ffff00; font-weight: bold;');
                console.log('%cdailyReport() - Generate daily site activity report', 'color: #ffff00;');
                console.log('%crecentSignups() - Show recent user signups', 'color: #ffff00;');
                console.log('%crecentErrors() - Show recent site errors', 'color: #ffff00;');
                console.log('%csiteHealth() - Check overall site health status', 'color: #ffff00;');
                console.log('%cliveStats() - Show live site statistics', 'color: #ffff00;');
                console.log('%c=== AUTOMATION SYSTEM ===', 'color: #ff00ff; font-weight: bold;');
                console.log('%cenableEmailNotifications() - Turn on email alerts', 'color: #ff00ff;');
                console.log('%cenableTwitterIntegration() - Turn on Twitter posts', 'color: #ff00ff;');
                console.log('%cdisableEmailNotifications() - Turn off email alerts', 'color: #ff00ff;');
                console.log('%cdisableTwitterIntegration() - Turn off Twitter posts', 'color: #ff00ff;');
                console.log('%cgetAutomationStatus() - Check automation status', 'color: #ff00ff;');
                console.log('%cgenerateDailyTweet() - Generate daily stats tweet', 'color: #ff00ff;');
                console.log('%ctrackGamePlay("Game Title") - Track game play for tweets', 'color: #ff00ff;');
                console.log('%c=== DEBUG COMMANDS ===', 'color: #00ffff; font-weight: bold;');
                console.log('%cdebugProfile() - Test profile save/load functionality', 'color: #00ff00;');
                console.groupEnd();
                return 'Commands loaded! 🚀';
            },

            addGame: (title, description, url, image = null) => {
                if (!title || !description || !url) {
                    console.error('Missing required parameters: title, description, url');
                    return false;
                }
                this.game.addGame({ title, description, url, image });
                return `Game "${title}" added successfully! 🎮`;
            },

            removeGame: (id) => {
                const game = this.game.games.find(g => g.id === id);
                if (!game) {
                    console.error('Game not found');
                    return false;
                }
                this.game.deleteGame(id);
                return `Game "${game.title}" removed! 🗑️`;
            },

            listGames: () => {
                console.table(this.game.games);
                return `Found ${this.game.games.length} games`;
            },

            clearGames: () => {
                if (confirm('🚨 This will delete ALL games. Are you sure?')) {
                    this.game.games = [];
                    this.game.saveGames();
                    this.game.renderGames();
                    return 'All games cleared! 💥';
                }
                return 'Operation cancelled';
            },

            backup: () => {
                const backup = JSON.stringify(this.game.games, null, 2);
                console.log('%cGAMES BACKUP:', 'color: #00ffff; font-weight: bold;');
                console.log(backup);
                return 'Backup created! Copy the JSON above to save. 📋';
            },

            restore: (data) => {
                try {
                    const games = typeof data === 'string' ? JSON.parse(data) : data;
                    this.game.games = games;
                    this.game.saveGames();
                    this.game.renderGames();
                    return `Restored ${games.length} games! 🔄`;
                } catch (e) {
                    console.error('Invalid backup data:', e);
                    return 'Restore failed! Invalid data format.';
                }
            },

            stats: () => {
                const stats = {
                    totalGames: this.game.games.length,
                    soundEnabled: this.game.soundSystem.sfxEnabled,
                    effectsEnabled: this.game.effectsManager.particlesEnabled,
                    storageUsed: localStorage.getItem('dumbassGames')?.length || 0,
                    uptime: performance.now() / 1000
                };
                console.table(stats);
                return stats;
            },

            enableEffects: () => {
                this.game.effectsManager.enableEffects();
                return 'Visual effects enabled! ✨';
            },

            disableEffects: () => {
                this.game.effectsManager.disableEffects();
                return 'Visual effects disabled! 💤';
            },

            // Music Player Commands
            playMusic: () => {
                if (window.musicPlayer) {
                    window.musicPlayer.play();
                    return '🎵 Music started playing!';
                }
                return '❌ Music player not initialized';
            },

            pauseMusic: () => {
                if (window.musicPlayer) {
                    window.musicPlayer.pause();
                    return '⏸️ Music paused!';
                }
                return '❌ Music player not initialized';
            },

            nextTrack: () => {
                if (window.musicPlayer) {
                    window.musicPlayer.nextTrack();
                    return '⏭️ Skipped to next track!';
                }
                return '❌ Music player not initialized';
            },

            previousTrack: () => {
                if (window.musicPlayer) {
                    window.musicPlayer.previousTrack();
                    return '⏮️ Previous track!';
                }
                return '❌ Music player not initialized';
            },

            shuffleMusic: () => {
                if (window.musicPlayer) {
                    window.musicPlayer.toggleShuffle();
                    return `🔀 Shuffle ${window.musicPlayer.isShuffling ? 'ON' : 'OFF'}!`;
                }
                return '❌ Music player not initialized';
            },

            setVolume: (volume) => {
                if (window.musicPlayer) {
                    const vol = Math.max(0, Math.min(100, volume));
                    window.musicPlayer.setVolume(vol);
                    return `🔊 Volume set to ${vol}%`;
                }
                return '❌ Music player not initialized';
            },

            listTracks: () => {
                if (window.musicPlayer) {
                    console.table(window.musicPlayer.playlist);
                    return `🎵 Found ${window.musicPlayer.playlist.length} tracks`;
                }
                return '❌ Music player not initialized';
            },

            addTrack: (title, url, duration = "0:00") => {
                if (window.musicPlayer) {
                    window.musicPlayer.addTrack(title, url, duration);
                    return `🎵 Added track: ${title}`;
                }
                return '❌ Music player not initialized';
            },

            removeTrack: (index) => {
                if (window.musicPlayer) {
                    window.musicPlayer.removeTrack(index);
                    return `🗑️ Removed track at index ${index}`;
                }
                return '❌ Music player not initialized';
            },

            reloadPlaylist: () => {
                if (window.musicPlayer) {
                    window.musicPlayer.loadPlaylist();
                    return `🔄 Playlist reloaded with ${window.musicPlayer.playlist.length} tracks`;
                }
                return '❌ Music player not initialized';
            },

            // Search Analytics Commands 🔍📊
            searchAnalytics: () => {
                if (window.enhancedGameManager) {
                    const analytics = window.enhancedGameManager.getSearchAnalytics();
                    console.group('%c🔍 SEARCH ANALYTICS REPORT', 'color: #00ffff; font-weight: bold; font-size: 14px;');
                    console.log(`%cTotal Searches: ${analytics.totalSearches}`, 'color: #00ff00; font-weight: bold;');
                    console.log(`%cLast Search: ${analytics.lastSearched ? new Date(analytics.lastSearched).toLocaleString() : 'Never'}`, 'color: #00ff00;');
                    
                    if (analytics.topSearchTerms.length > 0) {
                        console.log('%c📈 TOP SEARCH TERMS:', 'color: #00ffff; font-weight: bold;');
                        console.table(analytics.topSearchTerms.map(([term, count]) => ({ term, searches: count })));
                    }
                    
                    if (analytics.problemTerms.length > 0) {
                        console.log('%c❌ PROBLEMATIC SEARCHES (No Results):', 'color: #ff4444; font-weight: bold;');
                        console.table(analytics.problemTerms.map(([term, count]) => ({ term, attempts: count })));
                    }
                    
                    console.groupEnd();
                    return analytics;
                }
                return '❌ Enhanced search system not initialized';
            },

            topSearchTerms: () => {
                if (window.enhancedGameManager) {
                    const analytics = window.enhancedGameManager.getSearchAnalytics();
                    console.table(analytics.topSearchTerms.map(([term, count]) => ({ 
                        term, 
                        searches: count,
                        percentage: ((count / analytics.totalSearches) * 100).toFixed(1) + '%'
                    })));
                    return `📊 Top ${analytics.topSearchTerms.length} search terms displayed`;
                }
                return '❌ Enhanced search system not initialized';
            },

            problemSearches: () => {
                if (window.enhancedGameManager) {
                    const analytics = window.enhancedGameManager.getSearchAnalytics();
                    if (analytics.problemTerms.length === 0) {
                        return '✅ No problematic searches found!';
                    }
                    console.table(analytics.problemTerms.map(([term, count]) => ({ 
                        term, 
                        attempts: count,
                        suggestion: 'Consider adding games or synonyms for this term'
                    })));
                    return `⚠️ Found ${analytics.problemTerms.length} problematic search terms`;
                }
                return '❌ Enhanced search system not initialized';
            },

            searchHistory: () => {
                if (window.enhancedGameManager) {
                    const history = window.enhancedGameManager.searchHistory;
                    if (history.length === 0) {
                        return '📝 No search history found';
                    }
                    console.group('%c📝 SEARCH HISTORY', 'color: #00ffff; font-weight: bold;');
                    history.forEach((term, index) => {
                        console.log(`%c${index + 1}. ${term}`, 'color: #00ff00;');
                    });
                    console.groupEnd();
                    return `📚 Found ${history.length} search terms in history`;
                }
                return '❌ Enhanced search system not initialized';
            },

            clearSearchHistory: () => {
                if (window.enhancedGameManager) {
                    window.enhancedGameManager.searchHistory = [];
                    localStorage.removeItem('dumbassgames_search_history');
                    localStorage.removeItem('dumbassgames_search_analytics');
                    return '🧹 Search history and analytics cleared!';
                }
                return '❌ Enhanced search system not initialized';
            },

            testSearch: (searchTerm) => {
                if (!searchTerm) {
                    return '❌ Please provide a search term: testSearch("your term")';
                }
                if (window.enhancedGameManager) {
                    const startTime = performance.now();
                    window.enhancedGameManager.performAdvancedSearch(searchTerm);
                    const endTime = performance.now();
                    const results = window.enhancedGameManager.filteredGames.length;
                    
                    const report = {
                        searchTerm: searchTerm,
                        results: results,
                        searchTime: `${(endTime - startTime).toFixed(2)}ms`,
                        totalGames: window.enhancedGameManager.games.length,
                        successRate: `${((results / window.enhancedGameManager.games.length) * 100).toFixed(1)}%`
                    };
                    
                    console.table(report);
                    return `🔍 Search test completed: ${results} results in ${report.searchTime}`;
                }
                return '❌ Enhanced search system not initialized';
            },

            // New Music Manager Commands 🎵🚀
            openMusicManager: () => {
                if (window.musicPlayer) {
                    window.musicPlayer.openMusicManager();
                    return '🎵 Music Manager opened!';
                }
                return '❌ Music player not initialized';
            },

            clearPlaylist: () => {
                if (window.musicPlayer) {
                    window.musicPlayer.clearPlaylist();
                    return '🗑️ Playlist cleared!';
                }
                return '❌ Music player not initialized';
            },

            shufflePlaylist: () => {
                if (window.musicPlayer) {
                    window.musicPlayer.shufflePlaylist();
                    return '🔀 Playlist shuffled!';
                }
                return '❌ Music player not initialized';
            },

            listLibrary: () => {
                if (window.musicPlayer) {
                    console.table(window.musicPlayer.musicLibrary);
                    return `🎵 Found ${window.musicPlayer.musicLibrary.length} tracks in library`;
                }
                return '❌ Music player not initialized';
            },

            addToLibrary: (title, url, duration = "0:00") => {
                if (window.musicPlayer) {
                    window.musicPlayer.addToLibrary(title, url, duration);
                    return `🎵 Added to library: ${title}`;
                }
                return '❌ Music player not initialized';
            },

            // Firebase Database Management Commands 🔥💾
            cleanupDuplicates: async () => {
                if (window.dataManager && window.dataManager.cleanupDuplicateGames) {
                    console.log('🧹 Starting Firebase cleanup... This may take a moment...');
                    try {
                        const result = await window.dataManager.cleanupDuplicateGames();
                        
                        if (result.duplicatesRemoved > 0) {
                            console.log(`🎉 CLEANUP COMPLETE!`);
                            console.log(`📊 Original count: ${result.originalCount}`);
                            console.log(`🗑️ Duplicates removed: ${result.duplicatesRemoved}`);
                            console.log(`✅ Final count: ${result.finalCount}`);
                            
                            // Refresh the game manager to show updated count
                            if (window.enhancedGameManager) {
                                await window.enhancedGameManager.syncWithFirebase();
                                console.log('🔄 Game display refreshed');
                            }
                            
                            return `✅ Removed ${result.duplicatesRemoved} duplicates! Final count: ${result.finalCount}`;
                        } else {
                            return result.message || '✅ No duplicates found!';
                        }
                    } catch (error) {
                        console.error('❌ Cleanup failed:', error);
                        return '❌ Cleanup failed - check console for details';
                    }
                }
                return '❌ Firebase not initialized';
            },

            getFirebaseStats: async () => {
                if (window.dataManager && window.dataManager.getGames) {
                    try {
                        console.log('📊 Fetching Firebase statistics...');
                        const games = await window.dataManager.getGames();
                        
                        // Analyze the data
                        const titles = games.map(g => g.title.toLowerCase().trim());
                        const uniqueTitles = [...new Set(titles)];
                        const duplicateCount = games.length - uniqueTitles.length;
                        
                        // Count by category
                        const categoryCount = {};
                        games.forEach(game => {
                            const category = game.category || 'unknown';
                            categoryCount[category] = (categoryCount[category] || 0) + 1;
                        });

                        const stats = {
                            totalGames: games.length,
                            uniqueGames: uniqueTitles.length,
                            duplicates: duplicateCount,
                            duplicatePercentage: ((duplicateCount / games.length) * 100).toFixed(1) + '%',
                            categories: categoryCount
                        };

                        console.group('%c📊 FIREBASE DATABASE STATISTICS', 'color: #00ffff; font-weight: bold; font-size: 14px;');
                        console.log(`%cTotal Games: ${stats.totalGames}`, 'color: #00ff00; font-weight: bold;');
                        console.log(`%cUnique Games: ${stats.uniqueGames}`, 'color: #00ff00; font-weight: bold;');
                        console.log(`%cDuplicates: ${stats.duplicates} (${stats.duplicatePercentage})`, duplicateCount > 0 ? 'color: #ff4444; font-weight: bold;' : 'color: #00ff00;');
                        
                        if (Object.keys(categoryCount).length > 0) {
                            console.log('%c📂 Games by Category:', 'color: #00ffff; font-weight: bold;');
                            console.table(categoryCount);
                        }
                        console.groupEnd();

                        return stats;
                    } catch (error) {
                        console.error('❌ Failed to fetch stats:', error);
                        return '❌ Failed to fetch Firebase statistics';
                    }
                }
                return '❌ Firebase not initialized';
            },

            nukeFirebase: async () => {
                if (window.dataManager) {
                    const confirmation = prompt('🚨 WARNING: This will DELETE ALL GAMES from Firebase!\n\nType "DELETE ALL GAMES" to confirm:');
                    if (confirmation === 'DELETE ALL GAMES') {
                        try {
                            console.log('💥 NUKING FIREBASE DATABASE...');
                            const games = await window.dataManager.getGames();
                            let deleted = 0;
                            
                            for (const game of games) {
                                await window.dataManager.deleteGame(game.id);
                                deleted++;
                                if (deleted % 50 === 0) {
                                    console.log(`🗑️ Deleted ${deleted}/${games.length} games...`);
                                }
                            }
                            
                            console.log(`💥 NUCLEAR COMPLETE: Deleted ${deleted} games from Firebase`);
                            
                            // Refresh the game manager
                            if (window.enhancedGameManager) {
                                await window.enhancedGameManager.syncWithFirebase();
                                console.log('🔄 Game display refreshed');
                            }
                            
                            return `💥 NUKED! Deleted ${deleted} games from Firebase`;
                        } catch (error) {
                            console.error('❌ Nuclear operation failed:', error);
                            return '❌ Nuclear operation failed - check console';
                        }
                    } else {
                        return '✋ Nuclear operation cancelled';
                    }
                }
                return '❌ Firebase not initialized';
            },

            // Profile Debug Commands
            debugProfile: async () => {
                if (window.userProfileManager) {
                    return await window.userProfileManager.debugSaveLoad();
                }
                return '❌ UserProfileManager not initialized';
            },

            // Tier System Commands
            migrateTiers: async () => {
                if (!window.userProfileManager?.currentUser) {
                    return '❌ User not logged in - please sign in first';
                }
                
                console.log('🔄 Starting tier migration for current user...');
                
                try {
                    await window.userProfileManager.loadUserProfile();
                    console.log('✅ Tier migration completed!');
                    
                    // Update the tier display
                    window.userProfileManager.updateTierDisplay();
                    
                    return '✅ Profile migrated to tier system successfully!';
                } catch (error) {
                    console.error('❌ Migration failed:', error);
                    return '❌ Migration failed - check console';
                }
            },

            checkTierProfile: () => {
                if (!window.userProfileManager?.userProfile) {
                    return '❌ No user profile loaded - please sign in';
                }
                
                const profile = window.userProfileManager.userProfile;
                console.group('%c💎 TIER PROFILE CHECK', 'color: #00ffff; font-weight: bold;');
                console.log('%cUser Email:', 'color: #00ff00;', profile.email);
                console.log('%cTier:', 'color: #00ff00;', profile.tier || 'NOT SET');
                console.log('%cTier Expiry:', 'color: #00ff00;', profile.tierExpiry || 'N/A');
                console.log('%cSubmission Count:', 'color: #00ff00;', profile.submissionCount);
                console.log('%cLast Submission:', 'color: #00ff00;', profile.lastSubmission || 'Never');
                console.log('%cFavorites Count:', 'color: #00ff00;', profile.favoritesCount || 0);
                console.log('%cGames Played:', 'color: #00ff00;', profile.gamesPlayed || 0);
                
                // Check if migration is needed
                const needsMigration = !profile.tier || !profile.submissionCount;
                console.log('%cNeeds Migration:', 'color: #ffff00;', needsMigration ? 'YES' : 'NO');
                
                console.groupEnd();
                
                return `Profile check complete - Tier: ${profile.tier || 'NOT SET'}`;
            },

            testUpgrade: async (tier) => {
                if (!window.userProfileManager?.paymentManager) {
                    return '❌ Payment manager not initialized';
                }
                
                if (!tier || !['PRO', 'DEV'].includes(tier.toUpperCase())) {
                    return '❌ Invalid tier - use PRO or DEV';
                }
                
                const tierUpper = tier.toUpperCase();
                const price = tierUpper === 'PRO' ? 5 : 10;
                
                console.log(`🧪 Testing ${tierUpper} upgrade simulation ($${price}/month)...`);
                
                try {
                    await window.userProfileManager.paymentManager.upgradeUser(tierUpper);
                    window.userProfileManager.updateTierDisplay();
                    return `✅ Successfully upgraded to ${tierUpper} tier (simulation)!`;
                } catch (error) {
                    console.error('❌ Test upgrade failed:', error);
                    return '❌ Test upgrade failed - check console';
                }
            },

            forceUpgradeButton: () => {
                const tierUpgrade = document.getElementById('tierUpgrade');
                if (tierUpgrade) {
                    tierUpgrade.style.display = 'block';
                    console.log('✅ Forced upgrade button to show');
                    return '✅ Upgrade button forced to show';
                } else {
                    console.warn('⚠️ tierUpgrade element not found');
                    return '❌ tierUpgrade element not found in DOM';
                }
            },

            // 👑 SITE OWNER MONITORING COMMANDS
            dailyReport: () => {
                if (window.siteMonitoring) {
                    return window.siteMonitoring.getTodaysActivity();
                }
                return '❌ Monitoring system not initialized';
            },

            recentSignups: () => {
                if (window.siteMonitoring) {
                    return window.siteMonitoring.getRecentSignups();
                }
                return '❌ Monitoring system not initialized';
            },

            recentErrors: () => {
                if (window.siteMonitoring) {  
                    return window.siteMonitoring.getRecentErrors();
                }
                return '❌ Monitoring system not initialized';
            },

            siteHealth: () => {
                console.group('%c🏥 SITE HEALTH CHECK', 'color: #00ffff; font-weight: bold; font-size: 14px;');
                console.log('Firebase Status:', window.firebaseCollection ? '✅ Connected' : '❌ Disconnected');
                console.log('Auth Status:', window.firebaseAuth?.currentUser ? '✅ Authenticated' : '❌ Not authenticated');
                console.log('Game Manager:', window.enhancedGameManager ? '✅ Active' : '❌ Inactive');
                console.log('Music Player:', window.musicPlayer ? '✅ Active' : '❌ Inactive');
                console.log('Monitoring:', window.siteMonitoring ? '✅ Active' : '❌ Inactive');
                console.log('Users Online:', document.querySelectorAll('.auth-profile').length);
                console.log('Games Loaded:', window.enhancedGameManager?.allGames?.length || 0);
                console.groupEnd();
                return 'Site health check complete';
            },

            liveStats: () => {
                console.group('%c📈 LIVE SITE STATISTICS', 'color: #00ffff; font-weight: bold; font-size: 14px;');
                console.log('Page Load Time:', performance.now().toFixed(2) + 'ms');
                console.log('Memory Usage:', (performance.memory?.usedJSHeapSize / 1024 / 1024).toFixed(2) + 'MB');
                console.log('Network Status:', navigator.onLine ? '✅ Online' : '❌ Offline');
                console.log('User Agent:', navigator.userAgent);
                console.log('Referrer:', document.referrer || 'Direct');
                console.log('Current URL:', window.location.href);
                console.groupEnd();
                return 'Live stats displayed';
            },

            // 🤖 AUTOMATION SYSTEM COMMANDS
            enableEmailNotifications: () => {
                if (window.siteMonitoring) {
                    window.siteMonitoring.enableEmailNotifications();
                    return '📧 Email notifications ENABLED! Set up EmailJS to receive alerts.';
                }
                // Auto-fix if possible
                try {
                    console.log('🔧 Auto-fixing site monitoring for email notifications...');
                    window.siteMonitoring = new SiteOwnerMonitoring();
                    window.siteMonitoring.enableEmailNotifications();
                    window.siteMonitoring.enableTwitterIntegration();
                    return '📧 Email notifications ENABLED (after auto-fix)! Set up EmailJS to receive alerts.';
                } catch (error) {
                    return '❌ Monitoring system not initialized - run fixSiteMonitoring()';
                }
            },

            enableTwitterIntegration: () => {
                if (window.siteMonitoring) {
                    window.siteMonitoring.enableTwitterIntegration();
                    return '🐦 Twitter integration ENABLED! Connect your API to start posting.';
                }
                // Auto-fix if possible
                try {
                    console.log('🔧 Auto-fixing site monitoring for Twitter integration...');
                    window.siteMonitoring = new SiteOwnerMonitoring();
                    window.siteMonitoring.enableTwitterIntegration();
                    window.siteMonitoring.enableEmailNotifications();
                    return '🐦 Twitter integration ENABLED (after auto-fix)! Connect your API to start posting.';
                } catch (error) {
                    return '❌ Monitoring system not initialized - run fixSiteMonitoring()';
                }
            },

            disableEmailNotifications: () => {
                if (window.siteMonitoring) {
                    window.siteMonitoring.disableEmailNotifications();
                    return '📧 Email notifications DISABLED';
                }
                return '❌ Monitoring system not initialized - run fixSiteMonitoring()';
            },

            disableTwitterIntegration: () => {
                if (window.siteMonitoring) {
                    window.siteMonitoring.disableTwitterIntegration();
                    return '🐦 Twitter integration DISABLED';
                }
                return '❌ Monitoring system not initialized - run fixSiteMonitoring()';
            },

            getAutomationStatus: () => {
                if (window.siteMonitoring) {
                    const status = window.siteMonitoring.getAutomationStatus();
                    console.group('%c🤖 AUTOMATION STATUS', 'color: #ff00ff; font-weight: bold; font-size: 14px;');
                    console.log('Email Notifications:', status.email ? '✅ ENABLED' : '❌ DISABLED');
                    console.log('Twitter Integration:', status.twitter ? '✅ ENABLED' : '❌ DISABLED');
                    console.log('Total Signups Tracked:', status.stats.totalSignups);
                    console.log('Total Submissions Tracked:', status.stats.totalSubmissions);
                    console.log('Total Plays Tracked:', status.stats.totalPlays);
                    console.log('Popular Games:', status.stats.popularGames);
                    console.log('User Locations:', status.stats.userLocations);
                    console.log('Device Types:', status.stats.deviceTypes);
                    console.groupEnd();
                    return status;
                }
                return '❌ Monitoring system not initialized - run fixSiteMonitoring()';
            },

            // 🔧 SYSTEM REPAIR COMMANDS
            fixSiteMonitoring: () => {
                console.log('🔧 Attempting to fix Site Monitoring system...');
                try {
                    if (!window.siteMonitoring) {
                        console.log('🔄 Initializing Site Monitoring...');
                        window.siteMonitoring = new SiteOwnerMonitoring();
                        
                        // Auto-enable features
                        window.siteMonitoring.enableTwitterIntegration();
                        window.siteMonitoring.enableEmailNotifications();
                        
                        console.log('✅ Site Monitoring initialized and automation enabled!');
                        return '✅ Site monitoring system fixed and ready!';
                    } else {
                        console.log('✅ Site monitoring already working');
                        return '✅ Site monitoring system is already working';
                    }
                } catch (error) {
                    console.error('❌ Failed to fix site monitoring:', error);
                    return '❌ Failed to fix site monitoring - check console for errors';
                }
            },

            systemCheck: () => {
                console.log('🔍 COMPREHENSIVE SYSTEM CHECK:');
                console.log('=====================================');
                
                const systems = {
                    'Main Game': !!window.dumbassGame,
                    'Admin System': !!window.dumbassGameAdmin,
                    'Site Monitoring': !!window.siteMonitoring,
                    'Twitter API': !!window.TwitterAPI,
                    'Twitter Configured': window.TwitterAPI?.isConfigured,
                    'Firebase Auth': !!window.authManager,
                    'Enhanced Game Manager': !!window.enhancedGameManager,
                    'User Profile Manager': !!window.userProfileManager
                };
                
                Object.entries(systems).forEach(([name, status]) => {
                    console.log(`${status ? '✅' : '❌'} ${name}`);
                });
                
                if (window.siteMonitoring) {
                    const automationStatus = window.siteMonitoring.getAutomationStatus();
                    console.log('🤖 Automation Status:', automationStatus);
                }
                
                console.log('=====================================');
                return 'System check complete - see console for details';
            },

            reinitializeAll: () => {
                console.log('🚀 REINITIALIZING ALL SYSTEMS...');
                
                // Call the main initialization function
                if (typeof initializeAllSystems === 'function') {
                    initializeAllSystems();
                    return '🔄 Reinitialization started - check console for progress';
                } else {
                    return '❌ Main initialization function not found';
                }
            },

            generateDailyTweet: () => {
                if (window.siteMonitoring) {
                    const tweet = window.siteMonitoring.generateDailyTweet();
                    console.log('%c🐦 DAILY TWEET GENERATED:', 'color: #ff00ff; font-weight: bold;');
                    console.log(tweet);
                    return 'Daily tweet generated! Check console for content.';
                }
                return '❌ Monitoring system not initialized - run fixSiteMonitoring()';
            },

            trackGamePlay: (gameTitle) => {
                if (!gameTitle) {
                    return '❌ Please provide a game title: trackGamePlay("Game Name")';
                }
                if (window.siteMonitoring) {
                    window.siteMonitoring.trackGamePlay(gameTitle);
                    return `🎮 Tracked play for "${gameTitle}"`;
                }
                return '❌ Monitoring system not initialized - run fixSiteMonitoring()';
            }
        };
    }
}

// 👑 SITE OWNER MONITORING SYSTEM
class SiteOwnerMonitoring {
    constructor() {
        this.adminEmail = 'dumbassgames@proton.me';
        this.emailEnabled = false;
        this.twitterEnabled = false;
        this.stats = {
            totalSignups: 0,
            totalSubmissions: 0,
            totalPlays: 0,
            popularGames: {},
            userLocations: {},
            deviceTypes: {}
        };
        this.setupEventListeners();
        this.setupEmailJS();
        this.setupAdvancedTracking();
        this.startDailyReporting();
        console.log('👑 Site Owner Monitoring System initialized');
    }

    setupEventListeners() {
        // Track new user signups
        if (window.firebaseAuth) {
            window.firebaseAuth.onAuthStateChanged((user) => {
                if (user && this.isNewUser(user)) {
                    this.reportNewSignup(user);
                }
            });
        }

        // Track errors
        window.addEventListener('error', (error) => {
            this.reportError(error);
        });

        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.reportError({
                message: event.reason?.message || 'Unhandled Promise Rejection',
                filename: 'Promise',
                lineno: 0,
                error: event.reason
            });
        });

        // Track game submissions
        this.trackGameSubmissions();
    }

    isNewUser(user) {
        // Check if user signed up recently (within last hour)  
        const creationTime = new Date(user.metadata.creationTime);
        const now = new Date();
        const hoursDiff = (now - creationTime) / (1000 * 60 * 60);
        return hoursDiff < 1;
    }

    async reportNewSignup(user) {
        const signupData = {
            email: user.email,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'Direct',
            ip: await this.getUserIP(),
            uid: user.uid
        };

        console.group('%c🎉 NEW USER SIGNUP DETECTED!', 'color: #00ff00; font-weight: bold; font-size: 16px;');
        console.log('📧 Email:', signupData.email);
        console.log('🕐 Time:', new Date().toLocaleString());
        console.log('🔗 Referrer:', signupData.referrer);
        console.log('🌍 IP:', signupData.ip);
        console.groupEnd();

        this.storeAdminEvent('signup', signupData);
        this.sendNotification('🎉 NEW USER JOINED!', signupData);
    }

    reportError(error) {
        const errorData = {
            message: error.message,
            filename: error.filename || 'Unknown',
            lineno: error.lineno || 0,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            stack: error.error?.stack || 'No stack trace'
        };

        console.group('%c🚨 ERROR DETECTED', 'color: #ff4444; font-weight: bold; font-size: 14px;');
        console.error('Message:', errorData.message);
        console.error('File:', errorData.filename);
        console.error('Line:', errorData.lineno);
        console.error('Time:', new Date().toLocaleString());
        console.groupEnd();

        this.storeAdminEvent('error', errorData);
    }

    trackGameSubmissions() {
        // Monitor form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'addGameForm' || e.target.classList.contains('game-submission')) {
                const gameData = {
                    title: e.target.gameTitle?.value || 'Unknown',
                    url: e.target.gameUrl?.value || 'Unknown',
                    userEmail: window.firebaseAuth?.currentUser?.email || 'Anonymous',
                    timestamp: new Date().toISOString()
                };
                
                setTimeout(() => {
                    // Check if submission was successful (no error displayed)
                    const errorElement = document.querySelector('.auth-error');
                    if (!errorElement || errorElement.style.display === 'none') {
                        this.reportGameSubmission(gameData);
                    }
                }, 1000);
            }
        });
    }

    reportGameSubmission(gameData) {
        console.group('%c🎮 NEW GAME SUBMITTED!', 'color: #00ffff; font-weight: bold; font-size: 16px;');
        console.log('🎯 Title:', gameData.title);
        console.log('🔗 URL:', gameData.url);
        console.log('👤 User:', gameData.userEmail);
        console.log('🕐 Time:', new Date().toLocaleString());
        console.groupEnd();

        this.storeAdminEvent('gameSubmission', gameData);
        this.sendNotification('🎮 NEW GAME ADDED!', gameData);
    }

    async storeAdminEvent(type, data) {
        try {
            if (window.firebaseCollection) {
                const adminEvent = {
                    type,
                    data,
                    timestamp: new Date().toISOString(),
                    processed: false
                };

                // Store in admin collection for review
                const adminRef = window.firebaseFirestore?.collection('admin_events');
                if (adminRef) {
                    await window.firebaseAddDoc(adminRef, adminEvent);
                }
            }
        } catch (error) {
            console.warn('Could not store admin event:', error);
        }
    }

    async getUserIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch {
            return 'Unknown';
        }
    }

    sendNotification(title, data) {
        // Console notification
        console.log(`📬 ADMIN NOTIFICATION: ${title}`, data);
        
        // Flash the browser tab title
        this.flashTabTitle(title);
        
        // Play notification sound if available
        if (window.dumbassGame?.soundSystem?.sfxEnabled) {
            window.dumbassGame.soundSystem.playSuccess();
        }
    }

    flashTabTitle(message) {
        const originalTitle = document.title;
        let flashCount = 0;
        const flashInterval = setInterval(() => {
            document.title = flashCount % 2 === 0 ? `🔔 ${message}` : originalTitle;
            flashCount++;
            if (flashCount >= 6) {
                clearInterval(flashInterval);
                document.title = originalTitle;
            }
        }, 1000);
    }

    // Generate daily activity report
    async generateDailyReport() {
        try {
            const stats = await this.getDailyStats();
            
            console.group('%c👑 DAILY SITE OWNER REPORT', 'color: #ffff00; font-weight: bold; font-size: 16px;');
            console.log('📅 Date:', new Date().toLocaleDateString());
            console.log('🔥 Site Status:', navigator.onLine ? '✅ ONLINE' : '❌ OFFLINE');
            console.log('👥 New Signups Today:', stats.newSignups);
            console.log('🎮 Games Submitted Today:', stats.gamesSubmitted);
            console.log('📊 Total Games:', stats.totalGames);
            console.log('👤 Total Users Seen:', stats.totalUsers);
            console.log('🚨 Errors Today:', stats.errors);
            console.log('🔍 Top Searches:', stats.topSearches.map(([term, count]) => `${term} (${count})`).join(', ') || 'None');
            console.log('💾 Database Status:', window.firebaseCollection ? '✅ Connected' : '❌ Disconnected');
            console.log('🎵 Music Player:', window.musicPlayer ? '✅ Active' : '❌ Inactive');
            console.groupEnd();

            return stats;
        } catch (error) {
            console.error('Error generating daily report:', error);
            return null;
        }
    }

    async getDailyStats() {
        const stats = {
            newSignups: 0,
            gamesSubmitted: 0,
            totalUsers: 0,
            totalGames: 0,
            errors: 0,
            topSearches: []
        };

        try {
            // Get total games count
            if (window.enhancedGameManager?.allGames) {
                stats.totalGames = window.enhancedGameManager.allGames.length;
            }

            // Get search analytics
            if (window.enhancedGameManager) {
                const searchAnalytics = window.enhancedGameManager.getSearchAnalytics();
                stats.topSearches = searchAnalytics.topSearchTerms.slice(0, 3);
            }

            // Get user count estimate
            if (window.firebaseAuth?.currentUser) {
                stats.totalUsers = 1; // At least current user
            }
        } catch (error) {
            console.warn('Error collecting some stats:', error);
        }

        return stats;
    }

    startDailyReporting() {
        // Generate report every 24 hours at midnight
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const msUntilMidnight = tomorrow.getTime() - now.getTime();
        
        setTimeout(() => {
            this.generateDailyReport();
            // Then every 24 hours after that
            setInterval(() => {
                this.generateDailyReport();
            }, 24 * 60 * 60 * 1000);
        }, msUntilMidnight);

        // Generate initial report after 2 minutes
        setTimeout(() => {
            this.generateDailyReport();
        }, 120000);
    }

    // Manual admin commands
    getTodaysActivity() {
        return this.generateDailyReport();
    }

    getRecentSignups() {
        console.log('📧 Recent signups are tracked in browser console and Firebase admin_events collection');
        return 'Check console logs above for recent signup notifications';
    }

    getRecentErrors() {
        console.log('🚨 Recent errors are tracked in browser console and Firebase admin_events collection');
        return 'Check console logs above for recent error notifications';
    }

    // EmailJS Integration
    setupEmailJS() {
        // Load EmailJS script dynamically
        if (!window.emailjs) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = () => {
                console.log('📧 EmailJS loaded - ready for email notifications');
                // Initialize with your EmailJS user ID (you'll add this later)
                // window.emailjs.init('YOUR_EMAILJS_USER_ID');
            };
            document.head.appendChild(script);
        }
    }

    // Enhanced tracking for Twitter content
    setupAdvancedTracking() {
        // Track user location
        this.getUserLocation();
        
        // Track device type
        this.trackDeviceType();
        
        // Track session start
        this.trackSessionStart();
        
        console.log('📊 Advanced tracking initialized');
    }

    async getUserLocation() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            this.stats.userLocations[data.country_name] = (this.stats.userLocations[data.country_name] || 0) + 1;
            console.log(`🌍 User from ${data.country_name}, ${data.city}`);
        } catch (error) {
            console.log('🌍 Location tracking unavailable');
        }
    }

    trackDeviceType() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const deviceType = isMobile ? 'mobile' : 'desktop';
        this.stats.deviceTypes[deviceType] = (this.stats.deviceTypes[deviceType] || 0) + 1;
        console.log(`📱 Device type: ${deviceType}`);
    }

    trackSessionStart() {
        const sessionId = Date.now() + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('dgSessionId', sessionId);
        console.log(`🎮 Session started: ${sessionId}`);
    }

    // Email notification system
    async sendEmail(template, data) {
        if (!this.emailEnabled || !window.emailjs) {
            console.log('📧 Email notifications not configured yet');
            return;
        }

        try {
            await window.emailjs.send('YOUR_SERVICE_ID', template, {
                to_email: this.adminEmail,
                ...data
            });
            console.log('📧 Email sent successfully');
        } catch (error) {
            console.error('📧 Email send failed:', error);
        }
    }

    // Twitter integration framework
    async sendTweet(message, data = {}) {
        if (!this.twitterEnabled) {
            console.log(`🐦 Would tweet: "${message}"`);
            return;
        }

        // This will connect to your Twitter API when ready
        console.log(`🐦 Twitter: ${message}`, data);
    }

    // Enhanced user signup tracking
    async reportEnhancedSignup(user) {
        this.stats.totalSignups++;
        
        const signupData = {
            email: user.email,
            timestamp: new Date().toLocaleString(),
            location: Object.keys(this.stats.userLocations).pop() || 'Unknown',
            device: Object.keys(this.stats.deviceTypes).pop() || 'Unknown',
            totalUsers: this.stats.totalSignups
        };

        // Send email notification
        await this.sendEmail('new_signup', {
            user_email: signupData.email,
            signup_time: signupData.timestamp,
            user_location: signupData.location,
            device_type: signupData.device,
            total_users: signupData.totalUsers
        });

        // Send tweet for milestones
        if (this.stats.totalSignups % 10 === 0) {
            await this.sendTweet(`🎉 MILESTONE: Just hit ${this.stats.totalSignups} users! Thanks for joining the retro gaming revolution! 🕹️ #DumbassGames #RetroGaming #IndieGames`);
        }

        console.log('📧 Enhanced signup tracking complete');
    }

    // Enhanced game submission tracking
    async reportEnhancedGameSubmission(gameData) {
        this.stats.totalSubmissions++;
        
        const submissionData = {
            title: gameData.title,
            url: gameData.url,
            category: gameData.category || 'Unknown',
            submittedBy: gameData.submittedBy,
            timestamp: new Date().toLocaleString()
        };

        // Send email notification
        await this.sendEmail('new_game', {
            game_title: submissionData.title,
            game_url: submissionData.url,
            game_category: submissionData.category,
            submitted_by: submissionData.submittedBy,
            submission_time: submissionData.timestamp
        });

        // Send tweet for new games
        await this.sendTweet(`🎮 NEW GAME ALERT! "${submissionData.title}" just joined our retro arcade! Check it out at dumbassgames.xyz 🕹️ #NewGame #${submissionData.category} #RetroGaming`);

        console.log('🎮 Enhanced game submission tracking complete');
    }

    // Track game plays for Twitter content
    trackGamePlay(gameTitle) {
        this.stats.totalPlays++;
        this.stats.popularGames[gameTitle] = (this.stats.popularGames[gameTitle] || 0) + 1;
        
        // Tweet trending games
        if (this.stats.popularGames[gameTitle] === 50) {
            this.sendTweet(`🔥 TRENDING: "${gameTitle}" is blowing up with 50+ plays! What's the hype about? Check it out! 🎮 #TrendingGame #RetroGaming`);
        }
    }

    // Generate Twitter-worthy daily stats
    async generateDailyTweet() {
        const topGame = Object.entries(this.stats.popularGames)
            .sort(([,a], [,b]) => b - a)[0];
        
        const tweet = `📊 24 HOURS AT DUMBASSGAMES:
🎮 ${this.stats.totalPlays} games played
👥 ${this.stats.totalSignups} new gamers joined
🏆 Top game: ${topGame ? topGame[0] : 'Various classics'}
🕹️ Pure retro fun at dumbassgames.xyz
#DailyStats #RetroGaming #IndieGames`;

        await this.sendTweet(tweet);
        
        return tweet;
    }

    // Enable automation systems
    enableEmailNotifications() {
        this.emailEnabled = true;
        console.log('📧 Email notifications ENABLED');
    }

    enableTwitterIntegration() {
        this.twitterEnabled = true;
        console.log('🐦 Twitter integration ENABLED');
    }

    // Disable automation systems
    disableEmailNotifications() {
        this.emailEnabled = false;
        console.log('📧 Email notifications DISABLED');
    }

    disableTwitterIntegration() {
        this.twitterEnabled = false;
        console.log('🐦 Twitter integration DISABLED');
    }

    // Get automation status
    getAutomationStatus() {
        return {
            email: this.emailEnabled,
            twitter: this.twitterEnabled,
            stats: this.stats
        };
    }
}

// Global functions for HTML integration
function showAddGameForm() {
    if (window.dumbassGame && window.dumbassGame.showAddGameForm) {
        window.dumbassGame.showAddGameForm();
    } else {
        console.warn('⚠️ dumbassGame not ready yet, please wait...');
    }
}

function hideAddGameForm() {
    if (window.dumbassGame && window.dumbassGame.hideAddGameForm) {
        window.dumbassGame.hideAddGameForm();
    }
}

function toggleSound() {
    if (window.soundEnabled !== undefined && window.dumbassGame && window.dumbassGame.soundSystem) {
        window.soundEnabled = !window.soundEnabled;
        window.dumbassGame.soundSystem.sfxEnabled = window.soundEnabled;
        const soundBtn = document.getElementById('soundToggle');
        if (soundBtn) {
            soundBtn.innerHTML = window.soundEnabled ? '🔊' : '🔇';
            soundBtn.style.color = window.soundEnabled ? '#00ff00' : '#ff3300';
            soundBtn.style.borderColor = window.soundEnabled ? '#00ff00' : '#ff3300';
        }
        
        // Show notification
        if (window.soundEnabled) {
            window.dumbassGame.notificationManager?.showSuccess('Sound effects enabled! 🔊');
            window.dumbassGame.soundSystem?.playSuccess();
        } else {
            window.dumbassGame.notificationManager?.showInfo('Sound effects disabled 🔇');
        }
    } else {
        console.warn('⚠️ Sound system not ready yet, please wait...');
    }
}

function toggleEffects() {
    if (window.effectsEnabled !== undefined && window.dumbassGame && window.dumbassGame.effectsManager) {
        window.effectsEnabled = !window.effectsEnabled;
        const effectsBtn = document.getElementById('effectsToggle');
        if (effectsBtn) {
            effectsBtn.innerHTML = window.effectsEnabled ? '✨' : '💤';
            effectsBtn.style.color = window.effectsEnabled ? '#00ff00' : '#ff3300';
            effectsBtn.style.borderColor = window.effectsEnabled ? '#00ff00' : '#ff3300';
        }
        
        if (window.effectsEnabled) {
            window.dumbassGame.effectsManager?.enableEffects();
            window.dumbassGame.notificationManager?.showSuccess('Visual effects enabled! ✨');
        } else {
            window.dumbassGame.effectsManager?.disableEffects();
            window.dumbassGame.notificationManager?.showInfo('Visual effects disabled 💤');
        }
    } else {
        console.warn('⚠️ Effects system not ready yet, please wait...');
    }
}

// Enhanced 8-Bit Music Player
class RetroMusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.currentTrack = -1; // Will be set to random in initializePlayer()
        this.isPlaying = false;
        this.isShuffling = false;
        this.hasShownRescanNotification = false;
        
        // Audio Analysis Setup for Real EQ
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.source = null;
        this.isAnalysisSetup = false;
        
        // Default tracks - ALL 28 Epic MP3s!
        this.defaultPlaylist = [
            {
                title: "CELESTIAL SORROW SONG",
                url: "music/Celestial Sorrow Song.mp3",
                duration: "3:30",
                type: "embedded"
            },
            {
                title: "CLUE IN THE BEAT",
                url: "music/Clue in the Beat.mp3",
                duration: "4:30",
                type: "embedded"
            },
            {
                title: "CRATER DREAM DRIFT",
                url: "music/Crater Dream Drift.mp3",
                duration: "4:54",
                type: "embedded"
            },
            {
                title: "CRUISING LOW HUM",
                url: "music/Cruising Low Hum.mp3",
                duration: "3:54",
                type: "embedded"
            },
            {
                title: "DESERT SILK RUMBLE",
                url: "music/Desert Silk Rumble.mp3", 
                duration: "7:24",
                type: "embedded"
            },
            {
                title: "EARTHY RHYTHM ROOTS",
                url: "music/Earthy Rhythm Roots.mp3",
                duration: "4:18",
                type: "embedded"
            },
            {
                title: "EYE-CATCHING LOVE GLANCE",
                url: "music/Eye-Catching Love Glance.mp3",
                duration: "3:12",
                type: "embedded"
            },
            {
                title: "FALSE TUNE",
                url: "music/False Tune.mp3",
                duration: "4:42",
                type: "embedded"
            },
            {
                title: "FAREWELL OR FIGHT NOTE",
                url: "music/Farewell or Fight Note.mp3",
                duration: "2:48",
                type: "embedded"
            },
            {
                title: "FESTIVE ESCAPE MELODY",
                url: "music/Festive Escape Melody.mp3",
                duration: "4:12",
                type: "embedded"
            },
            {
                title: "GLOBAL CHAOS REGGAE",
                url: "music/Global Chaos Reggae.mp3",
                duration: "3:30",
                type: "embedded"
            },
            {
                title: "HEARTSTRINGS WHISPER",
                url: "music/Heartstrings Whisper.mp3",
                duration: "5:24",
                type: "embedded"
            },
            {
                title: "MIDNIGHT FABRIC PULSE",
                url: "music/Midnight Fabric Pulse).mp3",
                duration: "3:54",
                type: "embedded"
            },
            {
                title: "MISTY VISION FLOW",
                url: "music/Misty Vision Flow.mp3",
                duration: "4:00",
                type: "embedded"
            },
            {
                title: "MYSTIC DANCER'S CHANT",
                url: "music/Mystic Dancer's Chant.mp3",
                duration: "4:06",
                type: "embedded"
            },
            {
                title: "NERDY LOVE JINGLE",
                url: "music/Nerdy Love Jingle.mp3",
                duration: "2:42",
                type: "embedded"
            },
            {
                title: "PERSONAL ANTHEM WAVE",
                url: "music/Personal Anthem Wave.mp3",
                duration: "4:00",
                type: "embedded"
            },
            {
                title: "POLISHED SUIT SWING",
                url: "music/Polished Suit Swing.mp3",
                duration: "3:06",
                type: "embedded"
            },
            {
                title: "POWDERED RIFF RUSH",
                url: "music/Powdered Riff Rush.mp3",
                duration: "3:30",
                type: "embedded"
            },
            {
                title: "RAINDROP JOY RIFF",
                url: "music/Raindrop Joy Riff.mp3",
                duration: "3:36",
                type: "embedded"
            },
            {
                title: "ROYAL PURPLE JAM",
                url: "music/Royal Purple Jam.mp3",
                duration: "4:00",
                type: "embedded"
            },
            {
                title: "SLICK SOUL GLIDE",
                url: "music/Slick Soul Glide.mp3",
                duration: "4:12",
                type: "embedded"
            },
            {
                title: "SOARING WING TUNE",
                url: "music/Soaring-Wing-Tune.mp3",
                duration: "1:48",
                type: "embedded"
            },
            {
                title: "TIMELESS LAMENT LOOP",
                url: "music/Timeless-Lament-Loop.mp3",
                duration: "3:48",
                type: "embedded"
            },
            {
                title: "TOPSY-TURVY LOVE TUNE",
                url: "music/Topsy-Turvy-Love-Tune.mp3",
                duration: "3:00",
                type: "embedded"
            },
            {
                title: "UNWILLING GROOVE SHIFT",
                url: "music/Unwilling-Groove-Shift.mp3",
                duration: "2:42",
                type: "embedded"
            },
            {
                title: "UPLIFTED SOUL RISE",
                url: "music/Uplifted-Soul-Rise.mp3",
                duration: "2:12",
                type: "embedded"
            },
            {
                title: "WILD HOME BEAT",
                url: "music/Wild-Home-Beat.mp3",
                duration: "2:00",
                type: "embedded"
            }
        ];
        
        // Load from localStorage or use defaults (async)
        this.initializeAsync();
    }

    async initializeAsync() {
        await this.loadFromStorage();
        this.currentTab = 'playlist';
        
        this.initializePlayer();
        this.setupEventListeners();
        this.setupMusicManager();
        this.loadPlaylist();
        
        // Check for session tracks that need re-scanning
        this.checkForSessionTracks();
        
        // Debug playlist loading
        console.log(`🎵 Initialized with ${this.playlist.length} tracks`);
        
        // Setup real-time audio analysis
        this.setupAudioAnalysis();
    }
    
    setupAudioAnalysis() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create analyser with higher sensitivity
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 512; // Much higher resolution for better frequency detail
            this.analyser.smoothingTimeConstant = 0.3; // Less smoothing for more responsive visualization
            this.analyser.minDecibels = -80; // Lower threshold for quieter sounds
            this.analyser.maxDecibels = -10; // Higher threshold for louder sounds
            
            // Create data array for frequency data
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            
            console.log('🎛️ High-sensitivity real-time EQ analyzer initialized!');
            
            // Start the analysis loop
            this.startAnalysisLoop();
            
        } catch (error) {
            console.warn('⚠️ Web Audio API not supported, using fallback animation');
            this.setupFallbackAnimation();
        }
    }
    
    connectAudioSource() {
        if (!this.audioContext || !this.analyser || this.isAnalysisSetup) return;
        
        try {
            // Connect audio element to analyser
            if (!this.source) {
                this.source = this.audioContext.createMediaElementSource(this.audio);
                this.source.connect(this.analyser);
                this.analyser.connect(this.audioContext.destination);
                this.isAnalysisSetup = true;
                console.log('🔗 Audio source connected to real-time analyzer!');
            }
        } catch (error) {
            console.warn('⚠️ Could not connect audio source:', error);
        }
    }
    
    startAnalysisLoop() {
        const updateVisualizer = () => {
            if (this.analyser && this.dataArray) {
                // Get frequency data
                this.analyser.getByteFrequencyData(this.dataArray);
                
                // Update visualizer bars with real frequency data
                this.updateVisualizerBars();
            }
            
            // Continue the loop
            requestAnimationFrame(updateVisualizer);
        };
        
        updateVisualizer();
    }
    
    updateVisualizerBars() {
        const bars = document.querySelectorAll('.equalizer-wrapper .eq-bar');
        if (!bars.length || !this.dataArray) return;
        
        // Enhanced frequency mapping for 16 bars with logarithmic distribution
        const barCount = bars.length;
        const nyquist = this.audioContext.sampleRate / 2;
        
        bars.forEach((bar, index) => {
            // Better frequency mapping focused on musical range (20Hz - 4000Hz)
            // This ensures all bars get actual musical content where music really lives
            const musicFreqStart = 20; // Start at 20Hz
            const musicFreqEnd = 4000; // End at 4kHz (where most musical content actually is)
            
            // Use logarithmic scale but only within musical range
            const freqRatio = index / (barCount - 1);
            const logStart = Math.log(musicFreqStart);
            const logEnd = Math.log(musicFreqEnd);
            const targetFreq = Math.exp(logStart + freqRatio * (logEnd - logStart));
            
            // Convert target frequency to bin index
            const binIndex = Math.floor((targetFreq / nyquist) * this.dataArray.length);
            
            // Get frequency value with enhanced sensitivity
            let freqValue = this.dataArray[Math.min(binIndex, this.dataArray.length - 1)] || 0;
            
            // Apply frequency-specific amplification for musical balance
            if (index < 3) {
                // Bass boost (0-2 bars: 20-80Hz)
                freqValue = Math.min(255, freqValue * 1.3);
            } else if (index >= 11) {
                // High frequency boost (11-15 bars: 1.5kHz-4kHz) - for better high note response
                freqValue = Math.min(255, freqValue * 2.0);
            } else {
                // Mid frequency boost (3-10 bars: 80Hz-1.5kHz)
                freqValue = Math.min(255, freqValue * 1.5);
            }
            
            // Enhanced dynamic range with nonlinear scaling
            const normalizedValue = Math.pow(freqValue / 255, 0.7); // Power curve for more sensitivity
            
            // Much more responsive height range (3px-35px)
            const minHeight = 3;
            const maxHeight = 35;
            const height = Math.max(minHeight, Math.min(maxHeight, normalizedValue * (maxHeight - minHeight) + minHeight));
            
            // Apply height with smooth transitions
            bar.style.height = `${height}px`;
            
            if (this.isPlaying) {
                // More responsive opacity
                const opacity = Math.max(0.3, Math.min(1, normalizedValue * 0.8 + 0.4));
                bar.style.opacity = opacity;
                
                // Dynamic glow effects based on frequency content
                const glowIntensity = Math.max(3, normalizedValue * 12);
                if (index < 3) {
                    // Bass (20-80Hz) - green glow
                    bar.style.boxShadow = `0 0 ${glowIntensity}px rgba(0, 255, 0, ${opacity})`;
                } else if (index >= 11) {
                    // Highs (1.5kHz-4kHz) - cyan glow for vocals, guitar leads, cymbals
                    bar.style.boxShadow = `0 0 ${glowIntensity}px rgba(0, 255, 255, ${opacity})`;
                } else {
                    // Mids (80Hz-1.5kHz) - gradient glow from green to cyan
                    const midRatio = (index - 3) / 8;
                    const cyan = Math.floor(255 * midRatio);
                    bar.style.boxShadow = `0 0 ${glowIntensity}px rgba(0, 255, ${cyan}, ${opacity})`;
                }
            } else {
                bar.style.opacity = 0.2;
                bar.style.height = '4px';
                bar.style.boxShadow = '0 0 3px rgba(0, 255, 0, 0.4)';
            }
        });
    }
    
    setupFallbackAnimation() {
        // Fallback to CSS animation if Web Audio API isn't available
        console.log('🎵 Using CSS animation fallback for visualizer');
        // The existing CSS animation will handle this
    }
    
    // Storage functions for persistence
    async loadFromStorage() {
        try {
            const musicData = await window.persistenceManager.loadMusic();
            
            if (musicData.playlist && musicData.playlist.length > 0) {
                this.playlist = this.filterValidTracks(musicData.playlist);
                console.log(`💾 Loaded ${this.playlist.length} valid tracks from saved playlist`);
            } else {
                this.playlist = [...this.defaultPlaylist];
                console.log(`🎵 Using default playlist with ${this.playlist.length} tracks`);
            }
            
            if (musicData.library && musicData.library.length > 0) {
                this.musicLibrary = this.filterValidTracks(musicData.library);
                console.log(`💾 Loaded ${this.musicLibrary.length} valid tracks from saved library`);
            } else {
                this.musicLibrary = [...this.defaultPlaylist];
                console.log(`🎵 Using default library with ${this.musicLibrary.length} tracks`);
            }
            
            // Save the cleaned up lists back to storage
            if (musicData.playlist || musicData.library) {
                this.saveToStorage();
                console.log('🧹 Cleaned up and saved valid tracks to storage');
            }
            
        } catch (error) {
            console.warn('⚠️ Error loading music from storage, using defaults:', error);
            this.playlist = [...this.defaultPlaylist];
            this.musicLibrary = [...this.defaultPlaylist];
        }
    }
    
    filterValidTracks(trackList) {
        // Keep embedded tracks (the ones that come with the site)
        const validUrls = [
            "music/Celestial Sorrow Song.mp3",
            "music/Clue in the Beat.mp3",
            "music/Crater Dream Drift.mp3",
            "music/Cruising Low Hum.mp3",
            "music/Desert Silk Rumble.mp3",
            "music/Earthy Rhythm Roots.mp3",
            "music/Eye-Catching Love Glance.mp3",
            "music/False Tune.mp3",
            "music/Farewell or Fight Note.mp3",
            "music/Festive Escape Melody.mp3",
            "music/Global Chaos Reggae.mp3",
            "music/Heartstrings Whisper.mp3",
            "music/Midnight Fabric Pulse).mp3",
            "music/Misty Vision Flow.mp3",
            "music/Mystic Dancer's Chant.mp3",
            "music/Nerdy Love Jingle.mp3",
            "music/Personal Anthem Wave.mp3",
            "music/Polished Suit Swing.mp3",
            "music/Powdered Riff Rush.mp3",
            "music/Raindrop Joy Riff.mp3",
            "music/Royal Purple Jam.mp3",
            "music/Slick Soul Glide.mp3",
            "music/Soaring-Wing-Tune.mp3",
            "music/Timeless-Lament-Loop.mp3",
            "music/Topsy-Turvy-Love-Tune.mp3",
            "music/Unwilling-Groove-Shift.mp3",
            "music/Uplifted-Soul-Rise.mp3",
            "music/Wild-Home-Beat.mp3"
        ];
        
        return trackList.filter(track => {
            // Keep embedded tracks
            if (validUrls.includes(track.url)) {
                return true;
            }
            
            // Keep session tracks (blob URLs) but mark them as needing re-scan
            if (track.url && track.url.startsWith('blob:')) {
                // Blob URLs from previous session are now broken
                console.log(`🔄 Session track needs re-scanning: ${track.title}`);
                return false; // Remove broken blob URLs
            }
            
            // Keep valid URLs (streaming, etc.)
            if (track.url && track.url.startsWith('http')) {
                return true;
            }
            
            console.log(`🗑️ Removing invalid track: ${track.title} (${track.url})`);
            return false;
        });
    }
    
    checkForSessionTracks() {
        const fileRefs = JSON.parse(localStorage.getItem('dumbassMusic_fileRefs') || '[]');
        const lastFolder = JSON.parse(localStorage.getItem('dumbassMusic_lastFolder') || 'null');
        
        console.log('🔍 Debug: fileRefs found:', fileRefs);
        console.log('🔍 Debug: lastFolder found:', lastFolder);
        
        // Clean up any leftover file references - we don't want this notification anymore
        localStorage.removeItem('dumbassMusic_fileRefs');
        localStorage.removeItem('dumbassMusic_lastFolder');
        console.log('🧹 Cleaned up all music file references to stop notifications');
        
        // Only show notification if user explicitly re-adds files through the Music Manager
        // (removing automatic detection to prevent false positives)
    }
    
    showRescanNotification(fileCount, lastFolder) {
        if (fileCount === 0) return;
        
        // Prevent spam: only show once per session
        if (this.hasShownRescanNotification) return;
        this.hasShownRescanNotification = true;
        
        const folderText = lastFolder ? ` from "${lastFolder.name}"` : '';
        const message = `🎵 Welcome back! You previously added ${fileCount} personal music files${folderText}.\n\n💡 To play your music again, click the Music Manager and re-scan your folder!\n\n🎧 Your embedded music is always ready to play.`;
        
        // Create a dismissible notification instead of alert
        if (window.dumbassGame?.notificationManager) {
            window.dumbassGame.notificationManager.show(message, 'info', 8000);
        }
    }
    
    async saveToStorage() {
        try {
            const musicData = {
                playlist: this.playlist,
                library: this.musicLibrary
            };
            await window.persistenceManager.saveMusic(musicData);
            console.log(`💾 Saved playlist (${this.playlist.length}) and library (${this.musicLibrary.length}) to storage`);
        } catch (error) {
            console.warn('⚠️ Error saving music to storage:', error);
        }
    }

    initializeDefaultTracks() {
        // Reinitialize music library with all default tracks
        this.musicLibrary = [...this.defaultPlaylist];
        console.log('🎵 Reinitialized with', this.defaultPlaylist.length, 'default tracks');
    }
    
    initializePlayer() {
        this.audio.volume = 0.7;
        this.audio.preload = 'metadata';
        
        // Set initial volume slider appearance
        this.setVolume(70);
        
        // Update volume slider to match current theme
        setTimeout(() => updateVolumeSliderAppearance(), 100);
        
        // Set initial track (check if playlist exists and has content)
        if (this.playlist && this.playlist.length > 0) {
            // Start with a random track to keep things fresh!
            const randomTrack = Math.floor(Math.random() * this.playlist.length);
            console.log(`🎲 RANDOM TRACK SELECTION: ${randomTrack} out of ${this.playlist.length} tracks`);
            console.log(`🎵 Selected song: "${this.playlist[randomTrack]?.title}"`);
            
            // Force the random track to stick by clearing any cached selection
            this.currentTrack = randomTrack;
            this.loadTrack(randomTrack);
            
            console.log(`✅ Music player initialized with random track: "${this.playlist[this.currentTrack]?.title}"`);
        }
    }
    
    setupEventListeners() {
        this.audio.addEventListener('loadedmetadata', () => {
            this.updateTimeDisplay();
        });
        
        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });
        
        this.audio.addEventListener('ended', () => {
            console.log('🎵 Track ended:', this.playlist[this.currentTrack]?.title);
            // Smart auto-advance: only if track actually played (duration > 0)
            if (this.audio.duration && this.audio.duration > 0) {
                this.nextTrack();
            }
        });
        
        this.audio.addEventListener('error', (e) => {
            console.warn('🎵 Music file not found:', this.playlist[this.currentTrack]?.title);
            // Skip broken tracks, but with a safety limit
            this.handleTrackError();
        });

        // Setup click-to-seek on progress bar with a slight delay to ensure DOM is ready
        setTimeout(() => {
            this.setupProgressBarClick();
        }, 100);
    }

    setupProgressBarClick() {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            console.log('🎵 Setting up progress bar events');
            
            // Handle dragging the slider thumb
            progressBar.addEventListener('input', (e) => {
                const percentage = parseFloat(e.target.value);
                console.log(`🎵 Progress bar dragged to ${percentage.toFixed(1)}%`);
                this.seekTo(percentage);
            });
            
            // Handle clicking anywhere on the progress bar
            progressBar.addEventListener('click', (e) => {
                // For range inputs, click events automatically update the value
                // So we just need to seek to the new value
                const percentage = parseFloat(progressBar.value);
                console.log(`🎵 Progress bar clicked, seeking to ${percentage.toFixed(1)}%`);
                this.seekTo(percentage);
            });
            
            console.log('🎵 Progress bar events set up successfully');
        } else {
            console.warn('⚠️ Progress bar element not found, will retry...');
            
            // Retry after a longer delay if element wasn't found
            setTimeout(() => {
                const retryProgressBar = document.getElementById('progressBar');
                if (retryProgressBar) {
                    console.log('🎵 Progress bar found on retry, setting up events');
                    this.setupProgressBarEvents(retryProgressBar);
                } else {
                    console.error('❌ Progress bar element still not found after retry');
                }
            }, 1000);
        }
    }
    
    setupProgressBarEvents(progressBar) {
        // Handle dragging the slider thumb
        progressBar.addEventListener('input', (e) => {
            const percentage = parseFloat(e.target.value);
            console.log(`🎵 Progress bar dragged to ${percentage.toFixed(1)}%`);
            this.seekTo(percentage);
        });
        
        // Handle clicking anywhere on the progress bar
        progressBar.addEventListener('click', (e) => {
            // For range inputs, click events automatically update the value
            // So we just need to seek to the new value
            const percentage = parseFloat(progressBar.value);
            console.log(`🎵 Progress bar clicked, seeking to ${percentage.toFixed(1)}%`);
            this.seekTo(percentage);
        });
        
        console.log('🎵 Progress bar events set up successfully');
    }
    
    loadTrack(index) {
        if (index >= 0 && index < this.playlist.length) {
            this.currentTrack = index;
            const track = this.playlist[index];
            this.audio.src = track.url;
            
            // Safely update UI elements (only if they exist)
            const titleElement = document.getElementById('trackTitle');
            if (titleElement) {
                titleElement.textContent = track.title;
                
                // Reset any previous scrolling
                titleElement.classList.remove('scrolling');
                
                // Check if title needs scrolling after element updates
                setTimeout(() => {
                    const titleWidth = titleElement.scrollWidth;
                    const containerWidth = titleElement.offsetWidth;
                    
                    if (titleWidth > containerWidth) {
                        titleElement.classList.add('scrolling');
                    }
                }, 100);
            }
            
            this.updatePlaylistHighlight();
            
            console.log(`%c🎵 Loading: ${track.title}`, 'color: #00ffff; font-weight: bold;');
        }
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        if (this.playlist.length === 0) return;
        
        // Reset error counter on manual play
        this.errorSkipCount = 0;
        
        // Connect audio source for real-time analysis
        this.connectAudioSource();
        
        // Resume audio context if needed
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.audio.play().then(() => {
            this.isPlaying = true;
            
            // Safely update UI elements (only if they exist)
            const playPauseBtn = document.getElementById('playPauseBtn');
            if (playPauseBtn) {
                const icon = playPauseBtn.querySelector('.btn-icon');
                const label = playPauseBtn.querySelector('.btn-label');
                if (icon) icon.textContent = '⏸';
                if (label) label.textContent = 'PAUSE';
            }
            
            const musicPlayer = document.querySelector('.retro-music-player');
            if (musicPlayer) {
                musicPlayer.classList.remove('paused');
            }
            
            // Add beat-sync animations to various elements
            const title = document.querySelector('.title');
            if (title) {
                title.classList.add('beat-sync');
            }
            
            const powerIndicator = document.querySelector('.power-indicator');
            if (powerIndicator) {
                powerIndicator.classList.add('music-active');
            }
            
            const subtitle = document.querySelector('.subtitle');
            if (subtitle) {
                subtitle.classList.add('music-active');
            }
            
            if (musicPlayer) {
                musicPlayer.classList.add('music-active');
            }
            
            // Play retro sound effect
            if (window.dumbassGame?.soundSystem) {
                window.dumbassGame.soundSystem.playSuccess();
            }
        }).catch(e => {
            console.warn('🎵 Could not play audio:', e);
        });
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        
        // Safely update UI elements (only if they exist)
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            const icon = playPauseBtn.querySelector('.btn-icon');
            const label = playPauseBtn.querySelector('.btn-label');
            if (icon) icon.textContent = '▶';
            if (label) label.textContent = 'PLAY';
        }
        
        const musicPlayer = document.querySelector('.retro-music-player');
        if (musicPlayer) {
            musicPlayer.classList.add('paused');
        }
        
        // Remove beat-sync animations from all elements
        const title = document.querySelector('.title');
        if (title) {
            title.classList.remove('beat-sync');
        }
        
        const powerIndicator = document.querySelector('.power-indicator');
        if (powerIndicator) {
            powerIndicator.classList.remove('music-active');
        }
        
        const subtitle = document.querySelector('.subtitle');
        if (subtitle) {
            subtitle.classList.remove('music-active');
        }
        
        if (musicPlayer) {
            musicPlayer.classList.remove('music-active');
        }
    }
    
    nextTrack() {
        let nextIndex;
        if (this.isShuffling) {
            // Prevent same song twice in a row (with safety check for single track)
            if (this.playlist.length > 1) {
                do {
                    nextIndex = Math.floor(Math.random() * this.playlist.length);
                } while (nextIndex === this.currentTrack);
                console.log(`🔀 Shuffle: Avoided repeat, selected track ${nextIndex}`);
            } else {
                nextIndex = 0; // Only one track available
            }
        } else {
            nextIndex = (this.currentTrack + 1) % this.playlist.length;
        }
        
        this.loadTrack(nextIndex);
        if (this.isPlaying) {
            this.play();
        }
    }
    
    handleTrackError() {
        // Safety counter to prevent infinite loops
        if (!this.errorSkipCount) this.errorSkipCount = 0;
        this.errorSkipCount++;
        
        // If we've tried too many tracks, stop trying
        if (this.errorSkipCount >= this.playlist.length) {
            console.warn('🎵 Too many broken tracks, stopping auto-advance');
            this.pause();
            this.errorSkipCount = 0;
            return;
        }
        
        // Try the next track after a short delay
        setTimeout(() => {
            console.log('🎵 Trying next track...');
            this.nextTrack();
        }, 500);
    }
    

    
    previousTrack() {
        const prevIndex = this.currentTrack === 0 ? 
            this.playlist.length - 1 : 
            this.currentTrack - 1;
            
        this.loadTrack(prevIndex);
        if (this.isPlaying) {
            this.play();
        }
    }
    
    toggleShuffle() {
        this.isShuffling = !this.isShuffling;
        
        // Safely update UI elements (only if they exist)
        const shuffleBtn = document.getElementById('shuffleBtn');
        if (shuffleBtn) {
            const label = shuffleBtn.querySelector('.btn-label');
            if (this.isShuffling) {
                shuffleBtn.classList.add('active');
                shuffleBtn.style.color = '#00ffff';
                if (label) label.textContent = 'SHUFFLE ON';
            } else {
                shuffleBtn.classList.remove('active');
                shuffleBtn.style.color = '#00ff00';
                if (label) label.textContent = 'SHUFFLE';
            }
        }
        
        console.log(`🔀 Shuffle: ${this.isShuffling ? 'ON' : 'OFF'}`);
    }
    
    setVolume(value) {
        // Smooth volume transition
        const targetVolume = value / 100;
        this.audio.volume = targetVolume;
        
        // Update volume slider visual feedback
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider && volumeSlider.value != value) {
            volumeSlider.value = value;
        }
        
        // Safely update UI elements (only if they exist)
        const icon = document.querySelector('.volume-icon');
        if (icon) {
            if (value == 0) {
                icon.textContent = '🔇';
            } else if (value < 30) {
                icon.textContent = '🔈';
            } else if (value < 70) {
                icon.textContent = '🔉';
            } else {
                icon.textContent = '🔊';
            }
        }
        
        // Visual feedback on the slider itself
        if (volumeSlider) {
            const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
            volumeSlider.style.background = `linear-gradient(to right, ${primaryColor} 0%, ${primaryColor} ${value}%, rgba(0,0,0,0.8) ${value}%, rgba(0,0,0,0.8) 100%)`;
        }
    }
    
    seekTo(percentage) {
        console.log('🎵 seekTo called with percentage:', percentage);
        if (this.audio.duration) {
            const newTime = (percentage / 100) * this.audio.duration;
            const clampedTime = Math.max(0, Math.min(newTime, this.audio.duration));
            this.audio.currentTime = clampedTime;
            console.log(`🎵 Seeked to ${this.formatTime(clampedTime)} (${percentage}%)`);
        } else {
            console.warn('⚠️ Cannot seek - no audio duration');
        }
    }
    
    setupSeekComplete() {
        // Much shorter blocking period - just 100ms to prevent immediate conflicts
        setTimeout(() => {
            this.isUserSeeking = false;
            console.log('🎵 Re-enabling automatic updates after seek');
        }, 100);
    }
    
    updateProgress() {
        // Don't update progress bar if user is actively seeking
        if (this.isUserSeeking) {
            return;
        }
        
        if (this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            
            // Safely update UI elements (only if they exist)
            const progressBar = document.getElementById('progressBar');
            if (progressBar) {
                progressBar.value = progress;
            }
            
            // Update time display
            const currentTime = this.formatTime(this.audio.currentTime);
            const currentTimeElement = document.getElementById('currentTime');
            if (currentTimeElement) {
                currentTimeElement.textContent = currentTime;
            }
        }
    }
    
    updateTimeDisplay() {
        const totalTime = this.formatTime(this.audio.duration || 0);
        
        // Safely update UI elements (only if they exist)
        const totalTimeElement = document.getElementById('totalTime');
        if (totalTimeElement) {
            totalTimeElement.textContent = totalTime;
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    togglePlaylist() {
        const dropdown = document.getElementById('playlistDropdown');
        dropdown.classList.toggle('visible');
    }
    
    loadPlaylist() {
        console.log(`🎵 Loading playlist with ${this.playlist.length} tracks`);
        this.renderCurrentPlaylist();
        this.renderMusicLibrary();
    }
    
    updatePlaylistHighlight() {
        const items = document.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            if (index === this.currentTrack) {
                item.classList.add('current');
            } else {
                item.classList.remove('current');
            }
        });
    }
    
    // Add new track to playlist
    addTrack(title, url, duration = "0:00") {
        this.playlist.push({ title, url, duration });
        this.loadPlaylist();
        console.log(`🎵 Added track: ${title}`);
    }
    
    // Remove track from playlist
    removeTrack(index) {
        if (index >= 0 && index < this.playlist.length) {
            const removed = this.playlist.splice(index, 1)[0];
            this.loadPlaylist();
            
            if (index === this.currentTrack && this.playlist.length > 0) {
                this.loadTrack(0);
            }
            
            console.log(`🎵 Removed track: ${removed.title}`);
        }
    }
    
    // ===========================================
    // NEW MUSIC MANAGER FUNCTIONS 🎵🚀
    // ===========================================
    
    setupMusicManager() {
        // Setup tab switching
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });
        
        // Setup file drop zone
        this.setupFileDropZone();
        
        // Setup folder selector (if supported)
        this.setupFolderSelector();
        
        console.log('🎵 Music Manager initialized!');
    }
    
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const targetTab = document.getElementById(tabName + 'Tab');
        if (targetTab) {
            targetTab.classList.add('active');
        }
        
        this.currentTab = tabName;
        
        // Refresh content when switching tabs
        if (tabName === 'playlist') {
            this.renderCurrentPlaylist();
        } else if (tabName === 'library') {
            this.renderMusicLibrary();
        }
    }
    
    openMusicManager() {
        const modal = document.getElementById('musicManagerModal');
        
        console.log('🎵 Opening Music Manager...');
        
        // First, make sure modal exists and is ready
        if (!modal) {
            console.error('❌ Music Manager modal not found!');
            return;
        }
        
        // BULLETPROOF MUSIC MANAGER - Store original content BEFORE any modifications
        this.originalBodyContent = document.body.innerHTML; // Store for restoration
        
        // TARGETED HIDING - only hide specific game-related elements (AFTER saving content)
        const elementsToHide = [
            '.container',
            '.games-grid', 
            '.game-card',
            '.header',
            '.add-game-form',
            'main',
            '.notification-container'
        ];
        
        // Store hidden elements for restoration
        this.hiddenElements = [];
        
        elementsToHide.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el && el !== modal && !modal.contains(el)) {
                    this.hiddenElements.push({
                        element: el,
                        originalDisplay: el.style.display
                    });
                    el.style.display = 'none';
                }
            });
        });
        
        // Debug: Check what we're storing
        const gamesGridExists = this.originalBodyContent.includes('games-grid');
        const containerExists = this.originalBodyContent.includes('container');
        console.log('💾 Storing original content - Games grid included:', gamesGridExists);
        console.log('💾 Storing original content - Container included:', containerExists);
        console.log('💾 Original content length:', this.originalBodyContent.length, 'characters');
        
        document.body.innerHTML = `
            <div style="
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: #000000 !important;
                font-family: 'Press Start 2P', monospace !important;
                overflow: hidden !important;
            ">
                <!-- Music Manager Header -->
                <div style="
                    padding: 20px;
                    border-bottom: 2px solid #00ff00;
                    background: rgba(0, 255, 0, 0.05);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h1 style="color: #00ffff; margin: 0; font-size: 1.2rem;">🎵 MUSIC MANAGER</h1>
                    <button onclick="window.musicPlayer.closeMusicManager()" style="
                        background: rgba(255, 51, 0, 0.1);
                        border: 1px solid #ff3300;
                        color: #ff3300;
                        font-size: 1.5rem;
                        cursor: pointer;
                        padding: 10px 15px;
                        border-radius: 50%;
                        font-family: inherit;
                    ">✕</button>
                </div>
                
                <!-- Tabs -->
                <div style="display: flex; background: rgba(0, 0, 0, 0.8); border-bottom: 1px solid #333;">
                    <button onclick="window.musicPlayer.switchMusicTab('playlist')" id="playlistTabBtn" style="
                        flex: 1; padding: 15px; background: rgba(0, 255, 255, 0.1); border: none; 
                        color: #00ffff; font-size: 0.7rem; cursor: pointer; font-family: inherit;
                        border-bottom: 3px solid #00ffff;
                    ">📋 CURRENT PLAYLIST</button>
                    <button onclick="window.musicPlayer.switchMusicTab('library')" id="libraryTabBtn" style="
                        flex: 1; padding: 15px; background: none; border: none; 
                        color: #666; font-size: 0.7rem; cursor: pointer; font-family: inherit;
                        border-bottom: 3px solid transparent;
                    ">🎵 MUSIC LIBRARY</button>
                    <button onclick="window.musicPlayer.switchMusicTab('add')" id="addTabBtn" style="
                        flex: 1; padding: 15px; background: none; border: none; 
                        color: #666; font-size: 0.7rem; cursor: pointer; font-family: inherit;
                        border-bottom: 3px solid transparent;
                    ">➕ ADD MUSIC</button>
                </div>
                
                <!-- Tab Content -->
                <div style="flex: 1; padding: 20px; overflow-y: auto; height: calc(100vh - 140px);">
                    <!-- Playlist Tab -->
                    <div id="playlistTabContent" style="display: block;">
                        <div style="display: flex; gap: 15px; margin-bottom: 20px; padding: 15px; background: rgba(0, 255, 0, 0.05); border: 1px solid rgba(0, 255, 0, 0.2); border-radius: 8px;">
                            <button onclick="window.musicPlayer.clearPlaylist()" style="
                                padding: 8px 12px; background: rgba(0, 255, 0, 0.1); border: 1px solid #00ff00;
                                color: #00ff00; border-radius: 6px; cursor: pointer; font-size: 0.6rem; font-family: inherit;
                            ">🗑️ CLEAR ALL</button>
                            <button onclick="window.musicPlayer.shufflePlaylist()" style="
                                padding: 8px 12px; background: rgba(0, 255, 0, 0.1); border: 1px solid #00ff00;
                                color: #00ff00; border-radius: 6px; cursor: pointer; font-size: 0.6rem; font-family: inherit;
                            ">🔀 SHUFFLE</button>
                            <button onclick="window.musicPlayer.resetToDefaults()" style="
                                padding: 8px 12px; background: rgba(0, 255, 255, 0.1); border: 1px solid #00ffff;
                                color: #00ffff; border-radius: 6px; cursor: pointer; font-size: 0.6rem; font-family: inherit;
                            ">🔄 RESET TO DEFAULTS</button>
                            <span style="margin-left: auto; color: #00ff00; font-size: 0.6rem;">Tracks: <span id="trackCount">${this.playlist.length}</span></span>
                        </div>
                        <div id="currentPlaylistTracks" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px;">
                            <!-- Tracks will be loaded here -->
                        </div>
                    </div>
                    
                    <!-- Library Tab -->
                    <div id="libraryTabContent" style="display: none;">
                        <div style="margin-bottom: 20px;">
                            <input type="text" id="librarySearch" placeholder="🔍 Search music..." style="
                                width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00ff00;
                                border-radius: 6px; color: #00ff00; font-family: inherit; font-size: 0.6rem;
                            ">
                        </div>
                        <div id="musicLibraryTracks" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px;">
                            <!-- Library tracks will be loaded here -->
                        </div>
                    </div>
                    
                    <!-- Add Music Tab -->
                    <div id="addTabContent" style="display: none;">
                        <div style="margin-bottom: 30px;">
                            <h3 style="color: #00ffff; font-size: 0.8rem; margin-bottom: 15px;">🎵 Add Music Files</h3>
                            <div id="fileDropZone" onclick="document.getElementById('musicFileInput').click()" style="
                                border: 3px dashed rgba(0, 255, 0, 0.7); border-radius: 12px; padding: 50px;
                                text-align: center; cursor: pointer; background: rgba(0, 255, 0, 0.08);
                                transition: all 0.3s ease; position: relative; overflow: hidden;
                            " onmouseover="this.style.borderColor='#00ff00'; this.style.background='rgba(0, 255, 0, 0.12)'" 
                               onmouseout="this.style.borderColor='rgba(0, 255, 0, 0.7)'; this.style.background='rgba(0, 255, 0, 0.08)'">
                                <div style="font-size: 4rem; color: #00ff00; margin-bottom: 15px; text-shadow: 0 0 20px rgba(0, 255, 0, 0.5);">🎵</div>
                                <div style="color: #00ff00; font-size: 0.8rem; font-weight: bold; margin-bottom: 8px;">Drop music files here or click to browse</div>
                                <div style="color: #00cccc; font-size: 0.5rem;">Supports: MP3, WAV, OGG, M4A, AAC, FLAC • Select multiple files!</div>
                                <input type="file" id="musicFileInput" multiple accept="audio/*" style="display: none;">
                            </div>
                        </div>
                        
                                                 <div style="margin-bottom: 30px;">
                             <h3 style="color: #00ffff; font-size: 0.8rem; margin-bottom: 15px;">📁 Add Entire Folder</h3>
                             <div style="text-align: center; padding: 20px; background: rgba(0, 255, 0, 0.05); border: 1px solid rgba(0, 255, 0, 0.2); border-radius: 8px; margin-bottom: 20px;">
                                 <button onclick="window.musicPlayer.selectMusicFolderInManager()" id="folderSelectBtn" style="
                                     padding: 15px 25px; background: rgba(0, 255, 0, 0.1); border: 1px solid #00ff00;
                                     color: #00ff00; border-radius: 6px; cursor: pointer; font-size: 0.7rem; font-family: inherit;
                                     margin-bottom: 10px;
                                 ">📁 SELECT MUSIC FOLDER</button>
                                 <div style="color: #666; font-size: 0.5rem; margin-top: 10px;">
                                     Bulk import all music files from a folder<br>
                                     <span id="folderSupport">Supports: MP3, WAV, OGG, M4A, AAC, FLAC</span>
                                 </div>
                             </div>
                         </div>
                         
                         <div style="margin-bottom: 30px;">
                             <h3 style="color: #00ffff; font-size: 0.8rem; margin-bottom: 15px;">🌐 Add from URL</h3>
                             <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                                 <input type="text" id="musicUrlInput" placeholder="https://example.com/music.mp3" style="
                                     flex: 1; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00ff00;
                                     border-radius: 6px; color: #00ff00; font-family: inherit; font-size: 0.6rem;
                                 ">
                                 <input type="text" id="musicTitleInput" placeholder="Track Title" style="
                                     flex: 1; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00ff00;
                                     border-radius: 6px; color: #00ff00; font-family: inherit; font-size: 0.6rem;
                                 ">
                                 <button onclick="window.musicPlayer.addFromUrlInManager()" style="
                                     padding: 12px 20px; background: rgba(0, 255, 255, 0.1); border: 1px solid #00ffff;
                                     color: #00ffff; border-radius: 6px; cursor: pointer; font-size: 0.6rem; font-family: inherit;
                                 ">➕ ADD</button>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        `;
        
        // Setup file drop functionality
        this.setupFileDropInManager();
        
        // Check folder API support
        this.checkFolderAPISupport();
        
        // Load current playlist content immediately (starts on playlist tab)
        setTimeout(() => {
            this.loadCurrentPlaylistInManager();
            console.log('📋 Loaded current playlist tab with', this.playlist.length, 'tracks');
        }, 100);
        
        // Browser compatibility check stored for later use in tab switching
        this.browserSupportsFolder = 'showDirectoryPicker' in window;
        
        // Setup URL input
        this.setupUrlInputInManager();
        
        // Setup search functionality
        this.setupSearchInManager();
        
        // Load the playlist and library content
        this.loadCurrentPlaylistInManager();
        this.loadMusicLibraryInManager();
        
        console.log('🎵 Music Manager interface loaded!');
        
        // Add click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeMusicManager();
            }
        });
        
        // Play retro sound effect
        if (window.dumbassGame?.soundSystem) {
            window.dumbassGame.soundSystem.playClick();
        }
    }
    
    closeMusicManager() {
        // RESTORE ORIGINAL PAGE CONTENT
        if (this.originalBodyContent) {
            console.log('🔄 Restoring original HTML content...');
            document.body.innerHTML = this.originalBodyContent;
            
            // Debug: Check if content was restored and is visible
            const gamesGrid = document.querySelector('.games-grid');
            const container = document.querySelector('.container');
            const gameCards = document.querySelectorAll('.game-card');
            
            console.log('🔍 After restoration - Games grid found:', !!gamesGrid);
            console.log('🔍 After restoration - Container found:', !!container);
            console.log('🔍 After restoration - Game cards found:', gameCards.length);
            
            if (container) {
                const containerStyle = window.getComputedStyle(container);
                console.log('🎨 Container display:', containerStyle.display);
                console.log('🎨 Container visibility:', containerStyle.visibility);
                console.log('🎨 Container opacity:', containerStyle.opacity);
                console.log('🎨 Container z-index:', containerStyle.zIndex);
            }
            
            if (gamesGrid) {
                const gridStyle = window.getComputedStyle(gamesGrid);
                console.log('🎮 Games grid display:', gridStyle.display);
                console.log('🎮 Games grid visibility:', gridStyle.visibility);
                console.log('🎮 Games grid opacity:', gridStyle.opacity);
            }
            
            // CRITICAL: Reinitialize the entire app after DOM restoration
            setTimeout(() => {
                console.log('🔄 Reinitializing DumbassGames after music manager close...');
                
                try {
                    // Reinitialize exactly like the original DOMContentLoaded event
                    window.dumbassGame = new DumbassGameEnhanced();
                    window.soundSystem = window.dumbassGame.soundSystem;
                    new DumbassGameAdmin(window.dumbassGame);
                    
                    // Keep the existing music player reference but ensure it's accessible
                    window.musicPlayer = this;
                    
                    console.log('✅ DumbassGames reinitialized successfully!');
                    console.log('🏠 Homepage should now be visible with all games and effects');
                    
                    // Debug: Check final visibility after reinitialization
                    const finalContainer = document.querySelector('.container');
                    const finalGamesGrid = document.querySelector('.games-grid');
                    const finalGameCards = document.querySelectorAll('.game-card');
                    
                    console.log('🔍 After reinitialization - Container found:', !!finalContainer);
                    console.log('🔍 After reinitialization - Games grid found:', !!finalGamesGrid);
                    console.log('🔍 After reinitialization - Game cards found:', finalGameCards.length);
                    
                    if (finalContainer) {
                        const finalStyle = window.getComputedStyle(finalContainer);
                        console.log('🎨 Final container display:', finalStyle.display);
                        console.log('🎨 Final container visibility:', finalStyle.visibility);
                        console.log('🎨 Final container opacity:', finalStyle.opacity);
                    }
                    
                    // Play success sound if available
                    if (window.dumbassGame?.soundSystem) {
                        setTimeout(() => {
                            window.dumbassGame.soundSystem.playSuccess();
                        }, 300);
                    }
                    
                } catch (error) {
                    console.error('❌ Failed to reinitialize DumbassGames:', error);
                    console.warn('🔄 Falling back to page reload...');
                    location.reload();
                }
            }, 250);
            
        } else {
            console.warn('⚠️ Original content not found, reloading page...');
            location.reload(); // Fallback if restoration fails
        }
        
        console.log('🎵 Music Manager closed - page restored!');
    }
    
    // NEW MUSIC MANAGER FUNCTIONS
    switchMusicTab(tabName) {
        // Hide all tab content
        const tabs = ['playlist', 'library', 'add'];
        tabs.forEach(tab => {
            const content = document.getElementById(tab + 'TabContent');
            const btn = document.getElementById(tab + 'TabBtn');
            if (content) content.style.display = 'none';
            if (btn) {
                btn.style.background = 'none';
                btn.style.color = '#666';
                btn.style.borderBottom = '3px solid transparent';
            }
        });
        
        // Show active tab
        const activeContent = document.getElementById(tabName + 'TabContent');
        const activeBtn = document.getElementById(tabName + 'TabBtn');
        if (activeContent) activeContent.style.display = 'block';
        if (activeBtn) {
            activeBtn.style.background = 'rgba(0, 255, 255, 0.1)';
            activeBtn.style.color = '#00ffff';
            activeBtn.style.borderBottom = '3px solid #00ffff';
        }
        
        // Load content for specific tabs
        if (tabName === 'library') {
            this.loadMusicLibraryInManager();
        }
        
        // Show browser-specific welcome message when switching to Add Music tab
        if (tabName === 'add' && !this.browserSupportsFolder && !this.addMusicWelcomeShown) {
            this.addMusicWelcomeShown = true; // Show only once per session
            setTimeout(() => {
                // Show friendly welcome message for Add Music tab
                const welcomeMessage = document.createElement('div');
                welcomeMessage.style.cssText = `
                    position: fixed; top: 120px; left: 50%; transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.95); border: 2px solid #00ffff;
                    border-radius: 12px; padding: 20px; max-width: 400px; text-align: center;
                    color: #00ffff; font-size: 0.7rem; z-index: 10001;
                    box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
                `;
                welcomeMessage.innerHTML = `
                    <div style="font-size: 2rem; margin-bottom: 10px;">🎵</div>
                    <div style="font-weight: bold; margin-bottom: 10px;">Welcome to DumbassGames Music!</div>
                    <div style="margin-bottom: 15px; line-height: 1.4;">
                        Your browser doesn't support bulk folder import, but you can still add music using:
                    </div>
                    <div style="text-align: left; margin-bottom: 15px;">
                        ✅ Drag & drop multiple files<br>
                        ✅ Browse and select files<br>
                        ✅ Add streaming URLs
                    </div>
                    <button onclick="this.parentElement.remove()" style="
                        padding: 8px 16px; background: rgba(0, 255, 255, 0.2);
                        border: 1px solid #00ffff; color: #00ffff; border-radius: 6px;
                        cursor: pointer; font-family: inherit; font-size: 0.6rem;
                    ">Got it! 🚀</button>
                `;
                document.body.appendChild(welcomeMessage);
                
                // Auto-remove after 10 seconds
                setTimeout(() => {
                    if (welcomeMessage.parentElement) {
                        welcomeMessage.remove();
                    }
                }, 10000);
            }, 300);
        }
    }
    
    loadCurrentPlaylistInManager() {
        const container = document.getElementById('currentPlaylistTracks');
        const countElement = document.getElementById('trackCount');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        this.playlist.forEach((track, index) => {
            const trackCard = this.createTrackCardInManager(track, index, true);
            container.appendChild(trackCard);
        });
        
        if (countElement) {
            countElement.textContent = this.playlist.length;
        }
    }
    
    updateTrackCountInManager() {
        const countElement = document.getElementById('trackCount');
        if (countElement) {
            countElement.textContent = this.playlist.length;
        }
    }

    playTrackInManager(index) {
        if (index >= 0 && index < this.playlist.length) {
            this.loadTrack(index);
            this.play();
            this.loadCurrentPlaylistInManager(); // Refresh to highlight current track
            console.log(`🎵 Playing track: ${this.playlist[index]?.title}`);
        }
    }
    
    loadMusicLibraryInManager() {
        const container = document.getElementById('musicLibraryTracks');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.musicLibrary.forEach((track, index) => {
            const trackCard = this.createTrackCardInManager(track, index, false);
            container.appendChild(trackCard);
        });
    }
    
    createTrackCardInManager(track, index, isInPlaylist) {
        const card = document.createElement('div');
        const isInCurrentPlaylist = this.playlist.some(t => t.url === track.url);
        
        card.style.cssText = `
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid rgba(0, 255, 0, 0.3);
            border-radius: 8px;
            padding: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        if (isInPlaylist && index === this.currentTrack) {
            card.style.borderColor = '#00ffff';
            card.style.background = 'rgba(0, 255, 255, 0.1)';
        }
        
        card.innerHTML = `
            <div style="font-size: 0.8rem; color: #00ffff; margin-bottom: 8px; font-weight: bold;">${track.title}</div>
            <div style="font-size: 0.6rem; color: #666; margin-bottom: 10px;">Duration: ${track.duration}</div>
            <div style="display: flex; gap: 8px;">
                ${isInPlaylist ? 
                    `                    <button onclick="window.musicPlayer.playTrackInManager(${index})" style="
                        padding: 6px 10px; background: rgba(0, 255, 0, 0.1); border: 1px solid #00ff00;
                        color: #00ff00; border-radius: 4px; cursor: pointer; font-size: 0.6rem; font-family: inherit;
                    ">▶️ PLAY</button>
                     <button onclick="window.musicPlayer.removeFromPlaylistInManager(${index})" style="
                        padding: 6px 10px; background: rgba(255, 0, 0, 0.1); border: 1px solid #ff3300;
                        color: #ff3300; border-radius: 4px; cursor: pointer; font-size: 0.6rem; font-family: inherit;
                     ">🗑️ REMOVE</button>` :
                    `${!isInCurrentPlaylist ? 
                        `<button onclick="window.musicPlayer.addToPlaylistInManager(${index})" style="
                            padding: 6px 10px; background: rgba(0, 255, 0, 0.1); border: 1px solid #00ff00;
                            color: #00ff00; border-radius: 4px; cursor: pointer; font-size: 0.6rem; font-family: inherit;
                        ">➕ ADD</button>` : 
                        `<button style="
                            padding: 6px 10px; background: rgba(100, 100, 100, 0.1); border: 1px solid #666;
                            color: #666; border-radius: 4px; cursor: not-allowed; font-size: 0.6rem; font-family: inherit;
                        ">✅ IN PLAYLIST</button>`}
                     <button onclick="window.musicPlayer.playFromLibraryInManager(${index})" style="
                        padding: 6px 10px; background: rgba(0, 255, 255, 0.1); border: 1px solid #00ffff;
                        color: #00ffff; border-radius: 4px; cursor: pointer; font-size: 0.6rem; font-family: inherit;
                     ">▶️ PLAY NOW</button>`
                }
            </div>
        `;
        
        return card;
    }
    
    addToPlaylistInManager(libraryIndex) {
        const track = this.musicLibrary[libraryIndex];
        if (track && !this.playlist.some(t => t.url === track.url)) {
            this.playlist.push({...track});
            this.saveToStorage(); // Save changes
            this.loadCurrentPlaylistInManager();
            this.loadMusicLibraryInManager();
            console.log(`🎵 Added to playlist: ${track.title}`);
        }
    }
    
    removeFromPlaylistInManager(playlistIndex) {
        if (playlistIndex >= 0 && playlistIndex < this.playlist.length) {
            const removed = this.playlist.splice(playlistIndex, 1)[0];
            this.saveToStorage(); // Save changes
            this.loadCurrentPlaylistInManager();
            this.loadMusicLibraryInManager();
            
            // Adjust current track if needed
            if (playlistIndex === this.currentTrack) {
                if (this.playlist.length > 0) {
                    this.currentTrack = Math.min(this.currentTrack, this.playlist.length - 1);
                    this.loadTrack(this.currentTrack);
                } else {
                    this.pause();
                }
            } else if (playlistIndex < this.currentTrack) {
                this.currentTrack--;
            }
            
            console.log(`🗑️ Removed from playlist: ${removed.title}`);
        }
    }
    
    playFromLibraryInManager(libraryIndex) {
        const track = this.musicLibrary[libraryIndex];
        if (track) {
            // Add to playlist if not already there
            if (!this.playlist.some(t => t.url === track.url)) {
                this.playlist.push({...track});
            }
            
            // Find track in playlist and play it
            const playlistIndex = this.playlist.findIndex(t => t.url === track.url);
            if (playlistIndex !== -1) {
                this.loadTrack(playlistIndex);
                this.play();
                this.loadCurrentPlaylistInManager();
                this.loadMusicLibraryInManager();
            }
        }
    }
    
    setupFileDropInManager() {
        const dropZone = document.getElementById('fileDropZone');
        const fileInput = document.getElementById('musicFileInput');
        
        if (!dropZone || !fileInput) return;
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleFilesInManager(e.target.files);
        });
        
        // Drag and drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.background = 'rgba(0, 255, 255, 0.05)';
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.style.background = 'rgba(0, 255, 0, 0.02)';
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.background = 'rgba(0, 255, 0, 0.02)';
            this.handleFilesInManager(e.dataTransfer.files);
        });
    }
    
    async handleFilesInManager(files) {
        const successFiles = [];
        const failedFiles = [];
        
        for (const file of Array.from(files)) {
            if (file.type.startsWith('audio/')) {
                try {
                    // Create immediate blob URL for playing
                    const success = await this.processAudioFileForSession(file);
                    if (success) {
                        successFiles.push(file.name);
                    } else {
                        failedFiles.push(file.name);
                    }
                } catch (error) {
                    console.warn(`Failed to process ${file.name}:`, error);
                    failedFiles.push(file.name);
                }
            }
        }
        
        if (successFiles.length > 0) {
            console.log(`🎵 Added ${successFiles.length} tracks from your files! Ready to play!`);
            this.loadMusicLibraryInManager();
        }
    }
    
    async processAudioFileForSession(file) {
        const fileName = file.name;
        const title = fileName.replace(/\.[^/.]+$/, "");
        
        // Create blob URL for this session
        const blobUrl = URL.createObjectURL(file);
        
        try {
            // Get duration from the file
            const duration = await this.getAudioDuration(blobUrl);
            
            // Add track with blob URL for immediate playing
            this.addToLibrary(title, blobUrl, this.formatTime(duration), 'session');
            
            // Store file reference for potential re-scanning
            this.storeFileReference(file, title, this.formatTime(duration));
            
            return true;
        } catch (error) {
            URL.revokeObjectURL(blobUrl);
            throw error;
        }
    }
    
    storeFileReference(file, title, duration) {
        // Store file info in localStorage for potential re-scanning
        const fileRefs = JSON.parse(localStorage.getItem('dumbassMusic_fileRefs') || '[]');
        fileRefs.push({
            name: file.name,
            title: title,
            duration: duration,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
        });
        localStorage.setItem('dumbassMusic_fileRefs', JSON.stringify(fileRefs));
    }
    
    getAudioDuration(url) {
        return new Promise((resolve, reject) => {
            const audio = new Audio(url);
            audio.addEventListener('loadedmetadata', () => {
                resolve(audio.duration);
            });
            audio.addEventListener('error', () => {
                reject(new Error('Could not load audio metadata'));
            });
            audio.load();
        });
    }
    

    
    checkFolderAPISupport() {
        const folderBtn = document.getElementById('folderSelectBtn');
        const supportText = document.getElementById('folderSupport');
        
        if ('showDirectoryPicker' in window) {
            // API is supported
            console.log('✅ File System Access API supported - folder selection available!');
            if (supportText) {
                supportText.innerHTML = '✅ Bulk folder import supported<br>Supports: MP3, WAV, OGG, M4A, AAC, FLAC';
                supportText.style.color = '#00ff00';
            }
        } else {
            // API not supported - make this less jarring
            console.log('❌ File System Access API not supported - folder selection disabled');
            if (folderBtn) {
                folderBtn.disabled = true;
                folderBtn.style.background = 'rgba(50, 50, 50, 0.3)';
                folderBtn.style.borderColor = '#888';
                folderBtn.style.color = '#888';
                folderBtn.style.cursor = 'not-allowed';
                folderBtn.textContent = '📁 BROWSER LIMITATION';
                folderBtn.title = 'Folder selection requires Chrome, Edge, or Opera';
            }
            if (supportText) {
                supportText.innerHTML = '⚠️ Bulk folder import not available in this browser<br>✅ Individual file upload still works perfectly!';
                supportText.style.color = '#ffaa00';
            }
        }
    }
    
    async selectMusicFolderInManager() {
        if (!('showDirectoryPicker' in window)) {
            alert('🎵 Bulk folder import is not available in your browser.\n\n✅ You can still add music using:\n• Individual file upload (drag & drop or browse)\n• Streaming URLs\n\nFor bulk folder import, try Chrome, Edge, or Opera.');
            return;
        }
        
        try {
            console.log('📁 Opening folder picker...');
            const dirHandle = await window.showDirectoryPicker();
            
            console.log(`📁 Selected folder: ${dirHandle.name}`);
            console.log('🔍 Scanning for music files...');
            
            const processedFiles = [];
            const failedFiles = [];
            const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];
            
            // Show progress indicator
            const folderBtn = document.getElementById('folderSelectBtn');
            const originalText = folderBtn.textContent;
            folderBtn.textContent = '🔍 SCANNING...';
            folderBtn.disabled = true;
            
            // Store folder handle for potential re-scanning
            this.storeFolderReference(dirHandle);
            
            for await (const entry of dirHandle.values()) {
                if (entry.kind === 'file') {
                    const extension = entry.name.toLowerCase().slice(entry.name.lastIndexOf('.'));
                    if (audioExtensions.includes(extension)) {
                        try {
                            const file = await entry.getFile();
                            const title = entry.name.replace(/\.[^/.]+$/, "");
                            
                            // Check if already in library
                            if (!this.musicLibrary.some(t => t.title === title)) {
                                const success = await this.processAudioFileForSession(file);
                                if (success) {
                                    processedFiles.push(entry.name);
                                } else {
                                    failedFiles.push(entry.name);
                                }
                            } else {
                                console.log(`⚠️ Skipping duplicate: ${title}`);
                            }
                        } catch (err) {
                            console.warn(`⚠️ Could not process file: ${entry.name}`, err);
                            failedFiles.push(entry.name);
                        }
                    }
                }
            }
            
            // Restore button
            folderBtn.textContent = originalText;
            folderBtn.disabled = false;
            
            if (processedFiles.length > 0) {
                console.log(`🎵 Added ${processedFiles.length} tracks from "${dirHandle.name}" - ready to play!`);
                
                alert(`🎵 SUCCESS! Added ${processedFiles.length} music files! 🎵

All tracks from "${dirHandle.name}" are now ready to play!

✅ Your music will work for this session
💡 Next time you visit, you can re-scan the same folder to get your music back

🎧 Switch to the Library tab to see all your tracks!`);
                
                this.loadMusicLibraryInManager();
                this.switchMusicTab('library');
            } else {
                console.log('❌ No new music files found in folder');
                alert(`No new music files found in "${dirHandle.name}" or all files already in library.`);
            }
            
        } catch (err) {
            console.log('📁 Folder selection cancelled or failed:', err);
            
            // Restore button if there was an error
            const folderBtn = document.getElementById('folderSelectBtn');
            if (folderBtn) {
                folderBtn.textContent = '📁 SELECT MUSIC FOLDER';
                folderBtn.disabled = false;
            }
        }
    }
    
    storeFolderReference(dirHandle) {
        // Store folder name for UI purposes (can't store the actual handle)
        const folderInfo = {
            name: dirHandle.name,
            scannedAt: Date.now()
        };
        localStorage.setItem('dumbassMusic_lastFolder', JSON.stringify(folderInfo));
    }
    
    setupUrlInputInManager() {
        const urlInput = document.getElementById('musicUrlInput');
        const titleInput = document.getElementById('musicTitleInput');
        
        if (!urlInput || !titleInput) return;
        
        // Allow Enter key to add URL
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addFromUrlInManager();
            }
        });
        
        titleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addFromUrlInManager();
            }
        });
    }

    setupSearchInManager() {
        const searchInput = document.getElementById('librarySearch');
        if (!searchInput) return;
        
        // Add real-time search as user types
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            if (query === '') {
                // Show all tracks when search is empty
                this.loadMusicLibraryInManager();
            } else {
                // Filter tracks based on search query
                this.searchLibrary(query);
            }
        });
        
        // Add visual feedback on focus/blur
        searchInput.addEventListener('focus', () => {
            searchInput.style.borderColor = '#00ffff';
            searchInput.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.3)';
        });
        
        searchInput.addEventListener('blur', () => {
            searchInput.style.borderColor = '#00ff00';
            searchInput.style.boxShadow = 'none';
        });
        
        // Add Enter key support (for potential future features)
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    this.searchLibrary(query);
                }
            }
        });
        
        console.log('🔍 Music search functionality initialized');
    }
    
    addFromUrlInManager() {
        const urlInput = document.getElementById('musicUrlInput');
        const titleInput = document.getElementById('musicTitleInput');
        
        if (!urlInput || !titleInput) return;
        
        const url = urlInput.value.trim();
        const title = titleInput.value.trim() || 'Unknown Track';
        
        if (!url) {
            alert('Please enter a URL');
            return;
        }
        
        if (!this.isValidUrl(url)) {
            alert('Please enter a valid URL');
            return;
        }
        
        // Check if already in library
        if (this.musicLibrary.some(t => t.url === url)) {
            alert('This URL is already in your music library');
            return;
        }
        
        console.log(`🌐 Adding track from URL: ${title}`);
        
        // Add to library
        this.addToLibrary(title, url, "?:??");
        
        // Try to get duration
        const audio = new Audio(url);
        audio.addEventListener('loadedmetadata', () => {
            const duration = this.formatTime(audio.duration);
            const trackIndex = this.musicLibrary.findIndex(t => t.url === url);
            if (trackIndex !== -1) {
                this.musicLibrary[trackIndex].duration = duration;
                this.loadMusicLibraryInManager();
            }
        });
        
        audio.addEventListener('error', () => {
            console.warn('⚠️ Could not load audio from URL');
        });
        
        // Clear inputs
        urlInput.value = '';
        titleInput.value = '';
        
        // Refresh library
        this.loadMusicLibraryInManager();
        
        // Switch to library tab to show the new track
        this.switchMusicTab('library');
        
        console.log(`✅ Added track from URL: ${title}`);
    }
    
    renderCurrentPlaylist() {
        const playlistGrid = document.getElementById('currentPlaylistGrid');
        const playlistCount = document.getElementById('playlistCount');
        
        if (!playlistGrid) return;
        
        playlistGrid.innerHTML = '';
        
        this.playlist.forEach((track, index) => {
            const trackCard = this.createTrackCard(track, index, true);
            playlistGrid.appendChild(trackCard);
        });
        
        if (playlistCount) {
            playlistCount.textContent = this.playlist.length;
        }
    }
    
    renderMusicLibrary() {
        const libraryGrid = document.getElementById('musicLibraryGrid');
        
        if (!libraryGrid) return;
        
        libraryGrid.innerHTML = '';
        
        this.musicLibrary.forEach((track, index) => {
            const trackCard = this.createTrackCard(track, index, false);
            libraryGrid.appendChild(trackCard);
        });
    }
    
    createTrackCard(track, index, isInPlaylist) {
        const card = document.createElement('div');
        card.className = 'track-card';
        if (isInPlaylist && index === this.currentTrack) {
            card.classList.add('current');
        }
        
        const isInCurrentPlaylist = this.playlist.some(t => t.url === track.url);
        
        card.innerHTML = `
            <div class="track-title">${track.title}</div>
            <div class="track-info">Duration: ${track.duration}</div>
            <div class="track-actions">
                ${isInPlaylist ? 
                    `<button class="track-action-btn" onclick="musicPlayer.playTrack(${index})">▶️ PLAY</button>
                     <button class="track-action-btn" onclick="musicPlayer.removeFromPlaylist(${index})">🗑️ REMOVE</button>` :
                    `${!isInCurrentPlaylist ? 
                        `<button class="track-action-btn" onclick="musicPlayer.addToPlaylist(${index})">➕ ADD</button>` : 
                        `<button class="track-action-btn disabled">✅ IN PLAYLIST</button>`}
                     <button class="track-action-btn" onclick="musicPlayer.playFromLibrary(${index})">▶️ PLAY NOW</button>`
                }
            </div>
        `;
        
        return card;
    }
    
    addToPlaylist(libraryIndex) {
        const track = this.musicLibrary[libraryIndex];
        if (track && !this.playlist.some(t => t.url === track.url)) {
            this.playlist.push({...track});
            this.renderCurrentPlaylist();
            this.renderMusicLibrary(); // Refresh to update button states
            
            if (window.dumbassGame?.soundSystem) {
                window.dumbassGame.soundSystem.playSuccess();
            }
            
            console.log(`🎵 Added to playlist: ${track.title}`);
        }
    }
    
    removeFromPlaylist(playlistIndex) {
        if (playlistIndex >= 0 && playlistIndex < this.playlist.length) {
            const removed = this.playlist.splice(playlistIndex, 1)[0];
            this.renderCurrentPlaylist();
            this.renderMusicLibrary(); // Refresh to update button states
            
            // If we removed the current track, adjust currentTrack index
            if (playlistIndex === this.currentTrack) {
                if (this.playlist.length > 0) {
                    this.currentTrack = Math.min(this.currentTrack, this.playlist.length - 1);
                    this.loadTrack(this.currentTrack);
                } else {
                    this.pause();
                }
            } else if (playlistIndex < this.currentTrack) {
                this.currentTrack--;
            }
            
            console.log(`🎵 Removed from playlist: ${removed.title}`);
        }
    }
    
    playFromLibrary(libraryIndex) {
        const track = this.musicLibrary[libraryIndex];
        if (track) {
            // Add to playlist if not already there
            if (!this.playlist.some(t => t.url === track.url)) {
                this.playlist.push({...track});
            }
            
            // Find the track in the playlist and play it
            const playlistIndex = this.playlist.findIndex(t => t.url === track.url);
            if (playlistIndex !== -1) {
                this.loadTrack(playlistIndex);
                this.play();
                this.renderCurrentPlaylist();
                this.renderMusicLibrary();
            }
        }
    }
    
    clearPlaylist() {
        this.playlist = [];
        this.saveToStorage(); // Save changes
        this.pause();
        this.currentTrack = 0;
        this.renderCurrentPlaylist();
        this.renderMusicLibrary();
        // Also update Music Manager if it's open
        this.loadCurrentPlaylistInManager();
        this.updateTrackCountInManager();
        console.log('🗑️ Playlist cleared');
    }
    
    resetToDefaults() {
        // Clear all stored music data
        localStorage.removeItem('dumbassMusic_playlist');
        localStorage.removeItem('dumbassMusic_library');
        localStorage.removeItem('dumbassMusic_fileRefs');
        localStorage.removeItem('dumbassMusic_lastFolder');
        
        console.log('🔄 Resetting to default embedded playlist...');
        
        // Reset to defaults without page reload - stay in Music Manager
        this.playlist = [];
        this.musicLibrary = [];
        this.currentTrack = 0;
        this.pause();
        
        // Reinitialize with default tracks
        this.initializeDefaultTracks();
        
        // Copy all tracks to playlist by default
        this.playlist = [...this.musicLibrary];
        
        // Save the reset state
        this.saveToStorage();
        
        // Update displays
        this.loadCurrentPlaylistInManager();
        this.loadMusicLibraryInManager();
        this.updateTrackCountInManager();
        
        // Load first track
        if (this.playlist.length > 0) {
            this.loadTrack(0);
        }
        
        console.log('✅ Reset complete! All 28 default tracks restored.');
        
        // Play success sound
        if (window.dumbassGame?.soundSystem) {
            window.dumbassGame.soundSystem.playSuccess();
        }
    }
    
    shufflePlaylist() {
        if (this.playlist.length === 0) {
            console.log('🔀 Cannot shuffle empty playlist');
            return;
        }
        
        // Fisher-Yates shuffle algorithm
        for (let i = this.playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.playlist[i], this.playlist[j]] = [this.playlist[j], this.playlist[i]];
        }
        this.saveToStorage(); // Save changes
        this.currentTrack = 0;
        this.loadTrack(0);
        this.renderCurrentPlaylist();
        // Also update Music Manager if it's open
        this.loadCurrentPlaylistInManager();
        console.log('🔀 Playlist shuffled');
    }
    
    searchLibrary(query) {
        const libraryContainer = document.getElementById('musicLibraryTracks');
        if (!libraryContainer) return;
        
        libraryContainer.innerHTML = '';
        
        const filteredTracks = this.musicLibrary.filter(track => 
            track.title.toLowerCase().includes(query.toLowerCase())
        );
        
        filteredTracks.forEach((track, index) => {
            // Find original index in musicLibrary for proper action handling
            const originalIndex = this.musicLibrary.findIndex(t => t.url === track.url);
            const trackCard = this.createTrackCardInManager(track, originalIndex, false);
            libraryContainer.appendChild(trackCard);
        });
        
        // Show "No results" message if no tracks found
        if (filteredTracks.length === 0 && query.length > 0) {
            libraryContainer.innerHTML = `
                <div style="
                    grid-column: 1 / -1; text-align: center; padding: 40px;
                    color: #666; font-size: 0.8rem;
                ">
                    🔍 No tracks found matching "${query}"
                </div>
            `;
        }
    }
    
    setupFileDropZone() {
        const dropZone = document.getElementById('fileDropZone');
        const fileInput = document.getElementById('musicFileInput');
        
        if (!dropZone || !fileInput) return;
        
        // Click to browse files
        dropZone.addEventListener('click', () => fileInput.click());
        
        // Drag and drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
    }
    
    setupFolderSelector() {
        const folderBtn = document.querySelector('.folder-section .control-btn');
        if (!folderBtn) return;
        
        // Check if File System Access API is supported
        if ('showDirectoryPicker' in window) {
            folderBtn.addEventListener('click', this.selectMusicFolder.bind(this));
        } else {
            // Fallback for browsers without File System Access API
            folderBtn.disabled = true;
            folderBtn.textContent = '📁 NOT SUPPORTED';
            folderBtn.title = 'File System Access API not supported in this browser';
        }
    }
    
    async handleFiles(files) {
        const successFiles = [];
        
        for (const file of Array.from(files)) {
            if (file.type.startsWith('audio/')) {
                try {
                    const success = await this.processAudioFile(file);
                    if (success) {
                        successFiles.push(file.name);
                    }
                } catch (error) {
                    console.warn(`Failed to process ${file.name}:`, error);
                }
            }
        }
        
        if (successFiles.length > 0) {
            console.log(`🎵 Added ${successFiles.length} tracks from your files! Ready to play!`);
            this.renderMusicLibrary();
        }
    }
    
    addToLibrary(title, url, duration = "0:00", type = "embedded") {
        const newTrack = { title, url, duration, type };
        
        // Check if track already exists
        if (!this.musicLibrary.some(t => t.title === title)) {
            this.musicLibrary.push(newTrack);
            this.saveToStorage(); // Save changes
            this.renderMusicLibrary();
            console.log(`🎵 Added to library: ${title} (${type})`);
            
            if (window.dumbassGame?.soundSystem) {
                window.dumbassGame.soundSystem.playSuccess();
            }
        }
    }
    
    addFromUrl() {
        const urlInput = document.getElementById('musicUrlInput');
        const titleInput = document.getElementById('musicTitleInput');
        
        const url = urlInput.value.trim();
        const title = titleInput.value.trim() || 'Unknown Track';
        
        if (url && this.isValidUrl(url)) {
            this.addToLibrary(title, url);
            urlInput.value = '';
            titleInput.value = '';
        } else {
            alert('Please enter a valid URL');
        }
    }
    
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    async selectMusicFolder() {
        try {
            if ('showDirectoryPicker' in window) {
                const dirHandle = await window.showDirectoryPicker();
                await this.scanDirectory(dirHandle);
            }
        } catch (err) {
            console.log('Folder selection cancelled or failed:', err);
        }
    }
    
    async scanDirectory(dirHandle) {
        const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];
        
        for await (const entry of dirHandle.values()) {
            if (entry.kind === 'file') {
                const extension = entry.name.toLowerCase().slice(entry.name.lastIndexOf('.'));
                if (audioExtensions.includes(extension)) {
                    const file = await entry.getFile();
                    const url = URL.createObjectURL(file);
                    const title = entry.name.replace(/\.[^/.]+$/, "");
                    
                    this.addToLibrary(title, url);
                }
            }
        }
        
        console.log('🎵 Folder scan complete!');
    }
    
    scanMusicFolder() {
        this.selectMusicFolder();
    }
}

// Initialize the enhanced game system
let dumbassGame;
let musicPlayer;

// Old initialization code removed - now handled by main initialization system 

// Emergency Music Player - Simple and Working
class EmergencyMusicPlayer {
    constructor() {
        this.audio = document.createElement('audio');
        this.audio.style.display = 'none';
        this.audio.volume = 0.8;
        document.body.appendChild(this.audio);
        
        this.tracks = [
            'music/Celestial Sorrow Song.mp3',
            'music/Global Chaos Reggae.mp3',
            'music/Royal Purple Jam.mp3'
        ];
        
        this.currentTrack = 0;
        this.load();
        console.log('🚨 Emergency music player loaded');
    }
    
    load() {
        this.audio.src = this.tracks[this.currentTrack];
    }
    
    play() {
        this.audio.play().then(() => {
            console.log('🎵 Emergency player: Music playing!');
        }).catch(err => {
            console.log('❌ Emergency player failed:', err);
        });
    }
    
    pause() {
        this.audio.pause();
    }
    
    next() {
        this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
        this.load();
        this.play();
    }
}

// Create emergency player if main player fails
setTimeout(() => {
    if (!window.musicPlayer || !window.musicPlayer.audio) {
        console.log('🚨 Main music player failed, starting emergency player...');
        window.emergencyPlayer = new EmergencyMusicPlayer();
        
        // Connect to play button
        const playBtn = document.querySelector('.retro-btn.play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                if (window.emergencyPlayer.audio.paused) {
                    window.emergencyPlayer.play();
                    playBtn.textContent = '⏸';
                } else {
                    window.emergencyPlayer.pause();
                    playBtn.textContent = '▶';
                }
            });
        }
        
        // Auto-start
        window.emergencyPlayer.play();
    }
}, 2000);

// Firebase Database Manager
class FirebaseDataManager {
    constructor() {
        this.db = null;
        this.collection = null;
        this.isInitialized = false;
        this.initializeFirestore();
    }

    initializeFirestore() {
        // Wait for Firebase to be initialized
        setTimeout(() => {
            if (window.firebaseDb) {
                this.db = window.firebaseDb;
                this.collection = window.firebaseCollection;
                this.isInitialized = true;
                console.log('🔥 Firestore initialized');
                this.migrateFromLocalStorage();
            } else {
                this.initializeFirestore(); // Retry
            }
        }, 1000);
    }

    async addGame(gameData) {
        if (!this.isInitialized) {
            console.error('Firestore not initialized');
            return false;
        }

        try {
            const currentUser = window.firebaseAuth.currentUser;
            const docRef = await window.firebaseAddDoc(this.collection, {
                ...gameData,
                createdAt: new Date().toISOString(),
                createdBy: currentUser?.uid || 'anonymous',
                submittedAt: window.firebaseServerTimestamp(),
                submittedBy: currentUser?.uid || 'anonymous',
                status: 'active'
            });
            console.log('🎮 Game added to Firebase:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('❌ Error adding game to Firebase:', error);
            
            // Check for specific Firebase errors and provide user-friendly messages
            if (error.message && error.message.includes('longer than 1048487 bytes')) {
                // Image too large error
                if (window.dumbassGame?.notificationManager) {
                    window.dumbassGame.notificationManager.showError('🚫 Image too large for Firebase! The image after conversion is over 1MB. Please: 1) Use a smaller image 2) Compress your image 3) Use "🔗 USE URL" method instead');
                }
                throw new Error('Image size exceeds Firebase limits. Please use a smaller image or URL method.');
            } else if (error.message && error.message.includes('PERMISSION_DENIED')) {
                // Permission error
                if (window.dumbassGame?.notificationManager) {
                    window.dumbassGame.notificationManager.showError('🚫 Permission denied. Please sign in and try again.');
                }
                throw new Error('Permission denied - please sign in');
            } else {
                // Generic Firebase error
                if (window.dumbassGame?.notificationManager) {
                    window.dumbassGame.notificationManager.showError('❌ Failed to save game to database. Please try again or contact support.');
                }
                throw new Error('Failed to save to Firebase');
            }
        }
    }

    async getGames() {
        if (!this.isInitialized) {
            console.error('Firestore not initialized');
            return [];
        }

        try {
            const querySnapshot = await window.firebaseGetDocs(
                window.firebaseQuery(this.collection, window.firebaseOrderBy('createdAt', 'desc'))
            );
            const games = [];
            querySnapshot.forEach((doc) => {
                games.push({ id: doc.id, ...doc.data() });
            });
            console.log('📥 Loaded games from Firebase:', games.length);
            return games;
        } catch (error) {
            console.error('❌ Error loading games from Firebase:', error);
            return [];
        }
    }

    async updateGame(gameId, gameData) {
        if (!this.isInitialized) {
            console.error('Firestore not initialized');
            return false;
        }

        try {
            await window.firebaseUpdateDoc(window.firebaseDoc(this.db, 'games', gameId), {
                ...gameData,
                updatedAt: new Date().toISOString()
            });
            console.log('✏️ Game updated in Firebase:', gameId);
            return true;
        } catch (error) {
            console.error('❌ Error updating game in Firebase:', error);
            return false;
        }
    }

    async deleteGame(gameId) {
        if (!this.isInitialized) {
            console.error('Firestore not initialized');
            return false;
        }

        try {
            await window.firebaseDeleteDoc(window.firebaseDoc(this.db, 'games', gameId));
            console.log('🗑️ Game deleted from Firebase:', gameId);
            return true;
        } catch (error) {
            console.error('❌ Error deleting game from Firebase:', error);
            return false;
        }
    }

    async migrateFromLocalStorage() {
        // TEMPORARILY DISABLED to prevent further duplication  
        console.log('🚫 Migration temporarily disabled to prevent duplicates');
        console.log('💡 Use dumbassGameAdmin.cleanupDuplicates() to fix existing duplicates');
        return;
        
        try {
            const localGames = JSON.parse(localStorage.getItem('dumbassGames') || '[]');
            if (localGames.length > 0) {
                console.log('🔄 Migrating games from localStorage to Firebase...');
                
                // First check what's already in Firebase to prevent duplicates
                const existingGames = await this.getGames();
                const existingTitles = existingGames.map(g => g.title.toLowerCase().trim());
                console.log(`📊 Found ${existingGames.length} existing games in Firebase`);
                
                let migratedCount = 0;
                let skippedCount = 0;
                
                for (const game of localGames) {
                    const gameTitle = game.title.toLowerCase().trim();
                    
                    // Only add if it doesn't already exist
                    if (!existingTitles.includes(gameTitle)) {
                        const success = await this.addGame(game);
                        if (success) {
                            migratedCount++;
                            console.log(`✅ Migrated: "${game.title}"`);
                        }
                    } else {
                        skippedCount++;
                        console.log(`⏭️ Skipped duplicate: "${game.title}"`);
                    }
                }
                
                console.log(`✅ Migration complete: ${migratedCount} new, ${skippedCount} skipped`);
                
                // Clear localStorage after migration attempt
                localStorage.removeItem('dumbassGames');
                console.log('🧹 Cleared localStorage after migration');
                
                // Sync with enhanced game manager so games appear in UI
                if (window.enhancedGameManager) {
                    await window.enhancedGameManager.syncWithFirebase();
                    console.log('🔄 Enhanced game manager synced with Firebase after migration');
                }
            }
        } catch (error) {
            console.error('❌ Error migrating from localStorage:', error);
        }
    }

    async cleanupDuplicateGames() {
        try {
            console.log('🧹 Starting Firebase duplicate cleanup...');
            const allGames = await this.getGames();
            console.log(`📊 Found ${allGames.length} total games in Firebase`);
            
            if (allGames.length <= 6) {
                console.log('✅ No cleanup needed - game count is normal');
                return { message: 'No cleanup needed', gameCount: allGames.length };
            }
            
            // Group by title (case insensitive)
            const gamesByTitle = {};
            allGames.forEach(game => {
                const title = game.title.toLowerCase().trim();
                if (!gamesByTitle[title]) {
                    gamesByTitle[title] = [];
                }
                gamesByTitle[title].push(game);
            });
            
            let duplicatesRemoved = 0;
            
            // Keep only the first occurrence of each title
            for (const [title, games] of Object.entries(gamesByTitle)) {
                if (games.length > 1) {
                    console.log(`🔍 Found ${games.length} copies of "${title}"`);
                    // Keep the first, delete the rest
                    for (let i = 1; i < games.length; i++) {
                        await this.deleteGame(games[i].id);
                        duplicatesRemoved++;
                        console.log(`🗑️ Removed duplicate #${i} of "${title}"`);
                    }
                }
            }
            
            console.log(`✅ Cleanup complete! Removed ${duplicatesRemoved} duplicates`);
            console.log(`📊 Unique games remaining: ${Object.keys(gamesByTitle).length}`);
            
            return {
                originalCount: allGames.length,
                duplicatesRemoved: duplicatesRemoved,
                finalCount: Object.keys(gamesByTitle).length
            };
        } catch (error) {
            console.error('❌ Error cleaning duplicates:', error);
            throw error;
        }
    }
}

// Firebase Authentication System
class FirebaseAuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthTabLogin = true;
        this.initializeAuth();
    }

    initializeAuth() {
        // Wait for Firebase to be initialized
        setTimeout(() => {
            if (window.firebaseAuth && window.onAuthStateChanged) {
                window.onAuthStateChanged(window.firebaseAuth, async (user) => {
                    this.currentUser = user;
                    this.updateAuthUI(user);
                    if (user) {
                        console.log('🔥 User signed in:', user.email);
                        await this.notifyUserSignedIn(user);
                    } else {
                        console.log('🔓 User signed out');
                    }
                });
            }
        }, 1000);
        
        // Setup auth form handler
        this.setupAuthForm();
    }

    setupAuthForm() {
        const authForm = document.getElementById('authForm');
        if (authForm) {
            authForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleAuthSubmit();
            });
        }
        
        // Setup modal click-outside-to-close
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.addEventListener('click', (e) => {
                if (e.target === authModal) {
                    this.hideAuthModal();
                }
            });
        }
    }

    async handleAuthSubmit() {
        const email = document.getElementById('authEmail').value.trim();
        const password = document.getElementById('authPassword').value;
        const confirmPassword = document.getElementById('authConfirmPassword').value;

        if (!email || !password) {
            this.showAuthError('Please fill in all required fields.');
            return;
        }

        if (!this.isAuthTabLogin && password !== confirmPassword) {
            this.showAuthError('Passwords do not match.');
            return;
        }

        // Check terms agreement for signup
        if (!this.isAuthTabLogin) {
            const agreeToTerms = document.getElementById('agreeToTerms');
            if (!agreeToTerms || !agreeToTerms.checked) {
                this.showAuthError('You must agree to the Terms of Service to create an account.');
                return;
            }
        }

        if (password.length < 6) {
            this.showAuthError('Password must be at least 6 characters long.');
            return;
        }

        try {
            const submitBtn = document.getElementById('authSubmitBtn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '⏳ PROCESSING...';
            submitBtn.disabled = true;

            if (this.isAuthTabLogin) {
                await this.signIn(email, password);
            } else {
                await this.signUp(email, password);
            }
        } catch (error) {
            console.error('Auth error:', error);
        } finally {
            const submitBtn = document.getElementById('authSubmitBtn');
            submitBtn.innerHTML = this.isAuthTabLogin ? '🚀 LOGIN' : '🚀 SIGN UP';
            submitBtn.disabled = false;
        }
    }

    updateAuthUI(user) {
        if (user) {
            // User is signed in - mark has account and update dynamic auth button
            window.dumbassGame?.markUserHasAccount();
            
            // Update user info in modal - use display name if available
            this.updateWelcomeMessage(user);
            if (document.getElementById('userInfo')) {
                document.getElementById('userInfo').style.display = 'block';
            }
            if (document.getElementById('authForm')) {
                document.getElementById('authForm').style.display = 'none';
            }
            if (document.querySelector('.auth-tabs')) {
                document.querySelector('.auth-tabs').style.display = 'none';
            }
            
            // Update admin button visibility
            setTimeout(() => {
                // Admin button removed - no longer needed
                // Admin button removed - no longer needed
            }, 500);
        } else {
            // User is signed out - update dynamic auth button
            window.dumbassGame?.updateAuthButton();
            
            // Reset modal to form view
            if (document.getElementById('userInfo')) {
                document.getElementById('userInfo').style.display = 'none';
            }
            if (document.getElementById('authForm')) {
                document.getElementById('authForm').style.display = 'block';
            }
            if (document.querySelector('.auth-tabs')) {
                document.querySelector('.auth-tabs').style.display = 'flex';
            }
            
            // Admin button removed - no longer needed
        }

        // Notify user profile manager of auth state change
        if (window.userProfileManager) {
            window.userProfileManager.loadUserData().then(() => {
                // Update dynamic auth button after profile loads
                window.dumbassGame?.updateAuthButton();
                // Force update profile UI to refresh avatar
                window.userProfileManager.updateProfileUI();
            }).catch(error => {
                console.warn('⚠️ Failed to load user data on auth change:', error);
            });
            
            // Try to update header username immediately
            setTimeout(() => window.userProfileManager.updateHeaderUsername(), 100);
            
            // Reload everything after sign-in with a small delay to ensure Firebase is ready
            setTimeout(async () => {
                try {
                    await window.userProfileManager.loadUserFavorites();
                    await window.userProfileManager.loadUserProfile(); // Ensure profile is loaded
                    window.userProfileManager.updateHeartIcons();
                    window.userProfileManager.updateHeaderUsername();
                    window.userProfileManager.updateProfileUI(); // This will update avatar
                    window.dumbassGame?.updateAuthButton(); // Final auth button update
                    console.log('✅ Full profile reload completed on auth change');
                } catch (error) {
                    console.warn('⚠️ Error during full profile reload:', error);
                }
            }, 1000);
        }
    }

    async updateWelcomeMessage(user) {
        // Try to get display name from user profile
        let displayName = user.email; // fallback to email
        
        try {
            if (window.persistenceManager) {
                const userProfile = await window.persistenceManager.loadUserProfile();
                if (userProfile && userProfile.displayName && userProfile.displayName.trim()) {
                    displayName = userProfile.displayName;
                }
            }
        } catch (error) {
            console.log('Could not load user profile for welcome message, using email');
        }
        
        document.getElementById('userEmail').textContent = displayName;
    }

    async notifyUserSignedIn(user) {
        // Prevent spam: only show once per session
        if (window.hasShownWelcomeBackNotification) return;
        window.hasShownWelcomeBackNotification = true;
        
        // Try to get display name for notification
        let displayName = user.email; // fallback to email
        try {
            if (window.persistenceManager) {
                const userProfile = await window.persistenceManager.loadUserProfile();
                if (userProfile && userProfile.displayName && userProfile.displayName.trim()) {
                    displayName = userProfile.displayName;
                }
            }
        } catch (error) {
            console.log('Could not load user profile for notification, using email');
        }
        
        if (window.dumbassGame && window.dumbassGame.notificationManager) {
            window.dumbassGame.notificationManager.showSuccess(`Welcome back, ${displayName}! 🎮`);
        }
    }

    async signIn(email, password) {
        try {
            if (!window.firebaseAuth || !window.signInWithEmailAndPassword) {
                throw new Error('Firebase not initialized');
            }
            
            const userCredential = await window.signInWithEmailAndPassword(window.firebaseAuth, email, password);
            this.hideAuthError();
            this.hideAuthModal();
            return userCredential.user;
        } catch (error) {
            this.showAuthError(this.getErrorMessage(error));
            throw error;
        }
    }

    async signUp(email, password) {
        try {
            if (!window.firebaseAuth || !window.createUserWithEmailAndPassword) {
                throw new Error('Firebase not initialized');
            }
            
            console.log('🚀 Starting signup process for:', email);
            const userCredential = await window.createUserWithEmailAndPassword(window.firebaseAuth, email, password);
            const user = userCredential.user;
            console.log('✅ Firebase user created:', user.uid);
            
            // BULLETPROOF: Create user profile immediately and directly in Firebase
            const newUserProfile = {
                email: email,
                displayName: email.split('@')[0], // Use email prefix as display name
                bio: 'Welcome to DUMBASSGAMES! Add your bio here...',
                joinDate: new Date().toISOString(),
                termsAccepted: true,
                termsAcceptedDate: new Date().toISOString(),
                version: '1.1',
                // Tier system - start with FREE
                tier: 'FREE',
                tierExpiry: null,
                submissionCount: { daily: 0, weekly: 0, monthly: 0 },
                lastSubmission: null,
                favoritesCount: 0,
                // Play tracking for analytics
                gamesPlayed: 0,
                lastActive: new Date().toISOString(),
                // Preferences
                preferences: { sound: true, effects: true }
            };
            
            // Save directly to Firebase with retry logic
            let profileSaved = false;
            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    console.log(`💾 Saving profile to Firebase (attempt ${attempt})...`);
                    await window.firebaseSetDoc(
                        window.firebaseDoc(window.firebaseDb, 'userProfiles', user.uid),
                        newUserProfile
                    );
                    console.log(`✅ Profile saved to Firebase successfully (attempt ${attempt})`);
                    profileSaved = true;
                    break;
                } catch (profileError) {
                    console.warn(`⚠️ Profile save failed (attempt ${attempt}):`, profileError);
                    if (attempt === 3) {
                        throw new Error(`Failed to create user profile after 3 attempts: ${profileError.message}`);
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
                }
            }
            
            if (!profileSaved) {
                throw new Error('Failed to create user profile in Firebase');
            }
            
            // Wait a moment for Firebase to sync
            await new Promise(resolve => setTimeout(resolve, 500));
            
            this.hideAuthError();
            this.hideAuthModal();
            
            // Show special welcome popup for new users
            setTimeout(() => {
                this.showWelcomeToArcadePopup();
            }, 1000);
            
            console.log('🎉 Signup completed successfully for:', email);
            return user;
        } catch (error) {
            console.error('❌ Signup failed:', error);
            this.showAuthError(this.getErrorMessage(error));
            throw error;
        }
    }

    showWelcomeToArcadePopup() {
        // Create the retro arcade welcome popup
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: 'Press Start 2P', monospace;
            animation: fadeIn 0.5s ease-in;
        `;
        
        popup.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                border: 3px solid #00ffff;
                border-radius: 15px;
                padding: 40px;
                max-width: 500px;
                text-align: center;
                position: relative;
                box-shadow: 
                    0 0 50px rgba(0, 255, 255, 0.5),
                    inset 0 0 20px rgba(0, 255, 255, 0.1);
                animation: glow 2s ease-in-out infinite alternate;
            ">
                <div style="
                    color: #00ffff;
                    font-size: 1.2rem;
                    margin-bottom: 20px;
                    text-shadow: 0 0 10px #00ffff;
                ">🎮 WELCOME TO THE ARCADE! 🎮</div>
                
                <div style="
                    color: #00ff00;
                    font-size: 0.6rem;
                    line-height: 1.6;
                    margin: 20px 0;
                    border-top: 1px solid #00ff00;
                    border-bottom: 1px solid #00ff00;
                    padding: 20px 0;
                ">
                    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━<br/>
                    <span style="color: #ffff00;">⚡ SYSTEM OPTIMIZED FOR DESKTOP ⚡</span><br/>
                    Best experienced on desktop/laptop<br/>
                    Some games may not work on mobile<br/>
                    <br/>
                    <span style="color: #ff6600;">🎵 Music system, retro vibes, and coding showcase</span><br/>
                    Ready to explore some dumbass games?<br/>
                    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                </div>
                
                <button onclick="this.closest('div').parentElement.remove()" style="
                    background: linear-gradient(135deg, #00ff00, #00cc00);
                    border: 2px solid #00ff00;
                    color: #000;
                    padding: 15px 30px;
                    font-family: 'Press Start 2P', monospace;
                    font-size: 0.6rem;
                    border-radius: 8px;
                    cursor: pointer;
                    box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    font-weight: bold;
                " 
                onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 0 30px rgba(0, 255, 0, 0.8)';"
                onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 0 20px rgba(0, 255, 0, 0.5)';">
                    🚀 LET'S GO!
                </button>
                
                <div style="
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    width: 20px;
                    height: 20px;
                    background: #ff0066;
                    border-radius: 50%;
                    animation: pulse 1.5s ease-in-out infinite;
                "></div>
            </div>
        `;
        
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
            }
            @keyframes glow {
                from { box-shadow: 0 0 50px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(0, 255, 255, 0.1); }
                to { box-shadow: 0 0 80px rgba(0, 255, 255, 0.8), inset 0 0 30px rgba(0, 255, 255, 0.2); }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(popup);
        
        // Play success sound if available
        if (window.dumbassGame?.soundSystem) {
            window.dumbassGame.soundSystem.playSuccess();
        }
        
        // Auto-close after 15 seconds if user doesn't click
        setTimeout(() => {
            if (popup.parentElement) {
                popup.remove();
            }
        }, 15000);
        
        console.log('🎮 Welcome to the Arcade popup displayed');
    }

    async signOut() {
        try {
            if (!window.firebaseAuth || !window.signOut) {
                throw new Error('Firebase not initialized');
            }
            
            await window.signOut(window.firebaseAuth);
            this.hideAuthModal();
            if (window.dumbassGame && window.dumbassGame.notificationManager) {
                window.dumbassGame.notificationManager.showSuccess('Signed out successfully! 👋');
            }
        } catch (error) {
            console.error('Error signing out:', error);
            if (window.dumbassGame && window.dumbassGame.notificationManager) {
                window.dumbassGame.notificationManager.showError('Error signing out. Please try again.');
            }
        }
    }

    getErrorMessage(error) {
        switch (error.code) {
            case 'auth/user-not-found':
                return 'No account found with this email address.';
            case 'auth/wrong-password':
                return 'Incorrect password. Please try again.';
            case 'auth/email-already-in-use':
                return 'An account with this email already exists.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/too-many-requests':
                return 'Too many failed attempts. Please try again later.';
            case 'auth/network-request-failed':
                return 'Network error. Please check your connection and try again.';
            default:
                return error.message || 'An unexpected error occurred.';
        }
    }

    showAuthError(message) {
        const errorDiv = document.getElementById('authError');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideAuthError();
        }, 5000);
    }

    hideAuthError() {
        const errorDiv = document.getElementById('authError');
        errorDiv.style.display = 'none';
    }

    showAuthModal() {
        document.getElementById('authModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // Always default to login tab when opening modal
        this.switchTab('login');
        // Focus on email field
        setTimeout(() => {
            document.getElementById('authEmail').focus();
        }, 100);
    }

    hideAuthModal() {
        document.getElementById('authModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.hideAuthError();
        // Reset form
        document.getElementById('authForm').reset();
    }

    switchTab(tab) {
        this.isAuthTabLogin = (tab === 'login');
        
        // Update tab buttons
        document.querySelectorAll('.auth-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        // Update form
        const confirmPasswordField = document.getElementById('authConfirmPassword');
        const termsAgreement = document.getElementById('termsAgreement');
        const submitBtn = document.getElementById('authSubmitBtn');
        const modalTitle = document.getElementById('authModalTitle');
        
        if (tab === 'login') {
            confirmPasswordField.style.display = 'none';
            confirmPasswordField.required = false;
            if (termsAgreement) {
                termsAgreement.style.display = 'none';
                // Disable the checkbox to prevent form validation issues
                const checkbox = document.getElementById('agreeToTerms');
                if (checkbox) {
                    checkbox.required = false;
                }
            }
            submitBtn.innerHTML = '🚀 LOGIN';
            modalTitle.textContent = 'LOGIN';
        } else {
            confirmPasswordField.style.display = 'block';
            confirmPasswordField.required = true;
            if (termsAgreement) {
                termsAgreement.style.display = 'block';
                // Enable the checkbox for signup
                const checkbox = document.getElementById('agreeToTerms');
                if (checkbox) {
                    checkbox.required = true;
                }
            }
            submitBtn.innerHTML = '🚀 SIGN UP';
            modalTitle.textContent = 'SIGN UP';
        }
        
        this.hideAuthError();
    }
}

// Initialize authentication manager
let authManager;

// Global authentication functions
function handleAuthClick() {
    // Check if user is logged in
    if (window.authManager && window.authManager.currentUser) {
        // User is logged in - show profile
        showUserProfile();
    } else {
        // User is not logged in - show auth modal
        showAuthModal();
    }
}

function showAuthModal() {
    if (window.authManager && window.authManager.showAuthModal) {
        window.authManager.showAuthModal();
    } else if (window.firebaseAuth) {
        // Fallback: create a simple login prompt
        console.warn('⚠️ Auth manager not ready, please wait for initialization...');
        setTimeout(() => {
            if (window.authManager) {
                window.authManager.showAuthModal();
            }
        }, 1000);
    } else {
        console.warn('⚠️ Authentication system not ready yet, please wait...');
    }
}

function hideAuthModal() {
    if (window.authManager) {
        window.authManager.hideAuthModal();
    }
}

function switchAuthTab(tab) {
    if (window.authManager) {
        window.authManager.switchTab(tab);
    }
}

function toggleAuth() {
    if (window.authManager) {
        window.authManager.showAuthModal();
    }
}

async function logout() {
    if (window.authManager) {
        await window.authManager.signOut();
    }
    
    // Hide the header username display
    const userIndicator = document.getElementById('userIndicator');
    if (userIndicator) {
        userIndicator.style.display = 'none';
    }
}

// Terms of Service modal functions
function showTermsModal(event) {
    if (event) {
        event.preventDefault();
    }
    document.getElementById('termsModal').style.display = 'block';
}

function hideTermsModal() {
    document.getElementById('termsModal').style.display = 'none';
}

// Initialize Firebase managers after DOM loads
// Firebase managers are initialized in the main initialization system below

// Initialize global settings
window.soundEnabled = true;
window.effectsEnabled = true;

// Professional loading message
console.log('%c🎮 DUMBASSGAMES v2.1', 'background: linear-gradient(45deg, #00ff00, #00ffff); color: #000; padding: 10px; font-size: 16px; font-weight: bold; border-radius: 5px;');

// Enhanced keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        showAddGameForm();
    }
    if (e.key === 'Escape') {
        hideAddGameForm();
        hideAuthModal();
        hideUserProfile();
        hideSearchFilter();
    }
    // Music player shortcuts
    if (e.key === ' ' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        if (window.musicPlayer) musicPlayer.togglePlay();
    }
});

// Enhanced modal click-outside-to-close
document.getElementById('addGameModal').addEventListener('click', function(e) {
    if (e.target === this) {
        hideAddGameForm();
    }
});

// Game count is automatically updated by the script.js

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`%c⚡ Loaded in ${Math.round(loadTime)}ms`, 'color: #00ffff; font-weight: bold;');
});

// =============================
//    PHASE 3: ADVANCED FEATURES
// =============================

// Fixed Tier Management System
class TierManager {
    constructor() {
        this.tiers = {
            FREE: {
                name: 'FREE',
                displayName: 'Free Player',
                price: 0,
                limits: {
                    favorites: 15,
                    submissionsPerMonth: 2,  // FREE tier gets 2 per month
                    submissionsPerWeek: -1,  // No weekly limit for FREE
                    submissionsPerDay: -1    // No daily limit for FREE
                },
                features: ['Browse & play all games', 'Basic profile'],
                badge: '🕹️',
                color: '#666666'
            },
            PRO: {
                name: 'PRO',
                displayName: 'Pro Gamer',
                price: 5,
                limits: {
                    favorites: 100,
                    submissionsPerMonth: 8,
                    submissionsPerWeek: -1,
                    submissionsPerDay: -1
                },
                features: ['Everything in FREE', 'PRO badge', 'Basic stats'],
                badge: '⭐',
                color: '#00ffff'
            },
            DEV: {
                name: 'DEV',
                displayName: 'Game Dev',
                price: 10,
                limits: {
                    favorites: -1, // unlimited
                    submissionsPerMonth: -1,
                    submissionsPerWeek: -1,
                    submissionsPerDay: -1
                },
                features: ['Everything in PRO', 'DEV badge', 'Game analytics', 'Edit games'],
                badge: '🚀',
                color: '#00ff00'
            }
        };
    }

    getTierInfo(tierName) {
        return this.tiers[tierName] || this.tiers.FREE;
    }

    async checkSubmissionLimits(userProfile) {
        console.log('🔍 Checking submission limits for:', userProfile?.email, 'Tier:', userProfile?.tier);
        
        if (!userProfile) {
            console.log('❌ No user profile found');
            return { allowed: false, reason: 'No user profile found' };
        }

        const tier = this.getTierInfo(userProfile.tier || 'FREE');
        console.log('🎯 Using tier limits:', tier.limits);
        
        const now = new Date();
        
        // Initialize submission counts if missing
        if (!userProfile.submissionCount) {
            userProfile.submissionCount = { daily: 0, weekly: 0, monthly: 0 };
            console.log('🔧 Initialized submission counts');
        }

        // Reset monthly count if it's a new month
        const lastSubmission = userProfile.lastSubmission ? new Date(userProfile.lastSubmission) : null;
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        if (!lastSubmission || lastSubmission < monthStart) {
            console.log('🗓️ New month detected, resetting monthly count');
            userProfile.submissionCount.monthly = 0;
        }

        const counts = userProfile.submissionCount;
        console.log('📊 Current submission counts:', counts);

        // For FREE tier, only check monthly limit (2 per month)
        if (tier.name === 'FREE') {
            if (counts.monthly >= tier.limits.submissionsPerMonth) {
                const nextMonth = new Date(monthStart);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                console.log('🚫 Monthly limit reached for FREE tier');
                return { 
                    allowed: false, 
                    reason: `Monthly limit reached (${tier.limits.submissionsPerMonth}). Next submission: ${nextMonth.toLocaleDateString()}`,
                    nextAllowed: nextMonth,
                    limitType: 'monthly'
                };
            }
        }

        // For other tiers, check their specific limits
        if (tier.limits.submissionsPerMonth > 0 && counts.monthly >= tier.limits.submissionsPerMonth) {
            const nextMonth = new Date(monthStart);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            console.log('🚫 Monthly limit reached');
            return { 
                allowed: false, 
                reason: `Monthly limit reached (${tier.limits.submissionsPerMonth}). Next submission: ${nextMonth.toLocaleDateString()}`,
                nextAllowed: nextMonth,
                limitType: 'monthly'
            };
        }

        console.log('✅ Submission allowed');
        return { allowed: true };
    }

    // New function to check if user can submit a game
    async canSubmitGame(userProfile) {
        console.log('🎮 Checking if user can submit game...');
        
        if (!userProfile) {
            console.log('❌ No user profile - showing upgrade');
            return { 
                canSubmit: false, 
                reason: 'Please sign in to submit games',
                showUpgrade: true 
            };
        }

        const limitCheck = await this.checkSubmissionLimits(userProfile);
        
        if (!limitCheck.allowed) {
            console.log('🚫 Submission not allowed:', limitCheck.reason);
            return {
                canSubmit: false,
                reason: limitCheck.reason,
                showUpgrade: true,
                limitType: limitCheck.limitType,
                nextAllowed: limitCheck.nextAllowed
            };
        }

        console.log('✅ User can submit game');
        return { canSubmit: true };
    }

    async recordSubmission(userProfile) {
        if (!userProfile.submissionCount) {
            userProfile.submissionCount = { daily: 0, weekly: 0, monthly: 0 };
        }

        userProfile.submissionCount.daily++;
        userProfile.submissionCount.weekly++;
        userProfile.submissionCount.monthly++;
        userProfile.lastSubmission = new Date().toISOString();

        // Save updated profile
        if (window.persistenceManager) {
            await window.persistenceManager.saveUserProfile(userProfile);
        }
    }

    checkFavoritesLimit(userProfile, currentFavoritesCount) {
        const tier = this.getTierInfo(userProfile.tier);
        if (tier.limits.favorites === -1) return { allowed: true }; // unlimited

        if (currentFavoritesCount >= tier.limits.favorites) {
            return { 
                allowed: false, 
                reason: `Favorites limit reached (${tier.limits.favorites}). Upgrade to add more!`,
                limit: tier.limits.favorites
            };
        }

        return { allowed: true };
    }

    async trackGamePlay(userProfile) {
        if (!userProfile) return;

        userProfile.gamesPlayed = (userProfile.gamesPlayed || 0) + 1;
        userProfile.lastActive = new Date().toISOString();

        // Save updated profile (silent to avoid spam)
        if (window.persistenceManager) {
            await window.persistenceManager.saveUserProfile(userProfile);
        }
    }

    getTierBadgeHtml(userProfile) {
        if (!userProfile || !userProfile.tier) return '';
        
        const tier = this.getTierInfo(userProfile.tier);
        return `<span class="tier-badge tier-${tier.name.toLowerCase()}" title="${tier.displayName}" style="color: ${tier.color}">${tier.badge}</span>`;
    }

    getTierLimitsText(tierName) {
        const tier = this.getTierInfo(tierName);
        const limits = [];
        
        if (tier.limits.favorites === -1) {
            limits.push('Unlimited favorites');
        } else {
            limits.push(`${tier.limits.favorites} favorites max`);
        }

        if (tier.limits.submissionsPerMonth === -1) {
            limits.push('Unlimited submissions');
        } else {
            limits.push(`${tier.limits.submissionsPerMonth} submissions/month`);
        }

        return limits.join(', ');
    }
}

// Payment and Upgrade System
class PaymentManager {
    constructor() {
        this.paypal = null;
        this.initializePayPal();
    }

    async initializePayPal() {
        // Initialize PayPal - LIVE PRODUCTION MODE
        this.paypalClientId = 'BAAvzARQAIFfScIJzmycPhDg5AcXSgs2oQfCTxyq5HHvJRfbtIAms5FpQf5oVePsvC_zICrER7rRKYeFCU'; // PayPal LIVE Production Client ID
        this.paypalEnvironment = 'production'; // LIVE PRODUCTION MODE
        this.paypalSDKLoaded = false;
        console.log('💰 PayPal payment manager initialized (LIVE PRODUCTION MODE)');
        
        // Load PayPal SDK if not already loaded
        if (!window.paypal && !document.querySelector('script[src*="paypal"]') && !this.paypalSDKLoaded) {
            await this.loadPayPalSDK();
        }
    }

    async loadPayPalSDK() {
        if (this.paypalSDKLoaded) return;
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            // PayPal SDK with environment support
            const environment = this.paypalEnvironment === 'sandbox' ? '&debug=true' : '';
            script.src = `https://www.paypal.com/sdk/js?client-id=${this.paypalClientId}&currency=USD&intent=capture&commit=true&disable-funding=paylater${environment}`;
            script.onload = () => {
                console.log(`💰 PayPal SDK loaded (${this.paypalEnvironment.toUpperCase()})`);
                this.paypalSDKLoaded = true;
                resolve();
            };
            script.onerror = () => {
                console.error('❌ Failed to load PayPal SDK');
                reject(new Error('Failed to load PayPal SDK'));
            };
            document.head.appendChild(script);
        });
    }

    async initiateUpgrade(tier, priceInDollars) {
        if (!window.userProfileManager?.currentUser) {
            window.userProfileManager?.showAuthModal();
            window.notificationManager?.showError('Please sign in to upgrade your account');
            return;
        }

        try {
            console.log(`💎 Initiating PayPal upgrade to ${tier} ($${priceInDollars}/month)`);
            
            // Show PayPal button modal
            this.showPayPalModal(tier, priceInDollars);
            
        } catch (error) {
            console.error('❌ Upgrade error:', error);
            window.notificationManager?.showError('Failed to initialize payment. Please try again.');
        }
    }

    showPayPalModal(tier, priceInDollars) {
        // Remove any existing PayPal modals first
        const existingModal = document.querySelector('.paypal-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create PayPal payment modal
        const modal = document.createElement('div');
        modal.className = 'modal paypal-modal';
        modal.style.display = 'block';
        
        modal.innerHTML = `
            <div class="modal-content paypal-modal-content">
                <div class="modal-header">
                    <h3>💰 Complete Your Upgrade</h3>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="paypal-modal-body">
                    <div class="upgrade-summary">
                        <div class="tier-info">
                            <h4>Upgrading to: ${tier} TIER</h4>
                            <p class="price">$${priceInDollars}/month</p>
                        </div>
                    </div>
                    <div class="payment-section">
                        <h5>Complete Payment:</h5>
                        ${this.paypalEnvironment === 'sandbox' ? '<div class="sandbox-notice">⚠️ DEMO MODE: Using PayPal Sandbox (test payments only)</div>' : ''}
                        <div class="payment-options">
                            <div class="paypal-container-centered">
                                <div id="paypal-button-container-${tier.toLowerCase()}" class="paypal-button-fixed"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Initialize PayPal button
        setTimeout(() => {
            if (window.paypal && window.paypal.Buttons) {
                this.initializePayPalButton(tier, priceInDollars);
            } else {
                const container = document.getElementById(`paypal-button-container-${tier.toLowerCase()}`);
                if (container) {
                    container.innerHTML = `
                        <div style="text-align: center; padding: 30px; color: #ff4444;">
                            <h4 style="color: #ff4444; margin: 0 0 15px 0;">⚠️ Payment Unavailable</h4>
                            <p style="font-size: 12px; margin: 10px 0;">PayPal is currently unavailable.</p>
                            <p style="font-size: 10px; color: #888;">Please try refreshing the page or contact support.</p>
                        </div>
                    `;
                }
            }
        }, 150);
    }

    async initializePayPalButton(tier, priceInDollars) {
        const containerId = `paypal-button-container-${tier.toLowerCase()}`;
        const container = document.getElementById(containerId);
        
        if (!window.paypal) {
            console.error('PayPal SDK not available');
            return;
        }

        if (!container) {
            console.error('PayPal container not found:', containerId);
            return;
        }

        // Clear container first to prevent duplicates
        container.innerHTML = '';
        
        try {
            await window.paypal.Buttons({
                style: {
                    shape: 'rect',
                    color: 'blue',
                    layout: 'vertical',
                    label: 'pay'
                },
                
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: priceInDollars.toString(),
                                currency_code: 'USD'
                            },
                            description: `${tier} Tier Subscription - DumbassGames`
                        }],
                        application_context: {
                            shipping_preference: 'NO_SHIPPING',
                            user_action: 'PAY_NOW',
                            payment_method: {
                                payer_selected: 'PAYPAL',
                                payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
                            }
                        }
                    });
                },
                
                onApprove: async (data, actions) => {
                    try {
                        const details = await actions.order.capture();
                        console.log('💰 PayPal payment successful:', details);
                        
                        // Process the successful payment
                        await this.handleSuccessfulPayment(tier, priceInDollars, details);
                        
                        // Close modal
                        document.querySelector('.paypal-modal')?.remove();
                        
                    } catch (error) {
                        console.error('❌ Error capturing PayPal payment:', error);
                        window.notificationManager?.showError('Payment processing failed. Please try again.');
                    }
                },
                
                onError: (err) => {
                    console.error('❌ PayPal payment error:', err);
                    
                    // Handle different types of PayPal errors
                    if (err.toString().includes('NOT_AUTHORIZED') || err.toString().includes('403')) {
                        console.error('🚫 PayPal Authorization Error - Client ID may need permissions review');
                        window.notificationManager?.showError('Payment service temporarily unavailable. Please use manual payment option.');
                    } else if (!err.toString().includes('logger')) {
                        // Don't show error for blocked analytics calls
                        window.notificationManager?.showError('Payment failed. Please try again or use manual payment.');
                    }
                },
                
                onCancel: (data) => {
                    console.log('💰 PayPal payment cancelled:', data);
                    window.notificationManager?.showInfo('Payment cancelled. You can try again anytime.');
                }
                
            }).render(`#${containerId}`);
            
        } catch (error) {
            console.error('❌ Error initializing PayPal button:', error);
            // Show fallback message in container if PayPal fails
            container.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #ffa500;">
                    <p>⚠️ PayPal button unavailable</p>
                    <p style="font-size: 10px;">Please use manual payment below</p>
                </div>
            `;
        }
    }

    async handleSuccessfulPayment(tier, priceInDollars, paymentDetails) {
        try {
            // Store payment details for verification
            const paymentRecord = {
                tier: tier,
                amount: priceInDollars,
                paymentId: paymentDetails.id,
                payerEmail: paymentDetails.payer?.email_address,
                status: paymentDetails.status,
                timestamp: new Date().toISOString(),
                userId: window.userProfileManager?.currentUser?.uid
            };
            
            console.log('💰 Recording payment:', paymentRecord);
            
            // Save payment record to Firebase (for verification)
            if (window.firebaseDb) {
                await window.firebaseSetDoc(
                    window.firebaseDoc(window.firebaseDb, 'payments', paymentDetails.id),
                    paymentRecord
                );
            }
            
            // Upgrade the user
            await this.upgradeUser(tier);
            
            window.notificationManager?.showSuccess(`🎉 Payment successful! Welcome to ${tier} tier!`);
            hideUpgradeModal();
            
            if (window.userProfileManager) {
                await window.userProfileManager.loadUserData();
                window.userProfileManager.updateProfileUI();
            }
            
        } catch (error) {
            console.error('❌ Error processing successful payment:', error);
            window.notificationManager?.showError('Payment received but upgrade failed. Please contact support.');
        }
    }

    handleManualPayment(tier, priceInDollars) {
        const userEmail = window.userProfileManager?.currentUser?.email || 'Unknown';
        const paymentEmail = 'payments@dumbassgames.xyz';
        const subject = encodeURIComponent(`${tier} Subscription Payment`);
        const body = encodeURIComponent(`Hello,

I would like to upgrade to the ${tier} tier for $${priceInDollars}/month.

My account email: ${userEmail}
Payment amount: $${priceInDollars} USD
Subscription type: ${tier} Tier

Please confirm receipt and activate my subscription.

Thank you!`);
        
        // Open email client or copy payment details
        const mailtoLink = `mailto:${paymentEmail}?subject=${subject}&body=${body}`;
        
        // Try to open email client
        window.open(mailtoLink);
        
        // Also show a modal with payment details to copy
        const detailsModal = document.createElement('div');
        detailsModal.className = 'modal payment-details-modal';
        detailsModal.style.display = 'block';
        
        detailsModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>💳 Manual Payment Details</h3>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <p>Please send payment to:</p>
                    <div class="payment-details">
                        <p><strong>PayPal Email:</strong> <span class="copyable" onclick="navigator.clipboard?.writeText('${paymentEmail}')">${paymentEmail}</span> <button onclick="navigator.clipboard?.writeText('${paymentEmail}')">📋 Copy</button></p>
                        <p><strong>Amount:</strong> $${priceInDollars} USD</p>
                        <p><strong>Note/Description:</strong> <span class="copyable">${tier} Subscription - ${userEmail}</span> <button onclick="navigator.clipboard?.writeText('${tier} Subscription - ${userEmail}')">📋 Copy</button></p>
                    </div>
                    <p>⚠️ <strong>Important:</strong> Include your account email (${userEmail}) in the payment note so we can activate your subscription.</p>
                    <p>🕐 Processing time: 1-2 business days after payment is received.</p>
                    <div class="modal-actions">
                        <button class="btn-primary" onclick="this.closest('.modal').remove()">Got it!</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(detailsModal);
        
        // Close the PayPal modal
        document.querySelector('.paypal-modal')?.remove();
        
        window.notificationManager?.showInfo('Payment details copied! Please check your email for payment instructions.');
    }



    async upgradeUser(tier) {
        if (!window.userProfileManager?.currentUser) {
            console.error('❌ No current user for upgrade');
            return false;
        }

        try {
            console.log(`🚀 Starting upgrade to ${tier}...`);
            
            // Get current profile from Firebase (not cache)
            const userDoc = await window.firebaseGetDoc(
                window.firebaseDoc(window.firebaseDb, 'userProfiles', window.userProfileManager.currentUser.uid)
            );
            const userProfile = userDoc.exists() ? userDoc.data() : {};
            
            const currentTime = new Date().toISOString();
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + 1);
            
            // Create updated profile
            const updatedProfile = {
                ...userProfile,
                tier: tier,
                tierExpiry: expiryDate.toISOString(),
                tierUpgradeDate: currentTime,
                version: '1.1'
            };
            
            console.log(`💾 Saving upgrade to Firebase: ${userProfile.tier || 'FREE'} → ${tier}`);
            
            // Save to Firebase with retry logic
            let saveSuccess = false;
            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    await window.firebaseSetDoc(
                        window.firebaseDoc(window.firebaseDb, 'userProfiles', window.userProfileManager.currentUser.uid),
                        updatedProfile
                    );
                    saveSuccess = true;
                    console.log(`✅ Firebase save successful (attempt ${attempt})`);
                    break;
                } catch (error) {
                    console.warn(`⚠️ Firebase save failed (attempt ${attempt}):`, error);
                    if (attempt === 3) throw error;
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
                }
            }
            
            if (!saveSuccess) {
                throw new Error('Failed to save to Firebase after 3 attempts');
            }
            
            // Clear ALL cached data
            window.userProfileManager.userProfile = null;
            console.log('🧹 Cleared all cached profile data');
            
            // Force reload fresh data
            await window.userProfileManager.loadUserProfile();
            console.log('🔄 Reloaded fresh profile from Firebase');
            
            // Update UI
            window.userProfileManager.updateTierDisplay();
            window.userProfileManager.updateProfileUI();
            window.userProfileManager.updateHeaderUsername();
            
            // Show success notification
            window.notificationManager?.showSuccess(`🎉 Upgraded to ${tier}! You can now submit more games.`);
            
            // Close upgrade modal
            const upgradeModal = document.querySelector('.submission-limit-modal, .upgrade-modal');
            if (upgradeModal) {
                upgradeModal.remove();
            }
            
            console.log(`✅ Upgrade to ${tier} completed successfully`);
            return true;
            
        } catch (error) {
            console.error('❌ Upgrade failed:', error);
            window.notificationManager?.showError(`❌ Upgrade failed: ${error.message}`);
            return false;
        }
    }

    async checkTierExpiry(userProfile) {
        if (!userProfile.tierExpiry || userProfile.tier === 'FREE') {
            return { expired: false, tier: userProfile.tier };
        }

        const now = new Date();
        const expiry = new Date(userProfile.tierExpiry);
        
        if (now > expiry) {
            // Tier has expired, downgrade to FREE
            console.log('⏰ Tier expired, downgrading to FREE');
            await this.downgradeToFree(userProfile);
            return { expired: true, tier: 'FREE' };
        }
        
        return { expired: false, tier: userProfile.tier };
    }

    async downgradeToFree(userProfile) {
        try {
            const updatedProfile = {
                ...userProfile,
                tier: 'FREE',
                tierExpiry: null,
                tierDowngradeDate: new Date().toISOString(),
                version: '1.1'
            };
            
            // Save to Firebase
            await window.firebaseSetDoc(
                window.firebaseDoc(window.firebaseDb, 'userProfiles', window.userProfileManager.currentUser.uid),
                updatedProfile
            );
            
            // Update local profile
            window.userProfileManager.userProfile = updatedProfile;
            
            console.log('📉 User downgraded to FREE due to expiry');
            window.notificationManager?.showWarning('Your premium tier has expired. You\'ve been moved to the FREE tier.');
        } catch (error) {
            console.error('❌ Error downgrading user:', error);
        }
    }

    async cancelSubscription() {
        if (!window.userProfileManager?.currentUser) return false;

        try {
            // In real implementation, this would call your backend to cancel the Stripe subscription
            const userProfile = window.userProfileManager.userProfile;
            
            // Set expiry to end of current billing period instead of immediate cancellation
            const endOfPeriod = new Date(userProfile.tierExpiry);
            
            const updatedProfile = {
                ...userProfile,
                tierCancelledDate: new Date().toISOString(),
                tierWillExpire: endOfPeriod.toISOString(),
                version: '1.1'
            };
            
            await window.firebaseSetDoc(
                window.firebaseDoc(window.firebaseDb, 'userProfiles', window.userProfileManager.currentUser.uid),
                updatedProfile
            );
            
            window.userProfileManager.userProfile = updatedProfile;
            
            window.notificationManager?.showInfo(`Your subscription will end on ${endOfPeriod.toLocaleDateString()}. You'll keep your current tier until then.`);
            return true;
        } catch (error) {
            console.error('❌ Error cancelling subscription:', error);
            return false;
        }
    }
}

// User Profile Management System
class UserProfileManager {
    constructor() {
        this.currentUser = null;
        this.userProfile = null;
        this.favoriteGames = [];
        this.submittedGames = [];
        this.isSubmitting = false;
        this.handleProfileSubmit = null;
        this.lastLoadTime = 0;
        this.tierManager = new TierManager();
        this.paymentManager = new PaymentManager();
        // Make payment manager globally accessible
        window.paymentManager = this.paymentManager;
        this.initializeProfile();
    }

    initializeProfile() {
        // Initialize user profile functionality
        this.setupProfileModalHandlers();
        
        // Always load favorites, regardless of login status
        this.loadUserFavorites();
        
        // Load full user data if logged in
        this.loadUserData();
    }

    setupProfileModalHandlers() {
        // Retry setup after DOM is ready, since modal might not exist yet
        const setupHandlers = () => {
            // Profile settings form handler
            const profileSettingsForm = document.getElementById('profileSettingsForm');
            if (profileSettingsForm) {
                // Check if handler already exists to prevent duplicates
                if (!this.handleProfileSubmit) {
                    // Bind the handler to preserve 'this' context
                    this.handleProfileSubmit = (e) => {
                        e.preventDefault();
                        console.log('🚀 Profile form submitted!');
                        
                        // Prevent multiple submissions with a debounce
                        if (this.isSubmitting) {
                            console.log('⚠️ Already submitting, ignoring duplicate submission');
                            return;
                        }
                        
                        this.isSubmitting = true;
                        this.saveProfileSettings().finally(() => {
                            setTimeout(() => {
                                this.isSubmitting = false;
                            }, 1000); // 1 second cooldown
                        });
                    };
                    
                    profileSettingsForm.addEventListener('submit', this.handleProfileSubmit);
                    // Profile form submit listener attached
                } else {
                    console.log('✅ Profile form handler already exists, skipping');
                }
            } else {
                console.log('⚠️ Profile form not found, will retry when modal opens');
            }

            // Modal click-outside-to-close
            const userProfileModal = document.getElementById('userProfileModal');
            if (userProfileModal) {
                userProfileModal.addEventListener('click', (e) => {
                    if (e.target === userProfileModal) {
                        this.hideProfile();
                    }
                });
                // Profile modal click handler attached
            }
        };

        // Try setup immediately
        setupHandlers();
        
        // Also retry setup when profile modal is shown
        this.setupHandlersOnShow = setupHandlers;
    }

    async loadUserData() {
        // Update current user reference
        this.currentUser = window.firebaseAuth?.currentUser || null;

        // Load both profile and favorites data
        try {
            await this.loadUserProfile();
            await this.loadUserFavorites();
            this.updateHeartIcons();
            console.log('✅ Loaded user profile and favorites');
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    async loadUserProfile() {
        try {
            console.log('🔍 Loading profile for user:', this.currentUser?.email, 'UID:', this.currentUser?.uid);
            
            // Use the same persistence manager as save
            this.userProfile = await window.persistenceManager.loadUserProfile({
                email: this.currentUser?.email || '',
                displayName: this.currentUser?.email?.split('@')[0] || 'Anonymous',
                bio: 'Welcome to DUMBASSGAMES! Add your bio here...',
                joinDate: this.formatJoinDate(this.currentUser?.metadata?.creationTime),
                preferences: {
                    soundEnabled: window.soundEnabled,
                    effectsEnabled: window.effectsEnabled
                },
                // Tier system defaults for new profiles
                tier: 'FREE',
                tierExpiry: null,
                submissionCount: { daily: 0, weekly: 0, monthly: 0 },
                lastSubmission: null,
                favoritesCount: 0,
                gamesPlayed: 0,
                lastActive: new Date().toISOString()
            });
            
            console.log('☁️ Loaded profile using persistence manager:', this.userProfile);
            
            // MIGRATE EXISTING PROFILES: Add tier system fields if missing
            const needsMigration = !this.userProfile.tier || 
                                 !this.userProfile.submissionCount || 
                                 typeof this.userProfile.submissionCount !== 'object';
            
            if (needsMigration) {
                console.log('🔄 Migrating existing profile to tier system...');
                
                // Preserve existing data and add tier fields
                this.userProfile = {
                    ...this.userProfile,
                    tier: this.userProfile.tier || 'FREE',
                    tierExpiry: this.userProfile.tierExpiry || null,
                    submissionCount: this.userProfile.submissionCount || { daily: 0, weekly: 0, monthly: 0 },
                    lastSubmission: this.userProfile.lastSubmission || null,
                    favoritesCount: this.userProfile.favoritesCount || 0,
                    gamesPlayed: this.userProfile.gamesPlayed || 0,
                    lastActive: new Date().toISOString()
                };
                
                // Save the migrated profile
                await this.saveProfile();
                console.log('✅ Profile migrated to tier system successfully!');
            }
            
            // Update header username immediately after profile loads
            this.updateHeaderUsername();
        } catch (error) {
            console.error('Error loading user profile:', error);
            // Fallback to basic profile with tier system
            this.userProfile = {
                email: this.currentUser?.email || '',
                displayName: '',
                bio: 'Welcome to DUMBASSGAMES!',
                joinDate: 'Recently',
                preferences: {
                    soundEnabled: true,
                    effectsEnabled: true
                },
                // Tier system defaults
                tier: 'FREE',
                tierExpiry: null,
                submissionCount: { daily: 0, weekly: 0, monthly: 0 },
                lastSubmission: null,
                favoritesCount: 0,
                gamesPlayed: 0,
                lastActive: new Date().toISOString()
            };
        }
    }

    async loadUserFavorites() {
        try {
            this.favoriteGames = await window.persistenceManager.loadFavorites();
            console.log(`💛 Loaded ${this.favoriteGames.length} favorite games`);
        } catch (error) {
            console.error('❌ Error loading favorites:', error);
            this.favoriteGames = [];
        }
    }

    async loadUserSubmissions() {
        try {
            // Load user's submitted games from database
            this.submittedGames = [];
            
            if (window.firebaseAuth?.currentUser?.uid) {
                const userId = window.firebaseAuth.currentUser.uid;
                const userEmail = window.firebaseAuth.currentUser.email;
                
                // Get all games and filter by user
                if (window.enhancedGameManager?.games) {
                    this.submittedGames = window.enhancedGameManager.games.filter(game => {
                        // Check multiple attribution methods for backward compatibility
                        return game.submittedBy === userId || // New method
                               game.author === userEmail || // Email as author
                               (game.author === 'nutshot' && userEmail === 'dumbassgames@proton.me') || // Your specific case
                               (game.submittedBy === undefined && game.author && userEmail === 'dumbassgames@proton.me'); // Legacy games
                    });
                } else if (window.dumbassGame?.games) {
                    this.submittedGames = window.dumbassGame.games.filter(game => {
                        return game.submittedBy === userId || 
                               game.author === userEmail ||
                               (game.author === 'nutshot' && userEmail === 'dumbassgames@proton.me') ||
                               (game.submittedBy === undefined && game.author && userEmail === 'dumbassgames@proton.me');
                    });
                }
                
                console.log(`🎮 Loaded ${this.submittedGames.length} user submissions`);
            } else {
                // For anonymous users, check localStorage or games with no user ID
                if (window.enhancedGameManager?.games) {
                    this.submittedGames = window.enhancedGameManager.games.filter(game => 
                        game.submittedBy === 'anonymous' || !game.submittedBy
                    );
                } else if (window.dumbassGame?.games) {
                    this.submittedGames = window.dumbassGame.games.filter(game => 
                        game.submittedBy === 'anonymous' || !game.submittedBy || game.author === 'Anonymous'
                    );
                }
                
                console.log(`🎮 Loaded ${this.submittedGames.length} anonymous submissions`);
            }
        } catch (error) {
            console.error('❌ Error loading user submissions:', error);
            this.submittedGames = [];
        }
    }

    updateProfileUI() {
        if (!this.userProfile) return;

        // Update profile overview
        const emailEl = document.getElementById('profileUserEmail');
        const bioEl = document.getElementById('profileUserBio');
        const joinDateEl = document.getElementById('userJoinDate');
        const gameCountEl = document.getElementById('userGameCount');
        const favoriteCountEl = document.getElementById('userFavoriteCount');
        
        if (emailEl) emailEl.textContent = this.userProfile.email;
        if (bioEl) bioEl.textContent = this.userProfile.bio;
        if (joinDateEl) joinDateEl.textContent = this.userProfile.joinDate;
        if (gameCountEl) gameCountEl.textContent = this.submittedGames.length;
        if (favoriteCountEl) favoriteCountEl.textContent = this.favoriteGames.length;

        // Update tier information
        this.updateTierDisplay();

        // Update settings form
        const bioField = document.getElementById('userBio');
        const displayNameField = document.getElementById('displayName');
        
        if (bioField && !bioField.matches(':focus')) {
            bioField.value = this.userProfile.bio || '';
        }
        
        if (displayNameField && !displayNameField.matches(':focus')) {
            displayNameField.value = this.userProfile.displayName || '';
        }
        
        // Update avatar preview and auth button with profile data
        console.log('🔄 Updating avatar from profile:', this.userProfile.avatar ? 'has avatar' : 'no avatar');
        if (this.userProfile.avatar) {
            window.dumbassGame?.updateAvatarPreview(this.userProfile.avatar);
        } else {
            window.dumbassGame?.updateAvatarPreview(null);
        }
        window.dumbassGame?.updateAvatarButton();

        // Update toggle buttons
        this.updateToggleButtons();
        this.renderFavorites();
        this.renderSubmissions();
        
        // Update recent favorites section on main page
        this.updateRecentFavorites();
        
        // Update header username display
        this.updateHeaderUsername();
    }

    updateProfileDisplayOnly() {
        if (!this.userProfile) return;

        // Update ONLY the display elements, not the form fields
        const emailEl = document.getElementById('profileUserEmail');
        const bioEl = document.getElementById('profileUserBio');
        const joinDateEl = document.getElementById('userJoinDate');
        const gameCountEl = document.getElementById('userGameCount');
        const favoriteCountEl = document.getElementById('userFavoriteCount');
        
        // Show display name if available, otherwise fall back to email
        if (emailEl) {
            const displayText = this.userProfile.displayName && this.userProfile.displayName.trim() 
                ? this.userProfile.displayName 
                : this.userProfile.email;
            const tierBadge = this.tierManager.getTierBadgeHtml(this.userProfile);
            emailEl.innerHTML = `${displayText} ${tierBadge}`;
        }
        if (bioEl) bioEl.textContent = this.userProfile.bio;
        if (joinDateEl) joinDateEl.textContent = this.userProfile.joinDate;
        if (gameCountEl) gameCountEl.textContent = this.submittedGames.length;
        if (favoriteCountEl) favoriteCountEl.textContent = this.favoriteGames.length;

        // Update other sections but NOT the form
        this.updateToggleButtons();
        this.renderFavorites();
        this.renderSubmissions();
        this.updateRecentFavorites();
    }

    updateToggleButtons() {
        const soundToggle = document.getElementById('profileSoundToggle');
        const effectsToggle = document.getElementById('profileEffectsToggle');

        if (soundToggle) {
            soundToggle.textContent = window.soundEnabled ? '🔊 ON' : '🔇 OFF';
            soundToggle.className = window.soundEnabled ? 'toggle-btn' : 'toggle-btn off';
        }

        if (effectsToggle) {
            effectsToggle.textContent = window.effectsEnabled ? '✨ ON' : '✨ OFF';
            effectsToggle.className = window.effectsEnabled ? 'toggle-btn' : 'toggle-btn off';
        }
    }

    renderFavorites() {
        const favoritesGrid = document.getElementById('favoritesGrid');
        if (!favoritesGrid) return;

        if (this.favoriteGames.length === 0) {
            favoritesGrid.innerHTML = '<p style="color: var(--primary-alpha-7); text-align: center; padding: 40px;">No favorite games yet. Start exploring!</p>';
            return;
        }

        favoritesGrid.innerHTML = this.favoriteGames.map(game => `
            <div class="favorite-game-card">
                <div class="game-title">${game.title}</div>
                <div class="game-description">${game.description}</div>
                <div class="game-actions">
                    <button class="game-action-btn" onclick="window.dumbassGame.playGame('${game.url}', '${game.title}')">▶ PLAY</button>
                    <button class="game-action-btn favorite active" onclick="userProfileManager.toggleFavorite('${game.id}')">💛</button>
                </div>
            </div>
        `).join('');
    }

    renderSubmissions() {
        const submissionsGrid = document.getElementById('submissionsGrid');
        if (!submissionsGrid) return;

        if (this.submittedGames.length === 0) {
            submissionsGrid.innerHTML = '<p style="color: var(--primary-alpha-7); text-align: center; padding: 40px;">No games submitted yet. Share your creations!</p>';
            return;
        }

        submissionsGrid.innerHTML = this.submittedGames.map(game => `
            <div class="submission-game-card">
                <div class="submission-status ${game.status}">${game.status.toUpperCase()}</div>
                <div class="game-title">${game.title}</div>
                <div class="game-description">${game.description}</div>
                <div class="game-category">${(game.category || game.genre || game.gameGenre)?.toUpperCase() || 'UNCATEGORIZED'}</div>
                <div class="submission-actions">
                    <button class="play-btn" onclick="window.dumbassGame.playGame('${game.url}', '${game.title}')" title="Play Game">
                        ▶ PLAY
                    </button>
                    <button class="delete-btn" onclick="userProfileManager.deleteSubmittedGame('${game.id}')" title="Delete Game">
                        🗑️ DELETE
                    </button>
                </div>
            </div>
        `).join('');
    }

    async saveProfile() {
        if (!this.userProfile) return;

        try {
            // For logged-in users, save directly to Firebase first
            if (this.currentUser) {
                console.log('💾 Saving profile to Firebase for user:', this.currentUser.email);
                
                // Save to Firebase with retry logic
                let attempts = 0;
                const maxAttempts = 3;
                
                while (attempts < maxAttempts) {
                    try {
                        await window.firebaseSetDoc(
                            window.firebaseDoc(window.firebaseDb, 'userProfiles', this.currentUser.uid),
                            this.userProfile
                        );
                        console.log('✅ Profile saved to Firebase successfully');
                        break;
                    } catch (firebaseError) {
                        attempts++;
                        console.warn(`⚠️ Firebase save attempt ${attempts} failed:`, firebaseError);
                        if (attempts >= maxAttempts) {
                            throw firebaseError;
                        }
                        // Wait 1 second before retry
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }
            
            // Also save to persistence manager as backup
            await window.persistenceManager.saveUserProfile(this.userProfile);
            console.log('✅ Profile saved successfully (both Firebase and local)');
        } catch (error) {
            console.error('❌ Error saving profile:', error);
            throw error;
        }
    }

    async saveProfileSettings() {
        const bio = document.getElementById('userBio').value;
        const displayName = document.getElementById('displayName').value;

        try {
            console.log('💾 Saving profile settings...');
            console.log('📸 Current avatar in profile:', this.userProfile?.avatar ? 'has avatar' : 'no avatar');
            
            // Preserve existing tier system data and update user-editable fields
            this.userProfile = {
                ...this.userProfile,
                email: this.currentUser?.email || '',
                displayName: displayName,
                bio: bio,
                joinDate: this.userProfile?.joinDate || 'Recently',
                preferences: {
                    soundEnabled: window.soundEnabled,
                    effectsEnabled: window.effectsEnabled
                },
                // Ensure tier system fields are preserved
                tier: this.userProfile?.tier || 'FREE',
                tierExpiry: this.userProfile?.tierExpiry || null,
                submissionCount: this.userProfile?.submissionCount || { daily: 0, weekly: 0, monthly: 0 },
                lastSubmission: this.userProfile?.lastSubmission || null,
                favoritesCount: this.userProfile?.favoritesCount || 0,
                // CRITICAL: Preserve avatar data
                avatar: this.userProfile?.avatar || null,
                gamesPlayed: this.userProfile?.gamesPlayed || 0,
                lastActive: new Date().toISOString()
            };

            await this.saveProfile();
            
            // Update the welcome message in the auth modal
            if (window.authManager && this.currentUser) {
                await window.authManager.updateWelcomeMessage(this.currentUser);
            }
            
            // Update the profile display to show the new name immediately
            this.updateProfileDisplayOnly();
            
            // Update the header username display
            this.updateHeaderUsername();
            
            // Update tier display to ensure upgrade button appears for FREE users
            this.updateTierDisplay();
            
            alert('✅ Profile saved successfully!');

        } catch (error) {
            console.error('❌ Save failed:', error);
            alert('❌ Failed to save profile: ' + error.message);
        }
    }



    async toggleFavorite(gameId) {
        console.log('💛 Toggling favorite for game:', gameId);
        
        const existingIndex = this.favoriteGames.findIndex(game => game.id === gameId);
        
        if (existingIndex > -1) {
            // Remove from favorites
            const removedGame = this.favoriteGames.splice(existingIndex, 1)[0];
            console.log('💔 Removed from favorites:', removedGame.title);
            
            // Show feedback
            if (window.dumbassGame?.notificationManager) {
                window.dumbassGame.notificationManager.showInfo(`💔 Removed "${removedGame.title}" from favorites`);
            }
        } else {
            // Check tier limits before adding to favorites (logged in users only)
            if (this.currentUser && this.userProfile) {
                const limitCheck = this.tierManager.checkFavoritesLimit(this.userProfile, this.favoriteGames.length);
                if (!limitCheck.allowed) {
                    // Show upgrade modal instead of just a warning
                    this.showFavoritesLimitModal(limitCheck);
                    if (window.dumbassGame?.soundSystem) {
                        window.dumbassGame.soundSystem.playError();
                    }
                    return;
                }
            }

            // Add to favorites - get game from enhanced game manager
            let game = window.enhancedGameManager?.games.find(g => g.id === gameId);
            
            // If not found there, try the old location as fallback
            if (!game) {
                game = window.dumbassGame?.games.find(g => g.id === gameId);
            }
            
            // If still not found, reconstruct from DOM as last resort
            if (!game) {
                const gameCard = document.querySelector(`[data-game-id="${gameId}"]`);
                if (gameCard) {
                    game = {
                        id: gameId,
                        title: gameCard.querySelector('.game-title')?.textContent || 'Unknown Game',
                        description: gameCard.querySelector('.game-description')?.textContent || 'No description',
                        url: '#',
                        image: gameCard.querySelector('img')?.src || null
                    };
                    console.log('🔧 Reconstructed game from DOM:', game.title);
                }
            }
            
            if (game) {
                this.favoriteGames.push(game);
                console.log('💛 Added to favorites:', game.title);
                
                // Update favorites count in user profile
                if (this.currentUser && this.userProfile) {
                    this.userProfile.favoritesCount = this.favoriteGames.length;
                    // Save updated profile silently
                    window.persistenceManager?.saveUserProfile(this.userProfile).catch(err => 
                        console.warn('Failed to update favorites count:', err)
                    );
                }
                
                // Show feedback
                if (window.dumbassGame?.notificationManager) {
                    window.dumbassGame.notificationManager.showSuccess(`💛 Added "${game.title}" to favorites!`);
                }
            } else {
                console.error('❌ Game not found:', gameId);
                if (window.dumbassGame?.notificationManager) {
                    window.dumbassGame.notificationManager.showError('❌ Could not add game to favorites');
                }
                return;
            }
        }

        // Save favorites (works for both logged-in and anonymous users)
        await this.saveFavorites();
        
        // Update UI everywhere
        this.updateProfileUI();
        
        // Update heart icons without re-rendering all games
        this.updateHeartIcons();
        
        // Update recent favorites section
        this.updateRecentFavorites();
    }

    async saveFavorites() {
        try {
            await window.persistenceManager.saveFavorites(this.favoriteGames);
        } catch (error) {
            console.error('❌ Error saving favorites:', error);
        }
    }

    showFavoritesLimitModal(limitCheck) {
        // Get current tier info and all available upgrades
        const currentTier = this.tierManager.getTierInfo(this.userProfile.tier);
        const tierManager = this.tierManager;
        const allTiers = Object.values(tierManager.tiers);
        const availableUpgrades = allTiers.filter(tier => 
            tier.price > currentTier.price && tier.name !== currentTier.name
        );

        // Generate upgrade options HTML
        const upgradeOptionsHTML = availableUpgrades.map(tier => `
            <div class="upgrade-tier-option">
                <div class="tier-header">
                    <span class="tier-badge tier-${tier.name.toLowerCase()}">${tier.badge}</span>
                    <div class="tier-info">
                        <h4>${tier.displayName}</h4>
                        <p class="tier-price">$${tier.price}/month</p>
                    </div>
                </div>
                <ul class="tier-benefits">
                    <li>${tier.limits.favorites === -1 ? 'Unlimited' : tier.limits.favorites} favorites</li>
                    <li>${tier.limits.submissionsPerMonth === -1 ? 'Unlimited' : tier.limits.submissionsPerMonth} submissions per month</li>
                    <li>Priority support</li>
                    ${tier.name === 'DEV' ? '<li>Game analytics & editing</li>' : ''}
                </ul>
                <button class="btn-primary upgrade-btn tier-upgrade-btn" onclick="showUpgradeModal(); this.closest('.modal').remove()">
                    💎 UPGRADE TO ${tier.name}
                </button>
            </div>
        `).join('');

        // Create and show a custom favorites limit modal
        const modal = document.createElement('div');
        modal.className = 'modal favorites-limit-modal';
        modal.style.display = 'block';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>💛 FAVORITES LIMIT REACHED</h3>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="limit-modal-body">
                    <div class="limit-status">
                        <div class="current-tier">
                            <span class="tier-badge tier-${currentTier.name.toLowerCase()}">${currentTier.badge}</span>
                            <div class="tier-info">
                                <h4>${currentTier.displayName}</h4>
                                <p>${limitCheck.reason}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="upgrade-arrow">⬇️ CHOOSE YOUR UPGRADE ⬇️</div>
                    
                    <div class="upgrade-options">
                        ${upgradeOptionsHTML}
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="this.closest('.modal').remove()">
                            ❌ MAYBE LATER
                        </button>
                    </div>
                    
                    <p class="limit-help">Upgrade now to favorite unlimited games and support DumbassGames!</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-focus the upgrade button
        setTimeout(() => {
            const upgradeBtn = modal.querySelector('.upgrade-btn');
            if (upgradeBtn) upgradeBtn.focus();
        }, 100);
    }

    async deleteSubmittedGame(gameId) {
        // Confirm deletion with user
        const game = this.submittedGames.find(g => g.id === gameId);
        const gameName = game ? game.title : 'this game';
        
        if (!confirm(`🗑️ Are you sure you want to delete "${gameName}"? This action cannot be undone.`)) {
            return;
        }

        try {
            // Delete from Firebase
            if (window.dataManager && window.dataManager.isInitialized) {
                await window.dataManager.deleteGame(gameId);
                console.log('🗑️ Game deleted from Firebase:', gameId);
            }

            // Remove from enhanced game manager
            if (window.enhancedGameManager && window.enhancedGameManager.games) {
                window.enhancedGameManager.games = window.enhancedGameManager.games.filter(g => g.id !== gameId);
                window.enhancedGameManager.filteredGames = window.enhancedGameManager.filteredGames.filter(g => g.id !== gameId);
                window.enhancedGameManager.renderGames();
            }

            // Remove from old game manager if it exists
            if (window.dumbassGame && window.dumbassGame.games) {
                window.dumbassGame.games = window.dumbassGame.games.filter(g => g.id !== gameId);
                await window.dumbassGame.saveGames();
            }

            // Remove from user's submitted games list
            this.submittedGames = this.submittedGames.filter(g => g.id !== gameId);

            // Remove from favorites if it's there
            this.favoriteGames = this.favoriteGames.filter(g => g.id !== gameId);
            await this.saveFavorites();

            // Re-render submissions and update UI
            this.renderSubmissions();
            this.updateProfileUI();

            // Show success notification
            if (window.dumbassGame?.notificationManager) {
                window.dumbassGame.notificationManager.showSuccess(`🗑️ "${gameName}" deleted successfully!`);
            }

            // Play success sound
            if (window.dumbassGame?.soundSystem) {
                window.dumbassGame.soundSystem.playSuccess();
            }

        } catch (error) {
            console.error('❌ Error deleting game:', error);
            
            // Show error notification
            if (window.dumbassGame?.notificationManager) {
                window.dumbassGame.notificationManager.showError(`❌ Failed to delete "${gameName}". Please try again.`);
            }
            
            // Play error sound
            if (window.dumbassGame?.soundSystem) {
                window.dumbassGame.soundSystem.playError();
            }
        }
    }

    updateHeartIcons() {
        // Update heart button states without re-rendering entire game grid
        const gameCards = document.querySelectorAll('.game-card');
        console.log(`💛 Updating ${gameCards.length} heart icons...`);
        
        gameCards.forEach(card => {
            // Enhanced cards use data-id, old cards use data-game-id
            const gameId = card.dataset.id || card.dataset.gameId;
            
            // Enhanced cards use .game-action-btn.favorite, old cards use .favorite-btn
            const heartBtn = card.querySelector('.game-action-btn.favorite') || card.querySelector('.favorite-btn');
            
            if (heartBtn && gameId) {
                const isFavorited = this.favoriteGames.some(game => game.id === gameId);
                
                // Toggle active class for CSS styling
                if (isFavorited) {
                    heartBtn.classList.add('active');
                    // Update emoji for enhanced cards
                    if (heartBtn.classList.contains('game-action-btn')) {
                        heartBtn.textContent = '💛';
                    }
                    console.log(`💛 ✅ Added 'active' class to heart for game ${gameId}`);
                } else {
                    heartBtn.classList.remove('active');
                    // Update emoji for enhanced cards
                    if (heartBtn.classList.contains('game-action-btn')) {
                        heartBtn.textContent = '🤍';
                    }
                    console.log(`💛 ❌ Removed 'active' class from heart for game ${gameId}`);
                }
            } else {
                console.log(`💛 ⚠️ Missing heart button or gameId for card (gameId: ${gameId})`, card);
            }
        });
    }

    updateRecentFavorites() {
        const section = document.getElementById('recentFavoritesSection');
        const grid = document.getElementById('recentFavoritesGrid');
        
        if (!section || !grid) return;

        // Show/hide section based on whether user has favorites
        if (!this.currentUser || this.favoriteGames.length === 0) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';

        // Show most recent 4 favorites
        const recentFavorites = this.favoriteGames.slice(-4).reverse();
        
        grid.innerHTML = recentFavorites.map(game => `
            <div class="recent-favorite-card">
                <div class="game-title">${game.title}</div>
                <div class="game-description">${game.description}</div>
                <div class="recent-favorite-actions">
                    <button class="favorite-play-btn" onclick="window.dumbassGame.playGame('${game.url}', '${game.title}')">
                        ▶ PLAY
                    </button>
                    <button class="favorite-remove-btn" onclick="userProfileManager.toggleFavorite('${game.id}')" title="Remove from favorites">
                        💔
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateTierDisplay() {
        if (!this.userProfile) {
            console.log('🚫 updateTierDisplay: No user profile found');
            return;
        }

        console.log('💎 updateTierDisplay: Current user tier:', this.userProfile.tier);

        const tierBadge = document.getElementById('tierBadge');
        const tierName = document.getElementById('tierName');
        const tierLimits = document.getElementById('tierLimits');
        const tierUpgrade = document.getElementById('tierUpgrade');

        console.log('🔍 Tier display elements:', {
            tierBadge: !!tierBadge,
            tierName: !!tierName,
            tierLimits: !!tierLimits,
            tierUpgrade: !!tierUpgrade
        });

        if (!tierBadge || !tierName || !tierLimits) {
            console.warn('⚠️ Missing tier display elements');
            return;
        }

        const tierInfo = this.tierManager.getTierInfo(this.userProfile.tier);
        console.log('📊 Tier info:', tierInfo);
        
        // Check tier expiry first
        if (this.paymentManager) {
            this.paymentManager.checkTierExpiry(this.userProfile).then(result => {
                if (result.expired) {
                    // Reload profile after downgrade
                    this.loadUserData();
                    return;
                }
            });
        }
        
        if (tierBadge) {
            tierBadge.textContent = tierInfo.badge;
            tierBadge.style.color = tierInfo.color;
        }
        
        if (tierName) {
            tierName.textContent = tierInfo.displayName;
        }
        
        if (tierLimits) {
            let limitsText = this.tierManager.getTierLimitsText(this.userProfile.tier);
            
            // Add expiry info for paid tiers
            if (this.userProfile.tier !== 'FREE' && this.userProfile.tierExpiry) {
                const expiry = new Date(this.userProfile.tierExpiry);
                const now = new Date();
                const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
                
                if (daysLeft > 0) {
                    limitsText += ` • Expires in ${daysLeft} days`;
                } else if (daysLeft === 0) {
                    limitsText += ` • Expires today`;
                } else {
                    limitsText += ` • Expired`;
                }
            }
            
            tierLimits.textContent = limitsText;
        }

        // Show upgrade button for FREE tier users (or users without tier set)
        if (tierUpgrade) {
            // Show upgrade button for FREE tier OR if tier is not set (legacy users)
            if (!this.userProfile.tier || this.userProfile.tier === 'FREE') {
                console.log('✅ Showing upgrade button for FREE/unset tier user:', this.userProfile.tier || 'UNSET');
                tierUpgrade.style.display = 'block';
                
                // Force migration if tier is not set
                if (!this.userProfile.tier) {
                    console.log('🔄 Auto-migrating user profile without tier...');
                    this.userProfile.tier = 'FREE';
                    this.userProfile.tierExpiry = null;
                    this.userProfile.submissionCount = this.userProfile.submissionCount || { daily: 0, weekly: 0, monthly: 0 };
                    this.userProfile.lastSubmission = this.userProfile.lastSubmission || null;
                    this.userProfile.favoritesCount = this.userProfile.favoritesCount || 0;
                    this.userProfile.gamesPlayed = this.userProfile.gamesPlayed || 0;
                    this.userProfile.lastActive = new Date().toISOString();
                    
                    // Save the migrated profile
                    this.saveProfile().catch(err => console.warn('Failed to save migrated profile:', err));
                }
            } else {
                console.log('🚫 Hiding upgrade button for', this.userProfile.tier, 'user');
                tierUpgrade.style.display = 'none';
            }
        } else {
            console.warn('⚠️ tierUpgrade element not found in DOM');
        }
    }

    updateHeaderUsername() {
        const userIndicator = document.getElementById('userIndicator');
        const headerUsername = document.getElementById('headerUsername');
        
        if (!userIndicator || !headerUsername) return;

        if (this.currentUser) {
            // If profile isn't loaded yet, try again in a moment
            if (!this.userProfile) {
                console.log('🕒 Profile not loaded yet, retrying header username update in 500ms');
                setTimeout(() => this.updateHeaderUsername(), 500);
                return;
            }
            
            // Show display name if available, otherwise show email
            const displayText = this.userProfile.displayName && this.userProfile.displayName.trim() 
                ? this.userProfile.displayName 
                : this.currentUser.email.split('@')[0]; // Just the part before @
            
            headerUsername.textContent = displayText;
            
            // Smooth fade-in animation
            userIndicator.style.display = 'block';
            setTimeout(() => {
                userIndicator.classList.add('show');
            }, 10);
            
            console.log('✅ Header username updated with smooth animation:', displayText);
        } else {
            // Smooth fade-out animation then hide
            userIndicator.classList.remove('show');
            setTimeout(() => {
                userIndicator.style.display = 'none';
            }, 400); // Match CSS transition duration
        }
    }

    formatJoinDate(timestamp) {
        if (!timestamp) return 'Unknown';
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    showProfile() {
        const modal = document.getElementById('userProfileModal');
        if (modal) {
            modal.style.display = 'block';
            
            // Load profile data when modal opens
            this.loadProfileForModal();
            
            // Show/hide analytics tab based on user tier
            setTimeout(() => {
                if (window.showAnalyticsTab) {
                    window.showAnalyticsTab();
                } else {
                    // Fallback if function not loaded yet
                    const analyticsTab = document.querySelector('[data-tab="analytics"]');
                    const userProfile = this.userProfile;
                    if (analyticsTab && userProfile?.tier === 'DEV') {
                        analyticsTab.style.display = 'flex';
                        analyticsTab.classList.add('show');
                    }
                }
            }, 200);
            
            // Re-setup form handlers since modal content is now available
            if (this.setupHandlersOnShow) {
                this.setupHandlersOnShow();
            }
        }
    }

    async loadProfileForModal() {
        try {
            // Load profile data only when opening modal
            if (this.currentUser) {
                await this.loadUserProfile();
            }
            
            // Always load user submissions and favorites when opening modal
            await this.loadUserSubmissions();
            await this.loadUserFavorites();
            
            this.updateProfileUI();
            
            // Update avatar preview in settings
            if (this.userProfile?.avatar) {
                window.dumbassGame?.updateAvatarPreview(this.userProfile.avatar);
            } else {
                window.dumbassGame?.updateAvatarPreview(null);
            }
            
            console.log('✅ Loaded profile for modal');
        } catch (error) {
            console.error('Error loading profile for modal:', error);
        }
    }

    hideProfile() {
        const modal = document.getElementById('userProfileModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    switchTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.profile-tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Hide all tab buttons
        document.querySelectorAll('.profile-tab').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        const selectedTab = document.getElementById(tabName + 'Tab');
        const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);
        
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }

        // Load tab-specific content
        if (tabName === 'favorites') {
            this.renderFavorites();
        } else if (tabName === 'submissions') {
            this.renderSubmissions();
        } else if (tabName === 'analytics') {
            // Load analytics data when tab is opened
            if (window.loadAnalyticsData) {
                window.loadAnalyticsData();
            }
        }
    }
}

// Enhanced Game Management System with Categories
class EnhancedGameManager {
    constructor() {
        this.games = [];
        this.filteredGames = [];
        this.currentFilters = {
            gameType: 'all',      // Game genre (platformer, shooter, etc.)
            chaosVibe: 'all',     // Chaos classification (dumbass, memes, etc.)
            difficulty: 'all',    // Pain level (easy, hard, etc.)
            search: '',           // Search term
            sort: 'newest'        // Sort order
        };
        
        // Define the dual-category system
        this.gameTypes = {
            'all': 'ALL GAMES',
            'platformer': '🏃 PLATFORMER',
            'shooter': '🔫 SHOOTER', 
            'puzzle': '🧩 PUZZLE',
            'arcade': '🕹️ ARCADE',
            'rpg': '⚔️ RPG',
            'horror': '👻 HORROR',
            'weird': '🌀 WEIRD STUFF'
        };
        
        this.chaosVibes = {
            'all': 'ALL VIBES',
            'dumbass': '💩 PEAK DUMBASS',
            'memes': '🐸 MEME TIER',
            'cursed': '😈 CURSED',
            'political': '🤡 POLITICAL',
            'actually-good': '✨ ACTUALLY GOOD',
            'broken': '🔧 BROKEN/WEIRD',
            'monstrositys': '👹 MONSTROSITYS'
        };
        
        this.difficulties = {
            'all': 'ALL LEVELS',
            'easy': '😊 EASY',
            'medium': '😐 NORMAL',
            'hard': '😤 HARD',
            'expert': '💀 EXPERT',
            'impossible': '🔥 IMPOSSIBLE',
            'why': '❓ WHY EXIST',
            'unrated': '🤷 UNKNOWN'
        };
        
        this.sortOptions = {
            'newest': 'NEWEST',
            'popular': 'POPULAR',
            'best': 'BEST',
            'alphabetic': 'A-Z',
            'random': 'RANDOM',
            'chaos': 'CHAOS'
        };
        
        // Search enhancement properties
        this.searchTimeout = null;
        this.searchHistory = this.loadSearchHistory();
        this.searchAnalytics = this.loadSearchAnalytics();
        this.suggestions = [];
        
        // Search enhancement properties
        this.searchTimeout = null;
        this.searchHistory = this.loadSearchHistory();
        this.searchAnalytics = this.loadSearchAnalytics();
        this.suggestions = [];
        
        // Initialize visual feedback system
        this.initializeButtonStates();
        
        // Load existing games from the main game manager
        this.loadExistingGames();
    }
    
    loadExistingGames() {
        // Start fresh with Firebase-only mode, don't copy from old system
        console.log('🧹 Enhanced Game Manager starting fresh with Firebase-only mode');
        this.games = [];
        this.filteredGames = [];
        
        // Sync with Firebase to get the latest games
        if (window.dataManager && window.dataManager.isInitialized) {
            this.syncWithFirebase();
        } else {
            // Wait for Firebase to initialize
            // Waiting for Firebase initialization
            if (!this.loadAttempts) this.loadAttempts = 0;
            this.loadAttempts++;
            
            if (this.loadAttempts < 10) {  // Max 10 attempts (5 seconds)
                setTimeout(() => {
                    this.loadExistingGames();
                }, 500);
            } else {
                console.log('⚠️ Max load attempts reached, continuing with empty games array');
                this.renderGames();
            }
        }
    }

    async syncWithFirebase() {
        try {
            const firebaseGames = await window.dataManager.getGames();
            if (firebaseGames && firebaseGames.length >= 0) {
                // Replace games entirely with Firebase data (no merging)
                this.games = [...firebaseGames];
                this.filteredGames = [...this.games];
                console.log(`🔄 Synced ${firebaseGames.length} games from Firebase`);
                
                // CRITICAL: Re-render after syncing
                this.renderGames();
            } else {
                // Firebase has no games, start with empty array
                this.games = [];
                this.filteredGames = [];
                console.log('🔄 Firebase has no games, starting fresh');
                this.renderGames();
            }
        } catch (error) {
            console.error('Error syncing with Firebase:', error);
            // On error, ensure we start with empty arrays
            this.games = [];
            this.filteredGames = [];
            this.renderGames();
        }
    }

    async addGame(gameData) {
        // Enhanced game data with Phase 3 features
        const enhancedGame = {
            ...gameData,
            id: this.generateGameId(),
            category: gameData.category || gameData.genre || 'weird',
            tags: gameData.tags ? gameData.tags.split(',').map(tag => tag.trim()) : [],
            difficulty: gameData.difficulty || 'medium',
            status: 'pending', // pending, approved, rejected
            submittedBy: window.firebaseAuth?.currentUser?.uid || 'anonymous',
            submittedAt: new Date().toISOString(),
            rating: 0,
            playCount: 0,
            favorites: 0
        };

        try {
            // Save to Firebase using the correct manager
            if (window.dataManager && window.dataManager.isInitialized) {
                const firebaseId = await window.dataManager.addGame(enhancedGame);
                if (firebaseId) {
                    enhancedGame.id = firebaseId;
                }
            }

            // Add to both managers for consistency
            this.games.push(enhancedGame);
            if (window.dumbassGame?.games) {
                window.dumbassGame.games.push(enhancedGame);
                await window.dumbassGame.saveGames();
            }
            
            this.applyFilters();
            this.renderGames();

            if (window.dumbassGame?.notificationManager) {
                window.dumbassGame.notificationManager.showSuccess('🎉 Game submitted successfully! 🎮');
            }
            
            // Play success sound
            if (window.dumbassGame?.soundSystem) {
                window.dumbassGame.soundSystem.playSuccess();
            }
            
            // Refresh user submissions in profile
            if (window.userProfileManager) {
                await window.userProfileManager.loadUserSubmissions();
                window.userProfileManager.updateProfileUI();
            }
            
        } catch (error) {
            console.error('❌ Error adding game:', error);
            if (window.dumbassGame?.soundSystem) {
                window.dumbassGame.soundSystem.playError();
            }
            
            // Check if this is a specific error with a user-friendly message
            if (error.message && (
                error.message.includes('Image size exceeds Firebase limits') ||
                error.message.includes('Permission denied') ||
                error.message.includes('Failed to save to Firebase')
            )) {
                // The detailed error message was already shown by the Firebase handler
                // Don't show a generic message on top of it
                return;
            } else {
                // For other unknown errors, show generic message
                if (window.dumbassGame?.notificationManager) {
                    window.dumbassGame.notificationManager.showError('❌ Failed to submit game. Please try again.');
                }
            }
        }
    }

    generateGameId() {
        return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    createEnhancedGameCard(game) {
        // Check multiple possible field names for category
        const gameType = game.category || game.gameType || game.genre || 'weird';
        const categoryLabel = this.gameTypes[gameType] || this.gameTypes['weird'];
        
        return `
            <div class="game-card" data-id="${game.id}" data-category="${gameType}" data-difficulty="${game.difficulty}">
                <div class="game-category">${categoryLabel}</div>

                ${game.difficulty ? `<div class="game-difficulty ${game.difficulty}">${this.getDifficultyLabel(game.difficulty)}</div>` : ''}
                
                <div class="game-image">
                    <img src="${game.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=250&fit=crop'}" 
                         alt="${game.title}" loading="lazy">
                </div>
                
                <div class="game-title">${game.title}</div>
                <div class="game-description">${game.description}</div>
                
                                 <div class="game-actions">
                     <button class="game-action-btn favorite ${this.isGameFavorited(game.id) ? 'active' : ''}" 
                             onclick="enhancedGameManager.toggleGameFavorite('${game.id}')" title="Add to Favorites">
                         ${this.isGameFavorited(game.id) ? '💛' : '🤍'}
                     </button>
                     <button class="game-action-btn" onclick="enhancedGameManager.shareGame('${game.id}')" title="Share Game">📤</button>
                 </div>
                 
                 <button class="play-button" onclick="window.dumbassGame.playGame('${game.url}', '${game.title}')">
                     ▶ PLAY NOW
                 </button>
             </div>
         `;
    }

    getDifficultyLabel(difficulty) {
        const labels = {
            'easy': '😊 EASY',
            'medium': '😐 NORMAL', 
            'hard': '😤 HARD',
            'expert': '💀 EXPERT'
        };
        return labels[difficulty] || labels['medium'];
    }

    isGameFavorited(gameId) {
        return window.userProfileManager?.favoriteGames.some(game => game.id === gameId) || false;
    }

    async toggleGameFavorite(gameId) {
        if (window.userProfileManager) {
            await window.userProfileManager.toggleFavorite(gameId);
            // renderGames() is already called in toggleFavorite, no need to call again
        }
    }

    shareGame(gameId) {
        const game = this.games.find(g => g.id === gameId);
        if (game && navigator.share) {
            navigator.share({
                title: game.title,
                text: game.description,
                url: window.location.href + '?game=' + gameId
            });
        } else {
            navigator.clipboard.writeText(window.location.href + '?game=' + gameId);
            if (window.dumbassGame?.notificationManager) {
                window.dumbassGame.notificationManager.showSuccess('Game link copied! 📋');
            }
        }
    }

    applyFilters() {
        let filtered = [...this.games];
        
        // Filter by game type (genre)
        if (this.currentFilters.gameType !== 'all') {
            filtered = filtered.filter(game => 
                game.gameType === this.currentFilters.gameType || 
                game.genre === this.currentFilters.gameType ||
                game.category === this.currentFilters.gameType
            );
        }
        
        // Filter by chaos vibe
        if (this.currentFilters.chaosVibe !== 'all') {
            filtered = filtered.filter(game => 
                game.chaosVibe === this.currentFilters.chaosVibe ||
                game.vibe === this.currentFilters.chaosVibe ||
                game.tags?.includes(this.currentFilters.chaosVibe)
            );
        }
        
        // Filter by difficulty
        if (this.currentFilters.difficulty !== 'all') {
            filtered = filtered.filter(game => 
                game.difficulty === this.currentFilters.difficulty ||
                game.painLevel === this.currentFilters.difficulty
            );
        }
        
        // Filter by search term
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            filtered = filtered.filter(game => 
                game.title.toLowerCase().includes(searchTerm) ||
                game.description.toLowerCase().includes(searchTerm) ||
                (game.tags && game.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            );
        }
        
        // Apply sorting
        this.applySorting(filtered);
        
        this.filteredGames = filtered;
        this.updateFilteredResults();
    }
    
    applySorting(games) {
        switch (this.currentFilters.sort) {
            case 'newest':
                games.sort((a, b) => new Date(b.submittedAt || b.dateAdded || 0) - new Date(a.submittedAt || a.dateAdded || 0));
                break;
            case 'popular':
                games.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
                break;
            case 'best':
                games.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'alphabetic':
                games.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'random':
                for (let i = games.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [games[i], games[j]] = [games[j], games[i]];
                }
                break;
            case 'chaos':
                // Chaos sort: prioritize weird vibes and extreme difficulties
                games.sort((a, b) => {
                    const aScore = this.getChaosScore(a);
                    const bScore = this.getChaosScore(b);
                    return bScore - aScore;
                });
                break;
        }
    }
    
    getChaosScore(game) {
        let score = 0;
        
        // Chaos vibe scoring
        const chaosVibeScores = {
            'monstrositys': 100,
            'cursed': 90,
            'broken': 80,
            'dumbass': 70,
            'political': 60,
            'memes': 50,
            'actually-good': 10
        };
        score += chaosVibeScores[game.chaosVibe || game.vibe] || 0;
        
        // Difficulty scoring
        const difficultyScores = {
            'why': 100,
            'impossible': 90,
            'expert': 70,
            'hard': 50,
            'medium': 30,
            'easy': 10
        };
        score += difficultyScores[game.difficulty] || 0;
        
        // Random factor for true chaos
        score += Math.random() * 50;
        
        return score;
    }
    
    updateFilteredResults() {
        // Update result count with visual feedback
        const resultText = this.filteredGames.length === 0 ? 
            '🎮 No games found! Try different filters.' :
            this.filteredGames.length === 1 ? 
            `🎯 Found 1 glorious disaster!` :
            `🎯 Found ${this.filteredGames.length} beautiful disasters!`;
            
        if (window.dumbassGame?.notificationManager && this.filteredGames.length === 0) {
            window.dumbassGame.notificationManager.showInfo(resultText);
        }
    }

    renderGames() {
        const gamesGrid = document.getElementById('gamesGrid');
        if (!gamesGrid) return;
        if (this.filteredGames.length === 0) {
            gamesGrid.innerHTML = '<div class="no-games-message"><h3>🎮 No games found</h3></div>';
            return;
        }
        gamesGrid.innerHTML = this.filteredGames.map(game => this.createEnhancedGameCard(game)).join('');
        
        // Add turd rating components to all game cards
        if (window.turdRatingManager) {
            setTimeout(() => {
                this.filteredGames.forEach(game => {
                    const gameCard = document.querySelector(`[data-id="${game.id}"]`);
                    if (gameCard && !gameCard.querySelector('.turd-rating-container')) {
                        window.turdRatingManager.addRatingToGameCard(gameCard, game);
                    }
                });
            }, 100); // Small delay to ensure DOM is ready
        }
        
        this.updateGameCount();
    }

    updateGameCount() {
        const gameCountElement = document.getElementById('gameCount');
        if (gameCountElement) {
            gameCountElement.textContent = this.filteredGames.length;
        }
    }

    performSearch(searchTerm) {
        // Add debouncing to prevent excessive searches
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.performAdvancedSearch(searchTerm);
        }, 300);
    }
    
    // Advanced search with fuzzy matching, operators, and suggestions
    performAdvancedSearch(searchTerm) {
        if (!searchTerm?.trim()) {
            this.currentFilters.search = '';
            this.applyFilters();
            this.renderGames();
            return;
        }
        
        const cleanTerm = searchTerm.trim();
        this.currentFilters.search = cleanTerm;
        
        // Save to search history
        this.addToSearchHistory(cleanTerm);
        
        // Apply with enhanced matching
        this.applyAdvancedFilters();
        
        // Show search suggestions if no results
        if (this.filteredGames.length === 0) {
            this.showSearchSuggestions(cleanTerm);
        }
        
        // Track search analytics
        this.trackSearchAnalytics(cleanTerm);
    }
    
    // Enhanced search with fuzzy matching, synonyms, and operators
    applyAdvancedFilters() {
        let filtered = [...this.games];
        
        // Apply other filters first
        if (this.currentFilters.gameType !== 'all') {
            filtered = filtered.filter(game =>
                game.gameType === this.currentFilters.gameType ||
                game.genre === this.currentFilters.gameType ||
                game.category === this.currentFilters.gameType
            );
        }
        
        if (this.currentFilters.chaosVibe !== 'all') {
            filtered = filtered.filter(game =>
                game.chaosVibe === this.currentFilters.chaosVibe ||
                game.vibe === this.currentFilters.chaosVibe ||
                game.tags?.includes(this.currentFilters.chaosVibe)
            );
        }
        
        if (this.currentFilters.difficulty !== 'all') {
            filtered = filtered.filter(game =>
                game.difficulty === this.currentFilters.difficulty ||
                game.painLevel === this.currentFilters.difficulty
            );
        }
        
        // Enhanced search term filtering
        if (this.currentFilters.search) {
            filtered = this.applyEnhancedSearchFilter(filtered, this.currentFilters.search);
        }
        
        this.applySorting(filtered);
        this.filteredGames = filtered;
        this.updateFilteredResults();
        this.renderGames();
    }
    
    // Advanced search algorithm with fuzzy matching and operators
    applyEnhancedSearchFilter(games, searchTerm) {
        const term = searchTerm.toLowerCase();
        
        // Check for quoted phrases (exact match)
        const quotedMatches = term.match(/"([^"]+)"/g);
        if (quotedMatches) {
            const phrases = quotedMatches.map(match => match.slice(1, -1));
            return games.filter(game => {
                return phrases.every(phrase => 
                    game.title.toLowerCase().includes(phrase) ||
                    game.description.toLowerCase().includes(phrase) ||
                    (game.tags && game.tags.some(tag => tag.toLowerCase().includes(phrase)))
                );
            });
        }
        
        // Check for AND operator
        if (term.includes(' and ') || term.includes(' & ')) {
            const andTerms = term.split(/ and | & /).map(t => t.trim());
            return games.filter(game => {
                return andTerms.every(andTerm => 
                    this.matchesGameContent(game, andTerm)
                );
            });
        }
        
        // Check for OR operator
        if (term.includes(' or ') || term.includes(' | ')) {
            const orTerms = term.split(/ or | \| /).map(t => t.trim());
            return games.filter(game => {
                return orTerms.some(orTerm => 
                    this.matchesGameContent(game, orTerm)
                );
            });
        }
        
        // Default: fuzzy matching with scoring
        return this.fuzzySearchGames(games, term);
    }
    
    // Fuzzy search with similarity scoring
    fuzzySearchGames(games, searchTerm) {
        const scoredGames = games.map(game => ({
            game: game,
            score: this.calculateSearchScore(game, searchTerm)
        })).filter(item => item.score > 0);
        
        // Sort by relevance score (highest first)
        scoredGames.sort((a, b) => b.score - a.score);
        
        return scoredGames.map(item => item.game);
    }
    
    // Calculate search relevance score
    calculateSearchScore(game, searchTerm) {
        let score = 0;
        const term = searchTerm.toLowerCase();
        const title = game.title.toLowerCase();
        const description = game.description.toLowerCase();
        const tags = game.tags || [];
        
        // Exact title match (highest score)
        if (title === term) return 1000;
        
        // Title starts with search term
        if (title.startsWith(term)) score += 500;
        
        // Title contains search term
        if (title.includes(term)) score += 200;
        
        // Fuzzy title match
        score += this.fuzzyMatch(title, term) * 100;
        
        // Description contains search term
        if (description.includes(term)) score += 100;
        
        // Fuzzy description match
        score += this.fuzzyMatch(description, term) * 50;
        
        // Tag matches
        tags.forEach(tag => {
            if (tag.toLowerCase() === term) score += 300;
            if (tag.toLowerCase().includes(term)) score += 150;
            score += this.fuzzyMatch(tag.toLowerCase(), term) * 75;
        });
        
        // Genre/category matches
        if (game.genre?.toLowerCase().includes(term)) score += 200;
        if (game.category?.toLowerCase().includes(term)) score += 200;
        if (game.gameType?.toLowerCase().includes(term)) score += 200;
        
        // Synonyms and alternative spellings
        score += this.checkSynonyms(game, term) * 50;
        
        return Math.round(score);
    }
    
    // Basic fuzzy matching algorithm
    fuzzyMatch(text, pattern) {
        const textLen = text.length;
        const patternLen = pattern.length;
        
        if (patternLen === 0) return 0;
        if (textLen === 0) return 0;
        
        let score = 0;
        let patternIdx = 0;
        
        for (let i = 0; i < textLen && patternIdx < patternLen; i++) {
            if (text[i] === pattern[patternIdx]) {
                score++;
                patternIdx++;
            }
        }
        
        return patternIdx === patternLen ? score / patternLen : 0;
    }
    
    // Check for synonyms and common misspellings
    checkSynonyms(game, searchTerm) {
        const synonyms = {
            'platformer': ['platform', 'jumping', 'mario', 'runner'],
            'shooter': ['shooting', 'gun', 'bullet', 'fps', 'shmup'],
            'puzzle': ['brain', 'thinking', 'logic', 'mind'],
            'horror': ['scary', 'creepy', 'spooky', 'fear', 'jump scare'],
            'rpg': ['role playing', 'roleplay', 'fantasy', 'adventure'],
            'arcade': ['retro', 'classic', 'old school', 'pixel'],
            'weird': ['strange', 'bizarre', 'odd', 'unusual', 'wtf'],
            'cursed': ['evil', 'dark', 'demon', 'hell', 'satan'],
            'broken': ['glitchy', 'buggy', 'error', 'crash', 'fail'],
            'meme': ['funny', 'joke', 'lol', 'memes', 'viral'],
            'dumbass': ['stupid', 'dumb', 'silly', 'ridiculous', 'bad'],
            'ai': ['artificial intelligence', 'robot', 'machine', 'neural'],
            'space': ['cosmic', 'galaxy', 'universe', 'alien', 'star'],
            'cyber': ['digital', 'neon', 'tech', 'future', 'matrix']
        };
        
        let synonymScore = 0;
        
        for (const [word, syns] of Object.entries(synonyms)) {
            if (syns.includes(searchTerm)) {
                if (this.matchesGameContent(game, word)) {
                    synonymScore += 1;
                }
            }
        }
        
        return synonymScore;
    }
    
    // Helper to check if game matches content
    matchesGameContent(game, term) {
        const content = [
            game.title,
            game.description,
            game.genre,
            game.category,
            game.gameType,
            ...(game.tags || [])
        ].join(' ').toLowerCase();
        
        return content.includes(term.toLowerCase());
    }
    
    // Search History Management
    async loadSearchHistory() {
        try {
            const history = await window.persistenceManager.loadSearchHistory();
            return history.searchTerms || [];
        } catch (error) {
            console.error('Error loading search history:', error);
            return [];
        }
    }
    
    async addToSearchHistory(searchTerm) {
        if (!searchTerm || searchTerm.length < 2) return;
        
        // Remove if already exists (to move to front)
        this.searchHistory = this.searchHistory.filter(term => term !== searchTerm);
        
        // Add to front
        this.searchHistory.unshift(searchTerm);
        
        // Keep only last 20 searches
        if (this.searchHistory.length > 20) {
            this.searchHistory = this.searchHistory.slice(0, 20);
        }
        
        // Save using persistence manager
        const historyData = { searchTerms: this.searchHistory };
        await window.persistenceManager.saveSearchHistory(historyData);
    }
    
    getSearchSuggestions(partialTerm) {
        if (!partialTerm || partialTerm.length < 2) return [];
        
        const term = partialTerm.toLowerCase();
        const suggestions = new Set();
        
        // Game titles
        this.games.forEach(game => {
            if (game.title.toLowerCase().includes(term)) {
                suggestions.add(game.title);
            }
        });
        
        // Game types/categories
        Object.values(this.gameTypes).forEach(type => {
            if (type.toLowerCase().includes(term)) {
                suggestions.add(type);
            }
        });
        
        // Search history
        this.searchHistory.forEach(historyTerm => {
            if (historyTerm.toLowerCase().includes(term)) {
                suggestions.add(historyTerm);
            }
        });
        
        return Array.from(suggestions).slice(0, 10);
    }
    
    showSearchSuggestions(searchTerm) {
        const suggestions = [
            "Try 'space adventure' - lots of cosmic chaos!",
            "Search 'puzzle' for brain-bending disasters",
            "Try 'robot' or 'ai' for digital nightmares",
            "Search 'horror' if you hate yourself",
            "Type 'meme' for peak internet culture",
            "Try 'broken' for gloriously buggy games"
        ];
        
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        
        if (window.dumbassGame?.notificationManager) {
            window.dumbassGame.notificationManager.showInfo(`💡 ${randomSuggestion}`);
        }
        
        console.log(`🔍 No results for "${searchTerm}". Suggestion: ${randomSuggestion}`);
    }
    
    // Search Analytics
    loadSearchAnalytics() {
        try {
            const analytics = localStorage.getItem('dumbassgames_search_analytics');
            return analytics ? JSON.parse(analytics) : {
                totalSearches: 0,
                popularTerms: {},
                noResultsTerms: {},
                lastSearched: null
            };
        } catch (error) {
            console.error('Error loading search analytics:', error);
            return {
                totalSearches: 0,
                popularTerms: {},
                noResultsTerms: {},
                lastSearched: null
            };
        }
    }
    
    trackSearchAnalytics(searchTerm) {
        if (!searchTerm || searchTerm.length < 2) return;
        
        const resultCount = this.filteredGames.length;
        
        // Update analytics
        this.searchAnalytics.totalSearches++;
        this.searchAnalytics.lastSearched = new Date().toISOString();
        
        // Track popular terms
        if (!this.searchAnalytics.popularTerms[searchTerm]) {
            this.searchAnalytics.popularTerms[searchTerm] = 0;
        }
        this.searchAnalytics.popularTerms[searchTerm]++;
        
        // Track no-results terms
        if (resultCount === 0) {
            if (!this.searchAnalytics.noResultsTerms[searchTerm]) {
                this.searchAnalytics.noResultsTerms[searchTerm] = 0;
            }
            this.searchAnalytics.noResultsTerms[searchTerm]++;
        }
        
        // Save analytics
        localStorage.setItem('dumbassgames_search_analytics', JSON.stringify(this.searchAnalytics));
        
        // Log for debugging
        console.log(`🔍 Search: "${searchTerm}" → ${resultCount} results`);
    }
    
    // Get search analytics for admin/debugging
    getSearchAnalytics() {
        const topTerms = Object.entries(this.searchAnalytics.popularTerms)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);
            
        const problemTerms = Object.entries(this.searchAnalytics.noResultsTerms)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
        
        return {
            ...this.searchAnalytics,
            topSearchTerms: topTerms,
            problemTerms: problemTerms
        };
    }

    // Initialize button states for visual feedback
    initializeButtonStates() {
        // This will be called after DOM is ready
        setTimeout(() => {
            this.updateButtonStates();
        }, 100);
    }
    
    updateButtonStates() {
        // Update game type buttons
        document.querySelectorAll('[data-genre]').forEach(btn => {
            const isActive = btn.dataset.genre === this.currentFilters.gameType;
            btn.classList.toggle('active', isActive);
        });
        
        // Update chaos vibe buttons  
        document.querySelectorAll('[data-vibe]').forEach(btn => {
            const isActive = btn.dataset.vibe === this.currentFilters.chaosVibe;
            btn.classList.toggle('active', isActive);
        });
        
        // Update difficulty buttons
        document.querySelectorAll('[data-difficulty]').forEach(btn => {
            const isActive = btn.dataset.difficulty === this.currentFilters.difficulty;
            btn.classList.toggle('active', isActive);
        });
        
        // Update sort buttons
        document.querySelectorAll('[data-sort]').forEach(btn => {
            const isActive = btn.dataset.sort === this.currentFilters.sort;
            btn.classList.toggle('active', isActive);
        });
    }

    // New filter methods for dual-category system
    filterByGenre(gameType) {
        this.currentFilters.gameType = gameType;
        this.updateButtonStates();
        this.applyFilters();
        
        // Visual feedback
        if (window.dumbassGame?.soundSystem) {
            window.dumbassGame.soundSystem.playClick();
        }
    }
    
    filterByVibe(chaosVibe) {
        this.currentFilters.chaosVibe = chaosVibe;
        this.updateButtonStates();
        this.applyFilters();
        
        // Visual feedback
        if (window.dumbassGame?.soundSystem) {
            window.dumbassGame.soundSystem.playClick();
        }
    }

    filterByDifficulty(difficulty) {
        this.currentFilters.difficulty = difficulty;
        this.updateButtonStates();
        this.applyFilters();
        
        // Visual feedback
        if (window.dumbassGame?.soundSystem) {
            window.dumbassGame.soundSystem.playClick();
        }
    }

    sortGames(sortBy) {
        this.currentFilters.sort = sortBy;
        this.updateButtonStates();
        this.applyFilters();
        
        // Visual feedback
        if (window.dumbassGame?.soundSystem) {
            window.dumbassGame.soundSystem.playClick();
        }
    }

    clearAllFilters() {
        this.currentFilters = { 
            gameType: 'all', 
            chaosVibe: 'all', 
            difficulty: 'all', 
            search: '', 
            sort: 'newest' 
        };
        
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        
        this.updateButtonStates();
        this.applyFilters();
        this.renderGames();
        
        // Visual feedback
        if (window.dumbassGame?.soundSystem) {
            window.dumbassGame.soundSystem.playSuccess();
        }
        if (window.dumbassGame?.notificationManager) {
            window.dumbassGame.notificationManager.showInfo('🔥 Chaos has been reset! All filters cleared.');
        }
    }

    // Legacy method for backward compatibility
    filterByCategory(category) {
        this.filterByGenre(category);
    }
}

// Search & Filter Modal Management
class SearchFilterManager {
    constructor() {
        this.setupModalHandlers();
    }

    setupModalHandlers() {
        const searchFilterModal = document.getElementById('searchFilterModal');
        if (searchFilterModal) {
            searchFilterModal.addEventListener('click', (e) => {
                if (e.target === searchFilterModal) this.hideModal();
            });
        }

        // Add Escape key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('searchFilterModal');
                if (modal && modal.style.display === 'block') {
                    this.hideModal();
                }
            }
        });
    }

    showModal() {
        const modal = document.getElementById('searchFilterModal');
        if (modal) {
            modal.classList.remove('hide');
            modal.classList.add('show');
        }
    }

    hideModal() {
        const modal = document.getElementById('searchFilterModal');
        if (modal) {
            modal.classList.remove('show');
            modal.classList.add('hide');
        }
    }

    applyFilters() {
        if (window.enhancedGameManager) {
            // Get search input value
            const searchInput = document.querySelector('#searchFilterModal input[type="text"]');
            if (searchInput && searchInput.value.trim()) {
                window.enhancedGameManager.performSearch(searchInput.value.trim());
            }
            
            window.enhancedGameManager.applyFilters();
            window.enhancedGameManager.renderGames();
            
            // Visual feedback
            if (window.dumbassGame?.soundSystem) {
                window.dumbassGame.soundSystem.playSuccess();
            }
            if (window.dumbassGame?.notificationManager) {
                const totalFiltered = window.enhancedGameManager.filteredGames.length;
                const message = totalFiltered === 0 ? 
                    '🎮 No games match your chaos criteria!' :
                    `🎯 Unleashed ${totalFiltered} glorious disasters!`;
                window.dumbassGame.notificationManager.showSuccess(message);
            }
        }
        this.hideModal();
    }
}

// Phase 3 systems are now initialized in the DOM ready handler above
// This ensures proper Firebase integration timing

// Global functions for Phase 3 features
function showUserProfile() { window.userProfileManager?.showProfile(); }
function hideUserProfile() { window.userProfileManager?.hideProfile(); }
function switchProfileTab(tabName) { window.userProfileManager?.switchTab(tabName); }
function toggleProfileSound() { 
    window.soundEnabled = !window.soundEnabled;
    window.userProfileManager?.updateToggleButtons();
}
function toggleProfileEffects() { 
    window.effectsEnabled = !window.effectsEnabled;
    window.userProfileManager?.updateToggleButtons();
}
function refreshFavorites() { window.userProfileManager?.renderFavorites(); }

function refreshSubmissions() { 
    if (window.userProfileManager) {
        window.userProfileManager.loadUserSubmissions().then(() => {
            window.userProfileManager.renderSubmissions();
            window.userProfileManager.updateProfileUI();
        });
    }
}

function debugUserSubmissions() {
    console.log('🔍 DEBUG: Current user:', window.firebaseAuth?.currentUser?.uid);
    console.log('🔍 DEBUG: All games:', window.enhancedGameManager?.games);
    console.log('🔍 DEBUG: User submissions:', window.userProfileManager?.submittedGames);
    
    if (window.enhancedGameManager?.games) {
        window.enhancedGameManager.games.forEach(game => {
            console.log(`🔍 Game: ${game.title}, submittedBy: ${game.submittedBy}, author: ${game.author}`);
        });
    }
}

async function fixGameAttribution() {
    if (!window.firebaseAuth?.currentUser || !window.dataManager) {
        console.error('❌ User not signed in or Firebase not available');
        return;
    }
    
    const userId = window.firebaseAuth.currentUser.uid;
    const userEmail = window.firebaseAuth.currentUser.email;
    
    console.log('🔧 Fixing game attribution for user:', userEmail);
    
    if (window.enhancedGameManager?.games) {
        for (const game of window.enhancedGameManager.games) {
            // Fix games that belong to this user but don't have proper attribution
            if ((game.author === 'nutshot' || !game.submittedBy) && userEmail === 'dumbassgames@proton.me') {
                console.log(`🔧 Fixing attribution for: ${game.title}`);
                
                // Update the game with proper attribution
                const updatedGame = {
                    ...game,
                    submittedBy: userId,
                    author: userEmail
                };
                
                try {
                    await window.dataManager.updateGame(game.id, updatedGame);
                    console.log(`✅ Fixed attribution for: ${game.title}`);
                    
                    // Update local copy
                    Object.assign(game, updatedGame);
                } catch (error) {
                    console.error(`❌ Failed to fix attribution for ${game.title}:`, error);
                }
            }
        }
        
        // Refresh user submissions after fixing
        if (window.userProfileManager) {
            await window.userProfileManager.loadUserSubmissions();
            window.userProfileManager.updateProfileUI();
        }
        
        console.log('✅ Game attribution fix complete!');
    }
}
function confirmDeleteAccount() { alert('Account deletion not yet implemented.'); }
function showSearchFilter() { window.searchFilterManager?.showModal(); }
function hideSearchFilter() { window.searchFilterManager?.hideModal(); }
function performSearch() { 
    const searchInput = document.getElementById('searchInput');
    if (searchInput && window.enhancedGameManager) {
        window.enhancedGameManager.performSearch(searchInput.value);
        
        // Visual feedback for live search
        if (searchInput.value.trim() && window.dumbassGame?.soundSystem) {
            window.dumbassGame.soundSystem.playHover();
        }
    }
}

// Enhanced search functions for the bulletproof system
function performAdvancedSearch(event) {
    const searchInput = event.target;
    const value = searchInput.value;
    
    if (window.enhancedGameManager) {
        window.enhancedGameManager.performSearch(value);
        
        // Show suggestions if typing
        if (value.length >= 2) {
            showSearchSuggestions(value);
        } else {
            hideSearchSuggestions();
        }
    }
}

function executeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput && window.enhancedGameManager) {
        window.enhancedGameManager.performAdvancedSearch(searchInput.value);
        hideSearchSuggestions();
        
        // Play search sound
        if (window.dumbassGame?.soundSystem) {
            window.dumbassGame.soundSystem.playClick();
        }
    }
}

function handleSearchKeydown(event) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    const suggestions = suggestionsContainer.querySelectorAll('.search-suggestion');
    
    switch (event.key) {
        case 'Enter':
            event.preventDefault();
            const selected = suggestionsContainer.querySelector('.search-suggestion.selected');
            if (selected) {
                selectSuggestion(selected.textContent.trim());
            } else {
                executeSearch();
            }
            break;
            
        case 'ArrowDown':
            event.preventDefault();
            navigateSuggestions(suggestions, 1);
            break;
            
        case 'ArrowUp':
            event.preventDefault();
            navigateSuggestions(suggestions, -1);
            break;
            
        case 'Escape':
            hideSearchSuggestions();
            break;
    }
}

function navigateSuggestions(suggestions, direction) {
    const current = document.querySelector('.search-suggestion.selected');
    let newIndex = 0;
    
    if (current) {
        current.classList.remove('selected');
        const currentIndex = Array.from(suggestions).indexOf(current);
        newIndex = (currentIndex + direction + suggestions.length) % suggestions.length;
    }
    
    if (suggestions[newIndex]) {
        suggestions[newIndex].classList.add('selected');
    }
}

function showSearchSuggestions(searchTerm) {
    if (!window.enhancedGameManager) return;
    
    const suggestions = window.enhancedGameManager.getSearchSuggestions(searchTerm);
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    if (suggestions.length === 0) {
        hideSearchSuggestions();
        return;
    }
    
    suggestionsContainer.innerHTML = suggestions.map(suggestion => 
        `<div class="search-suggestion" onclick="selectSuggestion('${suggestion.replace(/'/g, "\\'")}')">
            <span class="suggestion-text">${suggestion}</span>
            <span class="suggestion-type">🔍</span>
        </div>`
    ).join('');
    
    suggestionsContainer.style.display = 'block';
}

function showSearchHistory() {
    if (!window.enhancedGameManager) return;
    
    const history = window.enhancedGameManager.searchHistory.slice(0, 5);
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    if (history.length === 0) {
        hideSearchSuggestions();
        return;
    }
    
    suggestionsContainer.innerHTML = history.map(term => 
        `<div class="search-suggestion history" onclick="selectSuggestion('${term.replace(/'/g, "\\'")}')">
            <span class="suggestion-text">${term}</span>
            <span class="suggestion-type">HISTORY</span>
        </div>`
    ).join('');
    
    suggestionsContainer.style.display = 'block';
}

function selectSuggestion(suggestion) {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = suggestion;
    executeSearch();
    hideSearchSuggestions();
}

function hideSearchSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
        suggestionsContainer.innerHTML = '';
    }
}

// Close suggestions when clicking outside
document.addEventListener('click', function(event) {
    const searchWrapper = document.querySelector('.search-input-wrapper');
    if (searchWrapper && !searchWrapper.contains(event.target)) {
        hideSearchSuggestions();
    }
});
// Global filter functions for the dual-category system
function filterByGenre(gameType) { 
    window.enhancedGameManager?.filterByGenre(gameType); 
}

function filterByVibe(chaosVibe) { 
    window.enhancedGameManager?.filterByVibe(chaosVibe); 
}

function filterByDifficulty(difficulty) { 
    window.enhancedGameManager?.filterByDifficulty(difficulty); 
}

function sortGames(sortBy) { 
    window.enhancedGameManager?.sortGames(sortBy); 
}

function clearAllFilters() { 
    window.enhancedGameManager?.clearAllFilters(); 
}

function applyFilters() { 
    window.searchFilterManager?.applyFilters(); 
}

// Legacy functions for backward compatibility
function filterByCategory(category) { 
    window.enhancedGameManager?.filterByGenre(category); 
}

// Simple close function that definitely works
function closeSearchModal() {
    const modal = document.getElementById('searchFilterModal');
    if (modal) {
        modal.classList.remove('show');
        modal.classList.add('hide');
        modal.style.display = 'none'; // Double safety
    }
}

// 🎲 SIMPLE RANDOM GAME SYSTEM - Clean and reliable!
async function playRandomGame() {
    console.log('🎲 Random game button clicked!');
    
    // Get games from the enhanced game manager
    const games = window.enhancedGameManager?.games || [];
    console.log(`🎮 Found ${games.length} games available`);
    
    if (games.length === 0) {
        console.log('No games found, trying to sync with Firebase...');
        
        // Try to sync with Firebase if no games are loaded
        if (window.enhancedGameManager && window.dataManager) {
            try {
                await window.enhancedGameManager.syncWithFirebase();
                const syncedGames = window.enhancedGameManager.games || [];
                console.log('After Firebase sync, games found:', syncedGames.length);
                
                if (syncedGames.length > 0) {
                    // Try again with synced games
                    playRandomGame();
                    return;
                }
            } catch (error) {
                console.error('Error syncing with Firebase:', error);
            }
        }
        
        // Still no games found
        window.dumbassGame?.notificationManager?.showWarning('🎮 No games loaded yet! Add some games first.');
        return;
    }
    
    // Filter out games with invalid URLs
    const validGames = games.filter(game => game.url && game.url !== '#' && game.url.trim() !== '');
    
    if (validGames.length === 0) {
        window.dumbassGame?.notificationManager?.showError('❌ No playable games found! All games have invalid URLs.');
        return;
    }
    
    // Pick a random game
    const randomIndex = Math.floor(Math.random() * validGames.length);
    const selectedGame = validGames[randomIndex];
    
    console.log(`🎯 Randomly selected: "${selectedGame.title}" (${randomIndex + 1}/${validGames.length})`);
    console.log(`🔗 Game URL: ${selectedGame.url}`);
    
    // Show simple selection notification
    showRandomGameSelection(selectedGame);
}

function showRandomGameSelection(game) {
    // Play selection sound
    if (window.dumbassGame?.soundSystem) {
        window.dumbassGame.soundSystem.playClick();
    }
    
    // Show selection notification with fun random messages
    const randomMessages = [
        '🎯 RANDOMLY SELECTED',
        '🎲 LUCK HAS CHOSEN',
        '🌟 THE STARS HAVE ALIGNED',
        '🎪 CHAOS HAS DECIDED',
        '🎮 FATE PICKED',
        '✨ MAGIC SELECTED',
        '🎭 DESTINY CHOSE',
        '🎨 THE ALGORITHM BLESSED'
    ];
    
    const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
    
    // Show notification
    window.dumbassGame?.notificationManager?.showSuccess(
        `${randomMessage}: "${game.title}"!`
    );
    
    // Brief delay then launch the game
    setTimeout(() => {
        launchRandomGame(game);
    }, 800);
}

function launchRandomGame(game) {
    console.log(`🚀 Launching random game: "${game.title}"`);
    
    // Validate URL one more time
    if (!game.url || game.url === '#' || game.url.trim() === '') {
        console.error('❌ Invalid game URL:', game.url);
        window.dumbassGame?.notificationManager?.showError(
            `❌ Cannot launch "${game.title}" - invalid URL!`
        );
        return;
    }
    
    // Launch the game using the same method as the main page
    if (window.dumbassGame?.playGame) {
        window.dumbassGame.playGame(game.url, game.title);
    } else {
        // Fallback - open directly
        console.log('🔧 Using fallback launch method');
        window.open(game.url, '_blank');
        window.dumbassGame?.notificationManager?.showSuccess(`🎮 Launching "${game.title}"!`);
    }
}

// ===== INITIALIZATION SYSTEM =====
// Initialize all managers in the correct order

// Initialize Firebase first
console.log('🔥 Initializing Firebase managers...');
window.dataManager = new FirebaseDataManager();
window.firebaseAuth = new FirebaseAuthManager();
window.authManager = window.firebaseAuth; // Alias for compatibility

// Initialize unified persistence manager
console.log('💾 Initializing Data Persistence Manager...');
window.persistenceManager = new DataPersistenceManager();

// Initialize user profile manager
console.log('👤 Initializing User Profile Manager...');
window.userProfileManager = new UserProfileManager();

// Initialize music player
console.log('🎵 Initializing Music Player...');
window.musicPlayer = new RetroMusicPlayer();

// Initialize search filter manager
console.log('🔍 Initializing Search Filter Manager...');
window.searchFilterManager = new SearchFilterManager();

// Initialize enhanced game manager
console.log('🎮 Initializing Enhanced Game Manager...');
window.enhancedGameManager = new EnhancedGameManager();

// Initialize main game system (MUST be last)
console.log('🚀 Initializing Main Game System...');
window.dumbassGame = new DumbassGameEnhanced();

// Initialize global sound and effects state
window.soundEnabled = true;
window.effectsEnabled = true;

// Initialize Firebase Auth Manager
console.log('🔥 Initializing Firebase Auth Manager...');
window.authManager = new FirebaseAuthManager();

// 🚀 ROBUST SYSTEM INITIALIZATION WITH ERROR HANDLING
function initializeAllSystems() {
    console.log('🚀 Starting DumbassGames System Initialization...');
    
    // Initialize Site Owner Monitoring System with error handling
    // Initialize Site Owner Monitoring with Firebase dependency check
    const initSiteMonitoring = () => {
        try {
            if (window.firebaseAuth && window.firebaseAuth.onAuthStateChanged) {
                console.status('👑 Initializing Site Owner Monitoring...');
                window.siteMonitoring = new SiteOwnerMonitoring();
                
                // Auto-enable automation features
                window.siteMonitoring.enableTwitterIntegration();
                window.siteMonitoring.enableEmailNotifications();
                
                console.status('✅ Site Owner Monitoring initialized!');
            } else {
                // Firebase not ready, retry in 500ms
                setTimeout(initSiteMonitoring, 500);
            }
        } catch (error) {
            console.error('❌ Site Monitoring initialization failed:', error);
        }
    };
    
    // Start site monitoring init with delay to ensure Firebase is ready
    setTimeout(initSiteMonitoring, 2000);
    
    // Initialize Admin Console with robust error handling
    const initAdminConsole = () => {
        try {
            if (!window.dumbassGameAdmin && window.dumbassGame) {
                console.status('🔧 Initializing Admin Console...');
                window.dumbassGameAdmin = new DumbassGameAdmin(window.dumbassGame);
                console.status('✅ Admin Console ready!');
                
                // Verify all automation features are connected
                if (window.siteMonitoring) {
                    console.log('🔗 Connecting admin commands to automation...');
                    // Test automation status
                    const status = window.siteMonitoring.getAutomationStatus();
                    console.log('📊 Automation Status:', status);
                }
            } else if (!window.dumbassGame) {
                console.log('⏳ Waiting for main game system...');
                // Retry in 500ms
                setTimeout(initAdminConsole, 500);
            }
        } catch (error) {
            console.error('❌ Admin Console initialization failed:', error);
        }
    };
    
    // Start admin console initialization
    setTimeout(initAdminConsole, 1000);
    
    // Final verification check
    setTimeout(() => {
        if (window.DEVELOPMENT_MODE) {
            console.log('🔍 FINAL SYSTEM CHECK:');
            console.log('Main Game:', !!window.dumbassGame);
            console.log('Admin System:', !!window.dumbassGameAdmin);
            console.log('Site Monitoring:', !!window.siteMonitoring);
            console.log('Twitter API:', !!window.TwitterAPI);
            console.log('Twitter Configured:', window.TwitterAPI?.isConfigured);
            
            if (window.siteMonitoring) {
                const automationStatus = window.siteMonitoring.getAutomationStatus();
                console.log('🤖 Automation Status:', automationStatus);
            }
        }
        
        if (window.siteMonitoring) {
            console.status('✅ ALL SYSTEMS OPERATIONAL!');
        } else {
            console.error('❌ Site monitoring system failed to initialize properly');
        }
    }, 3000);
}

// Start initialization
initializeAllSystems();

console.status('🚀 System initialization started!');

// Update volume slider appearance after everything is loaded
setTimeout(() => {
    updateVolumeSliderAppearance();
}, 500);

// Setup progress bar click functionality after everything is loaded
setTimeout(() => {
    setupGlobalProgressBarEvents();
}, 1000);

// Debug function to check game data from console
window.debugSpinner = function() {
    console.log('🔍 SPINNER DEBUG REPORT:');
    console.log('=============================================');
    
    // Check enhanced game manager
    if (window.enhancedGameManager) {
        console.log('✅ Enhanced Game Manager exists');
        console.log(`📊 Games loaded: ${window.enhancedGameManager.games?.length || 0}`);
        
        if (window.enhancedGameManager.games?.length > 0) {
            console.log('🎮 Game details:');
            window.enhancedGameManager.games.forEach((game, index) => {
                console.log(`  ${index + 1}. "${game.title}"`);
                console.log(`     URL: ${game.url}`);
                console.log(`     Author: ${game.author || 'Unknown'}`);
                console.log(`     ID: ${game.id}`);
                console.log('     ---');
            });
        }
    } else {
        console.log('❌ Enhanced Game Manager not found');
    }
    
    // Check main game manager
    if (window.dumbassGame) {
        console.log(`📊 Main Game Manager games: ${window.dumbassGame.games?.length || 0}`);
    } else {
        console.log('❌ Main Game Manager not found');
    }
    
    // Check Firebase
    if (window.dataManager) {
        console.log(`🔥 Firebase initialized: ${window.dataManager.isInitialized}`);
    } else {
        console.log('❌ Firebase Data Manager not found');
    }
    
    console.log('=============================================');
    console.log('💡 To test spinner: playRandomGame()');
};

// ============================================================================
// STANDALONE FAVORITES MODAL SYSTEM
// ============================================================================

// Show the standalone favorites modal
function showFavoritesModal() {
    const modal = document.getElementById('favoritesModal');
    if (modal) {
        modal.style.display = 'block';
        loadStandaloneFavorites();
        
        // Play open sound
        if (window.dumbassGame?.soundSystem) {
            window.dumbassGame.soundSystem.playClick();
        }
        
        // Track analytics
        if (window.enhancedGameManager) {
            console.log('💛 Favorites modal opened');
        }
    }
}

// Close the standalone favorites modal
function closeFavoritesModal() {
    const modal = document.getElementById('favoritesModal');
    if (modal) {
        modal.style.display = 'none';
        
        // Play close sound
        if (window.dumbassGame?.soundSystem) {
            window.dumbassGame.soundSystem.playHover();
        }
    }
}

// Load favorites into the standalone modal
function loadStandaloneFavorites() {
    const grid = document.getElementById('standaloneFavoritesGrid');
    const countElement = document.getElementById('favoritesCount');
    
    if (!grid || !countElement) return;
    
    let favoriteGames = [];
    
    // Get favorites from user profile manager if available
    if (window.userProfileManager && window.userProfileManager.favoriteGames) {
        favoriteGames = window.userProfileManager.favoriteGames;
    }
    
    // Update count
    countElement.textContent = favoriteGames.length;
    
    if (favoriteGames.length === 0) {
        grid.innerHTML = '';
        return;
    }
    
    // Render favorite games
    grid.innerHTML = favoriteGames.map(game => `
        <div class="favorite-game-card">
            <div class="game-title">${game.title}</div>
            <div class="game-description">${game.description}</div>
            <div class="game-metadata">
                ${game.genre ? `<span class="game-genre">🎮 ${game.genre}</span>` : ''}
                ${game.vibe ? `<span class="game-vibe">🎪 ${game.vibe}</span>` : ''}
                ${game.difficulty ? `<span class="game-difficulty ${game.difficulty.toLowerCase()}">${getDifficultyIcon(game.difficulty)} ${game.difficulty}</span>` : ''}
            </div>
            <div class="game-actions">
                <button class="btn-primary" onclick="playGameFromFavorites('${game.url}', '${game.title.replace(/'/g, "\\'")}')">
                    🕹️ PLAY
                </button>
                <button class="action-btn favorite-btn active" onclick="removeFromStandaloneFavorites('${game.id}')" title="Remove from favorites">
                    💔 REMOVE
                </button>
                <button class="btn-secondary" onclick="shareGameFromFavorites('${game.id}')" title="Share game">
                    📤 SHARE
                </button>
            </div>
        </div>
    `).join('');
}

// Helper function to get difficulty icon
function getDifficultyIcon(difficulty) {
    const icons = {
        'baby': '👶',
        'easy': '😊',
        'medium': '😐',
        'hard': '😤',
        'expert': '💀',
        'impossible': '🔥',
        'suffering': '😫',
        'why': '❓',
        'unrated': '🤷'
    };
    return icons[difficulty?.toLowerCase()] || '🤷';
}

// Play game from favorites modal
function playGameFromFavorites(url, title) {
    if (window.dumbassGame && typeof window.dumbassGame.playGame === 'function') {
        window.dumbassGame.playGame(url, title);
        closeFavoritesModal();
    } else if (window.enhancedGameManager) {
        window.enhancedGameManager.playGame(url, title);
        closeFavoritesModal();
    }
}

// Remove game from favorites in standalone modal
function removeFromStandaloneFavorites(gameId) {
    if (window.userProfileManager && typeof window.userProfileManager.toggleFavorite === 'function') {
        window.userProfileManager.toggleFavorite(gameId).then(() => {
            loadStandaloneFavorites(); // Refresh the grid
            
            // Show notification
            if (window.dumbassGame?.notificationManager) {
                window.dumbassGame.notificationManager.showInfo('💔 Removed from favorites');
            }
        });
    }
}

// Share game from favorites
function shareGameFromFavorites(gameId) {
    if (window.enhancedGameManager && typeof window.enhancedGameManager.shareGame === 'function') {
        window.enhancedGameManager.shareGame(gameId);
    }
}

// Refresh favorites in standalone modal
function refreshStandaloneFavorites() {
    loadStandaloneFavorites();
    
    // Show feedback
    if (window.dumbassGame?.notificationManager) {
        window.dumbassGame.notificationManager.showSuccess('🔄 Favorites refreshed!');
    }
    
    // Play refresh sound
    if (window.dumbassGame?.soundSystem) {
        window.dumbassGame.soundSystem.playSuccess();
    }
}

// Clear all favorites with confirmation
function clearAllFavorites() {
    if (!window.userProfileManager || !window.userProfileManager.favoriteGames.length) {
        if (window.dumbassGame?.notificationManager) {
            window.dumbassGame.notificationManager.showInfo('💛 No favorites to clear');
        }
        return;
    }
    
    const count = window.userProfileManager.favoriteGames.length;
    
    if (confirm(`💔 Are you sure you want to remove all ${count} favorite games?\n\nThis action cannot be undone!`)) {
        // Clear favorites array
        window.userProfileManager.favoriteGames = [];
        
        // Save changes
        if (typeof window.userProfileManager.saveFavorites === 'function') {
            window.userProfileManager.saveFavorites();
        }
        
        // Update heart icons on main page
        if (typeof window.userProfileManager.updateHeartIcons === 'function') {
            window.userProfileManager.updateHeartIcons();
        }
        
        // Refresh modal
        loadStandaloneFavorites();
        
        // Show notification
        if (window.dumbassGame?.notificationManager) {
            window.dumbassGame.notificationManager.showSuccess(`💔 Cleared ${count} favorites`);
        }
        
        // Play sound
        if (window.dumbassGame?.soundSystem) {
            window.dumbassGame.soundSystem.playError();
        }
    }
}

// Export favorites as JSON
function exportFavorites() {
    if (!window.userProfileManager || !window.userProfileManager.favoriteGames.length) {
        if (window.dumbassGame?.notificationManager) {
            window.dumbassGame.notificationManager.showInfo('💛 No favorites to export');
        }
        return;
    }
    
    const favorites = window.userProfileManager.favoriteGames;
    const exportData = {
        exportDate: new Date().toISOString(),
        gameCount: favorites.length,
        source: 'DumbassGames v2.1',
        favorites: favorites
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `dumbassgames-favorites-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    
    // Show notification
    if (window.dumbassGame?.notificationManager) {
        window.dumbassGame.notificationManager.showSuccess(`📤 Exported ${favorites.length} favorites`);
    }
    
    // Play success sound
    if (window.dumbassGame?.soundSystem) {
        window.dumbassGame.soundSystem.playSuccess();
    }
}

// Add a "Show Favorites" button to the main interface
function addFavoritesButton() {
    // Add to header controls if they exist
    const headerControls = document.querySelector('.header-controls');
    console.log('💛 Adding favorites button... headerControls found:', !!headerControls);
    
    if (headerControls && !document.getElementById('favoritesBtn')) {
        const favoritesBtn = document.createElement('button');
        favoritesBtn.id = 'favoritesBtn';
        favoritesBtn.className = 'control-btn compact';
        favoritesBtn.innerHTML = '💛 FAVORITES';
        favoritesBtn.onclick = showFavoritesModal;
        favoritesBtn.title = 'View your favorite games';
        
        headerControls.appendChild(favoritesBtn);
        console.log('💛 Favorites button added successfully!');
    } else {
        console.log('💛 Favorites button already exists or header controls not found');
    }
}

// Add additional event listeners for the favorites modal
setTimeout(() => {
    // Close modal when clicking outside
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('favoritesModal');
        if (event.target === modal) {
            closeFavoritesModal();
        }
    });

    // Keyboard shortcut for favorites modal (Ctrl+F)
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'f' && !event.target.matches('input, textarea')) {
            event.preventDefault();
            showFavoritesModal();
        }
    });

    // Add favorites button to interface
    addFavoritesButton();
}, 3000);

// ========================================
// IMAGE UPLOAD SYSTEM
// ========================================

class ImageUploadManager {
    constructor() {
        this.currentUploadedImageUrl = null;
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeUploadInterface();
        });
        
        // If DOM is already loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeUploadInterface();
            });
        } else {
            this.initializeUploadInterface();
        }
    }

    initializeUploadInterface() {
        const dropzone = document.getElementById('imageDropzone');
        const fileInput = document.getElementById('imageFileInput');
        const urlInput = document.getElementById('gameImageUrl');

        if (dropzone && fileInput) {
            this.setupDropzone(dropzone, fileInput);
            this.setupFileInput(fileInput);
        }

        if (urlInput) {
            this.setupUrlPreview(urlInput);
        }
    }

    setupDropzone(dropzone, fileInput) {
        // Click to browse
        dropzone.addEventListener('click', (e) => {
            if (e.target.classList.contains('browse-link') || e.target.closest('.dropzone-content')) {
                fileInput.click();
            }
        });

        // Drag and drop events
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });

        dropzone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            if (!dropzone.contains(e.relatedTarget)) {
                dropzone.classList.remove('dragover');
            }
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            
            const files = Array.from(e.dataTransfer.files);
            const imageFiles = files.filter(file => this.allowedTypes.includes(file.type));
            
            if (imageFiles.length > 0) {
                this.handleFileUpload(imageFiles[0]);
            } else {
                this.showError('Please drop a valid image file (PNG, JPG, GIF, WebP)');
            }
        });
    }

    setupFileInput(fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFileUpload(file);
            }
        });
    }

    setupUrlPreview(urlInput) {
        let debounceTimer;
        
        urlInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.previewUrlImage(e.target.value);
            }, 500);
        });
    }

    async handleFileUpload(file) {
        // Validate file
        if (!this.validateFile(file)) {
            return;
        }

        try {
            // Show upload progress
            this.showUploadProgress();
            console.log('🚀 Starting image upload process...');
            
            // Try Firebase Storage upload, fall back to base64 if needed
            let imageUrl;
            let uploadMethod = 'unknown';
            
            try {
                console.log('🔥 Attempting Firebase Storage upload...');
                imageUrl = await this.uploadToFirebaseStorage(file);
                uploadMethod = 'Firebase Storage';
                console.log('✅ Firebase Storage upload successful');
                this.showSuccess('Image uploaded to cloud storage!');
            } catch (firebaseError) {
                console.warn('⚠️ Firebase Storage failed, switching to base64 fallback:', firebaseError.message);
                
                // Reset progress for base64 conversion
                this.updateUploadProgress(0);
                
                try {
                    imageUrl = await this.convertToBase64(file);
                    uploadMethod = 'Base64 (local storage)';
                    this.showWarning('Image stored locally (not uploaded to cloud)');
                } catch (base64Error) {
                    throw new Error(`Both upload methods failed. Firebase: ${firebaseError.message}, Base64: ${base64Error.message}`);
                }
            }
            
            console.log(`✅ Upload successful using ${uploadMethod}`);
            
            // Show success and preview
            this.showUploadSuccess(file.name, imageUrl);
            this.currentUploadedImageUrl = imageUrl;
            
            // Update form with the URL
            this.updateFormWithImageUrl(imageUrl);
            
        } catch (error) {
            console.error('❌ Upload failed completely:', error);
            this.showError('Upload failed: ' + error.message);
            this.hideUploadProgress();
        }
    }

    validateFile(file) {
        // Check file type
        if (!this.allowedTypes.includes(file.type)) {
            this.showError('🚫 Invalid file type. Please use PNG, JPG, GIF, or WebP images only.');
            return false;
        }

        // Check file size (reasonable limit - we auto-compress but want to avoid huge files)
        const maxSizeMB = 20; // 20MB reasonable limit for auto-compression
        if (file.size > maxSizeMB * 1024 * 1024) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
            this.showError(`🚫 Image too large! Your image is ${fileSizeMB}MB. Please choose an image under ${maxSizeMB}MB - we'll automatically optimize it for you! 📸`);
            return false;
        }

        return true;
    }

    async uploadToFirebaseStorage(file) {
        // Simple Base64 conversion (like it was before)
        console.log('📦 Converting image to Base64:', file.name);
        
        // Check file size for base64 (reasonable limit)
        if (file.size > 2000000) { // 2MB limit 
            this.hideUploadProgress();
            this.showError('Image too large (>2MB). Please choose a smaller image.');
            throw new Error('Image too large for Base64 storage');
        }
        
        try {
            this.showUploadProgress();
            this.updateUploadProgress(25);
            
            const base64 = await this.convertToBase64(file);
            
            this.updateUploadProgress(100);
            this.hideUploadProgress();
            this.showUploadSuccess(file.name, base64);
            this.updateFormWithImageUrl(base64);
            
            console.log('✅ Image converted to Base64 successfully');
            return base64;
        } catch (error) {
            console.error('❌ Base64 conversion failed:', error);
            this.hideUploadProgress();
            this.showError('Failed to process image. Please try again or use a direct URL.');
            throw error;
        }
    }

    async convertToBase64(file) {
        console.log('📦 Converting and optimizing image...');
        this.updateUploadProgress(10);
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                try {
                    this.updateUploadProgress(30);
                    
                    // Create canvas for image processing
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Calculate optimal dimensions for game cards (landscape format preferred)
                    let { width, height } = img;
                    const targetAspectRatio = 16 / 9; // Perfect for game cards
                    const maxWidth = 800;
                    const maxHeight = 450;
                    
                    // Resize to fit within max dimensions while maintaining aspect ratio
                    if (width > maxWidth || height > maxHeight) {
                        const scale = Math.min(maxWidth / width, maxHeight / height);
                        width = Math.round(width * scale);
                        height = Math.round(height * scale);
                    }
                    
                    // Only adjust aspect ratio for extreme cases to avoid cropping content
                    const currentRatio = width / height;
                    if (Math.abs(currentRatio - targetAspectRatio) > 1.0) {
                        // Only adjust for very extreme aspect ratios
                        if (currentRatio > targetAspectRatio * 2.5) {
                            // Extremely wide - gentle crop
                            height = Math.round(width / (targetAspectRatio * 1.2));
                        } else if (currentRatio < targetAspectRatio / 2.5) {
                            // Extremely tall - gentle crop  
                            width = Math.round(height * (targetAspectRatio * 0.8));
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    this.updateUploadProgress(50);
                    
                    // Draw and compress image
                    ctx.fillStyle = '#ffffff'; // White background for transparency
                    ctx.fillRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    this.updateUploadProgress(70);
                    
                    // Try different quality levels until we get under Firebase limit
                    const targetSize = 850000; // 850KB target (safe margin for Firebase)
                    let quality = 0.9;
                    let base64Result;
                    let attempts = 0;
                    
                    do {
                        base64Result = canvas.toDataURL('image/jpeg', quality);
                        
                        if (base64Result.length <= targetSize) {
                            break; // Success!
                        }
                        
                        quality -= 0.1;
                        attempts++;
                        
                        if (attempts >= 8) {
                            // If still too large after 8 attempts, try smaller dimensions
                            width *= 0.8;
                            height *= 0.8;
                            canvas.width = width;
                            canvas.height = height;
                            ctx.fillStyle = '#ffffff';
                            ctx.fillRect(0, 0, width, height);
                            ctx.drawImage(img, 0, 0, width, height);
                            quality = 0.9;
                            attempts = 0;
                        }
                        
                    } while (attempts < 8 && base64Result.length > targetSize);
                    
                    this.updateUploadProgress(90);
                    
                    const finalSizeMB = (base64Result.length / (1024 * 1024)).toFixed(2);
                    const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                    
                    console.log(`✅ Image optimized: ${originalSizeMB}MB → ${finalSizeMB}MB (${Math.round((1 - base64Result.length / (file.size * 1.33)) * 100)}% smaller)`);
                    
                    this.updateUploadProgress(100);
                    this.showSuccess(`📸 Image optimized! ${originalSizeMB}MB → ${finalSizeMB}MB`);
                    
                    resolve(base64Result);
                    
                } catch (error) {
                    console.error('❌ Image processing failed:', error);
                    this.hideUploadProgress();
                    this.showError('❌ Failed to process image. Please try a different image.');
                    reject(error);
                }
            };
            
            img.onerror = () => {
                console.error('❌ Failed to load image');
                this.hideUploadProgress();
                this.showError('❌ Invalid image file. Please choose a valid image (PNG, JPG, GIF, WebP).');
                reject(new Error('Failed to load image'));
            };
            
            // Load the image
            this.updateUploadProgress(20);
            img.src = URL.createObjectURL(file);
        });
    }

    updateUploadProgress(progress) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        if (progressText) {
            progressText.textContent = `Uploading... ${Math.round(progress)}%`;
        }
    }

    showUploadProgress() {
        const dropzoneContent = document.querySelector('.dropzone-content');
        const uploadProgress = document.getElementById('uploadProgress');
        
        if (dropzoneContent) dropzoneContent.style.display = 'none';
        if (uploadProgress) uploadProgress.style.display = 'block';
        
        this.updateUploadProgress(0);
    }

    hideUploadProgress() {
        const dropzoneContent = document.querySelector('.dropzone-content');
        const uploadProgress = document.getElementById('uploadProgress');
        
        if (dropzoneContent) dropzoneContent.style.display = 'block';
        if (uploadProgress) uploadProgress.style.display = 'none';
    }

    showUploadSuccess(filename, imageUrl) {
        const dropzoneContent = document.querySelector('.dropzone-content');
        const uploadProgress = document.getElementById('uploadProgress');
        const uploadPreview = document.getElementById('uploadPreview');
        const previewImage = document.getElementById('previewImage');
        const previewName = document.getElementById('previewName');
        
        // Hide other states
        if (dropzoneContent) dropzoneContent.style.display = 'none';
        if (uploadProgress) uploadProgress.style.display = 'none';
        
        // Show preview
        if (uploadPreview) uploadPreview.style.display = 'flex';
        if (previewImage) previewImage.src = imageUrl;
        if (previewName) previewName.textContent = filename;
        
        // Show success notification
        this.showSuccess('Image uploaded successfully!');
    }

    updateFormWithImageUrl(imageUrl) {
        // Update the hidden URL input in the URL method
        const urlInput = document.getElementById('gameImageUrl');
        if (urlInput) {
            urlInput.value = imageUrl;
        }
        
        // Store for form submission
        this.currentUploadedImageUrl = imageUrl;
    }

    previewUrlImage(url) {
        const urlPreview = document.getElementById('urlPreview');
        const urlPreviewImage = document.getElementById('urlPreviewImage');
        
        if (!url || !this.isValidImageUrl(url)) {
            if (urlPreview) urlPreview.style.display = 'none';
            return;
        }
        
        if (urlPreviewImage) {
            urlPreviewImage.src = url;
            urlPreviewImage.onload = () => {
                if (urlPreview) urlPreview.style.display = 'block';
            };
            urlPreviewImage.onerror = () => {
                if (urlPreview) urlPreview.style.display = 'none';
            };
        }
    }

    isValidImageUrl(url) {
        try {
            new URL(url);
            return /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url);
        } catch {
            return false;
        }
    }

    showError(message) {
        if (window.dumbassGame?.notificationManager) {
            window.dumbassGame.notificationManager.showError(message);
        } else {
            alert('Error: ' + message);
        }
    }

    showSuccess(message) {
        if (window.dumbassGame?.notificationManager) {
            window.dumbassGame.notificationManager.showSuccess(message);
        } else {
            console.log('Success: ' + message);
        }
    }

    showWarning(message) {
        if (window.dumbassGame?.notificationManager) {
            window.dumbassGame.notificationManager.showWarning(message);
        } else {
            console.warn('Warning: ' + message);
        }
    }

    getCurrentImageUrl() {
        // Return the uploaded image URL or the URL input value
        const urlInput = document.getElementById('gameImageUrl');
        return this.currentUploadedImageUrl || (urlInput ? urlInput.value : '');
    }

    // Avatar-specific compression (optimized for profile pictures)
    async compressImageForAvatar(file) {
        console.log('📸 Processing avatar image...');
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                try {
                    // Create canvas for avatar processing
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Avatar-specific dimensions (square, optimized for circles)
                    const targetSize = 200; // 200x200 perfect for avatars
                    canvas.width = targetSize;
                    canvas.height = targetSize;
                    
                    // Calculate crop dimensions for square aspect ratio
                    const { width, height } = img;
                    const minDimension = Math.min(width, height);
                    const startX = (width - minDimension) / 2;
                    const startY = (height - minDimension) / 2;
                    
                    // Draw square cropped image
                    ctx.drawImage(
                        img, 
                        startX, startY, minDimension, minDimension,  // Source crop
                        0, 0, targetSize, targetSize                 // Destination
                    );
                    
                    // Compress with quality optimization for avatars
                    let quality = 0.9;
                    let base64Result;
                    let attempts = 0;
                    const maxAttempts = 5;
                    const maxSize = 900000; // 900KB for avatars (Firebase safe)
                    
                    do {
                        base64Result = canvas.toDataURL('image/jpeg', quality);
                        
                        if (base64Result.length <= maxSize) {
                            console.log(`✅ Avatar compressed: ${(file.size / 1024).toFixed(1)}KB → ${(base64Result.length / 1024).toFixed(1)}KB`);
                            resolve(base64Result);
                            return;
                        }
                        
                        quality -= 0.1;
                        attempts++;
                        
                    } while (attempts < maxAttempts && quality > 0.3);
                    
                    // If still too large, reduce dimensions
                    if (base64Result.length > maxSize) {
                        const smallerSize = 150;
                        canvas.width = smallerSize;
                        canvas.height = smallerSize;
                        
                        ctx.clearRect(0, 0, smallerSize, smallerSize);
                        ctx.drawImage(
                            img,
                            startX, startY, minDimension, minDimension,
                            0, 0, smallerSize, smallerSize
                        );
                        
                        base64Result = canvas.toDataURL('image/jpeg', 0.8);
                        console.log(`✅ Avatar compressed (reduced size): ${(base64Result.length / 1024).toFixed(1)}KB`);
                    }
                    
                    resolve(base64Result);
                    
                } catch (error) {
                    reject(new Error('Failed to process avatar image: ' + error.message));
                }
            };
            
            img.onerror = () => {
                reject(new Error('Failed to load avatar image'));
            };
            
            img.src = URL.createObjectURL(file);
        });
    }

    reset() {
        // Reset all upload states
        this.currentUploadedImageUrl = null;
        
        const dropzoneContent = document.querySelector('.dropzone-content');
        const uploadProgress = document.getElementById('uploadProgress');
        const uploadPreview = document.getElementById('uploadPreview');
        const urlPreview = document.getElementById('urlPreview');
        const urlInput = document.getElementById('gameImageUrl');
        const fileInput = document.getElementById('imageFileInput');
        
        if (dropzoneContent) dropzoneContent.style.display = 'block';
        if (uploadProgress) uploadProgress.style.display = 'none';
        if (uploadPreview) uploadPreview.style.display = 'none';
        if (urlPreview) urlPreview.style.display = 'none';
        if (urlInput) urlInput.value = '';
        if (fileInput) fileInput.value = '';
    }
}

// Global functions for the upload interface
function switchUploadMethod(method) {
    const fileMethod = document.getElementById('fileUploadMethod');
    const urlMethod = document.getElementById('urlUploadMethod');
    const fileToggle = document.querySelector('[onclick="switchUploadMethod(\'file\')"]');
    const urlToggle = document.querySelector('[onclick="switchUploadMethod(\'url\')"]');
    
    if (method === 'file') {
        if (fileMethod) fileMethod.style.display = 'block';
        if (urlMethod) urlMethod.style.display = 'none';
        if (fileToggle) fileToggle.classList.add('active');
        if (urlToggle) urlToggle.classList.remove('active');
        
        // Show warning about file limitations
        if (window.dumbassGame?.notificationManager) {
            window.dumbassGame.notificationManager.showWarning('⚠️ File uploads are limited to small images (<500KB). Direct URLs work much better!');
        }
    } else {
        if (fileMethod) fileMethod.style.display = 'none';
        if (urlMethod) urlMethod.style.display = 'block';
        if (fileToggle) fileToggle.classList.remove('active');
        if (urlToggle) urlToggle.classList.add('active');
    }
}

function removeImagePreview() {
    if (window.imageUploadManager) {
        window.imageUploadManager.reset();
    }
}

// Initialize the image upload manager
window.imageUploadManager = new ImageUploadManager();

// 💩 TURD RATING SYSTEM 💩
class TurdRatingManager {
    constructor() {
        this.userRatings = new Map(); // Store user's individual ratings
        this.gameRatings = new Map(); // Store average ratings per game
        this.initializeRatingSystem();
    }

    initializeRatingSystem() {
        console.log('💩 Initializing Turd Rating System...');
        this.loadUserRatings();
        this.setupRatingStyles();
    }

    async loadUserRatings() {
        try {
            if (window.firebaseAuth?.currentUser && window.persistenceManager) {
                const ratings = await window.persistenceManager.load('userRatings', { 
                    defaultValue: {}, 
                    userSpecific: true 
                });
                
                if (ratings) {
                    Object.entries(ratings).forEach(([gameId, rating]) => {
                        this.userRatings.set(gameId, rating);
                    });
                    console.log(`💩 Loaded ${this.userRatings.size} user ratings`);
                }
            }
        } catch (error) {
            console.warn('💩 Failed to load user ratings:', error);
        }
    }

    async saveUserRatings() {
        try {
            if (window.firebaseAuth?.currentUser && window.persistenceManager) {
                const ratingsObj = Object.fromEntries(this.userRatings);
                await window.persistenceManager.save('userRatings', ratingsObj, { 
                    userSpecific: true,
                    silent: true 
                });
            }
        } catch (error) {
            console.warn('💩 Failed to save user ratings:', error);
        }
    }

    setupRatingStyles() {
        // Inject CSS for turd ratings if not already present
        if (!document.getElementById('turd-rating-styles')) {
            const style = document.createElement('style');
            style.id = 'turd-rating-styles';
            style.textContent = `
                .turd-rating-container {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    margin: 0;
                    max-width: none;
                }

                .turd-rating-stars {
                    display: flex;
                    gap: 1px;
                    align-items: center;
                }

                .turd-star {
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    user-select: none;
                    filter: grayscale(100%);
                    opacity: 0.3;
                }

                .turd-star:hover {
                    transform: scale(1.2);
                    filter: grayscale(0%);
                    opacity: 1;
                }

                .turd-star.active {
                    filter: grayscale(0%);
                    opacity: 1;
                    animation: turd-glow 2s infinite alternate;
                }

                .turd-star.user-rated {
                    /* No special styling - just keep it clean */
                }

                @keyframes turd-glow {
                    0% { text-shadow: 0 0 5px #8B4513; }
                    100% { text-shadow: 0 0 15px #D2691E, 0 0 25px #8B4513; }
                }

                .turd-rating-info {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 9px;
                    color: var(--primary-color);
                    font-family: 'Courier New', monospace;
                    line-height: 1;
                }

                .turd-average {
                    font-weight: bold;
                    color: #FFD700;
                    text-shadow: 0 0 3px rgba(255, 215, 0, 0.5);
                    font-size: 9px;
                }

                .turd-label {
                    font-size: 8px;
                    color: #aaa;
                    font-style: italic;
                    white-space: nowrap;
                }

                .turd-count {
                    display: none;
                }

                .game-card .turd-rating-container {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    background: var(--primary-alpha-2);
                    padding: 2px 6px;
                    border-radius: 3px;
                    border: 1px solid var(--primary-alpha-3);
                    margin: 4px 0;
                    width: fit-content;
                }

                .game-card:hover .turd-rating-container {
                    background: rgba(0, 0, 0, 0.9);
                    border-color: var(--primary-alpha-5);
                }

                .rating-modal {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: var(--bg-darker);
                    border: 2px solid var(--primary-color);
                    border-radius: 12px;
                    padding: 20px;
                    z-index: 10000;
                    box-shadow: 0 0 30px var(--primary-alpha-4);
                    max-width: 400px;
                    text-align: center;
                }

                .rating-modal h4 {
                    color: var(--primary-color);
                    margin-bottom: 15px;
                    font-size: 14px;
                }

                .rating-modal .turd-star {
                    font-size: 24px;
                    margin: 0 4px;
                }

                .rating-feedback {
                    margin: 10px 0;
                    font-size: 12px;
                    color: var(--secondary-color);
                    font-family: 'Courier New', monospace;
                }

                .rating-buttons {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    margin-top: 15px;
                }

                .rating-btn {
                    background: var(--primary-alpha-3);
                    color: var(--primary-color);
                    border: 1px solid var(--primary-color);
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-family: 'Press Start 2P', cursive;
                    font-size: 8px;
                    transition: all 0.3s ease;
                }

                .rating-btn:hover {
                    background: var(--primary-alpha-5);
                    transform: translateY(-2px);
                }

                .rating-btn.cancel {
                    background: rgba(255, 0, 0, 0.2);
                    border-color: #ff6666;
                    color: #ff6666;
                }

                .rating-btn.cancel:hover {
                    background: rgba(255, 0, 0, 0.4);
                }
            `;
            document.head.appendChild(style);
        }
    }

    getTurdLabel(rating) {
        const labels = {
            1: 'SHIT',
            2: 'MEH', 
            3: 'OK',
            4: 'GOOD',
            5: 'HOLY!'
        };
        return labels[Math.round(rating)] || 'NEW';
    }

    getFullTurdLabel(rating) {
        const labels = {
            1: 'ABSOLUTE SHIT',
            2: 'PRETTY SHITTY', 
            3: 'DECENT TURD',
            4: 'GOOD SHIT',
            5: 'HOLY SHIT!'
        };
        return labels[Math.round(rating)] || 'UNRATED SHIT';
    }

    createTurdRating(game, interactive = true) {
        const container = document.createElement('div');
        container.className = 'turd-rating-container';
        container.dataset.gameId = game.id;

        const starsContainer = document.createElement('div');
        starsContainer.className = 'turd-rating-stars';

        const userRating = this.userRatings.get(game.id) || 0;
        const averageRating = game.rating || 0;
        const ratingCount = game.ratingCount || 0;

        // Create 5 turd stars
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.className = 'turd-star';
            star.textContent = '💩';
            star.dataset.rating = i;
            star.dataset.gameId = game.id;

            // Show user's rating with special styling
            if (userRating >= i) {
                star.classList.add('active', 'user-rated');
            }
            // Show average rating for non-user-rated stars
            else if (averageRating >= i) {
                star.classList.add('active');
                star.style.opacity = '0.6';
            }

            if (interactive) {
                star.addEventListener('click', (e) => this.handleTurdClick(e));
                star.addEventListener('mouseenter', (e) => this.handleTurdHover(e));
                star.addEventListener('mouseleave', (e) => this.handleTurdLeave(e));
            }

            starsContainer.appendChild(star);
        }

        const infoContainer = document.createElement('div');
        infoContainer.className = 'turd-rating-info';

        if (averageRating > 0) {
            const avgDisplay = document.createElement('div');
            avgDisplay.className = 'turd-average';
            avgDisplay.textContent = `${averageRating.toFixed(1)} 💩`;
            infoContainer.appendChild(avgDisplay);

            const labelDisplay = document.createElement('div');
            labelDisplay.className = 'turd-label';
            labelDisplay.textContent = this.getTurdLabel(averageRating);
            infoContainer.appendChild(labelDisplay);

            if (ratingCount > 0) {
                const countDisplay = document.createElement('div');
                countDisplay.className = 'turd-count';
                countDisplay.textContent = `${ratingCount} rating${ratingCount !== 1 ? 's' : ''}`;
                infoContainer.appendChild(countDisplay);
            }
        } else {
            const noRating = document.createElement('div');
            noRating.className = 'turd-label';
            noRating.textContent = 'NO RATINGS YET';
            infoContainer.appendChild(noRating);
        }

        container.appendChild(starsContainer);
        container.appendChild(infoContainer);

        return container;
    }

    handleTurdHover(e) {
        if (!window.firebaseAuth?.currentUser) return;

        const star = e.target;
        const rating = parseInt(star.dataset.rating);
        const gameId = star.dataset.gameId;
        const container = star.closest('.turd-rating-stars');
        
        // Highlight stars up to hovered one
        container.querySelectorAll('.turd-star').forEach((s, index) => {
            if (index < rating) {
                s.style.opacity = '1';
                s.style.filter = 'grayscale(0%)';
                s.style.transform = 'scale(1.1)';
            } else {
                s.style.opacity = '0.3';
                s.style.filter = 'grayscale(100%)';
                s.style.transform = 'scale(1)';
            }
        });

        // Show rating preview with full labels
        const fullLabels = {
            1: 'ABSOLUTE SHIT',
            2: 'PRETTY SHITTY', 
            3: 'DECENT TURD',
            4: 'GOOD SHIT',
            5: 'HOLY SHIT!'
        };
        star.title = `Rate this ${fullLabels[rating]} (${rating} turd${rating !== 1 ? 's' : ''})`;
    }

    handleTurdLeave(e) {
        const star = e.target;
        const gameId = star.dataset.gameId;
        const container = star.closest('.turd-rating-stars');
        const userRating = this.userRatings.get(gameId) || 0;
        
        // Reset to user's actual rating or average
        this.updateTurdDisplay(container, gameId, userRating);
    }

    handleTurdClick(e) {
        if (!window.firebaseAuth?.currentUser) {
            this.showLoginPrompt();
            return;
        }

        const star = e.target;
        const rating = parseInt(star.dataset.rating);
        const gameId = star.dataset.gameId;
        
        this.showRatingModal(gameId, rating);
    }

    showLoginPrompt() {
        if (window.dumbassGame?.notificationManager) {
            window.dumbassGame.notificationManager.showWarning('💩 Login required to rate games! Create an account to share your shitty opinions.');
        }
        
        setTimeout(() => {
            if (window.showAuthModal) {
                window.showAuthModal();
            }
        }, 1000);
    }

    showRatingModal(gameId, proposedRating) {
        const game = window.enhancedGameManager?.games.find(g => g.id === gameId);
        if (!game) return;

        const modal = document.createElement('div');
        modal.className = 'rating-modal';
        modal.innerHTML = `
            <h4>💩 RATE "${game.title.toUpperCase()}"</h4>
            <div class="turd-rating-stars" id="modalStars">
                ${Array.from({length: 5}, (_, i) => 
                    `<span class="turd-star ${i < proposedRating ? 'active' : ''}" 
                           data-rating="${i + 1}">💩</span>`
                ).join('')}
            </div>
            <div class="rating-feedback" id="ratingFeedback">
                ${this.getFullTurdLabel(proposedRating)} (${proposedRating} turd${proposedRating !== 1 ? 's' : ''})
            </div>
            <div class="rating-buttons">
                <button class="rating-btn" onclick="window.turdRatingManager.submitRating('${gameId}', ${proposedRating}); this.closest('.rating-modal').remove();">
                    💩 SUBMIT RATING
                </button>
                <button class="rating-btn cancel" onclick="this.closest('.rating-modal').remove();">
                    ❌ CANCEL
                </button>
            </div>
        `;

        // Add click handlers for modal stars
        modal.querySelectorAll('.turd-star').forEach(star => {
            star.addEventListener('click', (e) => {
                const newRating = parseInt(e.target.dataset.rating);
                
                // Update modal display
                modal.querySelectorAll('.turd-star').forEach((s, index) => {
                    s.classList.toggle('active', index < newRating);
                });
                
                modal.querySelector('#ratingFeedback').textContent = 
                    `${this.getFullTurdLabel(newRating)} (${newRating} turd${newRating !== 1 ? 's' : ''})`;
                
                // Update submit button
                const submitBtn = modal.querySelector('.rating-btn:not(.cancel)');
                submitBtn.onclick = () => {
                    this.submitRating(gameId, newRating);
                    modal.remove();
                };
            });
        });

        document.body.appendChild(modal);

        // Play sound effect
        if (window.dumbassGame?.soundSystem) {
            window.dumbassGame.soundSystem.playClick();
        }
    }

    async submitRating(gameId, rating) {
        try {
            const previousRating = this.userRatings.get(gameId);
            
            // Store user's rating
            this.userRatings.set(gameId, rating);
            await this.saveUserRatings();

            // Update game's average rating
            await this.updateGameRating(gameId, rating, previousRating);

            // Update UI
            this.updateAllRatingDisplays(gameId);

            // Show success message
            if (window.dumbassGame?.notificationManager) {
                window.dumbassGame.notificationManager.showSuccess(
                    `💩 Rated "${this.getGameTitle(gameId)}" as ${this.getFullTurdLabel(rating)}!`
                );
            }

            // Play success sound
            if (window.dumbassGame?.soundSystem) {
                window.dumbassGame.soundSystem.playSuccess();
            }

        } catch (error) {
            console.error('💩 Failed to submit rating:', error);
            if (window.dumbassGame?.notificationManager) {
                window.dumbassGame.notificationManager.showError('💩 Failed to save rating. Try again!');
            }
        }
    }

    async updateGameRating(gameId, newRating, previousRating = null) {
        try {
            // Get current game data
            const game = window.enhancedGameManager?.games.find(g => g.id === gameId);
            if (!game) return;

            let currentTotal = (game.rating || 0) * (game.ratingCount || 0);
            let currentCount = game.ratingCount || 0;

            // Remove previous rating if it exists
            if (previousRating !== null && previousRating !== undefined) {
                currentTotal -= previousRating;
                currentCount = Math.max(0, currentCount - 1);
            }

            // Add new rating
            currentTotal += newRating;
            currentCount += 1;

            // Calculate new average
            const newAverage = currentCount > 0 ? currentTotal / currentCount : 0;

            // Update game object
            game.rating = newAverage;
            game.ratingCount = currentCount;

            // Save to Firebase if available
            if (window.dataManager?.isInitialized) {
                await window.dataManager.updateGame(gameId, {
                    rating: newAverage,
                    ratingCount: currentCount
                });
            }

        } catch (error) {
            console.error('💩 Failed to update game rating:', error);
            throw error;
        }
    }

    updateTurdDisplay(container, gameId, userRating) {
        const game = window.enhancedGameManager?.games.find(g => g.id === gameId);
        if (!game) return;

        const averageRating = game.rating || 0;

        container.querySelectorAll('.turd-star').forEach((star, index) => {
            const starRating = index + 1;
            
            star.classList.remove('active', 'user-rated');
            star.style.opacity = '0.3';
            star.style.filter = 'grayscale(100%)';
            star.style.transform = 'scale(1)';

            if (userRating >= starRating) {
                star.classList.add('active', 'user-rated');
                star.style.opacity = '1';
                star.style.filter = 'grayscale(0%)';
            } else if (averageRating >= starRating) {
                star.classList.add('active');
                star.style.opacity = '0.6';
                star.style.filter = 'grayscale(0%)';
            }
        });
    }

    updateAllRatingDisplays(gameId) {
        // Update all rating displays for this game
        document.querySelectorAll(`[data-game-id="${gameId}"]`).forEach(container => {
            if (container.classList.contains('turd-rating-container')) {
                const userRating = this.userRatings.get(gameId) || 0;
                const starsContainer = container.querySelector('.turd-rating-stars');
                if (starsContainer) {
                    this.updateTurdDisplay(starsContainer, gameId, userRating);
                }

                // Update info display
                const infoContainer = container.querySelector('.turd-rating-info');
                if (infoContainer) {
                    const game = window.enhancedGameManager?.games.find(g => g.id === gameId);
                    if (game) {
                        infoContainer.innerHTML = '';
                        
                        if (game.rating > 0) {
                            const avgDisplay = document.createElement('div');
                            avgDisplay.className = 'turd-average';
                            avgDisplay.textContent = `${game.rating.toFixed(1)} 💩`;
                            infoContainer.appendChild(avgDisplay);

                            const labelDisplay = document.createElement('div');
                            labelDisplay.className = 'turd-label';
                            labelDisplay.textContent = this.getTurdLabel(game.rating);
                            infoContainer.appendChild(labelDisplay);

                            if (game.ratingCount > 0) {
                                const countDisplay = document.createElement('div');
                                countDisplay.className = 'turd-count';
                                countDisplay.textContent = `${game.ratingCount} rating${game.ratingCount !== 1 ? 's' : ''}`;
                                infoContainer.appendChild(countDisplay);
                            }
                        }
                    }
                }
            }
        });

        // Trigger re-render if needed
        if (window.enhancedGameManager) {
            window.enhancedGameManager.renderGames();
        }
    }

    getGameTitle(gameId) {
        const game = window.enhancedGameManager?.games.find(g => g.id === gameId);
        return game ? game.title : 'Unknown Game';
    }

    // Add rating to existing game cards
    addRatingToGameCard(gameCard, game) {
        // Remove existing rating if present
        const existingRating = gameCard.querySelector('.turd-rating-container');
        if (existingRating) {
            existingRating.remove();
        }

        const ratingComponent = this.createTurdRating(game, true);
        
        // Find the game-info section and add rating there
        const gameInfo = gameCard.querySelector('.game-info') || 
                        gameCard.querySelector('.game-title')?.parentElement ||
                        gameCard.querySelector('.game-description')?.parentElement;
        
        if (gameInfo) {
            // Insert after game title but before description
            const gameTitle = gameInfo.querySelector('.game-title');
            const gameDescription = gameInfo.querySelector('.game-description');
            
            if (gameTitle && gameDescription) {
                gameInfo.insertBefore(ratingComponent, gameDescription);
            } else {
                gameInfo.appendChild(ratingComponent);
            }
        } else {
            // Fallback: append to the card
            gameCard.appendChild(ratingComponent);
        }
    }

    // Bulk update all game cards with ratings
    updateAllGameCards() {
        if (!window.enhancedGameManager?.games) return;

        window.enhancedGameManager.games.forEach(game => {
            const gameCard = document.querySelector(`[data-id="${game.id}"]`);
            if (gameCard) {
                this.addRatingToGameCard(gameCard, game);
            }
        });
    }
}

// Initialize the turd rating manager
window.turdRatingManager = new TurdRatingManager();

// Integrate with existing form submission
document.addEventListener('DOMContentLoaded', () => {
    const addGameForm = document.getElementById('addGameForm');
    if (addGameForm) {
        // Override the existing form submission to include image URL
        const originalSubmitHandler = addGameForm.onsubmit;
        
        addGameForm.onsubmit = function(e) {
            // Get the current image URL from upload manager
            const imageUrl = window.imageUploadManager?.getCurrentImageUrl();
            
            // Update the gameImage field if we have an uploaded image
            if (imageUrl) {
                const gameImageInput = addGameForm.querySelector('[name="gameImage"]') || 
                                     document.getElementById('gameImageUrl');
                if (gameImageInput) {
                    gameImageInput.value = imageUrl;
                }
            }
            
            // Call original handler if it exists
            if (originalSubmitHandler) {
                return originalSubmitHandler.call(this, e);
            }
            
            // Otherwise let the form submit normally
            return true;
        };
    }
    
    // Initialize turd rating manager after everything is ready
    if (window.turdRatingManager) {
        setTimeout(() => {
            window.turdRatingManager.updateAllGameCards();
        }, 500);
    }
});

// =============================
//    UPGRADE SYSTEM FUNCTIONS
// =============================

// Global tier debugging functions (available immediately)
window.checkTier = function() {
    const userProfile = window.userProfileManager?.userProfile;
    if (!userProfile) {
        console.log('❌ No user profile found - please sign in');
        return 'No user profile';
    }
    
    console.group('💎 TIER STATUS');
    console.log('Email:', userProfile.email);
    console.log('Tier:', userProfile.tier || 'NOT SET');
    console.log('Submission Count:', userProfile.submissionCount);
    console.log('Needs Migration:', !userProfile.tier || !userProfile.submissionCount);
    console.groupEnd();
    
    return userProfile.tier || 'NOT SET';
};

window.forceMigration = function() {
    const userProfileManager = window.userProfileManager;
    if (!userProfileManager?.userProfile) {
        console.log('❌ No user profile found');
        return 'No user profile';
    }
    
    console.log('🔄 Forcing tier migration...');
    userProfileManager.loadUserProfile().then(() => {
        userProfileManager.updateTierDisplay();
        console.log('✅ Migration complete');
    });
    
    return 'Migration started';
};

window.forceUpgradeButton = function() {
    const tierUpgrade = document.getElementById('tierUpgrade');
    if (tierUpgrade) {
        tierUpgrade.style.display = 'block';
        console.log('✅ Forced upgrade button to show');
        return 'Button shown';
    } else {
        console.log('❌ Upgrade button element not found');
        return 'Element not found';
    }
};

function showUpgradeModal() {
    const modal = document.getElementById('upgradeModal');
    if (modal) {
        modal.style.display = 'block';
        console.log('💎 Upgrade modal opened');
    }
}

function hideUpgradeModal() {
    const modal = document.getElementById('upgradeModal');
    if (modal) {
        modal.style.display = 'none';
        console.log('💎 Upgrade modal closed');
    }
}

async function initiateUpgrade(tier, priceInDollars) {
    if (!window.userProfileManager?.paymentManager) {
        console.error('❌ Payment manager not initialized');
        return;
    }
    
    await window.userProfileManager.paymentManager.initiateUpgrade(tier, priceInDollars);
}

async function cancelSubscription() {
    if (!window.userProfileManager?.paymentManager) {
        console.error('❌ Payment manager not initialized');
        return;
    }
    
    const confirmed = confirm('Are you sure you want to cancel your subscription? You\'ll keep your current tier until the end of your billing period.');
    if (confirmed) {
        const success = await window.userProfileManager.paymentManager.cancelSubscription();
        if (success) {
            // Refresh profile display
            if (window.userProfileManager) {
                await window.userProfileManager.loadUserData();
                window.userProfileManager.updateProfileUI();
            }
        }
    }
}

// Modal click-outside-to-close for upgrade modal
document.addEventListener('DOMContentLoaded', function() {
    const upgradeModal = document.getElementById('upgradeModal');
    if (upgradeModal) {
        upgradeModal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideUpgradeModal();
            }
        });
    }
});

// Test functions for upgrade prompts (for debugging)
function testSubmissionLimit() {
    console.log('🧪 Testing submission limit modal...');
    if (window.dumbassGame) {
        const mockLimitCheck = {
            allowed: false,
            reason: 'Monthly limit reached (2). Next submission: January 1, 2025'
        };
        
        const currentTier = { name: 'FREE', displayName: 'Free Player', badge: '🕹️' };
        const recommendedTier = { name: 'PRO', displayName: 'Pro Gamer', badge: '⭐', price: 5, limits: { submissionsPerMonth: 8, favorites: 100 } };
        
        window.dumbassGame.showSubmissionLimitModal(currentTier, recommendedTier, mockLimitCheck);
    }
}

function testFavoritesLimit() {
    console.log('🧪 Testing favorites limit modal...');
    if (window.userProfileManager) {
        const mockLimitCheck = {
            allowed: false,
            reason: 'Favorites limit reached (15). Upgrade to add more!',
            limit: 15
        };
        
        window.userProfileManager.showFavoritesLimitModal(mockLimitCheck);
    }
}

// Add global test functions
window.testSubmissionLimit = testSubmissionLimit;
window.testFavoritesLimit = testFavoritesLimit;

// Debug functions for checking tier submission state
function debugTierSubmissions() {
    console.log('🔍 DEBUGGING TIER SUBMISSIONS');
    
    const userProfile = window.userProfileManager?.userProfile;
    if (!userProfile) {
        console.log('❌ No user profile found');
        return;
    }
    
    console.log('👤 User Profile:', {
        email: userProfile.email,
        tier: userProfile.tier,
        submissionCount: userProfile.submissionCount,
        lastSubmission: userProfile.lastSubmission
    });
    
    // Check submissions
    const userSubmissions = window.userProfileManager?.userSubmissions || [];
    console.log('📊 User Submissions:', userSubmissions.length, 'games');
    userSubmissions.forEach((game, index) => {
        console.log(`  ${index + 1}. ${game.title} (${game.dateAdded})`);
    });
    
    // Check tier limits
    const tierManager = window.userProfileManager?.tierManager;
    if (tierManager) {
        const tierInfo = tierManager.getTierInfo(userProfile.tier);
        console.log('🎯 Current Tier Limits:', tierInfo.limits);
        
        // Test submission limit check
        tierManager.checkSubmissionLimits(userProfile).then(result => {
            console.log('⏰ Submission Limit Check:', result);
        });
    }
}

async function fixSubmissionCounting() {
    console.log('🔧 FIXING SUBMISSION COUNTING');
    
    const userProfile = window.userProfileManager?.userProfile;
    if (!userProfile) {
        console.log('❌ No user profile found');
        return;
    }
    
    // Count actual submissions by this user
    const userSubmissions = window.userProfileManager?.userSubmissions || [];
    const submissionsThisMonth = userSubmissions.filter(game => {
        const gameDate = new Date(game.dateAdded);
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return gameDate >= monthStart;
    });
    
    console.log(`📊 Found ${submissionsThisMonth.length} submissions this month`);
    
    // Fix the submission count in profile
    if (!userProfile.submissionCount) {
        userProfile.submissionCount = { daily: 0, weekly: 0, monthly: 0 };
    }
    
    // Set the monthly count to actual submissions this month
    userProfile.submissionCount.monthly = submissionsThisMonth.length;
    userProfile.lastSubmission = submissionsThisMonth.length > 0 ? 
        submissionsThisMonth[submissionsThisMonth.length - 1].dateAdded : null;
    
    // Save the fixed profile
    if (window.persistenceManager) {
        await window.persistenceManager.saveUserProfile(userProfile);
        console.log('✅ Fixed profile saved');
        console.log('📊 Updated submission count:', userProfile.submissionCount);
    }
    
    // Test the limit check now
    const tierManager = window.userProfileManager?.tierManager;
    if (tierManager) {
        const limitCheck = await tierManager.checkSubmissionLimits(userProfile);
        console.log('⏰ New Limit Check Result:', limitCheck);
        
        if (!limitCheck.allowed) {
            console.log('🚫 Limit would be enforced - testing modal...');
            const currentTier = tierManager.getTierInfo(userProfile.tier);
            const recommendedTier = tierManager.getTierInfo('PRO');
            window.dumbassGame?.showSubmissionLimitModal(currentTier, recommendedTier, limitCheck);
        } else {
            console.log('✅ Still within limits');
        }
    }
}

// Quick fix function
function quickFixTiers() {
    console.log('⚡ QUICK FIX: Resetting submission counts for testing');
    
    const userProfile = window.userProfileManager?.userProfile;
    if (!userProfile) {
        console.log('❌ No user profile found');
        return;
    }
    
    // Reset submission counts
    userProfile.submissionCount = { daily: 0, weekly: 0, monthly: 0 };
    userProfile.lastSubmission = null;
    
    console.log('🔧 Reset submission counts to:', userProfile.submissionCount);
    
    // Save the updated profile
    if (window.persistenceManager) {
        window.persistenceManager.saveUserProfile(userProfile).then(() => {
            console.log('💾 Profile saved with reset counts');
            console.log('✅ You should now be able to submit games!');
            console.log('🎮 Try clicking ADD GAME button now!');
        });
    }
}

// Add a function to test the new submission system
async function testNewSubmissionSystem() {
    console.log('🧪 TESTING NEW SUBMISSION SYSTEM');
    
    const userProfile = window.userProfileManager?.userProfile;
    const tierManager = window.userProfileManager?.tierManager;
    
    if (!userProfile || !tierManager) {
        console.log('❌ User profile or tier manager not found');
        return;
    }
    
    console.log('👤 User Profile:', {
        email: userProfile.email,
        tier: userProfile.tier,
        submissionCount: userProfile.submissionCount,
        lastSubmission: userProfile.lastSubmission
    });
    
    // Test the new canSubmitGame function
    const canSubmit = await tierManager.canSubmitGame(userProfile);
    console.log('🎯 Can Submit Result:', canSubmit);
    
    if (canSubmit.canSubmit) {
        console.log('✅ User CAN submit games!');
    } else {
        console.log('🚫 User CANNOT submit games:', canSubmit.reason);
    }
    
    // Show tier info
    const tierInfo = tierManager.getTierInfo(userProfile.tier);
    console.log('📊 Tier Info:', tierInfo);
    
    return canSubmit;
}

// Test image upload system
function testImageUpload() {
    console.log('🖼️ Testing image upload system...');
    
    if (window.imageUploadManager) {
        console.log('✅ ImageUploadManager found');
        console.log('🔧 Image upload system ready for Base64 conversion');
        console.log('📝 Try uploading an image through the ADD GAME form');
    } else {
        console.log('❌ ImageUploadManager not found');
    }
}

// Simple reset function for testing
function resetSubmissions() {
    const userProfile = window.userProfileManager?.userProfile;
    if (userProfile) {
        userProfile.submissionCount = { daily: 0, weekly: 0, monthly: 0 };
        window.persistenceManager?.saveUserProfile(userProfile);
        console.log('✅ Submission count reset');
    }
}

// Global access for browser console  
window.resetSubmissions = resetSubmissions;
window.fixAuthButton = fixAuthButton;
window.debugProfile = debugProfile;
window.quickFix = quickFix;
window.fixAvatarDisplay = fixAvatarDisplay;

// Analytics Dashboard Functions (DEV Tier Only)
function showAnalyticsTab() {
    console.log('🔄 Checking user tier for analytics access...');
    
    const userProfile = window.userProfileManager?.userProfile;
    const tierInfo = window.tierManager?.getTierInfo();
    const analyticsTab = document.querySelector('[data-tab="analytics"]');
    
    if (!userProfile || !tierInfo) {
        console.log('❌ No user profile or tier info found');
        return;
    }
    
    // Show analytics tab only for DEV tier
    if (tierInfo.name === 'DEV') {
        if (analyticsTab) {
            analyticsTab.style.display = 'block';
            analyticsTab.classList.add('show');
            console.log('✅ Analytics tab enabled for DEV user');
        }
    } else {
        if (analyticsTab) {
            analyticsTab.style.display = 'none';
            analyticsTab.classList.remove('show');
        }
        console.log(`ℹ️ Analytics tab hidden for ${tierInfo.name} tier user`);
    }
}

async function loadAnalyticsData() {
    console.log('📊 Loading analytics data...');
    
    const userProfile = window.userProfileManager?.userProfile;
    if (!userProfile || !window.firebaseAuth?.currentUser) {
        console.log('❌ No user profile found for analytics');
        return;
    }
    
    try {
        // Personal Stats
        await loadPersonalStats();
        
        // Games Performance 
        await loadGamesPerformance();
        
        // Platform Analytics
        await loadPlatformAnalytics();
        
        console.log('✅ Analytics data loaded successfully');
    } catch (error) {
        console.error('❌ Error loading analytics:', error);
        showAnalyticsError();
    }
}

async function loadPersonalStats() {
    console.log('📊 Loading personal stats...');
    
    try {
        const userProfile = window.userProfileManager?.userProfile;
        const userId = window.firebaseAuth?.currentUser?.uid;
        
        console.log('User profile exists:', !!userProfile);
        console.log('Firebase user exists:', !!userId);
        console.log('Firebase DB available:', !!window.firebaseDb);
        console.log('Firebase collection available:', !!window.firebaseCollection);
        
        if (!userId) {
            console.log('❌ No Firebase user found');
            document.getElementById('totalGamesPlayed').textContent = 'Login Required';
            document.getElementById('totalGamesSubmitted').textContent = 'Login Required';
            document.getElementById('totalFavoritesAdded').textContent = 'Login Required';
            return;
        }

        if (!window.firebaseDb || !window.firebaseCollection) {
            console.log('❌ Firebase database not available');
            document.getElementById('totalGamesPlayed').textContent = 'Database Error';
            document.getElementById('totalGamesSubmitted').textContent = 'Database Error';
            document.getElementById('totalFavoritesAdded').textContent = 'Database Error';
            return;
        }

        // Total games played by user - fix the logic
        let totalPlayed = 0;
        if (userProfile?.gamesPlayed) {
            if (typeof userProfile.gamesPlayed === 'object') {
                // If it's an object of game IDs -> play counts
                totalPlayed = Object.keys(userProfile.gamesPlayed).length;
            } else if (typeof userProfile.gamesPlayed === 'number') {
                // If it's just a simple counter
                totalPlayed = userProfile.gamesPlayed;
            }
        }
        document.getElementById('totalGamesPlayed').textContent = totalPlayed;
        console.log('✅ Games played loaded:', totalPlayed);

        // Games submitted by user - use correct Firebase API
        try {
            const userGamesQuery = window.firebaseQuery(
                window.firebaseCollection, 
                window.firebaseWhere('submittedBy', '==', userId)
            );
            const userGamesSnapshot = await window.firebaseGetDocs(userGamesQuery);
            const totalSubmitted = userGamesSnapshot.size;
            document.getElementById('totalGamesSubmitted').textContent = totalSubmitted;
            console.log('✅ Submitted games loaded:', totalSubmitted);
        } catch (error) {
            console.error('❌ Error fetching submitted games:', error);
            document.getElementById('totalGamesSubmitted').textContent = '0';
        }
        
        // Favorites added
        let totalFavorites = 0;
        if (userProfile?.favorites && Array.isArray(userProfile.favorites)) {
            totalFavorites = userProfile.favorites.length;
        }
        document.getElementById('totalFavoritesAdded').textContent = totalFavorites;
        console.log('✅ Favorites loaded:', totalFavorites);

    } catch (error) {
        console.error('❌ Error loading personal stats:', error);
        document.getElementById('totalGamesPlayed').textContent = 'Error';
        document.getElementById('totalGamesSubmitted').textContent = 'Error';
        document.getElementById('totalFavoritesAdded').textContent = 'Error';
    }
}

async function loadGamesPerformance() {
    console.log('🎮 Loading games performance...');
    
    const userId = window.firebaseAuth?.currentUser?.uid;
    const performanceGrid = document.getElementById('gamesPerformanceGrid');
    
    if (!performanceGrid) {
        console.log('❌ Performance grid element not found');
        return;
    }
    
    if (!userId) {
        console.log('❌ No user ID for games performance');
        performanceGrid.innerHTML = '<div class="no-data-message">Login required to view game performance</div>';
        return;
    }
    
    try {
        // Get games submitted by user
        const userGamesQuery = window.firebaseQuery(
            window.firebaseCollection, 
            window.firebaseWhere('submittedBy', '==', userId)
        );
        console.log('🔍 Querying games for user:', userId);
        const userGamesSnapshot = await window.firebaseGetDocs(userGamesQuery);
        
        console.log('📊 Found', userGamesSnapshot.size, 'games for user');
        
        if (userGamesSnapshot.empty) {
            performanceGrid.innerHTML = '<div class="no-data-message">No games submitted yet. Submit your first game to see analytics!</div>';
            return;
        }
        
        let gamesData = [];
        userGamesSnapshot.forEach(doc => {
            const game = doc.data();
            gamesData.push({
                id: doc.id,
                title: game.title,
                playCount: game.playCount || 0,
                createdAt: game.createdAt || new Date()
            });
        });
        
        // Sort by play count (descending)
        gamesData.sort((a, b) => b.playCount - a.playCount);
        
        // Handle large datasets with pagination
        const GAMES_PER_PAGE = 10;
        const totalGames = gamesData.length;
        let currentPage = 1;
        const maxPages = Math.ceil(totalGames / GAMES_PER_PAGE);
        
        function renderGamesPage(page = 1) {
            const startIndex = (page - 1) * GAMES_PER_PAGE;
            const endIndex = Math.min(startIndex + GAMES_PER_PAGE, totalGames);
            const pageGames = gamesData.slice(startIndex, endIndex);
            
            let html = '';
            
            // Add summary header for large collections
            if (totalGames > GAMES_PER_PAGE) {
                html += `
                    <div class="games-performance-header">
                        <div class="performance-summary">
                            📊 Showing ${startIndex + 1}-${endIndex} of ${totalGames} games
                        </div>
                        <div class="performance-stats">
                            Total Plays: ${gamesData.reduce((sum, game) => sum + game.playCount, 0)}
                        </div>
                    </div>
                `;
            }
            
            // Render current page games
            pageGames.forEach((game, index) => {
                const rank = startIndex + index + 1;
                const isTopPerformer = game.playCount > 0 && rank <= 3;
                
                html += `
                    <div class="performance-game-item ${isTopPerformer ? 'top-performer' : ''}">
                        <div class="game-rank">#${rank}</div>
                        <div class="game-details">
                            <span class="game-name" title="${game.title}">${game.title}</span>
                            <span class="game-plays">${game.playCount} plays</span>
                        </div>
                        ${isTopPerformer ? '<div class="top-badge">🔥</div>' : ''}
                    </div>
                `;
            });
            
            // Add pagination controls for large collections
            if (maxPages > 1) {
                html += `
                    <div class="games-pagination">
                        <button class="pagination-btn" onclick="changeGamesPage(${page - 1})" 
                                ${page <= 1 ? 'disabled' : ''}>
                            ‹ Previous
                        </button>
                        <span class="pagination-info">Page ${page} of ${maxPages}</span>
                        <button class="pagination-btn" onclick="changeGamesPage(${page + 1})" 
                                ${page >= maxPages ? 'disabled' : ''}>
                            Next ›
                        </button>
                    </div>
                `;
            }
            
            performanceGrid.innerHTML = html;
        }
        
        // Store data globally for pagination
        window.analyticsGameData = { gamesData, renderGamesPage, currentPage, maxPages };
        
        // Render first page
        renderGamesPage(1);
        
    } catch (error) {
        console.error('Error loading games performance:', error);
        performanceGrid.innerHTML = '<div class="no-data-message">Error loading performance data</div>';
    }
}

// Pagination handler for games performance
function changeGamesPage(newPage) {
    const data = window.analyticsGameData;
    if (!data || newPage < 1 || newPage > data.maxPages) return;
    
    data.currentPage = newPage;
    data.renderGamesPage(newPage);
}

async function loadPlatformAnalytics() {
    try {
        // Total platform games
        const allGamesSnapshot = await window.firebaseGetDocs(window.firebaseCollection);
        const totalPlatformGames = allGamesSnapshot.size;
        document.getElementById('platformTotalGames').textContent = totalPlatformGames;
        
        // User contribution percentage
        const userId = window.firebaseAuth?.currentUser?.uid;
        const userGamesQuery = window.firebaseQuery(
            window.firebaseCollection, 
            window.firebaseWhere('submittedBy', '==', userId)
        );
        const userGamesSnapshot = await window.firebaseGetDocs(userGamesQuery);
        const userContribution = totalPlatformGames > 0 ? 
            ((userGamesSnapshot.size / totalPlatformGames) * 100).toFixed(1) + '%' : '0%';
        document.getElementById('yourContributionPercent').textContent = userContribution;
        
        // Most played game overall
        let mostPlayedGame = 'None';
        let maxPlays = 0;
        
        allGamesSnapshot.forEach(doc => {
            const game = doc.data();
            const playCount = game.playCount || 0;
            if (playCount > maxPlays) {
                maxPlays = playCount;
                mostPlayedGame = game.title;
            }
        });
        
        document.getElementById('mostPlayedGame').textContent = 
            maxPlays > 0 ? `${mostPlayedGame} (${maxPlays})` : 'None';
            
    } catch (error) {
        console.error('Error loading platform analytics:', error);
        document.getElementById('platformTotalGames').textContent = '-';
        document.getElementById('yourContributionPercent').textContent = '-';
        document.getElementById('mostPlayedGame').textContent = '-';
    }
}

function showAnalyticsError() {
    const analyticsCards = document.querySelectorAll('.analytics-card .analytics-content, .analytics-stats');
    analyticsCards.forEach(card => {
        card.innerHTML = '<div class="no-data-message">Error loading analytics data</div>';
    });
}

function refreshAnalytics() {
    console.log('🔄 Refreshing analytics data...');
    loadAnalyticsData();
}

// Add global access
window.refreshAnalytics = refreshAnalytics;
window.showAnalyticsTab = showAnalyticsTab;
window.loadAnalyticsData = loadAnalyticsData;
window.loadPersonalStats = loadPersonalStats;
window.loadGamesPerformance = loadGamesPerformance;
window.loadPlatformAnalytics = loadPlatformAnalytics;

// Debug function to test analytics manually
window.debugAnalytics = function() {
    console.group('%c🔧 ANALYTICS DEBUG', 'color: #00ffff; font-weight: bold; font-size: 14px;');
    console.log('User signed in:', !!window.firebaseAuth?.currentUser);
    console.log('User profile manager:', !!window.userProfileManager);
    console.log('User profile:', window.userProfileManager?.userProfile);
    console.log('Firestore available:', !!window.firebaseFirestore);
    console.log('Analytics elements found:', {
        totalGamesPlayed: !!document.getElementById('totalGamesPlayed'),
        totalGamesSubmitted: !!document.getElementById('totalGamesSubmitted'),
        totalFavoritesAdded: !!document.getElementById('totalFavoritesAdded'),
        gamesPerformanceGrid: !!document.getElementById('gamesPerformanceGrid'),
        platformTotalGames: !!document.getElementById('platformTotalGames')
    });
    console.groupEnd();
    
    // Try to load analytics
    if (window.loadAnalyticsData) {
        console.log('🔄 Attempting to load analytics data...');
        window.loadAnalyticsData();
    } else {
        console.log('❌ loadAnalyticsData function not available');
    }
};

// Enhanced analytics tab management
function ensureAnalyticsTabForDevUsers() {
    const checkAndShow = () => {
        const analyticsTab = document.querySelector('[data-tab="analytics"]');
        const userProfile = window.userProfileManager?.userProfile;
        const tierInfo = window.tierManager?.getTierInfo();
        
        console.log('🔍 Checking analytics tab visibility...');
        console.log('Analytics tab exists:', !!analyticsTab);
        console.log('User profile:', !!userProfile);
        console.log('User tier from profile:', userProfile?.tier, userProfile?.tierName);
        console.log('Tier from manager:', tierInfo?.name);
        
        // Check multiple ways to determine if user is DEV
        const isDevUser = userProfile?.tier === 'DEV' || 
                         userProfile?.tierName === 'DEV' || 
                         tierInfo?.name === 'DEV' ||
                         document.querySelector('.tier-card')?.textContent?.includes('Game Dev');
        
        if (analyticsTab && isDevUser) {
            analyticsTab.style.display = 'flex';
            analyticsTab.classList.add('show');
            console.log('✅ Analytics tab enabled for DEV user');
            return true;
        } else if (analyticsTab && !isDevUser) {
            analyticsTab.style.display = 'none';
            analyticsTab.classList.remove('show');
            console.log(`ℹ️ Analytics tab hidden for non-DEV user`);
            return false;
        } else {
            console.log('❌ Analytics tab element not found');
            return false;
        }
    };
    
    // Try immediately
    if (checkAndShow()) return;
    
    // Try again after a short delay
    setTimeout(checkAndShow, 500);
    
    // Try again after a longer delay if needed
    setTimeout(checkAndShow, 1500);
}

// Auto-run when profile modal opens
document.addEventListener('DOMContentLoaded', () => {
    // Override the profile modal show function
    const originalShowProfile = window.userProfileManager?.showProfile;
    if (originalShowProfile) {
        window.userProfileManager.showProfile = function() {
            originalShowProfile.call(this);
            setTimeout(() => ensureAnalyticsTabForDevUsers(), 100);
        };
    }
    
    // Also run whenever the modal is opened via mutation observer
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && 
                mutation.attributeName === 'style' && 
                mutation.target.id === 'userProfileModal') {
                const modal = mutation.target;
                if (modal.style.display === 'block') {
                    setTimeout(() => ensureAnalyticsTabForDevUsers(), 200);
                }
            }
        });
    });
    
    const modal = document.getElementById('userProfileModal');
    if (modal) {
        observer.observe(modal, { attributes: true });
    }
});

// Global function for manual testing
window.ensureAnalyticsTabForDevUsers = ensureAnalyticsTabForDevUsers;

// Avatar management functions
function removeAvatar() {
    const userProfile = window.userProfileManager?.userProfile;
    if (!userProfile) return;
    
    userProfile.avatar = null;
    window.userProfileManager.saveProfile();
    
    // Update UI
    window.dumbassGame?.updateAvatarPreview(null);
    window.dumbassGame?.updateAvatarButton();
    
    console.log('✅ Avatar removed');
}

// Force avatar display fix
function fixAvatarDisplay() {
    console.log('🔧 Fixing avatar display...');
    
    const userProfile = window.userProfileManager?.userProfile;
    const userAvatarImg = document.getElementById('userAvatarImg');
    const userAvatarBtn = document.getElementById('userAvatarBtn');
    const authBtn = document.getElementById('authBtn');
    
    // Profile modal avatar elements
    const avatarPreview = document.getElementById('currentAvatarPreview');
    const avatarPlaceholder = document.getElementById('avatarPlaceholder');
    const avatarStatus = document.getElementById('avatarStatus');
    
    console.log('👤 User profile avatar:', userProfile?.avatar ? 'Present (' + userProfile.avatar.length + ' chars)' : 'None');
    console.log('🖼️ Header avatar img element:', userAvatarImg ? 'Found' : 'Missing');
    console.log('🖼️ Profile modal avatar preview:', avatarPreview ? 'Found' : 'Missing');
    console.log('🔘 Avatar button:', userAvatarBtn ? 'Found' : 'Missing');
    console.log('🔐 Auth button:', authBtn ? 'Found' : 'Missing');
    
    if (!userProfile || !userProfile.avatar) {
        console.log('❌ No avatar data found in profile');
        return;
    }

    // Fix header avatar
    if (userAvatarImg) {
        userAvatarImg.src = userProfile.avatar;
        userAvatarImg.style.display = 'block';
        userAvatarImg.style.opacity = '1';
        console.log('✅ Header avatar image updated');
    }
    
    // Fix profile modal avatar
    if (avatarPreview) {
        avatarPreview.src = userProfile.avatar;
        avatarPreview.classList.add('loaded');
        avatarPreview.style.display = 'block';
        console.log('✅ Profile modal avatar preview updated');
    }
    
    // Update status text
    if (avatarStatus) {
        avatarStatus.textContent = 'Avatar set';
        console.log('✅ Avatar status text updated');
    }
    
    // Hide placeholder if it exists
    if (avatarPlaceholder) {
        avatarPlaceholder.style.display = 'none';
        console.log('✅ Avatar placeholder hidden');
    }
    
    // Show the avatar button and hide auth button if user is logged in
    if (window.firebaseAuth?.currentUser && userAvatarBtn && authBtn) {
        userAvatarBtn.style.display = 'flex';
        authBtn.style.display = 'none';
        console.log('✅ Avatar button shown, auth button hidden');
    }
    
    // Force call the existing update functions
    window.dumbassGame?.updateAvatarButton();
    window.dumbassGame?.updateAvatarPreview(userProfile.avatar);
    
    console.log('✅ Complete avatar display fixed - both header and profile modal updated');
    return userProfile.avatar;
}

// Debug profile persistence
function debugProfile() {
    const profile = window.userProfileManager?.userProfile;
    console.log('🔍 Current profile:', profile);
    console.log('📸 Avatar data:', profile?.avatar ? 'Present (' + (profile.avatar.length || 0) + ' chars)' : 'None');
    console.log('👤 User state:', window.firebaseAuth?.currentUser ? 'Logged in' : 'Anonymous');
    return profile;
}

// Debug and fix auth button state
function fixAuthButton() {
    console.log('🔧 Manually fixing auth button state...');
    const currentUser = window.firebaseAuth?.currentUser;
    console.log('👤 Firebase user:', currentUser ? currentUser.email : 'None');
    
    if (currentUser) {
        // Nuclear option - force everything
        const authBtn = document.getElementById('authBtn');
        const userAvatarBtn = document.getElementById('userAvatarBtn');
        
        // Add body class
        document.body.classList.add('user-logged-in');
        
        if (authBtn) {
            authBtn.style.display = 'none';
            authBtn.style.visibility = 'hidden';
            authBtn.style.opacity = '0';
            authBtn.classList.add('force-hidden');
            console.log('✅ FORCE Hidden login button');
        }
        
        if (userAvatarBtn) {
            userAvatarBtn.style.display = 'flex';
            userAvatarBtn.style.visibility = 'visible';
            userAvatarBtn.style.opacity = '1';
            userAvatarBtn.classList.remove('force-hidden');
            console.log('✅ FORCE Shown avatar button');
        }
        
        window.dumbassGame?.updateAvatarButton();
        console.log('✅ Updated avatar button content');
    }
    
    console.log('🏁 NUCLEAR auth button fix complete');
}

// Immediate fix - run this in console
function quickFix() {
    const authBtn = document.getElementById('authBtn');
    const userAvatarBtn = document.getElementById('userAvatarBtn');
    
    document.body.classList.add('user-logged-in');
    
    if (authBtn) authBtn.style.display = 'none';
    if (userAvatarBtn) userAvatarBtn.style.display = 'flex';
    
    console.log('⚡ QUICK FIX APPLIED');
}

// Global function to setup progress bar click events
function setupGlobalProgressBarEvents() {
    console.log('🎵 Setting up global progress bar events...');
    
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) {
        console.warn('⚠️ Progress bar element not found in global setup');
        return;
    }
    
    // Remove any existing event listeners by cloning the element
    const newProgressBar = progressBar.cloneNode(true);
    progressBar.parentNode.replaceChild(newProgressBar, progressBar);
    
    console.log('🎵 Found progress bar element, adding events...');
    
    // Handle dragging the slider
    newProgressBar.addEventListener('input', (e) => {
        const percentage = parseFloat(e.target.value);
        console.log(`🎵 Progress bar dragged to ${percentage.toFixed(1)}%`);
        
        if (window.musicPlayer && window.musicPlayer.seekTo) {
            // Immediately update the visual position
            e.target.value = percentage;
            
            // Briefly block automatic updates
            window.musicPlayer.isUserSeeking = true;
            window.musicPlayer.seekTo(percentage);
            window.musicPlayer.setupSeekComplete();
        }
    });
    
    // Handle clicking anywhere on the progress bar
    newProgressBar.addEventListener('click', (e) => {
        // Calculate click position manually
        const rect = newProgressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = (clickX / rect.width) * 100;
        const clampedPercentage = Math.max(0, Math.min(100, percentage));
        
        console.log(`🎵 Progress bar clicked at ${clampedPercentage.toFixed(1)}%`);
        
        if (window.musicPlayer && window.musicPlayer.seekTo) {
            // Immediately update the visual position
            newProgressBar.value = clampedPercentage;
            
            // Briefly block automatic updates
            window.musicPlayer.isUserSeeking = true;
            window.musicPlayer.seekTo(clampedPercentage);
            window.musicPlayer.setupSeekComplete();
        }
    });
    
    console.log('🎵 Global progress bar events set up successfully!');
}

// Manual function you can call from console to test
window.fixProgressBar = function() {
    console.log('🔧 Manually fixing progress bar...');
    setupGlobalProgressBarEvents();
};

// Admin dashboard opener function
function openAdminDashboard() {
    // Check if user is admin
    if (!isUserAdmin()) {
        console.warn('🚫 Unauthorized admin access attempt');
        alert('🚫 Access Denied: Admin privileges required');
        return;
    }

    // Check if admin system is ready
    if (!window.dumbassGameAdmin) {
        console.log('⏳ Admin system not ready yet, initializing...');
        
        // Try to initialize now
        if (window.dumbassGame) {
            window.dumbassGameAdmin = new DumbassGameAdmin(window.dumbassGame);
            console.log('✅ Admin system initialized!');
        } else {
            console.warn('⚠️ Main game system not ready, please try again in a few seconds');
            alert('Admin system loading... Please try again in a moment!');
            return;
        }
    }
    
    // Open the dashboard
    window.open('admin-dashboard.html', '_blank');
    console.log('👑 Admin dashboard opened!');
}

// Check if current user is admin
function isUserAdmin() {
    const currentUser = window.firebaseAuth?.currentUser;
    if (!currentUser) return false;
    
    // Debug: Log current user UID to console
    console.log('🔍 Current user UID:', currentUser.uid);
    console.log('🔍 Current user email:', currentUser.email);
    
    // Admin UIDs (your Firebase user ID)
    const adminUIDs = [
        'FIMoIezOXMRmkg9bl3ArJGCkuf93', // dumbassgames@proton.me
        // Add other admin UIDs here if needed
    ];
    
    // Check if current user is in admin list
    const isAdmin = adminUIDs.includes(currentUser.uid);
    console.log('🔍 Is user admin?', isAdmin);
    return isAdmin;
}

// Admin button removed - no longer needed

// Manual functions to help debug admin access
window.debugAdminAccess = function() {
    console.group('🔧 ADMIN ACCESS DEBUG');
    const currentUser = window.firebaseAuth?.currentUser;
    if (currentUser) {
        console.log('✅ User is signed in');
        console.log('📧 Email:', currentUser.email);
        console.log('🆔 UID:', currentUser.uid);
        console.log('👑 Is Admin:', isUserAdmin());
        
        // Admin button removed - no longer needed
    } else {
        console.log('❌ No user signed in');
    }
    console.groupEnd();
};

// Admin button removed - no longer needed

// Admin button removed - no longer needed