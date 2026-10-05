-- AI Scam Guardian Database Schema
-- Supabase PostgreSQL with Row Level Security (RLS)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Synced with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Scans Table
CREATE TABLE IF NOT EXISTS public.scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    scan_type TEXT NOT NULL CHECK (scan_type IN ('message', 'url')),
    input_text TEXT NOT NULL,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('SAFE', 'SUSPICIOUS', 'HIGH')),
    category TEXT NOT NULL,
    confidence NUMERIC(4,2) DEFAULT 0.95,
    explanation TEXT NOT NULL,
    scam_pattern TEXT,
    safer_alternative TEXT,
    indicators JSONB DEFAULT '{}'::jsonb,
    red_flags JSONB DEFAULT '[]'::jsonb,
    suspicious_phrases JSONB DEFAULT '[]'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    score_breakdown JSONB DEFAULT '[]'::jsonb,
    url_details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Education Articles Table
CREATE TABLE IF NOT EXISTS public.education_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    summary TEXT NOT NULL,
    what_it_is TEXT NOT NULL,
    warning_signs JSONB NOT NULL DEFAULT '[]'::jsonb,
    example_scenario TEXT NOT NULL,
    attacker_goals TEXT NOT NULL,
    safety_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    icon_name TEXT DEFAULT 'ShieldAlert',
    read_time TEXT DEFAULT '3 min read',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. User Statistics Summary View
CREATE OR REPLACE VIEW public.user_statistics AS
SELECT 
    user_id,
    COUNT(*) AS total_scans,
    COUNT(*) FILTER (WHERE risk_level = 'HIGH') AS high_risk_count,
    COUNT(*) FILTER (WHERE risk_level = 'SUSPICIOUS') AS suspicious_count,
    COUNT(*) FILTER (WHERE risk_level = 'SAFE') AS safe_count,
    ROUND(AVG(risk_score), 1) AS average_risk_score,
    MAX(created_at) AS last_scan_at
FROM public.scans
GROUP BY user_id;

-- Indexes for optimal querying
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON public.scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON public.scans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scans_risk_level ON public.scans(risk_level);
CREATE INDEX IF NOT EXISTS idx_scans_category ON public.scans(category);
CREATE INDEX IF NOT EXISTS idx_education_slug ON public.education_articles(slug);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_articles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- RLS Policies for Scans
CREATE POLICY "Users can view their own scans"
    ON public.scans FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create scans"
    ON public.scans FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own scans"
    ON public.scans FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for Education Articles (Public Read)
CREATE POLICY "Anyone can view education articles"
    ON public.education_articles FOR SELECT
    TO authenticated, anon
    USING (true);

-- Trigger to create profile when auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
