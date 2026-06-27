import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripModel from './model/trip-model.js';
import FilterModel from './model/filter-model.js';

const tripModel = new TripModel();
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter({
  tripModel,
  filterModel,
});

const filterPresenter = new FilterPresenter({
  filterContainer: document.querySelector('.trip-controls__filters'),
  filterModel,
  tripModel,
});

filterPresenter.init();
tripPresenter.init();
