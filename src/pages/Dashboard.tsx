import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, ListChecks } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  updatedAt: string;
  status: 'draft' | 'published';
}

const recentDrafts: Article[] = [
  { id: '1', title: 'Getting Started with React', updatedAt: '2024-03-20', status: 'draft' },
  { id: '2', title: 'TypeScript Best Practices', updatedAt: '2024-03-18', status: 'draft' },
  { id: '3', title: 'Modern CSS Techniques', updatedAt: '2024-03-15', status: 'draft' }
];

const publishedArticles: Article[] = [
  { id: '4', title: 'Introduction to Vite', updatedAt: '2024-03-22', status: 'published' },
  { id: '5', title: 'State Management in 2024', updatedAt: '2024-03-21', status: 'published' },
  { id: '6', title: 'Web Performance Tips', updatedAt: '2024-03-20', status: 'published' }
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        <Link
          to="/articles/create"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          New Article
        </Link>
        <Link
          to="/articles/manage"
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ListChecks className="w-5 h-5 mr-2" />
          Manage Articles
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Drafts</h2>
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
                    Last updated: {new Date(article.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Published Articles</h2>
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
                    Published: {new Date(article.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}