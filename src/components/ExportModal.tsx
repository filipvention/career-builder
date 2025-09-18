import React, { useState } from 'react';
import { CareerNote, ExportOptions } from '../types';
import { ExportService } from '../lib/exportService';
import { Check, Copy, Download, FileText, Linkedin, Loader2, TrendingUp, X } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNotes: CareerNote[];
}

const ExportModal: React.FC<ExportModalProps> = ({isOpen, onClose, selectedNotes}) => {
  const [selectedExportType, setSelectedExportType] = useState<'cv' | 'linkedin' | 'promotion'>('cv');
  const [selectedTone, setSelectedTone] = useState<'neutral' | 'inspiring' | 'technical'>('neutral');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const exportTypes = [
    {
      id: 'cv' as const,
      title: 'CV Section',
      description: 'Professional experience section for your resume',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 'linkedin' as const,
      title: 'LinkedIn Post',
      description: 'Engaging post to share your achievements',
      icon: Linkedin,
      color: 'blue'
    },
    {
      id: 'promotion' as const,
      title: 'Promotion Case',
      description: 'Comprehensive summary for manager/HR review',
      icon: TrendingUp,
      color: 'green'
    }
  ];

  const toneOptions = [
    {id: 'neutral' as const, label: 'Professional', description: 'Formal and straightforward'},
    {id: 'inspiring' as const, label: 'Inspiring', description: 'Motivational and engaging'},
    {id: 'technical' as const, label: 'Technical', description: 'Focus on technical details'}
  ];

  const handleGenerate = async () => {
    if (selectedNotes.length === 0) return;

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      const options: ExportOptions = {
        type: selectedExportType,
        tone: selectedExportType === 'linkedin' ? selectedTone : undefined
      };

      const content = await ExportService.generateExport(selectedNotes, options);
      setGeneratedContent(content);
    } catch (error) {
      console.error('Error generating export:', error);
      setGeneratedContent('Error generating content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedContent) return;

    try {
      await navigator.clipboard.writeText(generatedContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      blue: isSelected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' : 'border-gray-200 hover:border-blue-300',
      green: isSelected ? 'border-green-500 bg-green-50 ring-2 ring-green-500' : 'border-gray-200 hover:border-green-300'
    };
    return colors[color as keyof typeof colors];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Export Career Notes</h2>
            <p className="text-sm text-gray-600 mt-1">
              {selectedNotes.length} note{selectedNotes.length !== 1 ? 's' : ''} selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-400"/>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/*Export Type Selection*/}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Export Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exportTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedExportType(type.id)}
                    className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                      getColorClasses(type.color, selectedExportType === type.id)
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon className="h-5 w-5 text-gray-600"/>
                      <span className="font-medium text-gray-900">{type.title}</span>
                    </div>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tone Selection (only for LinkedIn) */}
          {selectedExportType === 'linkedin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tone Style
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {toneOptions.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id)}
                    className={`p-3 border rounded-lg text-left transition-all duration-200 ${
                      selectedTone === tone.id
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="font-medium text-gray-900 block">{tone.label}</span>
                    <span className="text-sm text-gray-600">{tone.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Generate Button */}
          <div className="flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || selectedNotes.length === 0}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2"/>
                  Generate {exportTypes.find(t => t.id === selectedExportType)?.title}
                </>
              )}
            </button>
          </div>

          {/* Generated Content */}
          {(generatedContent || isGenerating) && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900">Generated Content</h3>
                {generatedContent && (
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-4 w-4 mr-1 text-green-600"/>
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1"/>
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
                {isGenerating ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2"/>
                      <p className="text-gray-600">Generating professional content...</p>
                    </div>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                    {generatedContent}
                  </pre>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;