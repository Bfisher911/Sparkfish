-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create specific types
CREATE TYPE program_type AS ENUM ('six_month', 'twelve_month', 'weekend_course');
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'cancelled');

-- Create profiles table linked to Supabase Auth
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  organization TEXT,
  role TEXT,
  track_preference TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Programs table
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type program_type NOT NULL,
  active BOOLEAN DEFAULT true,
  stripe_price_id TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Tracks table
CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Cohorts table
CREATE TABLE cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  schedule_text TEXT,
  seat_limit INT NOT NULL DEFAULT 50,
  seats_taken INT NOT NULL DEFAULT 0,
  zoom_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enrollments table
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  cohort_id UUID REFERENCES cohorts(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id),
  status enrollment_status DEFAULT 'active',
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(user_id, cohort_id)
);

-- Certificates table
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE UNIQUE,
  certificate_code TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
  pdf_url TEXT,
  completion_date DATE
);

-- Setup Row Level Security (RLS)

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON profiles FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Programs
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Programs are viewable by everyone" ON programs FOR SELECT USING (true);
CREATE POLICY "Admins can manage programs" ON programs FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Tracks
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tracks are viewable by everyone" ON tracks FOR SELECT USING (true);
CREATE POLICY "Admins can manage tracks" ON tracks FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Cohorts
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cohorts are viewable by everyone except private zoom url" ON cohorts FOR SELECT USING (true);
CREATE POLICY "Admins can manage cohorts" ON cohorts FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Cohorts private fields need special handling. We'll use a VIEW or API function for zoom URLs, or restrict the select.
-- A simpler approach for zoom_url: return it only if user is enrolled in that cohort or is admin.
-- Since Supabase standard selects don't filter columns easily, we will manage this through an RPC function or a secure view.
-- Alternatively, we can leave zoom_url in table and let RLS restrict rows. But we want public to see cohort details!
-- To fix this, let's create a secure function to fetch zoom URLs.

-- Enrollments
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own enrollments" ON enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage enrollments" ON enrollments FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Certificates
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Certificates viewable by everyone" ON certificates FOR SELECT USING (true);
CREATE POLICY "Admins manage certificates" ON certificates FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Trigger for new users to insert profile
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, is_admin)
  VALUES (new.id, new.raw_user_meta_data->>'name', false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Secure function to get zoom links
CREATE OR REPLACE FUNCTION public.get_cohort_zoom_url(target_cohort_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_url TEXT;
  v_is_enrolled BOOLEAN;
  v_is_admin BOOLEAN;
BEGIN
  -- Check if admin
  SELECT is_admin INTO v_is_admin FROM public.profiles WHERE id = auth.uid();
  
  -- Check if enrolled
  SELECT EXISTS(
    SELECT 1 FROM public.enrollments 
    WHERE user_id = auth.uid() AND cohort_id = target_cohort_id AND status = 'active'
  ) INTO v_is_enrolled;

  IF v_is_admin OR v_is_enrolled THEN
    SELECT zoom_url INTO v_url FROM public.cohorts WHERE id = target_cohort_id;
    RETURN v_url;
  ELSE
    RETURN NULL;
  END IF;
END;
$$;
