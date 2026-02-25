import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  Search,
  GripVertical,
  Monitor,
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { NeoCard } from '../components/design-system/NeoCard';
import { NeoButton } from '../components/design-system/NeoButton';
import { BottomSheetModal } from '../components/design-system/BottomSheetModal';
import { useApp } from '../context/AppContext';

function formatDuration(sec: number): string {
  if (sec >= 3600) return `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`;
  if (sec >= 60) return `${Math.floor(sec / 60)}m`;
  return `${sec}s`;
}

export function PlaylistBuilder() {
  const { playlistId } = useParams<{ playlistId: string }>();
  const { state, dispatch } = useApp();

  // Which endpoint's "Add Asset" modal is open (null = closed)
  const [addingToEndpointId, setAddingToEndpointId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState(false);

  const playlist = state.playlists.find((p) => p.id === playlistId);

  const [editName, setEditName] = useState(playlist?.name ?? '');
  const [editLoop, setEditLoop] = useState(playlist?.loop ?? true);
  const [editNextPlaylistId, setEditNextPlaylistId] = useState(playlist?.nextPlaylistId ?? '');

  if (!playlist) {
    return (
      <Layout>
        <div className="p-6 text-neo-muted">Playlist not found.</div>
      </Layout>
    );
  }

  const room = state.rooms.find((r) => r.id === playlist.roomId);
  // Get all endpoints for this playlist's room in order
  const roomEndpoints = room
    ? room.endpointIds
        .map((id) => state.endpoints.find((e) => e.id === id))
        .filter((ep): ep is NonNullable<typeof ep> => ep !== undefined)
    : [];

  // Total runtime across all items
  const totalRuntime = playlist.items.reduce((sum, item) => {
    const a = state.assets.find((a) => a.id === item.assetId);
    return sum + (a?.durationSec ?? 0);
  }, 0);

  const handleSave = () => {
    if (!editName.trim()) return;
    dispatch({
      type: 'UPDATE_PLAYLIST_META',
      playlistId: playlist.id,
      name: editName.trim(),
      loop: editLoop,
      nextPlaylistId: !editLoop ? editNextPlaylistId : undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Get sorted items for a specific endpoint within this playlist
  const getEndpointItems = (endpointId: string) =>
    playlist.items
      .filter((i) => i.endpointId === endpointId)
      .sort((a, b) => a.order - b.order);

  // Assets available to add to a specific endpoint:
  // - Must be assigned to that endpoint
  // - Must not already be in this playlist for that endpoint
  // - Must match the search filter
  const getAvailableAssets = (endpointId: string) => {
    const existingIds = new Set(
      playlist.items
        .filter((i) => i.endpointId === endpointId)
        .map((i) => i.assetId),
    );
    return state.assets.filter(
      (a) =>
        a.endpointId === endpointId &&
        !existingIds.has(a.id) &&
        (!search || a.title.toLowerCase().includes(search.toLowerCase())),
    );
  };

  const addingEndpoint = addingToEndpointId
    ? state.endpoints.find((e) => e.id === addingToEndpointId)
    : null;
  const availableAssets = addingToEndpointId ? getAvailableAssets(addingToEndpointId) : [];
  const allEndpointAssetsInPlaylist =
    addingToEndpointId
      ? state.assets.filter((a) => a.endpointId === addingToEndpointId).length ===
        playlist.items.filter((i) => i.endpointId === addingToEndpointId).length
      : false;

  return (
    <Layout title={`Edit: ${playlist.name}`}>
      <div className="space-y-4 px-2 pt-2">
        {/* ── Playlist header ── */}
        <NeoCard>
          {/* Room context */}
          {room && (
            <p className="text-xs text-neo-muted mb-3">
              {room.name} · {roomEndpoints.length} screen{roomEndpoints.length !== 1 ? 's' : ''}
            </p>
          )}

          {/* Editable name */}
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full px-3 py-2 rounded-neo-sm neo-surface shadow-neo-inner text-base font-bold text-neo-text focus:outline-none mb-2"
          />

          <p className="text-xs text-neo-muted mb-3">
            {playlist.items.length} tracks · {formatDuration(totalRuntime)}
          </p>

          {/* Loop toggle */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neo-muted uppercase tracking-widest">Loop</span>
            <button
              onClick={() => setEditLoop((v) => !v)}
              className={[
                'relative w-12 h-6 rounded-neo-pill transition-colors flex-shrink-0',
                editLoop ? 'bg-neo-accent' : 'bg-neo-dark',
              ].join(' ')}
            >
              <span
                className={[
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all',
                  editLoop ? 'left-6' : 'left-0.5',
                ].join(' ')}
              />
            </button>
          </div>

          {/* Next playlist (shown when loop is off) */}
          {!editLoop && (
            <div className="mb-3">
              <label className="text-xs font-semibold text-neo-muted uppercase tracking-widest block mb-1.5">
                Play next
              </label>
              <select
                value={editNextPlaylistId}
                onChange={(e) => setEditNextPlaylistId(e.target.value)}
                className="w-full px-3 py-2 rounded-neo-sm neo-surface shadow-neo-inner text-sm text-neo-text focus:outline-none"
              >
                <option value="">— None (stop after) —</option>
                {state.playlists
                  .filter((pl) => pl.id !== playlist.id && pl.roomId === playlist.roomId)
                  .map((pl) => (
                    <option key={pl.id} value={pl.id}>{pl.name}</option>
                  ))}
              </select>
            </div>
          )}

          <NeoButton
            variant={saved ? 'success' : 'primary'}
            size="sm"
            onClick={handleSave}
            fullWidth
          >
            {saved ? '✓ Saved' : 'Save Changes'}
          </NeoButton>
        </NeoCard>

        {/* ── Endpoint sections ── */}
        {roomEndpoints.length === 0 ? (
          <NeoCard className="py-10 text-center">
            <p className="text-neo-muted">No endpoints found for this room.</p>
          </NeoCard>
        ) : (
          roomEndpoints.map((endpoint) => {
            const epItems = getEndpointItems(endpoint.id);
            const epAssets = state.assets.filter((a) => a.endpointId === endpoint.id);

            return (
              <div key={endpoint.id}>
                {/* Endpoint section header */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-2">
                    <Monitor size={14} className="text-neo-muted" />
                    <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest">
                      {endpoint.name}
                    </p>
                    <span className="text-[10px] px-2 py-0.5 rounded-neo-pill bg-neo-accent-light text-neo-accent font-semibold">
                      {endpoint.aspectRatio}
                    </span>
                  </div>
                  <NeoButton
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setSearch('');
                      setAddingToEndpointId(endpoint.id);
                    }}
                    icon={<Plus size={14} />}
                    disabled={epAssets.length === 0}
                  >
                    Add
                  </NeoButton>
                </div>

                {epItems.length === 0 ? (
                  <NeoCard className="py-6 text-center" padding="sm">
                    {epAssets.length === 0 ? (
                      <p className="text-xs text-neo-muted">
                        No assets created for this endpoint yet.
                      </p>
                    ) : (
                      <>
                        <p className="text-neo-muted text-sm">No assets added.</p>
                        <p className="text-xs text-neo-muted mt-1">Tap "Add" to get started.</p>
                      </>
                    )}
                  </NeoCard>
                ) : (
                  <div className="space-y-2">
                    {epItems.map((item, idx) => {
                      const asset = state.assets.find((a) => a.id === item.assetId);
                      if (!asset) return null;

                      return (
                        <NeoCard key={item.assetId} className="flex items-center gap-3" padding="sm">
                          {/* Drag handle (visual only) */}
                          <GripVertical size={16} className="text-neo-dark flex-shrink-0" />

                          {/* Order number */}
                          <div className="w-6 text-xs font-bold text-neo-muted text-center flex-shrink-0">
                            {idx + 1}
                          </div>

                          {/* Thumbnail */}
                          <div
                            className="w-10 h-8 rounded-neo-sm flex-shrink-0 shadow-neo-inner"
                            style={{ backgroundColor: asset.color }}
                          />

                          {/* Asset info */}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-neo-text truncate">
                              {asset.title}
                            </div>
                            <div className="text-xs text-neo-muted">
                              {formatDuration(asset.durationSec)}
                            </div>
                          </div>

                          {/* Reorder buttons */}
                          <div className="flex flex-col gap-0.5 flex-shrink-0">
                            <button
                              disabled={idx === 0}
                              onClick={() =>
                                dispatch({
                                  type: 'REORDER_PLAYLIST',
                                  playlistId: playlist.id,
                                  endpointId: endpoint.id,
                                  fromIdx: idx,
                                  toIdx: idx - 1,
                                })
                              }
                              className="w-7 h-7 rounded-lg neo-surface shadow-neo-sm flex items-center justify-center text-neo-muted hover:text-neo-text disabled:opacity-30 transition-colors"
                            >
                              <ChevronUp size={14} />
                            </button>
                            <button
                              disabled={idx === epItems.length - 1}
                              onClick={() =>
                                dispatch({
                                  type: 'REORDER_PLAYLIST',
                                  playlistId: playlist.id,
                                  endpointId: endpoint.id,
                                  fromIdx: idx,
                                  toIdx: idx + 1,
                                })
                              }
                              className="w-7 h-7 rounded-lg neo-surface shadow-neo-sm flex items-center justify-center text-neo-muted hover:text-neo-text disabled:opacity-30 transition-colors"
                            >
                              <ChevronDown size={14} />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() =>
                              dispatch({
                                type: 'REMOVE_PLAYLIST_ITEM',
                                playlistId: playlist.id,
                                endpointId: endpoint.id,
                                assetId: item.assetId,
                              })
                            }
                            className="w-8 h-8 rounded-neo-pill flex items-center justify-center text-neo-muted hover:text-red-500 transition-colors flex-shrink-0"
                          >
                            <Trash2 size={15} />
                          </button>
                        </NeoCard>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── Add Asset Modal (per endpoint) ── */}
      <BottomSheetModal
        isOpen={!!addingToEndpointId}
        onClose={() => {
          setAddingToEndpointId(null);
          setSearch('');
        }}
        title={addingEndpoint ? `Add to ${addingEndpoint.name}` : 'Add Asset'}
        snapHeight="full"
      >
        {/* Endpoint context */}
        {addingEndpoint && (
          <p className="text-xs text-neo-muted mb-3">
            Showing assets for {addingEndpoint.name} · {addingEndpoint.aspectRatio}
          </p>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neo-muted" />
          <input
            type="text"
            placeholder="Search assets…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-neo-pill neo-surface shadow-neo-inner text-sm text-neo-text placeholder:text-neo-muted focus:outline-none"
          />
        </div>

        {availableAssets.length === 0 && (
          <p className="text-center text-neo-muted py-8">
            {allEndpointAssetsInPlaylist
              ? 'All assets for this endpoint are already in the playlist.'
              : 'No assets match your search.'}
          </p>
        )}

        <div className="space-y-2">
          {availableAssets.map((asset) => (
            <div
              key={asset.id}
              className="flex items-center gap-3 p-3 rounded-neo-sm neo-surface shadow-neo-sm cursor-pointer hover:shadow-neo active:shadow-neo-pressed transition-shadow"
              onClick={() => {
                if (!addingToEndpointId) return;
                dispatch({
                  type: 'ADD_PLAYLIST_ITEM',
                  playlistId: playlist.id,
                  endpointId: addingToEndpointId,
                  assetId: asset.id,
                });
                setAddingToEndpointId(null);
                setSearch('');
              }}
            >
              <div
                className="w-12 h-9 rounded-neo-sm flex-shrink-0 shadow-neo-inner"
                style={{ backgroundColor: asset.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-neo-text">{asset.title}</div>
                <div className="text-xs text-neo-muted">
                  {formatDuration(asset.durationSec)} · {asset.aspect}
                </div>
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
              </div>
              <Plus size={16} className="text-neo-accent flex-shrink-0" />
            </div>
          ))}
        </div>
      </BottomSheetModal>
    </Layout>
  );
}
