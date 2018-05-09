import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Exchange, GetChartRequest, GetDetailChartRequest, ChartItem, ExchangeChartTypeEnum } from 'libs/models';

import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';
import * as fromPeerDashboardReducer from '../../reducers';
import * as fromSharedPeerReducer from '../../../shared/reducers';

@Component({
  selector: 'pf-exchange-revenue-chart',
  templateUrl: './exchange-revenue-chart.component.html',
  styleUrls: ['./exchange-revenue-chart.component.scss']
})

export class ExchangeRevenueChartComponent implements OnInit {
  exchangeId: number;
  exchange$: Observable<Exchange>;
  revenueChartItems$: Observable<ChartItem[]>;
  loadingRevenueChartItems$: Observable<boolean>;
  loadingRevenueChartItemsError$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromPeerDashboardReducer.State>,
    private sharedPeerStore: Store<fromSharedPeerReducer.State>
  ) {
    this.exchange$ = this.sharedPeerStore.select(fromSharedPeerReducer.getExchange);
    this.revenueChartItems$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardRevenueChartItems);
    this.loadingRevenueChartItems$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardLoadingRevenueChart);
    this.loadingRevenueChartItemsError$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardLoadingRevenueChartError);
    this.exchangeId = this.route.snapshot.params.id;
  }

  ngOnInit() {
    const getChartRequest: GetChartRequest = {
      ExchangeId: this.exchangeId,
      ChartType: ExchangeChartTypeEnum.Revenue
    };
    this.store.dispatch(new fromExchangeDashboardActions.LoadingRevenueChart(getChartRequest));
  }

  seriesClick(e): void {
    const getDetailChartRequest: GetDetailChartRequest = {
      ExchangeId: this.exchangeId,
      ChartType: ExchangeChartTypeEnum.Revenue,
      Category: e.category
    };
    this.store.dispatch(new fromExchangeDashboardActions.LoadingDetailChart(getDetailChartRequest));
  }
}
