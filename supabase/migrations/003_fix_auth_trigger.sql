-- Fix: "Failed to create user: Database error creating new user"
-- Run this in Supabase SQL Editor

-- 1) Recreate profile trigger safely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  selected_role user_role := 'client';
  meta_role TEXT;
BEGIN
  meta_role := NEW.raw_user_meta_data->>'role';

  IF meta_role IN ('admin', 'client', 'lead') THEN
    selected_role := meta_role::user_role;
  END IF;

  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'User'),
    selected_role
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 2) Allow profile creation (needed for signup / admin create user)
DROP POLICY IF EXISTS "Allow profile insert on signup" ON profiles;
CREATE POLICY "Allow profile insert on signup"
  ON profiles
  FOR INSERT
  WITH CHECK (true);

-- 3) Make sure is_admin does not break inserts
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;
