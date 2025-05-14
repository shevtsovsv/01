import AbstractView from "../framework/view/abstract-view.js";

function createFilterItemTemplate(filter, isChecked) {
  const { type, count } = filter;

  return `
  <div class="trip-filters__filter">
	<input
		type="radio"
		id="filter__${type}"
		class="trip-filters__filter-input  visually-hidden"
		name="trip-filter"
		${isChecked ? "checked" : ""}
		${count === 0 ? "disabled" : ""}
	  />
	  <label for="filter__${type}" class="trip-filters__filter-label">
		${type} <span class="filter__${type}-count">${count}</span></label
	  >
  </div>`;
}

function createFilterTemplate(filterItems) {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join("");
  return `<form class="trip-filters" action="#" method="get">
	 			${filterItemsTemplate}
        	</form>`;
}

export default class FiltersView extends AbstractView {
  #filters = null;

  constructor({ filters }) {
    super();
    this.#filters = filters;
  }
  get template() {
    return createFilterTemplate(this.#filters);
  }
}
