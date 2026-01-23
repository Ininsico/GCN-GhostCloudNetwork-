import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LandingPage from "./Page/ComponentsWrapper/LandingPage"
import FeaturesPage from "./Page/ComponentsWrapper/FeaturesPage";
import HowItWorksPage from "./Page/ComponentsWrapper/HowItWorksPage";
import NetworkPage from "./Page/ComponentsWrapper/NetworkPage";
import PatronPage from "./Page/ComponentsWrapper/PatronPage";
import DocumentationPage from "./Page/ComponentsWrapper/DocumentationPage";
import DashboardMain from "./Dashboard/DashboardMain";
import Login from "./Auth/Login";
import Register from "./Auth/Register";

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = (data: any) => {
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="bg-black min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/patron" element={<PatronPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route
            path="/login"
            element={
              isAuthenticated ?
                <Navigate to="/dashboard" replace /> :
                <Login onSuccess={handleAuthSuccess} />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ?
                <Navigate to="/dashboard" replace /> :
                <Register onSuccess={handleAuthSuccess} />
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ?
                <DashboardMain onLogout={handleLogout} user={user} /> :
                <Navigate to="/login" replace />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App