import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ListMusic, Play, Pencil, Monitor, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { NeoCard } from '../components/design-system/NeoCard';
import { NeoButton } from '../components/design-system/NeoButton';
import { StatusBadge } from '../components/design-system/StatusBadge';
import { useApp } from '../context/AppContext';
import { ROOM_SCREEN_COUNT } from '../mock/data';

function formatDuration(sec: number): string {
  if (sec >= 3600) return `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`;
  if (sec >= 60) return `${Math.floor(sec / 60)}m`;
  return `${sec}s`;
}

export function RoomDetail() {
  const { roomId } = useParams<{ roomId: string }>();
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const [expandedPlaylists, setExpandedPlaylists] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  const togglePlaylistExpand = (playlistId: string) => {
    setExpandedPlaylists((prev) => {
      const next = new Set(prev);
      if (next.has(playlistId)) next.delete(playlistId); else next.add(playlistId);
      return next;
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const room = state.rooms.find((r) => r.id === roomId);
  if (!room) {
    return (
      <Layout>
        <div className="p-6 text-neo-muted">Room not found.</div>
      </Layout>
    );
  }

  const endpoints = state.endpoints.filter((ep) => room.endpointIds.includes(ep.id));
  const roomPlaylists = state.playlists.filter((pl) => pl.roomId === room.id);
  const screenCount = ROOM_SCREEN_COUNT[room.id] ?? endpoints.length;

  const activePlaylistId = endpoints[0]?.nowPlaying.playlistId;

  const allPlaying = endpoints.every((ep) => ep.status === 'playing');
  const allOffline = endpoints.every((ep) => ep.status === 'offline');
  const roomStatus = allOffline ? 'offline' : allPlaying ? 'playing' : 'paused';
  const statusVariant = allOffline ? 'error' : allPlaying ? 'success' : 'warning';

  return (
    <Layout title={room.name}>
      <div className="space-y-4 px-2 pt-2">
        {/* ── Room status header ── */}
        <NeoCard padding="sm" className="flex items-center gap-3">
          <StatusBadge variant={statusVariant}>
            {roomStatus}
          </StatusBadge>
          <span className="text-xs text-neo-muted">
            {screenCount} screen{screenCount !== 1 ? 's' : ''}
          </span>
        </NeoCard>

        {/* ── Playlists section ── */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest">
              Playlists ({roomPlaylists.length})
            </p>
            <NeoButton
              size="sm"
              variant="primary"
              onClick={() => navigate(`/playlists/new?roomId=${room.id}`)}
              icon={<Plus size={13} />}
            >
              New
            </NeoButton>
          </div>

          {roomPlaylists.length === 0 ? (
            <NeoCard className="py-10 text-center">
              <p className="text-neo-muted">No playlists yet.</p>
              <p className="text-xs text-neo-muted mt-1">Tap "New" to create one.</p>
            </NeoCard>
          ) : (
            <div className="space-y-2.5">
              {roomPlaylists.map((pl) => {
                const runtime = pl.items.reduce((sum, item) => {
                  const a = state.assets.find((a) => a.id === item.assetId);
                  return sum + (a?.durationSec ?? 0);
                }, 0);
                const isActive = pl.id === activePlaylistId;
                const isExpanded = expandedPlaylists.has(pl.id);

                // Group assets by endpoint for expanded view
                const byEndpoint = endpoints
                  .map((ep) => {
                    const epItems = pl.items
                      .filter((i) => i.endpointId === ep.id)
                      .sort((a, b) => a.order - b.order)
                      .map((i) => state.assets.find((a) => a.id === i.assetId))
                      .filter((a): a is NonNullable<typeof a> => a !== undefined);
                    return { endpoint: ep, assets: epItems };
                  })
                  .filter(({ assets }) => assets.length > 0);

                return (
                  <NeoCard
                    key={pl.id}
                    className={isActive ? 'ring-2 ring-neo-accent/40' : ''}
                    padding="sm"
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div
                        className={[
                          'w-10 h-10 rounded-neo-sm flex-shrink-0 shadow-neo-inner flex items-center justify-center',
                          isActive ? 'bg-neo-accent' : 'bg-neo-accent-light',
                        ].join(' ')}
                      >
                        <ListMusic
                          size={18}
                          className={isActive ? 'text-white' : 'text-neo-accent'}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-neo-text truncate">
                            {pl.name}
                          </span>
                          {isActive && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-neo-pill bg-neo-accent text-white font-semibold flex-shrink-0">
                              Now Playing
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-neo-muted mt-0.5">
                          {pl.items.length} tracks · {formatDuration(runtime)}
                          <span
                            className={[
                              'ml-1.5 text-[10px] px-1.5 py-0.5 rounded-neo-pill font-semibold',
                              pl.loop
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700',
                            ].join(' ')}
                          >
                            {pl.loop ? 'Loop' : 'Once'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => togglePlaylistExpand(pl.id)}
                          className="w-8 h-8 rounded-neo-pill neo-surface shadow-neo-sm flex items-center justify-center text-neo-muted hover:text-neo-accent transition-colors"
                          title={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                        <button
                          onClick={() =>
                            dispatch({
                              type: 'SET_ROOM_PLAYLIST',
                              roomId: room.id,
                              playlistId: pl.id,
                            })
                          }
                          className={[
                            'w-8 h-8 rounded-neo-pill flex items-center justify-center transition-colors',
                            isActive
                              ? 'bg-neo-accent text-white shadow-neo-sm'
                              : 'neo-surface shadow-neo-sm text-neo-muted hover:text-neo-accent',
                          ].join(' ')}
                          title={`Play on all ${screenCount} screen${screenCount !== 1 ? 's' : ''}`}
                        >
                          <Play size={13} />
                        </button>
                        <button
                          onClick={() => navigate(`/playlists/${pl.id}/edit`)}
                          className="w-8 h-8 rounded-neo-pill neo-surface shadow-neo-sm flex items-center justify-center text-neo-muted hover:text-neo-accent transition-colors"
                          title="Edit playlist"
                        >
                          <Pencil size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded: assets grouped by endpoint */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-neo-dark/10 space-y-3">
                        {byEndpoint.length === 0 ? (
                          <p className="text-xs text-neo-muted text-center py-2">No assets in this playlist.</p>
                        ) : (
                          byEndpoint.map(({ endpoint, assets }) => (
                            <div key={endpoint.id}>
                              <div className="flex items-center gap-1.5 mb-1.5 px-1">
                                <Monitor size={11} className="text-neo-muted flex-shrink-0" />
                                <span className="text-[10px] font-semibold text-neo-muted uppercase tracking-wider">
                                  {endpoint.name}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-neo-pill bg-neo-accent-light text-neo-accent font-semibold">
                                  {endpoint.aspectRatio}
                                </span>
                              </div>
                              <div className="space-y-1">
                                {assets.map((asset, idx) => (
                                  <div key={asset.id} className="flex items-center gap-2.5 px-1">
                                    <span className="text-[10px] text-neo-muted w-4 text-right flex-shrink-0">{idx + 1}</span>
                                    <div
                                      className="w-7 h-6 rounded-neo-sm flex-shrink-0 shadow-neo-inner"
                                      style={{ backgroundColor: asset.color }}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="text-xs font-semibold text-neo-text truncate">{asset.title}</div>
                                    </div>
                                    <div className="text-[10px] text-neo-muted flex-shrink-0">{formatDuration(asset.durationSec)}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </NeoCard>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Endpoints section ── */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest">
              Endpoints ({endpoints.length})
            </p>
            <button
              onClick={handleRefresh}
              className="w-7 h-7 rounded-neo-pill neo-surface shadow-neo-sm flex items-center justify-center text-neo-muted hover:text-neo-accent transition-colors"
              title="Refresh endpoints"
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>
          <div className="space-y-2">
            {endpoints.map((ep) => {
              const epStatusVariant =
                ep.status === 'playing' ? 'success' :
                ep.status === 'paused' ? 'warning' : 'error';
              const nowPlayingLabel =
                ep.nowPlaying.mode === 'playlist'
                  ? state.playlists.find((pl) => pl.id === ep.nowPlaying.playlistId)?.name
                  : state.assets.find((a) => a.id === ep.nowPlaying.assetId)?.title;

              return (
                <NeoCard
                  key={ep.id}
                  padding="sm"
                  className="flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-neo-sm flex-shrink-0 bg-neo-accent-light shadow-neo-inner flex items-center justify-center">
                    <Monitor size={16} className="text-neo-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-neo-text truncate">{ep.name}</div>
                    <div className="text-xs text-neo-muted mt-0.5 flex items-center gap-1.5">
                      <span>{ep.aspectRatio}</span>
                      {nowPlayingLabel && (
                        <>
                          <span>·</span>
                          <span className="truncate">{nowPlayingLabel}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <StatusBadge variant={epStatusVariant}>
                    {ep.status}
                  </StatusBadge>
                </NeoCard>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
