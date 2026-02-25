import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Monitor, Search, Check } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { NeoCard } from '../components/design-system/NeoCard';
import { NeoButton } from '../components/design-system/NeoButton';
import { useApp } from '../context/AppContext';
import type { PlaylistItem } from '../types';

function formatDuration(sec: number): string {
  if (sec >= 3600) return `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`;
  if (sec >= 60) return `${Math.floor(sec / 60)}m`;
  return `${sec}s`;
}

export function PlaylistNew() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const presetRoomId = searchParams.get('roomId') ?? '';

  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState(presetRoomId || (state.rooms[0]?.id ?? ''));
  const [loop, setLoop] = useState(true);
  const [nextPlaylistId, setNextPlaylistId] = useState('');
  const [search, setSearch] = useState('');

  // endpointId -> Set of selected assetIds
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});

  const room = state.rooms.find((r) => r.id === roomId);
  const roomEndpoints = room
    ? room.endpointIds
        .map((id) => state.endpoints.find((e) => e.id === id))
        .filter((ep): ep is NonNullable<typeof ep> => ep !== undefined)
    : [];

  const toggleAsset = (endpointId: string, assetId: string) => {
    setSelected((prev) => {
      const epSet = new Set(prev[endpointId] ?? []);
      if (epSet.has(assetId)) epSet.delete(assetId); else epSet.add(assetId);
      return { ...prev, [endpointId]: epSet };
    });
  };

  const totalSelected = Object.values(selected).reduce((sum, s) => sum + s.size, 0);

  const handleCreate = () => {
    if (!name.trim() || !roomId) return;

    const items: PlaylistItem[] = [];
    for (const [endpointId, assetSet] of Object.entries(selected)) {
      let order = 0;
      for (const assetId of assetSet) {
        items.push({ endpointId, assetId, order: order++ });
      }
    }

    dispatch({ type: 'CREATE_PLAYLIST', name: name.trim(), roomId, loop, items, ...(!loop && nextPlaylistId ? { nextPlaylistId } : {}) });

    if (presetRoomId) {
      navigate(`/room/${roomId}`);
    } else {
      navigate('/library');
    }
  };

  return (
    <Layout title="New Playlist">
      <div className="space-y-4 px-2 pt-2 pb-28">

        {/* ── Playlist settings ── */}
        <NeoCard>
          {/* Room selector — only shown when no preset room from URL */}
          {!presetRoomId && (
            <div className="mb-4">
              <label className="text-xs font-semibold text-neo-muted uppercase tracking-widest block mb-1.5">
                Room
              </label>
              <select
                value={roomId}
                onChange={(e) => { setRoomId(e.target.value); setSelected({}); }}
                className="w-full px-4 py-2.5 rounded-neo-sm neo-surface shadow-neo-inner text-sm text-neo-text focus:outline-none"
              >
                {state.rooms.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Playlist name */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-neo-muted uppercase tracking-widest block mb-1.5">
              Name <span className="text-neo-red text-[10px] normal-case font-normal">required</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Playlist name…"
              autoFocus
              className="w-full px-3 py-2 rounded-neo-sm neo-surface shadow-neo-inner text-base font-bold text-neo-text placeholder:text-neo-muted focus:outline-none"
            />
          </div>

          {/* Loop toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neo-muted uppercase tracking-widest">Loop</span>
            <button
              onClick={() => setLoop((v) => !v)}
              className={[
                'relative w-12 h-6 rounded-neo-pill transition-colors flex-shrink-0',
                loop ? 'bg-neo-accent' : 'bg-neo-dark',
              ].join(' ')}
            >
              <span
                className={[
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all',
                  loop ? 'left-6' : 'left-0.5',
                ].join(' ')}
              />
            </button>
          </div>

          {/* Next playlist (shown when loop is off) */}
          {!loop && (
            <div className="mt-3">
              <label className="text-xs font-semibold text-neo-muted uppercase tracking-widest block mb-1.5">
                Play next
              </label>
              <select
                value={nextPlaylistId}
                onChange={(e) => setNextPlaylistId(e.target.value)}
                className="w-full px-3 py-2 rounded-neo-sm neo-surface shadow-neo-inner text-sm text-neo-text focus:outline-none"
              >
                <option value="">— None (stop after) —</option>
                {state.playlists
                  .filter((pl) => pl.roomId === roomId)
                  .map((pl) => (
                    <option key={pl.id} value={pl.id}>{pl.name}</option>
                  ))}
              </select>
            </div>
          )}
        </NeoCard>

        {/* ── Search ── */}
        <div className="relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neo-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search assets…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-neo-pill neo-surface shadow-neo-inner text-sm text-neo-text placeholder:text-neo-muted focus:outline-none"
          />
        </div>

        {/* ── Endpoint sections ── */}
        {roomEndpoints.length === 0 ? (
          <NeoCard className="py-10 text-center">
            <p className="text-neo-muted">No endpoints found for this room.</p>
          </NeoCard>
        ) : (
          roomEndpoints.map((endpoint) => {
            const epAssets = state.assets.filter(
              (a) =>
                a.endpointId === endpoint.id &&
                (!search || a.title.toLowerCase().includes(search.toLowerCase())),
            );
            const epSelected = selected[endpoint.id] ?? new Set<string>();

            return (
              <div key={endpoint.id}>
                {/* Endpoint header */}
                <div className="flex items-center gap-2 mb-2 px-1">
                  <Monitor size={14} className="text-neo-muted flex-shrink-0" />
                  <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest">
                    {endpoint.name}
                  </p>
                  <span className="text-[10px] px-2 py-0.5 rounded-neo-pill bg-neo-accent-light text-neo-accent font-semibold">
                    {endpoint.aspectRatio}
                  </span>
                  {epSelected.size > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-neo-pill bg-neo-accent text-white font-semibold ml-auto">
                      {epSelected.size} selected
                    </span>
                  )}
                </div>

                {epAssets.length === 0 ? (
                  <NeoCard className="py-5 text-center" padding="sm">
                    <p className="text-xs text-neo-muted">
                      {search ? 'No assets match your search.' : 'No assets for this endpoint.'}
                    </p>
                  </NeoCard>
                ) : (
                  <div className="space-y-2">
                    {epAssets.map((asset) => {
                      const isSelected = epSelected.has(asset.id);
                      return (
                        <div
                          key={asset.id}
                          onClick={() => toggleAsset(endpoint.id, asset.id)}
                          className={[
                            'flex items-center gap-3 p-3 rounded-neo-sm cursor-pointer transition-all',
                            isSelected
                              ? 'neo-surface shadow-neo-inset'
                              : 'neo-surface shadow-neo-sm hover:shadow-neo',
                          ].join(' ')}
                        >
                          {/* Checkbox */}
                          <div
                            className={[
                              'w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border-2 transition-colors',
                              isSelected
                                ? 'bg-neo-accent border-neo-accent'
                                : 'border-neo-dark bg-neo-bg',
                            ].join(' ')}
                          >
                            {isSelected && (
                              <Check size={12} className="text-white" strokeWidth={2.5} />
                            )}
                          </div>

                          {/* Thumbnail */}
                          <div
                            className="w-12 h-9 rounded-neo-sm flex-shrink-0 shadow-neo-inner"
                            style={{ backgroundColor: asset.color }}
                          />

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-neo-text truncate">
                              {asset.title}
                            </div>
                            <div className="text-xs text-neo-muted">
                              {formatDuration(asset.durationSec)}
                            </div>
                            {asset.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {asset.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-[10px] px-1.5 py-0.5 rounded-neo-pill bg-neo-accent-light text-neo-accent font-medium"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── Sticky footer actions ── */}
      <div className="fixed bottom-0 inset-x-0 z-20 p-4 neo-surface shadow-[0_-4px_12px_var(--shadow-dark)] lg:hidden">
        <div className="flex gap-3">
          <NeoButton variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </NeoButton>
          <NeoButton
            variant="primary"
            fullWidth
            onClick={handleCreate}
            disabled={!name.trim() || !roomId}
          >
            {totalSelected > 0
              ? `Create Playlist (${totalSelected} asset${totalSelected !== 1 ? 's' : ''})`
              : 'Create Playlist'}
          </NeoButton>
        </div>
      </div>

      {/* Desktop footer */}
      <div className="hidden lg:block mt-4 px-2 pb-6">
        <div className="flex gap-3 max-w-5xl mx-auto">
          <NeoButton variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </NeoButton>
          <NeoButton
            variant="primary"
            fullWidth
            onClick={handleCreate}
            disabled={!name.trim() || !roomId}
          >
            {totalSelected > 0
              ? `Create Playlist (${totalSelected} asset${totalSelected !== 1 ? 's' : ''})`
              : 'Create Playlist'}
          </NeoButton>
        </div>
      </div>
    </Layout>
  );
}
