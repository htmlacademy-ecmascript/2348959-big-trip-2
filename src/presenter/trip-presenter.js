import {SortType} from '../const.js';
import {filter} from '../utils/filter.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';
import LoadingView from '../view/loading-view.js';
import NoPointView from '../view/no-point-view.js';
import {UserAction, UpdateType} from '../const.js';
import {render, remove} from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import NewPointPresenter from './new-point-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {sortPointDay, sortPointTime, sortPointPrice} from '../utils/sort.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const uiBlocker = new UiBlocker({
  lowerLimit: TimeLimit.LOWER_LIMIT,
  upperLimit: TimeLimit.UPPER_LIMIT,
});

export default class TripPresenter {
  #points = [];
  #offers = [];
  #isLoading = true;
  #destinations = [];
  #sourcedPoints = [];
  #pointPresenters = [];
  #currentSortType = SortType.DAY;
  #sortComponent = null;
  #noPointComponent = null;
  #loadingComponent = null;
  #tripEventsElement = null;
  #newPointPresenter = null;
  #eventListComponent = null;
  #tripEventsListElement = null;
  #newEventButtonElement = null;

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters = [];
  }

  #clearBoard() {
    this.#clearPointList();

    remove(this.#sortComponent);
    remove(this.#eventListComponent);
    remove(this.#noPointComponent);
    remove(this.#loadingComponent);

    this.#sortComponent = null;
    this.#eventListComponent = null;
    this.#noPointComponent = null;
    this.#loadingComponent = null;
  }

  #getPoints() {
    const activeFilterType = this.filterModel.filter;
    const points = this.tripModel.points;

    return filter[activeFilterType](points);
  }

  #handleNewEventButtonClick = () => {
    this.#handleModeChange();

    if (this.#eventListComponent === null) {
      remove(this.#noPointComponent);
      this.#noPointComponent = null;

      this.#renderSort();
      this.#renderEventList();
    }

    this.#newPointPresenter.init();
    this.#newEventButtonElement.disabled = true;
  };

  #handleNewPointFormClose = () => {
    this.#newEventButtonElement.disabled = false;
  };

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
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#newEventButtonElement.disabled = false;
        this.#clearBoard();
        this.#renderBoard();
        break;
    }
  };

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

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

  #renderLoading() {
    this.#loadingComponent = new LoadingView();
    render(this.#loadingComponent, this.#tripEventsElement);
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

    this.#newPointPresenter = new NewPointPresenter({
      tripEventsListElement: this.#tripEventsListElement,
      offers: this.#offers,
      destinations: this.#destinations,
      onDataChange: this.#handlePointChange,
      onDestroy: this.#handleNewPointFormClose,
    });
  }

  constructor({tripModel, filterModel}) {
    this.tripModel = tripModel;
    this.filterModel = filterModel;

    this.tripModel.addObserver(this.#handleModelEvent);
    this.filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#tripEventsElement = document.querySelector('.trip-events');
    this.#newEventButtonElement = document.querySelector('.trip-main__event-add-btn');

    this.#newEventButtonElement.addEventListener('click', this.#handleNewEventButtonClick);

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

  #handlePointChange = async (userAction, updateType, updatedPoint) => {
    uiBlocker.block();

    try {
      switch (userAction) {
        case UserAction.UPDATE_POINT:
          await this.tripModel.updatePoint(updateType, updatedPoint);
          break;
        case UserAction.ADD_POINT:
          await this.tripModel.addPoint(updateType, updatedPoint);
          break;
        case UserAction.DELETE_POINT:
          await this.tripModel.deletePoint(updateType, updatedPoint);
          break;
      }
    } finally {
      uiBlocker.unblock();
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
