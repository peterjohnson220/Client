import * as Highcharts from 'highcharts';

export class StructuresHighchartsService {

  static initializeHighcharts() {
    require('highcharts/highcharts-more')(Highcharts);

    // this is the basic line symbol that is currently used to allow a scatter plot to use lines instead of dots.
    Highcharts.SVGRenderer.prototype.symbols.vline =
      function(x, y, width, height) {
        return ['M', x, y + width / 2, 'L', x + height, y + width / 2];
      };
  }

  static getRangeOptions(locale, currencyCode, controlPointDisplay) {
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
        floating: true,
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
            const formatter = new Intl.NumberFormat(this.chart.userOptions.chart.locale, {
              style: 'currency',
              currency: this.chart.userOptions.chart.currency,
              minimumFractionDigits: 0,
              useGrouping: false
            });

            const rawLabelValue = this.value / 1000;
            return formatter.format(rawLabelValue) + 'k';
          }
        },
        opposite: true,
        gridLineWidth: 1,
        gridLineDashStyle: 'Dash',
        lineWidth: 0,
        tickPixelInterval: 200,
        title: {
          text: undefined
        }
      },
      xAxis: {
        visible: false
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
        name: 'Salary range',
        type: 'columnrange',
        animation: false,
        color: 'rgba(36,134,210,0.45)',
        enableMouseTracking: false
      }, {
        name: 'Mid-point',
        type: 'scatter',
        marker: {
          symbol: 'vline',
          lineWidth: 2,
          lineColor: '#CD8C01',
          radius: 20
        },
        enableMouseTracking: false
      }, {
        name: 'Average ' + controlPointDisplay ,
        type: 'scatter',
        marker: {
          symbol: 'vline',
          lineWidth: 2,
          lineColor: '#6236FF',
          radius: 20
        },
        enableMouseTracking: false
      }, {
        name: 'Outlier ' + controlPointDisplay,
        type: 'scatter',
        dataLabels: {
          useHTML: true,
          enabled: true,
          formatter: function () {
            const fontSize = this.point.count > 99 ? 65 : 90;
            return `<span style="color: #fff; font-size: ${fontSize}%;">${this.point.count}</div>`;
          },
          defer: false,
          x: -0.75,
          y: 11.5
        },
        enableMouseTracking: true,
        marker: {
          enabled: true,
          // tslint:disable-next-line:max-line-length
          symbol: `url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxN3B4IiB2aWV3Qm94PSIwIDAgMTYgMTciIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYxICg4OTU4MSkgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+QmFzZTU8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iV29ya2luZyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IkVtcGxveWVlLVZpZXciIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMjQ1LjAwMDAwMCwgLTY3MC4wMDAwMDApIiBmaWxsPSIjRDk1MzRGIj4KICAgICAgICAgICAgPGcgaWQ9IkxlZ2VuZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTI0NS4wMDAwMDAsIDQwMC40MTQwNjIpIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJCYXNlLWlDT05TIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgMjMuMzg4NjcyKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IkJhc2U1IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgMjQ2Ljk4NDM3NSkiPgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTYiIGhlaWdodD0iMTUuODQ5MjY0NyIgcng9IjUiPjwvcmVjdD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==)`,
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

  static getEmployeeRangeOptions(locale, currencyCode, controlPointDisplay) {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      useGrouping: false
    });
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
        floating: true,
        y: 30,
        borderWidth: 1
      },
      tooltip: {
        useHTML: true,
        backgroundColor: '#282625',
        borderColor: '#000000',
        className: 'empToolTip',
        formatter: function() {
          return '<span style="color: white;"><b>' + this.point.name + '</b><br/>' + controlPointDisplay + ': <b>' +
            formatter.format(this.y) + '</b></span>';
        }
      },
      yAxis: {
        labels: {
          formatter: function() {
            const rawLabelValue = this.value / 1000;
            return formatter.format(rawLabelValue) + 'k';
          }
        },
        opposite: true,
        gridLineWidth: 1,
        gridLineDashStyle: 'Dash',
        lineWidth: 0,
        tickPixelInterval: 300,
        title: {
          text: undefined
        }
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
              const plotLinesOrBandsData = ['Average ' + controlPointDisplay, 'Mid-point', 'Salary range'];
              // check to see if we need to remove or add a line/band OR we just want to perform the default function
              if (plotLinesOrBandsData.includes(event.target.userOptions.name)) {
                // look for the line or band in question on the chart
                const lineOrBand = event.target.chart.yAxis[0].plotLinesAndBands.find(plb => plb.id === event.target.userOptions.name);
                // if we find one, remove it. else add it
                if (lineOrBand) {
                  event.target.chart.yAxis[0].removePlotLine(event.target.userOptions.name);
                } else {
                  // find from static options and add
                  const options = event.target.chart.collectionsWithUpdate.find(plb => plb.id === event.target.userOptions.name);
                  event.target.chart.yAxis[0].addPlotLine(options);
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
        name: 'Salary range',
        type: 'polygon',
        animation: false,
        color: 'rgba(36,134,210,0.45)',
        enableMouseTracking: false,

      }, {
        name: 'Mid-point',
        type: 'line',
        color: '#CD8C01',
        marker: {
          enabled: false
        }
      }, {
        name: 'Average ' + controlPointDisplay,
        type: 'line',
        color: '#6236FF',
        marker: {
          enabled: false
        }
      }, {
        name: 'Employee ' + controlPointDisplay,
        type: 'scatter',
        marker: {
          enabled: true,
          // tslint:disable-next-line:max-line-length
          symbol: `url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxN3B4IiB2aWV3Qm94PSIwIDAgMTYgMTciIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYxICg4OTU4MSkgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+QmFzZTY8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iV29ya2luZyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IkVtcGxveWVlLVZpZXciIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNDIyLjAwMDAwMCwgLTczNi4wMDAwMDApIiBmaWxsPSIjMDg4M0JFIj4KICAgICAgICAgICAgPGcgaWQ9IkxlZ2VuZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTI0NS4wMDAwMDAsIDQwMC40MTQwNjIpIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJCYXNlLWlDT05TIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgMjMuMzg4NjcyKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IkJhc2U2IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNzcuMDAwMDAwLCAzMTIuNDcyNjU2KSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUiIHg9IjAiIHk9IjAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNS44NDkyNjQ3IiByeD0iNSI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+)`,
        },
        enableMouseTracking: true
      }, {
        name: 'Employee ' + controlPointDisplay + ' -outliers',
        type: 'scatter',
        marker: {
          enabled: true,
          // tslint:disable-next-line:max-line-length
          symbol: `url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxN3B4IiB2aWV3Qm94PSIwIDAgMTYgMTciIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYxICg4OTU4MSkgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+QmFzZTU8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iV29ya2luZyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IkVtcGxveWVlLVZpZXciIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMjQ1LjAwMDAwMCwgLTY3MC4wMDAwMDApIiBmaWxsPSIjRDk1MzRGIj4KICAgICAgICAgICAgPGcgaWQ9IkxlZ2VuZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTI0NS4wMDAwMDAsIDQwMC40MTQwNjIpIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJCYXNlLWlDT05TIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgMjMuMzg4NjcyKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IkJhc2U1IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgMjQ2Ljk4NDM3NSkiPgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTYiIGhlaWdodD0iMTUuODQ5MjY0NyIgcng9IjUiPjwvcmVjdD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==)`,
        },
        showInLegend: false,
        enableMouseTracking: true,
        linkedTo: ':previous'
      }]
    };
  }

  static formatCurrency(rawCurrency, locale, currencyCode) {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    return formatter.format(rawCurrency);
  }

  static calculateMidpoint(min, max) {
    return (min + max) / 2;
  }

  static formatColumnRange(xCoordinate, low, high) {
    return { x: xCoordinate, low: low, high: high };
  }
}
