import { StructuresHighchartsService } from '../../shared/services';
import { JobRangeModelChartSeries } from './job-range-model-chart-series-constants';
import { RangeDistributionTypeIds } from '../../shared/constants/range-distribution-type-ids';

export class JobRangeModelChartService {

  static getFormattedSeriesName(series: JobRangeModelChartSeries, controlPointDisplay: string = '') {
    switch (series) {
      case JobRangeModelChartSeries.SalaryRangeMinMidMax: {
        return 'Salary range';
      }
      case JobRangeModelChartSeries.SalaryRangeTertile: {
        return 'Salary range Tertile';
      }
      case JobRangeModelChartSeries.SalaryRangeQuartileFirst:
      case JobRangeModelChartSeries.SalaryRangeQuartileSecond:
      case JobRangeModelChartSeries.SalaryRangeQuartileThird:
      case JobRangeModelChartSeries.SalaryRangeQuartileFourth: {
        return 'Salary range Quartile';
      }
      case JobRangeModelChartSeries.SalaryRangeQuintile: {
        return 'Salary range Quintile';
      }
      case JobRangeModelChartSeries.RangeMid: {
        return 'Range Mid';
      }
      case JobRangeModelChartSeries.RangeTertileFirst: {
        return 'Top 1st 3rd';
      }
      case JobRangeModelChartSeries.RangeTertileSecond: {
        return 'Top 2nd 3rd';
      }
      case JobRangeModelChartSeries.RangeQuartileFirst: {
        return 'Top 1st 4th';
      }
      case JobRangeModelChartSeries.RangeQuartileSecond: {
        return 'Top 3rd 4th';
      }
      case JobRangeModelChartSeries.RangeQuintileFirst: {
        return 'Top 1st 5th';
      }
      case JobRangeModelChartSeries.RangeQuintileSecond: {
        return 'Top 2nd 5th';
      }
      case JobRangeModelChartSeries.RangeQuintileThird: {
        return 'Top 3rd 5th';
      }
      case JobRangeModelChartSeries.RangeQuintileFourth: {
        return 'Top 4th 5th';
      }
      case JobRangeModelChartSeries.Average: {
        return 'Average ' + controlPointDisplay;
      }
      case JobRangeModelChartSeries.EmployeeOutliers: {
        return 'Outlier ' + controlPointDisplay;
      }
      case JobRangeModelChartSeries.MRP: {
        return 'MRP';
      }
      case JobRangeModelChartSeries.Peer50: {
        return 'Peer 50th';
      }
      default: {
        // should never happen, but in case someone adds a value later and forgets.
        return '';
      }

    }
  }

  static getRangeOptions(locale, currencyCode, controlPointDisplay, rate, rangeDistributionTypeId, hasPeerSetting) {
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
        offset: 22
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
              if (event.target.userOptions.name === JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.SalaryRangeQuartileFirst)) {
                if (event.target.chart.yAxis[0].series[JobRangeModelChartSeries.SalaryRangeQuartileFirst].visible) {
                  event.target.chart.yAxis[0].series[JobRangeModelChartSeries.SalaryRangeQuartileFirst].hide();
                  event.target.chart.yAxis[0].series[JobRangeModelChartSeries.SalaryRangeQuartileSecond].hide();
                  event.target.chart.yAxis[0].series[JobRangeModelChartSeries.SalaryRangeQuartileThird].hide();
                  event.target.chart.yAxis[0].series[JobRangeModelChartSeries.SalaryRangeQuartileFourth].hide();
                } else {
                  event.target.chart.yAxis[0].series[JobRangeModelChartSeries.SalaryRangeQuartileFirst].show();
                  event.target.chart.yAxis[0].series[JobRangeModelChartSeries.SalaryRangeQuartileSecond].show();
                  event.target.chart.yAxis[0].series[JobRangeModelChartSeries.SalaryRangeQuartileThird].show();
                  event.target.chart.yAxis[0].series[JobRangeModelChartSeries.SalaryRangeQuartileFourth].show();
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
          name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.SalaryRangeMinMidMax),
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
          name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.SalaryRangeMinMidMaxHidden),
          type: 'columnrange',
          animation: false,
          color: 'transparent',
          enableMouseTracking: false,
          pointWidth: 42,
          showInLegend: false,
          stacking: 'normal'
        },
        {
          name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.SalaryRangeTertile),
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
          name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.SalaryRangeQuintile),
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
          name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.SalaryRangeQuartileFirst),
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
          name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.SalaryRangeQuartileSecond),
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
          name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.SalaryRangeQuartileThird),
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
          name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.SalaryRangeQuartileFourth),
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
          name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.RangeMid),
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
            pointFormat: '<div><b>{point.jobTitle}</b></div><div>' +
              '<div>{point.dataPoint}</div>' +
              '<div>{point.currentDataPoint}</div>' +
              '<div>{point.newDataPoint}</div>' +
              '<div><span style="font-size: 25px; color: {point.iconColor};">{point.icon}</span>{point.delta}</div>',
            footerFormat: '</div>'
          }
        },
        {
          name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.RangeTertileFirst),
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
          name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.RangeTertileSecond),
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
          name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.RangeQuartileFirst),
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
          name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.RangeQuartileSecond),
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
          name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.RangeQuintileFirst),
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
          name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.RangeQuintileSecond),
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
          name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.RangeQuintileThird),
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
          name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.RangeQuintileFourth),
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
          name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.Average, controlPointDisplay),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#9370DB',
            radius: 20
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
          name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.EmployeeOutliers, controlPointDisplay),
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
          name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.MRP, controlPointDisplay),
          type: 'scatter',
          enableMouseTracking: true,
          color: '#0000FF',
          pointWidth: 42,
          marker: {
            radius: 6,
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
        },
        {
          name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.Peer50, controlPointDisplay),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#008000',
            radius: 20
          },
          enableMouseTracking: true,
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white; font-weight: bold">Exchange Job Title: {point.exchangeJobTitle}</div>' +
              '<div style="color: white">Exchange Name: {point.ExchangeName}</div>' +
              '<div style="color: white">Scope: {point.Scope}</div>' +
              '<div style="color: white">{point.peer50}</div>',
            footerFormat: '</div>'
          },
          showInLegend: hasPeerSetting
        },
      ]
    };
  }
}
