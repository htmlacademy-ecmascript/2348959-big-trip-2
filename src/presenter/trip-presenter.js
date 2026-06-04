import SortView from '../view/sort-view.js';
import EventView from '../view/event-view.js';
import FilterView from '../view/filter-view.js';
import NoPointView from '../view/no-point-view.js';
import EventListView from '../view/event-list-view.js';
import EventEditView from '../view/event-edit-view.js';
import {FilterType} from '../const.js';
import {generateFilter} from '../mock/filter.js';
import {render, replace} from '../framework/render.js';

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
    const filters = generateFilter(points);

    render(new FilterView(filters), tripControlsFiltersElement);

    if (points.length === 0) {
      render(new NoPointView(FilterType.EVERYTHING), tripEventsElement);
      return;
    }

    render(new SortView(), tripEventsElement);
    render(new EventListView(), tripEventsElement);

    const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');

    points.forEach((point) => {
      this.#renderPoint(point, tripEventsListElement, destinations, offers);
    });
  }

  #renderPoint(point, tripEventsListElement, destinations, offers) {
    const destination = destinations.find((dest) => dest.id === point.destination);
    const pointOffers = offers.find((item) => item.type === point.type);
    const selectedOffers = pointOffers.offers.filter((offer) => point.offers.includes(offer.id));

    let eventComponent = null;
    let eventEditComponent = null;

    const replaceEventToForm = () => {
      replace(eventEditComponent, eventComponent);
      document.addEventListener('keydown', onEscKeyDown);
    };

    const replaceEventToEvent = () => {
      replace(eventComponent, eventEditComponent);
      document.removeEventListener('keydown', onEscKeyDown);
    };

    eventComponent = new EventView(
      point,
      destination,
      selectedOffers,
      replaceEventToForm
    );

    eventEditComponent = new EventEditView(
      point,
      destination,
      selectedOffers,
      destinations,
      replaceEventToEvent,
      replaceEventToEvent
    );

    function onEscKeyDown(evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEventToEvent();
      }
    }

    render(eventComponent, tripEventsListElement);
  }
}
