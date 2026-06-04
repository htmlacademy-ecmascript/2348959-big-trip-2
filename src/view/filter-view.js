import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const createFilterItemTemplate = (filter) => {
  const {type, name, count} = filter;
  const isChecked = type === FilterType.EVERYTHING;
  const isDisabled = count === 0 && type !== FilterType.EVERYTHING;
  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${type}">${name} ${count > 0 ? `<span class="trip-filters__filter-count">${count}</span>` : ''}</label>
    </div>
  `;
};

export default class FilterView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();

    this.#filters = filters;
  }

  get template() {
    const filtersTemplate = this.#filters.map(createFilterItemTemplate).join('');
    return `
      <form class="trip-filters" action="#" method="get">
        ${filtersTemplate}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
    `;
  }
}
