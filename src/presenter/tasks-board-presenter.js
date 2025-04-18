import TaskBoardComponent from '../view/taskboard-component.js';
import TaskListComponent from '../view/task-list-component.js';
import TaskComponent from '../view/task-component.js';
import EmptyTaskListComponent from '../view/empty-task-list-component.js';
import ClearBasketButtonComponent from '../view/clear-basket-button-component.js';
import { render } from '../framework/render.js';
import { Status } from '../const.js';

export default class TasksBoardPresenter {
  #boardContainer = null;
  #tasksModel = null;
  #tasksBoardComponent = new TaskBoardComponent();

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
  

  handleModelChange() {
    this.#clearBoard();
    this.#renderBoard();
  }

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
    this.#tasksModel.addObserver(this.handleModelChange.bind(this));
  }
  get tasks() {
    return this.#tasksModel.tasks;
  }

  init() {
    this.#renderBoard();
  }

  #renderTasksList(status) {
    const taskListComponent = new TaskListComponent(status);
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

  #renderClearBasketButton() {
    const status = Status.BASKET;
    const tasksForStatus = this.#getTasksByStatus(status);
    const basketListContainer = this.#tasksBoardComponent.element
      .querySelector(`.${status} .task-list`);
    if (tasksForStatus.length > 0 && basketListContainer) {
      const clearButtonComponent = new ClearBasketButtonComponent();
      render(clearButtonComponent, basketListContainer);
      clearButtonComponent.element.addEventListener('click', () => {
          this.#tasksModel.clearBasket();
        });
        
    }
  }

  #renderTask(task, container) {
    const taskComponent = new TaskComponent(task);
    render(taskComponent, container);
  }

  #renderEmptyList(status, container) {
    const emptyListComponent = new EmptyTaskListComponent(status);
    render(emptyListComponent, container);
  }

  #getTasksByStatus(status) {
    return this.#tasksModel.getTasksByStatus(status);
  }

  createTask() {
    const taskTitle = document.querySelector('#new-task').value.trim();
    if (!taskTitle) {
      return;
    } 
    this.#tasksModel.addTask(taskTitle);

    document.querySelector('#new-task').value = '';
  }
}
