

import React, { useState, useRef } from 'react';
import { PremiumAnalysisReport } from '../types';
import { ShieldCheckIcon, SparklesIcon } from './icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PremiumResultsDisplayProps {
  report: PremiumAnalysisReport;
  onReset: () => void;
}

const RiskScoreGauge: React.FC<{ score: number, color: 'Green' | 'Orange' | 'Red' }> = ({ score, color }) => {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const colorMap = {
    'Red': 'hsl(var(--color-danger-hsl))',
    'Orange': 'hsl(var(--color-caution-hsl))',
    'Green': 'hsl(var(--color-safe-hsl))',
  };
  const textColorClass = {
    'Red': 'text-danger',
    'Orange': 'text-caution',
    'Green': 'text-safe',
  }

  return (
    <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="hsl(var(--color-surface-2-hsl))" strokeWidth="8"/>
        <circle
          cx="60" cy="60" r={radius} fill="none"
          stroke={colorMap[color]}
          strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.23, 1, 0.32, 1)' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`font-sans text-4xl md:text-5xl font-bold ${textColorClass[color]}`}>{score}</span>
        <span className="text-text-secondary text-xs font-semibold uppercase tracking-wider mt-1">Risk Score</span>
      </div>
    </div>
  );
};

const TabButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-shrink-0 px-3 py-3 md:px-4 font-semibold text-sm transition-all duration-200 border-b-2 ${
            isActive
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:border-surface-2 hover:text-text-primary'
        }`}
    >
        {label}
    </button>
);


const PremiumResultsDisplay: React.FC<PremiumResultsDisplayProps> = ({ report, onReset }) => {
    const [activeTab, setActiveTab] = useState('summary');
    const pdfRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    
    const handleDownloadPdf = () => {
        if (!pdfRef.current) return;
        setIsDownloading(true);
        html2canvas(pdfRef.current, {
            backgroundColor: '#181b21', // Match your dark background
            scale: 2, // Increase resolution
            useCORS: true,
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            let imgHeight = pdfWidth / ratio;
            
            // if image is taller than a page, we split it.
            let heightLeft = imgHeight;
            let position = 0;
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();

            while (heightLeft > 0) {
              position = -heightLeft;
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
              heightLeft -= pdf.internal.pageSize.getHeight();
            }
            pdf.save(`sentinel-premium-report.pdf`);
            setIsDownloading(false);
        }).catch(err => {
            console.error("Error generating PDF:", err);
            setIsDownloading(false);
        });
    };

    const tabs = [
        { id: 'summary', label: 'AI Samenvatting' },
        { id: 'reputation', label: report.reputationCheck.title },
        { id: 'domain', label: report.domainInfo.title },
        { id: 'ip', label: report.ipInfo.title },
        { id: 'content', label: report.contentAnalysis.title },
    ];
    
    const renderContent = () => {
        const contentMap: Record<string, string> = {
            summary: report.aiSummary,
            reputation: report.reputationCheck.details,
            domain: report.domainInfo.details,
            ip: report.ipInfo.details,
            content: report.contentAnalysis.details,
        };
        const content = contentMap[activeTab];
        return (
             <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-2 prose-li:my-1 prose-strong:text-text-primary prose-code:text-accent-2 animate-fade-in-fast">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
        )
    }

    // Invert score for display (100 risk = 0 gauge)
    const displayScore = 100 - report.riskScore;

    return (
    <div className="w-full max-w-5xl p-2 md:p-4 animate-fade-in">
        <div ref={pdfRef} className="bg-surface-1 p-4 md:p-8 rounded-2xl border border-surface-2">
            <header className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent font-bold text-sm px-4 py-2 rounded-full mb-4">
                    <SparklesIcon className="w-5 h-5"/>
                    <span>Premium AI-Scan Resultaat</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Gedetailleerd Inlichtingenrapport</h1>
                <p className="text-text-secondary mt-1 text-sm md:text-base">Hier is het diepgaande rapport van Sentinel Prime.</p>
            </header>

            <div className="flex flex-col lg:flex-row gap-8 mb-8">
                <div className="lg:w-1/3 flex flex-col items-center justify-center bg-surface-2/30 rounded-xl p-6 border border-surface-2">
                    <RiskScoreGauge score={report.riskScore} color={report.recommendationColor} />
                </div>
                <div className="lg:w-2/3 flex items-center">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                            <ShieldCheckIcon className="w-7 h-7 md:w-8 md:h-8 text-accent" />
                            <h2 className="text-xl md:text-2xl font-bold text-text-primary">Samenvatting & Aanbeveling</h2>
                        </div>
                        <div className="prose prose-sm md:prose-base max-w-none text-text-secondary">
                             <ReactMarkdown remarkPlugins={[remarkGfm]}>{report.aiSummary}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-surface-2/30 rounded-xl border border-surface-2">
                <nav className="border-b border-surface-2 flex items-center px-2 md:px-4 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <TabButton key={tab.id} label={tab.label} isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}/>
                    ))}
                </nav>
                <div className="p-4 md:p-6 min-h-[200px]">
                    {renderContent()}
                </div>
            </div>
        </div>
        
         <div className="text-center mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onReset}
              className="w-full sm:w-auto bg-surface-2 text-text-primary font-semibold py-3 px-6 rounded-lg hover:bg-surface-2/80 transition-opacity"
            >
              Start Nieuwe Scan
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="w-full sm:w-auto bg-accent text-white font-semibold py-3 px-6 rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
            >
              {isDownloading ? 'Genereren...' : 'Download PDF'}
            </button>
        </div>
    </div>
  );
};

export default PremiumResultsDisplay;