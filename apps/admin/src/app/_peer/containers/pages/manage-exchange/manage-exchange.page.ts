import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Exchange } from 'libs/models/peer';
import * as fromExchangeCompaniesActions from '../../../actions/exchange-companies.actions';
import * as fromImportExchangeJobsActions from '../../../actions/import-exchange-jobs.actions';
import * as fromPeerAdminReducer from '../../../reducers';
import * as fromAvailableJobsActions from '../../../actions/available-jobs.actions';

@Component({
  selector: 'pf-manage-exchange-page',
  templateUrl: './manage-exchange.page.html',
  styleUrls: ['./manage-exchange.page.scss']
})
export class ManageExchangePageComponent {
  importExchangeJobsModalOpen$: Observable<boolean>;
  exchange$: Observable<Exchange>;

  constructor(private store: Store<fromPeerAdminReducer.State>) {
    this.exchange$ = this.store.select(fromPeerAdminReducer.getManageExchange);
    this.importExchangeJobsModalOpen$ = this.store.select(fromPeerAdminReducer.getImportExchangeJobsModalOpen);
  }

  openImportExchangeJobsModal() {
    this.store.dispatch(new fromImportExchangeJobsActions.OpeningImportExchangeJobsModal());
  }

  openAddExchangeCompaniesModal(): void {
    this.store.dispatch(new fromExchangeCompaniesActions.OpenAddExchangeCompaniesModal());
  }

  handleImportExchangeJobs() {
    this.store.dispatch(new fromImportExchangeJobsActions.ClosingImportExchangeJobsModal());
    // TODO: Dispatch load jobs action in next item.
  }

  // TODO: This should be on the exchange-jobs container instead
  openAddExchangeJobsModal(): void {
    this.store.dispatch(new fromAvailableJobsActions.OpenAddExchangeJobsModal);
  }

  handleImportExchangeJobsModalDismissed() {
    this.store.dispatch(new fromImportExchangeJobsActions.ClosingImportExchangeJobsModal());
  }
}
