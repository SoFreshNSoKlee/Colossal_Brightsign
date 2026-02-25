import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg';

interface NeoButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  className?: string;
  disabled?: boolean;
  active?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-neo-accent text-white shadow-neo-sm hover:bg-neo-accent-hover active:shadow-neo-pressed active:translate-y-px',
  secondary:
    'neo-surface text-neo-text shadow-neo hover:shadow-neo-sm active:shadow-neo-pressed active:translate-y-px',
  ghost:
    'bg-transparent text-neo-muted hover:text-neo-text active:opacity-70',
  danger:
    'bg-red-500 text-white shadow-neo-sm hover:bg-red-600 active:shadow-neo-pressed active:translate-y-px',
  success:
    'bg-neo-green text-white shadow-neo-sm hover:opacity-90 active:shadow-neo-pressed active:translate-y-px',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs font-medium min-h-[36px]',
  md: 'px-4 py-2.5 text-sm font-semibold min-h-[44px]',
  lg: 'px-6 py-3.5 text-base font-semibold min-h-[52px]',
};

export function NeoButton({
  children,
  onClick,
  variant = 'secondary',
  size = 'md',
  className = '',
  disabled = false,
  active = false,
  fullWidth = false,
  type = 'button',
  icon,
}: NeoButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-neo-pill',
        'transition-all duration-150 cursor-pointer',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-neo-accent',
        variantStyles[variant],
        sizeStyles[size],
        active ? 'shadow-neo-pressed translate-y-px' : '',
        disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : '',
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
