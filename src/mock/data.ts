import type { Asset, Playlist, Preset, Room, Endpoint } from '../types';

// ─── ASSETS ───────────────────────────────────────────────────────────────────

export const mockAssets: Asset[] = [
  {
    id: 'mammoth-loop',
    title: 'Mammoth Loop',
    tags: ['Mammoth', 'Ambient'],
    durationSec: 3600,
    aspect: '16:9',
    updatedAt: '2024-10-01T09:00:00Z',
    color: '#8B6914',
  },
  {
    id: 'mammoth-highlight',
    title: 'Mammoth Highlight',
    tags: ['Mammoth', 'Investor'],
    durationSec: 180,
    aspect: '16:9',
    updatedAt: '2024-10-05T11:30:00Z',
    color: '#A0522D',
  },
  {
    id: 'dodo-walk',
    title: 'Dodo Walk',
    tags: ['Dodo', 'Ambient'],
    durationSec: 2400,
    aspect: '16:9',
    updatedAt: '2024-09-20T14:00:00Z',
    color: '#5B8FA8',
  },
  {
    id: 'dodo-feature',
    title: 'Dodo Feature',
    tags: ['Dodo', 'Press'],
    durationSec: 300,
    aspect: '16:9',
    updatedAt: '2024-09-25T10:00:00Z',
    color: '#3A7CA5',
  },
  {
    id: 'thylacine-day',
    title: 'Thylacine Day',
    tags: ['Thylacine', 'Ambient'],
    durationSec: 1800,
    aspect: '16:9',
    updatedAt: '2024-10-08T08:00:00Z',
    color: '#6B7C4E',
  },
  {
    id: 'thylacine-night',
    title: 'Thylacine Night',
    tags: ['Thylacine', 'Ambient'],
    durationSec: 1800,
    aspect: '16:9',
    updatedAt: '2024-10-08T08:30:00Z',
    color: '#2E3D2F',
  },
  {
    id: 'investor-overview',
    title: 'Investor Overview',
    tags: ['Investor', 'Press'],
    durationSec: 240,
    aspect: '16:9',
    updatedAt: '2024-10-10T15:00:00Z',
    color: '#1A237E',
  },
  {
    id: 'kids-corner',
    title: 'Kids Corner',
    tags: ['Kids', 'Ambient'],
    durationSec: 600,
    aspect: '4:3',
    updatedAt: '2024-09-15T12:00:00Z',
    color: '#E91E63',
  },
  {
    id: 'partner-welcome',
    title: 'Partner Welcome',
    tags: ['Ambient'],
    durationSec: 120,
    aspect: '16:9',
    updatedAt: '2024-10-12T09:00:00Z',
    color: '#37474F',
  },
  {
    id: 'press-reel',
    title: 'Press Reel',
    tags: ['Press', 'Investor'],
    durationSec: 420,
    aspect: '16:9',
    updatedAt: '2024-10-11T14:00:00Z',
    color: '#4A148C',
  },
];

// ─── PLAYLISTS ─────────────────────────────────────────────────────────────────

export const mockPlaylists: Playlist[] = [
  {
    id: 'ambient',
    name: 'Ambient',
    loop: true,
    items: [
      { assetId: 'mammoth-loop', order: 0 },
      { assetId: 'thylacine-day', order: 1 },
      { assetId: 'dodo-walk', order: 2 },
    ],
  },
  {
    id: 'investor',
    name: 'Investor',
    loop: false,
    items: [
      { assetId: 'investor-overview', order: 0 },
      { assetId: 'mammoth-highlight', order: 1 },
      { assetId: 'press-reel', order: 2 },
    ],
  },
  {
    id: 'press-tour',
    name: 'Press Tour',
    loop: false,
    items: [
      { assetId: 'press-reel', order: 0 },
      { assetId: 'dodo-feature', order: 1 },
      { assetId: 'investor-overview', order: 2 },
    ],
  },
  {
    id: 'partner-visit',
    name: 'Partner Visit',
    loop: true,
    items: [
      { assetId: 'partner-welcome', order: 0 },
      { assetId: 'mammoth-loop', order: 1 },
      { assetId: 'thylacine-day', order: 2 },
    ],
  },
];

// ─── ROOMS ─────────────────────────────────────────────────────────────────────

export const mockRooms: Room[] = [
  {
    id: 'lobby',
    name: 'Lobby',
    endpointIds: ['lobby-left-led', 'lobby-led-screen'],
  },
  {
    id: 'automation-suite',
    name: 'Automation Suite',
    endpointIds: ['auto-nano-1', 'auto-nano-2', 'auto-nano-3'],
  },
  {
    id: 'megalodon-room',
    name: 'Megalodon Room',
    endpointIds: ['mega-main-wall'],
  },
  {
    id: 'social-den',
    name: 'Social Den',
    endpointIds: ['social-screen-1', 'social-screen-2'],
  },
  {
    id: 'tour-path',
    name: 'Tour Path',
    endpointIds: ['tour-wall-1', 'tour-wall-2', 'tour-wall-3'],
  },
];

// ─── ENDPOINTS ─────────────────────────────────────────────────────────────────

export const mockEndpoints: Endpoint[] = [
  // Lobby
  {
    id: 'lobby-left-led',
    name: 'Lobby – Left LED Wall',
    roomId: 'lobby',
    type: 'single',
    status: 'playing',
    syncGroupId: 'lobby-sync',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'playlist', playlistId: 'ambient', positionSec: 120, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: false, brightness: false },
    loop: true,
    brightness: 100,
  },
  {
    id: 'lobby-led-screen',
    name: 'Lobby – LED Screen',
    roomId: 'lobby',
    type: 'single',
    status: 'playing',
    syncGroupId: 'lobby-sync',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'playlist', playlistId: 'ambient', positionSec: 120, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: false, brightness: false },
    loop: true,
    brightness: 100,
  },

  // Automation Suite
  {
    id: 'auto-nano-1',
    name: 'Automation – Nano 1',
    roomId: 'automation-suite',
    type: 'single',
    status: 'playing',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'asset', assetId: 'mammoth-loop', positionSec: 0, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: false, brightness: true },
    loop: true,
    brightness: 80,
  },
  {
    id: 'auto-nano-2',
    name: 'Automation – Nano 2',
    roomId: 'automation-suite',
    type: 'single',
    status: 'paused',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'asset', assetId: 'dodo-walk', positionSec: 450, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: false, brightness: true },
    loop: false,
    brightness: 75,
  },
  {
    id: 'auto-nano-3',
    name: 'Automation – Nano 3',
    roomId: 'automation-suite',
    type: 'single',
    status: 'offline',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'asset', assetId: 'thylacine-day', positionSec: 0, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: false, brightness: true },
    loop: true,
    brightness: 100,
  },

  // Megalodon Room
  {
    id: 'mega-main-wall',
    name: 'Megalodon – Main Wall',
    roomId: 'megalodon-room',
    type: 'playlist',
    status: 'playing',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'playlist', playlistId: 'ambient', positionSec: 0, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: true, brightness: false },
    loop: true,
    brightness: 100,
  },

  // Social Den
  {
    id: 'social-screen-1',
    name: 'Social Den – Screen 1',
    roomId: 'social-den',
    type: 'single',
    status: 'playing',
    syncGroupId: 'social-sync',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'asset', assetId: 'partner-welcome', positionSec: 10, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: false, brightness: false },
    loop: true,
    brightness: 100,
  },
  {
    id: 'social-screen-2',
    name: 'Social Den – Screen 2',
    roomId: 'social-den',
    type: 'single',
    status: 'playing',
    syncGroupId: 'social-sync',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'asset', assetId: 'partner-welcome', positionSec: 10, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: false, brightness: false },
    loop: true,
    brightness: 100,
  },

  // Tour Path
  {
    id: 'tour-wall-1',
    name: 'Tour Path – Wall 1',
    roomId: 'tour-path',
    type: 'single',
    status: 'playing',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'asset', assetId: 'mammoth-loop', positionSec: 600, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: false, brightness: false },
    loop: true,
    brightness: 100,
  },
  {
    id: 'tour-wall-2',
    name: 'Tour Path – Wall 2',
    roomId: 'tour-path',
    type: 'single',
    status: 'playing',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'asset', assetId: 'mammoth-loop', positionSec: 600, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: false, brightness: false },
    loop: true,
    brightness: 100,
  },
  {
    id: 'tour-wall-3',
    name: 'Tour Path – Wall 3',
    roomId: 'tour-path',
    type: 'single',
    status: 'playing',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'asset', assetId: 'mammoth-loop', positionSec: 600, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: false, brightness: false },
    loop: true,
    brightness: 100,
  },
];

// ─── PRESETS ───────────────────────────────────────────────────────────────────

export const mockPresets: Preset[] = [
  {
    id: 'investor-day',
    name: 'Investor Day',
    description:
      'Megalodon runs the Investor playlist once; Lobby stays Ambient; Social Den plays Ambient.',
    changes: [
      { endpointId: 'mega-main-wall', mode: 'playlist', playlistId: 'investor', status: 'playing' },
      { endpointId: 'lobby-left-led', mode: 'playlist', playlistId: 'ambient', status: 'playing' },
      { endpointId: 'lobby-led-screen', mode: 'playlist', playlistId: 'ambient', status: 'playing' },
      { endpointId: 'social-screen-1', mode: 'playlist', playlistId: 'ambient', status: 'playing' },
      { endpointId: 'social-screen-2', mode: 'playlist', playlistId: 'ambient', status: 'playing' },
    ],
  },
  {
    id: 'press-tour',
    name: 'Press Tour',
    description:
      'Tour Path set to Dodo theme; Social Den runs Press Tour playlist; Lobby stays Ambient.',
    changes: [
      { endpointId: 'tour-wall-1', mode: 'asset', assetId: 'dodo-walk', status: 'playing' },
      { endpointId: 'tour-wall-2', mode: 'asset', assetId: 'dodo-walk', status: 'playing' },
      { endpointId: 'tour-wall-3', mode: 'asset', assetId: 'dodo-walk', status: 'playing' },
      { endpointId: 'social-screen-1', mode: 'playlist', playlistId: 'press-tour', status: 'playing' },
      { endpointId: 'social-screen-2', mode: 'playlist', playlistId: 'press-tour', status: 'playing' },
      { endpointId: 'lobby-left-led', mode: 'playlist', playlistId: 'ambient', status: 'playing' },
      { endpointId: 'lobby-led-screen', mode: 'playlist', playlistId: 'ambient', status: 'playing' },
    ],
  },
  {
    id: 'after-hours',
    name: 'After Hours',
    description:
      'Dims and pauses non-essential screens; Lobby falls back to looping Ambient.',
    changes: [
      { endpointId: 'mega-main-wall', mode: 'playlist', playlistId: 'ambient', status: 'paused' },
      { endpointId: 'auto-nano-1', mode: 'asset', assetId: 'mammoth-loop', status: 'paused' },
      { endpointId: 'auto-nano-2', mode: 'asset', assetId: 'mammoth-loop', status: 'offline' },
      { endpointId: 'auto-nano-3', mode: 'asset', assetId: 'mammoth-loop', status: 'offline' },
      { endpointId: 'social-screen-1', mode: 'playlist', playlistId: 'ambient', status: 'paused' },
      { endpointId: 'social-screen-2', mode: 'playlist', playlistId: 'ambient', status: 'paused' },
      { endpointId: 'lobby-left-led', mode: 'playlist', playlistId: 'ambient', status: 'playing' },
      { endpointId: 'lobby-led-screen', mode: 'playlist', playlistId: 'ambient', status: 'playing' },
      { endpointId: 'tour-wall-1', mode: 'asset', assetId: 'mammoth-loop', status: 'offline' },
      { endpointId: 'tour-wall-2', mode: 'asset', assetId: 'mammoth-loop', status: 'offline' },
      { endpointId: 'tour-wall-3', mode: 'asset', assetId: 'mammoth-loop', status: 'offline' },
    ],
  },
  {
    id: 'general-tour',
    name: 'General Tour',
    description:
      'Tour Path shows Mammoth theme; everywhere else plays Ambient.',
    changes: [
      { endpointId: 'tour-wall-1', mode: 'asset', assetId: 'mammoth-loop', status: 'playing' },
      { endpointId: 'tour-wall-2', mode: 'asset', assetId: 'mammoth-loop', status: 'playing' },
      { endpointId: 'tour-wall-3', mode: 'asset', assetId: 'mammoth-loop', status: 'playing' },
      { endpointId: 'mega-main-wall', mode: 'playlist', playlistId: 'ambient', status: 'playing' },
      { endpointId: 'lobby-left-led', mode: 'playlist', playlistId: 'ambient', status: 'playing' },
      { endpointId: 'lobby-led-screen', mode: 'playlist', playlistId: 'ambient', status: 'playing' },
      { endpointId: 'social-screen-1', mode: 'playlist', playlistId: 'ambient', status: 'playing' },
      { endpointId: 'social-screen-2', mode: 'playlist', playlistId: 'ambient', status: 'playing' },
      { endpointId: 'auto-nano-1', mode: 'playlist', playlistId: 'ambient', status: 'playing' },
      { endpointId: 'auto-nano-2', mode: 'playlist', playlistId: 'ambient', status: 'playing' },
      { endpointId: 'auto-nano-3', mode: 'playlist', playlistId: 'ambient', status: 'playing' },
    ],
  },
];

// ─── TOUR THEME MAP ────────────────────────────────────────────────────────────

export const tourThemeAssets: Record<string, string> = {
  Mammoth: 'mammoth-loop',
  Dodo: 'dodo-walk',
  Thylacine: 'thylacine-day',
};

export const ALL_TAGS = [
  'Mammoth',
  'Dodo',
  'Thylacine',
  'Ambient',
  'Investor',
  'Press',
  'Kids',
];
