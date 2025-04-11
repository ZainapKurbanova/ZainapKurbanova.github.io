import {  AbstractComponent } from '../framework/view/abstract-component.js';

function createTaskBoardTemplate() {
  return `
    <section class="tasks-container">
      <ul class="tasks"></ul>
    </section>
  `;
}

export default class TaskBoardComponent extends AbstractComponent {
  get template() {
    return createTaskBoardTemplate();
  }
}
