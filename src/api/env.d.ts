/**
 * 環境変数の型定義
 */
declare namespace NodeJS {
  interface ProcessEnv {
    DEEPSEEK_API_KEY?: string;
    NODE_ENV?: 'development' | 'production' | 'test';
  }
}

declare const process: {
  env: {
    DEEPSEEK_API_KEY?: string;
    NODE_ENV?: 'development' | 'production' | 'test';
  }
}; 