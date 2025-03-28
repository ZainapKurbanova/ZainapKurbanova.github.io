import HeaderComponent from './view/header-component.js';
import FormAddTaskComponent from './view/form-add-task-component.js';
import TaskBoardComponent from './view/taskboard-component.js';
import TaskListComponent from './view/task-list-component.js';
import TaskComponent from './view/task-component.js';
import { render, RenderPosition } from './framework/render.js';

const bodyContainer = document.querySelector('.board-app');
const formContainer = document.querySelector('.task-app-content');

render(new HeaderComponent(), bodyContainer, RenderPosition.AFTERBEGIN);
render(new FormAddTaskComponent(), formContainer);

const board = new TaskBoardComponent();
render(board, formContainer);

for (let i = 0; i < 4; i++) {
    const taskListComponent = new TaskListComponent(
      `Название блока`, 
      'backlog'
    );
    render(taskListComponent, board.getElement().querySelector('.tasks'));
  
    for (let j = 0; j < 3; j++) {
      const taskComponent = new TaskComponent(`Название первой задачи`);
      render(taskComponent, taskListComponent.getElement().querySelector('.task-list'));
    }
  }
