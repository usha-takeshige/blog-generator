/**
 * 記事のセクションを表す型定義
 */
export interface Section {
  title: string;
  content: string;
}

/**
 * DeepSeek APIのリクエスト形式
 */
export interface DeepSeekRequest {
  model: string;
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[];
  temperature?: number;
  max_tokens?: number;
}

/**
 * DeepSeek APIのレスポンス形式
 */
export interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Supabaseデータベース型定義
 */
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