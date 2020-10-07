import { PricingsSalaryRangeChartSeries } from './pricings-salary-range-chart-series-constants';
import { RangeDistributionTypeIds } from '../../shared/constants/range-distribution-type-ids';

// making this a bespoke service to keep the component.ts file from being overly long and avoid clutter
export class PricingsSalaryRangeChartService {

  static getFormattedSeriesName(series: PricingsSalaryRangeChartSeries, controlPointDisplay: string = '') {
    switch (series) {
      case PricingsSalaryRangeChartSeries.SalaryRangeMinMidMax: {
        return 'Salary range';
      }
      case PricingsSalaryRangeChartSeries.SalaryRangeTertile: {
        return 'Salary range Tertile';
      }
      case PricingsSalaryRangeChartSeries.SalaryRangeQuartileFirst:
      case PricingsSalaryRangeChartSeries.SalaryRangeQuartileSecond:
      case PricingsSalaryRangeChartSeries.SalaryRangeQuartileThird:
      case PricingsSalaryRangeChartSeries.SalaryRangeQuartileFourth: {
        return 'Salary range Quartile';
      }
      case PricingsSalaryRangeChartSeries.SalaryRangeQuintile: {
        return 'Salary range Quintile';
      }
      case PricingsSalaryRangeChartSeries.RangeMid: {
        return 'Range Mid';
      }
      case PricingsSalaryRangeChartSeries.RangeTertileFirst: {
        return 'Top 1st 3rd';
      }
      case PricingsSalaryRangeChartSeries.RangeTertileSecond: {
        return 'Top 2nd 3rd';
      }
      case PricingsSalaryRangeChartSeries.RangeQuartileFirst: {
        return 'Top 1st 4th';
      }
      case PricingsSalaryRangeChartSeries.RangeQuartileSecond: {
        return 'Top 3rd 4th';
      }
      case PricingsSalaryRangeChartSeries.RangeQuintileFirst: {
        return 'Top 1st 5th';
      }
      case PricingsSalaryRangeChartSeries.RangeQuintileSecond: {
        return 'Top 2nd 5th';
      }
      case PricingsSalaryRangeChartSeries.RangeQuintileThird: {
        return 'Top 3rd 5th';
      }
      case PricingsSalaryRangeChartSeries.RangeQuintileFourth: {
        return 'Top 4th 5th';
      }
      case PricingsSalaryRangeChartSeries.Pricings: {
        return 'Pricings ' + controlPointDisplay;
      }
      case PricingsSalaryRangeChartSeries.MRP: {
        return 'MRP';
      }
      default: {
        // should never happen, but in case someone adds a value later and forgets.
        return '';
      }
    }
  }

  static getPricingsRangeOptions(locale, currencyCode, controlPointDisplay, rangeDistributionTypeId) {
    return {
      chart: {
        inverted: true,
        animation: false,
        title: 'Pricings - Job Range',
        currency: currencyCode,
        locale: locale,
        style: {
          fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
          "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`
        },
        spacing: [45, 10, 0, 10]
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
        floating: false,
        y: 18,
        borderWidth: 1
      },
      tooltip: {
        useHTML: true,
        snap: 0,
        backgroundColor: '#000000',
        borderWidth: 0
      },
      yAxis: {
        opposite: true,
        gridLineWidth: 1,
        gridLineDashStyle: 'Dash',
        gridLineColor: '#bdbdbd',
        gridZIndex: 5,
        lineWidth: 0,
        tickPixelInterval: 300,
        title: {
          text: undefined
        },
        offset: 32
      },
      xAxis: {
        visible: false,
        // add categories to make the x-axis line up properly. Highcharts will extend the categories dynamically, so it doesn't matter that its hardcoded here
        type: 'category',
        categories: ['0', '1'],
        minPadding: 0,
        maxPadding: 0
      },
      plotOptions: {
        series: {
          events: {
            legendItemClick: function (event) {
              if (event.target.userOptions.name === PricingsSalaryRangeChartService.getFormattedSeriesName(PricingsSalaryRangeChartSeries.SalaryRangeQuartileFirst)) {
                if (event.target.chart.yAxis[0].series[PricingsSalaryRangeChartSeries.SalaryRangeQuartileFirst].visible) {
                  event.target.chart.yAxis[0].series[PricingsSalaryRangeChartSeries.SalaryRangeQuartileFirst].hide();
                  event.target.chart.yAxis[0].series[PricingsSalaryRangeChartSeries.SalaryRangeQuartileSecond].hide();
                  event.target.chart.yAxis[0].series[PricingsSalaryRangeChartSeries.SalaryRangeQuartileThird].hide();
                  event.target.chart.yAxis[0].series[PricingsSalaryRangeChartSeries.SalaryRangeQuartileFourth].hide();
                } else {
                  event.target.chart.yAxis[0].series[PricingsSalaryRangeChartSeries.SalaryRangeQuartileFirst].show();
                  event.target.chart.yAxis[0].series[PricingsSalaryRangeChartSeries.SalaryRangeQuartileSecond].show();
                  event.target.chart.yAxis[0].series[PricingsSalaryRangeChartSeries.SalaryRangeQuartileThird].show();
                  event.target.chart.yAxis[0].series[PricingsSalaryRangeChartSeries.SalaryRangeQuartileFourth].show();
                }
                return false;
              } else {
                return true;
              }
            }
          },
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
      series: [
        {
          name: PricingsSalaryRangeChartService.getFormattedSeriesName(PricingsSalaryRangeChartSeries.SalaryRangeMinMidMax),
          type: 'columnrange',
          animation: false,
          color: rangeDistributionTypeId !== RangeDistributionTypeIds.Quartile ? 'rgb(174,210,238)' : 'transparent',
          enableMouseTracking: false,
          pointWidth: 61,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: rangeDistributionTypeId === RangeDistributionTypeIds.MinMidMax
        },
        {
          name: PricingsSalaryRangeChartService.getFormattedSeriesName(PricingsSalaryRangeChartSeries.SalaryRangeTertile),
          type: 'columnrange',
          animation: false,
          color: 'rgb(210,230,246)',
          enableMouseTracking: false,
          pointWidth: 61,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: rangeDistributionTypeId === RangeDistributionTypeIds.Tertile
        },
        {
          name: PricingsSalaryRangeChartService.getFormattedSeriesName(PricingsSalaryRangeChartSeries.SalaryRangeQuintile),
          type: 'columnrange',
          animation: false,
          color: 'rgb(210,230,246)',
          enableMouseTracking: false,
          pointWidth: 61,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: rangeDistributionTypeId === RangeDistributionTypeIds.Quintile
        },
        {
          name: PricingsSalaryRangeChartService.getFormattedSeriesName(PricingsSalaryRangeChartSeries.SalaryRangeQuartileFirst),
          type: 'columnrange',
          animation: false,
          color: 'rgb(174,210,238)',
          enableMouseTracking: false,
          pointWidth: 61,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: rangeDistributionTypeId === RangeDistributionTypeIds.Quartile
        },
        {
          name: PricingsSalaryRangeChartService.getFormattedSeriesName(PricingsSalaryRangeChartSeries.SalaryRangeQuartileSecond),
          type: 'columnrange',
          animation: false,
          color: 'rgb(210,230,246)',
          enableMouseTracking: false,
          pointWidth: 61,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: false
        },
        {
          name: PricingsSalaryRangeChartService.getFormattedSeriesName(PricingsSalaryRangeChartSeries.SalaryRangeQuartileThird),
          type: 'columnrange',
          animation: false,
          color: 'rgb(174,210,238)',
          enableMouseTracking: false,
          pointWidth: 61,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: false
        },
        {
          name: PricingsSalaryRangeChartService.getFormattedSeriesName(PricingsSalaryRangeChartSeries.SalaryRangeQuartileFourth),
          type: 'columnrange',
          animation: false,
          color: 'rgb(210,230,246)',
          enableMouseTracking: false,
          pointWidth: 61,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: false
        },
        {
          name: PricingsSalaryRangeChartService.getFormattedSeriesName(PricingsSalaryRangeChartSeries.RangeMid),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#CD8C01',
            radius: 30,
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black; color: white">',
            pointFormat: '<div><b>{point.jobTitle}</b></div><div>' +
              '<div>{point.dataPoint}</div>' +
              '<div>{point.currentDataPoint}</div>' +
              '<div>{point.newDataPoint}</div>' +
              '<div><span style="font-size: 25px; color: {point.iconColor};">{point.icon}</span>{point.delta}</div>',
            footerFormat: '</div>'
          }
        },
        {
          name: PricingsSalaryRangeChartService.getFormattedSeriesName(PricingsSalaryRangeChartSeries.RangeTertileFirst),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 30,
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black; color: white">',
            pointFormat: '<div><b>{point.jobTitle}</b></div><div>' +
              '<div>{point.dataPoint}</div>' +
              '<div>{point.currentDataPoint}</div>' +
              '<div>{point.newDataPoint}</div>' +
              '<div><span style="font-size: 25px; color: {point.iconColor};">{point.icon}</span>{point.delta}</div>',
            footerFormat: '</div>'
          },
          showInLegend: false
        },
        {
          name: PricingsSalaryRangeChartService.getFormattedSeriesName(PricingsSalaryRangeChartSeries.RangeTertileSecond),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 30,
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black; color: white">',
            pointFormat: '<div><b>{point.jobTitle}</b></div><div>' +
              '<div>{point.dataPoint}</div>' +
              '<div>{point.currentDataPoint}</div>' +
              '<div>{point.newDataPoint}</div>' +
              '<div><span style="font-size: 25px; color: {point.iconColor};">{point.icon}</span>{point.delta}</div>',
            footerFormat: '</div>'
          },
          showInLegend: false
        },
        {
          name: PricingsSalaryRangeChartService.getFormattedSeriesName(PricingsSalaryRangeChartSeries.RangeQuartileFirst),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 30,
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black; color: white">',
            pointFormat: '<div><b>{point.jobTitle}</b></div><div>' +
              '<div>{point.dataPoint}</div>' +
              '<div>{point.currentDataPoint}</div>' +
              '<div>{point.newDataPoint}</div>' +
              '<div><span style="font-size: 25px; color: {point.iconColor};">{point.icon}</span>{point.delta}</div>',
            footerFormat: '</div>'
          },
          showInLegend: false
        },
        {
          name: PricingsSalaryRangeChartService.getFormattedSeriesName(PricingsSalaryRangeChartSeries.RangeQuartileSecond),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 30,
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black; color: white">',
            pointFormat: '<div><b>{point.jobTitle}</b></div><div>' +
              '<div>{point.dataPoint}</div>' +
              '<div>{point.currentDataPoint}</div>' +
              '<div>{point.newDataPoint}</div>' +
              '<div><span style="font-size: 25px; color: {point.iconColor};">{point.icon}</span>{point.delta}</div>',
            footerFormat: '</div>'
          },
          showInLegend: false
        },
        {
          name: PricingsSalaryRangeChartService.getFormattedSeriesName(PricingsSalaryRangeChartSeries.RangeQuintileFirst),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 30,
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black; color: white">',
            pointFormat: '<div><b>{point.jobTitle}</b></div><div>' +
              '<div>{point.dataPoint}</div>' +
              '<div>{point.currentDataPoint}</div>' +
              '<div>{point.newDataPoint}</div>' +
              '<div><span style="font-size: 25px; color: {point.iconColor};">{point.icon}</span>{point.delta}</div>',
            footerFormat: '</div>'
          },
          showInLegend: false
        },
        {
          name: PricingsSalaryRangeChartService.getFormattedSeriesName(PricingsSalaryRangeChartSeries.RangeQuintileSecond),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 30,
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black; color: white">',
            pointFormat: '<div><b>{point.jobTitle}</b></div><div>' +
              '<div>{point.dataPoint}</div>' +
              '<div>{point.currentDataPoint}</div>' +
              '<div>{point.newDataPoint}</div>' +
              '<div><span style="font-size: 25px; color: {point.iconColor};">{point.icon}</span>{point.delta}</div>',
            footerFormat: '</div>'
          },
          showInLegend: false
        },
        {
          name: PricingsSalaryRangeChartService.getFormattedSeriesName(PricingsSalaryRangeChartSeries.RangeQuintileThird),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 30,
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black; color: white">',
            pointFormat: '<div><b>{point.jobTitle}</b></div><div>' +
              '<div>{point.dataPoint}</div>' +
              '<div>{point.currentDataPoint}</div>' +
              '<div>{point.newDataPoint}</div>' +
              '<div><span style="font-size: 25px; color: {point.iconColor};">{point.icon}</span>{point.delta}</div>',
            footerFormat: '</div>'
          },
          showInLegend: false
        },
        {
          name: PricingsSalaryRangeChartService.getFormattedSeriesName(PricingsSalaryRangeChartSeries.RangeQuintileFourth),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 30,
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black; color: white">',
            pointFormat: '<div><b>{point.jobTitle}</b></div><div>' +
              '<div>{point.dataPoint}</div>' +
              '<div>{point.currentDataPoint}</div>' +
              '<div>{point.newDataPoint}</div>' +
              '<div><span style="font-size: 25px; color: {point.iconColor};">{point.icon}</span>{point.delta}</div>',
            footerFormat: '</div>'
          },
          showInLegend: false
        },
        {
          name: PricingsSalaryRangeChartService.getFormattedSeriesName(PricingsSalaryRangeChartSeries.Pricings, controlPointDisplay),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#CD8C01',
            radius: 15
          },
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white; font-weight: bold">{point.vendor}</div>' +
              '<div style="color: white">{point.titleAndEffectiveDate}</div>' +
              '<div style="color: white">{point.mrpLabel}: {point.salary}</div>',
            footerFormat: '</div>'
          },
          enableMouseTracking: true
        },
        {
          name: PricingsSalaryRangeChartService.getFormattedSeriesName(PricingsSalaryRangeChartSeries.MRP, controlPointDisplay),
          type: 'scatter',
          enableMouseTracking: true,
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#0000FF',
            radius: 30,
          },
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white; font-weight: bold">{point.jobTitle}</div>' +
              '<div style="color: white">{point.mrp}</div>',
            footerFormat: '</div>'
          }
        }
      ]
    };
  }
}
