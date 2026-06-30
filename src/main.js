import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripModel from './model/trip-model.js';
import FilterModel from './model/filter-model.js';
import TripApiService from './trip-api-service.js';

const AUTHORIZATION = 'Basic qwerty12345';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const tripApiService = new TripApiService(END_POINT, AUTHORIZATION);

const tripModel = new TripModel({
  tripApiService,
});
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
tripModel.init();
