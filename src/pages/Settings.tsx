import { Layout } from '../components/layout/Layout';
import { NeoCard } from '../components/design-system/NeoCard';
import { NeoToggle } from '../components/design-system/NeoToggle';
import { useApp } from '../context/AppContext';

export function Settings() {
  const { state, dispatch } = useApp();

  const resetState = () => {
    if (window.confirm('Reset all state to defaults? This cannot be undone.')) {
      localStorage.removeItem('colossal-hq-controller-state');
      window.location.reload();
    }
  };

  return (
    <Layout title="Settings">
      <div className="space-y-4 px-2 pt-2">
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
              <span className="font-medium text-neo-text">Colossal HQ Controller</span>
            </div>
            <div className="flex justify-between">
              <span>Version</span>
              <span className="font-medium text-neo-text">0.1.0-prototype</span>
            </div>
            <div className="flex justify-between">
              <span>Backend</span>
              <span className="font-medium text-neo-text">Mocked (local state)</span>
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
