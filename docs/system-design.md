# 社内ノウハウ共有ブログ記事作成支援アプリケーション システム設計書（フェーズ1 - MVP）

## 1. システム概要

### 1.1 目的
本システムは、社員が専門知識を効率的に共有するための記事作成をサポートし、社内知識の蓄積と活用を促進することを目的としています。フェーズ1では、基本的な記事作成支援機能とAI構成提案機能を提供します。

### 1.2 システム構成図
```
+-------------------+      +-------------------+      +-------------------+
|                   |      |                   |      |                   |
|  フロントエンド   | <--> |    バックエンド   | <--> |   データベース    |
|    (React)        |      |    (Node.js)      |      |   (Supabase)      |
|                   |      |                   |      |                   |
+-------------------+      +-------------------+      +-------------------+
                                    ^
                                    |
                                    v
                           +-------------------+
                           |                   |
                           |    DeepSeek API   |
                           |                   |
                           +-------------------+
```

### 1.3 主要機能
- ユーザー認証・管理機能（基本的なログイン・登録）
- 記事作成支援機能（AI構成提案）
- 記事管理機能（作成・編集・削除）
- シンプルな記事閲覧機能

## 2. システムアーキテクチャ

### 2.1 全体アーキテクチャ

本システムは、クライアント-サーバーアーキテクチャを採用し、以下のコンポーネントで構成されます：

1. **フロントエンドアプリケーション**
   - React フレームワークを使用
   - Material-UIをメインのUIライブラリとして採用
   - Tailwind CSSをユーティリティスタイリングに使用

2. **バックエンドサービス**
   - Node.js
   - RESTful API設計
   - DeepSeek API連携

3. **データベース**
   - Supabase（PostgreSQL）
   - 基本的なスキーマ管理

### 2.1.1 ホスティング構成

1. **フロントエンドホスティング**
   - Vercelを利用したReactアプリケーションのホスティング
   - 自動デプロイ（GitHub連携）

2. **バックエンドホスティング**
   - Vercel Serverless Functionsを活用したNode.jsアプリケーションのホスティング

3. **データベースホスティング**
   - Supabaseによる管理されたPostgreSQLデータベース
   - 基本的なバックアップ機能

## 3. データベース設計

### 3.1 エンティティ関連図（ER図）

```
+---------------+       +---------------+
|    Users      |       |   Articles    |
+---------------+       +---------------+
| PK: id        |<----->| PK: id        |
| name          |       | title         |
| email         |       | content       |
| password_hash |       | status        |
| department    |       | created_at    |
| position      |       | updated_at    |
+---------------+       | FK: author_id |
                       +---------------+
```

### 3.2 テーブル定義

#### 3.2.1 Users テーブル
| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PK, NOT NULL | ユーザーID |
| name | VARCHAR(100) | NOT NULL | ユーザー名 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | メールアドレス |
| password_hash | VARCHAR(255) | NOT NULL | ハッシュ化されたパスワード |
| department | VARCHAR(100) | NULL | 部署名 |
| position | VARCHAR(100) | NULL | 役職 |
| created_at | TIMESTAMP | DEFAULT NOW() | 作成日時 |

#### 3.2.2 Articles テーブル
| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PK, NOT NULL | 記事ID |
| title | VARCHAR(255) | NOT NULL | 記事タイトル |
| content | TEXT | NOT NULL | 記事本文（マークダウン形式） |
| status | ENUM | NOT NULL | 記事状態（draft, published） |
| author_id | UUID | FK, NOT NULL | 作成者ID |
| created_at | TIMESTAMP | DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新日時 |

## 4. API設計

### 4.1 認証API

#### 4.1.1 ユーザー登録
- **エンドポイント**: `POST /api/auth/register`
- **リクエスト**:
  ```json
  {
    "name": "山田太郎",
    "email": "yamada@example.com",
    "password": "securePassword123",
    "department": "開発部",
    "position": "エンジニア"
  }
  ```

#### 4.1.2 ログイン
- **エンドポイント**: `POST /api/auth/login`
- **リクエスト**:
  ```json
  {
    "email": "yamada@example.com",
    "password": "securePassword123"
  }
  ```

### 4.2 記事API

#### 4.2.1 記事作成
- **エンドポイント**: `POST /api/articles`
- **リクエスト**:
  ```json
  {
    "title": "記事タイトル",
    "content": "マークダウン形式の記事内容",
    "status": "draft"
  }
  ```

#### 4.2.2 記事一覧取得
- **エンドポイント**: `GET /api/articles`
- **クエリパラメータ**:
  - `status`: 記事状態（draft, published, all）
  - `page`: ページ番号
  - `limit`: 1ページあたりの件数

#### 4.2.3 記事詳細取得
- **エンドポイント**: `GET /api/articles/:id`

#### 4.2.4 記事更新
- **エンドポイント**: `PUT /api/articles/:id`

#### 4.2.5 記事削除
- **エンドポイント**: `DELETE /api/articles/:id`

### 4.3 AI支援API

#### 4.3.1 記事構成提案生成
- **エンドポイント**: `POST /api/ai/structure`
- **リクエスト**:
  ```json
  {
    "theme": "記事のテーマ"
  }
  ```

## 5. セキュリティ設計

### 5.1 認証・認可
- JWT（JSON Web Token）を使用した認証
- Supabaseの認証機能を活用
- 基本的なアクセス制御（自分の記事のみ編集可能）

### 5.2 データ保護
- パスワードのハッシュ化（bcrypt）
- HTTPS通信の強制
- 基本的なCSRF対策

## 6. パフォーマンス設計

### 6.1 最適化
- 基本的な画像最適化
- 必要最小限のバンドルサイズ

## 7. 監視・ロギング設計

### 7.1 基本ログ
- エラーログ
- アクセスログ

## 8. テスト戦略

### 8.1 テスト種別
- 単体テスト：基本機能のテスト
- 統合テスト：主要フローのテスト

## 9. デプロイ計画

### 9.1 デプロイパイプライン
- CI/CD：GitHub Actions
- 基本的なビルド→テスト→デプロイの自動化 