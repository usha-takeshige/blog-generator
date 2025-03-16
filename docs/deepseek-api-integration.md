# DeepSeek API連携機能設計書

## 1. 概要

本文書は、社内ノウハウ共有ブログ記事作成支援アプリケーションにおけるDeepSeek API連携機能の設計を定義します。DeepSeek APIは記事構成の自動生成や執筆アドバイスの提供に活用されます。

## 2. 使用箇所

### 2.1 記事構成生成機能（AI-01）
- **使用場所**: `CreateArticle.tsx` の `handleGenerateStructure` 関数内
- **現状**: 現在はモック実装（タイムアウトを使用したシミュレーション）
- **目的**: ユーザーが入力したテーマに基づいて、記事の構成（見出し、セクション）を自動生成する

### 2.2 執筆アドバイス機能（AI-02）
- **使用場所**: 現在は実装されていないが、`CreateArticle.tsx` の各セクション編集部分に追加予定
- **目的**: 各セクションの執筆方法についてのアドバイスを提供する

## 3. API連携の設計

### 3.1 API連携用モジュール構造
```
src/
  ├── api/
  │   ├── deepseek.ts     # DeepSeek API連携用の関数
  │   └── index.ts        # APIエクスポート
```

### 3.2 必要な関数

#### 3.2.1 記事構成生成関数
```typescript
// src/api/deepseek.ts
export async function generateArticleStructure(theme: string): Promise<Section[]> {
  // DeepSeek APIにリクエストを送信
  // テーマに基づいた記事構成を取得
  // Section[]形式で返却
}
```

#### 3.2.2 執筆アドバイス生成関数
```typescript
// src/api/deepseek.ts
export async function generateWritingAdvice(
  sectionTitle: string, 
  theme: string
): Promise<string> {
  // DeepSeek APIにリクエストを送信
  // セクションタイトルとテーマに基づいたアドバイスを取得
  // 文字列形式で返却
}
```

## 4. 実装方針

### 4.1 API設定
- 環境変数を使用してDeepSeek APIキーを管理
- API URLやパラメータを設定ファイルで管理

### 4.2 リクエスト形式
- DeepSeek APIへのリクエストは以下の形式を想定：

```typescript
// 記事構成生成リクエスト例
const request = {
  model: "deepseek-chat",
  messages: [
    {
      role: "system",
      content: "あなたはブログ記事の構成を提案するアシスタントです。"
    },
    {
      role: "user",
      content: `テーマ「${theme}」に関する記事の構成（見出しとセクション）を5つ程度提案してください。`
    }
  ],
  temperature: 0.7
};
```

### 4.3 レスポンス処理
- APIからのレスポンスをアプリケーションで使用できる形式に変換
- エラーハンドリングの実装

## 5. CreateArticle.tsxでの実装例

現在の`handleGenerateStructure`関数をDeepSeek API連携に置き換える例：

```typescript
const handleGenerateStructure = async () => {
  if (!theme.trim()) {
    toast.error('テーマを入力してください');
    return;
  }

  setIsGenerating(true);
  try {
    // DeepSeek APIを呼び出す
    const suggestedSections = await generateArticleStructure(theme);
    setSections(suggestedSections);
    setCurrentSection(suggestedSections[0]);
    toast.success('構成が生成されました');
  } catch (error) {
    console.error('Error generating structure:', error);
    toast.error('構成の生成に失敗しました');
  } finally {
    setIsGenerating(false);
  }
};
```

## 6. 今後の拡張性

1. **コンテンツ生成機能**: 各セクションの内容を自動生成する機能
2. **文章改善提案**: 書かれた内容に対する改善提案を提供する機能
3. **キーワード提案**: SEO最適化のためのキーワード提案機能

## 7. セキュリティ考慮事項

1. **APIキー管理**: 環境変数を使用し、クライアントサイドに露出させない
2. **レート制限**: APIの使用量を監視し、コスト管理を行う
3. **入力検証**: ユーザー入力のバリデーションを実装

## 8. エラーハンドリング

1. **ネットワークエラー**: API接続失敗時の適切なフォールバック
2. **レート制限エラー**: API使用制限に達した場合の処理
3. **不適切な応答**: APIからの応答が期待と異なる場合の処理 