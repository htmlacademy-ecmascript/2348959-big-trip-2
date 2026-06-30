import TripInfoView from '../view/trip-info-view.js';
import {render, replace, remove, RenderPosition} from '../framework/render.js';
import {getTripTitle, getTripDates, getTripCost} from '../utils/trip.js';

export default class TripInfoPresenter {
  #tripMainElement = null;
  #tripModel = null;
  #tripInfoComponent = null;

  constructor({tripMainElement, tripModel}) {
    this.#tripMainElement = tripMainElement;
    this.#tripModel = tripModel;

    this.#tripModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const points = this.#tripModel.points;
    const destinations = this.#tripModel.destinations;
    const offers = this.#tripModel.offers;

    const prevTripInfoComponent = this.#tripInfoComponent;

    if (points.length === 0) {
      remove(prevTripInfoComponent);
      this.#tripInfoComponent = null;
      return;
    }

    this.#tripInfoComponent = new TripInfoView({
      title: getTripTitle(points, destinations),
      dates: getTripDates(points),
      cost: getTripCost(points, offers),
    });

    if (prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#tripMainElement, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };
}
