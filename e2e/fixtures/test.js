import { test as base, expect } from '@playwright/test';
import { FilmsPage } from '../pages/FilmsPage.js';
import { insertFilms, deleteFilms } from '../data/db.js';

export const test = base.extend({
  filmsPage: async ({ page }, use) => {
    await use(new FilmsPage(page));
  },

  // Готовит фильмы напрямую в БД и гарантированно убирает за собой после теста,
  // независимо от того, сколько фильмов и в каких тестах было создано.
  seedFilms: async ({}, use) => {
    const createdIds = [];

    const seed = async (films) => {
      await insertFilms(films);
      createdIds.push(...films.map((f) => f.id));
      return films;
    };

    await use(seed);

    await deleteFilms(createdIds);
  },
});

export { expect };
