import {NoPointTextType} from '../const.js';
import {escapeHtml} from '../utils/common.js';
import AbstractView from '../framework/view/abstract-view.js';

export default class NoPointView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();

    this.#filterType = filterType;
  }

  get template() {
    const noPointText = NoPointTextType[this.#filterType];
    const escapedNoPointText = escapeHtml(noPointText);

    return `<p class="trip-events__msg">${escapedNoPointText}</p>`;
  }
}
