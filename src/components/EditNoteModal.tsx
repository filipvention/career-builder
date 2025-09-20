import React, { useEffect, useState } from 'react';
import { CareerNote, NoteFormData } from '../types';
import { Sparkles, X } from "lucide-react";

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NoteFormData) => Promise<void>;
  note: CareerNote | null;
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({isOpen, onClose, onSubmit, note}) => {
  const [formData, setFormData] = useState<NoteFormData>({
    type: 'achievement',
    title: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const noteTypes: Array<{ value: CareerNote['type']; label: string; description: string }> = [
    {value: 'achievement', label: 'Achievement', description: 'Awards, recognitions, or major accomplishments'},
    {value: 'project', label: 'Project', description: 'Work projects, side projects, or initiatives'},
    {value: 'feedback', label: 'Feedback', description: 'Performance reviews, testimonials, or praise received'},
    {value: 'skill', label: 'Skill', description: 'Technical skills, soft skills, or certifications earned'},
  ];

  useEffect(() => {
    if (note && isOpen) {
      setFormData({
        type: note.type,
        title: note.title,
        description: note.description,
      });
    }
  }, [note, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error updating note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !note) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Edit Career Note</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-400"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Note Type
            </label>
            <div className="grid grid-cols-1 gap-3">
              {noteTypes.map((type) => (
                <label
                  key={type.value}
                  className={`relative flex cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                    formData.type === type.value
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    checked={formData.type === type.value}
                    onChange={(e) => setFormData({...formData, type: e.target.value as CareerNote['type']})}
                    className="sr-only"
                  />
                  <div className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900">
                      {type.label}
                    </span>
                    <span className="block text-sm text-gray-500">
                      {type.description}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title / Short Headline
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter a descriptive title..."
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Provide details about this career note..."
              required
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2"/>
                  Update Note + AI Enhancement
                </>
              )}
            </button>
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <Sparkles className="h-5 w-5 text-blue-500 mt-0.5"/>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">AI Enhancement Included</h4>
                <p className="text-sm text-gray-600">
                  After updating, our AI will automatically regenerate a professional, CV-ready version of your
                  description
                  with quantifiable impact and action-oriented language.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNoteModal;