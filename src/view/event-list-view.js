export default class EventListView {
  getTemplate() {
    return '<ul class="trip-events__list"></ul>';
  }

  getElement() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();

    return element.firstElementChild;
  }
}
