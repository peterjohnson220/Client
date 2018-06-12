import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { GetDetailChartRequest, ChartItem, ExchangeChartTypeEnum } from 'libs/models';

import * as fromPeerDashboardReducer from '../../reducers';
import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';

@Component({
  selector: 'pf-exchange-company-count',
  templateUrl: './exchange-company-count.component.html',
  styleUrls: ['./exchange-company-count.component.scss']
})

export class ExchangeCompanyCountComponent implements OnInit, OnDestroy {
  exchangeId: number;
  participatingCompaniesChartItem: ChartItem;
  allCompaniesChartItem: ChartItem;
  companyChartItems$: Observable<ChartItem[]>;
  companyChartItemsSubscription: Subscription;
  loadingCompanyChartItems$: Observable<boolean>;
  loadingCompanyChartItemsError$: Observable<boolean>;

  constructor(
    private store: Store<fromPeerDashboardReducer.State>,
    private route: ActivatedRoute
  ) {
    this.companyChartItems$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardCompanyChartItems);
    this.loadingCompanyChartItems$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardLoadingCompanyChart);
    this.loadingCompanyChartItemsError$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardLoadingCompanyChartError);
    this.route.paramMap.subscribe((params: ParamMap) => this.exchangeId = +params.get('id'));
  }

  participatingCompaniesCountClick(): void {
    const getDetailChartRequest: GetDetailChartRequest = {
      ExchangeId: this.exchangeId,
      ChartType: ExchangeChartTypeEnum.Company,
      Category: 'Participating Companies'
    };
    this.store.dispatch(new fromExchangeDashboardActions.LoadingDetailChart(getDetailChartRequest));
  }

  allCompaniesCountClick(): void {
    const getDetailChartRequest: GetDetailChartRequest = {
      ExchangeId: this.exchangeId,
      ChartType: ExchangeChartTypeEnum.Company,
      Category: 'All Companies'
    };
    this.store.dispatch(new fromExchangeDashboardActions.LoadingDetailChart(getDetailChartRequest));
  }

  ngOnInit() {
    this.companyChartItemsSubscription = this.companyChartItems$.subscribe(companyChartItem => {
      if (companyChartItem) {
        this.participatingCompaniesChartItem = companyChartItem[0];
        this.allCompaniesChartItem = companyChartItem[1];
      }
    });
  }

  ngOnDestroy() {
    this.companyChartItemsSubscription.unsubscribe();
  }
}
