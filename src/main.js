{
  // import FiltersView from "./view/filters-view.js";
  // import SortsView from "./view/sorts-view.js";
  // import NewEventsView from "./view/new-event-view.js";
  // import ListView from "./view/list-view.js";
  // import { render } from "./render.js";
  // const siteBodyElement = document.querySelector(".page-body");
  // const siteFiltersElement = siteBodyElement.querySelector(
  //   ".trip-controls__filters"
  // );
  // const siteSortsElement = siteBodyElement.querySelector(".trip-events");
  // // render(new InfoView(), siteFiltersElement);
  // render(new FiltersView(), siteFiltersElement);
  // render(new SortsView(), siteSortsElement);
  // render(new NewEventsView(), siteSortsElement);
  // render(new ListView(), siteSortsElement);
}
import FilterView from "./view/filters-view.js";
import { render } from "./render.js";
import BoardPresenter from "./presenter/board-presenter.js";
// import EventModel from "./model/event-model.js";
import PointModel from "./model/point-model.js";
// const eventModel = new EventModel();
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

render(new FilterView(), siteHeaderElement);

boardPresenter.init();
