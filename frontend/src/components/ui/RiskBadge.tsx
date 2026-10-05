import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, Shield } from 'lucide-react';
import { RiskLevel } from '../../types/scam.js';

interface RiskBadgeProps {
  level: RiskLevel | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showIcon = true }) => {
  const norm = (level || 'SAFE').toUpperCase();

  let bg = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  let icon = <ShieldCheck className="w-4 h-4 text-emerald-700" />;
  let label = 'SAFE';

  if (norm === 'HIGH') {
    bg = 'bg-red-100 text-red-800 border-red-300';
    icon = <ShieldAlert className="w-4 h-4 text-red-700" />;
    label = 'HIGH RISK';
  } else if (norm === 'SUSPICIOUS') {
    bg = 'bg-amber-100 text-amber-800 border-amber-300';
    icon = <AlertTriangle className="w-4 h-4 text-amber-700" />;
    label = 'SUSPICIOUS';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold tracking-wide',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm ${bg} ${sizeClasses}`}
      role="status"
      aria-label={`Risk Level: ${label}`}
    >
      {showIcon && icon}
      <span>{label}</span>
    </span>
  );
};
