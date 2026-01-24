-- ============================================
-- User Roles Management for Rattanak Coffee Shop
-- ============================================

-- Set a user as admin by email
-- Replace 'admin@example.com' with the actual admin email
CREATE OR REPLACE FUNCTION public.set_user_as_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET is_admin = TRUE, updated_at = NOW()
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove admin role from a user by email
CREATE OR REPLACE FUNCTION public.remove_admin_role(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET is_admin = FALSE, updated_at = NOW()
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- USAGE EXAMPLES:
-- ============================================

-- To make a user an admin, run:
-- SELECT public.set_user_as_admin('admin@example.com');

-- To remove admin role, run:
-- SELECT public.remove_admin_role('admin@example.com');

-- Or directly update the profiles table:
-- UPDATE public.profiles SET is_admin = TRUE WHERE email = 'admin@example.com';

-- ============================================
-- VIEW ALL USERS WITH THEIR ROLES
-- ============================================
-- SELECT id, email, name, is_admin, created_at FROM public.profiles ORDER BY created_at DESC;
