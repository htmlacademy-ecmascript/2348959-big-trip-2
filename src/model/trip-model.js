import {points} from '../mock/point.js';
import {offers} from '../mock/offer.js';
import {destinations} from '../mock/destination.js';
import Observable from '../framework/observable.js';

export default class TripModel extends Observable {
  #points = points;

  get points() {
    return this.#points;
  }

  get destinations() {
    return destinations;
  }

  get offers() {
    return offers;
  }

  setPoints(updateType, newPoints) {
    this.#points = newPoints;
    this._notify(updateType);
  }

  updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      updatedPoint,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, updatedPoint);
  }

  addPoint(updateType, newPoint) {
    this.#points = [
      newPoint,
      ...this.#points,
    ];

    this._notify(updateType, newPoint);
  }

  deletePoint(updateType, deletedPoint) {
    const index = this.#points.findIndex((point) => point.id === deletedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
