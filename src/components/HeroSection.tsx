import { Plus, Sparkles } from "lucide-react";
import React from 'react';

interface HeroSectionProps {
  onAddNote: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({onAddNote}) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Build Your Career Story
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Document your achievements, projects, feedback, and skills. Our AI automatically transforms your notes into
          professional, CV-ready descriptions with quantifiable impact.
        </p>

        <div className="flex items-center justify-center space-x-8 mb-8">
          <div className="flex items-center space-x-2 text-blue-600">
            <Plus className="h-5 w-5"/>
            <span className="font-medium">Add Your Notes</span>
          </div>
          <div className="w-8 h-px bg-gray-300"></div>
          <div className="flex items-center space-x-2 text-purple-600">
            <Sparkles className="h-5 w-5"/>
            <span className="font-medium">AI Enhancement</span>
          </div>
          <div className="w-8 h-px bg-gray-300"></div>
          <div className="flex items-center space-x-2 text-green-600">
            <span className="font-medium">CV Ready</span>
          </div>
        </div>

        <button
          onClick={onAddNote}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
        >
          <Sparkles className="h-5 w-5 mr-2"/>
          Start Building Your Story
        </button>
      </div>
    </div>
  );
};

export default HeroSection;