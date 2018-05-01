import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Exchange, GetChartRequest, GetDetailChartRequest, ChartItem, ExchangeChartTypeEnum } from 'libs/models';

import * as fromPeerDashboardReducer from '../../reducers';
import * as fromSharedPeerReducer from '../../../shared/reducers';
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
    private store: Store<fromPeerDashboardReducer.State>,
    private sharedPeerStore: Store<fromSharedPeerReducer.State>
  ) {
    this.exchange$ = this.sharedPeerStore.select(fromSharedPeerReducer.getExchange);
    this.industryChartItems$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardIndustryChartItems);
    this.loadingIndustryChartItems$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardLoadingIndustryChart);
    this.loadingIndustryChartItemsError$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardLoadingIndustryChartError);
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




