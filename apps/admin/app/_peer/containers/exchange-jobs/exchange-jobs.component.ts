import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';

import { GridTypeEnum, ExchangeJob } from 'libs/models';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import { GridHelperService } from '../../services';
import * as fromPeerAdminReducer from '../../reducers';
import * as fromExchangeJobsActions from '../../actions/exchange-jobs.actions';
import * as fromImportExchangeJobsActions from '../../actions/import-exchange-jobs.actions';

@Component({
  selector: 'pf-exchange-jobs',
  templateUrl: './exchange-jobs.component.html',
  styleUrls: ['./exchange-jobs.component.scss']
})
export class ExchangeJobsComponent {
  importExchangeJobsModalOpen$: Observable<boolean>;
  exchangeJobsLoading$: Observable<boolean>;
  exchangeJobsLoadingError$: Observable<boolean>;
  exchangeJobs$: Observable<ExchangeJob[]>;
  exchangeJobsGrid$: Observable<GridDataResult>;
  gridState$: Observable<State>;
  exchangeId: number;

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private route: ActivatedRoute,
    private gridHelperService: GridHelperService,
  ) {
    this.importExchangeJobsModalOpen$ = this.store.select(fromPeerAdminReducer.getImportExchangeJobsModalOpen);
    this.exchangeJobsLoading$ = this.store.select(fromPeerAdminReducer.getExchangeJobsLoading);
    this.exchangeJobsLoadingError$ = this.store.select(fromPeerAdminReducer.getExchangeJobsLoadingError);
    this.exchangeJobs$ = this.store.select(fromPeerAdminReducer.getExchangeJobs);
    this.exchangeJobsGrid$ = this.store.select(fromPeerAdminReducer.getExchangeJobsGrid);
    this.gridState$ = this.store.select(fromPeerAdminReducer.getExchangeJobsGridState);

    this.exchangeId = this.route.snapshot.parent.params.id;
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

  openImportExchangeJobsModal() {
    this.store.dispatch(new fromImportExchangeJobsActions.OpeningImportExchangeJobsModal());
  }

  handleImportExchangeJobsModalDismissed() {
    this.store.dispatch(new fromImportExchangeJobsActions.ClosingImportExchangeJobsModal());
  }

  handleImportExchangeJobs() {
    this.store.dispatch(new fromImportExchangeJobsActions.ClosingImportExchangeJobsModal());
    // TODO: Dispatch load jobs action in next item.
  }

  openAddExchangeJobsModal(): void {
    this.store.dispatch(new fromExchangeJobsActions.OpenAddExchangeJobsModal);
  }
}
