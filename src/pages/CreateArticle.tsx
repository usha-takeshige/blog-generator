import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Wand2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { generateArticleStructure, createArticle, getArticleById, updateArticle } from '../api';

interface Section {
  title: string;
  content: string;
  theme?: string;
}

export default function CreateArticle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [theme, setTheme] = useState('');
  const [title, setTitle] = useState('');
  const [sections, setSections] = useState<Section[]>([]);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  const [isSaving, setIsSaving] = useState(false);
  const [originalArticle, setOriginalArticle] = useState<any>(null);

  useEffect(() => {
    if (id) {
      // 既存の記事を編集する場合
      const fetchArticle = async () => {
        setIsLoading(true);
        try {
          const article = await getArticleById(id);
          setOriginalArticle(article);
          setTitle(article.title);
          
          // 記事の内容をセクションに分割
          try {
            const parsedContent = JSON.parse(article.content);
            if (Array.isArray(parsedContent) && parsedContent.length > 0) {
              setSections(parsedContent);
              setCurrentSection(parsedContent[0]);
              // テーマ情報を取得（最初のセクションに保存されている場合）
              if (parsedContent[0].theme) {
                setTheme(parsedContent[0].theme);
              }
            } else {
              // JSONだが配列でない場合
              const newSection = { title: 'Content', content: article.content };
              setSections([newSection]);
              setCurrentSection(newSection);
            }
          } catch (parseError) {
            // JSONでない場合は単一のセクションとして扱う
            const newSection = { title: 'Content', content: article.content };
            setSections([newSection]);
            setCurrentSection(newSection);
          }
          
          setIsLoading(false);
        } catch (error) {
          console.error('記事の取得に失敗しました:', error);
          toast.error('記事の読み込みに失敗しました');
          navigate('/articles/manage');
        }
      };
      fetchArticle();
    }
  }, [id, navigate]);

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
      console.error('構成の生成に失敗しました:', error);
      toast.error('構成の生成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSection = () => {
    if (!currentSection) return;
    
    setSections(prev => prev.map(section => 
      section.title === currentSection.title ? currentSection : section
    ));
    toast.success('セクションを保存しました');
  };

  const handlePublish = async (status: 'draft' | 'published' = 'draft') => {
    if (!title.trim()) {
      toast.error('タイトルを入力してください');
      return;
    }

    if (sections.length === 0) {
      toast.error('記事の内容を入力してください');
      return;
    }

    if (sections.some(section => !section.content.trim())) {
      toast.error('すべてのセクションに内容を入力してください');
      return;
    }

    setIsSaving(true);
    try {
      // セクションにテーマ情報を追加
      const sectionsWithTheme = sections.map((section, index) => 
        index === 0 ? { ...section, theme } : section
      );
      
      // セクションをJSON文字列に変換
      const content = JSON.stringify(sectionsWithTheme);
      
      if (id) {
        // 既存の記事を更新
        await updateArticle(id, {
          title,
          content,
          status: status || originalArticle?.status || 'draft'
        });
        toast.success(status === 'published' ? '記事を公開しました' : '記事を下書きとして保存しました');
        // 編集後は記事詳細ページに戻る
        navigate(`/articles/${id}`);
      } else {
        // 新しい記事を作成
        const newArticle = await createArticle({
          title,
          content,
          status
        });
        toast.success(status === 'published' ? '記事を公開しました' : '記事を下書きとして保存しました');
        // 作成後は記事管理ページに移動
        navigate('/articles/manage');
      }
    } catch (error) {
      console.error('記事の保存に失敗しました:', error);
      toast.error('記事の保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          戻る
        </button>
        <div className="space-x-4">
          <button
            onClick={handleSaveSection}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={!currentSection || isSaving}
          >
            セクションを保存
          </button>
          <button
            onClick={() => handlePublish('draft')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            disabled={isSaving}
          >
            {isSaving ? '保存中...' : '下書き保存'}
          </button>
          <button
            onClick={() => handlePublish('published')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            disabled={isSaving}
          >
            {isSaving ? '公開中...' : '公開する'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              テーマ
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="記事のメインテーマを入力してください"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleGenerateStructure}
                disabled={isGenerating || !theme.trim() || isSaving}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                生成
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                記事タイトル
              </label>
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                {isPreview ? '編集' : 'プレビュー'}
              </button>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="記事のタイトルを入力してください"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                セクション
              </label>
              <div className="flex gap-2 flex-wrap">
                {sections.map((section) => (
                  <button
                    key={section.title}
                    onClick={() => setCurrentSection(section)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      currentSection?.title === section.title
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </div>

            {currentSection && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {currentSection.title}
                </label>
                <textarea
                  value={currentSection.content}
                  onChange={(e) =>
                    setCurrentSection({ ...currentSection, content: e.target.value })
                  }
                  placeholder={`${currentSection.title}の内容を入力してください...`}
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}
          </div>
        </div>

        {isPreview && (
          <div className="bg-white rounded-xl shadow-sm p-6 prose prose-indigo max-w-none">
            <h1>{title || '無題の記事'}</h1>
            {sections.map((section) => (
              <div key={section.title}>
                <ReactMarkdown>{`## ${section.title}\n\n${section.content || '*内容がまだありません*'}`}</ReactMarkdown>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}