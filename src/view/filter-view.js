import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const createFilterItemTemplate = (filterItem, currentFilterType) => {
  const {type, name, count} = filterItem;
  const isChecked = type === currentFilterType;
  const isDisabled = count === 0 && type !== FilterType.EVERYTHING;

  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <!-- <label class="trip-filters__filter-label" for="filter-${type}">${name} ${count > 0 ? `<span class="trip-filters__filter-count">${count}</span>` : ''}</label> -->
      <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
    </div>
  `;
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilterType = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();

    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    const filtersTemplate = this.#filters
      .map((filterItem) => createFilterItemTemplate(filterItem, this.#currentFilterType))
      .join('');

    return `
      <form class="trip-filters" action="#" method="get">
        ${filtersTemplate}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
    `;
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();

    this.#handleFilterTypeChange(evt.target.value);
  };
}
