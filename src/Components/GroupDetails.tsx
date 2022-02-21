import React, { useState } from 'react'
import { db } from '../firebase-config';
import { User } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore"; 
import { useNavigate } from "react-router-dom";

export const GroupDetails = ({user, name, admin, members} : {user:User, name:string, admin:string, members:string[]}) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({name, admin, members});
  const [member, setMember] = useState('');

  const path = window.location.pathname
  const groupId = path.substring(path.lastIndexOf('/') + 1)

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
    await updateDoc(doc(db, "groups", groupId), inputs);
    navigate(-1)
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
        { user.uid === admin && <button className="btn btn-blue" onClick={addMember}>AddMember</button> }
      </label>
      {inputs.members.map((member, index) => (
          <div key={index}>
            <p>{member}</p>
            { user.uid === admin && <button className="btn btn-blue" onClick={() => removeMember(index)}>Remove Member</button> }
          </div>
        ))}
    </div>
  );
}
