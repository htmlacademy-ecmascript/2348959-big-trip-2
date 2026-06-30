import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import {escapeHtml} from '../utils/common.js';
import {humanizeEditEventDate} from '../utils/point.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const sanitizePriceValue = (value) => {
  const digitsOnly = value.replace(/\D/g, '');

  return digitsOnly.replace(/^0+(?=\d)/, '');
};

export default class EventEditView extends AbstractStatefulView {
  #offers = [];
  #destinations = [];
  #datepickerTo = null;
  #datepickerFrom = null;
  #handleFormSubmit = null;
  #handleRollupButtonClick = null;
  #handleDeleteClick = null;
  #isNewPoint = false;

  static parsePointToState(point) {
    return {
      ...point,
      isSaving: false,
      isDeleting: false,
      isDisabled: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.isSaving;
    delete point.isDeleting;
    delete point.isDisabled;

    return point;
  }

  constructor(point, offers, destinations, onFormSubmit, onRollupButtonClick, onDeleteClick, isNewPoint = false) {
    super();

    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupButtonClick = onRollupButtonClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#isNewPoint = isNewPoint;

    this._setState(EventEditView.parsePointToState(point));

    this._restoreHandlers();
  }

  get template() {
    const {type, basePrice, dateFrom, dateTo, destination, offers, isSaving, isDeleting, isDisabled} = this._state;
    const currentDestination = this.#destinations.find((dest) => dest.id === destination) ?? {
      name: '',
      description: '',
      pictures: [],
    };
    const {name, description, pictures} = currentDestination;

    const escapedType = escapeHtml(type);
    const escapedBasePrice = escapeHtml(basePrice);
    const escapedName = escapeHtml(name);
    const escapedDescription = escapeHtml(description);

    const currentTypeOffers = this.#offers.find((item) => item.type === type)?.offers ?? [];

    const offersTemplate = currentTypeOffers.map((offer) => {
      const escapedId = escapeHtml(offer.id);
      const escapedTitle = escapeHtml(offer.title);
      const escapedPrice = escapeHtml(offer.price);

      return `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${escapedId}-1" type="checkbox" name="event-offer-${escapedId}" data-offer-id="${escapedId}" ${offers.includes(offer.id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
          <label class="event__offer-label" for="event-offer-${escapedId}-1">
            <span class="event__offer-title">${escapedTitle}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${escapedPrice}</span>
          </label>
        </div>
      `;
    }).join('');

    const picturesTemplate = pictures.map((picture) => `
      <img class="event__photo" src="${escapeHtml(picture.src)}" alt="${escapeHtml(picture.description)}">
    `).join('');

    const destinationSectionTemplate = destination ? `
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${escapedDescription}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${picturesTemplate}
          </div>
        </div>
      </section>
    ` : '';

    const dateFromValue = dateFrom ? humanizeEditEventDate(dateFrom) : '';
    const dateToValue = dateTo ? humanizeEditEventDate(dateTo) : '';

    const destinationOptionsTemplate = this.#destinations.map((dest) => `
      <option value="${escapeHtml(dest.name)}"></option>
    `).join('');

    const offersSectionTemplate = currentTypeOffers.length > 0 ? `
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${offersTemplate}
        </div>
      </section>
    ` : '';

    const resetButtonText = this.#isNewPoint ? 'Cancel' : 'Delete';
    const resetButtonLoadingText = this.#isNewPoint ? 'Cancel' : 'Deleting...';

    const rollupButtonTemplate = this.#isNewPoint ? '' : `
      <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
        <span class="visually-hidden">Open event</span>
      </button>
    `;

    return `
      <li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type  event__type-btn" for="event-type-toggle-1">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/${escapedType}.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

              <div class="event__type-list">
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Event type</legend>

                  <div class="event__type-item">
                    <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${type === 'taxi' ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
                    <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                  </div>

                  <div class="event__type-item">
                    <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${type === 'bus' ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
                    <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                  </div>

                  <div class="event__type-item">
                    <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${type === 'train' ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
                    <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                  </div>

                  <div class="event__type-item">
                    <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${type === 'ship' ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
                    <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                  </div>

                  <div class="event__type-item">
                    <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${type === 'drive' ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
                    <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                  </div>

                  <div class="event__type-item">
                    <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${type === 'flight' ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
                    <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                  </div>

                  <div class="event__type-item">
                    <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${type === 'check-in' ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
                    <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                  </div>

                  <div class="event__type-item">
                    <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${type === 'sightseeing' ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
                    <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                  </div>

                  <div class="event__type-item">
                    <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${type === 'restaurant' ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
                    <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                  </div>
                </fieldset>
              </div>
            </div>

            <div class="event__field-group  event__field-group--destination">
              <label class="event__label  event__type-output" for="event-destination-1">
                ${escapedType}
              </label>
              <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${escapedName}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
              <datalist id="destination-list-1">
                ${destinationOptionsTemplate}
              </datalist>
            </div>

            <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-1">From</label>
              <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFromValue}" ${isDisabled ? 'disabled' : ''}>
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateToValue}" ${isDisabled ? 'disabled' : ''}>
            </div>

            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${escapedBasePrice}" ${isDisabled ? 'disabled' : ''}>
            </div>

            <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
              ${isSaving ? 'Saving...' : 'Save'}
            </button>
            <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
              ${isDeleting ? resetButtonLoadingText : resetButtonText}
            </button>
            ${rollupButtonTemplate}
          </header>
          <section class="event__details">
            ${offersSectionTemplate}
            ${destinationSectionTemplate}
          </section>
        </form>
      </li>
    `;
  }

  setSaving() {
    this.updateElement({
      isSaving: true,
      isDisabled: true,
    });
  }

  setDeleting() {
    this.updateElement({
      isDeleting: true,
      isDisabled: true,
    });
  }

  resetState() {
    this.updateElement({
      isSaving: false,
      isDeleting: false,
      isDisabled: false,
    });
  }

  removeElement() {
    this.#destroyDatepickers();

    super.removeElement();
  }

  _restoreHandlers() {
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    const offersElement = this.element.querySelector('.event__available-offers');

    if (offersElement) {
      offersElement.addEventListener('change', this.#offersChangeHandler);
    }

    const rollupButton = this.element.querySelector('.event__rollup-btn');

    if (rollupButton) {
      rollupButton.addEventListener('click', this.#rollupButtonClickHandler);
    }

    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#eventTypeChangeHandler);

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element
      .querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);

    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);

    this.#setDatepickers();
  }

  #setDatepickers() {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('[name="event-start-time"]'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom || null,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        onChange: this.#dateFromChangeHandler,
      }
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('[name="event-end-time"]'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo || null,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        onChange: this.#dateToChangeHandler,
      }
    );
  }

  #destroyDatepickers() {
    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  #offersChangeHandler = (evt) => {
    const offerId = evt.target.dataset.offerId;

    const offers = evt.target.checked
      ? [...this._state.offers, offerId]
      : this._state.offers.filter((id) => id !== offerId);

    this.updateElement({
      offers,
    });
  };

    const offers = evt.target.checked
      ? [...this._state.offers, offerId]
      : this._state.offers.filter((id) => id !== offerId);

    this.updateElement({
      offers,
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EventEditView.parseStateToPoint(this._state));
  };

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupButtonClick();
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EventEditView.parseStateToPoint(this._state));
  };

  #priceInputHandler = (evt) => {
    const sanitizedValue = sanitizePriceValue(evt.target.value);

    evt.target.value = sanitizedValue;

    this._setState({
      basePrice: sanitizedValue === '' ? '' : Number(sanitizedValue),
    });
  };

  #eventTypeChangeHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this.#destinations.find((destination) => destination.name === evt.target.value);

    if (!selectedDestination) {
      return;
    }

    this.updateElement({
      destination: selectedDestination.id,
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    if (!userDate) {
      return;
    }

    this._setState({
      dateFrom: userDate.toISOString(),
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    if (!userDate) {
      return;
    }

    this._setState({
      dateTo: userDate.toISOString(),
    });
  };
}
