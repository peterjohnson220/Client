import { RangeDistributionTypeIds } from '../../../shared/constants/range-distribution-type-ids';
import { GradeRangeVerticalModelChartSeries } from './grade-range-model-chart-series-constants';
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
        }
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

  static getFormattedSeriesName(series: GradeRangeVerticalModelChartSeries, controlPointDisplay: string = '') {
    switch (series) {
      case GradeRangeVerticalModelChartSeries.SalaryRangeMinMidMax: {
        return 'Salary range';
      }
      case GradeRangeVerticalModelChartSeries.SalaryRangeTertile: {
        return 'Salary range Tertile';
      }
      case GradeRangeVerticalModelChartSeries.SalaryRangeQuartileFirst:
      case GradeRangeVerticalModelChartSeries.SalaryRangeQuartileSecond:
      case GradeRangeVerticalModelChartSeries.SalaryRangeQuartileThird:
      case GradeRangeVerticalModelChartSeries.SalaryRangeQuartileFourth: {
        return 'Salary range Quartile';
      }
      case GradeRangeVerticalModelChartSeries.SalaryRangeQuintile: {
        return 'Salary range Quintile';
      }
      case GradeRangeVerticalModelChartSeries.RangeMid: {
        return 'Range Mid';
      }
      case GradeRangeVerticalModelChartSeries.RangeTertileFirst: {
        return 'Top 1st 3rd';
      }
      case GradeRangeVerticalModelChartSeries.RangeTertileSecond: {
        return 'Top 2nd 3rd';
      }
      case GradeRangeVerticalModelChartSeries.RangeQuartileFirst: {
        return 'Top 1st 4th';
      }
      case GradeRangeVerticalModelChartSeries.RangeQuartileSecond: {
        return 'Top 3rd 4th';
      }
      case GradeRangeVerticalModelChartSeries.RangeQuintileFirst: {
        return 'Top 1st 5th';
      }
      case GradeRangeVerticalModelChartSeries.RangeQuintileSecond: {
        return 'Top 2nd 5th';
      }
      case GradeRangeVerticalModelChartSeries.RangeQuintileThird: {
        return 'Top 3rd 5th';
      }
      case GradeRangeVerticalModelChartSeries.RangeQuintileFourth: {
        return 'Top 4th 5th';
      }
      case GradeRangeVerticalModelChartSeries.EmployeeOutliers: {
        return 'Outlier ' + controlPointDisplay;
      }
      case GradeRangeVerticalModelChartSeries.Jobs: {
        return 'Job Market Data';
      }
      case GradeRangeVerticalModelChartSeries.Regression: {
        return 'Regression Line';
      }
      case GradeRangeVerticalModelChartSeries.JobsExcludedFromRegression: {
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
                GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalModelChartSeries.SalaryRangeQuartileFirst)) {
                if (event.target.chart.yAxis[0].series[GradeRangeVerticalModelChartSeries.SalaryRangeQuartileFirst].visible) {
                  event.target.chart.yAxis[0].series[GradeRangeVerticalModelChartSeries.SalaryRangeQuartileFirst].hide();
                  event.target.chart.yAxis[0].series[GradeRangeVerticalModelChartSeries.SalaryRangeQuartileSecond].hide();
                  event.target.chart.yAxis[0].series[GradeRangeVerticalModelChartSeries.SalaryRangeQuartileThird].hide();
                  event.target.chart.yAxis[0].series[GradeRangeVerticalModelChartSeries.SalaryRangeQuartileFourth].hide();
                } else {
                  event.target.chart.yAxis[0].series[GradeRangeVerticalModelChartSeries.SalaryRangeQuartileFirst].show();
                  event.target.chart.yAxis[0].series[GradeRangeVerticalModelChartSeries.SalaryRangeQuartileSecond].show();
                  event.target.chart.yAxis[0].series[GradeRangeVerticalModelChartSeries.SalaryRangeQuartileThird].show();
                  event.target.chart.yAxis[0].series[GradeRangeVerticalModelChartSeries.SalaryRangeQuartileFourth].show();
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalModelChartSeries.SalaryRangeMinMidMax),
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalModelChartSeries.SalaryRangeMinMidMaxHidden),
          type: 'columnrange',
          animation: false,
          color: 'transparent',
          enableMouseTracking: false,
          pointWidth: 42,
          showInLegend: false,
          stacking: 'normal'
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalModelChartSeries.SalaryRangeTertile),
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalModelChartSeries.SalaryRangeQuintile),
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalModelChartSeries.SalaryRangeQuartileFirst),
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalModelChartSeries.SalaryRangeQuartileSecond),
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalModelChartSeries.SalaryRangeQuartileThird),
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalModelChartSeries.SalaryRangeQuartileFourth),
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalModelChartSeries.RangeMid),
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
              '<div>{point.currentMid}</div>' +
              '<div>{point.modeledMid}</div>' +
              '<div>{point.midPointDiff}</div>',
            footerFormat: '</div>'
          }
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalModelChartSeries.RangeTertileFirst),
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalModelChartSeries.RangeTertileSecond),
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalModelChartSeries.RangeQuartileFirst),
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalModelChartSeries.RangeQuartileSecond),
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalModelChartSeries.RangeQuintileFirst),
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalModelChartSeries.RangeQuintileSecond),
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalModelChartSeries.RangeQuintileThird),
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalModelChartSeries.RangeQuintileFourth),
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalModelChartSeries.EmployeeOutliers, controlPointDisplay),
          type: 'scatter',
          enableMouseTracking: true,
          pointWidth: 42,
          marker: {
            enabled: true,
            radius: 6,
            // tslint:disable-next-line:max-line-length
            symbol: `url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTFweCIgaGVpZ2h0PSIxMXB4IiB2aWV3Qm94PSIwIDAgMTEgMTEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDY0ICg5MzUzNykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+bGFiZWwtZGFuZ2VyPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IldvcmtpbmciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJTdHJ1Y3R1cmVzLS0tR2VuZXJhbCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE0NDMuMDAwMDAwLCAtNjE5LjAwMDAwMCkiIGZpbGw9IiNEOTUzNEYiPgogICAgICAgICAgICA8ZyBpZD0ibGFiZWwtZGFuZ2VyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNDQzLjAwMDAwMCwgNjE5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHJlY3QgaWQ9IkJHIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTEiIGhlaWdodD0iMTEiIHJ4PSI1LjUiPjwvcmVjdD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+)`,
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
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalModelChartSeries.Jobs, controlPointDisplay),
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
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white"><b>{point.jobTitle}: </b>{point.dataPoint}<div>',
            footerFormat: '</div>'
          }
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalModelChartSeries.Regression, controlPointDisplay),
          type: 'line',
          enableMouseTracking: false,
          dashStyle: 'ShortDash',
          color: '#E02020',
          marker: {
            enabled: false
          }
        },
        {
          name: GradeRangeModelChartService.getFormattedSeriesName(GradeRangeVerticalModelChartSeries.JobsExcludedFromRegression, controlPointDisplay),
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
