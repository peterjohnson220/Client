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
  category: ExchangeChartTypeEnum;
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
      Category: this.category
    };
    this.store.dispatch(new fromExchangeDashboardActions.LoadDetailChart(getDetailChartRequest));
  }

  ngOnInit() {
    this.companyChartItemsSubscription = this.companyChartItems$.subscribe(companyChartItem => {
      if (companyChartItem) {
        this.participatingCompaniesChartItem = companyChartItem[0];
        if(this.participatingCompaniesChartItem.Category.includes('Propert')) {
          this.category = ExchangeChartTypeEnum.Subsidiary;
        }

        else {
          this.category = ExchangeChartTypeEnum.Company;
        }
      }
    });
  }

  ngOnDestroy() {
    this.companyChartItemsSubscription.unsubscribe();
  }
}
