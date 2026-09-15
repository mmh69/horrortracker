import { BasePage } from './BasePage.js';
import { FilmCard } from './components/FilmCard.js';
import { FilmModal } from './components/FilmModal.js';

// Единственный PageObject главной (и единственной) страницы приложения.
export class FilmsPage extends BasePage {
  constructor(page) {
    super(page);

    this.modal = new FilmModal(page);

    this.searchInput = page.getByTestId('search-input');
    this.yearFilter = page.getByTestId('year-filter');
    this.ratingFilter = page.getByTestId('rating-filter');
    this.watchedFilter = page.getByTestId('watched-filter');
    this.sortFilter = page.getByTestId('sort-filter');
    this.syncButton = page.getByTestId('sync-button');
    this.filmGrid = page.getByTestId('film-grid');
    this.emptyState = page.getByTestId('empty-state');
    this.emptyDbBanner = page.getByTestId('empty-db-banner');
    this.pagination = page.getByTestId('pagination');
  }

  async goto() {
    await this.page.goto('/');
    // Ждём терминального состояния грида (данные пришли или список пуст),
    // а не фиксированной паузы — избегаем гонки с первым фетчем.
    await Promise.race([
      this.filmGrid.waitFor({ state: 'visible' }),
      this.emptyState.waitFor({ state: 'visible' }),
    ]);
  }

  async search(text) {
    await this.searchInput.fill(text);
  }

  async filterByYear(year) {
    await this.yearFilter.selectOption(String(year));
  }

  async filterByMinRating(rating) {
    await this.ratingFilter.selectOption(String(rating));
  }

  async filterByWatched(value) {
    await this.watchedFilter.selectOption(value);
  }

  async sortBy(value) {
    await this.sortFilter.selectOption(value);
  }

  async clickSync() {
    await this.syncButton.click();
  }

  card(id) {
    return new FilmCard(this.page, id);
  }

  async openFilm(id) {
    await this.card(id).open();
  }

  async goToPage(n) {
    await this.pagination.getByTestId(`page-${n}`).click();
  }

  stat(name) {
    return this.page.getByTestId(`stat-${name}`);
  }

  cardIds() {
    return this.filmGrid.locator('[data-testid^="film-card-"]').evaluateAll(
      (nodes) => nodes.map((n) => n.getAttribute('data-testid').replace('film-card-', ''))
    );
  }
}
