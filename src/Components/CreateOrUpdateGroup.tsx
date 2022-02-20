import { useState, useEffect } from 'react'
import { auth, db } from '../firebase-config';
import { Link } from 'react-router-dom'
import { collection, addDoc } from "firebase/firestore"; 

export const CreateOrUpdateGroup = () => {
  const [inputs, setInputs] = useState({'name':'', 'admin':'', 'members': []});

  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setSignedIn(user != null)
      setInputs(values => ({...values, 'admin': user != null ? auth.currentUser!.uid : ''}))
    })

    return unsubscribe()
  }, [])

  const handleChange = (event : any) => {
    const name = event.target.name;
    var value = event.target.value;
    if (name === 'members') {
      value = String(value).split(',')
    }
    setInputs(values => ({...values, [name]: value}))
  }

  const handleSubmit = async (event : any) => {
    event.preventDefault();
    console.log(auth.currentUser!.uid);
    const docRef = await addDoc(collection(db, "groups"), inputs);
    console.log("Document written with ID: ", docRef.id);
  }
  
  if (signedIn) {
    return (
      <form onSubmit={handleSubmit}>
        <label>Group Name:
        <input 
          type="text" 
          name="name" 
          value={inputs.name || ""} 
          onChange={handleChange}
        />
        </label>
        <label>Member Phone Numbers (comma separated):
          <input 
            type="text" 
            name="members" 
            value={inputs.members || ""} 
            onChange={handleChange}
          />
          </label>
          <input type="submit" />
      </form>
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
