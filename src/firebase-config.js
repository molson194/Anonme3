import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const config = {
  apiKey: "AIzaSyBgcBZyKU-DMLXEcIC_VRHxLQMTVHyj6aY",
  authDomain: "anonme-b330f.firebaseapp.com",
  projectId: "anonme-b330f",
  storageBucket: "anonme-b330f.appspot.com",
  messagingSenderId: "1064314951422",
  appId: "1:1064314951422:web:71f6467f62d7c5dcc337af"
};

export const app = initializeApp(config);
export const auth = getAuth(app);

connectAuthEmulator(auth, "http://localhost:9099");