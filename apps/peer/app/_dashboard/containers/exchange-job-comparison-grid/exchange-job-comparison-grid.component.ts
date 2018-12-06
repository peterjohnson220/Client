import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {DataStateChangeEvent, GridDataResult, SelectionEvent} from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import * as cloneDeep from 'lodash.clonedeep';

import { GridTypeEnum, ExchangeJobComparison } from 'libs/models';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import * as fromRootState from 'libs/state/state';

import * as fromExchangeJobComparisonGridActions from '../../actions/exchange-job-comparison-grid.actions';
import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';
import * as fromUploadOrgDataActions from '../../actions/upload-org-data.actions';
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
  exchangeJobOrgsDetailVisible$: Observable<boolean>;

  companyContext$: Observable<any>;

  exchangeJobOrgsDetailVisibleSubscription: Subscription;
  exchangeJobComparisonGridStateSubscription: Subscription;

  exchangeJobComparisonGridState: State;

  selectedKeys: number[] = [];

  constructor(
    private store: Store<fromDashboardReducer.State>
  ) {
    this.loadingExchangeJobComparisons$ = this.store.pipe(select(fromDashboardReducer.getExchangeJobComparisonsLoading));
    this.loadingExchangeJobComparisonsError$ = this.store.pipe(select(fromDashboardReducer.getExchangeJobComparisonsLoadingError));
    this.exchangeJobComparisonsGridData$ = this.store.pipe(select(fromDashboardReducer.getExchangeJobComparisonsGridData));
    this.exchangeJobComparisonsGridState$ = this.store.pipe(select(fromDashboardReducer.getExchangeJobComparisonsGridState));
    this.exchangeJobOrgsDetailVisible$ = this.store.pipe(select(fromDashboardReducer.getExchangeDashboardExchangeJobOrgsDetailVisible));
    this.companyContext$ = this.store.pipe(select(fromRootState.getCompanyContext));
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

  onSelectionChange(e: SelectionEvent) {
    const selection = e.selectedRows[0];
    if (!selection) {
      return;
    }

    const selectedExchangeJobComparison: ExchangeJobComparison = selection.dataItem;
    this.store.dispatch(new fromExchangeDashboardActions.LoadExchangeJobOrgs(selectedExchangeJobComparison));
  }

  openUploadOrgDataModal() {
    this.store.dispatch(new fromUploadOrgDataActions.OpenUploadOrgDataModal());
  }

  // Lifecycle
  ngOnInit() {
    this.exchangeJobComparisonGridStateSubscription = this.exchangeJobComparisonsGridState$.subscribe(gridState => {
      this.exchangeJobComparisonGridState = cloneDeep(gridState);
    });

    this.exchangeJobOrgsDetailVisibleSubscription = this.exchangeJobOrgsDetailVisible$.subscribe(ct => {
      if (!ct) {
        this.selectedKeys = [];
      }
    });
  }

  ngOnDestroy() {
    this.exchangeJobComparisonGridStateSubscription.unsubscribe();
    this.exchangeJobOrgsDetailVisibleSubscription.unsubscribe();
  }
}
