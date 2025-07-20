


import React, { useState, useMemo } from 'react';
import { mockReports } from '../data/mockMeldkamer';
import { MagnifyingGlassIcon, MegaphoneIcon } from './icons';
import ScammerProfileModal from './ScammerProfileModal';
import { MeldkamerReport } from '../types';

const MeldkamerView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
    const [selectedReport, setSelectedReport] = useState<MeldkamerReport | null>(null);

    const filteredReports = useMemo(() => {
        return mockReports
            .filter(report => {
                if (filter === 'all') return true;
                if (filter === 'active') return report.status === 'Active' || report.status === 'Under Investigation';
                if (filter === 'resolved') return report.status === 'Resolved';
                return true;
            })
            .filter(report =>
                report.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.scamType.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [searchTerm, filter]);

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-danger/20 text-danger';
            case 'Under Investigation': return 'bg-caution/20 text-caution';
            case 'Resolved': return 'bg-safe/20 text-safe';
            default: return 'bg-surface-2 text-text-secondary';
        }
    };

    return (
        <div className="h-full w-full p-4 sm:p-6 lg:p-8 animate-fade-in-fast overflow-y-auto no-scrollbar">
            <header className="mb-8">
                <div className="flex items-center gap-4">
                    <MegaphoneIcon className="w-8 h-8 md:w-10 md:h-10 text-accent" />
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Meldkamer</h1>
                        <p className="text-text-secondary mt-1 text-sm md:text-base">Een live overzicht van gemelde oplichtingspraktijken.</p>
                    </div>
                </div>
            </header>

            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                    <input
                        type="text"
                        placeholder="Zoek op domein of type scam..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-surface-1 text-text-primary placeholder-text-tertiary border border-surface-2 rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-accent focus:border-accent focus:outline-none transition-all duration-200"
                    />
                </div>
                <div className="flex-shrink-0 bg-surface-1 border border-surface-2 rounded-lg p-1 flex items-center gap-1">
                     <FilterButton label="Alles" active={filter === 'all'} onClick={() => setFilter('all')} />
                     <FilterButton label="Actief" active={filter === 'active'} onClick={() => setFilter('active')} />
                     <FilterButton label="Opgelost" active={filter === 'resolved'} onClick={() => setFilter('resolved')} />
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="space-y-4 lg:hidden">
                 {filteredReports.map((report, index) => (
                    <div 
                        key={report.id} 
                        onClick={() => setSelectedReport(report)}
                        className="bg-surface-1 border border-surface-2 rounded-xl p-4 shadow-sm cursor-pointer hover:bg-surface-2/30 animate-fade-in"
                        style={{ animationDelay: `${index * 25}ms`, opacity: 0 }}
                    >
                        <div className="flex justify-between items-start">
                             <p className="font-mono text-text-primary font-medium pr-4">{report.domain}</p>
                             <span className={`flex-shrink-0 px-2 py-1 text-xs font-bold rounded-full ${getStatusClass(report.status)}`}>
                                {report.status}
                            </span>
                        </div>
                        <p className="text-sm text-text-secondary mt-1">{report.scamType}</p>
                        <div className="flex justify-between text-sm text-text-secondary mt-3 pt-3 border-t border-surface-2">
                           <span>{report.reportCount} meldingen</span>
                           <span>{report.date}</span>
                        </div>
                    </div>
                ))}
            </div>


            {/* Desktop Table View */}
            <div className="hidden lg:block bg-surface-1 border border-surface-2 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-surface-2/30 text-xs text-text-secondary uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-semibold">Domein</th>
                                <th className="p-4 font-semibold">Type Scam</th>
                                <th className="p-4 font-semibold text-center">Meldingen</th>
                                <th className="p-4 font-semibold">Laatst Gezien</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actie</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-2">
                            {filteredReports.map((report, index) => (
                                <tr key={report.id} className="hover:bg-surface-2/20 transition-colors duration-150 animate-fade-in" style={{ animationDelay: `${index * 25}ms`, opacity: 0 }}>
                                    <td className="p-4 font-mono text-text-primary font-medium">{report.domain}</td>
                                    <td className="p-4 text-text-secondary">{report.scamType}</td>
                                    <td className="p-4 text-text-primary font-semibold text-center">{report.reportCount}</td>
                                    <td className="p-4 text-text-secondary">{report.date}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusClass(report.status)}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => setSelectedReport(report)} className="bg-accent/10 text-accent font-semibold text-sm py-1.5 px-3 rounded-md hover:bg-accent/20 transition-colors">Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
             {filteredReports.length === 0 && (
                 <div className="p-8 text-center text-text-secondary">
                    <p className="font-semibold">Geen meldingen gevonden</p>
                    <p className="text-sm">Pas uw zoekopdracht of filter aan om resultaten te zien.</p>
                 </div>
            )}

            {selectedReport && (
                <ScammerProfileModal 
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                />
            )}
        </div>
    );
};

const FilterButton: React.FC<{label: string, active: boolean, onClick: () => void}> = ({label, active, onClick}) => (
    <button
        onClick={onClick}
        className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-md transition-colors w-full sm:w-auto ${active ? 'bg-accent text-white' : 'text-text-secondary hover:bg-surface-2'}`}
    >
        {label}
    </button>
)

export default MeldkamerView;