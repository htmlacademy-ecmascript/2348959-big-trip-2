import {filter} from '../utils/filter.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';
import NoPointView from '../view/no-point-view.js';
import EventListView from '../view/event-list-view.js';
import {render, remove} from '../framework/render.js';
import {SortType} from '../const.js';
import {UserAction, UpdateType} from '../const.js';
import {sortPointDay, sortPointTime, sortPointPrice} from '../utils/sort.js';

export default class TripPresenter {
  #points = [];
  #offers = [];
  #destinations = [];
  #sourcedPoints = [];
  #pointPresenters = [];
  #currentSortType = SortType.DAY;
  #sortComponent = null;
  #noPointComponent = null;
  #eventListComponent = null;
  #tripEventsElement = null;
  #tripEventsListElement = null;

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters = [];
  }

  #clearBoard() {
    this.#clearPointList();

    remove(this.#sortComponent);
    remove(this.#eventListComponent);
    remove(this.#noPointComponent);

    this.#sortComponent = null;
    this.#eventListComponent = null;
    this.#noPointComponent = null;
  }

  #getPoints() {
    const activeFilterType = this.filterModel.filter;
    const points = this.tripModel.points;

    return filter[activeFilterType](points);
  }

  #handleModelEvent = (updateType, update) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters
          .find((presenter) => presenter.point.id === update.id)
          .init(update);
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
    }
  };

  #renderBoard() {
    this.#destinations = this.tripModel.destinations;
    this.#points = this.#getPoints();
    this.#sourcedPoints = [...this.#points];
    this.#offers = this.tripModel.offers;
    this.#currentSortType = SortType.DAY;

    if (this.#points.length === 0) {
      this.#renderNoPoint();
      return;
    }

    this.#renderSort();
    this.#renderEventList();
    this.#renderPointList();
  }

  #renderNoPoint() {
    this.#noPointComponent = new NoPointView(this.filterModel.filter);
    render(this.#noPointComponent, this.#tripEventsElement);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortComponent, this.#tripEventsElement);
  }

  #renderEventList() {
    this.#eventListComponent = new EventListView();
    render(this.#eventListComponent, this.#tripEventsElement);

    this.#tripEventsListElement = this.#tripEventsElement.querySelector('.trip-events__list');
  }

  constructor({tripModel, filterModel}) {
    this.tripModel = tripModel;
    this.filterModel = filterModel;

    this.tripModel.addObserver(this.#handleModelEvent);
    this.filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#tripEventsElement = document.querySelector('.trip-events');
    this.#renderBoard();
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

  #handlePointChange = (userAction, updateType, updatedPoint) => {
    switch (userAction) {
      case UserAction.UPDATE_POINT:
        this.tripModel.updatePoint(updateType, updatedPoint);
        break;
      case UserAction.ADD_POINT:
        this.tripModel.addPoint(updateType, updatedPoint);
        break;
      case UserAction.DELETE_POINT:
        this.tripModel.deletePoint(updateType, updatedPoint);
        break;
    }
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
