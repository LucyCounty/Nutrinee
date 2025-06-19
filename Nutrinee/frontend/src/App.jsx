import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import WeightHistory from './components/WeightHistory';
import ExerciseData from './components/ExerciseData';
import Profile from './components/Profile';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
    }
  }, []);

  const handleLogin = (userId) => {
    setIsAuthenticated(true);
    setUserId(userId);
    localStorage.setItem('userId', userId);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    localStorage.removeItem('userId');
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navigation onLogout={handleLogout} />}
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <Register />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
              <Dashboard userId={userId} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/weight-history" 
            element={
              isAuthenticated ? 
              <WeightHistory userId={userId} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/exercise-data" 
            element={
              isAuthenticated ? 
              <ExerciseData userId={userId} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/profile" 
            element={
              isAuthenticated ? 
              <Profile userId={userId} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;