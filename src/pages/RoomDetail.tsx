import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { NeoCard } from '../components/design-system/NeoCard';
import { NeoButton } from '../components/design-system/NeoButton';
import { NeoToggle } from '../components/design-system/NeoToggle';
import { StatusBadge, statusVariantFromEndpoint } from '../components/design-system/StatusBadge';
import { useApp } from '../context/AppContext';

const TOUR_THEMES = ['Thylacine', 'Dodo', 'Mammoth'] as const;

export function RoomDetail() {
  const { roomId } = useParams<{ roomId: string }>();
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

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
    </Layout>
  );
}
