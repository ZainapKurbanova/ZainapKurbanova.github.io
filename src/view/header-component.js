import {  AbstractComponent } from '../framework/view/abstract-component.js';

function createTaskTemplate(task) {
  return `<li class="task-item">${task.title}</li>`;
}

export default class TaskComponent extends AbstractComponent {
  constructor(task) {
    super();
    this._task = task;
  }

  get template() {
    return createTaskTemplate(this._task);
  }
}
