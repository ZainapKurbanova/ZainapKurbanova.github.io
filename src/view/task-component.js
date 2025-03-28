import { createElement } from '../framework/render.js';

function createTaskTemplate(taskName) {
  return `<li class="task-item">${taskName}</li>`;
}

export default class TaskComponent {
  constructor(taskName) {
    this.taskName = taskName;
  }

  getTemplate() {
    return createTaskTemplate(this.taskName);
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
