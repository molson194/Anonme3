import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from "firebase/auth";
import { db } from '../firebase-config';
import { collection, query, getDocs } from "firebase/firestore";
import Spinner from 'react-bootstrap/Spinner'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'

export const Home = ({user, signUserOut} : {user:User, signUserOut:()=>Promise<void>}) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState<{id:string,name:string}[]>([])

  useEffect(() => {
    async function getGroups() {
      const memberGroups = query(collection(db, `groupMemberships/${user.uid}/groups`));
      const tempGroups:{id:string,name:string}[] = [];

      const memberSnapshot = await getDocs(memberGroups);
      memberSnapshot.forEach((doc) => {
        tempGroups.push({id: doc.id, name:doc.data().name});
      });

      setGroups(tempGroups);
      setLoading(false)
    }

    getGroups()
  }, [user])

  if (loading){
    return (
      <Spinner animation="border" />
    );
  }

  return (
    <Container fluid>
      <Navbar bg="dark" expand="lg" fixed="top">
        <button className="btn btn-outline-primary" onClick={() => navigate("/createGroup")}>New Group</button>
        <Navbar.Brand style={{color:'white'}} className="mx-auto">Anonme</Navbar.Brand>
        <button className="btn btn-outline-primary ms-0" onClick={signUserOut}>Sign Out</button>
      </Navbar>
      <div className="d-grid gap-2" style={{paddingTop:'70px'}}>
        {groups.map((group) => (
          <Button variant="outline-primary" size="lg" key={group.id} onClick={() => navigate(`groups/${group.id}`)}>{group.name}</Button>
        ))}
      </div>
    </Container>
  );
}
