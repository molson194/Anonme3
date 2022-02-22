import { User } from "firebase/auth";
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { db } from '../firebase-config';
import { collection, query, doc, getDoc, orderBy, addDoc, onSnapshot, setDoc } from "firebase/firestore";

export const Group = ({user} : {user:User}) => {
  const navigate = useNavigate();

  const path = window.location.pathname
  const groupId = path.substring(path.lastIndexOf('/') + 1)

  const [loading, setLoading] = useState(true)
  const [userBelongs, setUserBelongs] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [groupName, setGroupName] = useState('')
  const [messages, setMessages] = useState<string[]>([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    async function getGroupName() {
      const docRef = doc(db, "groups", groupId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setGroupName(docSnap.data().name);
        console.log(docSnap.data().name)
      } else {
        console.log("No such document!");
      }
    }

    async function getUserBelongs() {
      const docRef = doc(db, `groupMemberships/${user.uid}/groups/${groupId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserBelongs(true)
      } else {
        console.log("User does not belong to group.");
        setLoading(false)
      }
    }

    getGroupName()
    getUserBelongs()
  }, [groupId, user])

  useEffect(() => {
    if (userBelongs)
    {
      const messagesQuery = query(collection(db, `groups/${groupId}/messages`), orderBy("time"));
      const unsubscribe = onSnapshot(messagesQuery, (messagesSnapshot) => {
        console.log("getting subscribed messages")
        const messages = messagesSnapshot.docs.map(doc => doc.data().message);
        setMessages(messages)
        setLoading(false)
      });
      
      return () => unsubscribe();
    }
  }, [groupId, userBelongs])

  const updateNewMessage = (event : any) => {
    var value = event.target.value;
    setNewMessage(value)
  }

  const updateAccessCode = (event : any) => {
    var value = event.target.value;
    setAccessCode(value)
  }

  const submitMessage = async (event : any) => {
    event.preventDefault();
    const time = new Date();
    const docRef = await addDoc(collection(db, `groups/${groupId}/messages`), {'message':newMessage, 'time':time});
    console.log("Document written with ID: ", docRef.id);
    setNewMessage('')
  }

  const submitAccessCode = async (event : any) => {
    event.preventDefault();
    setLoading(true)
    await setDoc(doc(db, `groupMemberships/${user.uid}/groups/${groupId}`), {'code':accessCode, 'name':groupName});
    console.log("Access code accepted");
    setUserBelongs(true)
  }

  const leaveGroup = () => {
    // TODO
  }

  if (loading){
    return (
      <h1>Loading...</h1>
    );
  }

  if (!userBelongs) {
    return (
      <div>
        <button className="btn btn-blue" onClick={() => navigate('/')}>Back</button>
        <label>Group access code:
        <input 
          className="input-field"
          type="text" 
          name="accessCode" 
          value={accessCode || ""} 
          onChange={updateAccessCode}
        />
        </label>
        <button className="btn btn-blue" onClick={submitAccessCode}>Submit</button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Group {groupName}</h1>
      <button className="btn btn-blue" onClick={() => navigate('/')}>Back</button>
      <button className="btn btn-blue" onClick={leaveGroup}>Leave</button>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <label>Send Message:
      <input 
        className="input-field"
        type="text" 
        name="newMessage" 
        value={newMessage || ""} 
        onChange={updateNewMessage}
      />
      </label>
      <button className="btn btn-blue" onClick={submitMessage}>Submit</button>
    </div>
  )
}
