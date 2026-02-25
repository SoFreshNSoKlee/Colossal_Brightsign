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

// ─── PLAYLISTS (room-scoped) ───────────────────────────────────────────────────

export const mockPlaylists: Playlist[] = [
  // ── Lobby ──────────────────────────────────────────────────────────────────
  {
    id: 'lobby-default',
    name: 'Default',
    roomId: 'lobby',
    loop: true,
    items: [
      { assetId: 'mammoth-loop', order: 0 },
      { assetId: 'thylacine-day', order: 1 },
      { assetId: 'dodo-walk', order: 2 },
    ],
  },
  {
    id: 'lobby-origin-story',
    name: 'Origin Story',
    roomId: 'lobby',
    loop: false,
    items: [
      { assetId: 'investor-overview', order: 0 },
      { assetId: 'mammoth-highlight', order: 1 },
      { assetId: 'press-reel', order: 2 },
    ],
  },
  {
    id: 'lobby-specimen-archive',
    name: 'Specimen Archive',
    roomId: 'lobby',
    loop: true,
    items: [
      { assetId: 'partner-welcome', order: 0 },
      { assetId: 'mammoth-loop', order: 1 },
      { assetId: 'dodo-walk', order: 2 },
    ],
  },

  // ── Automation Suite ───────────────────────────────────────────────────────
  {
    id: 'auto-default',
    name: 'Default',
    roomId: 'automation-suite',
    loop: true,
    items: [
      { assetId: 'mammoth-loop', order: 0 },
      { assetId: 'thylacine-day', order: 1 },
    ],
  },
  {
    id: 'auto-fossil-record',
    name: 'Fossil Record',
    roomId: 'automation-suite',
    loop: true,
    items: [
      { assetId: 'dodo-walk', order: 0 },
      { assetId: 'thylacine-day', order: 1 },
      { assetId: 'dodo-feature', order: 2 },
    ],
  },
  {
    id: 'auto-extinction-protocol',
    name: 'Extinction Protocol',
    roomId: 'automation-suite',
    loop: false,
    items: [
      { assetId: 'investor-overview', order: 0 },
      { assetId: 'press-reel', order: 1 },
    ],
  },

  // ── Megalodon Room ─────────────────────────────────────────────────────────
  {
    id: 'mega-ambient',
    name: 'Ambient',
    roomId: 'megalodon-room',
    loop: true,
    items: [
      { assetId: 'mammoth-loop', order: 0 },
      { assetId: 'thylacine-day', order: 1 },
      { assetId: 'dodo-walk', order: 2 },
    ],
  },
  {
    id: 'mega-investor-story',
    name: 'Investor Story',
    roomId: 'megalodon-room',
    loop: false,
    items: [
      { assetId: 'investor-overview', order: 0 },
      { assetId: 'mammoth-highlight', order: 1 },
      { assetId: 'press-reel', order: 2 },
    ],
  },
  {
    id: 'mega-wayfinding',
    name: 'Wayfinding',
    roomId: 'megalodon-room',
    loop: true,
    items: [
      { assetId: 'partner-welcome', order: 0 },
      { assetId: 'mammoth-loop', order: 1 },
    ],
  },
  {
    id: 'mega-deep-sea',
    name: 'Deep Sea',
    roomId: 'megalodon-room',
    loop: true,
    items: [
      { assetId: 'dodo-walk', order: 0 },
      { assetId: 'dodo-feature', order: 1 },
      { assetId: 'thylacine-night', order: 2 },
    ],
  },

  // ── Social Den ─────────────────────────────────────────────────────────────
  {
    id: 'social-default',
    name: 'Default',
    roomId: 'social-den',
    loop: true,
    items: [
      { assetId: 'partner-welcome', order: 0 },
      { assetId: 'mammoth-loop', order: 1 },
      { assetId: 'thylacine-day', order: 2 },
    ],
  },
  {
    id: 'social-synthesis-lab',
    name: 'Synthesis Lab',
    roomId: 'social-den',
    loop: true,
    items: [
      { assetId: 'press-reel', order: 0 },
      { assetId: 'dodo-feature', order: 1 },
      { assetId: 'kids-corner', order: 2 },
    ],
  },
  {
    id: 'social-deep-time',
    name: 'Deep Time',
    roomId: 'social-den',
    loop: false,
    items: [
      { assetId: 'investor-overview', order: 0 },
      { assetId: 'mammoth-highlight', order: 1 },
      { assetId: 'thylacine-night', order: 2 },
    ],
  },

  // ── Tour Path ──────────────────────────────────────────────────────────────
  {
    id: 'tour-default',
    name: 'Default',
    roomId: 'tour-path',
    loop: true,
    items: [
      { assetId: 'mammoth-loop', order: 0 },
      { assetId: 'thylacine-day', order: 1 },
      { assetId: 'dodo-walk', order: 2 },
    ],
  },
  {
    id: 'tour-migration-path',
    name: 'Migration Path',
    roomId: 'tour-path',
    loop: false,
    items: [
      { assetId: 'mammoth-highlight', order: 0 },
      { assetId: 'dodo-feature', order: 1 },
      { assetId: 'thylacine-day', order: 2 },
    ],
  },
  {
    id: 'tour-extinction-event',
    name: 'Extinction Event',
    roomId: 'tour-path',
    loop: true,
    items: [
      { assetId: 'thylacine-night', order: 0 },
      { assetId: 'dodo-walk', order: 1 },
      { assetId: 'mammoth-loop', order: 2 },
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
    endpointIds: ['auto-nano-1', 'auto-nano-2'],
  },
  {
    id: 'megalodon-room',
    name: 'Megalodon Room',
    endpointIds: ['mega-wall-1', 'mega-wall-2', 'mega-wall-3'],
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
  // Lobby (2 screens)
  {
    id: 'lobby-left-led',
    name: 'Lobby – Left LED Wall',
    roomId: 'lobby',
    type: 'playlist',
    status: 'playing',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'playlist', playlistId: 'lobby-default', positionSec: 120, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: true, brightness: false },
    loop: true,
    brightness: 100,
  },
  {
    id: 'lobby-led-screen',
    name: 'Lobby – LED Screen',
    roomId: 'lobby',
    type: 'playlist',
    status: 'playing',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'playlist', playlistId: 'lobby-default', positionSec: 120, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: true, brightness: false },
    loop: true,
    brightness: 100,
  },

  // Automation Suite (2 screens)
  {
    id: 'auto-nano-1',
    name: 'Automation – Screen 1',
    roomId: 'automation-suite',
    type: 'playlist',
    status: 'playing',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'playlist', playlistId: 'auto-default', positionSec: 0, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: true, brightness: true },
    loop: true,
    brightness: 80,
  },
  {
    id: 'auto-nano-2',
    name: 'Automation – Screen 2',
    roomId: 'automation-suite',
    type: 'playlist',
    status: 'playing',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'playlist', playlistId: 'auto-default', positionSec: 0, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: true, brightness: true },
    loop: true,
    brightness: 80,
  },

  // Megalodon Room (3 screens)
  {
    id: 'mega-wall-1',
    name: 'Megalodon – Wall 1',
    roomId: 'megalodon-room',
    type: 'playlist',
    status: 'playing',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'playlist', playlistId: 'mega-ambient', positionSec: 0, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: true, brightness: false },
    loop: true,
    brightness: 100,
  },
  {
    id: 'mega-wall-2',
    name: 'Megalodon – Wall 2',
    roomId: 'megalodon-room',
    type: 'playlist',
    status: 'playing',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'playlist', playlistId: 'mega-ambient', positionSec: 0, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: true, brightness: false },
    loop: true,
    brightness: 100,
  },
  {
    id: 'mega-wall-3',
    name: 'Megalodon – Wall 3',
    roomId: 'megalodon-room',
    type: 'playlist',
    status: 'playing',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'playlist', playlistId: 'mega-ambient', positionSec: 0, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: true, brightness: false },
    loop: true,
    brightness: 100,
  },

  // Social Den (2 screens)
  {
    id: 'social-screen-1',
    name: 'Social Den – Screen 1',
    roomId: 'social-den',
    type: 'playlist',
    status: 'playing',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'playlist', playlistId: 'social-default', positionSec: 10, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: true, brightness: false },
    loop: true,
    brightness: 100,
  },
  {
    id: 'social-screen-2',
    name: 'Social Den – Screen 2',
    roomId: 'social-den',
    type: 'playlist',
    status: 'playing',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'playlist', playlistId: 'social-default', positionSec: 10, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: true, brightness: false },
    loop: true,
    brightness: 100,
  },

  // Tour Path (3 screens)
  {
    id: 'tour-wall-1',
    name: 'Tour Path – Wall 1',
    roomId: 'tour-path',
    type: 'playlist',
    status: 'playing',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'playlist', playlistId: 'tour-default', positionSec: 600, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: true, brightness: false },
    loop: true,
    brightness: 100,
  },
  {
    id: 'tour-wall-2',
    name: 'Tour Path – Wall 2',
    roomId: 'tour-path',
    type: 'playlist',
    status: 'playing',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'playlist', playlistId: 'tour-default', positionSec: 600, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: true, brightness: false },
    loop: true,
    brightness: 100,
  },
  {
    id: 'tour-wall-3',
    name: 'Tour Path – Wall 3',
    roomId: 'tour-path',
    type: 'playlist',
    status: 'playing',
    defaultMode: 'ambient',
    nowPlaying: { mode: 'playlist', playlistId: 'tour-default', positionSec: 600, currentItemIndex: 0 },
    supports: { playPause: true, restart: true, loop: true, skip: true, brightness: false },
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
      'Megalodon runs Investor Story; Lobby and Social Den play Default.',
    changes: [
      { endpointId: 'mega-wall-1', mode: 'playlist', playlistId: 'mega-investor-story', status: 'playing' },
      { endpointId: 'mega-wall-2', mode: 'playlist', playlistId: 'mega-investor-story', status: 'playing' },
      { endpointId: 'mega-wall-3', mode: 'playlist', playlistId: 'mega-investor-story', status: 'playing' },
      { endpointId: 'lobby-left-led', mode: 'playlist', playlistId: 'lobby-default', status: 'playing' },
      { endpointId: 'lobby-led-screen', mode: 'playlist', playlistId: 'lobby-default', status: 'playing' },
      { endpointId: 'social-screen-1', mode: 'playlist', playlistId: 'social-default', status: 'playing' },
      { endpointId: 'social-screen-2', mode: 'playlist', playlistId: 'social-default', status: 'playing' },
    ],
  },
  {
    id: 'press-tour',
    name: 'Press Tour',
    description:
      'Tour Path runs Migration Path; Social Den plays Synthesis Lab; Lobby stays Default.',
    changes: [
      { endpointId: 'tour-wall-1', mode: 'playlist', playlistId: 'tour-migration-path', status: 'playing' },
      { endpointId: 'tour-wall-2', mode: 'playlist', playlistId: 'tour-migration-path', status: 'playing' },
      { endpointId: 'tour-wall-3', mode: 'playlist', playlistId: 'tour-migration-path', status: 'playing' },
      { endpointId: 'social-screen-1', mode: 'playlist', playlistId: 'social-synthesis-lab', status: 'playing' },
      { endpointId: 'social-screen-2', mode: 'playlist', playlistId: 'social-synthesis-lab', status: 'playing' },
      { endpointId: 'lobby-left-led', mode: 'playlist', playlistId: 'lobby-default', status: 'playing' },
      { endpointId: 'lobby-led-screen', mode: 'playlist', playlistId: 'lobby-default', status: 'playing' },
    ],
  },
  {
    id: 'after-hours',
    name: 'After Hours',
    description:
      'Pauses non-essential screens; Lobby loops Default.',
    changes: [
      { endpointId: 'mega-wall-1', mode: 'playlist', playlistId: 'mega-ambient', status: 'paused' },
      { endpointId: 'mega-wall-2', mode: 'playlist', playlistId: 'mega-ambient', status: 'paused' },
      { endpointId: 'mega-wall-3', mode: 'playlist', playlistId: 'mega-ambient', status: 'paused' },
      { endpointId: 'auto-nano-1', mode: 'playlist', playlistId: 'auto-default', status: 'offline' },
      { endpointId: 'auto-nano-2', mode: 'playlist', playlistId: 'auto-default', status: 'offline' },
      { endpointId: 'social-screen-1', mode: 'playlist', playlistId: 'social-default', status: 'paused' },
      { endpointId: 'social-screen-2', mode: 'playlist', playlistId: 'social-default', status: 'paused' },
      { endpointId: 'lobby-left-led', mode: 'playlist', playlistId: 'lobby-default', status: 'playing' },
      { endpointId: 'lobby-led-screen', mode: 'playlist', playlistId: 'lobby-default', status: 'playing' },
      { endpointId: 'tour-wall-1', mode: 'playlist', playlistId: 'tour-default', status: 'offline' },
      { endpointId: 'tour-wall-2', mode: 'playlist', playlistId: 'tour-default', status: 'offline' },
      { endpointId: 'tour-wall-3', mode: 'playlist', playlistId: 'tour-default', status: 'offline' },
    ],
  },
  {
    id: 'general-tour',
    name: 'General Tour',
    description:
      'Tour Path plays Default; all other rooms play their Default playlists.',
    changes: [
      { endpointId: 'tour-wall-1', mode: 'playlist', playlistId: 'tour-default', status: 'playing' },
      { endpointId: 'tour-wall-2', mode: 'playlist', playlistId: 'tour-default', status: 'playing' },
      { endpointId: 'tour-wall-3', mode: 'playlist', playlistId: 'tour-default', status: 'playing' },
      { endpointId: 'mega-wall-1', mode: 'playlist', playlistId: 'mega-ambient', status: 'playing' },
      { endpointId: 'mega-wall-2', mode: 'playlist', playlistId: 'mega-ambient', status: 'playing' },
      { endpointId: 'mega-wall-3', mode: 'playlist', playlistId: 'mega-ambient', status: 'playing' },
      { endpointId: 'lobby-left-led', mode: 'playlist', playlistId: 'lobby-default', status: 'playing' },
      { endpointId: 'lobby-led-screen', mode: 'playlist', playlistId: 'lobby-default', status: 'playing' },
      { endpointId: 'social-screen-1', mode: 'playlist', playlistId: 'social-default', status: 'playing' },
      { endpointId: 'social-screen-2', mode: 'playlist', playlistId: 'social-default', status: 'playing' },
      { endpointId: 'auto-nano-1', mode: 'playlist', playlistId: 'auto-default', status: 'playing' },
      { endpointId: 'auto-nano-2', mode: 'playlist', playlistId: 'auto-default', status: 'playing' },
    ],
  },
];

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────

export const ALL_TAGS = [
  'Mammoth',
  'Dodo',
  'Thylacine',
  'Ambient',
  'Investor',
  'Press',
  'Kids',
];

// Screen count per room for informational display
export const ROOM_SCREEN_COUNT: Record<string, number> = {
  lobby: 2,
  'automation-suite': 2,
  'megalodon-room': 3,
  'social-den': 2,
  'tour-path': 3,
};
