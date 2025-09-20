import React from 'react';
import { CareerNote } from '../types';
import NoteCard from './NoteCard';
import { FileText } from "lucide-react";

interface NotesListProps {
  notes: CareerNote[];
  isLoading: boolean;
  selectedNotes?: string[];
  onNoteSelect?: (noteId: string) => void;
  selectionMode?: boolean;
  onEditNote?: (note: CareerNote) => void;
  onDeleteNote?: (noteId: string) => void;
}

const NotesList: React.FC<NotesListProps> = ({
                                               notes,
                                               isLoading,
                                               selectedNotes = [],
                                               onNoteSelect,
                                               selectionMode = false,
                                               onEditNote,
                                               onDeleteNote
                                             }) => {
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
        <h3 className="text-2xl font-medium text-gray-900 mb-2">No notes found</h3>
        <p className="text-gray-600">
          {selectionMode
            ? "No notes match your current filter selection."
            : "Start building your career story by adding your first note."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            isSelected={selectedNotes.includes(note.id)}
            onSelect={selectionMode ? onNoteSelect : undefined}
            onEdit={!selectionMode ? onEditNote : undefined}
            onDelete={!selectionMode ? onDeleteNote : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default NotesList;