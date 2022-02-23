import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { CreateGroup } from './Components/CreateGroup';
import { Home } from './Components/Home'
import { Login } from './Components/Login'
import { Group } from './Components/Group'
import { useState } from 'react';
import { auth, db } from './firebase-config';
import { signOut, User } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import Spinner from 'react-bootstrap/Spinner'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User|null>(null)

  auth.onAuthStateChanged(async (currentUser) => {
    if (currentUser) {
      await setDoc(doc(db, `groupMemberships/${currentUser!.uid}`),{},{merge: true})
    }
    
    setUser(currentUser)
    setLoading(false)
  })

  const signUserOut = async () => {
    await signOut(auth);
  }

  if (loading) {
    return (
      <Spinner animation="border" />
    );
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/' element={user ? <Home user={user!} signUserOut={signUserOut}/> : <Navigate to="/login"/>} />
          <Route path='/login' element={<Login signedIn={user != null}/>} />
          <Route path='/createGroup' element={user ? <CreateGroup user={user!}/> : <Navigate to="/login"/>} />
          <Route path='/groups/:id' element={user ? <Group user={user!}/> : <Navigate to="/login"/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
