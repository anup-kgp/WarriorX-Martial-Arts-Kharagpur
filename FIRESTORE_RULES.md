# Firestore Security Rules Setup

To fix the "Missing or insufficient permissions" error, you need to configure Firestore security rules in your Firebase Console.

## Steps to Configure:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **warriorxmartial-arts**
3. Navigate to **Firestore Database** → **Rules** tab
4. Replace the existing rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public write access to contact_queries collection
    // This is safe because we're only allowing writes, not reads
    match /contact_queries/{document=**} {
      allow create: if true;
      allow read, update, delete: if false;
    }
    
    // Deny all other access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Alternative: More Secure Rules (Recommended for Production)

If you want more security, you can add validation:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contact_queries/{document=**} {
      // Allow creation with data validation
      allow create: if request.resource.data.keys().hasAll(['name', 'phone', 'timestamp', 'source'])
                 && request.resource.data.name is string
                 && request.resource.data.phone is string
                 && request.resource.data.timestamp is string
                 && request.resource.data.source == 'website_contact_form';
      // Deny reads, updates, and deletes from client
      allow read, update, delete: if false;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## After Updating Rules:

1. Click **Publish** to save the rules
2. Wait a few seconds for the rules to propagate
3. Test the contact form again

## Note:

- The rules above allow anyone to **create** (write) documents to `contact_queries`
- They **deny** read, update, and delete operations from the client
- This is safe because contact forms typically only need to write data
- You can view the submitted forms in the Firebase Console
