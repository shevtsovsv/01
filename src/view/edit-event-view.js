// import AbstractView from "../framework/view/abstract-view.js";
import AbstractStatefulView from "../framework/view/abstract-stateful-view.js";
import { humanizeEventDueDateEdit } from "../utils/task.js";
import { getDestination } from "../mock/destination.js";
import OffersModel from "../model/offers-model.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const BLANK_POINT = {
  id: null,
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: null,
};

function createDestinationSelectTemplate(currentDestinationName, currentType) {
  const destinations = getDestination();

  return `
	  <label class="event__label" for="event-destination-select">
		 ${
       currentType
         ? currentType.charAt(0).toUpperCase() + currentType.slice(1)
         : ""
     }
	  </label>
	  <select class="event__input event__input--destination" id="event-destination-select" name="event-destination">
		${destinations
      .map(
        (dest) => `
		  <option value="${dest.name}" ${
          dest.name === currentDestinationName ? "selected" : ""
        }>${dest.name}</option>
		`
      )
      .join("")}
	  </select>
	`;
}

function createEventTypeListTemplate(currentType) {
  const eventTypes = [
    "taxi",
    "bus",
    "train",
    "ship",
    "drive",
    "flight",
    "check-in",
    "sightseeing",
    "restaurant",
  ];

  return `
	  <fieldset class="event__type-group">
		<legend class="visually-hidden">Event type</legend>
		${eventTypes
      .map(
        (type) => `
			  <div class="event__type-item">
				<input id="event-type-${type}-1" class="event__type-input  visually-hidden"
				  type="radio" name="event-type" value="${type}" ${
          currentType === type ? "checked" : ""
        }>
				<label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">
				  ${type.charAt(0).toUpperCase() + type.slice(1)}
				</label>
			  </div>
			`
      )
      .join("")}
	  </fieldset>
	`;
}

function createPointEditTemplate(point) {
  const {
    type,
    destination,
    dateFrom,
    dateTo,
    basePrice,
    offersHtml,
    offersEditHtml,
    favorite,
  } = point;
  const dFrom = humanizeEventDueDateEdit(dateFrom);
  const dTo = humanizeEventDueDateEdit(dateTo);
  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                    	 ${createEventTypeListTemplate(type)}
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    ${createDestinationSelectTemplate(destination.name, type)}
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dFrom}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dTo}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="button">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn card__btn--edit" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    ${offersEditHtml}
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${
                      destination.description
                    }</p>
                  </section>
                </section>
              </form>
            </li>
  `;
}

export default class EditEventsView extends AbstractStatefulView {
  #point = null;
  #handleFormSubmit = null;
  #handleEditClick = null;
  #hendleSaveClick;
  #offersModel = new OffersModel();
  #flatpickrFrom;
  #flatpickrTo;

  constructor({ point = BLANK_POINT, onFormSubmit, onEditClick, onSaveClick }) {
    super();
    this._setState(EditEventsView.parsePointToState(point));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditClick = onEditClick;
    this.#hendleSaveClick = onSaveClick;

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate(this._state);
  }

  reset(point) {
    this.updateElement(EditEventsView.parsePointToState(point));
  }
  #saveClickHendler = () => {
    let point = EditEventsView.parseStateToPoint(this._state);
    // this.updateElement();
    // console.log(point);

    this.#hendleSaveClick(point);
  };
  _restoreHandlers() {
    this.#initFlatpickr();

    this.element
      .querySelector(".event__save-btn")
      .addEventListener("click", this.#saveClickHendler);
    this.element
      .querySelector("form")
      .addEventListener("submit", this.#formSubmitHandler);

    this.element
      .querySelector(".card__btn--edit")
      //   .addEventListener("click", () => alert("ggg"));
      .addEventListener("click", this.#editClickHandler);
    this.element
      .querySelector(".event__input--price")
      .addEventListener("input", this.#priceInputHandler);

    this.element
      .querySelector(".event__type-group")
      .addEventListener("change", this.#eventTypeChangeHandler);
    this.element
      .querySelector(".event__input--destination")
      .addEventListener("change", this.#destinationSelectHandler);
  }

  #initFlatpickr() {
    // Если уже были flatpickr — уничтожаем, чтобы избежать утечек
    if (this.#flatpickrFrom) {
      this.#flatpickrFrom.destroy();
      this.#flatpickrFrom = null;
    }
    if (this.#flatpickrTo) {
      this.#flatpickrTo.destroy();
      this.#flatpickrTo = null;
    }

    // Инициализация flatpickr для даты начала
    this.#flatpickrFrom = flatpickr(
      this.element.querySelector("#event-start-time-1"),
      {
        enableTime: true,
        dateFormat: "d/m/Y H:i",
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      }
    );

    // Инициализация flatpickr для даты конца
    this.#flatpickrTo = flatpickr(
      this.element.querySelector("#event-end-time-1"),
      {
        enableTime: true,
        dateFormat: "d/m/Y H:i",
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
      }
    );
  }

  #dateFromChangeHandler = ([selectedDate]) => {
    // Обновляем состояние даты начала
    this._setState({ dateFrom: selectedDate });

    // Можно добавить логику для ограничения даты конца, если надо
    if (
      this.#flatpickrTo &&
      this._state.dateTo &&
      selectedDate > this._state.dateTo
    ) {
      this._setState({ dateTo: selectedDate });
      this.#flatpickrTo.setDate(selectedDate, false);
    }
  };

  #dateToChangeHandler = ([selectedDate]) => {
    // Обновляем состояние даты конца
    this._setState({ dateTo: selectedDate });

    // Можно добавить логику ограничения даты начала, если надо
    if (
      this.#flatpickrFrom &&
      this._state.dateFrom &&
      selectedDate < this._state.dateFrom
    ) {
      this._setState({ dateFrom: selectedDate });
      this.#flatpickrFrom.setDate(selectedDate, false);
    }
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditEventsView.parseStateToPoint(this._state));
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  static parsePointToState(point) {
    const state = { ...point };
    return state;
  }

  static parseStateToPoint(state) {
    const point = { ...state };
    return point;
  }

  #eventTypeChangeHandler = (evt) => {
    if (evt.target.name === "event-type") {
      const selectedType = evt.target.value;

      // Получаем все доступные оферы для нового типа
      const allOffersForType =
        this.#offersModel.getOffersByType(selectedType) || [];

      // Фильтруем уже выбранные оферы — оставляем только те, которые есть в новом типе
      const newSelectedOffers = (this._state.offers || []).filter((offer) =>
        allOffersForType.some((available) => available.id === offer.id)
      );

      // Генерируем HTML с учётом выбранных
      const offersEditHtml = this.#createOffersTemplate(
        allOffersForType,
        newSelectedOffers
      );

      this.updateElement({
        type: selectedType,
        allOffersForType,
        offers: newSelectedOffers,
        offersEditHtml,
      });
    }
  };

  #createOffersTemplate(allOffersForType, selectedOffers = []) {
    const selectedOfferIds = selectedOffers.map((offer) => offer.id);

    return `
	  <div class="event__available-offers">
		${allOffersForType
      .map((offer) => {
        const isChecked = selectedOfferIds.includes(offer.id) ? "checked" : "";
        const sanitizedTitle = offer.title.toLowerCase().replace(/\s+/g, "-");
        const offerId = `event-offer-${sanitizedTitle}-1`;

        return `
			  <div class="event__offer-selector">
				<input class="event__offer-checkbox visually-hidden"
					   id="${offerId}"
					   type="checkbox"
					   name="event-offer-${sanitizedTitle}"
					   ${isChecked}>
				<label class="event__offer-label" for="${offerId}">
				  <span class="event__offer-title">${offer.title}</span>
				  &plus;&euro;&nbsp;
				  <span class="event__offer-price">${offer.price}</span>
				</label>
			  </div>
			`;
      })
      .join("")}
	  </div>
	`;
  }

  #destinationSelectHandler = (evt) => {
    const selectedCity = evt.target.value;
    const destinations = getDestination();
    const matchedDestination = destinations.find(
      (d) => d.name === selectedCity
    );

    if (matchedDestination) {
      this.updateElement({
        destination: matchedDestination,
      });
    }
  };

  #priceInputHandler = (evt) => {
    // Получаем значение из input
    const value = evt.target.value;

    // Можно добавить проверку и парсинг в число, чтобы не было строк
    const price = Number(value);

    // Обновляем состояние, если число валидное и не NaN
    if (!isNaN(price) && price >= 0) {
      this._setState({ basePrice: price });
    }
  };
}
