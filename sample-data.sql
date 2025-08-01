-- Sample data insertion script for Supabase
-- Run this in Supabase SQL Editor

-- Sample TYT Questions
INSERT INTO public.questions (question_id, exam_type, kidem, level, bolum, difficulty, question_text, sub_text, correct_answer, options) VALUES
('TYT_001', 'TYT', 1, 1, 1, 1, '2 + 3 = ?', NULL, '5', '["3", "4", "5", "6"]'),
('TYT_002', 'TYT', 1, 1, 1, 1, 'Hangi şehir Türkiye''nin başkentidir?', NULL, 'Ankara', '["İstanbul", "Ankara", "İzmir", "Bursa"]'),
('TYT_003', 'TYT', 1, 1, 1, 2, 'Bir üçgenin iç açıları toplamı kaç derecedir?', NULL, '180', '["90", "180", "270", "360"]'),
('TYT_004', 'TYT', 1, 1, 2, 1, 'Hangi element periyodik tabloda "Fe" sembolü ile gösterilir?', NULL, 'Demir', '["Flor", "Demir", "Fosfor", "Fermiyum"]'),
('TYT_005', 'TYT', 1, 1, 2, 2, 'Bir dairenin çevresi nasıl hesaplanır?', 'π (pi) sayısını 3.14 olarak alın', '2πr', '["πr²", "2πr", "4πr", "πr"]'),
('TYT_006', 'TYT', 1, 2, 1, 1, 'Hangi gezegen Güneş''e en yakındır?', NULL, 'Merkür', '["Venüs", "Merkür", "Mars", "Dünya"]'),
('TYT_007', 'TYT', 1, 2, 1, 2, 'Bir sayının %20''si 40 ise, bu sayı kaçtır?', NULL, '200', '["80", "200", "160", "240"]'),
('TYT_008', 'TYT', 1, 2, 2, 1, 'Hangi organ kanı temizler?', NULL, 'Böbrek', '["Kalp", "Böbrek", "Karaciğer", "Akciğer"]'),
('TYT_009', 'TYT', 1, 3, 1, 2, 'Bir üçgenin alanı nasıl hesaplanır?', 'Taban ve yükseklik verilmiştir', '(taban × yükseklik) / 2', '["taban × yükseklik", "(taban × yükseklik) / 2", "taban + yükseklik", "taban²"]'),
('TYT_010', 'TYT', 1, 3, 2, 3, 'Bir kimyasal reaksiyonda hangi kanun korunur?', 'Kütle ve enerji korunumu', 'Kütle korunumu', '["Enerji korunumu", "Kütle korunumu", "Momentum korunumu", "Hız korunumu"]');

-- Sample AYT SAY Questions
INSERT INTO public.questions (question_id, exam_type, division, kidem, level, bolum, difficulty, question_text, sub_text, correct_answer, options) VALUES
('AYT_SAY_001', 'AYT', 'SAY', 1, 1, 1, 1, 'x² + 5x + 6 = 0 denkleminin kökleri nelerdir?', NULL, 'x₁ = -2, x₂ = -3', '["x₁ = 2, x₂ = 3", "x₁ = -2, x₂ = -3", "x₁ = 1, x₂ = 6", "x₁ = -1, x₂ = -6"]'),
('AYT_SAY_002', 'AYT', 'SAY', 1, 1, 1, 2, 'Bir fonksiyonun türevi sıfır olduğunda ne olur?', 'Kritik nokta analizi', 'Fonksiyonun yerel ekstremumu olabilir', '["Fonksiyon sürekli değildir", "Fonksiyonun yerel ekstremumu olabilir", "Fonksiyon sabittir", "Fonksiyon artandır"]'),
('AYT_SAY_003', 'AYT', 'SAY', 1, 1, 2, 1, 'Hangi element periyodik tabloda alkali metaldir?', NULL, 'Sodyum', '["Kalsiyum", "Sodyum", "Magnezyum", "Potasyum"]'),
('AYT_SAY_004', 'AYT', 'SAY', 1, 2, 1, 2, 'Bir vektörün büyüklüğü nasıl hesaplanır?', 'Kartezyen koordinatlarda', '√(x² + y² + z²)', '["x + y + z", "√(x² + y² + z²)", "x² + y² + z²", "|x| + |y| + |z|"]'),
('AYT_SAY_005', 'AYT', 'SAY', 1, 2, 2, 3, 'Bir integralin fiziksel anlamı nedir?', 'Alan hesaplama', 'Eğri altındaki alan', '["Eğrinin eğimi", "Eğri altındaki alan", "Eğrinin uzunluğu", "Eğrinin simetriği"]');

-- Sample AYT EA Questions
INSERT INTO public.questions (question_id, exam_type, division, kidem, level, bolum, difficulty, question_text, sub_text, correct_answer, options) VALUES
('AYT_EA_001', 'AYT', 'EA', 1, 1, 1, 1, 'Bir matrisin determinantı sıfır ise ne olur?', NULL, 'Matris tekil (singular) olur', '["Matris birim matristir", "Matris tekil (singular) olur", "Matris simetriktir", "Matris ortogonaldir"]'),
('AYT_EA_002', 'AYT', 'EA', 1, 1, 1, 2, 'Bir olasılık dağılımının beklenen değeri nasıl hesaplanır?', 'Ayrık rastgele değişken için', 'Σ(x × P(X=x))', '["Σx", "Σ(x × P(X=x))", "ΣP(X=x)", "max(x)"]'),
('AYT_EA_003', 'AYT', 'EA', 1, 1, 2, 1, 'Bir fonksiyonun tanım kümesi nedir?', NULL, 'Fonksiyonun tanımlı olduğu değerler', '["Fonksiyonun aldığı değerler", "Fonksiyonun tanımlı olduğu değerler", "Fonksiyonun sıfırları", "Fonksiyonun ekstremumları"]'),
('AYT_EA_004', 'AYT', 'EA', 1, 2, 1, 2, 'Bir dizinin limiti nasıl hesaplanır?', 'Sonsuz dizi için', 'n → ∞ için dizi değeri', '["İlk terim", "Son terim", "n → ∞ için dizi değeri", "Ortalama"]'),
('AYT_EA_005', 'AYT', 'EA', 1, 2, 2, 3, 'Bir optimizasyon probleminin çözümünde Lagrange çarpanları ne işe yarar?', 'Kısıtlı optimizasyon', 'Kısıtları hesaba katar', '["Değişkenleri çarpar", "Kısıtları hesaba katar", "Fonksiyonu böler", "Limit hesaplar"]');

-- Sample AYT SOZ Questions
INSERT INTO public.questions (question_id, exam_type, division, kidem, level, bolum, difficulty, question_text, sub_text, correct_answer, options) VALUES
('AYT_SOZ_001', 'AYT', 'SOZ', 1, 1, 1, 1, 'Hangi edebi tür düzyazıdır?', NULL, 'Roman', '["Şiir", "Roman", "Tiyatro", "Destan"]'),
('AYT_SOZ_002', 'AYT', 'SOZ', 1, 1, 1, 2, 'Bir cümlenin öğeleri nelerdir?', 'Temel öğeler', 'Özne ve yüklem', '["Özne ve yüklem", "Nesne ve tümleç", "Zarf ve sıfat", "Edat ve bağlaç"]'),
('AYT_SOZ_003', 'AYT', 'SOZ', 1, 1, 2, 1, 'Hangi tarih olayı 1453''te gerçekleşmiştir?', NULL, 'İstanbul''un fethi', '["Malazgirt Savaşı", "İstanbul''un fethi", "Çanakkale Savaşı", "Kurtuluş Savaşı"]'),
('AYT_SOZ_004', 'AYT', 'SOZ', 1, 2, 1, 2, 'Bir coğrafi bölgenin iklimi neye bağlıdır?', 'Temel faktörler', 'Enlem ve yükseklik', '["Sadece enlem", "Enlem ve yükseklik", "Sadece yükseklik", "Sadece boylam"]'),
('AYT_SOZ_005', 'AYT', 'SOZ', 1, 2, 2, 3, 'Bir felsefi akımın temel özelliği nedir?', 'Sistemli düşünce', 'Tutarlı görüş sistemi', '["Rastgele düşünceler", "Tutarlı görüş sistemi", "Sadece eleştiri", "Sadece övgü"]');

-- Update all questions to approved status
UPDATE public.questions SET status = 'approved' WHERE status = 'pending'; 