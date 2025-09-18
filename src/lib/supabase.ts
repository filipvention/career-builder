import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      career_notes: {
        Row: {
          id: string;
          type: 'achievement' | 'project' | 'feedback' | 'skill';
          title: string;
          description: string;
          ai_enhanced_description: string | null;
          is_ai_processing: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: 'achievement' | 'project' | 'feedback' | 'skill';
          title: string;
          description: string;
          ai_enhanced_description?: string | null;
          is_ai_processing?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: 'achievement' | 'project' | 'feedback' | 'skill';
          title?: string;
          description?: string;
          ai_enhanced_description?: string | null;
          is_ai_processing?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};