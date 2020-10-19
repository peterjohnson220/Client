import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { GridDataResult, RowClassArgs, DataStateChangeEvent, SelectionEvent, FilterService } from '@progress/kendo-angular-grid';
import { State, CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';

import { GridTypeEnum, ExchangeJobMapping } from 'libs/models';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromExchangeJobMappingGridActions from '../../actions/exchange-job-mapping-grid.actions';
import * as fromPeerManagementReducer from '../../reducers';

import cloneDeep from 'lodash/cloneDeep';

import * as companyJobsActions from '../../actions/company-jobs.actions';
import * as companyJobsReducer from '../../reducers';

@Component({
  selector: 'pf-exchange-job-mapping-grid',
  templateUrl: './exchange-job-mapping-grid.component.html',
  styleUrls: ['./exchange-job-mapping-grid.component.scss']
})
export class ExchangeJobMappingGridComponent implements OnInit, OnDestroy {
  @Input() disableScrollTo: boolean;
  @Input() pageRowIndexToScrollTo: number;

  loadingExchangeJobMappings$: Observable<boolean>;
  loadingExchangeJobMappingsError$: Observable<boolean>;
  exchangeJobMappingsGridData$: Observable<GridDataResult>;
  exchangeJobMappingsGridState$: Observable<State>;
  selectedExchangeJobMapping$: Observable<ExchangeJobMapping>;

  statusFilterOptions: any[] = [
    {StatusName: 'Matched', StatusId: 'matched'},
    {StatusName: 'Not Matched', StatusId: 'not-matched'},
    {StatusName: 'New', StatusId: 'new'}];
  selectedStatusFilterOption: any;

  allSubscriptions: Subscription = new Subscription();

  exchangeJobMappingGridState: State;
  gridFilter: CompositeFilterDescriptor;
  associationData: any;
  pendingStatusData: any;
  exchangeId: number;

  constructor(private store: Store<fromPeerManagementReducer.State>) {}

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

    this.store.dispatch(new companyJobsActions.SetMappedExchangeJobs(event.dataItem));
  }

  isNew(dataItem: ExchangeJobMapping) {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() - 91);
    return !(new Date(dataItem.ExchangeJobCreateDate) < newDate);
  }

  onStatusFilterChange(value: any, filterService: FilterService): void {
    filterService.filter({
      filters: [{ field: 'StatusId', operator: 'eq', value: value }],
      logic: 'and'
    });
  }

  clearSelectedStatusFilter(): void {
    const statusIdFilter: any = this.gridFilter.filters.find((f: FilterDescriptor) => f.field === 'StatusId');
    if (!statusIdFilter) {
      this.selectedStatusFilterOption = null;
    } else if (statusIdFilter.value !== this.selectedStatusFilterOption) {
      this.selectedStatusFilterOption = statusIdFilter.value;
    }
  }

  // Lifecycle
  ngOnInit() {
    this.loadingExchangeJobMappings$ = this.store.select(fromPeerManagementReducer.getExchangeJobMappingsLoading);
    this.loadingExchangeJobMappingsError$ = this.store.select(fromPeerManagementReducer.getExchangeJobMappingsLoadingError);
    this.exchangeJobMappingsGridData$ = this.store.select(fromPeerManagementReducer.getExchangeJobMappingsGridData);
    this.exchangeJobMappingsGridState$ = this.store.select(fromPeerManagementReducer.getExchangeJobMappingsGridState);
    this.selectedExchangeJobMapping$ = this.store.select(fromPeerManagementReducer.getSelectedExchangeJobMapping);

    this.allSubscriptions.add(this.exchangeJobMappingsGridState$.subscribe(gridState => {
      this.exchangeJobMappingGridState = cloneDeep(gridState);
      this.gridFilter = gridState.filter;
      this.clearSelectedStatusFilter();
    }));

    this.allSubscriptions.add(this.store.pipe(select(companyJobsReducer.getCompanyJobsExchangeId)).subscribe(exchangeId => {
      this.exchangeId = exchangeId;
    }));

    this.store.dispatch(new fromExchangeJobMappingGridActions.LoadExchangeJobMappings());
  }

  ngOnDestroy() {
    this.allSubscriptions.unsubscribe();
  }
}
