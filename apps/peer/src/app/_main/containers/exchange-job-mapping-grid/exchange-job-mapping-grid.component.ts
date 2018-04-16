import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { GridDataResult, PageChangeEvent, RowClassArgs } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';

import { GridTypeEnum, ExchangeJobMapping} from 'libs/models';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromExchangeJobMappingGridActions from '../../actions/exchange-job-mapping-grid.actions';
import * as fromPeerMainReducer from '../../reducers';
import { ExchangeJobMappingService } from '../../services';

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

  constructor(
    private store: Store<fromPeerMainReducer.State>,
    private exchangeJobMappingService: ExchangeJobMappingService
  ) {
    this.loadingExchangeJobMappings$ = this.store.select(fromPeerMainReducer.getExchangeJobMappingsLoading);
    this.loadingExchangeJobMappingsError$ = this.store.select(fromPeerMainReducer.getExchangeJobMappingsLoadingError);
    this.exchangeJobMappingsGridData$ = this.store.select(fromPeerMainReducer.getExchangeJobMappingsGridData);
    this.exchangeJobMappingsGridState$ = this.store.select(fromPeerMainReducer.getExchangeJobMappingsGridState);
    this.selectedExchangeJobMapping$ = this.store.select(fromPeerMainReducer.getSelectedExchangeJobMapping);
  }

  // Grid
  handlePageChanged(event: PageChangeEvent): void {
    this.store.dispatch(new fromGridActions.PageChange(GridTypeEnum.ExchangeJobMapping, event));
    this.exchangeJobMappingService.loadExchangeJobMappings(this.exchangeId);
  }

  handleSortChanged(sort: SortDescriptor[]): void {
    this.store.dispatch(new fromGridActions.SortChange(GridTypeEnum.ExchangeJobMapping, sort));
    this.exchangeJobMappingService.loadExchangeJobMappings(this.exchangeId);
  }

  rowClass(context: RowClassArgs): string {
    return context.dataItem.PendingRequest ? 'row-disabled' : '';
  }

  handleSelectionChange(context: any) {
    // If the selected row is a pending request, revert selection.
    // This is kind of a "hacky" work-around, but the best that I could come up with. [JP]
    const invalidSelectionIndex = context.selectedRows.findIndex(
      sr => sr.index === context.index && sr.dataItem.PendingRequest
    );
    if (invalidSelectionIndex > -1) {
      context.selectedRows = context.deselectedRows;
    }
  }

  // CellClickEvent Interface is missing dataItem. Defining type as any to avoid error
  handleCellClick(event: any) {
    if (event.dataItem.PendingRequest === true) {
      return;
    }
    const pageRowIndex = event.rowIndex - this.exchangeJobMappingGridState.skip;
    this.store.dispatch(new fromExchangeJobMappingGridActions.SelectExchangeJobMapping(event.dataItem));
    this.store.dispatch(new fromExchangeJobMappingGridActions.UpdatePageRowIndexToScrollTo(pageRowIndex));
  }

  // Lifecycle
  ngOnInit() {
    this.exchangeJobMappingService.loadExchangeJobMappings(this.exchangeId);

    this.exchangeJobMappingGridStateSubscription = this.exchangeJobMappingsGridState$.subscribe(gridState => {
      this.exchangeJobMappingGridState = gridState;
    });
  }

  ngOnDestroy() {
    this.exchangeJobMappingGridStateSubscription.unsubscribe();
  }
}
