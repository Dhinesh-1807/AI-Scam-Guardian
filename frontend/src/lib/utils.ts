import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function getRiskColorClass(riskLevel: string) {
  switch (riskLevel?.toUpperCase()) {
    case 'HIGH':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        badge: 'bg-red-600 text-white',
        ring: 'ring-red-500',
        hex: '#DC2626',
        label: 'HIGH RISK',
      };
    case 'SUSPICIOUS':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        badge: 'bg-amber-500 text-white',
        ring: 'ring-amber-500',
        hex: '#F59E0B',
        label: 'SUSPICIOUS',
      };
    case 'SAFE':
    default:
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-800',
        border: 'border-emerald-200',
        badge: 'bg-emerald-600 text-white',
        ring: 'ring-emerald-500',
        hex: '#16A34A',
        label: 'SAFE',
      };
  }
}
