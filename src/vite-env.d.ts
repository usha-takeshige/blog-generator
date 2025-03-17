/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEEPSEEK_API_KEY: string;
  // その他の環境変数があれば追加
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
