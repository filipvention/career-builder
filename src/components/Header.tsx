import React from 'react';
import { BookOpen, Settings } from "lucide-react";

interface HeaderProps {
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({onOpenSettings}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <BookOpen className="h-6 w-6 text-white"/>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Career Story Builder</h1>
          </div>

          <button
            onClick={onOpenSettings}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="h-5 w-5"/>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;