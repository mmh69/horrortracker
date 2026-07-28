import React from 'react';

export default function FilmCard({ film, onClick }) {
  const rating = film.ratingKp;
  const ratingColor = rating >= 7 ? 'text-green-400' : rating >= 5 ? 'text-amber-400' : rating > 0 ? 'text-red-400' : 'text-gray-500';
  const ratingBg = rating >= 7 ? 'bg-green-400/10' : rating >= 5 ? 'bg-amber-400/10' : rating > 0 ? 'bg-red-400/10' : 'bg-white/5';

  return (
    <div
      onClick={() => onClick(film)}
      className="bg-surface border border-white/8 rounded-xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:border-white/20 relative group"
    >
      {film.watched && (
        <div className="absolute top-2 right-2 z-10 bg-green-500 rounded-full w-5 h-5 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      <div className="aspect-[2/3] bg-surface2 overflow-hidden">
        {film.posterPreview || film.posterUrl ? (
          <img
            src={film.posterPreview || film.posterUrl}
            alt={film.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">нет постера</div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-xs font-medium leading-snug line-clamp-2 mb-1.5">{film.name || film.alternativeName || 'Без названия'}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{film.year || '—'}</span>
          {rating > 0 && (
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${ratingColor} ${ratingBg}`}>
              {rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
