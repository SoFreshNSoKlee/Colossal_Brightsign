import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Play,
  Pause,
  RotateCcw,
  Repeat,
  SkipBack,
  SkipForward,
  Film,
  ListMusic,
  Sun,
  Search,
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { NeoCard } from '../components/design-system/NeoCard';
import { NeoButton } from '../components/design-system/NeoButton';
import { NeoToggle } from '../components/design-system/NeoToggle';
import { StatusBadge, statusVariantFromEndpoint } from '../components/design-system/StatusBadge';
import { BottomSheetModal } from '../components/design-system/BottomSheetModal';
import { useApp } from '../context/AppContext';

function formatDuration(sec: number): string {
  if (sec >= 3600) return `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`;
  if (sec >= 60) return `${Math.floor(sec / 60)}m`;
  return `${sec}s`;
}

export function EndpointDetail() {
  const { endpointId } = useParams<{ endpointId: string }>();
  const { state, dispatch } = useApp();

  const [swapOpen, setSwapOpen] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [search, setSearch] = useState('');

  const ep = state.endpoints.find((e) => e.id === endpointId);
  if (!ep) {
    return (
      <Layout>
        <div className="p-6 text-neo-muted">Endpoint not found.</div>
      </Layout>
    );
  }

  const isMegalodon = ep.roomId === 'megalodon-room';
  const nowAsset = ep.nowPlaying.assetId
    ? state.assets.find((a) => a.id === ep.nowPlaying.assetId)
    : null;
  const nowPlaylist = ep.nowPlaying.playlistId
    ? state.playlists.find((p) => p.id === ep.nowPlaying.playlistId)
    : null;

  // Current item in playlist
  const currentPlaylistItem = nowPlaylist
    ? nowPlaylist.items[ep.nowPlaying.currentItemIndex] ?? nowPlaylist.items[0]
    : null;
  const currentAssetInPlaylist = currentPlaylistItem
    ? state.assets.find((a) => a.id === currentPlaylistItem.assetId)
    : null;

  const displayAsset = nowAsset ?? currentAssetInPlaylist;
  const displayTitle =
    ep.nowPlaying.mode === 'asset'
      ? (nowAsset?.title ?? 'Unknown Asset')
      : (nowPlaylist?.name ?? 'Unknown Playlist');

  const filteredAssets = state.assets.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())),
  );

  const isPlaying = ep.status === 'playing';
  const isOffline = ep.status === 'offline';

  return (
    <Layout title={ep.name}>
      <div className="space-y-4 px-2 pt-2">
        {/* ── Now Playing Panel ── */}
        <NeoCard>
          <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-3">
            Now Playing
          </p>

          <div className="flex gap-4 items-start">
            {/* Thumbnail placeholder */}
            <div
              className="w-20 h-14 rounded-neo-sm flex-shrink-0 shadow-neo-inner flex items-center justify-center"
              style={{
                backgroundColor: displayAsset?.color ?? '#7a7670',
              }}
            >
              <span className="text-white/40 text-xs font-bold">
                {displayAsset?.aspect ?? '16:9'}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="font-bold text-neo-text text-base truncate">{displayTitle}</div>
              {ep.nowPlaying.mode === 'playlist' && nowPlaylist && (
                <div className="text-xs text-neo-muted mt-0.5 truncate">
                  Track {ep.nowPlaying.currentItemIndex + 1}/{nowPlaylist.items.length}
                  {currentAssetInPlaylist ? ` · ${currentAssetInPlaylist.title}` : ''}
                </div>
              )}
              {displayAsset && (
                <div className="text-xs text-neo-muted mt-0.5">
                  {formatDuration(displayAsset.durationSec)} · {displayAsset.aspect}
                </div>
              )}
              <div className="mt-2">
                <StatusBadge variant={statusVariantFromEndpoint(ep.status)}>
                  {ep.status}
                </StatusBadge>
              </div>
            </div>
          </div>

          {/* Tags */}
          {displayAsset && displayAsset.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {displayAsset.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-neo-pill bg-neo-accent-light text-neo-accent"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </NeoCard>

        {/* ── Controls ── */}
        <NeoCard>
          <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-3">
            Controls
          </p>

          {/* Primary controls */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {/* Skip prev */}
            {ep.supports.skip && (
              <NeoButton
                size="md"
                disabled={isOffline}
                onClick={() => dispatch({ type: 'SKIP_PREV', endpointId: ep.id })}
                icon={<SkipBack size={16} />}
              >
                Prev
              </NeoButton>
            )}

            {/* Play / Pause */}
            {ep.supports.playPause && (
              <NeoButton
                variant={isPlaying ? 'secondary' : 'primary'}
                size="lg"
                disabled={isOffline}
                onClick={() =>
                  dispatch({
                    type: isPlaying ? 'PAUSE_ENDPOINT' : 'PLAY_ENDPOINT',
                    endpointId: ep.id,
                  })
                }
                icon={isPlaying ? <Pause size={20} /> : <Play size={20} />}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </NeoButton>
            )}

            {/* Skip next */}
            {ep.supports.skip && (
              <NeoButton
                size="md"
                disabled={isOffline}
                onClick={() => dispatch({ type: 'SKIP_NEXT', endpointId: ep.id })}
                icon={<SkipForward size={16} />}
              >
                Next
              </NeoButton>
            )}
          </div>

          {/* Secondary controls */}
          <div className="flex flex-wrap gap-2">
            {ep.supports.restart && (
              <NeoButton
                size="sm"
                disabled={isOffline}
                onClick={() => dispatch({ type: 'RESTART_ENDPOINT', endpointId: ep.id })}
                icon={<RotateCcw size={14} />}
              >
                Restart
              </NeoButton>
            )}

            {ep.supports.loop && (
              <NeoToggle
                checked={ep.loop}
                onChange={() => dispatch({ type: 'TOGGLE_LOOP', endpointId: ep.id })}
                label="Loop"
              />
            )}
          </div>

          {/* Brightness slider */}
          {ep.supports.brightness && (
            <div className="mt-4">
              <div className="flex items-center gap-3 mb-1">
                <Sun size={14} className="text-neo-muted" />
                <span className="text-xs font-medium text-neo-muted">
                  Brightness {ep.brightness}%
                </span>
              </div>
              <div className="neo-surface shadow-neo-inner rounded-neo-pill h-3 relative overflow-hidden">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={ep.brightness}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_BRIGHTNESS',
                      endpointId: ep.id,
                      value: Number(e.target.value),
                    })
                  }
                  className="w-full h-full opacity-0 absolute inset-0 cursor-pointer"
                />
                <div
                  className="h-full bg-neo-accent rounded-neo-pill transition-all"
                  style={{ width: `${ep.brightness}%` }}
                />
              </div>
            </div>
          )}
        </NeoCard>

        {/* ── Media source actions ── */}
        <NeoCard>
          <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-3">
            Source
          </p>
          <div className="flex flex-wrap gap-2">
            {/* Swap Video (for single endpoints) */}
            {ep.type === 'single' && (
              <NeoButton
                size="sm"
                onClick={() => setSwapOpen(true)}
                icon={<Film size={14} />}
              >
                Swap Video
              </NeoButton>
            )}

            {/* Choose Playlist (for playlist endpoints) */}
            {ep.type === 'playlist' && (
              <NeoButton
                size="sm"
                onClick={() => setPlaylistOpen(true)}
                icon={<ListMusic size={14} />}
              >
                Choose Playlist
              </NeoButton>
            )}

            {/* Return to Default */}
            <NeoButton
              size="sm"
              onClick={() =>
                dispatch({ type: 'SET_AMBIENT', endpointId: ep.id })
              }
            >
              Return to Default
            </NeoButton>

            {/* Megalodon special: Run Investor Once */}
            {isMegalodon && (
              <NeoButton
                size="sm"
                variant="primary"
                onClick={() =>
                  dispatch({ type: 'RUN_INVESTOR_ONCE', endpointId: ep.id })
                }
              >
                Run Investor Once
              </NeoButton>
            )}
          </div>
        </NeoCard>
      </div>

      {/* ── Swap Asset Modal ── */}
      <BottomSheetModal
        isOpen={swapOpen}
        onClose={() => {
          setSwapOpen(false);
          setSearch('');
        }}
        title="Select Asset"
        snapHeight="full"
      >
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

        {/* Asset list */}
        <div className="space-y-2">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="flex items-center gap-3 p-3 rounded-neo-sm neo-surface shadow-neo-sm cursor-pointer hover:shadow-neo active:shadow-neo-pressed transition-shadow"
              onClick={() => {
                dispatch({
                  type: 'SWAP_ASSET',
                  endpointId: ep.id,
                  assetId: asset.id,
                });
                setSwapOpen(false);
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
              {ep.nowPlaying.assetId === asset.id && (
                <span className="text-xs font-bold text-neo-accent flex-shrink-0">
                  ✓ Current
                </span>
              )}
            </div>
          ))}
          {filteredAssets.length === 0 && (
            <p className="text-center text-neo-muted py-8">No assets found.</p>
          )}
        </div>
      </BottomSheetModal>

      {/* ── Choose Playlist Modal ── */}
      <BottomSheetModal
        isOpen={playlistOpen}
        onClose={() => setPlaylistOpen(false)}
        title="Select Playlist"
        snapHeight="auto"
      >
        <div className="space-y-2">
          {state.playlists.map((pl) => {
            const runtime = pl.items.reduce((sum, item) => {
              const a = state.assets.find((a) => a.id === item.assetId);
              return sum + (a?.durationSec ?? 0);
            }, 0);
            return (
              <div
                key={pl.id}
                className="flex items-center gap-3 p-3 rounded-neo-sm neo-surface shadow-neo-sm cursor-pointer hover:shadow-neo active:shadow-neo-pressed transition-shadow"
                onClick={() => {
                  dispatch({
                    type: 'CHOOSE_PLAYLIST',
                    endpointId: ep.id,
                    playlistId: pl.id,
                  });
                  setPlaylistOpen(false);
                }}
              >
                <div className="w-10 h-10 rounded-neo-sm flex-shrink-0 bg-neo-accent-light shadow-neo-inner flex items-center justify-center">
                  <ListMusic size={18} className="text-neo-accent" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-neo-text">{pl.name}</div>
                  <div className="text-xs text-neo-muted">
                    {pl.items.length} tracks · {formatDuration(runtime)}
                    {pl.loop ? ' · Loops' : ' · Once'}
                  </div>
                </div>
                {ep.nowPlaying.playlistId === pl.id && (
                  <span className="text-xs font-bold text-neo-accent flex-shrink-0">
                    ✓ Active
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </BottomSheetModal>
    </Layout>
  );
}
