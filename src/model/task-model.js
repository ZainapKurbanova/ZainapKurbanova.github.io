import { tasks } from '../mock/task.js';
import { generateID } from '../utils.js';

export default class TasksModel {
  #boardtasks = tasks;
  #observers = [];

  get tasks() {
    return this.#boardtasks;
  }

  getTasksByStatus(status) {
    return this.#boardtasks.filter((task) => task.status === status);
  }

  addTask(title) {
    const newTask = {
      title,
      status: 'backlog',
      id: generateID(),
    };
    this.#boardtasks.push(newTask);
    this._notifyObservers();
    return newTask;
  }

  clearBasket() {
    this.#boardtasks = this.#boardtasks.filter(task => task.status !== 'trash');
    this._notifyObservers();
  }

  addObserver(observer) {
    this.#observers.push(observer);
  }

  removeObserver(observer) {
    this.#observers = this.#observers.filter((obs) => obs !== observer);
  }

  _notifyObservers() {
    this.#observers.forEach((observer) => observer());
  }

  updateTaskStatus(taskId, newStatus, targetTaskId, insertPosition) {
    const taskIndex = this.#boardtasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;

    const task = this.#boardtasks[taskIndex];
    task.status = newStatus;

    this.#boardtasks.splice(taskIndex, 1);

    if (!targetTaskId || insertPosition === 'end') {
      this.#boardtasks.push(task);
    } else {
      const targetIndex = this.#boardtasks.findIndex(t => t.id === targetTaskId);
      if (targetIndex !== -1) {
        const insertIndex = insertPosition === 'before' ? targetIndex : targetIndex + 1;
        this.#boardtasks.splice(insertIndex, 0, task);
      } else {
        this.#boardtasks.push(task);
      }
    }

    this._notifyObservers();
  }
}
