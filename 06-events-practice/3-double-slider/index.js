export default class DoubleSlider {

  onPointerDown = event => {
    const target = event.target.closest('[data-element]');
    if (!target || !['sliderLeft', 'sliderRight'].includes(target.dataset.element)) {
      return;
    }

    this.currentSlider = target.dataset.element;
    const {x, width} = this.subElements['bar'].getBoundingClientRect();
    this.barCoordAbs = {from: x, to: (x + width)};
    document.addEventListener('pointermove', this.onPointerMove);

  }

  onPointerMove = event => {
    if (!this.currentSlider) {
      document.removeEventListener('pointermove', this.onPointerMove);
      return;
    }
    this.checkCoord(event.pageX);
  }

  onPointerUp = event => {

    this.element.dispatchEvent(new CustomEvent("range-select", {
      bubbles: true,
      detail: {from: this.selected.from, to: this.selected.to},
    }));

    this.currentSlider = null;
    document.removeEventListener('pointermove', this.onPointerMove);
  }

  currentSlider;
  barCoordAbs;

  constructor({min = 100, max = 200, formatValue = value => value, selected = {from: min, to: max}} = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = selected;
    if (this.selected.from > this.selected.to) {
      let tmp = this.selected.to;
      this.selected.to = this.selected.from;
      this.selected.from = tmp;
    }
    if (this.selected.to > this.max) {
      this.selected.to = this.max;
    }
    if (this.selected.from < this.min) {
      this.selected.from = this.min;
    }
    this.render();
    this.initEventListeners();
  }

  checkCoord(coordAbs) {
    const coord = this.convertToRelative(coordAbs);

    if (this.currentSlider === 'sliderLeft') {
      if (coord > this.selected.to) {
        this.setSlider(this.currentSlider, this.selected.to);
      } else {
        this.setSlider(this.currentSlider, coord);
      }

    } else if (this.currentSlider === 'sliderRight') {
      if (coord < this.selected.from) {
        this.setSlider(this.currentSlider, this.selected.from);
      } else {
        this.setSlider(this.currentSlider, coord);
      }
    }

  }

  setSlider(side, coord) {
    if (side === 'sliderLeft' && this.selected.from !== coord) {
      this.selected.from = coord;

      this.subElements['sliderLeft'].style.left = this.convertToPercent(side, coord);
      this.subElements['progress'].style.left = this.convertToPercent(side, coord);
      this.subElements['from'].innerHTML = this.formatValue(coord);

    } else if (side === 'sliderRight' && this.selected.to !== coord) {
      this.selected.to = coord;
      this.subElements['sliderRight'].style.right = this.convertToPercent(side, coord);
      this.subElements['progress'].style.right = this.convertToPercent(side, coord);
      this.subElements['to'].innerHTML = this.formatValue(coord);

    }

  }

  convertToRelative(coordAbs) {

    if (coordAbs <= this.barCoordAbs.from) {
      return this.min;
    } else if (coordAbs >= this.barCoordAbs.to) {
      return this.max;
    } else {
      return this.min + Math.round(((this.max - this.min) * (coordAbs - this.barCoordAbs.from) / (this.barCoordAbs.to - this.barCoordAbs.from)));
    }

  }

  convertToPercent(side, coord) {
    let vDiff = 0;

    if (side === 'sliderLeft') {
      vDiff = coord - this.min;
    } else if (side === 'sliderRight') {
      vDiff = this.max - coord;
    }
    return (vDiff * 100 / (this.max - this.min)) + '%';
  }

  render() {
    const wrapper = document.createElement("div"); // (*)
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;

    this.subElements = this.getSubElements();
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }


  get template() {
    return `
    <div class="range-slider">
      <span data-element="from">${this.formatValue(this.selected.from)}</span>
        <div data-element="bar" class="range-slider__inner">
          <span data-element="progress" class="range-slider__progress" style="left: ${this.convertToPercent('sliderLeft', this.selected.from)}; right: ${this.convertToPercent('sliderRight', this.selected.to)}"></span>
          <span data-element="sliderLeft" class="range-slider__thumb-left" style="left: ${this.convertToPercent('sliderLeft', this.selected.from)}"></span>
          <span data-element="sliderRight" class="range-slider__thumb-right" style="right: ${this.convertToPercent('sliderRight', this.selected.to)}"></span>
        </div>
      <span data-element="to">${this.formatValue(this.selected.to)}</span>
    </div>`;
  }

  initEventListeners() {
    document.addEventListener('pointerdown', this.onPointerDown);
    document.addEventListener('pointerup', this.onPointerUp);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    document.removeEventListener('pointerdown', this.onPointerDown);
    document.removeEventListener('pointerup', this.onPointerUp);

    this.remove();
    this.element = null;
    this.subElements = null;
    this.currentSlider = null;
    this.barCoordAbs = null;

  }

}
