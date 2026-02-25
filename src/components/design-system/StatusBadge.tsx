import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusBadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-gray-100 text-gray-700',
};

const dotStyles: Record<BadgeVariant, string> = {
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  neutral: 'bg-gray-500',
};

export function statusVariantFromEndpoint(
  status: 'playing' | 'paused' | 'offline',
): BadgeVariant {
  if (status === 'playing') return 'success';
  if (status === 'paused') return 'warning';
  return 'error';
}

export function StatusBadge({
  variant = 'neutral',
  children,
  dot = true,
  className = '',
}: StatusBadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-neo-pill text-xs font-semibold',
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {dot && (
        <span
          className={['w-1.5 h-1.5 rounded-full flex-shrink-0', dotStyles[variant]].join(' ')}
        />
      )}
      {children}
    </span>
  );
}
