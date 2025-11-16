import { useState } from 'react';
import { ObserverPattern } from './ObserverPattern';
import { Assessment } from './Assessment';
import Dashboard from './Dashboard';
import MenuBar from './ui/MenuBar';

interface MainContentProps {
  username: string;
  onLogout: () => void;
}

export function MainContent({ username, onLogout }: MainContentProps) {
  const [activeTab, setActiveTab] = useState<'visualization' | 'assessment' | 'dashboard'>('dashboard');

  const menuMode = activeTab;
  const handleMenuSetMode = (mode: 'dashboard' | 'visualization' | 'assessment') => {
    setActiveTab(mode);
  };

  // LOGOUT LOGIC — Runs when user clicks Logout
  const handleLogout = () => {
    // 1. Clear auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    // Add more keys if needed: session, userId, etc.

    // 2. Call parent onLogout (e.g. to reset auth state)
    onLogout();

    // 3. Redirect to login
    window.location.href = '/login'; // Change if your login page is different
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ----- MENU BAR ----- */}
      <div
        className="menubar-fix"
        style={{
          backgroundColor: '#fff',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <style>{`
          .menubar-fix header {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 1rem !important;
            padding: 12px 20px !important;
            min-height: 64px !important;
          }
          .menubar-fix header h1 { margin: 0 !important; display: flex !important; align-items: center !important; gap: 0.6rem !important; font-size: 1.375rem !important; }
          .menubar-fix header nav { margin-left: auto !important; display: flex !important; gap: 0.5rem !important; align-items: center !important; }
          .menubar-fix header nav button { padding: 8px 12px !important; border-radius: 8px !important; }
          @media (max-width: 640px) {
            .menubar-fix header { flex-direction: column !important; align-items: stretch !important; gap: 8px !important; padding: 10px !important; }
            .menubar-fix header nav { justify-content: flex-end !important; }
          }
        `}</style>

        <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
          {/* PASS onLogout to MenuBar */}
          <MenuBar mode={menuMode} setMode={handleMenuSetMode} onLogout={handleLogout} />
        </div>
      </div>

      {/* ----- MAIN CONTENT ----- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {activeTab === 'dashboard' ? (
          <Dashboard />
        ) : activeTab === 'visualization' ? (
          <ObserverPattern />
        ) : (
          <Assessment username={username} />
        )}
      </div>
    </div>
  );
}