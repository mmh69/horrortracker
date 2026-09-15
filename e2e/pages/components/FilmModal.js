// Модалка деталей фильма — самостоятельный UI-блок, которым владеет FilmsPage.
export class FilmModal {
  constructor(page) {
    this.page = page;
    this.root = page.getByTestId('film-modal');
    this.title = page.getByTestId('modal-title');
    this.ratingKp = page.getByTestId('modal-rating-kp');
    this.ratingImdb = page.getByTestId('modal-rating-imdb');
    this.watchedButton = page.getByTestId('modal-watched-toggle');
    this.closeButton = page.getByTestId('modal-close');
    this.kinopoiskLink = page.getByTestId('modal-kinopoisk-link');
  }

  async toggleWatched() {
    await this.watchedButton.click();
  }

  async close() {
    await this.closeButton.click();
  }
}
