import SortsView from "../view/sorts-view";
import NewEventsView from "../view/new-event-view.js";
import ListView from "../view/list-view.js";
import EditEventsView from "../view/edit-event-view.js";

import BoardView from "../view/board-view.js";
import EventListView from "../view/event-list-view.js";
import LoadMoreButtonView from "../view/load-more-button-view.js";

import { render, remove, replace } from "../framework/render";
import { EVENT_COUNT } from "../const.js";

const POINT_COUNT_PER_STEP = 5;

export default class BoardPresenter {
  #boardComponent = new BoardView();
  #eventListComponent = new EventListView();
  #boardContainer = null;
  #pointModel = null;
  #boardPoints = [];

  #loadMoreButtonComponent = null;
  #renderedPointCount = POINT_COUNT_PER_STEP;

  constructor({ boardContainer, pointModel }) {
    this.#boardContainer = boardContainer;
    this.#pointModel = pointModel;
  }

  init() {
    this.#boardPoints = structuredClone(this.#pointModel.getPoints());

    render(this.#boardComponent, this.#boardContainer);

    render(new SortsView(), this.#boardComponent.element);

    render(this.#eventListComponent, this.#boardComponent.element);

    for (
      let i = 0;
      i < Math.min(this.#boardPoints.length, POINT_COUNT_PER_STEP);
      i++
    ) {
      this.#renderPoint(this.#boardPoints[i]);
    }
    if (this.#boardPoints.length > POINT_COUNT_PER_STEP) {
      this.#loadMoreButtonComponent = new LoadMoreButtonView({
        onClick: this.#handleLoadMoreButtonClick,
      });
      render(this.#loadMoreButtonComponent, this.#boardComponent.element);
    }
  }

  #handleLoadMoreButtonClick = () => {
    this.#boardPoints
      .slice(
        this.#renderedPointCount,
        this.#renderedPointCount + POINT_COUNT_PER_STEP
      )
      .forEach((task) => this.#renderPoint(task));
    this.#renderedPointCount += POINT_COUNT_PER_STEP;
    if (this.#renderedPointCount >= this.#boardPoints.length) {
      remove(this.#loadMoreButtonComponent);
    }
  };

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
}
