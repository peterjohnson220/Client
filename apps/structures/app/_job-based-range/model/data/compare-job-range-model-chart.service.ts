import { StructuresHighchartsService } from '../../shared/services';
import { RangeDistributionTypeIds } from '../../shared/constants/range-distribution-type-ids';
import {
  CompareJobRangeModelChartSeries,
  CompareQuartileJobRangeModelChartSeries,
  CompareTertileJobRangeModelChartSeries
} from './compare-job-range-model-chart-series-constants';


export class CompareJobRangeModelChartService {

  static getFormattedSeriesName(series: CompareJobRangeModelChartSeries, controlPointDisplay: string = '', currentRangeGroupName: string = '') {
    switch (series) {
      case CompareJobRangeModelChartSeries.SalaryRangeMinMidMax: {
        return 'Salary Range';
      }
      case CompareJobRangeModelChartSeries.CompareSalaryRangeMinMidMax: {
        return currentRangeGroupName + ' Salary Range';
      }
      case CompareJobRangeModelChartSeries.RangeMid: {
        return 'Range Mid';
      }
      case CompareJobRangeModelChartSeries.CompareRangeMid: {
        return currentRangeGroupName + ' Range Mid';
      }
      case CompareJobRangeModelChartSeries.Average: {
        return 'Average ' + controlPointDisplay;
      }
      case CompareJobRangeModelChartSeries.CompareAverage: {
        return currentRangeGroupName + ' Average ' + controlPointDisplay;
      }
      case CompareJobRangeModelChartSeries.EmployeeOutliers: {
        return 'Outlier ' + controlPointDisplay;
      }
      case CompareJobRangeModelChartSeries.CompareEmployeeOutliers: {
        return currentRangeGroupName + ' Outlier ' + controlPointDisplay;
      }
      case CompareJobRangeModelChartSeries.SalaryRangeTertile: {
        return 'Salary range Tertile';
      }
      case CompareJobRangeModelChartSeries.CompareSalaryRangeTertile: {
        return currentRangeGroupName + ' Salary range Tertile';
      }
      case CompareJobRangeModelChartSeries.SalaryRangeQuartileFirst:
      case CompareJobRangeModelChartSeries.SalaryRangeQuartileSecond:
      case CompareJobRangeModelChartSeries.SalaryRangeQuartileThird:
      case CompareJobRangeModelChartSeries.SalaryRangeQuartileFourth: {
        return 'Salary range Quartile';
      }
      case CompareJobRangeModelChartSeries.CompareSalaryRangeQuartileFirst:
      case CompareJobRangeModelChartSeries.CompareSalaryRangeQuartileSecond:
      case CompareJobRangeModelChartSeries.CompareSalaryRangeQuartileThird:
      case CompareJobRangeModelChartSeries.CompareSalaryRangeQuartileFourth: {
        return currentRangeGroupName + ' Salary range Quartile';
      }
      case CompareJobRangeModelChartSeries.SalaryRangeQuintile: {
        return 'Salary range Quintile';
      }
      case CompareJobRangeModelChartSeries.CompareSalaryRangeQuintile: {
        return currentRangeGroupName + ' Salary range Quintile';
      }
      case CompareJobRangeModelChartSeries.RangeTertileFirst: {
        return 'Top 1st 3rd';
      }
      case CompareJobRangeModelChartSeries.CompareRangeTertileFirst: {
        return 'Top 1st 3rd';
      }
      case CompareJobRangeModelChartSeries.RangeTertileSecond: {
        return 'Top 2nd 3rd';
      }
      case CompareJobRangeModelChartSeries.CompareRangeTertileSecond: {
        return 'Top 2nd 3rd';
      }
      case CompareJobRangeModelChartSeries.RangeQuartileFirst: {
        return 'Top 1st 4th';
      }
      case CompareJobRangeModelChartSeries.CompareRangeQuartileFirst: {
        return 'Top 1st 4th';
      }
      case CompareJobRangeModelChartSeries.RangeQuartileSecond: {
        return 'Top 3rd 4th';
      }
      case CompareJobRangeModelChartSeries.CompareRangeQuartileSecond: {
        return 'Top 3rd 4th';
      }
      case CompareJobRangeModelChartSeries.RangeQuintileFirst: {
        return 'Top 1st 5th';
      }
      case CompareJobRangeModelChartSeries.CompareRangeQuintileFirst: {
        return 'Top 1st 5th';
      }
      case CompareJobRangeModelChartSeries.RangeQuintileSecond: {
        return 'Top 2nd 5th';
      }
      case CompareJobRangeModelChartSeries.CompareRangeQuintileSecond: {
        return 'Top 2nd 5th';
      }
      case CompareJobRangeModelChartSeries.RangeQuintileThird: {
        return 'Top 3rd 5th';
      }
      case CompareJobRangeModelChartSeries.CompareRangeQuintileThird: {
        return 'Top 3rd 5th';
      }
      case CompareJobRangeModelChartSeries.RangeQuintileFourth: {
        return 'Top 4th 5th';
      }
      case CompareJobRangeModelChartSeries.CompareRangeQuintileFourth: {
        return 'Top 4th 5th';
      }
      case CompareJobRangeModelChartSeries.SalaryRangeMinMidMaxHidden: {
        return '';
      }
      case CompareJobRangeModelChartSeries.CompareSalaryRangeMinMidMaxHidden: {
        return '';
      }
      case CompareJobRangeModelChartSeries.Peer50: {
        return 'Peer 50th';
      }
      case CompareJobRangeModelChartSeries.ComparePeer50: {
        return currentRangeGroupName + ' Peer 50th';
      }
      default: {
        return '';
      }
    }
  }

  static getMinMidMaxChartOptions(locale, currencyCode, controlPointDisplay, rate, rangeDistributionTypeId, currentRangeGroupName, hasAcceptedPeerTerms) {
    return {
      chart: {
        inverted: true,
        animation: false,
        title: 'Job Ranges',
        currency: currencyCode,
        locale: locale,
        style: {
          fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
          "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`
        },
        spacing: [ 10, 10, 0, 10 ]
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
        labels: {
          formatter: function () {
            return StructuresHighchartsService.formatYAxisLabel(this.value, locale, currencyCode, rate);
          }
        },
        opposite: true,
        gridLineWidth: 1,
        gridLineDashStyle: 'Dash',
        gridLineColor: '#bdbdbd',
        gridZIndex: 5,
        lineWidth: 0,
        tickPixelInterval: 200,
        title: {
          text: undefined
        },
        offset: 11
      },
      xAxis: {
        visible: false,
        maxPadding: 0,
        minPadding: 0,
      },
      plotOptions: {
        series: {
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.SalaryRangeMinMidMax),
          type: 'columnrange',
          animation: false,
          color: rangeDistributionTypeId !== RangeDistributionTypeIds.Quartile ? 'rgb(174,210,238)' : 'transparent',
          enableMouseTracking: false,
          borderRadius: 5,
          pointWidth: 21,
          stack: 0,
          stacking: 'normal',
          showInLegend: true
        },
        {
          name:  CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareSalaryRangeMinMidMax,
            null, currentRangeGroupName),
          type: 'columnrange',
          animation: false,
          color: rangeDistributionTypeId !== RangeDistributionTypeIds.Quartile ? 'rgb(169,169,169)' : 'transparent',
          enableMouseTracking: false,
          borderRadius: 5,
          pointWidth: 21,
          stack: 1,
          stacking: 'normal',
          showInLegend: true
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.RangeMid),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#CD8C01',
            radius: 10
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareRangeMid,
            null, currentRangeGroupName),
          type: 'scatter',
          linkedTo: ':previous',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#CD8C01',
            radius: 10
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black; color: white">',
            pointFormat: '<div><b>{point.jobTitle}</b></div><div>' +
              '<div>{point.dataPoint}</div>',
            footerFormat: '</div>'
          }
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.Average, controlPointDisplay),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#9370DB',
            radius: 10
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareAverage, controlPointDisplay,
            currentRangeGroupName),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#9370DB',
            radius: 10
          },
          linkedTo: ':previous',
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.EmployeeOutliers, controlPointDisplay),
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareEmployeeOutliers, controlPointDisplay,
            currentRangeGroupName),
          type: 'scatter',
          enableMouseTracking: true,
          marker: {
            enabled: true,
            // tslint:disable-next-line:max-line-length
            symbol: `url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTFweCIgaGVpZ2h0PSIxMXB4IiB2aWV3Qm94PSIwIDAgMTEgMTEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDY0ICg5MzUzNykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+bGFiZWwtZGFuZ2VyPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IldvcmtpbmciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJTdHJ1Y3R1cmVzLS0tR2VuZXJhbCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE0NDMuMDAwMDAwLCAtNjE5LjAwMDAwMCkiIGZpbGw9IiNEOTUzNEYiPgogICAgICAgICAgICA8ZyBpZD0ibGFiZWwtZGFuZ2VyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNDQzLjAwMDAwMCwgNjE5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHJlY3QgaWQ9IkJHIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTEiIGhlaWdodD0iMTEiIHJ4PSI1LjUiPjwvcmVjdD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+)`,
          },
          linkedTo: ':previous',
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.Peer50, controlPointDisplay),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#008000',
            radius: 10
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white; font-weight: bold">{point.jobTitle}</div>' +
              '<div style="color: white">Exchange Name: {point.ExchangeName}</div>' +
              '<div style="color: white">Scope: {point.Scope}</div>' +
              '<div style="color: white">{point.peer50}</div>',
            footerFormat: '</div>'
          },
          showInLegend: hasAcceptedPeerTerms
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.ComparePeer50, controlPointDisplay,
            currentRangeGroupName),
          type: 'scatter',
          linkedTo: ':previous',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#008000',
            radius: 10
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white; font-weight: bold">{point.jobTitle}</div>' +
              '<div style="color: white">Exchange Name: {point.ExchangeName}</div>' +
              '<div style="color: white">Scope: {point.Scope}</div>' +
              '<div style="color: white">{point.peer50}</div>',
            footerFormat: '</div>'
          },
          showInLegend: false
        },
      ]
    };
  }

  static getTertileChartOptions(locale, currencyCode, controlPointDisplay, rate, rangeDistributionTypeId, currentRangeGroupName, hasAcceptedPeerTerms) {
    return {
      chart: {
        inverted: true,
        animation: false,
        title: 'Job Ranges',
        currency: currencyCode,
        locale: locale,
        style: {
          fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
          "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`
        },
        spacing: [ 10, 10, 0, 10 ]
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
        labels: {
          formatter: function () {
            return StructuresHighchartsService.formatYAxisLabel(this.value, locale, currencyCode, rate);
          }
        },
        opposite: true,
        gridLineWidth: 1,
        gridLineDashStyle: 'Dash',
        gridLineColor: '#bdbdbd',
        gridZIndex: 5,
        lineWidth: 0,
        tickPixelInterval: 200,
        title: {
          text: undefined
        },
        offset: 11
      },
      xAxis: {
        visible: false,
        maxPadding: 0,
        minPadding: 0,
      },
      plotOptions: {
        series: {
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.SalaryRangeMinMidMax),
          type: 'columnrange',
          animation: false,
          color: rangeDistributionTypeId !== RangeDistributionTypeIds.Quartile ? 'rgb(174,210,238)' : 'transparent',
          enableMouseTracking: false,
          borderRadius: 5,
          pointWidth: 21,
          stack: 0,
          stacking: 'normal',
          showInLegend: false
        },
        {
          name:  CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareSalaryRangeMinMidMax,
            null, currentRangeGroupName),
          type: 'columnrange',
          animation: false,
          color: rangeDistributionTypeId !== RangeDistributionTypeIds.Quartile ? 'rgb(169,169,169)' : 'transparent',
          enableMouseTracking: false,
          borderRadius: 5,
          pointWidth: 21,
          stack: 1,
          stacking: 'normal',
          showInLegend: false
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.SalaryRangeMinMidMaxHidden),
          type: 'columnrange',
          animation: false,
          color: 'transparent',
          enableMouseTracking: false,
          pointWidth: 21,
          showInLegend: false,
          stack: 0,
          stacking: 'normal'
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareSalaryRangeMinMidMaxHidden, null,
            currentRangeGroupName),
          type: 'columnrange',
          animation: false,
          color: 'transparent',
          enableMouseTracking: false,
          pointWidth: 21,
          showInLegend: false,
          stack: 1,
          stacking: 'normal'
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.SalaryRangeTertile),
          type: 'columnrange',
          animation: false,
          color: 'rgb(210,230,246)',
          enableMouseTracking: false,
          borderRadius: 0,
          pointWidth: 21,
          stack: 0,
          stacking: 'normal',
          showInLegend: rangeDistributionTypeId === RangeDistributionTypeIds.Tertile
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareSalaryRangeTertile,
            null, currentRangeGroupName),
          type: 'columnrange',
          animation: false,
          color: 'rgb(211,211,211)',
          enableMouseTracking: false,
          borderRadius: 0,
          pointWidth: 21,
          stack: 1,
          stacking: 'normal',
          showInLegend: rangeDistributionTypeId === RangeDistributionTypeIds.Tertile
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.RangeMid),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#CD8C01',
            radius: 10
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareRangeMid, null, currentRangeGroupName),
          type: 'scatter',
          linkedTo: ':previous',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#CD8C01',
            radius: 10
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black; color: white">',
            pointFormat: '<div><b>{point.jobTitle}</b></div><div>' +
              '<div>{point.dataPoint}</div>',
            footerFormat: '</div>'
          }
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.RangeTertileFirst),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 10,
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareRangeTertileFirst),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 10,
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.RangeTertileSecond),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 10
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareRangeTertileSecond),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 10
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.Average, controlPointDisplay),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#9370DB',
            radius: 10
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareAverage, controlPointDisplay,
            currentRangeGroupName),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#9370DB',
            radius: 10
          },
          linkedTo: ':previous',
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.EmployeeOutliers, controlPointDisplay),
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareEmployeeOutliers, controlPointDisplay,
            currentRangeGroupName),
          type: 'scatter',
          enableMouseTracking: true,
          marker: {
            enabled: true,
            // tslint:disable-next-line:max-line-length
            symbol: `url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTFweCIgaGVpZ2h0PSIxMXB4IiB2aWV3Qm94PSIwIDAgMTEgMTEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDY0ICg5MzUzNykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+bGFiZWwtZGFuZ2VyPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IldvcmtpbmciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJTdHJ1Y3R1cmVzLS0tR2VuZXJhbCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE0NDMuMDAwMDAwLCAtNjE5LjAwMDAwMCkiIGZpbGw9IiNEOTUzNEYiPgogICAgICAgICAgICA8ZyBpZD0ibGFiZWwtZGFuZ2VyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNDQzLjAwMDAwMCwgNjE5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHJlY3QgaWQ9IkJHIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTEiIGhlaWdodD0iMTEiIHJ4PSI1LjUiPjwvcmVjdD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+)`,
          },
          linkedTo: ':previous',
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: red">Employees out of Range</div>' +
              '<div style="color: white">{point.countString}<br />{point.avgSalary}</div>' +
              '<div style="color: white">{point.delta}</div>',
            footerFormat: '</div>'
          },
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.Peer50, controlPointDisplay),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#008000',
            radius: 10
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white; font-weight: bold">{point.jobTitle}</div>' +
              '<div style="color: white">Exchange Name: {point.ExchangeName}</div>' +
              '<div style="color: white">Scope: {point.Scope}</div>' +
              '<div style="color: white">{point.peer50}</div>',
            footerFormat: '</div>'
          },
          showInLegend: hasAcceptedPeerTerms
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.ComparePeer50, controlPointDisplay,
            currentRangeGroupName),
          type: 'scatter',
          linkedTo: ':previous',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#008000',
            radius: 10
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white; font-weight: bold">{point.jobTitle}</div>' +
              '<div style="color: white">Exchange Name: {point.ExchangeName}</div>' +
              '<div style="color: white">Scope: {point.Scope}</div>' +
              '<div style="color: white">{point.peer50}</div>',
            footerFormat: '</div>'
          },
          showInLegend: false
        },
      ]
    };
  }

  static  getQuartileChartOptions(locale, currencyCode, controlPointDisplay, rate, rangeDistributionTypeId, currentRangeGroupName, hasAcceptedPeerTerms) {
    return {
      chart: {
        inverted: true,
        animation: false,
        title: 'Job Ranges',
        currency: currencyCode,
        locale: locale,
        style: {
          fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
          "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`
        },
        spacing: [ 10, 10, 0, 10 ]
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
        labels: {
          formatter: function () {
            return StructuresHighchartsService.formatYAxisLabel(this.value, locale, currencyCode, rate);
          }
        },
        opposite: true,
        gridLineWidth: 1,
        gridLineDashStyle: 'Dash',
        gridLineColor: '#bdbdbd',
        gridZIndex: 5,
        lineWidth: 0,
        tickPixelInterval: 200,
        title: {
          text: undefined
        },
        offset: 11
      },
      xAxis: {
        visible: false,
        maxPadding: 0,
        minPadding: 0,
      },
      plotOptions: {
        series: {
          events: {
            legendItemClick: function (event) {
              if (event.target.userOptions.name === CompareJobRangeModelChartService.getFormattedSeriesName(
                CompareJobRangeModelChartSeries.SalaryRangeQuartileFirst)) {
                if (event.target.chart.yAxis[ 0 ].series[ CompareQuartileJobRangeModelChartSeries.SalaryRangeQuartileFirst ].visible) {
                  event.target.chart.yAxis[ 0 ].series[ CompareQuartileJobRangeModelChartSeries.SalaryRangeQuartileFirst ].hide();
                  event.target.chart.yAxis[ 0 ].series[ CompareQuartileJobRangeModelChartSeries.CompareSalaryRangeQuartileFirst ].hide();
                  event.target.chart.yAxis[ 0 ].series[ CompareQuartileJobRangeModelChartSeries.SalaryRangeQuartileSecond ].hide();
                  event.target.chart.yAxis[ 0 ].series[ CompareQuartileJobRangeModelChartSeries.CompareSalaryRangeQuartileSecond ].hide();
                  event.target.chart.yAxis[ 0 ].series[ CompareQuartileJobRangeModelChartSeries.SalaryRangeQuartileThird ].hide();
                  event.target.chart.yAxis[ 0 ].series[ CompareQuartileJobRangeModelChartSeries.CompareSalaryRangeQuartileThird ].hide();
                  event.target.chart.yAxis[ 0 ].series[ CompareQuartileJobRangeModelChartSeries.SalaryRangeQuartileFourth ].hide();
                  event.target.chart.yAxis[ 0 ].series[ CompareQuartileJobRangeModelChartSeries.CompareSalaryRangeQuartileFourth ].hide();
                } else {
                  event.target.chart.yAxis[ 0 ].series[ CompareQuartileJobRangeModelChartSeries.SalaryRangeQuartileFirst ].show();
                  event.target.chart.yAxis[ 0 ].series[ CompareQuartileJobRangeModelChartSeries.CompareSalaryRangeQuartileFirst ].show();
                  event.target.chart.yAxis[ 0 ].series[ CompareQuartileJobRangeModelChartSeries.SalaryRangeQuartileSecond ].show();
                  event.target.chart.yAxis[ 0 ].series[ CompareQuartileJobRangeModelChartSeries.CompareSalaryRangeQuartileSecond ].show();
                  event.target.chart.yAxis[ 0 ].series[ CompareQuartileJobRangeModelChartSeries.SalaryRangeQuartileThird ].show();
                  event.target.chart.yAxis[ 0 ].series[ CompareQuartileJobRangeModelChartSeries.CompareSalaryRangeQuartileThird ].show();
                  event.target.chart.yAxis[ 0 ].series[ CompareQuartileJobRangeModelChartSeries.SalaryRangeQuartileFourth ].show();
                  event.target.chart.yAxis[ 0 ].series[ CompareQuartileJobRangeModelChartSeries.CompareSalaryRangeQuartileFourth ].show();
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.SalaryRangeMinMidMax),
          type: 'columnrange',
          animation: false,
          color: rangeDistributionTypeId !== RangeDistributionTypeIds.Quartile ? 'rgb(174,210,238)' : 'transparent',
          enableMouseTracking: false,
          borderRadius: 5,
          pointWidth: 21,
          stack: 0,
          stacking: 'normal',
          showInLegend: false
        },
        {
          name:  CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareSalaryRangeMinMidMax,
            null, currentRangeGroupName),
          type: 'columnrange',
          animation: false,
          color: rangeDistributionTypeId !== RangeDistributionTypeIds.Quartile ? 'rgb(169,169,169)' : 'transparent',
          enableMouseTracking: false,
          borderRadius: 5,
          pointWidth: 21,
          stack: 1,
          stacking: 'normal',
          showInLegend: false
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.SalaryRangeMinMidMaxHidden),
          type: 'columnrange',
          animation: false,
          color: 'transparent',
          enableMouseTracking: false,
          pointWidth: 21,
          showInLegend: false,
          stack: 0,
          stacking: 'normal'
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareSalaryRangeMinMidMaxHidden,
            null, currentRangeGroupName),
          type: 'columnrange',
          animation: false,
          color: 'transparent',
          enableMouseTracking: false,
          pointWidth: 21,
          showInLegend: false,
          stack: 1,
          stacking: 'normal'
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.SalaryRangeQuartileFirst),
          type: 'columnrange',
          animation: false,
          color: 'rgb(174,210,238)',
          enableMouseTracking: false,
          pointWidth: 21,
          borderRadiusBottomRight: 5,
          borderRadiusBottomLeft: 5,
          stack: 0,
          stacking: 'normal',
          showInLegend: rangeDistributionTypeId === RangeDistributionTypeIds.Quartile
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareSalaryRangeQuartileFirst,
            null, currentRangeGroupName),
          type: 'columnrange',
          animation: false,
          color: 'rgb(169,169,169)',
          enableMouseTracking: false,
          pointWidth: 21,
          borderRadiusBottomRight: 5,
          borderRadiusBottomLeft: 5,
          stack: 1,
          stacking: 'normal',
          showInLegend: rangeDistributionTypeId === RangeDistributionTypeIds.Quartile
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.SalaryRangeQuartileSecond),
          type: 'columnrange',
          animation: false,
          color: 'rgb(210,230,246)',
          enableMouseTracking: false,
          pointWidth: 21,
          stack: 0,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: false
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareSalaryRangeQuartileSecond, null,
            currentRangeGroupName),
          type: 'columnrange',
          animation: false,
          color: 'rgb(211,211,211)',
          enableMouseTracking: false,
          pointWidth: 21,
          stack: 1,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: false
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.SalaryRangeQuartileThird),
          type: 'columnrange',
          animation: false,
          color: 'rgb(174,210,238)',
          enableMouseTracking: false,
          pointWidth: 21,
          stack: 0,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: false
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareSalaryRangeQuartileThird,
            null, currentRangeGroupName),
          type: 'columnrange',
          animation: false,
          color: 'rgb(169,169,169)',
          enableMouseTracking: false,
          pointWidth: 21,
          stack: 1,
          stacking: 'normal',
          borderRadius: 0,
          showInLegend: false
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.SalaryRangeQuartileFourth),
          type: 'columnrange',
          animation: false,
          color: 'rgb(210,230,246)',
          enableMouseTracking: false,
          pointWidth: 21,
          stack: 0,
          stacking: 'normal',
          borderRadiusTopRight: 5,
          borderRadiusTopLeft: 5,
          showInLegend: false
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareSalaryRangeQuartileFourth,
            null, currentRangeGroupName),
          type: 'columnrange',
          animation: false,
          color: 'rgb(211,211,211)',
          enableMouseTracking: false,
          pointWidth: 21,
          stack: 1,
          stacking: 'normal',
          borderRadiusTopRight: 5,
          borderRadiusTopLeft: 5,
          showInLegend: false
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.RangeMid),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#CD8C01',
            radius: 10
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareRangeMid, null, currentRangeGroupName),
          type: 'scatter',
          linkedTo: ':previous',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#CD8C01',
            radius: 10
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black; color: white">',
            pointFormat: '<div><b>{point.jobTitle}</b></div><div>' +
              '<div>{point.dataPoint}</div>',
            footerFormat: '</div>'
          }
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.Average, controlPointDisplay),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#9370DB',
            radius: 10
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareAverage, controlPointDisplay,
            currentRangeGroupName),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#9370DB',
            radius: 10
          },
          linkedTo: ':previous',
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.EmployeeOutliers, controlPointDisplay),
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareEmployeeOutliers, controlPointDisplay,
            currentRangeGroupName),
          type: 'scatter',
          enableMouseTracking: true,
          marker: {
            enabled: true,
            // tslint:disable-next-line:max-line-length
            symbol: `url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTFweCIgaGVpZ2h0PSIxMXB4IiB2aWV3Qm94PSIwIDAgMTEgMTEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDY0ICg5MzUzNykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+bGFiZWwtZGFuZ2VyPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IldvcmtpbmciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJTdHJ1Y3R1cmVzLS0tR2VuZXJhbCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE0NDMuMDAwMDAwLCAtNjE5LjAwMDAwMCkiIGZpbGw9IiNEOTUzNEYiPgogICAgICAgICAgICA8ZyBpZD0ibGFiZWwtZGFuZ2VyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNDQzLjAwMDAwMCwgNjE5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHJlY3QgaWQ9IkJHIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTEiIGhlaWdodD0iMTEiIHJ4PSI1LjUiPjwvcmVjdD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+)`,
          },
          linkedTo: ':previous',
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.RangeQuartileFirst),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 10
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareRangeQuartileFirst),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 10
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.RangeQuartileSecond),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 10
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareRangeQuartileSecond),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 10
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.Peer50, controlPointDisplay),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#008000',
            radius: 10
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white; font-weight: bold">{point.jobTitle}</div>' +
              '<div style="color: white">Exchange Name: {point.ExchangeName}</div>' +
              '<div style="color: white">Scope: {point.Scope}</div>' +
              '<div style="color: white">{point.peer50}</div>',
            footerFormat: '</div>'
          },
          showInLegend: hasAcceptedPeerTerms
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.ComparePeer50, controlPointDisplay,
            currentRangeGroupName),
          type: 'scatter',
          linkedTo: ':previous',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#008000',
            radius: 10
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white; font-weight: bold">{point.jobTitle}</div>' +
              '<div style="color: white">Exchange Name: {point.ExchangeName}</div>' +
              '<div style="color: white">Scope: {point.Scope}</div>' +
              '<div style="color: white">{point.peer50}</div>',
            footerFormat: '</div>'
          },
          showInLegend: false
        },
      ]
    };
  }

  static getQuintileChartOptions(locale, currencyCode, controlPointDisplay, rate, rangeDistributionTypeId, currentRangeGroupName, hasAcceptedPeerTerms) {
    return {
      chart: {
        inverted: true,
        animation: false,
        title: 'Job Ranges',
        currency: currencyCode,
        locale: locale,
        style: {
          fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
          "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`
        },
        spacing: [ 10, 10, 0, 10 ]
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
        labels: {
          formatter: function () {
            return StructuresHighchartsService.formatYAxisLabel(this.value, locale, currencyCode, rate);
          }
        },
        opposite: true,
        gridLineWidth: 1,
        gridLineDashStyle: 'Dash',
        gridLineColor: '#bdbdbd',
        gridZIndex: 5,
        lineWidth: 0,
        tickPixelInterval: 200,
        title: {
          text: undefined
        },
        offset: 11
      },
      xAxis: {
        visible: false,
        maxPadding: 0,
        minPadding: 0,
      },
      plotOptions: {
        series: {
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.SalaryRangeMinMidMax),
          type: 'columnrange',
          animation: false,
          color: rangeDistributionTypeId !== RangeDistributionTypeIds.Quartile ? 'rgb(174,210,238)' : 'transparent',
          enableMouseTracking: false,
          borderRadius: 5,
          pointWidth: 21,
          stack: 0,
          stacking: 'normal',
          showInLegend: false
        },
        {
          name:  CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareSalaryRangeMinMidMax,
            null, currentRangeGroupName),
          type: 'columnrange',
          animation: false,
          color: rangeDistributionTypeId !== RangeDistributionTypeIds.Quartile ? 'rgb(169,169,169)' : 'transparent',
          enableMouseTracking: false,
          borderRadius: 5,
          pointWidth: 21,
          stack: 1,
          stacking: 'normal',
          showInLegend: false
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.SalaryRangeMinMidMaxHidden),
          type: 'columnrange',
          animation: false,
          color: 'transparent',
          enableMouseTracking: false,
          pointWidth: 21,
          showInLegend: false,
          stack: 0,
          stacking: 'normal'
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareSalaryRangeMinMidMaxHidden,
            null, currentRangeGroupName),
          type: 'columnrange',
          animation: false,
          color: 'transparent',
          enableMouseTracking: false,
          pointWidth: 21,
          showInLegend: false,
          stack: 1,
          stacking: 'normal'
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.SalaryRangeQuintile),
          type: 'columnrange',
          animation: false,
          color: 'rgb(210,230,246)',
          enableMouseTracking: false,
          borderRadius: 0,
          pointWidth: 21,
          stack: 0,
          stacking: 'normal',
          showInLegend: rangeDistributionTypeId === RangeDistributionTypeIds.Quintile
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareSalaryRangeQuintile, null,
            currentRangeGroupName),
          type: 'columnrange',
          animation: false,
          color: 'rgb(211,211,211)',
          enableMouseTracking: false,
          borderRadius: 0,
          pointWidth: 21,
          stack: 1,
          stacking: 'normal',
          showInLegend: rangeDistributionTypeId === RangeDistributionTypeIds.Quintile
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.RangeMid),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#CD8C01',
            radius: 10
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareRangeMid, null, currentRangeGroupName),
          type: 'scatter',
          linkedTo: ':previous',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#CD8C01',
            radius: 10
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black; color: white">',
            pointFormat: '<div><b>{point.jobTitle}</b></div><div>' +
              '<div>{point.dataPoint}</div>',
            footerFormat: '</div>'
          }
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.Average, controlPointDisplay),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#9370DB',
            radius: 10
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareAverage, controlPointDisplay,
            currentRangeGroupName),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#9370DB',
            radius: 10
          },
          linkedTo: ':previous',
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.EmployeeOutliers, controlPointDisplay),
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareEmployeeOutliers, controlPointDisplay,
            currentRangeGroupName),
          type: 'scatter',
          enableMouseTracking: true,
          marker: {
            enabled: true,
            // tslint:disable-next-line:max-line-length
            symbol: `url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTFweCIgaGVpZ2h0PSIxMXB4IiB2aWV3Qm94PSIwIDAgMTEgMTEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDY0ICg5MzUzNykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+bGFiZWwtZGFuZ2VyPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IldvcmtpbmciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJTdHJ1Y3R1cmVzLS0tR2VuZXJhbCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE0NDMuMDAwMDAwLCAtNjE5LjAwMDAwMCkiIGZpbGw9IiNEOTUzNEYiPgogICAgICAgICAgICA8ZyBpZD0ibGFiZWwtZGFuZ2VyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNDQzLjAwMDAwMCwgNjE5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHJlY3QgaWQ9IkJHIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTEiIGhlaWdodD0iMTEiIHJ4PSI1LjUiPjwvcmVjdD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+)`,
          },
          linkedTo: ':previous',
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.RangeQuintileFirst),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 10
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareRangeQuintileFirst),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 10
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.RangeQuintileSecond),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 10
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareRangeQuintileSecond),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 10
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.RangeQuintileThird),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 10
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareRangeQuintileThird),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 10
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.RangeQuintileFourth),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 10
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.CompareRangeQuintileFourth),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: 'transparent',
            radius: 10
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
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.Peer50, controlPointDisplay),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#008000',
            radius: 10
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white; font-weight: bold">{point.jobTitle}</div>' +
              '<div style="color: white">Exchange Name: {point.ExchangeName}</div>' +
              '<div style="color: white">Scope: {point.Scope}</div>' +
              '<div style="color: white">{point.peer50}</div>',
            footerFormat: '</div>'
          },
          showInLegend: hasAcceptedPeerTerms
        },
        {
          name: CompareJobRangeModelChartService.getFormattedSeriesName(CompareJobRangeModelChartSeries.ComparePeer50, controlPointDisplay,
            currentRangeGroupName),
          type: 'scatter',
          linkedTo: ':previous',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#008000',
            radius: 10
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white; font-weight: bold">{point.jobTitle}</div>' +
              '<div style="color: white">Exchange Name: {point.ExchangeName}</div>' +
              '<div style="color: white">Scope: {point.Scope}</div>' +
              '<div style="color: white">{point.peer50}</div>',
            footerFormat: '</div>'
          },
          showInLegend: false
        },
      ]
    };
  }

}


