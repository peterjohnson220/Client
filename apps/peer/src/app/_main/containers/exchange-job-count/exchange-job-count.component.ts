import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'hammerjs'; // Required for chart methods like seriesClick.

import { Exchange, GetChartRequest, ChartItem, ExchangeChartTypeEnum } from 'libs/models';

import * as fromExchangeDashboardReducer from '../../reducers';
import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';

@Component({
  selector: 'pf-exchange-job-count',
  templateUrl: './exchange-job-count.component.html',
  styleUrls: ['./exchange-job-count.component.scss']
})

export class ExchangeJobCountComponent implements OnInit, OnDestroy {
  exchangeId: number;
  chartItem: ChartItem;
  exchange$: Observable<Exchange>;
  jobChartItems$: Observable<ChartItem[]>;
  jobChartItemsSubscription: Subscription;
  loadingJobChartItems$: Observable<boolean>;
  loadingJobChartItemsError$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromExchangeDashboardReducer.State>
  ) {
    this.exchange$ = this.store.select(fromExchangeDashboardReducer.getExchange);
    this.jobChartItems$ = this.store.select(fromExchangeDashboardReducer.getExchangeDashboardJobChartItems);
    this.loadingJobChartItems$ = this.store.select(fromExchangeDashboardReducer.getExchangeDashboardLoadingJobChart);
    this.loadingJobChartItemsError$ = this.store.select(fromExchangeDashboardReducer.getExchangeDashboardLoadingJobChartError);
    this.exchangeId = this.route.snapshot.params.id;
  }

  ngOnInit() {
    const getChartRequest: GetChartRequest = {
      ExchangeId: this.exchangeId,
      ChartType: ExchangeChartTypeEnum.Job
    };
    this.store.dispatch(new fromExchangeDashboardActions.LoadingJobChart(getChartRequest));
    this.jobChartItemsSubscription = this.jobChartItems$.subscribe(jobChartItem => {
      if (jobChartItem) {
        this.chartItem = jobChartItem[0];
      }
    });
  }

  ngOnDestroy() {
    this.jobChartItemsSubscription.unsubscribe();
  }
}




