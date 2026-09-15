import React, { useState, useEffect, useCallback } from 'react';
import FilmCard from './components/FilmCard.jsx';
import FilmModal from './components/FilmModal.jsx';
import { getFilms, getStats, startSync, getSyncStatus } from './api.js';

const YEARS = ['', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];

export default function App() {
  const [films, setFilms] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [stats, setStats] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    year: '',
    minRating: '',
    watched: '',
    sort: 'ratingKp',
    order: 'desc',
    page: 1,
    limit: 40,
  });

  const fetchFilms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFilms(filters);
      setFilms(data.films);
      setTotal(data.total);
      setPages(data.pages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchFilms(); }, [fetchFilms]);

  useEffect(() => {
    getStats().then(setStats).catch(() => {});
    getSyncStatus().then(setSyncStatus).catch(() => {});
  }, []);

  const updateFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value, page: 1 }));
  };

  const handleSync = async () => {
    setSyncing(true);
    await startSync();
    const poll = setInterval(async () => {
      const s = await getSyncStatus();
      setSyncStatus(s);
      if (s.status === 'done' || s.status === 'error') {
        clearInterval(poll);
        setSyncing(false);
        fetchFilms();
        getStats().then(setStats);
      }
    }, 2000);
  };

  const handleModalUpdate = (updated) => {
    setFilms(prev => prev.map(f => f.id === updated.id ? updated : f));
    setSelected(updated);
    getStats().then(setStats);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header data-testid="app-header" className="border-b border-white/8 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 data-testid="app-title" className="text-xl font-semibold tracking-tight">
            Хорроры <span data-testid="app-title-years" className="text-accent">2020–2026</span>
          </h1>
          <p data-testid="app-subtitle" className="text-xs text-gray-500 mt-0.5">api.kinopoisk.dev</p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing || syncStatus?.status === 'running'}
          data-testid="sync-button"
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-white/10 rounded-lg text-sm hover:bg-surface2 transition-colors disabled:opacity-50"
        >
          <svg data-testid="sync-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={syncing ? 'animate-spin' : ''}>
            <path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          <span data-testid="sync-button-label">
            {syncing || syncStatus?.status === 'running' ? 'Синхронизация...' : 'Синхронизировать'}
          </span>
        </button>
      </header>

      {/* Stats */}
      {stats && (
        <div data-testid="stats" className="grid grid-cols-2 md:grid-cols-4 gap-3 px-6 py-4">
          {[
            { id: 'total', label: 'Всего фильмов', value: stats.total },
            { id: 'watched', label: 'Просмотрено', value: stats.watched },
            { id: 'unwatched', label: 'Не просмотрено', value: stats.total - stats.watched },
            { id: 'shown', label: 'Показано', value: total },
          ].map(s => (
            <div key={s.label} data-testid={`stat-${s.id}`} className="bg-surface border border-white/8 rounded-xl p-4">
              <div data-testid={`stat-${s.id}-label`} className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">{s.label}</div>
              <div data-testid={`stat-${s.id}-value`} className="text-2xl font-semibold">{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Sync status */}
      {syncStatus?.status === 'never' && (
        <div data-testid="empty-db-banner" className="mx-6 mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-400">
          База пустая — нажми «Синхронизировать» чтобы загрузить фильмы из Кинопоиска.
        </div>
      )}

      {/* Filters */}
      <div data-testid="filters" className="flex flex-wrap gap-2.5 px-6 pb-4">
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={filters.search}
          onChange={e => updateFilter('search', e.target.value)}
          data-testid="search-input"
          className="flex-1 min-w-48 h-9 px-3 bg-surface border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 outline-none focus:border-accent/50"
        />
        <select value={filters.year} onChange={e => updateFilter('year', e.target.value)}
          data-testid="year-filter"
          className="h-9 px-3 bg-surface border border-white/10 rounded-lg text-sm text-white outline-none focus:border-accent/50">
          {YEARS.map(y => <option key={y} value={y} data-testid={`year-filter-option-${y || 'all'}`}>{y || 'Все годы'}</option>)}
        </select>
        <select value={filters.minRating} onChange={e => updateFilter('minRating', e.target.value)}
          data-testid="rating-filter"
          className="h-9 px-3 bg-surface border border-white/10 rounded-lg text-sm text-white outline-none focus:border-accent/50">
          <option value="" data-testid="rating-filter-option-any">Любой рейтинг</option>
          <option value="5" data-testid="rating-filter-option-5">≥ 5.0</option>
          <option value="6" data-testid="rating-filter-option-6">≥ 6.0</option>
          <option value="7" data-testid="rating-filter-option-7">≥ 7.0</option>
          <option value="8" data-testid="rating-filter-option-8">≥ 8.0</option>
        </select>
        <select value={filters.watched} onChange={e => updateFilter('watched', e.target.value)}
          data-testid="watched-filter"
          className="h-9 px-3 bg-surface border border-white/10 rounded-lg text-sm text-white outline-none focus:border-accent/50">
          <option value="" data-testid="watched-filter-option-all">Все</option>
          <option value="false" data-testid="watched-filter-option-false">Не смотрел</option>
          <option value="true" data-testid="watched-filter-option-true">Смотрел</option>
        </select>
        <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}
          data-testid="sort-filter"
          className="h-9 px-3 bg-surface border border-white/10 rounded-lg text-sm text-white outline-none focus:border-accent/50">
          <option value="ratingKp" data-testid="sort-filter-option-ratingKp">По рейтингу КП</option>
          <option value="ratingImdb" data-testid="sort-filter-option-ratingImdb">По рейтингу IMDb</option>
          <option value="year" data-testid="sort-filter-option-year">По году</option>
          <option value="name" data-testid="sort-filter-option-name">По названию</option>
        </select>
      </div>

      {/* Grid */}
      <div data-testid="films-section" className="px-6 pb-6">
        {loading ? (
          <div data-testid="loading-state" className="text-center py-16 text-gray-500">
            <div data-testid="loading-spinner" className="inline-block w-6 h-6 border-2 border-white/10 border-t-accent rounded-full animate-spin mb-3" />
            <p data-testid="loading-text" className="text-sm">Загружаем...</p>
          </div>
        ) : films.length === 0 ? (
          <div data-testid="empty-state" className="text-center py-16 text-gray-500 text-sm">Ничего не найдено</div>
        ) : (
          <div data-testid="film-grid" className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
            {films.map(film => (
              <FilmCard key={film.id} film={film} onClick={setSelected} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div data-testid="pagination" className="flex justify-center gap-1.5 mt-6 flex-wrap">
            {Array.from({ length: pages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === pages || Math.abs(p - filters.page) <= 2)
              .reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) => p === '...'
                ? <span key={`e${i}`} data-testid="pagination-ellipsis" className="px-2 py-1 text-gray-600 text-sm self-center">…</span>
                : <button key={p} onClick={() => setFilters(f => ({ ...f, page: p }))}
                    data-testid={`page-${p}`}
                    className={`h-8 min-w-8 px-2.5 rounded-lg text-sm transition-colors ${
                      filters.page === p ? 'bg-accent text-white font-semibold' : 'bg-surface border border-white/10 hover:bg-surface2'
                    }`}>{p}</button>
              )}
          </div>
        )}
      </div>

      {selected && (
        <FilmModal film={selected} onClose={() => setSelected(null)} onUpdate={handleModalUpdate} />
      )}
    </div>
  );
}
