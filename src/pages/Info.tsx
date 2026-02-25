import { Layout } from '../components/layout/Layout';
import { Building2, ListMusic, Film, Monitor, ChevronRight, ArrowDown } from 'lucide-react';

const hierarchyLevels = [
  {
    Icon: Building2,
    label: 'Room',
    color: 'bg-violet-500',
    lightColor: 'bg-violet-100 dark:bg-violet-900/30',
    textColor: 'text-violet-700 dark:text-violet-300',
    borderColor: 'border-violet-300 dark:border-violet-700',
    description:
      'A physical space in the Colossal facility — such as the Lobby, Automation Suite, or Megalodon Room. Each room contains one or more Endpoints and has its own set of Playlists.',
    examples: ['Lobby', 'Automation Suite', 'Megalodon Room', 'Social Den', 'Tour Path'],
  },
  {
    Icon: ListMusic,
    label: 'Playlist',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-300 dark:border-blue-700',
    description:
      'A room-scoped, ordered collection of Assets. Playlists are assigned per Endpoint within the room, allowing each screen in a room to show different content within the same playlist.',
    examples: ['Default', 'Investor Story', 'Migration Path', 'Fossil Record'],
  },
  {
    Icon: Film,
    label: 'Asset',
    color: 'bg-emerald-500',
    lightColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    borderColor: 'border-emerald-300 dark:border-emerald-700',
    description:
      'A single piece of media content — a video, image, or animation — assigned to a specific Endpoint. Each Asset inherits the aspect ratio of its assigned Endpoint.',
    examples: ['Mammoth Loop', 'Dodo Walk', 'Investor Overview', 'Press Reel'],
  },
  {
    Icon: Monitor,
    label: 'Endpoint',
    color: 'bg-orange-500',
    lightColor: 'bg-orange-100 dark:bg-orange-900/30',
    textColor: 'text-orange-700 dark:text-orange-300',
    borderColor: 'border-orange-300 dark:border-orange-700',
    description:
      'An individual display or screen within a Room — a BrightSign-powered LED wall, LCD panel, or kiosk. Each Endpoint has a fixed aspect ratio and can play a single Asset or a full Playlist.',
    examples: ['Lobby – Left LED Wall', 'Megalodon – Wall 1', 'Tour Path – Wall 2'],
  },
];

const relationships = [
  {
    from: 'Room',
    to: 'Playlist',
    fromColor: 'text-violet-600',
    toColor: 'text-blue-600',
    description: 'A Room owns multiple Playlists, each scoped to that room.',
  },
  {
    from: 'Room',
    to: 'Endpoint',
    fromColor: 'text-violet-600',
    toColor: 'text-orange-600',
    description: 'A Room contains one or more Endpoints (physical screens).',
  },
  {
    from: 'Playlist',
    to: 'Asset',
    fromColor: 'text-blue-600',
    toColor: 'text-emerald-600',
    description: 'A Playlist holds an ordered list of Assets, per Endpoint.',
  },
  {
    from: 'Asset',
    to: 'Endpoint',
    fromColor: 'text-emerald-600',
    toColor: 'text-orange-600',
    description: 'Each Asset is assigned to one Endpoint and matches its aspect ratio.',
  },
];

export function Info() {
  return (
    <Layout title="Info">
      <div className="space-y-6 px-2 pt-2 pb-4">

        {/* ── Intro ── */}
        <div className="rounded-neo p-5 neo-surface shadow-neo">
          <h2 className="font-headline text-lg font-bold text-neo-text mb-2">
            System Hierarchy
          </h2>
          <p className="text-sm text-neo-muted leading-relaxed">
            Colossal HQ organises all AV content into a four-level hierarchy. Understanding
            how Rooms, Playlists, Assets, and Endpoints relate to each other makes it easy
            to control every screen in the facility.
          </p>
        </div>

        {/* ── Visual Hierarchy Diagram ── */}
        <div className="rounded-neo p-5 neo-surface shadow-neo">
          <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-4">
            Hierarchy Overview
          </p>
          <div className="flex flex-col items-center gap-1">
            {hierarchyLevels.map((level, i) => (
              <div key={level.label} className="w-full flex flex-col items-center">
                <div
                  className={[
                    'w-full max-w-sm flex items-center gap-3 px-4 py-3 rounded-neo-sm border',
                    level.lightColor,
                    level.borderColor,
                  ].join(' ')}
                >
                  <div className={`w-9 h-9 rounded-neo-sm ${level.color} flex items-center justify-center flex-shrink-0`}>
                    <level.Icon size={18} className="text-white" />
                  </div>
                  <span className={`text-sm font-bold ${level.textColor}`}>{level.label}</span>
                  {i < hierarchyLevels.length - 1 && (
                    <div className="ml-auto flex items-center gap-1 text-xs text-neo-muted">
                      <span>contains</span>
                      <ChevronRight size={12} />
                    </div>
                  )}
                </div>
                {i < hierarchyLevels.length - 1 && (
                  <div className="flex items-center justify-center py-1">
                    <ArrowDown size={16} className="text-neo-dark" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Level Cards ── */}
        <div>
          <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-3 px-1">
            Element Descriptions
          </p>
          <div className="space-y-3">
            {hierarchyLevels.map((level) => (
              <div
                key={level.label}
                className={[
                  'rounded-neo p-4 border',
                  level.lightColor,
                  level.borderColor,
                ].join(' ')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-neo-sm ${level.color} flex items-center justify-center flex-shrink-0`}>
                    <level.Icon size={20} className="text-white" />
                  </div>
                  <h3 className={`font-headline text-base font-bold ${level.textColor}`}>
                    {level.label}
                  </h3>
                </div>
                <p className="text-sm text-neo-text leading-relaxed mb-3">
                  {level.description}
                </p>
                <div>
                  <p className="text-[10px] font-semibold text-neo-muted uppercase tracking-widest mb-1.5">
                    Examples
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {level.examples.map((ex) => (
                      <span
                        key={ex}
                        className={[
                          'text-[11px] px-2.5 py-1 rounded-neo-pill font-semibold border',
                          level.textColor,
                          level.borderColor,
                        ].join(' ')}
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Relationships ── */}
        <div className="rounded-neo p-5 neo-surface shadow-neo">
          <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-3">
            Key Relationships
          </p>
          <div className="space-y-3">
            {relationships.map((rel) => (
              <div
                key={`${rel.from}-${rel.to}`}
                className="flex items-start gap-3 p-3 rounded-neo-sm neo-surface shadow-neo-inner"
              >
                <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                  <span className={`text-xs font-bold ${rel.fromColor}`}>{rel.from}</span>
                  <ChevronRight size={12} className="text-neo-muted" />
                  <span className={`text-xs font-bold ${rel.toColor}`}>{rel.to}</span>
                </div>
                <p className="text-xs text-neo-muted leading-relaxed">{rel.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Preset callout ── */}
        <div className="rounded-neo p-4 neo-surface shadow-neo border border-neo-accent/20">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-neo-sm bg-neo-accent flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold font-headline">P</span>
            </div>
            <div>
              <h3 className="font-headline text-sm font-bold text-neo-text mb-1">Presets</h3>
              <p className="text-sm text-neo-muted leading-relaxed">
                Presets are saved configurations that set multiple Endpoints across all Rooms
                to specific content in one tap — ideal for Investor Day, Press Tours, or After Hours.
                They sit above the hierarchy and orchestrate all four elements simultaneously.
              </p>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
