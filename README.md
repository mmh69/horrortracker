# Horror Tracker

Трекер и браузер хоррор-фильмов 2020–2026 на базе [api.kinopoisk.dev](https://api.kinopoisk.dev).

## Стек

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express + Prisma
- **БД:** PostgreSQL
- **Деплой:** Docker Compose + Nginx

## Структура проекта

```
horror-tracker/
├── backend/          Express + Prisma + PostgreSQL
│   ├── prisma/       схема и миграции БД
│   └── src/          исходный код API
├── frontend/         React + Vite + Tailwind
│   ├── public/
│   └── src/
├── docker-compose.yml
└── README.md
```

## Локальный запуск

### 1. Переменные окружения

Скопируй пример env-файла и вставь свой ключ Kinopoisk API:

```bash
cp .env.example .env
```

### 2. Запусти PostgreSQL

```bash
docker-compose up postgres -d
```

### 3. Бэкенд

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate deploy
npm run dev
```

### 4. Фронтенд

```bash
cd frontend
npm install
npm run dev
```

Открывай: http://localhost:5173

## Деплой на сервер

```bash
git clone https://github.com/mmh69/horrortracker.git
cd horrortracker
cp .env.example .env  # вставь KINOPOISK_API_KEY
docker-compose up -d --build
```

Открывай: http://YOUR_SERVER_IP

## После запуска

Нажми кнопку **«Синхронизировать»** — бэкенд загрузит фильмы из Кинопоиска в БД.
Синхронизацию можно повторять — данные обновятся через upsert, без дублей.

## API эндпоинты

| Метод | Путь | Описание |
|-------|------|----------|
| GET | /api/films | Список фильмов с фильтрами |
| GET | /api/films/:id | Детали фильма |
| PATCH | /api/films/:id/watched | Отметить просмотренным |
| GET | /api/films/stats/summary | Статистика |
| POST | /api/sync | Запустить синхронизацию |
| GET | /api/sync/status | Статус последней синхронизации |

### Параметры GET /api/films

| Параметр | Тип | Описание |
|----------|-----|----------|
| search | string | Поиск по названию |
| year | number | Фильтр по году |
| minRating | number | Минимальный рейтинг КП |
| watched | boolean | Фильтр по статусу просмотра |
| sort | string | ratingKp / ratingImdb / year / name |
| order | string | asc / desc |
| page | number | Страница |
| limit | number | Лимит (макс 100) |

## Разработка

Проект используется как пет-проект для практики DevOps: Git-флоу (ветки + PR + branch protection), Docker, CI/CD, Kubernetes и наблюдаемость постепенно добавляются по мере прохождения обучающего плана.
