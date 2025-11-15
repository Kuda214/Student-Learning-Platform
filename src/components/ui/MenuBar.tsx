import React from 'react';
import { Brain, User, LayoutDashboard, BookOpen, Radio, Eye } from 'lucide-react';

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

const MenuBar = ({ mode, setMode }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center mb-10 py-4 border-b border-gray-200">
      {/* Platform Title / Logo */}
      <h1 className="text-3xl font-extrabold text-blue-800 flex items-center mb-4 sm:mb-0">
        <Brain className="w-8 h-8 mr-3 text-blue-500" />
        Pattern Learning Platform
      </h1>

      {/* Navigation Links */}
      <nav className="space-x-4 flex">
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

        {/* Profile/Settings Icon */}
        <Button
          // onClick={() => alert('Profile feature coming soon!')}
          className="text-gray-700 bg-transparent hover:bg-blue-50"
        >
          <User className="w-6 h-6" />
        </Button>
      </nav>
    </header>
  );
};

export default MenuBar;
