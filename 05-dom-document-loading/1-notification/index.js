export default class NotificationMessage {

  static instance = null;
  static timeoutId = -1;

  constructor(title, {type = 'success', duration = 2000} = {}) {

    const types = {
      success: 'success',
      error: 'error',
    };

    this.title = title;
    this.type = types[type] ?? types['success'];
    this.duration = duration;

    this.render();
    this.initEventListeners();
  }

  getTemplate() {
    return `
    <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${this.type}</div>
      <div class="notification-body">
        ${this.title}
      </div>
    </div>
  </div>`;
  }

  render() {
    const wrapper = document.createElement("div"); // (*)
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper.firstElementChild;
  }

  initEventListeners() {
  }

  remove() {
    this.element.remove();
    NotificationMessage.instance = null;
    clearTimeout(NotificationMessage.timeoutId);
  }

  destroy() {
    this.remove();
    this.element = null;
  }

  show(target) {

    // eslint-disable-next-line no-unused-expressions
    NotificationMessage.instance?.destroy();
    NotificationMessage.instance = this;

    ((typeof target === 'object') ? target : document.body).append(this.element);

    NotificationMessage.timeoutId = setTimeout(() => {
      // eslint-disable-next-line no-unused-expressions
      NotificationMessage.instance?.destroy();
    }, this.duration);

  }
}
