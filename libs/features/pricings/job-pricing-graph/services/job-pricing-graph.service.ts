import * as Highcharts from 'highcharts';
import { YAxisPlotBandsOptions } from 'highcharts';

import { FormattersService } from 'libs/core/services';

export class JobPricingGraphService {

  static initializePricingHighcharts() {
    require('highcharts/modules/bullet.js')(Highcharts);
  }

  static getPricingGraphChartOptions(): Highcharts.Options {
    return {
      chart: {
        inverted: true,
        marginLeft: 100,
        marginBottom: 30,
        marginRight: 20,
        type: 'bullet',
        spacingTop: 30
      },
      title: {
        text: null
      },
      legend: {
        enabled: false
      },
      yAxis: {
        gridLineWidth: 0,
        title: null,
        labels: {
          enabled: false
        }
      },
      xAxis: {
        lineWidth: 0,
        labels: {}
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      plotOptions: {
        series: {
          animation: false,
          stickyTracking: false
        },
      },
      tooltip: {
        useHTML: true,
        animation: false,
        snap: 0,
        hideDelay: 100,
        backgroundColor: '#000000',
        borderRadius: 15,
        borderWidth: 0,
        style: {
          color: '#FFFFFF',
          fontFamily: 'Helvetica Neue'
        },
        outside: true,
        positioner: function(labelWidth, labelHeight, point) {
          return {
            x: (point as any).plotX + this.chart.container.getBoundingClientRect().left + this.chart.container.offsetLeft + 5,
            y: (point as any).plotY + this.chart.container.getBoundingClientRect().top - labelHeight - 5
          };
        },
        formatter: function() {
          if ((this.point as any).Count > 1) {
            return  '     <div style="color: white;">' + (this.point as any).Count + ' Employees <br>' +
              '     Base: ' + (this.point as any).Base + '<br>' +
              ((this.point as any).Currency !== '' ? '<div style="font-style: italic;">Converted from ' + (this.point as any).Currency + '</div>'
                : '') +
              '</div>';
          } else {
            return '<div style="color: white;">' + (this.point as any).EmployeeFirstName + ' ' + (this.point as any).EmployeeLastName +
              '<br> Base: ' + (this.point as any).Base + '<br></div>' +
              ((this.point as any).Currency !== '' ?
                '<div style="color: white; font-style: italic;">Converted from ' + (this.point as any).Currency + '</div></div>'
                : '');
          }
        }
      },
    };
  }

  static getYAxisPlotBandsOptionsArray(data: any): YAxisPlotBandsOptions[] {
    return [{
      from: (data.Base10),
      to: (data.Base25),
      color: '#193967',
      label: {
        text: (data.Base10).toString(),
        verticalAlign: 'bottom',
        align: 'left',
        x: -10
      },
      id: 'plot-band'
    }, {
      from: (data.Base10),
      to: (data.Base25),
      color: '#193967',
      label: {
        text: '10th',
        verticalAlign: 'top',
        align: 'left',
        y: -5,
        x: -10
      },
      id: 'plot-band'
    }, {
      from: (data.Base25),
      to: (data.Base50),
      color: '#235090',
      label: {
        text: (data.Base25).toString(),
        verticalAlign: 'bottom',
        align: 'left',
        x: -10
      },
      id: 'plot-band'
    }, {
      from: (data.Base25),
      to: (data.Base50),
      color: '#235090',
      label: {
        text: '25th',
        verticalAlign: 'top',
        align: 'left',
        y: -5,
        x: -10
      },
      id: 'plot-band'
    }, {
      from: (data.Base50),
      to: (data.Base75),
      color: '#2D67B9',
      label: {
        text: (data.Base50).toString(),
        verticalAlign: 'bottom',
        align: 'left',
        x: -10
      },
      id: 'plot-band'
    }, {
      from: (data.Base50),
      to: (data.Base75),
      color: '#2D67B9',
      label: {
        text: '50th',
        verticalAlign: 'top',
        align: 'left',
        y: -5,
        x: -10
      },
      id: 'plot-band'
    }, {
      from: (data.Base75),
      to: (data.Base90),
      color: '#5389D5',
      label: {
        text: (data.Base75).toString(),
        verticalAlign: 'bottom',
        align: 'left',
        x: -10
      },
      id: 'plot-band'
    }, {
      from: (data.Base75),
      to: (data.Base90),
      color: '#5389D5',
      label: {
        text: '75th',
        verticalAlign: 'top',
        align: 'left',
        y: -5,
        x: -10
      },
      id: 'plot-band'
    }, {
      from: (data.Base75),
      to: (data.Base90),
      color: '#5389D5',
      label: {
        text: (data.Base90).toString(),
        verticalAlign: 'bottom',
        align: 'right',
        x: 20
      },
      id: 'plot-band'
    }, {
      from: (data.Base75),
      to: (data.Base90),
      color: '#5389D5',
      label: {
        text: '90th',
        verticalAlign: 'top',
        align: 'right',
        y: -5,
        x: 20
      },
      id: 'plot-band',
    }];
  }

  static formatScatterData(baseData: any, pricingData: any, count: number, userLocale: string) {
    return {
      y: baseData.Base / 1000,
      x: 0,
      EmployeeFirstName: baseData.EmployeeFirstName ? baseData.EmployeeFirstName : '',
      EmployeeLastName: baseData.EmployeeLastName ? baseData.EmployeeLastName : '',
      Base: FormattersService.formatCurrency(baseData.Base, userLocale, pricingData.Currency, pricingData.Rate, true),
      color: (baseData.Base / 1000 > (pricingData.Base90)) || (baseData.Base / 1000 < (pricingData.Base10)) ? '#C3C3CA' : '#FFFFFF',
      Count: count,
      Currency: (baseData.Currency !== pricingData.Currency) ? baseData.Currency : ''
    };
  }

  static resetGraph(chart: Highcharts.Chart) {
    while (chart?.series?.length > 0) {
      chart.series[0].remove(true);
    }
    chart.yAxis[0].removePlotBand('plot-band');
    chart.yAxis[0].removePlotLine('plot-line');

    chart.setSize(undefined, 1, false);
  }

  static renderGraph(chart: Highcharts.Chart, min: number, max: number, avg: number, scatterData: any) {
    chart.yAxis[0].addPlotLine({
      color: '#F7A154',
      value: avg,
      width: 3,
      id: 'plot-line'
    });

    chart.xAxis[0].setCategories(
      ['<span style="font-size: 16px; font-weight: bold;">Base Pay</span><br/><span>Average: ' + avg + '</span>']
    );

    chart.addSeries({
      type : 'scatter',
      data: scatterData,
      marker: {
        radius: 6
      },
    });

    chart.yAxis[0].setExtremes(min, max, true);
    chart.setSize(undefined, 100, false);
    chart.redraw(false);
  }
}
