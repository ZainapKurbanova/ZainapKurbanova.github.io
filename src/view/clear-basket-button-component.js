import {  AbstractComponent } from '../framework/view/abstract-component.js';

function createClearBasketButtonTemplate() {
  return `
    <button type="button" class="btn btn-danger clear-basket-button">
      ✕ Очистить корзину
    </button>
  `;
}

export default class ClearBasketButtonComponent extends AbstractComponent {
  get template() {
    return createClearBasketButtonTemplate();
  }
}
