export interface CareerNote {
  id: string;
  type: 'achievement' | 'project' | 'feedback' | 'skill';
  title: string;
  description: string;
  ai_enhanced_description?: string;
  is_ai_processing?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExportOptions {
  type: 'cv' | 'linkedin' | 'promotion';
  tone?: 'neutral' | 'inspiring' | 'technical';
}

export interface ExportResult {
  content: string;
  type: string;
  tone?: string;
}

export interface NoteFormData {
  type: CareerNote['type'];
  title: string;
  description: string;
}

export type TonePreference = 'professional' | 'friendly' | 'technical';

export interface UserPreferences {
  tone: TonePreference;
}