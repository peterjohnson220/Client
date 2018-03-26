import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ChartItem } from 'libs/models';

import * as fromExchangeDashboardReducer from '../../reducers';
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

  constructor(private store: Store<fromExchangeDashboardReducer.State>) {
    this.detailChartCategory$ = this.store.select(fromExchangeDashboardReducer.getExchangeDashboardDetailChartCategory);
    this.detailChartItems$ = this.store.select(fromExchangeDashboardReducer.getExchangeDashboardDetailChartItems);
    this.loadingDetailChartItems$ = this.store.select(fromExchangeDashboardReducer.getExchangeDashboardLoadingDetailChart);
    this.loadingDetailChartItemsError$ = this.store.select(fromExchangeDashboardReducer.getExchangeDashboardLoadingDetailChartError);
  }

  closeSidebar(): void {
    this.store.dispatch(new fromExchangeDashboardActions.CloseSidebar());
  }
}
