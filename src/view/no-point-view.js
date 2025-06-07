// import AbstractView from "../framework/view/abstract-view.js";

// function createNoPointTemplate() {
//   return `<p class="board__no-tasks">
//       Click «ADD NEW TASK» in menu to create your first task
//     </p>`;
// }

// export default class NoPointView extends AbstractView {
//   get template() {
//     return createNoPointTemplate();
//   }
// }
import AbstractView from "../framework/view/abstract-view.js";
import { FilterType } from "../const.js"; // <-- 1. Убедитесь, что импортируете константы фильтров

// 2. Создаем объект-карту для текстов. Это чище, чем switch или if/else.
const NoPointTextType = {
  [FilterType.EVERYTHING]: "Click New Event to create your first point",
  [FilterType.FUTURE]: "There are no future events now",
  [FilterType.PRESENT]: "There are no present events now",
  [FilterType.PAST]: "There are no past events now",
};

// 3. Функция создания шаблона теперь принимает тип фильтра
function createNoPointTemplate(filterType) {
  const noPointTextValue = NoPointTextType[filterType];

  return `<p class="trip-events__msg">${noPointTextValue}</p>`;
}

export default class NoPointView extends AbstractView {
  #filterType = null;

  // 4. В конструкторе принимаем и сохраняем тип фильтра
  constructor({ filterType }) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    // 5. Передаем сохраненный тип в функцию создания шаблона
    return createNoPointTemplate(this.#filterType);
  }
}
