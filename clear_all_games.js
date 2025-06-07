// NUCLEAR OPTION: Clear ALL games from everywhere
console.log('🚨 CLEARING ALL GAMES FROM EVERYWHERE...');

async function clearAllGames() {
    try {
        // 1. Clear Firebase games collection
        if (window.dataManager && window.dataManager.isInitialized) {
            console.log('🔥 Clearing Firebase games...');
            
            // Get all games first
            const games = await window.dataManager.getGames();
            console.log(`Found ${games.length} games in Firebase to delete`);
            
            // Delete each game individually
            for (const game of games) {
                try {
                    await window.dataManager.deleteGame(game.id);
                    console.log(`✅ Deleted game: ${game.title}`);
                } catch (error) {
                    console.error(`❌ Failed to delete ${game.title}:`, error);
                }
            }
            
            console.log('🧹 Firebase cleanup complete');
        } else {
            console.log('⚠️ Firebase not available - skipping Firebase cleanup');
        }
        
        // 2. Clear localStorage
        console.log('🧹 Clearing localStorage...');
        localStorage.removeItem('dumbassGames');
        console.log('✅ localStorage cleared');
        
        // 3. Clear in-memory game arrays
        console.log('🧹 Clearing in-memory game arrays...');
        if (window.dumbassGame) {
            window.dumbassGame.games = [];
            console.log('✅ Cleared window.dumbassGame.games');
        }
        
        if (window.enhancedGameManager) {
            window.enhancedGameManager.games = [];
            window.enhancedGameManager.filteredGames = [];
            console.log('✅ Cleared window.enhancedGameManager.games');
        }
        
        // 4. Clear favorites
        if (window.userProfileManager) {
            window.userProfileManager.favoriteGames = [];
            await window.userProfileManager.saveFavorites();
            console.log('✅ Cleared favorites');
        }
        
        // 5. Re-render everything
        console.log('🔄 Re-rendering UI...');
        if (window.dumbassGame && window.dumbassGame.renderGames) {
            window.dumbassGame.renderGames();
        }
        if (window.enhancedGameManager && window.enhancedGameManager.renderGames) {
            window.enhancedGameManager.renderGames();
        }
        
        console.log('🎉 ALL GAMES CLEARED SUCCESSFULLY!');
        console.log('🔄 Refreshing page in 2 seconds...');
        
        setTimeout(() => {
            location.reload();
        }, 2000);
        
    } catch (error) {
        console.error('💥 Error during cleanup:', error);
    }
}

// Execute the cleanup
clearAllGames(); 