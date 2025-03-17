import { supabase } from './supabase';
import { Database } from './types';

export type Article = Database['public']['Tables']['articles']['Row'];
export type ArticleInsert = Database['public']['Tables']['articles']['Insert'];
export type ArticleUpdate = Database['public']['Tables']['articles']['Update'];

/**
 * 新しい記事を作成する
 * @param article 作成する記事のデータ（author_idは自動的に現在のユーザーIDが設定される）
 * @returns 作成された記事データ
 */
export const createArticle = async (article: Omit<ArticleInsert, 'author_id'>) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) throw userError;
  
  const { data, error } = await supabase
    .from('articles')
    .insert({
      ...article,
      author_id: userData.user.id,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * 記事一覧を取得する
 * @param status 取得する記事のステータス（draft, published, all）
 * @returns 記事の配列
 */
export const getArticles = async (status?: 'draft' | 'published' | 'all') => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) throw userError;
  
  let query = supabase
    .from('articles')
    .select('*')
    .eq('author_id', userData.user.id);
  
  if (status && status !== 'all') {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query.order('updated_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

/**
 * 特定のIDの記事を取得する
 * @param id 取得する記事のID
 * @returns 記事データ
 */
export const getArticleById = async (id: string) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * 記事を更新する
 * @param id 更新する記事のID
 * @param updates 更新するフィールドと値
 * @returns 更新された記事データ
 */
export const updateArticle = async (id: string, updates: ArticleUpdate) => {
  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * 記事を削除する
 * @param id 削除する記事のID
 * @returns 削除が成功したかどうか
 */
export const deleteArticle = async (id: string) => {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}; 