/*
  # Career Story Builder Database Schema

  1. New Tables
    - `career_notes`
      - `id` (uuid, primary key)
      - `type` (enum: achievement, project, feedback, skill)
      - `title` (text, required)
      - `description` (text, required)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `career_notes` table
    - Add policy for public read/write access (since no auth required)
*/

-- Create enum type for note types
CREATE TYPE note_type AS ENUM ('achievement', 'project', 'feedback', 'skill');

-- Create career_notes table
CREATE TABLE IF NOT EXISTS career_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type note_type NOT NULL DEFAULT 'achievement',
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE career_notes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (since no authentication required)
CREATE POLICY "Allow all operations on career_notes"
  ON career_notes
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_career_notes_updated_at
  BEFORE UPDATE ON career_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();