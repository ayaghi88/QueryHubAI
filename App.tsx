
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Category, SearchResult, CuratedSkill, HistoryItem } from './types';
import { SUGGESTIONS } from './constants';
import { CategorySelector } from './components/CategorySelector';
import { ResultView } from './components/ResultView';
import { SkillModule } from './components/SkillModule';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>(Category.UTILITY);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('queryhub_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('queryhub_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        setTimeout(() => handleSearch(transcript), 500);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech') {
          setError(`Voice input error: ${event.error}. Please try again.`);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setError(null);
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const addToHistory = (queryStr: string, cat: Category) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      query: queryStr,
      category: cat,
      timestamp: Date.now()
    };
    // Keep only unique queries (most recent version) and limit to 20 items
    setHistory(prev => {
      const filtered = prev.filter(item => item.query.toLowerCase() !== queryStr.toLowerCase());
      return [newItem, ...filtered].slice(0, 20);
    });
  };

  const handleSearch = async (overrideQuery?: string, overrideCategory?: Category) => {
    const finalQuery = overrideQuery || query;
    const finalCategory = overrideCategory || activeCategory;

    if (!finalQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const searchResult = await geminiService.performSearch(finalQuery, finalCategory);
      setResult(searchResult);
      addToHistory(finalQuery, finalCategory);
    } catch (err) {
      setError('An error occurred while fetching information. Please check your connection and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: typeof SUGGESTIONS[0]) => {
    setQuery(suggestion.query);
    setActiveCategory(suggestion.category);
    handleSearch(suggestion.query, suggestion.category);
  };

  const handleSkillSelect = (skill: CuratedSkill) => {
    const fullQuery = `Provide a comprehensive tutorial on: ${skill.title}. Level: ${skill.level}. Cover: ${skill.description}`;
    setQuery(skill.title);
    setActiveCategory(Category.SKILLS);
    handleSearch(fullQuery, Category.SKILLS);
  };

  const handleHistoryItemClick = (item: HistoryItem) => {
    setQuery(item.query);
    setActiveCategory(item.category);
    setIsHistoryOpen(false);
    handleSearch(item.query, item.category);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('queryhub_history');
  };

  const resetHome = () => {
    setResult(null);
    setQuery('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20 overflow-x-hidden">
      {/* History Sidebar/Drawer */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-slate-900 border-l border-white/10 z-[100] transform transition-transform duration-300 ease-in-out shadow-2xl ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Search History</h3>
            <button onClick={() => setIsHistoryOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto space-y-3 pr-2">
            {history.length > 0 ? (
              history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleHistoryItemClick(item)}
                  className="w-full text-left p-4 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-slate-800 hover:border-blue-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">{item.category}</span>
                    <span className="text-[10px] text-slate-500">{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-300 group-hover:text-white line-clamp-2">{item.query}</p>
                </button>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <svg className="w-12 h-12 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-slate-400">No search history yet</p>
              </div>
            )}
          </div>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="mt-6 w-full py-3 rounded-xl bg-red-500/10 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-all border border-red-500/20"
            >
              Clear History
            </button>
          )}
        </div>
      </div>

      {/* Backdrop for Sidebar */}
      {isHistoryOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          onClick={() => setIsHistoryOpen(false)}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 py-4 px-6 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={resetHome} className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">QueryHub AI</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Gemini Intelligence Hub</p>
            </div>
          </button>
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-4 text-sm text-slate-400 font-medium">
              <button onClick={() => { setActiveCategory(Category.TRENDING); setResult(null); }} className="hover:text-blue-400 transition-colors">Trends</button>
              <button onClick={() => { setActiveCategory(Category.SKILLS); setResult(null); }} className="hover:text-blue-400 transition-colors">Skills Library</button>
              <button onClick={() => setIsHistoryOpen(true)} className="hover:text-blue-400 transition-colors">History</button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        {!result && (
          <section className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Ask anything, <span className="text-blue-500">grounded in reality.</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Instant answers for utility, curated entertainment picks, step-by-step practical skills, and real-time trending topics.
            </p>
          </section>
        )}

        {/* Search Control */}
        <div className="relative max-w-3xl mx-auto mb-12">
          <CategorySelector activeCategory={activeCategory} onSelect={(cat) => {
            setActiveCategory(cat);
            if (result && result.category !== cat) setResult(null);
          }} />
          
          <div className="relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening..." : `Search for ${activeCategory.toLowerCase()}...`}
              className={`w-full h-16 pl-14 pr-44 bg-slate-900 border border-white/10 rounded-2xl text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-xl ${isListening ? 'ring-2 ring-blue-500/50 border-blue-500 animate-pulse' : ''}`}
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                onClick={toggleVoiceInput}
                className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                title="Voice Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              
              <button
                onClick={() => handleSearch()}
                disabled={isLoading || !query.trim()}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-semibold rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Search</span>
                    <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-semibold text-white/50 bg-black/20 rounded border border-white/10 ml-1">⏎</kbd>
                  </>
                )}
              </button>
            </div>
          </div>
          {result && (
            <button 
              onClick={resetHome}
              className="mt-4 text-sm text-slate-500 hover:text-blue-400 flex items-center gap-1 transition-colors mx-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          )}
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-8 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="max-w-5xl mx-auto">
          {result ? (
            <ResultView result={result} />
          ) : (
            <>
              {activeCategory === Category.SKILLS ? (
                <SkillModule onSelectSkill={handleSkillSelect} />
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-8">
                     <div className="h-[1px] flex-grow bg-white/5"></div>
                     <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-widest">Recommended Searches</h3>
                     <div className="h-[1px] flex-grow bg-white/5"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {SUGGESTIONS.filter(s => s.category === activeCategory || (activeCategory === Category.UTILITY && s.category === Category.UTILITY)).map((suggestion) => (
                     <button
                       key={suggestion.id}
                       onClick={() => handleSuggestionClick(suggestion)}
                       className="glass flex items-start gap-4 p-5 rounded-2xl text-left hover:bg-white/5 hover:border-blue-500/30 transition-all group"
                     >
                       <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                         {suggestion.icon}
                       </div>
                       <div>
                         <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1 block">
                           {suggestion.category}
                         </span>
                         <p className="text-slate-300 group-hover:text-white transition-colors">
                           {suggestion.query}
                         </p>
                       </div>
                     </button>
                   ))}
                 </div>

                 {/* Inline History Preview (Optional, but useful) */}
                 {history.length > 0 && !result && activeCategory === Category.UTILITY && (
                    <div className="mt-12">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="h-[1px] flex-grow bg-white/5"></div>
                        <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-widest">Recently Searched</h3>
                        <div className="h-[1px] flex-grow bg-white/5"></div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {history.slice(0, 5).map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleHistoryItemClick(item)}
                            className="bg-slate-900 border border-white/5 hover:border-blue-500/30 px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-all flex items-center gap-2"
                          >
                            <svg className="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {item.query}
                          </button>
                        ))}
                      </div>
                    </div>
                 )}
                </>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="mt-20 py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-500 text-xs">Powered by Gemini & Google Search Grounding. Real-time data processing enabled.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
