import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/films
router.get('/', async (req, res) => {
  try {
    const {
      search = '',
      year,
      minRating,
      watched,
      sort = 'ratingKp',
      order = 'desc',
      page = 1,
      limit = 40,
    } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { alternativeName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (year) where.year = parseInt(year);

    if (minRating) {
      where.ratingKp = { gte: parseFloat(minRating) };
    }

    if (watched === 'true') where.watched = true;
    if (watched === 'false') where.watched = false;

    const sortField = ['ratingKp', 'ratingImdb', 'year', 'name'].includes(sort) ? sort : 'ratingKp';
    const sortOrder = order === 'asc' ? 'asc' : 'desc';

    const [films, total] = await Promise.all([
      prisma.film.findMany({
        where,
        orderBy: { [sortField]: sortOrder },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.film.count({ where }),
    ]);

    res.json({
      films,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/films/:id
router.get('/:id', async (req, res) => {
  try {
    const film = await prisma.film.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!film) return res.status(404).json({ error: 'Not found' });
    res.json(film);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/films/:id/watched
router.patch('/:id/watched', async (req, res) => {
  try {
    const { watched } = req.body;
    const film = await prisma.film.update({
      where: { id: parseInt(req.params.id) },
      data: {
        watched: Boolean(watched),
        watchedAt: watched ? new Date() : null,
      },
    });
    res.json(film);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/films/stats/summary
router.get('/stats/summary', async (req, res) => {
  try {
    const [total, watched, byYear] = await Promise.all([
      prisma.film.count(),
      prisma.film.count({ where: { watched: true } }),
      prisma.film.groupBy({ by: ['year'], _count: { id: true }, orderBy: { year: 'asc' } }),
    ]);
    res.json({ total, watched, byYear });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
