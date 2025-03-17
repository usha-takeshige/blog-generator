-- RLSを有効化
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- ユーザーテーブルのポリシー
CREATE POLICY "ユーザーは自分のプロフィールのみ参照可能" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "ユーザーは自分のプロフィールのみ更新可能" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- 記事テーブルのポリシー
CREATE POLICY "ユーザーは自分の記事のみ参照可能" 
  ON public.articles 
  FOR SELECT 
  USING (auth.uid() = author_id);

CREATE POLICY "公開記事は全員が参照可能" 
  ON public.articles 
  FOR SELECT 
  USING (status = 'published');

CREATE POLICY "ユーザーは自分の記事のみ作成可能" 
  ON public.articles 
  FOR INSERT 
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "ユーザーは自分の記事のみ更新可能" 
  ON public.articles 
  FOR UPDATE 
  USING (auth.uid() = author_id);

CREATE POLICY "ユーザーは自分の記事のみ削除可能" 
  ON public.articles 
  FOR DELETE 
  USING (auth.uid() = author_id); 