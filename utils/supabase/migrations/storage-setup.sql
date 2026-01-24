-- ============================================
-- Supabase Storage Setup for Product Images
-- ============================================
-- Run this in your Supabase SQL Editor

-- Note: Storage buckets are typically created via the Supabase Dashboard
-- Go to Storage > New bucket > Name: "product-images" > Make it public

-- However, you can also create via SQL if you have the proper permissions:
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('product-images', 'product-images', true);

-- Storage policies for the product-images bucket
-- These allow:
-- 1. Anyone to view images (public read)
-- 2. Authenticated users to upload images
-- 3. Only admins to delete images

-- Policy: Allow public read access to all images
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Policy: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Only admins can delete images
CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);
