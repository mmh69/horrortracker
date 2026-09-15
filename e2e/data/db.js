import pg from 'pg';

const { Pool } = pg;

let pool;

function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL не задан — e2e не может подготовить тестовые данные напрямую в БД');
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

// Нет публичного API для создания фильма (он появляется только через /api/sync из Кинопоиска),
// поэтому тестовые данные готовятся прямой записью в таблицу Film — это единственный
// предсказуемый и изолированный способ подготовить состояние для конкретного теста.
export async function insertFilms(films) {
  const client = getPool();
  for (const film of films) {
    await client.query(
      `INSERT INTO "Film" (
         id, name, "alternativeName", year, description, "posterUrl", "posterPreview",
         "ratingKp", "ratingImdb", "ratingVotes", "movieLength", genres, countries, watched, "watchedAt", "updatedAt"
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15, NOW())
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         "alternativeName" = EXCLUDED."alternativeName",
         year = EXCLUDED.year,
         description = EXCLUDED.description,
         "posterUrl" = EXCLUDED."posterUrl",
         "posterPreview" = EXCLUDED."posterPreview",
         "ratingKp" = EXCLUDED."ratingKp",
         "ratingImdb" = EXCLUDED."ratingImdb",
         "ratingVotes" = EXCLUDED."ratingVotes",
         "movieLength" = EXCLUDED."movieLength",
         genres = EXCLUDED.genres,
         countries = EXCLUDED.countries,
         watched = EXCLUDED.watched,
         "watchedAt" = EXCLUDED."watchedAt",
         "updatedAt" = NOW()`,
      [
        film.id,
        film.name,
        film.alternativeName,
        film.year,
        film.description,
        film.posterUrl,
        film.posterPreview,
        film.ratingKp,
        film.ratingImdb,
        film.ratingVotes,
        film.movieLength,
        film.genres,
        film.countries,
        film.watched,
        film.watchedAt,
      ]
    );
  }
}

export async function deleteFilms(ids) {
  if (!ids.length) return;
  await getPool().query('DELETE FROM "Film" WHERE id = ANY($1)', [ids]);
}

export async function closeDb() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}
