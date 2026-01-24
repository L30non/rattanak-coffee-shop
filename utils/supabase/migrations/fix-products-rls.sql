-- ============================================
-- Fix Products RLS Policies for Add Product
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

-- Create permissive policies (for development/demo purposes)
CREATE POLICY "Anyone can insert products"
  ON public.products FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Anyone can update products"
  ON public.products FOR UPDATE
  USING (TRUE);

CREATE POLICY "Anyone can delete products"
  ON public.products FOR DELETE
  USING (TRUE);
