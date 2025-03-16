import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Article {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

const MOCK_ARTICLE: Article = {
  id: '1',
  title: 'Getting Started with React',
  content: `
# Getting Started with React

React is a popular JavaScript library for building user interfaces. This guide will help you understand the basics.

## Key Concepts

### Components
Components are the building blocks of React applications. They let you split the UI into independent, reusable pieces.

### Props
Props are read-only components. They are immutable and help make your components reusable.

### State
State is a way to store data that can change over time within a component.

## Best Practices

1. Keep components small and focused
2. Use functional components with hooks
3. Maintain proper component hierarchy
4. Follow React naming conventions

## Common Challenges

- State management in large applications
- Component lifecycle understanding
- Performance optimization
- Testing strategies

## Conclusion

React provides a powerful and flexible way to build modern web applications. With these fundamentals, you're ready to start your React journey.
`,
  status: 'published',
  authorName: 'John Doe',
  createdAt: '2024-03-20T10:00:00Z',
  updatedAt: '2024-03-20T15:30:00Z'
};

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        // In a real application, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setArticle(MOCK_ARTICLE);
      } catch (error) {
        console.error('Error fetching article:', error);
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

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Go back
        </button>
      </div>
    );
  }

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
          to={`/articles/${id}/edit`}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Edit2 className="w-5 h-5 mr-2" />
          Edit Article
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-8">
            <span>By {article.authorName}</span>
            <span>•</span>
            <span>Published {new Date(article.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              article.status === 'published'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
            </span>
          </div>

          <div className="prose prose-indigo max-w-none">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-500">
            Last updated: {new Date(article.updatedAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}