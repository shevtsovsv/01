import { getRandomPoint, getLengthPoints } from "../mock/points.js";
import OffersModel from "./offers-model.js";
import DestinationModel from "./destination-model.js";
import { EVENT_COUNT } from "../const.js";

export default class PointModel {
  //   rezult = {};
  #points = null;
  #offersModel = null;
  #destinationModel = null;

  constructor() {
    this.#offersModel = new OffersModel();
    this.#destinationModel = new DestinationModel();
    this.#points = Array.from({ length: getLengthPoints() }, () =>
      this.#createPoint()
    );
  }

  #createPoint() {
    const tempPoint = getRandomPoint();
    const destination =
      tempPoint != undefined
        ? this.#destinationModel.getDestinationById(tempPoint.destination)
        : "";
    const allOffersForType = this.#offersModel.getOffersByType(tempPoint.type);
    const offers = (allOffersForType ?? []).filter((offer) =>
      tempPoint.offers.includes(offer.id)
    );

    // Генерация HTML для выбранных офферов
    const offersHtml = this.#createOffersHtml(offers);
    const offersEditHtml = this.#createOffersTemplate(allOffersForType, offers);
    const photosTemplate = this.#createPhotosTemplate(destination);

    return {
      ...tempPoint,
      destination,
      allOffersForType,
      offers,
      offersHtml, // добавляем HTML-шаблон в объект
      offersEditHtml,
      photosTemplate,
    };
  }

  #createOffersHtml(offers) {
    if (!offers || offers.length === 0) return "";

    return `
    <ul class="event__selected-offers">
      ${offers
        .map(
          (offer) => `
          <li class="event__offer">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </li>
        `
        )
        .join("")}
    </ul>
  `;
  }

  #createOffersTemplate(allOffersForType, selectedOffers) {
    const selectedOfferIds = selectedOffers.map((offer) => offer.id); // ← ВАЖНО

    return `
    <div class="event__available-offers">
      ${allOffersForType
        .map((offer) => {
          const isChecked = selectedOfferIds.includes(offer.id)
            ? "checked"
            : "";
          const sanitizedTitle = offer.title.toLowerCase().replace(/\s+/g, "-");
          const offerId = `event-offer-${sanitizedTitle}-1`;

          return `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox visually-hidden"
                   id="${offerId}"
                   type="checkbox"
                   name="event-offer-${sanitizedTitle}"
                   ${isChecked}>
            <label class="event__offer-label" for="${offerId}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>
        `;
        })
        .join("")}
    </div>
  `;
  }

  #createPhotosTemplate(destination) {
    const photosHtml = destination.pictures
      .map((picture) => {
        return `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
      })
      .join("\n");

    return `
<div class="event__photos-container">
  <div class="event__photos-tape">
    ${photosHtml}
  </div>
</div>`.trim();
  }

  get points() {
    return this.#points;
  }
}
