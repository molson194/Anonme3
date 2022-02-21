import { useState } from 'react'
import { db } from '../firebase-config';
import { User } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore"; 
import { useNavigate } from "react-router-dom";

export const CreateOrUpdateGroup = ({user} : {user:User}) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({'name':'', 'admin':user.uid, 'members': []});

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
    const docRef = await addDoc(collection(db, "groups"), inputs);
    console.log("Document written with ID: ", docRef.id);
    navigate('/')
  }
  
  return (
    <div>
      <button className="btn btn-blue" onClick={() => navigate(-1)}>Go back</button>
      <form onSubmit={handleSubmit}>
        <label className="input-label">Group Name:
        <input
          className="input-field"
          type="text" 
          name="name" 
          value={inputs.name || ""} 
          onChange={handleChange}
        />
        </label>
        <label className="input-label">Member Phone Numbers (comma separated):
          <input
            className="input-field"
            type="text" 
            name="members" 
            value={inputs.members || ""} 
            onChange={handleChange}
          />
          </label>
          <input className="btn btn-blue" type="submit" />
      </form>
    </div>
  );
}
