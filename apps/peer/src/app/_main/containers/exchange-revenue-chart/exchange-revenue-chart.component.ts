import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'hammerjs'; // Required for chart methods like seriesClick.

import { Exchange, GetChartRequest, ChartItem, ExchangeChartTypeEnum } from 'libs/models';

import * as fromExchangeDashboardReducer from '../../reducers';
import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';

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
    private store: Store<fromExchangeDashboardReducer.State>
  ) {
    this.exchange$ = this.store.select(fromExchangeDashboardReducer.getExchange);
    this.revenueChartItems$ = this.store.select(fromExchangeDashboardReducer.getExchangeDashboardRevenueChartItems);
    this.loadingRevenueChartItems$ = this.store.select(fromExchangeDashboardReducer.getExchangeDashboardLoadingRevenueChart);
    this.loadingRevenueChartItemsError$ = this.store.select(fromExchangeDashboardReducer.getExchangeDashboardLoadingRevenueChartError);
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
    const getDetailChartRequest: GetChartRequest = {
      ExchangeId: this.exchangeId,
      ChartType: ExchangeChartTypeEnum.Revenue,
      Category: e.category
    };
    this.store.dispatch(new fromExchangeDashboardActions.LoadingDetailChart(getDetailChartRequest));
  }
}
