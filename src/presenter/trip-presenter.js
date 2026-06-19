import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import PointPresenter from './point-presenter.js';
import NoPointView from '../view/no-point-view.js';
import EventListView from '../view/event-list-view.js';
import {FilterType} from '../const.js';
import {render} from '../framework/render.js';
import {generateFilter} from '../mock/filter.js';

export default class TripPresenter {
  #points = [];
  #destinations = [];
  #offers = [];
  #pointPresenters = [];

  constructor({tripModel}) {
    this.tripModel = tripModel;
  }

  init() {
    const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
    const tripEventsElement = document.querySelector('.trip-events');

    this.#destinations = this.tripModel.destinations;
    this.#points = this.tripModel.points;
    this.#offers = this.tripModel.offers;

    const filters = generateFilter(this.#points);

    render(new FilterView(filters), tripControlsFiltersElement);

    if (this.#points.length === 0) {
      render(new NoPointView(FilterType.EVERYTHING), tripEventsElement);
      return;
    }

    render(new SortView(), tripEventsElement);
    render(new EventListView(), tripEventsElement);

    const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');

    this.#points.forEach((point) => {
      this.#renderPoint(point, tripEventsListElement);
    });
  }

  #renderPoint(point, tripEventsListElement) {
    const pointPresenter = new PointPresenter({
      tripEventsListElement,
      destinations: this.#destinations,
      offers: this.#offers,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point);
    this.#pointPresenters.push(pointPresenter);
  }

  #handlePointChange = (updatedPoint) => {
    const pointIndex = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (pointIndex === -1) {
      return;
    }

    this.#points = [
      ...this.#points.slice(0, pointIndex),
      updatedPoint,
      ...this.#points.slice(pointIndex + 1),
    ];

    this.#pointPresenters[pointIndex].init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
