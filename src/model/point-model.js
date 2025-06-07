import Observable from "../framework/observable.js";
import { UpdateType } from "../const.js";

export default class PointModel extends Observable {
  #points = [];
  #offersModel = null;
  #destinationModel = null;
  #tasksApiService = null;

  constructor({ tasksApiService, destinationModel, offersModel }) {
    super();
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel; // <--- ПРИСВАИВАЕМ переданную модель
    this.#tasksApiService = tasksApiService;
  }

  async init() {
    try {
      const points = await this.#tasksApiService.points;
      this.#points = points.map(this.#adaptToClient);
      this.#points = this.#points.map(this.#createPoint);
    } catch (err) {
      this.#points = [];
    }
    this._notify(UpdateType.INIT);
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: point["base_price"],
      dateFrom:
        point["date_from"] !== null
          ? new Date(point["date_from"])
          : point["date_from"], // На клиенте дата хранится как экземпляр Date
      dateTo:
        point["date_to"] !== null
          ? new Date(point["date_to"])
          : point["date_to"], // На клиенте дата хранится как экземпляр Date
      isFavorite: point["is_favorite"],
    };

    // Ненужные ключи мы удаляем
    delete adaptedPoint["base_price"];
    delete adaptedPoint["date_from"];
    delete adaptedPoint["date_to"];
    delete adaptedPoint["is_favorite"];

    return adaptedPoint;
  }

  #createPoint = (rawPoint) => {
    const destination =
      rawPoint != undefined
        ? this.#destinationModel.getDestinationById(rawPoint.destination)
        : null; // Лучше null, чем ""
    const allOffersForType = this.#offersModel.getOffersByType(rawPoint.type);

    // Получаем массив объектов выбранных офферов
    const offers = (allOffersForType ?? []).filter((offer) =>
      rawPoint.offers.includes(offer.id)
    );
    const rez = {
      ...rawPoint,
      destination,
      allOffersForType,
      offers, // Это массив объектов, а не ID
    };

    // Возвращаем чистый объект данных, БЕЗ HTML
    return rez;
  };

  // ----------------------7.3-------------------------------
  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error("Can't update unexisting point");
    }

    let finalUpdate = update;

    if (typeof update.destination === "string" || update.destination === null) {
      finalUpdate = this.#createPoint(update);
    }

    this.#points = [
      ...this.#points.slice(0, index),
      finalUpdate,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, finalUpdate);
    // try {
    //   const response = await this.#tasksApiService.updatePoint(finalUpdate);
    //   //   const updatedPoint = this.#adaptToClient(response);
    //   this.#points = [
    //     ...this.#points.slice(0, index),
    //     updatedPoint,
    //     ...this.#points.slice(index + 1),
    //   ];
    //   this._notify(updateType, updatedPoint);
    // } catch (err) {
    //   throw new Error("Can't update point");
    // }
  }

  addPoint(updateType, update) {
    this.#points = [update, ...this.#points];
    const enrichedUpdate = this.#createPoint(update);
    this.#points = [enrichedUpdate, ...this.#points];
    this._notify(updateType, enrichedUpdate);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error("Can't delete unexisting point");
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];
    // this.#points = this.#points.filter((point) => point.id !== update.id);

    this._notify(updateType);
  }

  get points() {
    return this.#points;
  }
}
