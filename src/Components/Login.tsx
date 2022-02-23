import { auth } from './../firebase-config';
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

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

  if (confirmation == null) {
    return (
      <div>
        <Container>
          <h1 className="mt-3">Login/Signup</h1>
          <Form>
            <Form.Group>
              <Form.Label>Phone number</Form.Label>
              <Form.Control
                type="tel"
                value={phoneNumber}
                onChange={updatePhoneNumber}
                placeholder="+19876543210"
              />
              <Button className="mt-3" variant="primary" id='sign-in-button' onClick={submitPhoneNumber}>Send Verification</Button>
            </Form.Group>
          </Form>
        </Container>
      </div>
    );
  } else {
    return (
      <div>
        <Container>
          <h1 className="mt-3">Login/Signup</h1>
          <Form>
            <Form.Group>
              <Form.Label>Phone Verification Code</Form.Label>
              <Form.Control
                type="text"
                value={inputCode}
                onChange={updateInputCode}
                placeholder="123456"
              />
              <Button className="mt-3" variant="success" onClick={submitInputCode}>Submit Verification</Button>
            </Form.Group>
          </Form>
        </Container>
      </div>
    )
  }
}
