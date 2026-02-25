import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type Dispatch,
} from 'react';
import type { AppState, AppAction, Endpoint, RoomId, Asset } from '../types';
import {
  mockAssets,
  mockEndpoints,
  mockPlaylists,
  mockPresets,
  mockRooms,
} from '../mock/data';

// ─── INITIAL STATE ─────────────────────────────────────────────────────────────

const initialState: AppState = {
  rooms: mockRooms,
  endpoints: mockEndpoints,
  assets: mockAssets,
  playlists: mockPlaylists,
  presets: mockPresets,
  uiState: {
    activeFilters: [],
    theme: 'dark',
    syncGroups: {},
  },
};

// ─── HELPERS ───────────────────────────────────────────────────────────────────

function getDefaultPlaylistId(state: AppState, roomId: RoomId): string {
  const pl = state.playlists.find((p) => p.roomId === roomId);
  return pl?.id ?? '';
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

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── REDUCER ───────────────────────────────────────────────────────────────────

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // ── Playback controls ────────────────────────────────────────────────────

    case 'PLAY_ENDPOINT': {
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, [action.endpointId], () => ({
          status: 'playing',
        })),
      };
    }

    case 'PAUSE_ENDPOINT': {
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, [action.endpointId], () => ({
          status: 'paused',
        })),
      };
    }

    case 'RESTART_ENDPOINT': {
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, [action.endpointId], (e) => ({
          status: 'playing',
          nowPlaying: { ...e.nowPlaying, positionSec: 0, currentItemIndex: 0 },
        })),
      };
    }

    case 'TOGGLE_LOOP': {
      const ep = state.endpoints.find((e) => e.id === action.endpointId);
      if (!ep) return state;
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, [action.endpointId], () => ({
          loop: !ep.loop,
        })),
      };
    }

    case 'SKIP_NEXT': {
      const ep = state.endpoints.find((e) => e.id === action.endpointId);
      if (!ep || ep.nowPlaying.mode !== 'playlist') return state;
      const playlist = state.playlists.find(
        (p) => p.id === ep.nowPlaying.playlistId,
      );
      if (!playlist) return state;
      // Filter items for this specific endpoint
      const epItems = playlist.items.filter((i) => i.endpointId === action.endpointId);
      if (epItems.length === 0) return state;
      const next = (ep.nowPlaying.currentItemIndex + 1) % epItems.length;
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, [action.endpointId], (e) => ({
          nowPlaying: { ...e.nowPlaying, currentItemIndex: next, positionSec: 0 },
        })),
      };
    }

    case 'SKIP_PREV': {
      const ep = state.endpoints.find((e) => e.id === action.endpointId);
      if (!ep || ep.nowPlaying.mode !== 'playlist') return state;
      const playlist = state.playlists.find(
        (p) => p.id === ep.nowPlaying.playlistId,
      );
      if (!playlist) return state;
      // Filter items for this specific endpoint
      const epItems = playlist.items.filter((i) => i.endpointId === action.endpointId);
      if (epItems.length === 0) return state;
      const prev =
        (ep.nowPlaying.currentItemIndex - 1 + epItems.length) % epItems.length;
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, [action.endpointId], (e) => ({
          nowPlaying: { ...e.nowPlaying, currentItemIndex: prev, positionSec: 0 },
        })),
      };
    }

    // ── Asset / Playlist swaps ────────────────────────────────────────────────

    case 'SWAP_ASSET': {
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
      };
    }

    case 'CHOOSE_PLAYLIST': {
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
      };
    }

    // ── Set playlist for entire room ───────────────────────────────────────────

    case 'SET_ROOM_PLAYLIST': {
      const ids = state.endpoints
        .filter((ep) => ep.roomId === action.roomId)
        .map((ep) => ep.id);
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, ids, () => ({
          status: 'playing',
          nowPlaying: {
            mode: 'playlist',
            playlistId: action.playlistId,
            positionSec: 0,
            currentItemIndex: 0,
          },
        })),
      };
    }

    // ── Sync group (kept for compatibility) ───────────────────────────────────

    case 'TOGGLE_SYNC': {
      const current = state.uiState.syncGroups[action.groupId] ?? false;
      return {
        ...state,
        uiState: {
          ...state.uiState,
          syncGroups: { ...state.uiState.syncGroups, [action.groupId]: !current },
        },
      };
    }

    // ── Presets ────────────────────────────────────────────────────────────────

    case 'APPLY_PRESET': {
      const preset = state.presets.find((p) => p.id === action.presetId);
      if (!preset) return state;
      let endpoints = [...state.endpoints];
      preset.changes.forEach((change) => {
        const effectivePlaylistId = change.playlistIds?.[0] ?? change.playlistId;
        const effectiveAssetId = change.assetIds?.[0] ?? change.assetId;
        endpoints = updateEndpoints(endpoints, [change.endpointId], () => ({
          status: change.status ?? 'playing',
          nowPlaying: {
            mode: change.mode,
            assetId: effectiveAssetId,
            playlistId: effectivePlaylistId,
            positionSec: 0,
            currentItemIndex: 0,
          },
        }));
      });
      return { ...state, endpoints };
    }

    // ── Set Default (formerly Set Ambient) ────────────────────────────────────

    case 'SET_AMBIENT': {
      let ids: string[] = [];
      let roomId: string | undefined = action.roomId;
      if (action.endpointId) {
        const ep = state.endpoints.find((e) => e.id === action.endpointId);
        if (ep) { ids = [action.endpointId]; roomId = ep.roomId; }
      } else if (action.roomId) {
        ids = state.endpoints
          .filter((ep) => ep.roomId === action.roomId)
          .map((ep) => ep.id);
      }
      const playlistId = roomId ? getDefaultPlaylistId(state, roomId) : '';
      if (!playlistId) return state;
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, ids, () => ({
          status: 'playing',
          nowPlaying: { mode: 'playlist', playlistId, positionSec: 0, currentItemIndex: 0 },
        })),
      };
    }

    case 'RETURN_TO_DEFAULT': {
      let ids: string[] = [];
      let roomId: string | undefined = action.roomId;
      if (action.endpointId) {
        const ep = state.endpoints.find((e) => e.id === action.endpointId);
        if (ep) { ids = [action.endpointId]; roomId = ep.roomId; }
      } else if (action.roomId) {
        ids = state.endpoints
          .filter((ep) => ep.roomId === action.roomId)
          .map((ep) => ep.id);
      }
      const playlistId = roomId ? getDefaultPlaylistId(state, roomId) : '';
      if (!playlistId) return state;
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, ids, () => ({
          status: 'playing',
          nowPlaying: { mode: 'playlist', playlistId, positionSec: 0, currentItemIndex: 0 },
        })),
      };
    }

    // ── Run Investor Once (Megalodon shortcut) ─────────────────────────────────

    case 'RUN_INVESTOR_ONCE': {
      const ep = state.endpoints.find((e) => e.id === action.endpointId);
      if (!ep) return state;
      const megaIds = state.endpoints
        .filter((e) => e.roomId === 'megalodon-room')
        .map((e) => e.id);
      return {
        ...state,
        endpoints: updateEndpoints(state.endpoints, megaIds, () => ({
          status: 'playing',
          loop: false,
          nowPlaying: {
            mode: 'playlist',
            playlistId: 'mega-investor-story',
            positionSec: 0,
            currentItemIndex: 0,
          },
        })),
      };
    }

    // ── Playlist editing ───────────────────────────────────────────────────────

    case 'REORDER_PLAYLIST': {
      const playlists = state.playlists.map((pl) => {
        if (pl.id !== action.playlistId) return pl;
        // Get and sort items for this endpoint
        const epItems = pl.items
          .filter((i) => i.endpointId === action.endpointId)
          .sort((a, b) => a.order - b.order);
        // Reorder within this endpoint's items
        const [moved] = epItems.splice(action.fromIdx, 1);
        epItems.splice(action.toIdx, 0, moved);
        // Reassign orders for this endpoint's items
        const reorderedEpItems = epItems.map((it, i) => ({ ...it, order: i }));
        // Merge back with other endpoints' items
        const otherItems = pl.items.filter((i) => i.endpointId !== action.endpointId);
        return { ...pl, items: [...otherItems, ...reorderedEpItems] };
      });
      return { ...state, playlists };
    }

    case 'ADD_PLAYLIST_ITEM': {
      const playlists = state.playlists.map((pl) => {
        if (pl.id !== action.playlistId) return pl;
        // Check for duplicate within this endpoint's items
        const already = pl.items.some(
          (i) => i.endpointId === action.endpointId && i.assetId === action.assetId,
        );
        if (already) return pl;
        // Order is the count of existing items for this endpoint
        const epItemCount = pl.items.filter((i) => i.endpointId === action.endpointId).length;
        return {
          ...pl,
          items: [
            ...pl.items,
            { endpointId: action.endpointId, assetId: action.assetId, order: epItemCount },
          ],
        };
      });
      return { ...state, playlists };
    }

    case 'REMOVE_PLAYLIST_ITEM': {
      const playlists = state.playlists.map((pl) => {
        if (pl.id !== action.playlistId) return pl;
        // Remove the specific endpoint+asset pair
        const filtered = pl.items.filter(
          (i) => !(i.endpointId === action.endpointId && i.assetId === action.assetId),
        );
        // Re-index orders for the affected endpoint's remaining items
        const otherItems = filtered.filter((i) => i.endpointId !== action.endpointId);
        const epItems = filtered
          .filter((i) => i.endpointId === action.endpointId)
          .sort((a, b) => a.order - b.order)
          .map((it, i) => ({ ...it, order: i }));
        return { ...pl, items: [...otherItems, ...epItems] };
      });
      return { ...state, playlists };
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

    // ── Asset CRUD ─────────────────────────────────────────────────────────────

    case 'CREATE_ASSET': {
      const newAsset: Asset = {
        ...action.asset,
        id: action.asset.id ?? makeId('asset'),
        updatedAt: action.asset.updatedAt ?? new Date().toISOString(),
      };
      return { ...state, assets: [...state.assets, newAsset] };
    }

    case 'UPDATE_ASSET': {
      const assets = state.assets.map((a) =>
        a.id === action.assetId
          ? { ...a, ...action.updates, updatedAt: new Date().toISOString() }
          : a,
      );
      return { ...state, assets };
    }

    case 'DELETE_ASSET': {
      return {
        ...state,
        assets: state.assets.filter((a) => a.id !== action.assetId),
        playlists: state.playlists.map((pl) => ({
          ...pl,
          items: pl.items
            .filter((i) => i.assetId !== action.assetId)
            .map((it, idx) => ({ ...it, order: idx })),
        })),
      };
    }

    // ── Playlist CRUD ──────────────────────────────────────────────────────────

    case 'CREATE_PLAYLIST': {
      const newPlaylist = {
        id: makeId('playlist'),
        name: action.name,
        roomId: action.roomId,
        loop: action.loop,
        items: action.items ?? [],
        ...(action.nextPlaylistId !== undefined && { nextPlaylistId: action.nextPlaylistId }),
      };
      return { ...state, playlists: [...state.playlists, newPlaylist] };
    }

    case 'UPDATE_PLAYLIST_META': {
      const playlists = state.playlists.map((pl) => {
        if (pl.id !== action.playlistId) return pl;
        const updated = { ...pl, name: action.name, loop: action.loop };
        if (action.nextPlaylistId !== undefined) {
          updated.nextPlaylistId = action.nextPlaylistId || undefined;
        } else {
          delete updated.nextPlaylistId;
        }
        return updated;
      });
      return { ...state, playlists };
    }

    case 'DELETE_PLAYLIST': {
      return {
        ...state,
        playlists: state.playlists.filter((pl) => pl.id !== action.playlistId),
      };
    }

    // ── Preset CRUD ────────────────────────────────────────────────────────────

    case 'CREATE_PRESET': {
      const newPreset = { ...action.preset, id: makeId('preset') };
      return { ...state, presets: [...state.presets, newPreset] };
    }

    case 'UPDATE_PRESET': {
      const presets = state.presets.map((p) =>
        p.id === action.presetId ? { ...p, ...action.updates } : p,
      );
      return { ...state, presets };
    }

    case 'DELETE_PRESET': {
      return {
        ...state,
        presets: state.presets.filter((p) => p.id !== action.presetId),
      };
    }

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

const STORAGE_KEY = 'colossal-hq-controller-state';
const DATA_VERSION = 2;

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as AppState & { _version?: number };
      // Version bump forces a reset of data while preserving UI prefs
      if ((parsed._version ?? 0) < DATA_VERSION) {
        return { ...initialState, uiState: parsed.uiState ?? initialState.uiState };
      }
      const hasAspectRatio = parsed.endpoints?.every((ep) => 'aspectRatio' in ep);
      const hasEndpointId = parsed.assets?.every((a) => 'endpointId' in a);
      const hasItemEndpointId = parsed.playlists?.every((pl) =>
        pl.items.every((item) => 'endpointId' in item),
      );
      if (!hasAspectRatio || !hasEndpointId || !hasItemEndpointId) {
        return initialState;
      }
      if (!parsed.uiState.syncGroups) parsed.uiState.syncGroups = {};
      return parsed;
    }
  } catch {
    // ignore
  }
  return initialState;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, _version: DATA_VERSION }));
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
