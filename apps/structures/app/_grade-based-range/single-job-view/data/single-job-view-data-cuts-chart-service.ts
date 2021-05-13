import { RangeDistributionTypeIds } from 'libs/constants/structures/range-distribution-type-ids';

import { SingleJobViewDataCutsChartSeries } from './single-job-view-data-cuts-chart-series-constants';


export class SingleJobViewDataCutsChartService {

  static getFormattedSeriesName(series: SingleJobViewDataCutsChartSeries, controlPointDisplay: string = '') {
    switch (series) {
      case SingleJobViewDataCutsChartSeries.SalaryRangeMinMidMax: {
        return 'Salary range';
      }
      case SingleJobViewDataCutsChartSeries.SalaryRangeTertile: {
        return 'Salary range Tertile';
      }
      case SingleJobViewDataCutsChartSeries.SalaryRangeQuartileFirst:
      case SingleJobViewDataCutsChartSeries.SalaryRangeQuartileSecond:
      case SingleJobViewDataCutsChartSeries.SalaryRangeQuartileThird:
      case SingleJobViewDataCutsChartSeries.SalaryRangeQuartileFourth: {
        return 'Salary range Quartile';
      }
      case SingleJobViewDataCutsChartSeries.SalaryRangeQuintile: {
        return 'Salary range Quintile';
      }
      case SingleJobViewDataCutsChartSeries.RangeMid: {
        return 'Range Mid';
      }
      case SingleJobViewDataCutsChartSeries.JobMRP: {
        return 'Job MRP';
      }
      case SingleJobViewDataCutsChartSeries.DataCutMRP: {
        return 'Data Cut MRP';
      }
      default: {
        // should never happen, but in case someone adds a value later and forgets.
        return '';
      }
    }
  }

  static getSingleJobViewDataCutChartOptions(locale, currencyCode, controlPointDisplay, rangeDistributionTypeId, multiRowHeader) {
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
        offset: multiRowHeader ? 60 : 15
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
                SingleJobViewDataCutsChartService.getFormattedSeriesName(SingleJobViewDataCutsChartSeries.SalaryRangeQuartileFirst)) {
                if (event.target.chart.yAxis[0].series[SingleJobViewDataCutsChartSeries.SalaryRangeQuartileFirst].visible) {
                  event.target.chart.yAxis[0].series[SingleJobViewDataCutsChartSeries.SalaryRangeQuartileFirst].hide();
                  event.target.chart.yAxis[0].series[SingleJobViewDataCutsChartSeries.SalaryRangeQuartileSecond].hide();
                  event.target.chart.yAxis[0].series[SingleJobViewDataCutsChartSeries.SalaryRangeQuartileThird].hide();
                  event.target.chart.yAxis[0].series[SingleJobViewDataCutsChartSeries.SalaryRangeQuartileFourth].hide();
                } else {
                  event.target.chart.yAxis[0].series[SingleJobViewDataCutsChartSeries.SalaryRangeQuartileFirst].show();
                  event.target.chart.yAxis[0].series[SingleJobViewDataCutsChartSeries.SalaryRangeQuartileSecond].show();
                  event.target.chart.yAxis[0].series[SingleJobViewDataCutsChartSeries.SalaryRangeQuartileThird].show();
                  event.target.chart.yAxis[0].series[SingleJobViewDataCutsChartSeries.SalaryRangeQuartileFourth].show();
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
          name: SingleJobViewDataCutsChartService.getFormattedSeriesName(SingleJobViewDataCutsChartSeries.SalaryRangeMinMidMax),
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
          name: SingleJobViewDataCutsChartService.getFormattedSeriesName(SingleJobViewDataCutsChartSeries.SalaryRangeTertile),
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
          name: SingleJobViewDataCutsChartService.getFormattedSeriesName(SingleJobViewDataCutsChartSeries.SalaryRangeQuintile),
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
          name: SingleJobViewDataCutsChartService.getFormattedSeriesName(SingleJobViewDataCutsChartSeries.SalaryRangeQuartileFirst),
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
          name: SingleJobViewDataCutsChartService.getFormattedSeriesName(SingleJobViewDataCutsChartSeries.SalaryRangeQuartileSecond),
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
          name: SingleJobViewDataCutsChartService.getFormattedSeriesName(SingleJobViewDataCutsChartSeries.SalaryRangeQuartileThird),
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
          name: SingleJobViewDataCutsChartService.getFormattedSeriesName(SingleJobViewDataCutsChartSeries.SalaryRangeQuartileFourth),
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
          name: SingleJobViewDataCutsChartService.getFormattedSeriesName(SingleJobViewDataCutsChartSeries.RangeMid),
          type: 'scatter',
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#CD8C01',
            radius: 29,
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
          name: SingleJobViewDataCutsChartService.getFormattedSeriesName(SingleJobViewDataCutsChartSeries.JobMRP, controlPointDisplay),
          type: 'scatter',
          enableMouseTracking: true,
          pointWidth: 42,
          marker: {
            symbol: 'vline',
            lineWidth: 2,
            lineColor: '#000000',
            radius: 29,
          },
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            stickyTracking: false,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white; font-weight: bold">{point.jobTitle}</div>' +
              '<div style="color: white">{point.mrp}<div>',
            footerFormat: '</div>'
          },
          cursor: 'pointer',
        },
        {
          name: SingleJobViewDataCutsChartService.getFormattedSeriesName(SingleJobViewDataCutsChartSeries.DataCutMRP, controlPointDisplay),
          type: 'scatter',
          enableMouseTracking: true,
          pointWidth: 42,
          marker: {
            symbol: 'circle',
            radius: 5.5,
            fillColor: '#000080',
            lineColor: '#000080'
          },
          tooltip: {
            backgroundColor: '#000000',
            useHTML: true,
            padding: 0,
            stickyTracking: false,
            headerFormat: '<div style="display: inline-block; background-color: black">',
            pointFormat: '<div style="color: white; font-weight: bold">{point.source}</div>' +
              '<div style="color: white">{point.sourceTitle} - {point.effectiveDate}</div>' +
              '<div style="color: white">{point.mrp}<div>',
            footerFormat: '</div>'
          },
          cursor: 'pointer',
        },

      ]
    };

  }
}
