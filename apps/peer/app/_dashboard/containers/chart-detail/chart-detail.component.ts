import {Component, OnDestroy, OnInit} from '@angular/core';

import { Store } from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';

import { ChartItem, ExchangeChartTypeEnum } from 'libs/models';

import * as fromPeerDashboardReducer from '../../reducers';
import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';

@Component({
  selector: 'pf-chart-detail-component',
  templateUrl: './chart-detail.component.html',
  styleUrls: ['./chart-detail.component.scss']
})
export class ChartDetailComponent implements OnInit, OnDestroy {
  detailChartType$: Observable<string>;
  detailChartCategory$: Observable<string>;
  detailChartItems$: Observable<ChartItem[]>;
  loadingDetailChartItems$: Observable<boolean>;
  loadingDetailChartItemsError$: Observable<boolean>;

  detailChartTypeSubscription: Subscription;

  detailChartType: ExchangeChartTypeEnum;

  constructor(
    private store: Store<fromPeerDashboardReducer.State>
  ) {
    this.detailChartType$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardDetailChartType);
    this.detailChartCategory$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardDetailChartCategory);
    this.detailChartItems$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardDetailChartItems);
    this.loadingDetailChartItems$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardLoadingDetailChart);
    this.loadingDetailChartItemsError$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardLoadingDetailChartError);
  }

  get isCompanyChartType(): boolean {
    return this.detailChartType === ExchangeChartTypeEnum.Company;
  }

  get cardHeaderText(): string {
    switch (this.detailChartType) {
      case  ExchangeChartTypeEnum.ExchangeJobOrgs :
        return 'Exchange Job Orgs';
      default:
        return 'Participating Companies';
    }
  }

  closeSidebar(): void {
    this.store.dispatch(new fromExchangeDashboardActions.CloseSidebar());
  }

  ngOnInit(): void {
    this.detailChartTypeSubscription = this.detailChartType$.subscribe(ct => {
      this.detailChartType = ct as ExchangeChartTypeEnum;
    });
  }

  ngOnDestroy(): void {
    this.detailChartTypeSubscription.unsubscribe();
  }
}
