import { useNavigate } from 'react-router-dom';
import {
  MonitorPlay,
  WifiOff,
  Monitor,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { NeoCard } from '../components/design-system/NeoCard';
import { StatusBadge } from '../components/design-system/StatusBadge';
import { useApp } from '../context/AppContext';
import type { Room } from '../types';

const ROOM_ICONS: Record<string, string> = {
  lobby: '🏛️',
  'automation-suite': '🤖',
  'megalodon-room': '🦈',
  'social-den': '🛋️',
  'tour-path': '🚶',
};

function RoomCard({ room }: { room: Room }) {
  const { state } = useApp();
  const navigate = useNavigate();

  const endpoints = state.endpoints.filter((ep) =>
    room.endpointIds.includes(ep.id),
  );
  const playlists = state.playlists.filter((pl) => pl.roomId === room.id);
  const playing = endpoints.filter((ep) => ep.status === 'playing').length;
  const paused = endpoints.filter((ep) => ep.status === 'paused').length;
  const offline = endpoints.filter((ep) => ep.status === 'offline').length;

  // Derive active playlist name from first endpoint
  const activePlaylistId = endpoints[0]?.nowPlaying.playlistId;
  const activePlaylist = activePlaylistId
    ? state.playlists.find((pl) => pl.id === activePlaylistId)
    : null;

  const overallVariant =
    offline === endpoints.length
      ? 'error'
      : playing > 0
        ? 'success'
        : 'warning';

  return (
    <NeoCard onClick={() => navigate(`/room/${room.id}`)} className="flex flex-col gap-3">
      {/* Icon + name */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-3xl mb-1 select-none">
            {ROOM_ICONS[room.id] ?? '📺'}
          </div>
          <h2 className="text-base font-bold text-neo-text leading-tight">
            {room.name}
          </h2>
          <p className="text-xs text-neo-muted mt-0.5">
            {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="w-8 h-8 rounded-neo-pill neo-surface shadow-neo-sm flex items-center justify-center flex-shrink-0 mt-1">
          <ChevronRight size={14} className="text-neo-muted" />
        </div>
      </div>

      {/* Now playing label */}
      {activePlaylist && (
        <p className="text-xs text-neo-muted truncate">
          ▶ {activePlaylist.name}
        </p>
      )}

      {/* Status row */}
      <div className="flex flex-wrap gap-1.5">
        <StatusBadge variant={overallVariant} dot={false}>
          {playing > 0 && (
            <span className="flex items-center gap-1">
              <MonitorPlay size={11} />
              {playing}
            </span>
          )}
          {paused > 0 && playing === 0 && (
            <span className="flex items-center gap-1">
              <Monitor size={11} />
              {paused} paused
            </span>
          )}
          {offline === endpoints.length && (
            <span className="flex items-center gap-1">
              <WifiOff size={11} />
              Offline
            </span>
          )}
          {playing > 0 && ` playing`}
        </StatusBadge>

        {offline > 0 && offline < endpoints.length && (
          <StatusBadge variant="error" dot={false}>
            <WifiOff size={11} />
            {offline} offline
          </StatusBadge>
        )}
        {paused > 0 && playing > 0 && (
          <StatusBadge variant="warning" dot={false}>
            {paused} paused
          </StatusBadge>
        )}
      </div>
    </NeoCard>
  );
}

export function Home() {
  const { state } = useApp();

  return (
    <Layout>
      {/* Override notice */}
      <div className="px-2 pt-2 pb-3">
        <div className="flex items-start gap-2.5 p-3 rounded-neo-sm bg-neo-accent-light border border-neo-accent/20">
          <Info size={14} className="text-neo-accent flex-shrink-0 mt-0.5" />
          <p className="text-xs text-neo-accent leading-relaxed">
            Changes made in this app will override any currently scheduled or
            running playlists on the selected screens.
          </p>
        </div>
      </div>

      {/* Section label */}
      <div className="px-3 pb-3">
        <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest">
          All Rooms
        </p>
      </div>

      {/* Room grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 px-2">
        {state.rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </Layout>
  );
}
