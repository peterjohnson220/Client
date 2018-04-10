import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'hammerjs'; // Required for chart methods like seriesClick.

import { Exchange, GetChartRequest, GetDetailChartRequest, ChartItem, ExchangeChartTypeEnum } from 'libs/models';

import * as fromExchangeDashboardReducer from '../../reducers';
import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';

@Component({
  selector: 'pf-exchange-industry-chart',
  templateUrl: './exchange-industry-chart.component.html',
  styleUrls: ['./exchange-industry-chart.component.scss']
})

export class ExchangeIndustryChartComponent implements OnInit {
  exchangeId: number;
  exchange$: Observable<Exchange>;
  industryChartItems$: Observable<ChartItem[]>;
  loadingIndustryChartItems$: Observable<boolean>;
  loadingIndustryChartItemsError$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromExchangeDashboardReducer.State>
  ) {
    this.exchange$ = this.store.select(fromExchangeDashboardReducer.getExchange);
    this.industryChartItems$ = this.store.select(fromExchangeDashboardReducer.getExchangeDashboardIndustryChartItems);
    this.loadingIndustryChartItems$ = this.store.select(fromExchangeDashboardReducer.getExchangeDashboardLoadingIndustryChart);
    this.loadingIndustryChartItemsError$ = this.store.select(fromExchangeDashboardReducer.getExchangeDashboardLoadingIndustryChartError);
    this.exchangeId = this.route.snapshot.params.id;
  }

  ngOnInit() {
    const getChartRequest: GetChartRequest = {
      ExchangeId: this.exchangeId,
      ChartType: ExchangeChartTypeEnum.Industry
    };
    this.store.dispatch(new fromExchangeDashboardActions.LoadingIndustryChart(getChartRequest));
  }

  seriesClick(e): void {
    const getDetailChartRequest: GetDetailChartRequest = {
      ExchangeId: this.exchangeId,
      ChartType: ExchangeChartTypeEnum.Industry,
      Category: e.category
    };
    this.store.dispatch(new fromExchangeDashboardActions.LoadingDetailChart(getDetailChartRequest));
  }
}




