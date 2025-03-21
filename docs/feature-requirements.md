# 社内ノウハウ共有ブログ記事作成支援アプリケーション機能要件書（フェーズ1 - MVP）

## 1. 概要

本文書は、社内ノウハウ共有ブログ記事作成支援アプリケーションのフェーズ1（MVP）における機能要件を定義するものです。フェーズ1では、基本的な記事作成支援機能とAI構成提案機能を提供します。

## 2. 機能要件

### 2.1 ユーザー認証・管理機能

| 機能ID | 機能名 | 説明 | 優先度 |
|--------|--------|------|--------|
| AUTH-01 | ユーザー登録 | 社員がアプリケーションを利用するためのアカウントを作成できる | 高 |
| AUTH-02 | ログイン認証 | 登録済みユーザーがメールアドレスとパスワードでログインできる | 高 |
| AUTH-03 | ログアウト | ユーザーがシステムからログアウトできる | 高 |

### 2.2 記事作成支援機能

| 機能ID | 機能名 | 説明 | 優先度 |
|--------|--------|------|--------|
| CREATE-01 | テーマ入力 | ユーザーが記事のテーマを入力し、AIによる構成提案を受けられる | 高 |
| CREATE-02 | 記事構成提案 | AIがテーマに基づいて記事の構成（見出し、セクション）を提案する | 高 |
| CREATE-03 | フォーカスモードエディタ | 現在編集中のセクションに集中できるエディタ機能 | 高 |
| CREATE-04 | リアルタイム保存 | 記事の編集内容をリアルタイムで自動保存する | 高 |
| CREATE-05 | マークダウン対応 | マークダウン記法での記事作成をサポート | 中 |

### 2.3 記事管理機能

| 機能ID | 機能名 | 説明 | 優先度 |
|--------|--------|------|--------|
| MANAGE-01 | 記事一覧表示 | 自分が作成した記事の一覧を表示する | 高 |
| MANAGE-02 | 記事編集 | 保存済みの記事を編集できる | 高 |
| MANAGE-03 | 記事削除 | 不要になった記事を削除できる | 高 |
| MANAGE-04 | 記事公開設定 | 記事の公開/非公開を設定できる | 中 |

### 2.4 AIサポート機能

| 機能ID | 機能名 | 説明 | 優先度 |
|--------|--------|------|--------|
| AI-01 | 記事構成生成 | DeepSeek APIを活用して記事の構成を生成する | 高 |
| AI-02 | 執筆アドバイス | 各セクションの執筆方法についてのアドバイスを提供する | 中 |

## 3. 画面遷移図

```
[ログイン画面] → [ダッシュボード] → [記事作成画面]
                   ↓                 ↓
                [記事一覧] ← → [記事詳細画面]
```

## 4. 画面ごとの機能一覧

### 4.1 ログイン・認証画面
- ユーザー登録フォーム
- ログインフォーム

### 4.2 ダッシュボード
- 自分の記事一覧（ドラフト/公開）
- 新規記事作成ボタン

### 4.3 記事作成画面
- テーマ入力フォーム
- AI構成提案表示エリア
- フォーカスモードエディタ
- 自動保存インジケーター

### 4.4 記事管理画面
- 記事一覧（タイトル、作成日、ステータス）
- 編集ボタン
- 削除ボタン
- 公開設定切り替え

## 5. 非機能要件

### 5.1 パフォーマンス要件
- AI提案生成の応答時間：5秒以内
- 画面遷移時間：2秒以内
- 同時利用ユーザー数：部署単位（約30-50人）での同時利用をサポート

### 5.2 セキュリティ要件
- Supabaseによる認証機能の実装
- データの暗号化保存
- アクセス権限の適切な管理（作成者のみ編集可能）

### 5.3 可用性要件
- サービス稼働率：99.5%以上
- 基本的なバックアップ機能

## 6. 技術要件

### 6.1 フロントエンド
- React（フレームワーク）
- Material-UI, Tailwind CSS
- レスポンシブデザイン（主にPC向け）

### 6.2 バックエンド
- Node.js
- DeepSeek API連携
- RESTful API設計

### 6.3 データベース
- Supabase（PostgreSQL）
- 基本的なスキーマ管理

### 6.4 デプロイ環境
- Vercel（ホスティングサービス）

## 7. 制約事項

- 社内ネットワーク環境での利用を前提とする
- PCのWebブラウザでの閲覧を主な利用環境とする
- DeepSeek APIの利用制限に準拠する必要がある
- 社内セキュリティポリシーに準拠する必要がある 