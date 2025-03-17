import { supabase } from './supabase';
import { Article } from './articles';

/**
 * 特定の記事の変更をリアルタイムで監視する
 * @param articleId 監視する記事のID
 * @param callback 記事が更新された時に呼び出されるコールバック関数
 * @returns 購読解除用の関数
 */
export const subscribeToArticleChanges = (
  articleId: string,
  callback: (article: Article) => void
) => {
  const subscription = supabase
    .channel(`article-${articleId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'articles',
        filter: `id=eq.${articleId}`,
      },
      (payload) => {
        callback(payload.new as Article);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};

/**
 * ユーザーの記事一覧の変更をリアルタイムで監視する
 * @param userId 監視するユーザーのID
 * @param callback 記事リストが更新された時に呼び出されるコールバック関数
 * @returns 購読解除用の関数
 */
export const subscribeToUserArticles = (
  userId: string,
  callback: (article: Article) => void
) => {
  const subscription = supabase
    .channel(`user-articles-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // INSERT, UPDATE, DELETEすべてのイベントを監視
        schema: 'public',
        table: 'articles',
        filter: `author_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new as Article);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}; 