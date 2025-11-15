import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { MainContent } from './components/MainContent';

export default function App() {
  const [user, setUser] = useState<string | null>(null);

  const handleLogin = (username: string) => {
    setUser(username);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {!user ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <MainContent username={user} onLogout={handleLogout} />
      )}
    </div>
  );
}