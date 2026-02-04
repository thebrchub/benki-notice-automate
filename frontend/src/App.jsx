// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Components & Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import Overview from './pages/Overview';
import ITATViewer from './components/ITATViewer'; 
import AnalysisPage from './pages/AnalysisPage';
import Settings from './pages/Settings';
import About from './pages/About';

// ✅ Import the Restriction Component
import MobileRestriction from './components/MobileRestriction';

function App() {
  return (
    <ThemeProvider>
      {/* ✅ Wrapper Added Here */}
      <MobileRestriction>
        <div className="min-h-screen w-full bg-gray-100 dark:bg-[#09090b] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
          <Router>
            <Routes>

              {/* LOGIN */}
              <Route path="/login" element={<Login />} />

              {/* DASHBOARD (PROTECTED) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Overview />} />
                <Route path="portal" element={<ITATViewer />} />
                <Route path="analysis" element={<AnalysisPage />} />
                <Route path="settings" element={<Settings />} />
                <Route path="about" element={<About />} />
              </Route>

              {/* DEFAULT REDIRECT */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />

            </Routes>
          </Router>
        </div>
      </MobileRestriction>
    </ThemeProvider>
  );
}

export default App;