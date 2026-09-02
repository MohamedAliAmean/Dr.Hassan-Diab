-- Hassan Diab Fitness Platform - Initial Schema
-- Run this in Supabase SQL Editor after creating your project

-- =============================================
-- ENUMS
-- =============================================
CREATE TYPE user_role AS ENUM ('admin', 'client', 'lead');
CREATE TYPE experience_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE fitness_goal AS ENUM ('weight_loss', 'muscle_gain', 'performance', 'rehab');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'converted', 'lost');
CREATE TYPE booking_type AS ENUM ('assessment', 'session', 'consultation');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE muscle_group AS ENUM ('chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'full_body');
CREATE TYPE program_status AS ENUM ('active', 'completed', 'paused');
CREATE TYPE media_type AS ENUM ('image', 'video', 'document');

-- =============================================
-- PROFILES (extends auth.users)
-- =============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'client',
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  goals TEXT[],
  experience_level experience_level,
  injuries TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- SITE SETTINGS
-- =============================================
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_settings (key, value) VALUES
  ('trainer_name', 'Hassan Diab'),
  ('tagline', 'Sustainable Strength. Real Results.'),
  ('hero_title', 'Train Smarter. Live Stronger.'),
  ('hero_subtitle', 'Personal coaching built around your body, your schedule, and your goals.'),
  ('whatsapp', ''),
  ('email', ''),
  ('phone', ''),
  ('instagram', ''),
  ('facebook', ''),
  ('address', ''),
  ('hero_image', '');

-- =============================================
-- SERVICES
-- =============================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  currency TEXT NOT NULL DEFAULT 'EGP',
  duration_weeks INT,
  sessions_per_week INT,
  features JSONB DEFAULT '[]',
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- LEADS (Path Finder results)
-- =============================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  goal fitness_goal,
  experience experience_level,
  schedule TEXT,
  injuries TEXT,
  recommended_service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  quiz_answers JSONB DEFAULT '{}',
  status lead_status NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- BOOKINGS
-- =============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type booking_type NOT NULL DEFAULT 'assessment',
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_min INT NOT NULL DEFAULT 15,
  status booking_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- EXERCISES
-- =============================================
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  muscle_group muscle_group NOT NULL,
  difficulty experience_level NOT NULL DEFAULT 'beginner',
  equipment TEXT[] DEFAULT '{}',
  video_url TEXT,
  thumbnail_url TEXT,
  instructions TEXT[] DEFAULT '{}',
  common_mistakes TEXT[] DEFAULT '{}',
  tips TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- PROGRAMS
-- =============================================
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status program_status NOT NULL DEFAULT 'active',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE program_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  day_name TEXT NOT NULL,
  notes TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE program_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_day_id UUID NOT NULL REFERENCES program_days(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sets INT,
  reps TEXT,
  rest_seconds INT,
  notes TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

-- =============================================
-- WORKOUT LOGS
-- =============================================
CREATE TABLE workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  program_day_id UUID REFERENCES program_days(id) ON DELETE SET NULL,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration_min INT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE workout_log_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_log_id UUID NOT NULL REFERENCES workout_logs(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  set_number INT NOT NULL,
  reps_done INT,
  weight_kg DECIMAL(6,2),
  notes TEXT
);

-- =============================================
-- PROGRESS TRACKING
-- =============================================
CREATE TABLE progress_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg DECIMAL(5,2),
  body_fat_pct DECIMAL(4,2),
  chest_cm DECIMAL(5,2),
  waist_cm DECIMAL(5,2),
  hips_cm DECIMAL(5,2),
  arm_cm DECIMAL(5,2),
  thigh_cm DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  weight_kg DECIMAL(6,2),
  reps INT,
  achieved_at DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT
);

-- =============================================
-- TRANSFORMATIONS
-- =============================================
CREATE TABLE transformations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  goal TEXT,
  duration_weeks INT,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  before_image TEXT,
  after_image TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE transformation_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transformation_id UUID NOT NULL REFERENCES transformations(id) ON DELETE CASCADE,
  month_number INT NOT NULL,
  title TEXT NOT NULL,
  weight_kg DECIMAL(5,2),
  body_fat_pct DECIMAL(4,2),
  description TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

-- =============================================
-- CHALLENGES
-- =============================================
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  rules TEXT[] DEFAULT '{}',
  start_date DATE,
  end_date DATE,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score INT NOT NULL DEFAULT 0,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(challenge_id, client_id)
);

-- =============================================
-- MESSAGES
-- =============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- BLOG
-- =============================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- MEDIA LIBRARY
-- =============================================
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type media_type NOT NULL,
  file_size INT,
  alt_text TEXT,
  folder TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_bookings_scheduled ON bookings(scheduled_at);
CREATE INDEX idx_exercises_published ON exercises(is_published);
CREATE INDEX idx_programs_client ON programs(client_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id, is_read);
CREATE INDEX idx_blog_published ON blog_posts(is_published, published_at);

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_log_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE transformation_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PROFILES
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin full access profiles" ON profiles FOR ALL USING (is_admin());

-- SITE SETTINGS
CREATE POLICY "Public read site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin write site settings" ON site_settings FOR ALL USING (is_admin());

-- SERVICES
CREATE POLICY "Public read active services" ON services FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin manage services" ON services FOR ALL USING (is_admin());

-- LEADS (public insert for path finder, admin read)
CREATE POLICY "Anyone can submit lead" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage leads" ON leads FOR ALL USING (is_admin());

-- BOOKINGS
CREATE POLICY "Anyone can create booking" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users read own bookings" ON bookings FOR SELECT USING (client_id = auth.uid() OR is_admin());
CREATE POLICY "Admin manage bookings" ON bookings FOR ALL USING (is_admin());

-- EXERCISES
CREATE POLICY "Public read published exercises" ON exercises FOR SELECT USING (is_published = true OR is_admin());
CREATE POLICY "Admin manage exercises" ON exercises FOR ALL USING (is_admin());

-- PROGRAMS
CREATE POLICY "Clients read own programs" ON programs FOR SELECT USING (client_id = auth.uid() OR is_admin());
CREATE POLICY "Admin manage programs" ON programs FOR ALL USING (is_admin());

CREATE POLICY "Clients read own program days" ON program_days FOR SELECT
  USING (EXISTS (SELECT 1 FROM programs p WHERE p.id = program_id AND (p.client_id = auth.uid() OR is_admin())));
CREATE POLICY "Admin manage program days" ON program_days FOR ALL USING (is_admin());

CREATE POLICY "Clients read own program exercises" ON program_exercises FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM program_days pd
    JOIN programs p ON p.id = pd.program_id
    WHERE pd.id = program_day_id AND (p.client_id = auth.uid() OR is_admin())
  ));
CREATE POLICY "Admin manage program exercises" ON program_exercises FOR ALL USING (is_admin());

-- WORKOUT LOGS
CREATE POLICY "Clients manage own logs" ON workout_logs FOR ALL USING (client_id = auth.uid() OR is_admin());
CREATE POLICY "Clients manage own log sets" ON workout_log_sets FOR ALL
  USING (EXISTS (SELECT 1 FROM workout_logs wl WHERE wl.id = workout_log_id AND (wl.client_id = auth.uid() OR is_admin())));

-- PROGRESS
CREATE POLICY "Clients manage own progress" ON progress_entries FOR ALL USING (client_id = auth.uid() OR is_admin());
CREATE POLICY "Clients manage own PRs" ON personal_records FOR ALL USING (client_id = auth.uid() OR is_admin());

-- TRANSFORMATIONS
CREATE POLICY "Public read published transformations" ON transformations FOR SELECT USING (is_published = true OR is_admin());
CREATE POLICY "Admin manage transformations" ON transformations FOR ALL USING (is_admin());
CREATE POLICY "Public read milestones" ON transformation_milestones FOR SELECT
  USING (EXISTS (SELECT 1 FROM transformations t WHERE t.id = transformation_id AND (t.is_published = true OR is_admin())));
CREATE POLICY "Admin manage milestones" ON transformation_milestones FOR ALL USING (is_admin());

-- CHALLENGES
CREATE POLICY "Public read active challenges" ON challenges FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin manage challenges" ON challenges FOR ALL USING (is_admin());
CREATE POLICY "Clients manage own participation" ON challenge_participants FOR ALL USING (client_id = auth.uid() OR is_admin());

-- MESSAGES
CREATE POLICY "Users read own messages" ON messages FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid() OR is_admin());
CREATE POLICY "Users send messages" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid() OR is_admin());
CREATE POLICY "Users update own received messages" ON messages FOR UPDATE USING (receiver_id = auth.uid() OR is_admin());

-- BLOG
CREATE POLICY "Public read published posts" ON blog_posts FOR SELECT USING (is_published = true OR is_admin());
CREATE POLICY "Admin manage blog" ON blog_posts FOR ALL USING (is_admin());

-- MEDIA
CREATE POLICY "Public read media" ON media FOR SELECT USING (true);
CREATE POLICY "Admin manage media" ON media FOR ALL USING (is_admin());

-- =============================================
-- STORAGE BUCKETS (run in Supabase Dashboard > Storage)
-- =============================================
-- Create these buckets manually or via Supabase CLI:
-- avatars, exercises, transformations, blog, challenges, services, general
-- All buckets: public read, admin write
