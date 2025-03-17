import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createArticle, getArticles, updateArticle, deleteArticle, Article } from '../api';
import { toast } from 'react-hot-toast';

/**
 * Supabaseの機能をデモンストレーションするコンポーネント
 */
const SupabaseDemo: React.FC = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // 記事一覧を取得
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticles();
      setArticles(data || []);
    } catch (error) {
      console.error('記事取得エラー:', error);
      toast.error('記事の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // コンポーネントマウント時に記事一覧を取得
  useEffect(() => {
    if (user) {
      fetchArticles();
    }
  }, [user]);

  // 記事を作成
  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error('タイトルと内容を入力してください');
      return;
    }

    setLoading(true);
    try {
      await createArticle({
        title,
        content,
        status: 'draft'
      });
      toast.success('記事を作成しました');
      setTitle('');
      setContent('');
      fetchArticles();
    } catch (error) {
      console.error('記事作成エラー:', error);
      toast.error('記事の作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 記事を更新
  const handleUpdateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !title || !content) {
      toast.error('タイトルと内容を入力してください');
      return;
    }

    setLoading(true);
    try {
      await updateArticle(editingArticle.id, {
        title,
        content
      });
      toast.success('記事を更新しました');
      setTitle('');
      setContent('');
      setEditingArticle(null);
      fetchArticles();
    } catch (error) {
      console.error('記事更新エラー:', error);
      toast.error('記事の更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 記事を削除
  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm('この記事を削除してもよろしいですか？')) {
      return;
    }

    setLoading(true);
    try {
      await deleteArticle(id);
      toast.success('記事を削除しました');
      fetchArticles();
    } catch (error) {
      console.error('記事削除エラー:', error);
      toast.error('記事の削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 編集モードを開始
  const startEditing = (article: Article) => {
    setEditingArticle(article);
    setTitle(article.title);
    setContent(article.content);
  };

  // 編集モードをキャンセル
  const cancelEditing = () => {
    setEditingArticle(null);
    setTitle('');
    setContent('');
  };

  if (!user) {
    return <div className="p-4">ログインしてください</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Supabaseデモ</h1>
      
      {/* 記事フォーム */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingArticle ? '記事を編集' : '新しい記事を作成'}
        </h2>
        <form onSubmit={editingArticle ? handleUpdateArticle : handleCreateArticle}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タイトル
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              内容
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[150px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
              disabled={loading}
            >
              {loading ? '処理中...' : editingArticle ? '更新する' : '作成する'}
            </button>
            
            {editingArticle && (
              <button
                type="button"
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={cancelEditing}
              >
                キャンセル
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* 記事一覧 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">記事一覧</h2>
        
        {loading && <p className="text-gray-500">読み込み中...</p>}
        
        {!loading && articles.length === 0 && (
          <p className="text-gray-500">記事がありません</p>
        )}
        
        <div className="space-y-4">
          {articles.map((article) => (
            <div key={article.id} className="border border-gray-200 p-4 rounded-lg">
              <h3 className="text-lg font-medium">{article.title}</h3>
              <p className="text-gray-600 mt-2 mb-4">{article.content}</p>
              <div className="flex gap-2">
                <button
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors text-sm"
                  onClick={() => startEditing(article)}
                >
                  編集
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors text-sm"
                  onClick={() => handleDeleteArticle(article.id)}
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupabaseDemo; 