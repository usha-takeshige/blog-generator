# Supabase実装ガイド

このガイドでは、社内ノウハウ共有ブログ記事作成支援アプリケーションにおけるSupabaseの実装手順を詳細に説明します。

## 目次

1. [Supabaseプロジェクトのセットアップ](#1-supabaseプロジェクトのセットアップ)
2. [認証機能の実装](#2-認証機能の実装)
3. [データベース設計と実装](#3-データベース設計と実装)
4. [Row Level Security (RLS)の設定](#4-row-level-securityrlsの設定)
5. [APIクライアントの実装](#5-apiクライアントの実装)
6. [フロントエンドとの統合](#6-フロントエンドとの統合)
7. [リアルタイム機能の実装](#7-リアルタイム機能の実装)
8. [バックアップと可用性の設定](#8-バックアップと可用性の設定)

## 1. Supabaseプロジェクトのセットアップ

### 1.1 Supabaseアカウント作成とプロジェクト作成

1. [Supabase](https://supabase.com/)にアクセスし、アカウントを作成
2. 新しいプロジェクトを作成
   - プロジェクト名: `blog-generator`
   - データベースパスワードを設定
   - リージョンを選択（日本に近いリージョンを推奨）

### 1.2 環境変数の設定

1. `.env.example`ファイルを更新

```
# DeepSeek API設定
DEEPSEEK_API_KEY=deepseek_api

# 環境設定
NODE_ENV=development

# Supabase設定
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

2. `.env`ファイルを更新

```
VITE_DEEPSEEK_API_KEY=deepseek_api
NODE_ENV=development
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 1.3 必要なパッケージのインストール

```bash
npm install @supabase/supabase-js
```

## 2. 認証機能の実装

### 2.1 Supabase認証設定

1. Supabaseダッシュボードで認証設定を行う
   - Email認証を有効化
   - サインアップを有効化
   - リダイレクトURLを設定（例: `http://localhost:5173/auth/callback`）

### 2.2 認証クライアントの作成

1. `src/api/supabase.ts`ファイルを作成

```typescript
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URLまたはAnonymous Keyが設定されていません。');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

2. `src/api/types.ts`ファイルを更新して、Supabase型定義を追加

```typescript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          department: string | null;
          position: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          department?: string | null;
          position?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          department?: string | null;
          position?: string | null;
          created_at?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          title: string;
          content: string;
          status: 'draft' | 'published';
          author_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          status: 'draft' | 'published';
          author_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          status?: 'draft' | 'published';
          author_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// 既存の型定義はそのまま残す
// ... existing code ...
```

### 2.3 認証関連APIの実装

1. `src/api/auth.ts`ファイルを作成

```typescript
import { supabase } from './supabase';

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  name: string;
  department?: string;
  position?: string;
}

export const registerUser = async (userData: UserRegistration) => {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        name: userData.name,
        department: userData.department,
        position: userData.position,
      }
    }
  });

  if (error) throw error;
  return data;
};

export const loginUser = async ({ email, password }: UserCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};
```

2. `src/api/index.ts`ファイルを更新

```typescript
export * from './deepseek';
export * from './auth';
export * from './articles';
export * from './supabase';
```

## 3. データベース設計と実装

### 3.1 Supabaseでのテーブル作成

1. Supabaseダッシュボードで以下のSQLを実行

```sql
-- Users テーブル（Supabase Authと連携）
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  department VARCHAR(100),
  position VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Articles テーブル
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  author_id UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 更新時にupdated_atを自動更新するトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### 3.2 記事関連APIの実装

1. `src/api/articles.ts`ファイルを作成

```typescript
import { supabase } from './supabase';
import { Database } from './types';

export type Article = Database['public']['Tables']['articles']['Row'];
export type ArticleInsert = Database['public']['Tables']['articles']['Insert'];
export type ArticleUpdate = Database['public']['Tables']['articles']['Update'];

export const createArticle = async (article: Omit<ArticleInsert, 'author_id'>) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) throw userError;
  
  const { data, error } = await supabase
    .from('articles')
    .insert({
      ...article,
      author_id: userData.user.id,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getArticles = async (status?: 'draft' | 'published' | 'all') => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) throw userError;
  
  let query = supabase
    .from('articles')
    .select('*')
    .eq('author_id', userData.user.id);
  
  if (status && status !== 'all') {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query.order('updated_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getArticleById = async (id: string) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateArticle = async (id: string, updates: ArticleUpdate) => {
  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteArticle = async (id: string) => {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};
```

## 4. Row Level Security (RLS)の設定

### 4.1 RLSポリシーの設定

1. Supabaseダッシュボードで以下のSQLを実行

```sql
-- RLSを有効化
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- ユーザーテーブルのポリシー
CREATE POLICY "ユーザーは自分のプロフィールのみ参照可能" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "ユーザーは自分のプロフィールのみ更新可能" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- 記事テーブルのポリシー
CREATE POLICY "ユーザーは自分の記事のみ参照可能" 
  ON public.articles 
  FOR SELECT 
  USING (auth.uid() = author_id);

CREATE POLICY "公開記事は全員が参照可能" 
  ON public.articles 
  FOR SELECT 
  USING (status = 'published');

CREATE POLICY "ユーザーは自分の記事のみ作成可能" 
  ON public.articles 
  FOR INSERT 
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "ユーザーは自分の記事のみ更新可能" 
  ON public.articles 
  FOR UPDATE 
  USING (auth.uid() = author_id);

CREATE POLICY "ユーザーは自分の記事のみ削除可能" 
  ON public.articles 
  FOR DELETE 
  USING (auth.uid() = author_id);
```

## 5. APIクライアントの実装

### 5.1 認証コンテキストの作成

1. `src/contexts/AuthContext.tsx`ファイルを作成

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, loginUser, logoutUser, registerUser, UserCredentials, UserRegistration } from '../api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: UserCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: UserRegistration) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 初期ユーザー状態の取得
    const getInitialUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user || null);
      } catch (error) {
        console.error('認証状態の取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialUser();

    // 認証状態変更のリスナー
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (credentials: UserCredentials) => {
    try {
      const { user: authUser } = await loginUser(credentials);
      setUser(authUser);
    } catch (error) {
      console.error('ログインに失敗しました:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
      throw error;
    }
  };

  const register = async (userData: UserRegistration) => {
    try {
      await registerUser(userData);
    } catch (error) {
      console.error('ユーザー登録に失敗しました:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthはAuthProviderの中で使用する必要があります');
  }
  return context;
};
```

### 5.2 認証保護ルートの作成

1. `src/components/ProtectedRoute.tsx`ファイルを作成

```typescript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">読み込み中...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

## 6. フロントエンドとの統合

### 6.1 App.tsxの更新

1. `src/App.tsx`ファイルを更新

```typescript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateArticle from './pages/CreateArticle';
import ManageArticles from './pages/ManageArticles';
import ArticleDetail from './pages/ArticleDetail';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="articles">
              <Route path="create" element={<CreateArticle />} />
              <Route path="manage" element={<ManageArticles />} />
              <Route path=":id" element={<ArticleDetail />} />
              <Route path=":id/edit" element={<CreateArticle />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

### 6.2 ログインページの更新

1. `src/pages/Login.tsx`ファイルを更新

```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
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
        await register({ email, password, name, department, position });
        toast.success('アカウントが作成されました。メールを確認してください。');
        setIsLogin(true);
      }
    } catch (error) {
      console.error('認証エラー:', error);
      toast.error(isLogin ? 'ログインに失敗しました' : 'アカウント作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {isLogin ? 'ログイン' : 'アカウント作成'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                名前
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {!isLogin && (
            <>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  部署
                </label>
                <input
                  id="department"
                  name="department"
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                  役職
                </label>
                <input
                  id="position"
                  name="position"
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </>
          )}
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? '処理中...' : isLogin ? 'ログイン' : 'アカウント作成'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            {isLogin ? 'アカウントを作成する' : 'ログインする'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

### 6.3 記事関連ページの更新

各ページ（Dashboard.tsx, CreateArticle.tsx, ManageArticles.tsx, ArticleDetail.tsx）を更新して、Supabase APIを使用するように変更します。詳細な実装は省略しますが、基本的には既存のモックデータやローカルストレージの代わりにSupabase APIを呼び出すように変更します。

## 7. リアルタイム機能の実装

### 7.1 リアルタイム更新の設定

1. `src/api/realtime.ts`ファイルを作成

```typescript
import { supabase } from './supabase';
import { Article } from './articles';

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
```

### 7.2 CreateArticleページでのリアルタイム保存の実装

リアルタイム保存機能を実装するために、CreateArticle.tsxを更新します。詳細な実装は省略しますが、基本的にはテキスト入力時に自動保存を行い、Supabaseを使用してデータを保存します。

## 8. バックアップと可用性の設定

### 8.1 Supabaseダッシュボードでの設定

1. Supabaseダッシュボードで以下の設定を行う
   - 定期的なバックアップの設定
   - パフォーマンス設定の最適化
   - 監視アラートの設定

## 実装手順のまとめ

1. Supabaseプロジェクトのセットアップ
2. 必要なパッケージのインストール
3. 環境変数の設定
4. Supabaseクライアントの作成
5. データベーステーブルの作成
6. RLSポリシーの設定
7. 認証コンテキストの実装
8. APIクライアントの実装
9. フロントエンドとの統合
10. リアルタイム機能の実装
11. バックアップと可用性の設定

これらの手順に従って実装することで、要件書とシステム設計書に記載されているSupabase関連の機能を実現できます。 