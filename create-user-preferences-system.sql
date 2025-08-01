-- Create user preferences and email verification system

-- Create user_exam_preferences table
CREATE TABLE IF NOT EXISTS public.user_exam_preferences (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tyt_enabled BOOLEAN DEFAULT false,
    ayt_say_enabled BOOLEAN DEFAULT false,
    ayt_ea_enabled BOOLEAN DEFAULT false,
    ayt_soz_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create email_verification table
CREATE TABLE IF NOT EXISTS public.email_verification (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    verification_code VARCHAR(6),
    verification_link VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_exam_preferences_user_id 
ON public.user_exam_preferences(user_id);

CREATE INDEX IF NOT EXISTS idx_email_verification_user_id 
ON public.email_verification(user_id);

CREATE INDEX IF NOT EXISTS idx_email_verification_code 
ON public.email_verification(verification_code);

-- Function to create user preferences when user signs up
CREATE OR REPLACE FUNCTION handle_new_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
    -- Create user exam preferences
    INSERT INTO public.user_exam_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Create email verification record
    INSERT INTO public.email_verification (user_id, email, verification_code, expires_at)
    VALUES (
        NEW.id, 
        NEW.email, 
        LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0'),
        NOW() + INTERVAL '24 hours'
    )
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new user preferences
DROP TRIGGER IF EXISTS trigger_new_user_preferences ON auth.users;
CREATE TRIGGER trigger_new_user_preferences
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user_preferences();

-- Function to generate verification code
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS VARCHAR(6) AS $$
BEGIN
    RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to create verification link
CREATE OR REPLACE FUNCTION generate_verification_link(user_email VARCHAR, user_id UUID)
RETURNS VARCHAR AS $$
BEGIN
    RETURN 'https://your-app-domain.com/verify?email=' || user_email || '&id=' || user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to send verification code
CREATE OR REPLACE FUNCTION send_verification_code(user_email VARCHAR, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    verification_code VARCHAR(6);
BEGIN
    -- Generate new verification code
    verification_code := generate_verification_code();
    
    -- Update or insert verification record
    INSERT INTO public.email_verification (user_id, email, verification_code, expires_at)
    VALUES (user_id, user_email, verification_code, NOW() + INTERVAL '24 hours')
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        verification_code = EXCLUDED.verification_code,
        expires_at = EXCLUDED.expires_at,
        verified_at = NULL;
    
    -- In a real app, you would send the email here
    -- For now, we'll just return true
    RAISE NOTICE 'Verification code % sent to %', verification_code, user_email;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to verify code
CREATE OR REPLACE FUNCTION verify_email_code(user_id UUID, code VARCHAR(6))
RETURNS BOOLEAN AS $$
DECLARE
    verification_record RECORD;
BEGIN
    -- Get verification record
    SELECT * INTO verification_record 
    FROM public.email_verification 
    WHERE user_id = verify_email_code.user_id 
    AND verification_code = verify_email_code.code
    AND expires_at > NOW()
    AND verified_at IS NULL;
    
    IF verification_record IS NULL THEN
        RETURN false;
    END IF;
    
    -- Mark as verified
    UPDATE public.email_verification 
    SET verified_at = NOW()
    WHERE user_id = verify_email_code.user_id;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has verified email
CREATE OR REPLACE FUNCTION is_email_verified(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    verification_record RECORD;
BEGIN
    SELECT * INTO verification_record 
    FROM public.email_verification 
    WHERE user_id = is_email_verified.user_id;
    
    RETURN verification_record.verified_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has set exam preferences
CREATE OR REPLACE FUNCTION has_exam_preferences(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    preferences_record RECORD;
BEGIN
    SELECT * INTO preferences_record 
    FROM public.user_exam_preferences 
    WHERE user_id = has_exam_preferences.user_id;
    
    RETURN preferences_record.tyt_enabled OR 
           preferences_record.ayt_say_enabled OR 
           preferences_record.ayt_ea_enabled OR 
           preferences_record.ayt_soz_enabled;
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies
ALTER TABLE public.user_exam_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_verification ENABLE ROW LEVEL SECURITY;

-- User exam preferences policies
DROP POLICY IF EXISTS "Users can view their own exam preferences" ON public.user_exam_preferences;
DROP POLICY IF EXISTS "Users can update their own exam preferences" ON public.user_exam_preferences;

CREATE POLICY "Users can view their own exam preferences" ON public.user_exam_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own exam preferences" ON public.user_exam_preferences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exam preferences" ON public.user_exam_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Email verification policies
DROP POLICY IF EXISTS "Users can view their own email verification" ON public.email_verification;
DROP POLICY IF EXISTS "Users can update their own email verification" ON public.email_verification;

CREATE POLICY "Users can view their own email verification" ON public.email_verification
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own email verification" ON public.email_verification
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email verification" ON public.email_verification
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.user_exam_preferences TO authenticated;
GRANT ALL ON public.email_verification TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated; 