import {FilterType} from '../const.js';
import {escapeHtml} from '../utils/common.js';
import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filterItem, currentFilterType) => {
  const {type, name, count} = filterItem;
  const isChecked = type === currentFilterType;
  const isDisabled = count === 0 && type !== FilterType.EVERYTHING;

  const escapedType = escapeHtml(type);
  const escapedName = escapeHtml(name);

  return `
    <div class="trip-filters__filter">
      <input id="filter-${escapedType}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${escapedType}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${escapedType}">${escapedName}</label>
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
