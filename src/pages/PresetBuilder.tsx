import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, ListMusic, Film, X } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { NeoCard } from '../components/design-system/NeoCard';
import { NeoButton } from '../components/design-system/NeoButton';
import { useApp } from '../context/AppContext';
import type { PresetChange, EndpointId } from '../types';

export function PresetBuilder() {
  const { presetId } = useParams<{ presetId: string }>();
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const isEdit = !!presetId;
  const existingPreset = isEdit ? state.presets.find((p) => p.id === presetId) : null;

  const [name, setName] = useState(existingPreset?.name ?? '');
  const [description, setDescription] = useState(existingPreset?.description ?? '');
  const [changes, setChanges] = useState<PresetChange[]>(existingPreset?.changes ?? []);
  const [saved, setSaved] = useState(false);

  const addChange = (endpointId: EndpointId) => {
    if (changes.some((c) => c.endpointId === endpointId)) return;
    const ep = state.endpoints.find((e) => e.id === endpointId);
    if (!ep) return;
    const roomPlaylists = state.playlists.filter((pl) => pl.roomId === ep.roomId);
    const firstPlaylist = roomPlaylists[0] ?? state.playlists[0];
    setChanges((prev) => [
      ...prev,
      {
        endpointId,
        mode: 'playlist',
        playlistId: firstPlaylist?.id,
        playlistIds: firstPlaylist ? [firstPlaylist.id] : [],
        assetIds: [],
        status: 'playing',
      },
    ]);
  };

  const removeChange = (endpointId: EndpointId) => {
    setChanges((prev) => prev.filter((c) => c.endpointId !== endpointId));
  };

  const updateChange = (endpointId: EndpointId, patch: Partial<PresetChange>) => {
    setChanges((prev) =>
      prev.map((c) => c.endpointId === endpointId ? { ...c, ...patch } : c),
    );
  };

  const togglePlaylist = (endpointId: EndpointId, playlistId: string) => {
    setChanges((prev) =>
      prev.map((c) => {
        if (c.endpointId !== endpointId) return c;
        const current = c.playlistIds ?? [];
        const next = current.includes(playlistId)
          ? current.filter((id) => id !== playlistId)
          : [...current, playlistId];
        return { ...c, mode: 'playlist', playlistIds: next, playlistId: next[0] };
      }),
    );
  };

  const toggleAsset = (endpointId: EndpointId, assetId: string) => {
    setChanges((prev) =>
      prev.map((c) => {
        if (c.endpointId !== endpointId) return c;
        const current = c.assetIds ?? [];
        const next = current.includes(assetId)
          ? current.filter((id) => id !== assetId)
          : [...current, assetId];
        return { ...c, mode: 'asset', assetIds: next, assetId: next[0] };
      }),
    );
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (isEdit && presetId) {
      dispatch({ type: 'UPDATE_PRESET', presetId, updates: { name: name.trim(), description: description.trim(), changes } });
    } else {
      dispatch({ type: 'CREATE_PRESET', preset: { name: name.trim(), description: description.trim(), changes } });
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
          <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-3">Details</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-neo-muted block mb-1">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Preset name…"
                className="w-full px-4 py-2.5 rounded-neo-sm neo-surface shadow-neo-inner text-sm text-neo-text placeholder:text-neo-muted focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-neo-muted block mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description…" rows={2}
                className="w-full px-4 py-2.5 rounded-neo-sm neo-surface shadow-neo-inner text-sm text-neo-text placeholder:text-neo-muted focus:outline-none resize-none" />
            </div>
          </div>
        </NeoCard>

        {/* ── Endpoint Changes ── */}
        <div>
          <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-3 px-1">
            Endpoint Changes ({changes.length})
          </p>

          {changes.length === 0 ? (
            <NeoCard className="py-8 text-center">
              <p className="text-neo-muted text-sm">No endpoints added yet.</p>
              <p className="text-xs text-neo-muted mt-1">Add endpoints below to configure changes.</p>
            </NeoCard>
          ) : (
            <div className="space-y-3">
              {changes.map((change) => {
                const ep = state.endpoints.find((e) => e.id === change.endpointId);
                const room = ep ? state.rooms.find((r) => r.id === ep.roomId) : null;
                if (!ep) return null;

                const roomPlaylists = state.playlists.filter((pl) => pl.roomId === ep.roomId);
                const epAssets = state.assets.filter((a) => a.endpointId === ep.id);
                const selectedPlaylists = change.playlistIds ?? [];
                const selectedAssets = change.assetIds ?? [];

                return (
                  <NeoCard key={change.endpointId} padding="sm">
                    {/* Row header */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-neo-muted uppercase tracking-widest">{room?.name}</div>
                        <div className="text-sm font-bold text-neo-text truncate">{ep.name}</div>
                      </div>
                      <button onClick={() => removeChange(change.endpointId)}
                        className="w-7 h-7 rounded-neo-pill flex items-center justify-center text-neo-muted hover:text-red-500 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Playlists multi-select */}
                    {roomPlaylists.length > 0 && (
                      <div className="mb-2.5">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <ListMusic size={11} className="text-neo-accent" />
                          <span className="text-[10px] font-semibold text-neo-muted uppercase tracking-widest">Playlists</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {roomPlaylists.map((pl) => {
                            const sel = selectedPlaylists.includes(pl.id);
                            return (
                              <button key={pl.id} onClick={() => togglePlaylist(change.endpointId, pl.id)}
                                className={['flex items-center gap-1 px-2 py-1 rounded-neo-pill text-[11px] font-semibold transition-all',
                                  sel ? 'bg-neo-accent text-white shadow-neo-sm' : 'neo-surface shadow-neo-sm text-neo-muted hover:text-neo-text'].join(' ')}>
                                {sel && <X size={9} />}
                                {pl.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Assets multi-select */}
                    {epAssets.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Film size={11} className="text-neo-accent" />
                          <span className="text-[10px] font-semibold text-neo-muted uppercase tracking-widest">Assets</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {epAssets.map((asset) => {
                            const sel = selectedAssets.includes(asset.id);
                            return (
                              <button key={asset.id} onClick={() => toggleAsset(change.endpointId, asset.id)}
                                className={['flex items-center gap-1 px-2 py-1 rounded-neo-pill text-[11px] font-semibold transition-all',
                                  sel ? 'bg-neo-accent2 text-white shadow-neo-sm' : 'neo-surface shadow-neo-sm text-neo-muted hover:text-neo-text'].join(' ')}>
                                {sel && <X size={9} />}
                                {asset.title}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Selection summary */}
                    {(selectedPlaylists.length > 0 || selectedAssets.length > 0) && (
                      <div className="mt-2 pt-2 border-t border-neo-dark/20 text-[10px] text-neo-muted">
                        {selectedPlaylists.length > 0 && <span className="text-neo-accent font-semibold">{selectedPlaylists.length}pl</span>}
                        {selectedPlaylists.length > 0 && selectedAssets.length > 0 && ' + '}
                        {selectedAssets.length > 0 && <span className="text-neo-accent2 font-semibold">{selectedAssets.length}as</span>}
                        <span> selected · first item plays on apply</span>
                      </div>
                    )}
                  </NeoCard>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Add Endpoint ── */}
        {availableEndpoints.length > 0 && (
          <NeoCard>
            <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-3">Add Endpoint</p>
            <div className="space-y-1">
              {state.rooms.map((room) => {
                const roomEps = availableEndpoints.filter((ep) => ep.roomId === room.id);
                if (roomEps.length === 0) return null;
                return (
                  <div key={room.id}>
                    <div className="text-[10px] font-semibold text-neo-muted uppercase tracking-widest px-1 py-1.5">{room.name}</div>
                    {roomEps.map((ep) => (
                      <button key={ep.id} onClick={() => addChange(ep.id)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-neo-sm neo-surface shadow-neo-sm hover:shadow-neo text-left transition-shadow mb-1">
                        <Plus size={13} className="text-neo-accent flex-shrink-0" />
                        <span className="text-sm text-neo-text">{ep.name}</span>
                        <span className="ml-auto text-[10px] text-neo-muted">{ep.aspectRatio}</span>
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
          <NeoButton variant="secondary" fullWidth onClick={() => navigate('/presets')}>Cancel</NeoButton>
          <NeoButton variant={saved ? 'success' : 'primary'} fullWidth onClick={handleSave}>
            {saved ? '✓ Saved' : isEdit ? 'Save Changes' : 'Create Preset'}
          </NeoButton>
        </div>
      </div>
    </Layout>
  );
}
