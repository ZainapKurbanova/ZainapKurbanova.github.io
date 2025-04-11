import {  AbstractComponent } from '../framework/view/abstract-component.js';

function createFormAddTaskComponentTemplate() {
    return (
          `<form class="task-form">
            <label for="new-task" class="form-label">Новая задача</label>
              <div class="form-row">
                <input type="text" id="new-task" class="form-input" placeholder="Название задачи...">
                <button type="button" class="btn btn-primary form-button">+ Добавить</button>
              </div>
          </form>`
      );
}

export default class FormAddTaskComponent extends AbstractComponent {
  get template() {
    return createFormAddTaskComponentTemplate();
  }
}
