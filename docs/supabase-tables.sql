-- Users テーブル（Supabase Authと連携）
-- CREATE TABLE IF NOT EXISTS public.users (
--   id UUID REFERENCES auth.users(id) PRIMARY KEY,
--   name VARCHAR(100) NOT NULL,
--   email VARCHAR(255) NOT NULL UNIQUE,
--   department VARCHAR(100),
--   position VARCHAR(100),
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- Articles テーブル
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  author_id UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 更新時にupdated_atを自動更新するトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 