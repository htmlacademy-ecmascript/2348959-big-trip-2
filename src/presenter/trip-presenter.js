import SortView from '../view/sort-view.js';
import EventView from '../view/event-view.js';
import FilterView from '../view/filter-view.js';
import EventEditView from '../view/event-edit-view.js';
import EventCreateView from '../view/event-create-view.js';
import { render } from '../render.js';

export default class TripPresenter {
  init() {
    const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
    const tripEventsElement = document.querySelector('.trip-events');

    render(new FilterView(), tripControlsFiltersElement);
    render(new SortView(), tripEventsElement);

    const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');

    render(new EventEditView(), tripEventsListElement);
    render(new EventCreateView(), tripEventsListElement);

    for (let i = 0; i < 3; i++) {
      render(new EventView(), tripEventsListElement);
    }
  }
}
