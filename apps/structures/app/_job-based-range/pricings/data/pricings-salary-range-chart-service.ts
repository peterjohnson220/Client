// making this a bespoke service to keep the component.ts file from being overly long and avoid clutter
export class PricingsSalaryRangeChartService {

  static getPricingsRangeOptions(locale, currencyCode, controlPointDisplay) {
    const tooltipFormatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      useGrouping: true
    });

    return {

      chart: {
        inverted: true,
        animation: false,
        title: 'Pricings - Job Range',
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
        align: 'right',
        verticalAlign: 'top',
        floating: true,
        y: 30,
        borderWidth: 1
      },
      tooltip: {
        useHTML: true,
        backgroundColor: '#282625',
        borderColor: '#000000',
        className: 'pricingToolTip',
        formatter: function() {
          return `
            <span style="color: white;">
              <b>${this.point.vendor}</b><br/>
              ${this.point.titleAndEffectiveDate}<br/>
              ${controlPointDisplay} ${this.point.mrpReferencePoint}: <b>${tooltipFormatter.format(Math.round(this.y))}</b>
            </span>`;
        }
      },
      yAxis: {
        labels: {
          formatter: function() {
            const formatter = new Intl.NumberFormat(locale, {
              style: 'currency',
              currency: currencyCode,
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
        tickPixelInterval: 300,
        title: {
          text: undefined
        }
      },
      xAxis: {
        visible: false,
        // add categories to make the x-axis line up properly. Highcharts will extend the categories dynamically, so it doesn't matter that its hardcoded here
        type: 'category',
        categories: ['0', '1']
      },
      plotOptions: {
        series: {
          events: {
            legendItemClick: function (event) {
              const plotLinesOrBandsData = ['Salary range'];
              // check to see if we need to remove or add a line/band OR we just want to perform the default function
              if (plotLinesOrBandsData.includes(event.target.userOptions.name)) {
                // look for the line or band in question on the chart
                const lineOrBand = event.target.chart.yAxis[0].plotLinesAndBands.find(plb => plb.id === event.target.userOptions.name);
                // if we find one, remove it. else add it
                if (lineOrBand) {
                  event.target.chart.yAxis[0].removePlotLine(event.target.userOptions.name);
                } else {
                  // find from static options and add
                  const options = event.target.chart.collectionsWithUpdate.find(plb => plb.id === event.target.userOptions.name);
                  event.target.chart.yAxis[0].addPlotLine(options);
                }
              } else {
                return true;
              }


            }
          },
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
        type: 'polygon',
        animation: false,
        color: 'rgba(36,134,210,0.45)',
        enableMouseTracking: false,

      }, {
        name: 'Pricings ' + controlPointDisplay,
        type: 'scatter',
        marker: {
          symbol: 'vline',
          lineWidth: 2,
          lineColor: '#CD8C01',
          radius: 15
        },
        enableMouseTracking: true
      }]
    };
  }
}
