import Observable from '../framework/observable.js';
import { UpdateType, UserAction } from '../const.js';
import { generateID } from '../utils.js';

export default class TasksModel extends Observable {
  #tasksApiService = null;
  #boardtasks = [];

  constructor({ tasksApiService }) {
    super();
    this.#tasksApiService = tasksApiService;
  }

  async init() {
    let error = null;
    try {
      const tasks = await this.#tasksApiService.tasks;
      this.#boardtasks = tasks;
      console.log('Данные загружены:', this.#boardtasks);
    } catch (err) {
      this.#boardtasks = [];
      error = err;
      console.error('Ошибка загрузки задач:', err);
    }
    this._notify(UpdateType.INIT, error ? { error } : null);
  }

  get tasks() {
    return this.#boardtasks;
  }

  getTasksByStatus(status) {
    return this.#boardtasks.filter((task) => task.status === status);
  }

  async addTask(title) {
    const newTask = {
      title,
      status: 'backlog',
      id: generateID(),
    };
    try {
      const createdTask = await this.#tasksApiService.addTask(newTask);
      this.#boardtasks.push(createdTask);
      this._notify(UserAction.ADD_TASK, createdTask);
      return createdTask;
    } catch (err) {
      console.error('Ошибка при добавлении задачи на сервер:', err);
      throw err;
    }
  }

  async clearBasket() {
    const tasksToDelete = this.#boardtasks.filter((task) => task.status === 'trash');
    console.log('Задачи для удаления:', tasksToDelete);

    try {
      await Promise.all(
        tasksToDelete.map(async (task) => {
          try {
            await this.#tasksApiService.deleteTask(task.id);
            console.log(`Задача ${task.id} удалена с сервера`);
          } catch (err) {
            if (err.message.includes('404')) {
              console.warn(`Задача ${task.id} не найдена на сервере, игнорируем`);
            } else {
              throw err;
            }
          }
        })
      );
      this.#boardtasks = this.#boardtasks.filter((task) => task.status !== 'trash');
      console.log('Корзина очищена, новый список:', this.#boardtasks);
      this._notify(UserAction.DELETE_TASK);
    } catch (err) {
      console.error('Ошибка при удалении задач с сервера:', err);
      throw err;
    }
  }

  async updateTaskStatus(taskId, newStatus, targetTaskId, insertPosition) {
    const taskIndex = this.#boardtasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) return;

    const task = this.#boardtasks[taskIndex];
    const previousStatus = task.status;
    task.status = newStatus;

    try {
      const updatedTask = await this.#tasksApiService.updateTask(task);
      Object.assign(task, updatedTask);

      this.#boardtasks.splice(taskIndex, 1);
      if (!targetTaskId || insertPosition === 'end') {
        this.#boardtasks.push(task);
      } else {
        const targetIndex = this.#boardtasks.findIndex((t) => t.id === targetTaskId);
        if (targetIndex !== -1) {
          const insertIndex = insertPosition === 'before' ? targetIndex : targetIndex + 1;
          this.#boardtasks.splice(insertIndex, 0, task);
        } else {
          this.#boardtasks.push(task);
        }
      }

      this._notify(UserAction.UPDATE_TASK, task);
    } catch (err) {
      console.error('Ошибка при обновлении статуса задачи на сервере:', err);
      task.status = previousStatus;
      throw err;
    }
  }
}
