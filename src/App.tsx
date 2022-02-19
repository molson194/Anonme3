import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import { Home } from './Components/Home'
import { Login } from './Components/Login'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
