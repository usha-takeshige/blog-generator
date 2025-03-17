// CommonJSモードでのrequire
const dotenv = require('dotenv');
dotenv.config(); // 環境変数を読み込む

// TypeScriptファイルを直接requireできないため、コンパイル済みのJSファイルを使用する必要があります
// 実際の環境では、ts-nodeを使用するか、事前にコンパイルする必要があります
// ここでは簡易的に直接APIリクエストを実装します

/**
 * DeepSeek APIの記事構成生成機能をテストする関数
 */
async function testGenerateArticleStructure() {
  try {
    console.log('DeepSeek API テスト開始: 記事構成生成');
    console.log('テーマ: "プログラミング初心者向けJavaScript入門"');
    
    const theme = 'プログラミング初心者向けJavaScript入門';
    
    // APIキーの確認
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
    if (!DEEPSEEK_API_KEY) {
      throw new Error('DeepSeek APIキーが設定されていません。.envファイルを確認してください。');
    }
    
    // APIリクエストの作成
    const request = {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "あなたはブログ記事の構成を提案するアシスタントです。JSON形式で回答してください。"
        },
        {
          role: "user",
          content: `テーマ「${theme}」に関する記事の構成（見出しとセクション）を5つ程度提案してください。
          レスポンスは以下のJSON形式で返してください:
          [
            {"title": "セクションタイトル1", "content": ""},
            {"title": "セクションタイトル2", "content": ""},
            ...
          ]`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    };

    // APIリクエストの送信
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(request)
    });

    // レスポンスの検証
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`DeepSeek API エラー: ${errorData.error?.message || response.statusText}`);
    }

    // レスポンスの解析
    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('APIからの応答が不正です');
    }

    // APIレスポンスからセクション配列を抽出
    const content = data.choices[0].message.content;
    
    try {
      // JSONレスポンスをパース
      const sections = JSON.parse(content);
      
      // 結果の検証
      if (!Array.isArray(sections) || sections.length === 0) {
        throw new Error('APIからの応答が不正です');
      }
      
      console.log('API呼び出し成功！');
      console.log('生成された記事構成:');
      console.log(JSON.stringify(sections, null, 2));
      
      console.log('\n検証:');
      console.log(`- セクション数: ${sections.length}`);
      console.log('- 各セクションの構造確認:');
      sections.forEach((section, index) => {
        console.log(`  ${index + 1}. ${section.title} - コンテンツ長: ${section.content ? section.content.length : 0}文字`);
      });
      
      console.log('\nテスト成功！');
    } catch (error) {
      console.error('JSONパースエラー:', content);
      throw new Error('APIレスポンスのパースに失敗しました');
    }
  } catch (error) {
    console.error('テスト失敗:', error);
  }
}

// テスト実行
testGenerateArticleStructure(); 