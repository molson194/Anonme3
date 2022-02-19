import { auth } from './../firebase-config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export const Login = () => {
  const signIn = async () => {
    console.log(auth);
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

    const appVerifier = new RecaptchaVerifier('sign-in-button', params, auth);
    const confirmation = await signInWithPhoneNumber(auth, '+13035147424', appVerifier);
    console.log(confirmation);
    const input = String(prompt());
    const result = await confirmation.confirm(input);
    console.log(result);
  }

  return (
    <div>
      <p>Login</p>
      <button id='sign-in-button' onClick={signIn}>Sign In</button>
    </div>
  )
}
