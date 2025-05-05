import HeaderComponent from './view/header-component.js';
import FormAddTaskComponent from './view/form-add-task-component.js';
import TaskBoardComponent from './view/taskboard-component.js';
import { render } from './framework/render.js';
import TasksBoardPresenter from './presenter/tasks-board-presenter.js';
import TasksModel from './model/task-model.js';
import TasksApiService from './tasks-api-service.js';

const END_POINT = 'https://6818911a5a4b07b9d1cfc51e.mockapi.io';
const bodyContainer = document.querySelector('body'); 
const tasksModel = new TasksModel({
  tasksApiService: new TasksApiService(END_POINT)
});

const appContainer = document.createElement('div');
appContainer.className = 'app-container';
bodyContainer.appendChild(appContainer);

const header = new HeaderComponent();
render(header, appContainer);

const content = document.createElement('section');
content.className = 'task-app-content';
appContainer.appendChild(content);

const formAddTaskComponent = new FormAddTaskComponent({
  onClick: handleNewTaskButtonClick
});

function handleNewTaskButtonClick() {
  tasksBoardPresenter.createTask();
}
render(formAddTaskComponent, content);

const boardComponent = new TaskBoardComponent();
render(boardComponent, content);

const tasksBoardPresenter = new TasksBoardPresenter({
  boardContainer: boardComponent.element,  
  tasksModel: tasksModel
});
tasksBoardPresenter.init();
