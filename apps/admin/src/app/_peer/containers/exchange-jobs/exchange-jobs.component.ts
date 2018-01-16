import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';

import { GridTypeEnum, ExchangeJob } from 'libs/models';
import * as fromGridActions from 'libs/common/core/actions/grid.actions';

import { GridHelperService } from '../../services';
import * as fromPeerAdminReducer from '../../reducers';
import * as fromExchangeJobsActions from '../../actions/exchange-jobs.actions';

@Component({
  selector: 'pf-exchange-jobs',
  templateUrl: './exchange-jobs.component.html',
  styleUrls: ['./exchange-jobs.component.scss']
})
export class ExchangeJobsComponent implements OnInit {
  exchangeJobsLoading$: Observable<boolean>;
  exchangeJobsLoadingError$: Observable<boolean>;
  exchangeJobs$: Observable<ExchangeJob[]>;
  view$: Observable<GridDataResult>;
  gridState$: Observable<State>;
  exchangeId: number;

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private route: ActivatedRoute,
    private gridHelperService: GridHelperService,
  ) {
    this.exchangeJobsLoading$ = this.store.select(fromPeerAdminReducer.getExchangeJobsLoading);
    this.exchangeJobsLoadingError$ = this.store.select(fromPeerAdminReducer.getExchangeJobsLoadingError);
    this.exchangeJobs$ = this.store.select(fromPeerAdminReducer.getExchangeJobs);
    this.view$ = this.store.select(fromPeerAdminReducer.getExchangeJobsGrid);
    this.gridState$ = this.store.select(fromPeerAdminReducer.getExchangeJobsGridState);

    this.exchangeId = this.route.snapshot.params.id;
  }

  // Events
  handleExchangeJobsGridReload() {
    this.store.dispatch(new fromExchangeJobsActions.LoadingExchangeJobs(this.exchangeId));
  }

  handlePageChange(event: PageChangeEvent): void {
    this.store.dispatch(new fromGridActions.PageChange(GridTypeEnum.ExchangeJobs, event));
    this.gridHelperService.loadExchangeJobs(this.exchangeId);
  }

  handleSortChange(sort: SortDescriptor[]) {
    this.store.dispatch(new fromGridActions.SortChange(GridTypeEnum.ExchangeJobs, sort));
    this.gridHelperService.loadExchangeJobs(this.exchangeId);
  }

  // Lifecycle
  ngOnInit() {
    this.gridHelperService.loadExchangeJobs(this.exchangeId);
  }
}
