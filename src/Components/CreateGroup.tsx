import { useState } from 'react'
import { db } from '../firebase-config';
import { User } from "firebase/auth";
import { collection, addDoc, doc, setDoc } from "firebase/firestore"; 
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'

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
    await setDoc(doc(db, `groupMemberships/${user.uid}/groups/${docRef.id}`), {'code':inputs.code, 'name':inputs.name}, {merge: true});
    navigate(`/groups/${docRef.id}`)
  }
  
  return (
    <Container fluid>
      <Navbar bg="dark" expand="lg" fixed="top">
        <button className="btn btn-outline-primary" onClick={() => navigate('/')}>Back</button>
        <button className="btn btn-outline-primary ms-auto" onClick={handleSubmit}>Create</button>
      </Navbar>
      <Container style={{paddingTop:'70px'}}>
        <Form>
          <Form.Group>
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={inputs.name}
              onChange={handleChange}
              placeholder="Group name..."
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Access Code</Form.Label>
            <Form.Control
              type="text"
              name="code"
              value={inputs.code}
              onChange={handleChange}
              placeholder="Access Code..."
            />
          </Form.Group>
        </Form>
      </Container>
    </Container>
  );
}
