export default class ColumnChart {

  constructor({data = [], label = "", value = 0, link = '', chartHeight = 50, formatHeading = data => data} = {}) {

    this.data = data;
    this.label = label;
    this.value = formatHeading(value);
    this.link = link;
    this.chartHeight = chartHeight;

    this.render();
    this.initEventListeners();


  }

  update(data) {
    this.data = data;
    this.element.querySelector('.column-chart__chart').innerHTML = this.getChart();
  }

  getTemplate() {
    return `<div class="column-chart ${this.data.length === 0 ? 'column-chart_loading' : ''}" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        ${this.label} ${this.link !== '' ? `<a href="${this.link}" class="column-chart__link">View all</a>` : ''}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.value}</div>
        <div data-element="body" class="column-chart__chart">
         ${this.getChart()}
        </div>
      </div>
    </div>`;
  }

  getChart() {
    return this.getColumnProps().map(value => `<div style="--value: ${value.value}" data-tooltip="${value.percent}%"></div>`).join('');
  }

  getColumnProps() {
    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;

    return this.data.map(item => {
      return {
        percent: String((item / maxValue * 100).toFixed(0)),
        value: String(Math.floor(item * scale))
      };
    });
  }

  render() {
    const element = document.createElement("div"); // (*)
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
  }

  initEventListeners() {
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

}
