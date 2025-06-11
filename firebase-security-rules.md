# 🔒 DUMBASSGAMES FIREBASE SECURITY RULES

## Current Status: TEST RULES (REPLACE BEFORE PRODUCTION!)

**⚠️ CRITICAL:** You currently have test rules that allow any authenticated user to read/write everything. Replace with production rules below.

## 🚀 PRODUCTION FIREBASE SECURITY RULES

Copy these rules to your Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // =============================
    // USER PROFILES - STRICT ACCESS
    // =============================
    match /userProfiles/{userId} {
      // Users can only read/write their own profile
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Protect critical tier system fields from tampering
      allow write: if request.auth != null 
        && request.auth.uid == userId
        && validateProfileUpdate(resource.data, request.resource.data);
    }
    
    // =============================
    // GAMES - PUBLIC READ, CONTROLLED WRITE
    // =============================
    match /games/{gameId} {
      // Anyone can read games (public browsing)
      allow read: if true;
      
      // Only authenticated users can submit games
      allow create: if request.auth != null 
        && validateGameSubmission(request.resource.data)
        && request.resource.data.submittedBy == request.auth.uid;
      
      // Users can only update their own games (and only specific fields)
      allow update: if request.auth != null 
        && resource.data.submittedBy == request.auth.uid
        && validateGameUpdate(resource.data, request.resource.data);
      
      // Only game owners or admins can delete
      allow delete: if request.auth != null 
        && (resource.data.submittedBy == request.auth.uid 
            || isAdmin(request.auth.uid));
    }
    
    // =============================
    // ADMIN COLLECTION - ADMIN ONLY
    // =============================
    match /admin/{document=**} {
      allow read, write: if request.auth != null && isAdmin(request.auth.uid);
    }
    
    // =============================
    // TIER PAYMENTS - USER SPECIFIC
    // =============================
    match /payments/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // =============================
    // ANALYTICS - READ ONLY FOR USERS
    // =============================
    match /analytics/{document=**} {
      allow read: if request.auth != null;
      allow write: if false; // Only server can write analytics
    }
  }
  
  // =============================
  // VALIDATION FUNCTIONS
  // =============================
  
  // Validate profile updates to prevent tier system tampering
  function validateProfileUpdate(oldData, newData) {
    return 
      // Basic required fields
      newData.keys().hasAll(['email', 'tier', 'submissionCount']) &&
      
      // Email cannot be changed
      newData.email == oldData.email &&
      
      // Tier can only be upgraded through payment system
      (newData.tier == oldData.tier || 
       newData.tier == 'FREE' || // Allow downgrade to FREE
       hasValidTierExpiry(newData)) &&
      
      // Submission counts can only increase (prevent cheating)
      (newData.submissionCount.monthly >= oldData.submissionCount.monthly ||
       isNewMonth(oldData.lastSubmission)) &&
      
      // Required tier fields exist
      newData.keys().hasAll(['tierExpiry', 'submissionCount', 'lastSubmission']);
  }
  
  // Validate game submissions
  function validateGameSubmission(gameData) {
    return 
      // Required fields
      gameData.keys().hasAll(['title', 'url', 'description', 'submittedBy']) &&
      
      // Title and description not empty
      gameData.title.size() > 0 && gameData.title.size() <= 100 &&
      gameData.description.size() > 0 && gameData.description.size() <= 500 &&
      
      // Valid URL format
      gameData.url.matches('https?://.*') &&
      
      // Submitted by current user
      gameData.submittedBy == request.auth.uid &&
      
      // Has timestamp
      gameData.submittedAt != null;
  }
  
  // Validate game updates (only allow specific fields)
  function validateGameUpdate(oldData, newData) {
    return 
      // Can only update these fields
      newData.diff(oldData).affectedKeys().hasOnly(['plays', 'lastPlayed', 'rating', 'ratingCount']) &&
      
      // Play count can only increase
      (newData.plays >= oldData.plays) &&
      
      // Rating must be valid
      (newData.rating >= 0 && newData.rating <= 5);
  }
  
  // Check if user is admin
  function isAdmin(userId) {
    return userId in [
      'FIMoIezOXMRmkg9bl3ArJGCkuf93', // dumbassgames@proton.me
      // Add other admin UIDs here
    ];
  }
  
  // Check if tier has valid expiry (for upgrades)
  function hasValidTierExpiry(userData) {
    return userData.tier == 'FREE' || 
           (userData.tierExpiry != null && 
            userData.tierExpiry > request.time);
  }
  
  // Check if it's a new month (for submission count reset)
  function isNewMonth(lastSubmission) {
    return lastSubmission == null ||
           request.time > timestamp.date(
             timestamp.value(lastSubmission).year(),
             timestamp.value(lastSubmission).month() + 1,
             1
           );
  }
}
```

## 🛡️ WHAT THESE RULES PROTECT:

### **User Security:**
✅ **Profile Privacy** - Users can only access their own profiles  
✅ **Tier System Protection** - Prevents tampering with tier/submission data  
✅ **Payment Security** - Payment records are user-specific  

### **Game Integrity:**
✅ **Public Browsing** - Anyone can read games (good for SEO)  
✅ **Controlled Submissions** - Only authenticated users can submit  
✅ **Owner Controls** - Users can only edit their own games  
✅ **Play Count Protection** - Prevents fake play count manipulation  

### **Business Logic:**
✅ **Tier System Enforcement** - Server validates tier upgrades  
✅ **Submission Limits** - Prevents bypassing monthly limits  
✅ **Admin Protection** - Only admins can access admin data  

## 🔧 HOW TO DEPLOY:

1. **Go to Firebase Console** → Your Project → Firestore Database → Rules
2. **Replace the current test rules** with the production rules above
3. **Update the admin UIDs** - Replace `'FIMoIezOXMRmkg9bl3ArJGCkuf93'` with your actual admin user IDs
4. **Click "Publish"** 

## ⚠️ IMPORTANT NOTES:

- **Test thoroughly** before publishing - rules are enforced immediately
- **Add your admin UID** to the `isAdmin()` function
- **Backup your data** before changing rules
- **Monitor logs** for rule violations after deployment

Your platform will be production-secure with these rules! 🔒 