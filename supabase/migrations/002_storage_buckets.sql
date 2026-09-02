-- Storage buckets and policies
-- Run AFTER 001_initial_schema.sql in Supabase SQL Editor

INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars', 'avatars', true),
  ('exercises', 'exercises', true),
  ('transformations', 'transformations', true),
  ('blog', 'blog', true),
  ('challenges', 'challenges', true),
  ('services', 'services', true),
  ('general', 'general', true)
ON CONFLICT (id) DO NOTHING;

-- Public read for all buckets
CREATE POLICY "Public read storage" ON storage.objects
  FOR SELECT USING (bucket_id IN ('avatars','exercises','transformations','blog','challenges','services','general'));

-- Admin upload (authenticated users with admin role)
CREATE POLICY "Admin upload storage" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('avatars','exercises','transformations','blog','challenges','services','general')
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admin update storage" ON storage.objects
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete storage" ON storage.objects
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create admin user (run after creating user in Supabase Auth dashboard)
-- UPDATE profiles SET role = 'admin' WHERE id = 'YOUR-USER-UUID-HERE';
