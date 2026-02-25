import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { NeoCard } from '../components/design-system/NeoCard';
import { NeoButton } from '../components/design-system/NeoButton';
import { useApp } from '../context/AppContext';
import type { PresetChange, EndpointId } from '../types';

const STATUS_OPTIONS = [
  { value: 'playing', label: 'Playing', color: '#22c55e' },
  { value: 'paused', label: 'Paused', color: '#f59e0b' },
  { value: 'offline', label: 'Offline', color: '#ef4444' },
] as const;

export function PresetBuilder() {
  const { presetId } = useParams<{ presetId: string }>();
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const isEdit = !!presetId;
  const existingPreset = isEdit ? state.presets.find((p) => p.id === presetId) : null;

  const [name, setName] = useState(existingPreset?.name ?? '');
  const [description, setDescription] = useState(existingPreset?.description ?? '');
  const [changes, setChanges] = useState<PresetChange[]>(
    existingPreset?.changes ?? [],
  );
  const [saved, setSaved] = useState(false);

  const addChange = (endpointId: EndpointId) => {
    if (changes.some((c) => c.endpointId === endpointId)) return;
    const ep = state.endpoints.find((e) => e.id === endpointId);
    if (!ep) return;
    const firstPlaylist = state.playlists[0];
    setChanges((prev) => [
      ...prev,
      {
        endpointId,
        mode: 'playlist',
        playlistId: firstPlaylist?.id,
        status: 'playing',
      },
    ]);
  };

  const removeChange = (endpointId: EndpointId) => {
    setChanges((prev) => prev.filter((c) => c.endpointId !== endpointId));
  };

  const updateChange = (endpointId: EndpointId, patch: Partial<PresetChange>) => {
    setChanges((prev) =>
      prev.map((c) =>
        c.endpointId === endpointId ? { ...c, ...patch } : c,
      ),
    );
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (isEdit && presetId) {
      dispatch({
        type: 'UPDATE_PRESET',
        presetId,
        updates: { name: name.trim(), description: description.trim(), changes },
      });
    } else {
      dispatch({
        type: 'CREATE_PRESET',
        preset: { name: name.trim(), description: description.trim(), changes },
      });
    }
    setSaved(true);
    setTimeout(() => navigate('/presets'), 800);
  };

  const includedIds = new Set(changes.map((c) => c.endpointId));
  const availableEndpoints = state.endpoints.filter((ep) => !includedIds.has(ep.id));

  return (
    <Layout title={isEdit ? `Edit: ${existingPreset?.name ?? 'Preset'}` : 'New Preset'}>
      <div className="space-y-4 px-2 pt-2">
        {/* ── Name & Description ── */}
        <NeoCard>
          <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-3">
            Details
          </p>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-neo-muted block mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Preset name…"
                className="w-full px-4 py-2.5 rounded-neo-sm neo-surface shadow-neo-inner text-sm text-neo-text placeholder:text-neo-muted focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-neo-muted block mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of what this preset does…"
                rows={2}
                className="w-full px-4 py-2.5 rounded-neo-sm neo-surface shadow-neo-inner text-sm text-neo-text placeholder:text-neo-muted focus:outline-none resize-none"
              />
            </div>
          </div>
        </NeoCard>

        {/* ── Endpoint changes ── */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest">
              Endpoint Changes ({changes.length})
            </p>
          </div>

          {changes.length === 0 ? (
            <NeoCard className="py-8 text-center">
              <p className="text-neo-muted text-sm">No endpoints added yet.</p>
              <p className="text-xs text-neo-muted mt-1">Add endpoints below to configure changes.</p>
            </NeoCard>
          ) : (
            <div className="space-y-2">
              {changes.map((change) => {
                const ep = state.endpoints.find((e) => e.id === change.endpointId);
                const room = ep ? state.rooms.find((r) => r.id === ep.roomId) : null;
                if (!ep) return null;

                return (
                  <NeoCard key={change.endpointId} padding="sm">
                    <div className="flex items-start gap-3">
                      {/* Endpoint name */}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-neo-muted">{room?.name}</div>
                        <div className="text-sm font-semibold text-neo-text truncate">
                          {ep.name}
                        </div>
                      </div>
                      {/* Remove */}
                      <button
                        onClick={() => removeChange(change.endpointId)}
                        className="w-7 h-7 rounded-neo-pill flex items-center justify-center text-neo-muted hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Mode selector */}
                    <div className="mt-2.5 grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-neo-muted block mb-1">Content</label>
                        <div className="relative">
                          <select
                            value={change.mode === 'playlist' ? `pl:${change.playlistId ?? ''}` : `as:${change.assetId ?? ''}`}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val.startsWith('pl:')) {
                                updateChange(change.endpointId, {
                                  mode: 'playlist',
                                  playlistId: val.slice(3),
                                  assetId: undefined,
                                });
                              } else {
                                updateChange(change.endpointId, {
                                  mode: 'asset',
                                  assetId: val.slice(3),
                                  playlistId: undefined,
                                });
                              }
                            }}
                            className="w-full px-3 py-2 pr-7 rounded-neo-sm neo-surface shadow-neo-inner text-xs text-neo-text focus:outline-none appearance-none"
                          >
                            <optgroup label="Playlists">
                              {state.playlists.map((pl) => (
                                <option key={pl.id} value={`pl:${pl.id}`}>
                                  {pl.name}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="Assets">
                              {state.assets.map((a) => (
                                <option key={a.id} value={`as:${a.id}`}>
                                  {a.title}
                                </option>
                              ))}
                            </optgroup>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-neo-muted pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-neo-muted block mb-1">Status</label>
                        <div className="relative">
                          <select
                            value={change.status ?? 'playing'}
                            onChange={(e) =>
                              updateChange(change.endpointId, {
                                status: e.target.value as 'playing' | 'paused' | 'offline',
                              })
                            }
                            className="w-full px-3 py-2 pr-7 rounded-neo-sm neo-surface shadow-neo-inner text-xs text-neo-text focus:outline-none appearance-none"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-neo-muted pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </NeoCard>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Add endpoint ── */}
        {availableEndpoints.length > 0 && (
          <NeoCard>
            <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-3">
              Add Endpoint
            </p>
            <div className="space-y-1">
              {state.rooms.map((room) => {
                const roomEndpoints = availableEndpoints.filter(
                  (ep) => ep.roomId === room.id,
                );
                if (roomEndpoints.length === 0) return null;
                return (
                  <div key={room.id}>
                    <div className="text-[10px] font-semibold text-neo-muted uppercase tracking-widest px-1 py-1.5">
                      {room.name}
                    </div>
                    {roomEndpoints.map((ep) => (
                      <button
                        key={ep.id}
                        onClick={() => addChange(ep.id)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-neo-sm neo-surface shadow-neo-sm hover:shadow-neo text-left transition-shadow mb-1"
                      >
                        <Plus size={13} className="text-neo-accent flex-shrink-0" />
                        <span className="text-sm text-neo-text">{ep.name}</span>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </NeoCard>
        )}

        {/* ── Save ── */}
        <div className="flex gap-3 pb-4">
          <NeoButton variant="secondary" fullWidth onClick={() => navigate('/presets')}>
            Cancel
          </NeoButton>
          <NeoButton
            variant={saved ? 'success' : 'primary'}
            fullWidth
            onClick={handleSave}
          >
            {saved ? '✓ Saved' : isEdit ? 'Save Changes' : 'Create Preset'}
          </NeoButton>
        </div>
      </div>
    </Layout>
  );
}
