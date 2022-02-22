import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from "firebase/auth";
import { db } from '../firebase-config';
import { collection, query, getDocs } from "firebase/firestore";

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
      <h1>Loading...</h1>
    );
  }

  return (
    <div>
      <p>User signed in: {user.uid}</p>
      <button className="btn btn-blue" onClick={signUserOut}>Sign Out</button>
      <button className="btn btn-blue" onClick={() => navigate("/createGroup")}>Create Group</button>
      {groups.map((group) => (
        <button className="btn btn-blue" key={group.id} onClick={() => navigate(`groups/${group.id}`)}>{group.name}</button>
      ))}
    </div>
  );
}
