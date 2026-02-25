import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import colossalLogoBlk from '../../Assets/Colossal_BrandingRegistered_Logo_Icon_RGB_Blk.png';
import colossalLogoWht from '../../Assets/Colossal_BrandingRegistered_Logo_Icon_RGB_Wht.png';

interface TopNavProps {
  title?: string;
}

const routeTitles: Record<string, string> = {
  '/': 'Colossal HQ',
  '/library': 'Library',
  '/presets': 'Presets',
  '/info': 'Info',
  '/log': 'Activity Log',
  '/settings': 'Settings',
};

export function TopNav({ title }: TopNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useApp();
  const isDark = state.uiState.theme === 'dark';

  const isRoot = ['/', '/library', '/presets', '/info', '/log', '/settings'].includes(
    location.pathname,
  );
  const displayTitle = title ?? routeTitles[location.pathname] ?? 'HQ Controller';

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
          <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center">
            <img
              src={isDark ? colossalLogoWht : colossalLogoBlk}
              alt="Colossal"
              className="w-8 h-8 object-contain"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="flex-1 text-base font-bold text-neo-text truncate font-headline">
          {displayTitle}
        </h1>
      </div>
    </header>
  );
}
