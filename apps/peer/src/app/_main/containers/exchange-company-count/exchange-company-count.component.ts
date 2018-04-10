import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'hammerjs'; // Required for chart methods like seriesClick.

import { Exchange, GetChartRequest, GetDetailChartRequest, ChartItem, ExchangeChartTypeEnum } from 'libs/models';

import * as fromExchangeDashboardReducer from '../../reducers';
import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';

@Component({
  selector: 'pf-exchange-company-count',
  templateUrl: './exchange-company-count.component.html',
  styleUrls: ['./exchange-company-count.component.scss']
})

export class ExchangeCompanyCountComponent implements OnInit, OnDestroy {
  exchangeId: number;
  chartItem: ChartItem;
  exchange$: Observable<Exchange>;
  companyChartItems$: Observable<ChartItem[]>;
  companyChartItemsSubscription: Subscription;
  loadingCompanyChartItems$: Observable<boolean>;
  loadingCompanyChartItemsError$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromExchangeDashboardReducer.State>
  ) {
    this.exchange$ = this.store.select(fromExchangeDashboardReducer.getExchange);
    this.companyChartItems$ = this.store.select(fromExchangeDashboardReducer.getExchangeDashboardCompanyChartItems);
    this.loadingCompanyChartItems$ = this.store.select(fromExchangeDashboardReducer.getExchangeDashboardLoadingCompanyChart);
    this.loadingCompanyChartItemsError$ = this.store.select(fromExchangeDashboardReducer.getExchangeDashboardLoadingCompanyChartError);
    this.exchangeId = this.route.snapshot.params.id;
  }

  companyCountClick(): void {
    const getDetailChartRequest: GetDetailChartRequest = {
      ExchangeId: this.exchangeId,
      ChartType: ExchangeChartTypeEnum.Company,
      Category: 'All Companies'
    };
    this.store.dispatch(new fromExchangeDashboardActions.LoadingDetailChart(getDetailChartRequest));
  }

  ngOnInit() {
    const getChartRequest: GetChartRequest = {
      ExchangeId: this.exchangeId,
      ChartType: ExchangeChartTypeEnum.Company
    };
    this.store.dispatch(new fromExchangeDashboardActions.LoadingCompanyChart(getChartRequest));
    this.companyChartItemsSubscription = this.companyChartItems$.subscribe(companyChartItem => {
      if (companyChartItem) {
        this.chartItem = companyChartItem[0];
      }
    });
  }

  ngOnDestroy() {
    this.companyChartItemsSubscription.unsubscribe();
  }
}
