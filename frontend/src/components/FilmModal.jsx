import React, { useEffect } from 'react';
import { setWatched } from '../api.js';

export default function FilmModal({ film, onClose, onUpdate }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleWatched = async () => {
    const updated = await setWatched(film.id, !film.watched);
    onUpdate(updated);
  };

  const rating = film.ratingKp;
  const ratingColor = rating >= 7 ? 'text-green-400' : rating >= 5 ? 'text-amber-400' : rating > 0 ? 'text-red-400' : 'text-gray-500';

  return (
    <div
      data-testid="film-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div data-testid="film-modal-content" className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div data-testid="film-modal-body" className="flex gap-6 p-6">
          <div data-testid="modal-poster" className="flex-shrink-0 w-36">
            {film.posterUrl ? (
              <img src={film.posterUrl} alt={film.name} data-testid="modal-poster-image" className="w-full rounded-xl" />
            ) : (
              <div data-testid="modal-no-poster" className="w-full aspect-[2/3] bg-surface2 rounded-xl flex items-center justify-center text-gray-600 text-xs">нет постера</div>
            )}
          </div>

          <div data-testid="modal-details" className="flex-1 min-w-0">
            <div data-testid="modal-header" className="flex items-start justify-between gap-3 mb-1">
              <h2 data-testid="modal-title" className="text-lg font-semibold leading-tight">{film.name || film.alternativeName || 'Без названия'}</h2>
              <button onClick={onClose} data-testid="modal-close" className="text-gray-500 hover:text-white flex-shrink-0 mt-0.5">
                <svg data-testid="modal-close-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {film.alternativeName && film.alternativeName !== film.name && (
              <p data-testid="modal-alt-name" className="text-sm text-gray-400 mb-3">{film.alternativeName}</p>
            )}

            <div data-testid="modal-badges" className="flex flex-wrap gap-2 mb-4">
              {film.year && <span data-testid="modal-year-badge" className="text-xs px-2 py-1 bg-white/5 rounded-full">{film.year}</span>}
              {film.movieLength && <span data-testid="modal-length-badge" className="text-xs px-2 py-1 bg-white/5 rounded-full">{film.movieLength} мин</span>}
              {film.genres?.map(g => (
                <span key={g} data-testid="modal-genre-badge" className="text-xs px-2 py-1 bg-white/5 rounded-full">{g}</span>
              ))}
              {film.countries?.map(c => (
                <span key={c} data-testid="modal-country-badge" className="text-xs px-2 py-1 bg-white/5 rounded-full">{c}</span>
              ))}
            </div>

            <div data-testid="modal-ratings" className="flex gap-4 mb-4">
              {film.ratingKp > 0 && (
                <div data-testid="modal-rating-kp-block">
                  <div data-testid="modal-rating-kp-label" className="text-xs text-gray-500 mb-0.5">Кинопоиск</div>
                  <div data-testid="modal-rating-kp" className={`text-xl font-bold ${ratingColor}`}>{film.ratingKp.toFixed(1)}</div>
                </div>
              )}
              {film.ratingImdb > 0 && (
                <div data-testid="modal-rating-imdb-block">
                  <div data-testid="modal-rating-imdb-label" className="text-xs text-gray-500 mb-0.5">IMDb</div>
                  <div data-testid="modal-rating-imdb" className="text-xl font-bold text-amber-400">{film.ratingImdb.toFixed(1)}</div>
                </div>
              )}
            </div>

            {film.description && (
              <p data-testid="modal-description" className="text-sm text-gray-300 leading-relaxed mb-4 line-clamp-4">{film.description}</p>
            )}

            <div data-testid="modal-actions" className="flex gap-3">
              <button
                onClick={handleWatched}
                data-testid="modal-watched-toggle"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  film.watched
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                    : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                }`}
              >
                {film.watched ? (
                  <>
                    <svg data-testid="modal-watched-icon" width="14" height="14" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span data-testid="modal-watched-label">Смотрел</span>
                  </>
                ) : (
                  <>
                    <svg data-testid="modal-watched-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                    </svg>
                    <span data-testid="modal-watched-label">Отметить просмотренным</span>
                  </>
                )}
              </button>

              <a
                href={`https://www.kinopoisk.ru/film/${film.id}/`}
                target="_blank"
                rel="noreferrer"
                data-testid="modal-kinopoisk-link"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-400 border border-white/10 hover:bg-white/5 transition-colors"
              >
                <span data-testid="modal-kinopoisk-label">Кинопоиск</span>
                <svg data-testid="modal-kinopoisk-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
