import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';

import { GridTypeEnum, ExchangeJobMapping} from 'libs/models';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromExchangeJobMappingActions from '../../actions/exchange-job-mapping.actions';
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
  @Output() rowSelected = new EventEmitter();

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

  // CellClickEvent Interface is missing dataItem. Defining type as any to avoid error
  handleCellClick(event: any) {
    const pageRowIndex = event.rowIndex - this.exchangeJobMappingGridState.skip;
    this.store.dispatch(new fromExchangeJobMappingActions.SelectExchangeJobMapping(event.dataItem));
    this.store.dispatch(new fromExchangeJobMappingActions.UpdatePageRowIndexToScrollTo(pageRowIndex));
    this.rowSelected.emit();
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
