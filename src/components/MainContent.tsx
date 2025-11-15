import { useState } from 'react';
import { ObserverPattern } from './ObserverPattern';
import  {Assessment}  from './Assessment';
import  Dashboard  from './Dashboard';  // ADD THIS LINE
import MenuBar from './ui/MenuBar';

interface MainContentProps {
  username: string;
  onLogout: () => void;
}

export function MainContent({ username, onLogout }: MainContentProps) {
  // Start on dashboard (optional, you can change to 'visualization' if preferred)
  const [activeTab, setActiveTab] = useState<'visualization' | 'assessment' | 'dashboard'>('dashboard');

  // Map MenuBar's mode to our internal activeTab
  const menuMode = activeTab;
  const handleMenuSetMode = (mode: 'dashboard' | 'visualization' | 'assessment') => {
    setActiveTab(mode);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ----- MENU BAR (Your Corrected Version) ----- */}
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
          /* Scope styles to avoid global pollution */
          .menubar-fix header {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 1rem !important;
            padding: 12px 20px !important;
            min-height: 64px !important;
          }

          .menubar-fix header h1 {
            margin: 0 !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.6rem !important;
            font-size: 1.375rem !important;
          }

          .menubar-fix header nav {
            margin-left: auto !important;
            display: flex !important;
            gap: 0.5rem !important;
            align-items: center !important;
          }

          .menubar-fix header nav button {
            padding: 8px 12px !important;
            border-radius: 8px !important;
          }

          @media (max-width: 640px) {
            .menubar-fix header {
              flex-direction: column !important;
              align-items: stretch !important;
              gap: 8px !important;
              padding: 10px !important;
            }
            .menubar-fix header nav {
              justify-content: flex-end !important;
            }
          }
        `}</style>

        <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
          <MenuBar mode={menuMode} setMode={handleMenuSetMode} />
        </div>
      </div>

      {/* ----- MAIN CONTENT - CORRECT RENDERING ----- */}
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