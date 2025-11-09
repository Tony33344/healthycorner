-- ============================================
-- TABLE: SITE_CONTENT (Generic CMS key/value)
-- ============================================
CREATE TABLE IF NOT EXISTS public.site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT,
  json JSONB DEFAULT '{}'::jsonb,
  image_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(section, key)
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public can read published content
CREATE POLICY "Public can read site content"
ON public.site_content
FOR SELECT
TO anon, authenticated
USING (published = true);

-- Admins can manage all
CREATE POLICY "Admins can manage site content"
ON public.site_content
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Seed defaults for About section
INSERT INTO public.site_content (section, key, value) VALUES
  ('about', 'heading', 'Your Journey to Wellness Begins Here'),
  ('about', 'intro1', 'Nestled in the breathtaking Camp Menina, Healthy Corner is more than just a wellness retreat—it''s a transformative experience that reconnects you with your body, mind, and nature.'),
  ('about', 'intro2', 'We combine ancient wisdom with modern wellness practices, offering a unique blend of nutritious cuisine, yoga, the powerful Wim Hof method, and invigorating ice baths. Our mission is to help you discover your optimal health and vitality in the pure Alpine air.')
ON CONFLICT (section, key) DO NOTHING;
