import SortsView from "../view/sorts-view";
import NewEventsView from "../view/new-event-view.js";
import ListView from "../view/list-view.js";
import EditEventsView from "../view/edit-event-view.js";

import BoardView from "../view/board-view.js";
import EventListView from "../view/event-list-view.js";
import LoadMoreButtonView from "../view/load-more-button-view.js";

// import { render } from "../render.js";
import { render, remove } from "../framework/render";
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
    // render(new SortsView(), this.boardComponent.getElement());

    render(new SortsView(), this.#boardComponent.element);
    // render(
    //   new NewEventsView({ point: this.#boardPoints[0] }),
    //   this.#boardComponent.element
    // );

    render(this.#eventListComponent, this.#boardComponent.element);
    // render(
    //   new EditEventsView({ point: this.#boardPoints[1] }),
    //   this.#eventListComponent.element
    // );
    // for (let i = 2; i < EVENT_COUNT; i++) {
    //   render(
    //     new ListView({ point: this.#boardPoints[i] }),
    //     this.#eventListComponent.element
    //   );
    // }
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
    const pointComponent = new ListView({ point });

    render(pointComponent, this.#eventListComponent.element);
  }
}
