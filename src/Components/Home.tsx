import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from "firebase/auth";
import { db } from '../firebase-config';
import { collection, query, where, getDocs } from "firebase/firestore";

export const Home = ({user, signUserOut} : {user:User, signUserOut:()=>Promise<void>}) => {
  const navigate = useNavigate()
  const [groups, setGroups] = useState<{id:string,name:string}[]>([])

  useEffect(() => {
    async function getGroups() {
      const memberGroups = query(collection(db, "groups"), where("members", "array-contains", user.phoneNumber!));
      const adminGroups = query(collection(db, "groups"), where("admin", "==", user.uid));
      const tempGroups:{id:string,name:string}[] = [];

      const memberSnapshot = await getDocs(memberGroups);
      memberSnapshot.forEach((doc) => {
        tempGroups.push({id: doc.id, name:doc.data().name});
      });

      const adminSnapshot = await getDocs(adminGroups);
      adminSnapshot.forEach((doc) => {
        tempGroups.push({id: doc.id, name:doc.data().name});
      });

      setGroups(tempGroups);
    }

    getGroups()
  }, [user])

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
