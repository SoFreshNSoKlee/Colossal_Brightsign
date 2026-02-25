import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Sliders, ClipboardList, Settings, Zap } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/library', label: 'Library', Icon: BookOpen },
  { to: '/presets', label: 'Presets', Icon: Sliders },
  { to: '/log', label: 'Activity Log', Icon: ClipboardList },
  { to: '/settings', label: 'Settings', Icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 neo-surface shadow-neo border-r border-neo-dark/20 min-h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-neo-dark/20">
        <div className="w-10 h-10 rounded-neo-pill bg-neo-accent shadow-neo-sm flex items-center justify-center flex-shrink-0">
          <Zap size={20} className="text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-neo-text leading-tight">Brightside</div>
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
        <p className="text-xs text-neo-muted">Colossal Brightside v0.1</p>
      </div>
    </aside>
  );
}
