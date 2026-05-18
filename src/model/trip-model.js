import {points} from '../mock/point.js';
import {offers} from '../mock/offer.js';
import {destinations} from '../mock/destination.js';

export default class TripModel {
  get points() {
    return points;
  }

  get destinations() {
    return destinations;
  }

  get offers() {
    return offers;
  }
}
