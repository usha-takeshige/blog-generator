import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getArticles, updateArticle, deleteArticle, Article } from '../api';

export default function ManageArticles() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 記事一覧を取得
  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const data = await getArticles(filter);
      setArticles(data || []);
    } catch (error) {
      console.error('記事の取得に失敗しました:', error);
      toast.error('記事の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // フィルターが変更されたら記事を再取得
  useEffect(() => {
    fetchArticles();
  }, [filter]);

  // 記事を削除
  const handleDelete = async (id: string) => {
    if (window.confirm('この記事を削除してもよろしいですか？')) {
      try {
        await deleteArticle(id);
        toast.success('記事を削除しました');
        fetchArticles(); // 記事一覧を再取得
      } catch (error) {
        console.error('記事の削除に失敗しました:', error);
        toast.error('記事の削除に失敗しました');
      }
    }
  };

  // 記事のステータスを変更
  const handleStatusChange = async (id: string, currentStatus: 'draft' | 'published') => {
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    try {
      await updateArticle(id, { status: newStatus });
      toast.success(newStatus === 'published' ? '記事を公開しました' : '記事を下書きに戻しました');
      fetchArticles(); // 記事一覧を再取得
    } catch (error) {
      console.error('記事のステータス変更に失敗しました:', error);
      toast.error('記事のステータス変更に失敗しました');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          戻る
        </button>
        <Link
          to="/articles/create"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          新規記事作成
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">記事一覧</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'published' | 'draft')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">すべての記事</option>
              <option value="published">公開済み</option>
              <option value="draft">下書き</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="p-6 text-center text-gray-500">読み込み中...</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {articles.length > 0 ? (
              articles.map((article) => (
                <div key={article.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{article.title}</h3>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>作成日: {new Date(article.created_at).toLocaleDateString()}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        article.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {article.status === 'published' ? '公開済み' : '下書き'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center space-x-3">
                    <button
                      onClick={() => handleStatusChange(article.id, article.status)}
                      className="px-3 py-1 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {article.status === 'draft' ? '公開する' : '下書きに戻す'}
                    </button>
                    <Link
                      to={`/articles/${article.id}`}
                      className="px-3 py-1 text-sm font-medium rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                    >
                      詳細
                    </Link>
                    <Link
                      to={`/articles/${article.id}/edit`}
                      className="px-3 py-1 text-sm font-medium rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                    >
                      編集
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="px-3 py-1 text-sm font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                記事がありません。新しい記事を作成してください。
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}