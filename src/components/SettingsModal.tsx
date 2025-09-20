import React, { useEffect, useState } from 'react';
import { TonePreference } from '../types';
import { UserPreferencesService } from '../lib/userPreferences';
import { Check, Settings, User, X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({isOpen, onClose}) => {
  const [selectedTone, setSelectedTone] = useState<TonePreference>('professional');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedTone(UserPreferencesService.getTone());
    }
  }, [isOpen]);

  const toneOptions = [
    {
      id: 'professional' as const,
      title: 'Professional',
      description: 'Formal, structured language with action verbs and quantifiable results',
      example: 'Successfully delivered project deliverables, demonstrating strong technical execution and project management skills, improving efficiency by 15%.',
      icon: '💼'
    },
    {
      id: 'friendly' as const,
      title: 'Human and Friendly',
      description: 'Warm, approachable tone while maintaining professionalism',
      example: 'Had the opportunity to work on an exciting project, which was both challenging and rewarding, helping the team work 15% more efficiently.',
      icon: '😊'
    },
    {
      id: 'technical' as const,
      title: 'Technical and Detailed',
      description: 'Precise technical language with detailed methodologies and specifications',
      example: 'Implemented comprehensive solution utilizing advanced technical methodologies and best practices, achieving 15% performance optimization.',
      icon: '⚙️'
    }
  ];

  const handleSave = async () => {
    setIsSaving(true);

    try {
      UserPreferencesService.updateTone(selectedTone);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = selectedTone !== UserPreferencesService.getTone();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="h-6 w-6 text-blue-600"/>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Personalization Settings</h2>
              <p className="text-sm text-gray-600 mt-1">
                Customize how AI generates your career content
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-400"/>
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Tone Preference Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-gray-500"/>
              <h3 className="text-lg font-semibold text-gray-900">Writing Tone</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Choose how you want AI to enhance your career notes. This tone will be applied consistently across all AI
              generations including CV sections, LinkedIn posts, and promotion cases.
            </p>

            <div className="space-y-4">
              {toneOptions.map((option) => (
                <div
                  key={option.id}
                  className={`relative border rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                    selectedTone === option.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedTone(option.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">{option.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {option.title}
                        </h4>
                        {selectedTone === option.id && (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white"/>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">
                        {option.description}
                      </p>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-500 mb-2">Example output:</p>
                        <p className="text-sm text-gray-800 italic leading-relaxed">
                          "{option.example}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Notice */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="h-5 w-5 text-blue-600"/>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  How This Affects Your Content
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>New Notes:</strong> Future AI enhancements will use your selected tone</li>
                  <li>• <strong>Exports:</strong> CV sections, LinkedIn posts, and promotion cases will reflect your
                    tone preference
                  </li>
                  <li>• <strong>Existing Notes:</strong> Already enhanced notes will keep their current tone (you can
                    regenerate them by editing)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            {showSaved && (
              <div className="flex items-center space-x-2 text-green-600">
                <Check className="h-4 w-4"/>
                <span className="text-sm font-medium">Settings saved!</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;