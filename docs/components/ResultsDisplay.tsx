



import React, { useState } from 'react';
import { AnalysisReport, Recommendation } from '../types';
import ScoreGauge from './ScoreGauge';
import { ShieldCheckIcon, DocumentTextIcon, CodeBracketIcon, GlobeAltIcon, BuildingOfficeIcon, FingerprintIcon, BeakerIcon, ArchiveBoxIcon, ServerIcon, SparklesIcon, EnvelopeIcon, ChatBubbleLeftRightIcon, PhotoIcon, MicrophoneIcon } from './icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ClaimWizard from './ClaimModal';

interface ResultsDisplayProps {
  report: AnalysisReport;
  onReset: () => void;
  originalInput: string;
  onGenerateBait: (input: string) => void;
}

const getRecommendationClasses = (recommendation: Recommendation) => {
  switch (recommendation) {
    case Recommendation.SAFE:
      return 'bg-safe/10 text-safe border-safe/20';
    case Recommendation.CAUTION:
      return 'bg-caution/10 text-caution border-caution/20';
    case Recommendation.AVOID:
      return 'bg-danger/10 text-danger border-danger/20';
    default:
      return 'bg-surface-2 text-text-secondary border-surface-2';
  }
};

const ResultCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-surface-1 rounded-xl p-4 md:p-6 shadow-sm border border-surface-2/50 transition-shadow hover:shadow-md hover:border-accent/30">
        <div className="flex items-center gap-4 mb-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center text-accent">{icon}</div>
            <h3 className="text-base md:text-lg font-semibold text-text-primary">{title}</h3>
        </div>
        <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-a:text-accent prose-strong:text-text-primary prose-code:text-accent-2">
           <ReactMarkdown remarkPlugins={[remarkGfm]}>{children as string}</ReactMarkdown>
        </div>
    </div>
);


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ report, onReset, originalInput, onGenerateBait }) => {
  const [isClaimWizardOpen, setIsClaimWizardOpen] = useState(false);
  const recommendationClasses = getRecommendationClasses(report.recommendation);
  
  const isEmailReport = !!report.emailAnalysis;
  const showBaiterButton = isEmailReport && report.recommendation === Recommendation.AVOID;

  return (
    <div className="w-full max-w-5xl p-2 md:p-4 animate-fade-in">
        <header className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Analysis Complete</h1>
            <p className="text-text-secondary mt-1 text-sm md:text-base">Here is the detailed security report from Sentinel.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="lg:w-1/3 flex flex-col items-center justify-center bg-surface-1 rounded-xl p-6 shadow-sm border border-surface-2">
                <ScoreGauge score={report.safetyScore} />
                <div className={`mt-6 text-center font-semibold text-lg p-3 rounded-lg w-full border ${recommendationClasses}`}>
                    {report.recommendation}
                </div>
            </div>
             <div className="lg:w-2/3 bg-surface-1 rounded-xl p-6 md:p-8 shadow-sm border border-surface-2 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-3">
                    <ShieldCheckIcon className="w-7 h-7 md:w-8 md:h-8 text-accent" />
                    <h2 className="text-xl md:text-2xl font-bold text-text-primary">Executive Summary</h2>
                </div>
                <p className="text-text-secondary leading-relaxed text-sm md:text-base">{report.summary}</p>
            </div>
        </div>
        
        {report.evidence && report.evidence.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-4 text-center">Extracted Evidence</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.evidence.map((item, index) => (
                <div key={index} className="bg-surface-1 rounded-xl p-4 shadow-sm border border-surface-2/50 animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                  <img src={item.base64Image} alt={item.description} className="rounded-lg w-full object-contain mb-3 border border-surface-2" />
                  <p className="text-sm text-text-secondary text-center italic">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* URL Analysis Cards */}
            {report.domainAnalysis && <ResultCard title="Domain & Infrastructure" icon={<GlobeAltIcon className="w-6 h-6" />} children={report.domainAnalysis} />}
            {report.contentAnalysis && <ResultCard title="Content & Behavior" icon={<CodeBracketIcon className="w-6 h-6" />} children={report.contentAnalysis} />}
            {report.policyAnalysis && <ResultCard title="Policy Review" icon={<DocumentTextIcon className="w-6 h-6" />} children={report.policyAnalysis} />}
            {report.corporateAnalysis && <ResultCard title="Corporate Background" icon={<BuildingOfficeIcon className="w-6 h-6" />} children={report.corporateAnalysis} />}
            
            {/* File Analysis Cards */}
            {report.staticAnalysis && <ResultCard title="Static Analysis" icon={<FingerprintIcon className="w-6 h-6" />} children={report.staticAnalysis} />}
            {report.behavioralAnalysis && <ResultCard title="Behavioral Analysis" icon={<BeakerIcon className="w-6 h-6" />} children={report.behavioralAnalysis} />}
            {report.frontendCodeAnalysis && <ResultCard title="Frontend Code Review" icon={<CodeBracketIcon className="w-6 h-6" />} children={report.frontendCodeAnalysis} />}
            {report.backendAccessAnalysis && <ResultCard title="Backend Access Scan" icon={<ServerIcon className="w-6 h-6" />} children={report.backendAccessAnalysis} />}
            {report.dependencyAnalysis && <ResultCard title="Dependencies & Libraries" icon={<ArchiveBoxIcon className="w-6 h-6" />} children={report.dependencyAnalysis} />}
            {report.originAnalysis && <ResultCard title="Author & Signature" icon={<BuildingOfficeIcon className="w-6 h-6" />} children={report.originAnalysis} />}

            {/* New Report type cards */}
            {report.emailAnalysis && <ResultCard title="Email Analysis" icon={<EnvelopeIcon className="w-6 h-6" />} children={report.emailAnalysis} />}
            {report.chatAnalysis && <ResultCard title="Chat Analysis" icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />} children={report.chatAnalysis} />}
            {report.imageAnalysis && <ResultCard title="Image Analysis" icon={<PhotoIcon className="w-6 h-6" />} children={report.imageAnalysis} />}
            {report.audioAnalysis && <ResultCard title="Audio Analysis" icon={<MicrophoneIcon className="w-6 h-6" />} children={report.audioAnalysis} />}
        </div>
        
        <div className="text-center mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onReset}
              className="w-full sm:w-auto bg-surface-2 text-text-primary font-semibold py-3 px-6 rounded-lg hover:bg-surface-2/80 transition-opacity"
            >
              Start New Analysis
            </button>
            <button
              onClick={() => setIsClaimWizardOpen(true)}
              className="w-full sm:w-auto bg-accent text-white font-semibold py-3 px-6 rounded-lg hover:opacity-80 transition-opacity"
            >
              Claim Indienen
            </button>
            {showBaiterButton && (
                 <button
                    onClick={() => onGenerateBait(originalInput)}
                    className="w-full sm:w-auto bg-caution/10 text-caution font-semibold py-3 px-6 rounded-lg hover:bg-caution/20 transition-colors flex items-center justify-center gap-2"
                >
                    <SparklesIcon className="w-5 h-5"/>
                    Genereer Scambait Reactie
                </button>
            )}
        </div>
        {isClaimWizardOpen && <ClaimWizard report={report} onClose={() => setIsClaimWizardOpen(false)} />}
    </div>
  );
};

export default ResultsDisplay;