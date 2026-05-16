import SortView from '../view/sort-view.js';
import EventView from '../view/event-view.js';
import FilterView from '../view/filter-view.js';
import EventListView from '../view/event-list-view.js';
import EventEditView from '../view/event-edit-view.js';
// import EventCreateView from '../view/event-create-view.js';
import { render } from '../render.js';

export default class TripPresenter {
  constructor({tripModel}) {
    this.tripModel = tripModel;
  }

  init() {
    const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
    const tripEventsElement = document.querySelector('.trip-events');
    const destinations = this.tripModel.destinations;
    const points = this.tripModel.points;
    const offers = this.tripModel.offers;

    render(new FilterView(), tripControlsFiltersElement);
    render(new SortView(), tripEventsElement);
    render(new EventListView(), tripEventsElement);

    const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');
    const editPoint = points[0];
    const editDestination = destinations.find((dest) => dest.id === editPoint.destination);
    const editPointOffers = offers.find((item) => item.type === editPoint.type);
    const selectedEditOffers = editPointOffers.offers.filter((offer) => editPoint.offers.includes(offer.id));
    // const createPoint = {
    //   type: 'flight',
    //   destination: destinations[0].id,
    //   dateFrom: new Date().toISOString(),
    //   dateTo: new Date().toISOString(),
    //   basePrice: 0,
    //   offers: [],
    //   isFavorite: false,
    // };

    // const createDestination = destinations.find((dest) => dest.id === createPoint.destination);
    // const createOffers = [];

    render(new EventEditView(editPoint, editDestination, selectedEditOffers, destinations), tripEventsListElement);
    // render(new EventCreateView(createPoint, createDestination, createOffers, destinations), tripEventsListElement);

    // переделай на forEach
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const destination = destinations.find((dest) => dest.id === point.destination);
      const pointOffers = offers.find((item) => item.type === point.type);
      const selectedOffers = pointOffers.offers.filter((offer) => point.offers.includes(offer.id));

      render(new EventView(point, destination, selectedOffers), tripEventsListElement);
    }
  }
}
