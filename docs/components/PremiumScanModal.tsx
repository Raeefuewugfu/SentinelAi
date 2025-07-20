

import React, { useEffect } from 'react';
import { XCircleIcon, ShieldCheckIcon, SparklesIcon, CheckCircleIcon } from './icons';

interface PremiumScanModalProps {
  onClose: () => void;
  onChoice: (isPremium: boolean) => void;
}

const PremiumScanModal: React.FC<PremiumScanModalProps> = ({ onClose, onChoice }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const freeFeatures = [
    "Basis WHOIS-check",
    "Standaard scam-database check",
    "Algemene veiligheidsscore"
  ];

  const premiumFeatures = [
    "Historische data & abuse-logs",
    "AI-contentanalyse op scamtaal",
    "Deep scan op 15+ databases",
    "IP tracing & TOR/VPN-detectie",
    "E-mail header analyse (SPF/DMARC)",
    "Gedetailleerd PDF-rapport",
    "Prioriteitsscan (snel resultaat)"
  ];

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast"
      onClick={onClose}
    >
      <div
        className="bg-surface-1 w-full h-full sm:rounded-2xl sm:shadow-2xl sm:border sm:border-surface-2 sm:max-w-3xl sm:h-auto flex flex-col m-0 sm:m-4 animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-surface-2">
          <h2 className="text-xl font-bold text-text-primary">Kies uw Scantype</h2>
          <button onClick={onClose} className="text-text-tertiary hover:text-accent transition-colors">
            <XCircleIcon className="w-7 h-7" />
          </button>
        </header>

        <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Basis Scan */}
          <div className="border border-surface-2 rounded-xl p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-text-secondary"/>
                <h3 className="text-2xl font-bold text-text-primary">Basis Scan</h3>
            </div>
            <p className="text-text-secondary mb-4 flex-grow text-sm md:text-base">Een snelle, gratis controle op de meest voorkomende rode vlaggen.</p>
            <ul className="space-y-2 mb-6 text-sm">
                {freeFeatures.map(feat => (
                    <li key={feat} className="flex items-center gap-2 text-text-secondary">
                        <CheckCircleIcon className="w-5 h-5 text-safe/70 flex-shrink-0" />
                        <span>{feat}</span>
                    </li>
                ))}
            </ul>
            <button 
                onClick={() => onChoice(false)}
                className="w-full mt-auto bg-surface-2 text-text-primary font-semibold py-2.5 px-5 rounded-lg hover:bg-surface-2/80 transition-colors"
            >
                Start Gratis Scan
            </button>
          </div>
          
          {/* Premium Scan */}
          <div className="border-2 border-accent rounded-xl p-6 flex flex-col bg-accent/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 px-4 py-1 bg-accent text-white text-xs font-bold rounded-bl-lg">MEEST GEKOZEN</div>
            <div className="flex items-center gap-3 mb-4">
                <SparklesIcon className="w-8 h-8 text-accent"/>
                <h3 className="text-2xl font-bold text-text-primary">Premium AI-Scan</h3>
            </div>
            <p className="text-text-secondary mb-4 flex-grow text-sm md:text-base">Een diepgaand onderzoek met 12+ analysepunten voor maximale zekerheid.</p>
            <ul className="space-y-2 mb-6 text-sm">
                 {premiumFeatures.map(feat => (
                    <li key={feat} className="flex items-center gap-2 text-text-primary">
                        <CheckCircleIcon className="w-5 h-5 text-accent flex-shrink-0" />
                        <span className="font-medium">{feat}</span>
                    </li>
                ))}
            </ul>
             <button
                onClick={() => onChoice(true)}
                className="w-full mt-auto bg-accent text-white font-semibold py-2.5 px-5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
                <SparklesIcon className="w-5 h-5"/>
                Start Premium Scan (€4,95)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumScanModal;