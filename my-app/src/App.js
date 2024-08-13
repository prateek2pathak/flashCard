import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from './Components/AdminDashboard';
import StudentDashboard from './Components/StudentDashboard'
import Home from './Components/Home'

function App() {
  return (
  <Router>
    <div className="App">
      
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/admin' element={<AdminDashboard/>}></Route>
          <Route path='/student' element={<StudentDashboard/>}></Route>
        </Routes>
      
    </div>
    </Router>
  );
}

export default App;
