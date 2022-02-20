import { useState, useEffect } from 'react';
import { auth } from './../firebase-config';
import { Link } from 'react-router-dom'
import { signOut } from "firebase/auth";

export const Home = () => {
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setSignedIn(user != null)
    })

    return unsubscribe()
  }, [])

  const signUserOut = () => {
    signOut(auth).then(() => {
      setSignedIn(false)
    }).catch((error) => {
      // An error happened.
    });
  }

  if (signedIn) {
    return (
      <div>
        <p>User signed in</p>
        <button onClick={signUserOut}>Sign Out</button>
        <Link to="createOrUpdateGroup">Create Group</Link>
      </div>
    );
  } else {
    return (
      <div>
        <p>User not signed in</p>
        <Link to="login">Login</Link>
      </div>
    );
  }
}
