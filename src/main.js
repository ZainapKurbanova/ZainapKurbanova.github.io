import HeaderComponent from './view/header-component.js';
import { render, RenderPosition } from './framework/render.js';


const bodyContainer = document.querySelector('body');
render(new HeaderComponent(), bodyContainer, RenderPosition.AFTERBEGIN);

