import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import PointPresenter from './point-presenter.js';
import NoPointView from '../view/no-point-view.js';
import EventListView from '../view/event-list-view.js';
import {render} from '../framework/render.js';
import {generateFilter} from '../mock/filter.js';
import {FilterType, SortType} from '../const.js';
import {sortPointDay, sortPointTime, sortPointPrice} from '../utils/sort.js';

export default class TripPresenter {
  #points = [];
  #offers = [];
  #destinations = [];
  #sourcedPoints = [];
  #pointPresenters = [];
  #tripEventsListElement = null;
  #currentSortType = SortType.DAY;

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters = [];
  }

  constructor({tripModel}) {
    this.tripModel = tripModel;
  }

  init() {
    const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
    const tripEventsElement = document.querySelector('.trip-events');

    this.#destinations = this.tripModel.destinations;
    this.#points = this.tripModel.points;
    this.#sourcedPoints = [...this.#points];
    this.#offers = this.tripModel.offers;

    const filters = generateFilter(this.#points);

    render(new FilterView(filters), tripControlsFiltersElement);

    if (this.#points.length === 0) {
      render(new NoPointView(FilterType.EVERYTHING), tripEventsElement);
      return;
    }

    render(new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
    }), tripEventsElement);
    render(new EventListView(), tripEventsElement);

    this.#tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');

    this.#renderPointList();
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

  #renderPointList() {
    this.#sourcedPoints.forEach((point) => {
      this.#renderPoint(point, this.#tripEventsListElement);
    });
  }

  #handlePointChange = (updatedPoint) => {
    const pointIndex = this.#points.findIndex((point) => point.id === updatedPoint.id);
    const sourcedPointIndex = this.#sourcedPoints.findIndex((point) => point.id === updatedPoint.id);

    if (pointIndex === -1 || sourcedPointIndex === -1) {
      return;
    }

    this.#points = [
      ...this.#points.slice(0, pointIndex),
      updatedPoint,
      ...this.#points.slice(pointIndex + 1),
    ];

    this.#sourcedPoints = [
      ...this.#sourcedPoints.slice(0, sourcedPointIndex),
      updatedPoint,
      ...this.#sourcedPoints.slice(sourcedPointIndex + 1),
    ];

    this.#pointPresenters[sourcedPointIndex].init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPointList();
  };

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this.#sourcedPoints.sort(sortPointTime);
        break;
      case SortType.PRICE:
        this.#sourcedPoints.sort(sortPointPrice);
        break;
      case SortType.DAY:
        this.#sourcedPoints.sort(sortPointDay);
        break;
      default:
        throw new Error(`Unknown sort type: ${sortType}`);
    }
  }
}
