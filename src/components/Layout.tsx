import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, User, Database } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('ログアウトしました');
      navigate('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
      toast.error('ログアウトに失敗しました');
    }
  };

  // ユーザー名を取得（メタデータから）
  const userName = user?.user_metadata?.name || 'ユーザー';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-semibold text-gray-900">Knowledge Hub</span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link 
                to="/dashboard" 
                className={`text-sm font-medium ${location.pathname === '/dashboard' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                ダッシュボード
              </Link>
              <Link 
                to="/articles/create" 
                className={`text-sm font-medium ${location.pathname === '/articles/create' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                記事作成
              </Link>
              <Link 
                to="/articles/manage" 
                className={`text-sm font-medium ${location.pathname === '/articles/manage' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                記事管理
              </Link>
              <Link 
                to="/supabase-demo" 
                className={`text-sm font-medium flex items-center ${location.pathname === '/supabase-demo' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Database className="w-4 h-4 mr-1" />
                Supabaseデモ
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-sm text-gray-700">{userName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="ログアウト"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}