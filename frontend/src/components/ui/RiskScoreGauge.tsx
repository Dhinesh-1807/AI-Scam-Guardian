import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RiskLevel } from '../../types/scam.js';

interface RiskScoreGaugeProps {
  score: number;
  level: RiskLevel;
  size?: number;
  strokeWidth?: number;
  showSubtitle?: boolean;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({
  score,
  level,
  size = 180,
  strokeWidth = 14,
  showSubtitle = true,
}) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    // Number increment animation
    let start = 0;
    const end = Math.min(100, Math.max(0, score));
    if (end === 0) {
      setDisplayScore(0);
      return;
    }
    const duration = 1200;
    const intervalTime = 20;
    const steps = duration / intervalTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayScore(end);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(start));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#16A34A'; // Safe
  let glowColor = 'rgba(22, 163, 74, 0.25)';
  let bgTrack = '#DCFCE7';

  if (level === 'HIGH' || score >= 60) {
    strokeColor = '#DC2626'; // High Risk
    glowColor = 'rgba(220, 38, 38, 0.3)';
    bgTrack = '#FEE2E2';
  } else if (level === 'SUSPICIOUS' || score >= 30) {
    strokeColor = '#F59E0B'; // Suspicious
    glowColor = 'rgba(245, 158, 11, 0.25)';
    bgTrack = '#FEF3C7';
  }

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow backdrop */}
        <div
          className="absolute inset-0 rounded-full blur-xl pointer-events-none transition-all duration-700"
          style={{ backgroundColor: glowColor, transform: 'scale(0.85)' }}
        />

        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={bgTrack}
            strokeWidth={strokeWidth}
            fill="transparent"
            className="transition-colors duration-500"
          />

          {/* Animated score arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-4xl font-black tracking-tight" style={{ color: strokeColor }}>
            {displayScore}
            <span className="text-sm font-semibold text-slate-400 ml-0.5">/100</span>
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-0.5">
            Risk Score
          </div>
        </div>
      </div>

      {showSubtitle && (
        <div className="mt-2 text-center">
          <span
            className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor: strokeColor + '18',
              color: strokeColor,
            }}
          >
            {level === 'HIGH' ? 'High Risk Threat' : level === 'SUSPICIOUS' ? 'Suspicious Indicators' : 'Safe Communication'}
          </span>
        </div>
      )}
    </div>
  );
};
