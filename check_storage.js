console.log('🔍 Checking for any remaining game data...');

// Check localStorage for game-related keys
console.log('localStorage.getItem("dumbassGames"):', localStorage.getItem('dumbassGames'));

// Check for any other localStorage keys that might contain game data
let gameKeys = [];
for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key && (key.toLowerCase().includes('game') || key.toLowerCase().includes('dumbass'))) {
        gameKeys.push({
            key: key,
            valueLength: localStorage.getItem(key)?.length || 0,
            value: localStorage.getItem(key)?.substring(0, 100) + '...'
        });
    }
}

if (gameKeys.length > 0) {
    console.log('Found game-related localStorage keys:', gameKeys);
} else {
    console.log('✅ No game-related localStorage keys found');
}

// Check in-memory game arrays
console.log('window.dumbassGame?.games?.length:', window.dumbassGame?.games?.length || 0);
console.log('window.enhancedGameManager?.games?.length:', window.enhancedGameManager?.games?.length || 0);

console.log('✅ Check complete!');
