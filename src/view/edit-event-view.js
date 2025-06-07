import AbstractStatefulView from "../framework/view/abstract-stateful-view.js";
import { humanizeEventDueDateEdit } from "../utils/task.js";
import { SortType, UpdateType, UserAction } from "../const.js";
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

function createDestinationSelectTemplate(
  currentDestinationName,
  currentType,
  allDestinations
) {
  return `
	  <label class="event__label" for="event-destination-select">
		 ${
       currentType
         ? currentType.charAt(0).toUpperCase() + currentType.slice(1)
         : ""
     }
	  </label>
	  <select class="event__input event__input--destination" id="event-destination-select" name="event-destination">
		${allDestinations
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

// 👇 Создаем функцию-шаблонизатор для фотоленты
function createPhotosTemplate(pictures) {
  if (!pictures || pictures.length === 0) {
    return "";
  }

  const photosHtml = pictures
    .map(
      (picture) =>
        `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
    )
    .join("\n");

  return `
	  <div class="event__photos-container">
		<div class="event__photos-tape">
		  ${photosHtml}
		</div>
	  </div>`;
}

function createPointEditTemplate(point) {
  const {
    type,
    destination,
    dateFrom,
    dateTo,
    basePrice,
    destinationSelectHtml,
  } = point;
  const dFrom = humanizeEventDueDateEdit(dateFrom);
  const dTo = humanizeEventDueDateEdit(dateTo);
  const photosTemplate = destination
    ? createPhotosTemplate(destination.pictures)
    : "";
  const destinationDescription = destination ? destination.description : "";

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
                     ${destinationSelectHtml} 
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

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn card__btn--edit" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    ${point.offersEditHtml}
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destinationDescription}</p>
					 <!-- ✅ Вставляем сгенерированный HTML фотоленты -->
                    ${photosTemplate}
                  </section>
                </section>
              </form>
            </li>
  `;
}
// ------------------------------------------------------
export default class EditEventsView extends AbstractStatefulView {
  #handleDataChange = null; // Заменит onFormSubmit
  #handleCancelClick = null; // Для кнопки "Rollup" или "Cancel" для новой точки
  #handleDeleteClick = null; // Для кнопки "Delete"

  #offersModel = null;
  #destinationModel = null;
  #flatpickrFrom;
  #flatpickrTo;

  constructor({
    point = BLANK_POINT,
    offersModel,
    destinationModel,
    onDataChange,
    onCancelClick,
    onDeleteClick,
  }) {
    super();
    this._setState(EditEventsView.parsePointToState(point));
    this.#handleDataChange = onDataChange;
    this.#handleCancelClick = onCancelClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#offersModel = offersModel;
    this.#destinationModel = destinationModel;

    this._restoreHandlers();
  }

  get template() {
    // Получаем все доступные офферы для текущего типа из состояния
    const allOffersForType =
      this.#offersModel.getOffersByType(this._state.type) || [];

    // Генерируем HTML для офферов, используя внутренний метод
    const offersEditHtml = this.#createOffersTemplate(
      allOffersForType,
      this._state.offers // this._state.offers - это массив ОБЪЕКТОВ выбранных офферов
    );
    const destinationName = this._state.destination
      ? this._state.destination.name
      : "";
    const allDestinations = this.#destinationModel.destinations;

    const destinationSelectHtml = createDestinationSelectTemplate(
      destinationName,
      this._state.type,
      allDestinations // <--- Передаем реальные данные
    );

    // Передаем в главный шаблонизатор состояние и сгенерированный HTML для офферов
    return createPointEditTemplate({
      ...this._state,
      offersEditHtml,
      destinationSelectHtml,
    });
  }

  reset(point) {
    this.updateElement(
      EditEventsView.parsePointToState(point, this.#offersModel)
    );
  }

  // Обработчик для кнопки "Save" или submit формы
  #saveButtonClickHandler = (evt) => {
    // evt может быть undefined, если вызвано из formSubmitHandler без аргумента
    if (evt) {
      evt.preventDefault();
    }
    const pointToSave = EditEventsView.parseStateToPoint(this._state);

    // const actionType =
    //   this._state.id === null
    //     ? "ADD_TASK" /*UserAction.ADD_TASK*/
    //     : "UPDATE_TASK"; /*UserAction.UPDATE_TASK*/
    // // Для нового элемента обычно MINOR, так как меняется структура списка
    // // Для обновления существующего PATCH, если только он меняется, или MINOR если влияет на сортировку/фильтры
    // const updateType =
    //   actionType === "ADD_TASK" /*UserAction.ADD_TASK*/
    //     ? "MINOR" /*UpdateType.MINOR*/
    //     : "PATCH"; /*UpdateType.PATCH*/

    this.#handleDataChange(pointToSave);
  };

  // Обработчик для кнопки "Delete" или "Cancel" (для новой точки)
  #resetButtonClickHandler = (evt) => {
    evt.preventDefault();
    if (this._state.id === null) {
      // Это новая точка, кнопка "Cancel"
      this.#handleCancelClick(); // Презентер удалит компонент новой точки
    } else {
      // Это существующая точка, кнопка "Delete"
      const pointToDelete = EditEventsView.parseStateToPoint(this._state);
      this.#handleDeleteClick(pointToDelete);
    }
  };
  // Обработчик для кнопки "Rollup" (свернуть/отменить редактирование существующей)
  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCancelClick(); // Презентер должен решить, что делать (например, reset + replaceFormToCard)
  };

  _restoreHandlers() {
    this.#initFlatpickr();

    const formElement = this.element.querySelector("form");
    formElement.addEventListener("submit", this.#saveButtonClickHandler); // Используем общий обработчик

    const rollupButton = this.element.querySelector(".event__rollup-btn");
    if (rollupButton) {
      rollupButton.addEventListener("click", this.#rollupButtonClickHandler);
    }

    const resetButton = this.element.querySelector(".event__reset-btn");
    if (resetButton) {
      resetButton.addEventListener("click", this.#resetButtonClickHandler);
    }

    this.element
      .querySelector(".event__input--price")
      .addEventListener("input", this.#priceInputHandler);

    this.element
      .querySelector(".event__type-group")
      .addEventListener("change", this.#eventTypeChangeHandler);

    const destinationSelect = this.element.querySelector(
      ".event__input--destination"
    );
    if (destinationSelect) {
      // Если destination не выбран (новая точка), селекта может не быть сразу
      destinationSelect.addEventListener(
        "change",
        this.#destinationSelectHandler
      );
    }

    const offersSection = this.element.querySelector(".event__section--offers");
    if (offersSection) {
      offersSection.addEventListener("change", this.#offerChangeHandler);
    }
  }

  #offerChangeHandler = (evt) => {
    if (evt.target.classList.contains("event__offer-checkbox")) {
      const offerId = evt.target.id; // e.g. event-offer-luggage-1
      // Извлечем id оффера из id чекбокса. Предположим, что id оффера это то, что после event-offer- и до -1
      // и что это title в lower-case с '-' вместо пробелов
      // Это не очень надежно, лучше в data-атрибут записывать ID оффера.
      // Для примера, сделаем простой поиск по title
      const offerTitleFromId = evt.target.name.replace("event-offer-", ""); // 'luggage'
      const allOffersForType =
        this.#offersModel.getOffersByType(this._state.type) || [];
      const changedOffer = allOffersForType.find(
        (o) => o.title.toLowerCase().replace(/\s+/g, "-") === offerTitleFromId
      );

      if (!changedOffer) {
        return;
      }

      const currentSelectedOffers = this._state.offers || [];
      let newSelectedOffers;

      if (evt.target.checked) {
        // Добавить оффер, если его еще нет
        if (!currentSelectedOffers.some((o) => o.id === changedOffer.id)) {
          newSelectedOffers = [...currentSelectedOffers, changedOffer];
        } else {
          newSelectedOffers = currentSelectedOffers; // Уже есть
        }
      } else {
        // Удалить оффер
        newSelectedOffers = currentSelectedOffers.filter(
          (o) => o.id !== changedOffer.id
        );
      }
      this._setState({ offers: newSelectedOffers });
      // Не нужно вызывать updateElement здесь, так как шаблон сам перерисует офферы при следующем get template
      // Если нужна немедленная перерисовка только блока офферов, это сложнее с AbstractStatefulView
      // Но так как у нас есть this.updateElement, мы можем его вызвать, если offersEditHtml генерируется на лету
      // this.updateElement({offers: newSelectedOffers}); // Это вызовет _restoreHandlers и пересоздаст flatpickr! Осторожно.
      // Лучше, чтобы get template() сам строил offersEditHtml на основе _state.offers
    }
  };

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
      this.#flatpickrFrom.setDate(selectedDate, false);
    }
  };

  static parsePointToState(point, offersModel) {
    return {
      ...point,
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };
    // allOffersForType - это вспомогательное свойство, которое было в объекте.
    // Оно не является частью "чистых" данных точки и не должно
    // отправляться на сохранение в модель. Удаляем его.
    delete point.allOffersForType;

    // В `state.offers` у нас лежат полные объекты офферов.
    // А модель, по-хорошему, должна хранить только массив их ID.
    // Давайте преобразуем их обратно в ID.
    point.offers = point.offers.map((offer) => offer.id);

    // В `state.destination` у нас полный объект.
    // А модель должна хранить только ID.
    if (point.destination) {
      point.destination = point.destination.id;
    }
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

      this.updateElement({
        type: selectedType,
        offers: newSelectedOffers,
      });
    }
  };

  #createOffersTemplate(allOffersForType, selectedOffers = []) {
    // selectedOffers теперь массив объектов
    const selectedOfferIds = selectedOffers.map((offer) => offer.id);

    if (!allOffersForType || allOffersForType.length === 0) {
      return "<p>No offers available for this type.</p>";
    }

    return `
	  <div class="event__available-offers">
		${allOffersForType
      .map((offer) => {
        const isChecked = selectedOfferIds.includes(offer.id) ? "checked" : "";
        const sanitizedTitle = offer.title.toLowerCase().replace(/\s+/g, "-");
        // Используем data-id для надежного получения ID оффера
        const offerInputId = `event-offer-${sanitizedTitle}-${offer.id}`; // Делаем ID более уникальным

        return `
			  <div class="event__offer-selector">
				<input class="event__offer-checkbox visually-hidden"
					   id="${offerInputId}"
					   type="checkbox"
					   name="event-offer-${sanitizedTitle}"
                       data-offer-id="${offer.id}"
					   ${isChecked}>
				<label class="event__offer-label" for="${offerInputId}">
				  <span class="event__offer-title">${offer.title}</span>
				  +€ 
				  <span class="event__offer-price">${offer.price}</span>
				</label>
			  </div>
			`;
      })
      .join("")}
	  </div>
	`;
  }
  // В #offerChangeHandler теперь нужно будет получать ID из data-offer-id

  #destinationSelectHandler = (evt) => {
    // ... (остается как есть, но обновляет _state)
    const selectedCity = evt.target.value;

    const destinations = this.#destinationModel.destinations; // getDestination() должна возвращать актуальный список
    const matchedDestination = destinations.find(
      (d) => d.name === selectedCity
    );

    if (matchedDestination) {
      this.updateElement({
        // updateElement, чтобы перерисовалась секция с описанием и картинками
        destination: matchedDestination,
      });
    } else {
      this.updateElement({ destination: null }); // Если город не найден
    }
  };

  #priceInputHandler = (evt) => {
    // ... (остается как есть, но обновляет _state)
    const value = evt.target.value;
    const price = Number(value);
    if (!isNaN(price) && price >= 0) {
      this._setState({ basePrice: price }); // Просто меняем стейт, без перерисовки для цены
    } else {
      // Можно добавить логику для обработки невалидного ввода, например, восстановить старое значение
      // evt.target.value = this._state.basePrice; // Это может вызвать рекурсию, если input сразу обновляется
      // Лучше просто не обновлять _setState или очищать поле, если не число
      this._setState({ basePrice: 0 }); // Или какое-то значение по умолчанию
    }
  };

  removeElement() {
    super.removeElement();
    if (this.#flatpickrFrom) {
      this.#flatpickrFrom.destroy();
      this.#flatpickrFrom = null;
    }
    if (this.#flatpickrTo) {
      this.#flatpickrTo.destroy();
      this.#flatpickrTo = null;
    }
  }
}
