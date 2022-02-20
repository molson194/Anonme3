import { Link } from 'react-router-dom'
import { User } from "firebase/auth";

export const Home = ({user, signUserOut} : {user:User, signUserOut:()=>Promise<void>}) => {
  return (
    <div>
      <p>User signed in: {user.uid}</p>
      <button onClick={signUserOut}>Sign Out</button>
      <Link to="createOrUpdateGroup">Create Group</Link>
    </div>
  );
}
