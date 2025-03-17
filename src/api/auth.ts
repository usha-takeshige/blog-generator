import { supabase } from './supabase';

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  name: string;
}

export const registerUser = async (userData: UserRegistration) => {
  try {
    // ユーザー認証情報のみを登録（シンプルに）
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name
        }
      }
    });

    if (error) throw error;
    
    // 認証が成功したら、usersテーブルにもユーザー情報を登録する
    if (data.user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          name: userData.name,
          email: userData.email,
          created_at: new Date().toISOString()
        });
        
      if (insertError) {
        console.error('ユーザープロフィール作成エラー:', insertError);
      }
    }
    
    return data;
  } catch (error) {
    console.error('ユーザー登録エラー:', error);
    throw error;
  }
};

export const loginUser = async ({ email, password }: UserCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    // ログイン成功後、必要に応じてusersテーブルにプロフィールを作成/更新
    if (data.user) {
      const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('id', data.user.id);
        
      // ユーザープロフィールが存在しない場合は作成
      if (count === 0) {
        await supabase
          .from('users')
          .insert({
            id: data.user.id,
            name: data.user.user_metadata.name || '',
            email: data.user.email || '',
            created_at: new Date().toISOString()
          });
      }
    }
    
    return data;
  } catch (error) {
    console.error('ログインエラー:', error);
    throw error;
  }
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