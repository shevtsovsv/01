import SortsView from "../view/sorts-view";
import NewEventsView from "../view/new-event-view.js";
import ListView from "../view/list-view.js";
import EditEventsView from "../view/edit-event-view.js";

import BoardView from "../view/board-view.js";
import EventListView from "../view/event-list-view.js";
import LoadMoreButtonView from "../view/load-more-button-view.js";
import NoPointView from "../view/no-point-view.js";

import { render, RenderPosition, replace, remove } from "../framework/render";

const POINT_COUNT_PER_STEP = 5;

export default class BoardPresenter {
  #boardComponent = new BoardView();
  #eventListComponent = new EventListView();
  #boardContainer = null;
  #pointModel = null;
  #boardPoints = [];

  #sortComponent = new SortsView();
  #noTaskComponent = new NoPointView();

  #loadMoreButtonComponent = null;
  #renderedPointCount = POINT_COUNT_PER_STEP;

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
    this.#renderedPointCount(
      this.#renderedPointCount,
      this.#renderedPointCount + TASK_COUNT_PER_STEP
    );
    this.#renderedPointCount += POINT_COUNT_PER_STEP;
    if (this.#renderedPointCount >= this.#boardPoints.length) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #renderSort() {
    render(
      this.#sortComponent,
      this.#boardComponent.element,
      RenderPosition.AFTERBEGIN
    );
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === "Escape") {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener("keydown", escKeyDownHandler);
      }
    };
    const pointComponent = new ListView({
      point,
      onEditClick: () => {
        replaceCardToForm();
        document.addEventListener("keydown", escKeyDownHandler);
      },
    });
    const pointEditComponent = new EditEventsView({
      point,
      onFormSubmit: () => {
        replaceFormToCard();
        document.removeEventListener("keydown", escKeyDownHandler);
      },
      onEditClick: () => {
        replaceFormToCard();
        document.removeEventListener("keydown", escKeyDownHandler);
      },
    });

    function replaceCardToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToCard() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#eventListComponent.element);
  }
  #renderTasks(from, to) {
    this.#boardPoints
      .slice(from, to)
      .forEach((task) => this.#renderPoint(task));
  }

  #renderLoadMoreButton() {
    this.#loadMoreButtonComponent = new LoadMoreButtonView({
      onClick: this.#handleLoadMoreButtonClick,
    });

    render(this.#loadMoreButtonComponent, this.#boardComponent.element);
  }

  #renderNoTasks() {
    render(
      this.#noTaskComponent,
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

  #renderTaskList() {
    render(this.#eventListComponent, this.#boardComponent.element);
    this.#renderTasks(
      0,
      Math.min(this.#boardPoints.length, POINT_COUNT_PER_STEP)
    );

    if (this.#boardPoints.length > POINT_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);

    if (this.#boardPoints.every((task) => task.isArchive)) {
      this.#renderNoTasks();
      return;
    }

    this.#renderSort();
    this.#renderTaskList();
  }
}
