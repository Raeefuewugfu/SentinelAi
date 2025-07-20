



import React, { useState, useEffect } from 'react';
import { ShieldCheckIcon } from './components/icons';
import ClaimWizard from './components/ClaimModal';
import SideNav from './components/SideNav';
import InvestigatorView from './components/InvestigatorView';
import MeldkamerView from './components/MeldkamerView';
import KennisbankView from './components/KennisbankView';
import ScamMapView from './components/ScamMapView';
import HelpWidget from './components/HelpWidget';

type ActivePage = 'investigator' | 'meldkamer' | 'kennisbank' | 'scammap';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<ActivePage>('investigator');
  const [isGrandpaMode, setIsGrandpaMode] = useState(() => localStorage.getItem('sentinel-grandpa-mode') === 'true');
  const [isClaimWizardOpen, setIsClaimWizardOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Simulate app loading
    const timer = setTimeout(() => setIsInitializing(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // This now just toggles a class for components to optionally use.
    // Base font sizes should be handled by responsive utilities.
    if (isGrandpaMode) {
      document.body.classList.add('grandpa-mode');
    } else {
      document.body.classList.remove('grandpa-mode');
    }
    localStorage.setItem('sentinel-grandpa-mode', String(isGrandpaMode));
  }, [isGrandpaMode]);


  if (isInitializing) {
    return (
      <div className="h-screen w-full bg-background flex flex-col items-center justify-center gap-4">
        <ShieldCheckIcon className="w-24 h-24 text-accent animate-pulse" />
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Sentinel</h1>
        <p className="text-text-secondary">Initializing Scam Defense Platform...</p>
      </div>
    );
  }

  const renderActivePage = () => {
    switch(activePage) {
      case 'investigator':
        return <InvestigatorView isGrandpaMode={isGrandpaMode} />;
      case 'meldkamer':
        return <MeldkamerView />;
      case 'kennisbank':
        return <KennisbankView />;
      case 'scammap':
        return <ScamMapView />;
      default:
        return null;
    }
  }

  const grandpaClasses = isGrandpaMode ? 'text-lg md:text-xl' : '';

  return (
    <div className={`h-screen w-full bg-background flex flex-col md:flex-row selection:bg-accent/20 font-sans transition-all duration-300 ${grandpaClasses}`}>
        <SideNav 
          activePage={activePage}
          setActivePage={setActivePage}
          isGrandpaMode={isGrandpaMode}
          setIsGrandpaMode={setIsGrandpaMode}
          onClaimClick={() => setIsClaimWizardOpen(true)}
        />
        <main className="flex-1 overflow-y-auto relative pb-20 md:pb-0">
          <div className="w-full h-full">
            {renderActivePage()}
          </div>
        </main>
        {isClaimWizardOpen && <ClaimWizard onClose={() => setIsClaimWizardOpen(false)} />}
        <HelpWidget />
    </div>
  );
};

export default App;