// 🐦 DUMBASSGAMES TWITTER INTEGRATION
// Add your API keys in the TwitterConfig section below

class TwitterIntegration {
    constructor() {
        this.isConfigured = false;
        this.config = {
            // 🔑 ADD YOUR TWITTER API KEYS HERE:
            apiKey: 'mjv77BlxtG7x38HZrKLbvq0D6',
            apiSecret: 'XW6ys9NwUglNG63X8ZRPxeUZrTGhLy70WpuV4V0ZZz27vpfWvF', 
            accessToken: '1932613195359006721-9Yij8JsdEruYslgjuZsJKapvtqZNZ9',
            accessTokenSecret: 'z8axYff799AMWyA4ShMhR2dx3pC4VYvvfVIZemOKcsmC3'
        };
        
        this.validateConfig();
    }

    validateConfig() {
        const hasAllKeys = Object.values(this.config).every(key => 
            key && !key.includes('YOUR_') && key.length > 10
        );
        
        this.isConfigured = hasAllKeys;
        
        if (this.isConfigured) {
            console.log('🐦 Twitter integration configured successfully!');
        } else {
            console.log('🔑 Twitter keys needed - add them to twitter-integration.js');
        }
    }

    // Post tweet using Twitter API v2
    async postTweet(text) {
        if (!this.isConfigured) {
            console.log(`🐦 Would tweet: "${text}"`);
            console.log('🔑 Add your API keys to twitter-integration.js to enable real tweets');
            return { success: false, message: 'Keys not configured' };
        }

        try {
            // Create OAuth signature for Twitter API v1.1
            const tweet = await this.makeTwitterRequest('POST', 'https://api.twitter.com/1.1/statuses/update.json', {
                status: text
            });

            console.log('🐦 Tweet posted successfully!', tweet);
            return { success: true, tweet };
        } catch (error) {
            console.error('🚨 Twitter API error:', error);
            return { success: false, error: error.message };
        }
    }

    // Create OAuth 1.0a signature for Twitter API
    async makeTwitterRequest(method, url, params) {
        const oauth = {
            oauth_consumer_key: this.config.apiKey,
            oauth_token: this.config.accessToken,
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
            oauth_nonce: this.generateNonce(),
            oauth_version: '1.0'
        };

        // Create signature
        const signature = await this.createSignature(method, url, { ...oauth, ...params });
        oauth.oauth_signature = signature;

        // Create Authorization header
        const authHeader = 'OAuth ' + Object.keys(oauth)
            .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauth[key])}"`)
            .join(', ');

        // Make request
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: method === 'POST' ? new URLSearchParams(params).toString() : undefined
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Twitter API error: ${response.status} - ${error}`);
        }

        return await response.json();
    }

    async createSignature(method, url, params) {
        // Create signature base string
        const sortedParams = Object.keys(params)
            .sort()
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');

        const signatureBaseString = [
            method.toUpperCase(),
            encodeURIComponent(url),
            encodeURIComponent(sortedParams)
        ].join('&');

        // Create signing key
        const signingKey = `${encodeURIComponent(this.config.apiSecret)}&${encodeURIComponent(this.config.accessTokenSecret)}`;

        // Create HMAC-SHA1 signature
        const signature = await this.hmacSha1(signatureBaseString, signingKey);
        return signature;
    }

    async hmacSha1(message, key) {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(key);
        const messageData = encoder.encode(message);
        
        const cryptoKey = await crypto.subtle.importKey(
            'raw', keyData, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']
        );
        
        const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
        return btoa(String.fromCharCode(...new Uint8Array(signature)));
    }

    generateNonce() {
        return Array.from(crypto.getRandomValues(new Uint8Array(16)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // Test the connection
    async testConnection() {
        try {
            const result = await this.postTweet('🎮 Testing DumbassGames automation! dumbassgames.xyz #RetroGaming');
            return result.success;
        } catch (error) {
            console.error('🚨 Twitter test failed:', error);
            return false;
        }
    }
}

// 🔧 INTEGRATION WITH EXISTING AUTOMATION
// Update the SiteOwnerMonitoring class to use real Twitter API

// Enhanced Twitter integration for existing monitoring system
window.TwitterAPI = new TwitterIntegration();

// Override the existing sendTweet function in SiteOwnerMonitoring
if (window.siteMonitoring) {
    window.siteMonitoring.sendTweet = async function(message, data = {}) {
        if (!this.twitterEnabled) {
            console.log(`🐦 Would tweet: "${message}"`);
            return;
        }

        const result = await window.TwitterAPI.postTweet(message);
        if (result.success) {
            console.log('🐦 Tweet posted successfully!');
        } else {
            console.error('🚨 Tweet failed:', result.error || result.message);
        }
    };
}

// Admin commands for Twitter testing
if (window.dumbassGameAdmin) {
    // Add Twitter test commands
    window.dumbassGameAdmin.testTwitter = async () => {
        if (!window.TwitterAPI.isConfigured) {
            return '🔑 Please add your Twitter API keys to twitter-integration.js first';
        }
        
        console.log('🧪 Testing Twitter connection...');
        const success = await window.TwitterAPI.testConnection();
        return success ? '✅ Twitter test successful!' : '❌ Twitter test failed - check console';
    };

    window.dumbassGameAdmin.tweetNow = async (message) => {
        if (!message) {
            return '📝 Usage: tweetNow("Your message here")';
        }
        
        const result = await window.TwitterAPI.postTweet(message);
        return result.success ? '🐦 Tweet posted!' : `❌ Tweet failed: ${result.error || result.message}`;
    };
}

console.log('🐦 Twitter integration loaded! Add your API keys to enable real tweets.'); 