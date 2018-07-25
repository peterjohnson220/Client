import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import * as cloneDeep from 'lodash.clonedeep';

import { GridTypeEnum } from 'libs/models';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromExchangeJobComparisonGridActions from '../../actions/exchange-job-comparison-grid.actions';
import * as fromDashboardReducer from '../../reducers';

@Component({
  selector: 'pf-exchange-job-comparison-grid',
  templateUrl: './exchange-job-comparison-grid.component.html',
  styleUrls: ['./exchange-job-comparison-grid.component.scss']
})
export class ExchangeJobComparisonGridComponent implements OnInit, OnDestroy {
  loadingExchangeJobComparisons$: Observable<boolean>;
  loadingExchangeJobComparisonsError$: Observable<boolean>;
  exchangeJobComparisonsGridData$: Observable<GridDataResult>;
  exchangeJobComparisonsGridState$: Observable<State>;
  exchangeJobComparisonGridStateSubscription: Subscription;
  exchangeJobComparisonGridState: State;

  constructor(
    private store: Store<fromDashboardReducer.State>
  ) {
    this.loadingExchangeJobComparisons$ = this.store.select(fromDashboardReducer.getExchangeJobComparisonsLoading);
    this.loadingExchangeJobComparisonsError$ = this.store.select(fromDashboardReducer.getExchangeJobComparisonsLoadingError);
    this.exchangeJobComparisonsGridData$ = this.store.select(fromDashboardReducer.getExchangeJobComparisonsGridData);
    this.exchangeJobComparisonsGridState$ = this.store.select(fromDashboardReducer.getExchangeJobComparisonsGridState);
  }

  // Grid
  handleDataStateChange(state: DataStateChangeEvent): void {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.ExchangeJobComparison, state));
    this.store.dispatch(new fromExchangeJobComparisonGridActions.LoadExchangeJobComparisons);
  }

  getExchangeIndexValue(exchangeIndex: number): string {
    return exchangeIndex + '%';
  }

  getExchangeIndexFontColorClass(exchangeIndex: number): string {
    if (exchangeIndex < 50) {
      return 'text-danger';
    }
    if (exchangeIndex >= 100) {
      return 'text-success';
    }
  }

  // Lifecycle
  ngOnInit() {
    this.exchangeJobComparisonGridStateSubscription = this.exchangeJobComparisonsGridState$.subscribe(gridState => {
      this.exchangeJobComparisonGridState = cloneDeep(gridState);
    });
  }

  ngOnDestroy() {
    this.exchangeJobComparisonGridStateSubscription.unsubscribe();
  }
}
