import AbstractView from '../framework/view/abstract-view.js';
import {NoPointTextType} from '../const.js';

export default class NoPointView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();

    this.#filterType = filterType;
  }

  get template() {
    const noPointText = NoPointTextType[this.#filterType];

    return `<p class="trip-events__msg">${noPointText}</p>`;
  }
}
