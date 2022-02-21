import { User } from "firebase/auth";
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { db } from '../firebase-config';
import { collection, query, doc, getDoc, orderBy, addDoc, onSnapshot } from "firebase/firestore";
import { GroupDetails } from "./GroupDetails";

export const Group = ({user} : {user:User}) => {
  const navigate = useNavigate();

  const path = window.location.pathname
  const groupId = path.substring(path.lastIndexOf('/') + 1)

  const [groupName, setGroupName] = useState('')
  const [groupAdmin, setGroupAdmin] = useState('')
  const [groupMembers, setGroupMembers] = useState<string[]>([])
  const [messages, setMessages] = useState<string[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [showGroupDetails, setShowGroupDetails] = useState(false)

  useEffect(() => {
    async function getGroupName() {
      const docRef = doc(db, "groups", groupId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setGroupName(docSnap.data().name);
        setGroupAdmin(docSnap.data().admin);
        setGroupMembers(docSnap.data().members);
      } else {
        console.log("No such document!");
      }
    }

    getGroupName()
  }, [groupId])

  useEffect(() => {
    const messagesQuery = query(collection(db, `groups/${groupId}/messages`), orderBy("time"));
    const unsubscribe = onSnapshot(messagesQuery, (messagesSnapshot) => {
      console.log("getting subscribed messages")
      const messages = messagesSnapshot.docs.map(doc => doc.data().message);
      setMessages(messages)
    });
    
    return () => unsubscribe();
  }, [groupId])

  const updateNewMessage = (event : any) => {
    var value = event.target.value;
    setNewMessage(value)
  }

  const handleSubmit = async (event : any) => {
    event.preventDefault();
    const time = new Date();
    const docRef = await addDoc(collection(db, `groups/${groupId}/messages`), {'message':newMessage, 'time':time});
    console.log("Document written with ID: ", docRef.id);
    setNewMessage('')
  }

  if (showGroupDetails) {
    return <GroupDetails user={user} name={groupName} admin={groupAdmin} members={groupMembers} />
  }

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Group {groupName}</h1>
      <button className="btn btn-blue" onClick={() => navigate(-1)}>Go back</button>
      <button className="btn btn-blue" onClick={() => setShowGroupDetails(!showGroupDetails)}>Group details</button>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <label>Send Message:
        <input 
          className="input-field"
          type="text" 
          name="newMessage" 
          value={newMessage || ""} 
          onChange={updateNewMessage}
        />
        </label>
          <input className="btn btn-blue" type="submit" />
      </form>
    </div>
  )
}
