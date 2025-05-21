import AbstractView from "../framework/view/abstract-view.js";
import { SortType } from "../const.js";

function createSortsTemplate() {
  return `
  		<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            <div class="trip-sort__item  trip-sort__item--day" data-sort-type="${SortType.DATE}">
              <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day">
              <label class="trip-sort__btn" for="sort-day">Day</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--event">
              <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
              <label class="trip-sort__btn" for="sort-event">Event</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--time" data-sort-type="${SortType.TIME}">
              <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time">
              <label class="trip-sort__btn" for="sort-time">Time</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--price" data-sort-type="${SortType.PRICE}">
              <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" checked>
              <label class="trip-sort__btn" for="sort-price">Price</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--offer">
              <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
              <label class="trip-sort__btn" for="sort-offer">Offers</label>
            </div>
        </form>
  `;
}

export default class SortsView extends AbstractView {
  #handleSortTypeChange = null;

  constructor({ onSortTypeChange }) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener("click", this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortsTemplate();
  }

  //   #sortTypeChangeHandler = (evt) => {
  //     if (evt.target.tagName !== "A") {
  //       return;
  //     }

  //     evt.preventDefault();
  //     this.#handleSortTypeChange(evt.target.dataset.sortType);
  //   };
  #sortTypeChangeHandler = (evt) => {
    const sortItem = evt.target.closest(".trip-sort__item");

    if (!sortItem) {
      return;
    }

    //   evt.preventDefault();

    const sortType = sortItem.dataset.sortType;

    if (sortType) {
      this.#handleSortTypeChange(sortType);
    }
  };
}
