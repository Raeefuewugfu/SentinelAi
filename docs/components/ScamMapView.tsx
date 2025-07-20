

import React from 'react';
import { MapIcon } from './icons';
import { mockReports } from '../data/mockMeldkamer';
import WorldMap from './WorldMap';

const ScamMapView: React.FC = () => {
    const totalReports = mockReports.reduce((acc, report) => acc + report.reportCount, 0);
    const activeScams = mockReports.filter(r => r.status === 'Active' || r.status === 'Under Investigation').length;

    return (
        <div className="h-full w-full p-4 sm:p-6 lg:p-8 animate-fade-in-fast flex flex-col overflow-hidden">
            <header className="mb-6 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <MapIcon className="w-8 h-8 md:w-10 md:h-10 text-accent" />
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Global Scam Heatmap</h1>
                        <p className="text-text-secondary mt-1 text-sm md:text-base">Een live visualisatie van waar oplichtingspraktijken worden gemeld.</p>
                    </div>
                </div>
            </header>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 flex-shrink-0">
                 <div className="bg-surface-1 p-4 rounded-xl border border-surface-2">
                    <p className="text-sm font-semibold text-text-secondary">Totaal Gemelde Domeinen</p>
                    <p className="text-2xl md:text-3xl font-bold text-text-primary">{mockReports.length}</p>
                 </div>
                 <div className="bg-surface-1 p-4 rounded-xl border border-surface-2">
                    <p className="text-sm font-semibold text-text-secondary">Actieve Dreigingen</p>
                    <p className="text-2xl md:text-3xl font-bold text-danger">{activeScams}</p>
                 </div>
                 <div className="bg-surface-1 p-4 rounded-xl border border-surface-2">
                    <p className="text-sm font-semibold text-text-secondary">Totaal Aantal Meldingen</p>
                    <p className="text-2xl md:text-3xl font-bold text-text-primary">{totalReports.toLocaleString('nl-NL')}</p>
                 </div>
            </div>

            <div className="flex-grow bg-surface-1 rounded-xl border border-surface-2 shadow-sm p-1 sm:p-2 md:p-4 relative overflow-hidden min-h-[40vh]">
                <WorldMap reports={mockReports} />
            </div>
        </div>
    );
};

export default ScamMapView;