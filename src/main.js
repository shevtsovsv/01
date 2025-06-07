import BoardPresenter from "./presenter/board-presenter.js";
import FilterPresenter from "./presenter/filter-presenter.js";
import PointModel from "./model/point-model.js";
import FilterModel from "./model/filter-model.js";
import DestinationModel from "./model/destination-model.js"; //
import OffersModel from "./model/offers-model.js"; // <--- ИМПОРТИРУЕМ

import TasksApiService from "./tasks-api-service.js";
import DestinationsApiService from "./destination-api-service.js";
import OffersApiService from "./offers-api-service.js"; // <--- ИМПОРТИРУЕМ

const AUTHORIZATION = "Basic MTExOjExMQ==";
const END_POINT = "https://21.objects.htmlacademy.pro/big-trip";

// const pointModel = new PointModel();
const destinationsApiService = new DestinationsApiService(
  END_POINT,
  AUTHORIZATION
);
const tasksApiService = new TasksApiService(END_POINT, AUTHORIZATION);
const offersApiService = new OffersApiService(END_POINT, AUTHORIZATION); // <--- СОЗДАЕМ

const destinationModel = new DestinationModel({ destinationsApiService });
const offersModel = new OffersModel({ offersApiService }); // <--- СОЗДАЕМ
const pointModel = new PointModel({
  tasksApiService,
  destinationModel, // <--- ПЕРЕДАЕМ модель пунктов назначения
  offersModel,
});

const filterModel = new FilterModel();

const siteMainElement = document.querySelector(".page-body");
const siteHeaderElement = siteMainElement.querySelector(
  ".trip-controls__filters"
);
const siteListElements = siteMainElement.querySelector(".trip-events");

const boardPresenter = new BoardPresenter({
  boardContainer: siteListElements,
  pointModel,
  filterModel,
  offersModel,
  destinationModel,
});
const filterPresenter = new FilterPresenter({
  filterContainer: siteHeaderElement,
  filterModel,
  pointModel,
});

// const filters = generateFilter(pointModel.points);
// // render(new FilterView(), siteHeaderElement);
// render(new FilterView({ filters }), siteHeaderElement);

filterPresenter.init();
boardPresenter.init();
// pointModel.init();
// 3. Инициализируем модели
// Поскольку pointModel зависит от данных в destinationModel,
// нам нужно сначала дождаться загрузки destinationModel, а потом загружать pointModel.
// Можно сделать это последовательно:
// await destinationModel.init();
// await pointModel.init();

// Или параллельно, если они не зависят друг от друга (но в вашем случае зависят)
// Чтобы избежать гонки состояний, когда View пытается отрендериться раньше, чем все данные загружены,
// лучше использовать Promise.all для всех независимых моделей.
Promise.all([destinationModel.init(), offersModel.init()])
  .then(() => {
    // И только после загрузки всех справочников (пункты назначения, опции),
    // инициализируем модель точек маршрута, которая их использует.
    pointModel.init();
  })
  .catch((err) => {
    // Обработка ошибки, если справочники не загрузились
    console.error("Failed to initialize models", err);
    // Можно показать пользователю сообщение об ошибке
  });

// pointModel.init().finally(() => {
//   render(newTaskButtonComponent, siteHeaderElement);
// });
