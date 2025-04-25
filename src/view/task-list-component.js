import { AbstractComponent } from '../framework/view/abstract-component.js';
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
  constructor({status, label, onTaskDrop}) {
    super();
    this._status = status;
    this._label = label;
    this.#setDropHandler(onTaskDrop);
  }

  get template() {
    return createTaskListTemplate(this._status, this._label);
  }

  #setDropHandler(onTaskDrop) {
    const container = this.element.querySelector('.task-list');

    container.addEventListener('dragover', (event) => {
      event.preventDefault();
      const { targetTask, insertPosition } = this.#getTargetTask(event);
      if (targetTask) {
        targetTask.classList.add('drop-target');
        targetTask.dataset.insertPosition = insertPosition; 
      }
    });

    container.addEventListener('dragleave', (event) => {
      const targetTask = event.target.closest('.task-item');
      if (targetTask) {
        targetTask.classList.remove('drop-target');
        delete targetTask.dataset.insertPosition;
      }
    });

    container.addEventListener('drop', (event) => {
      event.preventDefault();
      const taskId = event.dataTransfer.getData('text/plain');
      const { targetTask, insertPosition } = this.#getTargetTask(event);
      const targetTaskId = targetTask ? targetTask.dataset.taskId : null;
      if (targetTask) {
        targetTask.classList.remove('drop-target');
        delete targetTask.dataset.insertPosition;
      }
      onTaskDrop(taskId, this._status, targetTaskId, insertPosition);
    });
  }

  #getTargetTask(event) {
    const tasks = Array.from(this.element.querySelectorAll('.task-item'));
    const mouseY = event.clientY;

    if (tasks.length === 0) {
      return { targetTask: null, insertPosition: 'end' };
    }

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const rect = task.getBoundingClientRect();

      if (i === 0 && mouseY < rect.top) {
        return { targetTask: task, insertPosition: 'before' };
      }

      if (mouseY < rect.top + rect.height / 2) {
        return { targetTask: task, insertPosition: 'before' };
      }

      if (i === tasks.length - 1 && mouseY >= rect.top + rect.height / 2) {
        return { targetTask: task, insertPosition: 'after' };
      }
    }

    return { targetTask: tasks[tasks.length - 1], insertPosition: 'after' };
  }
}
