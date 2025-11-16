import React from 'react';
import { Brain, User, LayoutDashboard, BookOpen, Eye, LogOut } from 'lucide-react';



const palette = {
  primary: '#4F46E5',
  accent: '#ff8800',
  bg: '#F8FAFC',
  panel: '#FFFFFF',
  line: '#E2E8F0',
  text: '#334155',
  dim: '#64748B',
  success: '#10B981',
  warn: '#F59E0B',
  danger: '#F43F5E',
};



// --- UI Component Mock-up (Button is needed for the menu) ---
const Button = ({ children, onClick, className = '', size = 'md', disabled = false }) => {
  let padding;
  switch (size) {
    case 'sm':
      padding = 'px-3 py-1 text-sm';
      break;
    case 'lg':
      padding = 'px-8 py-3 text-lg';
      break;
    case 'md':
    default:
      padding = 'px-4 py-2 text-base';
      break;
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg font-medium transition-colors duration-200 shadow-md active:shadow-sm disabled:opacity-50 cursor-pointer ${padding} ${className}`}
    >
      {children}
    </button>
  );
};

const MenuBar = ({ mode, setMode, onLogout }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center mb-10 py-4 border-b border-gray-200">
      {/* Platform Title / Logo */}
      <h1 className="text-3xl font-extrabold text-blue-800 flex items-center mb-4 sm:mb-0">
        <Brain size={30} color={palette.primary}/>
        Pattern Learning Platform
      </h1>

      {/* Navigation Links */}
      <nav className="space-x-4 flex items-center">
        {/* Dashboard Button */}
        <Button
          onClick={() => setMode('dashboard')}
          className={`flex items-center transition-colors ${
            mode === 'dashboard'
              ? 'bg-blue-50 text-blue-700 font-semibold'
              : 'text-gray-500 bg-transparent hover:bg-blue-50'
          }`}
        >
          <LayoutDashboard className="w-6 h-6 mr-2 hidden sm:inline" />
          Dashboard
        </Button>

        {/* Observer Pattern Button */}
        <Button
          onClick={() => setMode('visualization')}
          className={`flex items-center transition-colors ${
            mode === 'visualization'
              ? 'bg-blue-50 text-blue-700 font-semibold'
              : 'text-gray-500 bg-transparent hover:bg-blue-50'
          }`}
        >
          <Eye className="w-6 h-6 mr-2 hidden sm:inline" />
          Observer Pattern
        </Button>

        {/* Assessment Button */}
        <Button
          onClick={() => setMode('assessment')}
          className={`flex items-center transition-colors ${
            mode === 'assessment'
              ? 'bg-blue-50 text-blue-700 font-semibold'
              : 'text-gray-500 bg-transparent hover:bg-blue-50'
          }`}
        >
          <BookOpen className="w-6 h-6 mr-2 hidden sm:inline" />
          Assessment
        </Button>

        {/* LOGOUT BUTTON */}
        <Button
          onClick={onLogout}
          className="text-red-600 bg-transparent hover:bg-red-50 flex items-center"
        >
          <LogOut className="w-6 h-6 mr-1" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </nav>
    </header>
  );
};

export default MenuBar;