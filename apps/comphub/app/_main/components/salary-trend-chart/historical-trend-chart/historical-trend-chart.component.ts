import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CurrencyPipe, DatePipe } from '@angular/common';

import * as Highcharts from 'highcharts/highstock';
import cloneDeep from 'lodash/cloneDeep';

import { JobSalaryTrend } from '../../../models';

@Component({
  selector: 'pf-historical-trend-chart',
  templateUrl: 'historical-trend-chart.component.html',
  styleUrls: ['historical-trend-chart.component.scss']
})

export class HistoricalTrendChartComponent implements OnChanges {
  @Input() salaryTrendData: JobSalaryTrend;
  @Input() isHourly: boolean;
  @Input() currencyCode: string;

  Highcharts: typeof Highcharts = Highcharts;
  chart: Highcharts.Chart;
  chartOptions: Highcharts.Options = this.getChartOptions();

  absoluteValueOfPercentageChange: number;
  localSalaryTrendData: JobSalaryTrend;
  data: any[];
  img: any;

  constructor(private datePipe: DatePipe, private currencyPipe: CurrencyPipe, private sanitizer: DomSanitizer) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.salaryTrendData?.currentValue) {
      this.absoluteValueOfPercentageChange = this.salaryTrendData.PercentageChange
        ? Math.abs(this.salaryTrendData.PercentageChange)
        : 0;
      this.localSalaryTrendData = cloneDeep(this.salaryTrendData);

      this.refreshChart();
    }

    if (changes?.isHourly?.currentValue != null && this.localSalaryTrendData != null) {
      this.refreshChart();
    }
  }

  refreshChart(): void {
    this.data = [];

    this.localSalaryTrendData.Data.forEach(item => {

      const seconds = Math.floor(new Date(item.EffectiveDate).getTime());

      this.data.push([seconds, this.isHourly ? item.SalaryHourly : item.SalaryAnnual]);
    });

    this.chartOptions = this.getChartOptions();

    this.refreshChartImage();
  }

  getChartOptions(): any {
    return {
      chart: {
        type: 'areaspline',
        height: 500,
        width: 1000,
        plotBorderWidth: 1
      },
      rangeSelector: {
        enabled: true,
        allButtonsEnabled: true,
        selected: 4,
        buttons: [{
          type: 'month',
          count: 3,
          text: '3m',
          title: 'View 3 months'
        }, {
          type: 'month',
          count: 6,
          text: '6m',
          title: 'View 6 months'
        }, {
          type: 'year',
          count: 1,
          text: '1y',
          title: 'View 1 year'
        }, {
          type: 'year',
          count: 2,
          text: '2y',
          title: 'View 2 year'
        },
        {
          type: 'year',
          count: 3,
          text: '3y',
          title: 'View 3 year'
        }]
      },
      title: {
        text: 'Peer Salary Trend'
      },
      tooltip: {
        animation: false,
        formatter: (data) => {
          const point = data.chart.hoverPoint;
          const transformedDate = this.datePipe.transform(new Date(point.category), 'yyyy-MM');
          const transformedSalary = this.currencyPipe.transform(point.y, this.currencyCode, 'symbol-narrow', this.isHourly ? '1.2-2' : '1.0-0');
          return transformedDate + ': ' + transformedSalary;
        }
      },
      plotOptions: {
        series: {
          marker: {
            enabled: false
          }
        }
      },
      xAxis: {
        type: 'datetime',
        showLastLabel: 'false'
      },
      yAxis: {
        tickPositioner: function () {
          const positions = [];
          const increment = (this.dataMax === this.dataMin) ? Math.ceil(this.dataMax / 2000) * 1000 : (Math.ceil((this.dataMax - this.dataMin) / 2000)) * 1000;
          let tick = Math.abs(Math.floor((this.dataMin - (increment * 2)) / 1000) * 1000);

          if (this.dataMax !== null && this.dataMin !== null) {
            for (tick; tick - increment <= this.dataMax; tick += increment) {
              positions.push(tick);
            }
          }
          return positions;
        },
        title: null,
        labels: {
          enabled: true,
          formatter: function() {
            return '$' + this.value / 1000 + 'K';
          }
        }
      },
      series: [
        {
          name: 'Annual Base Pay',
          type: 'areaspline',
          data: this.data,
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, new Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          }
        }
      ],
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      }
    };
  }

  refreshChartImage(): void {
    if (this.chart) {
      const svg = this.chart.getSVG(this.chartOptions);
      const blob = new Blob([svg], {type: 'image/svg+xml'});
      this.img = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
    }
  }

  rangeChartCallback(chart: Highcharts.Chart = null) {
    if (chart) {
      this.chart = chart;

      this.refreshChartImage();
    }
  }
}

