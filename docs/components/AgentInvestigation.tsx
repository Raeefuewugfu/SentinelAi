



import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AgentStep, InvestigationMessageType } from '../types';
import { DynamicIcon, CheckCircleIcon, XCircleIcon } from './icons';
import * as Visuals from './visuals';
import TypingEffect from './TypingEffect';

const TimelineSidebar: React.FC<{ steps: AgentStep[], status: 'running' | 'complete' | 'error'}> = ({ steps, status }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom of timeline on new step
    if(scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [steps.length]);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto bg-black/20 p-4 space-y-4 relative no-scrollbar">
      <div className="sticky top-0 bg-black/0 backdrop-blur-sm z-10 -m-4 p-4 mb-0">
        <h3 className="text-lg font-bold text-text-primary">Mission Log</h3>
        <p className="text-sm text-text-secondary">Following Sentinel's progress...</p>
      </div>

      <div className="relative pt-4">
        {steps.length > 0 && <div className="absolute left-5 top-4 bottom-0 w-0.5 bg-surface-2/60 rounded-full"></div>}
        {steps.map((step, index) => {
          const isRunning = step.status === 'running';
          const isComplete = step.status === 'complete';

          return (
            <div key={index} className="relative flex gap-4 animate-slide-in-up" style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}>
              <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-surface-1 border-2 border-surface-2">
                {isRunning && <div className="w-5 h-5 rounded-full border-2 border-accent/50 border-t-accent animate-spin"></div>}
                {isComplete && <CheckCircleIcon className="w-6 h-6 text-safe" />}
                {!isRunning && !isComplete && <DynamicIcon name={step.icon} className="w-5 h-5 text-text-secondary" />}
              </div>
              <div className="flex-1 pb-6">
                <p className="font-semibold text-text-primary">{step.tool}</p>
                <p className="text-sm text-text-secondary italic">"{step.thought}"</p>
                {isComplete && step.details && (
                  <div className="prose prose-sm max-w-none text-text-secondary prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-code:text-accent-2 prose-strong:text-text-primary pr-2 mt-2 border-l-2 border-surface-2 pl-4">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{step.details}</ReactMarkdown>
                  </div>
                )}
                 {isRunning && step.details && (
                  <div className="prose prose-sm max-w-none text-text-secondary prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-code:text-accent-2 prose-strong:text-text-primary pr-2 mt-2 border-l-2 border-surface-2 pl-4">
                     <TypingEffect fullText={step.details} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const Visualizer: React.FC<{ subject: string; investigationType: InvestigationMessageType; currentStep: AgentStep | null, status: string, isGrandpaMode: boolean }> = ({ subject, investigationType, currentStep, status, isGrandpaMode }) => {
    const VisualComponent = currentStep ? Visuals.VisualMap[currentStep.tool] || Visuals.GenericVisual : Visuals.GenericVisual;
    const title = status === 'complete' ? "Analysis Complete" : status === 'error' ? "Error Encountered" : currentStep?.tool || "Initiating Scan...";
    
    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-6 overflow-hidden">
            <Visuals.WorldGlobe isGrandpaMode={isGrandpaMode} />
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm"></div>
            <div className="relative z-10 text-center w-full h-full flex flex-col items-center justify-center">
                <h2 className="text-xl md:text-2xl font-bold text-text-primary animate-text-flicker-in" key={title}>{title}</h2>
                <div className="mt-4 w-full flex-grow flex items-center justify-center">
                    <VisualComponent subject={subject} tool={title} investigationType={investigationType} isGrandpaMode={isGrandpaMode}/>
                </div>
            </div>
        </div>
    );
};


interface AgentInvestigationProps {
  subject: string;
  investigationType: InvestigationMessageType;
  steps: AgentStep[];
  status: 'running' | 'complete' | 'error';
  isGrandpaMode: boolean;
}

const AgentInvestigation: React.FC<AgentInvestigationProps> = ({ subject, investigationType, steps, status, isGrandpaMode }) => {
  const currentRunningStep = steps.find(s => s.status === 'running') || steps[steps.length - 1] || null;

  return (
    <div className="w-full h-full max-w-5xl bg-surface-1 rounded-2xl shadow-lg border border-surface-2 overflow-hidden animate-fade-in-fast relative animated-grid flex flex-col">
       <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-background"></div>
      
      <div className="relative w-full h-full flex-grow grid grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-2 h-[40vh] md:h-full border-b md:border-b-0 md:border-r border-surface-2/50">
            <Visualizer subject={subject} investigationType={investigationType} currentStep={currentRunningStep} status={status} isGrandpaMode={isGrandpaMode} />
        </div>
        <div className="md:col-span-1 h-[45vh] md:h-full overflow-hidden">
           <TimelineSidebar steps={steps} status={status} />
        </div>
      </div>
      
       <footer className="relative bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-background to-transparent text-center text-sm font-medium flex-shrink-0 z-20 pointer-events-none">
        {status === 'running' && <p className="text-text-secondary animate-pulse">Investigation in progress...</p>}
        {status === 'complete' && <p className="text-safe font-semibold">Investigation Complete. Generating report...</p>}
        {status === 'error' && <p className="text-danger font-semibold">An error occurred during investigation.</p>}
      </footer>
    </div>
  );
};

export default AgentInvestigation;