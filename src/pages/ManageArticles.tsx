import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Article {
  id: string;
  title: string;
  status: 'draft' | 'published';
  createdAt: string;
}

const MOCK_ARTICLES: Article[] = [
  { id: '1', title: 'Getting Started with React', status: 'published', createdAt: '2024-03-20' },
  { id: '2', title: 'TypeScript Best Practices', status: 'draft', createdAt: '2024-03-18' },
  { id: '3', title: 'Modern CSS Techniques', status: 'published', createdAt: '2024-03-15' },
  { id: '4', title: 'Introduction to Vite', status: 'draft', createdAt: '2024-03-10' },
];

export default function ManageArticles() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);

  const filteredArticles = articles.filter(article => {
    if (filter === 'all') return true;
    return article.status === filter;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      setArticles(prev => prev.filter(article => article.id !== id));
      toast.success('Article deleted successfully');
    }
  };

  const handleStatusChange = (id: string) => {
    setArticles(prev => prev.map(article => {
      if (article.id === id) {
        const newStatus = article.status === 'draft' ? 'published' : 'draft';
        toast.success(`Article ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`);
        return { ...article, status: newStatus };
      }
      return article;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <Link
          to="/articles/create"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          New Article
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Articles</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'published' | 'draft')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Articles</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredArticles.map((article) => (
            <div key={article.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{article.title}</h3>
                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                  <span>Created: {new Date(article.createdAt).toLocaleDateString()}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    article.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="ml-4 flex items-center space-x-3">
                <button
                  onClick={() => handleStatusChange(article.id)}
                  className="px-3 py-1 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {article.status === 'draft' ? 'Publish' : 'Unpublish'}
                </button>
                <Link
                  to={`/articles/${article.id}`}
                  className="px-3 py-1 text-sm font-medium rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="px-3 py-1 text-sm font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredArticles.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No articles found. Create your first article!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}