import Observable from "../framework/observable";

export default class OffersModel extends Observable {
  #offers = [];
  #offersApiService = null;

  constructor({ offersApiService }) {
    super();
    this.#offersApiService = offersApiService;
  }

  get offers() {
    return this.#offers;
  }

  getOfferById(id) {
    return (
      this.#offers
        .flatMap((category) => category.offers)
        .find((offer) => offer.id === id) || null
    );
  }

  getOffersByType(type) {
    const category = this.#offers.find((item) => item.type === type);
    return category ? category.offers : [];
  }

  async init() {
    try {
      this.#offers = await this.#offersApiService.offers;
    } catch (err) {
      this.#offers = [];
      console.error("Can not load offers", err);
    }
  }
}
