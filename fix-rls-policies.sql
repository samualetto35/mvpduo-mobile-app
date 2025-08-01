-- Fix RLS policies for user_profiles table
-- Run this in Supabase SQL Editor

-- First, let's check the current policies
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

-- Create new comprehensive policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Also fix policies for other tables that might have issues
-- User progress policies
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;

CREATE POLICY "Users can view own progress" ON public.user_progress
    FOR ALL USING (auth.uid() = user_id);

-- User question attempts policies
DROP POLICY IF EXISTS "Users can view own attempts" ON public.user_question_attempts;
DROP POLICY IF EXISTS "Users can insert own attempts" ON public.user_question_attempts;

CREATE POLICY "Users can view own attempts" ON public.user_question_attempts
    FOR ALL USING (auth.uid() = user_id);

-- User sessions policies
DROP POLICY IF EXISTS "Users can view own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON public.user_sessions;

CREATE POLICY "Users can view own sessions" ON public.user_sessions
    FOR ALL USING (auth.uid() = user_id);

-- User achievements policies
DROP POLICY IF EXISTS "Users can view own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON public.user_achievements;

CREATE POLICY "Users can view own achievements" ON public.user_achievements
    FOR ALL USING (auth.uid() = user_id);

-- User statistics policies
DROP POLICY IF EXISTS "Users can view own statistics" ON public.user_statistics;
DROP POLICY IF EXISTS "Users can insert own statistics" ON public.user_statistics;
DROP POLICY IF EXISTS "Users can update own statistics" ON public.user_statistics;

CREATE POLICY "Users can view own statistics" ON public.user_statistics
    FOR ALL USING (auth.uid() = user_id);

-- Questions are readable by all authenticated users
DROP POLICY IF EXISTS "Authenticated users can read questions" ON public.questions;

CREATE POLICY "Authenticated users can read questions" ON public.questions
    FOR SELECT USING (auth.role() = 'authenticated' AND status = 'approved'); 

-- Fix RLS policies for user_question_attempts table
DROP POLICY IF EXISTS "Users can insert their own question attempts" ON public.user_question_attempts;
DROP POLICY IF EXISTS "Users can view their own question attempts" ON public.user_question_attempts;
DROP POLICY IF EXISTS "Users can update their own question attempts" ON public.user_question_attempts;

-- Create RLS policies for user_question_attempts
CREATE POLICY "Users can insert their own question attempts" ON public.user_question_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own question attempts" ON public.user_question_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own question attempts" ON public.user_question_attempts
    FOR UPDATE USING (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE public.user_question_attempts ENABLE ROW LEVEL SECURITY; 

-- Fix RLS policies for user_profiles table
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY; 