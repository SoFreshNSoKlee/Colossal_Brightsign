import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ListMusic, Play, Pencil, Monitor } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { NeoCard } from '../components/design-system/NeoCard';
import { NeoButton } from '../components/design-system/NeoButton';
import { BottomSheetModal } from '../components/design-system/BottomSheetModal';
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

  const [newPlaylistOpen, setNewPlaylistOpen] = useState(false);
  const [plName, setPlName] = useState('');
  const [plLoop, setPlLoop] = useState(true);

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
  const roomPlaylists = state.playlists.filter((pl) => pl.roomId === room.id);
  const screenCount = ROOM_SCREEN_COUNT[room.id] ?? endpoints.length;

  // Derive the currently active playlist from the first endpoint
  const activePlaylistId = endpoints[0]?.nowPlaying.playlistId;

  // Overall room status
  const allPlaying = endpoints.every((ep) => ep.status === 'playing');
  const allOffline = endpoints.every((ep) => ep.status === 'offline');
  const roomStatus = allOffline ? 'offline' : allPlaying ? 'playing' : 'paused';
  const statusVariant = allOffline ? 'error' : allPlaying ? 'success' : 'warning';

  const openNewPlaylist = () => {
    setPlName('');
    setPlLoop(true);
    setNewPlaylistOpen(true);
  };

  const createPlaylist = () => {
    if (!plName.trim()) return;
    dispatch({
      type: 'CREATE_PLAYLIST',
      name: plName.trim(),
      roomId: room.id,
      loop: plLoop,
    });
    setNewPlaylistOpen(false);
  };

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

        {/* ── Endpoints ── */}
        <div>
          <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-2 px-1">
            Endpoints ({endpoints.length})
          </p>
          <div className="space-y-2">
            {endpoints.map((ep) => (
              <NeoCard
                key={ep.id}
                padding="sm"
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate(`/endpoint/${ep.id}`)}
              >
                <div className="w-9 h-9 rounded-neo-sm flex-shrink-0 bg-neo-accent-light shadow-neo-inner flex items-center justify-center">
                  <Monitor size={16} className="text-neo-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-neo-text truncate">{ep.name}</div>
                  <div className="text-xs text-neo-muted mt-0.5">
                    {ep.aspectRatio} · {ep.status}
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-neo-pill bg-neo-accent-light text-neo-accent font-semibold flex-shrink-0">
                  {ep.aspectRatio}
                </span>
              </NeoCard>
            ))}
          </div>
        </div>

        {/* ── Playlists ── */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest">
              Playlists ({roomPlaylists.length})
            </p>
            <NeoButton
              size="sm"
              variant="primary"
              onClick={openNewPlaylist}
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

                return (
                  <NeoCard
                    key={pl.id}
                    className={[
                      'flex items-center gap-3',
                      isActive ? 'ring-2 ring-neo-accent/40' : '',
                    ].join(' ')}
                    padding="sm"
                  >
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
                      {/* Play on all screens */}
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
                      {/* Edit */}
                      <button
                        onClick={() => navigate(`/playlists/${pl.id}/edit`)}
                        className="w-8 h-8 rounded-neo-pill neo-surface shadow-neo-sm flex items-center justify-center text-neo-muted hover:text-neo-accent transition-colors"
                        title="Edit playlist"
                      >
                        <Pencil size={13} />
                      </button>
                    </div>
                  </NeoCard>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── New Playlist Modal ── */}
      <BottomSheetModal
        isOpen={newPlaylistOpen}
        onClose={() => setNewPlaylistOpen(false)}
        title="New Playlist"
        snapHeight="auto"
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

          <p className="text-xs text-neo-muted">
            Assets can be added per endpoint after creation from the playlist editor.
          </p>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <NeoButton variant="secondary" fullWidth onClick={() => setNewPlaylistOpen(false)}>
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
