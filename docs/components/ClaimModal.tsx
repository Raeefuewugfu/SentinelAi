
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnalysisReport, ClaimData, PaymentMethod, ClaimEvidence, ClaimGenerationResult, ScamScenario, GeneratedDocument } from '../types';
import { XCircleIcon, ShieldCheckIcon, DocumentDuplicateIcon, ArchiveBoxIcon, TrashIcon, CheckCircleIcon, PaperAirplaneIcon, LanguageIcon, LinkIcon, UsersIcon, AcademicCapIcon } from './icons';
import { generateClaimDocuments, translateDocument } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CustomSelect from './CustomSelect';

interface ClaimWizardProps {
  report?: AnalysisReport;
  onClose: () => void;
}

const initialClaimData: ClaimData = {
  scenario: ScamScenario.PRODUCT_NOT_RECEIVED,
  scammerInfo: '',
  scammerContactMethod: 'Website',
  amount: '',
  currency: 'EUR',
  incidentDate: new Date().toISOString().split('T')[0], // Default to today
  paymentMethod: 'iDEAL / Bankoverschrijving',
  description: '',
  evidence: [],
  fullName: '',
  email: '',
  country: 'Nederland',
};

const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Return only the Base64 part
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


const ClaimWizard: React.FC<ClaimWizardProps> = ({ report, onClose }) => {
  const [step, setStep] = useState(1);
  const [claimData, setClaimData] = useState<ClaimData>(() => {
    const data = {...initialClaimData};
    if (report?.summary) {
        // Try to extract URL from summary
        const urlMatch = report.summary.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
            try {
                const url = new URL(urlMatch[0]);
                data.scammerInfo = url.hostname;
            } catch (e) {
                // fallback if URL is malformed
                data.scammerInfo = 'Website uit Sentinel AI rapport';
            }
        }
        data.description = `De volgende claim is gebaseerd op een analyse van Sentinel AI. De AI gaf de website een veiligheidsscore van ${report.safetyScore}/100 en de aanbeveling "${report.recommendation}".\n\nSamenvatting van de analyse:\n${report.summary}`;
    }
    return data;
  });

  const [generatedResult, setGeneratedResult] = useState<ClaimGenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleNextStep = () => setStep(s => Math.min(s + 1, 7));
  const handlePrevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateClaimDocuments(claimData);
      setGeneratedResult(result);
      handleNextStep();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Een onbekende fout is opgetreden.');
      // Don't move to next step, show error on current step
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
       return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in-fast">
            <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-accent/20 rounded-full animate-pulse-node"></div>
                <ShieldCheckIcon className="w-16 h-16 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary">Uw Actieplan Wordt Voorbereid</h3>
            <p className="text-text-secondary mt-2 max-w-md">Sentinel AI analyseert uw zaak, vergelijkt deze met bekende fraudepatronen en stelt officiële documenten op...</p>
        </div>
       );
    }
    
    switch (step) {
      case 1: return <Step1Scenario data={claimData} setData={setClaimData} />;
      case 2: return <Step2Details data={claimData} setData={setClaimData} />;
      case 3: return <Step3Evidence data={claimData} setData={setClaimData} error={error} setError={setError} />;
      case 4: return <Step4Review />;
      case 5: return <Step5ActionPlan result={generatedResult!} data={claimData}/>;
      case 6: return <Step6LearnAndPrevent result={generatedResult!} />;
      case 7: return <Step7FollowUp />;
      default: return null;
    }
  };

  const maxSteps = 7;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-surface-1 w-full h-full sm:rounded-2xl sm:shadow-2xl sm:border sm:border-surface-2 sm:max-w-4xl sm:h-[90vh] flex flex-col m-0 sm:m-4 animate-slide-in-up" onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-surface-2 flex-shrink-0">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="w-7 h-7 text-accent"/>
            <div className="flex flex-col">
                <h2 className="text-lg font-bold text-text-primary leading-tight">Claim Wizard</h2>
                <p className="text-sm text-text-secondary leading-tight">Stap {step} van {maxSteps}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-text-tertiary hover:text-accent transition-colors"><XCircleIcon className="w-7 h-7" /></button>
        </header>
        
        <div className="flex-grow overflow-y-auto no-scrollbar">{renderContent()}</div>
        
        {!isLoading && step < maxSteps && (
          <footer className="flex items-center justify-between gap-4 p-4 border-t border-surface-2 flex-shrink-0 bg-background/50 rounded-b-2xl">
             <div>{error && step !== 3 && <p className="text-danger text-sm font-medium animate-fade-in-fast">{error}</p>}</div>
            <div className="flex items-center gap-4 ml-auto">
              {step > 1 && <button onClick={handlePrevStep} className="bg-surface-2 text-text-primary font-semibold py-2 px-5 rounded-lg hover:bg-surface-2/80 transition-colors">Terug</button>}
              
              {step < 4 ? 
                <button onClick={handleNextStep} className="bg-accent text-white font-semibold py-2 px-5 rounded-lg hover:opacity-90 transition-opacity">Volgende</button>
                : step === 4 ?
                <button onClick={handleSubmit} className="bg-accent text-white font-semibold py-2 px-5 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5"/>
                    Genereer Actieplan
                </button>
                : // step 5, 6
                 <button onClick={handleNextStep} className="bg-accent text-white font-semibold py-2 px-5 rounded-lg hover:opacity-90 transition-opacity">Volgende</button>
              }
            </div>
          </footer>
        )}
         {step === maxSteps && (
            <footer className="flex items-center justify-end gap-4 p-4 border-t border-surface-2 flex-shrink-0 bg-background/50 rounded-b-2xl">
                <button onClick={onClose} className="bg-accent text-white font-semibold py-2 px-5 rounded-lg hover:opacity-90 transition-opacity">Klaar</button>
            </footer>
         )}
      </div>
    </div>
  );
};

// --- Form Input Components ---
const FormInput: React.FC<{label: string, id: string, value: string, onChange: (v: string) => void, type?: string, required?: boolean, placeholder?: string}> = 
    ({ label, id, value, onChange, ...rest }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1.5">{label}</label>
        <input id={id} value={value} onChange={(e) => onChange(e.target.value)} {...rest} className="w-full bg-background text-text-primary placeholder-text-tertiary border border-surface-2 rounded-lg p-2.5 focus:ring-2 focus:ring-accent focus:border-accent focus:outline-none transition-all duration-200"/>
    </div>
);

const FormTextArea: React.FC<{label: string, id: string, value: string, onChange: (v: string) => void, placeholder: string, rows?: number}> = 
    ({ label, id, value, onChange, rows, ...rest }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1.5">{label}</label>
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={rows || 6} {...rest} className="w-full bg-background text-text-primary placeholder-text-tertiary border border-surface-2 rounded-lg p-2.5 focus:ring-2 focus:ring-accent focus:border-accent focus:outline-none transition-all duration-200" />
    </div>
);


// --- Step Components ---
const Step1Scenario: React.FC<{data: ClaimData, setData: React.Dispatch<React.SetStateAction<ClaimData>>}> = ({data, setData}) => {
    const scenarios = Object.values(ScamScenario);

    const handleScenarioChange = (scenario: ScamScenario) => {
        setData(prev => ({...prev, scenario: scenario === ScamScenario.OTHER ? '' : scenario}));
    }
    
    const isOther = !scenarios.includes(data.scenario as ScamScenario);
    
    return (
        <div className="p-4 md:p-8 animate-fade-in-fast">
            <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-2">Wat is er gebeurd?</h3>
            <p className="text-text-secondary mb-6 max-w-2xl text-sm md:text-base">Kies het scenario dat het beste bij uw situatie past. Dit helpt onze AI om de juiste documenten en adviezen voor te bereiden.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scenarios.filter(s => s !== ScamScenario.OTHER).map(scenario => (
                     <button key={scenario} onClick={() => handleScenarioChange(scenario)} className={`p-4 text-left rounded-lg border-2 transition-all duration-200 ${data.scenario === scenario ? 'border-accent bg-accent/10 scale-105' : 'border-surface-2 hover:border-accent/50 hover:bg-surface-2/30'}`}>
                        <span className="font-semibold text-text-primary">{scenario}</span>
                    </button>
                ))}
                <button onClick={() => handleScenarioChange(ScamScenario.OTHER)} className={`p-4 text-left rounded-lg border-2 transition-all duration-200 ${isOther ? 'border-accent bg-accent/10 scale-105' : 'border-surface-2 hover:border-accent/50 hover:bg-surface-2/30'}`}>
                    <span className="font-semibold text-text-primary">{ScamScenario.OTHER}</span>
                </button>
            </div>
            {isOther && (
                 <div className="mt-6 animate-fade-in-fast">
                    <FormInput label="Beschrijf uw unieke situatie kort" id="other_scenario" value={data.scenario} onChange={v => setData(p => ({...p, scenario: v}))} placeholder="Bijv. Ik ben gechanteerd met foto's..." />
                 </div>
            )}
        </div>
    );
};

const Step2Details: React.FC<{data: ClaimData, setData: React.Dispatch<React.SetStateAction<ClaimData>>}> = ({data, setData}) => {
    const handleDataChange = (field: keyof ClaimData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    return (
    <div className="p-4 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 animate-fade-in-fast">
        <div className="sm:col-span-2">
            <h3 className="text-xl font-bold text-text-primary mb-1">Persoonlijke & Transactiegegevens</h3>
            <p className="text-text-secondary text-sm">Deze gegevens zijn nodig om de documenten correct in te vullen.</p>
        </div>
        
        <div className="space-y-4 sm:col-span-1">
             <FormInput label="Volledige naam" id="fullName" value={data.fullName} onChange={v => handleDataChange('fullName', v)} required placeholder="Jan de Vries"/>
             <FormInput label="E-mailadres" id="email" type="email" value={data.email} onChange={v => handleDataChange('email', v)} required placeholder="jan.devries@email.com"/>
             <FormInput label="Land van verblijf" id="country" value={data.country} onChange={v => handleDataChange('country', v)} required placeholder="Nederland"/>
        </div>
        <div className="space-y-4 sm:col-span-1">
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Verloren bedrag" id="amount" type="number" placeholder="150.00" value={data.amount} onChange={v => handleDataChange('amount', v)} required />
              <CustomSelect
                label="Valuta"
                id="currency"
                value={data.currency}
                onChange={v => handleDataChange('currency', v)}
                options={[
                    { value: 'EUR', label: 'EUR - Euro' },
                    { value: 'USD', label: 'USD - US Dollar' },
                    { value: 'GBP', label: 'GBP - British Pound' },
                    { value: 'BTC', label: 'BTC - Bitcoin' },
                    { value: 'ETH', label: 'ETH - Ethereum' },
                    { value: 'Anders', label: 'Anders' },
                ]}
              />
            </div>
            <FormInput label="Datum van betaling" id="incidentDate" type="date" value={data.incidentDate} onChange={v => handleDataChange('incidentDate', v)} required />
             <CustomSelect
                label="Betaalmethode"
                id="paymentMethod"
                value={data.paymentMethod}
                onChange={v => handleDataChange('paymentMethod', v)}
                options={[
                    { value: 'iDEAL / Bankoverschrijving', label: 'iDEAL / Bankoverschrijving' },
                    { value: 'Creditcard', label: 'Creditcard' },
                    { value: 'PayPal', label: 'PayPal' },
                    { value: 'Klarna / Afterpay', label: 'Klarna / Afterpay' },
                    { value: 'Cryptovaluta', label: 'Cryptovaluta' },
                    { value: 'Cadeaukaart', label: 'Cadeaukaart' },
                    { value: 'Anders', label: 'Anders' },
                ]}
             />
        </div>
        
        <div className="sm:col-span-2 mt-4">
             <h3 className="text-xl font-bold text-text-primary mb-1">Informatie over de Oplichter</h3>
             <p className="text-text-secondary text-sm">Vul hier alles in wat u weet.</p>
        </div>

        <div className="space-y-4 sm:col-span-1">
            <FormInput label="Website of naam van de (ver)koper" id="scammerInfo" value={data.scammerInfo} onChange={v => handleDataChange('scammerInfo', v)} required placeholder="bv. niftystore.uk"/>
        </div>
         <div className="space-y-4 sm:col-span-1">
             <CustomSelect
                label="Hoe bent u benaderd?"
                id="scammerContactMethod"
                value={data.scammerContactMethod}
                onChange={v => handleDataChange('scammerContactMethod', v)}
                options={[
                   { value: 'Website', label: 'Website' },
                   { value: 'Social Media (Instagram, Facebook, etc.)', label: 'Social Media' },
                   { value: 'Marktplaats (Ebay, etc.)', label: 'Marktplaats' },
                   { value: 'Telefoon / SMS', label: 'Telefoon / SMS' },
                   { value: 'E-mail', label: 'E-mail' },
                   { value: 'WhatsApp / Telegram', label: 'WhatsApp / Telegram' },
                   { value: 'Anders', label: 'Anders' },
                ]}
            />
        </div>
    </div>
    );
};

const Step3Evidence: React.FC<{data: ClaimData, setData: React.Dispatch<React.SetStateAction<ClaimData>>, error: string | null, setError: (e: string | null) => void}> = ({data, setData, error, setError}) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = useCallback(async (files: FileList) => {
        setError(null);
        let currentEvidence = data.evidence;

        for (const file of Array.from(files)) {
          if (file.size > 5 * 1024 * 1024) { // 5MB limit per file
              setError(`Bestand "${file.name}" is te groot (max 5MB).`);
              continue;
          }
          const base64 = await fileToBase64(file);
          currentEvidence = [...currentEvidence, { name: file.name, type: file.type, size: file.size, base64 }];
        }
        setData(prev => ({...prev, evidence: currentEvidence}));
    }, [data.evidence, setData, setError]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
    }, [handleFiles]);
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) handleFiles(e.target.files);
    };
    
    const removeEvidence = (index: number) => {
      setData(prev => ({...prev, evidence: prev.evidence.filter((_, i) => i !== index)}));
    };

    return (
        <div className="p-4 md:p-8 space-y-6 animate-fade-in-fast">
            <div>
                <h3 className="text-xl md:text-2xl font-bold text-text-primary">Uw Verhaal & Bewijsmateriaal</h3>
                <p className="text-text-secondary mt-1 text-sm md:text-base">Een duidelijke beschrijving en sterk bewijs vergroten uw kans op succes aanzienlijk.</p>
            </div>
            <FormTextArea label="Beschrijf gedetailleerd wat er is gebeurd" id="description" placeholder="Geef een helder, chronologisch verslag van het incident. Vermeld data, namen, en alle details die u zich herinnert." value={data.description} onChange={v => setData(p => ({...p, description: v}))} rows={8}/>
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Bewijsmateriaal Uploaden</label>
                <div
                    className={`relative w-full border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 cursor-pointer ${isDragging ? 'border-accent bg-accent/10' : 'border-surface-2 hover:border-accent/50'}`}
                    onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
                    onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/gif, application/pdf" />
                    <div className="flex flex-col items-center">
                        <ArchiveBoxIcon className="w-10 h-10 mx-auto text-text-tertiary" />
                        <p className="mt-2 text-text-primary"><span className="font-semibold text-accent">Klik om te uploaden</span> of sleep bestanden hierheen</p>
                        <p className="text-xs text-text-tertiary mt-1">Screenshots, e-mails, PDF's, etc. (max 5MB per stuk)</p>
                    </div>
                </div>
                {error && <p className="text-danger text-sm mt-2 font-semibold animate-fade-in-fast">{error}</p>}
                {data.evidence.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <h4 className="font-semibold text-text-secondary text-sm">Geüploade bestanden:</h4>
                        {data.evidence.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-surface-2/50 p-2 rounded-lg text-sm animate-fade-in-fast">
                                <span className="font-mono truncate pr-4">{file.name} ({formatBytes(file.size)})</span>
                                <button onClick={() => removeEvidence(index)} className="text-text-tertiary hover:text-danger p-1 rounded-full hover:bg-danger/10"><TrashIcon className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const Step4Review: React.FC = () => (
    <div className="p-4 md:p-8 text-center flex flex-col items-center justify-center h-full animate-fade-in-fast">
        <ShieldCheckIcon className="w-16 h-16 md:w-20 md:h-20 text-accent mb-4"/>
        <h3 className="text-xl md:text-2xl font-bold text-text-primary">Klaar voor de Laatste Stap</h3>
        <p className="text-text-secondary mt-2 max-w-2xl mx-auto text-sm md:text-base">Sentinel AI staat op het punt om uw gegevens te analyseren en een volledig juridisch dossier met documenten voor u op te stellen. Dit proces kan even duren.</p>
        <div className="bg-surface-2/30 p-4 rounded-lg mt-6 max-w-2xl w-full border border-surface-2">
            <h4 className="font-semibold text-text-primary">Disclaimer</h4>
            <p className="text-xs md:text-sm text-text-secondary mt-1">Door verder te gaan, begrijpt u dat Sentinel AI documentsjablonen en begeleiding biedt, maar geen juridisch advies geeft of een uitkomst garandeert. De gegenereerde documenten moeten zorgvuldig worden gecontroleerd voordat ze worden verzonden. De verstrekte gegevens worden alleen gebruikt om deze documenten te genereren.</p>
        </div>
    </div>
);

type DocKey = 'chargebackRequest' | 'officialComplaint' | 'policeReport';

const Step5ActionPlan: React.FC<{result: ClaimGenerationResult, data: ClaimData}> = ({result, data}) => {
    const [activeTab, setActiveTab] = useState<DocKey>('chargebackRequest');
    const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});
    const [translatedDocs, setTranslatedDocs] = useState<Partial<Record<DocKey, string>>>({});
    const [isTranslating, setIsTranslating] = useState<DocKey | null>(null);


    const handleCopy = (textToCopy: string, key: string) => {
        navigator.clipboard.writeText(textToCopy);
        setCopiedStates(prev => ({...prev, [key]: true}));
        setTimeout(() => setCopiedStates(prev => ({...prev, [key]: false})), 2000);
    }
    
    const handleDownload = () => {
        const formatDoc = (doc: GeneratedDocument) => {
            if (!doc) return "";
            return `---------- ${doc.title.toUpperCase()} ----------\n\n${doc.body}\n\n### VOLGENDE STAPPEN:\n${doc.nextSteps}\n\n`;
        };

        const content = `
# Claim Dossier - Sentinel AI
Datum generatie: ${new Date().toLocaleString('nl-NL')}
Case: ${data.scammerInfo}

==================================================
# AI-ANALYSE
==================================================
KANS OP OPLICHTING: ${result.assessment.scamChancePercentage}%
SAMENVATTING:
${result.assessment.summary}

==================================================
# UW DOCUMENTEN
==================================================

${formatDoc(result.documents.chargebackRequest)}
${formatDoc(result.documents.officialComplaint)}
${formatDoc(result.documents.policeReport)}

==================================================
# AI MENTOR - PREVENTIETIPS
==================================================
${result.preventionTips}

        `.trim();
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sentinel-claim-dossier-${data.scammerInfo.replace(/[^a-z0-9]/gi, '_')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleTranslate = async (text: string, key: DocKey) => {
        if (!text) return;
        setIsTranslating(key);
        try {
            const translation = await translateDocument(text, 'English');
            setTranslatedDocs(prev => ({...prev, [key]: translation}));
        } catch (e) {
            setTranslatedDocs(prev => ({...prev, [key]: "Translation failed. Please try again."}))
        } finally {
            setIsTranslating(null);
        }
    }
    
    const assessmentColor = result.assessment.scamChancePercentage > 75 ? 'text-danger' : result.assessment.scamChancePercentage > 40 ? 'text-caution' : 'text-safe';

    const renderDoc = (doc: GeneratedDocument | null, key: DocKey) => (
        !doc ? <p className="text-text-secondary p-4">Document niet relevant voor dit scenario.</p> :
        <div className="space-y-4 animate-fade-in-fast">
             <div className="flex justify-between items-start gap-4">
                <h4 className="text-lg md:text-xl font-bold text-text-primary">{doc.title}</h4>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => handleTranslate(doc.body, key)} disabled={!!isTranslating} className="flex items-center gap-2 bg-surface-2 font-semibold py-2 px-3 rounded-lg transition-all text-sm text-text-primary hover:bg-surface-2/80 disabled:opacity-50">
                        {isTranslating === key ? <div className="w-5 h-5 border-2 border-text-secondary/50 border-t-text-secondary rounded-full animate-spin"></div> : <LanguageIcon className="w-5 h-5"/>}
                    </button>
                    <button onClick={() => handleCopy(doc.body, key+'_nl')} className={`flex items-center gap-2 bg-surface-2 font-semibold py-2 px-3 rounded-lg transition-all text-sm ${copiedStates[key+'_nl'] ? 'bg-safe/20 text-safe' : 'text-text-primary hover:bg-surface-2/80'}`}>
                        {copiedStates[key+'_nl'] ? <CheckCircleIcon className="w-5 h-5" /> : <DocumentDuplicateIcon className="w-5 h-5" />}
                    </button>
                </div>
             </div>
             <div className="bg-background p-4 rounded-lg border border-surface-2 whitespace-pre-wrap font-mono text-xs md:text-sm text-text-secondary h-48 overflow-y-auto no-scrollbar">{doc.body}</div>
             {translatedDocs[key] && (
                <div className="animate-fade-in-fast space-y-2">
                    <h5 className="font-semibold text-text-primary text-base">English Translation</h5>
                    <div className="bg-background p-4 rounded-lg border border-surface-2 whitespace-pre-wrap font-mono text-xs md:text-sm text-text-secondary h-48 overflow-y-auto no-scrollbar">{translatedDocs[key]}</div>
                </div>
             )}
             <div>
                <h5 className="font-semibold text-text-primary mb-2">Aanbevolen Volgende Stappen</h5>
                 <div className="prose prose-sm max-w-none text-text-secondary bg-surface-2/30 border border-surface-2/50 p-4 rounded-lg prose-p:my-1 prose-ul:my-2 prose-li:my-1 prose-strong:text-text-primary">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.nextSteps}</ReactMarkdown>
                </div>
             </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 animate-fade-in-fast">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                 <div>
                    <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-2">Uw Persoonlijke Actieplan is Gereed</h3>
                    <p className="text-text-secondary mb-6 max-w-3xl text-sm md:text-base">Hieronder vindt u de door AI opgestelde documenten en stappen. Handel snel, aangezien er vaak tijdslimieten gelden voor het indienen van claims.</p>
                 </div>
                 <button onClick={handleDownload} className="flex-shrink-0 bg-accent/10 text-accent font-semibold py-2 px-4 rounded-lg hover:bg-accent/20 transition-colors flex items-center gap-2 ml-0 sm:ml-4 w-full sm:w-auto justify-center">
                    <ArchiveBoxIcon className="w-5 h-5"/>
                    <span>Download Dossier</span>
                 </button>
            </div>
             
             <div className="bg-surface-2/30 border border-surface-2 rounded-xl p-6 mb-8 flex flex-col md:flex-row gap-6 items-center">
                <div className="md:w-1/3 flex flex-col items-center justify-center text-center">
                    <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Scam Inschatting</p>
                    <p className={`text-6xl md:text-7xl font-bold ${assessmentColor}`}>{result.assessment.scamChancePercentage}<span className="text-3xl md:text-4xl opacity-50">%</span></p>
                    <p className="font-semibold text-text-primary">Kans op oplichting</p>
                </div>
                <div className="md:w-2/3">
                    <h4 className="font-bold text-text-primary">AI Analyse Samenvatting</h4>
                    <p className="text-text-secondary text-sm mt-2">{result.assessment.summary}</p>
                </div>
             </div>

             <div className="flex border-b border-surface-2 mb-6 overflow-x-auto no-scrollbar">
                 <TabButton id="chargebackRequest" activeTab={activeTab} setActiveTab={setActiveTab}>1. Terugvordering</TabButton>
                 <TabButton id="officialComplaint" activeTab={activeTab} setActiveTab={setActiveTab}>2. Klacht</TabButton>
                 <TabButton id="policeReport" activeTab={activeTab} setActiveTab={setActiveTab}>3. Aangifte</TabButton>
             </div>
             <div>
                {activeTab === 'chargebackRequest' && renderDoc(result.documents.chargebackRequest, 'chargebackRequest')}
                {activeTab === 'officialComplaint' && renderDoc(result.documents.officialComplaint, 'officialComplaint')}
                {activeTab === 'policeReport' && renderDoc(result.documents.policeReport, 'policeReport')}
             </div>
        </div>
    );
};

const Step6LearnAndPrevent: React.FC<{ result: ClaimGenerationResult }> = ({ result }) => {
    return (
        <div className="p-4 md:p-8 animate-fade-in-fast space-y-6">
            <div className="flex items-center gap-4">
                <AcademicCapIcon className="w-10 h-10 md:w-12 md:h-12 text-accent flex-shrink-0" />
                <div>
                    <h3 className="text-xl md:text-2xl font-bold text-text-primary">AI Mentor: Leer & Voorkom</h3>
                    <p className="text-text-secondary mt-1 max-w-3xl text-sm md:text-base">Om te voorkomen dat dit opnieuw gebeurt, heeft de AI op basis van uw case de volgende persoonlijke tips opgesteld.</p>
                </div>
            </div>

            <div className="bg-surface-2/30 border border-surface-2 rounded-xl p-6 prose prose-sm md:prose-base max-w-none text-text-secondary prose-p:my-2 prose-ul:my-2 prose-li:my-1 prose-strong:text-text-primary">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.preventionTips}</ReactMarkdown>
            </div>
        </div>
    );
};


const Step7FollowUp: React.FC = () => {

  const AuthorityCard: React.FC<{name: string, description: string, url: string}> = ({ name, description, url }) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className="bg-surface-2/50 hover:bg-surface-2/80 border border-surface-2 rounded-lg p-4 flex items-center gap-4 transition-colors group">
      <LinkIcon className="w-6 h-6 text-text-secondary group-hover:text-accent flex-shrink-0" />
      <div>
        <h4 className="font-bold text-text-primary">{name}</h4>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
    </a>
  );
  
  return (
    <div className="p-4 md:p-8 animate-fade-in-fast space-y-8">
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-text-primary">Versturen & Opvolgen</h3>
        <p className="text-text-secondary mt-1 max-w-3xl text-sm md:text-base">De laatste stap. Gebruik de documenten uit de vorige stap om uw zaak officieel te melden bij de juiste instanties. Dit vergroot de kans dat de oplichters worden gestopt.</p>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-text-primary">Officiële Melding Maken</h4>
        <p className="text-sm text-text-secondary">Gebruik de onderstaande links om direct naar de juiste meldpunten te gaan. Plak daar de relevante teksten uit uw actieplan.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AuthorityCard 
            name="Politie"
            description="Doe online aangifte van internetoplichting."
            url="https://www.politie.nl/aangifte-of-melding-doen"
          />
          <AuthorityCard 
            name="Fraudehelpdesk"
            description="Meld hier alle vormen van (online) fraude."
            url="https://www.fraudehelpdesk.nl/fraude-melden/"
          />
           <AuthorityCard 
            name="ACM ConsuWijzer"
            description="Meld problemen met (web)winkels en misleidende praktijken."
            url="https://www.consuwijzer.nl/doe-uw-melding-bij-acm-consuwijzer"
          />
            <AuthorityCard 
            name="CCV (voor ondernemers)"
            description="Meldpunt voor criminaliteit tegen het bedrijfsleven."
            url="https://hetccv.nl/onderwerpen/cybercrime/wat-te-doen-bij-cybercrime/meldpunten/"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-text-primary">Professionele Hulp Nodig?</h4>
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-6 flex flex-col md:flex-row items-center text-center md:text-left gap-6">
            <UsersIcon className="w-12 h-12 md:w-16 md:h-16 text-accent flex-shrink-0" />
            <div>
                <h5 className="text-lg md:text-xl font-bold text-text-primary">Schakel een Partnerjurist in</h5>
                <p className="text-text-secondary mt-2 mb-4 text-sm md:text-base">Voor complexe zaken, grote bedragen of als u simpelweg de zaak uit handen wilt geven, kan een gespecialiseerde jurist u helpen. Zij kunnen het volledige traject overnemen en uw kans op succes maximaliseren.</p>
                <button className="bg-accent text-white font-semibold py-2 px-5 rounded-lg hover:opacity-90 transition-opacity">
                    Neem contact op voor juridische hulp
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}


const TabButton: React.FC<{id: DocKey, activeTab: string, setActiveTab: (id: any) => void, children: React.ReactNode}> = ({id, activeTab, setActiveTab, children}) => (
    <button onClick={() => setActiveTab(id)} className={`px-3 py-2 text-sm md:px-4 md:py-2 font-semibold md:text-sm transition-colors duration-200 -mb-px border-b-2 flex-shrink-0 ${activeTab === id ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
        {children}
    </button>
)

export default ClaimWizard;