import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Wand2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

interface Section {
  title: string;
  content: string;
}

const MOCK_ARTICLE = {
  id: '1',
  title: 'Getting Started with React',
  theme: 'React Fundamentals',
  sections: [
    { title: 'Introduction', content: '# Getting Started with React\n\nReact is a popular JavaScript library for building user interfaces.' },
    { title: 'Key Concepts', content: '## Components\nComponents are the building blocks of React applications.\n\n## Props\nProps are read-only components.' },
    { title: 'Best Practices', content: '1. Keep components small\n2. Use functional components\n3. Follow naming conventions' },
    { title: 'Common Challenges', content: '- State management\n- Performance optimization\n- Testing strategies' },
    { title: 'Conclusion', content: 'React provides a powerful way to build modern web applications.' }
  ]
};

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

  useEffect(() => {
    if (id) {
      // Simulate API call for editing existing article
      const fetchArticle = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          setTheme(MOCK_ARTICLE.theme);
          setTitle(MOCK_ARTICLE.title);
          setSections(MOCK_ARTICLE.sections);
          setCurrentSection(MOCK_ARTICLE.sections[0]);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching article:', error);
          toast.error('Failed to load article');
          navigate('/articles/manage');
        }
      };
      fetchArticle();
    }
  }, [id, navigate]);

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

  const handleSaveSection = () => {
    if (!currentSection) return;
    
    setSections(prev => prev.map(section => 
      section.title === currentSection.title ? currentSection : section
    ));
    toast.success('Section saved');
  };

  const handlePublish = () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (sections.some(section => !section.content.trim())) {
      toast.error('Please fill in all sections');
      return;
    }

    toast.success(id ? 'Article updated successfully' : 'Article saved as draft');
    navigate('/dashboard');
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
          Back
        </button>
        <div className="space-x-4">
          <button
            onClick={handleSaveSection}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={!currentSection}
          >
            Save Section
          </button>
          <button
            onClick={handlePublish}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {id ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Theme
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Enter the main theme of your article"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleGenerateStructure}
                disabled={isGenerating || !theme.trim()}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                Generate
              </button>
            </div>
          </div>

          {sections.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Article Title
                </label>
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  {isPreview ? 'Edit' : 'Preview'}
                </button>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Sections
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
                    placeholder={`Write your content for ${currentSection.title}...`}
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {isPreview && (
          <div className="bg-white rounded-xl shadow-sm p-6 prose prose-indigo max-w-none">
            <h1>{title || 'Untitled Article'}</h1>
            {sections.map((section) => (
              <div key={section.title}>
                <h2>{section.title}</h2>
                <ReactMarkdown>{section.content || '*No content yet*'}</ReactMarkdown>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}