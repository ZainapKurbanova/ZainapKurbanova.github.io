import { AbstractComponent } from '../framework/view/abstract-component.js';

function createTaskTemplate(task) {
  return `<li class="task-item" data-task-id="${task.id}">${task.title}</li>`;
}

export default class TaskComponent extends AbstractComponent {
  constructor(task) {
    super();
    this._task = task;
    this.#afterCreateElement();
  }

  get template() {
    return createTaskTemplate(this._task);
  }

  #afterCreateElement() {
    this.#makeTaskDraggable();
  }

  #makeTaskDraggable() {
    this.element.setAttribute('draggable', true);
  
    this.element.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', this._task.id);
      this.element.classList.add('dragging');
    });
  
    this.element.addEventListener('dragend', () => {
      this.element.classList.remove('dragging');
    });
  }
}
