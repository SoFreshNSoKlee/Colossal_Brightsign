import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Zap } from 'lucide-react';

interface TopNavProps {
  title?: string;
}

const routeTitles: Record<string, string> = {
  '/': 'Brightside',
  '/library': 'Library',
  '/presets': 'Presets',
  '/log': 'Activity Log',
  '/settings': 'Settings',
};

export function TopNav({ title }: TopNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isRoot = ['/', '/library', '/presets', '/log', '/settings'].includes(
    location.pathname,
  );
  const displayTitle = title ?? routeTitles[location.pathname] ?? 'Brightside';

  return (
    <header className="sticky top-0 z-30 neo-surface shadow-neo-sm">
      <div className="flex items-center h-14 px-4 gap-3 max-w-5xl mx-auto">
        {/* Back button or logo */}
        {!isRoot ? (
          <button
            onClick={() => navigate(-1)}
            className="flex-shrink-0 w-9 h-9 rounded-neo-pill neo-surface shadow-neo-sm flex items-center justify-center text-neo-muted hover:text-neo-text transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </button>
        ) : (
          <div className="flex-shrink-0 w-9 h-9 rounded-neo-pill bg-neo-accent shadow-neo-sm flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
        )}

        {/* Title */}
        <h1 className="flex-1 text-base font-bold text-neo-text truncate">
          {displayTitle}
        </h1>
      </div>
    </header>
  );
}
