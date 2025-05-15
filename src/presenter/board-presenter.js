import SortsView from "../view/sorts-view";
import NewEventsView from "../view/new-event-view.js";

import BoardView from "../view/board-view.js";
import EventListView from "../view/event-list-view.js";
import LoadMoreButtonView from "../view/load-more-button-view.js";
import NoPointView from "../view/no-point-view.js";

import { render, RenderPosition, remove } from "../framework/render";
import PointPresenter from "./point-presenter.js";
import { updateItem } from "../utils/common.js";

const POINT_COUNT_PER_STEP = 5;

export default class BoardPresenter {
  #boardComponent = new BoardView();
  #eventListComponent = new EventListView();
  #boardContainer = null;
  #pointModel = null;
  #boardPoints = [];

  #sortComponent = new SortsView();
  #noPointComponent = new NoPointView();

  #loadMoreButtonComponent = null;
  #renderedPointCount = POINT_COUNT_PER_STEP;
  #pointPresenters = new Map();

  #renderTask;

  constructor({ boardContainer, pointModel }) {
    this.#boardContainer = boardContainer;
    this.#pointModel = pointModel;
  }

  init() {
    this.#boardPoints = structuredClone(this.#pointModel.points);
    this.#renderBoard();
  }

  #handleLoadMoreButtonClick = () => {
    this.#renderPoints(
      this.#renderedPointCount,
      this.#renderedPointCount + POINT_COUNT_PER_STEP
    );
    this.#renderedPointCount += POINT_COUNT_PER_STEP;
    if (this.#renderedPointCount >= this.#boardPoints.length) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderSort() {
    render(
      this.#sortComponent,
      this.#boardComponent.element,
      RenderPosition.AFTERBEGIN
    );
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventListComponent.element,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints(from, to) {
    this.#boardPoints
      .slice(from, to)
      .forEach((point) => this.#renderPoint(point));
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

  #clearTaskList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#pointPresenters.clear();
    this.#renderedPointCount = POINT_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  }

  #renderPointList() {
    render(this.#eventListComponent, this.#boardComponent.element);
    this.#renderPoints(
      0,
      Math.min(this.#boardPoints.length, POINT_COUNT_PER_STEP)
    );

    if (this.#boardPoints.length > POINT_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);
    if (
      //   this.#boardPoints.length == 0 ||
      this.#boardPoints.every((point) => point.isArchive)
    ) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointList();
  }
}
