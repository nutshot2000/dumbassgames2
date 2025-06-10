# Firebase Security Rules for DumbassGames

## Current Issue
The game submission is failing due to strict Firebase rules that require specific fields (`submittedBy` and `submittedAt`) but the code was using different field names.

## ✅ FIXED: Code has been updated to include the required fields

## Recommended Firebase Rules

Copy these rules into your Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Games collection - allow read for everyone, write for authenticated users
    match /games/{gameId} {
      allow read: if true;
      allow create: if request.auth != null 
        && request.resource.data.submittedBy == request.auth.uid
        && request.resource.data.submittedAt is timestamp;
      allow update, delete: if request.auth != null 
        && (resource.data.submittedBy == request.auth.uid || request.auth.uid in ['admin_uid_here']);
    }
    
    // User profiles - users can only access their own profile
    match /userProfiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User submissions tracking
    match /userSubmissions/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Payment records - restricted access
    match /payments/{paymentId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Analytics (optional) - read only for authenticated users
    match /analytics/{document} {
      allow read: if request.auth != null;
      allow write: if false; // Only server should write analytics
    }
  }
}
```

## Alternative Simpler Rules (Less Secure but Works)

If you want to get it working quickly while you test:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## What the Code Changes Fixed

1. **Added `submittedBy` field**: Now correctly sets to current user's UID
2. **Added `submittedAt` field**: Uses Firebase serverTimestamp() for accurate timing
3. **Imported serverTimestamp**: Added the required Firebase function to the imports
4. **Preserved existing fields**: Still includes `createdBy` and `createdAt` for backwards compatibility

## How to Apply These Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (dumbassgames-c1217)
3. Go to "Firestore Database" → "Rules"
4. Replace the existing rules with one of the rule sets above
5. Click "Publish"

## Testing

After applying the rules and refreshing your page:
1. Sign in to your account
2. Try submitting a new game
3. It should now work without permission errors

The code now properly sends both `submittedBy` (user ID) and `submittedAt` (server timestamp) fields that the Firebase rules require. 