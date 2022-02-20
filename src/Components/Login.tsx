import { auth } from './../firebase-config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const signIn = async () => {
    const params = {
      'size': 'invisible',
      'callback': (response : any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
      }
    };

    const appVerifier = new RecaptchaVerifier('sign-in-button', params, auth);
    const confirmation = await signInWithPhoneNumber(auth, '+13035147424', appVerifier);
    const input = String(prompt());
    const result = await confirmation.confirm(input);

    if (result.user != null)
    {
      navigate('/')
    }
  }

  return (
    <div>
      <p>Login</p>
      <button id='sign-in-button' onClick={signIn}>Sign In</button>
    </div>
  )
}
