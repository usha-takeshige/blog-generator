# DeepSeek API テスト手順

このドキュメントでは、DeepSeek APIの記事構成生成機能をテストする方法について説明します。

## 前提条件

1. DeepSeek APIのアカウントを持っていること
2. DeepSeek APIキーを取得していること
3. Node.jsとnpmがインストールされていること

## テスト準備

### 1. 必要なパッケージのインストール

```bash
npm install --save-dev ts-node dotenv
```

### 2. 環境変数の設定

1. プロジェクトのルートディレクトリに `.env` ファイルを作成します（`.env.example` をコピーして作成できます）
2. DeepSeek APIキーを設定します

```
DEEPSEEK_API_KEY=your_actual_api_key_here
NODE_ENV=development
```

## テスト実行

以下のコマンドを実行して、DeepSeek APIの記事構成生成機能をテストします：

```bash
npm run test:deepseek
```

または、直接ts-nodeを使用して実行することもできます：

```bash
npx ts-node src/api/tests/test-deepseek-api.ts
```

## テスト結果の確認

テストが成功すると、以下のような出力が表示されます：

```
DeepSeek API テスト開始: 記事構成生成
テーマ: "プログラミング初心者向けJavaScript入門"
API呼び出し成功！
生成された記事構成:
[
  {
    "title": "JavaScriptとは何か",
    "content": ""
  },
  {
    "title": "JavaScriptの基本構文",
    "content": ""
  },
  ...
]

検証:
- セクション数: 5
- 各セクションの構造確認:
  1. JavaScriptとは何か - コンテンツ長: 0文字
  2. JavaScriptの基本構文 - コンテンツ長: 0文字
  ...

テスト成功！
```

エラーが発生した場合は、エラーメッセージが表示されます。

## トラブルシューティング

1. **APIキーエラー**: `.env` ファイルが正しく設定されているか確認してください
2. **ネットワークエラー**: インターネット接続を確認してください
3. **APIレート制限**: DeepSeek APIの使用制限に達していないか確認してください

## 次のステップ

テストが成功したら、`CreateArticle.tsx` の `handleGenerateStructure` 関数を修正して、実際のDeepSeek API呼び出しを実装します。 