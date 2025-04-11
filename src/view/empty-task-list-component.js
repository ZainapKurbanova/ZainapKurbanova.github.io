import {  AbstractComponent } from '../framework/view/abstract-component.js';

function createEmptyTaskListTemplate(status) {
  return `
    <li class="empty-task-list">
      <span>Перетащите карточку</span>
    </li>
  `;
}

export default class EmptyTaskListComponent extends AbstractComponent {
  constructor(status) {
    super();
    this._status = status;
  }

  get template() {
    return createEmptyTaskListTemplate(this._status);
  }
}