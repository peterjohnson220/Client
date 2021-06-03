import { RangeDistributionTypeIds } from 'libs/constants/structures/range-distribution-type-ids';

import { JobViewRangeChartSeries } from './job-view-range-chart-series-constants';

export class JobViewRangeChartService {

  static getFormattedSeriesName(series: JobViewRangeChartSeries, controlPointDisplay: string = '') {
    switch (series) {
      case JobViewRangeChartSeries.SalaryRangeMinMidMax: {
        return 'Salary range';
      }
      case JobViewRangeChartSeries.SalaryRangeTertile: {
        return 'Salary range Tertile';
      }
      case JobViewRangeChartSeries.SalaryRangeQuartileFirst:
      case JobViewRangeChartSeries.SalaryRangeQuartileSecond:
      case JobViewRangeChartSeries.SalaryRangeQuartileThird:
      case JobViewRangeChartSeries.SalaryRangeQuartileFourth: {
        return 'Salary range Quartile';
      }
      case JobViewRangeChartSeries.SalaryRangeQuintile: {
        return 'Salary range Quintile';
      }
      case JobViewRangeChartSeries.RangeMid: {
        return 'Range Mid';
      }
      case JobViewRangeChartSeries.RangeTertileFirst: {
        return 'Top 1st 3rd';
      }
      case JobViewRangeChartSeries.RangeTertileSecond: {
        return 'Top 2nd 3rd';
      }
      case JobViewRangeChartSeries.RangeQuartileFirst: {
        return 'Top 1st 4th';
      }
      case JobViewRangeChartSeries.RangeQuartileSecond: {
        return 'Top 3rd 4th';
      }
      case JobViewRangeChartSeries.RangeQuintileFirst: {
        return 'Top 1st 5th';
      }
      case JobViewRangeChartSeries.RangeQuintileSecond: {
        return 'Top 2nd 5th';
      }
      case JobViewRangeChartSeries.RangeQuintileThird: {
        return 'Top 3rd 5th';
      }
      case JobViewRangeChartSeries.RangeQuintileFourth: {
        return 'Top 4th 5th';
      }
      case JobViewRangeChartSeries.AverageEEPay: {
        return 'Average Employee Base Salary';
      }
      case JobViewRangeChartSeries.EmployeeOutliers: {
        return 'Outlier Base Salary';
      }
      case JobViewRangeChartSeries.MRP: {
        return 'MRP';
      }

      default: {
        // should never happen, but in case someone adds a value later and forgets.
        return '';
      }
    }

    }

  static getJobViewRangeOptions(locale, currencyCode, controlPointDisplay, rangeDistributionTypeId) {
    return {
      chart: {
        inverted: true,
        animation: false,
        title: 'Job View - GBR',
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
        offset: 22
      },
      xAxis: {
        visible: false,
        // add categories to make the x-axis line up properly. Highcharts will extend the categories dynamically, so it doesn't matter that its hardcoded here
        minPadding: 0,
        maxPadding: 0
      },
      plotOptions: {
        series: {
          events: {
            legendItemClick: function (event) {
              if (event.target.userOptions.name === JobViewRangeChartService.getFormattedSeriesName(JobViewRangeChartSeries.SalaryRangeQuartileFirst)) {
                if (event.target.chart.yAxis[0].series[JobViewRangeChartSeries.SalaryRangeQuartileFirst].visible) {
                  event.target.chart.yAxis[0].series[JobViewRangeChartSeries.SalaryRangeQuartileFirst].hide();
                  event.target.chart.yAxis[0].series[JobViewRangeChartSeries.SalaryRangeQuartileSecond].hide();
                  event.target.chart.yAxis[0].series[JobViewRangeChartSeries.SalaryRangeQuartileThird].hide();
                  event.target.chart.yAxis[0].series[JobViewRangeChartSeries.SalaryRangeQuartileFourth].hide();
                } else {
                  event.target.chart.yAxis[0].series[JobViewRangeChartSeries.SalaryRangeQuartileFirst].show();
                  event.target.chart.yAxis[0].series[JobViewRangeChartSeries.SalaryRangeQuartileSecond].show();
                  event.target.chart.yAxis[0].series[JobViewRangeChartSeries.SalaryRangeQuartileThird].show();
                  event.target.chart.yAxis[0].series[JobViewRangeChartSeries.SalaryRangeQuartileFourth].show();
                }
                return false;
              } else {
                return true;
              }
            }
          },
          stickyTracking: false,
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
          name: JobViewRangeChartService.getFormattedSeriesName(JobViewRangeChartSeries.SalaryRangeMinMidMax),
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
          name: JobViewRangeChartService.getFormattedSeriesName(JobViewRangeChartSeries.SalaryRangeTertile),
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
          name: JobViewRangeChartService.getFormattedSeriesName(JobViewRangeChartSeries.SalaryRangeQuintile),
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
          name: JobViewRangeChartService.getFormattedSeriesName(JobViewRangeChartSeries.SalaryRangeQuartileFirst),
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
          name: JobViewRangeChartService.getFormattedSeriesName(JobViewRangeChartSeries.SalaryRangeQuartileSecond),
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
          name: JobViewRangeChartService.getFormattedSeriesName(JobViewRangeChartSeries.SalaryRangeQuartileThird),
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
          name: JobViewRangeChartService.getFormattedSeriesName(JobViewRangeChartSeries.SalaryRangeQuartileFourth),
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
          name: JobViewRangeChartService.getFormattedSeriesName(JobViewRangeChartSeries.RangeMid),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#CD8C01',
            radius: 26,
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
          name: JobViewRangeChartService.getFormattedSeriesName(JobViewRangeChartSeries.RangeTertileFirst),
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
          name: JobViewRangeChartService.getFormattedSeriesName(JobViewRangeChartSeries.RangeTertileSecond),
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
          name: JobViewRangeChartService.getFormattedSeriesName(JobViewRangeChartSeries.RangeQuartileFirst),
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
          name: JobViewRangeChartService.getFormattedSeriesName(JobViewRangeChartSeries.RangeQuartileSecond),
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
          name: JobViewRangeChartService.getFormattedSeriesName(JobViewRangeChartSeries.RangeQuintileFirst),
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
          name: JobViewRangeChartService.getFormattedSeriesName(JobViewRangeChartSeries.RangeQuintileSecond),
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
          name: JobViewRangeChartService.getFormattedSeriesName(JobViewRangeChartSeries.RangeQuintileThird),
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
          name: JobViewRangeChartService.getFormattedSeriesName(JobViewRangeChartSeries.RangeQuintileFourth),
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
          name: JobViewRangeChartService.getFormattedSeriesName(JobViewRangeChartSeries.AverageEEPay),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#9370DB',
            radius: 20,
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white; font-weight: bold">{point.jobTitle}</div>' +
              '<div style="color: white">{point.avgPay}</div>' +
              '<div style="color: white">Average Comparatio: {point.avgComparatio}%</div>' +
              '<div style="color: white">Average Position in range: {point.avgPositionInRange}%</div>',
            footerFormat: '</div>'
          }
        },
        {
          name: JobViewRangeChartService.getFormattedSeriesName(JobViewRangeChartSeries.EmployeeOutliers, controlPointDisplay),
          type: 'scatter',
          enableMouseTracking: true,
          marker: {
            enabled: true,
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
          name: JobViewRangeChartService.getFormattedSeriesName(JobViewRangeChartSeries.MRP, controlPointDisplay),
          type: 'scatter',
          enableMouseTracking: true,
          marker: {
            symbol: 'circle',
            fillColor: '#000000',
            lineColor: '#000000',
            radius: 5.5,
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


