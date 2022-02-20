import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './App.css';
import { CreateOrUpdateGroup } from './Components/CreateOrUpdateGroup';
import { Home } from './Components/Home'
import { Login } from './Components/Login'
import { Group } from './Components/Group'
import { useState } from 'react';
import { auth } from './firebase-config';
import { signOut, User } from "firebase/auth";

function App() {
  const [user, setUser] = useState<User|null>(null)

  auth.onAuthStateChanged((currentUser) => {
    setUser(currentUser)
  })

  const signUserOut = async () => {
    await signOut(auth);
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/' element={user ? <Home user={user!} signUserOut={signUserOut}/> : <Navigate to="/login"/>} />
          <Route path='/login' element={<Login signedIn={user != null}/>} />
          <Route path='/createOrUpdateGroup' element={user ? <CreateOrUpdateGroup user={user!}/> : <Navigate to="/login"/>} />
          <Route path='/groups/:id' element={user ? <Group user={user!}/> : <Navigate to="/login"/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
