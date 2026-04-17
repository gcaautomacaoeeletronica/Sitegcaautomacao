-- ==========================================
-- GCA Automação - Supabase Schema Setup
-- (Versão Segura - Ignora se já existir)
-- ==========================================

-- 1. Criar tabela de leads (usuários mandam mensagem)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false
);

-- 2. Criar tabela de blog_posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    author TEXT
);

-- 3. Criar tabela de marcas
CREATE TABLE IF NOT EXISTS public.marcas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    icon_color TEXT
);

-- 4. Criar tabela de downloads (manuais) ligados a marcas
CREATE TABLE IF NOT EXISTS public.downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    marca_id UUID REFERENCES public.marcas(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    link TEXT NOT NULL
);

-- 5. Criar tabela de configurações do site (JSON)
CREATE TABLE IF NOT EXISTS public.site_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    key TEXT UNIQUE NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- ==========================================
-- Configuração de RLS (Row Level Security)
-- ==========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem para evitar erro de duplicata
DROP POLICY IF EXISTS "Permitir inserção anônima em leads" ON public.leads;
DROP POLICY IF EXISTS "Permitir leitura/escrita autenticada em leads" ON public.leads;

DROP POLICY IF EXISTS "Leitura pública de blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Escrita autenticada em blog_posts" ON public.blog_posts;

DROP POLICY IF EXISTS "Leitura pública de marcas" ON public.marcas;
DROP POLICY IF EXISTS "Escrita autenticada em marcas" ON public.marcas;

DROP POLICY IF EXISTS "Leitura pública de downloads" ON public.downloads;
DROP POLICY IF EXISTS "Escrita autenticada em downloads" ON public.downloads;

DROP POLICY IF EXISTS "Leitura pública de site_config" ON public.site_config;
DROP POLICY IF EXISTS "Escrita autenticada em site_config" ON public.site_config;

-- Criar as Políticas Seguras
CREATE POLICY "Permitir inserção anônima em leads" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Permitir leitura/escrita autenticada em leads" ON public.leads FOR ALL TO authenticated USING (true);

CREATE POLICY "Leitura pública de blog_posts" ON public.blog_posts FOR SELECT TO public USING (true);
CREATE POLICY "Escrita autenticada em blog_posts" ON public.blog_posts FOR ALL TO authenticated USING (true);

CREATE POLICY "Leitura pública de marcas" ON public.marcas FOR SELECT TO public USING (true);
CREATE POLICY "Escrita autenticada em marcas" ON public.marcas FOR ALL TO authenticated USING (true);

CREATE POLICY "Leitura pública de downloads" ON public.downloads FOR SELECT TO public USING (true);
CREATE POLICY "Escrita autenticada em downloads" ON public.downloads FOR ALL TO authenticated USING (true);

CREATE POLICY "Leitura pública de site_config" ON public.site_config FOR SELECT TO public USING (true);
CREATE POLICY "Escrita autenticada em site_config" ON public.site_config FOR ALL TO authenticated USING (true);

-- ==========================================
-- Ativar Realtime (Replicação) nas tabelas
-- ==========================================
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;

ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.marcas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.downloads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_config;


-- ==========================================
-- Configuração do Storage (Arquivos/Imagens)
-- ==========================================

-- 1. Criar o Bucket 'site-assets' e torná-lo público
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Leitura pública de imagens" ON storage.objects;
DROP POLICY IF EXISTS "Upload para admin" ON storage.objects;
DROP POLICY IF EXISTS "Update para admin" ON storage.objects;
DROP POLICY IF EXISTS "Delete para admin" ON storage.objects;

-- 3. Criar políticas de segurança para garantir que imagens apareçam e apenas usuários logados enviem
CREATE POLICY "Leitura pública de imagens"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'site-assets');

CREATE POLICY "Upload para admin"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "Update para admin"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'site-assets');

CREATE POLICY "Delete para admin"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'site-assets');

-- ==========================================
-- 4. Aumentar o limite de upload do bucket para 150MB
-- ==========================================
UPDATE storage.buckets
SET file_size_limit = 157286400
WHERE id = 'site-assets';
