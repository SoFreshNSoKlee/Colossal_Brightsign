export type RoomId = string;
export type EndpointId = string;
export type AssetId = string;
export type PlaylistId = string;
export type UserRole = 'admin' | 'operator' | 'viewer';

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
  title: string;
  tags: string[];
  durationSec: number;
  aspect: string;
  updatedAt: string;
  color: string;
}

export interface PlaylistItem {
  assetId: AssetId;
  order: number;
}

export interface Playlist {
  id: PlaylistId;
  name: string;
  items: PlaylistItem[];
  loop: boolean;
}

export interface PresetChange {
  endpointId: EndpointId;
  mode: 'asset' | 'playlist';
  assetId?: AssetId;
  playlistId?: PlaylistId;
  status?: 'playing' | 'paused' | 'offline';
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  changes: PresetChange[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userRole: string;
  action: string;
  targets: string[];
  details: string;
}

export interface UiState {
  activeFilters: string[];
  theme: 'light' | 'dark';
  userRole: UserRole;
  syncGroups: Record<string, boolean>;
}

export interface AppState {
  rooms: Room[];
  endpoints: Endpoint[];
  assets: Asset[];
  playlists: Playlist[];
  presets: Preset[];
  auditLog: AuditLogEntry[];
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
  | { type: 'TOGGLE_SYNC'; groupId: string }
  | { type: 'APPLY_PRESET'; presetId: string }
  | { type: 'SET_AMBIENT'; endpointId?: EndpointId; roomId?: RoomId }
  | { type: 'RETURN_TO_DEFAULT'; endpointId?: EndpointId; roomId?: RoomId }
  | { type: 'RUN_INVESTOR_ONCE'; endpointId: EndpointId }
  | { type: 'REORDER_PLAYLIST'; playlistId: PlaylistId; fromIdx: number; toIdx: number }
  | { type: 'ADD_PLAYLIST_ITEM'; playlistId: PlaylistId; assetId: AssetId }
  | { type: 'REMOVE_PLAYLIST_ITEM'; playlistId: PlaylistId; assetId: AssetId }
  | { type: 'SET_TOUR_THEME'; theme: 'Thylacine' | 'Dodo' | 'Mammoth' }
  | { type: 'SET_BRIGHTNESS'; endpointId: EndpointId; value: number }
  | { type: 'SET_USER_ROLE'; role: UserRole }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_FILTER'; filters: string[] };
