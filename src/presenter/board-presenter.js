import SortsView from "../view/sorts-view";
import NewEventsView from "../view/new-event-view.js";

import BoardView from "../view/board-view.js";
import EventListView from "../view/event-list-view.js";
import LoadMoreButtonView from "../view/load-more-button-view.js";
import NoPointView from "../view/no-point-view.js";

import { render, RenderPosition, remove } from "../framework/render";
import PointPresenter from "./point-presenter.js";
import { updateItem } from "../utils/common.js";
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
  #boardPoints = [];

  #sortComponent = null;
  #noPointComponent = new NoPointView();

  #loadMoreButtonComponent = null;
  #renderedPointCount = POINT_COUNT_PER_STEP;
  #pointPresenters = new Map();

  #currentSortType = SortType.DATE;
  #sourcedBoardPoints = [];

  #renderTask;

  constructor({ boardContainer, pointModel }) {
    this.#boardContainer = boardContainer;
    this.#pointModel = pointModel;
  }

  init() {
    this.#boardPoints = structuredClone(this.#pointModel.points);
    this.#sourcedBoardPoints = structuredClone(this.#pointModel.points);
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

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
    this.#sourcedBoardPoints = updateItem(
      this.#sourcedBoardPoints,
      updatedPoint
    );
  };

  #sortTasks(sortType) {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _boardTasks
    switch (sortType) {
      case SortType.DATE:
        this.#boardPoints.sort(sortDateDown);
        let temp1 = "";
        this.#boardPoints.forEach((element) => {
          temp1 +=
            humanizeEventDueDate(element.dateFrom) +
            "  " +
            formatDuration(element.dateFrom, element.dateTo) +
            " " +
            element.basePrice +
            "\n  ";
        });
        console.log("data", temp1);

        break;
      case SortType.TIME:
        this.#boardPoints.sort(sortByTimeDown);

        let temp2 = "";
        this.#boardPoints.forEach((element) => {
          temp2 +=
            humanizeEventDueDate(element.dateFrom) +
            "  " +
            formatDuration(element.dateFrom, element.dateTo) +
            " " +
            element.basePrice +
            "\n  ";
        });
        console.log("data", temp2);
        break;
      case SortType.PRICE:
        this.#boardPoints.sort(sortByPriceDown);
        let temp3 = "";
        this.#boardPoints.forEach((element) => {
          temp3 +=
            humanizeEventDueDate(element.dateFrom) +
            "  " +
            formatDuration(element.dateFrom, element.dateTo) +
            " " +
            element.basePrice +
            "\n  ";
        });
        console.log("data", temp3);

        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardTasks исходный массив
        this.#boardPoints = structuredClone(this.#sourcedBoardPoints);
    }

    this.#currentSortType = sortType;
  }

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

    this.#sortTasks(sortType);
    this.#clearPointList(); // сбрасываем всё и обнуляем счётчик
    // this.#renderedPointCount = POINT_COUNT_PER_STEP;
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

  #renderPoints(from, to) {
    console.log("from to ", from, " ", to);

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

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#eventListComponent.element.innerHTML = ""; // если нужно явно очистить DOM
    console.log("pointPresenters ", this.#pointPresenters);
    remove(this.#loadMoreButtonComponent);
  }

  //   #renderPointList() {
  //     render(this.#eventListComponent, this.#boardComponent.element);
  //     this.#renderPoints(
  //       0,
  //       Math.min(this.#boardPoints.length, POINT_COUNT_PER_STEP)
  //     );

  //     if (this.#boardPoints.length > POINT_COUNT_PER_STEP) {
  //       this.#renderLoadMoreButton();
  //     }
  //   }
  #renderPointList() {
    render(this.#eventListComponent, this.#boardComponent.element);

    // Отрисовываем от 0 до текущего количества отображаемых точек
    console.log(
      "interval ",
      Math.min(this.#boardPoints.length, this.#renderedPointCount)
    );

    this.#renderPoints(
      0,
      Math.min(this.#boardPoints.length, this.#renderedPointCount)
    );

    // Если остались ещё точки — показываем кнопку "Загрузить ещё"
    if (this.#boardPoints.length > this.#renderedPointCount) {
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
