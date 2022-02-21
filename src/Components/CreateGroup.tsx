import { useState } from 'react'
import { db } from '../firebase-config';
import { User } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore"; 
import { useNavigate } from "react-router-dom";

export const CreateGroup = ({user} : {user:User}) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<{name:string, admin:string, members:string[]}>({'name':'', 'admin':user.uid, 'members': []});
  const [member, setMember] = useState('');

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

  const changeGroupName = (event : any) => {
    const value = event.target.value;
    setInputs(values => ({...values, 'name': value}))
  }

  const changeMember = (event : any) => {
    const value = event.target.value;
    setMember(value)
  }

  const handleSubmit = async (event : any) => {
    event.preventDefault();
    const docRef = await addDoc(collection(db, "groups"), inputs);
    console.log("Document written with ID: ", docRef.id);
    navigate('/')
  }

  const addMember = () => {
    setInputs(values => ({...values, 'members': [...inputs.members, member]}))
    setMember('')
  }

  const removeMember = (index: number) => {
    const filteredMembers = inputs.members.filter((member, i) => i !== index)
    setInputs(values => ({...values, 'members': filteredMembers}))
  }
  
  return (
    <div>
      <button className="btn btn-blue" onClick={() => navigate(-1)}>Go back</button>
      <button className="btn btn-blue" onClick={handleSubmit}>Save</button>
      <label className="input-label">Group Name:
      <input
        className="input-field"
        type="text" 
        value={inputs.name || ""} 
        onChange={changeGroupName}
      />
      </label>
      <label className="input-label">Member Phone Number:
        <input
          className="input-field"
          type="text" 
          value={member || ""} 
          onChange={changeMember}
        />
        <button className="btn btn-blue" onClick={addMember}>AddMember</button>
      </label>
      {inputs.members.map((member, index) => (
          <div key={index}>
            <p>{member}</p>
            <button className="btn btn-blue" onClick={() => removeMember(index)}>Remove Member</button>
          </div>
        ))}
    </div>
  );
}
