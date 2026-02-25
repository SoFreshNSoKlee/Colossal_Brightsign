import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ListMusic, Film } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { NeoCard } from '../components/design-system/NeoCard';
import { NeoButton } from '../components/design-system/NeoButton';
import { useApp } from '../context/AppContext';
import { ALL_TAGS } from '../mock/data';

type LibTab = 'assets' | 'playlists';

function formatDuration(sec: number): string {
  if (sec >= 3600) return `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`;
  if (sec >= 60) return `${Math.floor(sec / 60)}m`;
  return `${sec}s`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function Library() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<LibTab>('assets');
  const [search, setSearch] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const filteredAssets = state.assets.filter((a) => {
    const matchSearch =
      !search || a.title.toLowerCase().includes(search.toLowerCase());
    const matchTags =
      activeTags.length === 0 || activeTags.every((t) => a.tags.includes(t));
    return matchSearch && matchTags;
  });

  const filteredPlaylists = state.playlists.filter((pl) => {
    const matchSearch =
      !search || pl.name.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <Layout title="Library">
      <div className="space-y-4 px-2 pt-2">
        {/* ── Tabs ── */}
        <div className="flex gap-2 neo-surface shadow-neo-inset rounded-neo-pill p-1">
          {(['assets', 'playlists'] as LibTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                'flex-1 flex items-center justify-center gap-2 py-2 rounded-neo-pill text-sm font-semibold transition-all capitalize',
                tab === t
                  ? 'neo-surface shadow-neo text-neo-accent'
                  : 'text-neo-muted hover:text-neo-text',
              ].join(' ')}
            >
              {t === 'assets' ? <Film size={15} /> : <ListMusic size={15} />}
              {t === 'assets' ? 'Assets' : 'Playlists'}
            </button>
          ))}
        </div>

        {/* ── Search ── */}
        <div className="relative">
          <Search
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neo-muted pointer-events-none"
          />
          <input
            type="text"
            placeholder={`Search ${tab}…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-neo-pill neo-surface shadow-neo-inner text-sm text-neo-text placeholder:text-neo-muted focus:outline-none"
          />
        </div>

        {/* ── Tag filters (assets only) ── */}
        {tab === 'assets' && (
          <div className="flex flex-wrap gap-1.5">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={[
                  'px-3 py-1.5 rounded-neo-pill text-xs font-semibold transition-all',
                  activeTags.includes(tag)
                    ? 'bg-neo-accent text-white shadow-neo-sm'
                    : 'neo-surface shadow-neo-sm text-neo-muted hover:text-neo-text',
                ].join(' ')}
              >
                {tag}
              </button>
            ))}
            {activeTags.length > 0 && (
              <button
                onClick={() => setActiveTags([])}
                className="px-3 py-1.5 rounded-neo-pill text-xs font-semibold text-neo-muted hover:text-red-500 transition-colors"
              >
                Clear ×
              </button>
            )}
          </div>
        )}

        {/* ── Asset grid ── */}
        {tab === 'assets' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredAssets.map((asset) => (
              <NeoCard key={asset.id}>
                {/* Thumbnail */}
                <div
                  className="w-full h-28 rounded-neo-sm mb-3 shadow-neo-inner flex items-center justify-center"
                  style={{ backgroundColor: asset.color }}
                >
                  <span className="text-white/50 font-bold text-sm">
                    {asset.aspect}
                  </span>
                </div>

                {/* Info */}
                <div className="font-bold text-neo-text text-sm">{asset.title}</div>
                <div className="text-xs text-neo-muted mt-0.5">
                  {formatDuration(asset.durationSec)} · Updated {formatDate(asset.updatedAt)}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {asset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-neo-pill bg-neo-accent-light text-neo-accent font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </NeoCard>
            ))}
            {filteredAssets.length === 0 && (
              <div className="col-span-2 py-12 text-center text-neo-muted">
                No assets match your search.
              </div>
            )}
          </div>
        )}

        {/* ── Playlist list ── */}
        {tab === 'playlists' && (
          <div className="space-y-3">
            {filteredPlaylists.map((pl) => {
              const runtime = pl.items.reduce((sum, item) => {
                const a = state.assets.find((a) => a.id === item.assetId);
                return sum + (a?.durationSec ?? 0);
              }, 0);

              return (
                <NeoCard key={pl.id} className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-neo-sm bg-neo-accent-light shadow-neo-inner flex items-center justify-center flex-shrink-0">
                    <ListMusic size={22} className="text-neo-accent" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-neo-text text-sm">{pl.name}</div>
                    <div className="text-xs text-neo-muted mt-0.5">
                      {pl.items.length} tracks · {formatDuration(runtime)}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <span
                        className={[
                          'text-[10px] px-2 py-0.5 rounded-neo-pill font-semibold',
                          pl.loop
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700',
                        ].join(' ')}
                      >
                        {pl.loop ? 'Loop' : 'Once'}
                      </span>
                    </div>
                  </div>

                  {/* Edit button */}
                  <NeoButton
                    size="sm"
                    onClick={() => navigate(`/playlists/${pl.id}/edit`)}
                  >
                    Edit
                  </NeoButton>
                </NeoCard>
              );
            })}
            {filteredPlaylists.length === 0 && (
              <div className="py-12 text-center text-neo-muted">
                No playlists found.
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
