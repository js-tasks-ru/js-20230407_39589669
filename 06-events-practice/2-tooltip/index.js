class Tooltip {
  static #instance;

  tooltip = '';

  onPointerOver = event => {
    const target = event.target.closest('[data-tooltip]');
    if (!target) {
      return;
    }
    this.tooltip = target.dataset.tooltip;
    this.render();
    this.moveAt(event.pageX, event.pageY);

    document.addEventListener('pointermove', this.onPointerMove);
  }

  onPointerOut = event => {
    let target = event.target.closest('[data-tooltip]');
    if (!target) {
      return;
    }
    this.remove();
    this.tooltip = '';

    document.removeEventListener('pointermove', this.onPointerMove);
  }

  onPointerMove = event => {
    const target = event.target.closest('[data-tooltip]');
    if (!target) {
      return;
    }
    this.moveAt(event.pageX, event.pageY);
  }


  constructor() {
    if (!Tooltip.#instance) {
      Tooltip.#instance = this;
    }
    return Tooltip.#instance;
  }

  moveAt(pageX, pageY) {
    let shiftX = -7;
    let shiftY = -7;

    this.element.style.left = pageX - shiftX + 'px';
    this.element.style.top = pageY - shiftY + 'px';
  }

  initialize() {
    this.initEventListeners();
  }

  render() {
    const wrapper = document.createElement("div"); // (*)
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
    document.body.append(this.element);
  }

  get template() {
    return `<div class="tooltip">${this.tooltip}</div> `;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    document.removeEventListener('pointerover', this.onPointerOver);
    document.removeEventListener('pointerout', this.onPointerOut);
    document.removeEventListener('pointermove', this.onPointerMove);
    this.element = null;
    Tooltip.#instance = null;
  }

  initEventListeners() {
    document.addEventListener('pointerover', this.onPointerOver);
    document.addEventListener('pointerout', this.onPointerOut);
  }

}

export default Tooltip;
