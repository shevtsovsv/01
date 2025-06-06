import SortsView from "../view/sorts-view";
import NewEventsView from "../view/new-event-view.js";

import BoardView from "../view/board-view.js";
import EventListView from "../view/event-list-view.js";
import LoadMoreButtonView from "../view/load-more-button-view.js";
import NoPointView from "../view/no-point-view.js"; // Убедитесь, что этот компонент может принимать тип фильтра

import { render, RenderPosition, remove, replace } from "../framework/render";
import PointPresenter from "./point-presenter.js";
import { filter } from "../utils/filter.js"; // <--- 1. ИМПОРТИРУЕМ УТИЛИТУ ФИЛЬТРАЦИИ
import {
  sortByPriceDown,
  sortDateDown,
  sortByTimeDown,
} from "../utils/task.js";
import { SortType, UpdateType, UserAction, FilterType } from "../const.js";

const POINT_COUNT_PER_STEP = 5;

export default class BoardPresenter {
  #boardComponent = new BoardView();
  #eventListComponent = new EventListView();
  #boardContainer = null;
  #pointModel = null;
  #filterModel = null; // <--- 3. ДОБАВЛЯЕМ ЗАВИСИМОСТЬ ОТ FILTERMODEL

  #sortComponent = null;
  #noPointComponent = null; // new NoPointView(); Будет создаваться по необходимости

  #loadMoreButtonComponent = null;
  #renderedPointCount = POINT_COUNT_PER_STEP;
  #pointPresenters = new Map();
  #newPointPresenter = null; // Для управления презентером новой точки
  #currentSortType = SortType.DATE;

  constructor({ boardContainer, pointModel, filterModel }) {
    // <--- 4. ПРИНИМАЕМ FILTERMODEL
    this.#boardContainer = boardContainer;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel; // <--- 5. СОХРАНЯЕМ FILTERMODEL

    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent); // <--- 6. ПОДПИСЫВАЕМСЯ НА ИЗМЕНЕНИЯ ФИЛЬТРА
  }

  get points() {
    const currentFilterType = this.#filterModel.filter;
    const allPointsFromModel = this.#pointModel.points;
    const filteredPoints = filter[currentFilterType](allPointsFromModel); // <--- 7. СНАЧАЛА ФИЛЬТРУЕМ

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredPoints.sort(sortDateDown);
      case SortType.TIME:
        return filteredPoints.sort(sortByTimeDown);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPriceDown);
    }
    return filteredPoints; // По умолчанию, если тип сортировки не совпал (хотя такого быть не должно)
  }
  // Геттеры для данных, нужных PointPresenter
  get offers() {
    return this.#pointModel.offers; // Предполагаем, что PointModel предоставляет это
  }

  get destinations() {
    return this.#pointModel.destinations; // Предполагаем, что PointModel предоставляет это
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
    const points = this.points.slice(
      this.#renderedPointCount,
      newRenderedPointCount
    );

    this.#renderPoints(points);
    this.#renderedPointCount = newRenderedPointCount;

    if (this.#renderedPointCount >= pointCount) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #handleModeChange = () => {
    console.log(
      "BoardPresenter: Mode change detected. Closing all other forms."
    );
    console.log("Current presenters count:", this.#pointPresenters.size);
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    console.log("----", updateType, data, this.points);

    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearBoard({
          resetRenderedPointCount: true,
          resetSortType: true,
        });
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({ resetRenderedPointCount: true });
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortsView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(
      this.#sortComponent,
      this.#boardComponent.element,
      RenderPosition.AFTERBEGIN
    );
  }

  #renderPoint(point) {
    // console.log(point);

    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      boardPresenterRef: this, // Передаем ссылку на себя для отмены новой точки
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints(points) {
    console.log(points);

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
    // console.log(points);

    this.#renderPoints(points);
    // Если остались ещё точки — показываем кнопку "Загрузить ещё"
    if (pointCount > this.#renderedPointCount) {
      this.#renderLoadMoreButton();
    }
  }

  #clearBoard({ resetRenderedPointCount = false, resetSortType = false } = {}) {
    const pointCount = this.points.length;

    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#eventListComponent.element.innerHTML = ""; // если нужно явно очистить DOM
    remove(this.#sortComponent);
    remove(this.#noPointComponent);
    remove(this.#loadMoreButtonComponent);

    if (resetRenderedPointCount) {
      this.#renderedPointCount = POINT_COUNT_PER_STEP;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this.#renderedPointCount = Math.min(pointCount, this.#renderedPointCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);
    const points = this.points;
    const pointCount = points.length;
    if (pointCount === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    // this.#renderPointList();

    render(this.#eventListComponent, this.#boardComponent.element);

    // Теперь, когда #renderBoard рендерит доску не только на старте,
    // но и по ходу работы приложения, нужно заменить
    // константу TASK_COUNT_PER_STEP на свойство #renderedTaskCount,
    // чтобы в случае перерисовки сохранить N-показанных карточек
    this.#renderPoints(
      points.slice(0, Math.min(pointCount, this.#renderedPointCount))
    );

    if (pointCount > this.#renderedPointCount) {
      this.#renderLoadMoreButton();
    }
  }
}
