import { Layout } from '../components/layout/Layout';
import { NeoCard } from '../components/design-system/NeoCard';
import { NeoToggle } from '../components/design-system/NeoToggle';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types';

const ROLES: { value: UserRole; label: string; description: string }[] = [
  {
    value: 'admin',
    label: 'Admin',
    description: 'Full access — apply presets, edit playlists, manage settings.',
  },
  {
    value: 'operator',
    label: 'Operator',
    description: 'Control playback and swap assets. Cannot edit playlists.',
  },
  {
    value: 'viewer',
    label: 'Viewer',
    description: 'Read-only — can monitor status but cannot make changes.',
  },
];

export function Settings() {
  const { state, dispatch } = useApp();

  const resetState = () => {
    if (window.confirm('Reset all state to defaults? This cannot be undone.')) {
      localStorage.removeItem('brightside-controller-state');
      window.location.reload();
    }
  };

  return (
    <Layout title="Settings">
      <div className="space-y-4 px-2 pt-2">
        {/* ── Role selection ── */}
        <NeoCard>
          <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-3">
            User Role (Mock)
          </p>
          <div className="space-y-2">
            {ROLES.map((role) => {
              const isActive = state.uiState.userRole === role.value;
              return (
                <div
                  key={role.value}
                  onClick={() => dispatch({ type: 'SET_USER_ROLE', role: role.value })}
                  className={[
                    'flex items-start gap-3 p-3 rounded-neo-sm cursor-pointer transition-all',
                    isActive
                      ? 'neo-surface shadow-neo-inset'
                      : 'hover:neo-surface hover:shadow-neo-sm',
                  ].join(' ')}
                >
                  {/* Radio indicator */}
                  <div
                    className={[
                      'w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center',
                      'shadow-neo-inner',
                      isActive ? 'bg-neo-accent' : 'bg-neo-bg',
                    ].join(' ')}
                  >
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>

                  <div>
                    <div className="text-sm font-bold text-neo-text">{role.label}</div>
                    <div className="text-xs text-neo-muted mt-0.5">{role.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </NeoCard>

        {/* ── Appearance ── */}
        <NeoCard>
          <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-3">
            Appearance
          </p>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-neo-text">Dark Mode</div>
              <div className="text-xs text-neo-muted mt-0.5">
                Toggle light / dark theme (visual prototype)
              </div>
            </div>
            <NeoToggle
              checked={state.uiState.theme === 'dark'}
              onChange={() => dispatch({ type: 'TOGGLE_THEME' })}
            />
          </div>
        </NeoCard>

        {/* ── About ── */}
        <NeoCard>
          <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-3">
            About
          </p>
          <div className="space-y-2 text-sm text-neo-muted">
            <div className="flex justify-between">
              <span>App</span>
              <span className="font-medium text-neo-text">Colossal Brightside Controller</span>
            </div>
            <div className="flex justify-between">
              <span>Version</span>
              <span className="font-medium text-neo-text">0.1.0-prototype</span>
            </div>
            <div className="flex justify-between">
              <span>Backend</span>
              <span className="font-medium text-neo-text">Mocked (local state)</span>
            </div>
            <div className="flex justify-between">
              <span>Role</span>
              <span className="font-medium text-neo-text capitalize">
                {state.uiState.userRole}
              </span>
            </div>
          </div>
        </NeoCard>

        {/* ── Data ── */}
        <NeoCard>
          <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-3">
            Data
          </p>
          <p className="text-xs text-neo-muted mb-3">
            State is persisted to localStorage. Reset to restore mock defaults.
          </p>
          <button
            onClick={resetState}
            className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
          >
            Reset to Defaults →
          </button>
        </NeoCard>
      </div>
    </Layout>
  );
}
