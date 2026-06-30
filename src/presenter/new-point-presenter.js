import EventEditView from '../view/event-edit-view.js';
import {UserAction, UpdateType} from '../const.js';
import {render, remove, RenderPosition} from '../framework/render.js';

const BLANK_POINT = {
  type: 'flight',
  destination: '',
  dateFrom: new Date().toISOString(),
  dateTo: new Date().toISOString(),
  basePrice: 0,
  offers: [],
  isFavorite: false,
};

export default class NewPointPresenter {
  #tripEventsListElement = null;
  #offers = [];
  #destinations = [];
  #handleDataChange = null;
  #handleDestroy = null;
  #eventEditComponent = null;

  constructor({tripEventsListElement, offers, destinations, onDataChange, onDestroy}) {
    this.#tripEventsListElement = tripEventsListElement;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#eventEditComponent !== null) {
      return;
    }

    const point = {
      ...BLANK_POINT,
      destination: this.#destinations[0]?.id ?? '',
    };

    this.#eventEditComponent = new EventEditView(
      point,
      this.#offers,
      this.#destinations,
      this.#handleFormSubmit,
      this.#handleCancelClick,
      this.#handleCancelClick,
      true,
    );

    render(this.#eventEditComponent, this.#tripEventsListElement, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#eventEditComponent === null) {
      return;
    }

    remove(this.#eventEditComponent);
    this.#eventEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = async (newPoint) => {
    this.#eventEditComponent.setSaving();

    try {
      await this.#handleDataChange(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        newPoint,
      );

      this.destroy();
      this.#handleDestroy();
    } catch (err) {
      this.#eventEditComponent.resetState();
      this.#eventEditComponent.shake();
    }
  };

  #handleCancelClick = () => {
    this.destroy();
    this.#handleDestroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
      this.#handleDestroy();
    }
  };
}
