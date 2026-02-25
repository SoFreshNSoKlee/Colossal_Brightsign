export type RoomId = string;
export type EndpointId = string;
export type AssetId = string;
export type PlaylistId = string;

export interface Room {
  id: RoomId;
  name: string;
  endpointIds: EndpointId[];
}

export interface NowPlaying {
  mode: 'asset' | 'playlist';
  assetId?: AssetId;
  playlistId?: PlaylistId;
  positionSec: number;
  currentItemIndex: number;
}

export interface EndpointSupports {
  playPause: boolean;
  restart: boolean;
  loop: boolean;
  skip: boolean;
  brightness: boolean;
}

export interface Endpoint {
  id: EndpointId;
  name: string;
  roomId: RoomId;
  aspectRatio: string; // Fixed, predefined aspect ratio for this endpoint
  type: 'single' | 'playlist';
  status: 'playing' | 'paused' | 'offline';
  syncGroupId?: string;
  defaultMode: 'ambient';
  nowPlaying: NowPlaying;
  supports: EndpointSupports;
  loop: boolean;
  brightness: number;
}

export interface Asset {
  id: AssetId;
  endpointId: EndpointId; // Every asset is assigned to a specific endpoint
  title: string;
  tags: string[];
  durationSec: number;
  aspect: string; // Derived from the assigned endpoint's aspectRatio
  updatedAt: string;
  color: string;
}

export interface PlaylistItem {
  endpointId: EndpointId; // Which endpoint this item belongs to
  assetId: AssetId;
  order: number; // Order within this endpoint's asset list in the playlist
}

export interface Playlist {
  id: PlaylistId;
  name: string;
  roomId: RoomId;
  items: PlaylistItem[];
  loop: boolean;
  nextPlaylistId?: PlaylistId;
}

export interface PresetChange {
  endpointId: EndpointId;
  mode: 'asset' | 'playlist';
  assetId?: AssetId;
  playlistId?: PlaylistId;
  assetIds?: AssetId[];
  playlistIds?: PlaylistId[];
  status?: 'playing' | 'paused' | 'offline';
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  changes: PresetChange[];
}

export interface UiState {
  activeFilters: string[];
  theme: 'light' | 'dark';
  syncGroups: Record<string, boolean>;
}

export interface AppState {
  rooms: Room[];
  endpoints: Endpoint[];
  assets: Asset[];
  playlists: Playlist[];
  presets: Preset[];
  uiState: UiState;
}

export type AppAction =
  | { type: 'PLAY_ENDPOINT'; endpointId: EndpointId }
  | { type: 'PAUSE_ENDPOINT'; endpointId: EndpointId }
  | { type: 'RESTART_ENDPOINT'; endpointId: EndpointId }
  | { type: 'TOGGLE_LOOP'; endpointId: EndpointId }
  | { type: 'SKIP_NEXT'; endpointId: EndpointId }
  | { type: 'SKIP_PREV'; endpointId: EndpointId }
  | { type: 'SWAP_ASSET'; endpointId: EndpointId; assetId: AssetId }
  | { type: 'CHOOSE_PLAYLIST'; endpointId: EndpointId; playlistId: PlaylistId }
  | { type: 'SET_ROOM_PLAYLIST'; roomId: RoomId; playlistId: PlaylistId }
  | { type: 'TOGGLE_SYNC'; groupId: string }
  | { type: 'APPLY_PRESET'; presetId: string }
  | { type: 'SET_AMBIENT'; endpointId?: EndpointId; roomId?: RoomId }
  | { type: 'RETURN_TO_DEFAULT'; endpointId?: EndpointId; roomId?: RoomId }
  | { type: 'RUN_INVESTOR_ONCE'; endpointId: EndpointId }
  | { type: 'REORDER_PLAYLIST'; playlistId: PlaylistId; endpointId: EndpointId; fromIdx: number; toIdx: number }
  | { type: 'ADD_PLAYLIST_ITEM'; playlistId: PlaylistId; endpointId: EndpointId; assetId: AssetId }
  | { type: 'REMOVE_PLAYLIST_ITEM'; playlistId: PlaylistId; endpointId: EndpointId; assetId: AssetId }
  | { type: 'SET_BRIGHTNESS'; endpointId: EndpointId; value: number }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_FILTER'; filters: string[] }
  // Asset CRUD
  | { type: 'CREATE_ASSET'; asset: Omit<Asset, 'id' | 'updatedAt'> & { id?: string; updatedAt?: string } }
  | { type: 'UPDATE_ASSET'; assetId: AssetId; updates: Partial<Omit<Asset, 'id'>> }
  | { type: 'DELETE_ASSET'; assetId: AssetId }
  // Playlist CRUD
  | { type: 'CREATE_PLAYLIST'; name: string; roomId: RoomId; loop: boolean; items?: PlaylistItem[]; nextPlaylistId?: PlaylistId }
  | { type: 'UPDATE_PLAYLIST_META'; playlistId: PlaylistId; name: string; loop: boolean; nextPlaylistId?: PlaylistId }
  | { type: 'DELETE_PLAYLIST'; playlistId: PlaylistId }
  // Preset CRUD
  | { type: 'CREATE_PRESET'; preset: Omit<Preset, 'id'> }
  | { type: 'UPDATE_PRESET'; presetId: string; updates: Partial<Omit<Preset, 'id'>> }
  | { type: 'DELETE_PRESET'; presetId: string };
