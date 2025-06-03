import ListView from "../view/list-view.js";
import EditEventsView from "../view/edit-event-view.js";

import { UserAction, UpdateType } from "../const.js";

import { render, replace, remove } from "../framework/render";
import { UpdateType, UserAction } from "../const.js";

const Mode = {
  DEFAULT: "DEFAULT",
  EDITING: "EDITING",
};

export default class PointPresenter {
  #pointListContainer = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #point = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({ pointListContainer, onDataChange, onModeChange }) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new ListView({
      point: this.#point,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });
    this.#pointEditComponent = new EditEventsView({
      point: this.#point,
      onFormSubmit: this.#handleFormSubmit,
      onEditClick: () => {
        this.#pointEditComponent.reset(this.#point);
        replace(this.#pointComponent, this.#pointEditComponent);
        document.removeEventListener("keydown", this.#escKeyDownHandler);

        this.#mode = Mode.DEFAULT;
      },
      onSaveClick: (updatedPoint) => {
        this.#handleDataChange(updatedPoint); // <-- сохраняем данные
        this.#point = updatedPoint; // <-- обновляем локальное состояние
        this.#replaceFormToCard(); // <-- возвращаемся к карточке
      },
    });

    // render(this.#pointComponent, this.#pointListContainer);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener("keydown", this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener("keydown", this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === "Escape") {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.MINOR, {
      ...this.#point,
      isFavorite: !this.#point.isFavorite,
    });
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.MINOR, point);
    this.#replaceFormToCard();
  };
}
