// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyACEG_4v-3ROgMNOlFZsAllC9VcYb8Nm2A",
  authDomain: "bcd-discord.firebaseapp.com",
  databaseURL: "https://bcd-discord-default-rtdb.firebaseio.com",
  projectId: "bcd-discord",
  storageBucket: "bcd-discord.firebasestorage.app",
  messagingSenderId: "278895155371",
  appId: "1:278895155371:web:177a468f5fa3f0abfe3fee",
  measurementId: "G-6Q46Z9ZF0D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Make auth and db available globally
window.firebase = { auth, db };
