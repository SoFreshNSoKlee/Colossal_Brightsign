import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  snapHeight?: 'half' | 'full' | 'auto';
}

export function BottomSheetModal({
  isOpen,
  onClose,
  title,
  children,
  snapHeight = 'auto',
}: BottomSheetModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const heightClass =
    snapHeight === 'full'
      ? 'h-[90dvh]'
      : snapHeight === 'half'
        ? 'h-[55dvh]'
        : 'max-h-[85dvh]';

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neo-text/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={[
          'relative z-10 rounded-t-[28px] neo-surface shadow-neo-lg',
          'flex flex-col overflow-hidden',
          heightClass,
          'animate-[slide-up_0.25s_ease-out]',
        ].join(' ')}
        style={{
          animation: 'slideUp 0.25s ease-out',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-neo-dark" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
          <h2 className="text-lg font-bold text-neo-text">{title}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-neo-pill neo-surface shadow-neo-sm flex items-center justify-center text-neo-muted hover:text-neo-text transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-neo-dark/30 mx-5 flex-shrink-0" />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 pb-8 scrollbar-hide">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
