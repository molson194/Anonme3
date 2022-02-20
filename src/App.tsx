import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import { CreateOrUpdateGroup } from './Components/CreateOrUpdateGroup';
import { Home } from './Components/Home'
import { Login } from './Components/Login'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/createOrUpdateGroup' element={<CreateOrUpdateGroup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
