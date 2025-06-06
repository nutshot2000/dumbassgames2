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
                console.log('🎨 Waiting for persistence manager...');
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
    
    // Auto-save the theme changes
    themeCustomizer.saveTheme();
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
        // Preload critical assets for smoother experience
        const linkPreload = document.createElement('link');
        linkPreload.rel = 'preload';
        linkPreload.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
        linkPreload.as = 'style';
        document.head.appendChild(linkPreload);
    }

    loadDefaultGames() {
        if (this.games.length === 0) {
            this.games = [
                {
                    id: 'space-adventure',
                    title: 'AI SPACE ADVENTURE',
                    description: 'Explore the cosmos in this AI-generated space odyssey. Navigate through asteroid fields, battle alien ships, and discover new worlds in this epic space adventure.',
                    image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=250&fit=crop',
                    url: 'games/space-adventure.html',
                    // Enhanced data for search testing
                    category: 'shooter',
                    gameType: 'shooter',
                    genre: 'shooter',
                    tags: ['space', 'ai', 'adventure', 'sci-fi', 'exploration'],
                    difficulty: 'medium',
                    chaosVibe: 'actually-good',
                    vibe: 'actually-good',
                    rating: 4.2,
                    playCount: 1250,
                    submittedAt: '2024-01-15T10:30:00Z',
                    status: 'approved'
                },
                {
                    id: 'neural-maze',
                    title: 'NEURAL MAZE RUNNER',
                    description: 'Challenge your mind in this AI-designed maze runner. Use strategy and quick reflexes to navigate through ever-changing neural network pathways.',
                    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop',
                    url: '#',
                    // Enhanced data for search testing
                    category: 'puzzle',
                    gameType: 'puzzle',
                    genre: 'puzzle',
                    tags: ['ai', 'neural', 'maze', 'brain', 'strategy', 'pathfinding'],
                    difficulty: 'hard',
                    chaosVibe: 'peak-dumbass',
                    vibe: 'peak-dumbass',
                    rating: 3.8,
                    playCount: 890,
                    submittedAt: '2024-02-01T14:20:00Z',
                    status: 'approved'
                },
                {
                    id: 'robot-rebellion',
                    title: 'ROBOT REBELLION',
                    description: 'Lead the resistance in this action-packed AI adventure. Fight against rogue robots in a dystopian future where artificial intelligence has turned against humanity.',
                    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop',
                    url: '#',
                    // Enhanced data for search testing
                    category: 'shooter',
                    gameType: 'shooter',
                    genre: 'action',
                    tags: ['robot', 'ai', 'rebellion', 'dystopian', 'action', 'fighting'],
                    difficulty: 'expert',
                    chaosVibe: 'monstrositys',
                    vibe: 'monstrositys',
                    rating: 4.5,
                    playCount: 2100,
                    submittedAt: '2024-01-22T09:15:00Z',
                    status: 'approved'
                },
                {
                    id: 'quantum-puzzle',
                    title: 'QUANTUM PUZZLE WORLD',
                    description: 'Bend reality in this mind-bending puzzle game. Manipulate quantum mechanics to solve increasingly complex challenges across multiple dimensions.',
                    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop',
                    url: '#',
                    // Enhanced data for search testing
                    category: 'puzzle',
                    gameType: 'puzzle',
                    genre: 'puzzle',
                    tags: ['quantum', 'physics', 'reality', 'dimensions', 'science', 'mind-bending'],
                    difficulty: 'impossible',
                    chaosVibe: 'broken',
                    vibe: 'broken',
                    rating: 4.0,
                    playCount: 750,
                    submittedAt: '2024-02-10T16:45:00Z',
                    status: 'approved'
                },
                {
                    id: 'cyber-racer',
                    title: 'CYBER SPEED RACER',
                    description: 'Race through neon-lit cyberpunk cities at breakneck speeds. Upgrade your vehicle and compete against AI opponents in this high-octane racing experience.',
                    image: 'https://images.unsplash.com/photo-1541471943749-e5976783b7c4?w=400&h=250&fit=crop',
                    url: '#',
                    // Enhanced data for search testing
                    category: 'arcade',
                    gameType: 'arcade',
                    genre: 'racing',
                    tags: ['cyber', 'racing', 'speed', 'neon', 'cyberpunk', 'vehicles'],
                    difficulty: 'medium',
                    chaosVibe: 'memes',
                    vibe: 'memes',
                    rating: 3.9,
                    playCount: 1650,
                    submittedAt: '2024-01-30T12:00:00Z',
                    status: 'approved'
                },
                {
                    id: 'mystic-quest',
                    title: 'MYSTIC AI QUEST',
                    description: 'Embark on a magical journey through AI-generated fantasy realms. Cast spells, battle mythical creatures, and uncover ancient secrets.',
                    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
                    url: '#',
                    // Enhanced data for search testing
                    category: 'rpg',
                    gameType: 'rpg',
                    genre: 'fantasy',
                    tags: ['magic', 'fantasy', 'quest', 'spells', 'mythical', 'adventure'],
                    difficulty: 'easy',
                    chaosVibe: 'cursed',
                    vibe: 'cursed',
                    rating: 4.1,
                    playCount: 980,
                    submittedAt: '2024-02-05T11:30:00Z',
                    status: 'approved'
                }
            ];
            this.saveGames();
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
                    onclick="event.preventDefault(); event.stopPropagation(); if (window.userProfileManager) { window.userProfileManager.toggleFavorite('${game.id}'); window.userProfileManager.updateHeartIcons(); }" 
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
        
        // Track game launch analytics
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
        
        // Simulate game loading
        setTimeout(() => {
            this.hideGameLoadingOverlay();
            window.open(url, '_blank');
            this.notificationManager.showSuccess(`🎮 Launching ${title}... Have fun!`);
        }, 2000);
    }

    trackGamePlay(title, url) {
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

            console.log('📊 Analytics tracked for game play:', title);
        } catch (error) {
            console.warn('Analytics tracking failed:', error);
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
        // Redirect to EnhancedGameManager if available - it has better game handling
        if (window.enhancedGameManager) {
            await window.enhancedGameManager.addGame(gameData);
            return;
        }
        
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
            
            setTimeout(() => this.updateGameCount(), 100);
        } catch (error) {
            console.error('❌ Error adding game:', error);
            this.soundSystem.playError();
            this.notificationManager.showError('❌ Failed to add game. Please try again.');
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

        if (gameData.url && !this.isValidUrl(gameData.url)) {
            this.soundSystem.playError();
            this.notificationManager.showError('❌ Please enter a valid URL or file path!');
            return;
        }

        await this.addGame(gameData);
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
        console.log('%c🎮 DUMBASSGAMES ENHANCED v2.0', 'background: linear-gradient(90deg, #00ff00, #00ffff); color: #000; padding: 10px; font-size: 16px; font-weight: bold; border-radius: 5px;');
        console.log('%cWelcome to the most retro gaming experience on the web!', 'color: #00ff00; font-size: 14px;');
        console.log('%cType dumbassGameAdmin.help() for advanced commands', 'color: #00ffff; font-style: italic;');
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
                return firebaseGames;
            } catch (error) {
                console.error('❌ Error loading from Firebase, falling back to localStorage:', error);
            }
        }
        
        // Fallback to localStorage
        const saved = localStorage.getItem('dumbassGames');
        const localGames = saved ? JSON.parse(saved) : [];
        console.log('📁 Loaded games from localStorage:', localGames.length);
        return localGames;
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
                console.log(`💾 Saved ${dataType} to localStorage (${success ? 'backup' : 'primary'})`);
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
            
            if (!silent) {
                console.log(`💾 Saved to localStorage: ${key}`);
            }
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
            }
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
        this.currentTrack = 0;
        this.isPlaying = false;
        this.isShuffling = false;
        this.hasShownRescanNotification = false;
        
        // Audio Analysis Setup for Real EQ
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.source = null;
        this.isAnalysisSetup = false;
        
        // Default tracks - GXSCC converted 8-bit masterpieces!
        this.defaultPlaylist = [
            {
                title: "I CAN'T GO FOR THAT - 8BIT",
                url: "music/Hall_and_Oates_-_I_Cant_Go_for_That.WAV",
                duration: "4:12",
                type: "embedded"
            },
            {
                title: "LITTLE LIES - 8BIT",
                url: "music/Fleetwood_Mac_-_Little_Lies.WAV", 
                duration: "3:48",
                type: "embedded"
            },
            {
                title: "BORN ON THE BAYOU - 8BIT",
                url: "music/Born On The Bayou.WAV",
                duration: "5:15",
                type: "embedded"
            },
            {
                title: "KASHMIR - 8BIT",
                url: "music/Led_Zeppelin_-_Kashmir.WAV",
                duration: "8:28",
                type: "embedded"
            },
            {
                title: "LAYLA - 8BIT",
                url: "music/Eric_Clapton_-_Layla.WAV",
                duration: "7:05",
                type: "embedded"
            },
            {
                title: "ONLY HAPPY WHEN IT RAINS - 8BIT",
                url: "music/Garbage_-_Only_Happy_When_It_Rains.WAV",
                duration: "3:56",
                type: "embedded"
            },
            {
                title: "RASPUTIN - 8BIT",
                url: "music/Boney M.Rasputin .WAV",
                duration: "4:30",
                type: "embedded"
            },
            {
                title: "ROCKY WAR - 8BIT",
                url: "music/Rocky-War.WAV",
                duration: "4:20",
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
        console.log(`🎵 Initialized with ${this.playlist.length} tracks:`);
        this.playlist.forEach((track, index) => {
            console.log(`  ${index + 1}. ${track.title} (${track.duration})`);
        });
        
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
            "music/Hall_and_Oates_-_I_Cant_Go_for_That.WAV",
            "music/Fleetwood_Mac_-_Little_Lies.WAV",
            "music/Born On The Bayou.WAV",
            "music/Led_Zeppelin_-_Kashmir.WAV",
            "music/Eric_Clapton_-_Layla.WAV",
            "music/Garbage_-_Only_Happy_When_It_Rains.WAV",
            "music/Boney M.Rasputin .WAV",
            "music/Rocky-War.WAV"
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
    
    initializePlayer() {
        this.audio.volume = 0.7;
        this.audio.preload = 'metadata';
        
        // Set initial volume slider appearance
        this.setVolume(70);
        
        // Set initial track (check if playlist exists and has content)
        if (this.playlist && this.playlist.length > 0) {
            this.loadTrack(0);
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
            nextIndex = Math.floor(Math.random() * this.playlist.length);
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
            volumeSlider.style.background = `linear-gradient(to right, #00ff00 0%, #00ff00 ${value}%, rgba(0,0,0,0.8) ${value}%, rgba(0,0,0,0.8) 100%)`;
        }
    }
    
    seekTo(percentage) {
        if (this.audio.duration) {
            this.audio.currentTime = (percentage / 100) * this.audio.duration;
        }
    }
    
    updateProgress() {
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
        
        // Show browser-specific welcome message for unsupported browsers
        if (!('showDirectoryPicker' in window)) {
            setTimeout(() => {
                // Switch to Add tab automatically for better UX
                this.switchMusicTab('add');
                
                // Show friendly welcome message
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
            }, 500);
        }
        
        // Setup URL input
        this.setupUrlInputInManager();
        
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
                    `<button onclick="window.musicPlayer.playTrack(${index})" style="
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
        console.log('🗑️ Playlist cleared');
    }
    
    resetToDefaults() {
        // Clear all stored music data
        localStorage.removeItem('dumbassMusic_playlist');
        localStorage.removeItem('dumbassMusic_library');
        localStorage.removeItem('dumbassMusic_fileRefs');
        localStorage.removeItem('dumbassMusic_lastFolder');
        
        // Reload the page to reinitialize with fresh defaults
        console.log('🔄 Resetting to default embedded playlist...');
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
    
    shufflePlaylist() {
        // Fisher-Yates shuffle algorithm
        for (let i = this.playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.playlist[i], this.playlist[j]] = [this.playlist[j], this.playlist[i]];
        }
        this.saveToStorage(); // Save changes
        this.currentTrack = 0;
        this.loadTrack(0);
        this.renderCurrentPlaylist();
        console.log('🔀 Playlist shuffled');
    }
    
    searchLibrary(query) {
        const libraryGrid = document.getElementById('musicLibraryGrid');
        if (!libraryGrid) return;
        
        libraryGrid.innerHTML = '';
        
        const filteredTracks = this.musicLibrary.filter(track => 
            track.title.toLowerCase().includes(query.toLowerCase())
        );
        
        filteredTracks.forEach((track, index) => {
            // Find original index in musicLibrary for proper action handling
            const originalIndex = this.musicLibrary.findIndex(t => t.url === track.url);
            const trackCard = this.createTrackCard(track, originalIndex, false);
            libraryGrid.appendChild(trackCard);
        });
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
            'music/Hall_and_Oates_-_I_Cant_Go_for_That.WAV',
            'music/Fleetwood_Mac_-_Little_Lies.WAV',
            'music/Born On The Bayou.WAV'
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
            const docRef = await window.firebaseAddDoc(this.collection, {
                ...gameData,
                createdAt: new Date().toISOString(),
                createdBy: window.firebaseAuth.currentUser?.uid || 'anonymous',
                status: 'active'
            });
            console.log('🎮 Game added to Firebase:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('❌ Error adding game to Firebase:', error);
            return false;
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
        const loginBtn = document.getElementById('loginBtn');
        const authToggle = document.getElementById('authToggle');
        
        if (user) {
            // User is signed in
            loginBtn.style.display = 'none';
            authToggle.style.display = 'block';
            authToggle.title = `Logged in as ${user.email}`;
            
            // Update user info in modal - use display name if available
            this.updateWelcomeMessage(user);
            document.getElementById('userInfo').style.display = 'block';
            document.getElementById('authForm').style.display = 'none';
            document.querySelector('.auth-tabs').style.display = 'none';
        } else {
            // User is signed out
            loginBtn.style.display = 'block';
            authToggle.style.display = 'none';
            
            // Reset modal to form view
            document.getElementById('userInfo').style.display = 'none';
            document.getElementById('authForm').style.display = 'block';
            document.querySelector('.auth-tabs').style.display = 'flex';
        }

        // Notify user profile manager of auth state change
        if (window.userProfileManager) {
            window.userProfileManager.loadUserData();
            // Reload favorites after sign-in with a small delay to ensure Firebase is ready
            setTimeout(async () => {
                await window.userProfileManager.loadUserFavorites();
                window.userProfileManager.updateHeartIcons();
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
            
            const userCredential = await window.createUserWithEmailAndPassword(window.firebaseAuth, email, password);
            this.hideAuthError();
            this.hideAuthModal();
            if (window.dumbassGame && window.dumbassGame.notificationManager) {
                window.dumbassGame.notificationManager.showSuccess(`Account created successfully! Welcome to DUMBASSGAMES! 🎮`);
            }
            return userCredential.user;
        } catch (error) {
            this.showAuthError(this.getErrorMessage(error));
            throw error;
        }
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
        const submitBtn = document.getElementById('authSubmitBtn');
        const modalTitle = document.getElementById('authModalTitle');
        
        if (tab === 'login') {
            confirmPasswordField.style.display = 'none';
            confirmPasswordField.required = false;
            submitBtn.innerHTML = '🚀 LOGIN';
            modalTitle.textContent = 'LOGIN';
        } else {
            confirmPasswordField.style.display = 'block';
            confirmPasswordField.required = true;
            submitBtn.innerHTML = '🚀 SIGN UP';
            modalTitle.textContent = 'SIGN UP';
        }
        
        this.hideAuthError();
    }
}

// Initialize authentication manager
let authManager;

// Global authentication functions
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
                    console.log('✅ Profile form submit listener attached');
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
                console.log('✅ Profile modal click handler attached');
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

        // Only load favorites, NOT profile data to avoid overwriting form
        try {
            await this.loadUserFavorites();
            this.updateHeartIcons();
            console.log('✅ Loaded user favorites only (preserved profile form)');
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
                }
            });
            console.log('☁️ Loaded profile using persistence manager:', this.userProfile);
        } catch (error) {
            console.error('Error loading user profile:', error);
            // Fallback to basic profile
            this.userProfile = {
                email: this.currentUser?.email || '',
                displayName: '',
                bio: 'Welcome to DUMBASSGAMES!',
                joinDate: 'Recently',
                preferences: {
                    soundEnabled: true,
                    effectsEnabled: true
                }
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
        // Load user's submitted games from database
        this.submittedGames = []; // Would fetch from Firestore in real implementation
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

        // Update settings form
        const bioField = document.getElementById('userBio');
        const displayNameField = document.getElementById('displayName');
        
        if (bioField && !bioField.matches(':focus')) {
            bioField.value = this.userProfile.bio || '';
        }
        
        if (displayNameField && !displayNameField.matches(':focus')) {
            displayNameField.value = this.userProfile.displayName || '';
        }

        // Update toggle buttons
        this.updateToggleButtons();
        this.renderFavorites();
        this.renderSubmissions();
        
        // Update recent favorites section on main page
        this.updateRecentFavorites();
    }

    updateProfileDisplayOnly() {
        if (!this.userProfile) return;

        // Update ONLY the display elements, not the form fields
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
                <div class="game-category">${game.category?.toUpperCase() || 'UNCATEGORIZED'}</div>
            </div>
        `).join('');
    }

    async saveProfileSettings() {
        const bio = document.getElementById('userBio').value;
        const displayName = document.getElementById('displayName').value;

        try {
            const profileData = {
                email: this.currentUser?.email || '',
                displayName: displayName,
                bio: bio,
                joinDate: this.userProfile?.joinDate || 'Recently',
                preferences: {
                    soundEnabled: window.soundEnabled,
                    effectsEnabled: window.effectsEnabled
                }
            };

            await window.persistenceManager.saveUserProfile(profileData);
            this.userProfile = profileData;
            
            // Update the welcome message in the auth modal
            if (window.authManager && this.currentUser) {
                await window.authManager.updateWelcomeMessage(this.currentUser);
            }
            
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
            this.updateProfileUI();
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
        document.getElementById(tabName + 'Tab').classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Load tab-specific content
        if (tabName === 'favorites') {
            this.renderFavorites();
        } else if (tabName === 'submissions') {
            this.renderSubmissions();
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
        // Connect to the main game system and Firebase
        if (window.dumbassGame && window.dumbassGame.games && window.dumbassGame.games.length > 0) {
            // Create DEEP COPY to avoid reference sharing and duplication
            this.games = JSON.parse(JSON.stringify(window.dumbassGame.games));
            this.filteredGames = [...this.games];
            console.log('🎮 Enhanced Game Manager loaded', this.games.length, 'games from main system');
            
            // CRITICAL: Always render after loading
            this.renderGames();
            
            // Also sync with Firebase to make sure we have the latest
            if (window.dataManager && window.dataManager.isInitialized) {
                this.syncWithFirebase();
            }
        } else {
            console.log('🔄 Waiting for main game system to load...');
            // Wait for main system to load
            setTimeout(() => {
                this.loadExistingGames();
            }, 500);
        }
    }

    async syncWithFirebase() {
        try {
            const firebaseGames = await window.dataManager.getGames();
            if (firebaseGames && firebaseGames.length > 0) {
                // Merge with existing games (avoid duplicates)
                const existingIds = this.games.map(g => g.id);
                const newGames = firebaseGames.filter(g => !existingIds.includes(g.id));
                
                if (newGames.length > 0) {
                    this.games = [...this.games, ...newGames];
                    this.filteredGames = [...this.games];
                    console.log(`🔄 Synced ${newGames.length} additional games from Firebase`);
                    
                    // CRITICAL: Re-render after syncing
                    this.renderGames();
                }
            }
        } catch (error) {
            console.error('Error syncing with Firebase:', error);
        }
    }

    async addGame(gameData) {
        // Enhanced game data with Phase 3 features
        const enhancedGame = {
            ...gameData,
            id: this.generateGameId(),
            category: gameData.category || 'other',
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
                await window.dataManager.addGame(enhancedGame);
            }

            this.games.push(enhancedGame);
            this.applyFilters();
            this.renderGames();

            if (window.dumbassGame?.notificationManager) {
                window.dumbassGame.notificationManager.showSuccess('Game submitted for review! 🎮');
            }
        } catch (error) {
            console.error('Error adding game:', error);
            if (window.dumbassGame?.notificationManager) {
                window.dumbassGame.notificationManager.showError('Failed to submit game.');
            }
        }
    }

    generateGameId() {
        return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    createEnhancedGameCard(game) {
        // Use the gameTypes mapping since categories property doesn't exist
        const gameType = game.category || game.gameType || 'weird';
        const categoryLabel = this.gameTypes[gameType] || this.gameTypes['weird'];
        
        return `
            <div class="game-card" data-id="${game.id}" data-category="${game.category}" data-difficulty="${game.difficulty}">
                <div class="game-category">${categoryLabel}</div>
                ${game.rating ? `<div class="game-rating">⭐ ${game.rating.toFixed(1)}</div>` : ''}
                ${game.difficulty !== 'medium' ? `<div class="game-difficulty ${game.difficulty}">${this.getDifficultyLabel(game.difficulty)}</div>` : ''}
                
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
            'medium': '😐 MEDIUM', 
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

// 🎡 CHAOS WHEEL SYSTEM - Dramatic random game selection!
async function playRandomGame() {
    console.log('🎡 Random button clicked!');
    
    // Debug: Check if enhancedGameManager exists
    console.log('enhancedGameManager exists:', !!window.enhancedGameManager);
    console.log('enhancedGameManager object:', window.enhancedGameManager);
    
    // Get games from the enhanced game manager (Firebase integration)
    const games = window.enhancedGameManager?.games || [];
    console.log('Games found:', games.length);
    console.log('Games array:', games);
    
    // Also check the old location for comparison
    const oldGames = window.dumbassGame?.games || [];
    console.log('Old games location still has:', oldGames.length);
    
    if (games.length === 0) {
        console.log('No games found, trying to sync with Firebase...');
        
        // Try to sync with Firebase if no games are loaded
        if (window.enhancedGameManager && window.dataManager) {
            try {
                await window.enhancedGameManager.syncWithFirebase();
                const syncedGames = window.enhancedGameManager.games || [];
                console.log('After Firebase sync, games found:', syncedGames.length);
                
                if (syncedGames.length > 0) {
                    console.log('Games found after sync, showing chaos wheel...');
                    showChaosWheel(syncedGames);
                    return;
                }
            } catch (error) {
                console.error('Error syncing with Firebase:', error);
            }
        }
        
        console.log('Still no games found, showing notification');
        window.dumbassGame?.notificationManager?.showInfo('🎮 No games loaded yet! Add some chaos first.');
        return;
    }
    
    // Show the chaos wheel modal
    console.log('Showing chaos wheel...');
    showChaosWheel(games);
}

function showChaosWheel(games) {
    console.log('showChaosWheel called with', games.length, 'games');
    
    const modal = document.getElementById('chaosWheelModal');
    const wheel = document.getElementById('chaosWheel');
    const resultText = document.getElementById('wheelResultText');
    const gameTitle = document.getElementById('wheelGameTitle');
    
    console.log('Modal element:', modal);
    console.log('Wheel element:', wheel);
    console.log('Result text element:', resultText);
    console.log('Game title element:', gameTitle);
    
    if (!modal) {
        console.error('❌ Modal element #chaosWheelModal not found in DOM!');
        console.log('Available elements with "chaos":', document.querySelectorAll('[id*="chaos"]'));
        return;
    }
    
    if (!wheel) {
        console.error('❌ Wheel element #chaosWheel not found in DOM!');
        return;
    }
    
    // Reset wheel state
    wheel.classList.remove('spinning');
    wheel.style.transform = 'rotate(0deg)';
    resultText.textContent = 'SPINNING...';
    gameTitle.textContent = '';
    
    // Show modal
    modal.style.display = 'flex';
    
    // Play start sound
    if (window.dumbassGame?.soundSystem) {
        window.dumbassGame.soundSystem.playClick();
    }
    
    // Start spinning after brief delay
    setTimeout(() => {
        spinChaosWheel(games);
    }, 500);
}

function spinChaosWheel(games) {
    const wheel = document.getElementById('chaosWheel');
    const resultText = document.getElementById('wheelResultText');
    const gameTitle = document.getElementById('wheelGameTitle');
    
    // Pick random game and segment
    const randomIndex = Math.floor(Math.random() * games.length);
    const selectedGame = games[randomIndex];
    
    // Pick random wheel segment (0-7)
    const segmentIndex = Math.floor(Math.random() * 8);
    const segments = [
        '💩 DUMPSTER FIRE',
        '🤡 WHO MADE THIS?',
        '😈 CURSED VIBES', 
        '🔥 ACTUALLY FIRE',
        '👹 BEAUTIFUL DISASTER',
        '🌪️ PURE CHAOS',
        '🎪 DIGITAL CIRCUS',
        '🛸 ALIEN TECH'
    ];
    
    const selectedSegment = segments[segmentIndex];
    
    // Calculate final rotation (multiple spins + land on segment)
    const baseRotation = 3600; // 10 full spins for more drama!
    const segmentAngle = 45; // 360/8 segments
    const finalAngle = baseRotation + (segmentIndex * segmentAngle) + Math.random() * 20 - 10; // Small random offset
    
    // Start spinning
    wheel.classList.add('spinning');
    wheel.style.transform = `rotate(${finalAngle}deg)`;
    
    // Play spinning sound if available
    if (window.dumbassGame?.soundSystem) {
        // Could add spinning sound effect here
    }
    
    // After spin completes (longer dramatic pause)
    setTimeout(() => {
        // Show result with dramatic flashing effect
        resultText.textContent = selectedSegment;
        gameTitle.textContent = selectedGame.title;
        
        // Add flashing animation to result
        const resultContainer = document.querySelector('.wheel-result');
        if (resultContainer) {
            resultContainer.style.animation = 'flash 0.5s ease-in-out 3';
        }
        
        // Play result sound
        if (window.dumbassGame?.soundSystem) {
            window.dumbassGame.soundSystem.playSuccess();
        }
        
        // Wait longer to let them see the result, then launch game
        setTimeout(() => {
            closeChaosWheel();
            
            // Show notification with selected category
            window.dumbassGame?.notificationManager?.showSuccess(
                `${selectedSegment} selected "${selectedGame.title}"!`
            );
            
            // Launch the game
            window.dumbassGame?.playGame(selectedGame.url, selectedGame.title);
        }, 3000); // Longer pause to appreciate the result
        
    }, 6000); // Much longer spin duration for drama!
}

function closeChaosWheel() {
    const modal = document.getElementById('chaosWheelModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close wheel when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('chaosWheelModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeChaosWheel();
            }
        });
    }
});

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

// Initialize admin console
console.log('🔧 Initializing Admin Console...');
window.dumbassGameAdmin = new DumbassGameAdmin(window.dumbassGame);

console.log('✅ All systems initialized successfully!');

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