import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { GetDetailChartRequest, ChartItem, ExchangeChartTypeEnum } from 'libs/models';

import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';
import * as fromPeerDashboardReducer from '../../reducers';

@Component({
  selector: 'pf-exchange-revenue-chart',
  templateUrl: './exchange-revenue-chart.component.html',
  styleUrls: ['./exchange-revenue-chart.component.scss']
})

export class ExchangeRevenueChartComponent {
  exchangeId: number;
  revenueChartItems$: Observable<ChartItem[]>;
  loadingRevenueChartItems$: Observable<boolean>;
  loadingRevenueChartItemsError$: Observable<boolean>;

  constructor(
    private store: Store<fromPeerDashboardReducer.State>,
    private route: ActivatedRoute
  ) {
    this.revenueChartItems$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardRevenueChartItems);
    this.loadingRevenueChartItems$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardLoadingRevenueChart);
    this.loadingRevenueChartItemsError$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardLoadingRevenueChartError);
    this.route.paramMap.subscribe((params: ParamMap) => this.exchangeId = +params.get('id'));
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
