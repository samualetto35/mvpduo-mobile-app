-- Create bölüm table
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

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_bolum_questions_kidem_level_bolum 
ON public.bolum_questions(kidem, level, bolum);

CREATE INDEX IF NOT EXISTS idx_bolum_questions_exam_type 
ON public.bolum_questions(exam_type);

-- Function to automatically populate bolum_questions table
CREATE OR REPLACE FUNCTION populate_bolum_questions()
RETURNS TRIGGER AS $$
DECLARE
    bolum_name VARCHAR(50);
    division_suffix VARCHAR(10);
BEGIN
    -- Create division suffix for AYT questions
    IF NEW.exam_type = 'AYT' AND NEW.division IS NOT NULL THEN
        division_suffix := '_' || NEW.division;
    ELSE
        division_suffix := '';
    END IF;
    
    -- Create bölüm name
    bolum_name := 'k' || NEW.kidem || '_lvl' || NEW.level || '_b' || NEW.bolum || division_suffix;
    
    -- Check if bölüm exists, if not create it
    INSERT INTO public.bolum_questions (name, kidem, level, bolum, exam_type, division)
    VALUES (bolum_name, NEW.kidem, NEW.level, NEW.bolum, NEW.exam_type, NEW.division)
    ON CONFLICT (name) DO NOTHING;
    
    -- Update the corresponding bölüm with the new question
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

-- Create trigger to automatically populate bolum_questions when a question is inserted
DROP TRIGGER IF EXISTS trigger_populate_bolum_questions ON public.questions;
CREATE TRIGGER trigger_populate_bolum_questions
    AFTER INSERT ON public.questions
    FOR EACH ROW
    EXECUTE FUNCTION populate_bolum_questions();

-- Function to handle question updates
CREATE OR REPLACE FUNCTION update_bolum_questions()
RETURNS TRIGGER AS $$
DECLARE
    bolum_name VARCHAR(50);
    division_suffix VARCHAR(10);
    old_bolum_name VARCHAR(50);
    old_division_suffix VARCHAR(10);
BEGIN
    -- Handle the old bölüm name (for when kidem/level/bolum changes)
    IF OLD.exam_type = 'AYT' AND OLD.division IS NOT NULL THEN
        old_division_suffix := '_' || OLD.division;
    ELSE
        old_division_suffix := '';
    END IF;
    old_bolum_name := 'k' || OLD.kidem || '_lvl' || OLD.level || '_b' || OLD.bolum || old_division_suffix;
    
    -- Handle the new bölüm name
    IF NEW.exam_type = 'AYT' AND NEW.division IS NOT NULL THEN
        division_suffix := '_' || NEW.division;
    ELSE
        division_suffix := '';
    END IF;
    bolum_name := 'k' || NEW.kidem || '_lvl' || NEW.level || '_b' || NEW.bolum || division_suffix;
    
    -- If bölüm location changed, remove from old bölüm and add to new bölüm
    IF old_bolum_name != bolum_name THEN
        -- Remove from old bölüm (set the question ID to NULL)
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
        INSERT INTO public.bolum_questions (name, kidem, level, bolum, exam_type, division)
        VALUES (bolum_name, NEW.kidem, NEW.level, NEW.bolum, NEW.exam_type, NEW.division)
        ON CONFLICT (name) DO NOTHING;
        
        -- Update the new bölüm with the question
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
    ELSE
        -- If only question content changed (not location), just update the timestamp
        UPDATE public.bolum_questions 
        SET updated_at = NOW()
        WHERE name = bolum_name;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle question deletions
CREATE OR REPLACE FUNCTION delete_from_bolum_questions()
RETURNS TRIGGER AS $$
DECLARE
    bolum_name VARCHAR(50);
    division_suffix VARCHAR(10);
BEGIN
    -- Create bölüm name for the deleted question
    IF OLD.exam_type = 'AYT' AND OLD.division IS NOT NULL THEN
        division_suffix := '_' || OLD.division;
    ELSE
        division_suffix := '';
    END IF;
    bolum_name := 'k' || OLD.kidem || '_lvl' || OLD.level || '_b' || OLD.bolum || division_suffix;
    
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

-- Create trigger for UPDATE
DROP TRIGGER IF EXISTS trigger_update_bolum_questions ON public.questions;
CREATE TRIGGER trigger_update_bolum_questions
    AFTER UPDATE ON public.questions
    FOR EACH ROW
    EXECUTE FUNCTION update_bolum_questions();

-- Create trigger for DELETE
DROP TRIGGER IF EXISTS trigger_delete_bolum_questions ON public.questions;
CREATE TRIGGER trigger_delete_bolum_questions
    AFTER DELETE ON public.questions
    FOR EACH ROW
    EXECUTE FUNCTION delete_from_bolum_questions();

-- Function to populate existing questions into bolum_questions table
CREATE OR REPLACE FUNCTION populate_existing_questions()
RETURNS void AS $$
DECLARE
    question_record RECORD;
    bolum_name VARCHAR(50);
    division_suffix VARCHAR(10);
BEGIN
    -- Loop through all existing questions
    FOR question_record IN 
        SELECT * FROM public.questions 
        WHERE status = 'approved'
        ORDER BY kidem, level, bolum
    LOOP
        -- Create division suffix for AYT questions
        IF question_record.exam_type = 'AYT' AND question_record.division IS NOT NULL THEN
            division_suffix := '_' || question_record.division;
        ELSE
            division_suffix := '';
        END IF;
        
        -- Create bölüm name
        bolum_name := 'k' || question_record.kidem || '_lvl' || question_record.level || '_b' || question_record.bolum || division_suffix;
        
        -- Insert or update bolum_questions
        INSERT INTO public.bolum_questions (name, kidem, level, bolum, exam_type, division)
        VALUES (bolum_name, question_record.kidem, question_record.level, question_record.bolum, question_record.exam_type, question_record.division)
        ON CONFLICT (name) DO NOTHING;
        
        -- Update the corresponding bölüm with the question
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
END;
$$ LANGUAGE plpgsql;

-- Execute the function to populate existing questions
SELECT populate_existing_questions();

-- Add RLS policies for bolum_questions table
ALTER TABLE public.bolum_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read bolum questions" ON public.bolum_questions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Sample query to test the new table
-- SELECT * FROM public.bolum_questions WHERE exam_type = 'TYT' ORDER BY kidem, level, bolum; 