import { generateArticleStructure } from '../deepseek';

/**
 * DeepSeek APIの記事構成生成機能をテストする関数
 */
async function testGenerateArticleStructure() {
  try {
    console.log('DeepSeek API テスト開始: 記事構成生成');
    console.log('テーマ: "プログラミング初心者向けJavaScript入門"');
    
    const result = await generateArticleStructure('プログラミング初心者向けJavaScript入門');
    
    console.log('API呼び出し成功！');
    console.log('生成された記事構成:');
    console.log(JSON.stringify(result, null, 2));
    
    console.log('\n検証:');
    console.log(`- セクション数: ${result.length}`);
    console.log('- 各セクションの構造確認:');
    result.forEach((section, index) => {
      console.log(`  ${index + 1}. ${section.title} - コンテンツ長: ${section.content.length}文字`);
    });
    
    console.log('\nテスト成功！');
  } catch (error) {
    console.error('テスト失敗:', error);
  }
}

// テスト実行
testGenerateArticleStructure(); 