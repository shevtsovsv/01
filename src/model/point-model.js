import { getRandomPoint, getLengthPoints } from "../mock/points.js";
import OffersModel from "./offers-model.js";
import DestinationModel from "./destination-model.js";
import Observable from "../framework/observable.js";

export default class PointModel extends Observable {
  //   rezult = {};
  #points = null;
  #offersModel = null;
  #destinationModel = null;
  #tasksApiService = null;

  constructor({ tasksApiService }) {
    super();
    this.#offersModel = new OffersModel();
    this.#destinationModel = new DestinationModel();
    // this.#points = Array.from({ length: getLengthPoints() }, () =>
    //   this.#createPoint()
    // );
    this.#tasksApiService = tasksApiService;
    console.log(this.#tasksApiService);
    this.#tasksApiService.points.then((points) => {
      console.log(points);
      // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
      // а ещё на сервере используется snake_case, а у нас camelCase.
      // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
      // Есть вариант получше - паттерн "Адаптер"
    });
  }

  #createPoint(rawPoint) {
    const tempPoint = rawPoint || getRandomPoint();
    const destination =
      tempPoint != undefined
        ? this.#destinationModel.getDestinationById(tempPoint.destination)
        : null; // Лучше null, чем ""
    const allOffersForType = this.#offersModel.getOffersByType(tempPoint.type);

    // Получаем массив объектов выбранных офферов
    const offers = (allOffersForType ?? []).filter((offer) =>
      tempPoint.offers.includes(offer.id)
    );

    // Возвращаем чистый объект данных, БЕЗ HTML
    return {
      ...tempPoint,
      destination,
      allOffersForType,
      offers, // Это массив объектов, а не ID
    };
  }

  // ----------------------7.3-------------------------------
  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error("Can't update unexisting point");
    }

    // 'update' от "Favorite" уже "обогащен" (destination - это объект).
    // 'update' от формы - "сырой" (destination - это ID/строка).
    // Мы должны обрабатывать оба случая.

    let finalUpdate = update; // По умолчанию считаем, что данные уже готовы

    // Если destination - это строка, значит, данные "сырые" и их нужно обогатить.
    // (Добавляем проверку на null на случай, если точка новая и без пункта назначения)
    if (typeof update.destination === "string" || update.destination === null) {
      finalUpdate = this.#createPoint(update);
    }
    // Если же destination - это объект, мы просто используем `update` как есть (finalUpdate).

    this.#points = [
      ...this.#points.slice(0, index),
      finalUpdate,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, finalUpdate);
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
