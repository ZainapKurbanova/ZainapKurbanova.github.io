import { createElement } from '../framework/render.js';

function createTaskListTemplate(title, statusClass) { 
  return `
    <li class="task ${statusClass}">
      <span class="task-header">${title}</span>
      <ul class="task-list"></ul>
    </li>
  `;
}

export default class TaskListComponent {
  constructor(title, statusClass) { 
    this.title = title;
    this.statusClass = statusClass;
  }

  getTemplate() {
    return createTaskListTemplate(this.title, this.statusClass);
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
