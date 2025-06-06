// Check Firebase for any stored games
console.log('🔍 Checking Firebase for stored games...');

if (window.dataManager && window.dataManager.getGames) {
    window.dataManager.getGames()
        .then(games => {
            console.log('🎮 Firebase games found:', games.length);
            if (games.length > 0) {
                console.log('Games in Firebase:', games.map(g => ({ id: g.id, title: g.title })));
                console.log('⚠️ PROBLEM: Old games are stored in Firebase!');
                console.log('💡 Solution: Need to clear Firebase games collection');
            } else {
                console.log('✅ Firebase is clean - no games stored');
            }
        })
        .catch(error => {
            console.error('❌ Error checking Firebase:', error);
        });
} else {
    console.log('❌ Firebase manager not available');
    console.log('Data manager:', window.dataManager);
}

// Also check where games are coming from in the current app
console.log('📊 Current game sources:');
console.log('window.dumbassGame.games:', window.dumbassGame?.games?.length || 0);
console.log('window.enhancedGameManager.games:', window.enhancedGameManager?.games?.length || 0);
