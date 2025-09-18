import { useEffect, useState } from "react";
import { CareerNote, NoteFormData } from "./types";
import { supabase } from "./lib/supabase.ts";
import { AIService } from "./lib/aiService.ts";
import HeroSection from "./components/HeroSection.tsx";
import FilterBar from "./components/FilterBar.tsx";
import ExportBar from "./components/ExportBar.tsx";
import NotesList from "./components/NotesList.tsx";
import AddNoteModal from "./components/AddNoteModal.tsx";
import ExportModal from "./components/ExportModal.tsx";
import Header from "./components/Header.tsx";

function App() {
  const [notes, setNotes] = useState<CareerNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<CareerNote[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<CareerNote['type'] | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [notes, selectedFilter]);

  const fetchNotes = async () => {
    try {
      const {data, error} = await supabase
        .from('career_notes')
        .select('*')
        .order('created_at', {ascending: false});

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterNotes = () => {
    if (selectedFilter === 'all') {
      setFilteredNotes(notes);
    } else {
      setFilteredNotes(notes.filter(note => note.type === selectedFilter));
    }
  };

  const handleAddNote = async (formData: NoteFormData) => {
    try {
      // First, insert the note with processing flag
      const {data, error} = await supabase
        .from('career_notes')
        .insert([{...formData, is_ai_processing: true}])
        .select()
        .single();

      if (error) throw error;
      setNotes(prev => [data, ...prev]);

      // Then, generate AI enhancement in the background
      try {
        const aiEnhancedDescription = await AIService.enhanceDescription(data);

        // Update the note with AI enhancement
        const {error: updateError} = await supabase
          .from('career_notes')
          .update({
            ai_enhanced_description: aiEnhancedDescription,
            is_ai_processing: false
          })
          .eq('id', data.id);

        if (updateError) throw updateError;

        // Update local state
        setNotes(prev => prev.map(note =>
          note.id === data.id
            ? {...note, ai_enhanced_description: aiEnhancedDescription, is_ai_processing: false}
            : note
        ));
      } catch (aiError) {
        console.error('Error generating AI enhancement:', aiError);
        // Update to remove processing flag even if AI fails
        await supabase
          .from('career_notes')
          .update({is_ai_processing: false})
          .eq('id', data.id);

        setNotes(prev => prev.map(note =>
          note.id === data.id
            ? {...note, is_ai_processing: false}
            : note
        ));
      }
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  };

  const getNoteCounts = (): Record<CareerNote['type'], number> => {
    return notes.reduce((counts, note) => {
      counts[note.type] = (counts[note.type] || 0) + 1;
      return counts;
    }, {} as Record<CareerNote['type'], number>);
  };

  const handleNoteSelect = (noteId: string) => {
    setSelectedNotes(prev =>
      prev.includes(noteId)
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleClearSelection = () => {
    setSelectedNotes([]);
  };

  const handleToggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedNotes([]);
    }
  };

  const handleExport = () => {
    if (selectedNotes.length > 0) {
      setIsExportModalOpen(true);
    }
  };

  const getSelectedNotesData = (): CareerNote[] => {
    return notes.filter(note => selectedNotes.includes(note.id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>

      {notes.length === 0 && !isLoading ? (
        <HeroSection onAddNote={() => setIsModalOpen(true)}/>
      ) : (
        <>
          <div className="bg-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Your Career Story</h2>
                  <p className="mt-2 text-gray-600">
                    {notes.length} {notes.length === 1 ? 'note' : 'notes'} documenting your professional journey
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>

          <FilterBar
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            noteCounts={getNoteCounts()}
          />

          <ExportBar
            selectedCount={selectedNotes.length}
            onExport={handleExport}
            onClearSelection={handleClearSelection}
            onToggleSelection={handleToggleSelectionMode}
            isSelectionMode={isSelectionMode}
          />
        </>
      )}

      <NotesList
        notes={filteredNotes}
        isLoading={isLoading}
        selectedNotes={selectedNotes}
        onNoteSelect={handleNoteSelect}
        selectionMode={isSelectionMode}
      />

      <AddNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddNote}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        selectedNotes={getSelectedNotesData()}
      />
    </div>

  );
}

export default App;
