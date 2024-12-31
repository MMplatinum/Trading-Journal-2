/*
  # Create Storage Bucket for Trade Screenshots
  
  1. Creates a public bucket for storing trade screenshots
  2. Sets up RLS policies for secure access
*/

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('trade-screenshots', 'trade-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies
CREATE POLICY "Allow public viewing of screenshots"
ON storage.objects FOR SELECT
USING (bucket_id = 'trade-screenshots');

CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'trade-screenshots' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow owners to delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'trade-screenshots' 
  AND auth.uid()::text = owner
);