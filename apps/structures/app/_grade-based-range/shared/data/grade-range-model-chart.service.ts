import { RangeDistributionTypeIds } from 'libs/constants/structures/range-distribution-type-ids';

import { GradeRangeVerticalOrHorizontalModelChartSeries } from './grade-range-model-chart-series-constants';
import { StructuresHighchartsService } from '../../../shared/services';

export class GradeRangeModelChartService {
  static getCategoryLabels(distributionType) {
    let categories = [];
    switch (distributionType) {
      case RangeDistributionTypeIds.MinMidMax:
      case RangeDistributionTypeIds.Quartile:
        categories = ['Below Min', 'First Quartile', 'Second Quartile', 'Third Quartile', 'Fourth Quartile', 'Above Max'];
        break;
      case RangeDistributionTypeIds.Tertile:
        categories = ['Below Min', 'First Tertile', 'Second Tertile', 'Third Tertile', 'Above Max'];
        break;
      case RangeDistributionTypeIds.Quintile:
        categories = ['Below Min', 'First Quintile', 'Second Quintile', 'Third Quintile', 'Fourth Quintile', 'Fifth Quintile', 'Above Max'];
        break;
    }
    return categories;
  }

  static getHeatmapOptions(distributionType) {
    return {

      chart: {
        height: 163
      },
      exporting: {
        enabled: false
      },

      xAxis: {
        categories: this.getCategoryLabels(distributionType),
        opposite: true,
        labels: {
          style: {
            fontWeight: 'bold',
            color: 'black'
          }
        }
      },

      yAxis: {
        title: null,
        labels: {
          enabled: false
        },
        height: 72
      },
      credits: {
        enabled: false
      },
      title: {
        text: undefined
      },
      legend: {
        backgroundColor: '#E9EAED',
        floating: false,
        verticalAlign: 'bottom',
        align: 'right'
      },

      colorAxis: {
        showInLegend: false,
        dataClasses: [{
          to: 20,
          color: '#FFFFFF'
        }, {
          from: 21,
          to: 40,
          color: '#FFD470'
        }, {
          from: 41,
          to: 60,
          color: '#FFB300'
        }, {
          from: 61,
          to: 80,
          color: '#B37D00'
        }, {
          from: 81,
          to: 100,
          color: '#6B4B00'
        }],
        min: 0,
        max: 100
      },
      series: [{
        type: 'heatmap',
        showInLegend: false,
        borderWidth: 0.5
      },
      {
        name: '0-20%',
        type: 'scatter',
        color: '#FFFFFF',
        marker: {
          symbol: 'square',
          radius: 12
        }
      },
      {
        name: '21-40%',
        type: 'scatter',
        color: '#FFD470',
        marker: {
          symbol: 'square',
          radius: 12
        }
      },
      {
        name: '41-60%',
        type: 'scatter',
        color: '#FFB300',
        marker: {
          symbol: 'square',
          radius: 12
        }
      },
      {
        name: '61-80%',
        type: 'scatter',
        color: '#B37D00',
        marker: {
          symbol: 'square',
          radius: 12
        }
      },
      {
        name: '81-100%',
        type: 'scatter',
        color: '#6B4B00',
        marker: {
          symbol: 'square',
          radius: 12
        }
      }],

      tooltip: {
        enabled: false
      },

      plotOptions: {
        series: {
          states: {
            hover: {
              enabled: false
            }
          }
        }
      },

      responsive: {
        rules: [{
          condition: {
            maxWidth: 200
          }
        }]
      }

    };
  }

  static getFormattedSeriesName(series: GradeRangeVerticalOrHorizontalModelChartSeries, controlPointDisplay: string = '') {
    switch (series) {
      case GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeMinMidMax: {
        return 'Salary range';
      }
      case GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeTertile: {
        return 'Salary range Tertile';
      }
      case GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileFirst:
      case GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileSecond:
      case GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileThird:
      case GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileFourth: {
        return 'Salary range Quartile';
      }
      case GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuintile: {
        return 'Salary range Quintile';
      }
      case GradeRangeVerticalOrHorizontalModelChartSeries.RangeMid: {
        return 'Range Mid';
      }
      case GradeRangeVerticalOrHorizontalModelChartSeries.RangeTertileFirst: {
        return 'Top 1st 3rd';
      }
      case GradeRangeVerticalOrHorizontalModelChartSeries.RangeTertileSecond: {
        return 'Top 2nd 3rd';
      }
      case GradeRangeVerticalOrHorizontalModelChartSeries.RangeQuartileFirst: {
        return 'Top 1st 4th';
      }
      case GradeRangeVerticalOrHorizontalModelChartSeries.RangeQuartileSecond: {
        return 'Top 3rd 4th';
      }
      case GradeRangeVerticalOrHorizontalModelChartSeries.RangeQuintileFirst: {
        return 'Top 1st 5th';
      }
      case GradeRangeVerticalOrHorizontalModelChartSeries.RangeQuintileSecond: {
        return 'Top 2nd 5th';
      }
      case GradeRangeVerticalOrHorizontalModelChartSeries.RangeQuintileThird: {
        return 'Top 3rd 5th';
      }
      case GradeRangeVerticalOrHorizontalModelChartSeries.RangeQuintileFourth: {
        return 'Top 4th 5th';
      }
      case GradeRangeVerticalOrHorizontalModelChartSeries.EmployeeOutliers: {
        return 'Outlier ' + controlPointDisplay;
      }
      case GradeRangeVerticalOrHorizontalModelChartSeries.Jobs: {
        return 'Job Market Data';
      }
      case GradeRangeVerticalOrHorizontalModelChartSeries.Regression: {
        return 'Regression Line';
      }
      case GradeRangeVerticalOrHorizontalModelChartSeries.JobsExcludedFromRegression: {
        return 'Excluded from Regression';
      }
      default: {
        // should never happen, but in case someone adds a value later and forgets.
        return '';
      }

    }
  }

  static getVerticalRangeOptions(locale, currencyCode, controlPointDisplay, rate, rangeDistributionTypeId) {
    return {
      chart: {
        inverted: false,
        animation: false,
        title: 'Job Ranges',
        currency: currencyCode,
        locale: locale,
        style: {
          fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
          "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`
        },
        spacing: [10, 10, 0, 10]
      },
      exporting: {
        enabled: false
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
        y: 13,
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
          formatter: function () {
            return StructuresHighchartsService.formatYAxisLabel(this.value, locale, currencyCode, rate);
          }
        },
        gridLineWidth: 1,
        gridLineDashStyle: 'Dash',
        gridLineColor: '#bdbdbd',
        gridZIndex: 5,
        lineWidth: 0,
        tickPixelInterval: 200,
        title: {
          text: undefined
        },
        offset: 22
      },
      plotOptions: {
        series: {
          events: {
            legendItemClick: function (event) {
              if (event.target.userOptions.name ===
                GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileFirst)) {
                if (event.target.chart.yAxis[0].series[GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileFirst].visible) {
                  event.target.chart.yAxis[0].series[GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileFirst].hide();
                  event.target.chart.yAxis[0].series[GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileSecond].hide();
                  event.target.chart.yAxis[0].series[GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileThird].hide();
                  event.target.chart.yAxis[0].series[GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileFourth].hide();
                } else {
                  event.target.chart.yAxis[0].series[GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileFirst].show();
                  event.target.chart.yAxis[0].series[GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileSecond].show();
                  event.target.chart.yAxis[0].series[GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileThird].show();
                  event.target.chart.yAxis[0].series[GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileFourth].show();
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
            fillColor: null,
            lineWidth: 1,
            lineColor: null,
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeMinMidMax),
          type: 'columnrange',
          animation: false,
          color: rangeDistributionTypeId !== RangeDistributionTypeIds.Quartile ? 'rgb(174,210,238)' : 'transparent',
          enableMouseTracking: false,
          pointWidth: 42,
          stacking: 'normal',
          borderRadius: 5,
          showInLegend: rangeDistributionTypeId === RangeDistributionTypeIds.MinMidMax
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeMinMidMaxHidden),
          type: 'columnrange',
          animation: false,
          color: 'transparent',
          enableMouseTracking: false,
          pointWidth: 42,
          showInLegend: false,
          stacking: 'normal'
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeTertile),
          type: 'columnrange',
          animation: false,
          color: 'rgb(210,230,246)',
          enableMouseTracking: false,
          pointWidth: 42,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: rangeDistributionTypeId === RangeDistributionTypeIds.Tertile
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuintile),
          type: 'columnrange',
          animation: false,
          color: 'rgb(210,230,246)',
          enableMouseTracking: false,
          pointWidth: 42,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: rangeDistributionTypeId === RangeDistributionTypeIds.Quintile
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileFirst),
          type: 'columnrange',
          animation: false,
          color: 'rgb(174,210,238)',
          enableMouseTracking: false,
          pointWidth: 42,
          stacking: 'normal',
          borderRadiusBottomRight: 5,
          borderRadiusBottomLeft: 5,
          showInLegend: rangeDistributionTypeId === RangeDistributionTypeIds.Quartile
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileSecond),
          type: 'columnrange',
          animation: false,
          color: 'rgb(210,230,246)',
          enableMouseTracking: false,
          pointWidth: 42,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: false
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileThird),
          type: 'columnrange',
          animation: false,
          color: 'rgb(174,210,238)',
          enableMouseTracking: false,
          pointWidth: 42,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: false
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileFourth),
          type: 'columnrange',
          animation: false,
          color: 'rgb(210,230,246)',
          enableMouseTracking: false,
          pointWidth: 42,
          stacking: 'normal',
          borderRadiusTopRight: 5,
          borderRadiusTopLeft: 5,
          showInLegend: false
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.RangeMid),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#CD8C01',
            radius: 20
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black; color: white">',
            pointFormat: '<div><b>{point.gradeName}</b></div><div>' +
              '<div>{point.dataPoint}</div>' +
              '<div>{point.currentDataPoint}</div>' +
              '<div>{point.newDataPoint}</div>' +
              '<div><span style="font-size: 25px; color: {point.iconColor};">{point.icon}</span>{point.delta}</div>',
            footerFormat: '</div>'
          }
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.RangeTertileFirst),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 20,
            opacity: 0
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.RangeTertileSecond),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 20
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.RangeQuartileFirst),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 20
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.RangeQuartileSecond),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 20
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.RangeQuintileFirst),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 20
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.RangeQuintileSecond),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 20
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.RangeQuintileThird),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 20
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.RangeQuintileFourth),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 20
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.EmployeeOutliers, controlPointDisplay),
          type: 'scatter',
          enableMouseTracking: true,
          pointWidth: 42,
          marker: {
            symbol: 'circle',
            radius: 6,
            fillColor: '#d9534f',
            lineColor: '#d9534f'
          },
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: red">Employees out of Range</div>' +
              '<div style="color: white">{point.countString}<br />{point.avgSalary}</div>' +
              '<div style="color: white">{point.delta}</div>',
            footerFormat: '</div>'
          }
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.Jobs, controlPointDisplay),
          type: 'scatter',
          enableMouseTracking: true,
          pointWidth: 42,
          marker: {
            symbol: 'circle',
            radius: 6,
            fillColor: '#000000',
            lineColor: '#000000'
          },
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            stickyTracking: false,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white"><b>{point.jobTitle}: </b>{point.dataPoint}<div>',
            footerFormat: '</div>'
          },
          cursor: 'pointer',
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.Regression, controlPointDisplay),
          type: 'line',
          enableMouseTracking: false,
          dashStyle: 'ShortDash',
          color: '#E02020',
          marker: {
            enabled: false
          }
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.JobsExcludedFromRegression, controlPointDisplay),
          type: 'scatter',
          enableMouseTracking: true,
          pointWidth: 42,
          marker: {
            symbol: 'circle',
            radius: 6,
            fillColor: '#FFFFFF',
            lineColor: '#E02020'
          },
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            stickyTracking: false,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white"><b>{point.jobTitle}</b></div><div>' +
              '<div style="color: white">{point.dataPoint}</div>',
            footerFormat: '</div>'
          }
        }
      ]
    };
  }

  static getHorizontalRangeOptions(locale, currencyCode, controlPointDisplay, rate, rangeDistributionTypeId) {
    return {
      chart: {
        inverted: true,
        animation: false,
        title: 'Grade Ranges',
        currency: currencyCode,
        locale: locale,
        style: {
          fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
          "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`
        },
        spacing: [0, 10, 0, 10]
      },
      exporting: {
        enabled: false
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
        y: 35,
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
          formatter: function () {
            return StructuresHighchartsService.formatYAxisLabel(this.value, locale, currencyCode, rate);
          }
        },
        gridLineWidth: 1,
        gridLineDashStyle: 'Dash',
        gridLineColor: '#bdbdbd',
        gridZIndex: 5,
        opposite: true,
        lineWidth: 0,
        tickPixelInterval: 200,
        title: {
          text: undefined
        },
        offset: 14
      },
      xAxis: {
        visible: false,
        maxPadding: 0,
        minPadding: 0
      },
      plotOptions: {
        series: {
          events: {
            legendItemClick: function (event) {
              if (event.target.userOptions.name ===
                GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileFirst)) {
                if (event.target.chart.yAxis[0].series[GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileFirst].visible) {
                  event.target.chart.yAxis[0].series[GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileFirst].hide();
                  event.target.chart.yAxis[0].series[GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileSecond].hide();
                  event.target.chart.yAxis[0].series[GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileThird].hide();
                  event.target.chart.yAxis[0].series[GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileFourth].hide();
                } else {
                  event.target.chart.yAxis[0].series[GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileFirst].show();
                  event.target.chart.yAxis[0].series[GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileSecond].show();
                  event.target.chart.yAxis[0].series[GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileThird].show();
                  event.target.chart.yAxis[0].series[GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileFourth].show();
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
            fillColor: null,
            lineWidth: 1,
            lineColor: null,
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeMinMidMax),
          type: 'columnrange',
          animation: false,
          color: rangeDistributionTypeId !== RangeDistributionTypeIds.Quartile ? 'rgb(174,210,238)' : 'transparent',
          enableMouseTracking: false,
          pointWidth: 42,
          stacking: 'normal',
          borderRadius: 5,
          showInLegend: rangeDistributionTypeId === RangeDistributionTypeIds.MinMidMax
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeMinMidMaxHidden),
          type: 'columnrange',
          animation: false,
          color: 'transparent',
          enableMouseTracking: false,
          pointWidth: 42,
          showInLegend: false,
          stacking: 'normal'
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeTertile),
          type: 'columnrange',
          animation: false,
          color: 'rgb(210,230,246)',
          enableMouseTracking: false,
          pointWidth: 42,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: rangeDistributionTypeId === RangeDistributionTypeIds.Tertile
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuintile),
          type: 'columnrange',
          animation: false,
          color: 'rgb(210,230,246)',
          enableMouseTracking: false,
          pointWidth: 42,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: rangeDistributionTypeId === RangeDistributionTypeIds.Quintile
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileFirst),
          type: 'columnrange',
          animation: false,
          color: 'rgb(174,210,238)',
          enableMouseTracking: false,
          pointWidth: 42,
          stacking: 'normal',
          borderRadiusBottomRight: 5,
          borderRadiusBottomLeft: 5,
          showInLegend: rangeDistributionTypeId === RangeDistributionTypeIds.Quartile
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileSecond),
          type: 'columnrange',
          animation: false,
          color: 'rgb(210,230,246)',
          enableMouseTracking: false,
          pointWidth: 42,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: false
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileThird),
          type: 'columnrange',
          animation: false,
          color: 'rgb(174,210,238)',
          enableMouseTracking: false,
          pointWidth: 42,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: false
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.SalaryRangeQuartileFourth),
          type: 'columnrange',
          animation: false,
          color: 'rgb(210,230,246)',
          enableMouseTracking: false,
          pointWidth: 42,
          stacking: 'normal',
          borderRadiusTopRight: 5,
          borderRadiusTopLeft: 5,
          showInLegend: false
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.RangeMid),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#CD8C01',
            radius: 20
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black; color: white">',
            pointFormat: '<div><b>{point.gradeName}</b></div><div>' +
              '<div>{point.dataPoint}</div>' +
              '<div>{point.currentDataPoint}</div>' +
              '<div>{point.newDataPoint}</div>' +
              '<div><span style="font-size: 25px; color: {point.iconColor};">{point.icon}</span>{point.delta}</div>',
            footerFormat: '</div>'
          }
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.RangeTertileFirst),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 20,
            opacity: 0
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.RangeTertileSecond),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 20
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.RangeQuartileFirst),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 20
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.RangeQuartileSecond),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 20
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.RangeQuintileFirst),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 20
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.RangeQuintileSecond),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 20
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.RangeQuintileThird),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 20
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.RangeQuintileFourth),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 20
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.EmployeeOutliers, controlPointDisplay),
          type: 'scatter',
          enableMouseTracking: true,
          pointWidth: 42,
          marker: {
            symbol: 'circle',
            radius: 6,
            fillColor: '#d9534f',
            lineColor: '#d9534f'
          },
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: red">Employees out of Range</div>' +
              '<div style="color: white">{point.countString}<br />{point.avgSalary}</div>' +
              '<div style="color: white">{point.delta}</div>',
            footerFormat: '</div>'
          }
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.Jobs, controlPointDisplay),
          type: 'scatter',
          enableMouseTracking: true,
          pointWidth: 42,
          marker: {
            symbol: 'circle',
            radius: 6,
            fillColor: '#000000',
            lineColor: '#000000'
          },
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            stickyTracking: false,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white"><b>{point.jobTitle}: </b>{point.dataPoint}<div>',
            footerFormat: '</div>'
          },
          cursor: 'pointer',
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.Regression, controlPointDisplay),
          type: 'line',
          enableMouseTracking: false,
          dashStyle: 'ShortDash',
          color: '#E02020',
          marker: {
            enabled: false
          }
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalOrHorizontalModelChartSeries.JobsExcludedFromRegression, controlPointDisplay),
          type: 'scatter',
          enableMouseTracking: true,
          pointWidth: 42,
          marker: {
            symbol: 'circle',
            radius: 6,
            fillColor: '#FFFFFF',
            lineColor: '#E02020'
          },
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            stickyTracking: false,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white"><b>{point.jobTitle}</b></div><div>' +
              '<div style="color: white">{point.dataPoint}</div>',
            footerFormat: '</div>'
          }
        }
      ]
    };
  }
}
