import ApiService from "./framework/api-service.js";

const Method = {
  GET: "GET",
  PUT: "PUT",
};

export default class TasksApiService extends ApiService {
  get points() {
    return this._load({ url: "points" }).then(ApiService.parseResponse);
  }

  async updatePointk(point) {
    const response = await this._load({
      url: `tasks/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptToServer(point) {
    const adaptedPoint = {
      ...point,
      date_from:
        point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null, // На сервере дата хранится в ISO формате
      date_to: point.dateTo instanceof Date ? point.dateTo.toISOString() : null, // На сервере дата хранится в ISO формате
      base_price: point.basePrice,
      is_favorite: point.isFavorite,
    };

    // Ненужные ключи мы удаляем
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.basePrice;

    return adaptedPoint;
  }
}
