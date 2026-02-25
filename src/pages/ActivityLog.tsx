import { Layout } from '../components/layout/Layout';
import { NeoCard } from '../components/design-system/NeoCard';
import { NeoButton } from '../components/design-system/NeoButton';
import { useApp } from '../context/AppContext';

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-indigo-100 text-indigo-700',
  operator: 'bg-blue-100 text-blue-700',
  viewer: 'bg-gray-100 text-gray-700',
};

const ACTION_ICONS: Record<string, string> = {
  Play: '▶',
  Pause: '⏸',
  Restart: '↺',
  'Skip Next': '⏭',
  'Skip Prev': '⏮',
  'Swap Asset': '🔄',
  'Choose Playlist': '📋',
  'Set Ambient': '🌿',
  'Return to Default': '⏎',
  'Loop On': '🔁',
  'Loop Off': '➡',
  'Run Investor Once': '💼',
  'Apply Preset': '⚙',
  'Tour Theme': '🎨',
  'Sync On': '🔗',
  'Sync Off': '🔓',
  'Add to Playlist': '+',
  'Remove from Playlist': '−',
  'Reorder Playlist': '↕',
};

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function ActivityLog() {
  const { state } = useApp();

  const reversedLog = [...state.auditLog].reverse();

  // Group by date
  const grouped: Record<string, typeof reversedLog> = {};
  reversedLog.forEach((entry) => {
    const dateKey = formatDate(entry.timestamp);
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(entry);
  });

  return (
    <Layout title="Activity Log">
      <div className="space-y-4 px-2 pt-2">
        {state.auditLog.length === 0 ? (
          <NeoCard className="py-16 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-neo-muted font-medium">No activity yet.</p>
            <p className="text-xs text-neo-muted mt-1">
              Actions you take will appear here.
            </p>
          </NeoCard>
        ) : (
          <>
            {/* Count badge */}
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest">
                {state.auditLog.length} event{state.auditLog.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Grouped timeline */}
            {Object.entries(grouped).map(([date, entries]) => (
              <div key={date}>
                <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-2 px-1">
                  {date}
                </p>
                <div className="space-y-2">
                  {entries.map((entry) => {
                    const icon = Object.entries(ACTION_ICONS).find(([key]) =>
                      entry.action.startsWith(key),
                    )?.[1] ?? '•';

                    return (
                      <NeoCard key={entry.id} padding="sm">
                        <div className="flex items-start gap-3">
                          {/* Action icon */}
                          <div className="w-9 h-9 rounded-neo-pill neo-surface shadow-neo-sm flex items-center justify-center text-base flex-shrink-0">
                            {icon}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-neo-text">
                                {entry.action}
                              </span>
                              <span
                                className={[
                                  'text-[10px] px-2 py-0.5 rounded-neo-pill font-semibold capitalize',
                                  ROLE_COLORS[entry.userRole] ?? ROLE_COLORS.viewer,
                                ].join(' ')}
                              >
                                {entry.userRole}
                              </span>
                            </div>

                            {/* Targets */}
                            {entry.targets.length > 0 && (
                              <div className="text-xs text-neo-muted mt-0.5 truncate">
                                {entry.targets.join(', ')}
                              </div>
                            )}

                            {/* Details */}
                            {entry.details && (
                              <div className="text-xs text-neo-muted mt-0.5">
                                {entry.details}
                              </div>
                            )}

                            {/* Time */}
                            <div className="text-[10px] text-neo-darker mt-1 font-mono">
                              {formatTimestamp(entry.timestamp)}
                            </div>
                          </div>
                        </div>
                      </NeoCard>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </Layout>
  );
}
