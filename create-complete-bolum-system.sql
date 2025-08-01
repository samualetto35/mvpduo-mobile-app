-- Create complete bölüm system for kıdem 1
-- This script creates all possible bölüm rows and sets up automatic triggers

-- First, create the bolum_questions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.bolum_questions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- e.g., "k1_lvl1_b1", "k1_lvl1_b2"
    kidem INTEGER NOT NULL,
    level INTEGER NOT NULL,
    bolum INTEGER NOT NULL,
    exam_type VARCHAR(10) NOT NULL, -- TYT, AYT
    division VARCHAR(10), -- SAY, EA, SOZ (for AYT)
    q1_id UUID REFERENCES public.questions(id),
    q2_id UUID REFERENCES public.questions(id),
    q3_id UUID REFERENCES public.questions(id),
    q4_id UUID REFERENCES public.questions(id),
    q5_id UUID REFERENCES public.questions(id),
    q6_id UUID REFERENCES public.questions(id),
    q7_id UUID REFERENCES public.questions(id),
    q8_id UUID REFERENCES public.questions(id),
    q9_id UUID REFERENCES public.questions(id),
    q10_id UUID REFERENCES public.questions(id),
    q11_id UUID REFERENCES public.questions(id),
    q12_id UUID REFERENCES public.questions(id),
    q13_id UUID REFERENCES public.questions(id),
    q14_id UUID REFERENCES public.questions(id),
    q15_id UUID REFERENCES public.questions(id),
    q16_id UUID REFERENCES public.questions(id),
    q17_id UUID REFERENCES public.questions(id),
    q18_id UUID REFERENCES public.questions(id),
    q19_id UUID REFERENCES public.questions(id),
    q20_id UUID REFERENCES public.questions(id),
    q21_id UUID REFERENCES public.questions(id),
    q22_id UUID REFERENCES public.questions(id),
    q23_id UUID REFERENCES public.questions(id),
    q24_id UUID REFERENCES public.questions(id),
    q25_id UUID REFERENCES public.questions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bolum_questions_kidem_level_bolum 
ON public.bolum_questions(kidem, level, bolum);

CREATE INDEX IF NOT EXISTS idx_bolum_questions_exam_type 
ON public.bolum_questions(exam_type);

-- Function to create all possible bölüm rows for kıdem 1
CREATE OR REPLACE FUNCTION create_all_k1_bolums()
RETURNS void AS $$
DECLARE
    level_num INTEGER;
    bolum_num INTEGER;
    bolum_name VARCHAR(50);
    division_suffix VARCHAR(10);
    division_name VARCHAR(10);
BEGIN
    -- Create TYT bölüms (no division suffix)
    FOR level_num IN 1..100 LOOP
        FOR bolum_num IN 1..12 LOOP
            bolum_name := 'k1_lvl' || level_num || '_b' || bolum_num;
            
            INSERT INTO public.bolum_questions (name, kidem, level, bolum, exam_type, division)
            VALUES (bolum_name, 1, level_num, bolum_num, 'TYT', NULL)
            ON CONFLICT (name) DO NOTHING;
        END LOOP;
    END LOOP;
    
    -- Create AYT bölüms with divisions (SAY, EA, SOZ)
    FOR division_name IN SELECT unnest(ARRAY['SAY', 'EA', 'SOZ']) LOOP
        FOR level_num IN 1..100 LOOP
            FOR bolum_num IN 1..12 LOOP
                bolum_name := 'k1_lvl' || level_num || '_b' || bolum_num || '_' || division_name;
                
                INSERT INTO public.bolum_questions (name, kidem, level, bolum, exam_type, division)
                VALUES (bolum_name, 1, level_num, bolum_num, 'AYT', division_name)
                ON CONFLICT (name) DO NOTHING;
            END LOOP;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Created all k1 bölüm rows successfully';
END;
$$ LANGUAGE plpgsql;

-- Execute the function to create all bölüm rows
SELECT create_all_k1_bolums();

-- Function to get the correct bölüm name based on question data
CREATE OR REPLACE FUNCTION get_bolum_name(kidem_val INTEGER, level_val INTEGER, bolum_val INTEGER, exam_type_val VARCHAR(10), division_val VARCHAR(10))
RETURNS VARCHAR(50) AS $$
DECLARE
    bolum_name VARCHAR(50);
    division_suffix VARCHAR(10);
BEGIN
    -- Create division suffix for AYT questions
    IF exam_type_val = 'AYT' AND division_val IS NOT NULL THEN
        division_suffix := '_' || division_val;
    ELSE
        division_suffix := '';
    END IF;
    
    -- Create bölüm name
    bolum_name := 'k' || kidem_val || '_lvl' || level_val || '_b' || bolum_val || division_suffix;
    
    RETURN bolum_name;
END;
$$ LANGUAGE plpgsql;

-- Function to handle INSERT operations
CREATE OR REPLACE FUNCTION handle_question_insert()
RETURNS TRIGGER AS $$
DECLARE
    bolum_name VARCHAR(50);
BEGIN
    -- Get the bölüm name for this question
    bolum_name := get_bolum_name(NEW.kidem, NEW.level, NEW.bolum, NEW.exam_type, NEW.division);
    
    -- Find the first empty q*_id column and populate it
    UPDATE public.bolum_questions 
    SET 
        q1_id = CASE WHEN q1_id IS NULL THEN NEW.id ELSE q1_id END,
        q2_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NULL THEN NEW.id ELSE q2_id END,
        q3_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NULL THEN NEW.id ELSE q3_id END,
        q4_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NULL THEN NEW.id ELSE q4_id END,
        q5_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NULL THEN NEW.id ELSE q5_id END,
        q6_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NULL THEN NEW.id ELSE q6_id END,
        q7_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NULL THEN NEW.id ELSE q7_id END,
        q8_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NULL THEN NEW.id ELSE q8_id END,
        q9_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NULL THEN NEW.id ELSE q9_id END,
        q10_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NULL THEN NEW.id ELSE q10_id END,
        q11_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NULL THEN NEW.id ELSE q11_id END,
        q12_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NULL THEN NEW.id ELSE q12_id END,
        q13_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NULL THEN NEW.id ELSE q13_id END,
        q14_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NULL THEN NEW.id ELSE q14_id END,
        q15_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NULL THEN NEW.id ELSE q15_id END,
        q16_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NULL THEN NEW.id ELSE q16_id END,
        q17_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NULL THEN NEW.id ELSE q17_id END,
        q18_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NULL THEN NEW.id ELSE q18_id END,
        q19_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NOT NULL AND q19_id IS NULL THEN NEW.id ELSE q19_id END,
        q20_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NOT NULL AND q19_id IS NOT NULL AND q20_id IS NULL THEN NEW.id ELSE q20_id END,
        q21_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NOT NULL AND q19_id IS NOT NULL AND q20_id IS NOT NULL AND q21_id IS NULL THEN NEW.id ELSE q21_id END,
        q22_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NOT NULL AND q19_id IS NOT NULL AND q20_id IS NOT NULL AND q21_id IS NOT NULL AND q22_id IS NULL THEN NEW.id ELSE q22_id END,
        q23_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NOT NULL AND q19_id IS NOT NULL AND q20_id IS NOT NULL AND q21_id IS NOT NULL AND q22_id IS NOT NULL AND q23_id IS NULL THEN NEW.id ELSE q23_id END,
        q24_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NOT NULL AND q19_id IS NOT NULL AND q20_id IS NOT NULL AND q21_id IS NOT NULL AND q22_id IS NOT NULL AND q23_id IS NOT NULL AND q24_id IS NULL THEN NEW.id ELSE q24_id END,
        q25_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NOT NULL AND q19_id IS NOT NULL AND q20_id IS NOT NULL AND q21_id IS NOT NULL AND q22_id IS NOT NULL AND q23_id IS NOT NULL AND q24_id IS NOT NULL AND q25_id IS NULL THEN NEW.id ELSE q25_id END,
        updated_at = NOW()
    WHERE name = bolum_name;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle UPDATE operations
CREATE OR REPLACE FUNCTION handle_question_update()
RETURNS TRIGGER AS $$
DECLARE
    old_bolum_name VARCHAR(50);
    new_bolum_name VARCHAR(50);
BEGIN
    -- Get old and new bölüm names
    old_bolum_name := get_bolum_name(OLD.kidem, OLD.level, OLD.bolum, OLD.exam_type, OLD.division);
    new_bolum_name := get_bolum_name(NEW.kidem, NEW.level, NEW.bolum, NEW.exam_type, NEW.division);
    
    -- If bölüm location changed, move the question
    IF old_bolum_name != new_bolum_name THEN
        -- Remove from old bölüm
        UPDATE public.bolum_questions 
        SET 
            q1_id = CASE WHEN q1_id = OLD.id THEN NULL ELSE q1_id END,
            q2_id = CASE WHEN q2_id = OLD.id THEN NULL ELSE q2_id END,
            q3_id = CASE WHEN q3_id = OLD.id THEN NULL ELSE q3_id END,
            q4_id = CASE WHEN q4_id = OLD.id THEN NULL ELSE q4_id END,
            q5_id = CASE WHEN q5_id = OLD.id THEN NULL ELSE q5_id END,
            q6_id = CASE WHEN q6_id = OLD.id THEN NULL ELSE q6_id END,
            q7_id = CASE WHEN q7_id = OLD.id THEN NULL ELSE q7_id END,
            q8_id = CASE WHEN q8_id = OLD.id THEN NULL ELSE q8_id END,
            q9_id = CASE WHEN q9_id = OLD.id THEN NULL ELSE q9_id END,
            q10_id = CASE WHEN q10_id = OLD.id THEN NULL ELSE q10_id END,
            q11_id = CASE WHEN q11_id = OLD.id THEN NULL ELSE q11_id END,
            q12_id = CASE WHEN q12_id = OLD.id THEN NULL ELSE q12_id END,
            q13_id = CASE WHEN q13_id = OLD.id THEN NULL ELSE q13_id END,
            q14_id = CASE WHEN q14_id = OLD.id THEN NULL ELSE q14_id END,
            q15_id = CASE WHEN q15_id = OLD.id THEN NULL ELSE q15_id END,
            q16_id = CASE WHEN q16_id = OLD.id THEN NULL ELSE q16_id END,
            q17_id = CASE WHEN q17_id = OLD.id THEN NULL ELSE q17_id END,
            q18_id = CASE WHEN q18_id = OLD.id THEN NULL ELSE q18_id END,
            q19_id = CASE WHEN q19_id = OLD.id THEN NULL ELSE q19_id END,
            q20_id = CASE WHEN q20_id = OLD.id THEN NULL ELSE q20_id END,
            q21_id = CASE WHEN q21_id = OLD.id THEN NULL ELSE q21_id END,
            q22_id = CASE WHEN q22_id = OLD.id THEN NULL ELSE q22_id END,
            q23_id = CASE WHEN q23_id = OLD.id THEN NULL ELSE q23_id END,
            q24_id = CASE WHEN q24_id = OLD.id THEN NULL ELSE q24_id END,
            q25_id = CASE WHEN q25_id = OLD.id THEN NULL ELSE q25_id END,
            updated_at = NOW()
        WHERE name = old_bolum_name;
        
        -- Add to new bölüm (same logic as INSERT)
        UPDATE public.bolum_questions 
        SET 
            q1_id = CASE WHEN q1_id IS NULL THEN NEW.id ELSE q1_id END,
            q2_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NULL THEN NEW.id ELSE q2_id END,
            q3_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NULL THEN NEW.id ELSE q3_id END,
            q4_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NULL THEN NEW.id ELSE q4_id END,
            q5_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NULL THEN NEW.id ELSE q5_id END,
            q6_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NULL THEN NEW.id ELSE q6_id END,
            q7_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NULL THEN NEW.id ELSE q7_id END,
            q8_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NULL THEN NEW.id ELSE q8_id END,
            q9_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NULL THEN NEW.id ELSE q9_id END,
            q10_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NULL THEN NEW.id ELSE q10_id END,
            q11_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NULL THEN NEW.id ELSE q11_id END,
            q12_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NULL THEN NEW.id ELSE q12_id END,
            q13_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NULL THEN NEW.id ELSE q13_id END,
            q14_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NULL THEN NEW.id ELSE q14_id END,
            q15_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NULL THEN NEW.id ELSE q15_id END,
            q16_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NULL THEN NEW.id ELSE q16_id END,
            q17_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NULL THEN NEW.id ELSE q17_id END,
            q18_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NULL THEN NEW.id ELSE q18_id END,
            q19_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NOT NULL AND q19_id IS NULL THEN NEW.id ELSE q19_id END,
            q20_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NOT NULL AND q19_id IS NOT NULL AND q20_id IS NULL THEN NEW.id ELSE q20_id END,
            q21_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NOT NULL AND q19_id IS NOT NULL AND q20_id IS NOT NULL AND q21_id IS NULL THEN NEW.id ELSE q21_id END,
            q22_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NOT NULL AND q19_id IS NOT NULL AND q20_id IS NOT NULL AND q21_id IS NOT NULL AND q22_id IS NULL THEN NEW.id ELSE q22_id END,
            q23_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NOT NULL AND q19_id IS NOT NULL AND q20_id IS NOT NULL AND q21_id IS NOT NULL AND q22_id IS NOT NULL AND q23_id IS NULL THEN NEW.id ELSE q23_id END,
            q24_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NOT NULL AND q19_id IS NOT NULL AND q20_id IS NOT NULL AND q21_id IS NOT NULL AND q22_id IS NOT NULL AND q23_id IS NOT NULL AND q24_id IS NULL THEN NEW.id ELSE q24_id END,
            q25_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NOT NULL AND q19_id IS NOT NULL AND q20_id IS NOT NULL AND q21_id IS NOT NULL AND q22_id IS NOT NULL AND q23_id IS NOT NULL AND q24_id IS NOT NULL AND q25_id IS NULL THEN NEW.id ELSE q25_id END,
            updated_at = NOW()
        WHERE name = new_bolum_name;
    ELSE
        -- If only question content changed (not location), just update the timestamp
        UPDATE public.bolum_questions 
        SET updated_at = NOW()
        WHERE name = new_bolum_name;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle DELETE operations
CREATE OR REPLACE FUNCTION handle_question_delete()
RETURNS TRIGGER AS $$
DECLARE
    bolum_name VARCHAR(50);
BEGIN
    -- Get the bölüm name for the deleted question
    bolum_name := get_bolum_name(OLD.kidem, OLD.level, OLD.bolum, OLD.exam_type, OLD.division);
    
    -- Remove the question ID from the bölüm (set to NULL)
    UPDATE public.bolum_questions 
    SET 
        q1_id = CASE WHEN q1_id = OLD.id THEN NULL ELSE q1_id END,
        q2_id = CASE WHEN q2_id = OLD.id THEN NULL ELSE q2_id END,
        q3_id = CASE WHEN q3_id = OLD.id THEN NULL ELSE q3_id END,
        q4_id = CASE WHEN q4_id = OLD.id THEN NULL ELSE q4_id END,
        q5_id = CASE WHEN q5_id = OLD.id THEN NULL ELSE q5_id END,
        q6_id = CASE WHEN q6_id = OLD.id THEN NULL ELSE q6_id END,
        q7_id = CASE WHEN q7_id = OLD.id THEN NULL ELSE q7_id END,
        q8_id = CASE WHEN q8_id = OLD.id THEN NULL ELSE q8_id END,
        q9_id = CASE WHEN q9_id = OLD.id THEN NULL ELSE q9_id END,
        q10_id = CASE WHEN q10_id = OLD.id THEN NULL ELSE q10_id END,
        q11_id = CASE WHEN q11_id = OLD.id THEN NULL ELSE q11_id END,
        q12_id = CASE WHEN q12_id = OLD.id THEN NULL ELSE q12_id END,
        q13_id = CASE WHEN q13_id = OLD.id THEN NULL ELSE q13_id END,
        q14_id = CASE WHEN q14_id = OLD.id THEN NULL ELSE q14_id END,
        q15_id = CASE WHEN q15_id = OLD.id THEN NULL ELSE q15_id END,
        q16_id = CASE WHEN q16_id = OLD.id THEN NULL ELSE q16_id END,
        q17_id = CASE WHEN q17_id = OLD.id THEN NULL ELSE q17_id END,
        q18_id = CASE WHEN q18_id = OLD.id THEN NULL ELSE q18_id END,
        q19_id = CASE WHEN q19_id = OLD.id THEN NULL ELSE q19_id END,
        q20_id = CASE WHEN q20_id = OLD.id THEN NULL ELSE q20_id END,
        q21_id = CASE WHEN q21_id = OLD.id THEN NULL ELSE q21_id END,
        q22_id = CASE WHEN q22_id = OLD.id THEN NULL ELSE q22_id END,
        q23_id = CASE WHEN q23_id = OLD.id THEN NULL ELSE q23_id END,
        q24_id = CASE WHEN q24_id = OLD.id THEN NULL ELSE q24_id END,
        q25_id = CASE WHEN q25_id = OLD.id THEN NULL ELSE q25_id END,
        updated_at = NOW()
    WHERE name = bolum_name;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trigger_question_insert ON public.questions;
DROP TRIGGER IF EXISTS trigger_question_update ON public.questions;
DROP TRIGGER IF EXISTS trigger_question_delete ON public.questions;

-- Create triggers
CREATE TRIGGER trigger_question_insert
    AFTER INSERT ON public.questions
    FOR EACH ROW
    EXECUTE FUNCTION handle_question_insert();

CREATE TRIGGER trigger_question_update
    AFTER UPDATE ON public.questions
    FOR EACH ROW
    EXECUTE FUNCTION handle_question_update();

CREATE TRIGGER trigger_question_delete
    AFTER DELETE ON public.questions
    FOR EACH ROW
    EXECUTE FUNCTION handle_question_delete();

-- Add RLS policies (drop existing ones first)
DROP POLICY IF EXISTS "Authenticated users can read bolum questions" ON public.bolum_questions;
ALTER TABLE public.bolum_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read bolum questions" ON public.bolum_questions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Function to populate existing questions into the new system
CREATE OR REPLACE FUNCTION populate_existing_questions_to_bolums()
RETURNS void AS $$
DECLARE
    question_record RECORD;
    bolum_name VARCHAR(50);
BEGIN
    -- Loop through all existing questions and add them to bolum_questions
    FOR question_record IN 
        SELECT * FROM public.questions 
        WHERE status = 'approved'
        ORDER BY kidem, level, bolum
    LOOP
        -- Get the bölüm name for this question
        bolum_name := get_bolum_name(question_record.kidem, question_record.level, question_record.bolum, question_record.exam_type, question_record.division);
        
        -- Find the first empty q*_id column and populate it
        UPDATE public.bolum_questions 
        SET 
            q1_id = CASE WHEN q1_id IS NULL THEN question_record.id ELSE q1_id END,
            q2_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NULL THEN question_record.id ELSE q2_id END,
            q3_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NULL THEN question_record.id ELSE q3_id END,
            q4_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NULL THEN question_record.id ELSE q4_id END,
            q5_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NULL THEN question_record.id ELSE q5_id END,
            q6_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NULL THEN question_record.id ELSE q6_id END,
            q7_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NULL THEN question_record.id ELSE q7_id END,
            q8_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NULL THEN question_record.id ELSE q8_id END,
            q9_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NULL THEN question_record.id ELSE q9_id END,
            q10_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NULL THEN question_record.id ELSE q10_id END,
            q11_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NULL THEN question_record.id ELSE q11_id END,
            q12_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NULL THEN question_record.id ELSE q12_id END,
            q13_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NULL THEN question_record.id ELSE q13_id END,
            q14_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NULL THEN question_record.id ELSE q14_id END,
            q15_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NULL THEN question_record.id ELSE q15_id END,
            q16_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NULL THEN question_record.id ELSE q16_id END,
            q17_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NULL THEN question_record.id ELSE q17_id END,
            q18_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NULL THEN question_record.id ELSE q18_id END,
            q19_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NOT NULL AND q19_id IS NULL THEN question_record.id ELSE q19_id END,
            q20_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NOT NULL AND q19_id IS NOT NULL AND q20_id IS NULL THEN question_record.id ELSE q20_id END,
            q21_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NOT NULL AND q19_id IS NOT NULL AND q20_id IS NOT NULL AND q21_id IS NULL THEN question_record.id ELSE q21_id END,
            q22_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NOT NULL AND q19_id IS NOT NULL AND q20_id IS NOT NULL AND q21_id IS NOT NULL AND q22_id IS NULL THEN question_record.id ELSE q22_id END,
            q23_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NOT NULL AND q19_id IS NOT NULL AND q20_id IS NOT NULL AND q21_id IS NOT NULL AND q22_id IS NOT NULL AND q23_id IS NULL THEN question_record.id ELSE q23_id END,
            q24_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NOT NULL AND q19_id IS NOT NULL AND q20_id IS NOT NULL AND q21_id IS NOT NULL AND q22_id IS NOT NULL AND q23_id IS NOT NULL AND q24_id IS NULL THEN question_record.id ELSE q24_id END,
            q25_id = CASE WHEN q1_id IS NOT NULL AND q2_id IS NOT NULL AND q3_id IS NOT NULL AND q4_id IS NOT NULL AND q5_id IS NOT NULL AND q6_id IS NOT NULL AND q7_id IS NOT NULL AND q8_id IS NOT NULL AND q9_id IS NOT NULL AND q10_id IS NOT NULL AND q11_id IS NOT NULL AND q12_id IS NOT NULL AND q13_id IS NOT NULL AND q14_id IS NOT NULL AND q15_id IS NOT NULL AND q16_id IS NOT NULL AND q17_id IS NOT NULL AND q18_id IS NOT NULL AND q19_id IS NOT NULL AND q20_id IS NOT NULL AND q21_id IS NOT NULL AND q22_id IS NOT NULL AND q23_id IS NOT NULL AND q24_id IS NOT NULL AND q25_id IS NULL THEN question_record.id ELSE q25_id END,
            updated_at = NOW()
        WHERE name = bolum_name;
    END LOOP;
    
    RAISE NOTICE 'Populated existing questions into bolum_questions table';
END;
$$ LANGUAGE plpgsql;

-- Execute the function to populate existing questions
SELECT populate_existing_questions_to_bolums();

-- Test query to verify the system works
-- SELECT name, q1_id, q2_id, q3_id FROM public.bolum_questions WHERE name LIKE 'k1_lvl1_b%' ORDER BY name; 