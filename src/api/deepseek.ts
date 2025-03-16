import { Section, DeepSeekRequest, DeepSeekResponse } from './types';

/**
 * DeepSeek APIのエンドポイントURL
 */
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

/**
 * DeepSeek APIのキー（環境変数から取得）
 */
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

/**
 * DeepSeek APIを使用して記事構成を生成する関数
 * @param theme 記事のテーマ
 * @returns 生成された記事構成（セクションの配列）
 */
export async function generateArticleStructure(theme: string): Promise<Section[]> {
  if (!theme.trim()) {
    throw new Error('テーマを入力してください');
  }

  if (!DEEPSEEK_API_KEY) {
    throw new Error('DeepSeek APIキーが設定されていません');
  }

  try {
    // APIリクエストの作成
    const request: DeepSeekRequest = {
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
    const response = await fetch(DEEPSEEK_API_URL, {
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
    const data = await response.json() as DeepSeekResponse;
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('APIからの応答が不正です');
    }

    // APIレスポンスからセクション配列を抽出
    const content = data.choices[0].message.content;
    
    try {
      // JSONレスポンスをパース
      const sections = JSON.parse(content) as Section[];
      
      // 結果の検証
      if (!Array.isArray(sections) || sections.length === 0) {
        throw new Error('APIからの応答が不正です');
      }
      
      // 各セクションが正しい形式かチェック
      sections.forEach(section => {
        if (typeof section.title !== 'string') {
          throw new Error('セクションのタイトルが不正です');
        }
        // contentが未設定の場合は空文字列を設定
        if (section.content === undefined) {
          section.content = '';
        }
      });
      
      return sections;
    } catch (error) {
      console.error('JSONパースエラー:', content);
      throw new Error('APIレスポンスのパースに失敗しました');
    }
  } catch (error) {
    console.error('DeepSeek API呼び出しエラー:', error);
    throw error;
  }
}

/**
 * DeepSeek APIを使用して執筆アドバイスを生成する関数
 * @param sectionTitle セクションのタイトル
 * @param theme 記事のテーマ
 * @returns 生成された執筆アドバイス
 */
export async function generateWritingAdvice(
  sectionTitle: string, 
  theme: string
): Promise<string> {
  if (!sectionTitle.trim() || !theme.trim()) {
    throw new Error('セクションタイトルとテーマを入力してください');
  }

  if (!DEEPSEEK_API_KEY) {
    throw new Error('DeepSeek APIキーが設定されていません');
  }

  try {
    // APIリクエストの作成
    const request: DeepSeekRequest = {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "あなたは執筆アドバイスを提供するアシスタントです。"
        },
        {
          role: "user",
          content: `テーマ「${theme}」の記事で、セクション「${sectionTitle}」を書くためのアドバイスを提供してください。
          具体的な書き方、含めるべき内容、注意点などを簡潔に説明してください。`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    };

    // APIリクエストの送信
    const response = await fetch(DEEPSEEK_API_URL, {
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
    const data = await response.json() as DeepSeekResponse;
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('APIからの応答が不正です');
    }

    // APIレスポンスからアドバイスを抽出
    const advice = data.choices[0].message.content;
    return advice;
  } catch (error) {
    console.error('DeepSeek API呼び出しエラー:', error);
    throw error;
  }
} 