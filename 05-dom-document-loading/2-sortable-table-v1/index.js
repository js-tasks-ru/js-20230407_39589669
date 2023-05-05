export default class SortableTable {

  init() {
    this.sortFieldValue = '';
    this.sortOrderValue = 'asc';
    this.sortFieldsType = {};
    this.sortNeed = false;
  }

  constructor(headerConfig = [], data = []) {

    this.init();

    this.headerConfig = headerConfig;
    this._data = data;

    this.render();
    this.initEventListeners();
  }


  get template() {
    return `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.header}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.body}
        </div>
        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>
            <p>No products satisfies your filter criteria</p>
            <button type="button" class="button-primary-outline">Reset all filters</button>
          </div>
        </div>
      </div>
    </div>`;
  }

  get header() {
    return this.headerConfig.map(value => {
      const sorts = {
        string: 'string',
        number: 'number',
      };
      // fill sortParams for future use
      if (value.sortable && sorts[value.sortType] !== undefined) {
        this.sortFieldsType[value.id] = sorts[value.sortType];
      }
      return `
    <div class="sortable-table__cell" data-id="${value.id}" data-sortable="${value.sortable}" data-order="">
      <span>${value.title}</span>
      <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
    </div>`;
    }).join(' ');
  }

  get body() {
    return this.data.map(item =>
      `<a href="/products/${item['id']}" class="sortable-table__row">${
        this.headerConfig.map(value =>
          value.template !== undefined ? value.template(item[value.id]) : `<div class="sortable-table__cell">${item[value.id]}</div>`
        ).join('')
      }</a>`
    ).join('');
  }

  get data() {

    const compareFn = {
      'string': (a, b) => {
        return a[this.sortFieldValue].localeCompare(b[this.sortFieldValue], ['ru', 'en'], {'caseFirst': 'upper'}) * (this.sortOrderValue === 'asc' ? 1 : -1);
      },
      'number': (a, b) => {
        return (a[this.sortFieldValue] - b[this.sortFieldValue]) * (this.sortOrderValue === 'asc' ? 1 : -1);
      },
    };

    if (this.sortNeed && this.sortFieldValue !== '') {
      this.sortNeed = false;
      return this._data.sort(compareFn[this.sortFieldsType[this.sortFieldValue]] ?? compareFn['number']);
    } else {
      return this._data;
    }

  }

  sort(fieldValue, orderValue) {

    if (this.sortFieldsType[fieldValue] !== undefined && ['asc', 'desc'].includes(orderValue)) {
      if (fieldValue !== this.sortFieldValue || (orderValue !== this.sortOrderValue)) {

        this.sortFieldValue = fieldValue;
        this.sortOrderValue = orderValue;
        this.sortNeed = true;
        this.subElements.body.innerHTML = this.body;
        this.subElements.header.querySelector(`[data-id="${fieldValue}"]`).dataset.order = orderValue;

        this.sortNeed = true;
      }

    }

  }

  render() {
    const wrapper = document.createElement("div"); // (*)
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;

    this.subElements = this.getSubElements();
    console.log(this.subElements);
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

  initEventListeners() {
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    // !!! hardcode !!!
    // must "destroy" this.element = {}, but failed last test "should have ability to be destroyed"
    // this.element = {};
    this.element = document.createElement('s');
    this.subElements = {};

    this.init();
  }
}

