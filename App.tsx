import React, { useState, useCallback } from 'react';
import { GenerateContentResponse } from '@google/genai';
import { searchWithGemini } from './services/geminiService';
import SearchInput from './components/SearchInput';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
    const [response, setResponse] = useState<GenerateContentResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [lastQuery, setLastQuery] = useState<string>('');

    const hasSearched = response !== null || isLoading || error !== null;

    const handleSearch = useCallback(async (query: string) => {
        if (!query.trim() || isLoading) return;
        
        setIsLoading(true);
        setError(null);
        setResponse(null);
        setLastQuery(query);

        try {
            const result = await searchWithGemini(query);
            setResponse(result);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(`Sorry, we couldn't complete your search. ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    return (
        <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 transition-all duration-500">
            <div className={`w-full transition-all duration-500 ${hasSearched ? 'pt-0' : 'pt-24 sm:pt-32 md:pt-40'}`}>
                <header className="flex flex-col items-center mb-8">
                    <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary mb-2">
                        start341
                    </h1>
                    <p className="text-brand-text-secondary">Your AI-powered starting point.</p>
                </header>

                <main className="w-full">
                    <SearchInput onSearch={handleSearch} isLoading={isLoading} />
                    
                    <div className="mt-6">
                        {isLoading && <LoadingSpinner />}
                        {error && (
                            <div className="w-full max-w-2xl mx-auto text-center bg-red-900/50 border border-red-500/50 text-red-300 p-4 rounded-lg animate-fade-in">
                                {error}
                            </div>
                        )}
                        {response && <ResultDisplay response={response} query={lastQuery} />}
                    </div>
                </main>
            </div>

            <footer className="mt-auto pt-8 pb-4 text-center text-brand-text-secondary text-sm">
                <p>&copy; {new Date().getFullYear()} start341.com. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;
