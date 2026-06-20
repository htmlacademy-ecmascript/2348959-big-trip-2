import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';
import {render, replace, remove} from '../framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #tripEventsListElement = null;
  #point = null;
  #destinations = [];
  #offers = [];
  #eventComponent = null;
  #eventEditComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  constructor({tripEventsListElement, destinations, offers, onDataChange, onModeChange}) {
    this.#tripEventsListElement = tripEventsListElement;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const destination = this.#destinations.find((dest) => dest.id === this.#point.destination);
    const pointOffers = this.#offers.find((item) => item.type === this.#point.type);
    const selectedOffers = pointOffers.offers.filter((offer) => this.#point.offers.includes(offer.id));

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventComponent = new EventView(
      this.#point,
      destination,
      selectedOffers,
      this.#handleRollupButtonClick,
      this.#handleFavoriteClick
    );

    this.#eventEditComponent = new EventEditView(
      this.#point,
      this.#offers,
      this.#destinations,
      this.#handleFormSubmit,
      this.#handleRollupButtonClick
    );

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventComponent, this.#tripEventsListElement);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToEvent();
    }
  }

  #replaceEventToForm = () => {
    this.#handleModeChange();
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;
  };

  #replaceFormToEvent = () => {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToEvent();
    }
  };

  #handleRollupButtonClick = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#replaceEventToForm();
      return;
    }

    this.#replaceFormToEvent();
  };

  #handleFormSubmit = (updatedPoint) => {
    this.#handleDataChange(updatedPoint);
    this.#replaceFormToEvent();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({
      ...this.#point,
      isFavorite: !this.#point.isFavorite,
    });
  };
}
