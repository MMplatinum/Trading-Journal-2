-- Enable storage
CREATE EXTENSION IF NOT EXISTS "storage" SCHEMA "extensions";

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('trade-screenshots', 'trade-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can view own screenshots"
ON storage.objects FOR SELECT
USING (bucket_id = 'trade-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own screenshots"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'trade-screenshots' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (LOWER(storage.extension(name)) = 'jpg' OR 
       LOWER(storage.extension(name)) = 'jpeg' OR 
       LOWER(storage.extension(name)) = 'png' OR 
       LOWER(storage.extension(name)) = 'gif')
);

CREATE POLICY "Users can delete own screenshots"
ON storage.objects FOR DELETE
USING (bucket_id = 'trade-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);