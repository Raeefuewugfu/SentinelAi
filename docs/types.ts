

export enum AnalysisStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

export enum Recommendation {
  SAFE = 'Safe to Proceed',
  CAUTION = 'Use with Caution',
  AVOID = 'Avoid this Site',
}

export interface EvidenceItem {
  description: string;
  base64Image: string; // The full data URL e.g., "data:image/png;base64,..."
}

export interface AnalysisReport {
  safetyScore: number;
  summary: string;
  recommendation: Recommendation;
  // Make all analysis fields optional to support different report types
  domainAnalysis?: string;
  contentAnalysis?: string;
  policyAnalysis?: string;
  corporateAnalysis?: string;
  staticAnalysis?: string;
  behavioralAnalysis?: string;
  dependencyAnalysis?: string;
  originAnalysis?: string;
  frontendCodeAnalysis?: string;
  backendAccessAnalysis?: string;
  // New specific analysis fields
  emailAnalysis?: string;
  chatAnalysis?: string;
  imageAnalysis?: string;
  audioAnalysis?: string;
  evidence?: EvidenceItem[];
}

// New types for the agent interface
export type IconName = 'GlobeAltIcon' | 'ServerIcon' | 'LockClosedIcon' | 'CodeBracketIcon' | 'BuildingOfficeIcon' | 'BugAntIcon' | 'ArchiveBoxIcon' | 'UsersIcon' | 'MagnifyingGlassIcon' | 'DocumentTextIcon' | 'ShieldCheckIcon' | 'CpuChipIcon' | 'BeakerIcon' | 'FingerprintIcon' | 'DocumentDuplicateIcon' | 'WrenchScrewdriverIcon' | 'MegaphoneIcon' | 'BookOpenIcon' | 'EnvelopeIcon' | 'ChatBubbleBottomCenterTextIcon' | 'CurrencyDollarIcon' | 'SparklesIcon' | 'AtSymbolIcon' | 'UserCircleIcon' | 'CreditCardIcon' | 'MapIcon' | 'ChatBubbleOvalLeftEllipsisIcon' | 'QuestionMarkCircleIcon' | 'PhotoIcon' | 'MicrophoneIcon' | 'LinkIcon' | 'ChatBubbleLeftRightIcon' | 'ArrowPathIcon' | 'ChevronUpDownIcon' | 'LanguageIcon' | 'AcademicCapIcon' | 'ClipboardDocumentCheckIcon' | 'ArrowDownTrayIcon';

export interface AgentStep {
  tool: string;
  icon: IconName;
  thought: string;
  details: string; // Will accumulate markdown details here
  status: 'running' | 'complete';
}

export type AnalysisType = 'website' | 'email' | 'social' | 'webshop' | 'payment_link' | 'chat' | 'image' | 'audio' | 'document';
export type InvestigationMessageType = 'url' | 'file' | 'premium' | 'email' | 'chat' | 'image' | 'audio' | 'document';

export interface PremiumAnalysisReport {
    riskScore: number;
    recommendationColor: 'Green' | 'Orange' | 'Red';
    aiSummary: string;
    reputationCheck: {
        title: string;
        details: string;
    };
    domainInfo: {
        title: string;
        details: string;
    };
    ipInfo: {
        title: string;
        details: string;
    };
    contentAnalysis: {
        title: string;
        details: string;
    };
}

export type Message = {
  id: string;
  sender: 'user' | 'agent';
} & ({
  type: 'text';
  content: string;
} | {
  type: 'investigation';
  investigationType: InvestigationMessageType;
  subject: string; // URL, Filename, or other identifier
  steps: AgentStep[];
  status: 'running' | 'complete' | 'error';
} | {
  type: 'report';
  report: AnalysisReport;
  onReset: () => void;
  originalInput: string;
} | {
    type: 'premium_report',
    report: PremiumAnalysisReport,
    onReset: () => void,
});

// Types for the new Claim Submission feature
export type PaymentMethod = 'iDEAL / Bankoverschrijving' | 'Creditcard' | 'PayPal' | 'Klarna / Afterpay' | 'Cryptovaluta' | 'Cadeaukaart' | 'Anders';
export enum ScamScenario {
    PRODUCT_NOT_RECEIVED = "Ik heb iets gekocht, maar nooit ontvangen",
    SOCIAL_MEDIA_SCAM = "Ik ben opgelicht via social media",
    PHONE_SCAM = "Ik werd gebeld en moest geld overmaken",
    BANK_ACCOUNT_HIJACK = "Mijn bankrekening werd leeggehaald",
    IDENTITY_THEFT = "Iemand heeft mijn identiteit gebruikt",
    OTHER = "Anders",
}


export interface ClaimEvidence {
  name: string;
  type: string;
  size: number;
  base64: string; // Just the base64 part, not the data URL
}

export interface ClaimData {
  scenario: ScamScenario | string;
  scammerInfo: string; // Website or name
  scammerContactMethod: string;
  amount: string;
  currency: string;
  incidentDate: string;
  paymentMethod: PaymentMethod;
  description: string;
  evidence: ClaimEvidence[];
  fullName: string;
  email: string;
  country: string;
}

export interface GeneratedDocument {
  title: string;
  body: string;
  nextSteps: string;
}

export interface ClaimDocuments {
  chargebackRequest: GeneratedDocument;
  officialComplaint: GeneratedDocument;
  policeReport: GeneratedDocument;
}

export interface ClaimAssessment {
  scamChancePercentage: number;
  summary: string;
}

export interface ClaimGenerationResult {
  assessment: ClaimAssessment;
  documents: ClaimDocuments;
  preventionTips: string;
}

// Types for new Platform Features
export interface MeldkamerReport {
    id: string;
    domain: string;
    scamType: string;
    date: string; // Last seen date for sorting
    reportCount: number;
    status: 'Active' | 'Resolved' | 'Under Investigation';
    // New detailed fields for Scammer Profiles
    location: { lat: number; lon: number; country: string; };
    associatedIPs: string[];
    knownAliases: string[];
    firstSeen: string;
    threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    aiSummary: string;
    relatedReports: { id: string; domain: string, scamType: string }[];
}

export interface KennisbankArticle {
    id: string;
    title: string;
    icon: IconName;
    description: string;
    content: string; // Markdown content
}

// Types for Kennisbank 2.0
export interface PlaybookEntry {
    id: string;
    title: string;
    icon: IconName;
    tags: string[];
    explanation: string; // markdown
    example: string; // markdown
    takeaway: string; // markdown
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctOptionIndex: number;
    explanation: string;
}


// Types for new AI Helpdesk
export interface HelpMessage {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  isStreaming?: boolean;
}