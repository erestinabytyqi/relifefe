// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyArEoYbMAQmtsNSsEMXAdJGS2wZPMVAamw',
  authDomain: 'relifeprod.firebaseapp.com',
  projectId: 'relifeprod',
  storageBucket: 'relifeprod.firebasestorage.app',
  messagingSenderId: '968510514447',
  appId: '1:968510514447:web:7cb3ced5f55bf018c88a7a',
  measurementId: 'G-LETFWS2EBS', // this can stay, even unused
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Only export what you actually use
export const auth = getAuth(app);
export const db = getFirestore(app);
