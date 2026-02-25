import React from 'react';

interface NeoCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function NeoCard({
  children,
  className = '',
  onClick,
  active = false,
  padding = 'md',
}: NeoCardProps) {
  const padClass =
    padding === 'none'
      ? ''
      : padding === 'sm'
        ? 'p-3'
        : padding === 'lg'
          ? 'p-6'
          : 'p-4';

  const shadowClass = active
    ? 'shadow-neo-pressed'
    : onClick
      ? 'shadow-neo hover:shadow-neo-sm active:shadow-neo-pressed'
      : 'shadow-neo';

  return (
    <div
      className={[
        'rounded-neo neo-surface',
        shadowClass,
        padClass,
        onClick ? 'cursor-pointer select-none transition-shadow duration-150' : '',
        'transition-shadow duration-150',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick()
          : undefined
      }
    >
      {children}
    </div>
  );
}
