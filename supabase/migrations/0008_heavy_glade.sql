/*
  # Add User Preferences Table
  
  1. New Tables
    - `user_preferences`
      - `user_id` (uuid, references auth.users)
      - `type` (text)
      - `layout` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
  2. Security
    - Enable RLS on `user_preferences` table
    - Add policies for users to manage their own preferences
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS public.user_preferences;

-- Create user_preferences table for storing dashboard layouts
CREATE TABLE public.user_preferences (
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT NOT NULL,
  layout JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (user_id, type)
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON public.user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER handle_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();