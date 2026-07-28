import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import filmsRouter from './routes/films.js';
import syncRouter from './routes/sync.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/films', filmsRouter);
app.use('/api/sync', syncRouter);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
