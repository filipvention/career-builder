/*
  # Add AI Enhanced Description Feature

  1. Schema Changes
    - Add `ai_enhanced_description` column to `career_notes` table
    - Add `is_ai_processing` column to track processing status

  2. Security
    - Existing RLS policies will apply to new columns
*/

-- Add AI enhanced description column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'career_notes' AND column_name = 'ai_enhanced_description'
  ) THEN
    ALTER TABLE career_notes ADD COLUMN ai_enhanced_description text;
  END IF;
END $$;

-- Add processing status column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'career_notes' AND column_name = 'is_ai_processing'
  ) THEN
    ALTER TABLE career_notes ADD COLUMN is_ai_processing boolean DEFAULT false;
  END IF;
END $$;