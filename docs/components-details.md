# コンポーネント詳細

このドキュメントでは、ブログジェネレーターアプリケーションの主要コンポーネントについて詳細に説明します。

## ページコンポーネント

### Login.tsx

ログインページでは、ユーザーがアプリケーションにログインまたは登録することができます。

**特徴：**
- ログインと登録モードの切り替え機能
- フォームバリデーション
- 美しいUI（アプリケーションロゴを含む）
- 認証後のダッシュボードへのリダイレクト

**データフロー：**
1. ユーザーがフォームに入力
2. 送信ボタンをクリック
3. フォームが検証され、成功すると`/dashboard`にリダイレクト

### Dashboard.tsx

ダッシュボードは、ユーザーがアプリケーションにログインした後の最初のページです。

**特徴：**
- 新しい記事作成と記事管理へのクイックアクセス
- 最近の下書き記事の表示
- 公開済み記事の表示
- 各記事へのクイックリンク

**データモデル：**
```typescript
interface Article {
  id: string;
  title: string;
  updatedAt: string;
  status: 'draft' | 'published';
}
```

### CreateArticle.tsx

このページでは、ユーザーが新しい記事を作成したり、既存の記事を編集したりすることができます。

**特徴：**
- テーマと構造の生成機能
- セクションベースの記事編集
- リアルタイムマークダウンプレビュー
- 下書き保存と公開機能

**データモデル：**
```typescript
interface Section {
  title: string;
  content: string;
}
```

**主要機能：**
- `handleGenerateStructure()`: AIを使用して記事の構造を生成
- `handleSaveSection()`: 現在のセクションを保存
- `handlePublish()`: 記事を公開

### ManageArticles.tsx

このページでは、ユーザーが既存の記事を管理することができます。

**特徴：**
- 記事のフィルタリング（すべて、公開済み、下書き）
- 記事の削除機能
- 記事のステータス変更（公開/非公開）
- 記事の編集へのクイックアクセス

**データモデル：**
```typescript
interface Article {
  id: string;
  title: string;
  status: 'draft' | 'published';
  createdAt: string;
}
```

**主要機能：**
- `handleDelete()`: 記事の削除
- `handleStatusChange()`: 記事のステータス変更

### ArticleDetail.tsx

このページでは、ユーザーが記事の詳細を表示することができます。

**特徴：**
- マークダウンコンテンツのレンダリング
- 記事メタデータの表示（作成者、作成日、更新日など）
- 編集ページへのリンク

**データモデル：**
```typescript
interface Article {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  authorName: string;
  createdAt: string;
  updatedAt: string;
}
```

## 共通コンポーネント

### Layout.tsx

アプリケーションの共通レイアウトを提供します。

**特徴：**
- ヘッダーにはアプリケーションロゴ
- ユーザー情報表示
- ログアウト機能
- レスポンシブデザイン

**主要機能：**
- `handleLogout()`: ユーザーのログアウト処理

## デザインシステム

アプリケーション全体でTailwindCSSを使用して一貫したデザインシステムを実装しています。

**カラーパレット：**
- プライマリーカラー: Indigo (bg-indigo-600)
- セカンダリーカラー: Gray (bg-gray-100)
- アクセントカラー: White (bg-white)

**コンポーネントスタイリング：**
- ボタン: 角丸、パディング、ホバーエフェクト
- カード: 角丸、シャドウ、パディング
- 入力フィールド: 境界線、フォーカス効果
- テキスト: 階層構造に基づくサイズと重さ

## ユーザーフロー

1. ユーザーがログイン/登録
2. ダッシュボードにリダイレクト
3. 新しい記事の作成または既存の記事の管理
4. 記事の編集、公開、または削除
5. 公開された記事の閲覧 