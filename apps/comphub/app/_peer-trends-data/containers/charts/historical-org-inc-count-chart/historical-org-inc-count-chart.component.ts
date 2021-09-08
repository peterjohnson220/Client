import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as Highcharts from 'highcharts/highstock';
import cloneDeep from 'lodash/cloneDeep';

import { OrgIncCountData } from '../../../models';
import * as fromComphubPeerTrendsDataReducers from '../../../reducers';

@Component({
  selector: 'pf-historical-org-inc-count-chart',
  templateUrl: 'historical-org-inc-count-chart.component.html',
  styleUrls: ['historical-org-inc-count-chart.component.scss']
})

export class HistoricalOrgIncCountChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() orgIncCountData: OrgIncCountData[];
  @Input() countType: string;
  @Input() useTrendsDomain = false;
  @Input() height = 300;
  @Input() width = 400;
  @Input() titleMargin = 0;
  @Input() legendTitle = '';

  Highcharts: typeof Highcharts = Highcharts;
  chart: Highcharts.Chart;
  chartOptions: Highcharts.Options = this.getChartOptions();

  localOrgIncCountData: OrgIncCountData[];
  data: any[];

  trendsDomain$: Observable<any>;
  trendsDomainSubscription: Subscription;

  constructor(private store: Store<fromComphubPeerTrendsDataReducers.State>, private datePipe: DatePipe) {
    this.trendsDomain$ = this.store.select(fromComphubPeerTrendsDataReducers.getPeerTrendsDomain);
  }

  ngOnInit(): void {
    this.trendsDomainSubscription = this.trendsDomain$.subscribe(d => {
      this.updateTrendsDomain(new Date(Date.parse(d.minDate)), new Date(Date.parse(d.maxDate)));
    });
  }

  ngOnDestroy(): void {
    this.trendsDomainSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.orgIncCountData?.currentValue) {
      this.localOrgIncCountData = cloneDeep(this.orgIncCountData);

      this.refreshChart();
    }
  }

  updateTrendsDomain(minDate: Date, maxDate: Date) {
    if (this.useTrendsDomain) {
      this.localOrgIncCountData = this.orgIncCountData.filter(x => Date.parse(x.EffectiveDate.toString()) >= minDate.getTime()
        && Date.parse(x.EffectiveDate.toString()) <= maxDate.getTime());

      this.refreshChart();
    }
  }

  refreshChart(): void {
    this.data = [];

    this.localOrgIncCountData?.forEach(item => {
      const seconds = Math.floor(new Date(item.EffectiveDate).getTime());
      this.data.push([seconds, this.countType === 'Org' ? item.OrgCount : item.IncCount]);
    });

    this.chartOptions = this.getChartOptions();
  }

  getChartOptions(): any {
    const clientDataCutoffDate = new Date();
    clientDataCutoffDate.setDate(clientDataCutoffDate.getDate() - 90);

    return {
      chart: {
        type: 'areaspline',
        height: this.height,
        width: this.width,
        plotBorderWidth: 1
      },
      title: {
        text: `${this.countType}s Over Time`,
        style: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#306589',
          fontFamily: '"Segoe UI", Arial, sans-serif'
        },
        margin: this.titleMargin
      },
      tooltip: {
        animation: false,
        formatter: (data) => {
          const point = data.chart.hoverPoint;
          const transformedDate = this.datePipe.transform(new Date(point.category), 'yyyy-MM', 'UTC');
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
        showLastLabel: 'false',
        plotLines: [{
          color: '#FF0000',
          width: 2,
          value: clientDataCutoffDate,
          zIndex: 5
        }],
        minPadding: 0,
        maxPadding: 0,

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
        enabled: this.legendTitle.length > 0
      },
      series: [
        {
          name: this.legendTitle,
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
