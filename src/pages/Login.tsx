import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        await login({ email, password });
        toast.success('ログインしました');
        navigate('/dashboard');
      } else {
        if (!name) {
          toast.error('名前を入力してください');
          setLoading(false);
          return;
        }
        
        if (password.length < 6) {
          toast.error('パスワードは6文字以上で入力してください');
          setLoading(false);
          return;
        }
        
        try {
          await register({ email, password, name });
          toast.success('アカウントが作成されました');
          // 登録後すぐにログインページに戻る
          setIsLogin(true);
        } catch (registerError) {
          console.error('登録エラー:', registerError);
          toast.error('アカウント作成に失敗しました。もう一度お試しください。');
        }
      }
    } catch (error: any) {
      console.error('認証エラー:', error);
      
      // エラーメッセージの詳細を表示
      let errorMessage = error?.message || (isLogin ? 'ログインに失敗しました' : 'アカウント作成に失敗しました');
      let errorCode = error?.code || '';
      
      // エラーメッセージをわかりやすく変換
      if (errorMessage.includes('Database error saving new user') || errorMessage.includes('500') || errorCode === '500') {
        errorMessage = 'サーバーエラーが発生しました。しばらく経ってからもう一度お試しください。';
      } else if (errorMessage.includes('User already registered')) {
        errorMessage = 'このメールアドレスは既に登録されています。';
      } else if (errorMessage.includes('Password should be at least')) {
        errorMessage = 'パスワードは6文字以上で入力してください。';
      } else if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = 'メールアドレスまたはパスワードが正しくありません。';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-100 p-3 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Hub</h1>
          <p className="text-gray-600 mt-2">Share your expertise with colleagues</p>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            className={`flex-1 py-2 text-center rounded-lg transition-colors ${
              isLogin
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setIsLogin(true)}
          >
            ログイン
          </button>
          <button
            className={`flex-1 py-2 text-center rounded-lg transition-colors ${
              !isLogin
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setIsLogin(false)}
          >
            登録
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                名前
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="山田 太郎"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              パスワード
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
            disabled={loading}
          >
            {loading ? '処理中...' : isLogin ? 'ログイン' : 'アカウント作成'}
          </button>
        </form>
      </div>
    </div>
  );
}