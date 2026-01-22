import { useState, useEffect } from "react";
import LandingPage from "./Page/ComponentsWrapper/LandingPage"
import DashboardMain from "./Dashboard/DashboardMain";
import Login from "./Auth/Login";
import Register from "./Auth/Register";

const App = () => {
  const [view, setView] = useState<'landing' | 'dashboard' | 'login' | 'register'>('landing');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Simple trust for now, real app would verify token with backend
      setView('dashboard');
    }
  }, []);

  const handleAuthSuccess = (data: any) => {
    setUser(data.user);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setView('landing');
  };

  return (
    <div className="bg-black min-h-screen">
      {view === 'landing' && (
        <div className="relative">
          <LandingPage />
          <div className="fixed bottom-8 right-8 z-50 flex gap-4">
            <button
              onClick={() => setView('login')}
              className="bg-white/10 text-white px-6 py-3 rounded-full font-bold border border-white/10 hover:bg-white/20 transition-all backdrop-blur-md"
            >
              Sign In
            </button>
            <button
              onClick={() => setView('dashboard')}
              className="bg-[#39ff14] text-black px-6 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-transform"
            >
              Quick Dashboard Access
            </button>
          </div>
        </div>
      )}

      {view === 'login' && (
        <Login
          onSuccess={handleAuthSuccess}
          onSwitch={() => setView('register')}
        />
      )}

      {view === 'register' && (
        <Register
          onSuccess={handleAuthSuccess}
          onSwitch={() => setView('login')}
        />
      )}

      {view === 'dashboard' && (
        <DashboardMain onLogout={handleLogout} user={user} />
      )}
    </div>
  )
}

export default App