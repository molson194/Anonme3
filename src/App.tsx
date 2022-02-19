import React from 'react';
import './App.css';
import { app } from './firebase-config';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, connectAuthEmulator } from 'firebase/auth';

function App() {
  const firebaseAuth = getAuth(app);
  connectAuthEmulator(firebaseAuth, "http://localhost:9099");

  const signIn = async () => {
    console.log(firebaseAuth);
    const params = {
      'size': 'invisible',
      'callback': (response : any) => {
        console.log(response)
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
      }
    };
    
    const appVerifier = new RecaptchaVerifier('sign-in-button', params, firebaseAuth);
    const confirmation = await signInWithPhoneNumber(firebaseAuth, '+13035147424', appVerifier);
    console.log(confirmation);
    const input = String(prompt());
    const result = await confirmation.confirm(input);
    console.log(result);
  }

  return (
    <div className="App">
      <button id='sign-in-button' onClick={signIn}>Click Me</button>
    </div>
  );
}

export default App;
