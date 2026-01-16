// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <ThemeProvider>
      {/* FIXED HERE: 
         - bg-gray-100 for Light Mode
         - dark:bg-[#09090b] for Dark Mode (Zinc Black)
         - text-gray-900 for Light Mode
         - dark:text-gray-100 for Dark Mode
      */}
      <div className="min-h-screen w-full bg-gray-100 dark:bg-[#09090b] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;