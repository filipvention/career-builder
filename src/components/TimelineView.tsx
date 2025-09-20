import React, { useState } from 'react';
import { CareerNote } from '../types';
import {
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Sparkles,
  Star,
  Trophy,
  User
} from "lucide-react";

interface TimelineViewProps {
  notes: CareerNote[];
  isLoading: boolean;
}

const TimelineView: React.FC<TimelineViewProps> = ({notes, isLoading}) => {
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  const toggleExpanded = (noteId: string) => {
    const newExpanded = new Set(expandedNotes);
    if (newExpanded.has(noteId)) {
      newExpanded.delete(noteId);
    } else {
      newExpanded.add(noteId);
    }
    setExpandedNotes(newExpanded);
  };

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
        return 'text-green-600 bg-green-100 border-green-200';
      case 'project':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'feedback':
        return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'skill':
        return 'text-orange-600 bg-orange-100 border-orange-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      short: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      year: date.getFullYear(),
    };
  };

  const groupNotesByYear = (notes: CareerNote[]) => {
    const grouped = notes.reduce((acc, note) => {
      const year = new Date(note.created_at).getFullYear();
      if (!acc[year]) acc[year] = [];
      acc[year].push(note);
      return acc;
    }, {} as Record<number, CareerNote[]>);

    // Sort years in descending order
    return Object.keys(grouped)
      .map(Number)
      .sort((a, b) => b - a)
      .map(year => ({year, notes: grouped[year]}));
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-20 mb-4"></div>
              <div className="space-y-4">
                {[...Array(2)].map((_, noteIndex) => (
                  <div key={noteIndex} className="flex space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
        <h3 className="text-2xl font-medium text-gray-900 mb-2">No career timeline yet</h3>
        <p className="text-gray-600">
          Start adding notes to see your career journey unfold over time.
        </p>
      </div>
    );
  }

  const yearGroups = groupNotesByYear(notes);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-12">
        {yearGroups.map(({year, notes: yearNotes}) => (
          <div key={year} className="relative">
            {/* Year Header */}
            <div className="sticky top-0 z-10 bg-white py-4 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-gray-500"/>
                {year}
                <span className="ml-3 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {yearNotes.length} {yearNotes.length === 1 ? 'note' : 'notes'}
                </span>
              </h2>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              <div className="space-y-8">
                {yearNotes.map((note) => {
                  const isExpanded = expandedNotes.has(note.id);
                  const dateInfo = formatDate(note.created_at);

                  return (
                    <div key={note.id} className="relative flex space-x-6">
                      {/* Timeline dot */}
                      <div
                        className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 border-white shadow-lg ${getTypeColors(note.type)}`}>
                        {getTypeIcon(note.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                          {/* Header - Always visible */}
                          <button
                            onClick={() => toggleExpanded(note.id)}
                            className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                  <span className="text-sm font-medium text-gray-500 capitalize">
                                    {note.type}
                                  </span>
                                  <span className="text-sm text-gray-400">•</span>
                                  <span className="text-sm text-gray-500">
                                    {dateInfo.full}
                                  </span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                  {note.title}
                                </h3>
                                {!isExpanded && (
                                  <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                                    {note.description}
                                  </p>
                                )}
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                {isExpanded ? (
                                  <ChevronDown className="h-5 w-5 text-gray-400"/>
                                ) : (
                                  <ChevronRight className="h-5 w-5 text-gray-400"/>
                                )}
                              </div>
                            </div>
                          </button>

                          {/* Expanded content */}
                          {isExpanded && (
                            <div className="px-6 pb-6 space-y-6 border-t border-gray-100">
                              {/* Original Description */}
                              <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4 text-gray-400"/>
                                  <span className="text-sm font-medium text-gray-500">Your Note</span>
                                </div>
                                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg leading-relaxed">
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
                                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                    <div className="flex items-center space-x-2">
                                      <div
                                        className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
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
                                  <p
                                    className="text-gray-800 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 leading-relaxed font-medium">
                                    {note.ai_enhanced_description}
                                  </p>
                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineView;