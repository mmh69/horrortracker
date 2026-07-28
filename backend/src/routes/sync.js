import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const router = Router();
const prisma = new PrismaClient();

const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
const API_KEY = process.env.KINOPOISK_API_KEY;

async function fetchPage(page) {
  const yearParams = YEARS.map(y => `year=${y}`).join('&');
  const url = `https://api.kinopoisk.dev/v1.4/movie?genres.name=ужасы&${yearParams}&type=movie&limit=250&page=${page}`;
  const res = await fetch(url, {
    headers: { 'X-API-KEY': API_KEY, 'accept': 'application/json' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`Kinopoisk API error: ${res.status}`);
  return res.json();
}

function mapFilm(f) {
  return {
    id: f.id,
    name: f.name || null,
    alternativeName: f.alternativeName || null,
    year: f.year || null,
    description: f.description || null,
    posterUrl: f.poster?.url || null,
    posterPreview: f.poster?.previewUrl || null,
    ratingKp: f.rating?.kp || null,
    ratingImdb: f.rating?.imdb || null,
    ratingVotes: f.votes?.kp || null,
    movieLength: f.movieLength || null,
    genres: (f.genres || []).map(g => g.name),
    countries: (f.countries || []).map(c => c.name),
  };
}

// POST /api/sync — запустить синхронизацию
router.post('/', async (req, res) => {
  // Отвечаем сразу, синхронизация идёт в фоне
  res.json({ message: 'Синхронизация запущена' });

  const log = await prisma.syncLog.create({
    data: { status: 'running', total: 0 },
  });

  try {
    const first = await fetchPage(1);
    const totalPages = first.pages || 1;
    let count = 0;

    const upsertBatch = async (docs) => {
      await Promise.all(docs.map(f =>
        prisma.film.upsert({
          where: { id: f.id },
          update: mapFilm(f),
          create: mapFilm(f),
        })
      ));
      count += docs.length;
    };

    await upsertBatch(first.docs || []);

    for (let p = 2; p <= totalPages; p++) {
      await new Promise(r => setTimeout(r, 300));
      const data = await fetchPage(p);
      await upsertBatch(data.docs || []);
    }

    await prisma.syncLog.update({
      where: { id: log.id },
      data: { status: 'done', total: count },
    });

    console.log(`Sync done: ${count} films`);
  } catch (e) {
    await prisma.syncLog.update({
      where: { id: log.id },
      data: { status: 'error', message: e.message },
    });
    console.error('Sync error:', e.message);
  }
});

// GET /api/sync/status — последний лог
router.get('/status', async (req, res) => {
  try {
    const last = await prisma.syncLog.findFirst({ orderBy: { createdAt: 'desc' } });
    res.json(last || { status: 'never' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
