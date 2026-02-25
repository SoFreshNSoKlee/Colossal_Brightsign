import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Sliders, Settings, Info } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/library', label: 'Library', Icon: BookOpen },
  { to: '/presets', label: 'Presets', Icon: Sliders },
  { to: '/info', label: 'Info', Icon: Info },
  { to: '/settings', label: 'Settings', Icon: Settings },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 neo-surface shadow-[0_-4px_12px_var(--shadow-dark)] pb-safe lg:hidden">
      <div className="flex items-stretch h-16">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors',
                isActive ? 'text-neo-accent' : 'text-neo-muted hover:text-neo-text',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={[
                    'w-10 h-10 rounded-neo-pill flex items-center justify-center transition-all',
                    isActive ? 'neo-surface shadow-neo' : 'hover:neo-surface hover:shadow-neo-inset',
                  ].join(' ')}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span className="text-[10px] font-semibold">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
