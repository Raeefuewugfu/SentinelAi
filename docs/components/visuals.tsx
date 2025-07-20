

import React, { useState, useEffect } from 'react';
import { GlobeAltIcon, CommandLineIcon, FingerprintIcon, BeakerIcon, MagnifyingGlassIcon } from './icons';
import { InvestigationMessageType } from '../types';

interface VisualProps {
  isGrandpaMode?: boolean;
}

export const WorldGlobe: React.FC<VisualProps> = ({ isGrandpaMode }) => {
  if (isGrandpaMode) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-20" style={{ perspective: '1000px' }}>
      <div className="w-[400px] h-[400px] relative globe-spin" style={{ transformStyle: 'preserve-3d' }}>
        <div className="absolute inset-0 rounded-full border-2 border-accent/30"></div>
        <div className="absolute inset-0 rounded-full border-2 border-accent/30 transform rotate-y-60"></div>
        <div className="absolute inset-0 rounded-full border-2 border-accent/30 transform rotate-y-120"></div>
        <div className="absolute inset-4 rounded-full bg-accent/5 opacity-50 shadow-2xl shadow-accent/40"></div>
      </div>
    </div>
  );
};

const terminalLines = [
  "Connection established with target...",
  "Querying for known signatures...",
  "Executing heuristic analysis routines...",
  "Cross-referencing with threat intelligence feeds...",
  "> Analyzing response packets...",
  "No overt anomalies detected in initial scan.",
  "Proceeding to deeper analysis...",
  "Clear.",
];

export const TerminalOutput: React.FC<{command: string, isGrandpaMode?: boolean}> = ({ command, isGrandpaMode }) => {
    const [lines, setLines] = useState<string[]>([`$ ${command}`]);
    
    useEffect(() => {
        if(isGrandpaMode) return;
        let i = 0;
        const interval = setInterval(() => {
            if (i < terminalLines.length) {
                setLines(prev => [...prev, terminalLines[i]]);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 450);
        return () => clearInterval(interval);
    }, [command, isGrandpaMode]);

    if (isGrandpaMode) {
      return (
        <div className="bg-black/50 p-4 rounded-lg border border-surface-2 w-full max-w-md h-64 font-mono text-lg text-green-400 flex items-center justify-center">
          <p className="animate-pulse">Checking the details...</p>
        </div>
      )
    }

    return (
        <div className="bg-black/50 p-4 rounded-lg border border-surface-2 w-full max-w-md h-64 font-mono text-sm text-green-400 overflow-hidden">
            <div className="overflow-y-auto h-full">
            {lines.map((line, i) => (
                <p key={i} className="whitespace-pre-wrap animate-fade-in-fast" style={{animationDelay: `${i*50}ms`}}>{line}</p>
            ))}
             <div className="w-2 h-4 bg-green-400 animate-pulse inline-block ml-1 mt-1"></div>
            </div>
        </div>
    );
};

export const GenericVisual: React.FC<{ tool: string }> = ({ tool }) => (
    <div className="flex flex-col items-center justify-center text-center">
        <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute w-16 h-16 bg-accent/20 rounded-full animate-pulse-node"></div>
            <GlobeAltIcon className="w-12 h-12 text-accent" />
        </div>
        <p className="mt-4 text-text-secondary">AI is performing deep analysis for:</p>
        <p className="font-semibold text-text-primary">{tool}</p>
    </div>
);

export const FileScanVisual: React.FC<{ tool: string }> = ({ tool }) => (
    <div className="flex flex-col items-center justify-center text-center">
        <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute w-16 h-16 bg-accent/20 rounded-full animate-pulse-node"></div>
            <FingerprintIcon className="w-12 h-12 text-accent" />
        </div>
        <p className="mt-4 text-text-secondary">AI is performing deep analysis for:</p>
        <p className="font-semibold text-text-primary">{tool}</p>
    </div>
);

export const SandboxVisual: React.FC<{ tool: string }> = ({ tool }) => (
    <div className="flex flex-col items-center justify-center text-center">
        <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute w-16 h-16 bg-caution/20 rounded-full animate-pulse-node"></div>
            <BeakerIcon className="w-12 h-12 text-caution" />
        </div>
        <p className="mt-4 text-text-secondary">Simulating file execution in secure sandbox:</p>
        <p className="font-semibold text-text-primary">{tool}</p>
    </div>
);


export const SynthesizingVisual: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center">
        <div className="relative w-24 h-24 flex items-center justify-center">
             <div className="absolute w-full h-full bg-safe/20 rounded-full animate-ping opacity-75"></div>
             <div className="absolute w-20 h-20 bg-safe/20 rounded-full animate-ping opacity-75" style={{animationDelay: '0.5s'}}></div>
            <CommandLineIcon className="w-12 h-12 text-safe" />
        </div>
        <p className="mt-4 text-text-secondary">Synthesizing all data points...</p>
        <p className="font-semibold text-text-primary">Generating final report.</p>
    </div>
);

export const EvidenceExtractionVisual: React.FC<{ tool: string }> = ({ tool }) => (
    <div className="flex flex-col items-center justify-center text-center">
        <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute w-16 h-16 bg-accent/20 rounded-full animate-pulse-node"></div>
            <MagnifyingGlassIcon className="w-12 h-12 text-accent" />
        </div>
        <p className="mt-4 text-text-secondary">Searching for evidentiary materials:</p>
        <p className="font-semibold text-text-primary">{tool}</p>
    </div>
);


// --- Visual Map ---
// Maps a tool name from the Gemini response to a specific visual component.
interface VisualComponentProps { subject: string; tool: string; investigationType: InvestigationMessageType; isGrandpaMode?: boolean }
export const VisualMap: Record<string, React.FC<VisualComponentProps>> = {
  // URL Tools
  "WHOIS Lookup": ({ tool }) => <GenericVisual tool={tool} />,
  "DNS Record Scan": ({ subject, isGrandpaMode }) => <TerminalOutput command={`dig +trace ${new URL(subject).hostname}`} isGrandpaMode={isGrandpaMode} />,
  "SSL Certificate Validation": ({ tool }) => <GenericVisual tool={tool} />,
  "Technology Stack ID": ({ tool }) => <GenericVisual tool={tool} />,
  "Corporate Background Check": ({ tool }) => <GenericVisual tool={tool} />,
  "Malware & Phishing Scan": ({ subject, isGrandpaMode }) => <TerminalOutput command={`scan --deep ${new URL(subject).hostname}`} isGrandpaMode={isGrandpaMode} />,
  "Public Breach Check": ({ subject, isGrandpaMode }) => <TerminalOutput command={`breach-check --domain ${new URL(subject).hostname}`} isGrandpaMode={isGrandpaMode} />,
  "Social Media Scan": ({ tool }) => <GenericVisual tool={tool} />,
  "Historical Archive Scan": ({ tool }) => <GenericVisual tool={tool} />,
  "Web Search Simulation": ({ tool }) => <GenericVisual tool={tool} />,
  "Content & Policy Scan": ({ tool }) => <GenericVisual tool={tool} />,
  "Synthesizing Findings": () => <SynthesizingVisual />,

  // File Tools
  "File Metadata Extraction": ({ tool }) => <FileScanVisual tool={tool} />,
  "Static Signature Scan": ({ subject, isGrandpaMode }) => <TerminalOutput command={`scan --signatures ${subject}`} isGrandpaMode={isGrandpaMode} />,
  "Heuristic Code Analysis": ({ tool }) => <GenericVisual tool={tool} />,
  "Frontend Code Review": ({ subject, isGrandpaMode }) => <TerminalOutput command={`lint --security-audit ${subject}`} isGrandpaMode={isGrandpaMode} />,
  "Backend Access Scan": ({ subject, isGrandpaMode }) => <TerminalOutput command={`netstat --find-backend ${subject}`} isGrandpaMode={isGrandpaMode} />,
  "Behavioral Sandbox Simulation": ({ tool }) => <SandboxVisual tool={tool} />,
  "Dependency Vulnerability Check": ({ subject, isGrandpaMode }) => <TerminalOutput command={`dep-check ${subject}`} isGrandpaMode={isGrandpaMode} />,
  "Evidence Extraction": ({ tool }) => <EvidenceExtractionVisual tool={tool} />,
};