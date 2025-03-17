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