import { useState } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { NeoCard } from '../components/design-system/NeoCard';
import { NeoButton } from '../components/design-system/NeoButton';
import { BottomSheetModal } from '../components/design-system/BottomSheetModal';
import { useApp } from '../context/AppContext';
import type { Preset } from '../types';

const PRESET_ICONS: Record<string, string> = {
  'investor-day': '💼',
  'press-tour': '📰',
  'after-hours': '🌙',
  'general-tour': '🗺️',
};

export function Presets() {
  const { state, dispatch } = useApp();
  const [confirmPreset, setConfirmPreset] = useState<Preset | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const handleApply = (preset: Preset) => {
    setConfirmPreset(preset);
  };

  const handleConfirm = () => {
    if (!confirmPreset) return;
    dispatch({ type: 'APPLY_PRESET', presetId: confirmPreset.id });
    setAppliedId(confirmPreset.id);
    setConfirmPreset(null);
    setTimeout(() => setAppliedId(null), 3000);
  };

  return (
    <Layout title="Presets">
      <div className="space-y-4 px-2 pt-2">
        {/* Applied banner */}
        {appliedId && (
          <div className="flex items-center gap-3 p-3 rounded-neo-sm bg-green-100 text-green-800">
            <CheckCircle size={18} />
            <span className="text-sm font-semibold">
              Preset applied successfully.
            </span>
          </div>
        )}

        <div className="space-y-3">
          {state.presets.map((preset) => (
            <NeoCard key={preset.id}>
              <div className="flex items-start justify-between gap-4">
                {/* Icon + info */}
                <div className="flex gap-3 items-start flex-1 min-w-0">
                  <div className="text-3xl select-none flex-shrink-0">
                    {PRESET_ICONS[preset.id] ?? '⚙️'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-neo-text">{preset.name}</h3>
                    <p className="text-xs text-neo-muted mt-1 leading-relaxed">
                      {preset.description}
                    </p>
                    <p className="text-xs text-neo-muted mt-1">
                      {preset.changes.length} endpoint change
                      {preset.changes.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Apply button */}
                <NeoButton
                  variant="primary"
                  size="sm"
                  onClick={() => handleApply(preset)}
                  className="flex-shrink-0"
                >
                  Apply
                </NeoButton>
              </div>
            </NeoCard>
          ))}
        </div>
      </div>

      {/* ── Confirmation sheet ── */}
      <BottomSheetModal
        isOpen={!!confirmPreset}
        onClose={() => setConfirmPreset(null)}
        title={`Apply: ${confirmPreset?.name ?? ''}`}
        snapHeight="auto"
      >
        {confirmPreset && (
          <div className="space-y-4">
            {/* Warning */}
            <div className="flex items-start gap-3 p-3 rounded-neo-sm bg-amber-100 text-amber-800">
              <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                This will change <strong>{confirmPreset.changes.length}</strong> endpoint
                {confirmPreset.changes.length !== 1 ? 's' : ''}. Review the changes below.
              </p>
            </div>

            {/* Change summary */}
            <div>
              <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-2">
                Changes
              </p>
              <div className="space-y-1.5">
                {confirmPreset.changes.map((change) => {
                  const ep = state.endpoints.find((e) => e.id === change.endpointId);
                  const asset = change.assetId
                    ? state.assets.find((a) => a.id === change.assetId)
                    : null;
                  const playlist = change.playlistId
                    ? state.playlists.find((p) => p.id === change.playlistId)
                    : null;
                  const targetLabel = asset?.title ?? playlist?.name ?? '—';

                  return (
                    <div
                      key={change.endpointId}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            change.status === 'offline'
                              ? '#ef4444'
                              : change.status === 'paused'
                                ? '#f59e0b'
                                : '#22c55e',
                        }}
                      />
                      <span className="font-semibold text-neo-text truncate">
                        {ep?.name ?? change.endpointId}
                      </span>
                      <span className="text-neo-muted">→</span>
                      <span className="text-neo-muted truncate">{targetLabel}</span>
                      {change.status && change.status !== 'playing' && (
                        <span className="text-neo-muted">({change.status})</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <NeoButton
                variant="secondary"
                fullWidth
                onClick={() => setConfirmPreset(null)}
              >
                Cancel
              </NeoButton>
              <NeoButton variant="primary" fullWidth onClick={handleConfirm}>
                Confirm Apply
              </NeoButton>
            </div>
          </div>
        )}
      </BottomSheetModal>
    </Layout>
  );
}
