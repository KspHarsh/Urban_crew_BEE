# Firebase Setup Instructions

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: **UrbanCrew** (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Register Your Web App

1. In your Firebase project, click the **Web** icon (`</>`)
2. Register app with nickname: **UrbanCrew Web**
3. **Do NOT** check "Also set up Firebase Hosting" (we'll use Vercel/Netlify)
4. Click "Register app"
5. Copy the Firebase configuration object

## Step 3: Enable Authentication

1. In Firebase Console, go to **Build** > **Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method
4. Click "Save"

## Step 4: Create Firestore Database

1. Go to **Build** > **Firestore Database**
2. Click "Create database"
3. Choose **Start in production mode**
4. Select your preferred location (closest to your users)
5. Click "Enable"

## Step 5: Set Firestore Security Rules

Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Clients collection
    match /clients/{clientId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == clientId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Workers collection
    match /workers/{workerId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == workerId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Requests collection
    match /requests/{requestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'client';
      allow update, delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Assignments collection
    match /assignments/{assignmentId} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Replacements collection
    match /replacements/{replacementId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'client';
      allow update: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Step 6: Update Firebase Configuration

1. Open `src/services/firebase.js`
2. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 7: Create First Admin User

Since the first user needs to be an admin, you'll need to manually create one:

### Option A: Using Firebase Console (Recommended)

1. Go to **Authentication** > **Users**
2. Click "Add user"
3. Enter email and password
4. Copy the User UID
5. Go to **Firestore Database**
6. Create a document in `users` collection:
   - Document ID: [paste the User UID]
   - Fields:
     ```
     uid: [User UID]
     email: "admin@urbancrew.com"
     name: "Admin User"
     phone: "+919876543210"
     role: "admin"
     createdAt: [current timestamp]
     isActive: true
     ```

### Option B: Temporary Registration Bypass

1. Temporarily modify `src/contexts/AuthContext.jsx`
2. In the `register` function, change:
   ```javascript
   isActive: userData.role === ROLES.ADMIN ? true : false
   ```
   to:
   ```javascript
   isActive: true  // Temporarily auto-activate all users
   ```
3. Register your admin account through the app
4. Go to Firestore and manually change the user's role to "admin"
5. Revert the code change

## Step 8: Test the Application

1. Run the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173

3. Test the following:
   - Register as a client
   - Register as a worker
   - Login as admin
   - Approve worker registration
   - Create a request as client
   - Manage requests as admin

## Troubleshooting

### Error: "Firebase: Error (auth/configuration-not-found)"
- Make sure you've copied the correct Firebase config
- Check that Authentication is enabled in Firebase Console

### Error: "Missing or insufficient permissions"
- Verify Firestore security rules are set correctly
- Make sure the user is authenticated

### Users can't login after registration
- Check if `isActive` is set to `true` in the users collection
- For workers, admin must approve them first

## Next Steps

Once Firebase is configured:
1. Test all authentication flows
2. Create sample data for testing
3. Deploy to production (Vercel/Netlify for frontend)
4. Update Firebase security rules for production
