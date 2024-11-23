import './App.css';
import {  Routes, Route } from "react-router-dom";
import Homepage from './UI/Homepage';
import AuthPage from './UI/AuthPage';

function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/auth" element={<AuthPage />} />


      </Routes>
    </div>
  );
}

export default App;
