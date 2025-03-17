import { supabase, registerUser, loginUser, logoutUser, createArticle, getArticles, getArticleById, updateArticle, deleteArticle } from '../api';

/**
 * Supabaseの機能をテストするスクリプト
 * 
 * 使用方法:
 * 1. このファイルを実行する前に、.envファイルにSupabaseの認証情報が設定されていることを確認
 * 2. コマンドラインで `ts-node src/tests/supabase-test.ts` を実行
 * 3. コンソールに出力される結果を確認
 */

// テスト用のユーザー情報
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  name: 'テストユーザー'
};

// テスト用の記事情報
const testArticle = {
  title: 'テスト記事',
  content: 'これはテスト記事の内容です。',
  status: 'draft' as const
};

/**
 * ユーザー登録をテストする関数
 */
async function testRegisterUser() {
  console.log('===== ユーザー登録のテスト =====');
  try {
    const result = await registerUser(testUser);
    console.log('ユーザー登録成功:', result);
    return true;
  } catch (error: any) {
    console.error('ユーザー登録エラー:', error);
    // ユーザーが既に存在する場合は登録をスキップ
    if (error.message?.includes('User already registered')) {
      console.log('ユーザーは既に登録されています。ログインに進みます。');
      return true;
    }
    return false;
  }
}

/**
 * ログインをテストする関数
 */
async function testLogin() {
  console.log('===== ログインのテスト =====');
  try {
    const result = await loginUser({
      email: testUser.email,
      password: testUser.password
    });
    console.log('ログイン成功:', result.user.id);
    return result.user.id;
  } catch (error) {
    console.error('ログインエラー:', error);
    return null;
  }
}

/**
 * 記事作成をテストする関数
 */
async function testCreateArticle() {
  console.log('===== 記事作成のテスト =====');
  try {
    const article = await createArticle(testArticle);
    console.log('記事作成成功:', article);
    return article.id;
  } catch (error) {
    console.error('記事作成エラー:', error);
    return null;
  }
}

/**
 * 記事一覧取得をテストする関数
 */
async function testGetArticles() {
  console.log('===== 記事一覧取得のテスト =====');
  try {
    const articles = await getArticles();
    console.log(`${articles.length}件の記事を取得しました:`, articles.map(a => ({ id: a.id, title: a.title })));
    return articles;
  } catch (error) {
    console.error('記事一覧取得エラー:', error);
    return [];
  }
}

/**
 * 記事詳細取得をテストする関数
 */
async function testGetArticleById(articleId: string) {
  console.log('===== 記事詳細取得のテスト =====');
  try {
    const article = await getArticleById(articleId);
    console.log('記事詳細取得成功:', article);
    return article;
  } catch (error) {
    console.error('記事詳細取得エラー:', error);
    return null;
  }
}

/**
 * 記事更新をテストする関数
 */
async function testUpdateArticle(articleId: string) {
  console.log('===== 記事更新のテスト =====');
  try {
    const updatedArticle = await updateArticle(articleId, {
      title: `${testArticle.title} (更新済み)`,
      content: `${testArticle.content} この文章は更新されました。`,
    });
    console.log('記事更新成功:', updatedArticle);
    return updatedArticle;
  } catch (error) {
    console.error('記事更新エラー:', error);
    return null;
  }
}

/**
 * 記事削除をテストする関数
 */
async function testDeleteArticle(articleId: string) {
  console.log('===== 記事削除のテスト =====');
  try {
    const result = await deleteArticle(articleId);
    console.log('記事削除成功:', result);
    return result;
  } catch (error) {
    console.error('記事削除エラー:', error);
    return false;
  }
}

/**
 * ログアウトをテストする関数
 */
async function testLogout() {
  console.log('===== ログアウトのテスト =====');
  try {
    await logoutUser();
    console.log('ログアウト成功');
    return true;
  } catch (error) {
    console.error('ログアウトエラー:', error);
    return false;
  }
}

/**
 * すべてのテストを実行する関数
 */
async function runAllTests() {
  console.log('Supabaseテストを開始します...');
  
  // ユーザー登録
  const registerSuccess = await testRegisterUser();
  if (!registerSuccess) {
    console.error('ユーザー登録に失敗したため、テストを中止します。');
    return;
  }
  
  // ログイン
  const userId = await testLogin();
  if (!userId) {
    console.error('ログインに失敗したため、テストを中止します。');
    return;
  }
  
  // 記事作成
  const articleId = await testCreateArticle();
  if (!articleId) {
    console.error('記事作成に失敗したため、テストを中止します。');
    await testLogout();
    return;
  }
  
  // 記事一覧取得
  await testGetArticles();
  
  // 記事詳細取得
  await testGetArticleById(articleId);
  
  // 記事更新
  await testUpdateArticle(articleId);
  
  // 記事削除
  await testDeleteArticle(articleId);
  
  // ログアウト
  await testLogout();
  
  console.log('すべてのテストが完了しました。');
}

// テストの実行
runAllTests().catch(error => {
  console.error('テスト実行中にエラーが発生しました:', error);
}); 