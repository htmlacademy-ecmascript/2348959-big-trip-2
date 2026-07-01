import {escapeHtml} from '../utils/common.js';
import AbstractView from '../framework/view/abstract-view.js';

export default class TripInfoView extends AbstractView {
  #title = '';
  #dates = '';
  #cost = 0;

  constructor({title, dates, cost}) {
    super();

    this.#title = title;
    this.#dates = dates;
    this.#cost = cost;
  }

  get template() {
    const escapedTitle = escapeHtml(this.#title);
    const escapedDates = escapeHtml(this.#dates);
    const escapedCost = escapeHtml(this.#cost);

    return `
      <section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${escapedTitle}</h1>

          <p class="trip-info__dates">${escapedDates}</p>
        </div>

        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${escapedCost}</span>
        </p>
      </section>
    `;
  }
}
