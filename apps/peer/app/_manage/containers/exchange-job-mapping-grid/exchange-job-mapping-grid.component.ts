import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { GridDataResult, RowClassArgs, DataStateChangeEvent, SelectionEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';

import { GridTypeEnum, ExchangeJobMapping } from 'libs/models';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromExchangeJobMappingGridActions from '../../actions/exchange-job-mapping-grid.actions';
import * as fromExchangeJobMappingInfoActions from '../../actions/exchange-job-mapping-info.actions';
import * as fromPeerManagementReducer from '../../reducers';
import { ExchangeJobMappingService } from '../../services';
import { associationPending, associationStatus } from './exchange-job-mapping-grid-data-map';

import * as cloneDeep from 'lodash.clonedeep';

@Component({
  selector: 'pf-exchange-job-mapping-grid',
  templateUrl: './exchange-job-mapping-grid.component.html',
  styleUrls: ['./exchange-job-mapping-grid.component.scss']
})
export class ExchangeJobMappingGridComponent implements OnInit, OnDestroy {
  @Input() exchangeId: number;
  @Input() disableScrollTo: boolean;
  @Input() pageRowIndexToScrollTo: number;

  loadingExchangeJobMappings$: Observable<boolean>;
  loadingExchangeJobMappingsError$: Observable<boolean>;
  exchangeJobMappingsGridData$: Observable<GridDataResult>;
  exchangeJobMappingsGridState$: Observable<State>;
  selectedExchangeJobMapping$: Observable<ExchangeJobMapping>;
  exchangeJobMappingGridStateSubscription: Subscription;
  exchangeJobMappingGridState: State;
  associationData: any;
  pendingStatusData: any;

  constructor(
    private store: Store<fromPeerManagementReducer.State>
  ) {
    this.loadingExchangeJobMappings$ = this.store.select(fromPeerManagementReducer.getExchangeJobMappingsLoading);
    this.loadingExchangeJobMappingsError$ = this.store.select(fromPeerManagementReducer.getExchangeJobMappingsLoadingError);
    this.exchangeJobMappingsGridData$ = this.store.select(fromPeerManagementReducer.getExchangeJobMappingsGridData);
    this.exchangeJobMappingsGridState$ = this.store.select(fromPeerManagementReducer.getExchangeJobMappingsGridState);
    this.selectedExchangeJobMapping$ = this.store.select(fromPeerManagementReducer.getSelectedExchangeJobMapping);
  }

  onDataStateChange(state: DataStateChangeEvent): void {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.ExchangeJobMapping, state));
    this.store.dispatch(new fromExchangeJobMappingGridActions.LoadExchangeJobMappings());
  }

  rowClass(context: RowClassArgs): string {
    return context.dataItem.PendingRequest ? 'row-disabled' : '';
  }

  onSelectionChange(context: SelectionEvent) {
    // If the selected row is a pending request, revert selection.
    // This is kind of a "hacky" work-around, but the best that I could come up with. [JP]
    const invalidSelectionIndex = context.selectedRows.findIndex(
      sr => sr.dataItem.PendingRequest
    );
    if (invalidSelectionIndex > -1) {
      context.selectedRows = context.deselectedRows;
    }
  }

  // CellClickEvent Interface is missing dataItem. Defining type as any to avoid error
  onCellClick(event: any) {
    if (event.dataItem && event.dataItem.PendingRequest === true) {
      return;
    }
    const pageRowIndex = event.rowIndex - this.exchangeJobMappingGridState.skip;
    this.store.dispatch(new fromExchangeJobMappingGridActions.SetActiveExchangeJob(event.dataItem));
    this.store.dispatch(new fromExchangeJobMappingGridActions.UpdatePageRowIndexToScrollTo(pageRowIndex));
  }

  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromExchangeJobMappingGridActions.LoadExchangeJobMappings());

    this.associationData = associationStatus;
    this.pendingStatusData = associationPending;

    this.exchangeJobMappingGridStateSubscription = this.exchangeJobMappingsGridState$.subscribe(gridState => {
      this.exchangeJobMappingGridState = cloneDeep(gridState);
    });
  }

  ngOnDestroy() {
    this.exchangeJobMappingGridStateSubscription.unsubscribe();
  }
}
