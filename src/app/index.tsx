import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from '../firebase/firebaseConfig';

export default function Index() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/(main)/TodoScreen'); 
      } else {
        router.replace('/(auth)'); 
      }
    });

    return unsubscribe;
  }, []);

  return null;
}
