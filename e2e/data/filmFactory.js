// Счётчик даёт уникальный id на каждый вызов в рамках одного воркера — тесты
// не пересекаются данными, даже если в файле несколько сценариев.
let counter = 0;

// 900 000 000+ — диапазон, заведомо выше реальных id Кинопоиска, чтобы тестовые
// фильмы никогда не конфликтовали с уже засинканными в базе данными.
export function makeFilm(overrides = {}) {
  counter += 1;
  const id = overrides.id ?? 900_000_000 + counter;

  return {
    id,
    name: `E2E Film ${id}`,
    alternativeName: null,
    year: 2023,
    description: 'Тестовое описание фильма для e2e.',
    posterUrl: null,
    posterPreview: null,
    ratingKp: 7.5,
    ratingImdb: 7.0,
    ratingVotes: 1000,
    movieLength: 95,
    genres: ['ужасы'],
    countries: ['США'],
    watched: false,
    watchedAt: null,
    ...overrides,
    id,
  };
}
