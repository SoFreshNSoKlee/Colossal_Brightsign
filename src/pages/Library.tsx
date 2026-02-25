import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ListMusic, Film, Plus, Pencil, Trash2, X } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { NeoCard } from '../components/design-system/NeoCard';
import { NeoButton } from '../components/design-system/NeoButton';
import { BottomSheetModal } from '../components/design-system/BottomSheetModal';
import { useApp } from '../context/AppContext';
import { ALL_TAGS } from '../mock/data';
import type { Asset } from '../types';

type LibTab = 'assets' | 'playlists';

const ASPECT_OPTIONS = ['16:9', '4:3', '9:16', '1:1'];
const COLOR_SWATCHES = [
  '#8B6914', '#A0522D', '#5B8FA8', '#3A7CA5', '#6B7C4E',
  '#2E3D2F', '#1A237E', '#E91E63', '#37474F', '#4A148C',
  '#D32F2F', '#388E3C', '#0288D1', '#F57C00', '#5D4037',
];

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

function parseDurationInput(val: string): number {
  // Accepts: "3600", "60m", "1h", "1h30m", "90s"
  const raw = val.trim().toLowerCase();
  if (!raw) return 0;
  let total = 0;
  const hMatch = raw.match(/(\d+)h/);
  const mMatch = raw.match(/(\d+)m/);
  const sMatch = raw.match(/(\d+)s/);
  if (hMatch) total += parseInt(hMatch[1]) * 3600;
  if (mMatch) total += parseInt(mMatch[1]) * 60;
  if (sMatch) total += parseInt(sMatch[1]);
  if (!hMatch && !mMatch && !sMatch) total = parseInt(raw) || 0;
  return total;
}

function formatDurationForInput(sec: number): string {
  if (!sec) return '';
  if (sec % 3600 === 0) return `${sec / 3600}h`;
  if (sec % 60 === 0) return `${sec / 60}m`;
  return `${sec}s`;
}

type AssetFormState = {
  title: string;
  tags: string[];
  durationInput: string;
  aspect: string;
  color: string;
};

function defaultAssetForm(asset?: Asset): AssetFormState {
  return {
    title: asset?.title ?? '',
    tags: asset?.tags ?? [],
    durationInput: asset ? formatDurationForInput(asset.durationSec) : '',
    aspect: asset?.aspect ?? '16:9',
    color: asset?.color ?? COLOR_SWATCHES[0],
  };
}

export function Library() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<LibTab>('assets');
  const [search, setSearch] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // Asset modal state
  const [assetModal, setAssetModal] = useState<'create' | 'edit' | null>(null);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [assetForm, setAssetForm] = useState<AssetFormState>(defaultAssetForm());

  // Playlist modal state
  const [playlistModal, setPlaylistModal] = useState<'create' | null>(null);
  const [plName, setPlName] = useState('');
  const [plLoop, setPlLoop] = useState(true);

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

  // ── Asset modal handlers ──

  const openCreateAsset = () => {
    setAssetForm(defaultAssetForm());
    setEditingAssetId(null);
    setAssetModal('create');
  };

  const openEditAsset = (asset: Asset) => {
    setAssetForm(defaultAssetForm(asset));
    setEditingAssetId(asset.id);
    setAssetModal('edit');
  };

  const closeAssetModal = () => {
    setAssetModal(null);
    setEditingAssetId(null);
  };

  const toggleFormTag = (tag: string) => {
    setAssetForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const saveAsset = () => {
    const durationSec = parseDurationInput(assetForm.durationInput);
    if (!assetForm.title.trim()) return;
    if (assetModal === 'create') {
      dispatch({
        type: 'CREATE_ASSET',
        asset: {
          title: assetForm.title.trim(),
          tags: assetForm.tags,
          durationSec,
          aspect: assetForm.aspect,
          color: assetForm.color,
        },
      });
    } else if (editingAssetId) {
      dispatch({
        type: 'UPDATE_ASSET',
        assetId: editingAssetId,
        updates: {
          title: assetForm.title.trim(),
          tags: assetForm.tags,
          durationSec,
          aspect: assetForm.aspect,
          color: assetForm.color,
        },
      });
    }
    closeAssetModal();
  };

  const deleteAsset = (assetId: string) => {
    if (window.confirm('Delete this asset? It will be removed from all playlists.')) {
      dispatch({ type: 'DELETE_ASSET', assetId });
    }
  };

  // ── Playlist modal handlers ──

  const openCreatePlaylist = () => {
    setPlName('');
    setPlLoop(true);
    setPlaylistModal('create');
  };

  const savePlaylist = () => {
    if (!plName.trim()) return;
    dispatch({ type: 'CREATE_PLAYLIST', name: plName.trim(), loop: plLoop });
    setPlaylistModal(null);
  };

  const deletePlaylist = (playlistId: string) => {
    if (window.confirm('Delete this playlist?')) {
      dispatch({ type: 'DELETE_PLAYLIST', playlistId });
    }
  };

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

        {/* ── Search + New button ── */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
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
          <NeoButton
            variant="primary"
            size="sm"
            onClick={tab === 'assets' ? openCreateAsset : openCreatePlaylist}
            icon={<Plus size={14} />}
          >
            New
          </NeoButton>
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
              <NeoCard key={asset.id} className="relative">
                {/* Action buttons */}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <button
                    onClick={() => openEditAsset(asset)}
                    className="w-7 h-7 rounded-neo-pill neo-surface shadow-neo-sm flex items-center justify-center text-neo-muted hover:text-neo-accent transition-colors"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => deleteAsset(asset.id)}
                    className="w-7 h-7 rounded-neo-pill neo-surface shadow-neo-sm flex items-center justify-center text-neo-muted hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

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
                <div className="font-bold text-neo-text text-sm pr-16">{asset.title}</div>
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

                  {/* Buttons */}
                  <div className="flex gap-1.5 flex-shrink-0">
                    <NeoButton
                      size="sm"
                      onClick={() => navigate(`/playlists/${pl.id}/edit`)}
                    >
                      Edit
                    </NeoButton>
                    <button
                      onClick={() => deletePlaylist(pl.id)}
                      className="w-8 h-8 rounded-neo-pill neo-surface shadow-neo-sm flex items-center justify-center text-neo-muted hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
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

      {/* ── Asset Create/Edit Modal ── */}
      <BottomSheetModal
        isOpen={!!assetModal}
        onClose={closeAssetModal}
        title={assetModal === 'create' ? 'New Asset' : 'Edit Asset'}
        snapHeight="full"
      >
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-neo-muted uppercase tracking-widest block mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={assetForm.title}
              onChange={(e) => setAssetForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Asset title…"
              className="w-full px-4 py-2.5 rounded-neo-sm neo-surface shadow-neo-inner text-sm text-neo-text placeholder:text-neo-muted focus:outline-none"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="text-xs font-semibold text-neo-muted uppercase tracking-widest block mb-1.5">
              Duration (e.g. 60m, 1h, 3600s)
            </label>
            <input
              type="text"
              value={assetForm.durationInput}
              onChange={(e) => setAssetForm((f) => ({ ...f, durationInput: e.target.value }))}
              placeholder="60m"
              className="w-full px-4 py-2.5 rounded-neo-sm neo-surface shadow-neo-inner text-sm text-neo-text placeholder:text-neo-muted focus:outline-none"
            />
          </div>

          {/* Aspect */}
          <div>
            <label className="text-xs font-semibold text-neo-muted uppercase tracking-widest block mb-1.5">
              Aspect Ratio
            </label>
            <div className="flex gap-2 flex-wrap">
              {ASPECT_OPTIONS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAssetForm((f) => ({ ...f, aspect: a }))}
                  className={[
                    'px-3 py-1.5 rounded-neo-pill text-xs font-semibold transition-all',
                    assetForm.aspect === a
                      ? 'bg-neo-accent text-white shadow-neo-sm'
                      : 'neo-surface shadow-neo-sm text-neo-muted hover:text-neo-text',
                  ].join(' ')}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-neo-muted uppercase tracking-widest block mb-1.5">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleFormTag(tag)}
                  className={[
                    'px-3 py-1.5 rounded-neo-pill text-xs font-semibold transition-all',
                    assetForm.tags.includes(tag)
                      ? 'bg-neo-accent text-white shadow-neo-sm'
                      : 'neo-surface shadow-neo-sm text-neo-muted hover:text-neo-text',
                  ].join(' ')}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-xs font-semibold text-neo-muted uppercase tracking-widest block mb-1.5">
              Thumbnail Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_SWATCHES.map((c) => (
                <button
                  key={c}
                  onClick={() => setAssetForm((f) => ({ ...f, color: c }))}
                  className={[
                    'w-8 h-8 rounded-neo-sm transition-all',
                    assetForm.color === c ? 'ring-2 ring-neo-accent ring-offset-2' : '',
                  ].join(' ')}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <NeoButton variant="secondary" fullWidth onClick={closeAssetModal}>
              Cancel
            </NeoButton>
            <NeoButton
              variant="primary"
              fullWidth
              onClick={saveAsset}
            >
              {assetModal === 'create' ? 'Create Asset' : 'Save Changes'}
            </NeoButton>
          </div>
        </div>
      </BottomSheetModal>

      {/* ── Create Playlist Modal ── */}
      <BottomSheetModal
        isOpen={!!playlistModal}
        onClose={() => setPlaylistModal(null)}
        title="New Playlist"
        snapHeight="auto"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neo-muted uppercase tracking-widest block mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={plName}
              onChange={(e) => setPlName(e.target.value)}
              placeholder="Playlist name…"
              className="w-full px-4 py-2.5 rounded-neo-sm neo-surface shadow-neo-inner text-sm text-neo-text placeholder:text-neo-muted focus:outline-none"
            />
          </div>

          {/* Loop toggle */}
          <div className="flex items-center justify-between p-3 rounded-neo-sm neo-surface shadow-neo-inner">
            <div>
              <div className="text-sm font-semibold text-neo-text">Loop</div>
              <div className="text-xs text-neo-muted">Repeat playlist continuously</div>
            </div>
            <button
              onClick={() => setPlLoop((v) => !v)}
              className={[
                'relative w-12 h-6 rounded-neo-pill transition-colors flex-shrink-0',
                plLoop ? 'bg-neo-accent' : 'bg-neo-dark',
              ].join(' ')}
            >
              <span
                className={[
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all',
                  plLoop ? 'left-6' : 'left-0.5',
                ].join(' ')}
              />
            </button>
          </div>

          <p className="text-xs text-neo-muted">
            Videos can be added after creation from the playlist editor.
          </p>

          <div className="flex gap-3 pt-1">
            <NeoButton variant="secondary" fullWidth onClick={() => setPlaylistModal(null)}>
              Cancel
            </NeoButton>
            <NeoButton variant="primary" fullWidth onClick={savePlaylist}>
              Create Playlist
            </NeoButton>
          </div>
        </div>
      </BottomSheetModal>
    </Layout>
  );
}
