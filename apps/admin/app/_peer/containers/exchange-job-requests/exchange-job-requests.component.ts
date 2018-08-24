import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeJobRequest } from 'libs/models/peer';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromExchangeJobRequestsActions from '../../actions/exchange-job-requests.actions';

@Component({
  selector: 'pf-exchange-job-requests',
  templateUrl: './exchange-job-requests.component.html',
  styleUrls: ['./exchange-job-requests.component.scss']
})

export class ExchangeJobRequestsComponent {
  exchangeJobRequestsLoading$: Observable<boolean>;
  exchangeJobRequestsLoadingError$: Observable<boolean>;
  exchangeJobRequestsGrid$: Observable<GridDataResult>;
  selectedJobRequest: ExchangeJobRequest;
  exchangeId: number;
  collapse = false;
  pageRowIndex: number = null;

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private route: ActivatedRoute
  ) {
    this.exchangeJobRequestsLoading$ = this.store.select(fromPeerAdminReducer.getExchangeJobRequestsLoading);
    this.exchangeJobRequestsLoadingError$ = this.store.select(fromPeerAdminReducer.getExchangeJobRequestsLoadingError);
    this.exchangeJobRequestsGrid$ = this.store.select(fromPeerAdminReducer.getExchangeJobRequestsGrid);

    this.exchangeId = this.route.snapshot.parent.params.id;
  }

  // Events
  handleExchangeJobRequestsGridReload() {
    this.store.dispatch(new fromExchangeJobRequestsActions.LoadExchangeJobRequests(this.exchangeId));
  }

  handleCellClick(event: any) {
    if (!this.collapse) { this.collapse = true; }
    this.selectedJobRequest = event.dataItem;
    this.pageRowIndex = event.rowIndex;
  }

  handleCloseRequestInfo() {
    this.collapse = false;
    this.pageRowIndex = null;
  }
}
