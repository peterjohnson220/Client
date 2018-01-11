import { Component, OnInit, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';

import { GridTypeEnum } from 'libs/models/common';
import * as fromGridActions from 'libs/common/core/actions/grid.actions';

import * as fromPeerMainReducer from '../../reducers';
import { ExchangeJobMappingService } from '../../services';

@Component({
  selector: 'pf-exchange-job-mapping-grid',
  templateUrl: './exchange-job-mapping-grid.component.html',
  styleUrls: ['./exchange-job-mapping-grid.component.scss']
})
export class ExchangeJobMappingGridComponent implements OnInit {
  @Input() exchangeId: number;

  loadingExchangeJobMappings$: Observable<boolean>;
  loadingExchangeJobMappingsError$: Observable<boolean>;
  exchangeJobMappingsGridData$: Observable<GridDataResult>;
  exchangeJobMappingsGridState$: Observable<State>;

  constructor(
    private store: Store<fromPeerMainReducer.State>,
    private exchangeJobMappingService: ExchangeJobMappingService
  ) {
    this.loadingExchangeJobMappings$ = this.store.select(fromPeerMainReducer.getExchangeJobMappingsLoading);
    this.loadingExchangeJobMappingsError$ = this.store.select(fromPeerMainReducer.getExchangeJobMappingsLoadingError);
    this.exchangeJobMappingsGridData$ = this.store.select(fromPeerMainReducer.getExchangeJobMappingsGridData);
    this.exchangeJobMappingsGridState$ = this.store.select(fromPeerMainReducer.getExchangeJobMappingsGridState);
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

  // Lifecycle
  ngOnInit() {
    this.exchangeJobMappingService.loadExchangeJobMappings(this.exchangeId);
  }
}
