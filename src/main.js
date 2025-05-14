import FilterView from "./view/filters-view.js";
import { render } from "./framework/render";
import { generateFilter } from "./mock/filter.js";
import BoardPresenter from "./presenter/board-presenter.js";
import PointModel from "./model/point-model.js";
const pointModel = new PointModel();

const siteMainElement = document.querySelector(".page-body");
const siteHeaderElement = siteMainElement.querySelector(
  ".trip-controls__filters"
);

const siteListElements = siteMainElement.querySelector(".trip-events");
// const boardPresenter = new BoardPresenter({ boardContainer: siteListElements });
const boardPresenter = new BoardPresenter({
  boardContainer: siteListElements,
  pointModel,
});

const filters = generateFilter(pointModel.points);
// render(new FilterView(), siteHeaderElement);
render(new FilterView({ filters }), siteHeaderElement);

boardPresenter.init();
