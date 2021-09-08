import * as Highcharts from 'highcharts';
import { YAxisPlotBandsOptions } from 'highcharts';

import { allEqual, isAscending } from 'libs/core/functions';
import { FormattersService } from 'libs/core/services';
import { PricingForPayGraph } from 'libs/models/payfactors-api';

import { PricingGraphTypeEnum } from '../models/pricing-graph-type.enum';

export class JobPricingGraphService {

  static initializePricingHighcharts() {
    require('highcharts/modules/bullet.js')(Highcharts);
  }

  static getPricingGraphChartOptions(marginLeft: number = 100): Highcharts.Options {
    return {
      chart: {
        inverted: true,
        marginLeft: marginLeft,
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
        },
        startOnTick: false,
        endOnTick: false
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
          fontFamily: 'Helvetica'
        },
        outside: true,
        positioner: function(labelWidth, labelHeight, point) {
          return {
            x: (point as any).plotX + this.chart.container.getBoundingClientRect().left + this.chart.container.offsetLeft + 5,
            y: (point as any).plotY + this.chart.container.getBoundingClientRect().top - labelHeight - 5
          };
        },
      },
    };
  }

  static getYAxisPlotBandsOptionsArray(data: any, graphType: PricingGraphTypeEnum, forceChartAlignment: boolean = false,
                                       forceDecimals: boolean = false, decimalPlaces: number = 1): YAxisPlotBandsOptions[] {
    return [{
      from: forceChartAlignment ? (data.OverallMin) : (data.Pay10),
      to: (data.Pay25),
      color: graphType === PricingGraphTypeEnum.Base ? '#193967' : '#41265c',
      label: {
        text: forceDecimals ? (data.Pay10).toFixed(decimalPlaces) : (data.Pay10).toString(),
        verticalAlign: 'bottom',
        align: 'left',
        x: -10
      },
      id: 'plot-band'
    }, {
      from: forceChartAlignment ? (data.OverallMin) : (data.Pay10),
      to: (data.Pay25),
      color: graphType === PricingGraphTypeEnum.Base ? '#193967' : '#41265c',
      label: {
        text: '10th',
        verticalAlign: 'top',
        align: 'left',
        y: -5,
        x: -10
      },
      id: 'plot-band'
    }, {
      from: (data.Pay25),
      to: (data.Pay50),
      color: graphType === PricingGraphTypeEnum.Base ? '#235090' : '#5a3580',
      label: {
        text: forceDecimals ? (data.Pay25).toFixed(decimalPlaces) : (data.Pay25).toString(),
        verticalAlign: 'bottom',
        align: 'left',
        x: -10
      },
      id: 'plot-band'
    }, {
      from: (data.Pay25),
      to: (data.Pay50),
      color:  graphType === PricingGraphTypeEnum.Base ? '#235090' : '#5a3580',
      label: {
        text: '25th',
        verticalAlign: 'top',
        align: 'left',
        y: -5,
        x: -10
      },
      id: 'plot-band'
    }, {
      from: (data.Pay50),
      to: (data.Pay75),
      color: graphType === PricingGraphTypeEnum.Base ? '#2D67B9' : '#7e4ab2',
      label: {
        text: forceDecimals ? (data.Pay50).toFixed(decimalPlaces) : (data.Pay50).toString(),
        verticalAlign: 'bottom',
        align: 'left',
        x: -10
      },
      id: 'plot-band'
    }, {
      from: (data.Pay50),
      to: (data.Pay75),
      color: graphType === PricingGraphTypeEnum.Base ? '#2D67B9' : '#7e4ab2',
      label: {
        text: '50th',
        verticalAlign: 'top',
        align: 'left',
        y: -5,
        x: -10
      },
      id: 'plot-band'
    }, {
      from: (data.Pay75),
      to: (data.Pay90),
      color: graphType === PricingGraphTypeEnum.Base ? '#5389D5' : '#9a70c4',
      label: {
        text: forceDecimals ? (data.Pay75).toFixed(decimalPlaces) : (data.Pay75).toString(),
        verticalAlign: 'bottom',
        align: 'left',
        x: -10
      },
      id: 'plot-band'
    }, {
      from: (data.Pay75),
      to: (data.Pay90),
      color: graphType === PricingGraphTypeEnum.Base ? '#5389D5' : '#9a70c4',
      label: {
        text: '75th',
        verticalAlign: 'top',
        align: 'left',
        y: -5,
        x: -10
      },
      id: 'plot-band'
    }, {
      from: (data.Pay75),
      to: forceChartAlignment ? (data.OverallMax) : (data.Pay90),
      color: graphType === PricingGraphTypeEnum.Base ? '#5389D5' : '#9a70c4',
      label: {
        text: forceDecimals ? (data.Pay90).toFixed(decimalPlaces) : (data.Pay90).toString(),
        verticalAlign: 'bottom',
        align: 'right',
        x: 20
      },
      id: 'plot-band'
    }, {
      from: (data.Pay75),
      to: forceChartAlignment ? (data.OverallMax) : (data.Pay90),
      color: graphType === PricingGraphTypeEnum.Base ? '#5389D5' : '#9a70c4',
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

  static formatScatterData(payData: any, pricingData: any, count: number, userLocale: string, y: number, pointColor: string) {
    return {
      y: y,
      x: 0,
      EmployeeFirstName: payData.EmployeeFirstName ? payData.EmployeeFirstName : '',
      EmployeeLastName: payData.EmployeeLastName ? payData.EmployeeLastName : '',
      Base: FormattersService.formatCurrency(payData.Base, userLocale, pricingData.Currency, pricingData.Rate, true),
      TCC: FormattersService.formatCurrency(payData.TCC, userLocale, pricingData.Currency, pricingData.Rate, true),
      color: pointColor,
      Count: count,
      Currency: (payData.Currency !== pricingData.Currency) ? payData.Currency : ''
    };
  }

  static resetGraph(chart: Highcharts.Chart, includeAvgLine: boolean = true) {
    while (chart?.series?.length > 0) {
      chart.series[0].remove(true);
    }
    chart.yAxis[0].removePlotBand('plot-band');
    if (includeAvgLine) {
      chart.yAxis[0].removePlotLine('plot-line');
    }

    chart.setSize(undefined, 1, false);
  }

  static renderGraph(chart: Highcharts.Chart, min: number, max: number, avg: number, scatterData: any, payLabel: string = null,
                     includeAvgLine: boolean = true, forceDecimals: boolean = false, decimalPlaces: number = 1) {
    if (includeAvgLine) {
      chart.yAxis[0].addPlotLine({
        color: '#F7A154',
        value: avg,
        width: 3,
        id: 'plot-line'
      });
    }
    if (payLabel) {
      const avgDisplay = forceDecimals ? (avg).toFixed(decimalPlaces) : avg.toString();
      chart.xAxis[0].setCategories(
        ['<span style="font-size: 16px; font-weight: 500;color: #212529; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji">' + payLabel + '</span><br/>' +
        '<span style="color: #212529; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji">Average: ' + avgDisplay + '</span>']
      );
    } else {
      chart.xAxis[0].setCategories(['']);
    }

    chart.addSeries({
      type : 'scatter',
      data: scatterData,
      marker: {
        radius: 6
      },
    });

    chart.setSize(null, 100, false);
    chart.yAxis[0].setExtremes(min, max, true);
    chart.redraw(false);
  }

  static validatePricingForPayGraph(pricing: PricingForPayGraph): boolean {
    if (pricing === null) {
      return false;
    }
    const values = [pricing.Pay10, pricing.Pay25, pricing.Pay50, pricing.Pay75, pricing.Pay90];
    return isAscending(values) && !allEqual(values);
  }

  static updateChartTooltip(chart: Highcharts.Chart, graphType: PricingGraphTypeEnum): void {
    if (graphType === PricingGraphTypeEnum.Base) {
      chart.update({
        tooltip: {
          formatter: function() {
            if ((this.point as any).Count > 1) {
              return  '<div style="color: white;">' + (this.point as any).Count + ' Employees <br>' +
                'Base: ' + (this.point as any).Base + '<br>' +
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
        }
      });
    } else if (graphType === PricingGraphTypeEnum.TCC) {
      chart.update({
        tooltip: {
          formatter: function() {
            if ((this.point as any).Count > 1) {
              return  '<div style="color: white;">' + (this.point as any).Count + ' Employees <br>' +
                'TCC: ' + (this.point as any).TCC + '<br>' +
                ((this.point as any).Currency !== '' ? '<div style="font-style: italic;">Converted from ' + (this.point as any).Currency + '</div>'
                  : '') +
                '</div>';
            } else {
              return '<div style="color: white;">' + (this.point as any).EmployeeFirstName + ' ' + (this.point as any).EmployeeLastName +
                '<br> TCC: ' + (this.point as any).TCC + '<br></div>' +
                ((this.point as any).Currency !== '' ?
                  '<div style="color: white; font-style: italic;">Converted from ' + (this.point as any).Currency + '</div></div>'
                  : '');
            }
          }
        }
      });
    }

  }
}
