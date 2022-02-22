import { useState } from 'react'
import { db } from '../firebase-config';
import { User } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore"; 
import { useNavigate } from "react-router-dom";

export const CreateGroup = ({user} : {user:User}) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({'name':'', 'admin':user.uid, 'code': ''});

  /* Enable when browsers support contact picking
  const contactApiSupported = 'contacts' in navigator;
  const contactApiProps = ['name', 'tel'];
  const contactApiOpts = {multiple: true};
  console.log(contactApiSupported)

  Add button to trigger get contacts
  const getContacts = async () => {
    try {
      const contacts = await navigator.contacts.select(contactApiProps, contactApiOpts);
      setInputs(values => ({...values, 'members': [...inputs.members, contacts]}))
    } catch (ex) {
      Handle errors
    }
  } */

  const handleChange = (event : any) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  const handleSubmit = async (event : any) => {
    event.preventDefault();
    const docRef = await addDoc(collection(db, "groups"), inputs);
    console.log("Document written with ID: ", docRef.id);
    navigate(`/groups/${docRef.id}`)
  }
  
  return (
    <div>
      <button className="btn btn-blue" onClick={() => navigate('/')}>Back</button>
      <button className="btn btn-blue" onClick={handleSubmit}>Create</button>
      <label className="input-label">Group Name:
        <input
          className="input-field"
          type="text"
          name="name"
          value={inputs.name || ""} 
          onChange={handleChange}
        />
      </label>
      <label className="input-label">Access code:
        <input
          className="input-field"
          type="text" 
          name="code"
          value={inputs.code || ""} 
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
