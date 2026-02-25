import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, CheckCircle, Calendar, Timer } from 'lucide-react';
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

function todayDateString() {
  return new Date().toISOString().slice(0, 10);
}

function nowTimeString() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function oneHourLaterTimeString() {
  const d = new Date(Date.now() + 60 * 60 * 1000);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function Presets() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const [schedulerPreset, setSchedulerPreset] = useState<Preset | null>(null);
  const [scheduleDate, setScheduleDate] = useState(todayDateString());
  const [scheduleStartTime, setScheduleStartTime] = useState(nowTimeString());
  const [scheduleEndTime, setScheduleEndTime] = useState(oneHourLaterTimeString());
  const [appliedId, setAppliedId] = useState<string | null>(null);
  // presetId -> scheduled end Date (used to display timer icon)
  const [scheduledEndTimes, setScheduledEndTimes] = useState<Record<string, Date>>({});

  const openScheduler = (preset: Preset) => {
    setSchedulerPreset(preset);
    setScheduleDate(todayDateString());
    setScheduleStartTime(nowTimeString());
    setScheduleEndTime(oneHourLaterTimeString());
  };

  const handleConfirm = () => {
    if (!schedulerPreset) return;
    dispatch({ type: 'APPLY_PRESET', presetId: schedulerPreset.id });
    setAppliedId(schedulerPreset.id);

    // Store scheduled end time so we can show the timer icon
    if (scheduleDate && scheduleEndTime) {
      const endDate = new Date(`${scheduleDate}T${scheduleEndTime}`);
      setScheduledEndTimes((prev) => ({ ...prev, [schedulerPreset.id]: endDate }));
    }

    setSchedulerPreset(null);
    setTimeout(() => setAppliedId(null), 3000);
  };

  const handleDelete = (presetId: string) => {
    if (window.confirm('Delete this preset?')) {
      dispatch({ type: 'DELETE_PRESET', presetId });
    }
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

        {/* New Preset button */}
        <div className="flex justify-end">
          <NeoButton
            variant="primary"
            size="sm"
            onClick={() => navigate('/presets/new')}
            icon={<Plus size={14} />}
          >
            New Preset
          </NeoButton>
        </div>

        <div className="space-y-3">
          {state.presets.map((preset) => {
            const scheduledEnd = scheduledEndTimes[preset.id];
            const hasActiveTimer = scheduledEnd && scheduledEnd > new Date();
            const timerLabel = hasActiveTimer
              ? `Ends ${scheduledEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : null;

            return (
            <NeoCard key={preset.id}>
              <div className="flex items-start gap-4">
                {/* Icon + info */}
                <div className="flex gap-3 items-start flex-1 min-w-0">
                  <div className="text-3xl select-none flex-shrink-0">
                    {PRESET_ICONS[preset.id] ?? '⚙️'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-neo-text">{preset.name}</h3>
                      {hasActiveTimer && (
                        <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-neo-pill bg-amber-100 text-amber-700 font-semibold flex-shrink-0">
                          <Timer size={10} />
                          {timerLabel}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neo-muted mt-1 leading-relaxed">
                      {preset.description}
                    </p>
                    <p className="text-xs text-neo-muted mt-1">
                      {preset.changes.length} endpoint change
                      {preset.changes.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <NeoButton
                    variant="primary"
                    size="sm"
                    onClick={() => openScheduler(preset)}
                  >
                    Apply
                  </NeoButton>
                  <div className="flex gap-1">
                    <button
                      onClick={() => navigate(`/presets/${preset.id}/edit`)}
                      className="flex-1 h-7 rounded-neo-sm neo-surface shadow-neo-sm flex items-center justify-center text-neo-muted hover:text-neo-accent transition-colors"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(preset.id)}
                      className="flex-1 h-7 rounded-neo-sm neo-surface shadow-neo-sm flex items-center justify-center text-neo-muted hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </NeoCard>
          );
          })}

          {state.presets.length === 0 && (
            <NeoCard className="py-12 text-center">
              <div className="text-4xl mb-3">⚙️</div>
              <p className="text-neo-muted">No presets yet.</p>
              <p className="text-xs text-neo-muted mt-1">Create one to get started.</p>
            </NeoCard>
          )}
        </div>
      </div>

      {/* ── Scheduler Modal ── */}
      <BottomSheetModal
        isOpen={!!schedulerPreset}
        onClose={() => setSchedulerPreset(null)}
        title={`Apply: ${schedulerPreset?.name ?? ''}`}
        snapHeight="full"
      >
        {schedulerPreset && (
          <div className="space-y-5">
            {/* Scheduled time section */}
            <div>
              <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-3">
                Schedule
              </p>

              <div className="space-y-3 p-3 rounded-neo-sm neo-surface shadow-neo-inner">
                <div className="flex items-center gap-2 text-xs font-semibold text-neo-muted mb-1">
                  <Calendar size={13} />
                  Scheduled time
                </div>
                <div>
                  <label className="text-[10px] text-neo-muted block mb-1">Date</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-neo-sm neo-surface shadow-neo-sm text-sm text-neo-text focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-neo-muted block mb-1">Start time</label>
                    <input
                      type="time"
                      value={scheduleStartTime}
                      onChange={(e) => setScheduleStartTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-neo-sm neo-surface shadow-neo-sm text-sm text-neo-text focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neo-muted block mb-1">End time</label>
                    <input
                      type="time"
                      value={scheduleEndTime}
                      onChange={(e) => setScheduleEndTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-neo-sm neo-surface shadow-neo-sm text-sm text-neo-text focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Changes summary */}
            <div>
              <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-2">
                Changes ({schedulerPreset.changes.length} endpoint{schedulerPreset.changes.length !== 1 ? 's' : ''})
              </p>
              <div className="space-y-1.5">
                {schedulerPreset.changes.map((change) => {
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
            <div className="flex gap-3 pt-1">
              <NeoButton
                variant="secondary"
                fullWidth
                onClick={() => setSchedulerPreset(null)}
              >
                Cancel
              </NeoButton>
              <NeoButton variant="primary" fullWidth onClick={handleConfirm}>
                Confirm
              </NeoButton>
            </div>
          </div>
        )}
      </BottomSheetModal>
    </Layout>
  );
}
