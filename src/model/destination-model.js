import Observable from "../framework/observable.js";

export default class DestinationModel extends Observable {
  #destinations = [];
  #destinationsApiService = null;

  constructor({ destinationsApiService }) {
    super();
    this.#destinationsApiService = destinationsApiService;
  }
  get destinations() {
    return this.#destinations;
  }
  getDestinationById(id) {
    const destination = this.#destinations.find((item) => item.id === id);
    return destination ? destination : [];
  }
  async init() {
    try {
      this.#destinations = await this.#destinationsApiService.destinations;
    } catch (err) {
      this.#destinations = [];
      // Здесь можно добавить обработку ошибки, например, уведомить пользователя
      console.error("Can not load destinations", err);
    }
  }
}

// const dest = new DestinationModel();
