import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { GetDetailChartRequest, ChartItem, ExchangeChartTypeEnum } from 'libs/models';

import * as fromPeerDashboardReducer from '../../reducers';
import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';

@Component({
  selector: 'pf-exchange-industry-chart',
  templateUrl: './exchange-industry-chart.component.html',
  styleUrls: ['./exchange-industry-chart.component.scss']
})

export class ExchangeIndustryChartComponent {
  exchangeId: number;
  industryChartItems$: Observable<ChartItem[]>;
  loadingIndustryChartItems$: Observable<boolean>;
  loadingIndustryChartItemsError$: Observable<boolean>;

  constructor(
    private store: Store<fromPeerDashboardReducer.State>,
    private route: ActivatedRoute
  ) {
    this.industryChartItems$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardIndustryChartItems);
    this.loadingIndustryChartItems$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardLoadingIndustryChart);
    this.loadingIndustryChartItemsError$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardLoadingIndustryChartError);
    this.route.paramMap.subscribe((params: ParamMap) => this.exchangeId = +params.get('id'));
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




