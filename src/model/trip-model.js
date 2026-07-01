import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class TripModel extends Observable {
  #tripApiService = null;
  #points = [];
  #destinations = [];
  #offers = [];
  #isFailed = false;

  constructor({tripApiService}) {
    super();

    this.#tripApiService = tripApiService;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  get isFailed() {
    return this.#isFailed;
  }

  async init() {
    try {
      const [points, destinations, offers] = await Promise.all([
        this.#tripApiService.points,
        this.#tripApiService.destinations,
        this.#tripApiService.offers,
      ]);

      this.#points = points;
      this.#destinations = destinations;
      this.#offers = offers;
      this.#isFailed = false;
    } catch (err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
      this.#isFailed = true;
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    const response = await this.#tripApiService.updatePoint(updatedPoint);

    this.#points = [
      ...this.#points.slice(0, index),
      response,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, response);
  }

  async addPoint(updateType, newPoint) {
    const response = await this.#tripApiService.addPoint(newPoint);

    this.#points = [
      response,
      ...this.#points,
    ];

    this._notify(updateType, response);
  }

  async deletePoint(updateType, deletedPoint) {
    const index = this.#points.findIndex((point) => point.id === deletedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    await this.#tripApiService.deletePoint(deletedPoint);

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
