import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

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
  jobChartItems$: Observable<ChartItem[]>;
  jobChartItemsSubscription: Subscription;
  loadingJobChartItems$: Observable<boolean>;
  loadingJobChartItemsError$: Observable<boolean>;

  constructor(
    private store: Store<fromPeerDashboardReducer.State>,
    private route: ActivatedRoute
  ) {
    this.jobChartItems$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardJobChartItems);
    this.loadingJobChartItems$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardLoadingJobChart);
    this.loadingJobChartItemsError$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardLoadingJobChartError);
    this.route.paramMap.subscribe((params: ParamMap) => this.exchangeId = +params.get('id'));
  }

  ngOnInit() {
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




