import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// Note: You need to download your service account key from Firebase Console
// and place it in the backend folder as 'firebase-service-account.json'
const serviceAccount = require('../../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: 'https://your-project-id.firebaseio.com' // Optional, if using Realtime Database
});

export default admin;