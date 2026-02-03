-- Create addresses table for storing user shipping addresses
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label TEXT, -- "Home", "Work", "Office", etc.
  street_line_1 TEXT NOT NULL,
  street_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT,
  zip_code TEXT NOT NULL,
  country TEXT DEFAULT 'USA' NOT NULL,
  phone TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Add index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);

-- Add index on default addresses for quick default lookups
CREATE INDEX IF NOT EXISTS idx_addresses_is_default ON public.addresses(user_id, is_default) WHERE is_default = TRUE;

-- Add address_id column to orders table (nullable for backward compatibility)
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL;

-- Create index on orders.address_id
CREATE INDEX IF NOT EXISTS idx_orders_address_id ON public.orders(address_id);

-- Enable Row Level Security
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own addresses
CREATE POLICY "Users can view their own addresses"
  ON public.addresses
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own addresses
CREATE POLICY "Users can insert their own addresses"
  ON public.addresses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own addresses
CREATE POLICY "Users can update their own addresses"
  ON public.addresses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own addresses
CREATE POLICY "Users can delete their own addresses"
  ON public.addresses
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Admins can view all addresses
CREATE POLICY "Admins can view all addresses"
  ON public.addresses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

-- Function to ensure only one default address per user
CREATE OR REPLACE FUNCTION public.ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting this address as default, unset all other defaults for this user
  IF NEW.is_default = TRUE THEN
    UPDATE public.addresses
    SET is_default = FALSE
    WHERE user_id = NEW.user_id 
      AND id != NEW.id 
      AND is_default = TRUE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to maintain single default address constraint
CREATE TRIGGER trigger_ensure_single_default_address
  BEFORE INSERT OR UPDATE ON public.addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_single_default_address();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_addresses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_addresses_timestamp
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_addresses_updated_at();
