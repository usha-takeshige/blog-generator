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