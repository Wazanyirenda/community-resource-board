-- Create storage bucket for resource images
INSERT INTO storage.buckets (id, name, public) VALUES ('resource-images', 'resource-images', true);

-- Set up storage policies for resource images
-- Allow authenticated users to upload images
CREATE POLICY "Users can upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'resource-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own images
CREATE POLICY "Users can update own images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'resource-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'resource-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public access to view images
CREATE POLICY "Anyone can view images" ON storage.objects
FOR SELECT USING (bucket_id = 'resource-images');

