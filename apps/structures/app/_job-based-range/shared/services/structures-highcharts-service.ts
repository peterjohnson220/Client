import * as Highcharts from 'highcharts';
import { RateType } from 'libs/data/data-sets';

export class StructuresHighchartsService {

  static initializeHighcharts() {
    require('highcharts/highcharts-more')(Highcharts);

    // this is the basic line symbol that is currently used to allow a scatter plot to use lines instead of dots.
    Highcharts.SVGRenderer.prototype.symbols.vline =
      function(x, y, width, height) {
        return ['M', x, y + width / 2, 'L', x + height, y + width / 2];
      };
  }

  static formatCurrency(rawCurrency, locale, currencyCode, rate, useGrouping?) {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: rate === RateType.Hourly ? 2 : 0,
      maximumFractionDigits: rate === RateType.Hourly ? 2 : 0,
      useGrouping: useGrouping
    });

    return formatter.format(rawCurrency);
  }

  static formatColumnRange(xCoordinate, low, high) {
    return { x: xCoordinate, low: low, high: high };
  }

  static formatYAxisLabel(value, locale, currencyCode, rate) {
    const rawLabelValue = rate === RateType.Hourly ? value : value / 1000;
    const formattedValue = StructuresHighchartsService.formatCurrency(rawLabelValue, locale, currencyCode, rate, false);
    return formattedValue + (rate === RateType.Hourly ? '' : 'k');
  }

  static formatMidPoint(midPointType, value, locale, currency, rate) {
    return !!value ? `${midPointType}: ${StructuresHighchartsService.formatCurrency(value, locale, currency, rate)}` : null;
  }

  static formatDeltaInMidPointForExistingStruct(newValue, currentValue, locale, currency, rate) {
    if (!!newValue && !!currentValue) {
      if (Math.round(newValue) > Math.round(currentValue)) {
        const percentChange = Math.round(((newValue - currentValue) / currentValue) * 100);
        return {
          message: `${StructuresHighchartsService.formatCurrency(newValue - currentValue, locale, currency, rate)}
              (${percentChange}%) increase in mid`,
          icon: '&#8593;',
          color: '#6DD400'
      };
      } else if (Math.round(newValue) < Math.round(currentValue)) {
        const percentChange = Math.round(((currentValue - newValue) / currentValue) * 100);
        return {
          message: `${StructuresHighchartsService.formatCurrency(currentValue - newValue, locale, currency, rate)}
            (${percentChange}%) decrease in mid`,
          icon: '&#8595;',
          color: 'red'
        };
      }
    }
    return null;
  }
}
