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

  static getRangeOptions(locale, currencyCode) {
    return {

      chart: {
        inverted: true,
        animation: false,
        title: 'Job Ranges',
        currency: currencyCode,
        locale: locale
      },
      credits: {
        enabled: false
      },
      title: {
        text: undefined
      },
      legend: {
        useHtml: true,
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        floating: true,
        x: 510,
        y: 30,
        borderWidth: 1
      },
      tooltip: {
        useHTML: true,
        snap: 0,
        backgroundColor: '#000000',
        borderWidth: 0
      },
      yAxis: {
        labels: {
          formatter: function() {
            const formatter = new Intl.NumberFormat(this.chart.userOptions.chart.locale, {
              style: 'currency',
              currency: this.chart.userOptions.chart.currency,
              minimumFractionDigits: 0,
              useGrouping: false
            });

            const rawLabelValue = this.value / 1000;
            return formatter.format(rawLabelValue) + 'k';
          }
        },
        opposite: true,
        gridLineWidth: 1,
        gridLineDashStyle: 'Dash',
        lineWidth: 0,
        tickPixelInterval: 200,
        title: {
          text: undefined
        }
      },
      xAxis: {
        visible: false
      },
      plotOptions: {
        columnrange: {
          borderRadius: 5
        },
        series: {
          stickyTracking: false,
          groupPadding: 0,
          pointPadding: 0.1,
          borderWidth: 0,
          marker: {
            states: {
              hover: {
                enabled: false
              }
            }
          }
        }
      },
      series: [{
        name: 'Salary range',
        type: 'columnrange',
        animation: false,
        color: 'rgba(36,134,210,0.45)',
        enableMouseTracking: false
      }, {
        name: 'Mid-point',
        type: 'scatter',
        marker: {
          symbol: 'vline',
          lineWidth: 2,
          lineColor: '#CD8C01',
          radius: 20
        },
        enableMouseTracking: false
      }, {
        name: 'Average salary',
        type: 'scatter',
        marker: {
          symbol: 'vline',
          lineWidth: 2,
          lineColor: '#6236FF',
          radius: 20
        },
        enableMouseTracking: false
      }, {
        name: 'Outlier salary',
        type: 'scatter',
        dataLabels: {
          useHTML: true,
          enabled: true,
          format: '<div style="height: 20px; width: 20px; background-color: #E02020; border-radius: 25%; color: white; text-align: center !important">{point.count}</div>',
          defer: false,
          y: 15,
          z: 2
        },
        marker: {
          enabled: true,
          fillColor: 'rgba(0,0,0,0)',
          radius: 30
        },
        tooltip: {
          backgroundColor: '#000000',
          useHTML: true,
          padding: 0,
          headerFormat: '<div style="display: inline-block; background-color: black">',
          pointFormat: '<div style="color: red">Employee out of Range</div><div style="color: white"><br />{point.name}<br />{point.valueString}</div>' +
            '<br /><div style="color: white"><i>{point.deltaString}</i></div>',
          footerFormat: '</div>'
        }
      }]
    };
  }

  static formatCurrency(rawCurrency, locale, currencyCode) {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0
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
