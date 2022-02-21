import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User } from "firebase/auth";
import { db } from '../firebase-config';
import { collection, query, where, getDocs } from "firebase/firestore";

export const Home = ({user, signUserOut} : {user:User, signUserOut:()=>Promise<void>}) => {
  
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
      <Link className="btn btn-blue" to="createGroup">Create Group</Link>
      {groups.map((group) => (
        <Link className="btn btn-blue" key={group.id} to={`groups/${group.id}`}>{group.name}</Link>
      ))}
    </div>
  );
}
