import SortsView from "../view/sorts-view";
import NewEventsView from "../view/new-event-view.js";

import BoardView from "../view/board-view.js";
import EventListView from "../view/event-list-view.js";
import LoadMoreButtonView from "../view/load-more-button-view.js";
import NoPointView from "../view/no-point-view.js";

import { render, RenderPosition, remove } from "../framework/render";
import PointPresenter from "./point-presenter.js";

import { humanizeEventDueDate, formatDuration } from "../utils/task.js";

import {
  sortByPriceDown,
  sortDateDown,
  sortByTimeDown,
} from "../utils/task.js";
import { SortType } from "../const.js";

const POINT_COUNT_PER_STEP = 5;

export default class BoardPresenter {
  #boardComponent = new BoardView();
  #eventListComponent = new EventListView();
  #boardContainer = null;
  #pointModel = null;

  #sortComponent = null;
  #noPointComponent = new NoPointView();

  #loadMoreButtonComponent = null;
  #renderedPointCount = POINT_COUNT_PER_STEP;
  #pointPresenters = new Map();

  #currentSortType = SortType.DATE;

  #renderTask;

  constructor({ boardContainer, pointModel }) {
    this.#boardContainer = boardContainer;
    this.#pointModel = pointModel;
  }

  get points() {
    switch (sthis.#currentSortType) {
      case SortType.DATE:
        return [...this.#pointModel.tasks].sort(sortDateDown);
        break;
      case SortType.TIME:
        return [...this.#pointModel.tasks].sort(sortByTimeDown);
        break;
      case SortType.PRICE:
        return [...this.#pointModel.tasks].sort(sortByPriceDown);
        break;
    }
    return this.#pointModel.points;
  }

  init() {
    this.#renderBoard();
  }

  #handleLoadMoreButtonClick = () => {
    const pointCount = this.points.length;
    const newRenderedPointCount = Math.min(
      pointCount,
      this.#renderedPointCount + POINT_COUNT_PER_STEP
    );
    const points = this.tasks.slice(
      this.#renderedPointCount,
      newRenderedPointCount
    );

    this.#renderPoint(points);
    this.#renderedPointCount = newRenderedPointCount;

    if (this.#renderedPointCount >= pointCount) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  //   #handleSortTypeChange = (sortType) => {
  //     // - Сортируем задачи
  //     if (this.#currentSortType === sortType) {
  //       return;
  //     }

  //     this.#sortTasks(sortType);
  //     // - Очищаем список
  //     // - Рендерим список заново
  //     this.#clearPointList();
  //     this.#renderPointList();
  //   };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointList(); // сбрасываем всё и обнуляем счётчик
    this.#renderPointList(); // отрисовываем нужное количество точек
  };

  #renderSort() {
    this.#sortComponent = new SortsView({
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(
      this.#sortComponent,
      this.#boardComponent.element,
      RenderPosition.AFTERBEGIN
    );
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderTasks(point) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderLoadMoreButton() {
    this.#loadMoreButtonComponent = new LoadMoreButtonView({
      onClick: this.#handleLoadMoreButtonClick,
    });

    render(this.#loadMoreButtonComponent, this.#boardComponent.element);
  }

  #renderNoPoints() {
    render(
      this.#noPointComponent,
      this.#boardComponent.element,
      RenderPosition.AFTERBEGIN
    );
  }

  //   #renderLoadMoreButton() {
  //     this.#loadMoreButtonComponent = new LoadMoreButtonView({
  //       onClick: this.#handleLoadMoreButtonClick
  //     });

  //     render(this.#loadMoreButtonComponent, this.#boardComponent.element);
  //   }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#eventListComponent.element.innerHTML = ""; // если нужно явно очистить DOM
    console.log("pointPresenters ", this.#pointPresenters);
    remove(this.#loadMoreButtonComponent);
  }

  #renderPointList() {
    const pointCount = this.points.length;
    const points = this.points.slice(
      0,
      Math.min(pointCount, POINT_COUNT_PER_STEP)
    );

    render(this.#eventListComponent, this.#boardComponent.element);

    this.#renderTasks(points);
    // Если остались ещё точки — показываем кнопку "Загрузить ещё"
    if (pointCount > this.#renderedPointCount) {
      this.#renderLoadMoreButton();
    }
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);
    if (
      //   this.#boardPoints.length == 0 ||
      this.points.every((point) => point.isArchive)
    ) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointList();
  }
}
