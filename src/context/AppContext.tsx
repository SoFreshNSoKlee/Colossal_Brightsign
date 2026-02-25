import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type Dispatch,
} from 'react';
import type { AppState, AppAction, AuditLogEntry, Endpoint, NowPlaying } from '../types';
import {
  mockAssets,
  mockEndpoints,
  mockPlaylists,
  mockPresets,
  mockRooms,
  tourThemeAssets,
} from '../mock/data';

// ─── INITIAL STATE ─────────────────────────────────────────────────────────────

const initialState: AppState = {
  rooms: mockRooms,
  endpoints: mockEndpoints,
  assets: mockAssets,
  playlists: mockPlaylists,
  presets: mockPresets,
  auditLog: [],
  uiState: {
    activeFilters: [],
    theme: 'light',
    userRole: 'admin',
    syncGroups: {},
  },
};

// ─── HELPERS ───────────────────────────────────────────────────────────────────

function makeLog(
  state: AppState,
  action: string,
  targets: string[],
  details = '',
): AuditLogEntry {
  return {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: new Date().toISOString(),
    userRole: state.uiState.userRole,
    action,
    targets,
    details,
  };
}

function ambientNowPlaying(): NowPlaying {
  return {
    mode: 'playlist',
    playlistId: 'ambient',
    positionSec: 0,
    currentItemIndex: 0,
  };
}

function updateEndpoints(
  endpoints: Endpoint[],
  ids: string[],
  updater: (ep: Endpoint) => Partial<Endpoint>,
): Endpoint[] {
  return endpoints.map((ep) =>
    ids.includes(ep.id) ? { ...ep, ...updater(ep) } : ep,
  );
}

// ─── REDUCER ───────────────────────────────────────────────────────────────────

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // ── Playback controls ────────────────────────────────────────────────────

    case 'PLAY_ENDPOINT': {
      const ep = state.endpoints.find((e) => e.id === action.endpointId);
      if (!ep) return state;
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, [action.endpointId], () => ({
          status: 'playing',
        })),
        auditLog: [...state.auditLog, makeLog(state, 'Play', [ep.name])],
      };
    }

    case 'PAUSE_ENDPOINT': {
      const ep = state.endpoints.find((e) => e.id === action.endpointId);
      if (!ep) return state;
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, [action.endpointId], () => ({
          status: 'paused',
        })),
        auditLog: [...state.auditLog, makeLog(state, 'Pause', [ep.name])],
      };
    }

    case 'RESTART_ENDPOINT': {
      const ep = state.endpoints.find((e) => e.id === action.endpointId);
      if (!ep) return state;
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, [action.endpointId], (e) => ({
          status: 'playing',
          nowPlaying: { ...e.nowPlaying, positionSec: 0, currentItemIndex: 0 },
        })),
        auditLog: [...state.auditLog, makeLog(state, 'Restart', [ep.name])],
      };
    }

    case 'TOGGLE_LOOP': {
      const ep = state.endpoints.find((e) => e.id === action.endpointId);
      if (!ep) return state;
      const newLoop = !ep.loop;
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, [action.endpointId], () => ({
          loop: newLoop,
        })),
        auditLog: [
          ...state.auditLog,
          makeLog(state, newLoop ? 'Loop On' : 'Loop Off', [ep.name]),
        ],
      };
    }

    case 'SKIP_NEXT': {
      const ep = state.endpoints.find((e) => e.id === action.endpointId);
      if (!ep || ep.nowPlaying.mode !== 'playlist') return state;
      const playlist = state.playlists.find(
        (p) => p.id === ep.nowPlaying.playlistId,
      );
      if (!playlist) return state;
      const next =
        (ep.nowPlaying.currentItemIndex + 1) % playlist.items.length;
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, [action.endpointId], (e) => ({
          nowPlaying: {
            ...e.nowPlaying,
            currentItemIndex: next,
            positionSec: 0,
          },
        })),
        auditLog: [...state.auditLog, makeLog(state, 'Skip Next', [ep.name])],
      };
    }

    case 'SKIP_PREV': {
      const ep = state.endpoints.find((e) => e.id === action.endpointId);
      if (!ep || ep.nowPlaying.mode !== 'playlist') return state;
      const playlist = state.playlists.find(
        (p) => p.id === ep.nowPlaying.playlistId,
      );
      if (!playlist) return state;
      const prev =
        (ep.nowPlaying.currentItemIndex - 1 + playlist.items.length) %
        playlist.items.length;
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, [action.endpointId], (e) => ({
          nowPlaying: {
            ...e.nowPlaying,
            currentItemIndex: prev,
            positionSec: 0,
          },
        })),
        auditLog: [...state.auditLog, makeLog(state, 'Skip Prev', [ep.name])],
      };
    }

    // ── Asset / Playlist swaps ────────────────────────────────────────────────

    case 'SWAP_ASSET': {
      const ep = state.endpoints.find((e) => e.id === action.endpointId);
      const asset = state.assets.find((a) => a.id === action.assetId);
      if (!ep || !asset) return state;
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, [action.endpointId], () => ({
          status: 'playing',
          nowPlaying: {
            mode: 'asset',
            assetId: action.assetId,
            positionSec: 0,
            currentItemIndex: 0,
          },
        })),
        auditLog: [
          ...state.auditLog,
          makeLog(state, 'Swap Asset', [ep.name], `→ ${asset.title}`),
        ],
      };
    }

    case 'CHOOSE_PLAYLIST': {
      const ep = state.endpoints.find((e) => e.id === action.endpointId);
      const pl = state.playlists.find((p) => p.id === action.playlistId);
      if (!ep || !pl) return state;
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, [action.endpointId], () => ({
          status: 'playing',
          nowPlaying: {
            mode: 'playlist',
            playlistId: action.playlistId,
            positionSec: 0,
            currentItemIndex: 0,
          },
        })),
        auditLog: [
          ...state.auditLog,
          makeLog(state, 'Choose Playlist', [ep.name], `→ ${pl.name}`),
        ],
      };
    }

    // ── Sync group ────────────────────────────────────────────────────────────

    case 'TOGGLE_SYNC': {
      const current = state.uiState.syncGroups[action.groupId] ?? false;
      return {
        ...state,
        uiState: {
          ...state.uiState,
          syncGroups: {
            ...state.uiState.syncGroups,
            [action.groupId]: !current,
          },
        },
        auditLog: [
          ...state.auditLog,
          makeLog(
            state,
            !current ? 'Sync On' : 'Sync Off',
            [action.groupId],
          ),
        ],
      };
    }

    // ── Presets ────────────────────────────────────────────────────────────────

    case 'APPLY_PRESET': {
      const preset = state.presets.find((p) => p.id === action.presetId);
      if (!preset) return state;

      const changeIds = preset.changes.map((c) => c.endpointId);
      let endpoints = [...state.endpoints];

      preset.changes.forEach((change) => {
        endpoints = updateEndpoints(endpoints, [change.endpointId], () => ({
          status: change.status ?? 'playing',
          nowPlaying: {
            mode: change.mode,
            assetId: change.assetId,
            playlistId: change.playlistId,
            positionSec: 0,
            currentItemIndex: 0,
          },
        }));
      });

      const targetNames = changeIds
        .map((id) => state.endpoints.find((e) => e.id === id)?.name ?? id)
        .slice(0, 4)
        .join(', ');

      return {
        ...state,
        endpoints,
        auditLog: [
          ...state.auditLog,
          makeLog(state, `Apply Preset: ${preset.name}`, [targetNames]),
        ],
      };
    }

    // ── Set Ambient ────────────────────────────────────────────────────────────

    case 'SET_AMBIENT': {
      let ids: string[] = [];
      if (action.endpointId) {
        ids = [action.endpointId];
      } else if (action.roomId) {
        ids = state.endpoints
          .filter((ep) => ep.roomId === action.roomId)
          .map((ep) => ep.id);
      }
      const names = ids
        .map((id) => state.endpoints.find((e) => e.id === id)?.name ?? id)
        .join(', ');
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, ids, () => ({
          status: 'playing',
          nowPlaying: ambientNowPlaying(),
        })),
        auditLog: [...state.auditLog, makeLog(state, 'Set Ambient', [names])],
      };
    }

    // ── Return to Default ──────────────────────────────────────────────────────

    case 'RETURN_TO_DEFAULT': {
      let ids: string[] = [];
      if (action.endpointId) {
        ids = [action.endpointId];
      } else if (action.roomId) {
        ids = state.endpoints
          .filter((ep) => ep.roomId === action.roomId)
          .map((ep) => ep.id);
      }
      const names = ids
        .map((id) => state.endpoints.find((e) => e.id === id)?.name ?? id)
        .join(', ');
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, ids, () => ({
          status: 'playing',
          nowPlaying: ambientNowPlaying(),
        })),
        auditLog: [
          ...state.auditLog,
          makeLog(state, 'Return to Default', [names]),
        ],
      };
    }

    // ── Run Investor Once (Megalodon special) ──────────────────────────────────

    case 'RUN_INVESTOR_ONCE': {
      const ep = state.endpoints.find((e) => e.id === action.endpointId);
      if (!ep) return state;
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, [action.endpointId], () => ({
          status: 'playing',
          loop: false,
          nowPlaying: {
            mode: 'playlist',
            playlistId: 'investor',
            positionSec: 0,
            currentItemIndex: 0,
          },
        })),
        auditLog: [
          ...state.auditLog,
          makeLog(state, 'Run Investor Once', [ep.name]),
        ],
      };
    }

    // ── Playlist editing ───────────────────────────────────────────────────────

    case 'REORDER_PLAYLIST': {
      const playlists = state.playlists.map((pl) => {
        if (pl.id !== action.playlistId) return pl;
        const items = [...pl.items];
        const [moved] = items.splice(action.fromIdx, 1);
        items.splice(action.toIdx, 0, moved);
        return { ...pl, items: items.map((it, i) => ({ ...it, order: i })) };
      });
      return {
        ...state,
        playlists,
        auditLog: [
          ...state.auditLog,
          makeLog(state, 'Reorder Playlist', [action.playlistId]),
        ],
      };
    }

    case 'ADD_PLAYLIST_ITEM': {
      const asset = state.assets.find((a) => a.id === action.assetId);
      const playlists = state.playlists.map((pl) => {
        if (pl.id !== action.playlistId) return pl;
        const already = pl.items.some((i) => i.assetId === action.assetId);
        if (already) return pl;
        return {
          ...pl,
          items: [...pl.items, { assetId: action.assetId, order: pl.items.length }],
        };
      });
      return {
        ...state,
        playlists,
        auditLog: [
          ...state.auditLog,
          makeLog(
            state,
            'Add to Playlist',
            [action.playlistId],
            asset?.title ?? action.assetId,
          ),
        ],
      };
    }

    case 'REMOVE_PLAYLIST_ITEM': {
      const playlists = state.playlists.map((pl) => {
        if (pl.id !== action.playlistId) return pl;
        const items = pl.items
          .filter((i) => i.assetId !== action.assetId)
          .map((it, i) => ({ ...it, order: i }));
        return { ...pl, items };
      });
      return {
        ...state,
        playlists,
        auditLog: [
          ...state.auditLog,
          makeLog(state, 'Remove from Playlist', [action.playlistId]),
        ],
      };
    }

    // ── Tour Path Theme ────────────────────────────────────────────────────────

    case 'SET_TOUR_THEME': {
      const assetId = tourThemeAssets[action.theme];
      if (!assetId) return state;
      const tourIds = state.endpoints
        .filter((ep) => ep.roomId === 'tour-path')
        .map((ep) => ep.id);
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, tourIds, () => ({
          status: 'playing',
          nowPlaying: {
            mode: 'asset',
            assetId,
            positionSec: 0,
            currentItemIndex: 0,
          },
        })),
        auditLog: [
          ...state.auditLog,
          makeLog(state, `Tour Theme: ${action.theme}`, ['Tour Path']),
        ],
      };
    }

    // ── Brightness ─────────────────────────────────────────────────────────────

    case 'SET_BRIGHTNESS': {
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, [action.endpointId], () => ({
          brightness: action.value,
        })),
      };
    }

    // ── UI state ───────────────────────────────────────────────────────────────

    case 'SET_USER_ROLE':
      return {
        ...state,
        uiState: { ...state.uiState, userRole: action.role },
      };

    case 'TOGGLE_THEME':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          theme: state.uiState.theme === 'light' ? 'dark' : 'light',
        },
      };

    case 'SET_FILTER':
      return {
        ...state,
        uiState: { ...state.uiState, activeFilters: action.filters },
      };

    default:
      return state;
  }
}

// ─── CONTEXT & PROVIDER ────────────────────────────────────────────────────────

interface AppContextType {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'brightside-controller-state';

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as AppState;
  } catch {
    // ignore
  }
  return initialState;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
