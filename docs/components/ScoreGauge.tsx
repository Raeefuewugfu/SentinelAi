import React, { useState, useEffect } from 'react';

interface ScoreGaugeProps {
  score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const clampedScore = Math.max(0, Math.min(100, score));
  const [displayScore, setDisplayScore] = useState(0);

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let colorClass = 'text-safe';
  let strokeColor = 'hsl(var(--color-safe-hsl))';

  if (clampedScore < 70) {
    colorClass = 'text-caution';
    strokeColor = 'hsl(var(--color-caution-hsl))';
  }
  if (clampedScore < 40) {
    colorClass = 'text-danger';
    strokeColor = 'hsl(var(--color-danger-hsl))';
  }

  useEffect(() => {
    let animationFrameId: number;
    const endScore = clampedScore;
    const duration = 1200; // ms
    let startTime: number | null = null;

    const animateScore = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        // Ease out quint function
        const easedPercentage = 1 - Math.pow(1 - percentage, 5);
        const currentScore = Math.floor(easedPercentage * endScore);
        
        setDisplayScore(currentScore);

        if (progress < duration) {
            animationFrameId = requestAnimationFrame(animateScore);
        } else {
            setDisplayScore(endScore); // Ensure it ends on the exact score
        }
    };

    animationFrameId = requestAnimationFrame(animateScore);

    return () => {
        cancelAnimationFrame(animationFrameId);
    };
  }, [clampedScore]);


  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        {/* Background Ring */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="hsl(var(--color-surface-2-hsl))"
          strokeWidth="8"
        />
        {/* Score Ring */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.23, 1, 0.32, 1)' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`font-sans text-5xl font-bold ${colorClass}`}>
          {displayScore}
        </span>
        <span className="text-text-secondary text-xs font-semibold uppercase tracking-wider mt-1">Safety Score</span>
      </div>
    </div>
  );
};

export default ScoreGauge;