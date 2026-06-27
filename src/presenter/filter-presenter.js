import FilterView from '../view/filter-view.js';
import {render, replace, remove} from '../framework/render.js';
import {generateFilter} from '../mock/filter.js';
import {UpdateType} from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #tripModel = null;
  #filterComponent = null;

  constructor({filterContainer, filterModel, tripModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#tripModel = tripModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#tripModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const filters = generateFilter(this.#tripModel.points);
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange,
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
