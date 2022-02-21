import { User } from "firebase/auth";
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { db } from '../firebase-config';
import { collection, query, doc, getDoc, orderBy, addDoc, onSnapshot } from "firebase/firestore";

export const Group = ({user} : {user:User}) => {
  const navigate = useNavigate();

  const path = window.location.pathname
  const groupId = path.substring(path.lastIndexOf('/') + 1)

  const [groupName, setGroupName] = useState('')
  const [messages, setMessages] = useState<string[]>([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    async function getGroupName() {
      const docRef = doc(db, "groups", groupId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setGroupName(docSnap.data().name);
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

  return (
    <div>
      <h1>Group {groupName}</h1>
      <button onClick={() => navigate(-1)}>Go back</button>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <label>Send Message:
        <input 
          type="text" 
          name="newMessage" 
          value={newMessage || ""} 
          onChange={updateNewMessage}
        />
        </label>
          <input type="submit" />
      </form>
    </div>
  )
}
