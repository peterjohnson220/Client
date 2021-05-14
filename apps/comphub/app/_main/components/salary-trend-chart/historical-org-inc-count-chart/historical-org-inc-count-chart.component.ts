import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import * as Highcharts from 'highcharts/highstock';
import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj } from 'libs/models/state';

import { OrgIncCountData } from '../../../models';

@Component({
  selector: 'pf-historical-org-inc-count-chart',
  templateUrl: 'historical-org-inc-count-chart.component.html',
  styleUrls: ['historical-org-inc-count-chart.component.scss']
})

export class HistoricalOrgIncCountChartComponent implements OnChanges {
  @Input() orgIncCountData: AsyncStateObj<OrgIncCountData[]>;
  @Input() countType: string;

  Highcharts: typeof Highcharts = Highcharts;
  chart: Highcharts.Chart;
  chartOptions: Highcharts.Options = this.getChartOptions();

  localOrgIncCountData: OrgIncCountData[];
  data: any[];

  constructor(private datePipe: DatePipe) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.orgIncCountData?.currentValue) {
      this.localOrgIncCountData = cloneDeep(this.orgIncCountData.obj);

      this.refreshChart();
    }
  }

  refreshChart(): void {
    this.data = [];

    this.localOrgIncCountData?.forEach(item => {
      const seconds = Math.floor(new Date(item.EffectiveDate).getTime());
      this.data.push([seconds, this.countType == "Org" ? item.OrgCount : item.IncCount]);
    });

    this.chartOptions = this.getChartOptions();
  }

  getChartOptions(): any {
    return {
      chart: {
        type: 'areaspline',
        height: 300,
        width: 400,
        plotBorderWidth: 1
      },
      title: {
        text: `${this.countType}s Over Time`,
        style: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#306589',
          fontFamily: '"Segoe UI", Arial, sans-serif'
        }
      },
      tooltip: {
        animation: false,
        formatter: (data) => {
          const point = data.chart.hoverPoint;
          const transformedDate = this.datePipe.transform(new Date(point.category), 'yyyy-MM');
          return transformedDate + ': ' + point.y;
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
        labels: {
          enabled: true
        },
        title: {
          text: undefined
        }
      },
      legend: {
        enabled: false
      },
      series: [
        {
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
}

