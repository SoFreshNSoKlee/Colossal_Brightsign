import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Sliders, Settings, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import colossalLogoBlk from '../../Assets/Colossal_BrandingRegistered_Logo_Icon_RGB_Blk.png';
import colossalLogoWht from '../../Assets/Colossal_BrandingRegistered_Logo_Icon_RGB_Wht.png';

const navItems = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/library', label: 'Library', Icon: BookOpen },
  { to: '/presets', label: 'Presets', Icon: Sliders },
  { to: '/info', label: 'Info', Icon: Info },
  { to: '/settings', label: 'Settings', Icon: Settings },
];

export function Sidebar() {
  const { state } = useApp();
  const isDark = state.uiState.theme === 'dark';

  return (
    <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 neo-surface shadow-neo border-r border-neo-dark/20 min-h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-neo-dark/20">
        <img
          src={isDark ? colossalLogoWht : colossalLogoBlk}
          alt="Colossal"
          className="w-10 h-10 object-contain flex-shrink-0"
        />
        <div>
          <div className="text-sm font-bold text-neo-text leading-tight font-headline">Colossal HQ</div>
          <div className="text-xs text-neo-muted">Controller</div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-4 py-3 rounded-neo-sm text-sm font-semibold transition-all',
                isActive
                  ? 'neo-surface shadow-neo-inset text-neo-accent'
                  : 'text-neo-muted hover:text-neo-text hover:neo-surface hover:shadow-neo-sm',
              ].join(' ')
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-neo-dark/20">
        <p className="text-xs text-neo-muted">Colossal HQ v0.1</p>
      </div>
    </aside>
  );
}
