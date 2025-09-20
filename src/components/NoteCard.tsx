import React from 'react';
import { CareerNote } from '../types';
import { Briefcase, Calendar, Check, Edit3, MessageCircle, MoreVertical, Sparkles, Star, Trash2, Trophy, User } from "lucide-react";
import { useState } from 'react';

interface NoteCardProps {
  note: CareerNote;
  isSelected?: boolean;
  onSelect?: (noteId: string) => void;
  onEdit?: (note: CareerNote) => void;
  onDelete?: (noteId: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({note, isSelected = false, onSelect, onEdit, onDelete}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getTypeIcon = (type: CareerNote['type']) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="h-5 w-5"/>;
      case 'project':
        return <Briefcase className="h-5 w-5"/>;
      case 'feedback':
        return <MessageCircle className="h-5 w-5"/>;
      case 'skill':
        return <Star className="h-5 w-5"/>;
    }
  };

  const getTypeColors = (type: CareerNote['type']) => {
    switch (type) {
      case 'achievement':
        return 'text-green-600 bg-green-100';
      case 'project':
        return 'text-blue-600 bg-blue-100';
      case 'feedback':
        return 'text-purple-600 bg-purple-100';
      case 'skill':
        return 'text-orange-600 bg-orange-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onEdit?.(note);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      onDelete?.(note.id);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md border p-6 hover:shadow-lg transition-all duration-200 space-y-4 relative ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 'border-gray-200'
      }`}>
      
      {/* Selection checkbox */}
      {onSelect && !showMenu && (
        <button
          onClick={() => onSelect(note.id)}
          className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            isSelected
              ? 'bg-blue-500 border-blue-500 text-white'
              : 'border-gray-300 hover:border-blue-400'
          }`}
        >
          {isSelected && <Check className="h-3 w-3"/>}
        </button>
      )}

      {/* Actions menu */}
      {(onEdit || onDelete) && !onSelect && (
        <div className="absolute top-4 right-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical className="h-4 w-4"/>
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
              {onEdit && (
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit3 className="h-4 w-4"/>
                  <span>Edit</span>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4"/>
                  <span>Delete</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${getTypeColors(note.type)}`}>
          {getTypeIcon(note.type)}
        </div>
        <span className="text-sm font-medium capitalize text-gray-500">
          {note.type}
        </span>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
        {note.title}
      </h3>

      {/* Original Description */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-400"/>
          <span className="text-sm font-medium text-gray-500">Your Note</span>
        </div>
        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg line-clamp-3">
          {note.description}
        </p>
      </div>

      {/* AI Enhanced Description */}
      {note.is_ai_processing ? (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-blue-500 animate-pulse"/>
            <span className="text-sm font-medium text-blue-600">AI Enhancement</span>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-sm text-blue-600">Generating professional version...</span>
            </div>
          </div>
        </div>
      ) : note.ai_enhanced_description ? (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-blue-500"/>
            <span className="text-sm font-medium text-blue-600">AI Enhanced (CV Ready)</span>
          </div>
          <p className="text-gray-700 text-sm bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400 line-clamp-3">
            {note.ai_enhanced_description}
          </p>
        </div>
      ) : null}

      <div className="flex items-center text-sm text-gray-400">
        <Calendar className="h-4 w-4 mr-1"/>
        {formatDate(note.created_at)}
      </div>
    </div>
  );
};

export default NoteCard;