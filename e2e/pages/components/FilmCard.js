// Переиспользуемый блок карточки фильма в гриде — своя локация и атомарные действия,
// без бизнес-сценария (он остаётся в тесте/Step).
export class FilmCard {
  constructor(page, id) {
    this.page = page;
    this.id = id;
    this.root = page.getByTestId(`film-card-${id}`);
    this.watchedBadge = this.root.getByTestId('watched-badge');
  }

  async open() {
    await this.root.click();
  }
}
