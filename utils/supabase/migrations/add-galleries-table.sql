-- ============================================
-- Rattanak Coffee Shop - Galleries table (admin CRUD)
-- ============================================
-- Run this in the Supabase SQL editor.

-- ============================================
-- 1. GALLERIES TABLE
-- ============================================
CREATE TABLE public.galleries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  category TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;

-- Public can read everything (gallery page is public-facing)
CREATE POLICY "Galleries are viewable by everyone"
  ON public.galleries FOR SELECT
  USING (TRUE);

-- Admin-only writes (mirrors the orders admin policy pattern)
CREATE POLICY "Admins can insert galleries"
  ON public.galleries FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admins can update galleries"
  ON public.galleries FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admins can delete galleries"
  ON public.galleries FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Index for category filtering
CREATE INDEX idx_galleries_category ON public.galleries(category);

-- updated_at trigger (reuses public.update_updated_at_column() from the base schema)
CREATE TRIGGER update_galleries_updated_at
  BEFORE UPDATE ON public.galleries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 2. SEED - migrate the existing hardcoded gallery images
-- ============================================
INSERT INTO public.galleries (src, alt, category, sort_order) VALUES
  ('https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/gallery/gallery-1.webp', 'Rattanak Coffee roasting facility', 'Roastery', 1),
  ('https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/gallery/gallery-2.jpg', 'Fresh coffee beans being prepared', 'Beans', 2),
  ('https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/gallery/gallery-3.jpg', 'Professional espresso machine in action', 'Machines', 3),
  ('https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/gallery/gallery-4.webp', 'Latte art being created by a barista', 'Barista', 4),
  ('https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/gallery/gallery-5.webp', 'Coffee accessories and brewing tools', 'Accessories', 5),
  ('https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/gallery/gallery-6.jpg', 'Rattanak Coffee shop interior', 'Shop', 6),
  ('https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/gallery/gallery-7.jpg', 'Coffee cupping session', 'Events', 7),
  ('https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/gallery/gallery-8.jpg', 'Green coffee beans before roasting', 'Beans', 8),
  ('https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/gallery/gallery-9.jpg', 'Barista training workshop', 'Events', 9),
  ('https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/gallery/gallery-10.webp', 'Coffee delivery and packaging', 'Shop', 10),
  ('https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/gallery/gallery-11.avif', 'Espresso extraction close-up', 'Machines', 11),
  ('https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/gallery/gallery-12.avif', 'Rattanak Coffee team at work', 'Roastery', 12);
