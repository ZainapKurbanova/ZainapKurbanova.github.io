import { createElement } from '../framework/render.js';
import { StatusLabel } from '../const.js';

function createTaskListTemplate(status) {
  return `
    <li class="task ${status}">
      <span class="task-header">${StatusLabel[status]}</span>
      <ul class="task-list"></ul>
    </li>
  `;
}

export default class TaskListComponent {
  constructor(status) {
    this.status = status;
  }

  getTemplate() {
    return createTaskListTemplate(this.status);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
