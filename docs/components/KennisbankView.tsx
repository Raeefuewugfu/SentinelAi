

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { KennisbankArticle, PlaybookEntry, IconName } from '../types';
import { articles } from '../data/kennisbankData';
import { playbook } from '../data/playbookData';
import { simplifyText } from '../services/geminiService';
import { DynamicIcon, BookOpenIcon, XCircleIcon, SparklesIcon, ChevronUpDownIcon, ClipboardDocumentCheckIcon, ArrowDownTrayIcon } from './icons';
import ScamQuizModal from './ScamQuizModal';
import ScamChecklistModal from './ScamChecklistModal';

type ActiveTab = 'playbook' | 'articles' | 'toolkit';

const KennisbankView: React.FC = () => {
    const [selectedArticle, setSelectedArticle] = useState<KennisbankArticle | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTab>('playbook');
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [isChecklistOpen, setIsChecklistOpen] = useState(false);
    const [expandedPlaybookId, setExpandedPlaybookId] = useState<string | null>(null);

    const renderContent = () => {
        switch (activeTab) {
            case 'playbook':
                return (
                    <div className="space-y-4">
                        {playbook.map((entry, index) => (
                            <PlaybookCard 
                                key={entry.id} 
                                entry={entry}
                                isExpanded={expandedPlaybookId === entry.id}
                                onToggle={() => setExpandedPlaybookId(expandedPlaybookId === entry.id ? null : entry.id)}
                                index={index}
                             />
                        ))}
                    </div>
                );
            case 'articles':
                return (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article, index) => (
                            <div
                                key={article.id}
                                onClick={() => setSelectedArticle(article)}
                                className="bg-surface-1 rounded-xl p-6 shadow-sm border border-surface-2/50 transition-all duration-300 hover:shadow-xl hover:border-accent/40 hover:-translate-y-1 cursor-pointer animate-slide-in-up"
                                style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-surface-2 flex items-center justify-center text-accent">
                                        <DynamicIcon name={article.icon} className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-text-primary">{article.title}</h3>
                                </div>
                                <p className="text-sm text-text-secondary">{article.description}</p>
                            </div>
                        ))}
                    </div>
                );
             case 'toolkit':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ToolkitCard
                            icon="ClipboardDocumentCheckIcon"
                            title="Herken de Scam Quiz"
                            description="Test uw kennis en leer scams herkennen in onze interactieve quiz."
                            onClick={() => setIsQuizOpen(true)}
                        />
                         <ToolkitCard
                            icon="DocumentTextIcon"
                            title="Checklist: 'Is dit Echt?'"
                            description="Gebruik deze checklist om verdachte websites, e-mails en berichten te beoordelen."
                            onClick={() => setIsChecklistOpen(true)}
                        />
                         <ToolkitCard
                            icon="ArrowDownTrayIcon"
                            title="Veiligheidspakket voor Ouderen"
                            description="Download een printbare PDF-gids speciaal voor senioren."
                            onClick={() => {}}
                            disabled
                        />
                         <ToolkitCard
                            icon="ArrowDownTrayIcon"
                            title="Veiligheidspakket voor Kinderen"
                            description="Een gids om jongeren te leren over online veiligheid."
                            onClick={() => {}}
                            disabled
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="h-full w-full p-4 sm:p-6 lg:p-8 animate-fade-in-fast overflow-y-auto no-scrollbar">
            <header className="mb-8">
                <div className="flex items-center gap-4">
                    <BookOpenIcon className="w-8 h-8 md:w-10 md:h-10 text-accent" />
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Kennisbank</h1>
                        <p className="text-text-secondary mt-1 text-sm md:text-base">Leer hoe u oplichting kunt herkennen en voorkomen.</p>
                    </div>
                </div>
            </header>

            <div className="border-b border-surface-2 mb-8">
                <nav className="-mb-px flex space-x-2 sm:space-x-6 overflow-x-auto no-scrollbar">
                    <TabButton label="Scam Playbook" isActive={activeTab === 'playbook'} onClick={() => setActiveTab('playbook')} />
                    <TabButton label="Artikelen" isActive={activeTab === 'articles'} onClick={() => setActiveTab('articles')} />
                    <TabButton label="Toolkit" isActive={activeTab === 'toolkit'} onClick={() => setActiveTab('toolkit')} />
                </nav>
            </div>

            {renderContent()}

            {selectedArticle && <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
            {isQuizOpen && <ScamQuizModal onClose={() => setIsQuizOpen(false)} />}
            {isChecklistOpen && <ScamChecklistModal onClose={() => setIsChecklistOpen(false)} />}
        </div>
    );
};


const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`whitespace-nowrap py-3 px-2 sm:px-4 border-b-2 font-semibold text-sm transition-colors ${
      isActive
        ? 'border-accent text-accent'
        : 'border-transparent text-text-secondary hover:text-text-primary'
    }`}
  >
    {label}
  </button>
);


interface ArticleModalProps {
    article: KennisbankArticle;
    onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
    const [simplifiedContent, setSimplifiedContent] = useState<string | null>(null);
    const [isSimplifying, setIsSimplifying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSimplify = async () => {
        setIsSimplifying(true);
        setError(null);
        try {
            const result = await simplifyText(simplifiedContent || article.content);
            setSimplifiedContent(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Kon de tekst niet vereenvoudigen.');
        } finally {
            setIsSimplifying(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast"
            onClick={onClose}
        >
            <div
                className="bg-surface-1 w-full h-full sm:rounded-2xl sm:shadow-2xl sm:border sm:border-surface-2 sm:max-w-3xl sm:h-[80vh] flex flex-col m-0 sm:m-4 animate-slide-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between gap-4 p-4 border-b border-surface-2 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center text-accent">
                            <DynamicIcon name={article.icon} className="w-6 h-6" />
                        </div>
                        <h2 className="text-lg md:text-xl font-bold text-text-primary">{article.title}</h2>
                    </div>
                     <button onClick={onClose} className="text-text-tertiary hover:text-accent transition-colors">
                        <XCircleIcon className="w-7 h-7" />
                    </button>
                </header>
                <div className="p-6 md:p-8 overflow-y-auto no-scrollbar">
                    <div className="prose prose-sm md:prose-base max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1 prose-headings:font-semibold prose-headings:text-text-primary prose-strong:text-text-primary prose-a:text-accent">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{simplifiedContent || article.content}</ReactMarkdown>
                    </div>
                </div>
                 <footer className="p-4 border-t border-surface-2 flex-shrink-0 flex justify-end">
                    <button onClick={handleSimplify} disabled={isSimplifying} className="flex items-center gap-2 bg-accent/10 text-accent font-semibold py-2 px-4 rounded-lg hover:bg-accent/20 transition-colors disabled:opacity-50 disabled:cursor-wait">
                         {isSimplifying ? <div className="w-5 h-5 border-2 border-accent/50 border-t-accent rounded-full animate-spin"></div> : <SparklesIcon className="w-5 h-5" />}
                        Leg uit voor Beginners
                    </button>
                </footer>
            </div>
        </div>
    );
};

interface PlaybookCardProps {
    entry: PlaybookEntry;
    isExpanded: boolean;
    onToggle: () => void;
    index: number;
}

const PlaybookCard: React.FC<PlaybookCardProps> = ({ entry, isExpanded, onToggle, index }) => (
    <div className="bg-surface-1 rounded-xl border border-surface-2/50 transition-all duration-300 animate-slide-in-up" style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}>
        <button onClick={onToggle} className="w-full p-4 md:p-6 text-left flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-surface-2 flex items-center justify-center text-accent">
                    <DynamicIcon name={entry.icon} className="w-7 h-7" />
                </div>
                <div>
                    <h3 className="text-base md:text-lg font-bold text-text-primary">{entry.title}</h3>
                    <div className="flex gap-2 mt-1 flex-wrap">
                        {entry.tags.map(tag => (
                            <span key={tag} className="text-xs font-mono bg-surface-2 text-text-secondary px-2 py-0.5 rounded">{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
            <ChevronUpDownIcon className={`w-6 h-6 text-text-secondary transition-transform duration-300 ${isExpanded ? 'transform rotate-180' : ''}`} />
        </button>
        {isExpanded && (
            <div className="px-4 md:px-6 pb-6 space-y-4 animate-fade-in-fast">
                <div className="prose prose-sm max-w-none text-text-secondary">
                    <h4 className="font-semibold text-text-primary">Hoe werkt het?</h4>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.explanation}</ReactMarkdown>
                    
                    <h4 className="font-semibold text-text-primary mt-4">Voorbeeld</h4>
                    <div className="bg-background border border-surface-2 rounded-lg p-3 italic">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.example}</ReactMarkdown>
                    </div>

                    <h4 className="font-semibold text-text-primary mt-4">Belangrijkste Les</h4>
                    <div className="bg-caution/10 border-l-4 border-caution text-caution-800 p-3 rounded-r-lg">
                         <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.takeaway}</ReactMarkdown>
                    </div>
                </div>
            </div>
        )}
    </div>
);

interface ToolkitCardProps {
    icon: IconName;
    title: string;
    description: string;
    onClick: () => void;
    disabled?: boolean;
}

const ToolkitCard: React.FC<ToolkitCardProps> = ({ icon, title, description, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="bg-surface-1 rounded-xl p-6 text-left shadow-sm border border-surface-2/50 transition-all duration-300 hover:shadow-lg hover:border-accent/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
        <div className="flex items-center gap-4 mb-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-surface-2 flex items-center justify-center text-accent">
                <DynamicIcon name={icon} className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">{title}</h3>
        </div>
        <p className="text-sm text-text-secondary">{description}</p>
    </button>
);


export default KennisbankView;