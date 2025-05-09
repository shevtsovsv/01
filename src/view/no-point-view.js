import AbstractView from "../framework/view/abstract-view.js";

function createNoPointTemplate() {
  return `<p class="board__no-tasks">
      Click «ADD NEW TASK» in menu to create your first task
    </p>`;
}

export default class NoPointView extends AbstractView {
  get template() {
    return createNoPointTemplate();
  }
}
