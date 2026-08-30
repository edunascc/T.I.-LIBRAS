# Firebase Authentication & Firestore — Setup

This project branch (feature/firebase-auth) adds frontend integration with Firebase Authentication and Firestore to provide login/registration and persistent user progress (favorites and seen signals).

Steps you must do in the Firebase Console (before testing locally):

1) Open Firebase Console: https://console.firebase.google.com/
2) Create a project (or use an existing one).
3) Add a Web App (</> icon) and copy the firebaseConfig used when registering the app.
   - You must provide the config object to the repository so the web client can initialize Firebase.

4) Authentication → Sign-in method: ENABLE
   - Enable Email/Password
   - Enable Google (Sign-in provider)

5) Authentication → Authorized domains: ADD
   - localhost
   - 127.0.0.1
   - your production domain (e.g., example.com)

6) Firestore → Create database (Native mode) and set Rules:

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}

This ensures each authenticated user can only read/write their own user document.

How the integration works (summary)
- On register: user is created in Firebase Auth and a document at /users/{uid} is created with a progress object { favorites: [], seen: [] }.
- On login: the user's Firestore document is merged with localStorage (so any local progress is preserved), and localStorage keys `termosFavoritos` and `sinaisVistos` are updated from Firestore.
- While logged in: auth module periodically (every 10s) saves local progress to Firestore.

Files added in this branch
- login.html
- register.html
- css/auth.css
- js/firebase-config.js (contains your firebaseConfig)
- js/auth.js (main auth logic and Firestore sync)

Next steps
- After you verify your Firebase console settings, test locally with a simple static server (e.g. `python -m http.server 8000`) and open http://localhost:8000/login.html
- Create an account and verify favorites/seens persist across different browsers once saved.

Security notes
- The firebaseConfig object is safe for front-end use. Do not commit any service account JSON or admin SDK credentials to the repository.

