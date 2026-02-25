import type { Asset, Playlist, Preset, Room, Endpoint } from '../types';

// ─── ASSETS ───────────────────────────────────────────────────────────────────

// ─── ANIMAL IMAGE URLS (Wikimedia Commons) ────────────────────────────────────
const IMG = {
  mammoth1: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Woolly_mammoth_skeleton.jpg',
  mammoth2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Woolly_mammoth_Mauricio_Ant%C3%B3n.jpg/800px-Woolly_mammoth_Mauricio_Ant%C3%B3n.jpg',
  mammoth3: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Woolly_mammoth-model.jpg/800px-Woolly_mammoth-model.jpg',
  thylacine1: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Thylacinus_cynocephalus_2_Cronin.jpg/800px-Thylacinus_cynocephalus_2_Cronin.jpg',
  thylacine2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/TasmanianTiger.jpg/800px-TasmanianTiger.jpg',
  thylacine3: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Thylacine4.jpg/800px-Thylacine4.jpg',
  dodo1: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Dodo_by_Roelant_Savery_1626.jpg/600px-Dodo_by_Roelant_Savery_1626.jpg',
  dodo2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Raphus_cucullatus.jpg/600px-Raphus_cucullatus.jpg',
  direwolf1: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Canis_dirus_Sergiodlarosa.jpg/800px-Canis_dirus_Sergiodlarosa.jpg',
  direwolf2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Dire_wolf_size_comparison.png/800px-Dire_wolf_size_comparison.png',
  moa1: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Giant_moa.jpg/600px-Giant_moa.jpg',
  moa2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Moa_scale.jpg/600px-Moa_scale.jpg',
};

export const mockAssets: Asset[] = [
  // Lobby – Left LED Wall (16:9) — 3 assets
  { id: 'mammoth-loop', endpointId: 'lobby-left-led', title: 'Mammoth Loop', tags: ['Mammoth', 'Ambient'], durationSec: 3600, aspect: '16:9', updatedAt: '2024-10-01T09:00:00Z', color: '#8B6914', imageUrl: IMG.mammoth1 },
  { id: 'mammoth-highlight', endpointId: 'lobby-left-led', title: 'Mammoth Highlight', tags: ['Mammoth', 'Investor'], durationSec: 180, aspect: '16:9', updatedAt: '2024-10-05T11:30:00Z', color: '#A0522D', imageUrl: IMG.mammoth2 },
  { id: 'lobby-brand-reel', endpointId: 'lobby-left-led', title: 'Brand Reel', tags: ['Ambient', 'Press'], durationSec: 240, aspect: '16:9', updatedAt: '2024-10-07T10:00:00Z', color: '#3A7CA5', imageUrl: IMG.mammoth3 },

  // Automation – Screen 1 (16:9) — 3 assets
  { id: 'dodo-walk', endpointId: 'auto-nano-1', title: 'Dodo Walk', tags: ['Dodo', 'Ambient'], durationSec: 2400, aspect: '16:9', updatedAt: '2024-09-20T14:00:00Z', color: '#5B8FA8', imageUrl: IMG.dodo1 },
  { id: 'dodo-feature', endpointId: 'auto-nano-1', title: 'Dodo Feature', tags: ['Dodo', 'Press'], durationSec: 300, aspect: '16:9', updatedAt: '2024-09-25T10:00:00Z', color: '#3A7CA5', imageUrl: IMG.dodo2 },
  { id: 'auto-ambient-loop', endpointId: 'auto-nano-1', title: 'Lab Ambient Loop', tags: ['Ambient'], durationSec: 1800, aspect: '16:9', updatedAt: '2024-09-28T11:00:00Z', color: '#388E3C' },

  // Automation – Screen 2 (16:9) — 2 assets
  { id: 'process-showcase', endpointId: 'auto-nano-2', title: 'Process Showcase', tags: ['Ambient', 'Investor'], durationSec: 600, aspect: '16:9', updatedAt: '2024-09-22T09:00:00Z', color: '#0288D1' },
  { id: 'lab-highlight', endpointId: 'auto-nano-2', title: 'Lab Highlight', tags: ['Press'], durationSec: 240, aspect: '16:9', updatedAt: '2024-09-26T13:00:00Z', color: '#6B7C4E' },

  // Megalodon – Wall 1 (16:9) — 3 assets
  { id: 'thylacine-day', endpointId: 'mega-wall-1', title: 'Thylacine Day', tags: ['Thylacine', 'Ambient'], durationSec: 1800, aspect: '16:9', updatedAt: '2024-10-08T08:00:00Z', color: '#6B7C4E', imageUrl: IMG.thylacine1 },
  { id: 'investor-overview', endpointId: 'mega-wall-1', title: 'Investor Overview', tags: ['Investor', 'Press'], durationSec: 240, aspect: '16:9', updatedAt: '2024-10-10T15:00:00Z', color: '#1A237E', imageUrl: IMG.direwolf1 },
  { id: 'mega-origin', endpointId: 'mega-wall-1', title: 'Megalodon Origin', tags: ['Ambient', 'Investor'], durationSec: 480, aspect: '16:9', updatedAt: '2024-10-11T10:00:00Z', color: '#4A148C' },

  // Megalodon – Wall 2 (16:9) — 2 assets
  { id: 'thylacine-night', endpointId: 'mega-wall-2', title: 'Thylacine Night', tags: ['Thylacine', 'Ambient'], durationSec: 1800, aspect: '16:9', updatedAt: '2024-10-08T08:30:00Z', color: '#2E3D2F', imageUrl: IMG.thylacine2 },
  { id: 'deep-dive', endpointId: 'mega-wall-2', title: 'Deep Dive', tags: ['Thylacine', 'Press'], durationSec: 360, aspect: '16:9', updatedAt: '2024-10-09T11:00:00Z', color: '#D32F2F', imageUrl: IMG.thylacine3 },

  // Megalodon – Wall 3 (9:16) — 3 assets
  { id: 'ancient-depths', endpointId: 'mega-wall-3', title: 'Ancient Depths', tags: ['Thylacine', 'Ambient'], durationSec: 1200, aspect: '9:16', updatedAt: '2024-10-08T09:00:00Z', color: '#37474F', imageUrl: IMG.thylacine1 },
  { id: 'ocean-timeline', endpointId: 'mega-wall-3', title: 'Ocean Timeline', tags: ['Investor'], durationSec: 300, aspect: '9:16', updatedAt: '2024-10-10T12:00:00Z', color: '#0288D1' },
  { id: 'fossil-record-vertical', endpointId: 'mega-wall-3', title: 'Fossil Record', tags: ['Press', 'Thylacine'], durationSec: 420, aspect: '9:16', updatedAt: '2024-10-11T14:00:00Z', color: '#8B6914', imageUrl: IMG.thylacine2 },

  // Social Den – Screen 1 (16:9) — 2 assets
  { id: 'partner-welcome', endpointId: 'social-screen-1', title: 'Partner Welcome', tags: ['Ambient'], durationSec: 120, aspect: '16:9', updatedAt: '2024-10-12T09:00:00Z', color: '#37474F' },
  { id: 'social-reel', endpointId: 'social-screen-1', title: 'Social Reel', tags: ['Press', 'Ambient'], durationSec: 180, aspect: '16:9', updatedAt: '2024-10-13T10:00:00Z', color: '#F57C00' },

  // Social Den – Screen 2 (4:3) — 2 assets
  { id: 'kids-corner', endpointId: 'social-screen-2', title: 'Kids Corner', tags: ['Kids', 'Ambient'], durationSec: 600, aspect: '4:3', updatedAt: '2024-09-15T12:00:00Z', color: '#E91E63', imageUrl: IMG.moa1 },
  { id: 'dino-discovery', endpointId: 'social-screen-2', title: 'Dino Discovery', tags: ['Kids'], durationSec: 480, aspect: '4:3', updatedAt: '2024-09-18T13:00:00Z', color: '#388E3C', imageUrl: IMG.moa2 },

  // Tour Path – Wall 1 (16:9) — 2 assets
  { id: 'press-reel', endpointId: 'tour-wall-1', title: 'Press Reel', tags: ['Press', 'Investor'], durationSec: 420, aspect: '16:9', updatedAt: '2024-10-11T14:00:00Z', color: '#4A148C', imageUrl: IMG.direwolf1 },
  { id: 'journey-intro', endpointId: 'tour-wall-1', title: 'Journey Intro', tags: ['Ambient', 'Press'], durationSec: 300, aspect: '16:9', updatedAt: '2024-10-12T10:00:00Z', color: '#A0522D' },

  // Tour Path – Wall 2 (16:9) — 3 assets
  { id: 'journey-highlight', endpointId: 'tour-wall-2', title: 'Journey Highlight', tags: ['Press'], durationSec: 360, aspect: '16:9', updatedAt: '2024-10-10T11:00:00Z', color: '#5B8FA8', imageUrl: IMG.direwolf2 },
  { id: 'migration-reel', endpointId: 'tour-wall-2', title: 'Migration Reel', tags: ['Ambient', 'Mammoth'], durationSec: 1800, aspect: '16:9', updatedAt: '2024-10-09T15:00:00Z', color: '#2E3D2F', imageUrl: IMG.mammoth1 },
  { id: 'tour-ambient-2', endpointId: 'tour-wall-2', title: 'Tour Ambient', tags: ['Ambient'], durationSec: 900, aspect: '16:9', updatedAt: '2024-10-08T12:00:00Z', color: '#6B7C4E' },

  // Tour Path – Wall 3 (16:9) — 2 assets
  { id: 'expedition-footage', endpointId: 'tour-wall-3', title: 'Expedition Footage', tags: ['Ambient', 'Press'], durationSec: 1200, aspect: '16:9', updatedAt: '2024-10-07T14:00:00Z', color: '#F57C00' },
  { id: 'discovery-reel', endpointId: 'tour-wall-3', title: 'Discovery Reel', tags: ['Press', 'Kids'], durationSec: 300, aspect: '16:9', updatedAt: '2024-10-06T11:00:00Z', color: '#D32F2F', imageUrl: IMG.moa1 },

  // C-Suite Nano – Screen 1 (16:9)
  { id: 'csn-ambient-1', endpointId: 'csn-screen-1', title: 'C-Suite Ambient', tags: ['Ambient', 'Investor'], durationSec: 1800, aspect: '16:9', updatedAt: '2024-10-15T09:00:00Z', color: '#1A237E' },

  // C-Suite Nano – Screen 2 (16:9)
  { id: 'csn-ambient-2', endpointId: 'csn-screen-2', title: 'Executive Highlight', tags: ['Investor'], durationSec: 300, aspect: '16:9', updatedAt: '2024-10-15T09:00:00Z', color: '#4A148C' },

  // C-Suite Nano – Screen 3 (9:16)
  { id: 'csn-ambient-3', endpointId: 'csn-screen-3', title: 'C-Suite Vertical', tags: ['Ambient'], durationSec: 900, aspect: '9:16', updatedAt: '2024-10-15T09:00:00Z', color: '#263238' },

  // C-Suite Floor Projections – Projector 1 (16:9)
  { id: 'csfp-ambient-1', endpointId: 'csfp-proj-1', title: 'Floor Projection A', tags: ['Ambient'], durationSec: 3600, aspect: '16:9', updatedAt: '2024-10-15T10:00:00Z', color: '#004D40' },

  // C-Suite Floor Projections – Projector 2 (16:9)
  { id: 'csfp-ambient-2', endpointId: 'csfp-proj-2', title: 'Floor Projection B', tags: ['Ambient'], durationSec: 3600, aspect: '16:9', updatedAt: '2024-10-15T10:00:00Z', color: '#1B5E20' },

  // C-Suite Floor Projections – Projector 3 (16:9)
  { id: 'csfp-ambient-3', endpointId: 'csfp-proj-3', title: 'Floor Projection C', tags: ['Ambient'], durationSec: 3600, aspect: '16:9', updatedAt: '2024-10-15T10:00:00Z', color: '#0D47A1' },
];

// ─── PLAYLISTS ─────────────────────────────────────────────────────────────────

export const mockPlaylists: Playlist[] = [
  // Lobby
  { id: 'lobby-default', name: 'Default', roomId: 'lobby', loop: true, items: [
    { endpointId: 'lobby-left-led', assetId: 'mammoth-loop', order: 0 },
    { endpointId: 'lobby-left-led', assetId: 'mammoth-highlight', order: 1 },
    { endpointId: 'lobby-left-led', assetId: 'lobby-brand-reel', order: 2 },
  ]},
  { id: 'lobby-origin-story', name: 'Origin Story', roomId: 'lobby', loop: false, items: [
    { endpointId: 'lobby-left-led', assetId: 'mammoth-highlight', order: 0 },
    { endpointId: 'lobby-left-led', assetId: 'mammoth-loop', order: 1 },
  ]},
  { id: 'lobby-specimen-archive', name: 'Specimen Archive', roomId: 'lobby', loop: true, items: [
    { endpointId: 'lobby-left-led', assetId: 'mammoth-loop', order: 0 },
  ]},

  // Automation Suite
  { id: 'auto-default', name: 'Default', roomId: 'automation-suite', loop: true, items: [
    { endpointId: 'auto-nano-1', assetId: 'dodo-walk', order: 0 },
    { endpointId: 'auto-nano-1', assetId: 'dodo-feature', order: 1 },
    { endpointId: 'auto-nano-2', assetId: 'process-showcase', order: 0 },
    { endpointId: 'auto-nano-2', assetId: 'lab-highlight', order: 1 },
  ]},
  { id: 'auto-fossil-record', name: 'Fossil Record', roomId: 'automation-suite', loop: true, items: [
    { endpointId: 'auto-nano-1', assetId: 'dodo-walk', order: 0 },
    { endpointId: 'auto-nano-1', assetId: 'auto-ambient-loop', order: 1 },
    { endpointId: 'auto-nano-2', assetId: 'process-showcase', order: 0 },
  ]},
  { id: 'auto-extinction-protocol', name: 'Extinction Protocol', roomId: 'automation-suite', loop: false, items: [
    { endpointId: 'auto-nano-1', assetId: 'dodo-feature', order: 0 },
    { endpointId: 'auto-nano-2', assetId: 'lab-highlight', order: 0 },
  ]},

  // Megalodon Room
  { id: 'mega-ambient', name: 'Ambient', roomId: 'megalodon-room', loop: true, items: [
    { endpointId: 'mega-wall-1', assetId: 'thylacine-day', order: 0 },
    { endpointId: 'mega-wall-1', assetId: 'investor-overview', order: 1 },
    { endpointId: 'mega-wall-2', assetId: 'thylacine-night', order: 0 },
    { endpointId: 'mega-wall-3', assetId: 'ancient-depths', order: 0 },
  ]},
  { id: 'mega-investor-story', name: 'Investor Story', roomId: 'megalodon-room', loop: false, items: [
    { endpointId: 'mega-wall-1', assetId: 'investor-overview', order: 0 },
    { endpointId: 'mega-wall-1', assetId: 'thylacine-day', order: 1 },
    { endpointId: 'mega-wall-2', assetId: 'thylacine-night', order: 0 },
    { endpointId: 'mega-wall-3', assetId: 'ocean-timeline', order: 0 },
  ]},
  { id: 'mega-wayfinding', name: 'Wayfinding', roomId: 'megalodon-room', loop: true, items: [
    { endpointId: 'mega-wall-1', assetId: 'thylacine-day', order: 0 },
    { endpointId: 'mega-wall-3', assetId: 'fossil-record-vertical', order: 0 },
  ]},
  { id: 'mega-deep-sea', name: 'Deep Sea', roomId: 'megalodon-room', loop: true, items: [
    { endpointId: 'mega-wall-1', assetId: 'mega-origin', order: 0 },
    { endpointId: 'mega-wall-2', assetId: 'deep-dive', order: 0 },
    { endpointId: 'mega-wall-3', assetId: 'ancient-depths', order: 0 },
    { endpointId: 'mega-wall-3', assetId: 'ocean-timeline', order: 1 },
  ]},

  // Social Den
  { id: 'social-default', name: 'Default', roomId: 'social-den', loop: true, items: [
    { endpointId: 'social-screen-1', assetId: 'partner-welcome', order: 0 },
    { endpointId: 'social-screen-1', assetId: 'social-reel', order: 1 },
    { endpointId: 'social-screen-2', assetId: 'kids-corner', order: 0 },
  ]},
  { id: 'social-synthesis-lab', name: 'Synthesis Lab', roomId: 'social-den', loop: true, items: [
    { endpointId: 'social-screen-1', assetId: 'partner-welcome', order: 0 },
    { endpointId: 'social-screen-2', assetId: 'dino-discovery', order: 0 },
  ]},
  { id: 'social-deep-time', name: 'Deep Time', roomId: 'social-den', loop: false, items: [
    { endpointId: 'social-screen-1', assetId: 'social-reel', order: 0 },
    { endpointId: 'social-screen-2', assetId: 'kids-corner', order: 0 },
    { endpointId: 'social-screen-2', assetId: 'dino-discovery', order: 1 },
  ]},

  // Tour Path
  { id: 'tour-default', name: 'Default', roomId: 'tour-path', loop: true, items: [
    { endpointId: 'tour-wall-1', assetId: 'press-reel', order: 0 },
    { endpointId: 'tour-wall-1', assetId: 'journey-intro', order: 1 },
    { endpointId: 'tour-wall-2', assetId: 'migration-reel', order: 0 },
    { endpointId: 'tour-wall-3', assetId: 'expedition-footage', order: 0 },
  ]},
  { id: 'tour-migration-path', name: 'Migration Path', roomId: 'tour-path', loop: false, items: [
    { endpointId: 'tour-wall-1', assetId: 'press-reel', order: 0 },
    { endpointId: 'tour-wall-2', assetId: 'journey-highlight', order: 0 },
    { endpointId: 'tour-wall-2', assetId: 'migration-reel', order: 1 },
    { endpointId: 'tour-wall-3', assetId: 'discovery-reel', order: 0 },
  ]},
  { id: 'tour-extinction-event', name: 'Extinction Event', roomId: 'tour-path', loop: true, items: [
    { endpointId: 'tour-wall-1', assetId: 'journey-intro', order: 0 },
    { endpointId: 'tour-wall-2', assetId: 'tour-ambient-2', order: 0 },
    { endpointId: 'tour-wall-3', assetId: 'expedition-footage', order: 0 },
    { endpointId: 'tour-wall-3', assetId: 'discovery-reel', order: 1 },
  ]},

  // C-Suite Nano
  { id: 'csn-default', name: 'Default', roomId: 'c-suite-nano', loop: true, items: [
    { endpointId: 'csn-screen-1', assetId: 'csn-ambient-1', order: 0 },
    { endpointId: 'csn-screen-2', assetId: 'csn-ambient-2', order: 0 },
    { endpointId: 'csn-screen-3', assetId: 'csn-ambient-3', order: 0 },
  ]},

  // C-Suite Floor Projections
  { id: 'csfp-default', name: 'Default', roomId: 'c-suite-floor', loop: true, items: [
    { endpointId: 'csfp-proj-1', assetId: 'csfp-ambient-1', order: 0 },
    { endpointId: 'csfp-proj-2', assetId: 'csfp-ambient-2', order: 0 },
    { endpointId: 'csfp-proj-3', assetId: 'csfp-ambient-3', order: 0 },
  ]},
];

// ─── ROOMS ─────────────────────────────────────────────────────────────────────

export const mockRooms: Room[] = [
  { id: 'lobby', name: 'Lobby', endpointIds: ['lobby-left-led'] },
  { id: 'automation-suite', name: 'Automation Suite', endpointIds: ['auto-nano-1', 'auto-nano-2'] },
  { id: 'megalodon-room', name: 'Megalodon Room', endpointIds: ['mega-wall-1', 'mega-wall-2', 'mega-wall-3'] },
  { id: 'social-den', name: 'Social Den', endpointIds: ['social-screen-1', 'social-screen-2'] },
  { id: 'tour-path', name: 'Tour Path', endpointIds: ['tour-wall-1', 'tour-wall-2', 'tour-wall-3'] },
  { id: 'c-suite-nano', name: 'C-Suite Nano', endpointIds: ['csn-screen-1', 'csn-screen-2', 'csn-screen-3'] },
  { id: 'c-suite-floor', name: 'C-Suite Floor Projections', endpointIds: ['csfp-proj-1', 'csfp-proj-2', 'csfp-proj-3'] },
];

// ─── ENDPOINTS ─────────────────────────────────────────────────────────────────

export const mockEndpoints: Endpoint[] = [
  { id: 'lobby-left-led', name: 'Lobby – LED Wall', roomId: 'lobby', aspectRatio: '16:9', type: 'playlist', status: 'playing', defaultMode: 'ambient', nowPlaying: { mode: 'playlist', playlistId: 'lobby-default', positionSec: 120, currentItemIndex: 0 }, supports: { playPause: true, restart: true, loop: true, skip: true, brightness: false }, loop: true, brightness: 100 },
  { id: 'auto-nano-1', name: 'Automation – Screen 1', roomId: 'automation-suite', aspectRatio: '16:9', type: 'playlist', status: 'playing', defaultMode: 'ambient', nowPlaying: { mode: 'playlist', playlistId: 'auto-default', positionSec: 0, currentItemIndex: 0 }, supports: { playPause: true, restart: true, loop: true, skip: true, brightness: true }, loop: true, brightness: 80 },
  { id: 'auto-nano-2', name: 'Automation – Screen 2', roomId: 'automation-suite', aspectRatio: '16:9', type: 'playlist', status: 'playing', defaultMode: 'ambient', nowPlaying: { mode: 'playlist', playlistId: 'auto-default', positionSec: 0, currentItemIndex: 0 }, supports: { playPause: true, restart: true, loop: true, skip: true, brightness: true }, loop: true, brightness: 80 },
  { id: 'mega-wall-1', name: 'Megalodon – Wall 1', roomId: 'megalodon-room', aspectRatio: '16:9', type: 'playlist', status: 'playing', defaultMode: 'ambient', nowPlaying: { mode: 'playlist', playlistId: 'mega-ambient', positionSec: 0, currentItemIndex: 0 }, supports: { playPause: true, restart: true, loop: true, skip: true, brightness: false }, loop: true, brightness: 100 },
  { id: 'mega-wall-2', name: 'Megalodon – Wall 2', roomId: 'megalodon-room', aspectRatio: '16:9', type: 'playlist', status: 'playing', defaultMode: 'ambient', nowPlaying: { mode: 'playlist', playlistId: 'mega-ambient', positionSec: 0, currentItemIndex: 0 }, supports: { playPause: true, restart: true, loop: true, skip: true, brightness: false }, loop: true, brightness: 100 },
  { id: 'mega-wall-3', name: 'Megalodon – Wall 3', roomId: 'megalodon-room', aspectRatio: '9:16', type: 'playlist', status: 'playing', defaultMode: 'ambient', nowPlaying: { mode: 'playlist', playlistId: 'mega-ambient', positionSec: 0, currentItemIndex: 0 }, supports: { playPause: true, restart: true, loop: true, skip: true, brightness: false }, loop: true, brightness: 100 },
  { id: 'social-screen-1', name: 'Social Den – Screen 1', roomId: 'social-den', aspectRatio: '16:9', type: 'playlist', status: 'playing', defaultMode: 'ambient', nowPlaying: { mode: 'playlist', playlistId: 'social-default', positionSec: 10, currentItemIndex: 0 }, supports: { playPause: true, restart: true, loop: true, skip: true, brightness: false }, loop: true, brightness: 100 },
  { id: 'social-screen-2', name: 'Social Den – Screen 2', roomId: 'social-den', aspectRatio: '4:3', type: 'playlist', status: 'playing', defaultMode: 'ambient', nowPlaying: { mode: 'playlist', playlistId: 'social-default', positionSec: 10, currentItemIndex: 0 }, supports: { playPause: true, restart: true, loop: true, skip: true, brightness: false }, loop: true, brightness: 100 },
  { id: 'tour-wall-1', name: 'Tour Path – Wall 1', roomId: 'tour-path', aspectRatio: '16:9', type: 'playlist', status: 'playing', defaultMode: 'ambient', nowPlaying: { mode: 'playlist', playlistId: 'tour-default', positionSec: 600, currentItemIndex: 0 }, supports: { playPause: true, restart: true, loop: true, skip: true, brightness: false }, loop: true, brightness: 100 },
  { id: 'tour-wall-2', name: 'Tour Path – Wall 2', roomId: 'tour-path', aspectRatio: '16:9', type: 'playlist', status: 'playing', defaultMode: 'ambient', nowPlaying: { mode: 'playlist', playlistId: 'tour-default', positionSec: 600, currentItemIndex: 0 }, supports: { playPause: true, restart: true, loop: true, skip: true, brightness: false }, loop: true, brightness: 100 },
  { id: 'tour-wall-3', name: 'Tour Path – Wall 3', roomId: 'tour-path', aspectRatio: '16:9', type: 'playlist', status: 'playing', defaultMode: 'ambient', nowPlaying: { mode: 'playlist', playlistId: 'tour-default', positionSec: 600, currentItemIndex: 0 }, supports: { playPause: true, restart: true, loop: true, skip: true, brightness: false }, loop: true, brightness: 100 },
  { id: 'csn-screen-1', name: 'C-Suite Nano – Screen 1', roomId: 'c-suite-nano', aspectRatio: '16:9', type: 'playlist', status: 'playing', defaultMode: 'ambient', nowPlaying: { mode: 'playlist', playlistId: 'csn-default', positionSec: 0, currentItemIndex: 0 }, supports: { playPause: true, restart: true, loop: true, skip: true, brightness: true }, loop: true, brightness: 100 },
  { id: 'csn-screen-2', name: 'C-Suite Nano – Screen 2', roomId: 'c-suite-nano', aspectRatio: '16:9', type: 'playlist', status: 'playing', defaultMode: 'ambient', nowPlaying: { mode: 'playlist', playlistId: 'csn-default', positionSec: 0, currentItemIndex: 0 }, supports: { playPause: true, restart: true, loop: true, skip: true, brightness: true }, loop: true, brightness: 100 },
  { id: 'csn-screen-3', name: 'C-Suite Nano – Screen 3', roomId: 'c-suite-nano', aspectRatio: '9:16', type: 'playlist', status: 'playing', defaultMode: 'ambient', nowPlaying: { mode: 'playlist', playlistId: 'csn-default', positionSec: 0, currentItemIndex: 0 }, supports: { playPause: true, restart: true, loop: true, skip: true, brightness: true }, loop: true, brightness: 100 },
  { id: 'csfp-proj-1', name: 'C-Suite Floor – Projector 1', roomId: 'c-suite-floor', aspectRatio: '16:9', type: 'playlist', status: 'playing', defaultMode: 'ambient', nowPlaying: { mode: 'playlist', playlistId: 'csfp-default', positionSec: 0, currentItemIndex: 0 }, supports: { playPause: true, restart: true, loop: true, skip: true, brightness: true }, loop: true, brightness: 100 },
  { id: 'csfp-proj-2', name: 'C-Suite Floor – Projector 2', roomId: 'c-suite-floor', aspectRatio: '16:9', type: 'playlist', status: 'playing', defaultMode: 'ambient', nowPlaying: { mode: 'playlist', playlistId: 'csfp-default', positionSec: 0, currentItemIndex: 0 }, supports: { playPause: true, restart: true, loop: true, skip: true, brightness: true }, loop: true, brightness: 100 },
  { id: 'csfp-proj-3', name: 'C-Suite Floor – Projector 3', roomId: 'c-suite-floor', aspectRatio: '16:9', type: 'playlist', status: 'playing', defaultMode: 'ambient', nowPlaying: { mode: 'playlist', playlistId: 'csfp-default', positionSec: 0, currentItemIndex: 0 }, supports: { playPause: true, restart: true, loop: true, skip: true, brightness: true }, loop: true, brightness: 100 },
];

// ─── PRESETS ───────────────────────────────────────────────────────────────────

export const mockPresets: Preset[] = [
  {
    id: 'investor-day',
    name: 'Investor Day',
    description: 'Megalodon runs Investor Story; Lobby and Social Den play Default.',
    changes: [
      { endpointId: 'mega-wall-1', mode: 'playlist', playlistId: 'mega-investor-story', playlistIds: ['mega-investor-story'], status: 'playing' },
      { endpointId: 'mega-wall-2', mode: 'playlist', playlistId: 'mega-investor-story', playlistIds: ['mega-investor-story'], status: 'playing' },
      { endpointId: 'mega-wall-3', mode: 'playlist', playlistId: 'mega-investor-story', playlistIds: ['mega-investor-story'], status: 'playing' },
      { endpointId: 'lobby-left-led', mode: 'playlist', playlistId: 'lobby-default', playlistIds: ['lobby-default'], status: 'playing' },
      { endpointId: 'social-screen-1', mode: 'playlist', playlistId: 'social-default', playlistIds: ['social-default'], status: 'playing' },
      { endpointId: 'social-screen-2', mode: 'playlist', playlistId: 'social-default', playlistIds: ['social-default'], status: 'playing' },
    ],
  },
  {
    id: 'press-tour',
    name: 'Press Tour',
    description: 'Tour Path runs Migration Path; Social Den plays Synthesis Lab; Lobby stays Default.',
    changes: [
      { endpointId: 'tour-wall-1', mode: 'playlist', playlistId: 'tour-migration-path', playlistIds: ['tour-migration-path'], status: 'playing' },
      { endpointId: 'tour-wall-2', mode: 'playlist', playlistId: 'tour-migration-path', playlistIds: ['tour-migration-path'], status: 'playing' },
      { endpointId: 'tour-wall-3', mode: 'playlist', playlistId: 'tour-migration-path', playlistIds: ['tour-migration-path'], status: 'playing' },
      { endpointId: 'social-screen-1', mode: 'playlist', playlistId: 'social-synthesis-lab', playlistIds: ['social-synthesis-lab'], status: 'playing' },
      { endpointId: 'social-screen-2', mode: 'playlist', playlistId: 'social-synthesis-lab', playlistIds: ['social-synthesis-lab'], status: 'playing' },
      { endpointId: 'lobby-left-led', mode: 'playlist', playlistId: 'lobby-default', playlistIds: ['lobby-default'], status: 'playing' },
    ],
  },
  {
    id: 'after-hours',
    name: 'After Hours',
    description: 'Pauses non-essential screens; Lobby loops Default.',
    changes: [
      { endpointId: 'mega-wall-1', mode: 'playlist', playlistId: 'mega-ambient', playlistIds: ['mega-ambient'], status: 'paused' },
      { endpointId: 'mega-wall-2', mode: 'playlist', playlistId: 'mega-ambient', playlistIds: ['mega-ambient'], status: 'paused' },
      { endpointId: 'mega-wall-3', mode: 'playlist', playlistId: 'mega-ambient', playlistIds: ['mega-ambient'], status: 'paused' },
      { endpointId: 'auto-nano-1', mode: 'playlist', playlistId: 'auto-default', playlistIds: ['auto-default'], status: 'offline' },
      { endpointId: 'auto-nano-2', mode: 'playlist', playlistId: 'auto-default', playlistIds: ['auto-default'], status: 'offline' },
      { endpointId: 'social-screen-1', mode: 'playlist', playlistId: 'social-default', playlistIds: ['social-default'], status: 'paused' },
      { endpointId: 'social-screen-2', mode: 'playlist', playlistId: 'social-default', playlistIds: ['social-default'], status: 'paused' },
      { endpointId: 'lobby-left-led', mode: 'playlist', playlistId: 'lobby-default', playlistIds: ['lobby-default'], status: 'playing' },
      { endpointId: 'tour-wall-1', mode: 'playlist', playlistId: 'tour-default', playlistIds: ['tour-default'], status: 'offline' },
      { endpointId: 'tour-wall-2', mode: 'playlist', playlistId: 'tour-default', playlistIds: ['tour-default'], status: 'offline' },
      { endpointId: 'tour-wall-3', mode: 'playlist', playlistId: 'tour-default', playlistIds: ['tour-default'], status: 'offline' },
    ],
  },
  {
    id: 'general-tour',
    name: 'General Tour',
    description: 'Tour Path plays Default; all other rooms play their Default playlists.',
    changes: [
      { endpointId: 'tour-wall-1', mode: 'playlist', playlistId: 'tour-default', playlistIds: ['tour-default'], status: 'playing' },
      { endpointId: 'tour-wall-2', mode: 'playlist', playlistId: 'tour-default', playlistIds: ['tour-default'], status: 'playing' },
      { endpointId: 'tour-wall-3', mode: 'playlist', playlistId: 'tour-default', playlistIds: ['tour-default'], status: 'playing' },
      { endpointId: 'mega-wall-1', mode: 'playlist', playlistId: 'mega-ambient', playlistIds: ['mega-ambient'], status: 'playing' },
      { endpointId: 'mega-wall-2', mode: 'playlist', playlistId: 'mega-ambient', playlistIds: ['mega-ambient'], status: 'playing' },
      { endpointId: 'mega-wall-3', mode: 'playlist', playlistId: 'mega-ambient', playlistIds: ['mega-ambient'], status: 'playing' },
      { endpointId: 'lobby-left-led', mode: 'playlist', playlistId: 'lobby-default', playlistIds: ['lobby-default'], status: 'playing' },
      { endpointId: 'social-screen-1', mode: 'playlist', playlistId: 'social-default', playlistIds: ['social-default'], status: 'playing' },
      { endpointId: 'social-screen-2', mode: 'playlist', playlistId: 'social-default', playlistIds: ['social-default'], status: 'playing' },
      { endpointId: 'auto-nano-1', mode: 'playlist', playlistId: 'auto-default', playlistIds: ['auto-default'], status: 'playing' },
      { endpointId: 'auto-nano-2', mode: 'playlist', playlistId: 'auto-default', playlistIds: ['auto-default'], status: 'playing' },
    ],
  },
];

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────

export const ALL_TAGS = ['Mammoth', 'Dodo', 'Thylacine', 'Ambient', 'Investor', 'Press', 'Kids'];

export const ROOM_SCREEN_COUNT: Record<string, number> = {
  lobby: 1,
  'automation-suite': 2,
  'megalodon-room': 3,
  'social-den': 2,
  'tour-path': 3,
  'c-suite-nano': 3,
  'c-suite-floor': 3,
};
