import { auth } from './../firebase-config';
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

export const Login = ({signedIn} : {signedIn:boolean}) => {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState('')
  const [confirmation, setConfirmation] = useState<ConfirmationResult>()
  const [inputCode, setInputCode] = useState('')

  useEffect(() => {
    if (signedIn) {
      navigate(-1)
    }
  }, [signedIn, navigate])

  const updatePhoneNumber = (event : any) => {
    var value = event.target.value;
    setPhoneNumber(value)
  }

  const updateInputCode = (event : any) => {
    var value = event.target.value;
    setInputCode(value)
  }

  const submitPhoneNumber = async (event : any) => {
    event.preventDefault();
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
    const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    setConfirmation(confirmation)
  }

  const submitInputCode = async (event : any) => {
    event.preventDefault();
    if (confirmation != null) {
      await confirmation.confirm(inputCode);
    } else {
      console.log("Submit phone number before input code.")
    }
  }

  return (
    <div>
      <p>Login</p>
      <form onSubmit={submitPhoneNumber}>
        <label className="input-label">Phone number: 
        <input 
          className="input-field"
          type="text" 
          name="phoneNumber" 
          value={phoneNumber || ""} 
          onChange={updatePhoneNumber}
        />
        </label>
          <input id='sign-in-button' type="submit" />
      </form>
      <form onSubmit={submitInputCode}>
        <label className="input-label">Input Code: 
        <input 
          className="input-field"
          type="text" 
          name="inputCode" 
          value={inputCode || ""} 
          onChange={updateInputCode}
        />
        </label>
          <input type="submit" />
      </form>
    </div>
  )
}
