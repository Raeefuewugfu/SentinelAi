
import React, { useState, useRef, TouchEvent } from 'react';
import { MeldkamerReport } from '../types';
import { PlusIcon, MinusIcon } from './icons';

interface WorldMapProps {
    reports: MeldkamerReport[];
}

const WorldMap: React.FC<WorldMapProps> = ({ reports }) => {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; report: MeldkamerReport } | null>(null);
    const [transform, setTransform] = useState({ scale: 1.1, x: -50, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
    const svgRef = useRef<SVGSVGElement>(null);

    // Map dimensions (corresponds to the SVG viewBox)
    const mapWidth = 1000;
    const mapHeight = 500;

    // Equirectangular projection function
    const project = (lat: number, lon: number) => {
        const x = (lon + 180) * (mapWidth / 360);
        const y = (90 - lat) * (mapHeight / 180);
        return { x, y };
    };

    const handleMouseEnter = (report: MeldkamerReport, e: React.MouseEvent) => {
        if (!svgRef.current) return;
        const svgRect = svgRef.current.getBoundingClientRect();
        const { x, y } = project(report.location.lat, report.location.lon);
        
        const ctm = svgRef.current.getScreenCTM();
        if(!ctm) return;
        
        // This calculation is tricky with CSS transforms on the parent
        // For a robust solution, you might need to pass screen coordinates differently
        // But this is a good approximation for this controlled environment.
        const clientX = svgRect.left + (x * transform.scale) + transform.x;
        const clientY = svgRect.top + (y * transform.scale) + transform.y;

        setTooltip({
            x: clientX,
            y: clientY,
            report
        });
    };
    
    const handleMouseLeave = () => {
        setTooltip(null);
    };

    const applyZoom = (zoomFactor: number, mouseX: number, mouseY: number) => {
         const newScale = transform.scale * zoomFactor;
        const clampedScale = Math.max(1, Math.min(20, newScale));

        const newX = mouseX - (mouseX - transform.x) * (clampedScale / transform.scale);
        const newY = mouseY - (mouseY - transform.y) * (clampedScale / transform.scale);

        setTransform({ scale: clampedScale, x: newX, y: newY });
    };
    
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        if (!svgRef.current) return;

        const rect = svgRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        applyZoom(e.deltaY < 0 ? 1.1 : 1 / 1.1, mouseX, mouseY);
    };

    const handlePanStart = (clientX: number, clientY: number) => {
        setIsPanning(true);
        setStartPoint({ x: clientX - transform.x, y: clientY - transform.y });
    };

    const handlePanMove = (clientX: number, clientY: number) => {
        if (!isPanning) return;
        const newX = clientX - startPoint.x;
        const newY = clientY - startPoint.y;
        setTransform(prev => ({ ...prev, x: newX, y: newY }));
    };

    const handlePanEnd = () => {
        setIsPanning(false);
    };
    
    const handleMouseDown = (e: React.MouseEvent) => handlePanStart(e.clientX, e.clientY);
    const handleMouseMove = (e: React.MouseEvent) => handlePanMove(e.clientX, e.clientY);
    
    const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
            handlePanStart(e.touches[0].clientX, e.touches[0].clientY);
        }
    };
    const handleTouchMove = (e: TouchEvent) => {
         if (e.touches.length === 1) {
            e.preventDefault();
            handlePanMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    };

    const handleZoomButtons = (direction: 'in' | 'out') => {
        if (!svgRef.current) return;
        const { width, height } = svgRef.current.getBoundingClientRect();
        applyZoom(direction === 'in' ? 1.2 : 1 / 1.2, width / 2, height / 2);
    };

    return (
        <div className="w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden">
            {tooltip && (
                <div
                    className="absolute bg-surface-1 text-left p-3 rounded-lg shadow-2xl border border-surface-2 pointer-events-none transition-all duration-100 ease-out animate-fade-in-fast z-20"
                    style={{
                        left: tooltip.x,
                        top: tooltip.y,
                        transform: `translate(-50%, -110%)`, // Position above the cursor
                        minWidth: '200px'
                    }}
                >
                    <p className="font-bold text-text-primary font-mono">{tooltip.report.domain}</p>
                    <p className="text-sm text-text-secondary">{tooltip.report.scamType}</p>
                    <p className="text-xs text-text-tertiary mt-1">{tooltip.report.reportCount} meldingen</p>
                </div>
            )}
            <svg 
                ref={svgRef} 
                viewBox={`0 0 ${mapWidth} ${mapHeight}`} 
                className="w-full h-full" 
                preserveAspectRatio="xMidYMid meet"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handlePanEnd}
                onMouseLeave={handlePanEnd}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handlePanEnd}
            >
                <defs>
                    <radialGradient id="heat-gradient">
                        <stop offset="0%" stopColor="hsl(var(--color-danger-hsl))" stopOpacity="0.8" />
                        <stop offset="30%" stopColor="hsl(var(--color-danger-hsl))" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="hsl(var(--color-danger-hsl))" stopOpacity="0" />
                    </radialGradient>
                </defs>

                <g style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}>
                    <path
                        d="M499.999 447.331C493.551 447.331 487.369 446.427 481.657 444.752L481.411 444.673C481.205 444.61 480.999 444.544 480.802 444.478C479.231 443.918 477.785 443.43 476.357 442.988C474.968 442.562 473.614 442.174 472.287 441.812C469.742 441.119 467.242 440.518 464.768 439.988C462.438 439.492 460.01 439.06 457.653 438.68C455.19 438.297 452.827 437.971 450.482 437.696C448.065 437.421 445.694 437.195 443.377 437.02L443.314 437.013V1000H1000V0H0V437.013L443.314 437.013C443.314 597.926 443.314 600.946 443.314 603.966C443.314 765.69 443.314 768.71 443.314 771.73C443.314 933.453 443.314 936.473 443.314 939.493C443.314 999.686 443.314 999.851 443.314 1000.007H174.185C174.046 1000.007 173.912 1000 173.784 1000H0V0H1000V1000H443.314Z"
                        fill="hsl(var(--color-surface-2-hsl))"
                        stroke="hsl(var(--color-background-hsl))"
                        strokeWidth={0.5 / transform.scale}
                    />
                    
                    {/* Heatmap points */}
                    {reports.map((report) => {
                        const { x, y } = project(report.location.lat, report.location.lon);
                        const baseRadius = 5 / transform.scale;
                        const radius = baseRadius * (1 + Math.log1p(report.reportCount) / 1.5);
                        return (
                            <circle
                                key={`heat-${report.id}`}
                                cx={x}
                                cy={y}
                                r={radius * 5}
                                fill="url(#heat-gradient)"
                                className="transition-all duration-300 pointer-events-none"
                            />
                        );
                    })}

                    {/* Data points */}
                    {reports.map((report) => {
                        const { x, y } = project(report.location.lat, report.location.lon);
                        return (
                            <circle
                                key={report.id}
                                cx={x}
                                cy={y}
                                r={3 / transform.scale}
                                fill="hsl(var(--color-danger-hsl))"
                                stroke="hsl(var(--color-surface-1-hsl))"
                                strokeWidth={0.5 / transform.scale}
                                onMouseEnter={(e) => handleMouseEnter(report, e)}
                                onMouseLeave={handleMouseLeave}
                                className="cursor-pointer hover:fill-caution transition-colors duration-200"
                            />
                        );
                    })}
                </g>
            </svg>
            
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
                 <button onClick={() => handleZoomButtons('in')} className="w-10 h-10 bg-surface-2/80 backdrop-blur-sm rounded-full flex items-center justify-center text-text-primary hover:bg-surface-2 shadow-lg">
                    <PlusIcon className="w-5 h-5"/>
                 </button>
                 <button onClick={() => handleZoomButtons('out')} className="w-10 h-10 bg-surface-2/80 backdrop-blur-sm rounded-full flex items-center justify-center text-text-primary hover:bg-surface-2 shadow-lg">
                    <MinusIcon className="w-5 h-5"/>
                 </button>
            </div>
        </div>
    );
};

export default WorldMap;
