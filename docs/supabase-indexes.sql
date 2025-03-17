-- 記事タイトルの検索を高速化するインデックス
CREATE INDEX IF NOT EXISTS idx_articles_title ON public.articles (title);

-- 記事ステータスでの検索を高速化するインデックス
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles (status);

-- 著者IDでの検索を高速化するインデックス
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles (author_id);

-- 更新日時での検索を高速化するインデックス（最新記事の取得用）
CREATE INDEX IF NOT EXISTS idx_articles_updated_at ON public.articles (updated_at DESC);

-- 作成日時での検索を高速化するインデックス
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles (created_at DESC);

-- ユーザーのメールアドレスでの検索を高速化するインデックス
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);

-- ユーザーの部署での検索を高速化するインデックス
CREATE INDEX IF NOT EXISTS idx_users_department ON public.users (department);

-- 複合インデックス：著者IDとステータスの組み合わせでの検索を高速化
CREATE INDEX IF NOT EXISTS idx_articles_author_status ON public.articles (author_id, status); 