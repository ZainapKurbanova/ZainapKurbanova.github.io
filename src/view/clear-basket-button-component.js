import { createElement } from '../framework/render.js';

function createClearBasketButtonTemplate() {
  return `
    <button type="button" class="btn btn-danger clear-basket-button">
      ✕ Очистить корзину
    </button>
  `;
}

export default class ClearBasketButtonComponent {
  getTemplate() {
    return createClearBasketButtonTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}