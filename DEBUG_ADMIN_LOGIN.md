# Debugging Admin Login Issue

## Common Issues & Solutions

### Issue 1: User Document Doesn't Exist in Firestore

**Symptom**: Login succeeds in Firebase Auth but stays on login page

**Solution**: You need to create a user document in Firestore manually

**Steps**:
1. Go to Firebase Console → Firestore Database
2. Click on `users` collection (create it if it doesn't exist)
3. Click "Add document"
4. Document ID: **Use your Firebase Auth User UID** (find it in Authentication → Users)
5. Add these fields:
   ```
   uid: "your-user-uid-here"
   email: "your@email.com"
   name: "Your Name"
   phone: "+919876543210"
   role: "admin"
   createdAt: [timestamp - current time]
   isActive: true
   ```
6. Click Save

### Issue 2: Firestore Security Rules Blocking Access

**Symptom**: Login works but can't read user data

**Solution**: Make sure you've set the Firestore security rules

1. Go to Firebase Console → Firestore Database → Rules
2. Replace with the rules from `FIREBASE_SETUP.md`
3. Click Publish

### Issue 3: Role Not Set Correctly

**Symptom**: Login works but redirects to wrong dashboard or stays on login

**Solution**: Check the role field

1. Go to Firestore → users collection → your user document
2. Make sure `role` field is exactly: `admin` (lowercase, no quotes in the value)
3. Make sure `isActive` is: `true` (boolean, not string)

## Quick Debug Steps

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try to login
4. Look for any error messages (red text)
5. Share the error message if you see one

### Step 2: Check Network Tab
1. Open DevTools → Network tab
2. Try to login
3. Look for failed requests (red)
4. Check if Firestore requests are being made

### Step 3: Check Firebase Auth
1. Go to Firebase Console → Authentication → Users
2. Verify your user exists
3. Copy the User UID

### Step 4: Check Firestore Document
1. Go to Firebase Console → Firestore Database
2. Look for `users` collection
3. Find document with your User UID
4. Verify all fields are correct

## Manual Admin Creation (Foolproof Method)

If nothing else works, follow these exact steps:

### Part 1: Create Auth User
1. Firebase Console → Authentication → Users
2. Click "Add user"
3. Email: `admin@urbancrew.com`
4. Password: `admin123` (change later)
5. Click "Add user"
6. **COPY THE USER UID** (looks like: `abc123xyz456`)

### Part 2: Create Firestore Document
1. Firebase Console → Firestore Database
2. If `users` collection doesn't exist, click "Start collection" and name it `users`
3. Click "Add document"
4. Document ID: **PASTE THE USER UID FROM STEP 1**
5. Add fields one by one:
   - Field: `uid`, Type: string, Value: [paste User UID]
   - Field: `email`, Type: string, Value: `admin@urbancrew.com`
   - Field: `name`, Type: string, Value: `Admin User`
   - Field: `phone`, Type: string, Value: `+919876543210`
   - Field: `role`, Type: string, Value: `admin`
   - Field: `createdAt`, Type: timestamp, Value: [click timestamp icon, select current time]
   - Field: `isActive`, Type: boolean, Value: `true`
6. Click "Save"

### Part 3: Test Login
1. Go to http://localhost:5173/login
2. Email: `admin@urbancrew.com`
3. Password: `admin123`
4. Click "Sign In"
5. Should redirect to admin dashboard!

## Still Not Working?

If you're still having issues:

1. **Clear browser cache and cookies**
   - Press Ctrl+Shift+Delete
   - Clear everything
   - Try again

2. **Check console for errors**
   - Open DevTools (F12)
   - Look for red error messages
   - Share them with me

3. **Verify Firebase config**
   - Check `src/services/firebase.js`
   - Make sure credentials are correct

4. **Check if dev server is running**
   - Should see "Local: http://localhost:5173" in terminal
   - If not, run `npm run dev`

Let me know what error you see in the browser console!
