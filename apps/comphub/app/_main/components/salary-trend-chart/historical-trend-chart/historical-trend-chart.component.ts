import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { Store } from '@ngrx/store';
import * as Highcharts from 'highcharts/highstock';
import { Observable, Subscription } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';

import { PayRateDate } from 'libs/models/payfactors-api/peer/exchange-data-search/response';

import * as fromComphubMainReducer from '../../../reducers';
import * as fromTrendsSummaryCardActions from '../../../actions/trends-summary-card.actions';
import * as fromTrendsLandingCardActions from '../../../actions/trends-landing-card.actions';

@Component({
  selector: 'pf-historical-trend-chart',
  templateUrl: 'historical-trend-chart.component.html',
  styleUrls: ['historical-trend-chart.component.scss']
})

export class HistoricalTrendChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() salaryTrendData: PayRateDate[];
  @Input() isHourly: boolean;
  @Input() currencyCode: string;

  Highcharts: typeof Highcharts = Highcharts;
  chart: Highcharts.Chart;
  chartOptions: Highcharts.Options = this.getChartOptions();

  localSalaryTrendData: PayRateDate[];
  data: any[];

  selectedPeerTrendId$: Observable<number>;
  selectedPeerTrendIdSubscription: Subscription;
  selectedTrendId: number;

  trendChartDomain$: Observable<any>;
  trendChartDomainSubscription: Subscription;
  trendChartDomain: any;

  constructor(private store: Store<fromComphubMainReducer.State>,
              private datePipe: DatePipe,
              private currencyPipe: CurrencyPipe) {
    this.selectedPeerTrendId$ = this.store.select(fromComphubMainReducer.getSelectedTrendId);
    this.trendChartDomain$ = this.store.select(fromComphubMainReducer.getPeerTrendsDomain);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.salaryTrendData?.currentValue) {
      this.localSalaryTrendData = cloneDeep(this.salaryTrendData);
      this.refreshChart();
    }
  }

  refreshChart(): void {
    if (this.localSalaryTrendData?.length > 0) {
      this.data = [];
      this.localSalaryTrendData.forEach(item => {
        const seconds = Math.floor(new Date(item.EffectiveDate).getTime());
        this.data.push([seconds, item.BasePay]);
      });

      if (!this.selectedTrendId) {
        const minDate = new Date(Math.min(...this.localSalaryTrendData.map(d => d.EffectiveDate.getTime())));
        const maxDate = new Date(Math.max(...this.localSalaryTrendData.map(d => d.EffectiveDate.getTime())));
        this.store.dispatch(new fromTrendsSummaryCardActions.SetTrendsDomain({ minDate, maxDate }));
      }

      this.updateSidePanelInfo(this.localSalaryTrendData);

      this.chartOptions = this.getChartOptions();
    }
  }

  getChartOptions(): any {
    return {
      chart: {
        type: 'areaspline',
        height: 500,
        width: 800,
        plotBorderWidth: 1
      },
      rangeSelector: {
        enabled: true,
        allButtonsEnabled: true,
        selected: 3,
        buttons: [{
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
        text: 'Peer Salary Trend',
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
          const transformedDate = this.datePipe.transform(new Date(point.category), 'yyyy-MM', 'UTC');
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
        showLastLabel: 'false',
        events: {
          afterSetExtremes : (event) => { this.onSetExtremes(event); },
        }
      },
      yAxis: {
        tickPositioner: function () {
          const positions = [];
          const increment = (this.dataMax === this.dataMin) ? Math.ceil(this.dataMax / 2000) * 1000 : (Math.ceil((this.dataMax - this.dataMin) / 2000)) * 1000;
          let tick = Math.max(Math.floor((this.dataMin - (increment * 2)) / 1000) * 1000, 0);

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

  onSetExtremes(event: any) {
    const zoomedTrendData = this.localSalaryTrendData.filter(x => Date.parse(x.EffectiveDate.toString()) >= event.min
      && Date.parse(x.EffectiveDate.toString()) <= event.max);

    this.store.dispatch(new fromTrendsSummaryCardActions.SetTrendsDomain({minDate: new Date(event.min), maxDate: new Date(event.max)}));

    this.updateSidePanelInfo(zoomedTrendData);
  }

  updateSidePanelInfo(trendData: PayRateDate[]) {
    const upperPayRateDate = trendData[trendData.length - 1];
    const lowerPayRateDate = trendData[0];
    const basePayPctChange = (upperPayRateDate.BasePay - lowerPayRateDate.BasePay) / lowerPayRateDate.BasePay;
    const incsPctChange = (upperPayRateDate.Incs - lowerPayRateDate.Incs) / lowerPayRateDate.Incs;
    const orgsPctChange = (upperPayRateDate.Orgs - lowerPayRateDate.Orgs) / lowerPayRateDate.Orgs;

    const contributingCompanyJobCount = upperPayRateDate.CompanyJobCount;
    const contributingExchangeJobCount = upperPayRateDate.ExchangeJobCount;

    this.store.dispatch(new fromTrendsSummaryCardActions.SetTrendsPercentChange({
      BasePayPctChange: basePayPctChange,
      IncsPctChange: incsPctChange,
      OrgsPctChange: orgsPctChange,
      ContributingCompanyJobCount: contributingCompanyJobCount,
      ContributingExchangeJobCount: contributingExchangeJobCount
    }));
  }

  ngOnInit(): void {
    this.selectedPeerTrendIdSubscription = this.selectedPeerTrendId$.subscribe( x => {
      this.selectedTrendId = x;
      if (!!x) {
        this.store.dispatch(new fromTrendsLandingCardActions.LoadSavedTrend(x));
      }
  });

    this.trendChartDomainSubscription = this.trendChartDomain$.subscribe( x => {
        this.trendChartDomain = {
          minDate: new Date(x.minDate).getTime(),
          maxDate: new Date(x.maxDate).getTime()
        };
    });
  }

  ngOnDestroy(): void {
    this.selectedPeerTrendIdSubscription.unsubscribe();
    this.trendChartDomainSubscription.unsubscribe();
  }

  chartCallback(chart: Highcharts.Chart = null) {
    // set the instance
    if (chart) {
      this.chart = chart;
      if (!!this.selectedTrendId) {
        this.chart.xAxis[0].setExtremes(new Date(this.trendChartDomain.minDate).getTime(), new Date(this.trendChartDomain.maxDate).getTime());
      }
    }
  }
}

