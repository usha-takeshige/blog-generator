# プロジェクト設定ファイル

このドキュメントでは、ブログジェネレーターアプリケーションの設定ファイルについて説明します。

## パッケージ管理

### package.json

このファイルには、プロジェクトの依存関係と設定が含まれています。

**主要な依存関係：**

- **React**: `react@^18.3.1`, `react-dom@^18.3.1` - UIコンポーネントライブラリ
- **React Router**: `react-router-dom@^6.22.3` - ルーティング
- **React Hot Toast**: `react-hot-toast@^2.4.1` - トースト通知
- **React Markdown**: `react-markdown@^9.0.1` - マークダウンレンダリング
- **Lucide React**: `lucide-react@^0.344.0` - アイコンライブラリ

**開発依存関係：**

- **Vite**: `vite@^5.4.2` - 高速なフロントエンドビルドツール
- **TypeScript**: `typescript@^5.5.3` - 型付きJavaScript
- **ESLint**: `eslint@^9.9.1` - コード品質ツール
- **TailwindCSS**: `tailwindcss@^3.4.1` - ユーティリティファーストCSSフレームワーク

**スクリプト：**

- `dev`: Vite開発サーバーを起動
- `build`: プロダクション用ビルドを作成
- `lint`: ESLintを使用してコードの品質をチェック
- `preview`: ビルドされたアプリケーションをプレビュー

## ビルド設定

### vite.config.ts

Viteの設定ファイルです。React用のプラグインが設定されています。

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

### tsconfig.json

TypeScriptのコンパイラ設定が含まれています。このファイルは他のTypeScript設定ファイルの基本となります。

### tsconfig.app.json

アプリケーション特有のTypeScript設定が含まれています。

### tsconfig.node.json

Node.js環境向けのTypeScript設定が含まれています。

## スタイリング設定

### tailwind.config.js

TailwindCSSの設定ファイルです。コンテンツのソースパスや、テーマの設定が含まれています。

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### postcss.config.js

PostCSSの設定ファイルです。TailwindCSSとAutoprefixerが設定されています。

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## コード品質

### eslint.config.js

ESLintの設定ファイルです。コードスタイルとクオリティをチェックするためのルールが設定されています。

## その他

### index.html

アプリケーションのエントリーポイントとなるHTMLファイルです。Viteを使用したSPAアプリケーションの標準的な構成を持っています。

### .gitignore

Gitのバージョン管理から除外するファイルやディレクトリを指定しています。node_modules、ビルド出力、環境変数ファイルなどが含まれています。 