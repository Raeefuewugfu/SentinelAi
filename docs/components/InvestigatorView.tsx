



import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AnalysisReport, Message, AgentStep, PremiumAnalysisReport, IconName, InvestigationMessageType } from '../types';
import { analyzeUrlForScamsStream, performPremiumAnalysisStream, analyzeFileForMalwareStream } from '../services/geminiService';
import ResultsDisplay from './ResultsDisplay';
import AgentInvestigation from './AgentInvestigation';
import PremiumScanModal from './PremiumScanModal';
import PremiumResultsDisplay from './PremiumResultsDisplay';
import { ShieldCheckIcon, PaperAirplaneIcon, DynamicIcon, PlusIcon } from './icons';
import FileDropzone from './FileDropzone';
import ScamBaiterModal from './ScamBaiterModal';

interface InvestigatorViewProps {
  isGrandpaMode: boolean;
}

type AnalysisToolType = 'website' | 'email' | 'chat' | 'image' | 'audio' | 'document';

interface AnalysisTool {
  label: string;
  inputType: 'text' | 'textarea' | 'file';
  placeholder: string;
  icon: IconName;
  fileAccept?: string;
  investigationType: InvestigationMessageType;
}

const analysisTools: Record<AnalysisToolType, AnalysisTool> = {
    website: { label: 'Website URL', inputType: 'text', placeholder: 'Enter a website URL...', icon: 'GlobeAltIcon', investigationType: 'url' },
    email: { label: 'Email Content', inputType: 'textarea', placeholder: 'Paste full email content and headers here...', icon: 'EnvelopeIcon', investigationType: 'email' },
    chat: { label: 'Chat Log', inputType: 'textarea', placeholder: 'Paste chat conversation here...', icon: 'ChatBubbleLeftRightIcon', investigationType: 'chat' },
    image: { label: 'Image File', inputType: 'file', placeholder: 'Drop an image file here', icon: 'PhotoIcon', fileAccept: 'image/*', investigationType: 'image' },
    audio: { label: 'Audio File', inputType: 'file', placeholder: 'Drop an audio file here', icon: 'MicrophoneIcon', fileAccept: 'audio/*', investigationType: 'audio' },
    document: { label: 'Document File', inputType: 'file', placeholder: 'Drop any document here', icon: 'DocumentTextIcon', fileAccept: '.pdf,.doc,.docx,.txt', investigationType: 'document' },
};


const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });

const InvestigatorView: React.FC<InvestigatorViewProps> = ({ isGrandpaMode }) => {
  const [analysisType, setAnalysisType] = useState<AnalysisToolType>('website');
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [isToolSelectorOpen, setIsToolSelectorOpen] = useState(false);
  const toolSelectorRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const [isBaiterOpen, setIsBaiterOpen] = useState(false);
  const [baiterInput, setBaiterInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentTool = analysisTools[analysisType];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolSelectorRef.current && !toolSelectorRef.current.contains(event.target as Node)) {
        setIsToolSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'init',
        sender: 'agent',
        type: 'text',
        content: "Welkom bij de Sentinel AI Investigator. Selecteer een tool en voer uw doelwit in om een diepgaand veiligheidsonderzoek te starten."
      }]);
    }
  }, [messages.length]);
  
  const handleReset = () => {
    setMessages(prev => [...prev, {
        id: 'reset' + Date.now(),
        sender: 'agent',
        type: 'text',
        content: "Klaar voor een nieuw onderzoek. Selecteer een tool en voer een doelwit in."
    }]);
    setError(null);
    setIsLoading(false);
    setInputValue('');
    setSelectedFile(null);
  };

  const handleGenerateBait = (originalInput: string) => {
    setBaiterInput(originalInput);
    setIsBaiterOpen(true);
  };

  const processStream = async (stream: AsyncGenerator<any>, investigationId: string, isPremium: boolean) => {
    let buffer = '';
    for await (const chunk of stream) {
        buffer += chunk.text || '';
        
        let stepMatch;
        while ((stepMatch = buffer.match(/§STEP_START§([\s\S]*?)§STEP_END§/))) {
            const stepBlock = stepMatch[0];
            const stepContent = stepMatch[1].trim();
            const detailsForPrevStep = buffer.substring(0, stepMatch.index);

            try {
                const jsonMatch = stepContent.match(/\{[\s\S]*\}/);
                if (!jsonMatch) throw new Error("No JSON object found in step block.");
                const newStepData: Omit<AgentStep, 'details' | 'status'> = JSON.parse(jsonMatch[0]);

                 setMessages(prev => prev.map(msg => {
                    if (msg.id === investigationId && msg.type === 'investigation') {
                        const updatedSteps = [...msg.steps];
                        if (updatedSteps.length > 0) {
                            const lastStep = updatedSteps[updatedSteps.length - 1];
                            lastStep.details = (lastStep.details || '') + detailsForPrevStep;
                            lastStep.status = 'complete';
                        }
                        updatedSteps.push({ ...newStepData, details: '', status: 'running' });
                        return { ...msg, steps: updatedSteps };
                    }
                    return msg;
                }));
            } catch (e) { console.error("Failed to parse step JSON:", stepContent, e); }

            buffer = buffer.substring(stepMatch.index + stepBlock.length);
        }

        const reportTag = isPremium ? 'PREMIUM_REPORT' : 'REPORT';
        const reportMatch = buffer.match(new RegExp(`§${reportTag}_START§([\\s\\S]*?)§${reportTag}_END§`));
        
        if (reportMatch) {
            const reportContent = reportMatch[1].trim();
            const detailsForLastStep = buffer.substring(0, reportMatch.index);
            
            try {
                const jsonMatch = reportContent.match(/\{[\s\S]*\}/);
                if (!jsonMatch) throw new Error("No JSON object found in report block.");
                
                let reportMessage: Message;
                const originalInputForReport = currentTool.inputType === 'file' ? selectedFile?.name || 'uploaded file' : inputValue;

                if(isPremium) {
                    const finalReport: PremiumAnalysisReport = JSON.parse(jsonMatch[0]);
                    reportMessage = { id: (Date.now() + 2).toString(), sender: 'agent', type: 'premium_report', report: finalReport, onReset: handleReset };
                } else {
                    const finalReport: AnalysisReport = JSON.parse(jsonMatch[0]);
                    reportMessage = { id: (Date.now() + 2).toString(), sender: 'agent', type: 'report', report: finalReport, onReset: handleReset, originalInput: originalInputForReport };
                }
                
                setMessages(prev => {
                    const updatedMessages = prev.map(msg => {
                        if (msg.id === investigationId && msg.type === 'investigation') {
                             if(msg.steps.length > 0) {
                                const lastStep = msg.steps[msg.steps.length - 1];
                                lastStep.details = (lastStep.details || '') + detailsForLastStep;
                                lastStep.status = 'complete';
                            }
                            return {...msg, status: 'complete' } as Message;
                        }
                        return msg;
                    });
                    updatedMessages.push(reportMessage);
                    return updatedMessages;
                });

            } catch (e) {
                console.error("Failed to parse final report JSON:", reportContent, e);
                throw new Error("De AI gaf een onjuist opgemaakt eindrapport terug.");
            }
            buffer = '';
        }
    }
  };

  const startAnalysis = useCallback(async (isPremium: boolean = false) => {
    setIsLoading(true);
    setError(null);

    const investigationId = Date.now().toString();
    const subject = currentTool.inputType === 'file' ? selectedFile!.name : inputValue;
    const userMessageContent = currentTool.inputType === 'file' ? `Start analyse voor bestand: ${subject}` : `Start analyse voor: ${subject}`;

    const userMessage: Message = { id: (Date.now() -1).toString(), sender: 'user', type: 'text', content: userMessageContent };
    const investigationMessage: Message = {
        id: investigationId,
        sender: 'agent',
        type: 'investigation',
        investigationType: currentTool.investigationType,
        subject: subject,
        steps: [],
        status: 'running',
    };

    setMessages(prev => [...prev, userMessage, investigationMessage]);

    try {
        let stream;
        // Simplified: using analyzeUrlForScamsStream for text and analyzeFileForMalwareStream for files.
        // In a real app, you'd have dedicated service functions as planned.
        if (currentTool.inputType === 'file') {
            const fileData = await fileToBase64(selectedFile!);
            stream = await analyzeFileForMalwareStream(selectedFile!.name, selectedFile!.type, fileData, isGrandpaMode);
        } else {
            stream = await analyzeUrlForScamsStream(inputValue, isGrandpaMode);
        }
        await processStream(stream, investigationId, isPremium);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Er is een onbekende fout opgetreden.';
        setError(errorMessage);
        setMessages(prev => prev.map(msg => 
            (msg.id === investigationId && msg.type === 'investigation') ? { ...msg, status: 'error' } : msg
        ));
    } finally {
        setIsLoading(false);
    }
  }, [inputValue, selectedFile, analysisType, isGrandpaMode, currentTool.inputType, currentTool.investigationType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isFile = currentTool.inputType === 'file';
    if (isLoading || (isFile && !selectedFile) || (!isFile && !inputValue.trim())) return;

    if (analysisType === 'website') {
       setIsPremiumModalOpen(true);
    } else {
       startAnalysis(false);
    }
  };
  
  const handlePremiumChoice = (isPremium: boolean) => {
    setIsPremiumModalOpen(false);
    if(isPremium) {
        setIsProcessingPayment(true);
        setTimeout(async () => {
            setIsLoading(true);
            setError(null);
            const investigationId = Date.now().toString();
            const userMessage: Message = { id: (Date.now() -1).toString(), sender: 'user', type: 'text', content: `Start Premium Analyse: ${inputValue}` };
            const investigationMessage: Message = { id: investigationId, sender: 'agent', type: 'investigation', investigationType: 'premium', subject: inputValue, steps: [], status: 'running' };
            setMessages(prev => [...prev, userMessage, investigationMessage]);
            try {
                const stream = await performPremiumAnalysisStream('website', inputValue, isGrandpaMode);
                await processStream(stream, investigationId, true);
            } catch (err) {
                 const errorMessage = err instanceof Error ? err.message : 'Er is een onbekende fout opgetreden.';
                setError(errorMessage);
            } finally {
                 setIsLoading(false);
                 setIsProcessingPayment(false);
            }
        }, 1500);
    } else {
        startAnalysis(false);
    }
  };

  const renderMessageContent = (message: Message) => {
    switch(message.type) {
      case 'text':
        return <div className="px-4 py-2"><p>{message.content}</p></div>;
      case 'investigation':
        return <AgentInvestigation subject={message.subject} investigationType={message.investigationType} steps={message.steps} status={message.status} isGrandpaMode={isGrandpaMode} />;
      case 'report':
        return <ResultsDisplay report={message.report} onReset={message.onReset} originalInput={message.originalInput} onGenerateBait={handleGenerateBait} />;
      case 'premium_report':
        return <PremiumResultsDisplay report={message.report} onReset={message.onReset} />;
      default:
        return null;
    }
  };

  if (isProcessingPayment) {
      return (
          <div className="h-full w-full flex flex-col items-center justify-center p-4 text-center animate-fade-in-fast">
              <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 bg-accent/20 rounded-full animate-pulse-node"></div>
                  <ShieldCheckIcon className="w-16 h-16 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary">Betaling Verwerken...</h3>
              <p className="text-text-secondary mt-2 max-w-md">Uw premium scan wordt voorbereid. Een moment geduld alstublieft.</p>
          </div>
      )
  }

  return (
    <div className="h-full w-full flex flex-col items-center p-2 sm:p-4 overflow-hidden">
        {isPremiumModalOpen && <PremiumScanModal onChoice={handlePremiumChoice} onClose={() => setIsPremiumModalOpen(false)} />}
        {isBaiterOpen && <ScamBaiterModal originalEmail={baiterInput} onClose={() => setIsBaiterOpen(false)} />}
        
        <div className="flex-1 w-full max-w-5xl overflow-y-auto mb-4 space-y-6 pt-4 px-2 md:pt-6 md:px-2 no-scrollbar">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-2 md:gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                   {msg.sender === 'agent' && <div className="w-8 h-8 rounded-full bg-surface-1 flex items-center justify-center flex-shrink-0 mt-1 border border-surface-2"><ShieldCheckIcon className="w-5 h-5 text-text-secondary"/></div>}
                    <div className={`transition-all duration-300 w-full
                      ${msg.sender === 'user' 
                        ? 'bg-accent text-white rounded-2xl max-w-[90%] sm:max-w-[80%]' 
                        : (msg.type === 'investigation' || msg.type === 'report' || msg.type === 'premium_report')
                          ? 'bg-transparent'
                          : 'bg-surface-1 text-text-primary border border-surface-2 rounded-2xl max-w-[90%] sm:max-w-[80%]'}`
                    }>
                       {renderMessageContent(msg)}
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        <footer className="w-full max-w-5xl flex-shrink-0 p-2">
            <form onSubmit={handleSubmit} className="w-full bg-surface-1 rounded-xl p-2 md:p-3 border border-surface-2 shadow-sm">
                <div className="flex items-start sm:items-center gap-2 md:gap-3">
                    <div className="relative" ref={toolSelectorRef}>
                         <button
                            type="button"
                            onClick={() => setIsToolSelectorOpen(p => !p)}
                            className="flex-shrink-0 flex items-center justify-center h-11 w-11 sm:w-auto sm:px-3 sm:py-2 text-sm font-semibold rounded-md transition-colors duration-200 bg-surface-2 text-text-primary hover:bg-surface-2/80"
                            aria-haspopup="true"
                            aria-expanded={isToolSelectorOpen}
                        >
                            <DynamicIcon name={currentTool.icon} className="w-5 h-5" />
                            <span className="hidden sm:inline ml-2">{currentTool.label}</span>
                        </button>
                        {isToolSelectorOpen && (
                             <div className="absolute bottom-full mb-2 w-64 bg-surface-2 border border-surface-2/50 shadow-lg rounded-md p-2 z-10 animate-fade-in-fast">
                                {Object.entries(analysisTools).map(([key, tool]) => (
                                    <button 
                                        key={key}
                                        type="button"
                                        onClick={() => { setAnalysisType(key as AnalysisToolType); setInputValue(''); setSelectedFile(null); setError(null); setIsToolSelectorOpen(false); }}
                                        className={`w-full flex items-center text-left gap-3 p-2 text-sm font-medium rounded-md transition-colors duration-200 ${analysisType === key ? 'bg-accent text-white' : 'text-text-primary hover:bg-accent/10'}`}
                                    >
                                        <DynamicIcon name={tool.icon} className="w-5 h-5" />
                                        <span>{tool.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="relative flex-grow">
                        {currentTool.inputType === 'file' ? (
                            <FileDropzone onFileSelect={setSelectedFile} selectedFile={selectedFile} disabled={isLoading} />
                        ) : (
                           <textarea
                               value={inputValue}
                               disabled={isLoading}
                               onChange={(e) => setInputValue(e.target.value)}
                               onFocus={() => setError(null)}
                               placeholder={isLoading ? "Onderzoek loopt..." : currentTool.placeholder}
                               className="w-full bg-background text-text-primary placeholder-text-tertiary border border-surface-2 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent focus:border-accent focus:outline-none transition-all duration-300 text-sm sm:text-base resize-none"
                               rows={currentTool.inputType === 'textarea' ? 3 : 1}
                               aria-label="Target Input"
                           />
                        )}
                    </div>
                     <button
                       type="submit"
                       disabled={isLoading || (currentTool.inputType === 'file' ? !selectedFile : !inputValue.trim())}
                       className="bg-accent text-white w-11 h-11 rounded-full transition-all duration-300 disabled:bg-surface-2 disabled:text-text-secondary disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 group hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                       aria-label="Investigate"
                     >
                       {isLoading ? 
                         <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : 
                         <PaperAirplaneIcon className="w-5 h-5" />
                       }
                     </button>
                </div>
                {error && <p className="text-danger text-center text-sm font-medium pt-2 animate-fade-in-fast">{error}</p>}
            </form>
        </footer>
    </div>
  );
};

export default InvestigatorView;