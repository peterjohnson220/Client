import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Exchange } from 'libs/models/peer';

import * as fromExchangeCompaniesActions from '../../../actions/exchange-companies.actions';
import * as fromImportExchangeJobsActions from '../../../actions/import-exchange-jobs.actions';
import * as fromExchangeJobsActions from '../../../actions/exchange-jobs.actions';
import * as fromPeerAdminReducer from '../../../reducers';

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

  openAddExchangeJobsModal(): void {
    this.store.dispatch(new fromExchangeJobsActions.OpenAddExchangeJobsModal);
  }

  handleImportExchangeJobsModalDismissed() {
    this.store.dispatch(new fromImportExchangeJobsActions.ClosingImportExchangeJobsModal());
  }
}
