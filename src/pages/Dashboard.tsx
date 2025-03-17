import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, ListChecks } from 'lucide-react';
import { getArticles, Article } from '../api';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const [recentDrafts, setRecentDrafts] = useState<Article[]>([]);
  const [publishedArticles, setPublishedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        // すべての記事を取得
        const articles = await getArticles('all');
        
        // 下書きと公開済み記事に分ける
        const drafts = articles
          .filter(article => article.status === 'draft')
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .slice(0, 3); // 最新の3件のみ表示
        
        const published = articles
          .filter(article => article.status === 'published')
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .slice(0, 3); // 最新の3件のみ表示
        
        setRecentDrafts(drafts);
        setPublishedArticles(published);
      } catch (error) {
        console.error('記事の取得に失敗しました:', error);
        toast.error('記事の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        <Link
          to="/articles/create"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          新規記事作成
        </Link>
        <Link
          to="/articles/manage"
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ListChecks className="w-5 h-5 mr-2" />
          記事管理
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">最近の下書き</h2>
          {isLoading ? (
            <div className="py-4 text-center text-gray-500">読み込み中...</div>
          ) : recentDrafts.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentDrafts.map(article => (
                <Link
                  key={article.id}
                  to={`/articles/${article.id}`}
                  className="block py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-gray-900 font-medium">{article.title}</h3>
                    <span className="text-sm text-gray-500">
                      最終更新: {new Date(article.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-gray-500">下書きはありません</div>
          )}
        </section>

        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">公開済み記事</h2>
          {isLoading ? (
            <div className="py-4 text-center text-gray-500">読み込み中...</div>
          ) : publishedArticles.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {publishedArticles.map(article => (
                <Link
                  key={article.id}
                  to={`/articles/${article.id}`}
                  className="block py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-gray-900 font-medium">{article.title}</h3>
                    <span className="text-sm text-gray-500">
                      公開日: {new Date(article.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-gray-500">公開済み記事はありません</div>
          )}
        </section>
      </div>
    </div>
  );
}