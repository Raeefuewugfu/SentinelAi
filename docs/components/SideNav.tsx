


import React from 'react';
import { IconName } from '../types';
import { DynamicIcon, ShieldCheckIcon, WrenchScrewdriverIcon, MegaphoneIcon, BookOpenIcon, MapIcon } from './icons';

type ActivePage = 'investigator' | 'meldkamer' | 'kennisbank' | 'scammap';

interface SideNavProps {
    activePage: ActivePage;
    setActivePage: (page: ActivePage) => void;
    isGrandpaMode: boolean;
    setIsGrandpaMode: (value: boolean | ((prev: boolean) => boolean)) => void;
    onClaimClick: () => void;
}

const Switch: React.FC<{ id: string; checked: boolean; onChange: () => void; }> = ({ id, checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    id={id}
    className={`relative inline-flex h-5 w-10 flex-shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background ${checked ? 'bg-accent' : 'bg-surface-2'}`}
  >
    <span
      aria-hidden="true"
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
    />
  </button>
);


const NavItem: React.FC<{
    icon: IconName;
    label: string;
    isActive: boolean;
    onClick: () => void;
    isMobile?: boolean;
}> = ({ icon, label, isActive, onClick, isMobile = false }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 rounded-lg text-left transition-colors duration-200 
        ${isMobile 
            ? `flex-col justify-center text-center p-2 flex-1 ${isActive ? 'text-accent' : 'text-text-secondary'}`
            : `w-full px-4 py-3 ${isActive ? 'bg-accent text-white font-semibold' : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'}`
        }
        `}
    >
        <DynamicIcon name={icon} className="w-6 h-6 flex-shrink-0" />
        <span className={`font-medium ${isMobile ? 'text-[10px]' : 'text-sm'}`}>{label}</span>
    </button>
);

const SideNav: React.FC<SideNavProps> = ({ activePage, setActivePage, isGrandpaMode, setIsGrandpaMode, onClaimClick }) => {
    const navItems = [
        { id: 'investigator', icon: 'WrenchScrewdriverIcon', label: 'Investigator' },
        { id: 'meldkamer', icon: 'MegaphoneIcon', label: 'Meldkamer' },
        { id: 'scammap', icon: 'MapIcon', label: 'Scam Kaart' },
        { id: 'kennisbank', icon: 'BookOpenIcon', label: 'Kennisbank' },
    ] as const;
    
    return (
        <>
            {/* Desktop Sidebar */}
            <nav className="hidden md:flex h-full w-64 bg-surface-1 flex-shrink-0 flex-col p-4 border-r border-surface-2 shadow-md">
                <div className="flex items-center gap-3 mb-8 px-2">
                    <ShieldCheckIcon className="w-8 h-8 text-accent" />
                    <h1 className="text-xl font-bold text-text-primary tracking-tight">Sentinel</h1>
                </div>

                <div className="flex-grow space-y-2">
                     {navItems.map(item => (
                        <NavItem 
                            key={item.id}
                            icon={item.icon} 
                            label={item.label} 
                            isActive={activePage === item.id} 
                            onClick={() => setActivePage(item.id)} 
                        />
                     ))}
                </div>

                <div className="flex-shrink-0 space-y-4">
                    <button onClick={onClaimClick} className="w-full bg-accent/10 text-accent font-semibold text-sm py-2.5 px-3 rounded-lg hover:bg-accent/20 transition-colors">
                        Claim Indienen
                    </button>
                    <div className="flex items-center justify-between gap-4 px-2 py-2 bg-background rounded-lg">
                        <label htmlFor="grandpa-toggle" className="text-sm font-medium text-text-secondary">Grandpa Mode</label>
                        <Switch id="grandpa-toggle" checked={isGrandpaMode} onChange={() => setIsGrandpaMode(p => !p)} />
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-1 border-t border-surface-2 shadow-t-lg z-50 flex justify-around items-start p-1">
                 {navItems.map(item => (
                    <NavItem 
                        key={item.id}
                        icon={item.icon} 
                        label={item.label} 
                        isActive={activePage === item.id} 
                        onClick={() => setActivePage(item.id)}
                        isMobile 
                    />
                 ))}
            </nav>
        </>
    );
};

export default SideNav;