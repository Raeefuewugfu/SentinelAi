

import React, { useState, useEffect, useCallback } from 'react';
import { XCircleIcon, SparklesIcon, CheckCircleIcon, ArrowPathIcon, DocumentDuplicateIcon } from './icons';
import { generateScamBaitReply } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ScamBaiterModalProps {
  originalEmail: string;
  onClose: () => void;
}

const ScamBaiterModal: React.FC<ScamBaiterModalProps> = ({ originalEmail, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  const generateReply = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateScamBaitReply(originalEmail);
      setReply(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kon geen antwoord genereren.');
    } finally {
      setIsLoading(false);
    }
  }, [originalEmail]);

  useEffect(() => {
    // Generate reply on initial load
    generateReply();
  }, [generateReply]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(reply);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast"
      onClick={onClose}
    >
      <div
        className="bg-surface-1 rounded-2xl shadow-2xl border border-surface-2 w-full max-w-2xl flex flex-col m-4 animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-surface-2">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-6 h-6 text-caution" />
            <h2 className="text-xl font-bold text-text-primary">Scambaiter GPT</h2>
          </div>
          <button onClick={onClose} className="text-text-tertiary hover:text-accent">
            <XCircleIcon className="w-7 h-7" />
          </button>
        </header>

        <div className="p-6 space-y-4">
          <p className="text-text-secondary text-sm">
            Hier is een door AI gegenereerd antwoord, ontworpen om de tijd van de oplichter te verspillen. Controleer de tekst en kopieer deze om te gebruiken in uw e-mailprogramma.
          </p>
          
          <div className="bg-background rounded-lg p-4 border border-surface-2 min-h-[200px] prose prose-sm max-w-none text-text-primary">
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              </div>
            )}
            {error && <p className="text-danger">{error}</p>}
            {!isLoading && !error && <ReactMarkdown remarkPlugins={[remarkGfm]}>{reply}</ReactMarkdown>}
          </div>
        </div>

        <footer className="flex items-center justify-end gap-4 p-4 border-t border-surface-2 mt-auto">
          <button
            onClick={generateReply}
            disabled={isLoading}
            className="flex items-center gap-2 bg-surface-2 text-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-surface-2/80 transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            Regenerate
          </button>
          <button
            onClick={handleCopy}
            disabled={isLoading || !reply}
            className={`flex items-center gap-2 bg-accent text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 ${isCopied ? '!bg-safe' : ''}`}
          >
            {isCopied ? <CheckCircleIcon className="w-5 h-5" /> : <DocumentDuplicateIcon className="w-5 h-5" />}
            {isCopied ? 'Gekopieerd!' : 'Kopieer Antwoord'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ScamBaiterModal;