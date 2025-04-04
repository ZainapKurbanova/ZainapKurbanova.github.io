import HeaderComponent from './view/header-component.js';
import FormAddTaskComponent from './view/form-add-task-component.js';
import TaskBoardComponent from './view/taskboard-component.js';
import { render, RenderPosition } from './framework/render.js';
import TasksBoardPresenter from './presenter/tasks-board-presenter.js';
import TasksModel from './model/task-model.js';

const bodyContainer = document.querySelector('body'); 
const formContainer = document.querySelector('.task-app-content');
const board = new TaskBoardComponent();
const tasksModel = new TasksModel();

const appContainer = document.createElement('div');
appContainer.className = 'app-container';
bodyContainer.appendChild(appContainer);

const header = new HeaderComponent();
render(header, appContainer);

const content = document.createElement('section');
content.className = 'task-app-content';
appContainer.appendChild(content);

render(new FormAddTaskComponent(), content);
render(board, content);

const tasksBoardPresenter = new TasksBoardPresenter({
  boardContainer: board.getElement(),
  tasksModel: tasksModel
});
tasksBoardPresenter.init();
