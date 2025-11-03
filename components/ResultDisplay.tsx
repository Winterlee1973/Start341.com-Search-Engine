import React from 'react';
import { GenerateContentResponse } from '@google/genai';
import { GroundingChunk } from '../types';

interface ResultDisplayProps {
  response: GenerateContentResponse | null;
  query: string;
}

const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
  const createMarkup = (markdownText: string) => {
    let html = markdownText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-brand-text">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/\n/g, '<br />');

    return { __html: html };
  };

  return <div className="text-brand-text-secondary leading-relaxed space-y-4" dangerouslySetInnerHTML={createMarkup(text)} />;
};


const ResultDisplay: React.FC<ResultDisplayProps> = ({ response, query }) => {
  if (!response) {
    return null;
  }

  const answer = response.text;
  const sources: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const webSources = sources.filter(s => s.web && s.web.uri && s.web.title);

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 animate-fade-in">
      {query && <p className="mb-4 text-lg text-brand-text-secondary">Showing results for: <span className="text-brand-text font-semibold">{query}</span></p>}
      
      <div className="bg-brand-surface p-6 rounded-xl shadow-lg border border-brand-border">
        <SimpleMarkdown text={answer} />
      </div>
      
      {webSources.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-brand-text">Sources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {webSources.map((source, index) => (
              <a
                key={index}
                href={source.web?.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-brand-surface p-4 rounded-lg border border-brand-border hover:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-200 group"
              >
                <p className="font-semibold text-brand-primary truncate group-hover:underline">{source.web?.title}</p>
                <p className="text-sm text-brand-text-secondary truncate mt-1">{source.web?.uri}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
