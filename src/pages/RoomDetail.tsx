import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { NeoCard } from '../components/design-system/NeoCard';
import { NeoButton } from '../components/design-system/NeoButton';
import { NeoToggle } from '../components/design-system/NeoToggle';
import { BottomSheetModal } from '../components/design-system/BottomSheetModal';
import { StatusBadge, statusVariantFromEndpoint } from '../components/design-system/StatusBadge';
import { useApp } from '../context/AppContext';

const TOUR_THEMES = ['Thylacine', 'Dodo', 'Mammoth'] as const;

function formatDuration(sec: number): string {
  if (sec >= 3600) return `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`;
  if (sec >= 60) return `${Math.floor(sec / 60)}m`;
  return `${sec}s`;
}

export function RoomDetail() {
  const { roomId } = useParams<{ roomId: string }>();
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const [newPlaylistOpen, setNewPlaylistOpen] = useState(false);
  const [plName, setPlName] = useState('');
  const [plLoop, setPlLoop] = useState(true);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [assetSearch, setAssetSearch] = useState('');

  const room = state.rooms.find((r) => r.id === roomId);
  if (!room) {
    return (
      <Layout>
        <div className="p-6 text-neo-muted">Room not found.</div>
      </Layout>
    );
  }

  const endpoints = state.endpoints.filter((ep) =>
    room.endpointIds.includes(ep.id),
  );

  // Sync group support
  const syncEps = endpoints.filter((ep) => ep.syncGroupId);
  const syncGroupId = syncEps[0]?.syncGroupId;
  const hasSyncGroup = syncEps.length > 1 && !!syncGroupId;
  const syncEnabled = syncGroupId
    ? state.uiState.syncGroups[syncGroupId] ?? false
    : false;

  const isTourPath = room.id === 'tour-path';

  const filteredAssets = state.assets.filter(
    (a) => !assetSearch || a.title.toLowerCase().includes(assetSearch.toLowerCase()),
  );

  const toggleAsset = (assetId: string) => {
    setSelectedAssets((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId],
    );
  };

  const openNewPlaylist = () => {
    setPlName('');
    setPlLoop(true);
    setSelectedAssets([]);
    setAssetSearch('');
    setNewPlaylistOpen(true);
  };

  const createPlaylist = () => {
    if (!plName.trim()) return;
    const items = selectedAssets.map((assetId, order) => ({ assetId, order }));
    dispatch({
      type: 'CREATE_PLAYLIST',
      name: plName.trim(),
      loop: plLoop,
      items,
    });
    setNewPlaylistOpen(false);
  };

  return (
    <Layout title={room.name}>
      <div className="space-y-4 px-2 pt-2">
        {/* ── Quick actions ── */}
        <NeoCard>
          <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-3">
            Quick Actions
          </p>
          <div className="flex flex-wrap gap-2">
            <NeoButton
              size="sm"
              onClick={() => dispatch({ type: 'SET_AMBIENT', roomId: room.id })}
            >
              Ambient
            </NeoButton>
            <NeoButton
              size="sm"
              onClick={() =>
                dispatch({ type: 'RETURN_TO_DEFAULT', roomId: room.id })
              }
            >
              Return to Default
            </NeoButton>
            <NeoButton
              size="sm"
              variant="primary"
              onClick={openNewPlaylist}
              icon={<Plus size={13} />}
            >
              New Playlist
            </NeoButton>
            {hasSyncGroup && syncGroupId && (
              <NeoToggle
                checked={syncEnabled}
                onChange={() =>
                  dispatch({ type: 'TOGGLE_SYNC', groupId: syncGroupId })
                }
                label="Sync Screens"
              />
            )}
          </div>
        </NeoCard>

        {/* ── Tour Path theme switcher ── */}
        {isTourPath && (
          <NeoCard>
            <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-3">
              Theme
            </p>
            <div className="flex gap-2 flex-wrap">
              {TOUR_THEMES.map((theme) => (
                <NeoButton
                  key={theme}
                  size="sm"
                  onClick={() =>
                    dispatch({ type: 'SET_TOUR_THEME', theme })
                  }
                >
                  {theme}
                </NeoButton>
              ))}
            </div>
          </NeoCard>
        )}

        {/* ── Endpoint list ── */}
        <div>
          <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-3 px-1">
            Endpoints ({endpoints.length})
          </p>
          <div className="space-y-2.5">
            {endpoints.map((ep) => {
              const asset = ep.nowPlaying.assetId
                ? state.assets.find((a) => a.id === ep.nowPlaying.assetId)
                : null;
              const playlist = ep.nowPlaying.playlistId
                ? state.playlists.find((p) => p.id === ep.nowPlaying.playlistId)
                : null;
              const nowPlayingLabel =
                asset?.title ?? playlist?.name ?? 'Nothing';

              return (
                <NeoCard
                  key={ep.id}
                  onClick={() => navigate(`/endpoint/${ep.id}`)}
                  className="flex items-center gap-3"
                  padding="sm"
                >
                  {/* Color swatch */}
                  <div
                    className="w-10 h-10 rounded-neo-sm flex-shrink-0 shadow-neo-inner"
                    style={{ backgroundColor: asset?.color ?? '#7a7670' }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-neo-text truncate">
                      {ep.name}
                    </div>
                    <div className="text-xs text-neo-muted truncate mt-0.5">
                      {ep.nowPlaying.mode === 'playlist' ? '▶ Playlist: ' : '▶ '}
                      {nowPlayingLabel}
                    </div>
                  </div>

                  {/* Status + chevron */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge variant={statusVariantFromEndpoint(ep.status)}>
                      {ep.status}
                    </StatusBadge>
                    <ChevronRight size={14} className="text-neo-muted" />
                  </div>
                </NeoCard>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── New Playlist Modal ── */}
      <BottomSheetModal
        isOpen={newPlaylistOpen}
        onClose={() => setNewPlaylistOpen(false)}
        title="New Playlist"
        snapHeight="full"
      >
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-neo-muted uppercase tracking-widest block mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={plName}
              onChange={(e) => setPlName(e.target.value)}
              placeholder="Playlist name…"
              className="w-full px-4 py-2.5 rounded-neo-sm neo-surface shadow-neo-inner text-sm text-neo-text placeholder:text-neo-muted focus:outline-none"
            />
          </div>

          {/* Loop toggle */}
          <div className="flex items-center justify-between p-3 rounded-neo-sm neo-surface shadow-neo-inner">
            <div>
              <div className="text-sm font-semibold text-neo-text">Loop</div>
              <div className="text-xs text-neo-muted">Repeat playlist continuously</div>
            </div>
            <button
              onClick={() => setPlLoop((v) => !v)}
              className={[
                'relative w-12 h-6 rounded-neo-pill transition-colors flex-shrink-0',
                plLoop ? 'bg-neo-accent' : 'bg-neo-dark',
              ].join(' ')}
            >
              <span
                className={[
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all',
                  plLoop ? 'left-6' : 'left-0.5',
                ].join(' ')}
              />
            </button>
          </div>

          {/* Video selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-neo-muted uppercase tracking-widest">
                Select Videos ({selectedAssets.length} selected)
              </label>
            </div>
            <div className="relative mb-2">
              <input
                type="text"
                value={assetSearch}
                onChange={(e) => setAssetSearch(e.target.value)}
                placeholder="Search videos…"
                className="w-full px-4 py-2 rounded-neo-pill neo-surface shadow-neo-inner text-sm text-neo-text placeholder:text-neo-muted focus:outline-none"
              />
            </div>
            <div className="space-y-1.5 max-h-52 overflow-y-auto">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAssets.includes(asset.id);
                return (
                  <button
                    key={asset.id}
                    onClick={() => toggleAsset(asset.id)}
                    className={[
                      'w-full flex items-center gap-3 p-2.5 rounded-neo-sm transition-all text-left',
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
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>

                    {/* Thumbnail */}
                    <div
                      className="w-10 h-8 rounded-neo-sm flex-shrink-0 shadow-neo-inner"
                      style={{ backgroundColor: asset.color }}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-neo-text truncate">
                        {asset.title}
                      </div>
                      <div className="text-xs text-neo-muted">
                        {formatDuration(asset.durationSec)} · {asset.aspect}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <NeoButton
              variant="secondary"
              fullWidth
              onClick={() => setNewPlaylistOpen(false)}
            >
              Cancel
            </NeoButton>
            <NeoButton variant="primary" fullWidth onClick={createPlaylist}>
              Create Playlist
            </NeoButton>
          </div>
        </div>
      </BottomSheetModal>
    </Layout>
  );
}
