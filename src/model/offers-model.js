import { getOffers } from "../mock/offers.js";

export default class OffersModel {
  offers = getOffers();

  getOfferById(id) {
    return (
      this.offers
        .flatMap((category) => category.offers)
        .find((offer) => offer.id === id) || null
    );
  }

  getOffersByType(type) {
    const category = this.offers.find((item) => item.type === type);
    return category ? category.offers : [];
  }
}
