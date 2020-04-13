import {EmployeeSalaryRangeChartSeries} from './employee-salary-range-chart-series-constants';

export class EmployeeRangeChartService {

  static getFormattedSeriesName(series: EmployeeSalaryRangeChartSeries, controlPointDisplay: string = '') {
    switch (series) {
      case EmployeeSalaryRangeChartSeries.SalaryRange: {
        return 'Salary range';
      }
      case EmployeeSalaryRangeChartSeries.RangeMid: {
        return 'Range Mid';
      }
      case EmployeeSalaryRangeChartSeries.RangeMidHidden: {
        return 'Range Mid - hidden';
      }
      case EmployeeSalaryRangeChartSeries.Average: {
        return 'Average ' + controlPointDisplay;
      }
      case EmployeeSalaryRangeChartSeries.AverageHidden: {
        return 'Average ' + controlPointDisplay + ' -hidden';
      }
      case EmployeeSalaryRangeChartSeries.Employee: {
        return 'Employee ' + controlPointDisplay;
      }
      case EmployeeSalaryRangeChartSeries.EmployeeOutliers: {
        return 'Employee ' + controlPointDisplay + ' -outliers';
      }
      default: {
        // should never happen, but in case someone adds a value later and forgets.
        return '';
      }

    }
  }

  static getEmployeeRangeOptions(locale, currencyCode, controlPointDisplay, rate) {
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
        }
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
        opposite: true,
        gridLineWidth: 1,
        gridLineDashStyle: 'Dash',
        lineWidth: 0,
        tickPixelInterval: 300,
        title: {
          text: undefined
        },
        offset: 15
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
              const plotLinesOrBandsData = [
                EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.Average, controlPointDisplay),
                EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.RangeMid),
                EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.SalaryRange)
              ];
              // check to see if we need to remove or add a line/band OR we just want to perform the default function
              if (plotLinesOrBandsData.includes(event.target.userOptions.name)) {
                // look for the line or band in question on the chart
                const lineOrBand = event.target.chart.yAxis[0].plotLinesAndBands.find(plb => plb.id === event.target.userOptions.name);
                // if we find one, remove it. else add it
                if (lineOrBand) {
                  event.target.chart.yAxis[0].removePlotLine(event.target.userOptions.name);
                  event.target.chart.yAxis[0].series[EmployeeSalaryRangeChartSeries.Average].visible = false;
                } else {
                  // find from static options and add
                  const options = event.target.chart.collectionsWithUpdate.find(plb => plb.id === event.target.userOptions.name);
                  event.target.chart.yAxis[0].addPlotLine(options);
                  event.target.chart.yAxis[0].series[EmployeeSalaryRangeChartSeries.Average].visible = true;
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
        name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.SalaryRange),
        type: 'polygon',
        animation: false,
        color: 'rgba(36,134,210,0.45)',
        enableMouseTracking: false,

      }, {
        name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.RangeMid),
        type: 'line',
        color: '#CD8C01',
        marker: {
          enabled: false
        }
      }, {
        name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.RangeMidHidden, controlPointDisplay),
        type: 'scatter',
        color: 'transparent',
        showInLegend: false,
        enableMouseTracking: true,
        tooltip: {
          backgroundColor: '#000000',
          useHTML: true,
          padding: 0,
          headerFormat: '<div style="display: inline-block; background-color: black; color: white">',
          pointFormat: '<div><b>{point.jobTitle}</b></div><div>' +
            '<div>{point.midPoint}</div>' +
            '<div>{point.currentMidPoint}</div>' +
            '<div>{point.newMidPoint}</div>' +
            '<div><span style="font-size:25px; color:{point.iconColor};">{point.icon}</span>{point.delta}</div>',
          footerFormat: '</div>'
        }
      }, {
        name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.Average, controlPointDisplay),
        type: 'line',
        color: '#6236FF',
        marker: {
          enabled: false
        },
      }, {
        name: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.AverageHidden, controlPointDisplay),
        type: 'scatter',
        color: 'transparent',
        showInLegend: false,
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
      }, {
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
      }, {
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
      }]
    };
  }
}

