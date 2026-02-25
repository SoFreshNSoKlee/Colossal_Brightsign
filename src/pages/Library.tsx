import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ListMusic, Film, Plus, Pencil, Trash2, ChevronDown, Upload, Monitor, ChevronsDown, ChevronsUp } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { NeoCard } from '../components/design-system/NeoCard';
import { NeoButton } from '../components/design-system/NeoButton';
import { BottomSheetModal } from '../components/design-system/BottomSheetModal';
import { useApp } from '../context/AppContext';
import type { Asset } from '../types';

type LibTab = 'playlists' | 'assets';

const THUMBNAIL_COLORS = [
  '#8B6914', '#A0522D', '#5B8FA8', '#3A7CA5', '#6B7C4E',
  '#2E3D2F', '#1A237E', '#E91E63', '#37474F', '#4A148C',
  '#D32F2F', '#388E3C', '#0288D1', '#F57C00', '#5D4037',
];

function randomColor(): string {
  return THUMBNAIL_COLORS[Math.floor(Math.random() * THUMBNAIL_COLORS.length)];
}

function formatDuration(sec: number): string {
  if (sec >= 3600) return `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`;
  if (sec >= 60) return `${Math.floor(sec / 60)}m`;
  return `${sec}s`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function parseDurationInput(val: string): number {
  const raw = val.trim().toLowerCase();
  if (!raw) return 0;
  let total = 0;
  const hMatch = raw.match(/(\d+)h/);
  const mMatch = raw.match(/(\d+)m/);
  const sMatch = raw.match(/(\d+)s/);
  if (hMatch) total += parseInt(hMatch[1]) * 3600;
  if (mMatch) total += parseInt(mMatch[1]) * 60;
  if (sMatch) total += parseInt(sMatch[1]);
  if (!hMatch && !mMatch && !sMatch) total = parseInt(raw) || 0;
  return total;
}

function formatDurationForInput(sec: number): string {
  if (!sec) return '';
  if (sec % 3600 === 0) return `${sec / 3600}h`;
  if (sec % 60 === 0) return `${sec / 60}m`;
  return `${sec}s`;
}

type AssetFormState = {
  title: string;
  durationInput: string;
  endpointId: string;
  color: string;
};

function defaultAssetForm(asset?: Asset): AssetFormState {
  return {
    title: asset?.title ?? '',
    durationInput: asset ? formatDurationForInput(asset.durationSec) : '',
    endpointId: asset?.endpointId ?? '',
    color: asset?.color ?? randomColor(),
  };
}

export function Library() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<LibTab>('playlists');
  const [search, setSearch] = useState('');

  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [assetForm, setAssetForm] = useState<AssetFormState>(defaultAssetForm());

  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(
    () => new Set(state.rooms.map((r) => r.id)),
  );

  const toggleRoomAccordion = (roomId: string) => {
    setExpandedRooms((prev) => {
      const next = new Set(prev);
      if (next.has(roomId)) next.delete(roomId); else next.add(roomId);
      return next;
    });
  };

  const filteredAssets = state.assets.filter((a) =>
    !search || a.title.toLowerCase().includes(search.toLowerCase()),
  );

  const searchFilteredPlaylists = state.playlists.filter((pl) =>
    !search || pl.name.toLowerCase().includes(search.toLowerCase()),
  );

  const openEditAsset = (asset: Asset) => {
    setAssetForm(defaultAssetForm(asset));
    setEditingAssetId(asset.id);
  };

  const closeAssetModal = () => { setEditingAssetId(null); };

  const saveAsset = () => {
    const durationSec = parseDurationInput(assetForm.durationInput);
    if (!assetForm.title.trim() || !assetForm.endpointId || !editingAssetId) return;
    const selectedEndpoint = state.endpoints.find((e) => e.id === assetForm.endpointId);
    const aspect = selectedEndpoint?.aspectRatio ?? '16:9';
    dispatch({ type: 'UPDATE_ASSET', assetId: editingAssetId, updates: { title: assetForm.title.trim(), durationSec, endpointId: assetForm.endpointId, aspect, color: assetForm.color } });
    closeAssetModal();
  };

  const deleteAsset = (assetId: string) => {
    if (window.confirm('Delete this asset? It will be removed from all playlists.')) {
      dispatch({ type: 'DELETE_ASSET', assetId });
    }
  };

  const deletePlaylist = (playlistId: string) => {
    if (window.confirm('Delete this playlist?')) dispatch({ type: 'DELETE_PLAYLIST', playlistId });
  };

  const selectedEndpoint = state.endpoints.find((e) => e.id === assetForm.endpointId);
  const editDisabled = !assetForm.title.trim() || !assetForm.endpointId;

  return (
    <Layout title="Library">
      <div className="space-y-4 px-2 pt-2">

        {/* ── Tabs ── */}
        <div className="flex gap-2 neo-surface shadow-neo-inset rounded-neo-pill p-1">
          {(['playlists', 'assets'] as LibTab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={['flex-1 flex items-center justify-center gap-2 py-2 rounded-neo-pill text-sm font-semibold transition-all capitalize',
                tab === t ? 'neo-surface shadow-neo text-neo-accent' : 'text-neo-muted hover:text-neo-text'].join(' ')}>
              {t === 'assets' ? <Film size={15} /> : <ListMusic size={15} />}
              {t === 'assets' ? 'Assets' : 'Playlists'}
            </button>
          ))}
        </div>

        {/* ── Search + collapse/expand all + New ── */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neo-muted pointer-events-none" />
            <input type="text" placeholder={`Search ${tab}…`} value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-neo-pill neo-surface shadow-neo-inner text-sm text-neo-text placeholder:text-neo-muted focus:outline-none" />
          </div>
          <button
            onClick={() => setExpandedRooms(new Set(state.rooms.map((r) => r.id)))}
            className="w-9 h-9 rounded-neo-pill neo-surface shadow-neo-sm flex items-center justify-center text-neo-muted hover:text-neo-accent transition-colors flex-shrink-0"
            title="Expand all"
          >
            <ChevronsDown size={15} />
          </button>
          <button
            onClick={() => setExpandedRooms(new Set())}
            className="w-9 h-9 rounded-neo-pill neo-surface shadow-neo-sm flex items-center justify-center text-neo-muted hover:text-neo-accent transition-colors flex-shrink-0"
            title="Collapse all"
          >
            <ChevronsUp size={15} />
          </button>
          {tab === 'playlists' && (
            <NeoButton variant="primary" size="sm" onClick={() => navigate('/playlists/new')} icon={<Plus size={14} />}>New</NeoButton>
          )}
        </div>

        {/* ── Assets grouped by Room → Endpoint ── */}
        {tab === 'assets' && (
          <div className="space-y-3">
            {state.rooms.map((room) => {
              const roomEndpoints = room.endpointIds
                .map((id) => state.endpoints.find((e) => e.id === id))
                .filter((ep): ep is NonNullable<typeof ep> => ep !== undefined);

              // Check if any assets in this room match the search
              const roomHasAssets = roomEndpoints.some((ep) =>
                filteredAssets.some((a) => a.endpointId === ep.id),
              );
              if (search && !roomHasAssets) return null;

              const isExpanded = expandedRooms.has(room.id);
              const totalRoomAssets = roomEndpoints.reduce((sum, ep) =>
                sum + filteredAssets.filter((a) => a.endpointId === ep.id).length, 0,
              );

              return (
                <div key={room.id} className="rounded-neo overflow-hidden">
                  <button onClick={() => toggleRoomAccordion(room.id)}
                    className="w-full flex items-center justify-between px-4 py-3 neo-surface shadow-neo text-left hover:text-neo-accent transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neo-text">{room.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-neo-pill bg-neo-accent-light text-neo-accent font-semibold">
                        {totalRoomAssets} asset{totalRoomAssets !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <ChevronDown size={16} className={['text-neo-muted transition-transform duration-200', isExpanded ? 'rotate-180' : ''].join(' ')} />
                  </button>

                  {isExpanded && (
                    <div className="pt-2 pb-1 px-1 space-y-3">
                      {roomEndpoints.map((endpoint) => {
                        const epAssets = filteredAssets.filter((a) => a.endpointId === endpoint.id);
                        if (search && epAssets.length === 0) return null;
                        return (
                          <div key={endpoint.id}>
                            {/* Endpoint header */}
                            <div className="flex items-center gap-2 mb-1.5 px-2">
                              <Monitor size={12} className="text-neo-muted flex-shrink-0" />
                              <span className="text-[10px] font-semibold text-neo-muted uppercase tracking-widest">
                                {endpoint.name}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-neo-pill bg-neo-accent-light text-neo-accent font-semibold">
                                {endpoint.aspectRatio}
                              </span>
                            </div>

                            {epAssets.length === 0 ? (
                              <div className="py-4 text-center text-xs text-neo-muted">No assets for this endpoint.</div>
                            ) : (
                              <div className="space-y-1.5">
                                {epAssets.map((asset) => (
                                  <NeoCard key={asset.id} padding="sm" className="flex items-center gap-3">
                                    {/* Thumbnail */}
                                    <div className="w-12 h-9 rounded-neo-sm flex-shrink-0 overflow-hidden"
                                      style={{ backgroundColor: asset.color }}>
                                      {asset.imageUrl && (
                                        <img
                                          src={asset.imageUrl}
                                          alt={asset.title}
                                          className="w-full h-full object-cover"
                                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                        />
                                      )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-semibold text-neo-text truncate">{asset.title}</div>
                                      <div className="text-xs text-neo-muted mt-0.5">
                                        {formatDuration(asset.durationSec)} · {formatDate(asset.updatedAt)}
                                      </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-1 flex-shrink-0">
                                      <button onClick={() => openEditAsset(asset)}
                                        className="w-7 h-7 rounded-neo-pill neo-surface shadow-neo-sm flex items-center justify-center text-neo-muted hover:text-neo-accent transition-colors">
                                        <Pencil size={12} />
                                      </button>
                                      <button onClick={() => deleteAsset(asset.id)}
                                        className="w-7 h-7 rounded-neo-pill neo-surface shadow-neo-sm flex items-center justify-center text-neo-muted hover:text-red-500 transition-colors">
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </NeoCard>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            {search && filteredAssets.length === 0 && (
              <div className="py-12 text-center text-neo-muted">No assets match your search.</div>
            )}
          </div>
        )}

        {/* ── Playlist list ── */}
        {tab === 'playlists' && (
          <div className="space-y-3">
            {state.rooms.map((room) => {
              const roomPlaylists = searchFilteredPlaylists.filter((pl) => pl.roomId === room.id);
              if (search && roomPlaylists.length === 0) return null;
              const isExpanded = expandedRooms.has(room.id);
              return (
                <div key={room.id} className="rounded-neo overflow-hidden">
                  <button onClick={() => toggleRoomAccordion(room.id)}
                    className="w-full flex items-center justify-between px-4 py-3 neo-surface shadow-neo text-left hover:text-neo-accent transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neo-text">{room.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-neo-pill bg-neo-accent-light text-neo-accent font-semibold">
                        {roomPlaylists.length} playlist{roomPlaylists.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <ChevronDown size={16} className={['text-neo-muted transition-transform duration-200', isExpanded ? 'rotate-180' : ''].join(' ')} />
                  </button>
                  {isExpanded && (
                    <div className="space-y-2 pt-2 px-1 pb-1">
                      {roomPlaylists.length === 0 ? (
                        <div className="py-6 text-center text-xs text-neo-muted">No playlists in this room.</div>
                      ) : (
                        roomPlaylists.map((pl) => {
                          const runtime = pl.items.reduce((sum, item) => {
                            const a = state.assets.find((a) => a.id === item.assetId);
                            return sum + (a?.durationSec ?? 0);
                          }, 0);
                          return (
                            <NeoCard key={pl.id} className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-neo-sm bg-neo-accent-light shadow-neo-inner flex items-center justify-center flex-shrink-0">
                                <ListMusic size={22} className="text-neo-accent" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-neo-text text-sm">{pl.name}</div>
                                <div className="text-xs text-neo-muted mt-0.5">{pl.items.length} tracks · {formatDuration(runtime)}</div>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  <span className={['text-[10px] px-2 py-0.5 rounded-neo-pill font-semibold',
                                    pl.loop ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'].join(' ')}>
                                    {pl.loop ? 'Loop' : 'Once'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-1.5 flex-shrink-0">
                                <NeoButton size="sm" onClick={() => navigate(`/playlists/${pl.id}/edit`)}>Edit</NeoButton>
                                <button onClick={() => deletePlaylist(pl.id)}
                                  className="w-8 h-8 rounded-neo-pill neo-surface shadow-neo-sm flex items-center justify-center text-neo-muted hover:text-red-500 transition-colors">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </NeoCard>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {search && searchFilteredPlaylists.length === 0 && (
              <div className="py-12 text-center text-neo-muted">No playlists found.</div>
            )}
          </div>
        )}
      </div>

      {/* ── Edit Asset Modal ── */}
      <BottomSheetModal isOpen={!!editingAssetId} onClose={closeAssetModal}
        title="Edit Asset" snapHeight="full">
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-neo-muted uppercase tracking-widest block mb-1.5">
              Title <span className="text-neo-red text-[10px] normal-case font-normal">required</span>
            </label>
            <input type="text" value={assetForm.title}
              onChange={(e) => setAssetForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Asset title…"
              className="w-full px-4 py-2.5 rounded-neo-sm neo-surface shadow-neo-inner text-sm text-neo-text placeholder:text-neo-muted focus:outline-none" />
          </div>

          {/* Endpoint */}
          <div>
            <label className="text-xs font-semibold text-neo-muted uppercase tracking-widest block mb-1.5">
              Endpoint <span className="text-neo-red text-[10px] normal-case font-normal">required</span>
            </label>
            <select value={assetForm.endpointId}
              onChange={(e) => setAssetForm((f) => ({ ...f, endpointId: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-neo-sm neo-surface shadow-neo-inner text-sm text-neo-text focus:outline-none">
              <option value="">— Select an endpoint —</option>
              {state.rooms.map((room) => (
                <optgroup key={room.id} label={room.name}>
                  {room.endpointIds.map((epId) => {
                    const ep = state.endpoints.find((e) => e.id === epId);
                    if (!ep) return null;
                    return <option key={ep.id} value={ep.id}>{ep.name} ({ep.aspectRatio})</option>;
                  })}
                </optgroup>
              ))}
            </select>
            {selectedEndpoint && (
              <p className="text-xs text-neo-muted mt-1.5">
                Aspect ratio: <span className="font-semibold text-neo-text">{selectedEndpoint.aspectRatio}</span> (set automatically)
              </p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="text-xs font-semibold text-neo-muted uppercase tracking-widest block mb-1.5">Duration (e.g. 60m, 1h)</label>
            <input type="text" value={assetForm.durationInput}
              onChange={(e) => setAssetForm((f) => ({ ...f, durationInput: e.target.value }))}
              placeholder="60m"
              className="w-full px-4 py-2.5 rounded-neo-sm neo-surface shadow-neo-inner text-sm text-neo-text placeholder:text-neo-muted focus:outline-none" />
          </div>

          {/* Thumbnail color */}
          <div>
            <label className="text-xs font-semibold text-neo-muted uppercase tracking-widest block mb-1.5">Thumbnail Color</label>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-neo-sm shadow-neo-inner flex-shrink-0" style={{ backgroundColor: assetForm.color }} />
              <button onClick={() => setAssetForm((f) => ({ ...f, color: randomColor() }))}
                className="text-xs text-neo-accent hover:text-neo-accent-hover font-semibold transition-colors">
                Randomize
              </button>
            </div>
          </div>

          {/* Upload file */}
          <div>
            <label className="text-xs font-semibold text-neo-muted uppercase tracking-widest block mb-1.5">Asset File</label>
            <button
              className="w-full flex items-center justify-center gap-2 py-3 rounded-neo-sm neo-surface shadow-neo-sm text-sm text-neo-muted hover:text-neo-text border-2 border-dashed border-neo-dark/30 hover:border-neo-accent/40 transition-colors"
              onClick={() => { /* placeholder */ }}
            >
              <Upload size={16} />
              Upload File
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <NeoButton variant="secondary" fullWidth onClick={closeAssetModal}>Cancel</NeoButton>
            <NeoButton variant="primary" fullWidth onClick={saveAsset} disabled={editDisabled}>
              Save Changes
            </NeoButton>
          </div>
        </div>
      </BottomSheetModal>

    </Layout>
  );
}
