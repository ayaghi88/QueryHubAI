
import React from 'react';
import { SearchResult } from '../types';

interface ResultViewProps {
  result: SearchResult;
}

export const ResultView: React.FC<ResultViewProps> = ({ result }) => {
  // Simple markdown-ish formatter for steps/lists
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        return <li key={i} className="ml-4 mb-2 text-slate-300">{trimmed.substring(2)}</li>;
      }
      if (/^\d+\./.test(trimmed)) {
        return <li key={i} className="ml-4 mb-2 list-decimal text-slate-300">{trimmed.replace(/^\d+\.\s*/, '')}</li>;
      }
      if (trimmed.startsWith('#')) {
          return <h3 key={i} className="text-xl font-bold mt-4 mb-2 text-blue-400">{trimmed.replace(/^#+\s*/, '')}</h3>;
      }
      return <p key={i} className="mb-4 text-slate-300 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass rounded-2xl p-6 md:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              {result.category}
            </span>
            <span className="text-slate-500 text-xs">
              {new Date(result.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          {formatText(result.text)}
        </div>

        {result.sources.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <h4 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.803a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.1-1.1" />
              </svg>
              Sources & Further Reading
            </h4>
            <div className="flex flex-wrap gap-3">
              {result.sources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm text-blue-400 transition-all flex items-center gap-2 max-w-xs truncate"
                >
                  <span className="truncate">{source.title}</span>
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
