import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Exchange, GetChartRequest, ChartItem, ExchangeChartTypeEnum } from 'libs/models';

import * as fromPeerDashboardReducer from '../../reducers';
import * as fromSharedPeerReducer from '../../../shared/reducers';
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
    private store: Store<fromPeerDashboardReducer.State>,
    private sharedPeerStore: Store<fromSharedPeerReducer.State>
  ) {
    this.exchange$ = this.sharedPeerStore.select(fromSharedPeerReducer.getExchange);
    this.jobChartItems$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardJobChartItems);
    this.loadingJobChartItems$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardLoadingJobChart);
    this.loadingJobChartItemsError$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardLoadingJobChartError);
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




