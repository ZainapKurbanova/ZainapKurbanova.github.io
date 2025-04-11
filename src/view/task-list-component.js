import {  AbstractComponent } from '../framework/view/abstract-component.js';
import { StatusLabel } from '../const.js';

function createTaskListTemplate(status) {
  return `
    <li class="task ${status}">
      <span class="task-header">${StatusLabel[status]}</span>
      <ul class="task-list"></ul>
    </li>
  `;
}

export default class TaskListComponent extends AbstractComponent {
  constructor(status) {
    super();
    this._status = status;
  }

  get template() {
    return createTaskListTemplate(this._status);
  }
}
