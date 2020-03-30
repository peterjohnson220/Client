import * as Highcharts from 'highcharts';

export class StructuresHighchartsService {

  static initializeHighcharts() {
    require('highcharts/highcharts-more')(Highcharts);

    // this is the basic line symbol that is currently used to allow a scatter plot to use lines instead of dots.
    Highcharts.SVGRenderer.prototype.symbols.vline =
      function(x, y, width, height) {
        return ['M', x, y + width / 2, 'L', x + height, y + width / 2];
      };
  }

  static formatCurrency(rawCurrency, locale, currencyCode) {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    return formatter.format(rawCurrency);
  }

  static calculateMidpoint(min, max) {
    return (min + max) / 2;
  }

  static formatColumnRange(xCoordinate, low, high) {
    return { x: xCoordinate, low: low, high: high };
  }
}
