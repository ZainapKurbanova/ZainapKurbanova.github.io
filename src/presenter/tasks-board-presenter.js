import TaskBoardComponent from '../view/taskboard-component.js';
import TaskListComponent from '../view/task-list-component.js';
import TaskComponent from '../view/task-component.js';
import ClearBasketButtonComponent from '../view/clear-basket-button-component.js';
import { render } from '../framework/render.js';
import { Status, StatusLabel } from '../const.js';

export default class TasksBoardPresenter {
  #boardContainer = null;
  #tasksModel = null;
  #tasksBoardComponent = new TaskBoardComponent();

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
  }

  init() {
    render(this.#tasksBoardComponent, this.#boardContainer);
    
    const tasks = this.#tasksModel.getTasks();
    
    Object.entries(Status).forEach(([statusKey, statusValue]) => {
      const taskListComponent = new TaskListComponent(statusValue, StatusLabel[statusValue]);
      render(taskListComponent, this.#tasksBoardComponent.getElement().querySelector('.tasks'));
      
      const taskListContainer = taskListComponent.getElement().querySelector('.task-list');
  
      tasks
        .filter(task => task.status === statusValue)
        .forEach(task => {
          const taskComponent = new TaskComponent(task);
          render(taskComponent, taskListContainer);
        });
      if (statusValue === Status.BASKET) {
        render(new ClearBasketButtonComponent(), taskListContainer);
      }
    });
  }
}