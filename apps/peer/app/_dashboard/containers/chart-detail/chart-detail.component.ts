import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ChartItem } from 'libs/models';

import * as fromPeerDashboardReducer from '../../reducers';
import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';

@Component({
  selector: 'pf-chart-detail-component',
  templateUrl: './chart-detail.component.html',
  styleUrls: ['./chart-detail.component.scss']
})
export class ChartDetailComponent {
  detailChartCategory$: Observable<string>;
  detailChartItems$: Observable<ChartItem[]>;
  loadingDetailChartItems$: Observable<boolean>;
  loadingDetailChartItemsError$: Observable<boolean>;

  constructor(
    private store: Store<fromPeerDashboardReducer.State>
  ) {
    this.detailChartCategory$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardDetailChartCategory);
    this.detailChartItems$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardDetailChartItems);
    this.loadingDetailChartItems$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardLoadingDetailChart);
    this.loadingDetailChartItemsError$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardLoadingDetailChartError);
  }

  closeSidebar(): void {
    this.store.dispatch(new fromExchangeDashboardActions.CloseSidebar());
  }
}
