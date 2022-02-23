import { User } from "firebase/auth";
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { db } from '../firebase-config';
import { collection, query, doc, getDoc, orderBy, addDoc, onSnapshot, setDoc } from "firebase/firestore";
import Spinner from 'react-bootstrap/Spinner'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

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
      <Spinner animation="border" />
    );
  }

  if (!userBelongs) {
    return (
      <Container fluid>
        <Navbar bg="dark" expand="lg" fixed="top">
          <button className="btn btn-outline-primary" onClick={() => navigate('/')}>Back</button>
        </Navbar>
        <Container style={{paddingTop:'70px'}}>
          <Form>
            <Form.Group>
              <Form.Label>Group access code</Form.Label>
              <Form.Control
                type="text"
                value={accessCode}
                onChange={updateAccessCode}
                placeholder="Access Code..."
              />
              <Button className="mt-3" variant="primary" onClick={submitAccessCode}>Submit Access Code</Button>
            </Form.Group>
          </Form>
        </Container>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Navbar bg="dark" expand="lg" fixed="top">
        <button className="btn btn-outline-primary" onClick={() => navigate('/')}>Back</button>
        <Navbar.Brand style={{color:'white'}} className="mx-auto">Group {groupName}</Navbar.Brand>
        <button className="btn btn-outline-primary" onClick={leaveGroup}>Leave</button>
      </Navbar>
      <Container style={{paddingTop:'70px', marginBottom:'200px'}}>
        <div>
          {messages.map((message, index) => (
            <div key={index} className="alert alert-secondary" role="alert">{message}</div>
          ))}
        </div>
      </Container>
      <Navbar expand="lg" fixed="bottom">
        <Form className="w-100">
          <Form.Group style={{display: 'flex'}}>
            <Form.Control
              type="text"
              value={newMessage}
              onChange={updateNewMessage}
              placeholder="Message..."
            />
            <Button variant="success" size="lg" onClick={submitMessage}>Send</Button>
          </Form.Group>
        </Form>
      </Navbar>
    </Container>
  )
}
