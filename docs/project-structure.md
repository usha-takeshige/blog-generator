# ブログジェネレータープロジェクト構造

## プロジェクト概要

このプロジェクトは、Reactとタイプスクリプトを使用したブログ管理システムです。ユーザーは記事の作成、編集、公開、管理などの操作を行うことができます。プロジェクトはViteを使用してビルドされており、TailwindCSSでスタイリングされています。

## 技術スタック

- **フロントエンド**: React 18, TypeScript
- **ルーティング**: React Router Dom v6
- **スタイリング**: TailwindCSS
- **ビルドツール**: Vite
- **その他ライブラリ**:
  - `react-hot-toast`: トーストメッセージ表示
  - `react-markdown`: マークダウンレンダリング
  - `lucide-react`: アイコン

## ディレクトリ構造

```
blog-generator/
├── .git/                  # Gitリポジトリ
├── .bolt/                 # Boltの設定ファイル
├── src/                   # ソースコード
│   ├── components/        # 再利用可能なコンポーネント
│   │   └── Layout.tsx     # メインレイアウトコンポーネント
│   ├── pages/             # ページコンポーネント
│   │   ├── Login.tsx      # ログインページ
│   │   ├── Dashboard.tsx  # ダッシュボード
│   │   ├── CreateArticle.tsx # 記事作成/編集ページ
│   │   ├── ManageArticles.tsx # 記事管理ページ
│   │   └── ArticleDetail.tsx # 記事詳細ページ
│   ├── App.tsx            # メインアプリケーションコンポーネント
│   ├── main.tsx           # エントリーポイント
│   ├── index.css          # グローバルCSS
│   └── vite-env.d.ts      # Vite環境の型定義
├── public/                # 静的ファイル
├── index.html             # メインHTMLファイル
├── package.json           # NPMパッケージ設定
├── package-lock.json      # NPMパッケージロック
├── tsconfig.json          # TypeScript設定
├── tsconfig.app.json      # アプリケーション用TypeScript設定
├── tsconfig.node.json     # Node用TypeScript設定
├── vite.config.ts         # Vite設定
├── tailwind.config.js     # TailwindCSS設定
├── postcss.config.js      # PostCSS設定
├── eslint.config.js       # ESLint設定
└── .gitignore             # Git無視ファイル設定
```

## 主要コンポーネントの説明

### App.tsx

メインのアプリケーションコンポーネントで、React Routerを使用してルーティングを設定しています。以下のルートが定義されています：

- `/login`: ログインページ
- `/dashboard`: ダッシュボードページ
- `/articles/create`: 記事作成ページ
- `/articles/manage`: 記事管理ページ
- `/articles/:id`: 記事詳細ページ
- `/articles/:id/edit`: 記事編集ページ

### Layout.tsx

アプリケーションの共通レイアウトを提供します。ヘッダーにはロゴとユーザー情報、ログアウトボタンが含まれています。

### Dashboard.tsx

ダッシュボードページでは以下の機能が提供されています：
- 新しい記事を作成するリンク
- 記事を管理するリンク
- 最近の下書き記事リスト
- 公開済み記事リスト

各記事にはタイトルと最終更新日または公開日が表示されます。

### 各ページの機能

- **Login.tsx**: ユーザー認証フォーム
- **CreateArticle.tsx**: 記事の作成と編集
- **ManageArticles.tsx**: すべての記事の一覧と管理
- **ArticleDetail.tsx**: 記事の詳細表示

## データモデル

### 記事（Article）

```typescript
interface Article {
  id: string;
  title: string;
  updatedAt: string;
  status: 'draft' | 'published';
}
```

## デザイン

アプリケーションはTailwindCSSを使用して、クリーンでモダンなUIを実現しています。ブランドカラーとしてindigoが主に使用されており、記事管理や閲覧に適した明瞭なレイアウトが採用されています。 