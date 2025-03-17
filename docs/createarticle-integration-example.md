# CreateArticle.tsx への DeepSeek API 統合例

このドキュメントでは、`CreateArticle.tsx` コンポーネントに DeepSeek API を統合する方法の例を示します。

## 現在の実装

現在の `handleGenerateStructure` 関数はモック実装になっています：

```typescript
const handleGenerateStructure = async () => {
  if (!theme.trim()) {
    toast.error('Please enter a theme first');
    return;
  }

  setIsGenerating(true);
  // Simulated AI response for MVP
  setTimeout(() => {
    const suggestedSections = [
      { title: 'Introduction', content: '' },
      { title: 'Key Concepts', content: '' },
      { title: 'Best Practices', content: '' },
      { title: 'Common Challenges', content: '' },
      { title: 'Conclusion', content: '' }
    ];
    setSections(suggestedSections);
    setCurrentSection(suggestedSections[0]);
    setIsGenerating(false);
    toast.success('Structure generated successfully');
  }, 1500);
};
```

## DeepSeek API 統合後の実装

以下は、DeepSeek API を統合した後の `handleGenerateStructure` 関数の実装例です：

```typescript
import { generateArticleStructure } from '../api';

// ... 既存のコード ...

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

## 執筆アドバイス機能の追加例

また、各セクションの編集時に執筆アドバイスを表示する機能も追加できます：

```typescript
import { generateArticleStructure, generateWritingAdvice } from '../api';

// ... 既存のコード ...

const [writingAdvice, setWritingAdvice] = useState('');
const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

// セクション選択時に執筆アドバイスを取得
const handleSectionSelect = async (section: Section) => {
  setCurrentSection(section);
  
  // 執筆アドバイスを取得
  setIsLoadingAdvice(true);
  try {
    const advice = await generateWritingAdvice(section.title, theme);
    setWritingAdvice(advice);
  } catch (error) {
    console.error('Error fetching writing advice:', error);
    setWritingAdvice('');
  } finally {
    setIsLoadingAdvice(false);
  }
};

// ... 既存のコード ...

// UIに執筆アドバイスを表示
return (
  <div>
    {/* ... 既存のUI ... */}
    
    {currentSection && (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900">執筆アドバイス</h3>
        {isLoadingAdvice ? (
          <div className="animate-pulse h-20 bg-gray-200 rounded mt-2"></div>
        ) : (
          <div className="mt-2 text-sm text-gray-600">
            {writingAdvice || 'アドバイスを取得できませんでした。'}
          </div>
        )}
      </div>
    )}
    
    {/* ... 既存のUI ... */}
  </div>
);
```

## 統合時の注意点

1. **環境変数の設定**: フロントエンドでAPIキーを直接使用することは避け、バックエンドプロキシを使用することを検討してください。
2. **エラーハンドリング**: ネットワークエラーやAPIエラーを適切に処理してください。
3. **ローディング状態**: API呼び出し中はローディング状態を表示してください。
4. **フォールバック**: API呼び出しが失敗した場合のフォールバックを用意してください。 