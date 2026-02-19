-- 1. Create Paintings Table
CREATE TABLE IF NOT EXISTS public.paintings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    image_url TEXT,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    logo_url TEXT,
    bio_text TEXT,
    instagram_username TEXT,
    whatsapp_number TEXT,
    banner_offer_text TEXT,
    is_offer_active BOOLEAN DEFAULT false,
    contact_email TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_row CHECK (id = 1)
);

-- 3. Insert Initial Settings
INSERT INTO public.site_settings (id, bio_text)
VALUES (1, 'Modern Minimalist Artist Portfolio')
ON CONFLICT (id) DO NOTHING;

-- 4. Enable RLS
ALTER TABLE public.paintings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies (Public Read Access)
CREATE POLICY "Allow public read-only access to paintings" ON public.paintings
    FOR SELECT USING (true);

CREATE POLICY "Allow public read-only access to settings" ON public.site_settings
    FOR SELECT USING (true);

-- 6. Create Service Role Policies (Admin Bypass)
-- Supabase handles authenticated management by default, but you can add specific policies here if needed.
