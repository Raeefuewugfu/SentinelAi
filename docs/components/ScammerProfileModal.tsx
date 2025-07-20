

import React, { useEffect } from 'react';
import { MeldkamerReport } from '../types';
import { XCircleIcon, ShieldCheckIcon, ServerIcon, UsersIcon, DocumentTextIcon } from './icons';

interface ScammerProfileModalProps {
  report: MeldkamerReport;
  onClose: () => void;
}

const ScammerProfileModal: React.FC<ScammerProfileModalProps> = ({ report, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  const getThreatLevelClass = (level: string) => {
    switch(level) {
        case 'Critical': return 'bg-danger text-white';
        case 'High': return 'bg-danger/80 text-white';
        case 'Medium': return 'bg-caution text-black';
        case 'Low': return 'bg-safe text-black';
        default: return 'bg-surface-2 text-text-secondary';
    }
  }

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-surface-1 w-full h-full sm:rounded-2xl sm:shadow-2xl sm:border sm:border-surface-2 sm:max-w-3xl sm:h-[85vh] flex flex-col m-0 sm:m-4 animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-surface-2 flex-shrink-0">
            <div className='flex items-center gap-4'>
                <div className='flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-surface-2 rounded-lg flex items-center justify-center'>
                    <ShieldCheckIcon className="w-6 h-6 md:w-7 md:h-7 text-accent" />
                </div>
                <div>
                    <h2 className="text-base md:text-xl font-bold text-text-primary font-mono">{report.domain}</h2>
                    <p className="text-sm text-text-secondary">{report.scamType}</p>
                </div>
            </div>
            <button onClick={onClose} className="text-text-tertiary hover:text-accent transition-colors">
                <XCircleIcon className="w-7 h-7" />
            </button>
        </header>
        <div className="p-4 md:p-8 overflow-y-auto no-scrollbar space-y-6">
            <div className="bg-surface-2/50 border border-surface-2 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">AI Dreigingsanalyse</h3>
                <p className="text-sm md:text-base text-text-secondary">{report.aiSummary}</p>
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <p className="text-xs text-text-tertiary">Threat Level</p>
                        <span className={`px-3 py-1 text-sm font-bold rounded-full ${getThreatLevelClass(report.threatLevel)}`}>{report.threatLevel}</span>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-xs text-text-tertiary">First Seen / Last Seen</p>
                        <p className="font-semibold text-text-primary">{report.firstSeen} / {report.date}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h4 className="font-semibold text-text-primary border-b border-surface-2 pb-2">Technische Footprint</h4>
                    <div className="text-sm space-y-2">
                        <p className="font-medium text-text-secondary">Geassocieerde IP Adressen:</p>
                        <ul className="pl-4">
                            {report.associatedIPs.map(ip => <li key={ip} className="font-mono text-text-primary list-disc list-inside">{ip}</li>)}
                        </ul>
                    </div>
                </div>
                <div className="space-y-4">
                    <h4 className="font-semibold text-text-primary border-b border-surface-2 pb-2">Bekende Aliassen & Links</h4>
                     <div className="text-sm space-y-2">
                        <p className="font-medium text-text-secondary">Bekende Aliassen:</p>
                        {report.knownAliases.length > 0 ? (
                            <ul className="pl-4">
                                {report.knownAliases.map(alias => <li key={alias} className="font-mono text-text-primary list-disc list-inside">{alias}</li>)}
                            </ul>
                        ) : <p className="text-text-tertiary italic">Geen bekende aliassen.</p>}
                    </div>
                    <div className="text-sm space-y-2">
                        <p className="font-medium text-text-secondary">Gerelateerde Rapporten:</p>
                        {report.relatedReports.length > 0 ? (
                             <ul className="pl-4">
                                {report.relatedReports.map(rel => <li key={rel.id} className="font-mono text-text-primary list-disc list-inside">{rel.domain}</li>)}
                            </ul>
                        ) : <p className="text-text-tertiary italic">Geen gerelateerde rapporten.</p>}
                    </div>
                </div>
            </div>
            
        </div>
      </div>
    </div>
  );
};

export default ScammerProfileModal;