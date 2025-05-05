import TaskBoardComponent from '../view/taskboard-component.js';
import TaskListComponent from '../view/task-list-component.js';
import TaskComponent from '../view/task-component.js';
import EmptyTaskListComponent from '../view/empty-task-list-component.js';
import ClearBasketButtonComponent from '../view/clear-basket-button-component.js';
import LoadingViewComponent from '../view/loading-view-component.js';
import { RenderPosition, render } from '../framework/render.js';
import { Status, StatusLabel, UserAction, UpdateType } from '../const.js';

export default class TasksBoardPresenter {
  #boardContainer = null;
  #tasksModel = null;
  #tasksBoardComponent = new TaskBoardComponent();
  #loadingComponent = null;
  #isLoading = true; // Флаг для отслеживания состояния загрузки

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
    this.#tasksModel.addObserver(this.handleModelChange.bind(this));
  }

  get tasks() {
    return this.#tasksModel.tasks;
  }

  async init() {
    this.#loadingComponent = new LoadingViewComponent();
    render(this.#loadingComponent, this.#boardContainer, RenderPosition.BEFOREEND);
    this.#isLoading = true;
    await this.#tasksModel.init(); 
  }

  #renderBoard() {
    render(this.#tasksBoardComponent, this.#boardContainer);

    Object.values(Status).forEach((status) => {
      this.#renderTasksList(status);
      if (status === Status.BASKET) {
        this.#renderClearBasketButton();
      }
    });
  }

  #clearBoard() {
    const tasksContainer = this.#tasksBoardComponent.element.querySelector('.tasks');
    if (tasksContainer) {
      tasksContainer.innerHTML = '';
    }
  }

  handleModelChange(event, payload) {
    switch (event) {
      case UpdateType.INIT:
        this.#isLoading = false;
        if (this.#loadingComponent) {
          this.#loadingComponent.element.remove();
          this.#loadingComponent.removeElement();
          this.#loadingComponent = null;
        }
        if (this.#tasksModel.tasks.length === 0 && !payload?.error) {
          render(
            new LoadingViewComponent(), 
            this.#boardContainer,
            RenderPosition.BEFOREEND
          ).element.innerHTML = '<p>Нет задач</p>';
        } else if (payload?.error) {
          render(
            new LoadingViewComponent(),
            this.#boardContainer,
            RenderPosition.BEFOREEND
          ).element.innerHTML = '<p>Ошибка загрузки данных</p>';
        } else {
          this.#clearBoard();
          this.#renderBoard();
        }
        break;
      case UserAction.ADD_TASK:
      case UserAction.UPDATE_TASK:
      case UserAction.DELETE_TASK:
        this.#clearBoard();
        this.#renderBoard();
        break;
    }
  }

  #renderTasksList(status) {
    const taskListComponent = new TaskListComponent({
      status: status,
      label: StatusLabel[status],
      onTaskDrop: this.#handleTaskDrop.bind(this),
    });
    render(taskListComponent, this.#tasksBoardComponent.element.querySelector('.tasks'));

    const taskListContainer = taskListComponent.element.querySelector('.task-list');
    const tasksForStatus = this.#getTasksByStatus(status);

    if (tasksForStatus.length === 0) {
      this.#renderEmptyList(status, taskListContainer);
    } else {
      tasksForStatus.forEach((task) => {
        this.#renderTask(task, taskListContainer);
      });
    }
  }

  async #handleTaskDrop(taskId, newStatus, targetTaskId, insertPosition) {
    console.log(`Dropping task ${taskId} to status ${newStatus} ${insertPosition} task ${targetTaskId || 'end'}`);
    try {
      await this.#tasksModel.updateTaskStatus(taskId, newStatus, targetTaskId, insertPosition);
    } catch (err) {
      console.error('Ошибка при обновлении статуса задачи:', err);
    }
  }

  #renderClearBasketButton() {
    const status = Status.BASKET;
    const tasksForStatus = this.#getTasksByStatus(status);
    const basketListContainer = this.#tasksBoardComponent.element.querySelector(`.${status} .task-list`);
    if (tasksForStatus.length > 0 && basketListContainer) {
      const clearButtonComponent = new ClearBasketButtonComponent();
      render(clearButtonComponent, basketListContainer);
      clearButtonComponent.element.addEventListener('click', async () => {
        try {
          await this.#tasksModel.clearBasket();
          alert('Корзина очищена!');
        } catch (err) {
          console.error('Ошибка при очистке корзины:', err);
          alert('Не удалось очистить корзину. Попробуйте снова.');
        }
      });
    }
  }

  #renderTask(task, container) {
    const taskComponent = new TaskComponent(task);
    render(taskComponent, container, RenderPosition.BEFOREEND);
  }

  #renderEmptyList(status, container) {
    const emptyListComponent = new EmptyTaskListComponent(status);
    render(emptyListComponent, container);
  }

  #getTasksByStatus(status) {
    return this.#tasksModel.tasks.filter((task) => task.status === status);
  }

  async createTask() {
    const taskTitle = document.querySelector('#new-task').value.trim();
    if (!taskTitle) {
      return;
    }
    try {
      await this.#tasksModel.addTask(taskTitle);
      document.querySelector('#new-task').value = '';
    } catch (err) {
      console.error('Ошибка при создании задачи:', err);
    }
  }
}
