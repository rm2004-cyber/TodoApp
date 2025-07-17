import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: 'AIzaSyBkVFq3b14RXMGAHEClNhTGT3dlk_D7HfY',
  authDomain: 'todoapp-13710.firebaseapp.com',
  projectId: 'todoapp-13710',
  storageBucket: 'todoapp-13710.appspot.com',
  messagingSenderId: '554323684315',
  appId: '1:554323684315:web:09e0688a0b22cc1123d5fe',
};


const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);


const auth = getAuth(app);        
const db = getFirestore(app);     

export { auth, db };

