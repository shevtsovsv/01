import SortsView from "../view/sorts-view";
import NewEventsView from "../view/new-event-view.js";
import ListView from "../view/list-view.js";
import EditEventsView from "../view/edit-event-view.js";

import BoardView from "../view/board-view.js";
import EventListView from "../view/event-list-view.js";

import { render } from "../render.js";
import { EVENT_COUNT } from "../const.js";

export default class BoardPresenter {
  boardComponent = new BoardView();
  eventListComponent = new EventListView();

  constructor({ boardContainer, pointModel }) {
    this.boardContainer = boardContainer;
    this.pointModel = pointModel;
  }

  init() {
    this.boardPoints = structuredClone(this.pointModel.getPoints());

    render(this.boardComponent, this.boardContainer);
    render(new SortsView(), this.boardComponent.getElement());
    render(
      new NewEventsView(this.boardPoints),
      this.boardComponent.getElement()
    );

    render(this.eventListComponent, this.boardComponent.getElement());
    render(
      new EditEventsView(this.boardPoints),
      this.eventListComponent.getElement()
    );
    for (let i = 0; i < EVENT_COUNT; i++) {
      render(
        new ListView({ point: this.boardPoints[i] }),
        this.eventListComponent.getElement()
      );
    }
  }
}
