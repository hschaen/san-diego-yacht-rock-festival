# Firebase Setup Instructions

## Prerequisites
You need to complete these steps in the Firebase Console before the CMS will work.

## 1. Enable Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `san-diego-yacht-rock`
3. Click **Authentication** in the left sidebar
4. Click **Get started** if you haven't already
5. Go to the **Sign-in method** tab
6. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle the **Enable** switch (first option)
   - Click **Save**

## 2. Set up Firestore Database

1. In Firebase Console, click **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in production mode**
4. Select a location (choose `us-central1` or your nearest region)
5. Click **Enable**

## 3. Deploy Security Rules

After Firestore is created:

1. Go to **Firestore Database** → **Rules** tab
2. Replace the default rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to content for everyone
    match /content/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Allow read/write access to content_versions for admins only
    match /content_versions/{document=**} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Allow read/write access to admins collection for authenticated admins
    match /admins/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && 
        (request.auth.uid == userId || 
         exists(/databases/$(database)/documents/admins/$(request.auth.uid)));
    }
    
    // Allow anyone to write to registrations (for the signup form)
    match /registrations/{document=**} {
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
      allow create: if true;
    }
  }
}
```

3. Click **Publish**

## 4. Create Your First Admin Account

After completing the above steps:

1. Go to https://www.sandiegoyachtrockfestival.com/admin/setup
2. Click **Initialize Content** to populate the database
3. Enter your admin account details:
   - Name
   - Email address
   - Password (minimum 6 characters)
4. Click **Create Admin Account**
5. You'll be redirected to the login page
6. Log in with your new credentials

## 5. Verify Everything Works

1. Log in at https://www.sandiegoyachtrockfestival.com/admin
2. You should see the admin dashboard
3. Try editing some content to make sure everything saves properly

## Troubleshooting

### "permission-denied" errors
- Make sure you've published the Firestore security rules above
- Verify Firestore Database is enabled in your project

### "auth/configuration-not-found" error
- Make sure Email/Password authentication is enabled
- Check that your environment variables are correctly set in Vercel

### Cannot create admin account
- Ensure you've completed steps 1 and 2 above
- Try refreshing the page and trying again
- Check the browser console for specific error messages

## Environment Variables

Make sure these are set in Vercel (already done):
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`