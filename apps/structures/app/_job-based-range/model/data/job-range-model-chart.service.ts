import {StructuresHighchartsService} from '../../shared/services';
import { JobRangeModelChartSeries } from './job-range-model-chart-series-constants';

export class JobRangeModelChartService {

  static getFormattedSeriesName(series: JobRangeModelChartSeries, controlPointDisplay: string = '') {
    switch (series) {
      case JobRangeModelChartSeries.SalaryRange: {
        return 'Salary range';
      }
      case JobRangeModelChartSeries.RangeMid: {
        return 'Range Mid';
      }
      case JobRangeModelChartSeries.Average: {
        return 'Average ' + controlPointDisplay;
      }
      case JobRangeModelChartSeries.EmployeeOutliers: {
        return 'Outlier ' + controlPointDisplay;
      }
      default: {
        // should never happen, but in case someone adds a value later and forgets.
        return '';
      }

    }
  }

  static getRangeOptions(locale, currencyCode, controlPointDisplay, rate) {
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
        labels: {
          formatter: function() {
            return StructuresHighchartsService.formatYAxisLabel(this.value, locale, currencyCode, rate);
          }
        },
        opposite: true,
        gridLineWidth: 1,
        gridLineDashStyle: 'Dash',
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
        columnrange: {
          borderRadius: 5
        },
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
      series: [{
        name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.SalaryRange),
        type: 'columnrange',
        animation: false,
        color: 'rgba(36,134,210,0.45)',
        enableMouseTracking: false,
        pointWidth: 42
      }, {
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
            '<div>{point.midPoint}</div>' +
            '<div>{point.currentMidPoint}</div>' +
            '<div>{point.newMidPoint}</div>' +
            '<div><span style="font-size:25px; color:{point.iconColor};">{point.icon}</span>{point.delta}</div>',
          footerFormat: '</div>'
        }
      }, {
        name: JobRangeModelChartService.getFormattedSeriesName(JobRangeModelChartSeries.Average, controlPointDisplay),
        type: 'scatter',
        marker: {
          symbol: 'vline',
          lineWidth: 2,
          lineColor: '#6236FF',
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
      }, {
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
      }]
    };
  }
}
