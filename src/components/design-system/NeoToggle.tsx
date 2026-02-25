interface NeoToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function NeoToggle({ checked, onChange, label, disabled = false }: NeoToggleProps) {
  return (
    <label
      className={[
        'inline-flex items-center gap-3 cursor-pointer select-none',
        disabled ? 'opacity-40 pointer-events-none' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[
          'relative w-14 h-7 rounded-neo-pill shadow-neo-inner transition-colors duration-200',
          checked ? 'bg-neo-accent' : 'bg-neo-bg',
        ].join(' ')}
        onClick={() => !disabled && onChange(!checked)}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) onChange(!checked);
        }}
      >
        <div
          className={[
            'absolute top-[4px] w-[22px] h-[22px] rounded-full transition-all duration-200',
            'shadow-neo-sm',
            checked
              ? 'left-[26px] bg-white'
              : 'left-[4px] bg-neo-surface',
          ].join(' ')}
        />
      </div>
      {label && (
        <span className="text-sm font-medium text-neo-text">{label}</span>
      )}
    </label>
  );
}
