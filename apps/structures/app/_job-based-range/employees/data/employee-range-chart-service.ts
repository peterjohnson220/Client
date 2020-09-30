import { EmployeeSalaryRangeChartSeries } from './employee-salary-range-chart-series-constants';
import { RangeDistributionTypeIds } from '../../shared/constants/range-distribution-type-ids';

export class EmployeeRangeChartService {

  static getFormattedSeriesName(series: EmployeeSalaryRangeChartSeries, controlPointDisplay: string = '') {
    switch (series) {
      case EmployeeSalaryRangeChartSeries.SalaryRangeMinMidMax: {
        return 'Salary range';
      }
      case EmployeeSalaryRangeChartSeries.SalaryRangeTertile: {
        return 'Salary range Tertile';
      }
      case EmployeeSalaryRangeChartSeries.SalaryRangeQuartileFirst:
      case EmployeeSalaryRangeChartSeries.SalaryRangeQuartileSecond:
      case EmployeeSalaryRangeChartSeries.SalaryRangeQuartileThird:
      case EmployeeSalaryRangeChartSeries.SalaryRangeQuartileFourth: {
        return 'Salary range Quartile';
      }
      case EmployeeSalaryRangeChartSeries.SalaryRangeQuintile: {
        return 'Salary range Quintile';
      }
      case EmployeeSalaryRangeChartSeries.RangeMid: {
        return 'Range Mid';
      }
      case EmployeeSalaryRangeChartSeries.RangeTertileFirst: {
        return 'Top 1st 3rd';
      }
      case EmployeeSalaryRangeChartSeries.RangeTertileSecond: {
        return 'Top 2nd 3rd';
      }
      case EmployeeSalaryRangeChartSeries.RangeQuartileFirst: {
        return 'Top 1st 4th';
      }
      case EmployeeSalaryRangeChartSeries.RangeQuartileSecond: {
        return 'Top 3rd 4th';
      }
      case EmployeeSalaryRangeChartSeries.RangeQuintileFirst: {
        return 'Top 1st 5th';
      }
      case EmployeeSalaryRangeChartSeries.RangeQuintileSecond: {
        return 'Top 2nd 5th';
      }
      case EmployeeSalaryRangeChartSeries.RangeQuintileThird: {
        return 'Top 3rd 5th';
      }
      case EmployeeSalaryRangeChartSeries.RangeQuintileFourth: {
        return 'Top 4th 5th';
      }
      case EmployeeSalaryRangeChartSeries.Average: {
        return 'Average ' + controlPointDisplay;
      }
      case EmployeeSalaryRangeChartSeries.Employee: {
        return 'Employee ' + controlPointDisplay;
      }
      case EmployeeSalaryRangeChartSeries.EmployeeOutliers: {
        return 'Employee ' + controlPointDisplay + ' -outliers';
      }
      case EmployeeSalaryRangeChartSeries.MRP: {
        return 'MRP';
      }
      default: {
        // should never happen, but in case someone adds a value later and forgets.
        return '';
      }
    }
  }

  static getEmployeeRangeOptions(locale, currencyCode, controlPointDisplay, rangeDistributionTypeId) {
    return {
      chart: {
        inverted: true,
        animation: false,
        title: 'Employee - Job Range',
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
        type: 'category',
        categories: ['0', '1'],
        minPadding: 0,
        maxPadding: 0
      },
      plotOptions: {
        series: {
          events: {
            legendItemClick: function (event) {
              if (event.target.userOptions.name === EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.SalaryRangeQuartileFirst)) {
                if (event.target.chart.yAxis[0].series[EmployeeSalaryRangeChartSeries.SalaryRangeQuartileFirst].visible) {
                  event.target.chart.yAxis[0].series[EmployeeSalaryRangeChartSeries.SalaryRangeQuartileFirst].hide();
                  event.target.chart.yAxis[0].series[EmployeeSalaryRangeChartSeries.SalaryRangeQuartileSecond].hide();
                  event.target.chart.yAxis[0].series[EmployeeSalaryRangeChartSeries.SalaryRangeQuartileThird].hide();
                  event.target.chart.yAxis[0].series[EmployeeSalaryRangeChartSeries.SalaryRangeQuartileFourth].hide();
                } else {
                  event.target.chart.yAxis[0].series[EmployeeSalaryRangeChartSeries.SalaryRangeQuartileFirst].show();
                  event.target.chart.yAxis[0].series[EmployeeSalaryRangeChartSeries.SalaryRangeQuartileSecond].show();
                  event.target.chart.yAxis[0].series[EmployeeSalaryRangeChartSeries.SalaryRangeQuartileThird].show();
                  event.target.chart.yAxis[0].series[EmployeeSalaryRangeChartSeries.SalaryRangeQuartileFourth].show();
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
          name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.SalaryRangeMinMidMax),
          type: 'columnrange',
          animation: false,
          color: 'rgb(174,210,238)',
          enableMouseTracking: false,
          pointWidth: 60,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: rangeDistributionTypeId === RangeDistributionTypeIds.MinMidMax
        },
        {
          name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.SalaryRangeTertile),
          type: 'columnrange',
          animation: false,
          color: 'rgb(210,230,246)',
          enableMouseTracking: false,
          pointWidth: 60,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: rangeDistributionTypeId === RangeDistributionTypeIds.Tertile
        },
        {
          name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.SalaryRangeQuintile),
          type: 'columnrange',
          animation: false,
          color: 'rgb(210,230,246)',
          enableMouseTracking: false,
          pointWidth: 60,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: rangeDistributionTypeId === RangeDistributionTypeIds.Quintile
        },
        {
          name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.SalaryRangeQuartileFirst),
          type: 'columnrange',
          animation: false,
          color: 'rgb(174,210,238)',
          enableMouseTracking: false,
          pointWidth: 60,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: rangeDistributionTypeId === RangeDistributionTypeIds.Quartile
        },
        {
          name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.SalaryRangeQuartileSecond),
          type: 'columnrange',
          animation: false,
          color: 'rgb(210,230,246)',
          enableMouseTracking: false,
          pointWidth: 60,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: false
        },
        {
          name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.SalaryRangeQuartileThird),
          type: 'columnrange',
          animation: false,
          color: 'rgb(174,210,238)',
          enableMouseTracking: false,
          pointWidth: 60,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: false
        },
        {
          name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.SalaryRangeQuartileFourth),
          type: 'columnrange',
          animation: false,
          color: 'rgb(210,230,246)',
          enableMouseTracking: false,
          pointWidth: 60,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: false
        },
        {
          name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.RangeMid),
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
          name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.RangeTertileFirst),
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
          name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.RangeTertileSecond),
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
          name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.RangeQuartileFirst),
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
          name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.RangeQuartileSecond),
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
          name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.RangeQuintileFirst),
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
          name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.RangeQuintileSecond),
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
          name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.RangeQuintileThird),
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
          name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.RangeQuintileFourth),
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
          name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.Average),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#9370DB',
            radius: 30,
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white; font-weight: bold">{point.jobTitle}</div>' +
              '<div style="color: white">{point.avgSalary}</div>' +
              '<div style="color: white">Average Comparatio: {point.avgComparatio}%</div>' +
              '<div style="color: white">Average Position in range: {point.avgPositioninRange}%</div>',
            footerFormat: '</div>'
          }
        },
        {
          name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.Employee, controlPointDisplay),
          type: 'scatter',
          marker: {
            enabled: true,
            // tslint:disable-next-line:max-line-length
            symbol: `url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTFweCIgaGVpZ2h0PSIxMXB4IiB2aWV3Qm94PSIwIDAgMTEgMTEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDY0ICg5MzUzNykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+bGFiZWwtZGFuZ2VyPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IldvcmtpbmciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJTdHJ1Y3R1cmVzLS0tR2VuZXJhbCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE0NDMuMDAwMDAwLCAtNjE5LjAwMDAwMCkiIGZpbGw9IiMwODgzQkUiPgogICAgICAgICAgICA8ZyBpZD0ibGFiZWwtZGFuZ2VyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNDQzLjAwMDAwMCwgNjE5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHJlY3QgaWQ9IkJHIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTEiIGhlaWdodD0iMTEiIHJ4PSI1LjUiPjwvcmVjdD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+)`,
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white; font-weight: bold">{point.empDisplay}</div>' +
              '<div style="color: white">{point.salaryDisplay}</div>',
            footerFormat: '</div>'
          }
        },
        {
          name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.EmployeeOutliers, controlPointDisplay),
          type: 'scatter',
          marker: {
            enabled: true,
            // tslint:disable-next-line:max-line-length
            symbol: `url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTFweCIgaGVpZ2h0PSIxMXB4IiB2aWV3Qm94PSIwIDAgMTEgMTEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDY0ICg5MzUzNykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+bGFiZWwtZGFuZ2VyPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IldvcmtpbmciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJTdHJ1Y3R1cmVzLS0tR2VuZXJhbCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE0NDMuMDAwMDAwLCAtNjE5LjAwMDAwMCkiIGZpbGw9IiNEOTUzNEYiPgogICAgICAgICAgICA8ZyBpZD0ibGFiZWwtZGFuZ2VyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNDQzLjAwMDAwMCwgNjE5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHJlY3QgaWQ9IkJHIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTEiIGhlaWdodD0iMTEiIHJ4PSI1LjUiPjwvcmVjdD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+)`,
          },
          showInLegend: false,
          enableMouseTracking: true,
          linkedTo: ':previous',
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white; font-weight: bold">{point.empDisplay}</div>' +
              '<div style="color: white">{point.salaryDisplay}</div>',
            footerFormat: '</div>'
          }
        },
        {
          name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.MRP, controlPointDisplay),
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

