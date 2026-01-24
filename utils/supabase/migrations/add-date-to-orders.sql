-- ============================================
-- Migration: Add 'date' column to orders table
-- Run this in Supabase SQL Editor
-- ============================================

-- Add the date column to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL;

-- Update existing orders to use created_at as the date
UPDATE public.orders 
SET date = created_at 
WHERE date IS NULL OR date = TIMEZONE('utc'::TEXT, NOW());

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' AND table_schema = 'public';
