import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getArticleById, Article } from '../api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

interface Section {
  title: string;
  content: string;
  theme?: string;
}

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getArticleById(id);
        setArticle(data);
        
        // 記事の内容をセクションに分割
        try {
          const parsedContent = JSON.parse(data.content);
          if (Array.isArray(parsedContent) && parsedContent.length > 0) {
            setSections(parsedContent);
          } else {
            // JSONだが配列でない場合
            setSections([{ title: 'Content', content: data.content }]);
          }
        } catch (parseError) {
          // JSONでない場合は単一のセクションとして扱う
          setSections([{ title: 'Content', content: data.content }]);
        }
      } catch (err) {
        console.error('記事の取得に失敗しました:', err);
        setError('記事の取得に失敗しました');
        toast.error('記事の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {error || '記事が見つかりませんでした'}
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          戻る
        </button>
      </div>
    );
  }

  // 記事の著者かどうかを確認
  const isAuthor = user?.id === article.author_id;

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
        {isAuthor && (
          <Link
            to={`/articles/${id}/edit`}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Edit2 className="w-5 h-5 mr-2" />
            記事を編集
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-8">
            <span>ステータス: {article.status === 'published' ? '公開済み' : '下書き'}</span>
            <span>•</span>
            <span>作成日: {new Date(article.created_at).toLocaleDateString()}</span>
            <span>•</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              article.status === 'published'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {article.status === 'published' ? '公開済み' : '下書き'}
            </span>
          </div>

          <div className="prose prose-indigo max-w-none">
            {sections.map((section, index) => (
              <div key={index} className="mb-6">
                {section.title !== 'Content' && (
                  <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                )}
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-500">
            最終更新日: {new Date(article.updated_at).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}