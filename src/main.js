import FilterView from "./view/filters-view.js";
import { render } from "./framework/render";
import { generateFilter } from "./mock/filter.js";
import BoardPresenter from "./presenter/board-presenter.js";
import FilterPresenter from "./presenter/filter-presenter.js";
import PointModel from "./model/point-model.js";
import FilterModel from "./model/filter-model.js";

import TasksApiService from "./tasks-api-service.js";
const AUTHORIZATION = "Basic MTExOjExMQ==";
const END_POINT = "https://21.objects.htmlacademy.pro/big-trip";

// const pointModel = new PointModel();
const pointModel = new PointModel({
  tasksApiService: new TasksApiService(END_POINT, AUTHORIZATION),
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
pointModel.init();
