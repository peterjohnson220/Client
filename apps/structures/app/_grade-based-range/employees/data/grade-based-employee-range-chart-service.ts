import { RangeDistributionTypeIds } from 'libs/constants/structures/range-distribution-type-ids';

import { GradeBasedEmployeeSalaryRangeChartSeries } from './grade-based-employee-salary-range-chart-series-constants';
import { GradeRangeVerticalModelChartSeries } from '../../shared/data';

export class GradeBasedEmployeeRangeChartService {

  static getFormattedSeriesName(series: GradeBasedEmployeeSalaryRangeChartSeries, controlPointDisplay: string = '') {
    switch (series) {
      case GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeMinMidMax: {
        return 'Salary range';
      }
      case GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeTertile: {
        return 'Salary range Tertile';
      }
      case GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuartileFirst:
      case GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuartileSecond:
      case GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuartileThird:
      case GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuartileFourth: {
        return 'Salary range Quartile';
      }
      case GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuintile: {
        return 'Salary range Quintile';
      }
      case GradeBasedEmployeeSalaryRangeChartSeries.RangeMid: {
        return 'Range Mid';
      }
      case GradeBasedEmployeeSalaryRangeChartSeries.EmployeePay: {
        return 'Employee ' + controlPointDisplay;
      }
      case GradeBasedEmployeeSalaryRangeChartSeries.EmployeeOutlierPay: {
        return 'Employee ' + controlPointDisplay + ' -outliers';
      }
      case GradeBasedEmployeeSalaryRangeChartSeries.JobMRP: {
        return 'Job MRP';
      }
      default: {
        // should never happen, but in case someone adds a value later and forgets.
        return '';
      }
    }
  }

  static getGradeBasedEmployeeRangeOptions(locale, currencyCode, controlPointDisplay, rangeDistributionTypeId) {
    return {
      chart: {
        inverted: true,
        animation: false,
        title: 'Employee - Grade Range',
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
              if (event.target.userOptions.name ===
                GradeBasedEmployeeRangeChartService.getFormattedSeriesName(GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuartileFirst)) {
                if (event.target.chart.yAxis[0].series[GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuartileFirst].visible) {
                  event.target.chart.yAxis[0].series[GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuartileFirst].hide();
                  event.target.chart.yAxis[0].series[GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuartileSecond].hide();
                  event.target.chart.yAxis[0].series[GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuartileThird].hide();
                  event.target.chart.yAxis[0].series[GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuartileFourth].hide();
                } else {
                  event.target.chart.yAxis[0].series[GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuartileFirst].show();
                  event.target.chart.yAxis[0].series[GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuartileSecond].show();
                  event.target.chart.yAxis[0].series[GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuartileThird].show();
                  event.target.chart.yAxis[0].series[GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuartileFourth].show();
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
          name: GradeBasedEmployeeRangeChartService.getFormattedSeriesName(GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeMinMidMax),
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
          name: GradeBasedEmployeeRangeChartService.getFormattedSeriesName(GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeTertile),
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
          name: GradeBasedEmployeeRangeChartService.getFormattedSeriesName(GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuintile),
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
          name: GradeBasedEmployeeRangeChartService.getFormattedSeriesName(GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuartileFirst),
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
          name: GradeBasedEmployeeRangeChartService.getFormattedSeriesName(GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuartileSecond),
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
          name: GradeBasedEmployeeRangeChartService.getFormattedSeriesName(GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuartileThird),
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
          name: GradeBasedEmployeeRangeChartService.getFormattedSeriesName(GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuartileFourth),
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
          name: GradeBasedEmployeeRangeChartService.getFormattedSeriesName(GradeBasedEmployeeSalaryRangeChartSeries.RangeMid),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#CD8C01',
            radius: 24,
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
          name: GradeBasedEmployeeRangeChartService.getFormattedSeriesName(GradeBasedEmployeeSalaryRangeChartSeries.EmployeePay, controlPointDisplay),
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
          name: GradeBasedEmployeeRangeChartService.getFormattedSeriesName(GradeBasedEmployeeSalaryRangeChartSeries.EmployeeOutlierPay, controlPointDisplay),
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
          name: GradeBasedEmployeeRangeChartService.getFormattedSeriesName(GradeBasedEmployeeSalaryRangeChartSeries.JobMRP, controlPointDisplay),
          type: 'scatter',
          enableMouseTracking: true,
          pointWidth: 42,
          marker: {
            symbol: 'circle',
            radius: 5.5,
            fillColor: '#000000',
            lineColor: '#000000'
          },
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            stickyTracking: false,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white"><b>{point.jobTitle} - </b>{point.mrp}<div>',
            footerFormat: '</div>'
          },
          cursor: 'pointer',
        },
      ]
    };
  }
}

