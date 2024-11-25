import './App.css';
import {  Routes, Route } from "react-router-dom";
import Homepage from './UI/Homepage';
import AuthPage from './UI/AuthPage';
import UserDashboard from './user/UserDashboard';
import Ticket from './user/Ticket';

function App() {
  return (
    <div className="App">

      <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/ticket" element={<Ticket />} />


      </Routes>
    </div>
  );
}

export default App;
