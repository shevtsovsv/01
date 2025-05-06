import SortsView from "../view/sorts-view";
import NewEventsView from "../view/new-event-view.js";
import ListView from "../view/list-view.js";
import EditEventsView from "../view/edit-event-view.js";

import BoardView from "../view/board-view.js";
import EventListView from "../view/event-list-view.js";

// import { render } from "../render.js";
import { render } from "../framework/render";
import { EVENT_COUNT } from "../const.js";

export default class BoardPresenter {
  #boardComponent = new BoardView();
  #eventListComponent = new EventListView();
  #boardContainer;
  #pointModel;
  #boardPoints;

  constructor({ boardContainer, pointModel }) {
    this.#boardContainer = boardContainer;
    this.#pointModel = pointModel;
  }

  init() {
    this.#boardPoints = structuredClone(this.#pointModel.getPoints());

    render(this.#boardComponent, this.#boardContainer);
    // render(new SortsView(), this.boardComponent.getElement());

    render(new SortsView(), this.#boardComponent.element);
    render(
      new NewEventsView({ point: this.#boardPoints[0] }),
      this.#boardComponent.element
    );
    console.log(this.#boardPoints[0]);

    render(this.#eventListComponent, this.#boardComponent.element);
    render(
      new EditEventsView({ point: this.#boardPoints[1] }),
      this.#eventListComponent.element
    );
    for (let i = 2; i < EVENT_COUNT; i++) {
      render(
        new ListView({ point: this.#boardPoints[i] }),
        this.#eventListComponent.element
      );
    }
  }
}
